
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ProgrammingLanguage, Question, AIResponse } from '../types';

// Use process.env.API_KEY directly as required by guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMissions = async (
  topic: string, 
  language: ProgrammingLanguage, 
  count: number = 3
): Promise<Question[]> => {
  const response: GenerateContentResponse = await ai.models.generateContent({
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

  const rawJson = response.text || '[]';
  try {
    const parsed = JSON.parse(rawJson);
    return parsed.map((q: any) => ({
      ...q,
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    }));
  } catch (error) {
    console.error("AI Mission Generation Error:", error);
    return [];
  }
};

export const evaluateCodeStream = async (
  language: ProgrammingLanguage,
  problemDescription: string,
  submittedCode: string
) => {
  const response = await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: `You are an expert ${language} tutor. Evaluate the following code submission.
               
               PROBLEM: ${problemDescription}
               
               SUBMITTED CODE:
               \`\`\`${language.toLowerCase()}
               ${submittedCode}
               \`\`\`
               
               INSTRUCTION:
               1. Provide conversational feedback and 2-3 specific suggestions for improvement.
               2. At the very end of your response, include the diagnostic result in JSON format between [DATA] and [/DATA] tags.
               
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

  return response;
};
