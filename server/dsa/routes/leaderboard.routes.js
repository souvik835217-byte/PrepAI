import express from "express";

import {
  getContestLeaderboard,
} from "../controllers/leaderboard.controller.js";

const router = express.Router();

router.get(
  "/contest/:contestId",
  getContestLeaderboard
);

export default router;