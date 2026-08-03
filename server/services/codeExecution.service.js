import axios from "axios";

const JUDGE0_API_URL =
  process.env.JUDGE0_API_URL || "https://ce.judge0.com";

const LANGUAGE_IDS = {
  cpp: 54,
  java: 62,
  python: 71,
  javascript: 63,
};

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const encodeBase64 = (value = "") => {
  return Buffer.from(String(value), "utf8").toString("base64");
};

const decodeBase64 = (value) => {
  if (!value) {
    return "";
  }

  try {
    return Buffer.from(value, "base64").toString("utf8");
  } catch {
    return String(value);
  }
};

const normalizeResult = (result) => {
  return {
    stdout: decodeBase64(result.stdout),
    stderr: decodeBase64(result.stderr),
    compileOutput: decodeBase64(result.compile_output),
    message: decodeBase64(result.message),
    time: result.time || null,
    memory: result.memory || null,
    status: result.status?.description || "Unknown",
    statusId: result.status?.id || null,
  };
};

const createExecutionError = (error) => {
  console.error(
    "Judge0 error:",
    error.response?.data || error.message
  );

  const responseData = error.response?.data;

  let message = "Code execution failed";

  if (typeof responseData === "string") {
    message = responseData;
  } else if (responseData?.error) {
    message = responseData.error;
  } else if (responseData?.message) {
    message = responseData.message;
  } else if (error.message) {
    message = error.message;
  }

  const executionError = new Error(message);

  executionError.statusCode =
    error.response?.status || error.statusCode || 500;

  return executionError;
};

export const executeCode = async ({
  sourceCode,
  language,
  stdin = "",
}) => {
  const languageId = LANGUAGE_IDS[language];

  if (!languageId) {
    const error = new Error(
      `Unsupported programming language: ${language}`
    );

    error.statusCode = 400;
    throw error;
  }

  if (!sourceCode || !sourceCode.trim()) {
    const error = new Error("Source code is required");

    error.statusCode = 400;
    throw error;
  }

  try {
    const submissionResponse = await axios.post(
      `${JUDGE0_API_URL}/submissions`,
      {
        source_code: encodeBase64(sourceCode),
        language_id: languageId,
        stdin: encodeBase64(stdin),
        cpu_time_limit: 3,
        wall_time_limit: 5,
        memory_limit: 128000,
      },
      {
        params: {
          base64_encoded: true,
          wait: false,
        },
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const token = submissionResponse.data?.token;

    if (!token) {
      const error = new Error(
        "Judge0 did not return a submission token"
      );

      error.statusCode = 502;
      throw error;
    }

    const maximumAttempts = 12;

    for (
      let attempt = 0;
      attempt < maximumAttempts;
      attempt += 1
    ) {
      await sleep(700);

      const resultResponse = await axios.get(
        `${JUDGE0_API_URL}/submissions/${token}`,
        {
          params: {
            base64_encoded: true,
            fields:
              "stdout,stderr,compile_output,message,time,memory,status",
          },
          timeout: 15000,
        }
      );

      const result = resultResponse.data;
      const statusId = result.status?.id;

      // Status 1: In Queue
      // Status 2: Processing
      if (statusId !== 1 && statusId !== 2) {
        return normalizeResult(result);
      }
    }

    const timeoutError = new Error(
      "Code execution took too long. Please try again."
    );

    timeoutError.statusCode = 408;
    throw timeoutError;
  } catch (error) {
    if (error.statusCode === 408) {
      throw error;
    }

    throw createExecutionError(error);
  }
};