import mongoose from "mongoose";

const contestResultSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      default: "",
    },
    photoURL: {
      type: String,
      default: "",
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
      min: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    solved: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalProblems: {
      type: Number,
      default: 0,
      min: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    timeUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },
    rank: {
      type: Number,
      default: null,
      min: 1,
    },
    submissions: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ContestResult",
  contestResultSchema
);
