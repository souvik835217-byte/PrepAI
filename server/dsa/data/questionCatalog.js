import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

export const activeQuestionFiles = [
  "arrays.json",
  "strings.json",
  "linkedlist.json",
  "stack.json",
  "queue.json",
  "heap.json",
  "trees.json",
  "graph.json",
  "dp.json",
  "greedy.json",
  "hashing.json",
  "bit-manipulation.json",
  "backtracking.json",
  "math.json",
  "binary-search.json",
];

const questionsById = new Map();

for (const filename of activeQuestionFiles) {
  const filePath = path.join(currentDirectory, filename);
  const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));

  for (const question of questions) {
    if (!questionsById.has(question.id)) {
      questionsById.set(question.id, question);
    }
  }
}

export const catalogQuestions = [...questionsById.values()];

export const getCatalogQuestionById = (questionId) =>
  questionsById.get(questionId) || null;

export const catalogProblems = catalogQuestions.map((question) => ({
  ...question,
  points: question.points ?? 100,
}));

export const catalogProblemTestCases = Object.fromEntries(
  catalogQuestions.map((question) => {
    const testCases = [
      ...(question.publicTestCases || []),
      ...(question.hiddenTestCases || []),
    ].map((testCase) => ({
      input: testCase.stdin ?? testCase.input ?? "",
      expectedOutput: testCase.expectedOutput ?? "",
    }));

    return [question.id, testCases];
  })
);
