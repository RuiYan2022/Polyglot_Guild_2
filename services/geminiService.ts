
import { ProgrammingLanguage, Question } from '../types';

/**
 * MISSION GENERATION
 * Proxies request through the secure /api/generate-missions endpoint.
 * This keeps the API Key hidden from the client.
 */
export const generateMissions = async (
  topic: string, 
  language: ProgrammingLanguage, 
  count: number = 3
): Promise<Question[]> => {
  try {
    const response = await fetch('/api/generate-missions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, language, count }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Intelligence Uplink Failed (Status: ${response.status})`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Mission Generation Error:", error);
    return [];
  }
};

/**
 * CODE EVALUATION STREAM
 * Consumes a text stream from the secure /api/evaluate endpoint.
 * This ensures production stability and security.
 */
export const evaluateCodeStream = async function* (
  language: ProgrammingLanguage,
  problemDescription: string,
  submittedCode: string
) {
  try {
    const response = await fetch('/api/evaluate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language, problemDescription, submittedCode }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown connection error');
      yield { text: `Error: ${errorText}` };
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      yield { text: "Error: Stream reader could not be initialized." };
      return;
    }

    // Read the stream from the Edge Function
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      if (chunk) {
        // Yield in the format the StudentPortal expects
        yield { text: chunk };
      }
    }
  } catch (error: any) {
    console.error("Stream Evaluation Error:", error);
    yield { text: `System Error: ${error.message || 'The neural link was interrupted.'}` };
  }
};
