import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import {
  FaComments,
  FaCode,
  FaMicrophone,
  FaLanguage,
  FaLightbulb,
  FaArrowLeft,
  FaRedoAlt,
  FaDownload,
  FaMagic,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

import CircularScore from "../components/CircularScore";
import ScoreCard from "../components/ScoreCard";
import StrengthCard from "../components/StrengthCard";
import WeaknessCard from "../components/WeaknessCard";
import QuestionBreakdown from "../components/QuestionBreakdown";
import { auth } from "../firebase/firebase.js";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : "")
).replace(/\/+$/, "");

const clampScore = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(numericValue)));
};

const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

const safeText = (value, fallback = "") => {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmedValue = value.trim();
  return trimmedValue || fallback;
};


const getAnswerText = (item) => {
  if (!item || typeof item !== "object") {
    return "";
  }

  const possibleAnswers = [
    item.answer,
    item.candidateAnswer,
    item.userAnswer,
    item.response,
    item.transcript,
    item.typedAnswer,
    item.finalAnswer,
    item.submittedAnswer,
  ];

  for (const value of possibleAnswers) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

const getQuestionId = (item, index) => {
  return String(
    item?.questionId ??
      item?.id ??
      item?._id ??
      item?.questionNumber ??
      index + 1
  );
};

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  const [result, setResult] = useState(null);
  const [interviewSession, setInterviewSession] = useState(null);
  const [storedInterviewAnswers, setStoredInterviewAnswers] =
    useState([]);
  const [isLoadingResult, setIsLoadingResult] = useState(true);
  const [evaluationWarning, setEvaluationWarning] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [historySaving, setHistorySaving] = useState(false);
  const [historySaved, setHistorySaved] = useState(false);
  const [historySaveError, setHistorySaveError] = useState("");

  const saveAttemptedRef = useRef(false);

  const openedFromHistory =
    location.state?.fromHistory === true;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setCurrentUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    try {
      const navigationResult =
        location.state?.result ||
        location.state?.interviewResult ||
        location.state?.data?.result ||
        null;

      const navigationSession =
        location.state?.interviewSession ||
        location.state?.session ||
        null;

      const savedResultText =
        localStorage.getItem("interviewResult");

      const savedSessionText =
        localStorage.getItem("interviewSession");

      const savedAnswersText =
        localStorage.getItem("interviewAnswers");

      const savedResult = savedResultText
        ? JSON.parse(savedResultText)
        : null;

      const savedSession = savedSessionText
        ? JSON.parse(savedSessionText)
        : null;

      const savedAnswers = savedAnswersText
        ? JSON.parse(savedAnswersText)
        : [];

      setStoredInterviewAnswers(
        Array.isArray(savedAnswers)
          ? savedAnswers
          : []
      );

      const finalResult = navigationResult || savedResult;
      const finalSession = navigationSession || savedSession;

      if (finalResult) {
        setResult(finalResult);

        localStorage.setItem(
          "interviewResult",
          JSON.stringify(finalResult)
        );
      }

      if (finalSession) {
        setInterviewSession(finalSession);

        localStorage.setItem(
          "interviewSession",
          JSON.stringify(finalSession)
        );
      }

      if (location.state?.evaluationWarning) {
        setEvaluationWarning(location.state.evaluationWarning);
      }
    } catch (error) {
      console.error("Unable to read interview result:", error);
    } finally {
      setIsLoadingResult(false);
    }
  }, [location.state]);

  const scores = useMemo(() => {
    if (!result) {
      return [];
    }

    return [
      {
        title: "Communication",
        score: clampScore(result.communication),
        icon: <FaComments />,
      },
      {
        title: "Technical Knowledge",
        score: clampScore(result.technicalKnowledge),
        icon: <FaCode />,
      },
      {
        title: "Confidence",
        score: clampScore(result.confidence),
        icon: <FaMicrophone />,
      },
      {
        title: "Grammar",
        score: clampScore(result.grammar),
        icon: <FaLanguage />,
      },
      {
        title: "Problem Solving",
        score: clampScore(result.problemSolving),
        icon: <FaLightbulb />,
      },
    ];
  }, [result]);


  const questionAnalysis = useMemo(() => {
    const analysisItems = safeArray(
      result?.questionAnalysis
    );

    const sessionAnswers = safeArray(
      interviewSession?.answers ||
        interviewSession?.responses ||
        interviewSession?.submittedAnswers
    );

    const fallbackAnswers = safeArray(
      storedInterviewAnswers
    );

    const itemCount = Math.max(
      analysisItems.length,
      sessionAnswers.length,
      fallbackAnswers.length
    );

    return Array.from(
      { length: itemCount },
      (_, index) => {
        const analysisItem =
          analysisItems[index] || {};

        const analysisId = getQuestionId(
          analysisItem,
          index
        );

        const matchingSessionAnswer =
          sessionAnswers.find(
            (answerItem, answerIndex) =>
              getQuestionId(
                answerItem,
                answerIndex
              ) === analysisId
          ) ||
          sessionAnswers[index] ||
          {};

        const matchingFallbackAnswer =
          fallbackAnswers.find(
            (answerItem, answerIndex) => {
              const fallbackId = getQuestionId(
                answerItem,
                answerIndex
              );

              const sameId =
                fallbackId === analysisId;

              const sameQuestion =
                safeText(answerItem?.question) &&
                safeText(answerItem?.question) ===
                  safeText(
                    analysisItem?.question ||
                      matchingSessionAnswer?.question
                  );

              return sameId || sameQuestion;
            }
          ) ||
          fallbackAnswers[index] ||
          {};

        const answer =
          getAnswerText(analysisItem) ||
          getAnswerText(matchingSessionAnswer) ||
          getAnswerText(matchingFallbackAnswer);

        const question =
          safeText(analysisItem?.question) ||
          safeText(
            matchingSessionAnswer?.question
          ) ||
          safeText(
            matchingSessionAnswer?.questionText
          ) ||
          safeText(
            matchingFallbackAnswer?.question
          ) ||
          safeText(
            matchingFallbackAnswer?.questionText
          ) ||
          `Question ${index + 1}`;

        const score =
          analysisItem?.score ??
          analysisItem?.validationScore ??
          matchingSessionAnswer?.score ??
          matchingSessionAnswer?.validationScore ??
          0;

        const feedback =
          safeText(analysisItem?.feedback) ||
          safeText(
            analysisItem?.validationFeedback
          ) ||
          safeText(
            matchingSessionAnswer?.feedback
          ) ||
          safeText(
            matchingSessionAnswer
              ?.validationFeedback
          ) ||
          "No feedback was provided.";

        return {
          ...matchingFallbackAnswer,
          ...matchingSessionAnswer,
          ...analysisItem,
          questionId:
            analysisItem?.questionId ||
            matchingSessionAnswer?.questionId ||
            analysisId,
          questionNumber:
            analysisItem?.questionNumber ||
            matchingSessionAnswer
              ?.questionNumber ||
            index + 1,
          question,
          answer,
          candidateAnswer: answer,
          score: clampScore(score),
          feedback,
        };
      }
    );
  }, [result, interviewSession, storedInterviewAnswers]);

  // Only evaluation data is shown and stored after the interview.
  // Raw candidate responses remain available only long enough to generate the evaluation.
  const evaluationOnlyQuestionAnalysis = useMemo(
    () =>
      questionAnalysis.map((item, index) => ({
        questionId:
          item.questionId || `question-${index + 1}`,
        questionNumber:
          item.questionNumber || index + 1,
        category: item.category || "General",
        question: item.question || `Question ${index + 1}`,
        score: clampScore(
          item.score ?? item.validationScore ?? 0
        ),
        feedback:
          item.feedback ||
          item.validationFeedback ||
          "No feedback was provided.",
      })),
    [questionAnalysis]
  );

  useEffect(() => {
    if (!result || questionAnalysis.length === 0) {
      return;
    }

    const normalizedAnswers =
      evaluationOnlyQuestionAnalysis.map((item) => ({
        questionId: item.questionId,
        questionNumber: item.questionNumber,
        category: item.category,
        question: item.question,
        validationScore: item.score,
        validationFeedback: item.feedback,
      }));

    const mergedResult = {
      ...result,
      questionAnalysis: evaluationOnlyQuestionAnalysis,
    };

    localStorage.setItem(
      "interviewResult",
      JSON.stringify(mergedResult)
    );

    const repairedSession = {
      ...(interviewSession || {}),
      answers: normalizedAnswers,
    };

    localStorage.setItem(
      "interviewSession",
      JSON.stringify(repairedSession)
    );

    // Remove the temporary raw-response cache once evaluation is ready.
    localStorage.removeItem("interviewAnswers");

    setInterviewSession((currentSession) => {
      const currentSerialized = JSON.stringify(
        safeArray(currentSession?.answers)
      );
      const repairedSerialized = JSON.stringify(
        normalizedAnswers
      );

      return currentSerialized === repairedSerialized
        ? currentSession
        : repairedSession;
    });
  }, [
    result,
    interviewSession,
    questionAnalysis.length,
    evaluationOnlyQuestionAnalysis,
  ]);

  const createHistoryFingerprint = useCallback(() => {
    if (!currentUser?.uid || !result) {
      return "";
    }

    const candidateName = safeText(
      interviewSession?.candidateName,
      "Candidate"
    );

    const targetRole = safeText(
      interviewSession?.targetRole,
      "Software Developer"
    );

    const completedAt = safeText(
      interviewSession?.completedAt ||
        interviewSession?.interviewDate ||
        result?.completedAt,
      ""
    );

    const evaluationSignature =
      evaluationOnlyQuestionAnalysis
        .map(
          (item) =>
            `${item.questionId}:${item.score}:${item.feedback}`
        )
        .join("|");

    return [
      currentUser.uid,
      candidateName,
      targetRole,
      completedAt,
      clampScore(result.overallScore),
      evaluationSignature,
    ].join("::");
  }, [
    currentUser?.uid,
    result,
    interviewSession,
    evaluationOnlyQuestionAnalysis,
  ]);

  const saveInterviewToHistory = useCallback(
    async ({ force = false } = {}) => {
      if (!currentUser?.uid) {
        setHistorySaveError(
          "Please sign in to save this interview report."
        );
        return;
      }

      if (!result) {
        return;
      }

      if (historySaving) {
        return;
      }

      const fingerprint = createHistoryFingerprint();

      const savedFingerprint = localStorage.getItem(
        "latestInterviewHistoryFingerprint"
      );

      const savedHistoryId = localStorage.getItem(
        "latestInterviewHistoryId"
      );

      if (
        !force &&
        fingerprint &&
        savedFingerprint === fingerprint &&
        savedHistoryId
      ) {
        setHistorySaved(true);
        setHistorySaveError("");
        saveAttemptedRef.current = true;
        return;
      }

      if (!force && saveAttemptedRef.current) {
        return;
      }

      saveAttemptedRef.current = true;
      setHistorySaving(true);
      setHistorySaved(false);
      setHistorySaveError("");

      try {
        if (!API_URL) {
          throw new Error(
            "Backend URL is not configured. Add VITE_API_URL to the deployment environment."
          );
        }

        const response = await fetch(
          `${API_URL}/api/interview-history`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firebaseUid: currentUser.uid,
              result: {
                ...result,
                questionAnalysis:
                  evaluationOnlyQuestionAnalysis,
              },
              interviewSession: {
                ...interviewSession,
                answers:
                  evaluationOnlyQuestionAnalysis.map(
                    (item) => ({
                      questionId: item.questionId,
                      questionNumber:
                        item.questionNumber,
                      category: item.category,
                      question: item.question,
                      validationScore: item.score,
                      validationFeedback:
                        item.feedback,
                    })
                  ),
              },
            }),
          }
        );

        let data = null;

        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message ||
              `Unable to save interview history (${response.status}).`
          );
        }

        const historyId = data?.history?._id || "";

        if (historyId) {
          localStorage.setItem(
            "latestInterviewHistoryId",
            historyId
          );
        }

        if (fingerprint) {
          localStorage.setItem(
            "latestInterviewHistoryFingerprint",
            fingerprint
          );
        }

        setHistorySaved(true);
        setHistorySaveError("");

      } catch (error) {
        console.error(
          "Save interview history error:",
          error
        );

        setHistorySaveError(
          error?.message ||
            "Unable to save this interview report."
        );
      } finally {
        setHistorySaving(false);
      }
    },
    [
      currentUser?.uid,
      result,
      interviewSession,
      evaluationOnlyQuestionAnalysis,
      historySaving,
      createHistoryFingerprint,
    ]
  );

  useEffect(() => {
    if (
      !isLoadingResult &&
      currentUser?.uid &&
      result &&
      !openedFromHistory &&
      !historySaved &&
      !saveAttemptedRef.current
    ) {
      saveInterviewToHistory();
    }
  }, [
    isLoadingResult,
    currentUser?.uid,
    result,
    openedFromHistory,
    historySaved,
    saveInterviewToHistory,
  ]);

  const handleRetryHistorySave = () => {
    saveAttemptedRef.current = false;
    saveInterviewToHistory({ force: true });
  };

  const getPerformanceDetails = (score) => {
    if (score >= 90) {
      return {
        title: "Outstanding performance",
        summary:
          "You demonstrated excellent communication, confidence, and technical understanding.",
        styles: "border-emerald-400/10 bg-emerald-400/10",
        titleStyles: "text-emerald-300",
      };
    }

    if (score >= 75) {
      return {
        title: "Strong performance",
        summary:
          "You performed well overall. Continue improving the weaker areas identified below.",
        styles: "border-blue-400/10 bg-blue-400/10",
        titleStyles: "text-blue-300",
      };
    }

    if (score >= 60) {
      return {
        title: "Good foundation",
        summary:
          "You have a good foundation, but your answers need more structure, examples, and technical depth.",
        styles: "border-amber-400/10 bg-amber-400/10",
        titleStyles: "text-amber-300",
      };
    }

    return {
      title: "Needs improvement",
      summary:
        "Focus on clearer explanations, stronger technical preparation, and more confident delivery.",
      styles: "border-rose-400/10 bg-rose-400/10",
      titleStyles: "text-rose-300",
    };
  };

  const handleRetakeInterview = () => {
    localStorage.removeItem("interviewResult");
    localStorage.removeItem("interviewSession");
    localStorage.removeItem("latestInterviewHistoryId");
    localStorage.removeItem(
      "latestInterviewHistoryFingerprint"
    );

    navigate("/interview");
  };

  const handleDownloadReport = async () => {
    if (!result || isDownloading) {
      return;
    }

    setIsDownloading(true);
    setDownloadError("");

    try {
      const { downloadInterviewReport } = await import(
        "../utils/generateInterviewPdf"
      );

      await Promise.resolve(
        downloadInterviewReport({
          result: {
            ...result,
            questionAnalysis: evaluationOnlyQuestionAnalysis,
          },
          session: {
            ...(interviewSession || {}),
            answers: evaluationOnlyQuestionAnalysis,
          },
        })
      );
    } catch (error) {
      console.error("PDF report generation error:", error);

      setDownloadError(
        error?.message ||
          "The PDF could not be generated. Please try again."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoadingResult) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-white/20 border-t-blue-500" />

          <p className="mt-4 text-slate-400">
            Loading your interview report...
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07111f] px-5 text-white">
        <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-2xl text-amber-300">
            <FaExclamationTriangle />
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Interview result not found
          </h1>

          <p className="mt-3 leading-7 text-slate-400">
            Complete an interview first so PrepAI can generate your performance
            report.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Go to Dashboard
            </button>

            <button
              type="button"
              onClick={() => navigate("/interview")}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  const overallScore = clampScore(
    result.overallScore
  );

  const strengths = safeArray(result.strengths);
  const weaknesses = safeArray(result.weaknesses);
  const performance = getPerformanceDetails(
    overallScore
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <FaArrowLeft />
            Dashboard
          </button>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleRetakeInterview}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 backdrop-blur-xl transition hover:bg-white/10"
            >
              <FaRedoAlt />
              Retake Interview
            </button>

            <button
              type="button"
              onClick={handleDownloadReport}
              disabled={isDownloading}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDownloading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <FaDownload />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>

        {downloadError && (
          <div className="mb-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm leading-6 text-rose-100">
            <span className="font-semibold">
              Download error:
            </span>{" "}
            {downloadError}
          </div>
        )}

        {evaluationWarning && (
          <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm leading-6 text-amber-100">
            <span className="font-semibold">
              Evaluation notice:
            </span>{" "}
            {evaluationWarning}
          </div>
        )}

        {historySaving && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-blue-400/20 bg-blue-400/10 px-5 py-4 text-sm text-blue-100">
            <FaSpinner className="shrink-0 animate-spin text-blue-300" />
            Saving this report to your interview history...
          </div>
        )}

        {!historySaving && historySaved && (
          <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-100">
            <span className="font-semibold">
              Report saved:
            </span>{" "}
            This interview is now available in your history.
          </div>
        )}

        {!historySaving && historySaveError && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-100 sm:flex-row sm:items-center sm:justify-between">
            <p>
              <span className="font-semibold">
                History save failed:
              </span>{" "}
              {historySaveError}
            </p>

            <button
              type="button"
              onClick={handleRetryHistorySave}
              className="w-fit rounded-xl border border-rose-300/20 bg-rose-300/10 px-4 py-2 font-semibold text-rose-100 transition hover:bg-rose-300/20"
            >
              Retry save
            </button>
          </div>
        )}

        <div className="relative mb-8 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-black/20 backdrop-blur-2xl md:p-10">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative">
            <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              <FaMagic />
              AI performance report
            </div>

            <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-white md:text-5xl">
              Your interview performance,
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                analyzed in detail.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
              Review your overall score, strengths, improvement areas, and
              question-level scores and feedback generated from your interview evaluation.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] p-8 shadow-xl shadow-black/20 backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent" />

            <div className="mb-5">
              <p className="text-sm font-medium text-slate-400">
                Overall performance
              </p>

              <h2 className="mt-1 text-xl font-bold text-white">
                Interview Score
              </h2>
            </div>

            <div className="flex items-center justify-center py-3">
              <CircularScore score={overallScore} />
            </div>

            <div
              className={`mt-5 rounded-2xl border p-4 ${performance.styles}`}
            >
              <p
                className={`text-sm font-semibold ${performance.titleStyles}`}
              >
                {result.performanceLabel ||
                  performance.title}
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                {result.performanceSummary ||
                  performance.summary}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {scores.map((item) => (
              <ScoreCard
                key={item.title}
                title={item.title}
                score={item.score}
                icon={item.icon}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <StrengthCard strengths={strengths} />
          <WeaknessCard weaknesses={weaknesses} />
        </div>

        <div className="mt-6">
          <QuestionBreakdown
            questions={evaluationOnlyQuestionAnalysis}
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-violet-400/15 bg-gradient-to-br from-violet-500/10 via-white/[0.05] to-blue-500/10 p-7 shadow-xl shadow-black/20 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-xl text-violet-300">
              <FaMagic />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">
                AI recommendation
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                {result.recommendationTitle ||
                  "Continue improving your interview skills"}
              </h2>

              <p className="mt-3 max-w-4xl leading-7 text-slate-400">
                {result.recommendation ||
                  "Practice structured answers and support your explanations with relevant examples."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Back to Dashboard
          </button>

          <button
            type="button"
            onClick={handleRetakeInterview}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:scale-[1.02]"
          >
            Start Another Interview
          </button>
        </div>
      </div>
    </div>
  );}
