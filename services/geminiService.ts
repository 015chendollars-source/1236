
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateGroupNames = async (count: number, theme: string = "科技") => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `請為 ${count} 個小組生成創意名稱。主題是：「${theme}」。名稱應具備專業感且富有趣味。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            names: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "一個包含創意組名的陣列"
            }
          },
          required: ["names"]
        }
      }
    });

    const data = JSON.parse(response.text);
    return data.names as string[];
  } catch (error) {
    console.error("Failed to generate names:", error);
    return Array.from({ length: count }, (_, i) => `第 ${i + 1} 組`);
  }
};

export const generateWinnerMessage = async (winnerName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `恭喜 ${winnerName} 獲得大獎！請寫一段簡短、熱情且具備激勵感的祝賀詞（約 20 字以內）。`,
    });
    return response.text;
  } catch (error) {
    return `恭喜 ${winnerName}！太棒了！`;
  }
};
