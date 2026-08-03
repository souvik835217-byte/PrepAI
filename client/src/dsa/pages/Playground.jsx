import React, { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiCode,
  FiLoader,
  FiPlay,
  FiRefreshCw,
  FiTerminal,
} from "react-icons/fi";

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
    starterCode: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here

    return 0;
}`,
  },
  {
    id: "java",
    label: "Java",
    monacoLanguage: "java",
    starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}`,
  },
  {
    id: "python",
    label: "Python",
    monacoLanguage: "python",
    starterCode: `# Write your code here

`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    monacoLanguage: "javascript",
    starterCode: `// Write your code here

`,
  },
];

const statusClasses = (status = "") => {
  const normalizedStatus = status.toLowerCase();

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

const Playground = () => {
  const [selectedLanguage, setSelectedLanguage] =
    useState("cpp");

  const [codeByLanguage, setCodeByLanguage] =
    useState(() =>
      Object.fromEntries(
        languages.map((language) => [
          language.id,
          language.starterCode,
        ])
      )
    );

  const [customInput, setCustomInput] =
    useState("");

  const [runResult, setRunResult] =
    useState(null);

  const [isRunning, setIsRunning] =
    useState(false);

  const [error, setError] = useState("");

  const selectedLanguageDetails = useMemo(
    () =>
      languages.find(
        (language) =>
          language.id === selectedLanguage
      ),
    [selectedLanguage]
  );

  const sourceCode =
    codeByLanguage[selectedLanguage] || "";

  const handleLanguageChange = (
    event
  ) => {
    setSelectedLanguage(
      event.target.value
    );

    setRunResult(null);
    setError("");
  };

  const handleCodeChange = (value) => {
    setCodeByLanguage(
      (currentCode) => ({
        ...currentCode,
        [selectedLanguage]:
          value ?? "",
      })
    );

    setRunResult(null);
    setError("");
  };

  const resetCode = () => {
    const starterCode =
      selectedLanguageDetails
        ?.starterCode || "";

    setCodeByLanguage(
      (currentCode) => ({
        ...currentCode,
        [selectedLanguage]:
          starterCode,
      })
    );

    setCustomInput("");
    setRunResult(null);
    setError("");
  };

  const runCode = async () => {
    if (isRunning) {
      return;
    }

    if (!sourceCode.trim()) {
      setError(
        "Please write some code before running."
      );
      return;
    }

    try {
      setIsRunning(true);
      setError("");
      setRunResult(null);

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

      const contentType =
        response.headers.get(
          "content-type"
        );

      if (
        !contentType?.includes(
          "application/json"
        )
      ) {
        throw new Error(
          "The server returned an invalid response."
        );
      }

      const data = await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to run code."
        );
      }

      setRunResult(data.result);
    } catch (requestError) {
      console.error(
        "Playground run error:",
        requestError
      );

      setError(
        requestError.message ||
          "Unable to run code."
      );
    } finally {
      setIsRunning(false);
    }
  };

  const outputText =
    runResult?.stdout ||
    runResult?.compileOutput ||
    runResult?.stderr ||
    runResult?.message ||
    "No output";

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-8">
      <div className="mx-auto max-w-[1700px]">
        <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-400">
              Free Coding Environment
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Coding Playground
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Write and execute code in
              multiple languages using
              custom input.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={selectedLanguage}
              onChange={
                handleLanguageChange
              }
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500"
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

            <button
              type="button"
              onClick={resetCode}
              className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-slate-600 hover:text-white"
            >
              <FiRefreshCw />
              Reset
            </button>

            <button
              type="button"
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
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
          </div>
        </header>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            <FiAlertCircle className="mt-0.5 shrink-0 text-xl" />

            <div>
              <p className="font-semibold">
                Unable to run code
              </p>

              <p className="mt-1 text-sm text-red-200">
                {error}
              </p>
            </div>
          </div>
        )}

        <main className="mt-7 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                  <FiCode />
                </div>

                <div>
                  <p className="font-semibold">
                    Code Editor
                  </p>

                  <p className="text-xs text-slate-500">
                    {
                      selectedLanguageDetails?.label
                    }
                  </p>
                </div>
              </div>
            </div>

            <Editor
              height="670px"
              language={
                selectedLanguageDetails
                  ?.monacoLanguage
              }
              theme="vs-dark"
              value={sourceCode}
              onChange={handleCodeChange}
              options={{
                minimap: {
                  enabled: false,
                },
                fontSize: 14,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: {
                  top: 18,
                },
                tabSize: 4,
              }}
            />
          </section>

          <section className="space-y-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                  <FiTerminal />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Custom Input
                  </h2>

                  <p className="text-xs text-slate-500">
                    Optional standard input
                  </p>
                </div>
              </div>

              <textarea
                value={customInput}
                onChange={(event) =>
                  setCustomInput(
                    event.target.value
                  )
                }
                placeholder={`Example:
5
1 2 3 4 5`}
                className="mt-5 h-56 w-full resize-none rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-sm text-slate-300 outline-none transition focus:border-indigo-500"
              />
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                    <FiTerminal />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Console Output
                    </h2>

                    <p className="text-xs text-slate-500">
                      Execution response
                    </p>
                  </div>
                </div>

                {runResult && (
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses(
                      runResult.status
                    )}`}
                  >
                    {runResult.status}
                  </span>
                )}
              </div>

              <div className="mt-5 min-h-64 overflow-auto rounded-2xl border border-slate-800 bg-slate-950 p-4">
                {isRunning ? (
                  <div className="flex min-h-56 flex-col items-center justify-center text-slate-400">
                    <FiLoader className="animate-spin text-3xl text-indigo-400" />

                    <p className="mt-3">
                      Executing your code...
                    </p>
                  </div>
                ) : runResult ? (
                  <>
                    <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-6 text-slate-300">
                      {outputText}
                    </pre>

                    <div className="mt-5 grid gap-3 border-t border-slate-800 pt-4 sm:grid-cols-2">
                      <InfoCard
                        label="Execution Time"
                        value={`${
                          runResult.time ||
                          0
                        } s`}
                      />

                      <InfoCard
                        label="Memory"
                        value={`${
                          runResult.memory ||
                          0
                        } KB`}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-56 flex-col items-center justify-center text-center text-slate-500">
                    <FiTerminal className="text-4xl" />

                    <p className="mt-3">
                      Run your code to see
                      the output here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {runResult?.status ===
              "Accepted" && (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">
                <FiCheckCircle className="mt-0.5 shrink-0 text-xl" />

                <div>
                  <p className="font-semibold">
                    Execution completed
                  </p>

                  <p className="mt-1 text-sm text-emerald-200">
                    Your code ran successfully.
                  </p>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

const InfoCard = ({
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-semibold">
        {value}
      </p>
    </div>
  );
};

export default Playground;