import cppDriver from "../drivers/cppDriver.js";
import javaDriver from "../drivers/javaDriver.js";
import pythonDriver from "../drivers/pythonDriver.js";
import javascriptDriver from "../drivers/javascriptDriver.js";

export default function generateWrapper(
  language,
  userCode,
  config,
  testCase
) {
  switch (language) {
    case "cpp":
      return cppDriver(userCode, config, testCase);

    case "java":
      return javaDriver(userCode, config, testCase);

    case "python":
      return pythonDriver(userCode, config, testCase);

    case "javascript":
      return javascriptDriver(userCode, config, testCase);

    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}
