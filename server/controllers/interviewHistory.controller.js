import mongoose from "mongoose";
import InterviewHistory from "../models/interviewHistory.model.js";

const clampScore = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(numericValue)));
};

const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

const safeText = (value, fallback = "") => {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmedValue = value.trim();

  return trimmedValue || fallback;
};

const normalizeStringArray = (value) => {
  return safeArray(value)
    .map((item) => safeText(item))
    .filter(Boolean);
};

const normalizeQuestionAnalysis = (questions) => {
  return safeArray(questions).map((item, index) => {
    const questionId = String(
      item?.questionId ??
        item?.id ??
        item?._id ??
        item?.questionNumber ??
        index + 1
    );

    const answer = safeText(
      item?.answer ||
        item?.candidateAnswer ||
        item?.userAnswer ||
        item?.response ||
        item?.transcript ||
        item?.typedAnswer ||
        item?.finalAnswer,
      ""
    );

    return {
      questionId,

      questionNumber:
        Number(item?.questionNumber) || index + 1,

      category: safeText(
        item?.category,
        "General"
      ),

      difficulty: safeText(
        item?.difficulty,
        "Medium"
      ),

      question: safeText(
        item?.question || item?.questionText,
        `Question ${index + 1}`
      ),

      answer,

      candidateAnswer: answer,

      score: clampScore(
        item?.score ??
          item?.validationScore ??
          item?.relevanceScore
      ),

      feedback: safeText(
        item?.feedback ||
          item?.validationFeedback ||
          item?.analysis,
        ""
      ),

      missingPoints: normalizeStringArray(
        item?.missingPoints ||
          item?.improvements
      ),
    };
  });
};

const getFirebaseUid = (req) => {
  return safeText(
    req.user?.uid ||
      req.user?.firebaseUid ||
      req.body?.firebaseUid ||
      req.query?.firebaseUid ||
      req.params?.firebaseUid,
    ""
  );
};

/*
  POST /api/interview-history

  Save a completed interview report.
*/
export const saveInterviewHistory = async (
  req,
  res
) => {
  try {
    const firebaseUid = getFirebaseUid(req);

    const result =
      req.body?.result ||
      req.body?.interviewResult ||
      req.body?.evaluation ||
      req.body?.report ||
      req.body ||
      {};

    const session =
      req.body?.interviewSession ||
      req.body?.session ||
      {};

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message:
          "Firebase user ID is required.",
      });
    }

    const sessionAnswers =
      session.answers ||
      session.responses ||
      session.submittedAnswers ||
      [];

    const questionAnalysis =
      normalizeQuestionAnalysis(
        result.questionAnalysis ||
          sessionAnswers
      );

    const history =
      await InterviewHistory.create({
        firebaseUid,

        candidateName: safeText(
          session.candidateName ||
            result.candidateName,
          "Candidate"
        ),

        targetRole: safeText(
          session.targetRole ||
            result.targetRole,
          "Software Developer"
        ),

        company: safeText(
          session.company ||
            session.selectedCompany ||
            result.company ||
            result.selectedCompany,
          "General"
        ),

        selectedCompany: safeText(
          session.selectedCompany ||
            session.company ||
            result.selectedCompany ||
            result.company,
          "General"
        ),

        interviewerName: safeText(
          session.interviewerName ||
            session.interviewer?.name ||
            result.interviewerName,
          "AI Interviewer"
        ),

        interviewerRole: safeText(
          session.interviewerRole ||
            session.interviewer?.role ||
            result.interviewerRole,
          "Technical Interviewer"
        ),

        overallScore: clampScore(
          result.overallScore
        ),

        communication: clampScore(
          result.communication
        ),

        technicalKnowledge: clampScore(
          result.technicalKnowledge
        ),

        confidence: clampScore(
          result.confidence
        ),

        grammar: clampScore(
          result.grammar
        ),

        problemSolving: clampScore(
          result.problemSolving
        ),

        performanceLabel: safeText(
          result.performanceLabel
        ),

        performanceSummary: safeText(
          result.performanceSummary
        ),

        strengths: normalizeStringArray(
          result.strengths
        ),

        weaknesses: normalizeStringArray(
          result.weaknesses
        ),

        recommendationTitle: safeText(
          result.recommendationTitle
        ),

        recommendation: safeText(
          result.recommendation
        ),

        questionAnalysis,

        resumeSummary: safeText(
          session.resumeSummary ||
            result.resumeSummary
        ),

        skills: normalizeStringArray(
          session.skills ||
            result.skills
        ),

        completedAt:
          session.completedAt ||
          result.completedAt ||
          new Date(),
      });

    return res.status(201).json({
      success: true,
      message:
        "Interview history saved successfully.",
      history,
    });
  } catch (error) {
    console.error(
      "Save interview history error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to save interview history.",
      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};

/*
  GET /api/interview-history/user/:firebaseUid

  Get all interviews belonging to one user.

  Optional query parameters:
  page=1
  limit=10
  company=Google
  targetRole=Software Engineer
*/
export const getUserInterviewHistory =
  async (req, res) => {
    try {
      const firebaseUid =
        getFirebaseUid(req);

      if (!firebaseUid) {
        return res.status(400).json({
          success: false,
          message:
            "Firebase user ID is required.",
        });
      }

      const page = Math.max(
        1,
        Number.parseInt(
          req.query.page,
          10
        ) || 1
      );

      const limit = Math.min(
        50,
        Math.max(
          1,
          Number.parseInt(
            req.query.limit,
            10
          ) || 10
        )
      );

      const skip = (page - 1) * limit;

      const filter = {
        firebaseUid,
      };

      const company = safeText(
        req.query.company
      );

      const targetRole = safeText(
        req.query.targetRole
      );

      if (company) {
        filter.company = {
          $regex: company,
          $options: "i",
        };
      }

      if (targetRole) {
        filter.targetRole = {
          $regex: targetRole,
          $options: "i",
        };
      }

      const [interviews, total] =
        await Promise.all([
          InterviewHistory.find(filter)
            .sort({
              completedAt: -1,
              createdAt: -1,
            })
            .skip(skip)
            .limit(limit)
            .select(
              "-resumeSummary -questionAnalysis.answer -questionAnalysis.candidateAnswer"
            )
            .lean(),

          InterviewHistory.countDocuments(
            filter
          ),
        ]);

      return res.status(200).json({
        success: true,
        count: interviews.length,
        interviews,

        pagination: {
          page,
          limit,
          total,
          totalPages:
            Math.ceil(total / limit),
          hasNextPage:
            page * limit < total,
          hasPreviousPage: page > 1,
        },
      });
    } catch (error) {
      console.error(
        "Get interview history error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch interview history.",
        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

/*
  GET /api/interview-history/report/:id

  Get one complete interview report.

  Requires firebaseUid as query parameter:
  /api/interview-history/report/ID?firebaseUid=UID
*/
export const getInterviewHistoryById =
  async (req, res) => {
    try {
      const { id } = req.params;
      const firebaseUid =
        getFirebaseUid(req);

      if (!firebaseUid) {
        return res.status(400).json({
          success: false,
          message:
            "Firebase user ID is required.",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid interview history ID.",
        });
      }

      const interview =
        await InterviewHistory.findOne({
          _id: id,
          firebaseUid,
        }).lean();

      if (!interview) {
        return res.status(404).json({
          success: false,
          message:
            "Interview history not found.",
        });
      }

      return res.status(200).json({
        success: true,
        interview,
      });
    } catch (error) {
      console.error(
        "Get interview by ID error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch interview report.",
        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

/*
  GET /api/interview-history/analytics/:firebaseUid

  Get dashboard interview statistics.
*/
export const getInterviewAnalytics =
  async (req, res) => {
    try {
      const firebaseUid =
        getFirebaseUid(req);

      if (!firebaseUid) {
        return res.status(400).json({
          success: false,
          message:
            "Firebase user ID is required.",
        });
      }

      const interviews =
        await InterviewHistory.find({
          firebaseUid,
        })
          .sort({
            completedAt: 1,
            createdAt: 1,
          })
          .select(
            [
              "overallScore",
              "communication",
              "technicalKnowledge",
              "confidence",
              "grammar",
              "problemSolving",
              "company",
              "selectedCompany",
              "targetRole",
              "completedAt",
              "createdAt",
            ].join(" ")
          )
          .lean();

      if (interviews.length === 0) {
        return res.status(200).json({
          success: true,

          analytics: {
            totalInterviews: 0,
            averageScore: 0,
            bestScore: 0,
            latestScore: 0,
            improvement: 0,
            strongestSkill:
              "No interview data",
            strongestSkillScore: 0,
            weakestSkill:
              "No interview data",
            weakestSkillScore: 0,
            companiesAttempted: 0,
            categoryAverages: {
              Communication: 0,
              "Technical Knowledge": 0,
              Confidence: 0,
              Grammar: 0,
              "Problem Solving": 0,
            },
            recentPerformance: [],
          },
        });
      }

      const calculateAverage = (
        values
      ) => {
        if (values.length === 0) {
          return 0;
        }

        const total = values.reduce(
          (sum, value) =>
            sum + clampScore(value),
          0
        );

        return Math.round(
          total / values.length
        );
      };

      const overallScores =
        interviews.map((item) =>
          clampScore(item.overallScore)
        );

      const categoryAverages = {
        Communication: calculateAverage(
          interviews.map(
            (item) =>
              item.communication
          )
        ),

        "Technical Knowledge":
          calculateAverage(
            interviews.map(
              (item) =>
                item.technicalKnowledge
            )
          ),

        Confidence: calculateAverage(
          interviews.map(
            (item) => item.confidence
          )
        ),

        Grammar: calculateAverage(
          interviews.map(
            (item) => item.grammar
          )
        ),

        "Problem Solving":
          calculateAverage(
            interviews.map(
              (item) =>
                item.problemSolving
            )
          ),
      };

      const categoryEntries =
        Object.entries(
          categoryAverages
        );

      const strongestSkill =
        categoryEntries.reduce(
          (best, current) =>
            current[1] > best[1]
              ? current
              : best
        );

      const weakestSkill =
        categoryEntries.reduce(
          (lowest, current) =>
            current[1] < lowest[1]
              ? current
              : lowest
        );

      const firstScore =
        overallScores[0];

      const latestScore =
        overallScores[
          overallScores.length - 1
        ];

      const uniqueCompanies =
        new Set(
          interviews
            .map((item) =>
              safeText(
                item.company ||
                  item.selectedCompany
              )
            )
            .filter(Boolean)
        );

      const recentPerformance =
        interviews
          .slice(-7)
          .map((item) => ({
            id: item._id,

            score: clampScore(
              item.overallScore
            ),

            company: safeText(
              item.company ||
                item.selectedCompany,
              "General"
            ),

            targetRole: safeText(
              item.targetRole,
              "Software Developer"
            ),

            completedAt:
              item.completedAt ||
              item.createdAt,
          }));

      return res.status(200).json({
        success: true,

        analytics: {
          totalInterviews:
            interviews.length,

          averageScore:
            calculateAverage(
              overallScores
            ),

          bestScore:
            Math.max(...overallScores),

          latestScore,

          improvement:
            latestScore - firstScore,

          strongestSkill:
            strongestSkill[0],

          strongestSkillScore:
            strongestSkill[1],

          weakestSkill:
            weakestSkill[0],

          weakestSkillScore:
            weakestSkill[1],

          companiesAttempted:
            uniqueCompanies.size,

          categoryAverages,

          recentPerformance,
        },
      });
    } catch (error) {
      console.error(
        "Get interview analytics error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch interview analytics.",
        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

/*
  DELETE /api/interview-history/:id

  Delete one interview report.

  Requires firebaseUid in request body or query:
  DELETE /api/interview-history/ID?firebaseUid=UID
*/
export const deleteInterviewHistory =
  async (req, res) => {
    try {
      const { id } = req.params;
      const firebaseUid =
        getFirebaseUid(req);

      if (!firebaseUid) {
        return res.status(400).json({
          success: false,
          message:
            "Firebase user ID is required.",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid interview history ID.",
        });
      }

      const interview =
        await InterviewHistory.findOneAndDelete({
          _id: id,
          firebaseUid,
        });

      if (!interview) {
        return res.status(404).json({
          success: false,
          message:
            "Interview history not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Interview history deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete interview history error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete interview history.",
        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };