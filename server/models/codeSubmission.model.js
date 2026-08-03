import mongoose from "mongoose";

const codeSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    questionId: {
      type: String,
      required: true,
    },

    questionTitle: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    company: {
      type: String,
      default: "General",
    },

    language: {
      type: String,
      required: true,
    },

    sourceCode: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Compilation Error",
        "Runtime Error",
        "Time Limit Exceeded",
      ],
      required: true,
    },

    accepted: {
      type: Boolean,
      default: false,
    },

    passedTestCases: Number,

    totalTestCases: Number,

    failedTestCase: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    executionTime: Number,

    memory: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "CodeSubmission",
  codeSubmissionSchema
);
