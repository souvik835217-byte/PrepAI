import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBriefcase,
  FaBuilding,
  FaCode,
  FaLaptopCode,
  FaLayerGroup,
  FaUserTie,
} from "react-icons/fa";

const companies = [
  {
    id: "general",
    name: "General",
    description: "Balanced interview questions for most software roles.",
  },
  {
    id: "google",
    name: "Google",
    description: "Problem solving, algorithms and scalable system thinking.",
  },
  {
    id: "amazon",
    name: "Amazon",
    description: "Leadership principles, ownership and technical depth.",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    description: "Collaboration, coding and product-oriented thinking.",
  },
  {
    id: "atlassian",
    name: "Atlassian",
    description: "Teamwork, product engineering and system design.",
  },
  {
    id: "flipkart",
    name: "Flipkart",
    description: "DSA, backend engineering and scalable commerce systems.",
  },
];

const roles = [
  {
    id: "software-engineer",
    name: "Software Engineer",
    icon: FaLaptopCode,
  },
  {
    id: "frontend-developer",
    name: "Frontend Developer",
    icon: FaCode,
  },
  {
    id: "backend-developer",
    name: "Backend Developer",
    icon: FaLayerGroup,
  },
  {
    id: "full-stack-developer",
    name: "Full Stack Developer",
    icon: FaBriefcase,
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    icon: FaBuilding,
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    icon: FaUserTie,
  },
];

const difficultyOptions = [
  {
    id: "beginner",
    label: "Beginner",
    description: "Fundamentals and introductory project questions.",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "Balanced technical, project and behavioural questions.",
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "Deep technical follow-ups and system-design questions.",
  },
];

const InterviewSetup = () => {
  const navigate = useNavigate();

  const [selectedCompany, setSelectedCompany] = useState("general");
  const [selectedRole, setSelectedRole] = useState("software-engineer");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [questionCount, setQuestionCount] = useState(5);

  const selectedCompanyData = useMemo(
    () => companies.find((company) => company.id === selectedCompany),
    [selectedCompany]
  );

  const selectedRoleData = useMemo(
    () => roles.find((role) => role.id === selectedRole),
    [selectedRole]
  );

  const continueToResume = () => {
    const interviewPreferences = {
      company: selectedCompanyData?.name || "General",
      companyId: selectedCompany,
      role: selectedRoleData?.name || "Software Engineer",
      roleId: selectedRole,
      difficulty,
      questionCount: Number(questionCount),
    };

    localStorage.setItem(
      "interviewPreferences",
      JSON.stringify(interviewPreferences)
    );

    navigate("/resume");
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
          >
            <FaArrowLeft />
            Dashboard
          </button>

          <div className="text-right">
            <p className="font-bold">PrepAI</p>
            <p className="text-xs text-slate-500">Interview setup</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-12">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Personalize your practice
          </p>

          <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
            Configure your next interview
          </h1>

          <p className="mt-4 text-slate-600 leading-7">
            Choose the company, role and difficulty level. PrepAI will use
            these preferences together with your resume to generate more
            relevant interview questions.
          </p>
        </section>

        <section className="mt-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FaBuilding />
            </div>

            <div>
              <h2 className="text-xl font-bold">Target company</h2>
              <p className="text-sm text-slate-500">
                Select the interview style you want to practise.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {companies.map((company) => {
              const isSelected = selectedCompany === company.id;

              return (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompany(company.id)}
                  className={`rounded-2xl border p-5 text-left transition ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-bold text-lg">{company.name}</h3>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "border-blue-600 bg-blue-600"
                          : "border-slate-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {company.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <FaBriefcase />
            </div>

            <div>
              <h2 className="text-xl font-bold">Target role</h2>
              <p className="text-sm text-slate-500">
                Select the position you are preparing for.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;

              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`rounded-2xl border p-5 text-left transition ${
                    isSelected
                      ? "border-violet-600 bg-violet-50 ring-2 ring-violet-100"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon />
                  </div>

                  <h3 className="mt-4 font-bold">{role.name}</h3>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6 mt-10">
          <div>
            <h2 className="text-xl font-bold">Difficulty level</h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose how challenging the interview should be.
            </p>

            <div className="mt-5 space-y-3">
              {difficultyOptions.map((option) => {
                const isSelected = difficulty === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => setDifficulty(option.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <p className="font-bold">{option.label}</p>

                    <p
                      className={`mt-1 text-sm ${
                        isSelected
                          ? "text-slate-300"
                          : "text-slate-500"
                      }`}
                    >
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold">Number of questions</h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose the length of your interview session.
            </p>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 mt-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">
                    Interview questions
                  </p>

                  <p className="mt-1 text-4xl font-bold">
                    {questionCount}
                  </p>
                </div>

                <p className="text-sm text-slate-500">
                  Approximately {questionCount * 2}–{questionCount * 3}{" "}
                  minutes
                </p>
              </div>

              <input
                type="range"
                min="3"
                max="10"
                value={questionCount}
                onChange={(event) =>
                  setQuestionCount(Number(event.target.value))
                }
                className="w-full mt-7 accent-slate-950"
              />

              <div className="mt-3 flex justify-between text-xs text-slate-400">
                <span>3 questions</span>
                <span>10 questions</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl bg-slate-950 text-white p-6 md:p-8">
          <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <p className="text-sm font-semibold text-blue-300">
                Selected interview
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {selectedCompanyData?.name} · {selectedRoleData?.name}
              </h2>

              <p className="mt-3 text-sm text-slate-300">
                {difficulty.charAt(0).toUpperCase() +
                  difficulty.slice(1)}{" "}
                difficulty · {questionCount} questions
              </p>
            </div>

            <button
              onClick={continueToResume}
              className="rounded-xl bg-white text-slate-950 px-6 py-3.5 font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition"
            >
              Continue to resume
              <FaArrowRight />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InterviewSetup;