import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiCircle,
  FiFilter,
  FiSearch,
} from "react-icons/fi";
import { AuthContext } from "../../context/authContextStore";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const topicNames = {
  arrays: "Arrays",
  strings: "Strings",
  "linked-list": "Linked List",
  stack: "Stack",
  queue: "Queue",
  "binary-search": "Binary Search",
  trees: "Trees",
  bst: "Binary Search Tree",
  heap: "Heap",
  graphs: "Graphs",
  "dynamic-programming": "Dynamic Programming",
  greedy: "Greedy",
  backtracking: "Backtracking",
  "bit-manipulation": "Bit Manipulation",
  math: "Math",
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

const formatAcceptance = (acceptance) => {
  const value = Number(acceptance);

  return Number.isFinite(value) ? `${value}%` : "N/A";
};

const QuestionList = () => {
  const navigate = useNavigate();
  const { topicId } = useParams();
  const { user } = useContext(AuthContext);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState("All");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [solvedQuestionIds, setSolvedQuestionIds] =
    useState(new Set());

  const topicName = topicNames[topicId] || "DSA Topic";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/dsa/questions/topic/${topicId}`
        );
        const data = await response.json();

        console.log("DSA API response:", data);
        console.log("Questions:", data.questions);

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load questions");
        }

        setQuestions(data.questions);
      } catch (error) {
        console.error("Question fetch error:", error);
        setError(error.message);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topicId]);

  useEffect(() => {
    if (!user?.uid) {
      setSolvedQuestionIds(new Set());
      return;
    }

    const loadSolvedQuestions = async () => {
      try {
        const apiBaseUrl = (
          import.meta.env.VITE_API_URL ||
          "http://localhost:5000"
        )
          .replace(/\/api\/?$/, "")
          .replace(/\/+$/, "");
        const response = await fetch(
          `${apiBaseUrl}/api/submissions/user/${user.uid}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          return;
        }

        setSolvedQuestionIds(
          new Set(
            (data.submissions || [])
              .filter(
                (submission) =>
                  submission.accepted === true ||
                  submission.status === "Accepted"
              )
              .map((submission) => submission.questionId)
          )
        );
      } catch {
        setSolvedQuestionIds(new Set());
      }
    };

    loadSolvedQuestions();
  }, [user?.uid]);

  const solvedCount = questions.filter((question) =>
    solvedQuestionIds.has(question.id)
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading questions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <button
          type="button"
          onClick={() => navigate("/dsa/topics")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <FiArrowLeft />
          Back to topics
        </button>

        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-indigo-950/60 p-7 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-400">
            Topic practice
          </p>

          <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold md:text-5xl">
                {topicName} Questions
              </h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                Solve problems from easy to hard and strengthen your
                understanding of {topicName.toLowerCase()}.
              </p>
            </div>

            <div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/70 px-6 py-4">
                <p className="text-2xl font-bold">
                  {solvedCount}/{questions.length}
                </p>

                <p className="text-sm text-slate-400">
                  Questions solved
                </p>
              </div>

            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
              <FiSearch className="text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search questions..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <FiFilter />
              Filters
            </div>

            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none"
            >
              <option value="All">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none"
            >
              <option value="All">All status</option>
              <option value="Solved">Solved</option>
              <option value="Unsolved">Unsolved</option>
            </select>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="hidden grid-cols-[70px_1fr_140px_140px_140px] border-b border-slate-800 bg-slate-900/80 px-6 py-4 text-sm text-slate-400 md:grid">
              <span>Status</span>
              <span>Question</span>
              <span>Difficulty</span>
              <span>Acceptance</span>
              <span className="text-right">Action</span>
            </div>

            {questions.map((question, index) => {
              const questionStatus = solvedQuestionIds.has(question.id)
                ? "Solved"
                : "Unsolved";
              const matchesSearch = question.title
                .toLowerCase()
                .includes(search.trim().toLowerCase());
              const matchesDifficulty =
                difficulty === "All" ||
                question.difficulty === difficulty;
              const matchesStatus =
                status === "All" || questionStatus === status;

              if (
                !matchesSearch ||
                !matchesDifficulty ||
                !matchesStatus
              ) {
                return null;
              }

              return (
                <div
                  key={question.id}
                  className="grid gap-4 border-b border-slate-800 px-5 py-5 last:border-b-0 md:grid-cols-[70px_1fr_140px_140px_140px] md:items-center md:px-6"
                >
                <div>
                  {questionStatus === "Solved" ? (
                    <FiCheckCircle className="text-xl text-emerald-400" />
                  ) : (
                    <FiCircle className="text-xl text-slate-600" />
                  )}
                </div>

                <div>
                  <p className="font-semibold">
                    {index + 1}. {question.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 md:hidden">
                    Acceptance: {formatAcceptance(question.acceptance)}
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getDifficultyClass(
                      question.difficulty
                    )}`}
                  >
                    {question.difficulty}
                  </span>
                </div>

                <div className="hidden text-sm text-slate-400 md:block">
                  {formatAcceptance(question.acceptance)}
                </div>

                <div className="md:text-right">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/dsa/topics/${topicId}/questions/${question.id}`
                      )
                    }
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold transition hover:bg-indigo-500"
                  >
                    {questionStatus === "Solved" ? "Solve Again" : "Solve"}
                  </button>
                </div>
                </div>
              );
            })}

            {questions.length === 0 && (
              <div className="px-6 py-14 text-center">
                <h3 className="text-lg font-semibold">No questions found</h3>

                <p className="mt-2 text-sm text-slate-400">
                  Change the search term or filter selection.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default QuestionList;
