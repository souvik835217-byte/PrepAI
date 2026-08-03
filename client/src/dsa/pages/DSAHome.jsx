import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiBarChart2,
  FiBookOpen,
  FiBriefcase,
  FiCheckCircle,
  FiCode,
  FiFileText,
  FiRefreshCw,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";

import { AuthContext } from "../../context/authContextStore";

const cards = [
  {
    title: "Topic-wise Practice",
    description:
      "Practice Arrays, Strings, Linked Lists, Trees, Graphs, Dynamic Programming and more.",
    icon: FiBookOpen,
    path: "/dsa/topics",
  },
  {
    title: "Submission History",
    description:
      "Review accepted and failed submissions, runtime, memory and submitted code.",
    icon: FiFileText,
    path: "/dsa/submissions",
  },
  {
    title: "Company-wise Questions",
    description:
      "Prepare coding questions frequently asked by Google, Amazon, Microsoft and other companies.",
    icon: FiBriefcase,
    path: "/dsa/companies",
  },
  {
    title: "Coding Playground",
    description:
      "Write, run and test your code using multiple programming languages.",
    icon: FiCode,
    path: "/dsa/playground",
  },
];

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

const formatLanguage = (language) => {
  const labels = {
    cpp: "C++",
    java: "Java",
    python: "Python",
    javascript: "JavaScript",
  };

  return labels[language] || language || "Unknown";
};

const DSAHome = () => {
  const navigate = useNavigate();
  const { user, authLoading } = useContext(AuthContext);

  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  )
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");

  const fetchSubmissions = async (showRefreshLoader = false) => {
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

      const response = await fetch(
        `${API_BASE_URL}/api/submissions/user/${user.uid}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load your DSA progress."
        );
      }

      setSubmissions(
        Array.isArray(data.submissions) ? data.submissions : []
      );
    } catch (fetchError) {
      console.error("DSA dashboard error:", fetchError);

      setError(
        fetchError.message || "Unable to load your DSA progress."
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

    const acceptedSubmissions = submissions.filter(
      (submission) => submission.status === "Accepted"
    ).length;

    const solvedProblems = new Set(
      submissions
        .filter((submission) => submission.status === "Accepted")
        .map((submission) => submission.questionId)
    ).size;

    const attemptedProblems = new Set(
      submissions.map((submission) => submission.questionId)
    ).size;

    const acceptanceRate =
      totalSubmissions > 0
        ? (
            (acceptedSubmissions / totalSubmissions) *
            100
          ).toFixed(1)
        : "0.0";

    return {
      totalSubmissions,
      acceptedSubmissions,
      solvedProblems,
      attemptedProblems,
      acceptanceRate,
    };
  }, [submissions]);

  const recentSubmissions = useMemo(() => {
    return [...submissions]
      .sort(
        (first, second) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime()
      )
      .slice(0, 5);
  }, [submissions]);

  const statCards = [
    {
      label: "Problems Solved",
      value: analytics.solvedProblems,
      description: "Unique accepted problems",
      icon: FiCheckCircle,
      iconClasses: "bg-emerald-500/10 text-emerald-400",
    },
    {
      label: "Total Submissions",
      value: analytics.totalSubmissions,
      description: "All submitted solutions",
      icon: FiFileText,
      iconClasses: "bg-indigo-500/10 text-indigo-400",
    },
    {
      label: "Acceptance Rate",
      value: `${analytics.acceptanceRate}%`,
      description: "Accepted submission ratio",
      icon: FiBarChart2,
      iconClasses: "bg-cyan-500/10 text-cyan-400",
    },
    {
      label: "Problems Attempted",
      value: analytics.attemptedProblems,
      description: "Unique problems attempted",
      icon: FiTarget,
      iconClasses: "bg-violet-500/10 text-violet-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-8 md:p-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-indigo-400">
                PrepAI DSA Hub
              </p>

              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                Practice DSA with a clear interview roadmap
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                Solve coding problems, review submissions and track your
                preparation progress from one dashboard.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/dsa/topics")}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-500"
                >
                  Start Practising
                  <FiArrowRight />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dsa/submissions")}
                  className="rounded-xl border border-slate-700 bg-slate-900/70 px-6 py-3 font-semibold transition hover:border-slate-500"
                >
                  View Submissions
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-5 backdrop-blur">
              <p className="text-sm text-slate-400">Current user</p>

              <p className="mt-1 font-semibold">
                {user?.displayName || user?.email || "PrepAI User"}
              </p>

              <button
                type="button"
                onClick={() => fetchSubmissions(true)}
                disabled={isRefreshing}
                className="mt-4 flex items-center gap-2 text-sm font-semibold text-indigo-400 transition hover:text-indigo-300 disabled:opacity-50"
              >
                <FiRefreshCw
                  className={isRefreshing ? "animate-spin" : ""}
                />

                {isRefreshing ? "Refreshing..." : "Refresh progress"}
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="mt-10">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold">Your progress</h2>

              <p className="mt-1 text-slate-400">
                Live statistics from your coding submissions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dsa/submissions")}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-400 transition hover:text-indigo-300"
            >
              Full submission history
              <FiArrowRight />
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.label}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${card.iconClasses}`}
                  >
                    <Icon />
                  </div>

                  <p className="mt-5 text-3xl font-bold">
                    {isLoading ? "..." : card.value}
                  </p>

                  <h3 className="mt-2 font-semibold">{card.label}</h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {card.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Recent submissions</h2>

                <p className="mt-1 text-sm text-slate-400">
                  Your latest coding activity.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/dsa/submissions")}
                className="text-sm font-semibold text-indigo-400 transition hover:text-indigo-300"
              >
                View all
              </button>
            </div>

            {isLoading ? (
              <div className="mt-6 space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-xl bg-slate-800"
                  />
                ))}
              </div>
            ) : recentSubmissions.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-slate-700 px-6 py-10 text-center">
                <FiCode className="mx-auto text-4xl text-slate-600" />

                <h3 className="mt-4 font-semibold">
                  No submissions yet
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Solve your first question to start tracking progress.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/dsa/topics")}
                  className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-indigo-500"
                >
                  Browse Questions
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {recentSubmissions.map((submission) => (
                  <button
                    key={submission._id}
                    type="button"
                    onClick={() => navigate("/dsa/submissions")}
                    className="flex w-full flex-col gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-left transition hover:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                            submission.status === "Accepted"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                              : "border-red-500/20 bg-red-500/10 text-red-400"
                          }`}
                        >
                          {submission.status || "Unknown"}
                        </span>

                        <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs text-slate-400">
                          {formatLanguage(submission.language)}
                        </span>
                      </div>

                      <h3 className="mt-3 font-semibold">
                        {submission.questionTitle ||
                          submission.questionId ||
                          "Coding Problem"}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(submission.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold text-indigo-400">
                      Review
                      <FiArrowRight />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-xl text-orange-400">
              <FiTrendingUp />
            </div>

            <h2 className="mt-5 text-xl font-bold">Preparation roadmap</h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Follow this order to build strong interview preparation.
            </p>

            <div className="mt-6 space-y-4">
              {[
                "Complete Arrays and Strings",
                "Practice Linked Lists and Stacks",
                "Learn Trees and Graphs",
                "Start Dynamic Programming",
                "Join timed coding contests",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-400">
                    {index + 1}
                  </span>

                  <p className="text-sm font-medium text-slate-300">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Explore DSA preparation
            </h2>

            <p className="mt-1 text-slate-400">
              Choose how you want to practise today.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => navigate(card.path)}
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:-translate-y-1 hover:border-indigo-500/60"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl text-indigo-400">
                    <Icon />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold">
                    {card.title}
                  </h3>

                  <p className="mt-2 min-h-20 text-sm leading-6 text-slate-400">
                    {card.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-indigo-400">
                    Open section

                    <FiArrowRight className="transition group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DSAHome;
