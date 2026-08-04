import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

const DATA_DIRECTORY = path.join(currentDirectory, "../data");

const TOPIC_FILES = {
  arrays: "arrays.json",
  strings: "strings.json",
  "linked-list": "linkedlist.json",
  stack: "stack.json",
  queue: "queue.json",
  heap: "heap.json",
  trees: "trees.json",
  graphs: "graph.json",
  "dynamic-programming": "dp.json",
  greedy: "greedy.json",
  hashing: "hashing.json",
  "bit-manipulation": "bit-manipulation.json",
  backtracking: "backtracking.json",
  math: "math.json",
  "binary-search": "binary-search.json",
  bst: "bst.json",
};

const TOPIC_ALIASES = {
  linkedlist: "linked-list",
  tree: "trees",
  graph: "graphs",
  dp: "dynamic-programming",
};

const QUESTION_ID_ALIASES = {
  "first-unique-character-stream":
    "first-unique-number-in-a-stream",
};

const readJsonFile = (filename) => {
  const filePath = path.join(DATA_DIRECTORY, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Question file not found: ${filename}`);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
};

export const getAvailableTopics = () => {
  return Object.entries(TOPIC_FILES).map(([id, filename]) => {
    const questions = readJsonFile(filename);

    return {
      id,
      name:
        questions.length > 0
          ? questions[0].topicName
          : id.charAt(0).toUpperCase() + id.slice(1),
      questionCount: questions.length,
    };
  });
};

export const getQuestionsByTopic = (topicId) => {
  const requestedTopic = topicId.toLowerCase();

  const normalizedTopic =
    TOPIC_ALIASES[requestedTopic] || requestedTopic;
  const filename = TOPIC_FILES[normalizedTopic];

  if (!filename) {
    return null;
  }

  return readJsonFile(filename);
};

export const getQuestionById = (questionId) => {
  const normalizedQuestionId =
    QUESTION_ID_ALIASES[questionId] || questionId;

  for (const filename of Object.values(TOPIC_FILES)) {
    const questions = readJsonFile(filename);

    const question = questions.find(
      (item) => item.id === normalizedQuestionId
    );

    if (question) {
      return question;
    }
  }

  return null;
};
