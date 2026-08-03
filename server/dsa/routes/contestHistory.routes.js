import express from "express";

import {
  deleteContestResult,
  getContestResultById,
  getUserContestHistory,
  saveContestResult,
} from "../controllers/contestHistory.controller.js";

const router = express.Router();

router.post("/", saveContestResult);
router.get("/user/:uid", getUserContestHistory);
router.get("/:id", getContestResultById);
router.delete("/:id", deleteContestResult);

export default router;
