import { askGemini } from "../../services/gemini.service.js";

const removeCodeFences = (value = "") =>
  String(value)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

const parseReview = (value) => {
  if (typeof value === "object" && value !== null) {
    return value;
  }

  const cleanedValue = removeCodeFences(value);

  try {
    return JSON.parse(cleanedValue);
  } catch {
    return null;
  }
};

export const generateAiCodeReview = async (req, res) => {
  try {
    const {
      title,
      description,
      language,
      sourceCode,
      status,
      executionTime,
      memory,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Question title is required.",
      });
    }

    if (!language) {
      return res.status(400).json({
        success: false,
        message: "Programming language is required.",
      });
    }

    if (!sourceCode?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Source code is required.",
      });
    }

    if (String(status).toLowerCase() !== "accepted") {
      return res.status(400).json({
        success: false,
        message:
          "AI code review is available only for accepted solutions.",
      });
    }

    const prompt = `
You are a senior software engineer reviewing a successful coding solution.

Question:
${title}

Description:
${description || "Not provided"}

Language:
${language}

Execution status:
${status}

Execution time:
${executionTime || "Not provided"}

Memory:
${memory || "Not provided"}

Submitted source code:
${sourceCode}

Return only valid JSON using this exact structure:

{
  "overallScore": 0,
  "summary": "",
  "timeComplexity": "",
  "spaceComplexity": "",
  "strengths": [
    ""
  ],
  "suggestions": [
    ""
  ],
  "edgeCases": [
    ""
  ],
  "quality": {
    "readability": 0,
    "efficiency": 0,
    "maintainability": 0
  }
}

Rules:
1. overallScore must be between 0 and 100.
2. readability, efficiency and maintainability must be between 0 and 100.
3. Provide a maximum of 4 strengths.
4. Provide a maximum of 4 suggestions.
5. Provide a maximum of 3 edge cases.
6. Do not provide a rewritten complete solution.
7. Be constructive and specific to the submitted code.
8. Estimate complexity from the implementation.
9. Return JSON only.
`;

    const response = await askGemini(prompt);

    const rawReview =
      response?.text ||
      response?.response ||
      response?.content ||
      response;

    const parsedReview = parseReview(rawReview);

    if (!parsedReview) {
      throw new Error("AI returned an invalid review response.");
    }

    const normalizeScore = (value) => {
      const score = Number(value);

      if (!Number.isFinite(score)) {
        return 0;
      }

      return Math.max(0, Math.min(100, Math.round(score)));
    };

    const review = {
      overallScore: normalizeScore(
        parsedReview.overallScore
      ),

      summary:
        parsedReview.summary ||
        "Your solution was accepted successfully.",

      timeComplexity:
        parsedReview.timeComplexity || "Not identified",

      spaceComplexity:
        parsedReview.spaceComplexity || "Not identified",

      strengths: Array.isArray(parsedReview.strengths)
        ? parsedReview.strengths.slice(0, 4)
        : [],

      suggestions: Array.isArray(parsedReview.suggestions)
        ? parsedReview.suggestions.slice(0, 4)
        : [],

      edgeCases: Array.isArray(parsedReview.edgeCases)
        ? parsedReview.edgeCases.slice(0, 3)
        : [],

      quality: {
        readability: normalizeScore(
          parsedReview.quality?.readability
        ),

        efficiency: normalizeScore(
          parsedReview.quality?.efficiency
        ),

        maintainability: normalizeScore(
          parsedReview.quality?.maintainability
        ),
      },
    };

    return res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error(
      "AI code review error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to generate AI code review.",
    });
  }
};
