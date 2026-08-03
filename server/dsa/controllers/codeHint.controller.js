import { askGemini } from "../../services/gemini.service.js";

const cleanHintResponse = (value = "") => {
  const unwrapped = String(value)
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(unwrapped);

    if (typeof parsed?.hint === "string") {
      return parsed.hint.trim();
    }
  } catch {
    // Gemini may return plain text rather than JSON.
  }

  return unwrapped
    .replace(/^\s*[-*]\s*/gm, "")
    .trim();
};

export const generateCodeHint = async (req, res) => {
  try {
    const {
      title,
      description,
      language,
      sourceCode,
      executionStatus,
      expectedOutput,
      actualOutput,
      error,
    } = req.body;

    if (!title || !language || !sourceCode?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "title, language and sourceCode are required",
      });
    }

    const prompt = `
You are a coding-assessment mentor.

Give the student one useful hint for the following problem.

Problem:
${title}

Description:
${description || "Not provided"}

Language:
${language}

Student code:
${sourceCode}

Execution status:
${executionStatus || "Failed"}

Expected output:
${expectedOutput || "Not provided"}

Student output:
${actualOutput || "No output"}

Compilation/runtime error:
${error || "None"}

Rules:
1. Do not provide the complete solution.
2. Do not rewrite the student's full code.
3. Identify the most likely logical or edge-case issue.
4. Give one or two actionable suggestions.
5. Keep the response below 80 words.
6. Do not use markdown code blocks.
7. If the error is compilation-related, explain the compilation issue.
`;

    const response = await askGemini(prompt);

    const rawHint =
      response?.text ||
      response?.response ||
      response?.content ||
      response;

    const hint = cleanHintResponse(rawHint);

    return res.status(200).json({
      success: true,
      hint:
        hint ||
        "Check your input handling, edge cases and output format.",
    });
  } catch (error) {
    console.error("Code hint generation error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to generate an AI hint",
    });
  }
};
