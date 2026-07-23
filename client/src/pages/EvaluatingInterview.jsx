import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiMessageCircle,
  FiCpu,
  FiTrendingUp,
  FiFileText,
} from "react-icons/fi";

const steps = [
  {
    title: "Reviewing communication",
    description: "Checking clarity, structure and delivery.",
    icon: FiMessageCircle,
  },
  {
    title: "Checking technical accuracy",
    description: "Reviewing correctness and depth.",
    icon: FiCpu,
  },
  {
    title: "Measuring confidence",
    description: "Evaluating consistency and answer quality.",
    icon: FiTrendingUp,
  },
  {
    title: "Generating final report",
    description: "Preparing your performance summary.",
    icon: FiFileText,
  },
];

const EvaluatingInterview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCompletedSteps((current) => {
        if (current >= steps.length) {
          window.clearInterval(interval);
          return current;
        }

        return current + 1;
      });
    }, 700);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (completedSteps < steps.length) {
      return;
    }

    const timeout = window.setTimeout(() => {
      navigate("/result", {
        replace: true,
        state: location.state,
      });
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [completedSteps, location.state, navigate]);

  const progress = (completedSteps / steps.length) * 100;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f7fb] px-5 py-10">
      <div className="pointer-events-none absolute -left-28 -top-28 h-[420px] w-[420px] rounded-full bg-blue-200/40 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-28 h-[450px] w-[450px] rounded-full bg-violet-200/40 blur-3xl" />

      <main className="relative z-10 w-full max-w-3xl">
        <section className="overflow-hidden rounded-[32px] border border-white/80 bg-white/90 shadow-2xl shadow-slate-300/30 backdrop-blur-xl">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-7 py-10 text-center text-white sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold">
              P
            </div>

            <p className="mt-5 text-sm font-semibold text-blue-200">
              PrepAI Evaluation
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Evaluating your interview
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/60">
              Your responses are being reviewed to generate a detailed
              interview performance report.
            </p>
          </div>

          <div className="p-6 sm:p-9">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                Evaluation progress
              </p>

              <p className="text-sm font-bold text-blue-600">
                {Math.round(progress)}%
              </p>
            </div>

            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-7 space-y-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const complete = index < completedSteps;
                const current = index === completedSteps;

                return (
                  <div
                    key={step.title}
                    className={`flex items-center gap-4 rounded-2xl border p-4 transition ${
                      complete
                        ? "border-emerald-200 bg-emerald-50"
                        : current
                        ? "border-blue-200 bg-blue-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        complete
                          ? "bg-emerald-500 text-white"
                          : current
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {complete ? (
                        <FiCheckCircle />
                      ) : current ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      ) : (
                        <Icon />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {step.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-center">
              <p className="font-semibold text-slate-800">
                Please do not refresh this page
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your final report will open automatically.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EvaluatingInterview;