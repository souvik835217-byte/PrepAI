import express from "express";


import {
  generateInterviewQuestions,
  checkInterviewAnswer,
} from "../controllers/interview.controller.js";
import { evaluateInterview } from "../controllers/interviewEvaluation.controller.js";

const router = express.Router();

router.post("/evaluate", evaluateInterview);

router.post(
  "/generate-questions",
  generateInterviewQuestions
);

router.post(
  "/check-answer",
  checkInterviewAnswer
);

export default router;
