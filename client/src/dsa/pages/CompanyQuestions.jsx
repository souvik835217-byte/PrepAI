import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiBarChart2,
  FiCheckCircle,
  FiCircle,
  FiClock,
  FiFilter,
  FiPlay,
  FiSearch,
} from "react-icons/fi";

import { AuthContext } from "../../context/authContextStore";
import questionData from "../data/questionData";

const companyNames = {
  google: "Google",
  amazon: "Amazon",
  microsoft: "Microsoft",
  adobe: "Adobe",
  flipkart: "Flipkart",
  atlassian: "Atlassian",
  uber: "Uber",
  "goldman-sachs": "Goldman Sachs",
  tcs: "TCS",
  infosys: "Infosys",
  wipro: "Wipro",
  accenture: "Accenture",
};

const companyDescriptions = {
  google:
    "Practice frequently asked coding questions for Google software engineering interviews.",

  amazon:
    "Prepare for Amazon online assessments and technical interview rounds.",

  microsoft:
    "Practice coding problems commonly asked in Microsoft technical interviews.",

  adobe:
    "Prepare for Adobe product engineering and software development interviews.",

  flipkart:
    "Practice product-based coding questions frequently asked during Flipkart hiring.",

  atlassian:
    "Prepare for Atlassian problem-solving and coding interview rounds.",

  uber:
    "Practice algorithmic questions commonly asked in Uber engineering interviews.",

  "goldman-sachs":
    "Prepare for Goldman Sachs coding assessments and technical interviews.",

  tcs:
    "Practice beginner and intermediate coding questions for TCS recruitment.",

  infosys:
    "Prepare for Infosys coding assessments and technical interview rounds.",

  wipro:
    "Practice coding questions commonly included in Wipro recruitment rounds.",

  accenture:
    "Prepare for Accenture coding assessments and software engineering roles.",
};

const normalizeApiUrl = (url) => {
  return url
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");
};

const formatAcceptance = (acceptance) => {
  if (
    typeof acceptance === "string" &&
    acceptance.includes("%")
  ) {
    return acceptance;
  }

  const value = Number(acceptance);

  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${value}%`;
};

const getDifficultyClass = (difficulty) => {
  if (difficulty === "Easy") {
    return "bg-emerald-500/10 text-emerald-400";
  }

  if (difficulty === "Medium") {
    return "bg-amber-500/10 text-amber-400";
  }

  return "bg-red-500/10 text-red-400";
};

const getEstimatedTime = (question) => {
  if (question.estimatedTime) {
    return question.estimatedTime;
  }

  if (question.difficulty === "Easy") {
    return "15 min";
  }

  if (question.difficulty === "Medium") {
    return "30 min";
  }

  return "45 min";
};

const getQuestionTags = (question) => {
  if (
    Array.isArray(question.tags) &&
    question.tags.length > 0
  ) {
    return question.tags.slice(0, 3);
  }

  if (question.topic) {
    return [question.topic];
  }

  return ["DSA"];
};

const getFrequency = (question) => {
  const frequency = Number(question.frequency);

  if (
    Number.isFinite(frequency) &&
    frequency >= 1 &&
    frequency <= 5
  ) {
    return frequency;
  }

  if (question.difficulty === "Hard") {
    return 5;
  }

  if (question.difficulty === "Medium") {
    return 4;
  }

  return 3;
};

const FrequencyStars = ({ value }) => {
  return (
    <div
      className="flex items-center gap-0.5"
      title={`${value}/5 interview frequency`}
    >
      {Array.from({ length: 5 }).map(
        (_, index) => (
          <span
            key={index}
            className={
              index < value
                ? "text-amber-400"
                : "text-slate-700"
            }
          >
            ★
          </span>
        )
      )}
    </div>
  );
};

const CompanyQuestions = () => {
  const navigate = useNavigate();

  const { companyId } = useParams();

  const {
    user,
    authLoading,
  } = useContext(AuthContext);

  const [search, setSearch] =
    useState("");

  const [difficulty, setDifficulty] =
    useState("All");

  const [status, setStatus] =
    useState("All");

  const [submissions, setSubmissions] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const companyName =
    companyNames[companyId] ||
    "Company";

  const companyDescription =
    companyDescriptions[companyId] ||
    `Practice coding questions commonly asked during ${companyName} technical interviews.`;

  const API_BASE_URL = normalizeApiUrl(
    import.meta.env.VITE_API_URL ||
      "http://localhost:5000"
  );

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (authLoading) {
        return;
      }

      if (!user?.uid) {
        setSubmissions([]);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/submissions/user/${user.uid}`
        );

        const contentType =
          response.headers.get(
            "content-type"
          );

        let data;

        if (
          contentType?.includes(
            "application/json"
          )
        ) {
          data = await response.json();
        } else {
          const responseText =
            await response.text();

          throw new Error(
            responseText ||
              "The server returned an invalid response."
          );
        }

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to load submissions."
          );
        }

        setSubmissions(
          Array.isArray(data.submissions)
            ? data.submissions
            : []
        );
      } catch (fetchError) {
        console.error(
          "Company submissions error:",
          fetchError
        );

        setError(
          fetchError.message ||
            "Unable to load solved progress."
        );

        setSubmissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [
    user?.uid,
    authLoading,
    API_BASE_URL,
  ]);

  const solvedQuestionIds =
    useMemo(() => {
      return new Set(
        submissions
          .filter((submission) => {
            const submissionStatus =
              String(
                submission.status || ""
              ).toLowerCase();

            return (
              submissionStatus ===
                "accepted" ||
              submission.accepted === true
            );
          })
          .map((submission) =>
            String(
              submission.questionId || ""
            )
          )
          .filter(Boolean)
      );
    }, [submissions]);

  const companyQuestions =
    useMemo(() => {
      return Object.values(
        questionData
      )
        .filter((question) => {
          const companies =
            Array.isArray(
              question.companies
            )
              ? question.companies
              : [];

          return companies.includes(
            companyId
          );
        })
        .map((question) => ({
          ...question,

          status:
            solvedQuestionIds.has(
              question.id
            )
              ? "Solved"
              : "Unsolved",
        }));
    }, [
      companyId,
      solvedQuestionIds,
    ]);

  const filteredQuestions =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase();

      return companyQuestions.filter(
        (question) => {
          const matchesSearch =
            question.title
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            getQuestionTags(question)
              .join(" ")
              .toLowerCase()
              .includes(
                normalizedSearch
              );

          const matchesDifficulty =
            difficulty === "All" ||
            question.difficulty ===
              difficulty;

          const matchesStatus =
            status === "All" ||
            question.status === status;

          return (
            matchesSearch &&
            matchesDifficulty &&
            matchesStatus
          );
        }
      );
    }, [
      companyQuestions,
      search,
      difficulty,
      status,
    ]);

  const solvedCount =
    companyQuestions.filter(
      (question) =>
        question.status === "Solved"
    ).length;

  const totalQuestions =
    companyQuestions.length;

  const remainingCount = Math.max(
    totalQuestions - solvedCount,
    0
  );

  const progressPercentage =
    totalQuestions > 0
      ? Math.round(
          (solvedCount /
            totalQuestions) *
            100
        )
      : 0;

  const difficultyStats =
    useMemo(() => {
      const createStats = (
        difficultyName
      ) => {
        const matchingQuestions =
          companyQuestions.filter(
            (question) =>
              question.difficulty ===
              difficultyName
          );

        return {
          total:
            matchingQuestions.length,

          solved:
            matchingQuestions.filter(
              (question) =>
                question.status ===
                "Solved"
            ).length,
        };
      };

      return {
        Easy: createStats("Easy"),
        Medium: createStats("Medium"),
        Hard: createStats("Hard"),
      };
    }, [companyQuestions]);

  const firstUnsolvedQuestion =
    companyQuestions.find(
      (question) =>
        question.status === "Unsolved"
    );

  const handleContinueSolving = () => {
    const selectedQuestion =
      firstUnsolvedQuestion ||
      companyQuestions[0];

    if (!selectedQuestion) {
      return;
    }

    navigate(
      `/dsa/companies/${companyId}/questions/${selectedQuestion.id}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
        <button
          type="button"
          onClick={() =>
            navigate("/dsa/companies")
          }
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <FiArrowLeft />
          Back to companies
        </button>

        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/70">
          <div className="p-7 md:p-10">
            <div className="flex flex-col justify-between gap-8 xl:flex-row xl:items-start">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-400">
                  Company coding practice
                </p>

                <h1 className="mt-4 text-3xl font-bold md:text-5xl">
                  {companyName} DSA
                  Questions
                </h1>

                <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                  {companyDescription}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={
                      handleContinueSolving
                    }
                    disabled={
                      totalQuestions === 0
                    }
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiPlay />

                    {remainingCount > 0
                      ? "Continue Solving"
                      : "Solve Again"}
                  </button>

                </div>
              </div>

              <div className="w-full rounded-2xl border border-slate-700 bg-slate-950/40 p-6 xl:max-w-sm">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold">
                      {progressPercentage}%
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Coding practice
                      completed
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold">
                      {solvedCount}/
                      {totalQuestions}
                    </p>

                    <p className="text-xs text-slate-500">
                      Questions solved
                    </p>
                  </div>
                </div>

                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                    style={{
                      width: `${progressPercentage}%`,
                    }}
                  />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                    <p className="font-bold">
                      {totalQuestions}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Total
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                    <p className="font-bold text-emerald-400">
                      {solvedCount}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Solved
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                    <p className="font-bold text-amber-400">
                      {remainingCount}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Remaining
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 border-t border-slate-800 pt-7 sm:grid-cols-3">
              {Object.entries(
                difficultyStats
              ).map(
                ([
                  difficultyName,
                  stats,
                ]) => {
                  const percentage =
                    stats.total > 0
                      ? Math.round(
                          (stats.solved /
                            stats.total) *
                            100
                        )
                      : 0;

                  return (
                    <div
                      key={
                        difficultyName
                      }
                      className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getDifficultyClass(
                            difficultyName
                          )}`}
                        >
                          {
                            difficultyName
                          }
                        </span>

                        <span className="text-sm font-semibold">
                          {stats.solved}/
                          {stats.total}
                        </span>
                      </div>

                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="mt-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 xl:flex-row xl:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
              <FiSearch className="text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder={`Search ${companyName} questions or tags...`}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <FiFilter />
              Filters
            </div>

            <select
              value={difficulty}
              onChange={(event) =>
                setDifficulty(
                  event.target.value
                )
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none"
            >
              <option value="All">
                All difficulties
              </option>

              <option value="Easy">
                Easy
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Hard">
                Hard
              </option>
            </select>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value
                )
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none"
            >
              <option value="All">
                All status
              </option>

              <option value="Solved">
                Solved
              </option>

              <option value="Unsolved">
                Unsolved
              </option>
            </select>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="hidden grid-cols-[65px_minmax(280px,1.5fr)_130px_130px_120px_110px_140px] border-b border-slate-800 bg-slate-900/80 px-6 py-4 text-sm text-slate-400 xl:grid">
              <span>Status</span>
              <span>Question</span>
              <span>Frequency</span>
              <span>Difficulty</span>
              <span>Acceptance</span>
              <span>Time</span>
              <span className="text-right">
                Action
              </span>
            </div>

            {isLoading && (
              <div className="px-6 py-12 text-center text-sm text-slate-400">
                Loading your progress...
              </div>
            )}

            {!isLoading &&
              filteredQuestions.map(
                (
                  question,
                  index
                ) => {
                  const tags =
                    getQuestionTags(
                      question
                    );

                  const frequency =
                    getFrequency(
                      question
                    );

                  return (
                    <div
                      key={
                        question.id
                      }
                      className="grid gap-4 border-b border-slate-800 px-5 py-5 last:border-b-0 xl:grid-cols-[65px_minmax(280px,1.5fr)_130px_130px_120px_110px_140px] xl:items-center xl:px-6"
                    >
                      <div>
                        {question.status ===
                        "Solved" ? (
                          <FiCheckCircle className="text-xl text-emerald-400" />
                        ) : (
                          <FiCircle className="text-xl text-slate-600" />
                        )}
                      </div>

                      <div>
                        <p className="font-semibold">
                          {index + 1}.{" "}
                          {
                            question.title
                          }
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {tags.map(
                            (tag) => (
                              <span
                                key={
                                  tag
                                }
                                className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs capitalize text-slate-400"
                              >
                                {tag}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <div>
                        <FrequencyStars
                          value={
                            frequency
                          }
                        />

                        <p className="mt-1 text-xs text-slate-500">
                          {frequency >=
                          5
                            ? "Very frequent"
                            : frequency >=
                                4
                              ? "Frequent"
                              : "Reported"}
                        </p>
                      </div>

                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getDifficultyClass(
                            question.difficulty
                          )}`}
                        >
                          {
                            question.difficulty
                          }
                        </span>
                      </div>

                      <div className="text-sm text-slate-400">
                        {formatAcceptance(
                          question.acceptance
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <FiClock />

                        {getEstimatedTime(
                          question
                        )}
                      </div>

                      <div className="xl:text-right">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/dsa/companies/${companyId}/questions/${question.id}`
                            )
                          }
                          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold transition hover:bg-indigo-500"
                        >
                          {question.status ===
                          "Solved"
                            ? "Solve Again"
                            : "Solve"}
                        </button>
                      </div>
                    </div>
                  );
                }
              )}

            {!isLoading &&
              filteredQuestions.length ===
                0 && (
                <div className="px-6 py-14 text-center">
                  <FiBarChart2 className="mx-auto text-3xl text-slate-600" />

                  <h3 className="mt-4 text-lg font-semibold">
                    No questions found
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Change your search
                    term or selected
                    filters.
                  </p>
                </div>
              )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CompanyQuestions;
