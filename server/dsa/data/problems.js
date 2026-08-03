import { additionalProblems } from "./additionalProblems.js";
import { catalogProblems } from "./questionCatalog.js";

export const problems = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    points: 100,
    topic: "Arrays",
    companies: ["Amazon", "Google", "Microsoft"],

    description:
      "Given an array of integers nums and an integer target, return the indices of two numbers whose sum equals target. You may not use the same array element twice.",

    inputFormat: [
      "The first line contains an integer n.",
      "The second line contains n integers.",
      "The third line contains the target value.",
    ],

    outputFormat:
      "Print the two zero-based indices separated by a space.",

    constraints: [
      "2 <= n <= 100000",
      "-1000000000 <= nums[i] <= 1000000000",
      "-1000000000 <= target <= 1000000000",
      "Exactly one valid answer exists.",
    ],

    examples: [
      {
        input: `4
2 7 11 15
9`,
        output: "0 1",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9.",
      },
    ],

    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;

    vector<int> nums(n);

    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }

    int target;
    cin >> target;

    // Write your solution here

    return 0;
}`,

      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int n = scanner.nextInt();
        int[] nums = new int[n];

        for (int i = 0; i < n; i++) {
            nums[i] = scanner.nextInt();
        }

        int target = scanner.nextInt();

        // Write your solution here
    }
}`,

      python: `n = int(input())
nums = list(map(int, input().split()))
target = int(input())

# Write your solution here
`,

      javascript: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
let index = 0;

const n = Number(input[index++]);
const nums = [];

for (let i = 0; i < n; i++) {
  nums.push(Number(input[index++]));
}

const target = Number(input[index++]);

// Write your solution here
`,
    },
  },

  {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    points: 100,
    topic: "Arrays",
    companies: ["Google", "Amazon", "Microsoft", "Adobe"],

    description:
      "Given an array of intervals, merge all overlapping intervals and return the resulting non-overlapping intervals.",

    inputFormat: [
      "The first line contains an integer n.",
      "The next n lines contain two integers start and end.",
    ],

    outputFormat:
      "Print every merged interval on a new line as: start end.",

    constraints: [
      "1 <= n <= 100000",
      "0 <= start <= end <= 1000000000",
    ],

    examples: [
      {
        input: `4
1 3
2 6
8 10
15 18`,
        output: `1 6
8 10
15 18`,
        explanation:
          "Intervals [1,3] and [2,6] overlap, so they are merged into [1,6].",
      },
    ],

    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;

    vector<pair<int, int>> intervals(n);

    for (int i = 0; i < n; i++) {
        cin >> intervals[i].first >> intervals[i].second;
    }

    // Write your solution here

    return 0;
}`,

      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int n = scanner.nextInt();
        int[][] intervals = new int[n][2];

        for (int i = 0; i < n; i++) {
            intervals[i][0] = scanner.nextInt();
            intervals[i][1] = scanner.nextInt();
        }

        // Write your solution here
    }
}`,

      python: `n = int(input())
intervals = []

for _ in range(n):
    start, end = map(int, input().split())
    intervals.append([start, end])

# Write your solution here
`,

      javascript: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
let index = 0;

const n = Number(input[index++]);
const intervals = [];

for (let i = 0; i < n; i++) {
  const start = Number(input[index++]);
  const end = Number(input[index++]);

  intervals.push([start, end]);
}

// Write your solution here
`,
    },
  },

  {
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    points: 100,
    topic: "Graphs",
    companies: ["Amazon", "Google", "Microsoft"],

    description:
      "Given a grid containing '1' for land and '0' for water, return the number of islands. Land cells are connected horizontally and vertically.",

    inputFormat: [
      "The first line contains rows n and columns m.",
      "The next n lines contain m grid values.",
    ],

    outputFormat: "Print the total number of islands.",

    constraints: [
      "1 <= n, m <= 500",
      "grid[i][j] is either 0 or 1",
    ],

    examples: [
      {
        input: `4 5
1 1 1 1 0
1 1 0 1 0
1 1 0 0 0
0 0 0 0 0`,
        output: "1",
        explanation: "All land cells belong to one connected island.",
      },
    ],

    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;

    vector<vector<char>> grid(n, vector<char>(m));

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> grid[i][j];
        }
    }

    // Write your solution here

    return 0;
}`,

      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int n = scanner.nextInt();
        int m = scanner.nextInt();

        char[][] grid = new char[n][m];

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                grid[i][j] = scanner.next().charAt(0);
            }
        }

        // Write your solution here
    }
}`,

      python: `n, m = map(int, input().split())
grid = []

for _ in range(n):
    grid.append(input().split())

# Write your solution here
`,

      javascript: `const fs = require("fs");

const input = fs.readFileSync(0, "utf8").trim().split(/\\s+/);
let index = 0;

const n = Number(input[index++]);
const m = Number(input[index++]);

const grid = [];

for (let i = 0; i < n; i++) {
  const row = [];

  for (let j = 0; j < m; j++) {
    row.push(input[index++]);
  }

  grid.push(row);
}

// Write your solution here
`,
    },
  },

  {
    id: "lru-cache",
    title: "LRU Cache",
    difficulty: "Hard",
    points: 100,
    topic: "Design",
    companies: ["Google", "Amazon", "Microsoft", "Adobe"],

    description:
      "Design a Least Recently Used cache supporting get and put operations in average O(1) time.",

    inputFormat: [
      "The first line contains capacity and number of operations.",
      "Each following line contains either get key or put key value.",
    ],

    outputFormat:
      "For every get operation, print the returned value on a new line. Print -1 when the key does not exist.",

    constraints: [
      "1 <= capacity <= 10000",
      "1 <= operations <= 100000",
      "0 <= key, value <= 1000000000",
    ],

    examples: [
      {
        input: `2 6
put 1 1
put 2 2
get 1
put 3 3
get 2
get 3`,
        output: `1
-1
3`,
        explanation:
          "Key 2 is removed after inserting key 3 because key 2 is the least recently used.",
      },
    ],

    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

class LRUCache {
public:
    LRUCache(int capacity) {
        // Initialize cache
    }

    int get(int key) {
        // Write your solution
        return -1;
    }

    void put(int key, int value) {
        // Write your solution
    }
};

int main() {
    int capacity, operations;
    cin >> capacity >> operations;

    LRUCache cache(capacity);

    while (operations--) {
        string operation;
        cin >> operation;

        if (operation == "get") {
            int key;
            cin >> key;

            cout << cache.get(key) << "\\n";
        } else {
            int key, value;
            cin >> key >> value;

            cache.put(key, value);
        }
    }

    return 0;
}`,

      java: `import java.util.*;

class LRUCache {
    public LRUCache(int capacity) {
        // Initialize cache
    }

    public int get(int key) {
        return -1;
    }

    public void put(int key, int value) {
        // Write your solution
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int capacity = scanner.nextInt();
        int operations = scanner.nextInt();

        LRUCache cache = new LRUCache(capacity);

        while (operations-- > 0) {
            String operation = scanner.next();

            if (operation.equals("get")) {
                int key = scanner.nextInt();
                System.out.println(cache.get(key));
            } else {
                int key = scanner.nextInt();
                int value = scanner.nextInt();

                cache.put(key, value);
            }
        }
    }
}`,

      python: `class LRUCache:
    def __init__(self, capacity):
        # Initialize cache
        pass

    def get(self, key):
        # Write your solution
        return -1

    def put(self, key, value):
        # Write your solution
        pass


capacity, operations = map(int, input().split())
cache = LRUCache(capacity)

for _ in range(operations):
    command = input().split()

    if command[0] == "get":
        print(cache.get(int(command[1])))
    else:
        cache.put(int(command[1]), int(command[2]))
`,

      javascript: `const fs = require("fs");

class LRUCache {
  constructor(capacity) {
    // Initialize cache
  }

  get(key) {
    // Write your solution
    return -1;
  }

  put(key, value) {
    // Write your solution
  }
}

const lines = fs
  .readFileSync(0, "utf8")
  .trim()
  .split("\\n");

const [capacity, operations] = lines[0]
  .trim()
  .split(/\\s+/)
  .map(Number);

const cache = new LRUCache(capacity);
const output = [];

for (let i = 1; i <= operations; i++) {
  const command = lines[i].trim().split(/\\s+/);

  if (command[0] === "get") {
    output.push(cache.get(Number(command[1])));
  } else {
    cache.put(Number(command[1]), Number(command[2]));
  }
}

console.log(output.join("\\n"));
`,
    },
  },

  {
    id: "best-time-to-buy-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    points: 100,
    topic: "Arrays",
    companies: ["Amazon", "Google", "Microsoft"],

    description:
      "Given an array prices where prices[i] is the price of a stock on day i, return the maximum profit from one buy followed by one sell. Return 0 when no profit is possible.",

    inputFormat: [
      "The first line contains the number of days n.",
      "The second line contains n stock prices.",
    ],

    outputFormat:
      "Print the maximum profit obtainable from one transaction.",

    constraints: [
      "1 <= n <= 100000",
      "0 <= prices[i] <= 10000",
    ],

    examples: [
      {
        input: `6
7 1 5 3 6 4`,
        output: "5",
        explanation:
          "Buy at price 1 and sell later at price 6.",
      },
    ],

    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Write your solution here
        return 0;
    }
};`,
    },
  },
  ...additionalProblems,
  ...catalogProblems.filter(
    (catalogProblem) =>
      !additionalProblems.some(
        (problem) => problem.id === catalogProblem.id
      )
  ),
];

export const getProblemById = (problemId) => {
  return problems.find((problem) => problem.id === problemId);
};
