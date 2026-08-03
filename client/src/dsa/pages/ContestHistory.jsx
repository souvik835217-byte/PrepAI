import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";

import { useNavigate } from "react-router-dom";

import {
  FiActivity,
  FiAlertCircle,
  FiAward,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiLoader,
  FiRefreshCw,
  FiTarget,
  FiTrash2,
} from "react-icons/fi";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
)
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Date unavailable";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatTime = (timeUsed = 0) => {
  const safeTime = Math.max(
    0,
    Number(timeUsed) || 0
  );

  /*
   Your ContestSession currently saves
   timeUsed in minutes.
  */
  const hours = Math.floor(safeTime / 60);
  const minutes = safeTime % 60;

  if (hours <= 0) {
    return `${minutes} min`;
  }

  return `${hours}h ${minutes}m`;
};

const normalizeHistoryResponse = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.history)) {
    return data.history;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
};

const ContestHistory = () => {
  const navigate = useNavigate();

  const [history, setHistory] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deletingId, setDeletingId] =
    useState("");

  const fetchContestHistory = useCallback(
    async (userId) => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/contest-history/user/${userId}`
        );

        const contentType =
          response.headers.get("content-type");

        if (
          !contentType?.includes(
            "application/json"
          )
        ) {
          throw new Error(
            "The server returned an invalid response."
          );
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load contest history."
          );
        }

        setHistory(
          normalizeHistoryResponse(data)
        );
      } catch (requestError) {
        console.error(
          "Contest history error:",
          requestError
        );

        setError(
          requestError.message ||
            "Unable to load contest history."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const auth = getAuth();

    setLoading(true);

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {
          if (!user?.uid) {
            setHistory([]);
            setLoading(false);
            setError(
              "Please log in to view your contest history."
            );

            return;
          }

          fetchContestHistory(user.uid);
        }
      );

    return () => unsubscribe();
  }, [fetchContestHistory]);

  const handleViewResult = (result) => {
    const resultId =
      result?._id || result?.id;

    if (!resultId) {
      setError(
        "This saved record has no result ID. Update the history controller to return _id."
      );

      return;
    }

    navigate(
      `/dsa/contest-history/${resultId}`
    );
  };

  const handleDelete = async (result) => {
    const resultId =
      result?._id || result?.id;

    if (!resultId) {
      setError(
        "This saved record has no result ID and cannot be deleted."
      );

      return;
    }

    const confirmed = window.confirm(
      `Delete ${
        result.contestTitle ||
        result.title ||
        "this contest result"
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(resultId);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/contest-history/${resultId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        data?.success === false
      ) {
        throw new Error(
          data?.message ||
            "Unable to delete contest result."
        );
      }

      setHistory((currentHistory) =>
        currentHistory.filter(
          (item) =>
            (item._id || item.id) !==
            resultId
        )
      );
    } catch (requestError) {
      console.error(
        "Delete contest result error:",
        requestError
      );

      setError(
        requestError.message ||
          "Unable to delete contest result."
      );
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <div className="text-center">
          <FiLoader className="mx-auto animate-spin text-4xl text-indigo-400" />

          <p className="mt-4 text-slate-400">
            Loading contest history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-400">
              Performance Tracking
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Contest History
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Review previous contests,
              scores, accuracy and solved
              problems.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                const auth = getAuth();
                const userId =
                  auth.currentUser?.uid;

                if (!userId) {
                  setError(
                    "Please log in to view your contest history."
                  );
                  return;
                }

                fetchContestHistory(userId);
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white"
            >
              <FiRefreshCw />
              Refresh
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/dsa/contests"
                )
              }
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500"
            >
              Open Contest Arena
            </button>
          </div>
        </header>

        {error && (
          <div className="mt-7 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            <FiAlertCircle className="mt-0.5 shrink-0 text-xl" />

            <div className="flex-1">
              <p className="font-semibold">
                Something went wrong
              </p>

              <p className="mt-1 text-sm text-red-200">
                {error}
              </p>
            </div>
          </div>
        )}

        {history.length === 0 ? (
          <section className="mt-10 rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-300">
              <FiAward className="text-4xl" />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              No contests completed yet
            </h2>

            <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-400">
              Complete your first contest
              and its result will appear
              here automatically.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/dsa/contests"
                )
              }
              className="mt-7 rounded-xl bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-500"
            >
              Start a Contest
            </button>
          </section>
        ) : (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                icon={<FiAward />}
                label="Contests Completed"
                value={history.length}
              />

              <SummaryCard
                icon={<FiCheckCircle />}
                label="Problems Solved"
                value={history.reduce(
                  (total, result) =>
                    total +
                    Number(
                      result.solved ??
                        result.solvedProblems ??
                        result.solvedCount ??
                        0
                    ),
                  0
                )}
              />

              <SummaryCard
                icon={<FiActivity />}
                label="Average Accuracy"
                value={`${Math.round(
                  history.reduce(
                    (total, result) =>
                      total +
                      Number(
                        result.accuracy ||
                          0
                      ),
                    0
                  ) / history.length
                )}%`}
              />

              <SummaryCard
                icon={<FiTarget />}
                label="Best Score"
                value={Math.max(
                  ...history.map(
                    (result) =>
                      Number(
                        result.score || 0
                      )
                  )
                )}
              />
            </section>

            <section className="mt-8 space-y-5">
              {history.map(
                (result, index) => {
                  const resultId =
                    result._id ||
                    result.id ||
                    `contest-${index}`;

                  const title =
                    result.contestTitle ||
                    result.title ||
                    "Untitled Contest";

                  const solved =
                    result.solved ??
                    result.solvedProblems ??
                    result.solvedCount ??
                    0;

                  const totalProblems =
                    result.totalProblems ??
                    result.problemCount ??
                    0;

                  const score =
                    Number(
                      result.score
                    ) || 0;

                  const totalScore =
                    Number(
                      result.totalScore
                    ) || 0;

                  const accuracy =
                    Number(
                      result.accuracy
                    ) || 0;

                  const timeUsed =
                    Number(
                      result.timeUsed ??
                        result.timeUsedMinutes ??
                        0
                    ) || 0;

                  const perfectScore =
                    totalScore > 0 &&
                    score === totalScore;

                  return (
                    <article
                      key={resultId}
                      className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 transition hover:border-slate-700"
                    >
                      <div className="flex flex-col justify-between gap-5 border-b border-slate-800 p-6 md:flex-row md:items-start">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-xl font-bold text-indigo-300">
                              {index + 1}
                            </div>

                            <div>
                              <h2 className="text-xl font-bold md:text-2xl">
                                {title}
                              </h2>

                              <p className="mt-1 text-sm text-slate-500">
                                {formatDate(
                                  result.createdAt
                                )}
                              </p>
                            </div>

                            {perfectScore && (
                              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                                Perfect Score
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleViewResult(
                                result
                              )
                            }
                            disabled={
                              !result._id &&
                              !result.id
                            }
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <FiEye />
                            View Result
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                result
                              )
                            }
                            disabled={
                              deletingId ===
                                (result._id ||
                                  result.id) ||
                              (!result._id &&
                                !result.id)
                            }
                            className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {deletingId ===
                            (result._id ||
                              result.id) ? (
                              <FiLoader className="animate-spin" />
                            ) : (
                              <FiTrash2 />
                            )}

                            {deletingId ===
                            (result._id ||
                              result.id)
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
                        <MetricCard
                          icon={
                            <FiAward />
                          }
                          label="Final Score"
                          value={`${score} / ${totalScore}`}
                        />

                        <MetricCard
                          icon={
                            <FiCheckCircle />
                          }
                          label="Solved"
                          value={`${solved} / ${totalProblems}`}
                        />

                        <MetricCard
                          icon={
                            <FiActivity />
                          }
                          label="Accuracy"
                          value={`${accuracy}%`}
                        />

                        <MetricCard
                          icon={
                            <FiClock />
                          }
                          label="Time Used"
                          value={formatTime(
                            timeUsed
                          )}
                        />
                      </div>

                      <div className="border-t border-slate-800 px-6 py-4">
                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  accuracy
                                )
                              )}%`,
                            }}
                          />
                        </div>

                        <div className="mt-2 flex justify-between text-xs text-slate-500">
                          <span>
                            Contest performance
                          </span>

                          <span>
                            {accuracy}%
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center gap-3 text-slate-400">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-300">
          {icon}
        </span>

        <p className="text-sm">
          {label}
        </p>
      </div>

      <p className="mt-4 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
};

const MetricCard = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="text-indigo-300">
          {icon}
        </span>

        <p className="text-sm">
          {label}
        </p>
      </div>

      <p className="mt-3 text-xl font-bold">
        {value}
      </p>
    </div>
  );
};

export default ContestHistory;
