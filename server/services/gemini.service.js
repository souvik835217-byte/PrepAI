import { GoogleGenAI } from "@google/genai";
import { generateContentWithRetry } from "./geminiRetry.js";

let geminiClient;

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing from the server .env file"
    );
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }

  return geminiClient;
};

export const askGemini = async (prompt) => {
  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new TypeError("A non-empty prompt is required");
  }

  const primaryModel =
    process.env.GEMINI_MODEL || "gemini-3.5-flash";

  const fallbackModel =
    process.env.GEMINI_FALLBACK_MODEL ||
    "gemini-3.1-flash-lite";

  const response = await generateContentWithRetry(
    getGeminiClient(),
    {
      model: primaryModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    },
    {
      fallbackModels: [fallbackModel],
    }
  );

  const responseText = response?.text;

  if (!responseText || !responseText.trim()) {
    throw new Error("Gemini returned an empty response");
  }

  return responseText.trim();
};
