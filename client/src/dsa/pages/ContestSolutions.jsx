import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiCode,
  FiDatabase,
} from "react-icons/fi";

const solutions = [
  {
    label: "A",
    title: "Two Sum",
    approach:
      "Store each previously visited value and its index in a hash map. For every number, check whether its complement is already present.",
    time: "O(n)",
    space: "O(n)",
    code: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> indexByValue;

    for (int index = 0; index < nums.size(); index++) {
        int complement = target - nums[index];
        if (indexByValue.count(complement)) {
            return {indexByValue[complement], index};
        }
        indexByValue[nums[index]] = index;
    }

    return {};
}`,
  },
  {
    label: "B",
    title: "Merge Intervals",
    approach:
      "Sort intervals by their start value. Extend the most recent merged interval whenever the next interval overlaps it.",
    time: "O(n log n)",
    space: "O(n)",
    code: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged;

    for (const auto& interval : intervals) {
        if (merged.empty() || merged.back()[1] < interval[0]) {
            merged.push_back(interval);
        } else {
            merged.back()[1] = max(merged.back()[1], interval[1]);
        }
    }

    return merged;
}`,
  },
  {
    label: "C",
    title: "Number of Islands",
    approach:
      "Scan the grid. On every unvisited land cell, increment the answer and flood-fill its complete connected component.",
    time: "O(rows × columns)",
    space: "O(rows × columns)",
    code: `class Solution {
    void visit(vector<vector<char>>& grid, int row, int column) {
        if (row < 0 || column < 0 ||
            row >= grid.size() || column >= grid[0].size() ||
            grid[row][column] != '1') return;

        grid[row][column] = '0';
        visit(grid, row + 1, column);
        visit(grid, row - 1, column);
        visit(grid, row, column + 1);
        visit(grid, row, column - 1);
    }

public:
    int numIslands(vector<vector<char>>& grid) {
        int islands = 0;
        for (int row = 0; row < grid.size(); row++) {
            for (int column = 0; column < grid[0].size(); column++) {
                if (grid[row][column] == '1') {
                    islands++;
                    visit(grid, row, column);
                }
            }
        }
        return islands;
    }
};`,
  },
  {
    label: "D",
    title: "LRU Cache",
    approach:
      "Combine a doubly linked list for recency order with a hash map for constant-time key lookup. Move accessed keys to the front and evict from the back.",
    time: "O(1) per operation",
    space: "O(capacity)",
    code: `class LRUCache {
    int capacity;
    list<pair<int, int>> entries;
    unordered_map<int, list<pair<int, int>>::iterator> location;

public:
    LRUCache(int capacity) : capacity(capacity) {}

    int get(int key) {
        if (!location.count(key)) return -1;
        entries.splice(entries.begin(), entries, location[key]);
        return location[key]->second;
    }

    void put(int key, int value) {
        if (location.count(key)) {
            location[key]->second = value;
            entries.splice(entries.begin(), entries, location[key]);
            return;
        }

        entries.push_front({key, value});
        location[key] = entries.begin();

        if (entries.size() > capacity) {
            location.erase(entries.back().first);
            entries.pop_back();
        }
    }
};`,
  },
];

const ContestSolutions = () => {
  const navigate = useNavigate();
  const { contestId } = useParams();

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-8 md:py-10">
      <main className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() =>
            navigate(`/dsa/contests/${contestId}/result`)
          }
          className="flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
        >
          <FiArrowLeft />
          Back to Results
        </button>

        <header className="mt-7 rounded-3xl border border-slate-800 bg-slate-900 p-7">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            <FiCode />
            Reference solutions
          </p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            Weekly Contest Solutions
          </h1>
          <p className="mt-3 text-slate-400">
            Review the intended approach and C++ implementation for each problem.
          </p>
        </header>

        <section className="mt-7 space-y-5">
          {solutions.map((solution, index) => (
            <details
              key={solution.label}
              open={index === 0}
              className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 transition hover:bg-slate-800/60">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 font-bold text-indigo-300">
                    {solution.label}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold">
                      {solution.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Click to review solution
                    </p>
                  </div>
                </div>
                <FiCheckCircle className="text-2xl text-emerald-400" />
              </summary>

              <div className="border-t border-slate-800 p-6">
                <p className="leading-7 text-slate-300">
                  {solution.approach}
                </p>

                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                  <span className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-slate-300">
                    <FiClock /> Time: {solution.time}
                  </span>
                  <span className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-slate-300">
                    <FiDatabase /> Space: {solution.space}
                  </span>
                </div>

                <pre className="mt-5 overflow-x-auto rounded-xl border border-slate-700 bg-slate-950 p-5 text-sm leading-6 text-slate-200">
                  <code>{solution.code}</code>
                </pre>
              </div>
            </details>
          ))}
        </section>
      </main>
    </div>
  );
};

export default ContestSolutions;
