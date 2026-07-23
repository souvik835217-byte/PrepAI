import { GoogleGenAI } from "@google/genai";
import { generateContentWithRetry } from "./geminiRetry.js";

let geminiClient;

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing from the server environment variables"
    );
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
    });
  }

  return geminiClient;
};

const withTimeout = async (
  promise,
  timeoutMs = 60000
) => {
  let timeoutId;

  const timeoutPromise = new Promise(
    (_, reject) => {
      timeoutId = setTimeout(() => {
        const error = new Error(
          `Gemini request timed out after ${Math.round(
            timeoutMs / 1000
          )} seconds`
        );

        error.name = "AbortError";
        reject(error);
      }, timeoutMs);
    }
  );

  try {
    return await Promise.race([
      promise,
      timeoutPromise,
    ]);
  } finally {
    clearTimeout(timeoutId);
  }
};

export const askGemini = async (
  prompt,
  options = {}
) => {
  if (
    typeof prompt !== "string" ||
    !prompt.trim()
  ) {
    throw new TypeError(
      "A non-empty prompt is required"
    );
  }

  const {
    timeoutMs = 60000,
    model,
  } = options;

  /*
    Flash-Lite is better for this short structured
    evaluation because it prioritizes low latency.
  */
  const primaryModel =
    model ||
    process.env.GEMINI_EVALUATION_MODEL ||
    "gemini-3.1-flash-lite";

  const fallbackModel =
    process.env.GEMINI_FALLBACK_MODEL ||
    "gemini-3.5-flash";

  const request = generateContentWithRetry(
    getGeminiClient(),
    {
      model: primaryModel,

      contents: prompt,

      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 1800,
      },
    },
    {
      fallbackModels: [fallbackModel],
      maxRetries: 1,
    }
  );

  const response = await withTimeout(
    request,
    timeoutMs
  );

  const responseText = response?.text;

  if (
    !responseText ||
    !responseText.trim()
  ) {
    throw new Error(
      "Gemini returned an empty response"
    );
  }

  return responseText.trim();
};