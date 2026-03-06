import { GoogleGenAI } from "@google/genai";

export const getAIClient = () => {
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable");
  }
  return new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
};
