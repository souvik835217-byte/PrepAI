const normalizeOutput = (value = "") =>
  String(value)
    .replace(/\r\n/g, "\n")
    .trim();

const parseIntegers = (value) =>
  normalizeOutput(value).match(/-?\d+/g)?.map(Number) || [];

const parseAlienWords = (input) => {
  const lines = normalizeOutput(input)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const count = Number(lines[0]);
  return Number.isInteger(count) ? lines.slice(1, count + 1) : [];
};

const validateAlienDictionary = ({ input, actualOutput }) => {
  const words = parseAlienWords(input);
  if (words.length === 0) return false;

  const characters = new Set(words.join(""));
  const edges = [];
  let impossible = false;

  for (let index = 0; index + 1 < words.length; index += 1) {
    const first = words[index];
    const second = words[index + 1];
    const length = Math.min(first.length, second.length);
    let mismatchFound = false;

    for (let characterIndex = 0; characterIndex < length; characterIndex += 1) {
      if (first[characterIndex] !== second[characterIndex]) {
        edges.push([first[characterIndex], second[characterIndex]]);
        mismatchFound = true;
        break;
      }
    }

    if (!mismatchFound && first.length > second.length) impossible = true;
  }

  const adjacency = new Map([...characters].map((character) => [character, new Set()]));
  const indegree = new Map([...characters].map((character) => [character, 0]));
  for (const [before, after] of edges) {
    if (!adjacency.get(before).has(after)) {
      adjacency.get(before).add(after);
      indegree.set(after, indegree.get(after) + 1);
    }
  }

  const queue = [...characters].filter((character) => indegree.get(character) === 0);
  let visitedCount = 0;
  for (let index = 0; index < queue.length; index += 1) {
    const character = queue[index];
    visitedCount += 1;
    for (const neighbor of adjacency.get(character)) {
      indegree.set(neighbor, indegree.get(neighbor) - 1);
      if (indegree.get(neighbor) === 0) queue.push(neighbor);
    }
  }
  if (visitedCount !== characters.size) impossible = true;

  const order = normalizeOutput(actualOutput).replace(/\s+/g, "");
  if (impossible) return order.length === 0;
  if (order.length !== characters.size) return false;
  if (new Set(order).size !== characters.size) return false;
  if ([...order].some((character) => !characters.has(character))) return false;

  const position = new Map([...order].map((character, index) => [character, index]));
  return edges.every(([before, after]) => position.get(before) < position.get(after));
};

const parseCourseSchedule = (input) => {
  const values = parseIntegers(input);
  if (values.length < 2) return null;
  const [courseCount, prerequisiteCount] = values;
  const prerequisites = [];
  for (let index = 0; index < prerequisiteCount; index += 1) {
    const offset = 2 + index * 2;
    if (offset + 1 >= values.length) return null;
    prerequisites.push([values[offset], values[offset + 1]]);
  }
  return { courseCount, prerequisites };
};

const validateCourseScheduleOrder = ({ input, actualOutput }) => {
  const problem = parseCourseSchedule(input);
  if (!problem) return false;

  const order = parseIntegers(actualOutput);
  if (order.length !== problem.courseCount) return false;
  if (new Set(order).size !== problem.courseCount) return false;
  if (order.some((course) => course < 0 || course >= problem.courseCount)) return false;

  const position = new Map(order.map((course, index) => [course, index]));
  return problem.prerequisites.every(
    ([course, prerequisite]) => position.get(prerequisite) < position.get(course)
  );
};

const parseAdjacencyList = (value) => {
  const normalized = normalizeOutput(value)
    .replace(/^adjList\s*=\s*/i, "")
    .replace(/'/g, '"');
  try {
    const parsed = JSON.parse(normalized);
    if (!Array.isArray(parsed) || parsed.some((neighbors) => !Array.isArray(neighbors))) {
      return null;
    }
    return parsed.map((neighbors) => [...neighbors].map(Number).sort((a, b) => a - b));
  } catch {
    const lines = normalized.split("\n").map((line) => line.trim()).filter(Boolean);
    const nodeCount = Number(lines[0]);
    if (!Number.isInteger(nodeCount) || lines.length !== nodeCount + 1) return null;
    const adjacency = [];
    for (let index = 0; index < nodeCount; index += 1) {
      const values = parseIntegers(lines[index + 1]);
      const degree = values[0];
      if (!Number.isInteger(degree) || values.length !== degree + 1) return null;
      adjacency.push(values.slice(1).sort((a, b) => a - b));
    }
    return adjacency;
  }
};

const validateCloneGraphStructure = ({ input, actualOutput }) => {
  const source = parseAdjacencyList(input);
  const clone = parseAdjacencyList(actualOutput);
  if (!source || !clone || source.length !== clone.length) return false;
  return source.every(
    (neighbors, index) =>
      neighbors.length === clone[index].length &&
      neighbors.every((neighbor, neighborIndex) => neighbor === clone[index][neighborIndex])
  );
};

const semanticValidators = {
  "alien-dictionary": validateAlienDictionary,
  "course-schedule-ii": validateCourseScheduleOrder,
  "clone-graph": validateCloneGraphStructure,
};

export const validateOutput = ({ questionId, input, actualOutput, expectedOutput }) => {
  const validator = semanticValidators[questionId];
  if (validator) return validator({ input, actualOutput, expectedOutput });
  return normalizeOutput(actualOutput) === normalizeOutput(expectedOutput);
};

export { validateAlienDictionary, validateCourseScheduleOrder, validateCloneGraphStructure };
