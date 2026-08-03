import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Editor from "@monaco-editor/react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiCode,
  FiLoader,
  FiPlay,
  FiSend,
  FiTarget,
} from "react-icons/fi";

import contestData from "../data/contestData";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
)
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");

const languages = [
  {
    id: "cpp",
    label: "C++",
    monacoLanguage: "cpp",
  },
  {
    id: "java",
    label: "Java",
    monacoLanguage: "java",
  },
  {
    id: "python",
    label: "Python",
    monacoLanguage: "python",
  },
  {
    id: "javascript",
    label: "JavaScript",
    monacoLanguage: "javascript",
  },
];

const contestProblemDetails = {
  "two-sum": {
    description:
      "Given an array of integers nums and an integer target, return the indices of two numbers whose sum equals target. You may not use the same array element twice.",
    examples: [
      {
        input: `4
2 7 11 15
9`,
        output: "0 1",
        explanation:
          "nums[0] + nums[1] = 2 + 7 = 9.",
      },
      {
        input: `3
3 2 4
6`,
        output: "1 2",
        explanation:
          "nums[1] + nums[2] = 2 + 4 = 6.",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 100000",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Exactly one valid answer exists.",
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
    }
};`,
      java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
    }
}`,
      python: `class Solution:
    def twoSum(self, nums, target):
        # Write your solution here
        pass`,
      javascript: `var twoSum = function(nums, target) {
    // Write your solution here
};`,
    },
    defaultInput: `4
2 7 11 15
9`,
  },

  "merge-intervals": {
    description:
      "Given an array of intervals, merge all overlapping intervals and return the resulting non-overlapping intervals.",
    examples: [
      {
        input: `4
1 3
2 6
8 10
15 18`,
        output: `1 6
8 10
15 18`,
      },
    ],
    constraints: [
      "1 ≤ intervals.length ≤ 10000",
      "0 ≤ start ≤ end ≤ 100000",
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        // Write your solution here
    }
};`,
      java: `import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        // Write your solution here
    }
}`,
      python: `class Solution:
    def merge(self, intervals):
        # Write your solution here
        pass`,
      javascript: `var merge = function(intervals) {
    // Write your solution here
};`,
    },
    defaultInput: `4
1 3
2 6
8 10
15 18`,
  },

  "number-of-islands": {
    description:
      "Given a grid containing '1' for land and '0' for water, return the number of islands.",
    examples: [
      {
        input: `4 5
1 1 1 1 0
1 1 0 1 0
1 1 0 0 0
0 0 0 0 0`,
        output: "1",
      },
    ],
    constraints: [
      "1 ≤ rows, columns ≤ 300",
      "Each grid value is either 0 or 1.",
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        // Write your solution here
    }
};`,
      java: `import java.util.*;

class Solution {
    public int numIslands(char[][] grid) {
        // Write your solution here
    }
}`,
      python: `class Solution:
    def numIslands(self, grid):
        # Write your solution here
        pass`,
      javascript: `var numIslands = function(grid) {
    // Write your solution here
};`,
    },
    defaultInput: `4 5
1 1 1 1 0
1 1 0 1 0
1 1 0 0 0
0 0 0 0 0`,
  },

  "lru-cache": {
    description:
      "Design a Least Recently Used cache supporting get and put operations in average O(1) time.",
    examples: [
      {
        input: `2 6
put 1 1
put 2 2
get 1
put 3 3
get 2
get 3`,
        output: `1
-1
3`,
      },
    ],
    constraints: [
      "1 ≤ capacity ≤ 3000",
      "At most 200000 operations.",
      "get and put should run in average O(1).",
    ],
    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

class LRUCache {
public:
    LRUCache(int capacity) {
        
    }

    int get(int key) {
        
    }

    void put(int key, int value) {
        
    }
};`,
      java: `import java.util.*;

class LRUCache {
    public LRUCache(int capacity) {
        
    }

    public int get(int key) {
        
    }

    public void put(int key, int value) {
        
    }
}`,
      python: `class LRUCache:
    def __init__(self, capacity):
        pass

    def get(self, key):
        pass

    def put(self, key, value):
        pass`,
      javascript: `var LRUCache = function(capacity) {
    
};

LRUCache.prototype.get = function(key) {
    
};

LRUCache.prototype.put = function(key, value) {
    
};`,
    },
    defaultInput: `2 6
put 1 1
put 2 2
get 1
put 3 3
get 2
get 3`,
  },
};

const formatTime = (seconds) => {
  const safeSeconds = Math.max(
    0,
    Number(seconds) || 0
  );

  const hours = Math.floor(
    safeSeconds / 3600
  );

  const minutes = Math.floor(
    (safeSeconds % 3600) / 60
  );

  const remainingSeconds =
    safeSeconds % 60;

  return `${String(hours).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(remainingSeconds).padStart(
    2,
    "0"
  )}`;
};

const statusClasses = (status = "") => {
  const normalizedStatus =
    status.toLowerCase();

  if (
    normalizedStatus === "accepted" ||
    normalizedStatus === "completed"
  ) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }

  if (
    normalizedStatus.includes("compile") ||
    normalizedStatus.includes("runtime")
  ) {
    return "border-orange-500/30 bg-orange-500/10 text-orange-300";
  }

  return "border-red-500/30 bg-red-500/10 text-red-300";
};

const ContestSession = () => {
  const navigate = useNavigate();
  const { contestId } = useParams();

  const contest = useMemo(
    () =>
      contestData.find(
        (item) => item.id === contestId
      ),
    [contestId]
  );

  const [currentProblemIndex, setCurrentProblemIndex] =
    useState(0);

  const [selectedLanguage, setSelectedLanguage] =
    useState("cpp");

  const [answers, setAnswers] = useState({});
  const [customInputs, setCustomInputs] =
    useState({});

  const [runResults, setRunResults] =
    useState({});

  const [submitResults, setSubmitResults] =
    useState({});

  const [isRunning, setIsRunning] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isFinishing, setIsFinishing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showFinishConfirmation, setShowFinishConfirmation] =
    useState(false);

  const [timeRemaining, setTimeRemaining] =
    useState(() => {
      if (!contest) {
        return 0;
      }

      const storedSession =
        sessionStorage.getItem(
          `contest-session-${contest.id}`
        );

      if (storedSession) {
        try {
          const parsedSession =
            JSON.parse(storedSession);

          const elapsedSeconds =
            Math.floor(
              (
                Date.now() -
                parsedSession.startedAt
              ) / 1000
            );

          return Math.max(
            0,
            contest.duration * 60 -
              elapsedSeconds
          );
        } catch {
          return contest.duration * 60;
        }
      }

      sessionStorage.setItem(
        `contest-session-${contest.id}`,
        JSON.stringify({
          contestId: contest.id,
          startedAt: Date.now(),
        })
      );

      return contest.duration * 60;
    });

  const autoFinishStarted =
    useRef(false);

  const problems =
    contest?.problems || [];

  const currentProblem =
    problems[currentProblemIndex];

  const currentProblemDetails =
    currentProblem
      ? contestProblemDetails[
          currentProblem.id
        ]
      : null;

  const answerKey = currentProblem
    ? `${currentProblem.id}:${selectedLanguage}`
    : "";

  const sourceCode =
    answers[answerKey] ??
    currentProblemDetails?.starterCode?.[
      selectedLanguage
    ] ??
    "";

  const customInput =
    customInputs[currentProblem?.id] ??
    currentProblemDetails?.defaultInput ??
    "";

  const solvedProblemIds = Object.entries(
    submitResults
  )
    .filter(
      ([, result]) =>
        result?.status === "Accepted"
    )
    .map(([problemId]) => problemId);

  const currentScore = problems.reduce(
    (score, problem) => {
      if (
        submitResults[problem.id]?.status ===
        "Accepted"
      ) {
        return (
          score +
          Number(problem.marks || 0)
        );
      }

      return score;
    },
    0
  );

  const totalScore = problems.reduce(
    (score, problem) =>
      score +
      Number(problem.marks || 0),
    0
  );

  const handleFinishContest = async () => {
    if (isFinishing) {
      return;
    }

    const solvedCount = Object.values(submitResults).filter(
      (result) => result?.status === "Accepted"
    ).length;

    const score = Object.values(submitResults).reduce(
      (total, result) =>
        total +
        (result?.status === "Accepted"
          ? Number(result.pointsEarned || 0)
          : 0),
      0
    );

    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      setError(
        "Please log in before finishing the contest."
      );
      return;
    }

    const timeUsed = Math.ceil(
      Math.max(
        0,
        contest.duration * 60 - timeRemaining
      ) / 60
    );

    const result = {
      contestId: contest.id,
      contestTitle: contest.title,
      score,
      totalScore,
      solvedProblems: solvedCount,
      totalProblems: problems.length,
      timeUsed,
      problemResults: problems.map(
        (problem) => ({
          problemId: problem.id,
          label: problem.label,
          title: problem.title,
          marks: problem.marks,
          status:
            submitResults[problem.id]
              ?.status ||
            "Not Attempted",
          score:
            submitResults[problem.id]
              ?.status === "Accepted"
              ? problem.marks
              : 0,
        })
      ),
    };

    try {
      setIsFinishing(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/contest-history`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            userName:
              auth.currentUser?.displayName ||
              auth.currentUser?.email?.split("@")[0] ||
              "",
            photoURL:
              auth.currentUser?.photoURL || "",
            contestId: contest.id,
            contestTitle: contest.title,
            score,
            totalScore,
            solved: solvedCount,
            totalProblems: problems.length,
            accuracy: problems.length
              ? Number(
                  (
                    (solvedCount / problems.length) *
                    100
                  ).toFixed(2)
                )
              : 0,
            duration: contest.duration,
            timeUsed,
            submissions: Object.values(submitResults),
            rank: null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to save contest result."
        );
      }

    sessionStorage.setItem(
      "contestResult",
      JSON.stringify(result)
    );

    sessionStorage.setItem(
      `contest-result-${contest.id}`,
      JSON.stringify(result)
    );

    sessionStorage.removeItem(
      `contest-session-${contest.id}`
    );

    navigate(
      `/dsa/contests/${contestId}/result`,
      {
        state: {
          contest,
          submitResults,
          score,
          solvedCount,
          timeRemaining,
        },
      }
    );
    } catch (finishError) {
      setError(
        finishError.message ||
          "Unable to finish the contest."
      );
      setShowFinishConfirmation(false);
    } finally {
      setIsFinishing(false);
    }
  };

  useEffect(() => {
    if (
      !contest ||
      timeRemaining <= 0
    ) {
      if (
        contest &&
        !autoFinishStarted.current
      ) {
        autoFinishStarted.current = true;
        handleFinishContest();
      }

      return undefined;
    }

    const timer =
      window.setInterval(() => {
        setTimeRemaining(
          (currentValue) =>
            Math.max(
              0,
              currentValue - 1
            )
        );
      }, 1000);

    return () =>
      window.clearInterval(timer);
  }, [contest, timeRemaining]);

  if (
    !contest ||
    !currentProblem ||
    !currentProblemDetails
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <div className="max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center">
          <FiAlertCircle className="mx-auto text-4xl text-red-400" />

          <h1 className="mt-5 text-2xl font-bold">
            Contest session unavailable
          </h1>

          <button
            type="button"
            onClick={() =>
              navigate("/dsa/contests")
            }
            className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold"
          >
            Back to contests
          </button>
        </div>
      </div>
    );
  }

  const changeProblem = (index) => {
    if (
      index < 0 ||
      index >= problems.length ||
      isSubmitting
    ) {
      return;
    }

    setCurrentProblemIndex(index);
    setSelectedLanguage("cpp");
    setError("");
  };

  const runCode = async () => {
    if (
      isRunning ||
      isSubmitting ||
      timeRemaining <= 0
    ) {
      return;
    }

    setIsRunning(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/code/custom-run`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            language:
              selectedLanguage,
            sourceCode,
            stdin: customInput,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to run code"
        );
      }

      setRunResults(
        (previousResults) => ({
          ...previousResults,
          [currentProblem.id]:
            data.result,
        })
      );
    } catch (requestError) {
      setRunResults(
        (previousResults) => ({
          ...previousResults,
          [currentProblem.id]: {
            status: "Error",
            message:
              requestError.message ||
              "Unable to run code",
          },
        })
      );
    } finally {
      setIsRunning(false);
    }
  };

  const submitProblem = async () => {
    if (
      isSubmitting ||
      isRunning ||
      timeRemaining <= 0
    ) {
      return;
    }

    const auth = getAuth();
    const userId =
      auth.currentUser?.uid;

    if (!userId) {
      setError(
        "Please log in before submitting."
      );
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/code/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userId,
            questionId:
              currentProblem.id,
            questionTitle:
              currentProblem.title,
            topic: "contest",
            company: "PrepAI Contest",
            difficulty:
              currentProblem.difficulty,
            language:
              selectedLanguage,
            sourceCode,
            saveSubmission: true,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to submit problem"
        );
      }

      setSubmitResults(
        (previousResults) => ({
          ...previousResults,
          [currentProblem.id]: {
            ...data,
            status:
              data.status ||
              (data.accepted
                ? "Accepted"
                : "Wrong Answer"),
          },
        })
      );
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to submit problem."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentRunResult =
    runResults[currentProblem.id];

  const currentSubmitResult =
    submitResults[currentProblem.id];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                setShowFinishConfirmation(
                  true
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-slate-400 transition hover:text-white"
            >
              <FiArrowLeft />
            </button>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Live Contest
              </p>

              <h1 className="mt-1 font-bold">
                {contest.title}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Time Left
              </p>

              <p
                className={`mt-1 font-mono font-bold ${
                  timeRemaining <= 300
                    ? "text-red-400"
                    : "text-white"
                }`}
              >
                {formatTime(
                  timeRemaining
                )}
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Score
              </p>

              <p className="mt-1 font-bold text-indigo-300">
                {currentScore}/
                {totalScore}
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Solved
              </p>

              <p className="mt-1 font-bold text-emerald-300">
                {
                  solvedProblemIds.length
                }
                /{problems.length}
              </p>
            </div>

            <button
              type="button"
              onClick={handleFinishContest}
              disabled={isFinishing}
              className="rounded-xl bg-red-600 px-5 py-2.5 font-semibold hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isFinishing
                ? "Saving Result..."
                : "Finish Contest"}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="mx-auto mt-4 max-w-[1800px] px-5">
          <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            {error}
          </div>
        </div>
      )}

      <nav className="mx-auto flex max-w-[1800px] gap-2 overflow-x-auto px-5 pt-5">
        {problems.map(
          (problem, index) => {
            const solved =
              submitResults[problem.id]
                ?.status ===
              "Accepted";

            return (
              <button
                key={problem.id}
                type="button"
                onClick={() =>
                  changeProblem(index)
                }
                className={`flex min-w-36 items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  index ===
                  currentProblemIndex
                    ? "border-indigo-500 bg-indigo-500/10"
                    : solved
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-slate-800 bg-slate-900 hover:border-slate-700"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold ${
                    solved
                      ? "bg-emerald-500/10 text-emerald-300"
                      : "bg-indigo-500/10 text-indigo-300"
                  }`}
                >
                  {solved ? (
                    <FiCheckCircle />
                  ) : (
                    problem.label
                  )}
                </span>

                <span>
                  <span className="block truncate text-sm font-semibold">
                    {problem.title}
                  </span>

                  <span className="mt-1 block text-xs text-slate-500">
                    {problem.marks} points
                  </span>
                </span>
              </button>
            );
          }
        )}
      </nav>

      <main className="mx-auto grid max-w-[1800px] gap-5 px-5 py-5 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="max-h-[calc(100vh-220px)] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-indigo-400">
                Problem{" "}
                {currentProblem.label}
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {currentProblem.title}
              </h2>
            </div>

            <div className="text-right">
              <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-semibold">
                {
                  currentProblem.difficulty
                }
              </span>

              <p className="mt-2 text-sm text-slate-500">
                {currentProblem.marks}{" "}
                points
              </p>
            </div>
          </div>

          <p className="mt-6 leading-8 text-slate-300">
            {
              currentProblemDetails.description
            }
          </p>

          <div className="mt-7 space-y-5">
            {currentProblemDetails.examples.map(
              (example, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                >
                  <h3 className="font-semibold">
                    Example {index + 1}
                  </h3>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Input
                    </p>

                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-4 font-mono text-sm text-slate-300">
                      {example.input}
                    </pre>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Output
                    </p>

                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-4 font-mono text-sm text-slate-300">
                      {example.output}
                    </pre>
                  </div>

                  {example.explanation && (
                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      {
                        example.explanation
                      }
                    </p>
                  )}
                </div>
              )
            )}
          </div>

          <h3 className="mt-7 font-semibold">
            Constraints
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            {currentProblemDetails.constraints.map(
              (constraint) => (
                <li
                  key={constraint}
                  className="flex items-start gap-2"
                >
                  <span className="text-indigo-400">
                    •
                  </span>

                  {constraint}
                </li>
              )
            )}
          </ul>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
            <div className="flex items-center gap-2">
              <FiCode className="text-indigo-400" />
              <span className="font-semibold">
                Code Editor
              </span>
            </div>

            <select
              value={selectedLanguage}
              onChange={(event) => {
                setSelectedLanguage(
                  event.target.value
                );

                setError("");
              }}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            >
              {languages.map(
                (language) => (
                  <option
                    key={language.id}
                    value={language.id}
                  >
                    {language.label}
                  </option>
                )
              )}
            </select>
          </div>

          <Editor
            height="470px"
            language={
              languages.find(
                (language) =>
                  language.id ===
                  selectedLanguage
              )?.monacoLanguage
            }
            theme="vs-dark"
            value={sourceCode}
            onChange={(value) => {
              setAnswers(
                (previousAnswers) => ({
                  ...previousAnswers,
                  [answerKey]:
                    value ?? "",
                })
              );

              setRunResults(
                (previousResults) => {
                  const nextResults = {
                    ...previousResults,
                  };

                  delete nextResults[
                    currentProblem.id
                  ];

                  return nextResults;
                }
              );

              setSubmitResults(
                (previousResults) => {
                  const previousResult =
                    previousResults[
                      currentProblem.id
                    ];

                  if (
                    previousResult?.status ===
                    "Accepted"
                  ) {
                    return previousResults;
                  }

                  const nextResults = {
                    ...previousResults,
                  };

                  delete nextResults[
                    currentProblem.id
                  ];

                  return nextResults;
                }
              );
            }}
            options={{
              minimap: {
                enabled: false,
              },
              fontSize: 14,
              padding: {
                top: 16,
              },
              automaticLayout: true,
            }}
          />

          <div className="border-t border-slate-800 bg-slate-950 p-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Custom Input
                </p>

                <textarea
                  value={customInput}
                  onChange={(event) =>
                    setCustomInputs(
                      (previousInputs) => ({
                        ...previousInputs,
                        [
                          currentProblem.id
                        ]:
                          event.target
                            .value,
                      })
                    )
                  }
                  className="h-28 w-full resize-none rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-sm text-slate-300 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Console
                </p>

                <div className="h-28 overflow-auto rounded-xl border border-slate-800 bg-slate-900 p-4">
                  {currentRunResult ? (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(
                            currentRunResult.status
                          )}`}
                        >
                          {
                            currentRunResult.status
                          }
                        </span>

                        <span className="text-xs text-slate-500">
                          {
                            currentRunResult.time ||
                            "0"
                          }
                          s ·{" "}
                          {
                            currentRunResult.memory ||
                            0
                          }{" "}
                          KB
                        </span>
                      </div>

                      <pre className="mt-3 whitespace-pre-wrap font-mono text-sm text-slate-300">
                        {currentRunResult.stdout ||
                          currentRunResult.compileOutput ||
                          currentRunResult.stderr ||
                          currentRunResult.message ||
                          "No output"}
                      </pre>
                    </>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Run your code to view
                      output.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {currentSubmitResult && (
              <div
                className={`mt-4 rounded-xl border p-4 ${statusClasses(
                  currentSubmitResult.status
                )}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {
                        currentSubmitResult.status
                      }
                    </p>

                    <p className="mt-1 text-sm opacity-80">
                      {
                        currentSubmitResult.message
                      }
                    </p>
                  </div>

                  <p className="text-sm font-semibold">
                    {
                      currentSubmitResult.passedTestCases ??
                      0
                    }
                    /
                    {
                      currentSubmitResult.totalTestCases ??
                      0
                    }{" "}
                    passed
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <FiTarget />
                Current problem:{" "}
                {currentProblem.marks}{" "}
                points
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={runCode}
                  disabled={
                    isRunning ||
                    isSubmitting
                  }
                  className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold transition hover:border-emerald-500/40 hover:text-emerald-300 disabled:opacity-50"
                >
                  {isRunning ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <FiPlay />
                  )}

                  {isRunning
                    ? "Running..."
                    : "Run Code"}
                </button>

                <button
                  type="button"
                  onClick={submitProblem}
                  disabled={
                    isSubmitting ||
                    isRunning ||
                    currentSubmitResult
                      ?.status ===
                      "Accepted"
                  }
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <FiSend />
                  )}

                  {isSubmitting
                    ? "Submitting..."
                    : currentSubmitResult
                          ?.status ===
                        "Accepted"
                      ? "Solved"
                      : "Submit Problem"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1800px] justify-between px-5 pb-8">
        <button
          type="button"
          disabled={
            currentProblemIndex === 0
          }
          onClick={() =>
            changeProblem(
              currentProblemIndex - 1
            )
          }
          className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 disabled:opacity-40"
        >
          <FiArrowLeft />
          Previous
        </button>

        <button
          type="button"
          disabled={
            currentProblemIndex ===
            problems.length - 1
          }
          onClick={() =>
            changeProblem(
              currentProblemIndex + 1
            )
          }
          className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 disabled:opacity-40"
        >
          Next
          <FiArrowRight />
        </button>
      </footer>

      {showFinishConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-7">
            <FiAlertCircle className="text-4xl text-amber-400" />

            <h2 className="mt-5 text-2xl font-bold">
              Finish contest?
            </h2>

            <p className="mt-3 leading-6 text-slate-400">
              You have solved{" "}
              {solvedProblemIds.length} of{" "}
              {problems.length} problems.
              Once submitted, you cannot
              return to this contest session.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowFinishConfirmation(
                    false
                  )
                }
                className="rounded-xl border border-slate-700 px-4 py-2 font-semibold"
              >
                Continue Contest
              </button>

              <button
                type="button"
                onClick={handleFinishContest}
                disabled={isFinishing}
                className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isFinishing
                  ? "Saving Result..."
                  : "Finish Contest"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestSession;
