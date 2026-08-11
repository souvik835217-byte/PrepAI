import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiCode,
  FiLayers,
  FiTarget,
  FiUser,
} from "react-icons/fi";

const companies = [
  {
    name: "General",
    label: "General Practice",
    description: "A balanced, company-neutral interview for software roles.",
  },
  {
    name: "Google",
    description: "Problem solving, DSA and clear reasoning.",
  },
  {
    name: "Amazon",
    description: "Leadership principles and technical depth.",
  },
  {
    name: "Microsoft",
    description: "Coding, design thinking and collaboration.",
  },
  {
    name: "Adobe",
    description: "Projects, fundamentals and product thinking.",
  },
  {
    name: "Flipkart",
    description: "DSA, scalable systems and practical decisions.",
  },
  {
    name: "TCS",
    description: "Core fundamentals, projects and communication.",
  },
  {
    name: "Infosys",
    description: "Programming basics, aptitude and HR questions.",
  },
];

const roles = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
];

const difficultyLevels = [
  {
    name: "Easy",
    description: "Fundamentals and basic project questions.",
  },
  {
    name: "Medium",
    description: "Practical concepts and moderate problem solving.",
  },
  {
    name: "Hard",
    description: "Advanced technical and system-level questions.",
  },
];

const experienceLevels = [
  "Fresher",
  "0–1 Year",
  "1–3 Years",
  "3+ Years",
];

const questionOptions = [5, 7, 10];

const CompanySelection = () => {
  const navigate = useNavigate();

  const storedConfig = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("interviewConfig")
      );
    } catch {
      return null;
    }
  })();

  const [selectedCompany, setSelectedCompany] = useState(
    storedConfig?.company ||
      localStorage.getItem("selectedCompany") ||
      "General"
  );

  const [selectedRole, setSelectedRole] = useState(
    storedConfig?.targetRole || "Software Engineer"
  );

  const [selectedDifficulty, setSelectedDifficulty] =
    useState(storedConfig?.difficulty || "Medium");

  const [selectedExperience, setSelectedExperience] =
    useState(storedConfig?.experienceLevel || "Fresher");

  const [questionCount, setQuestionCount] = useState(
    storedConfig?.questionCount || 5
  );

  const [error, setError] = useState("");

  const continueToResume = () => {
    if (!selectedCompany) {
      setError("Please select an interview style.");
      return;
    }

    if (!selectedRole) {
      setError("Please select your target role.");
      return;
    }

    const interviewConfig = {
      company: selectedCompany,
      targetRole: selectedRole,
      difficulty: selectedDifficulty,
      experienceLevel: selectedExperience,
      questionCount,
    };

    localStorage.setItem(
      "selectedCompany",
      selectedCompany
    );

    localStorage.setItem(
      "interviewConfig",
      JSON.stringify(interviewConfig)
    );

    setError("");

    navigate("/resume", {
      state: {
        interviewConfig,
      },
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060914] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/prepai-cinematic-hero.png')] bg-cover bg-[68%_center] opacity-[0.08] grayscale-[20%]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#060914] via-[#060914]/95 to-[#060914]/70" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(to_right,#a5b4fc_1px,transparent_1px),linear-gradient(to_bottom,#a5b4fc_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="pointer-events-none absolute -left-48 top-1/4 h-[34rem] w-[34rem] rounded-full bg-violet-600/15 blur-[130px]" />
      <div className="pointer-events-none absolute -right-48 bottom-20 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-[130px]" />

      <header className="relative z-20 border-b border-white/10 bg-slate-950/65 text-white backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3"
          >
            <img src="/favicon.svg" alt="" className="h-10 w-10 rounded-xl shadow-lg" />

            <div className="text-left">
              <p className="font-bold">PrepAI</p>

              <p className="text-xs text-slate-400">
                Interview configuration
              </p>
            </div>
          </button>

          <div className="hidden rounded-full border border-white/10 bg-white/[0.07] px-5 py-2 text-xs font-semibold text-slate-200 sm:block">
            Step 1 of 2
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <div className="relative pb-12 pt-3 sm:pb-14 sm:pt-5">

          <div className="relative z-10">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-cyan-200"
            >
              <FiArrowLeft />
              Back to dashboard
            </button>

            <div className="mt-10 max-w-3xl sm:mt-12">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">
                Interview preference
              </p>

              <h1 className="mt-5 text-4xl font-medium leading-tight tracking-[-0.045em] text-white sm:text-6xl">
                Configure your interview.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
                Choose the company, role and challenge level. PrepAI combines
                your preferences with your resume to create a focused,
                personalized interview.
              </p>

            </div>
          </div>
        </div>

        {error && (
          <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/25 backdrop-blur-xl">
            {/* Company selection */}
            <SelectionSection
              icon={<FiBriefcase />}
              title="Choose your interview style"
              description="Select general practice or prepare for a specific company."
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {companies.map((company) => {
                  const isSelected =
                    selectedCompany === company.name;

                  return (
                    <button
                      key={company.name}
                      type="button"
                      onClick={() => {
                        setSelectedCompany(company.name);
                        setError("");
                      }}
                      className={`relative min-h-[205px] rounded-2xl border p-5 text-left transition duration-200 ${
                        isSelected
                          ? "border-cyan-400/50 bg-gradient-to-br from-violet-600/25 via-slate-900/80 to-cyan-500/10 text-white shadow-lg shadow-violet-950/30"
                          : "border-white/10 bg-slate-950/45 text-white hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/[0.06]"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950/40">
                          <FiCheck />
                        </div>
                      )}

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${
                          isSelected
                            ? "bg-gradient-to-br from-violet-600 to-cyan-500 text-white"
                            : "border border-white/10 bg-white/[0.04] text-violet-300"
                        }`}
                      >
                        {company.name === "General" ? (
                          <FiTarget />
                        ) : (
                          <span className="text-sm font-bold tracking-tight">
                            {company.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-5 text-lg font-semibold">
                        {company.label || company.name}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {company.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </SelectionSection>

            {/* Role selection */}
            <SelectionSection
              icon={<FiCode />}
              title="Select your target role"
              description="Questions will focus on the skills expected for this position."
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {roles.map((role) => (
                  <OptionButton
                    key={role}
                    label={role}
                    active={selectedRole === role}
                    onClick={() => {
                      setSelectedRole(role);
                      setError("");
                    }}
                  />
                ))}
              </div>
            </SelectionSection>

            {/* Difficulty */}
            <SelectionSection
              icon={<FiTarget />}
              title="Choose interview difficulty"
              description="Select the technical depth and complexity of the questions."
            >
              <div className="grid gap-4 md:grid-cols-3">
                {difficultyLevels.map((level) => {
                  const isSelected =
                    selectedDifficulty === level.name;

                  return (
                    <button
                      key={level.name}
                      type="button"
                      onClick={() =>
                        setSelectedDifficulty(level.name)
                      }
                      className={`relative rounded-2xl border p-5 text-left transition ${
                        isSelected
                          ? "border-cyan-400/50 bg-gradient-to-br from-violet-600/20 to-cyan-500/10 text-white shadow-sm"
                          : "border-white/10 bg-slate-950/45 text-white hover:border-cyan-400/30 hover:bg-white/[0.06]"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-sm text-slate-950">
                          <FiCheck />
                        </div>
                      )}

                      <p className="font-semibold">
                        {level.name}
                      </p>

                      <p className="mt-2 pr-5 text-sm leading-6 text-slate-400">
                        {level.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </SelectionSection>

            {/* Experience */}
            <SelectionSection
              icon={<FiUser />}
              title="Experience level"
              description="PrepAI will adjust the expected depth of your answers."
            >
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {experienceLevels.map((experience) => (
                  <OptionButton
                    key={experience}
                    label={experience}
                    active={
                      selectedExperience === experience
                    }
                    onClick={() =>
                      setSelectedExperience(experience)
                    }
                  />
                ))}
              </div>
            </SelectionSection>

            {/* Question count */}
            <SelectionSection
              icon={<FiLayers />}
              title="Interview length"
              description="Choose how many questions you want in this interview."
            >
              <div className="grid grid-cols-3 gap-3">
                {questionOptions.map((count) => (
                  <OptionButton
                    key={count}
                    label={`${count} questions`}
                    active={questionCount === count}
                    onClick={() => setQuestionCount(count)}
                  />
                ))}
              </div>
            </SelectionSection>
          </div>

          {/* Summary */}
          <aside>
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-600/15 via-slate-900/90 to-cyan-500/[0.08] p-6 text-white shadow-2xl shadow-black/25 backdrop-blur-xl xl:sticky xl:top-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl text-white shadow-lg shadow-indigo-950/40">
                <FiBriefcase />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                Interview summary
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Your configuration
              </h2>

              <div className="mt-6 divide-y divide-white/[0.08]">
                <SummaryRow
                  label={
                    selectedCompany === "General"
                      ? "Interview mode"
                      : "Target company"
                  }
                  value={
                    selectedCompany === "General"
                      ? "General practice"
                      : selectedCompany
                  }
                />

                <SummaryRow
                  label="Target role"
                  value={selectedRole}
                />

                <SummaryRow
                  label="Difficulty"
                  value={selectedDifficulty}
                />

                <SummaryRow
                  label="Experience"
                  value={selectedExperience}
                />

                <SummaryRow
                  label="Questions"
                  value={`${questionCount} questions`}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.06] p-4">
                <p className="text-sm font-semibold text-white">
                  Personalized interview
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Your resume and selected preferences will be
                  used to generate relevant interview questions.
                </p>
              </div>

              <button
                type="button"
                onClick={continueToResume}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-cyan-50"
              >
                Continue to resume
                <FiArrowRight />
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

const SelectionSection = ({
  icon,
  title,
  description,
  children,
}) => {
  return (
    <section className="border-b border-white/[0.07] p-5 last:border-b-0 sm:p-7">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-lg text-violet-300">
          {icon}
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
};

const OptionButton = ({
  label,
  active,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-xl border px-4 py-3 text-sm font-semibold transition ${
        active
          ? "border-cyan-400/50 bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md shadow-violet-950/30"
          : "border-white/10 bg-slate-950/45 text-slate-300 hover:border-cyan-400/30 hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      <span className="flex items-center justify-center gap-2">
        {active && <FiCheck />}
        {label}
      </span>
    </button>
  );
};

const SummaryRow = ({ label, value }) => {
  return (
    <div className="flex items-start justify-between gap-5 py-4 first:pt-0">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <span className="max-w-[170px] text-right text-sm font-semibold text-white">
        {value}
      </span>
    </div>
  );
};

export default CompanySelection;
