import express from "express";

import {
  saveInterviewHistory,
  getUserInterviewHistory,
  getInterviewHistoryById,
  getInterviewAnalytics,
  deleteInterviewHistory,
} from "../controllers/interviewHistory.controller.js";

const router = express.Router();

// Save a completed interview
router.post("/", saveInterviewHistory);

// Get all interviews for one Firebase user
router.get(
  "/user/:firebaseUid",
  getUserInterviewHistory
);

// Get dashboard analytics for one Firebase user
router.get(
  "/analytics/:firebaseUid",
  getInterviewAnalytics
);

// Get one complete interview report
router.get(
  "/report/:id",
  getInterviewHistoryById
);

// Delete one interview
router.delete(
  "/:id",
  deleteInterviewHistory
);

export default router;