import {
  additionalProblemTestCases,
} from "./additionalProblems.js";
import {
  catalogProblemTestCases,
} from "./questionCatalog.js";

export const problemTestCases = {
  ...catalogProblemTestCases,
  "two-sum": [
    {
      input: `4
2 7 11 15
9`,
      expectedOutput: "0 1",
    },
    {
      input: `3
3 2 4
6`,
      expectedOutput: "1 2",
    },
    {
      input: `2
3 3
6`,
      expectedOutput: "0 1",
    },
    {
      input: `5
1 5 3 7 9
12`,
      expectedOutput: "1 3",
    },
    {
      input: `4
-3 4 3 90
0`,
      expectedOutput: "0 2",
    },
  ],

  "dota2-senate": [
    {
      input: "RD\n",
      expectedOutput: "Radiant",
    },
    {
      input: "RDD\n",
      expectedOutput: "Dire",
    },
    {
      input: "DDRRR\n",
      expectedOutput: "Dire",
    },
    {
      input: "RRDDD\n",
      expectedOutput: "Radiant",
    },
    {
      input: "DRRDRDR\n",
      expectedOutput: "Radiant",
    },
  ],

  "first-unique-number-in-a-stream": [
    {
      input: "aabc\n",
      expectedOutput: "a#bb",
    },
    {
      input: "zz\n",
      expectedOutput: "z#",
    },
    {
      input: "abcabc\n",
      expectedOutput: "aaabc#",
    },
  ],

  "best-time-to-buy-stock": [
    {
      input: `6
7 1 5 3 6 4`,
      expectedOutput: "5",
    },
    {
      input: `5
7 6 4 3 1`,
      expectedOutput: "0",
    },
    {
      input: `2
1 2`,
      expectedOutput: "1",
    },
    {
      input: `1
5`,
      expectedOutput: "0",
    },
    {
      input: `7
3 2 6 5 0 3 8`,
      expectedOutput: "8",
    },
  ],

  "merge-intervals": [
    {
      input: `4
1 3
2 6
8 10
15 18`,
      expectedOutput: `1 6
8 10
15 18`,
    },
    {
      input: `2
1 4
4 5`,
      expectedOutput: "1 5",
    },
    {
      input: `3
1 4
0 2
3 5`,
      expectedOutput: "0 5",
    },
    {
      input: `4
1 2
3 4
5 6
7 8`,
      expectedOutput: `1 2
3 4
5 6
7 8`,
    },
    {
      input: `5
1 10
2 3
4 8
11 15
14 20`,
      expectedOutput: `1 10
11 20`,
    },
  ],

  "number-of-islands": [
    {
      input: `4 5
1 1 1 1 0
1 1 0 1 0
1 1 0 0 0
0 0 0 0 0`,
      expectedOutput: "1",
    },
    {
      input: `4 5
1 1 0 0 0
1 1 0 0 0
0 0 1 0 0
0 0 0 1 1`,
      expectedOutput: "3",
    },
    {
      input: `3 3
0 0 0
0 0 0
0 0 0`,
      expectedOutput: "0",
    },
    {
      input: `3 3
1 1 1
1 1 1
1 1 1`,
      expectedOutput: "1",
    },
    {
      input: `3 3
1 0 1
0 1 0
1 0 1`,
      expectedOutput: "5",
    },
  ],

  "lru-cache": [
    {
      input: `2 6
put 1 1
put 2 2
get 1
put 3 3
get 2
get 3`,
      expectedOutput: `1
-1
3`,
    },
    {
      input: `1 5
put 1 10
get 1
put 2 20
get 1
get 2`,
      expectedOutput: `10
-1
20`,
    },
    {
      input: `2 7
put 1 1
put 2 2
put 1 10
get 1
put 3 3
get 2
get 3`,
      expectedOutput: `10
-1
3`,
    },
    {
      input: `3 8
put 1 1
put 2 2
put 3 3
get 1
put 4 4
get 2
get 3
get 4`,
      expectedOutput: `1
-1
3
4`,
    },
    {
      input: `2 8
get 5
put 1 100
put 2 200
get 1
put 3 300
get 2
get 1
get 3`,
      expectedOutput: `-1
100
-1
100
300`,
    },
  ],
  ...additionalProblemTestCases,
};

export const getTestCasesByProblemId = (problemId) => {
  return problemTestCases[problemId] || [];
};
