import express from "express";
import multer from "multer";
import path from "path";
import { analyzeResume } from "../controllers/resume.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname);

    const uniqueFileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    callback(null, uniqueFileName);
  },
});

const fileFilter = (req, file, callback) => {
  const isPdf =
    file.mimetype === "application/pdf" &&
    path.extname(file.originalname).toLowerCase() === ".pdf";

  if (isPdf) {
    callback(null, true);
  } else {
    callback(new Error("Only PDF resumes are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/analyze", upload.single("resume"), analyzeResume);

export default router;