import express from "express";

import {
  generateLearningRoadmap,
} from "../controllers/learningRoadmap.controller.js";

const router = express.Router();

router.post("/", generateLearningRoadmap);

export default router;