
import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { topic, language, count } = await req.json();
    // Fix: Always use direct process.env.API_KEY initialization as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate ${count} coding missions about "${topic}" in ${language}. 
                 Each mission should have a title, description, starter code, a brief solution hint, and a points value.
                 Difficulty must be one of: Easy, Medium, Hard, or Challenging. 
                 Suggested points: Easy=100, Medium=250, Hard=500, Challenging=1000.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              starterCode: { type: Type.STRING },
              solutionHint: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              points: { type: Type.NUMBER }
            },
            required: ["title", "description", "starterCode", "solutionHint", "difficulty", "points"]
          }
        }
      }
    });

    const missions = JSON.parse(response.text || '[]');
    const taggedMissions = missions.map((q: any) => ({
      ...q,
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    }));

    return new Response(JSON.stringify(taggedMissions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
