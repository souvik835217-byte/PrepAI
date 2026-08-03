import ContestResult from "../../models/ContestResult.js";
import mongoose from "mongoose";

export const saveContestResult = async (req, res) => {
  try {
    const {
      userId,
      userName = "",
      photoURL = "",
      contestId,
      contestTitle,
      score = 0,
      totalScore = 0,
      solved = 0,
      totalProblems = 0,
      accuracy = 0,
      duration = 0,
      timeUsed = 0,
      submissions = [],
      rank = null,
    } = req.body;

    if (!userId || !contestId || !contestTitle) {
      return res.status(400).json({
        success: false,
        message:
          "userId, contestId and contestTitle are required.",
      });
    }

    const result = await ContestResult.create({
      userId,
      userName,
      photoURL,
      contestId,
      contestTitle,
      score: Number(score) || 0,
      totalScore: Number(totalScore) || 0,
      solved: Number(solved) || 0,
      totalProblems: Number(totalProblems) || 0,
      accuracy: Number(accuracy) || 0,
      duration: Number(duration) || 0,
      timeUsed: Number(timeUsed) || 0,
      rank: rank === null ? null : Number(rank),
      submissions: Array.isArray(submissions)
        ? submissions
        : [],
    });

    return res.status(201).json({
      success: true,
      message: "Contest result saved successfully.",
      result,
    });
  } catch (error) {
    console.error("Save Contest Result Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save contest result.",
      error: error.message,
    });
  }
};

export const getUserContestHistory = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const history = await ContestResult.find({
      userId: uid,
    })
      .select(
        "contestTitle score totalScore solved accuracy timeUsed -_id"
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(
      history.map((result) => ({
        title: result.contestTitle,
        score: result.score,
        totalScore: result.totalScore,
        solved: result.solved,
        accuracy: result.accuracy,
        timeUsed: result.timeUsed,
      }))
    );
  } catch (error) {
    console.error("Get contest history error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Unable to load contest history.",
    });
  }
};

export const getContestResultById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contest result ID.",
      });
    }

    const contestResult = await ContestResult.findById(id).lean();

    if (!contestResult) {
      return res.status(404).json({
        success: false,
        message: "Contest result not found.",
      });
    }

    return res.status(200).json({
      success: true,
      contestResult,
    });
  } catch (error) {
    console.error("Get contest result error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Unable to load contest result.",
    });
  }
};

export const deleteContestResult = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contest result ID.",
      });
    }

    const contestResult =
      await ContestResult.findByIdAndDelete(id);

    if (!contestResult) {
      return res.status(404).json({
        success: false,
        message: "Contest result not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contest result deleted.",
    });
  } catch (error) {
    console.error("Delete contest result error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Unable to delete contest result.",
    });
  }
};
