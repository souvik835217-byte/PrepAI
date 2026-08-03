import express from "express";
import { generateCodeHint } from "../controllers/codeHint.controller.js";

const router = express.Router();

router.post("/", generateCodeHint);

export default router;