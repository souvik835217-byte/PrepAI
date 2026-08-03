import ContestResult from "../../models/ContestResult.js";

/*
=========================================================
GET CONTEST LEADERBOARD
GET /api/leaderboard/contest/:contestId
=========================================================
*/
export const getContestLeaderboard = async (req, res) => {
  try {
    const { contestId } = req.params;

    if (!contestId) {
      return res.status(400).json({
        success: false,
        message: "Contest ID is required.",
      });
    }

    const results = await ContestResult.find({
      contestId,
    })
      .sort({
        score: -1,
        timeUsed: 1,
        createdAt: 1,
      })
      .lean();

    const leaderboard = results.map(
      (result, index) => ({
        rank: index + 1,
        resultId: result._id,
        userId: result.userId,
        userName:
          result.userName ||
          `User ${String(
            result.userId
          ).slice(0, 6)}`,
        photoURL: result.photoURL || "",
        contestId: result.contestId,
        contestTitle:
          result.contestTitle,
        score: result.score || 0,
        totalScore:
          result.totalScore || 0,
        solved: result.solved || 0,
        totalProblems:
          result.totalProblems || 0,
        accuracy:
          result.accuracy || 0,
        timeUsed:
          result.timeUsed || 0,
        completedAt:
          result.createdAt,
      })
    );

    return res.status(200).json({
      success: true,
      contestId,
      contestTitle:
        leaderboard[0]?.contestTitle ||
        "Contest Leaderboard",
      participantCount:
        leaderboard.length,
      leaderboard,
    });
  } catch (error) {
    console.error(
      "Contest leaderboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load contest leaderboard.",
      error: error.message,
    });
  }
};
