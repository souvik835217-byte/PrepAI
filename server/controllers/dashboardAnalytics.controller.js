import InterviewHistory from "../models/interviewHistory.model.js";

export const getDashboardAnalytics = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    const interviews = await InterviewHistory.find({
      firebaseUid,
    })
      .sort({ createdAt: 1 })
      .lean();

    if (interviews.length === 0) {
      return res.status(200).json({
        success: true,
        analytics: {
          totalInterviews: 0,
          averageScore: 0,
          bestScore: 0,
          latestScore: 0,
          strongestSkill: "No data",
          weakestSkill: "No data",
          categoryAverages: {
            communication: 0,
            technicalKnowledge: 0,
            confidence: 0,
            grammar: 0,
            problemSolving: 0,
          },
          scoreTrend: [],
          recentInterviews: [],
        },
      });
    }

    const scoreFields = [
      "communication",
      "technicalKnowledge",
      "confidence",
      "grammar",
      "problemSolving",
    ];

    const totalInterviews = interviews.length;

    const scores = interviews.map((interview) =>
      Number(interview.overallScore || 0)
    );

    const averageScore = Math.round(
      scores.reduce((total, score) => total + score, 0) /
        totalInterviews
    );

    const bestScore = Math.max(...scores);

    const latestScore =
      Number(interviews[interviews.length - 1]?.overallScore) || 0;

    const categoryAverages = {};

    scoreFields.forEach((field) => {
      const total = interviews.reduce(
        (sum, interview) =>
          sum + Number(interview[field] || 0),
        0
      );

      categoryAverages[field] = Math.round(
        total / totalInterviews
      );
    });

    const categoryEntries = Object.entries(categoryAverages);

    const strongestSkillEntry = categoryEntries.reduce(
      (best, current) =>
        current[1] > best[1] ? current : best
    );

    const weakestSkillEntry = categoryEntries.reduce(
      (weakest, current) =>
        current[1] < weakest[1] ? current : weakest
    );

    const formatSkillName = (value) => {
      const labels = {
        communication: "Communication",
        technicalKnowledge: "Technical Knowledge",
        confidence: "Confidence",
        grammar: "Grammar",
        problemSolving: "Problem Solving",
      };

      return labels[value] || value;
    };

    const scoreTrend = interviews.map((interview, index) => ({
      id: interview._id,
      interviewNumber: index + 1,
      score: Number(interview.overallScore || 0),
      targetRole:
        interview.targetRole || "Software Developer",
      date:
        interview.createdAt ||
        interview.interviewDate ||
        new Date(),
    }));

    const recentInterviews = [...interviews]
      .reverse()
      .slice(0, 5)
      .map((interview) => ({
        id: interview._id,
        candidateName:
          interview.candidateName || "Candidate",
        targetRole:
          interview.targetRole || "Software Developer",
        overallScore:
          Number(interview.overallScore || 0),
        recommendationTitle:
          interview.recommendationTitle || "",
        createdAt:
          interview.createdAt ||
          interview.interviewDate,
      }));

    return res.status(200).json({
      success: true,
      analytics: {
        totalInterviews,
        averageScore,
        bestScore,
        latestScore,
        strongestSkill: formatSkillName(
          strongestSkillEntry[0]
        ),
        strongestSkillScore: strongestSkillEntry[1],
        weakestSkill: formatSkillName(
          weakestSkillEntry[0]
        ),
        weakestSkillScore: weakestSkillEntry[1],
        categoryAverages,
        scoreTrend,
        recentInterviews,
      },
    });
  } catch (error) {
    console.error("Dashboard analytics error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard analytics",
      error: error.message,
    });
  }
};