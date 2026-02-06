import { GoogleGenAI, Type } from "@google/genai";
import { AIFeatureType, ChartDataPoint } from "../types";

// Helper to get client (safe initialization)
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in environment variables.");
    throw new Error("API_KEY is required.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateArtisticResponse = async (
  feature: AIFeatureType, 
  prompt: string, 
  painterStyle: string
): Promise<{ text: string; data?: ChartDataPoint[] }> => {
  const ai = getAiClient();
  const model = 'gemini-3-flash-preview';

  let systemInstruction = `You are an advanced AI integrated into an Enterprise Dashboard. 
  The user has selected the artistic style of ${painterStyle}. 
  Your output should reflect the philosophy, vocabulary, and tone of this painter, 
  while still performing the requested enterprise task.`;

  let finalPrompt = prompt;
  let responseSchema = undefined;

  switch (feature) {
    case 'dream-summarizer':
      systemInstruction += " Task: Summarize the following document text. Output the summary as if it were a manifesto or a letter written by the painter describing the content.";
      break;
    
    case 'sentiment-symphony':
      systemInstruction += " Task: Analyze the sentiment of the text. Return a JSON array of data points representing the emotional arc (0-100) suitable for a chart.";
      finalPrompt = `Analyze sentiment for: ${prompt}`;
       responseSchema =  {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING, description: "Artistic description of the sentiment" },
          data: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.NUMBER },
                sentiment: { type: Type.NUMBER }
              }
            }
          }
        }
      };
      break;

    case 'predictive-sculpture':
      systemInstruction += " Task: Predict future trends based on this context. Return JSON data for a 3D-like visualization (value vs prediction).";
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          data: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.NUMBER },
                prediction: { type: Type.NUMBER }
              }
            }
          }
        }
      };
      break;

    case 'polyglot-synthesis':
      systemInstruction += " Task: Translate the text into Traditional Chinese (if English) or English (if Chinese), but adapt the style/idioms to match the painter's era or artistic movement.";
      break;

    case 'smart-redaction':
      systemInstruction += " Task: Identify sensitive info (names, dates, money) in the text. Return a version where sensitive info is replaced NOT by black bars, but by artistic descriptions enclosed in brackets (e.g., [A Blue Flower], [A Melting Clock]).";
      break;
  }

  try {
    const config: any = {
      systemInstruction,
    };

    if (responseSchema) {
      config.responseMimeType = "application/json";
      config.responseSchema = responseSchema;
    }

    const response = await ai.models.generateContent({
      model,
      contents: finalPrompt,
      config
    });

    const resultText = response.text || "No response generated.";

    if (responseSchema) {
        const parsed = JSON.parse(resultText);
        return { text: parsed.analysis || "Data generated successfully.", data: parsed.data };
    }

    return { text: resultText };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "The AI Muse is currently taking a coffee break. Please check your API Key." };
  }
};
