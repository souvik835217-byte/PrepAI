import test from "node:test";
import assert from "node:assert/strict";

import {
  validateAlienDictionary,
  validateCloneGraphStructure,
  validateCourseScheduleOrder,
  validateOutput,
} from "./outputValidation.service.js";

test("Alien Dictionary accepts any valid precedence order", () => {
  const input = "5\nwrt\nwrf\ner\nett\nrftt";
  assert.equal(validateAlienDictionary({ input, actualOutput: "wertf" }), true);
  assert.equal(validateAlienDictionary({ input, actualOutput: "wfter" }), false);
  assert.equal(validateAlienDictionary({ input, actualOutput: "wert" }), false);
});

test("Alien Dictionary accepts empty output for an impossible prefix ordering", () => {
  assert.equal(
    validateAlienDictionary({ input: "2\nabc\nab", actualOutput: "" }),
    true
  );
});

test("Alien Dictionary accepts empty output when precedence rules contain a cycle", () => {
  assert.equal(
    validateAlienDictionary({ input: "3\nz\nx\nz", actualOutput: "" }),
    true
  );
  assert.equal(
    validateAlienDictionary({ input: "3\nz\nx\nz", actualOutput: "zx" }),
    false
  );
});

test("Course Schedule II accepts different valid topological orders", () => {
  const input = "4 4\n1 0\n2 0\n3 1\n3 2";
  assert.equal(validateCourseScheduleOrder({ input, actualOutput: "0 1 2 3" }), true);
  assert.equal(validateCourseScheduleOrder({ input, actualOutput: "0 2 1 3" }), true);
  assert.equal(validateCourseScheduleOrder({ input, actualOutput: "1 0 2 3" }), false);
});

test("Clone Graph compares adjacency structure independent of neighbor order", () => {
  const input = "4\n2 2 4\n2 1 3\n2 2 4\n2 1 3";
  assert.equal(
    validateCloneGraphStructure({
      input,
      actualOutput: "4\n2 4 2\n2 3 1\n2 4 2\n2 3 1",
    }),
    true
  );
  assert.equal(
    validateCloneGraphStructure({ input, actualOutput: "4\n1 2\n2 1 3\n2 2 4\n2 1 3" }),
    false
  );
});

test("deterministic questions continue to use normalized exact comparison", () => {
  assert.equal(
    validateOutput({
      questionId: "two-sum",
      input: "4\n2 7 11 15\n9",
      actualOutput: "0   1\n",
      expectedOutput: "0   1",
    }),
    true
  );
});
