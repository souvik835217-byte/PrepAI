import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import {
  FiAlertCircle,
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiLoader,
  FiMic,
  FiMicOff,
  FiPause,
  FiRefreshCw,
  FiUser,
  FiVolume2,
} from "react-icons/fi";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";


const Interview = () => {
  const navigate = useNavigate();

  const recognitionRef = useRef(null);
  const shouldKeepListeningRef = useRef(false);
  const recognitionStartPendingRef = useRef(false);
  const recognitionRestartTimeoutRef = useRef(null);
  const activeQuestionIdRef = useRef(null);
  const baseAnswerRef = useRef("");
  const sessionTranscriptRef = useRef("");
  const textareaRef = useRef(null);
  const isAdvancingRef = useRef(false);
  const validationResultsRef = useRef({});
  const answersRef = useRef({});

  const interviewData = useMemo(() => {
    try {
      const savedInterview =
        localStorage.getItem("interviewData");

      return savedInterview
        ? JSON.parse(savedInterview)
        : null;
    } catch (error) {
      console.error(
        "Could not read interview data:",
        error
      );

      return null;
    }
  }, []);

  const selectedCompany = useMemo(() => {
    return (
      interviewData?.company ||
      interviewData?.selectedCompany ||
      localStorage.getItem("selectedCompany") ||
      "General"
    );
  }, [interviewData]);

  const questions = useMemo(() => {
    return Array.isArray(interviewData?.questions)
      ? interviewData.questions
      : [];
  }, [interviewData]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [answers, setAnswers] = useState({});

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );

  const [hasStarted, setHasStarted] =
    useState(false);

  const [isListening, setIsListening] =
    useState(false);

  const [speechSupported, setSpeechSupported] =
    useState(true);

  const [statusMessage, setStatusMessage] =
    useState("");

  const [isPaused, setIsPaused] = useState(false);

  const [questionSpeaking, setQuestionSpeaking] =
    useState(false);

  const [questionFinished, setQuestionFinished] =
    useState(false);

  const [isCheckingAnswer, setIsCheckingAnswer] =
    useState(false);

  const [answerWarning, setAnswerWarning] =
    useState("");

  const [isRewriteMode, setIsRewriteMode] =
    useState(false);

  const [canContinueAnyway, setCanContinueAnyway] =
    useState(false);

  const [validationScore, setValidationScore] =
    useState(null);

  const [validationResults, setValidationResults] =
    useState({});

  const currentQuestion = questions[currentIndex];

  const currentAnswer = currentQuestion
    ? answers[currentQuestion.id] || ""
    : "";

  const isLastQuestion =
    currentIndex === questions.length - 1;

  const questionProgress =
    questions.length > 0
      ? ((currentIndex + 1) / questions.length) *
        100
      : 0;

  const timerProgress = currentQuestion
    ? (timeLeft /
        (currentQuestion.timeLimit || 60)) *
      100
    : 0;

  const interviewerName =
    interviewData?.interviewerName ||
    interviewData?.interviewer?.name ||
    "AI Interviewer";

  const interviewerRole =
    interviewData?.interviewerRole ||
    interviewData?.interviewer?.role ||
    "Technical Interviewer";

  const interviewerInitials = interviewerName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AI";

  const interviewerState = isCheckingAnswer
    ? "thinking"
    : isRewriteMode
    ? "revision"
    : isListening
    ? "listening"
    : questionSpeaking
    ? "speaking"
    : isPaused
    ? "paused"
    : "ready";

  const interviewerStatus = {
    thinking: {
      title: isLastQuestion
        ? "Preparing your final report"
        : "Reviewing your answer",
      message: isLastQuestion
        ? "Your responses are being evaluated across communication, technical depth and problem solving."
        : "A quick relevance check is running before the next question.",
    },
    revision: {
      title: "Waiting for your revision",
      message: "Add more detail, use a clear structure and support your answer with an example.",
    },
    listening: {
      title: "Listening to your answer",
      message: "Speak naturally and clearly. Your words will appear in the answer box.",
    },
    speaking: {
      title: "Asking the question",
      message: "The answer timer begins after the interviewer finishes speaking.",
    },
    paused: {
      title: "Interview paused",
      message: "Your remaining answer time is preserved until the interview resumes.",
    },
    ready: {
      title: "Ready for your response",
      message: "Use the microphone or keyboard. Explain your thinking as you would in a real interview.",
    },
  }[interviewerState];

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setQuestionSpeaking(false);
  }, []);

  const stopListening = useCallback(() => {
    shouldKeepListeningRef.current = false;
    recognitionStartPendingRef.current = false;
    activeQuestionIdRef.current = null;
    baseAnswerRef.current = "";
    sessionTranscriptRef.current = "";

    if (recognitionRestartTimeoutRef.current) {
      window.clearTimeout(
        recognitionRestartTimeoutRef.current
      );
      recognitionRestartTimeoutRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Microphone may already be stopped.
      }
    }

    setIsListening(false);
  }, []);

  const speakQuestion = useCallback(
    (questionText, startsAnswerTimer = false) => {
      if (
        !questionText ||
        !("speechSynthesis" in window)
      ) {
        if (startsAnswerTimer) {
          setQuestionFinished(true);
        }
        return;
      }

      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(questionText);

      utterance.lang = "en-IN";
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setQuestionSpeaking(true);
      };

      utterance.onend = () => {
        setQuestionSpeaking(false);

        if (startsAnswerTimer) {
          setQuestionFinished(true);
        }
      };

      utterance.onerror = () => {
        setQuestionSpeaking(false);

        if (startsAnswerTimer) {
          setQuestionFinished(true);
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    []
  );

  const finishInterview = useCallback(async () => {
    if (isAdvancingRef.current === "evaluating") {
      return;
    }

    isAdvancingRef.current = "evaluating";

    stopListening();
    stopSpeaking();

    setIsPaused(true);
    setIsCheckingAnswer(true);
    setStatusMessage(
      "Generating your interview performance report..."
    );
    setAnswerWarning("");

    const completedAnswers = questions.map(
      (question, index) => {
        const validation =
          validationResultsRef.current[question.id] ||
          validationResults[question.id] ||
          {};

        return {
          questionId: question.id,
          questionNumber: index + 1,
          category: question.category,
          difficulty: question.difficulty,
          question: question.question,
          reason: question.reason || "",
          expectedKeywords:
            question.expectedKeywords || [],
          answer:
            answersRef.current[question.id]?.trim() || "",
          timeLimit: question.timeLimit || 60,
          validationScore:
            Number.isFinite(Number(validation.score))
              ? Math.min(
                  100,
                  Math.max(
                    0,
                    Math.round(Number(validation.score))
                  )
                )
              : null,
          validationFeedback:
            validation.feedback || "",
          missingPoints: Array.isArray(
            validation.missingPoints
          )
            ? validation.missingPoints
            : [],
        };
      }
    );

    const session = {
      candidateName:
        interviewData?.candidateName ||
        "Candidate",
      targetRole:
        interviewData?.targetRole ||
        "Software Developer",
      company: selectedCompany,
      selectedCompany,
      interviewer:
        interviewData?.interviewer || null,
      interviewerName:
        interviewData?.interviewerName ||
        interviewData?.interviewer?.name ||
        "AI Interviewer",
      interviewerRole:
        interviewData?.interviewerRole ||
        interviewData?.interviewer?.role ||
        "Technical Interviewer",
      resumeSummary:
        interviewData?.resumeSummary || "",
      skills: Array.isArray(interviewData?.skills)
        ? interviewData.skills
        : [],
      answers: completedAnswers,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "interviewSession",
      JSON.stringify(session)
    );

    const clampScore = (value) => {
      const numeric = Number(value);

      if (!Number.isFinite(numeric)) {
        return 0;
      }

      return Math.min(
        100,
        Math.max(0, Math.round(numeric))
      );
    };

    const buildFallbackResult = () => {
      const getFallbackScore = (item) => {
        if (
          item.validationScore !== null &&
          item.validationScore !== undefined &&
          Number.isFinite(Number(item.validationScore))
        ) {
          return clampScore(item.validationScore);
        }

        // A submitted answer may be missing a validation score if
        // the validation request or final evaluation timed out.
        // Use a neutral baseline instead of incorrectly showing zero.
        return item.answer?.trim().length >= 15 ? 60 : 0;
      };

      const scores = completedAnswers.map(
        (item) => getFallbackScore(item)
      );

      const average =
        scores.length > 0
          ? Math.round(
              scores.reduce(
                (total, score) => total + score,
                0
              ) / scores.length
            )
          : 0;

      const categoryScore = (category) => {
        const matches = completedAnswers.filter(
          (item) => item.category === category
        );

        if (matches.length === 0) {
          return average;
        }

        return Math.round(
          matches.reduce(
            (total, item) =>
              total +
              getFallbackScore(item),
            0
          ) / matches.length
        );
      };

      return {
        overallScore: average,
        communication: categoryScore(
          "Introduction"
        ),
        technicalKnowledge: Math.round(
          (categoryScore("Project") +
            categoryScore("Technical")) /
            2
        ),
        confidence: average,
        grammar: average,
        problemSolving: categoryScore(
          "Problem Solving"
        ),
        strengths: completedAnswers
          .filter(
            (item) =>
              getFallbackScore(item) >= 75
          )
          .slice(0, 3)
          .map(
            (item) =>
              `Strong ${String(
                item.category || "interview"
              ).toLowerCase()} response`
          ),
        weaknesses: completedAnswers
          .filter(
            (item) =>
              getFallbackScore(item) < 75
          )
          .slice(0, 3)
          .map(
            (item) =>
              item.missingPoints?.[0] ||
              `Add more depth to your ${String(
                item.category || "interview"
              ).toLowerCase()} answer`
          ),
        questionAnalysis: completedAnswers.map(
          (item) => ({
            questionId: item.questionId,
            questionNumber:
              item.questionNumber,
            category: item.category,
            question: item.question,
            answer: item.answer,
            score: getFallbackScore(item),
            feedback:
              item.validationFeedback ||
              "Your answer was accepted.",
          })
        ),
        recommendationTitle:
          average >= 75
            ? "Build on your strong foundation"
            : "Focus on clearer and deeper answers",
        recommendation:
          "Use a clear structure, explain your decisions, and support each answer with a specific example or measurable outcome.",
        performanceLabel:
          average >= 90
            ? "Outstanding performance"
            : average >= 75
            ? "Strong performance"
            : average >= 60
            ? "Good foundation"
            : "Needs improvement",
      };
    };

    let finalEvaluationTimeoutId = null;

    try {
      console.log(
        "Starting final interview evaluation:",
        session
      );

      const controller = new AbortController();

      finalEvaluationTimeoutId = window.setTimeout(
        () =>
          controller.abort(
            new Error(
              "Final interview evaluation exceeded 120 seconds."
            )
          ),
        120000
      );

      const response = await fetch(
        `${API_URL}/api/interview/evaluate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            candidateName:
              session.candidateName,
            targetRole: session.targetRole,
            company: session.company,
            selectedCompany:
              session.selectedCompany,
            interviewer:
              session.interviewer,
            resumeSummary:
              session.resumeSummary,
            skills: session.skills,
            answers: session.answers,
            interviewSession: session,
          }),
        }
      );

      window.clearTimeout(finalEvaluationTimeoutId);
      finalEvaluationTimeoutId = null;

      const responseText =
        await response.text();

      let data = {};

      try {
        data = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        data = {
          message:
            responseText ||
            "The evaluation server returned invalid data.",
        };
      }

      console.log(
        "Final evaluation response:",
        {
          status: response.status,
          ok: response.ok,
          data,
        }
      );

      if (!response.ok || data.success === false) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to generate the interview report."
        );
      }

      const evaluationResult =
        data.result ||
        data.interviewResult ||
        data.evaluation ||
        data.report ||
        data.data?.result ||
        data.data?.interviewResult ||
        data.data?.evaluation ||
        data.data ||
        data;

      const normalizedResult =
        evaluationResult &&
        typeof evaluationResult === "object"
          ? evaluationResult
          : buildFallbackResult();

      localStorage.setItem(
        "interviewResult",
        JSON.stringify(normalizedResult)
      );

      navigate("/evaluating-interview", {
        replace: true,
        state: {
          result: normalizedResult,
          interviewResult:
            normalizedResult,
          interviewSession: session,
        },
      });
    } catch (error) {
      console.error(
        "Final interview evaluation error:",
        error
      );

      /*
        The report page will still work when the AI
        evaluation endpoint is temporarily unavailable.
        It uses the five validation scores as a fallback.
      */
      const fallbackResult =
        buildFallbackResult();

      localStorage.setItem(
        "interviewResult",
        JSON.stringify(fallbackResult)
      );

      navigate("/evaluating-interview", {
        replace: true,
        state: {
          result: fallbackResult,
          interviewResult:
            fallbackResult,
          interviewSession: session,
          evaluationWarning:
            error?.name === "AbortError" ||
            String(error?.message || "")
              .toLowerCase()
              .includes("aborted")
              ? "The AI evaluation timed out, so a report was generated from your saved answer-validation scores."
              : error?.message ||
                "The AI evaluation failed, so a fallback report was generated.",
        },
      });
    } finally {
      if (finalEvaluationTimeoutId) {
        window.clearTimeout(finalEvaluationTimeoutId);
      }

      setIsCheckingAnswer(false);
      setIsPaused(false);
      isAdvancingRef.current = false;
    }
  }, [
    answers,
    interviewData,
    navigate,
    questions,
    selectedCompany,
    stopListening,
    stopSpeaking,
    validationResults,
  ]);

  const moveToNextQuestion = useCallback(() => {
    if (isAdvancingRef.current) {
      return;
    }

    isAdvancingRef.current = true;

    stopListening();
    stopSpeaking();

    setAnswerWarning("");
    setIsRewriteMode(false);
    setCanContinueAnyway(false);
    setValidationScore(null);
    setIsCheckingAnswer(false);
    setStatusMessage("");

    if (isLastQuestion) {
      isAdvancingRef.current = false;
      finishInterview();
      return;
    }

    const nextIndex = currentIndex + 1;
    const nextQuestion = questions[nextIndex];

    setCurrentIndex(nextIndex);
    setTimeLeft(nextQuestion?.timeLimit || 60);
    setQuestionFinished(false);
    setIsPaused(false);

    window.setTimeout(() => {
      isAdvancingRef.current = false;
    }, 100);
  }, [
    currentIndex,
    finishInterview,
    isLastQuestion,
    questions,
    stopListening,
    stopSpeaking,
  ]);

  const saveCurrentAnswer = useCallback(
    (answerText) => {
      if (!currentQuestion) {
        return;
      }

      const updatedAnswers = {
        ...answersRef.current,
        [currentQuestion.id]: answerText.trim(),
      };

      answersRef.current = updatedAnswers;
      setAnswers(updatedAnswers);

      const savedAnswerList = questions.map(
        (question, index) => ({
          questionId: question.id,
          questionNumber: index + 1,
          category: question.category || "General",
          difficulty: question.difficulty || "Medium",
          question: question.question || "",
          answer:
            updatedAnswers[question.id]?.trim() || "",
          timeLimit: question.timeLimit || 60,
        })
      );

      localStorage.setItem(
        "interviewAnswers",
        JSON.stringify(savedAnswerList)
      );
    },
    [currentQuestion, questions]
  );

  const continueAfterValidation = useCallback(
    (message) => {
      setAnswerWarning("");
      setIsRewriteMode(false);
      setCanContinueAnyway(false);
      setIsCheckingAnswer(true);
      setIsPaused(true);
      setStatusMessage(message);

      window.setTimeout(() => {
        moveToNextQuestion();
      }, 900);
    },
    [moveToNextQuestion]
  );

  const validateAndContinue = async () => {
    if (!currentQuestion || isCheckingAnswer) {
      return;
    }

    const trimmedAnswer = currentAnswer.trim();

    stopListening();
    stopSpeaking();

    if (!trimmedAnswer) {
      setAnswerWarning(
        "Please provide an answer before continuing. The timer is still running."
      );
      setValidationScore(null);
      setIsRewriteMode(true);
      setCanContinueAnyway(false);
      setStatusMessage("");
      return;
    }

    if (trimmedAnswer.length < 15) {
      setAnswerWarning(
        "Your answer is too short. Add a little more detail before continuing."
      );
      setValidationScore(null);
      setIsRewriteMode(true);
      setCanContinueAnyway(false);
      setStatusMessage("");
      return;
    }

    saveCurrentAnswer(trimmedAnswer);

    setAnswerWarning("");
    setIsRewriteMode(false);
    setCanContinueAnyway(false);
    setValidationScore(null);
    setIsCheckingAnswer(true);
    setIsPaused(true);
    setStatusMessage("Checking whether your answer addresses the question...");

    let validationTimeoutId = null;

    try {
      const controller = new AbortController();

      validationTimeoutId = window.setTimeout(
        () => controller.abort(),
        15000
      );

      const response = await fetch(
        `${API_URL}/api/interview/check-answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            questionId: currentQuestion.id,
            question: currentQuestion.question,
            category:
              currentQuestion.category || "General",
            difficulty:
              currentQuestion.difficulty || "Medium",
            expectedKeywords:
              currentQuestion.expectedKeywords || [],
            answer: trimmedAnswer,
            candidateName:
              interviewData?.candidateName ||
              "Candidate",
            targetRole:
              interviewData?.targetRole ||
              "Software Developer",
            company: selectedCompany,
          }),
        }
      );

      window.clearTimeout(validationTimeoutId);
      validationTimeoutId = null;

      const responseText = await response.text();

      let data = {};

      try {
        data = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        data = {
          message:
            responseText ||
            "The validation server returned invalid data.",
        };
      }

      if (!response.ok || data.success === false) {
        throw new Error(
          data.error ||
            data.message ||
            "Could not validate the answer."
        );
      }

      const validation =
        data.validation ||
        data.result ||
        data.data?.validation ||
        data.data?.result ||
        data.data ||
        data;

      const rawScore =
        validation.score ??
        validation.relevanceScore ??
        validation.answerScore ??
        null;

      const normalizedScore = Number.isFinite(
        Number(rawScore)
      )
        ? Math.min(
            100,
            Math.max(0, Math.round(Number(rawScore)))
          )
        : null;

      const relevantValue =
        validation.isRelevant ??
        validation.relevant ??
        validation.isAnswerRelevant ??
        validation.accepted;

      const isRelevant =
        typeof relevantValue === "boolean"
          ? relevantValue
          : normalizedScore !== null
          ? normalizedScore >= 45
          : true;

      const feedback =
        validation.feedback ||
        validation.message ||
        validation.reason ||
        "";

      const missingPoints = Array.isArray(
        validation.missingPoints
      )
        ? validation.missingPoints
        : [];

      const normalizedValidation = {
        score: normalizedScore,
        feedback,
        missingPoints,
        isRelevant,
      };

      validationResultsRef.current = {
        ...validationResultsRef.current,
        [currentQuestion.id]:
          normalizedValidation,
      };

      setValidationResults((previous) => ({
        ...previous,
        [currentQuestion.id]:
          normalizedValidation,
      }));

      setValidationScore(normalizedScore);

      if (!isRelevant) {
        setIsCheckingAnswer(false);
        setIsPaused(true);
        setIsRewriteMode(true);
        setCanContinueAnyway(true);
        setStatusMessage("");

        setAnswerWarning(
          feedback ||
            "Your answer does not appear to directly address the question. You can rewrite it or continue with the current response."
        );

        return;
      }

      continueAfterValidation(
        isLastQuestion
          ? "Answer accepted. Preparing your final evaluation..."
          : "Answer accepted. Moving to the next question..."
      );
    } catch (error) {
      console.error(
        "Answer validation error:",
        error
      );

      /*
        A temporary validation failure should not block
        the whole interview. Save the answer and continue.
      */
      setValidationResults((previous) => ({
        ...previous,
        [currentQuestion.id]: {
          score: null,
          feedback:
            "The quick relevance check was unavailable. The answer will still be evaluated in the final report.",
          missingPoints: [],
          isRelevant: true,
        },
      }));

      validationResultsRef.current = {
        ...validationResultsRef.current,
        [currentQuestion.id]: {
          score: null,
          feedback:
            "The quick relevance check was unavailable. The answer will still be evaluated in the final report.",
          missingPoints: [],
          isRelevant: true,
        },
      };

      continueAfterValidation(
        isLastQuestion
          ? "Answer saved. Preparing your final evaluation..."
          : "Answer saved. Moving to the next question..."
      );
    } finally {
      if (validationTimeoutId) {
        window.clearTimeout(validationTimeoutId);
      }
    }
  };

  const handleContinueAnyway = () => {
    if (!currentQuestion || isCheckingAnswer) {
      return;
    }

    const trimmedAnswer = currentAnswer.trim();

    if (!trimmedAnswer) {
      setAnswerWarning(
        "Please provide an answer before continuing."
      );
      setCanContinueAnyway(false);
      return;
    }

    saveCurrentAnswer(trimmedAnswer);

    continueAfterValidation(
      isLastQuestion
        ? "Answer saved. Preparing your final evaluation..."
        : "Answer saved. Moving to the next question..."
    );
  };

  const handleRewriteAnswer = () => {
    setAnswerWarning("");
    setIsRewriteMode(false);
    setCanContinueAnyway(false);
    setValidationScore(null);

    setStatusMessage(
      "Rewrite your answer before the remaining time finishes."
    );

    // Resume from the exact remaining time.
    setIsPaused(false);

    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const updateTypedAnswer = (event) => {
    if (!currentQuestion) {
      return;
    }

    if (isListening) {
      stopListening();
    }

    const nextAnswer = event.target.value;

    answersRef.current = {
      ...answersRef.current,
      [currentQuestion.id]: nextAnswer,
    };

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: nextAnswer,
    }));

    /*
      Typing updates the active answer while the interview
      timer continues. Rewrite mode is controlled only by
      the answer-validation flow.
    */
    setStatusMessage("");

    if (!isRewriteMode) {
      setAnswerWarning("");
      setValidationScore(null);
    }
  };

  const startListening = () => {
    if (isCheckingAnswer || timeLeft <= 0) {
      return;
    }

    if (isPaused) {
      setStatusMessage(
        "Resume the interview before using the microphone."
      );
      return;
    }

    if (isRewriteMode) {
      setStatusMessage(
        "Click Rewrite answer before using the microphone."
      );
      return;
    }

    if (!speechSupported) {
      setStatusMessage(
        "Speech recognition is unavailable. Please type your answer."
      );
      return;
    }

    if (
      !recognitionRef.current ||
      !currentQuestion
    ) {
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    stopSpeaking();

    activeQuestionIdRef.current =
      currentQuestion.id;

    baseAnswerRef.current =
      currentAnswer.trim();
    sessionTranscriptRef.current = "";
    shouldKeepListeningRef.current = true;
    recognitionStartPendingRef.current = true;

    try {
      recognitionRef.current.start();
    } catch (error) {
      shouldKeepListeningRef.current = false;
      recognitionStartPendingRef.current = false;

      console.error(
        "Could not start microphone:",
        error
      );

      setStatusMessage(
        "The microphone is already active or unavailable."
      );
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang =
      window.navigator.language || "en-US";
    // Chrome on Windows can remain in a listening state without
    // emitting results in continuous mode. Each completed phrase is
    // restarted by onend below, which is more reliable.
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      recognitionStartPendingRef.current = false;
      setIsListening(true);
      setStatusMessage("Listening...");
    };

    recognition.onresult = (event) => {
      let sessionTranscript = "";

      for (
        let index = 0;
        index < event.results.length;
        index++
      ) {
        const transcript =
          event.results[index][0].transcript || "";

        sessionTranscript += ` ${transcript}`;
      }

      const questionId =
        activeQuestionIdRef.current;

      if (
        questionId === null ||
        questionId === undefined
      ) {
        return;
      }

      const existingAnswer =
        baseAnswerRef.current.trim();

      const spokenText = sessionTranscript
        .replace(/\s+/g, " ")
        .trim();

      if (!spokenText) {
        return;
      }

      sessionTranscriptRef.current = spokenText;

      const updatedAnswer = existingAnswer
        ? `${existingAnswer} ${spokenText}`.trim()
        : spokenText;

      answersRef.current = {
        ...answersRef.current,
        [questionId]: updatedAnswer,
      };

      setAnswers((previous) => ({
        ...previous,
        [questionId]: updatedAnswer,
      }));

      setAnswerWarning("");
      setIsRewriteMode(false);
      setValidationScore(null);
      setStatusMessage("Listening... your answer is being transcribed.");
    };

    recognition.onerror = (event) => {
      recognitionStartPendingRef.current = false;

      const isExpectedSilence =
        event.error === "no-speech";

      const isIntentionalStop =
        event.error === "aborted" &&
        !shouldKeepListeningRef.current;

      if (
        !isExpectedSilence &&
        !isIntentionalStop
      ) {
        console.error(
          "Speech recognition error:",
          event.error
        );
      }

      setIsListening(false);

      if (event.error === "not-allowed") {
        shouldKeepListeningRef.current = false;
        setStatusMessage(
          "Microphone permission was denied. You can type your answer."
        );
        return;
      }

      if (event.error === "no-speech") {
        setStatusMessage(
          "Listening... start speaking when you are ready."
        );
        return;
      }

      if (event.error === "audio-capture") {
        shouldKeepListeningRef.current = false;
        setStatusMessage(
          "No microphone was found. Check your device input settings."
        );
        return;
      }

      if (isIntentionalStop) {
        return;
      }

      if (
        event.error === "network" ||
        event.error === "service-not-allowed"
      ) {
        shouldKeepListeningRef.current = false;
      }

      setStatusMessage(
        "Speech recognition stopped. You can try again."
      );
    };

    recognition.onend = () => {
      recognitionStartPendingRef.current = false;
      setIsListening(false);

      const completedSession =
        sessionTranscriptRef.current.trim();

      if (
        activeQuestionIdRef.current &&
        completedSession
      ) {
        baseAnswerRef.current = baseAnswerRef.current
          ? `${baseAnswerRef.current} ${completedSession}`.trim()
          : completedSession;
        sessionTranscriptRef.current = "";
      }

      if (shouldKeepListeningRef.current) {
        recognitionRestartTimeoutRef.current =
          window.setTimeout(() => {
            recognitionRestartTimeoutRef.current = null;

            if (
              !shouldKeepListeningRef.current ||
              recognitionStartPendingRef.current
            ) {
              return;
            }

            try {
              recognitionStartPendingRef.current = true;
              recognition.start();
            } catch (error) {
              recognitionStartPendingRef.current = false;
              shouldKeepListeningRef.current = false;
              console.error(
                "Could not restart microphone:",
                error
              );
              setStatusMessage(
                "Speech recognition stopped. Click Speak answer to try again."
              );
            }
          }, 250);

        return;
      }

      setStatusMessage((previous) =>
        previous === "Listening..."
          ? "Listening stopped."
          : previous
      );
    };

    recognitionRef.current = recognition;

    return () => {
      shouldKeepListeningRef.current = false;

      if (recognitionRestartTimeoutRef.current) {
        window.clearTimeout(
          recognitionRestartTimeoutRef.current
        );
      }

      try {
        recognition.stop();
      } catch {
        // Recognition may already be stopped.
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (
      !hasStarted ||
      !currentQuestion ||
      isPaused ||
      isCheckingAnswer ||
      isRewriteMode
    ) {
      return;
    }

    const speechDelay = window.setTimeout(() => {
      speakQuestion(currentQuestion.question, true);
    }, 500);

    return () => {
      window.clearTimeout(speechDelay);
    };
  }, [
    currentIndex,
    currentQuestion,
    hasStarted,
    isPaused,
    isCheckingAnswer,
    isRewriteMode,
    speakQuestion,
  ]);

  useEffect(() => {
    if (
      !hasStarted ||
      !currentQuestion ||
      !questionFinished ||
      isPaused ||
      isCheckingAnswer
    ) {
      return;
    }

    if (timeLeft <= 0) {
      stopListening();
      stopSpeaking();

      setAnswerWarning("");
      setValidationScore(null);
      setIsRewriteMode(false);
      setStatusMessage(
        isLastQuestion
          ? "Time is over. Finishing the interview..."
          : "Time is over. Moving to the next question..."
      );

      moveToNextQuestion();
      return;
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((previous) =>
        Math.max(previous - 1, 0)
      );
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    currentQuestion,
    hasStarted,
    isCheckingAnswer,
    isLastQuestion,
    isPaused,
    moveToNextQuestion,
    questionFinished,
    stopListening,
    stopSpeaking,
    timeLeft,
  ]);

  const startInterview = () => {
    setHasStarted(true);
    setTimeLeft(currentQuestion?.timeLimit || 60);
    setQuestionFinished(false);
    setStatusMessage("");
    setIsPaused(false);
  };

  if (
    !interviewData ||
    questions.length === 0
  ) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f2f5fa] px-5">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[430px] w-[430px] rounded-full bg-blue-200/40 blur-3xl" />

        <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/80 bg-white/90 p-8 text-center shadow-xl shadow-slate-300/30 backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-3xl text-amber-600">
            <FiAlertCircle />
          </div>

          <h1 className="mt-6 text-2xl font-semibold">
            No interview found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Upload your resume and generate your
            personalized interview first.
          </p>

          <button
            onClick={() => navigate("/resume")}
            className="mt-7 w-full rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Upload resume
          </button>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#f2f5fa] text-slate-900">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-blue-200/45 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-44 -right-32 h-[480px] w-[480px] rounded-full bg-indigo-200/40 blur-3xl" />

        <header className="relative z-10 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white">
                P
              </div>

              <div className="text-left">
                <p className="font-bold">PrepAI</p>

                <p className="text-xs text-slate-500">
                  Mock interview
                </p>
              </div>
            </button>
          </div>
        </header>

        <main className="relative z-10 mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-16">
          <button
            onClick={() =>
              navigate("/resume-analysis")
            }
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <FiArrowLeft />
            Back to interview profile
          </button>

          <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.section
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-[#172554] p-8 text-white shadow-2xl shadow-slate-400/20 sm:p-10"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                <FiUser />
              </div>

              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.17em] text-blue-300">
                Candidate profile
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-tight">
                {interviewData.candidateName ||
                  "Candidate"}
              </h1>

              <p className="mt-2 text-base text-white/60">
                {interviewData.targetRole ||
                  "Software Developer"}
              </p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                <p className="text-sm leading-7 text-white/65">
                  {interviewData.resumeSummary ||
                    "Your personalized interview has been prepared from your resume."}
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <FiBriefcase className="text-blue-300" />
                  {selectedCompany} interview
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/40">
                    Interviewer
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white/85">
                    {interviewData.interviewerName ||
                      interviewData.interviewer?.name ||
                      "AI Interviewer"}
                  </p>

                  <p className="mt-1 text-xs text-white/50">
                    {interviewData.interviewerRole ||
                      interviewData.interviewer?.role ||
                      "Technical Interviewer"}{" "}
                    · {selectedCompany}
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-[28px] border border-white/80 bg-white/90 p-8 shadow-xl shadow-slate-300/25 backdrop-blur-xl sm:p-10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                Interview briefing
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Your {selectedCompany} interview is ready.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Answer naturally using your microphone or keyboard. Each response receives a quick relevance check, followed by a complete evaluation after the final question.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  `${questions.length} personalized questions`,
                  `${questions[0]?.timeLimit || 60} seconds for each answer`,
                  "Voice and typing supported",
                  "Quick relevance check after each answer",
                  "Complete AI evaluation at the end",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <FiCheckCircle className="shrink-0 text-emerald-600" />

                    <span className="text-sm text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={startInterview}
                className="group mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Start interview

                <FiArrowRight className="transition group-hover:translate-x-1" />
              </button>
            </motion.section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eef2f7] text-slate-900">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[430px] w-[430px] rounded-full bg-blue-200/35 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-44 -right-32 h-[460px] w-[460px] rounded-full bg-indigo-200/35 blur-3xl" />

      <header className="relative z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white">
                P
              </div>

              <div>
                <p className="font-bold">
                  PrepAI Interview
                </p>

                <p className="text-xs text-slate-500">
                  {selectedCompany} · {interviewData.targetRole}
                </p>
              </div>
            </div>

          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${questionProgress}%`,
              }}
            />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[0.68fr_1.32fr]">
          <section className="flex flex-col rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-[#172554] p-7 text-white shadow-2xl shadow-slate-400/20 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-base font-bold tracking-wide text-white">
                  {interviewerInitials}
                </div>

                <div>
                  <p className="font-semibold">{interviewerName}</p>

                  <p className="mt-0.5 text-xs text-white/45">
                    {interviewerRole} · {selectedCompany}
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-xs text-emerald-300">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </span>
                    Live interview session
                  </div>
                </div>
              </div>

              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/55">
                {interviewerState}
              </span>
            </div>

            <div className="mt-8 flex min-h-[300px] flex-1 flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center">
              <div className="relative flex h-40 w-40 items-center justify-center">
                <motion.div
                  animate={
                    interviewerState === "speaking"
                      ? { scale: [1, 1.06, 1] }
                      : interviewerState === "listening"
                      ? { scale: [1, 1.04, 1] }
                      : { y: [0, -4, 0] }
                  }
                  transition={{
                    duration:
                      interviewerState === "speaking" ? 0.8 : 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`absolute inset-2 rounded-full border ${
                    interviewerState === "thinking"
                      ? "border-amber-300/60 bg-amber-400/10"
                      : interviewerState === "listening"
                      ? "border-blue-300/70 bg-blue-400/10"
                      : interviewerState === "speaking"
                      ? "border-indigo-300/70 bg-indigo-400/10"
                      : interviewerState === "revision"
                      ? "border-orange-300/60 bg-orange-400/10"
                      : "border-white/15 bg-white/[0.04]"
                  }`}
                />

                {(interviewerState === "speaking" ||
                  interviewerState === "listening") && (
                  <motion.div
                    initial={{ opacity: 0.55, scale: 0.8 }}
                    animate={{ opacity: 0, scale: 1.35 }}
                    transition={{
                      duration: 1.3,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    className="absolute inset-1 rounded-full border border-blue-300/40"
                  />
                )}

                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-white/15 to-white/[0.04] shadow-2xl">
                  {interviewerState === "thinking" ? (
                    <FiLoader className="animate-spin text-4xl text-amber-200" />
                  ) : interviewerState === "listening" ? (
                    <FiMic className="text-4xl text-blue-200" />
                  ) : interviewerState === "speaking" ? (
                    <FiVolume2 className="text-4xl text-indigo-200" />
                  ) : interviewerState === "revision" ? (
                    <FiEdit3 className="text-4xl text-orange-200" />
                  ) : (
                    <span className="text-3xl font-bold tracking-wide text-white">
                      {interviewerInitials}
                    </span>
                  )}
                </div>
              </div>

              {interviewerState === "speaking" && (
                <div className="mt-1 flex h-7 items-end gap-1">
                  {[0, 1, 2, 3, 4].map((bar) => (
                    <motion.span
                      key={bar}
                      animate={{ height: [6, 24, 10, 18, 6] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: bar * 0.08,
                      }}
                      className="w-1.5 rounded-full bg-indigo-300"
                    />
                  ))}
                </div>
              )}

              <p className="mt-5 text-lg font-semibold">
                {interviewerStatus.title}
              </p>

              <p className="mt-2 max-w-sm text-sm leading-6 text-white/50">
                {interviewerStatus.message}
              </p>

              {currentQuestion?.question && (
                <div className="mt-6 w-full rounded-2xl border border-white/10 bg-slate-950/30 p-4 text-left">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300">
                    Current question
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/70">
                    {currentQuestion.question}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-white/40">
                Candidate
              </p>

              <p className="mt-2 font-semibold">
                {interviewData.candidateName}
              </p>

              <p className="mt-1 text-sm text-white/50">
                {interviewData.targetRole}
              </p>

              <p className="mt-2 text-xs font-medium text-blue-300">
                Target company: {selectedCompany}
              </p>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-xl shadow-slate-300/25 backdrop-blur-xl sm:p-7">
            <div className="sticky top-4 z-20 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-md backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                    Question {currentIndex + 1} of{" "}
                    {questions.length}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {currentQuestion.category} ·{" "}
                    {currentQuestion.difficulty}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${
                      isPaused ||
                      isCheckingAnswer
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : timeLeft <= 10
                        ? "border-red-200 bg-red-50 text-red-600"
                        : "border-blue-200 bg-blue-50 text-blue-700"
                    }`}
                  >
                    <FiClock
                      className={
                        timeLeft <= 10 &&
                        !isPaused &&
                        !isCheckingAnswer
                          ? "animate-pulse"
                          : ""
                      }
                    />

                    <span>
                      00:
                      {String(timeLeft).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    {!questionFinished &&
                    !isPaused &&
                    !isCheckingAnswer ? (
                      <span className="text-[10px] uppercase tracking-wide">
                        Waiting
                      </span>
                    ) : (isPaused ||
                      isCheckingAnswer) && (
                      <span className="text-[10px] uppercase tracking-wide">
                        Paused
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (questionSpeaking) {
                        stopSpeaking();
                        setQuestionFinished(true);
                      } else {
                        speakQuestion(
                          currentQuestion.question
                        );
                      }
                    }}
                    disabled={
                      isPaused ||
                      isCheckingAnswer ||
                      isRewriteMode
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {questionSpeaking ? (
                      <FiPause />
                    ) : (
                      <FiVolume2 />
                    )}

                    <span className="hidden sm:inline">
                      {questionSpeaking
                        ? "Stop audio"
                        : "Play question"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    timeLeft <= 10
                      ? "bg-red-500"
                      : "bg-blue-600"
                  }`}
                  style={{
                    width: `${timerProgress}%`,
                  }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3 }}
                className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 sm:p-7"
              >
                <p className="text-xl font-semibold leading-8 tracking-tight text-slate-900 sm:text-2xl">
                  {currentQuestion.question}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="answer"
                  className="text-sm font-semibold text-slate-800"
                >
                  Your answer
                </label>

                <span className="text-xs text-slate-400">
                  Speak naturally or type
                </span>
              </div>

              <textarea
                ref={textareaRef}
                id="answer"
                value={currentAnswer}
                onChange={updateTypedAnswer}
                disabled={isCheckingAnswer}
                placeholder="Your answer will appear here..."
                className="mt-3 min-h-[220px] w-full resize-none rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />

              <div className="mt-2 flex justify-end">
                <span className="text-xs text-slate-400">
                  {currentAnswer.trim().length} characters
                </span>
              </div>
            </div>

            {answerWarning && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <FiAlertCircle />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-amber-900">
                        Answer needs more detail
                      </p>

                      {validationScore !== null && (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                          Answer score {validationScore}%
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-amber-800">
                      {answerWarning}
                    </p>

                    {isRewriteMode && (
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={handleRewriteAnswer}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
                        >
                          <FiRefreshCw />
                          Rewrite answer
                        </button>

                        {canContinueAnyway && (
                          <button
                            onClick={handleContinueAnyway}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
                          >
                            Continue anyway
                            <FiArrowRight />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {statusMessage && !answerWarning && (
              <div
                className={`mt-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
                  isCheckingAnswer
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : isListening
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {isCheckingAnswer ? (
                  <FiLoader className="mt-0.5 shrink-0 animate-spin" />
                ) : isListening ? (
                  <FiMic className="mt-0.5 shrink-0" />
                ) : (
                  <FiAlertCircle className="mt-0.5 shrink-0" />
                )}

                <span>{statusMessage}</span>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={startListening}
                disabled={
                  !speechSupported ||
                  isPaused ||
                  isCheckingAnswer ||
                  isRewriteMode ||
                  timeLeft <= 0
                }
                className={`flex flex-1 items-center justify-center gap-3 rounded-xl px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  isListening
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {isListening ? (
                  <>
                    <FiMicOff />
                    Stop listening
                  </>
                ) : (
                  <>
                    <FiMic />
                    Speak answer
                  </>
                )}
              </button>

              <button
                onClick={validateAndContinue}
                disabled={
                  isCheckingAnswer ||
                  isRewriteMode
                }
                className="group flex flex-[1.3] items-center justify-center gap-3 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCheckingAnswer ? (
                  <>
                    <FiLoader className="animate-spin" />
                    {isLastQuestion
                      ? "Preparing report..."
                      : "Checking answer..."}
                  </>
                ) : isLastQuestion ? (
                  <>
                    Submit and finish
                    <FiCheckCircle />
                  </>
                ) : (
                  <>
                    Save and continue
                    <FiArrowRight className="transition group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              The timer runs while you answer. Each submission receives a quick relevance check, and the complete interview is evaluated after the final question.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Interview;
