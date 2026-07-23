import mongoose from "mongoose";

const interviewHistorySchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      index: true,
    },

    candidateName: {
      type: String,
      default: "Candidate",
    },

    targetRole: {
      type: String,
      default: "Software Developer",
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    communication: {
      type: Number,
      default: 0,
    },

    technicalKnowledge: {
      type: Number,
      default: 0,
    },

    confidence: {
      type: Number,
      default: 0,
    },

    grammar: {
      type: Number,
      default: 0,
    },

    problemSolving: {
      type: Number,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    recommendationTitle: {
      type: String,
      default: "",
    },

    recommendation: {
      type: String,
      default: "",
    },

    questionAnalysis: [
      {
        question: {
          type: String,
          default: "",
        },

        answer: {
          type: String,
          default: "",
        },

        score: {
          type: Number,
          default: 0,
        },

        feedback: {
          type: String,
          default: "",
        },
      },
    ],

    interviewDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "InterviewHistory",
  interviewHistorySchema
);