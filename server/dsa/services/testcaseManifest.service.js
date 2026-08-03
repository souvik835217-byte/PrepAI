import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import generateWrapper from "../utils/generateWrapper.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const manifestDirectory = path.join(currentDirectory, "../testcases");

const formatExpectedOutput = (value) => {
  if (Array.isArray(value)) {
    return value.join(" ");
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return String(value ?? "");
};

export const getTestcaseManifest = (questionId) => {
  if (!/^[a-z0-9-]+$/.test(questionId)) {
    return null;
  }

  const manifestPath = path.join(
    manifestDirectory,
    `${questionId}.json`
  );

  if (!fs.existsSync(manifestPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
};

export const getManifestTestCases = (manifest) =>
  manifest.testCases.map((testCase) => ({
    input: testCase.input,
    expectedOutput: formatExpectedOutput(testCase.expected),
  }));

export const buildManifestSource = ({
  sourceCode,
  language,
  manifest,
  input,
}) => {
  if (!manifest.supportedLanguages.includes(language)) {
    throw new Error(
      `${language} is not supported for ${manifest.id}`
    );
  }

  return generateWrapper(language, sourceCode, manifest, {
    input,
  });
};
