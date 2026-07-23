import { GoogleGenAI } from "@google/genai";
import { generateContentWithRetry } from "../services/geminiRetry.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getQuestionId = (item, index) => {
  return String(
    item?.questionId ??
      item?.id ??
      item?._id ??
      index + 1
  );
};

const getQuestionText = (item) => {
  return (
    item?.question ||
    item?.questionText ||
    item?.prompt ||
    ""
  );
};

const getCandidateAnswer = (item) => {
  return (
    item?.answer ||
    item?.candidateAnswer ||
    item?.userAnswer ||
    item?.response ||
    item?.transcript ||
    item?.typedAnswer ||
    ""
  );
};

export const generateInterviewResult = async (req, res) => {
  try {
    const {
      candidateName,
      targetRole,
      resumeSummary,
      company,
      answers,
    } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Interview answers are required.",
      });
    }

    const normalizedAnswers = answers.map((item, index) => ({
      questionId: getQuestionId(item, index),
      question: getQuestionText(item),
      answer: getCandidateAnswer(item),
      category: item?.category || "",
      timeTaken: item?.timeTaken ?? null,
    }));

    const prompt = `
You are a professional technical interviewer.

Evaluate the following completed interview.

Candidate name:
${candidateName || "Candidate"}

Target role:
${targetRole || "Software Developer"}

Company:
${company || "General"}

Resume summary:
${resumeSummary || "Not provided"}

Interview responses:
${JSON.stringify(normalizedAnswers, null, 2)}

Return valid JSON only.

Use exactly this structure:

{
  "overallScore": 0,
  "communication": 0,
  "technicalKnowledge": 0,
  "confidence": 0,
  "problemSolving": 0,
  "grammar": 0,
  "strengths": [],
  "weaknesses": [],
  "recommendations": [],
  "summary": "",
  "questionAnalysis": [
    {
      "questionId": "",
      "score": 0,
      "feedback": "",
      "strongPoints": [],
      "missingPoints": []
    }
  ]
}

Rules:
- Every score must be between 0 and 100.
- Evaluate only from the provided answers.
- Keep feedback practical and specific.
- Include one questionAnalysis item for every submitted answer.
- Preserve the questionId exactly as provided.
- Do not include the candidate answer in the generated JSON.
- Do not include markdown.
- Do not include code fences.
`;

    const response = await generateContentWithRetry(
      ai,
      {
        model:
          process.env.GEMINI_MODEL ||
          "gemini-3.5-flash",
        contents: prompt,
      },
      {
        fallbackModels: [
          process.env.GEMINI_FALLBACK_MODEL ||
            "gemini-3.1-flash-lite",
        ],
      }
    );

    const rawText =
      response.text ||
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";

    const cleanedText = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let aiResult;

    try {
      aiResult = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error(
        "Gemini JSON parse error:",
        cleanedText
      );

      return res.status(500).json({
        success: false,
        message:
          "AI returned an invalid result format. Please try again.",
      });
    }

    const aiQuestionAnalysis = Array.isArray(
      aiResult.questionAnalysis
    )
      ? aiResult.questionAnalysis
      : [];

    /*
      Merge the original questions and answers with Gemini's
      evaluation. This ensures the result page and PDF always
      receive the candidate's actual answer.
    */
    const mergedQuestionAnalysis = normalizedAnswers.map(
      (submittedAnswer, index) => {
        const matchingAnalysis =
          aiQuestionAnalysis.find(
            (analysis) =>
              String(analysis?.questionId) ===
              String(submittedAnswer.questionId)
          ) || aiQuestionAnalysis[index];

        return {
          questionId: submittedAnswer.questionId,
          question: submittedAnswer.question,
          candidateAnswer: submittedAnswer.answer,
          answer: submittedAnswer.answer,
          category: submittedAnswer.category,
          timeTaken: submittedAnswer.timeTaken,

          score: Number(matchingAnalysis?.score) || 0,
          feedback:
            matchingAnalysis?.feedback ||
            "No feedback was generated.",
          strongPoints: Array.isArray(
            matchingAnalysis?.strongPoints
          )
            ? matchingAnalysis.strongPoints
            : [],
          missingPoints: Array.isArray(
            matchingAnalysis?.missingPoints
          )
            ? matchingAnalysis.missingPoints
            : [],
        };
      }
    );

    const result = {
      ...aiResult,
      candidateName:
        candidateName || "Candidate",
      targetRole:
        targetRole || "Software Developer",
      company: company || "General",
      questionAnalysis: mergedQuestionAnalysis,
    };

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(
      "Generate interview result error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Could not generate the interview result.",
    });
  }
};