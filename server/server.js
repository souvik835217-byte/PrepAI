import "dotenv/config";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

import resumeRoutes from "./routes/resume.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import interviewResultRoutes from "./routes/interviewResult.routes.js";
import interviewHistoryRoutes from "./routes/interviewHistory.routes.js";
import dashboardAnalyticsRoutes from "./routes/dashboardAnalytics.routes.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

/* =========================================================
   CORS
========================================================= */

const allowedOrigins = [
  // Local development
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5178",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5178",

  // Vercel production and current deployment domains
  "https://prep-ai-souvik9.vercel.app",
  "https://prep-ai-umber-three.vercel.app",
  "https://prep-ipavvzp3a-souvik9.vercel.app",
];

const isAllowedVercelPreview = (origin) => {
  try {
    const url = new URL(origin);

    return (
      url.protocol === "https:" &&
      url.hostname.endsWith("-souvik9.vercel.app")
    );
  } catch {
    return false;
  }
};

const corsOptions = {
  origin(origin, callback) {
    // Allows requests from Postman, Render health checks, and server-to-server calls
    if (!origin) {
      return callback(null, true);
    }

    if (
      allowedOrigins.includes(origin) ||
      isAllowedVercelPreview(origin)
    ) {
      return callback(null, true);
    }

    console.warn(`⚠️ CORS blocked origin: ${origin}`);

    return callback(
      new Error(`Origin ${origin} is not allowed by CORS`)
    );
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

/* =========================================================
   Body parsing
========================================================= */

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/* =========================================================
   Upload folder
========================================================= */

const uploadsPath = path.resolve("uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, {
    recursive: true,
  });
}

/* =========================================================
   Health routes
========================================================= */

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "PrepAI backend is running",
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "PrepAI API is healthy",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

/* =========================================================
   API routes
========================================================= */

app.use("/api/resume", resumeRoutes);

app.use("/api/interview", interviewRoutes);

app.use(
  "/api/interview-results",
  interviewResultRoutes
);

app.use(
  "/api/interview-history",
  interviewHistoryRoutes
);

app.use(
  "/api/dashboard-analytics",
  dashboardAnalyticsRoutes
);

/* =========================================================
   Unknown route
========================================================= */

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================================================
   Error handler
========================================================= */

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error("Server error:", error);

  if (error.message?.includes("not allowed by CORS")) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }

  if (error.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(error.status || 500).json({
    success: false,
    message:
      error.message || "Internal server error",
  });
});

/* =========================================================
   Start application
========================================================= */

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI environment variable is missing"
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn(
        "⚠️ GEMINI_API_KEY environment variable is missing"
      );
    }

    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log("✅ MongoDB Connected");

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `🚀 PrepAI server running on port ${PORT}`
      );

      console.log(
        `✅ Health check: /api/health`
      );

      console.log(
        `✅ History API: /api/interview-history`
      );
    });

    server.on("error", (error) => {
      console.error(
        "❌ Express server error:",
        error
      );
    });
  } catch (error) {
    console.error(
      "❌ Failed to start PrepAI server:"
    );

    console.error(error.message);

    process.exit(1);
  }
};

startServer();