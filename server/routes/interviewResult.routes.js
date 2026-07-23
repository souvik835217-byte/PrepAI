import express from "express";
import { generateInterviewResult } from "../controllers/interviewResult.controller.js";

const router = express.Router();

router.post("/result", generateInterviewResult);

export default router;