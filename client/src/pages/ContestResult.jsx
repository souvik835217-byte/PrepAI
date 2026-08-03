import React from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

const ContestResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contestId } = useParams();

  const {
    contest,
    submitResults = {},
    score = 0,
    solvedCount = 0,
    timeRemaining = 0,
  } = location.state || {};

  if (!contest) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-2xl font-bold">
            Contest result unavailable
          </h1>

          <p className="mt-2 text-slate-400">
            The result data was not found. Please open the
            contest again.
          </p>

          <button
            onClick={() => navigate("/dsa/contests")}
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold"
          >
            Back to Contest Arena
          </button>
        </div>
      </div>
    );
  }

  const problems = contest.problems || [];
  const totalProblems = problems.length;
  const totalPoints = contest.totalPoints || 0;

  const accuracy =
    totalProblems > 0
      ? Math.round((solvedCount / totalProblems) * 100)
      : 0;

  const totalSeconds = Number(contest.duration || 0) * 60;
  const usedSeconds = Math.max(
    0,
    totalSeconds - Number(timeRemaining || 0)
  );

  const usedMinutes = Math.floor(usedSeconds / 60);
  const usedRemainingSeconds = usedSeconds % 60;

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300">
              Contest Completed
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-4xl">
              {contest.title}
            </h1>

            <p className="mt-3 text-slate-400">
              Your final contest performance is ready.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ResultCard
              label="Final Score"
              value={`${score} / ${totalPoints}`}
            />

            <ResultCard
              label="Solved"
              value={`${solvedCount} / ${totalProblems}`}
            />

            <ResultCard
              label="Accuracy"
              value={`${accuracy}%`}
            />

            <ResultCard
              label="Time Used"
              value={`${usedMinutes}m ${usedRemainingSeconds}s`}
            />
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-bold">
            Problem Breakdown
          </h2>

          <div className="mt-5 space-y-4">
            {problems.map((problem, index) => {
              const result = submitResults[problem.id];
              const accepted =
                result?.status === "Accepted";

              return (
                <div
                  key={problem.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:flex-row md:items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {problem.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {problem.difficulty} · {problem.points} points
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <p
                        className={
                          accepted
                            ? "font-semibold text-emerald-400"
                            : "font-semibold text-red-400"
                        }
                      >
                        {accepted
                          ? "Accepted"
                          : result?.status || "Not Attempted"}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {accepted
                          ? `${problem.points} points`
                          : "0 points"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
          <h2 className="text-xl font-bold">
            Performance Feedback
          </h2>

          <p className="mt-3 leading-7 text-slate-300">
            {accuracy === 100
              ? "Excellent work. You solved every contest problem successfully."
              : accuracy >= 75
              ? "Strong performance. Review the unsolved problem and try to improve submission speed."
              : accuracy >= 50
              ? "Good attempt. Focus on the topics connected to the unsolved problems."
              : "Keep practising. Review the problem approaches and retry the contest after strengthening the related topics."}
          </p>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() =>
              navigate(
                `/dsa/contests/${contestId}/session`
              )
            }
            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500"
          >
            Retry Contest
          </button>

          <button
            onClick={() => navigate("/dsa/contests")}
            className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 font-semibold hover:bg-slate-800"
          >
            Back to Contest Arena
          </button>
        </div>
      </div>
    </div>
  );
};

const ResultCard = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
};

export default ContestResult;