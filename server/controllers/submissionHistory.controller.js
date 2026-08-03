import mongoose from "mongoose";
import CodeSubmission from "../models/CodeSubmission.js";

const TOPIC_TOTALS = {
  arrays: 20,
  strings: 20,
  "linked-list": 15,
  stack: 12,
  queue: 12,
  tree: 18,
  graph: 18,
  dp: 20,
  greedy: 15,
  hashing: 15,
};

const TOPIC_NAMES = {
  arrays: "Arrays",
  strings: "Strings",
  "linked-list": "Linked List",
  stack: "Stack",
  queue: "Queue",
  tree: "Trees",
  graph: "Graphs",
  dp: "Dynamic Programming",
  greedy: "Greedy",
  hashing: "Hashing",
};

const normalizeValue = (value) =>
  String(value || "").trim().toLowerCase();

const formatTopicName = (topic) =>
  String(topic || "")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");

const isAccepted = (submission) =>
  submission.accepted === true ||
  normalizeValue(submission.status) === "accepted";

const getCurrentStreak = (submissions) => {
  const activityDays = new Set(
    submissions
      .filter(isAccepted)
      .map((submission) => {
        const date = new Date(submission.createdAt);
        return Number.isNaN(date.getTime())
          ? null
          : date.toISOString().slice(0, 10);
      })
      .filter(Boolean)
  );

  if (activityDays.size === 0) {
    return 0;
  }

  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);

  const today = cursor.toISOString().slice(0, 10);
  if (!activityDays.has(today)) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  let streak = 0;
  while (activityDays.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
};

export const getQuestionSubmissionHistory = async (
  req,
  res
) => {
  try {
    const { questionId } = req.params;

    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "Question ID is required",
      });
    }

    const submissions =
      await CodeSubmission.find({
        questionId,
      })
        .select(
          "status language executionTime memory createdAt sourceCode"
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error(
      "Get question submission history error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load submission history",
    });
  }
};

export const getUserSubmissions = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const submissions =
      await CodeSubmission.find({
        userId,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error(
      "Get submissions error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load submissions",
    });
  }
};

export const getUserSubmissionAnalytics =
  async (req, res) => {
    try {
      const uid = req.params.uid || req.params.userId;

      if (!uid) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      const submissions = await CodeSubmission.find({
        userId: uid,
      })
        .select(
          "questionId topic difficulty company status accepted executionTime createdAt"
        )
        .lean();

      const acceptedSubmissions =
        submissions.filter(isAccepted);
      const solvedQuestionIds = new Set(
        acceptedSubmissions.map(
          (submission) => submission.questionId
        )
      );

      const solvedByTopic = new Map();
      const difficulty = {
        easy: 0,
        medium: 0,
        hard: 0,
      };
      const companies = {};
      const runtimes = [];

      for (const submission of acceptedSubmissions) {
        const topic = normalizeValue(submission.topic);
        if (topic) {
          if (!solvedByTopic.has(topic)) {
            solvedByTopic.set(topic, new Set());
          }
          solvedByTopic
            .get(topic)
            .add(submission.questionId);
        }

        const level = normalizeValue(
          submission.difficulty || "easy"
        );
        difficulty[
          Object.hasOwn(difficulty, level) ? level : "easy"
        ] += 1;

        const company =
          String(submission.company || "General").trim() ||
          "General";
        companies[company] = (companies[company] || 0) + 1;

        const runtime = Number(submission.executionTime);
        if (Number.isFinite(runtime) && runtime >= 0) {
          runtimes.push(runtime);
        }
      }

      const topics = [
        ...new Set([
          ...Object.keys(TOPIC_TOTALS),
          ...solvedByTopic.keys(),
        ]),
      ].map((topic) => ({
        name: TOPIC_NAMES[topic] || formatTopicName(topic),
        solved: solvedByTopic.get(topic)?.size || 0,
        total:
          TOPIC_TOTALS[topic] ||
          solvedByTopic.get(topic)?.size ||
          0,
      }));

      return res.status(200).json({
        success: true,
        analytics: {
          totalSolved: solvedQuestionIds.size,
          accepted: acceptedSubmissions.length,
          accuracy:
            submissions.length > 0
              ? Math.round(
                  (acceptedSubmissions.length /
                    submissions.length) *
                    100
                )
              : 0,
          bestRuntime:
            runtimes.length > 0 ? Math.min(...runtimes) : 0,
          currentStreak: getCurrentStreak(submissions),
          topics,
          difficulty,
          companies,
        },
      });
    } catch (error) {
      console.error(
        "Submission analytics error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to load submission analytics",
      });
    }
  };

export const deleteSubmission = async (
  req,
  res
) => {
  try {
    const { submissionId } =
      req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        submissionId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid submission ID",
      });
    }

    const deletedSubmission =
      await CodeSubmission.findByIdAndDelete(
        submissionId
      );

    if (!deletedSubmission) {
      return res.status(404).json({
        success: false,
        message:
          "Submission not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Submission deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete submission error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to delete submission",
    });
  }
};
