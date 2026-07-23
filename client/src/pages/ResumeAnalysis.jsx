import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiFileText,
  FiLoader,
  FiShield,
  FiTarget,
  FiUsers,
} from "react-icons/fi";

// Read the backend URL from the Vite environment variable.
// Remove trailing slashes to prevent URLs such as:
// https://backend.com//api/interview/generate-questions
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

const ResumeAnalysis = () => {
  const navigate = useNavigate();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // Read uploaded resume information
  const resumeData = useMemo(() => {
    try {
      const savedResume = localStorage.getItem("resumeData");

      if (!savedResume) {
        return null;
      }

      return JSON.parse(savedResume);
    } catch (readError) {
      console.error("Could not read resume data:", readError);
      return null;
    }
  }, []);

  // Read interview configuration
  const interviewConfig = useMemo(() => {
    try {
      const savedConfig = localStorage.getItem("interviewConfig");

      if (!savedConfig) {
        return {
          company:
            localStorage.getItem("selectedCompany") || "General",
          targetRole: "Software Engineer",
          difficulty: "Medium",
          experienceLevel: "Fresher",
          questionCount: 5,
        };
      }

      const parsedConfig = JSON.parse(savedConfig);

      return {
        company:
          parsedConfig.company ||
          parsedConfig.selectedCompany ||
          localStorage.getItem("selectedCompany") ||
          "General",

        targetRole:
          parsedConfig.targetRole ||
          parsedConfig.role ||
          "Software Engineer",

        difficulty: parsedConfig.difficulty || "Medium",

        experienceLevel:
          parsedConfig.experienceLevel ||
          parsedConfig.experience ||
          "Fresher",

        questionCount:
          Number(parsedConfig.questionCount) || 5,
      };
    } catch (readError) {
      console.error(
        "Could not read interview configuration:",
        readError
      );

      return {
        company:
          localStorage.getItem("selectedCompany") || "General",
        targetRole: "Software Engineer",
        difficulty: "Medium",
        experienceLevel: "Fresher",
        questionCount: 5,
      };
    }
  }, []);

  const selectedCompany = useMemo(() => {
    return (
      interviewConfig.company ||
      resumeData?.company ||
      resumeData?.selectedCompany ||
      localStorage.getItem("selectedCompany") ||
      "General"
    );
  }, [interviewConfig, resumeData]);

  const questionCount = interviewConfig.questionCount;

  const generateInterview = async () => {
    if (!resumeData?.resumeText) {
      setError(
        "Resume information was not found. Please upload your resume again."
      );
      return;
    }

    if (!API_URL) {
      setError(
        "Backend URL is not configured. Add VITE_API_URL in your Vercel environment variables."
      );

      console.error(
        "Missing VITE_API_URL environment variable."
      );

      return;
    }

    try {
      setIsGenerating(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/interview/generate-questions`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            resumeText: resumeData.resumeText,

            company: selectedCompany,
            selectedCompany,

            targetRole: interviewConfig.targetRole,
            role: interviewConfig.targetRole,

            difficulty: interviewConfig.difficulty,

            experienceLevel:
              interviewConfig.experienceLevel,

            questionCount,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error(
          "Could not parse backend response:",
          jsonError
        );

        throw new Error(
          "The server returned an invalid response. Please check your backend."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to generate interview questions."
        );
      }

      if (
        !data.interview ||
        !Array.isArray(data.interview.questions) ||
        data.interview.questions.length === 0
      ) {
        throw new Error(
          "No interview questions were generated."
        );
      }

      const normalizedQuestions =
        data.interview.questions
          .slice(0, questionCount)
          .map((question, index) => ({
            ...question,
            id: question.id || index + 1,
          }));

      const normalizedInterview = {
        ...data.interview,

        questions: normalizedQuestions,

        company:
          data.interview.company ||
          data.interview.selectedCompany ||
          selectedCompany,

        selectedCompany:
          data.interview.selectedCompany ||
          data.interview.company ||
          selectedCompany,

        targetRole:
          data.interview.targetRole ||
          data.interview.role ||
          interviewConfig.targetRole,

        role:
          data.interview.role ||
          data.interview.targetRole ||
          interviewConfig.targetRole,

        difficulty:
          data.interview.difficulty ||
          interviewConfig.difficulty,

        experienceLevel:
          data.interview.experienceLevel ||
          interviewConfig.experienceLevel,

        questionCount: normalizedQuestions.length,

        requestedQuestionCount: questionCount,
      };

      localStorage.setItem(
        "interviewData",
        JSON.stringify(normalizedInterview)
      );

      localStorage.setItem(
        "interviewConfig",
        JSON.stringify({
          ...interviewConfig,
          company: selectedCompany,
          questionCount,
        })
      );

      if (
        normalizedInterview.questions.length !==
        questionCount
      ) {
        console.warn(
          `Requested ${questionCount} questions, but backend returned ${normalizedInterview.questions.length}.`
        );
      }

      navigate("/interview");
    } catch (requestError) {
      console.error(
        "Interview generation failed:",
        requestError
      );

      if (requestError instanceof TypeError) {
        setError(
          "Could not connect to the backend. Check the Render server, Vercel environment variable and CORS settings."
        );
      } else {
        setError(
          requestError.message ||
            "Could not prepare your interview. Please try again."
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!resumeData?.resumeText) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f2f5fa] px-5">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[430px] w-[430px] rounded-full bg-blue-200/40 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -right-32 h-[450px] w-[450px] rounded-full bg-indigo-200/40 blur-3xl" />

        <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/80 bg-white/90 p-8 text-center shadow-xl shadow-slate-300/30 backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl text-slate-500">
            <FiFileText />
          </div>

          <h1 className="mt-6 text-2xl font-semibold text-slate-900">
            No resume found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Upload your resume before preparing a
            personalized mock interview.
          </p>

          <button
            onClick={() => navigate("/resume")}
            className="mt-7 w-full rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Upload resume
          </button>
        </div>
      </div>
    );
  }

  const fileName =
    resumeData.fileName || "Your resume.pdf";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f2f5fa] text-slate-900">
      {/* Background effects */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-blue-200/45 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-44 -right-32 h-[480px] w-[480px] rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-3xl" />

      {/* Navbar */}
      <header className="relative z-10 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white shadow-sm">
              P
            </div>

            <div className="text-left">
              <p className="font-bold tracking-tight">
                PrepAI
              </p>

              <p className="text-xs text-slate-500">
                Interview preparation
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-2 text-sm font-medium text-emerald-700 sm:flex">
            <FiCheckCircle />
            Interview profile ready
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
        <button
          onClick={() => navigate("/resume")}
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <FiArrowLeft />
          Upload another resume
        </button>

        <div className="grid gap-7 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Resume profile section */}
          <motion.section
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-[28px] border border-white/80 bg-white/90 p-7 shadow-xl shadow-slate-300/25 backdrop-blur-xl sm:p-9"
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Preparation complete
                </p>

                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Your interview profile is ready.
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  PrepAI has reviewed your resume and is
                  ready to create a {selectedCompany}
                  -focused interview based on your projects,
                  technical skills and experience.
                </p>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-600">
                <FiCheckCircle />
              </div>
            </div>

            {/* Resume file */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-xl text-red-600">
                  <FiFileText />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {fileName}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Ready for personalized interview
                    preparation
                  </p>
                </div>

                <div className="ml-auto flex shrink-0 items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <FiCheckCircle />
                  Ready
                </div>
              </div>
            </div>

            {/* Selected configuration */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
                    Target company
                  </p>

                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {selectedCompany}
                  </p>
                </div>

                <FiBriefcase className="text-2xl text-blue-600" />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
                    Target role
                  </p>

                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {interviewConfig.targetRole}
                  </p>
                </div>

                <FiTarget className="text-2xl text-indigo-600" />
              </div>
            </div>

            {/* Interview details */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <FiTarget className="text-xl text-blue-600" />

                <p className="mt-4 text-xl font-semibold text-slate-900">
                  {questionCount} questions
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Personalized interview
                </p>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                <FiCpu className="text-xl text-indigo-600" />

                <p className="mt-4 text-xl font-semibold text-slate-900">
                  {interviewConfig.difficulty}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Difficulty level
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <FiClock className="text-xl text-emerald-600" />

                <p className="mt-4 text-xl font-semibold text-slate-900">
                  60 seconds
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Time per answer
                </p>
              </div>
            </div>

            {/* Interview focus */}
            <div className="mt-8">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Your interview will focus on
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Questions will be selected from the most
                  relevant parts of your professional profile.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    title: "Projects",
                    description:
                      "Architecture, implementation and challenges",
                    icon: <FiBriefcase />,
                  },
                  {
                    title: "Technical skills",
                    description:
                      "Concepts based on your listed technologies",
                    icon: <FiCpu />,
                  },
                  {
                    title: "Problem solving",
                    description:
                      "Debugging, scaling and system improvement",
                    icon: <FiTarget />,
                  },
                  {
                    title: "Behavioral experience",
                    description:
                      "Teamwork, decisions and real challenges",
                    icon: <FiUsers />,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      {item.icon}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Generate interview section */}
          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-[#172554] p-7 text-white shadow-2xl shadow-slate-400/20 sm:p-9"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl">
              <FiCpu />
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.17em] text-blue-300">
              Personalized mock interview
            </p>

            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight">
              Prepare your {selectedCompany} interview.
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/60">
              PrepAI will create {questionCount}{" "}
              {selectedCompany}-focused questions for the{" "}
              {interviewConfig.targetRole} role based on your
              projects, skills, achievements and professional
              experience.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Professional introduction",
                "Project and technical discussion",
                "Core technical knowledge",
                "Behavioral and teamwork experience",
                "Problem-solving and scalability",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-blue-200">
                    {index + 1}
                  </div>

                  <span className="text-sm text-white/80">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Interview format
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/50">
                    {questionCount} questions with one minute
                    per answer
                  </p>
                </div>

                <FiClock className="shrink-0 text-xl text-blue-300" />
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Candidate level
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/50">
                    {interviewConfig.experienceLevel} ·{" "}
                    {interviewConfig.difficulty} difficulty
                  </p>
                </div>

                <FiUsers className="shrink-0 text-xl text-blue-300" />
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm leading-6 text-red-200">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={generateInterview}
              disabled={isGenerating}
              className="group mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isGenerating ? (
                <>
                  <FiLoader className="animate-spin text-lg" />
                  Preparing {questionCount} questions...
                </>
              ) : (
                <>
                  Generate {questionCount}-question interview
                  <FiArrowRight className="transition group-hover:translate-x-1" />
                </>
              )}
            </button>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <FiShield className="mt-0.5 shrink-0 text-blue-300" />

              <p className="text-xs leading-5 text-white/50">
                Your questions are generated using your
                resume and selected interview configuration.
              </p>
            </div>
          </motion.aside>
        </div>
      </main>
    </div>
  );
};

export default ResumeAnalysis;
