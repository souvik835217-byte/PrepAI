import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiAlertCircle,
  FiArrowLeft,
  FiArrowRight,
  FiBarChart2,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiFilter,
  FiLoader,
  FiRefreshCw,
  FiSearch,
  FiTarget,
  FiTrash2,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";

import { auth } from "../firebase/firebase";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const History = () => {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [scoreFilter, setScoreFilter] = useState("all");

  const clampScore = useCallback((value) => {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return 0;
    }

    return Math.max(
      0,
      Math.min(100, Math.round(numericValue))
    );
  }, []);

  const getInterviewId = useCallback((interview) => {
    return interview?._id || interview?.id || "";
  }, []);

  const getInterviewDate = useCallback((interview) => {
    const rawDate =
      interview?.interviewDate ||
      interview?.completedAt ||
      interview?.createdAt ||
      interview?.updatedAt;

    const date = new Date(rawDate || 0);

    return Number.isNaN(date.getTime())
      ? new Date(0)
      : date;
  }, []);

  const formatDate = useCallback((dateValue) => {
    if (!dateValue) {
      return "Date unavailable";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }, []);

  const sortNewestFirst = useCallback(
    (items) => {
      return [...items].sort(
        (firstInterview, secondInterview) =>
          getInterviewDate(secondInterview).getTime() -
          getInterviewDate(firstInterview).getTime()
      );
    },
    [getInterviewDate]
  );

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const user = auth.currentUser;

      if (!user?.uid) {
        throw new Error(
          "Please log in to view your interview history."
        );
      }

      const response = await fetch(
        `${API_URL}/api/interview-history/user/${user.uid}`
      );

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
            "The server returned invalid data.",
        };
      }

      if (!response.ok || data.success === false) {
        throw new Error(
          data.error ||
            data.message ||
            "Could not load interview history."
        );
      }

      const historyItems = Array.isArray(data.interviews)
        ? data.interviews
        : Array.isArray(data.history)
        ? data.history
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

      setInterviews(sortNewestFirst(historyItems));
    } catch (error) {
      console.error(
        "Interview history fetch error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Could not load interview history."
      );
    } finally {
      setIsLoading(false);
    }
  }, [sortNewestFirst]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        if (user?.uid) {
          fetchHistory();
        } else {
          setInterviews([]);
          setIsLoading(false);
          setErrorMessage(
            "Please log in to view your interview history."
          );
        }
      }
    );

    return unsubscribe;
  }, [fetchHistory]);

  const stats = useMemo(() => {
    if (interviews.length === 0) {
      return {
        total: 0,
        average: 0,
        best: 0,
        latest: 0,
        improvement: 0,
      };
    }

    const scores = interviews.map((interview) =>
      clampScore(interview.overallScore)
    );

    const totalScore = scores.reduce(
      (sum, score) => sum + score,
      0
    );

    const latestScore = scores[0] || 0;
    const previousScore = scores[1] || latestScore;

    return {
      total: interviews.length,

      average: Math.round(
        totalScore / scores.length
      ),

      best: Math.max(...scores),

      latest: latestScore,

      improvement: latestScore - previousScore,
    };
  }, [clampScore, interviews]);

  const filteredInterviews = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return interviews.filter((interview) => {
      const score = clampScore(
        interview.overallScore
      );

      const company = String(
        interview.company ||
          interview.selectedCompany ||
          "General"
      ).toLowerCase();

      const role = String(
        interview.targetRole ||
          interview.role ||
          "Software Developer"
      ).toLowerCase();

      const candidate = String(
        interview.candidateName ||
          "Candidate"
      ).toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        company.includes(normalizedSearch) ||
        role.includes(normalizedSearch) ||
        candidate.includes(normalizedSearch);

      let matchesScore = true;

      if (scoreFilter === "excellent") {
        matchesScore = score >= 85;
      }

      if (scoreFilter === "good") {
        matchesScore = score >= 70 && score < 85;
      }

      if (scoreFilter === "improving") {
        matchesScore = score >= 55 && score < 70;
      }

      if (scoreFilter === "needs-work") {
        matchesScore = score < 55;
      }

      return matchesSearch && matchesScore;
    });
  }, [
    clampScore,
    interviews,
    scoreFilter,
    searchTerm,
  ]);

  const scoreStyle = useCallback((score) => {
    if (score >= 85) {
      return {
        label: "Excellent",
        badge:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        bar: "bg-emerald-500",
      };
    }

    if (score >= 70) {
      return {
        label: "Good",
        badge:
          "border-blue-200 bg-blue-50 text-blue-700",
        bar: "bg-blue-500",
      };
    }

    if (score >= 55) {
      return {
        label: "Improving",
        badge:
          "border-amber-200 bg-amber-50 text-amber-700",
        bar: "bg-amber-500",
      };
    }

    return {
      label: "Needs work",
      badge:
        "border-red-200 bg-red-50 text-red-700",
      bar: "bg-red-500",
    };
  }, []);

  const getQuestionCount = useCallback((interview) => {
    if (
      Array.isArray(interview?.questionAnalysis)
    ) {
      return interview.questionAnalysis.length;
    }

    return Number(
      interview?.questionCount ||
        interview?.totalQuestions ||
        0
    );
  }, []);

  const openInterviewReport = useCallback(
    (interview) => {
      if (!interview) {
        return;
      }

      const historyId = getInterviewId(interview);

      const result = {
        overallScore: clampScore(
          interview.overallScore
        ),

        communication: clampScore(
          interview.communication
        ),

        technicalKnowledge: clampScore(
          interview.technicalKnowledge
        ),

        confidence: clampScore(
          interview.confidence
        ),

        grammar: clampScore(
          interview.grammar
        ),

        problemSolving: clampScore(
          interview.problemSolving
        ),

        strengths: Array.isArray(
          interview.strengths
        )
          ? interview.strengths
          : [],

        weaknesses: Array.isArray(
          interview.weaknesses
        )
          ? interview.weaknesses
          : [],

        recommendationTitle:
          interview.recommendationTitle || "",

        recommendation:
          interview.recommendation || "",

        performanceLabel:
          interview.performanceLabel || "",

        questionAnalysis: Array.isArray(
          interview.questionAnalysis
        )
          ? interview.questionAnalysis
          : [],
      };

      const questionAnswers = Array.isArray(
        interview.questionAnalysis
      )
        ? interview.questionAnalysis.map(
            (item, index) => ({
              questionId:
                item.questionId ||
                item._id ||
                `history-question-${index + 1}`,

              questionNumber:
                item.questionNumber || index + 1,

              category:
                item.category || "General",

              question:
                item.question || "",

              answer: item.answer || "",

              validationScore:
                item.score ??
                item.validationScore ??
                0,

              validationFeedback:
                item.feedback ||
                item.validationFeedback ||
                "",
            })
          )
        : [];

      const session = {
        candidateName:
          interview.candidateName ||
          "Candidate",

        targetRole:
          interview.targetRole ||
          interview.role ||
          "Software Developer",

        company:
          interview.company ||
          interview.selectedCompany ||
          "General",

        selectedCompany:
          interview.selectedCompany ||
          interview.company ||
          "General",

        difficulty:
          interview.difficulty ||
          "Medium",

        experienceLevel:
          interview.experienceLevel ||
          "Fresher",

        questionCount:
          getQuestionCount(interview),

        completedAt:
          interview.interviewDate ||
          interview.completedAt ||
          interview.createdAt ||
          new Date().toISOString(),

        answers: questionAnswers,
      };

      localStorage.setItem(
        "interviewResult",
        JSON.stringify(result)
      );

      localStorage.setItem(
        "interviewSession",
        JSON.stringify(session)
      );

      navigate("/result", {
        state: {
          result,
          interviewResult: result,
          interviewSession: session,
          fromHistory: true,
          historyId,
        },
      });
    },
    [
      clampScore,
      getInterviewId,
      getQuestionCount,
      navigate,
    ]
  );

  const requestDeleteInterview = (interview) => {
    if (!getInterviewId(interview)) {
      setErrorMessage(
        "This interview does not have a valid history ID."
      );
      return;
    }

    setDeleteTarget(interview);
  };

  const deleteInterview = async () => {
    const interviewId =
      getInterviewId(deleteTarget);

    const firebaseUid = auth.currentUser?.uid;

    if (!interviewId) {
      return;
    }

    if (!firebaseUid) {
      setErrorMessage(
        "Please log in before deleting an interview."
      );
      setDeleteTarget(null);
      return;
    }

    setDeletingId(interviewId);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/interview-history/${encodeURIComponent(
          interviewId
        )}?firebaseUid=${encodeURIComponent(firebaseUid)}`,
        {
          method: "DELETE",
        }
      );

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
            "The server returned invalid data.",
        };
      }

      if (!response.ok || data.success === false) {
        throw new Error(
          data.error ||
            data.message ||
            "Could not delete the interview."
        );
      }

      setInterviews((previousInterviews) =>
        previousInterviews.filter(
          (interview) =>
            getInterviewId(interview) !==
            interviewId
        )
      );

      if (
        localStorage.getItem(
          "latestInterviewHistoryId"
        ) === interviewId
      ) {
        localStorage.removeItem(
          "latestInterviewHistoryId"
        );
        localStorage.removeItem(
          "latestInterviewHistoryFingerprint"
        );
      }

      setDeleteTarget(null);
    } catch (error) {
      console.error(
        "Interview history delete error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Could not delete the interview."
      );
    } finally {
      setDeletingId("");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setScoreFilter("all");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#eef2f7] text-slate-900">
      {/* Background */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[430px] w-[430px] rounded-full bg-blue-200/40 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[480px] w-[480px] rounded-full bg-indigo-200/35 blur-3xl" />

      {/* Navbar */}
      <header className="relative z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
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
                Interview history
              </p>
            </div>
          </button>

          <button
            onClick={fetchHistory}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              className={
                isLoading ? "animate-spin" : ""
              }
            />

            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <FiArrowLeft />
          Back to dashboard
        </button>

        {/* Hero */}
        <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.17em] text-blue-600">
              Your progress
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Interview history
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Review previous attempts, compare your
              performance and open complete interview
              reports. Your newest attempt appears first.
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/company-selection")
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Start new interview
            <FiArrowRight />
          </button>
        </div>

        {/* Statistics */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            {
              label: "Total interviews",
              value: stats.total,
              icon: FiBriefcase,
            },
            {
              label: "Average score",
              value: `${stats.average}%`,
              icon: FiBarChart2,
            },
            {
              label: "Best score",
              value: `${stats.best}%`,
              icon: FiTarget,
            },
            {
              label: "Latest score",
              value: `${stats.latest}%`,
              icon: FiClock,
            },
            {
              label: "Latest change",
              value:
                stats.improvement > 0
                  ? `+${stats.improvement}%`
                  : `${stats.improvement}%`,
              icon: FiTrendingUp,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-lg shadow-slate-300/20 backdrop-blur-xl"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon />
                </div>

                <p className="mt-5 text-sm text-slate-500">
                  {item.label}
                </p>

                <p className="mt-1 text-3xl font-semibold">
                  {item.value}
                </p>
              </motion.div>
            );
          })}
        </section>

        {/* Error */}
        {errorMessage && (
          <div className="mt-7 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold">
                  History error
                </p>

                <p className="mt-1 text-sm leading-6">
                  {errorMessage}
                </p>
              </div>
            </div>

            <button
              onClick={() => setErrorMessage("")}
              className="shrink-0 text-red-500 transition hover:text-red-700"
            >
              <FiX />
            </button>
          </div>
        )}

        {/* Search and filters */}
        {!isLoading && interviews.length > 0 && (
          <section className="mt-8 rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-lg shadow-slate-300/20 backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search company, role or candidate..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="relative min-w-[200px]">
                <FiFilter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <select
                  value={scoreFilter}
                  onChange={(event) =>
                    setScoreFilter(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option value="all">
                    All scores
                  </option>

                  <option value="excellent">
                    Excellent: 85–100
                  </option>

                  <option value="good">
                    Good: 70–84
                  </option>

                  <option value="improving">
                    Improving: 55–69
                  </option>

                  <option value="needs-work">
                    Needs work: below 55
                  </option>
                </select>
              </div>

              {(searchTerm ||
                scoreFilter !== "all") && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <FiX />
                  Clear
                </button>
              )}
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Showing {filteredInterviews.length} of{" "}
              {interviews.length} interviews
            </p>
          </section>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="mt-8 flex min-h-[320px] items-center justify-center rounded-[28px] border border-white/80 bg-white/85 shadow-xl shadow-slate-300/20">
            <div className="text-center">
              <FiLoader className="mx-auto animate-spin text-3xl text-blue-600" />

              <p className="mt-4 font-semibold">
                Loading interview history...
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Retrieving your previous reports.
              </p>
            </div>
          </div>
        ) : interviews.length === 0 ? (
          /* Empty state */
          <div className="mt-8 rounded-[28px] border border-white/80 bg-white/90 p-10 text-center shadow-xl shadow-slate-300/20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-700">
              <FiBriefcase />
            </div>

            <h2 className="mt-6 text-2xl font-semibold">
              No interview history yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Complete your first interview and its
              performance report will appear here
              automatically.
            </p>

            <button
              onClick={() =>
                navigate("/company-selection")
              }
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Start interview
              <FiArrowRight />
            </button>
          </div>
        ) : filteredInterviews.length === 0 ? (
          /* No filtered results */
          <div className="mt-8 rounded-[28px] border border-white/80 bg-white/90 p-10 text-center shadow-xl shadow-slate-300/20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-600">
              <FiSearch />
            </div>

            <h2 className="mt-6 text-2xl font-semibold">
              No matching interviews
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Try another search term or remove the
              current score filter.
            </p>

            <button
              onClick={clearFilters}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* Interview cards */
          <section className="mt-8 space-y-5">
            {filteredInterviews.map(
              (interview, index) => {
                const interviewId =
                  getInterviewId(interview);

                const score = clampScore(
                  interview.overallScore
                );

                const style = scoreStyle(score);

                const company =
                  interview.company ||
                  interview.selectedCompany ||
                  "General";

                const role =
                  interview.targetRole ||
                  interview.role ||
                  "Software Developer";

                const difficulty =
                  interview.difficulty || "Medium";

                const experienceLevel =
                  interview.experienceLevel ||
                  interview.experience ||
                  "Fresher";

                const questionCount =
                  getQuestionCount(interview);

                return (
                  <motion.article
                    key={
                      interviewId ||
                      `${getInterviewDate(
                        interview
                      ).getTime()}-${index}`
                    }
                    initial={{
                      opacity: 0,
                      y: 16,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: Math.min(index * 0.04, 0.3),
                    }}
                    className="group overflow-hidden rounded-[24px] border border-white/80 bg-white/90 shadow-lg shadow-slate-300/20 backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            openInterviewReport(
                              interview
                            )
                          }
                          className="flex flex-1 items-start gap-4 text-left"
                        >
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white shadow-sm">
                            <FiBriefcase />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <h2 className="text-lg font-semibold text-slate-900">
                                {role}
                              </h2>

                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${style.badge}`}
                              >
                                {style.label}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                              {company} ·{" "}
                              {interview.candidateName ||
                                "Candidate"}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                              <span className="inline-flex items-center gap-2">
                                <FiCalendar />

                                {formatDate(
                                  interview.interviewDate ||
                                    interview.completedAt ||
                                    interview.createdAt
                                )}
                              </span>

                              <span className="inline-flex items-center gap-2">
                                <FiCheckCircle />

                                {questionCount} questions
                              </span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                                {difficulty}
                              </span>

                              <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                                {experienceLevel}
                              </span>

                              {interview.performanceLabel && (
                                <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
                                  {
                                    interview.performanceLabel
                                  }
                                </span>
                              )}
                            </div>
                          </div>
                        </button>

                        <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between lg:min-w-[310px] lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                          <div className="min-w-[110px]">
                            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">
                              Overall score
                            </p>

                            <p className="mt-1 text-3xl font-semibold text-slate-900">
                              {score}
                              <span className="text-base text-slate-400">
                                /100
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                openInterviewReport(
                                  interview
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                              <FiEye />
                              View report
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                requestDeleteInterview(
                                  interview
                                )
                              }
                              disabled={!interviewId}
                              className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                              title="Delete interview"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-1.5 bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${score}%`,
                        }}
                        transition={{
                          duration: 0.7,
                          delay: 0.1,
                        }}
                        className={`h-full ${style.bar}`}
                      />
                    </div>
                  </motion.article>
                );
              }
            )}
          </section>
        )}
      </main>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-5 backdrop-blur-sm"
            onClick={() => {
              if (!deletingId) {
                setDeleteTarget(null);
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
              className="w-full max-w-md rounded-[26px] border border-white/10 bg-white p-7 shadow-2xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-600">
                <FiTrash2 />
              </div>

              <h2 className="mt-6 text-2xl font-semibold text-slate-900">
                Delete interview report?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                This will permanently delete your{" "}
                <span className="font-semibold text-slate-700">
                  {deleteTarget.targetRole ||
                    deleteTarget.role ||
                    "interview"}
                </span>{" "}
                report for{" "}
                <span className="font-semibold text-slate-700">
                  {deleteTarget.company ||
                    deleteTarget.selectedCompany ||
                    "General"}
                </span>
                . This action cannot be undone.
              </p>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setDeleteTarget(null)
                  }
                  disabled={Boolean(deletingId)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={deleteInterview}
                  disabled={Boolean(deletingId)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 />
                      Delete report
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;
