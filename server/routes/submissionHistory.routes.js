import express from "express";

import {
  deleteSubmission,
  getQuestionSubmissionHistory,
  getUserSubmissionAnalytics,
  getUserSubmissions,
} from "../controllers/submissionHistory.controller.js";

const router = express.Router();

router.get(
  "/history/:questionId",
  getQuestionSubmissionHistory
);

router.get(
  "/user/:userId",
  getUserSubmissions
);

router.get(
  "/analytics/:uid",
  getUserSubmissionAnalytics
);

router.delete(
  "/:submissionId",
  deleteSubmission
);

export default router;
