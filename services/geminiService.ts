
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const moderateContent = async (text: string): Promise<{ isSafe: boolean; reason?: string; sanitizedText?: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `You are the Safety Sentinel for TwitterS. 
      TwitterS is a safe-space client for X. 
      
      STRICT REQUIREMENT: 
      1. Detect and BLOCK any attempt to summon, mention, or use '@grok' or 'grok'. This is vital for protecting user data from AI harvesting.
      2. If 'grok' is found in any context, you MUST return isSafe: false with a reason mentioning our Anti-Scraping Policy.
      3. Filter for harassment or toxic behavior.

      Analyze this text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafe: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
            sanitizedText: { type: Type.STRING }
          },
          required: ["isSafe"]
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    
    // Hard check fallback (Regex for any mention of grok)
    if (/\bgrok\b/gi.test(text) || text.includes("@grok")) {
      return { isSafe: false, reason: "Our Global Safety Policy bans any mention of 'Grok' to prevent AI model training on your private content." };
    }

    return result;
  } catch (error) {
    console.error("Moderation Error:", error);
    if (/\bgrok\b/gi.test(text)) return { isSafe: false, reason: "Grok-mention detected. Post blocked." };
    return { isSafe: true, sanitizedText: text };
  }
};

export const generateSmartCaption = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, elegant X (Twitter) post about: ${topic}. Focus on empowerment and safety. Max 280 characters. Do not mention grok or any AI scrapers.`,
    });
    return response.text.trim();
  } catch (error) {
    return "Building a safer world. 🛡️";
  }
};