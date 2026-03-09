import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateHealingQuote(chatLog: { role: string; text: string }[]) {
  const conversation = chatLog.map(entry => `${entry.role}: ${entry.text}`).join('\n');
  
  const prompt = `
You are a compassionate, wise, and tranquil entity in the cosmic void.
The user has just had a journaling session (self-talk) with a "star" representing an emotion.
Here is their conversation:
${conversation}

Based on this conversation, provide a comforting, healing quote or message.
It MUST begin exactly with: "the void has taken your worry away. And it wishes to warm your heart by this: "
It MUST NOT exceed 3 sentences in total (including the starting phrase).
Keep it poetic, gentle, and related to their specific worries or thoughts expressed in the log.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });
    return response.text || "the void has taken your worry away. And it wishes to warm your heart by this: You are safe, and your journey continues.";
  } catch (error) {
    console.error("Error generating quote:", error);
    return "the void has taken your worry away. And it wishes to warm your heart by this: Even in the darkest void, your light shines bright. Rest now, for tomorrow is a new dawn.";
  }
}
