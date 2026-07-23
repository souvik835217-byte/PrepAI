import mongoose from "mongoose";

const questionAnalysisSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      default: "",
    },

    questionNumber: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      default: "General",
    },

    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    feedback: {
      type: String,
      default: "",
    },

    missingPoints: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  }
);

const interviewResultSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "",
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

    company: {
      type: String,
      default: "General",
    },

    interviewerName: {
      type: String,
      default: "AI Interviewer",
    },

    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    communication: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    technicalKnowledge: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    grammar: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    problemSolving: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    performanceLabel: {
      type: String,
      default: "",
    },

    performanceSummary: {
      type: String,
      default: "",
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

    questionAnalysis: {
      type: [questionAnalysisSchema],
      default: [],
    },

    resumeSummary: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    completedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const InterviewResult = mongoose.model(
  "InterviewResult",
  interviewResultSchema
);

export default InterviewResult;