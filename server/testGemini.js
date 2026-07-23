import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const testGemini = async () => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from the .env file");
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    console.log("Connecting to Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents:
        "Reply with only this sentence: PrepAI Gemini connection successful",
    });

    console.log("\nGemini response:");
    console.log(response.text);
  } catch (error) {
    console.error("\nGemini connection failed:");
    console.error(error.message);
  }
};

testGemini();