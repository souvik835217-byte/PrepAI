import { askGemini } from "../../services/gemini.service.js";
import CodeSubmission from "../../models/CodeSubmission.js";

export const generateLearningRoadmap = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const submissions = await CodeSubmission.find({ userId }).sort({
      createdAt: -1,
    });

    if (!submissions.length) {
      return res.status(404).json({
        success: false,
        message: "No submissions found.",
      });
    }

    const summary = submissions.map((item) => ({
      question:
        item.questionTitle ||
        item.title ||
        item.questionId,
      topic: item.topic,
      company: item.company,
      status: item.status,
      language: item.language,
      runtime: item.executionTime,
      memory: item.memory,
    }));

    const prompt = `
You are an expert DSA mentor.

Below is the user's coding history.

${JSON.stringify(summary, null, 2)}

Generate ONLY valid JSON.

{
 "interviewReadiness":75,
 "strengths":[""],
 "weaknesses":[""],
 "days":[
   {
     "day":1,
     "topic":"",
     "questions":["",""]
   }
 ]
}

Rules:
1. Readiness between 0-100.
2. Maximum 3 strengths.
3. Maximum 3 weaknesses.
4. Exactly 7 study days.
5. Two questions every day.
6. Recommend interview preparation topics.
`;

    const response = await askGemini(prompt);

    const rawResponse =
      response?.text ||
      response?.response ||
      response?.content ||
      response;

    if (!rawResponse) {
      throw new Error("Gemini returned an empty roadmap response.");
    }

    const cleanedResponse = String(rawResponse)
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let roadmap;

    try {
      roadmap = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Invalid roadmap JSON:", cleanedResponse);

      throw new Error(
        "Gemini returned an invalid roadmap JSON response."
      );
    }

    return res.status(200).json({
      success: true,
      roadmap,
    });
  } catch (error) {
    console.error("Roadmap Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to generate roadmap.",
    });
  }
};
