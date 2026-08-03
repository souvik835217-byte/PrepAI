import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  FiAlertCircle,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiLoader,
  FiRefreshCw,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
)
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");

const ReadinessCircle = ({ score = 0 }) => {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (safeScore / 100) * circumference;

  return (
    <div className="relative flex h-44 w-44 items-center justify-center">
      <svg
        viewBox="0 0 160 160"
        className="h-44 w-44 -rotate-90"
        aria-label={`Interview readiness ${safeScore}%`}
      >
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          className="text-slate-800"
        />

        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-indigo-500 transition-all duration-700"
        />
      </svg>

      <div className="absolute text-center">
        <p className="text-4xl font-bold text-white">
          {safeScore}%
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Interview ready
        </p>
      </div>
    </div>
  );
};

const EmptyList = ({ message }) => (
  <div className="rounded-xl border border-dashed border-slate-700 p-5 text-center text-sm text-slate-500">
    {message}
  </div>
);

const LearningRoadmap = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [roadmap, setRoadmap] = useState(null);
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

  const generateRoadmap = async () => {
    if (!user?.uid || isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/learning-roadmap`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.uid,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to generate roadmap"
        );
      }

      setRoadmap(data.roadmap);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to generate your learning roadmap."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      generateRoadmap();
    }
  }, [user?.uid]);

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
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
          <FiAlertCircle className="mx-auto text-4xl text-amber-400" />

          <h1 className="mt-5 text-2xl font-bold">
            Login required
          </h1>

          <p className="mt-3 text-slate-400">
            Sign in to generate your personalized DSA roadmap.
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
              Personalized Preparation
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              AI Learning Roadmap
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              A seven-day plan generated from your DSA submissions,
              strengths, weaknesses and interview readiness.
            </p>
          </div>

          <button
            type="button"
            onClick={generateRoadmap}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-3 font-semibold text-indigo-300 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiRefreshCw
              className={isLoading ? "animate-spin" : ""}
            />

            {isLoading ? "Generating..." : "Regenerate Roadmap"}
          </button>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            <FiAlertCircle className="mt-0.5 shrink-0" />

            <p className="text-sm">{error}</p>
          </div>
        )}

        {isLoading && !roadmap ? (
          <div className="mt-8 flex min-h-[480px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900">
            <div className="text-center">
              <FiLoader className="mx-auto animate-spin text-5xl text-indigo-400" />

              <h2 className="mt-5 text-xl font-bold">
                Building your roadmap
              </h2>

              <p className="mt-2 text-slate-400">
                Analysing your submissions and preparation gaps.
              </p>
            </div>
          </div>
        ) : roadmap ? (
          <>
            <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-xl text-indigo-300">
                    <FiTarget />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Interview Readiness
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Based on your current coding history
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex justify-center">
                  <ReadinessCircle
                    score={roadmap.interviewReadiness}
                  />
                </div>

                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
                  <p className="text-sm leading-7 text-slate-300">
                    {roadmap.interviewReadiness >= 80
                      ? "You are showing strong interview readiness. Continue with timed contests and advanced problems."
                      : roadmap.interviewReadiness >= 60
                        ? "You have a solid foundation. Focus on weak topics and consistency to become interview ready."
                        : "Build broader topic coverage and practise more medium-level questions before interview simulations."}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                  <div className="flex items-center gap-3">
                    <FiCheckCircle className="text-xl text-emerald-400" />

                    <h2 className="text-xl font-bold text-emerald-300">
                      Strengths
                    </h2>
                  </div>

                  <div className="mt-5 space-y-3">
                    {roadmap.strengths?.length > 0 ? (
                      roadmap.strengths.map(
                        (strength, index) => (
                          <div
                            key={`${strength}-${index}`}
                            className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-slate-950/60 p-4"
                          >
                            <FiCheckCircle className="mt-1 shrink-0 text-emerald-400" />

                            <p className="text-sm leading-6 text-slate-300">
                              {strength}
                            </p>
                          </div>
                        )
                      )
                    ) : (
                      <EmptyList message="No strengths identified yet." />
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6">
                  <div className="flex items-center gap-3">
                    <FiTrendingUp className="text-xl text-amber-400" />

                    <h2 className="text-xl font-bold text-amber-300">
                      Areas to Improve
                    </h2>
                  </div>

                  <div className="mt-5 space-y-3">
                    {roadmap.weaknesses?.length > 0 ? (
                      roadmap.weaknesses.map(
                        (weakness, index) => (
                          <div
                            key={`${weakness}-${index}`}
                            className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-slate-950/60 p-4"
                          >
                            <FiAlertCircle className="mt-1 shrink-0 text-amber-400" />

                            <p className="text-sm leading-6 text-slate-300">
                              {weakness}
                            </p>
                          </div>
                        )
                      )
                    ) : (
                      <EmptyList message="No weaknesses identified yet." />
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-xl text-indigo-300">
                    <FiClock />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">
                      Your 7-Day Study Plan
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Two focused questions per day
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300">
                  <FiZap className="mr-2 inline" />
                  AI Personalized
                </span>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {roadmap.days?.map((day) => (
                  <article
                    key={day.day}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-indigo-500/40"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300">
                        Day {day.day}
                      </span>

                      <FiArrowRight className="text-slate-600" />
                    </div>

                    <h3 className="mt-4 text-xl font-bold">
                      {day.topic}
                    </h3>

                    <div className="mt-5 space-y-3">
                      {day.questions?.map(
                        (question, index) => (
                          <div
                            key={`${question}-${index}`}
                            className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-bold text-indigo-300">
                              {index + 1}
                            </span>

                            <p className="text-sm leading-6 text-slate-300">
                              {question}
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/dsa/topics")}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-indigo-500/50 hover:text-white"
                    >
                      Start Practice
                      <FiArrowRight />
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
            <FiZap className="mx-auto text-5xl text-indigo-400" />

            <h2 className="mt-5 text-2xl font-bold">
              Generate your roadmap
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              PrepAI will review your submissions and create a
              personalized seven-day learning plan.
            </p>

            <button
              type="button"
              onClick={generateRoadmap}
              className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-500"
            >
              Generate Roadmap
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default LearningRoadmap;
