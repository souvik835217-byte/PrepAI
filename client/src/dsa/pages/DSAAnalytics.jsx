import React, { useEffect, useMemo, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  FiActivity,
  FiAlertCircle,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiCode,
  FiLoader,
  FiRefreshCw,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
)
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");

const topicTotals = {
  arrays: 20,
  strings: 20,
  "linked-list": 15,
  stack: 12,
  queue: 12,
  tree: 18,
  graph: 18,
  dp: 20,
  greedy: 15,
  hashing: 15,
};

const topicLabels = {
  arrays: "Arrays",
  strings: "Strings",
  "linked-list": "Linked List",
  stack: "Stack",
  queue: "Queue",
  tree: "Trees",
  graph: "Graphs",
  dp: "Dynamic Programming",
  greedy: "Greedy",
  hashing: "Hashing",
};

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

const normalizeTopic = (value = "") =>
  String(value).trim().toLowerCase();

const normalizeStatus = (value = "") =>
  String(value).trim().toLowerCase();

const StatCard = ({
  icon,
  label,
  value,
  description,
}) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <div className="flex items-center justify-between">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-xl text-indigo-300">
        {icon}
      </div>
    </div>

    <p className="mt-5 text-sm text-slate-500">
      {label}
    </p>

    <p className="mt-2 text-3xl font-bold text-white">
      {value}
    </p>

    <p className="mt-1 text-xs text-slate-500">
      {description}
    </p>
  </div>
);

const ProgressBar = ({
  label,
  value,
  total,
  percentage,
}) => (
  <div>
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="font-medium text-slate-300">
        {label}
      </span>

      <span className="text-slate-500">
        {value}/{total} · {percentage}%
      </span>
    </div>

    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-800">
      <div
        className="h-full rounded-full bg-indigo-500 transition-all duration-500"
        style={{
          width: `${Math.min(100, Math.max(0, percentage))}%`,
        }}
      />
    </div>
  </div>
);

const DSAAnalytics = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  const loadAnalytics = async () => {
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
          data.message || "Unable to load analytics"
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
          "Unable to load DSA analytics."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [user?.uid]);

  const analytics = useMemo(() => {
    const totalSubmissions = submissions.length;

    const acceptedSubmissions = submissions.filter(
      (submission) =>
        normalizeStatus(submission.status) === "accepted"
    );

    const acceptedCount = acceptedSubmissions.length;

    const accuracy =
      totalSubmissions > 0
        ? Math.round(
            (acceptedCount / totalSubmissions) * 100
          )
        : 0;

    const solvedQuestionIds = new Set(
      acceptedSubmissions.map(
        (submission) => submission.questionId
      )
    );

    const totalSolved = solvedQuestionIds.size;

    const runtimes = acceptedSubmissions
      .map((submission) =>
        Number.parseFloat(submission.executionTime)
      )
      .filter(Number.isFinite);

    const bestRuntime =
      runtimes.length > 0
        ? `${Math.min(...runtimes).toFixed(3)}s`
        : "—";

    const languageCounts = submissions.reduce(
      (counts, submission) => {
        const language = submission.language || "unknown";

        counts[language] =
          (counts[language] || 0) + 1;

        return counts;
      },
      {}
    );

    const favoriteLanguageEntry = Object.entries(
      languageCounts
    ).sort((first, second) => second[1] - first[1])[0];

    const favoriteLanguage = favoriteLanguageEntry
      ? languageLabels[favoriteLanguageEntry[0]] ||
        favoriteLanguageEntry[0]
      : "—";

    const solvedByTopic = acceptedSubmissions.reduce(
      (groups, submission) => {
        const topic = normalizeTopic(submission.topic);

        if (!topic) {
          return groups;
        }

        if (!groups[topic]) {
          groups[topic] = new Set();
        }

        groups[topic].add(submission.questionId);

        return groups;
      },
      {}
    );

    const topicProgress = Object.keys(topicTotals).map(
      (topic) => {
        const solved =
          solvedByTopic[topic]?.size || 0;

        const total = topicTotals[topic];

        const percentage =
          total > 0
            ? Math.round((solved / total) * 100)
            : 0;

        return {
          topic,
          label: topicLabels[topic] || topic,
          solved,
          total,
          percentage,
        };
      }
    );

    const difficulty = acceptedSubmissions.reduce(
      (counts, submission) => {
        const value = String(
          submission.difficulty || "Easy"
        ).toLowerCase();

        if (value === "medium") {
          counts.medium += 1;
        } else if (value === "hard") {
          counts.hard += 1;
        } else {
          counts.easy += 1;
        }

        return counts;
      },
      {
        easy: 0,
        medium: 0,
        hard: 0,
      }
    );

    const companyCounts = acceptedSubmissions.reduce(
      (counts, submission) => {
        const company =
          submission.company || "General";

        counts[company] =
          (counts[company] || 0) + 1;

        return counts;
      },
      {}
    );

    const companies = Object.entries(companyCounts)
      .sort((first, second) => second[1] - first[1])
      .slice(0, 6)
      .map(([name, count]) => ({
        name,
        count,
      }));

    const recentActivity = [...submissions]
      .sort(
        (first, second) =>
          new Date(second.createdAt) -
          new Date(first.createdAt)
      )
      .slice(0, 6);

    return {
      totalSubmissions,
      acceptedCount,
      accuracy,
      totalSolved,
      bestRuntime,
      favoriteLanguage,
      topicProgress,
      difficulty,
      companies,
      recentActivity,
    };
  }, [submissions]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <FiLoader className="animate-spin text-4xl text-indigo-400" />
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
            Sign in to view your DSA performance analytics.
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
              Analytics Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Track your solved questions, accuracy,
              topic progress and recent coding activity.
            </p>
          </div>

          <button
            type="button"
            onClick={loadAnalytics}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold transition hover:border-slate-600 disabled:opacity-50"
          >
            <FiRefreshCw
              className={isLoading ? "animate-spin" : ""}
            />

            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex min-h-[450px] items-center justify-center">
            <div className="text-center">
              <FiLoader className="mx-auto animate-spin text-4xl text-indigo-400" />

              <p className="mt-4 text-slate-400">
                Loading analytics...
              </p>
            </div>
          </div>
        ) : (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<FiCheckCircle />}
                label="Solved Questions"
                value={analytics.totalSolved}
                description="Unique accepted problems"
              />

              <StatCard
                icon={<FiTarget />}
                label="Acceptance Rate"
                value={`${analytics.accuracy}%`}
                description={`${analytics.acceptedCount}/${analytics.totalSubmissions} accepted submissions`}
              />

              <StatCard
                icon={<FiClock />}
                label="Best Runtime"
                value={analytics.bestRuntime}
                description="Fastest accepted execution"
              />

              <StatCard
                icon={<FiCode />}
                label="Favorite Language"
                value={analytics.favoriteLanguage}
                description="Most frequently used language"
              />
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-center gap-3">
                  <FiTrendingUp className="text-xl text-indigo-400" />

                  <div>
                    <h2 className="text-xl font-bold">
                      Topic Progress
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Progress based on unique accepted questions
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  {analytics.topicProgress.map((item) => (
                    <ProgressBar
                      key={item.topic}
                      label={item.label}
                      value={item.solved}
                      total={item.total}
                      percentage={item.percentage}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-center gap-3">
                  <FiBarChart2 className="text-xl text-indigo-400" />

                  <div>
                    <h2 className="text-xl font-bold">
                      Difficulty Breakdown
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Accepted submissions by difficulty
                    </p>
                  </div>
                </div>

                <div className="mt-7 space-y-5">
                  {[
                    {
                      label: "Easy",
                      value: analytics.difficulty.easy,
                    },
                    {
                      label: "Medium",
                      value: analytics.difficulty.medium,
                    },
                    {
                      label: "Hard",
                      value: analytics.difficulty.hard,
                    },
                  ].map((item) => {
                    const total =
                      analytics.difficulty.easy +
                      analytics.difficulty.medium +
                      analytics.difficulty.hard;

                    const percentage =
                      total > 0
                        ? Math.round(
                            (item.value / total) * 100
                          )
                        : 0;

                    return (
                      <ProgressBar
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        total={total || 0}
                        percentage={percentage}
                      />
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-center gap-3">
                  <FiActivity className="text-xl text-indigo-400" />

                  <div>
                    <h2 className="text-xl font-bold">
                      Company Progress
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Accepted attempts grouped by company
                    </p>
                  </div>
                </div>

                {analytics.companies.length === 0 ? (
                  <div className="mt-8 rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
                    No company data available yet.
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {analytics.companies.map((company) => {
                      const maxCount = Math.max(
                        ...analytics.companies.map(
                          (item) => item.count
                        ),
                        1
                      );

                      const percentage = Math.round(
                        (company.count / maxCount) * 100
                      );

                      return (
                        <div key={company.name}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-300">
                              {company.name}
                            </span>

                            <span className="text-slate-500">
                              {company.count}
                            </span>
                          </div>

                          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full bg-indigo-500"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-center gap-3">
                  <FiClock className="text-xl text-indigo-400" />

                  <div>
                    <h2 className="text-xl font-bold">
                      Recent Activity
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Latest coding submissions
                    </p>
                  </div>
                </div>

                {analytics.recentActivity.length === 0 ? (
                  <div className="mt-8 rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
                    No recent activity yet.
                  </div>
                ) : (
                  <div className="mt-6 space-y-3">
                    {analytics.recentActivity.map(
                      (submission) => {
                        const accepted =
                          normalizeStatus(
                            submission.status
                          ) === "accepted";

                        return (
                          <div
                            key={submission._id}
                            className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                  accepted
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-red-500/10 text-red-400"
                                }`}
                              >
                                {accepted ? (
                                  <FiCheckCircle />
                                ) : (
                                  <FiAlertCircle />
                                )}
                              </div>

                              <div>
                                <p className="font-semibold text-white">
                                  {submission.questionTitle ||
                                    submission.title ||
                                    submission.questionId}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {languageLabels[
                                    submission.language
                                  ] ||
                                    submission.language ||
                                    "Unknown language"}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p
                                className={`text-sm font-semibold ${
                                  accepted
                                    ? "text-emerald-400"
                                    : "text-red-400"
                                }`}
                              >
                                {submission.status}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {formatDate(
                                  submission.createdAt
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default DSAAnalytics;