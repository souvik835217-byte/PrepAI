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
    description: "Balanced interview for software roles.",
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
      setError("Please select a company.");
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
    <div className="relative min-h-screen overflow-hidden bg-[#eef2f7] text-slate-900">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[430px] w-[430px] rounded-full bg-blue-200/40 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[480px] w-[480px] rounded-full bg-indigo-200/35 blur-3xl" />

      <header className="relative z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white">
              P
            </div>

            <div className="text-left">
              <p className="font-bold">PrepAI</p>

              <p className="text-xs text-slate-500">
                Interview configuration
              </p>
            </div>
          </button>

          <div className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 sm:block">
            Step 1 of 2
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <FiArrowLeft />
          Back to dashboard
        </button>

        <div className="mt-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.17em] text-blue-600">
            Interview preference
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Configure your interview
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
            Select your target company, role and interview
            difficulty. PrepAI will combine these preferences
            with your resume to generate personalized questions.
          </p>
        </div>

        {error && (
          <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mt-9 grid gap-7 xl:grid-cols-[1fr_340px]">
          <div className="space-y-7">
            {/* Company selection */}
            <SelectionSection
              icon={<FiBriefcase />}
              title="Choose your target company"
              description="The interview style and evaluation will be adapted to the selected company."
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
                      className={`relative rounded-[22px] border p-5 text-left shadow-lg transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-blue-200/30"
                          : "border-white/80 bg-white/90 shadow-slate-300/20 hover:-translate-y-1 hover:border-blue-200"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                          <FiCheck />
                        </div>
                      )}

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <FiBriefcase />
                      </div>

                      <h2 className="mt-5 text-lg font-semibold">
                        {company.name}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
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
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-sm text-white">
                          <FiCheck />
                        </div>
                      )}

                      <p className="font-semibold">
                        {level.name}
                      </p>

                      <p className="mt-2 pr-5 text-sm leading-6 text-slate-500">
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
            <div className="rounded-[26px] border border-white/80 bg-white/95 p-6 shadow-xl shadow-slate-300/20 xl:sticky xl:top-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white">
                <FiBriefcase />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                Interview summary
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Your configuration
              </h2>

              <div className="mt-6 divide-y divide-slate-100">
                <SummaryRow
                  label="Company"
                  value={selectedCompany}
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

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">
                  Personalized interview
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Your resume and selected preferences will be
                  used to generate relevant interview questions.
                </p>
              </div>

              <button
                type="button"
                onClick={continueToResume}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
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
    <section className="rounded-[26px] border border-white/80 bg-white/90 p-5 shadow-xl shadow-slate-300/20 sm:p-7">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-700">
          {icon}
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
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
          ? "border-slate-900 bg-slate-900 text-white shadow-md"
          : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
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
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="max-w-[170px] text-right text-sm font-semibold text-slate-900">
        {value}
      </span>
    </div>
  );
};

export default CompanySelection;