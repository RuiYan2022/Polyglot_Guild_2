
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { language, problemDescription, submittedCode } = await req.json();
    // Fix: Always use direct process.env.API_KEY initialization as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const streamResponse = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert ${language} tutor. Evaluate the following code submission.
                 
                 PROBLEM: ${problemDescription}
                 
                 SUBMITTED CODE:
                 \`\`\`${language.toLowerCase()}
                 ${submittedCode}
                 \`\`\`
                 
                 INSTRUCTION:
                 1. If the code is CORRECT and solves the problem optimally:
                    - Be extremely brief. Just confirm it's correct (e.g., "Logic verified. Great job!").
                 2. If the code is INCORRECT or has logic errors:
                    - Provide detailed conversational feedback and 2-3 specific suggestions for improvement.
                 3. At the very end of your response, include the diagnostic result in JSON format between [DATA] and [/DATA] tags.
                 
                 JSON SCHEMA:
                 {
                   "success": boolean,
                   "score": number,
                   "feedback": string,
                   "suggestions": string[]
                 }`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    // Create a TransformStream to forward the chunks
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Fire and forget the streaming process
    (async () => {
      try {
        for await (const chunk of streamResponse) {
          if (chunk.text) {
            await writer.write(encoder.encode(chunk.text));
          }
        }
      } catch (err) {
        console.error("Streaming error inside Edge Runtime:", err);
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    console.error("Edge Function Error:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
