import { askGemini } from "../services/gemini.service.js";

const normalizeScore = (value) => {
  const score = Number(value);

  if (!Number.isFinite(score)) {
    return 0;
  }

  // Convert 0–10 scores into 0–100 scores
  if (score >= 0 && score <= 10) {
    return Math.round(score * 10);
  }

  // Keep scores safely between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)));
};

const normalizeEvaluationResult = (result) => {
  return {
    ...result,

    overallScore: normalizeScore(result.overallScore),
    communication: normalizeScore(result.communication),
    technicalKnowledge: normalizeScore(result.technicalKnowledge),
    confidence: normalizeScore(result.confidence),
    grammar: normalizeScore(result.grammar),
    problemSolving: normalizeScore(result.problemSolving),

    strengths: Array.isArray(result.strengths)
      ? result.strengths
      : [],

    weaknesses: Array.isArray(result.weaknesses)
      ? result.weaknesses
      : [],

    questionAnalysis: Array.isArray(result.questionAnalysis)
      ? result.questionAnalysis.map((item) => ({
          ...item,
          score: normalizeScore(item.score),
          feedback:
            typeof item.feedback === "string"
              ? item.feedback
              : "No feedback available.",
        }))
      : [],
  };
};

export const evaluateInterview = async (req, res) => {
  try {
    const { candidateName, targetRole, answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Interview answers are required",
      });
    }

    const prompt = `
You are a Senior Technical Interviewer.

Candidate:
${candidateName || "Candidate"}

Target Role:
${targetRole || "Software Developer"}

Interview Answers:

${answers
  .map(
    (a, index) => `
Question ${index + 1}:
${a.question || "Question not provided"}

Answer:
${a.answer || "No answer provided"}
`
  )
  .join("\n")}

Evaluate this interview fairly and professionally.

IMPORTANT SCORING RULES:

- Every score must be an INTEGER from 0 to 100.
- Do not use a 0 to 10 scale.
- A score of 9 out of 10 must be returned as 90.
- A score of 10 out of 10 must be returned as 100.
- The overall score must be consistent with the category and question scores.
- The recommendation must be consistent with the overall score.
- Avoid giving extremely high scores unless the answers genuinely deserve them.

Scoring guidance:

90-100: Excellent
80-89: Very good
70-79: Good
60-69: Average
40-59: Needs improvement
0-39: Poor

Return ONLY valid JSON.
Do not include markdown.
Do not include code fences.
Do not include any explanation outside the JSON.

Use exactly this structure:

{
  "overallScore": 0,
  "communication": 0,
  "technicalKnowledge": 0,
  "confidence": 0,
  "grammar": 0,
  "problemSolving": 0,
  "strengths": [],
  "weaknesses": [],
  "recommendationTitle": "",
  "recommendation": "",
  "questionAnalysis": [
    {
      "score": 0,
      "feedback": ""
    }
  ]
}
`;

    const response = await askGemini(prompt);

    if (!response) {
      throw new Error("Empty response received from Gemini");
    }

    const cleanedResponse = response
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsedResult = JSON.parse(cleanedResponse);

    const result = normalizeEvaluationResult(parsedResult);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Interview evaluation error:", error);

    return res.status(500).json({
      success: false,
      message: "Interview evaluation failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};