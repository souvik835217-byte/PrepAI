import React, { useEffect, useMemo, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiCode,
  FiCopy,
  FiFilter,
  FiLoader,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiXCircle,
  FiZap,
} from "react-icons/fi";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
)
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");

const languageLabels = {
  cpp: "C++",
  java: "Java",
  python: "Python",
  javascript: "JavaScript",
};

const formatDate = (value) => {
  if (!value) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const getStatusClasses = (status = "") => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "accepted") {
    return {
      badge:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      icon: <FiCheckCircle />,
    };
  }

  if (
    normalizedStatus.includes("compile") ||
    normalizedStatus.includes("runtime")
  ) {
    return {
      badge:
        "border-orange-500/30 bg-orange-500/10 text-orange-300",
      icon: <FiAlertCircle />,
    };
  }

  return {
    badge: "border-red-500/30 bg-red-500/10 text-red-300",
    icon: <FiXCircle />,
  };
};

const StatCard = ({ label, value, description }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <p className="text-sm text-slate-500">{label}</p>

    <p className="mt-2 text-3xl font-bold text-white">
      {value}
    </p>

    <p className="mt-1 text-xs text-slate-500">
      {description}
    </p>
  </div>
);

const DSASubmissionHistory = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [languageFilter, setLanguageFilter] =
    useState("all");

  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [aiReview, setAiReview] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setAuthLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const loadSubmissions = async () => {
    if (!user?.uid) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/submissions/user/${user.uid}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load submissions"
        );
      }

      setSubmissions(
        Array.isArray(data.submissions)
          ? data.submissions
          : []
      );
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to load submission history."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [user?.uid]);

  const filteredSubmissions = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return submissions.filter((submission) => {
      const matchesSearch =
        !normalizedSearch ||
        submission.title
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        submission.questionId
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        submission.topic
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        submission.company
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        submission.status === statusFilter;

      const matchesLanguage =
        languageFilter === "all" ||
        submission.language === languageFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLanguage
      );
    });
  }, [
    languageFilter,
    searchTerm,
    statusFilter,
    submissions,
  ]);

  const statistics = useMemo(() => {
    const total = submissions.length;

    const accepted = submissions.filter(
      (submission) =>
        submission.status?.toLowerCase() === "accepted"
    ).length;

    const accuracy =
      total > 0 ? Math.round((accepted / total) * 100) : 0;

    const acceptedTimes = submissions
      .filter(
        (submission) =>
          submission.status?.toLowerCase() ===
          "accepted"
      )
      .map((submission) =>
        Number.parseFloat(submission.executionTime)
      )
      .filter(Number.isFinite);

    const bestRuntime =
      acceptedTimes.length > 0
        ? `${Math.min(...acceptedTimes).toFixed(3)}s`
        : "—";

    return {
      total,
      accepted,
      accuracy,
      bestRuntime,
    };
  }, [submissions]);

  const copySourceCode = async () => {
    if (!selectedSubmission?.sourceCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        selectedSubmission.sourceCode
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setError("Unable to copy the source code.");
    }
  };

  const deleteSubmission = async (submissionId) => {
    const shouldDelete = window.confirm(
      "Delete this submission permanently?"
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingId(submissionId);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/submissions/${submissionId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to delete submission"
        );
      }

      setSubmissions((currentSubmissions) =>
        currentSubmissions.filter(
          (submission) =>
            submission._id !== submissionId
        )
      );

      if (selectedSubmission?._id === submissionId) {
        setSelectedSubmission(null);
      }
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to delete submission."
      );
    } finally {
      setDeletingId("");
    }
  };

  const generateAiReview = async () => {
    if (
      !selectedSubmission ||
      selectedSubmission.status?.toLowerCase() !== "accepted" ||
      isReviewing
    ) {
      return;
    }

    setIsReviewing(true);
    setAiReview(null);
    setReviewError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ai-code-review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title:
              selectedSubmission.questionTitle ||
              selectedSubmission.title ||
              selectedSubmission.questionId,

            description:
              selectedSubmission.description || "",

            language: selectedSubmission.language,
            status: selectedSubmission.status,
            executionTime:
              selectedSubmission.executionTime,
            memory: selectedSubmission.memory,
            sourceCode: selectedSubmission.sourceCode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to generate AI review"
        );
      }

      setAiReview(data.review);
    } catch (error) {
      setReviewError(
        error.message ||
          "Unable to generate the AI code review."
      );
    } finally {
      setIsReviewing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <FiLoader className="animate-spin text-3xl text-indigo-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <div className="max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
          <FiAlertCircle className="mx-auto text-4xl text-amber-400" />

          <h1 className="mt-5 text-2xl font-bold">
            Login required
          </h1>

          <p className="mt-3 text-slate-400">
            Sign in to view your DSA submission history.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-500"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
              DSA Performance
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Submission History
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Review your previous solutions, execution
              results, languages and performance.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSubmissions}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold transition hover:border-slate-600 disabled:opacity-50"
          >
            <FiRefreshCw
              className={isLoading ? "animate-spin" : ""}
            />

            Refresh
          </button>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Submissions"
            value={statistics.total}
            description="All coding attempts"
          />

          <StatCard
            label="Accepted"
            value={statistics.accepted}
            description="Successful submissions"
          />

          <StatCard
            label="Accuracy"
            value={`${statistics.accuracy}%`}
            description="Accepted submission rate"
          />

          <StatCard
            label="Best Runtime"
            value={statistics.bestRuntime}
            description="Fastest accepted execution"
          />
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <label className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search question, topic or company..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500"
              />
            </label>

            <label className="relative">
              <FiFilter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="min-w-44 appearance-none rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-10 text-sm outline-none"
              >
                <option value="all">All statuses</option>
                <option value="Accepted">Accepted</option>
                <option value="Failed">Failed</option>
                <option value="Wrong Answer">
                  Wrong Answer
                </option>
                <option value="Compile Error">
                  Compile Error
                </option>
                <option value="Runtime Error">
                  Runtime Error
                </option>
              </select>

              <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
            </label>

            <label className="relative">
              <FiCode className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

              <select
                value={languageFilter}
                onChange={(event) =>
                  setLanguageFilter(event.target.value)
                }
                className="min-w-44 appearance-none rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-10 text-sm outline-none"
              >
                <option value="all">All languages</option>
                {Object.entries(languageLabels).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>

              <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
            </label>
          </div>
        </section>

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex min-h-80 items-center justify-center">
            <div className="text-center">
              <FiLoader className="mx-auto animate-spin text-4xl text-indigo-400" />

              <p className="mt-4 text-slate-400">
                Loading submissions...
              </p>
            </div>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
            <FiCode className="mx-auto text-5xl text-slate-600" />

            <h2 className="mt-5 text-xl font-bold">
              No submissions found
            </h2>

            <p className="mt-2 text-slate-500">
              Solve a DSA question to create your first
              submission.
            </p>

            <button
              type="button"
              onClick={() => navigate("/dsa/topics")}
              className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500"
            >
              Practice Questions
            </button>
          </div>
        ) : (
          <section className="mt-8 space-y-4">
            {filteredSubmissions.map((submission) => {
              const statusStyle = getStatusClasses(
                submission.status
              );

              return (
                <article
                  key={submission._id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700"
                >
                  <div className="flex flex-wrap items-center justify-between gap-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle.badge}`}
                        >
                          {statusStyle.icon}
                          {submission.status}
                        </span>

                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                          {languageLabels[
                            submission.language
                          ] || submission.language}
                        </span>
                      </div>

                      <h2 className="mt-4 text-xl font-bold">
                        {submission.title ||
                          submission.questionId}
                      </h2>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                        {submission.topic && (
                          <span>
                            Topic: {submission.topic}
                          </span>
                        )}

                        {submission.company && (
                          <span>
                            Company: {submission.company}
                          </span>
                        )}

                        <span className="flex items-center gap-1.5">
                          <FiClock />
                          {formatDate(submission.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-center">
                        <p className="text-xs text-slate-500">
                          Runtime
                        </p>

                        <p className="mt-1 font-semibold">
                          {submission.executionTime || "0"}s
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-center">
                        <p className="text-xs text-slate-500">
                          Memory
                        </p>

                        <p className="mt-1 font-semibold">
                          {submission.memory || 0} KB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setAiReview(null);
                          setReviewError("");
                        }}
                        className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/20"
                      >
                        View Code
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteSubmission(submission._id)
                        }
                        disabled={
                          deletingId === submission._id
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                        aria-label="Delete submission"
                      >
                        {deletingId === submission._id ? (
                          <FiLoader className="animate-spin" />
                        ) : (
                          <FiTrash2 />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>

      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-5 py-8 backdrop-blur-sm">
          <div className="max-h-full w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-5">
              <div>
                <p className="text-sm text-indigo-400">
                  Submission details
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedSubmission.title ||
                    selectedSubmission.questionId}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedSubmission(null);
                  setAiReview(null);
                  setReviewError("");
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:text-white"
              >
                <FiXCircle />
              </button>
            </div>

            <div className="p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  label="Status"
                  value={selectedSubmission.status}
                  description="Submission result"
                />

                <StatCard
                  label="Language"
                  value={
                    languageLabels[
                      selectedSubmission.language
                    ] || selectedSubmission.language
                  }
                  description="Programming language"
                />

                <StatCard
                  label="Runtime"
                  value={`${
                    selectedSubmission.executionTime || "0"
                  }s`}
                  description="Execution time"
                />

                <StatCard
                  label="Memory"
                  value={`${
                    selectedSubmission.memory || 0
                  } KB`}
                  description="Memory usage"
                />
              </div>

              {selectedSubmission.status?.toLowerCase() ===
                "accepted" && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={generateAiReview}
                    disabled={isReviewing}
                    className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 font-semibold text-amber-300 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isReviewing ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <FiZap />
                    )}

                    {isReviewing
                      ? "Reviewing Code..."
                      : aiReview
                        ? "Regenerate AI Review"
                        : "Generate AI Review"}
                  </button>
                </div>
              )}

              {reviewError && (
                <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                  {reviewError}
                </div>
              )}

              {isReviewing && (
                <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
                  <div className="flex items-center gap-3">
                    <FiLoader className="animate-spin text-xl text-amber-300" />

                    <div>
                      <p className="font-semibold text-amber-300">
                        PrepAI is reviewing your code
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Analysing complexity, readability and edge
                        cases.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {aiReview && !isReviewing && (
                <div className="mt-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-slate-900 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-2 text-amber-300">
                        <FiZap />
                        <span className="font-semibold">
                          PrepAI Code Review
                        </span>
                      </div>

                      <h3 className="mt-3 text-2xl font-bold">
                        Solution Analysis
                      </h3>

                      <p className="mt-3 leading-7 text-slate-300">
                        {aiReview.summary}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-amber-500/30 bg-slate-950 px-7 py-5 text-center">
                      <p className="text-xs uppercase tracking-widest text-slate-500">
                        Overall Score
                      </p>

                      <p className="mt-2 text-4xl font-bold text-amber-300">
                        {aiReview.overallScore}
                      </p>

                      <p className="text-sm text-slate-500">
                        out of 100
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Time Complexity
                      </p>

                      <p className="mt-2 text-xl font-bold">
                        {aiReview.timeComplexity}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Space Complexity
                      </p>

                      <p className="mt-2 text-xl font-bold">
                        {aiReview.spaceComplexity}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <div>
                      <h4 className="font-semibold text-emerald-300">
                        Strengths
                      </h4>

                      <div className="mt-3 space-y-3">
                        {aiReview.strengths?.map(
                          (strength, index) => (
                            <div
                              key={`${strength}-${index}`}
                              className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4"
                            >
                              <FiCheckCircle className="mt-1 shrink-0 text-emerald-400" />

                              <p className="text-sm leading-6 text-slate-300">
                                {strength}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-amber-300">
                        Suggestions
                      </h4>

                      <div className="mt-3 space-y-3">
                        {aiReview.suggestions?.map(
                          (suggestion, index) => (
                            <div
                              key={`${suggestion}-${index}`}
                              className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"
                            >
                              <FiAlertCircle className="mt-1 shrink-0 text-amber-400" />

                              <p className="text-sm leading-6 text-slate-300">
                                {suggestion}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {aiReview.edgeCases?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-indigo-300">
                        Edge Cases
                      </h4>

                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {aiReview.edgeCases.map(
                          (edgeCase, index) => (
                            <div
                              key={`${edgeCase}-${index}`}
                              className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-sm leading-6 text-slate-300"
                            >
                              {edgeCase}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {[
                      {
                        label: "Readability",
                        value:
                          aiReview.quality?.readability || 0,
                      },
                      {
                        label: "Efficiency",
                        value:
                          aiReview.quality?.efficiency || 0,
                      },
                      {
                        label: "Maintainability",
                        value:
                          aiReview.quality?.maintainability || 0,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                      >
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">
                            {item.label}
                          </span>

                          <span className="font-semibold">
                            {item.value}%
                          </span>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-indigo-500"
                            style={{
                              width: `${Math.max(
                                0,
                                Math.min(100, item.value)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3">
                  <p className="font-semibold">Source Code</p>

                  <button
                    type="button"
                    onClick={copySourceCode}
                    className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:text-white"
                  >
                    <FiCopy />
                    {copied ? "Copied" : "Copy Code"}
                  </button>
                </div>

                <pre className="max-h-[500px] overflow-auto whitespace-pre rounded-b-2xl bg-[#0b1120] p-5 font-mono text-sm leading-6 text-slate-300">
                  {selectedSubmission.sourceCode ||
                    "Source code is unavailable."}
                </pre>
              </div>

              <p className="mt-5 text-sm text-slate-500">
                Submitted on{" "}
                {formatDate(selectedSubmission.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DSASubmissionHistory;
