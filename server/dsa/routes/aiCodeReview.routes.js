import express from "express";

import {
  generateAiCodeReview,
} from "../controllers/aiCodeReview.controller.js";

const router = express.Router();

router.post("/", generateAiCodeReview);

export default router;
