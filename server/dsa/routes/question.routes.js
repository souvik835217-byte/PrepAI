import express from "express";

import {
  fetchTopics,
  fetchQuestionsByTopic,
  fetchQuestionById,
} from "../controllers/question.controller.js";

const router = express.Router();

router.get("/topics", fetchTopics);

router.get(
  "/questions/topic/:topicId",
  fetchQuestionsByTopic
);

router.get(
  "/questions/:questionId",
  fetchQuestionById
);

export default router;