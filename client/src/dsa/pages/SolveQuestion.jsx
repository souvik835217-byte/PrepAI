import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate, useParams } from "react-router-dom";

import Editor from "@monaco-editor/react";

import {
  FiArrowLeft,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCode,
  FiPlay,
  FiRotateCcw,
  FiSend,
  FiXCircle,
} from "react-icons/fi";

import { AuthContext } from "../../context/authContextStore";
import questionData from "../data/questionData";

const languageLabels = {
  cpp: "C++",
  java: "Java",
  python: "Python",
  javascript: "JavaScript",
};

const monacoLanguages = {
  cpp: "cpp",
  java: "java",
  python: "python",
  javascript: "javascript",
};

const fallbackStarterCode = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    // Add the required method and write your solution here.
};`,

  java: `import java.util.*;

class Solution {
    // Add the required method and write your solution here.
}`,

  python: `class Solution:
    # Add the required method and write your solution here.
    pass
`,

  javascript: `class Solution {
  // Add the required method and write your solution here.
}
`,
};

const placeholderStarterCodePattern =
  /^\s*(?:\/\/|#)\s*Write your (?:C\+\+|Java|Python|JavaScript)?\s*solution here\s*$/i;

const normalizeStarterCode = (starterCode = {}) => {
  const configuredStarterCode = Object.entries(starterCode).filter(
    ([languageName, sourceCode]) =>
      languageLabels[languageName] &&
      typeof sourceCode === "string" &&
      sourceCode.trim()
  );

  if (configuredStarterCode.length === 0) {
    return fallbackStarterCode;
  }

  return Object.fromEntries(
    configuredStarterCode.map(([languageName, sourceCode]) => {
      const isPlaceholder =
        typeof sourceCode !== "string" ||
        placeholderStarterCodePattern.test(sourceCode);

      return [
        languageName,
        isPlaceholder
          ? fallbackStarterCode[languageName] ||
            fallbackStarterCode.cpp
          : sourceCode,
      ];
    })
  );
};

const fallbackQuestion = {
  id: "unknown-question",
  title: "Coding Question",
  difficulty: "Medium",
  acceptance: 0,
  topic: "general",
  company: "General",

  description:
    "Question data is currently unavailable. Return to the question list and select another problem.",

  note: "",

  examples: [],

  constraints: [],

  hints: [
    "Carefully analyze the input, output, and constraints before implementing your solution.",
  ],

  editorial: {
    approach:
      "The editorial for this question has not been added yet.",
    timeComplexity: "Not available",
    spaceComplexity: "Not available",
  },

  starterCode: fallbackStarterCode,
};

const getDifficultyClasses = (difficulty) => {
  if (difficulty === "Easy") {
    return "bg-emerald-500/10 text-emerald-400";
  }

  if (difficulty === "Medium") {
    return "bg-amber-500/10 text-amber-400";
  }

  return "bg-red-500/10 text-red-400";
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

const normalizeApiUrl = (url) => {
  return url.replace(/\/api\/?$/, "").replace(/\/$/, "");
};

const API_BASE_URL = normalizeApiUrl(
  import.meta.env.VITE_API_URL ||
    "http://localhost:5000"
);

const SolveQuestion = () => {
  const navigate = useNavigate();
  const { topicId, companyId, questionId } = useParams();

  const questionsPath = companyId
    ? `/dsa/companies/${companyId}`
    : `/dsa/topics/${topicId}`;

  const currentQuestionPath = companyId
    ? `/dsa/companies/${companyId}/questions/${questionId}`
    : `/dsa/topics/${topicId}/questions/${questionId}`;

  const { user, authLoading } = useContext(AuthContext);

  const editorRef = useRef(null);

  const [apiQuestion, setApiQuestion] = useState(null);
  const [questionLoading, setQuestionLoading] = useState(true);
  const [questionError, setQuestionError] = useState("");
  const [navigationQuestions, setNavigationQuestions] = useState([]);

  const question = useMemo(() => {
    const selectedQuestion = apiQuestion;

    if (!selectedQuestion) {
      return fallbackQuestion;
    }

    return {
      ...fallbackQuestion,
      ...selectedQuestion,

      examples: Array.isArray(selectedQuestion.examples)
        ? selectedQuestion.examples
        : [],

      constraints: Array.isArray(selectedQuestion.constraints)
        ? selectedQuestion.constraints
        : [],

      hints: Array.isArray(selectedQuestion.hints)
        ? selectedQuestion.hints
        : fallbackQuestion.hints,

      editorial: {
        ...fallbackQuestion.editorial,
        ...(selectedQuestion.editorial || {}),
      },

      starterCode: normalizeStarterCode(
        selectedQuestion.starterCode
      ),
    };
  }, [apiQuestion]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchQuestion = async () => {
      try {
        setQuestionLoading(true);
        setQuestionError("");

        const response = await fetch(
          `${API_BASE_URL}/api/dsa/questions/${questionId}`,
          {
            signal: controller.signal,
          }
        );
        const data = await response.json();

        console.log("DSA question API response:", data);

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load the question"
          );
        }

        setApiQuestion(data.question);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Question fetch error:", error);
        setQuestionError(error.message);
        setApiQuestion(null);
      } finally {
        if (!controller.signal.aborted) {
          setQuestionLoading(false);
        }
      }
    };

    fetchQuestion();

    return () => {
      controller.abort();
    };
  }, [questionId]);

  useEffect(() => {
    const controller = new AbortController();

    const loadNavigationQuestions = async () => {
      if (companyId) {
        const questions = Object.values(questionData).filter(
          (item) =>
            Array.isArray(item.companies) &&
            item.companies.includes(companyId)
        );
        setNavigationQuestions(questions);
        return;
      }

      if (!topicId) {
        setNavigationQuestions([]);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/dsa/questions/topic/${topicId}`,
          { signal: controller.signal }
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load question list");
        }

        setNavigationQuestions(
          Array.isArray(data.questions) ? data.questions : []
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Question navigation error:", error);
          setNavigationQuestions([]);
        }
      }
    };

    loadNavigationQuestions();

    return () => controller.abort();
  }, [companyId, topicId]);

  const currentQuestionIndex = navigationQuestions.findIndex(
    (item) => item.id === questionId
  );

  const previousQuestion =
    currentQuestionIndex > 0
      ? navigationQuestions[currentQuestionIndex - 1]
      : null;

  const nextQuestion =
    currentQuestionIndex >= 0 &&
    currentQuestionIndex < navigationQuestions.length - 1
      ? navigationQuestions[currentQuestionIndex + 1]
      : null;

  const navigateToQuestion = (targetQuestion) => {
    if (!targetQuestion?.id) return;

    const targetPath = companyId
      ? `/dsa/companies/${companyId}/questions/${targetQuestion.id}`
      : `/dsa/topics/${topicId}/questions/${targetQuestion.id}`;

    navigate(targetPath);
  };

  const availableLanguages = useMemo(() => {
    const configuredLanguages = Object.keys(
      question.starterCode || {}
    ).filter((languageName) => {
      return (
        languageLabels[languageName] &&
        question.starterCode[languageName]
      );
    });

    return configuredLanguages.length > 0
      ? configuredLanguages
      : ["cpp"];
  }, [question]);

  const initialLanguage = availableLanguages.includes("cpp")
    ? "cpp"
    : availableLanguages[0];

  const getStarterCode = (selectedLanguage) => {
    return (
      question.starterCode?.[selectedLanguage] ||
      fallbackStarterCode[selectedLanguage] ||
      fallbackStarterCode.cpp
    );
  };

  const [language, setLanguage] = useState(initialLanguage);

  const [code, setCode] = useState(() =>
    getStarterCode(initialLanguage)
  );

  const [activeTab, setActiveTab] =
    useState("description");

  const [output, setOutput] = useState("");

  const [isRunning, setIsRunning] =
    useState(false);

  const [actionType, setActionType] =
    useState("");

  const [submissionStatus, setSubmissionStatus] =
    useState("");

  const [executionSuccess, setExecutionSuccess] =
    useState(null);

  const clearResult = () => {
    setOutput("");
    setSubmissionStatus("");
    setExecutionSuccess(null);
  };

  const loadCodeIntoEditor = (nextCode) => {
    setCode(nextCode);

    if (editorRef.current) {
      editorRef.current.setValue(nextCode);

      editorRef.current.setPosition({
        lineNumber: 1,
        column: 1,
      });

      editorRef.current.revealLine(1);
    }
  };

  useEffect(() => {
    const nextLanguage = availableLanguages.includes("cpp")
      ? "cpp"
      : availableLanguages[0];

    const nextCode =
      question.starterCode?.[nextLanguage] ||
      fallbackStarterCode[nextLanguage] ||
      fallbackStarterCode.cpp;

    setLanguage(nextLanguage);
    setCode(nextCode);
    setActiveTab("description");

    clearResult();

    if (editorRef.current) {
      editorRef.current.setValue(nextCode);

      editorRef.current.setPosition({
        lineNumber: 1,
        column: 1,
      });

      editorRef.current.revealLine(1);
    }
  }, [questionId, question, availableLanguages]);

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    const nextCode = getStarterCode(nextLanguage);

    setLanguage(nextLanguage);
    loadCodeIntoEditor(nextCode);
    clearResult();
  };

  const handleReset = () => {
    const originalCode = getStarterCode(language);

    loadCodeIntoEditor(originalCode);

    editorRef.current?.focus();

    clearResult();
  };

  const handleRunCode = async () => {
    await handleSubmit("run");
  };

  const handleSubmit = async (
    requestedAction = "submit"
  ) => {
    const isRealSubmission =
      requestedAction === "submit";

    if (!code.trim()) {
      setSubmissionStatus("Error");

      setOutput(
        "Please write your solution before running or submitting."
      );

      setExecutionSuccess(false);

      return;
    }

    if (isRealSubmission && authLoading) {
      setSubmissionStatus("Error");

      setOutput(
        "Authentication is still loading. Please try again."
      );

      setExecutionSuccess(false);

      return;
    }

    if (isRealSubmission && !user) {
      navigate("/login", {
        state: {
          from: currentQuestionPath,
        },
      });

      return;
    }

    try {
      setIsRunning(true);
      setActionType(requestedAction);

      setSubmissionStatus(
        requestedAction === "run"
          ? "Running"
          : "Submitting"
      );

      setOutput(
        requestedAction === "run"
          ? "Running test cases..."
          : "Running hidden test cases..."
      );

      setExecutionSuccess(null);

      const response = await fetch(
        `${API_BASE_URL}/api/code/submit`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId: user?.uid || null,

            sourceCode: code,

            language,

            questionId: question.id,

            questionTitle:
              question.title || "Coding Question",

            topic:
              question.topic ||
              topicId ||
              "general",

            difficulty:
              question.difficulty || "Medium",

            company:
              companyId ||
              question.company ||
              "General",

            saveSubmission: isRealSubmission,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type");

      let data;

      if (
        contentType?.includes("application/json")
      ) {
        data = await response.json();
      } else {
        const responseText = await response.text();

        throw new Error(
          responseText ||
            "The server returned an invalid response."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Code submission failed."
        );
      }

      if (data.accepted) {
        setSubmissionStatus("Accepted");
        setExecutionSuccess(true);

        setOutput(
          [
            data.message ||
              `All ${
                data.totalTestCases ?? 0
              } test cases passed.`,

            `Passed: ${
              data.passedTestCases ?? 0
            }/${data.totalTestCases ?? 0}`,

            `Execution time: ${
              data.executionTime ?? 0
            } seconds`,

            `Memory: ${data.memory ?? 0} KB`,

            isRealSubmission &&
            data.submissionSaved
              ? "Submission saved successfully."
              : isRealSubmission
                ? "Submission was accepted but was not saved."
                : "Run completed. Run results are not saved.",

            isRealSubmission &&
            data.submissionId
              ? `Submission ID: ${data.submissionId}`
              : "",

            isRealSubmission && user?.uid
              ? `User ID: ${user.uid}`
              : "",
          ]
            .filter(Boolean)
            .join("\n")
        );

        return;
      }

      setSubmissionStatus(
        data.status || "Wrong Answer"
      );

      setExecutionSuccess(false);

      setOutput(
        [
          data.message || "The solution was not accepted.",

          `Passed: ${
            data.passedTestCases ?? 0
          }/${data.totalTestCases ?? 0}`,

          data.failedTestCase
            ? `Failed test case:\n${data.failedTestCase}`
            : "",

          data.executionTime !== undefined
            ? `Execution time: ${data.executionTime} seconds`
            : "",

          data.memory !== undefined
            ? `Memory: ${data.memory} KB`
            : "",

          data.compileOutput
            ? `Compilation error:\n${data.compileOutput}`
            : "",

          data.stderr
            ? `Runtime error:\n${data.stderr}`
            : "",

          isRealSubmission &&
          data.submissionSaved
            ? "Submission saved to your history."
            : isRealSubmission
              ? "Submission was not saved."
              : "Run result was not saved.",
        ]
          .filter(Boolean)
          .join("\n\n")
      );
    } catch (error) {
      console.error("Submit code error:", error);

      setSubmissionStatus("Error");
      setExecutionSuccess(false);

      setOutput(
        error.message ||
          "Unable to submit the solution."
      );
    } finally {
      setIsRunning(false);
      setActionType("");
    }
  };

  if (questionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading question...
      </div>
    );
  }

  if (questionError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center">
        <p className="text-red-400">{questionError}</p>
        <button
          type="button"
          onClick={() => navigate(questionsPath)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Back to questions
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 py-3 pl-4 pr-36 sm:flex-row sm:items-center sm:justify-between sm:pr-40">
          <button
            type="button"
            onClick={() => navigate(questionsPath)}
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <FiArrowLeft />
            Back to questions
          </button>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end sm:gap-3">
            {!authLoading && !user && (
              <button
                type="button"
                onClick={() =>
                  navigate("/login", {
                    state: {
                      from: currentQuestionPath,
                    },
                  })
                }
                className="rounded-lg border border-indigo-500/50 px-4 py-2 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/10"
              >
                Login
              </button>
            )}

            <div className="flex items-center overflow-hidden rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => navigateToQuestion(previousQuestion)}
                disabled={!previousQuestion}
                title={
                  previousQuestion
                    ? `Previous: ${previousQuestion.title}`
                    : "This is the first question"
                }
                className="flex items-center gap-1.5 border-r border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronLeft />
                <span className="hidden md:inline">Previous</span>
              </button>

              <button
                type="button"
                onClick={() => navigateToQuestion(nextQuestion)}
                disabled={!nextQuestion}
                title={
                  nextQuestion
                    ? `Next: ${nextQuestion.title}`
                    : "This is the last question"
                }
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="hidden md:inline">Next</span>
                <FiChevronRight />
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              disabled={isRunning}
              className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiRotateCcw />
              Reset
            </button>

            <button
              type="button"
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiPlay />

              {isRunning && actionType === "run"
                ? "Running..."
                : "Run Code"}
            </button>

            <button
              type="button"
              onClick={() => handleSubmit("submit")}
              disabled={isRunning || authLoading}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSend />

              {isRunning &&
              actionType === "submit"
                ? "Submitting..."
                : authLoading
                  ? "Loading..."
                  : "Submit"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1600px] grid-cols-1 lg:h-[calc(100vh-65px)] lg:grid-cols-2 lg:overflow-hidden">
        <section className="flex min-h-[650px] flex-col overflow-hidden border-b border-slate-800 bg-slate-950 lg:min-h-0 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-800 px-6 py-5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold">
                {question.title}
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getDifficultyClasses(
                  question.difficulty
                )}`}
              >
                {question.difficulty}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-5 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-400" />
                Acceptance{" "}
                {formatAcceptance(
                  question.acceptance
                )}
              </span>

              <span className="flex items-center gap-2">
                <FiClock />
                No time limit
              </span>

              <span className="capitalize">
                Topic:{" "}
                {question.topic ||
                  topicId ||
                  "General"}
              </span>
            </div>
          </div>

          <div className="flex border-b border-slate-800 px-4 sm:px-6">
            {[
              "description",
              "hints",
              "editorial",
            ].map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-4 py-4 text-sm font-semibold capitalize transition ${
                  activeTab === tab
                    ? "border-indigo-500 text-white"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {activeTab === "description" && (
              <div className="space-y-7">
                <div>
                  <p className="leading-7 text-slate-300">
                    {question.description}
                  </p>

                  {question.note && (
                    <p className="mt-4 leading-7 text-slate-300">
                      {question.note}
                    </p>
                  )}
                </div>

                {question.examples.length > 0 ? (
                  question.examples.map(
                    (example, index) => (
                      <div
                        key={`${question.id}-example-${index}`}
                      >
                        <h2 className="text-lg font-semibold">
                          Example {index + 1}
                        </h2>

                        <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-sm leading-7">
                          <div>
                            <div className="text-slate-500">
                              Input:
                            </div>
                            <pre className="mt-1 whitespace-pre-wrap font-mono leading-6 text-white">
                              {example.input}
                            </pre>
                          </div>

                          <div className="mt-3">
                            <div className="text-slate-500">
                              Output:
                            </div>
                            <pre className="mt-1 whitespace-pre-wrap font-mono leading-6 text-white">
                              {example.output}
                            </pre>
                          </div>

                          {example.explanation && (
                            <div className="mt-3">
                              <div className="text-slate-500">
                                Explanation:
                              </div>
                              <p className="mt-1 whitespace-pre-wrap text-white">
                                {example.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-400">
                    Examples have not been added for this
                    question.
                  </div>
                )}

                <div>
                  <h2 className="text-lg font-semibold">
                    Constraints
                  </h2>

                  <ul className="mt-3 space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-sm text-slate-300">
                    {question.constraints.length > 0 ? (
                      question.constraints.map(
                        (constraint) => (
                          <li key={constraint}>
                            • {constraint}
                          </li>
                        )
                      )
                    ) : (
                      <li>
                        Constraints have not been added.
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "hints" && (
              <div className="space-y-4">
                {question.hints.map(
                  (hint, index) => (
                    <div
                      key={`${question.id}-hint-${index}`}
                      className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5"
                    >
                      <h2 className="font-semibold text-indigo-300">
                        Hint {index + 1}
                      </h2>

                      <p className="mt-2 leading-7 text-slate-300">
                        {hint}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}

            {activeTab === "editorial" && (
              <div>
                <h2 className="text-xl font-semibold">
                  Optimal approach
                </h2>

                <p className="mt-3 leading-7 text-slate-300">
                  {question.editorial.approach}
                </p>

                <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-sm text-slate-300">
                    Time complexity:{" "}
                    <span className="font-semibold text-white">
                      {
                        question.editorial
                          .timeComplexity
                      }
                    </span>
                  </p>

                  <p className="mt-2 text-sm text-slate-300">
                    Space complexity:{" "}
                    <span className="font-semibold text-white">
                      {
                        question.editorial
                          .spaceComplexity
                      }
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="flex min-h-[700px] flex-col overflow-hidden bg-slate-900 lg:min-h-0">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
            <div className="flex items-center gap-2">
              <FiCode className="text-indigo-400" />

              <span className="text-sm font-semibold">
                Code editor
              </span>
            </div>

            <select
              value={language}
              onChange={handleLanguageChange}
              disabled={isRunning}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {availableLanguages.map(
                (languageName) => (
                  <option
                    key={languageName}
                    value={languageName}
                  >
                    {languageLabels[
                      languageName
                    ] || languageName}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="min-h-[480px] flex-1 overflow-hidden bg-[#1e1e1e] lg:min-h-0">
            <Editor
              height="100%"
              theme="vs-dark"
              language={
                monacoLanguages[language] ||
                language
              }
              value={code}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              onChange={(value) =>
                setCode(value || "")
              }
              loading={
                <div className="flex h-full items-center justify-center bg-slate-950 text-sm text-slate-400">
                  Loading code editor...
                </div>
              }
              options={{
                fontSize: 15,

                fontFamily:
                  "'Cascadia Code', 'Fira Code', Consolas, monospace",

                fontLigatures: true,

                minimap: {
                  enabled: false,
                },

                automaticLayout: true,
                scrollBeyondLastLine: false,
                mouseWheelScrollSensitivity: 1,
                fastScrollSensitivity: 5,

                scrollbar: {
                  vertical: "visible",
                  horizontal: "visible",
                  handleMouseWheel: true,
                  alwaysConsumeMouseWheel: true,
                },

                wordWrap: "on",
                tabSize: 4,
                insertSpaces: true,
                lineNumbers: "on",
                roundedSelection: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,

                bracketPairColorization: {
                  enabled: true,
                },

                guides: {
                  bracketPairs: true,
                  indentation: true,
                },

                padding: {
                  top: 18,
                  bottom: 18,
                },
              }}
            />
          </div>

          <div className="border-t border-slate-800 bg-slate-950/40">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
              <h2 className="text-sm font-semibold">
                Test result
              </h2>

              {submissionStatus && (
                <span
                  className={`flex items-center gap-2 text-sm font-semibold ${
                    executionSuccess
                      ? "text-emerald-400"
                      : executionSuccess === false
                        ? "text-red-400"
                        : "text-amber-400"
                  }`}
                >
                  {executionSuccess ? (
                    <FiCheckCircle />
                  ) : executionSuccess === false ? (
                    <FiXCircle />
                  ) : (
                    <FiClock />
                  )}

                  Status: {submissionStatus}
                </span>
              )}
            </div>

            <pre
              className={`min-h-44 max-h-56 overflow-auto whitespace-pre-wrap p-5 font-mono text-sm leading-6 ${
                executionSuccess === false
                  ? "text-red-300"
                  : executionSuccess
                    ? "text-emerald-300"
                    : "text-slate-300"
              }`}
            >
              {output ||
                "Run your code to see the execution result."}
            </pre>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SolveQuestion;
