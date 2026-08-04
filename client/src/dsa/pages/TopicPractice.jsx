import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBarChart2,
  FiBookOpen,
  FiCheckCircle,
  FiSearch,
} from "react-icons/fi";
import { AuthContext } from "../../context/authContextStore";
import questionData from "../data/questionData";

const topics = [
  {
    id: "arrays",
    title: "Arrays",
    description: "Searching, sorting, prefix sums and subarrays.",
    totalQuestions: 42,
    solvedQuestions: 8,
    easy: 15,
    medium: 20,
    hard: 7,
  },
  {
    id: "strings",
    title: "Strings",
    description: "Palindromes, frequency maps and pattern matching.",
    totalQuestions: 35,
    solvedQuestions: 5,
    easy: 14,
    medium: 16,
    hard: 5,
  },
  {
    id: "linked-list",
    title: "Linked List",
    description: "Pointers, reversal, cycles and merging lists.",
    totalQuestions: 28,
    solvedQuestions: 4,
    easy: 10,
    medium: 14,
    hard: 4,
  },
  {
    id: "stack",
    title: "Stack",
    description: "Monotonic stacks, expressions and next greater element.",
    totalQuestions: 24,
    solvedQuestions: 3,
    easy: 8,
    medium: 12,
    hard: 4,
  },
  {
    id: "queue",
    title: "Queue",
    description: "Queue operations, deque and sliding-window problems.",
    totalQuestions: 18,
    solvedQuestions: 2,
    easy: 7,
    medium: 8,
    hard: 3,
  },
  {
    id: "binary-search",
    title: "Binary Search",
    description: "Search space reduction and answer-based binary search.",
    totalQuestions: 30,
    solvedQuestions: 6,
    easy: 9,
    medium: 16,
    hard: 5,
  },
  {
    id: "trees",
    title: "Trees",
    description: "Traversals, views, depth and tree construction.",
    totalQuestions: 44,
    solvedQuestions: 7,
    easy: 13,
    medium: 23,
    hard: 8,
  },
  {
    id: "bst",
    title: "Binary Search Tree",
    description: "Search, insertion, validation and order statistics.",
    totalQuestions: 22,
    solvedQuestions: 1,
    easy: 8,
    medium: 10,
    hard: 4,
  },
  {
    id: "heap",
    title: "Heap",
    description: "Priority queues, top-k elements and scheduling.",
    totalQuestions: 25,
    solvedQuestions: 2,
    easy: 7,
    medium: 13,
    hard: 5,
  },
  {
    id: "graphs",
    title: "Graphs",
    description: "BFS, DFS, shortest paths and connected components.",
    totalQuestions: 48,
    solvedQuestions: 3,
    easy: 10,
    medium: 26,
    hard: 12,
  },
  {
    id: "dynamic-programming",
    title: "Dynamic Programming",
    description: "Memoization, tabulation and state optimization.",
    totalQuestions: 52,
    solvedQuestions: 2,
    easy: 8,
    medium: 28,
    hard: 16,
  },
  {
    id: "greedy",
    title: "Greedy",
    description: "Intervals, scheduling and local optimal choices.",
    totalQuestions: 27,
    solvedQuestions: 3,
    easy: 8,
    medium: 14,
    hard: 5,
  },
  {
    id: "backtracking",
    title: "Backtracking",
    description: "Subsets, permutations and constraint problems.",
    totalQuestions: 26,
    solvedQuestions: 1,
    easy: 6,
    medium: 15,
    hard: 5,
  },
  {
    id: "bit-manipulation",
    title: "Bit Manipulation",
    description: "Bitwise operators, masks and XOR techniques.",
    totalQuestions: 20,
    solvedQuestions: 0,
    easy: 8,
    medium: 9,
    hard: 3,
  },
  {
    id: "math",
    title: "Math",
    description: "Number theory, divisibility, primes and combinatorics.",
    totalQuestions: 32,
    solvedQuestions: 4,
    easy: 13,
    medium: 14,
    hard: 5,
  },
];

const bstQuestionIds = new Set([
  "search-in-bst",
  "insert-into-bst",
  "minimum-in-bst",
  "validate-binary-search-tree",
  "lowest-common-ancestor-bst",
  "kth-smallest-bst",
  "delete-node-bst",
  "bst-iterator",
  "recover-binary-search-tree",
  "largest-bst-subtree",
]);

const TopicPractice = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [solvedQuestionIds, setSolvedQuestionIds] =
    useState(new Set());

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

  const configuredTopics = useMemo(() => {
    const configuredQuestions = Object.values(questionData);

    return topics.map((topic) => {
      const topicQuestions = configuredQuestions.filter(
        (question) => question.topic === topic.id
      );
      const isBstTopic = topic.id === "bst";
      const solvedQuestions = topicQuestions.filter((question) =>
        solvedQuestionIds.has(question.id)
      ).length;
      const bstSolvedQuestions = [...bstQuestionIds].filter((id) =>
        solvedQuestionIds.has(id)
      ).length;

      return {
        ...topic,
        totalQuestions: isBstTopic ? 10 : topicQuestions.length,
        solvedQuestions: isBstTopic
          ? bstSolvedQuestions
          : solvedQuestions,
        easy: isBstTopic ? 3 : topicQuestions.filter(
          (question) => question.difficulty === "Easy"
        ).length,
        medium: isBstTopic ? 5 : topicQuestions.filter(
          (question) => question.difficulty === "Medium"
        ).length,
        hard: isBstTopic ? 2 : topicQuestions.filter(
          (question) => question.difficulty === "Hard"
        ).length,
      };
    });
  }, [solvedQuestionIds]);

  const filteredTopics = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return configuredTopics;
    }

    return configuredTopics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(searchValue) ||
        topic.description.toLowerCase().includes(searchValue)
    );
  }, [configuredTopics, search]);

  const totalQuestions = configuredTopics.reduce(
    (sum, topic) => sum + topic.totalQuestions,
    0
  );

  const totalSolved = configuredTopics.reduce(
    (sum, topic) => sum + topic.solvedQuestions,
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <button
          type="button"
          onClick={() => navigate("/dsa")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <FiArrowLeft />
          Back to DSA Hub
        </button>

        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-indigo-950/60 p-7 md:p-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-400">
                Topic-wise preparation
              </p>

              <h1 className="mt-3 text-3xl font-bold md:text-5xl">
                Master DSA one topic at a time
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                Choose a topic, solve problems from easy to hard and track your
                progress throughout your preparation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="min-w-36 rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
                <FiBookOpen className="text-xl text-indigo-400" />

                <p className="mt-3 text-2xl font-bold">{totalQuestions}</p>

                <p className="text-sm text-slate-400">Total questions</p>
              </div>

              <div className="min-w-36 rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
                <FiCheckCircle className="text-xl text-emerald-400" />

                <p className="mt-3 text-2xl font-bold">{totalSolved}</p>

                <p className="text-sm text-slate-400">Questions solved</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold">Choose a topic</h2>

              <p className="mt-1 text-slate-400">
                Start with fundamentals and gradually move to advanced topics.
              </p>
            </div>

            <div className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 md:w-80">
              <FiSearch className="text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search topics..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredTopics.map((topic) => {
              const progress =
                topic.totalQuestions > 0
                  ? Math.round(
                      (topic.solvedQuestions /
                        topic.totalQuestions) *
                        100
                    )
                  : 0;

              return (
                <button
                  type="button"
                  key={topic.id}
                  onClick={() => {
                    if (topic.totalQuestions > 0) {
                      navigate(`/dsa/topics/${topic.id}`);
                    }
                  }}
                  disabled={topic.totalQuestions === 0}
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition duration-200 enabled:hover:-translate-y-1 enabled:hover:border-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-xl text-indigo-400">
                      <FiBarChart2 />
                    </div>

                    <div className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
                      {topic.solvedQuestions}/{topic.totalQuestions} solved
                    </div>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold">{topic.title}</h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">
                    {topic.description}
                  </p>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Progress</span>
                      <span className="font-semibold text-indigo-400">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-400">
                      Easy {topic.easy}
                    </span>

                    <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-400">
                      Medium {topic.medium}
                    </span>

                    <span className="rounded-full bg-red-500/10 px-3 py-1 text-red-400">
                      Hard {topic.hard}
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-2 font-semibold text-indigo-400">
                    {topic.totalQuestions > 0
                      ? "Start practice"
                      : "Coming soon"}
                    {topic.totalQuestions > 0 && (
                      <FiArrowRight className="transition group-hover:translate-x-1" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredTopics.length === 0 && (
            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
              <h3 className="text-lg font-semibold">No topic found</h3>

              <p className="mt-2 text-sm text-slate-400">
                Try searching with another topic name.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TopicPractice;
