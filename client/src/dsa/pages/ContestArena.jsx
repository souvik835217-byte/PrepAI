import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
)
  .replace(/\/api\/?$/, "")
  .replace(/\/$/, "");

const ContestArena = () => {
  const navigate = useNavigate();

  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadContests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/dsa/contests`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load contests."
          );
        }

        setContests(data.contests || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadContests();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        Loading contests...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white md:p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">
          Contest Arena
        </h1>

        <p className="mt-2 text-slate-400">
          Join timed coding contests and improve your
          problem-solving speed.
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {contests.map((contest) => (
            <div
              key={contest.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {contest.title}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    {contest.description}
                  </p>
                </div>

                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                  {contest.status}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-950 p-3">
                  <p className="text-xs text-slate-500">
                    Problems
                  </p>
                  <p className="mt-1 font-semibold">
                    {contest.problemCount}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-3">
                  <p className="text-xs text-slate-500">
                    Duration
                  </p>
                  <p className="mt-1 font-semibold">
                    {contest.duration} min
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-3">
                  <p className="text-xs text-slate-500">
                    Points
                  </p>
                  <p className="mt-1 font-semibold">
                    {contest.totalPoints}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(`/dsa/contests/${contest.id}`)
                }
                className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold transition hover:bg-indigo-500"
              >
                View Contest
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestArena;
