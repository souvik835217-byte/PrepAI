import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
)
  .replace(/\/api\/?$/, "")
  .replace(/\/$/, "");

const ContestDetails = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadContest = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/dsa/contests/${contestId}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load contest."
          );
        }

        setContest(data.contest);
      } catch (err) {
        setError(
          err.message ||
            "Something went wrong while loading the contest."
        );
      } finally {
        setLoading(false);
      }
    };

    loadContest();
  }, [contestId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse space-y-5">
            <div className="h-8 w-72 rounded bg-slate-800" />
            <div className="h-4 w-full max-w-2xl rounded bg-slate-800" />
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 rounded-2xl bg-slate-900"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
            <h2 className="text-xl font-semibold text-red-300">
              Contest could not be loaded
            </h2>

            <p className="mt-2 text-sm text-red-200">
              {error || "Contest not found."}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/dsa/contests")
              }
              className="mt-5 rounded-xl bg-slate-800 px-5 py-2.5 font-medium transition hover:bg-slate-700"
            >
              Back to Contests
            </button>
          </div>
        </div>
      </div>
    );
  }

  const problems = contest.problems || [];

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate("/dsa/contests")}
          className="mb-6 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          ← Back to Contest Arena
        </button>

        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-6 md:p-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-300">
                    {contest.status}
                  </span>

                  <span className="text-sm text-slate-500">
                    Contest ID: {contest.id}
                  </span>
                </div>

                <h1 className="text-3xl font-bold md:text-4xl">
                  {contest.title}
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                  {contest.description}
                </p>
              </div>

              <div className="shrink-0 self-start">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/dsa/contests/${contest.id}/session`
                    )
                  }
                  style={{ height: "fit-content" }}
                  className="block whitespace-nowrap rounded-xl bg-indigo-600 px-6 py-3 font-semibold leading-6 transition hover:bg-indigo-500"
                >
                  Start Contest
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-500">
                Problems
              </p>

              <p className="mt-2 text-2xl font-bold">
                {problems.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-500">
                Duration
              </p>

              <p className="mt-2 text-2xl font-bold">
                {contest.duration} minutes
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm text-slate-500">
                Total Points
              </p>

              <p className="mt-2 text-2xl font-bold">
                {contest.totalPoints}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-2xl font-bold">
              Contest Problems
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Problems will unlock inside the timed
              contest session.
            </p>
          </div>

          <div className="space-y-4">
            {problems.map((problem, index) => (
              <div
                key={problem.id}
                className="flex items-center justify-between gap-5 rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 font-bold text-slate-300">
                    {String.fromCharCode(65 + index)}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">
                      Problem {String.fromCharCode(65 + index)}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Unlocks after entering the contest
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
                  Locked
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <h3 className="font-semibold text-amber-200">
            Before you begin
          </h3>

          <p className="mt-2 text-sm leading-6 text-amber-100/70">
            The contest timer begins when you enter the
            session. Each accepted problem earns its
            assigned points. Make sure your server and
            Judge0 execution service are running.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ContestDetails;
