import additionalQuestionData from "./additionalQuestionData";

const companyQuestionIds = {
  wipro: new Set([
    "contains-duplicate",
    "binary-search",
    "climbing-stairs",
    "single-number",
    "maximum-subarray",
    "subarray-sum-equals-k",
    "jump-game",
    "count-primes",
    "first-missing-positive",
    "trapping-rain-water",
  ]),
  accenture: new Set([
    "contains-duplicate",
    "binary-search",
    "climbing-stairs",
    "validate-binary-search-tree",
    "three-sum",
    "kth-largest-element",
    "jump-game",
    "generate-parentheses",
    "first-missing-positive",
    "trapping-rain-water",
  ]),
  infosys: new Set([
    "two-sum",
    "contains-duplicate",
    "climbing-stairs",
    "single-number",
    "maximum-subarray",
    "three-sum",
    "jump-game",
    "count-primes",
    "first-missing-positive",
    "trapping-rain-water",
  ]),
  uber: new Set([
    "contains-duplicate",
    "binary-search",
    "single-number",
    "validate-binary-search-tree",
    "maximum-subarray",
    "three-sum",
    "kth-largest-element",
    "generate-parentheses",
    "first-missing-positive",
    "trapping-rain-water",
  ]),
  tcs: new Set([
    "two-sum",
    "contains-duplicate",
    "binary-search",
    "climbing-stairs",
    "maximum-subarray",
    "subarray-sum-equals-k",
    "generate-parentheses",
    "count-primes",
    "first-missing-positive",
    "trapping-rain-water",
  ]),
  "goldman-sachs": new Set([
    "contains-duplicate",
    "binary-search",
    "single-number",
    "validate-binary-search-tree",
    "maximum-subarray",
    "three-sum",
    "subarray-sum-equals-k",
    "kth-largest-element",
    "first-missing-positive",
    "trapping-rain-water",
  ]),
  adobe: new Set([
    "two-sum",
    "contains-duplicate",
    "binary-search",
    "validate-binary-search-tree",
    "three-sum",
    "jump-game",
    "generate-parentheses",
    "count-primes",
    "first-missing-positive",
    "trapping-rain-water",
  ]),
  google: new Set([
    "contains-duplicate",
    "binary-search",
    "single-number",
    "validate-binary-search-tree",
    "maximum-subarray",
    "three-sum",
    "subarray-sum-equals-k",
    "generate-parentheses",
    "first-missing-positive",
    "trapping-rain-water",
  ]),
  amazon: new Set([
    "contains-duplicate",
    "climbing-stairs",
    "single-number",
    "validate-binary-search-tree",
    "maximum-subarray",
    "kth-largest-element",
    "jump-game",
    "generate-parentheses",
    "first-missing-positive",
    "trapping-rain-water",
  ]),
  microsoft: new Set([
    "two-sum",
    "binary-search",
    "climbing-stairs",
    "validate-binary-search-tree",
    "maximum-subarray",
    "subarray-sum-equals-k",
    "jump-game",
    "count-primes",
    "first-missing-positive",
    "trapping-rain-water",
  ]),
  flipkart: new Set([
    "contains-duplicate",
    "climbing-stairs",
    "single-number",
    "validate-binary-search-tree",
    "maximum-subarray",
    "three-sum",
    "kth-largest-element",
    "jump-game",
    "first-missing-positive",
    "trapping-rain-water",
  ]),
  atlassian: new Set([
    "contains-duplicate",
    "binary-search",
    "climbing-stairs",
    "validate-binary-search-tree",
    "subarray-sum-equals-k",
    "kth-largest-element",
    "generate-parentheses",
    "count-primes",
    "first-missing-positive",
    "trapping-rain-water",
  ]),
};

const managedCompanyIds = new Set(Object.keys(companyQuestionIds));

const addCompanyTags = (questions) => {
  return Object.fromEntries(
    Object.entries(questions).map(([questionId, question]) => {
      const matchedCompanies = Object.entries(companyQuestionIds)
        .filter(([, questionIds]) => questionIds.has(questionId))
        .map(([companyId]) => companyId);

      return [
        questionId,
        {
          ...question,
          companies: [
            ...new Set([
              ...(question.companies || []).filter(
                (companyId) => !managedCompanyIds.has(companyId)
              ),
              ...matchedCompanies,
            ]),
          ],
        },
      ];
    })
  );
};

const questionData = addCompanyTags({
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    acceptance: 82,
    topic: "arrays",
    company: "General",
    companies: [
      "google",
      "amazon",
      "microsoft",
      "adobe",
      "tcs",
      "infosys",
    ],

    description:
      "Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice.",

    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "nums[1] + nums[2] = 2 + 4 = 6."
      }
    ],

    constraints: [
      "2 <= nums.length <= 10⁴",
      "-10⁹ <= nums[i] <= 10⁹",
      "-10⁹ <= target <= 10⁹",
      "Exactly one solution exists."
    ],

    starterCode: {
      cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {

        // Write your solution here

        return {};
    }
};`
    }
  },

  "best-time-to-buy-stock": {
    id: "best-time-to-buy-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    acceptance: 77,
    topic: "arrays",
    company: "General",
    companies: [
      "google",
      "amazon",
      "microsoft",
      "adobe",
      "flipkart",
    ],

    description:
      "You are given an array prices where prices[i] is the price of a stock on the ith day. Choose one day to buy the stock and another day in the future to sell it. Return the maximum profit you can achieve. If no profit is possible, return 0.",

    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation:
          "Buy on day 2 at price 1 and sell on day 5 at price 6."
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation:
          "No profitable transaction is possible."
      }
    ],

    constraints: [
      "1 <= prices.length <= 10⁵",
      "0 <= prices[i] <= 10⁴"
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
};`
    }
  },
  ...additionalQuestionData,
});

export default questionData;
