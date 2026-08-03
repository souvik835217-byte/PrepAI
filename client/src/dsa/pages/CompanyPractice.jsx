import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiBriefcase,
  FiSearch,
  FiArrowRight,
} from "react-icons/fi";

import questionData from "../data/questionData";

const getCompanyQuestionCount = (companyId) =>
  Object.values(questionData).filter((question) =>
    question.companies?.includes(companyId)
  ).length;

const companies = [
  {
    id: "google",
    name: "Google",
    description:
      "Practice coding interview questions commonly asked by Google.",
    totalQuestions: 35,
    difficulty: "Medium to Hard",
  },
  {
    id: "amazon",
    name: "Amazon",
    description:
      "Prepare for Amazon online assessments and technical interviews.",
    totalQuestions: 40,
    difficulty: "Easy to Hard",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    description:
      "Practice frequently asked Microsoft coding interview questions.",
    totalQuestions: 32,
    difficulty: "Easy to Hard",
  },
  {
    id: "adobe",
    name: "Adobe",
    description:
      "Prepare for Adobe product engineering and software interviews.",
    totalQuestions: 25,
    difficulty: "Easy to Hard",
  },
  {
    id: "flipkart",
    name: "Flipkart",
    description:
      "Practice product-based coding questions asked during Flipkart hiring.",
    totalQuestions: 28,
    difficulty: "Medium to Hard",
  },
  {
    id: "atlassian",
    name: "Atlassian",
    description:
      "Prepare for Atlassian coding rounds and problem-solving interviews.",
    totalQuestions: 24,
    difficulty: "Medium to Hard",
  },
  {
    id: "uber",
    name: "Uber",
    description:
      "Practice algorithm and system-thinking problems commonly asked by Uber.",
    totalQuestions: 26,
    difficulty: "Medium to Hard",
  },
  {
    id: "goldman-sachs",
    name: "Goldman Sachs",
    description:
      "Prepare for coding assessments and technical interviews at Goldman Sachs.",
    totalQuestions: 22,
    difficulty: "Easy to Hard",
  },
  {
    id: "tcs",
    name: "TCS",
    description:
      "Practice beginner and intermediate coding questions for TCS hiring.",
    totalQuestions: 20,
    difficulty: "Easy to Medium",
  },
  {
    id: "infosys",
    name: "Infosys",
    description:
      "Prepare for Infosys coding assessments and technical interviews.",
    totalQuestions: 20,
    difficulty: "Easy to Medium",
  },
  {
    id: "wipro",
    name: "Wipro",
    description:
      "Practice coding questions commonly included in Wipro recruitment rounds.",
    totalQuestions: 18,
    difficulty: "Easy to Medium",
  },
  {
    id: "accenture",
    name: "Accenture",
    description:
      "Prepare for Accenture coding assessments and software engineering roles.",
    totalQuestions: 18,
    difficulty: "Easy to Medium",
  },
];

const CompanyPractice = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const filteredCompanies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return companies;
    }

    return companies.filter((company) =>
      company.name.toLowerCase().includes(normalizedSearch)
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <button
          type="button"
          onClick={() => navigate("/dsa")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <FiArrowLeft />
          Back to DSA dashboard
        </button>

        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 p-7 md:p-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400">
                  <FiBriefcase className="text-2xl" />
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-400">
                  Company practice
                </p>
              </div>

              <h1 className="mt-5 text-3xl font-bold md:text-5xl">
                Company-wise DSA Questions
              </h1>

              <p className="mt-4 max-w-3xl leading-7 text-slate-300">
                Prepare for technical interviews by solving company-specific
                coding questions from Google, Amazon, Microsoft, Adobe,
                Flipkart, TCS, Infosys, and more.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/50 px-6 py-4">
              <p className="text-2xl font-bold">{companies.length}</p>
              <p className="text-sm text-slate-400">Companies available</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
            <FiSearch className="text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search companies..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCompanies.map((company) => (
              <article
                key={company.id}
                className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-indigo-500/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                    <FiBriefcase className="text-xl" />
                  </div>

                  <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-400">
                    {getCompanyQuestionCount(company.id)} questions
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-bold">
                  {company.name}
                </h2>

                <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-400">
                  {company.description}
                </p>

                <div className="mt-5 border-t border-slate-800 pt-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Difficulty range
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-300">
                    {company.difficulty}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/dsa/companies/${company.id}`)
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold transition hover:bg-indigo-500"
                >
                  View Questions
                  <FiArrowRight />
                </button>
              </article>
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 px-6 py-14 text-center">
              <h2 className="text-lg font-semibold">
                No companies found
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Try a different company name.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CompanyPractice;
