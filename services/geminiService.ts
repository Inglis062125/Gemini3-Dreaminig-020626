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
    // --- Original 5 ---
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

    // --- New 5 WOW Features ---
    case 'muse-whisper':
      systemInstruction += " Task: You are a creative muse. Based on the user's input, generate 3 innovative, unconventional, and artistic business ideas or creative concepts.";
      break;

    case 'strategic-oracle':
      systemInstruction += " Task: Perform a SWOT analysis but phrased as a prophetic revelation. Also return data for a Radar Chart (Strengths, Weaknesses, Opportunities, Threats) with values 0-100.";
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          data: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Category (Strengths, etc)" },
                value: { type: Type.NUMBER, description: "Magnitude 0-100" },
                fullMark: { type: Type.NUMBER, description: "Always 100" }
              }
            }
          }
        }
      };
      break;

    case 'tone-alchemist':
      systemInstruction += " Task: Rewrite the input text in 3 distinct tones: 1) Diplomatic/Courtly, 2) Aggressive/Passionate, 3) Abstract/Poetic. Label them clearly.";
      break;

    case 'ethical-mirror':
      systemInstruction += " Task: Analyze the text for bias, inclusivity, and ethical risks. Return a critique and a 'Risk Level' score (0-100) for a gauge chart.";
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          data: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Risk Category" },
                value: { type: Type.NUMBER, description: "Risk Score 0-100" },
                fill: { type: Type.STRING, description: "Color hex code suggestions" }
              }
            }
          }
        }
      };
      break;

    case 'time-capsule':
      systemInstruction += " Task: Re-contextualize the modern text as if it were written during the painter's active years. Use appropriate technology terms (e.g., replace 'email' with 'telegram' or 'letter', 'server' with 'archive').";
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
        try {
          const parsed = JSON.parse(resultText);
          return { text: parsed.analysis || "Data generated successfully.", data: parsed.data };
        } catch (e) {
          return { text: resultText }; // Fallback if JSON parse fails
        }
    }

    return { text: resultText };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "The AI Muse is currently taking a coffee break. Please check your API Key." };
  }
};
