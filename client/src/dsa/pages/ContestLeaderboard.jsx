import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiAward,
  FiClock,
  FiLoader,
  FiTarget,
  FiUsers,
} from "react-icons/fi";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
)
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");

const ContestLeaderboard = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState([]);
  const [contestTitle, setContestTitle] = useState(
    "Contest Leaderboard"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/leaderboard/contest/${contestId}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load leaderboard."
          );
        }

        setContestTitle(
          data.contestTitle || "Contest Leaderboard"
        );
        setLeaderboard(data.leaderboard || []);
      } catch (requestError) {
        setError(
          requestError.message ||
            "Unable to load leaderboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [contestId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <FiLoader className="mx-auto animate-spin text-4xl text-indigo-400" />
          <p className="mt-4 text-slate-400">
            Loading leaderboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-8 md:py-10">
      <main className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() =>
            navigate(`/dsa/contests/${contestId}`)
          }
          className="flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
        >
          <FiArrowLeft />
          Back to Contest
        </button>

        <header className="mt-7 rounded-3xl border border-slate-800 bg-slate-900 p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Rankings
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            {contestTitle}
          </h1>
          <p className="mt-3 flex items-center gap-2 text-slate-400">
            <FiUsers />
            {leaderboard.length} participants
          </p>
        </header>

        {error ? (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            {error}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 p-12 text-center">
            <FiAward className="mx-auto text-5xl text-slate-600" />
            <h2 className="mt-5 text-xl font-bold">
              No results yet
            </h2>
            <p className="mt-2 text-slate-400">
              Rankings will appear after participants finish.
            </p>
          </div>
        ) : (
          <section className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
            <div className="hidden grid-cols-[80px_1fr_130px_120px_130px] gap-4 border-b border-slate-800 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 md:grid">
              <span>Rank</span>
              <span>Participant</span>
              <span>Score</span>
              <span>Solved</span>
              <span>Time</span>
            </div>

            {leaderboard.map((entry) => (
              <article
                key={entry.resultId || `${entry.userId}-${entry.rank}`}
                className="grid gap-4 border-b border-slate-800 px-6 py-5 last:border-b-0 md:grid-cols-[80px_1fr_130px_120px_130px] md:items-center"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 font-bold text-indigo-300">
                  {entry.rank}
                </div>

                <div className="flex items-center gap-3">
                  <div
                    aria-label={`${entry.userName || "Participant"} avatar`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold uppercase text-slate-300"
                  >
                    {String(entry.userName || "U")
                      .trim()
                      .charAt(0)
                      .toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {entry.userName || "Participant"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {entry.accuracy || 0}% accuracy
                    </p>
                  </div>
                </div>

                <p className="flex items-center gap-2 font-bold text-indigo-300">
                  <FiAward />
                  {entry.score || 0}/{entry.totalScore || 0}
                </p>

                <p className="flex items-center gap-2 text-emerald-300">
                  <FiTarget />
                  {entry.solved || 0}/{entry.totalProblems || 0}
                </p>

                <p className="flex items-center gap-2 text-slate-300">
                  <FiClock />
                  {entry.timeUsed || 0} min
                </p>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default ContestLeaderboard;
