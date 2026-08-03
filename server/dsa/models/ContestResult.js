import mongoose from "mongoose";

const contestSubmissionSchema = new mongoose.Schema(
  {
    problemId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    difficulty: String,

    language: String,

    status: {
      type: String,
      enum: ["Accepted", "Failed", "Not Attempted"],
      default: "Not Attempted",
    },

    points: {
      type: Number,
      default: 0,
    },

    passedTestCases: {
      type: Number,
      default: 0,
    },

    totalTestCases: {
      type: Number,
      default: 0,
    },

    runtime: {
      type: Number,
      default: 0,
    },

    memory: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const contestResultSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    contestId: {
      type: String,
      required: true,
      index: true,
    },

    contestTitle: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      default: 0,
    },

    totalScore: {
      type: Number,
      default: 0,
    },

    solved: {
      type: Number,
      default: 0,
    },

    totalProblems: {
      type: Number,
      default: 0,
    },

    accuracy: {
      type: Number,
      default: 0,
    },

    duration: {
      type: Number,
      default: 0,
    },

    timeUsed: {
      type: Number,
      default: 0,
    },

    rank: {
      type: Number,
      default: null,
    },

    submissions: [contestSubmissionSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ContestResult",
  contestResultSchema
);