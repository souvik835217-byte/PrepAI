import { executeCode } from "../services/codeExecution.service.js";
import {
  getTestCasesByProblemId,
  problemTestCases,
} from "../dsa/data/problemTestCases.js";
import { getProblemById } from "../dsa/data/problems.js";
import { getCatalogQuestionById } from "../dsa/data/questionCatalog.js";
import {
  buildManifestSource,
  getManifestTestCases,
  getTestcaseManifest,
} from "../dsa/services/testcaseManifest.service.js";
import CodeSubmission from "../models/CodeSubmission.js";

const normalizeOutput = (output = "") => {
  return String(output)
    .replace(/\r\n/g, "\n")
    .trim();
};

const buildNetworkDelayTimeSource = (sourceCode, language) => {
  if (language === "cpp") {
    return `${sourceCode}

int main() {
    int n, m, k;
    cin >> n >> m >> k;
    vector<vector<int>> times(m, vector<int>(3));
    for (auto& edge : times) {
        cin >> edge[0] >> edge[1] >> edge[2];
    }
    Solution solution;
    cout << solution.networkDelayTime(times, n, k);
    return 0;
}`;
  }

  if (language === "java") {
    return `${sourceCode}

class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        int k = scanner.nextInt();
        int[][] times = new int[m][3];
        for (int i = 0; i < m; i++) {
            times[i][0] = scanner.nextInt();
            times[i][1] = scanner.nextInt();
            times[i][2] = scanner.nextInt();
        }
        System.out.print(new Solution().networkDelayTime(times, n, k));
    }
}`;
  }

  if (language === "python") {
    return `${sourceCode}

if __name__ == "__main__":
    import sys
    values = list(map(int, sys.stdin.buffer.read().split()))
    n, m, k = values[:3]
    times = [values[i:i + 3] for i in range(3, 3 + 3 * m, 3)]
    print(Solution().networkDelayTime(times, n, k))
`;
  }

  if (language === "javascript") {
    return `${sourceCode}

const fs = require("fs");
const values = fs.readFileSync(0, "utf8").trim().split(/\\s+/).map(Number);
const [n, m, k] = values;
const times = [];
for (let i = 0; i < m; i += 1) {
  times.push(values.slice(3 + i * 3, 6 + i * 3));
}
console.log(new Solution().networkDelayTime(times, n, k));
`;
  }

  return sourceCode;
};

const splitCppParameters = (parameters) => {
  const result = [];
  let depth = 0;
  let start = 0;

  for (let index = 0; index < parameters.length; index += 1) {
    const character = parameters[index];
    if (character === "<") depth += 1;
    if (character === ">") depth -= 1;
    if (character === "," && depth === 0) {
      result.push(parameters.slice(start, index).trim());
      start = index + 1;
    }
  }

  const finalParameter = parameters.slice(start).trim();
  if (finalParameter) result.push(finalParameter);
  return result;
};

const buildGenericCppSource = (sourceCode, problem) => {
  const functionName = problem?.functionName;
  if (!functionName || functionName === "main") return null;

  const escapedFunctionName = functionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const signature = sourceCode.match(
    new RegExp(`([\\w:<>,\\s&*]+?)\\b${escapedFunctionName}\\s*\\(([^)]*)\\)`)
  );
  if (!signature) return null;

  const returnType = signature[1].trim().split(/\s+/).at(-1);
  const declarations = [];
  const argumentsList = [];

  for (const [index, parameter] of splitCppParameters(signature[2]).entries()) {
    const match = parameter.match(/^(.*?)\s+([A-Za-z_]\w*)$/);
    if (!match) return null;

    const type = match[1]
      .replace(/\bconst\b/g, "")
      .replace(/[&*]/g, "")
      .replace(/\s+/g, "")
      .trim();
    const name = match[2] || `argument${index}`;
    argumentsList.push(name);

    if (["int", "long", "longlong", "double", "float", "char", "string"].includes(type)) {
      declarations.push(`    ${type.replace("longlong", "long long")} ${name};\n    cin >> ${name};`);
    } else if (type === "bool") {
      declarations.push(`    bool ${name};\n    cin >> boolalpha >> ${name};`);
    } else if (["vector<int>", "vector<longlong>", "vector<double>", "vector<string>"].includes(type)) {
      const itemType = type.slice(7, -1).replace("longlong", "long long");
      declarations.push(`    int ${name}Count;\n    cin >> ${name}Count;\n    vector<${itemType}> ${name}(${name}Count);\n    for (auto& value : ${name}) cin >> value;`);
    } else if (type === "vector<vector<int>>") {
      declarations.push(`    int ${name}Rows, ${name}Columns;\n    cin >> ${name}Rows >> ${name}Columns;\n    vector<vector<int>> ${name}(${name}Rows, vector<int>(${name}Columns));\n    for (auto& row : ${name}) for (int& value : row) cin >> value;`);
    } else {
      return null;
    }
  }

  const hasSolutionClass = /\bclass\s+Solution\b/.test(sourceCode);
  const invocation = hasSolutionClass
    ? `solution.${functionName}(${argumentsList.join(", ")})`
    : `${functionName}(${argumentsList.join(", ")})`;
  const output = returnType === "void"
    ? `    ${invocation};`
    : `    const auto answer = ${invocation};\n    printResult(answer);`;

  return `${sourceCode}

template <typename T>
void printResult(const T& value) {
    cout << boolalpha << value;
}

template <typename T>
void printResult(const vector<T>& values) {
    for (size_t index = 0; index < values.size(); index++) {
        if (index > 0) cout << " ";
        printResult(values[index]);
    }
}

template <typename T>
void printResult(const vector<vector<T>>& rows) {
    for (size_t row = 0; row < rows.size(); row++) {
        if (row > 0) cout << "\\n";
        printResult(rows[row]);
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

${declarations.join("\n")}

    ${hasSolutionClass ? "Solution solution;" : ""}
${output}
    return 0;
}`;
};

export const prepareSourceCode = ({
  sourceCode,
  language,
  questionId,
  manifest,
  input,
}) => {
  if (manifest) {
    return buildManifestSource({
      sourceCode,
      language,
      manifest,
      input,
    });
  }

  if (questionId === "network-delay-time") {
    return buildNetworkDelayTimeSource(sourceCode, language);
  }

  if (
    questionId === "dota2-senate" &&
    language === "cpp" &&
    !/\bint\s+main\s*\(/.test(sourceCode)
  ) {
    return `${sourceCode}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string senate;
    cin >> senate;

    cout << predictPartyVictory(senate);
    return 0;
}`;
  }

  if (
    questionId === "design-circular-queue" &&
    language === "cpp" &&
    !/\bint\s+main\s*\(/.test(sourceCode)
  ) {
    return `#include <bits/stdc++.h>
using namespace std;

${sourceCode}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int capacity, operationCount;
    cin >> capacity >> operationCount;
    MyCircularQueue queue(capacity);

    for (int index = 0; index < operationCount; index++) {
        string operation;
        cin >> operation;

        if (index > 0) cout << "\\n";

        if (operation == "enQueue") {
            int value;
            cin >> value;
            cout << boolalpha << queue.enQueue(value);
        } else if (operation == "deQueue") {
            cout << boolalpha << queue.deQueue();
        } else if (operation == "Front") {
            cout << queue.Front();
        } else if (operation == "Rear") {
            cout << queue.Rear();
        } else if (operation == "isEmpty") {
            cout << boolalpha << queue.isEmpty();
        } else if (operation == "isFull") {
            cout << boolalpha << queue.isFull();
        }
    }

    return 0;
}`;
  }

  if (
    questionId === "merge-intervals" &&
    language === "cpp" &&
    /\bclass\s+Solution\b/.test(sourceCode) &&
    !/\bint\s+main\s*\(/.test(sourceCode)
  ) {
    return `${sourceCode}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int intervalCount;
    cin >> intervalCount;
    vector<vector<int>> intervals(
        intervalCount,
        vector<int>(2)
    );

    for (auto& interval : intervals) {
        cin >> interval[0] >> interval[1];
    }

    Solution solution;
    const vector<vector<int>> merged =
        solution.merge(intervals);

    for (size_t index = 0; index < merged.size(); index++) {
        if (index > 0) cout << "\\n";
        cout << merged[index][0] << " " << merged[index][1];
    }

    return 0;
}`;
  }

  if (
    language !== "cpp"
  ) {
    return sourceCode;
  }

  if (/\bint\s+main\s*\(/.test(sourceCode)) {
    return sourceCode;
  }

  const problem = getProblemById(questionId);
  const catalogQuestion = getCatalogQuestionById(questionId);

  if (
    !/\bclass\s+Solution\b/.test(sourceCode)
  ) {
    sourceCode = `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
${sourceCode}
};`;
  }

  if (questionId === "two-sum") {
    return `${sourceCode}

int main() {
    int n;
    cin >> n;

    vector<int> nums(n);

    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }

    int target;
    cin >> target;

    Solution solution;
    vector<int> answer = solution.twoSum(nums, target);

    for (int i = 0; i < static_cast<int>(answer.size()); i++) {
        if (i > 0) {
            cout << " ";
        }

        cout << answer[i];
    }

    return 0;
}`;
  }

  if (questionId === "best-time-to-buy-stock") {
    return `${sourceCode}

int main() {
    int n;
    cin >> n;

    vector<int> prices(n);

    for (int i = 0; i < n; i++) {
        cin >> prices[i];
    }

    Solution solution;
    cout << solution.maxProfit(prices);

    return 0;
}`;
  }

  if (questionId === "alien-dictionary") {
    return `${sourceCode}

int main() {
    int n;
    cin >> n;

    vector<string> words(n);

    for (int i = 0; i < n; i++) {
        cin >> words[i];
    }

    Solution solution;
    cout << solution.alienOrder(words);

    return 0;
}`;
  }

  if (questionId === "minimum-cost-to-connect-all-points") {
    return `${sourceCode}

int main() {
    int n;

    if (!(cin >> n) || n < 0) {
        return 0;
    }

    vector<vector<int>> points(n, vector<int>(2));

    for (int i = 0; i < n; i++) {
        if (!(cin >> points[i][0] >> points[i][1])) {
            return 0;
        }
    }

    Solution solution;
    cout << solution.minCostConnectPoints(points);

    return 0;
}`;
  }

  if (questionId === "critical-connections") {
    return `${sourceCode}

int main() {
    int n, m;
    if (!(cin >> n >> m) || n < 0 || m < 0) return 0;

    vector<vector<int>> connections(m, vector<int>(2));
    for (int i = 0; i < m; i++) {
        if (!(cin >> connections[i][0] >> connections[i][1])) return 0;
    }

    Solution solution;
    vector<vector<int>> answer = solution.criticalConnections(n, connections);

    for (auto& edge : answer) {
        if (edge.size() >= 2 && edge[0] > edge[1]) swap(edge[0], edge[1]);
    }
    sort(answer.begin(), answer.end());

    cout << answer.size();
    for (const auto& edge : answer) {
        if (edge.size() >= 2) cout << "\\n" << edge[0] << " " << edge[1];
    }
    return 0;
}`;
  }

  if (questionId === "course-schedule-ii") {
    return `${sourceCode}

int main() {
    int n, m;
    if (!(cin >> n >> m) || n < 0 || m < 0) return 0;

    vector<vector<int>> prerequisites(m, vector<int>(2));
    for (int i = 0; i < m; i++) {
        if (!(cin >> prerequisites[i][0] >> prerequisites[i][1])) return 0;
    }

    Solution solution;
    vector<int> order = solution.findOrder(n, prerequisites);
    for (int i = 0; i < static_cast<int>(order.size()); i++) {
        if (i > 0) cout << " ";
        cout << order[i];
    }
    return 0;
}`;
  }

  if (questionId === "clone-graph") {
    return `${sourceCode}

int main() {
    int n;
    if (!(cin >> n) || n < 0) return 0;
    if (n == 0) {
        cout << 0;
        return 0;
    }

    vector<Node*> nodes(n);
    for (int i = 0; i < n; i++) nodes[i] = new Node(i + 1);

    for (int i = 0; i < n; i++) {
        int degree;
        cin >> degree;
        for (int j = 0; j < degree; j++) {
            int neighbor;
            cin >> neighbor;
            if (neighbor >= 1 && neighbor <= n) nodes[i]->neighbors.push_back(nodes[neighbor - 1]);
        }
    }

    Solution solution;
    Node* clone = solution.cloneGraph(nodes[0]);
    if (clone == nullptr) {
        cout << 0;
        return 0;
    }

    vector<Node*> cloned(n, nullptr);
    queue<Node*> pending;
    pending.push(clone);
    cloned[clone->val - 1] = clone;
    while (!pending.empty()) {
        Node* current = pending.front();
        pending.pop();
        for (Node* neighbor : current->neighbors) {
            if (neighbor && neighbor->val >= 1 && neighbor->val <= n && !cloned[neighbor->val - 1]) {
                cloned[neighbor->val - 1] = neighbor;
                pending.push(neighbor);
            }
        }
    }

    cout << n;
    for (Node* node : cloned) {
        vector<int> neighbors;
        if (node) for (Node* neighbor : node->neighbors) neighbors.push_back(neighbor->val);
        sort(neighbors.begin(), neighbors.end());
        cout << "\\n" << neighbors.size();
        for (int value : neighbors) cout << " " << value;
    }
    return 0;
}`;
  }

  const genericCppSource = buildGenericCppSource(
    sourceCode,
    catalogQuestion || problem
  );
  if (genericCppSource) return genericCppSource;

  if (problem?.cppDriver) {
    const solutionSource = /\bclass\s+Solution\b/.test(sourceCode)
      ? sourceCode
      : `class Solution {\npublic:\n${sourceCode}\n};`;

    return `#include <bits/stdc++.h>
using namespace std;
${problem.cppPrelude || ""}
${solutionSource}
${problem.cppDriver}`;
  }

  return sourceCode;
};

const saveSubmission = async ({
  shouldSave,
  userId,
  questionId,
  questionTitle,
  topic,
  difficulty,
  company,
  language,
  sourceCode,
  status,
  accepted,
  passedTestCases,
  totalTestCases,
  failedTestCase = null,
  executionTime = 0,
  memory = 0,
}) => {
  if (!shouldSave) {
    return null;
  }

  const metadata =
    getProblemById(questionId) || {};

  try {
    return await CodeSubmission.create({
      userId,
      questionId,
      questionTitle:
        questionTitle ||
        metadata.title ||
        questionId,
      topic:
        topic ||
        metadata.topic ||
        "General",
      difficulty:
        difficulty ||
        metadata.difficulty ||
        "Easy",
      company:
        company ||
        metadata.companies?.[0] ||
        "General",
      language,
      sourceCode,
      status,
      accepted,
      passedTestCases,
      totalTestCases,
      failedTestCase,
      executionTime,
      memory,
    });
  } catch (error) {
    console.error(
      "Failed to save code submission:",
      error.message
    );

    throw new Error(
      `Unable to save submission history: ${error.message}`
    );
  }
};

export const submitCode = async (req, res) => {
  try {
    const {
      userId,
      sourceCode,
      language,
      questionId: receivedQuestionId,
      questionTitle,
      topic,
      difficulty,
      company,
      contestId = null,
      saveSubmission: shouldSave = true,
    } = req.body;

    const questionId =
      receivedQuestionId === "first-unique-character-stream"
        ? "first-unique-number-in-a-stream"
        : receivedQuestionId;

    if (!sourceCode || !sourceCode.trim()) {
      return res.status(400).json({
        success: false,
        message: "Source code is required",
      });
    }

    if (!language) {
      return res.status(400).json({
        success: false,
        message:
          "Programming language is required",
      });
    }

    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "Question ID is required",
      });
    }

    if (shouldSave && !userId) {
      return res.status(401).json({
        success: false,
        message:
          "Please log in before submitting your solution",
      });
    }

    const problem = getProblemById(questionId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found.",
      });
    }

    const testcaseManifest =
      getTestcaseManifest(questionId);

    const testCases = testcaseManifest
      ? getManifestTestCases(testcaseManifest)
      : getTestCasesByProblemId(questionId);

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No test cases configured for questionId: ${questionId}`,
      });
    }

    console.log("================================");
    console.log("Received questionId:", questionId);
    console.log("Available question IDs:", Object.keys(problemTestCases));
    console.log("Selected test cases:", testCases);
    console.log("Submitted language:", language);
    console.log("================================");

    const testResults = [];

    let totalExecutionTime = 0;
    let maximumMemory = 0;

    for (
      let index = 0;
      index < testCases.length;
      index += 1
    ) {
      const testCase = testCases[index];

      const executableSourceCode =
        prepareSourceCode({
          sourceCode,
          language,
          questionId,
          manifest: testcaseManifest,
          input: testCase.input,
        });

      const executionResult =
        await executeCode({
          sourceCode:
            executableSourceCode,
          language,
          stdin:
            typeof testCase.input === "string"
              ? testCase.input
              : "",
        });

      const actualOutput =
        normalizeOutput(
          executionResult.stdout
        );

      const expectedOutput =
        normalizeOutput(
          testCase.expectedOutput
        );

      const passed =
        executionResult.status ===
          "Accepted" &&
        actualOutput === expectedOutput;

      const executionTime =
        Number(executionResult.time) || 0;

      const memory =
        Number(executionResult.memory) || 0;

      totalExecutionTime +=
        executionTime;

      maximumMemory = Math.max(
        maximumMemory,
        memory
      );

      testResults.push({
        testCaseNumber: index + 1,
        passed,

        status: passed
          ? "Passed"
          : executionResult.status ===
              "Accepted"
            ? "Wrong Answer"
            : executionResult.status,

        input:
          index === 0
            ? testCase.input
            : undefined,

        expectedOutput:
          index === 0
            ? expectedOutput
            : undefined,

        actualOutput:
          index === 0
            ? actualOutput
            : undefined,

        stderr:
          executionResult.stderr,

        compileOutput:
          executionResult.compileOutput,

        time: executionResult.time,
        memory: executionResult.memory,
      });

      const passedCount =
        testResults.filter(
          (result) => result.passed
        ).length;

      const formattedExecutionTime =
        Number(
          totalExecutionTime.toFixed(3)
        );

      /*
       * Compilation error, runtime error,
       * time limit exceeded, etc.
       */
      if (
        executionResult.status !==
        "Accepted"
      ) {
        const savedSubmission = await saveSubmission({
          shouldSave,
          userId,
          questionId,
          questionTitle,
          topic,
          difficulty,
          company,
          language,
          sourceCode,
          status:
            executionResult.status ||
            "Execution Error",
          accepted: false,
          passedTestCases: passedCount,
          totalTestCases:
            testCases.length,
          failedTestCase: index + 1,
          executionTime:
            formattedExecutionTime,
          memory: maximumMemory,
        });

        return res.status(200).json({
          success: true,
          accepted: false,
          submissionSaved: Boolean(savedSubmission),
          submissionId: savedSubmission?._id || null,

          status:
            executionResult.status ||
            "Execution Error",

          passedTestCases:
            passedCount,

          totalTestCases:
            testCases.length,

          failedTestCase:
            index + 1,

          executionTime:
            formattedExecutionTime,

          memory: maximumMemory,

          stderr:
            executionResult.stderr,

          compileOutput:
            executionResult.compileOutput,

          message:
            executionResult.compileOutput ||
            executionResult.stderr ||
            executionResult.message ||
            executionResult.status ||
            "Code execution failed",

          testResults,
        });
      }

      /*
       * Wrong answer
       */
      if (!passed) {
        const savedSubmission = await saveSubmission({
          shouldSave,
          userId,
          questionId,
          questionTitle,
          topic,
          difficulty,
          company,
          language,
          sourceCode,
          status: "Wrong Answer",
          accepted: false,
          passedTestCases: passedCount,
          totalTestCases:
            testCases.length,
          failedTestCase: index + 1,
          executionTime:
            formattedExecutionTime,
          memory: maximumMemory,
        });

        return res.status(200).json({
          success: true,
          accepted: false,
          submissionSaved: Boolean(savedSubmission),
          submissionId: savedSubmission?._id || null,
          status: "Wrong Answer",

          passedTestCases:
            passedCount,

          totalTestCases:
            testCases.length,

          failedTestCase:
            index + 1,

          executionTime:
            formattedExecutionTime,

          memory: maximumMemory,

          message: `Wrong answer on hidden test case ${
            index + 1
          }`,

          testResults,
        });
      }
    }

    const finalExecutionTime =
      Number(
        totalExecutionTime.toFixed(3)
      );

    const savedSubmission = await saveSubmission({
      shouldSave,
      userId,
      questionId,
      questionTitle,
      topic,
      difficulty,
      company,
      language,
      sourceCode,
      status: "Accepted",
      accepted: true,
      passedTestCases:
        testCases.length,
      totalTestCases:
        testCases.length,
      executionTime:
        finalExecutionTime,
      memory: maximumMemory,
    });

    return res.status(200).json({
      success: true,
      accepted: true,
      submissionSaved: Boolean(savedSubmission),
      submissionId: savedSubmission?._id || null,
      status: "Accepted",
      questionId,
      title: problem.title,
      contestId,
      pointsEarned: problem.points || 0,

      passedTestCases:
        testCases.length,

      totalTestCases:
        testCases.length,

      executionTime:
        finalExecutionTime,

      memory: maximumMemory,

      message: `All ${testCases.length} test cases passed`,

      testResults,
    });
  } catch (error) {
    console.error(
      "Code submission error:",
      error.response?.data ||
        error.message
    );

    return res
      .status(error.statusCode || 500)
      .json({
        success: false,
        message:
          error.message ||
          "Code submission failed",
      });
  }
};
