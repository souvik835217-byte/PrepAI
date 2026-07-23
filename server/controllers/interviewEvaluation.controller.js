import { askGemini } from "../services/gemini.service.js";

const normalizeScore = (value) => {
  const score = Number(value);

  if (!Number.isFinite(score)) {
    return 0;
  }

  if (score >= 0 && score <= 10) {
    return Math.round(score * 10);
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

const normalizeEvaluationResult = (result, answers) => {
  const questionAnalysis = Array.isArray(result.questionAnalysis)
    ? result.questionAnalysis
    : [];

  return {
    overallScore: normalizeScore(result.overallScore),
    communication: normalizeScore(result.communication),
    technicalKnowledge: normalizeScore(result.technicalKnowledge),
    confidence: normalizeScore(result.confidence),
    grammar: normalizeScore(result.grammar),
    problemSolving: normalizeScore(result.problemSolving),

    strengths: Array.isArray(result.strengths)
      ? result.strengths.slice(0, 3)
      : [],

    weaknesses: Array.isArray(result.weaknesses)
      ? result.weaknesses.slice(0, 3)
      : [],

    recommendationTitle:
      typeof result.recommendationTitle === "string"
        ? result.recommendationTitle
        : "Continue improving your interview skills",

    recommendation:
      typeof result.recommendation === "string"
        ? result.recommendation
        : "Use structured answers, explain your decisions and include clear examples.",

    questionAnalysis: answers.map((answer, index) => {
      const evaluation = questionAnalysis[index] || {};

      return {
        questionId: answer.questionId || index + 1,
        questionNumber: index + 1,
        category: answer.category || "General",
        question:
          answer.question || `Question ${index + 1}`,

        score: normalizeScore(
          evaluation.score ??
            answer.validationScore ??
            0
        ),

        feedback:
          typeof evaluation.feedback === "string"
            ? evaluation.feedback
            : answer.validationFeedback ||
              "Your answer was evaluated successfully.",
      };
    }),
  };
};

const shortenText = (value, maximumLength) => {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maximumLength);
};

export const evaluateInterview = async (req, res) => {
  try {
    const {
      candidateName,
      targetRole,
      answers,
    } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Interview answers are required",
      });
    }

    /*
      Only send information required for evaluation.
      This keeps the prompt smaller and reduces response time.
    */
    const compactAnswers = answers
      .slice(0, 10)
      .map((item, index) => ({
        questionId: item.questionId || index + 1,
        category: item.category || "General",
        question: shortenText(
          item.question || `Question ${index + 1}`,
          500
        ),
        answer: shortenText(
          item.answer || "No answer provided",
          1800
        ),
        validationScore:
          Number.isFinite(Number(item.validationScore))
            ? normalizeScore(item.validationScore)
            : null,
        validationFeedback: shortenText(
          item.validationFeedback || "",
          300
        ),
      }));

    const interviewText = compactAnswers
      .map(
        (item, index) => `
Q${index + 1} (${item.category}):
${item.question}

Answer:
${item.answer}
`
      )
      .join("\n");

    const prompt = `
Evaluate this interview for a ${shortenText(
      targetRole || "Software Developer",
      100
    )} role.

Candidate: ${shortenText(
      candidateName || "Candidate",
      100
    )}

Interview:
${interviewText}

Return one JSON object only.

Scoring:
- Use integers from 0 to 100.
- Keep scores realistic and internally consistent.
- Consider relevance, clarity, technical correctness, structure and examples.
- Give exactly one questionAnalysis item for every submitted answer.
- Keep each feedback under 35 words.
- Return at most 3 strengths and 3 weaknesses.

Required JSON structure:

{
  "overallScore": 0,
  "communication": 0,
  "technicalKnowledge": 0,
  "confidence": 0,
  "grammar": 0,
  "problemSolving": 0,
  "strengths": ["", "", ""],
  "weaknesses": ["", "", ""],
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

    const response = await askGemini(prompt, {
      timeoutMs: 60000,
    });

    if (!response) {
      throw new Error(
        "Empty response received from Gemini"
      );
    }

    const cleanedResponse = response
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let parsedResult;

    try {
      parsedResult = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error(
        "Invalid Gemini evaluation JSON:",
        cleanedResponse
      );

      throw new Error(
        "Gemini returned invalid evaluation JSON"
      );
    }

    const result = normalizeEvaluationResult(
      parsedResult,
      compactAnswers
    );

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(
      "Interview evaluation error:",
      error
    );

    const isTimeout =
      error?.name === "AbortError" ||
      String(error?.message || "")
        .toLowerCase()
        .includes("timeout");

    return res.status(isTimeout ? 504 : 500).json({
      success: false,
      message: isTimeout
        ? "Interview evaluation timed out"
        : "Interview evaluation failed",
      error: error.message,
    });
  }
};