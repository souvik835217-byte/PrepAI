import {
  contests,
  getContestById,
} from "../data/contests.js";

import {
  problems,
  getProblemById,
} from "../data/problems.js";

export const getAllProblems = async (req, res) => {
  try {
    const {
      topic,
      company,
      difficulty,
      search,
    } = req.query;

    let filteredProblems = [...problems];

    if (topic) {
      filteredProblems = filteredProblems.filter(
        (problem) =>
          problem.topic.toLowerCase() ===
          topic.toLowerCase()
      );
    }

    if (company) {
      filteredProblems = filteredProblems.filter(
        (problem) =>
          problem.companies.some(
            (item) =>
              item.toLowerCase() ===
              company.toLowerCase()
          )
      );
    }

    if (difficulty) {
      filteredProblems = filteredProblems.filter(
        (problem) =>
          problem.difficulty.toLowerCase() ===
          difficulty.toLowerCase()
      );
    }

    if (search) {
      filteredProblems = filteredProblems.filter(
        (problem) =>
          problem.title
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    return res.status(200).json({
      success: true,
      count: filteredProblems.length,
      problems: filteredProblems,
    });
  } catch (error) {
    console.error("Get problems error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load problems.",
    });
  }
};

export const getSingleProblem = async (req, res) => {
  try {
    const problem = getProblemById(
      req.params.problemId
    );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found.",
      });
    }

    return res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    console.error("Get problem error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load problem.",
    });
  }
};

export const getAllContests = async (req, res) => {
  try {
    const formattedContests = contests.map(
      (contest) => ({
        ...contest,
        problemCount: contest.problemIds.length,
      })
    );

    return res.status(200).json({
      success: true,
      count: formattedContests.length,
      contests: formattedContests,
    });
  } catch (error) {
    console.error("Get contests error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load contests.",
    });
  }
};

export const getSingleContest = async (req, res) => {
  try {
    const contest = getContestById(
      req.params.contestId
    );

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found.",
      });
    }

    const contestProblems = contest.problemIds
      .map((problemId) =>
        getProblemById(problemId)
      )
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      contest: {
        ...contest,
        problems: contestProblems,
      },
    });
  } catch (error) {
    console.error("Get contest error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load contest.",
    });
  }
};