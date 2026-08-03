import express from "express";

import {
  getAllProblems,
  getSingleProblem,
  getAllContests,
  getSingleContest,
} from "../controllers/contest.controller.js";

const router = express.Router();

router.get("/problems", getAllProblems);

router.get(
  "/problems/:problemId",
  getSingleProblem
);

router.get("/contests", getAllContests);

router.get(
  "/contests/:contestId",
  getSingleContest
);

export default router;