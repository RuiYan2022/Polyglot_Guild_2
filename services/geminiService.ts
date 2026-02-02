
<<<<<<< HEAD
import { GoogleGenAI, Type } from "@google/genai";
import { ProgrammingLanguage, Question } from '../types';

/**
 * MISSION GENERATION
 * Uses direct SDK for all environments.
 */
=======
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ProgrammingLanguage, Question, AIResponse } from '../types';

// Use process.env.API_KEY directly as required by guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

>>>>>>> 0b6886b30f42ba84b6a79e344ab28656f0d46a20
export const generateMissions = async (
  topic: string, 
  language: ProgrammingLanguage, 
  count: number = 3
): Promise<Question[]> => {
<<<<<<< HEAD
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const result = await ai.models.generateContent({
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

    const missions = JSON.parse(result.text || '[]');
    return missions.map((q: any) => ({
=======
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
>>>>>>> 0b6886b30f42ba84b6a79e344ab28656f0d46a20
      ...q,
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    }));
  } catch (error) {
<<<<<<< HEAD
    console.error("SDK Mission Generation Error:", error);
=======
    console.error("AI Mission Generation Error:", error);
>>>>>>> 0b6886b30f42ba84b6a79e344ab28656f0d46a20
    return [];
  }
};

<<<<<<< HEAD
/**
 * CODE EVALUATION STREAM
 * Uses direct SDK for all environments.
 */
export const evaluateCodeStream = async function* (
  language: ProgrammingLanguage,
  problemDescription: string,
  submittedCode: string
) {
  try {
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

    for await (const chunk of streamResponse) {
      if (chunk.text) {
        yield { text: chunk.text };
      }
    }
  } catch (error) {
    console.error("SDK Stream Evaluation Error:", error);
    yield { text: "Error: Could not connect to the AI engine." };
  }
=======
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
>>>>>>> 0b6886b30f42ba84b6a79e344ab28656f0d46a20
};
