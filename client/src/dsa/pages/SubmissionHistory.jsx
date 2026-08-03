import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiCode,
  FiCopy,
  FiEye,
  FiFileText,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiX,
  FiXCircle,
} from "react-icons/fi";

import { AuthContext } from "../../context/authContextStore";

const languageLabels = {
  cpp: "C++",
  java: "Java",
  python: "Python",
  javascript: "JavaScript",
};

const formatLanguage = (language) => {
  return languageLabels[language] || language || "Unknown";
};

const formatRuntime = (runtime) => {
  const value = Number(runtime);

  if (!Number.isFinite(value)) {
    return "0 ms";
  }

  return `${Math.round(value * 1000)} ms`;
};

const formatMemory = (memory) => {
  const value = Number(memory);

  if (!Number.isFinite(value)) {
    return "0 KB";
  }

  return `${Math.round(value)} KB`;
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Unknown date";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isAcceptedSubmission = (submission) => {
  return (
    submission.accepted === true ||
    submission.status === "Accepted"
  );
};

const getStatusClasses = (status) => {
  if (status === "Accepted") {
    return {
      badge:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      icon: "text-emerald-400",
    };
  }

  if (status === "Wrong Answer") {
    return {
      badge:
        "border-red-500/20 bg-red-500/10 text-red-400",
      icon: "text-red-400",
    };
  }

  if (status === "Compilation Error") {
    return {
      badge:
        "border-amber-500/20 bg-amber-500/10 text-amber-400",
      icon: "text-amber-400",
    };
  }

  return {
    badge:
      "border-orange-500/20 bg-orange-500/10 text-orange-400",
    icon: "text-orange-400",
  };
};

const SubmissionHistory = () => {
  const navigate = useNavigate();

  const {
    user,
    authLoading,
  } = useContext(AuthContext);

  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [languageFilter, setLanguageFilter] =
    useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  const [deletingId, setDeletingId] = useState("");
  const [copied, setCopied] = useState(false);

  const API_BASE_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  ).replace(/\/api\/?$/, "").replace(/\/$/, "");

  const fetchSubmissions = async ({
    showRefreshLoader = false,
  } = {}) => {
    if (!user?.uid) {
      setSubmissions([]);
      setIsLoading(false);
      return;
    }

    try {
      setError("");

      if (showRefreshLoader) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      console.log(
        "Submission API:",
        `${API_BASE_URL}/api/submissions/user/${user.uid}`
      );

      const response = await fetch(
        `${API_BASE_URL}/api/submissions/user/${user.uid}`
      );

      const contentType =
        response.headers.get("content-type");

      let data;

      if (
        contentType?.includes("application/json")
      ) {
        data = await response.json();
      } else {
        const text = await response.text();

        throw new Error(
          text ||
            "The server returned an invalid response."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load submission history."
        );
      }

      setSubmissions(
        Array.isArray(data.submissions)
          ? data.submissions
          : []
      );
    } catch (fetchError) {
      console.error(
        "Submission history error:",
        fetchError
      );

      setError(
        fetchError.message ||
          "Unable to load submission history."
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    fetchSubmissions();
  }, [authLoading, user?.uid]);

  const analytics = useMemo(() => {
    const totalSubmissions = submissions.length;

    const acceptedSubmissions =
      submissions.filter(isAcceptedSubmission).length;

    const solvedQuestions = new Set(
      submissions
        .filter(isAcceptedSubmission)
        .map((submission) => submission.questionId)
    ).size;

    const acceptanceRate =
      totalSubmissions > 0
        ? (
            (acceptedSubmissions /
              totalSubmissions) *
            100
          ).toFixed(1)
        : "0.0";

    return {
      totalSubmissions,
      acceptedSubmissions,
      solvedQuestions,
      acceptanceRate,
    };
  }, [submissions]);

  const availableLanguages = useMemo(() => {
    return [
      ...new Set(
        submissions
          .map((submission) => submission.language)
          .filter(Boolean)
      ),
    ];
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    const filtered = submissions.filter(
      (submission) => {
        const matchesSearch =
          !normalizedSearch ||
          submission.questionTitle
            ?.toLowerCase()
            .includes(normalizedSearch) ||
          submission.questionId
            ?.toLowerCase()
            .includes(normalizedSearch) ||
          submission.topic
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
      }
    );

    return [...filtered].sort((first, second) => {
      const firstDate = new Date(
        first.createdAt
      ).getTime();

      const secondDate = new Date(
        second.createdAt
      ).getTime();

      if (sortOrder === "oldest") {
        return firstDate - secondDate;
      }

      if (sortOrder === "accepted-first") {
        const firstAccepted =
          isAcceptedSubmission(first);

        const secondAccepted =
          isAcceptedSubmission(second);

        if (firstAccepted !== secondAccepted) {
          return firstAccepted ? -1 : 1;
        }

        return secondDate - firstDate;
      }

      return secondDate - firstDate;
    });
  }, [
    submissions,
    searchTerm,
    statusFilter,
    languageFilter,
    sortOrder,
  ]);

  const handleDelete = async (submissionId) => {
    const shouldDelete = window.confirm(
      "Delete this submission permanently?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingId(submissionId);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/submissions/${submissionId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to delete the submission."
        );
      }

      setSubmissions((currentSubmissions) =>
        currentSubmissions.filter(
          (submission) =>
            submission._id !== submissionId
        )
      );

      if (
        selectedSubmission?._id === submissionId
      ) {
        setSelectedSubmission(null);
      }
    } catch (deleteError) {
      console.error(
        "Delete submission error:",
        deleteError
      );

      setError(
        deleteError.message ||
          "Unable to delete the submission."
      );
    } finally {
      setDeletingId("");
    }
  };

  const handleCopyCode = async () => {
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
      }, 1800);
    } catch (copyError) {
      console.error(
        "Copy code error:",
        copyError
      );
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setLanguageFilter("all");
    setSortOrder("newest");
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />

          <p className="mt-4 text-sm text-slate-400">
            Loading submission history...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <FiFileText className="mx-auto text-4xl text-indigo-400" />

          <h1 className="mt-5 text-2xl font-bold">
            Login required
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Please log in to view your DSA submission
            history.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <button
            type="button"
            onClick={() => navigate("/dsa")}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <FiArrowLeft />
            Back to DSA
          </button>

          <button
            type="button"
            onClick={() =>
              fetchSubmissions({
                showRefreshLoader: true,
              })
            }
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              className={
                isRefreshing ? "animate-spin" : ""
              }
            />

            {isRefreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <section>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
                DSA Activity
              </p>

              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                Submission History
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Review your submitted solutions, inspect
                performance, view code, and track your
                progress.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-400">
              Signed in as{" "}
              <span className="font-semibold text-white">
                {user.displayName ||
                  user.email ||
                  "PrepAI User"}
              </span>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            <div className="flex items-start gap-3">
              <FiXCircle className="mt-0.5 shrink-0 text-lg" />

              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-300 transition hover:text-white"
            >
              <FiX />
            </button>
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                <FiFileText />
              </span>

              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold">
              {analytics.totalSubmissions}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Total submissions
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                <FiCheckCircle />
              </span>

              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Passed
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold">
              {analytics.acceptedSubmissions}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Accepted submissions
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                <FiBarChart2 />
              </span>

              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Rate
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold">
              {analytics.acceptanceRate}%
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Acceptance rate
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
                <FiCode />
              </span>

              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Solved
              </span>
            </div>

            <p className="mt-5 text-3xl font-bold">
              {analytics.solvedQuestions}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Unique problems solved
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-2">
            <FiFilter className="text-indigo-400" />

            <h2 className="font-semibold">
              Filter submissions
            </h2>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="relative block">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search problem or topic"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
              />
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
            >
              <option value="all">All statuses</option>
              <option value="Accepted">
                Accepted
              </option>
              <option value="Wrong Answer">
                Wrong Answer
              </option>
              <option value="Compilation Error">
                Compilation Error
              </option>
              <option value="Runtime Error">
                Runtime Error
              </option>
              <option value="Time Limit Exceeded">
                Time Limit Exceeded
              </option>
            </select>

            <select
              value={languageFilter}
              onChange={(event) =>
                setLanguageFilter(event.target.value)
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
            >
              <option value="all">
                All languages
              </option>

              {availableLanguages.map((language) => (
                <option
                  key={language}
                  value={language}
                >
                  {formatLanguage(language)}
                </option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value)
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
            >
              <option value="newest">
                Newest first
              </option>
              <option value="oldest">
                Oldest first
              </option>
              <option value="accepted-first">
                Accepted first
              </option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredSubmissions.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white">
                {submissions.length}
              </span>{" "}
              submissions
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-indigo-400 transition hover:text-indigo-300"
            >
              Clear filters
            </button>
          </div>
        </section>

        <section className="mt-8">
          {submissions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-16 text-center">
              <FiCode className="mx-auto text-5xl text-slate-600" />

              <h2 className="mt-5 text-xl font-semibold">
                No submissions yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                Solve a DSA problem and press Submit. Your
                result will appear here automatically.
              </p>

              <button
                type="button"
                onClick={() => navigate("/dsa/topics")}
                className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500"
              >
                Browse Problems
              </button>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-14 text-center">
              <FiSearch className="mx-auto text-4xl text-slate-600" />

              <h2 className="mt-4 text-lg font-semibold">
                No matching submissions
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Try changing or clearing your filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold transition hover:border-slate-500"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map(
                (submission) => {
                  const statusClasses =
                    getStatusClasses(
                      submission.status
                    );

                  return (
                    <article
                      key={submission._id}
                      className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700"
                    >
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses.badge}`}
                            >
                              {isAcceptedSubmission(
                                submission
                              ) ? (
                                <FiCheckCircle />
                              ) : (
                                <FiXCircle />
                              )}

                              {submission.status ||
                                "Unknown"}
                            </span>

                            <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-300">
                              {formatLanguage(
                                submission.language
                              )}
                            </span>

                            {submission.topic && (
                              <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-semibold capitalize text-slate-400">
                                {submission.topic}
                              </span>
                            )}
                          </div>

                          <h2 className="mt-4 truncate text-xl font-bold">
                            {submission.questionTitle ||
                              submission.questionId ||
                              "Coding Problem"}
                          </h2>

                          <div className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                              <p className="text-xs uppercase tracking-wider text-slate-600">
                                Test Cases
                              </p>

                              <p className="mt-1 font-semibold text-slate-200">
                                {submission.passedTestCases ??
                                  0}
                                /
                                {submission.totalTestCases ??
                                  0}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs uppercase tracking-wider text-slate-600">
                                Runtime
                              </p>

                              <p className="mt-1 font-semibold text-slate-200">
                                {formatRuntime(
                                  submission.executionTime
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs uppercase tracking-wider text-slate-600">
                                Memory
                              </p>

                              <p className="mt-1 font-semibold text-slate-200">
                                {formatMemory(
                                  submission.memory
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs uppercase tracking-wider text-slate-600">
                                Submitted
                              </p>

                              <p className="mt-1 flex items-center gap-2 font-semibold text-slate-200">
                                <FiClock className="text-slate-500" />

                                {formatDate(
                                  submission.createdAt
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSubmission(
                                submission
                              );
                              setCopied(false);
                            }}
                            className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/20"
                          >
                            <FiEye />
                            View Code
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                submission._id
                              )
                            }
                            disabled={
                              deletingId ===
                              submission._id
                            }
                            className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <FiTrash2 />

                            {deletingId ===
                            submission._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>
      </main>

      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4 sm:px-6">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold">
                    {selectedSubmission.questionTitle ||
                      "Submitted Code"}
                  </h2>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      getStatusClasses(
                        selectedSubmission.status
                      ).badge
                    }`}
                  >
                    {selectedSubmission.status}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  {formatLanguage(
                    selectedSubmission.language
                  )}{" "}
                  •{" "}
                  {formatDate(
                    selectedSubmission.createdAt
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedSubmission(null)
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="grid gap-3 border-b border-slate-800 px-5 py-4 text-sm sm:grid-cols-3 sm:px-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-600">
                  Test Cases
                </p>

                <p className="mt-1 font-semibold">
                  {selectedSubmission.passedTestCases ??
                    0}
                  /
                  {selectedSubmission.totalTestCases ??
                    0}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-600">
                  Runtime
                </p>

                <p className="mt-1 font-semibold">
                  {formatRuntime(
                    selectedSubmission.executionTime
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-600">
                  Memory
                </p>

                <p className="mt-1 font-semibold">
                  {formatMemory(
                    selectedSubmission.memory
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3 sm:px-6">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <FiCode className="text-indigo-400" />
                Source Code
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
              >
                <FiCopy />
                {copied ? "Copied" : "Copy Code"}
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-[#111827]">
              <pre className="min-h-[400px] whitespace-pre p-6 font-mono text-sm leading-6 text-slate-200">
                <code>
                  {selectedSubmission.sourceCode ||
                    "// Source code is unavailable"}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;
