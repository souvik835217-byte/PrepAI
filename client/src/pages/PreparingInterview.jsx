import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaCheck,
  FaFileAlt,
  FaBuilding,
  FaQuestionCircle,
  FaMicrophone,
  FaClock,
} from "react-icons/fa";

const preparationSteps = [
  {
    id: 1,
    title: "Resume analysed",
    description: "Your skills and project experience are ready.",
    icon: FaFileAlt,
  },
  {
    id: 2,
    title: "Interview preferences loaded",
    description: "Company, role and difficulty have been applied.",
    icon: FaBuilding,
  },
  {
    id: 3,
    title: "Questions prepared",
    description: "Your personalised interview questions are ready.",
    icon: FaQuestionCircle,
  },
  {
    id: 4,
    title: "Voice assistant initialised",
    description: "The AI interviewer is ready to speak.",
    icon: FaMicrophone,
  },
  {
    id: 5,
    title: "Interview timer ready",
    description: "Your answer timer has been configured.",
    icon: FaClock,
  },
];

const PreparingInterview = () => {
  const navigate = useNavigate();

  const [completedSteps, setCompletedSteps] = useState(0);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCompletedSteps((current) => {
        if (current >= preparationSteps.length) {
          clearInterval(stepInterval);
          return current;
        }

        return current + 1;
      });
    }, 450);

    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    if (completedSteps < preparationSteps.length) {
      return;
    }

    const countdownInterval = setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          clearInterval(countdownInterval);

          setTimeout(() => {
            navigate("/interview", {
              replace: true,
            });
          }, 400);

          return 0;
        }

        return current - 1;
      });
    }, 700);

    return () => clearInterval(countdownInterval);
  }, [completedSteps, navigate]);

  const progress =
    (completedSteps / preparationSteps.length) * 100;

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900 flex items-center justify-center px-5 py-10 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-blue-200/45 blur-[120px]" />

      <div className="absolute -bottom-28 -right-20 w-[430px] h-[430px] rounded-full bg-violet-200/40 blur-[130px]" />

      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <main className="relative w-full max-w-3xl">
        <section className="rounded-[34px] border border-white bg-white/85 backdrop-blur-xl shadow-2xl shadow-slate-300/50 overflow-hidden">
          <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-7 py-9 md:px-11 md:py-11 text-white overflow-hidden">
            <div className="absolute -top-24 -right-14 w-72 h-72 rounded-full bg-white/15 blur-[80px]" />

            <div className="absolute -bottom-28 -left-12 w-72 h-72 rounded-full bg-cyan-300/15 blur-[90px]" />

            <div className="relative flex flex-col items-center text-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-white blur-xl opacity-30" />

                <div className="relative w-14 h-14 rounded-2xl border border-white/20 bg-white/15 backdrop-blur flex items-center justify-center text-xl font-black">
                  P
                </div>
              </div>

              <p className="mt-5 text-sm font-semibold text-blue-100">
                PrepAI Interview
              </p>

              <h1 className="mt-2 text-3xl md:text-4xl font-black tracking-tight">
                Preparing your interview
              </h1>

              <p className="mt-3 max-w-xl text-sm md:text-base leading-7 text-blue-100">
                We are applying your resume, role and interview
                preferences before the first question begins.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-10">
            <div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-bold text-slate-700">
                  Interview preparation
                </p>

                <p className="text-sm font-bold text-blue-600">
                  {Math.round(progress)}%
                </p>
              </div>

              <div className="mt-3 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-all duration-500 ease-out"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-7 space-y-3">
              {preparationSteps.map((step, index) => {
                const Icon = step.icon;
                const isComplete = index < completedSteps;
                const isCurrent = index === completedSteps;

                return (
                  <div
                    key={step.id}
                    className={`rounded-2xl border p-4 flex items-center gap-4 transition-all duration-300 ${
                      isComplete
                        ? "border-emerald-200 bg-emerald-50/70"
                        : isCurrent
                        ? "border-blue-200 bg-blue-50/70 shadow-sm shadow-blue-100"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                        isComplete
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isComplete ? (
                        <FaCheck className="text-sm" />
                      ) : isCurrent ? (
                        <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      ) : (
                        <Icon />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`font-bold ${
                          isComplete
                            ? "text-emerald-900"
                            : isCurrent
                            ? "text-blue-900"
                            : "text-slate-500"
                        }`}
                      >
                        {step.title}
                      </p>

                      <p
                        className={`mt-1 text-sm ${
                          isComplete
                            ? "text-emerald-700"
                            : isCurrent
                            ? "text-blue-700"
                            : "text-slate-400"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 min-h-[100px]">
              {completedSteps < preparationSteps.length ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 flex items-center gap-4">
                  <span className="w-5 h-5 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin shrink-0" />

                  <div>
                    <p className="font-bold text-slate-800">
                      Please wait
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Do not refresh or close this page.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-violet-50 px-5 py-5 flex items-center justify-between gap-5">
                  <div>
                    <p className="font-bold text-slate-900">
                      Everything is ready
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Your interview will begin automatically.
                    </p>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white flex flex-col items-center justify-center shadow-lg shadow-blue-200 shrink-0">
                    {countdown > 0 ? (
                      <>
                        <span className="text-2xl font-black leading-none">
                          {countdown}
                        </span>

                        <span className="mt-1 text-[9px] font-bold uppercase tracking-wide text-blue-100">
                          seconds
                        </span>
                      </>
                    ) : (
                      <FaCheck className="text-xl" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <p className="mt-5 text-center text-xs text-slate-500">
          Your timer will not begin until the AI interviewer finishes
          reading the first question.
        </p>
      </main>
    </div>
  );
};

export default PreparingInterview;