import express from "express";

import {
  runCode,
  runCustomCode,
} from "../controllers/codeExecution.controller.js";

import {
  submitCode,
} from "../controllers/codeSubmission.controller.js";

const router = express.Router();

router.post("/run", runCode);
router.post("/custom-run", runCustomCode);
router.post("/submit", submitCode);

export default router;
