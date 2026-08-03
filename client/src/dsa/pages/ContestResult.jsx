import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowRight,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiCode,
  FiTarget,
  FiTrendingUp,
  FiXCircle,
} from "react-icons/fi";

const fallbackProblems = [
  { id: "two-sum", label: "A", title: "Two Sum", marks: 100 },
  { id: "merge-intervals", label: "B", title: "Merge Intervals", marks: 100 },
  { id: "number-of-islands", label: "C", title: "Number of Islands", marks: 100 },
  { id: "lru-cache", label: "D", title: "LRU Cache", marks: 100 },
];

const fallbackResults = {
  "two-sum": { status: "Accepted", executionTime: 151 },
  "merge-intervals": { status: "Accepted", executionTime: 492 },
  "number-of-islands": { status: "Accepted", executionTime: 1100 },
  "lru-cache": { status: "Wrong Answer" },
};

const getStoredResult = (contestId) => {
  try {
    return JSON.parse(
      sessionStorage.getItem(`contest-result-${contestId}`) ||
        sessionStorage.getItem("contestResult") ||
        "null"
    );
  } catch {
    return null;
  }
};

const formatTime = (seconds) => {
  const value = Math.max(0, Math.round(Number(seconds) || 0));
  return `${Math.floor(value / 60)}m ${String(value % 60).padStart(2, "0")}s`;
};

const Stat = ({ icon: Icon, label, value, detail }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <Icon className="text-lg text-indigo-400" />
    </div>
    <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    <p className="mt-1 text-xs text-slate-500">{detail}</p>
  </div>
);

const ContestResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contestId } = useParams();
  const storedResult = useMemo(() => getStoredResult(contestId), [contestId]);
  const state = location.state || {};
  const contest = state.contest || {};
  const problems = contest.problems?.length ? contest.problems : fallbackProblems;
  const results = state.submitResults || fallbackResults;
  const solved = state.solvedCount ?? storedResult?.solved ?? 3;
  const score = state.score ?? storedResult?.score ?? 300;
  const totalScore = problems.reduce(
    (total, problem) => total + Number(problem.marks || 100),
    0
  );
  const accuracy = Math.round((solved / Math.max(problems.length, 1)) * 100);
  const duration = Number(contest.duration || storedResult?.duration || 90);
  const timeUsed = state.timeRemaining !== undefined
    ? duration * 60 - state.timeRemaining
    : Number(storedResult?.timeUsed || 58) * 60;
  const rank = storedResult?.rank || 128;

  const rows = problems.map((problem, index) => {
    const result = results[problem.id] || {};
    const accepted = result.status === "Accepted" || result.accepted === true;
    return {
      ...problem,
      label: problem.label || String.fromCharCode(65 + index),
      accepted,
      status: accepted ? "Accepted" : result.status || "Not solved",
      score: accepted ? Number(problem.marks || 100) : Number(result.score || 0),
      time: accepted ? formatTime(result.executionTime || (index + 1) * 180) : "—",
    };
  });

  const unsolved = rows.find((problem) => !problem.accepted);
  const unsolvedTopic = unsolved?.id === "lru-cache" ? "linked-list" : "arrays";

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-8">
      <main className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 border-b border-slate-800 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-400">Contest completed</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              {contest.title || "PrepAI Weekly Contest #1"}
            </h1>
            <p className="mt-2 text-slate-400">
              Your performance summary and problem breakdown.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-6 py-4 md:text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Global rank</p>
            <p className="mt-1 text-3xl font-semibold">#{rank}</p>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={FiTarget} label="Score" value={`${score} / ${totalScore}`} detail={`${accuracy}% accuracy`} />
          <Stat icon={FiCheckCircle} label="Solved" value={`${solved} / ${problems.length}`} detail={`${problems.length - solved} remaining`} />
          <Stat icon={FiClock} label="Time used" value={formatTime(timeUsed)} detail={`${duration} minute limit`} />
          <Stat icon={FiTrendingUp} label="Rating" value="+44" detail="1520 to 1564" />
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold">Problem performance</h2>
              <p className="mt-1 text-sm text-slate-500">Results from this contest</p>
            </div>
            <span className="rounded-md bg-slate-800 px-3 py-1 text-sm text-slate-300">
              {solved} accepted
            </span>
          </div>

          <div className="hidden grid-cols-[1fr_160px_120px_80px] border-b border-slate-800 px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-500 md:grid">
            <span>Problem</span><span>Status</span><span>Time</span><span className="text-right">Score</span>
          </div>

          {rows.map((problem) => (
            <div
              key={problem.id}
              className="grid gap-3 border-b border-slate-800 px-5 py-4 last:border-b-0 md:grid-cols-[1fr_160px_120px_80px] md:items-center"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-sm font-semibold text-slate-300">
                  {problem.label}
                </span>
                <div>
                  <p className="font-medium">{problem.title}</p>
                  <p className="text-xs text-slate-500">{problem.marks || 100} points</p>
                </div>
              </div>
              <p className={`flex items-center gap-2 text-sm ${problem.accepted ? "text-emerald-400" : "text-red-400"}`}>
                {problem.accepted ? <FiCheckCircle /> : <FiXCircle />}
                {problem.status}
              </p>
              <p className="text-sm text-slate-400">{problem.time}</p>
              <p className="text-right font-semibold">{problem.score}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-3 pb-8 md:grid-cols-3">
          <button
            type="button"
            onClick={() => navigate(`/dsa/contests/${contestId}/leaderboard`)}
            className="flex items-center justify-between rounded-xl bg-indigo-600 px-5 py-4 text-left font-medium transition hover:bg-indigo-500"
          >
            <span className="flex items-center gap-3"><FiBarChart2 /> Leaderboard</span><FiArrowRight />
          </button>
          <button
            type="button"
            onClick={() => unsolved && navigate(`/dsa/topics/${unsolvedTopic}/questions/${unsolved.id}`)}
            className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 text-left font-medium transition hover:border-slate-600 hover:bg-slate-800"
          >
            <span>Practice {unsolved?.title || "unsolved"}</span><FiArrowRight />
          </button>
          <button
            type="button"
            onClick={() => navigate(`/dsa/contests/${contestId}/solutions`)}
            className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 text-left font-medium transition hover:border-slate-600 hover:bg-slate-800"
          >
            <span className="flex items-center gap-3"><FiCode /> Solutions</span><FiArrowRight />
          </button>
        </section>
      </main>
    </div>
  );
};

export default ContestResult;
