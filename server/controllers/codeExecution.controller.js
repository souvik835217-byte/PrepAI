import { executeCode } from "../services/codeExecution.service.js";

const allowedLanguages = ["cpp", "java", "python", "javascript"];

export const runCode = async (req, res) => {
  try {
    const { sourceCode, language, stdin = "" } = req.body;

    if (!sourceCode || typeof sourceCode !== "string") {
      return res.status(400).json({
        success: false,
        message: "Source code is required",
      });
    }

    if (!allowedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported programming language",
      });
    }

    if (sourceCode.length > 50000) {
      return res.status(400).json({
        success: false,
        message: "Source code is too large",
      });
    }

    if (typeof stdin !== "string" || stdin.length > 10000) {
      return res.status(400).json({
        success: false,
        message: "Custom input is too large",
      });
    }

    const result = await executeCode({
      sourceCode,
      language,
      stdin,
    });

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(
      "Code execution error:",
      error.response?.data || error.message
    );

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to execute code",
    });
  }
};

export const runCustomCode = async (req, res) => {
  try {
    const {
      language,
      sourceCode,
      stdin = "",
    } = req.body;

    if (!language) {
      return res.status(400).json({
        success: false,
        message: "Language is required.",
      });
    }

    if (!sourceCode?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Source code is required.",
      });
    }

    const execution = await executeCode({
      language,
      sourceCode,
      stdin,
    });

    const statusId = Number(execution.statusId);
    let status = execution.status || "Completed";

    if (statusId === 3) {
      status = "Accepted";
    } else if (statusId === 6) {
      status = "Compile Error";
    } else if ([7, 8, 9, 10, 11, 12].includes(statusId)) {
      status = "Runtime Error";
    } else if (statusId === 5) {
      status = "Time Limit Exceeded";
    }

    return res.status(200).json({
      success: true,
      result: {
        status,
        statusId,
        stdout: execution.stdout || "",
        stderr: execution.stderr || "",
        compileOutput: execution.compileOutput || "",
        message: execution.message || "",
        time: execution.time || "0",
        memory: execution.memory || 0,
      },
    });
  } catch (error) {
    console.error("Custom code execution error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to execute custom input.",
    });
  }
};
