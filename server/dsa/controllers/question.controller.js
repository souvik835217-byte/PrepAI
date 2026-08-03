import {
  getAvailableTopics,
  getQuestionsByTopic,
  getQuestionById,
} from "../services/question.service.js";

export const fetchTopics = (req, res) => {
  try {
    const topics = getAvailableTopics();

    return res.status(200).json({
      success: true,
      count: topics.length,
      topics,
    });
  } catch (error) {
    console.error("Fetch topics error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load DSA topics",
      error: error.message,
    });
  }
};

export const fetchQuestionsByTopic = (req, res) => {
  try {
    const { topicId } = req.params;

    const questions = getQuestionsByTopic(topicId);

    if (!questions) {
      return res.status(404).json({
        success: false,
        message: `Topic not found: ${topicId}`,
      });
    }

    return res.status(200).json({
      success: true,
      topicId,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Fetch topic questions error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load questions",
      error: error.message,
    });
  }
};

export const fetchQuestionById = (req, res) => {
  try {
    const { questionId } = req.params;

    const question = getQuestionById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: `Question not found: ${questionId}`,
      });
    }

    return res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error("Fetch question error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load question",
      error: error.message,
    });
  }
};