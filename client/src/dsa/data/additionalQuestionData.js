const createQuestion = ({
  id,
  title,
  topic,
  difficulty = "Easy",
  acceptance,
  description,
  exampleInput,
  exampleOutput,
  constraints,
  signature,
  fallbackReturn,
}) => ({
  id,
  title,
  topic,
  difficulty,
  acceptance,
  company: "General",
  companies: ["amazon", "google", "microsoft"],
  description,
  examples: [
    {
      input: exampleInput,
      output: exampleOutput,
    },
  ],
  constraints,
  starterCode: {
    cpp: `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    ${signature} {
        // Write your solution here
        ${fallbackReturn}
    }
};`,
  },
});

const additionalQuestionData = {
  "contains-duplicate": createQuestion({
    id: "contains-duplicate",
    title: "Contains Duplicate",
    topic: "arrays",
    acceptance: 79,
    description:
      "Return true if any value appears at least twice in the array.",
    exampleInput: "1 2 3 1",
    exampleOutput: "true",
    constraints: ["1 <= nums.length <= 100000"],
    signature: "bool containsDuplicate(vector<int>& nums)",
    fallbackReturn: "return false;",
  }),

  "maximum-subarray": createQuestion({
    id: "maximum-subarray",
    title: "Maximum Subarray",
    topic: "arrays",
    difficulty: "Medium",
    acceptance: 71,
    description:
      "Return the largest sum of a contiguous non-empty subarray.",
    exampleInput: "-2 1 -3 4 -1 2 1 -5 4",
    exampleOutput: "6",
    constraints: ["1 <= nums.length <= 100000"],
    signature: "int maxSubArray(vector<int>& nums)",
    fallbackReturn: "return 0;",
  }),

  "product-except-self": createQuestion({
    id: "product-except-self",
    title: "Product of Array Except Self",
    topic: "arrays",
    difficulty: "Medium",
    acceptance: 68,
    description:
      "Return an array where answer[i] is the product of every input value except nums[i], without division.",
    exampleInput: "1 2 3 4",
    exampleOutput: "24 12 8 6",
    constraints: ["2 <= nums.length <= 100000"],
    signature:
      "vector<int> productExceptSelf(vector<int>& nums)",
    fallbackReturn: "return {};",
  }),

  "three-sum": createQuestion({
    id: "three-sum",
    title: "Three Sum",
    topic: "arrays",
    difficulty: "Medium",
    acceptance: 44,
    description:
      "Return all unique triplets whose values sum to zero.",
    exampleInput: "-1 0 1 2 -1 -4",
    exampleOutput: "-1 -1 2 / -1 0 1",
    constraints: ["3 <= nums.length <= 3000"],
    signature:
      "vector<vector<int>> threeSum(vector<int>& nums)",
    fallbackReturn: "return {};",
  }),

  "container-most-water": createQuestion({
    id: "container-most-water",
    title: "Container With Most Water",
    topic: "arrays",
    difficulty: "Medium",
    acceptance: 58,
    description:
      "Choose two vertical lines that contain the maximum amount of water and return that area.",
    exampleInput: "1 8 6 2 5 4 8 3 7",
    exampleOutput: "49",
    constraints: ["2 <= height.length <= 100000"],
    signature: "int maxArea(vector<int>& height)",
    fallbackReturn: "return 0;",
  }),

  "subarray-sum-equals-k": createQuestion({
    id: "subarray-sum-equals-k",
    title: "Subarray Sum Equals K",
    topic: "arrays",
    difficulty: "Medium",
    acceptance: 63,
    description:
      "Return the number of contiguous subarrays whose sum equals k.",
    exampleInput: "nums = [1,1,1], k = 2",
    exampleOutput: "2",
    constraints: ["1 <= nums.length <= 20000"],
    signature: "int subarraySum(vector<int>& nums, int k)",
    fallbackReturn: "return 0;",
  }),

  "first-missing-positive": createQuestion({
    id: "first-missing-positive",
    title: "First Missing Positive",
    topic: "arrays",
    difficulty: "Hard",
    acceptance: 39,
    description:
      "Return the smallest positive integer that does not occur in the unsorted array.",
    exampleInput: "3 4 -1 1",
    exampleOutput: "2",
    constraints: ["1 <= nums.length <= 100000"],
    signature: "int firstMissingPositive(vector<int>& nums)",
    fallbackReturn: "return 1;",
  }),

  "trapping-rain-water": createQuestion({
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    topic: "arrays",
    difficulty: "Hard",
    acceptance: 46,
    description:
      "Return how much rain water is trapped between the elevation bars.",
    exampleInput: "0 1 0 2 1 0 1 3 2 1 2 1",
    exampleOutput: "6",
    constraints: ["1 <= height.length <= 20000"],
    signature: "int trap(vector<int>& height)",
    fallbackReturn: "return 0;",
  }),

  "valid-palindrome": createQuestion({
    id: "valid-palindrome",
    title: "Valid Palindrome",
    topic: "strings",
    acceptance: 72,
    description:
      "Return true if the string is a palindrome after removing non-alphanumeric characters and ignoring case.",
    exampleInput: "A man, a plan, a canal: Panama",
    exampleOutput: "true",
    constraints: ["1 <= s.length <= 200000"],
    signature: "bool isPalindrome(string s)",
    fallbackReturn: "return false;",
  }),

  "reverse-linked-list": createQuestion({
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    topic: "linked-list",
    acceptance: 78,
    description:
      "Reverse a singly linked list and return its new head.",
    exampleInput: "1 2 3 4 5",
    exampleOutput: "5 4 3 2 1",
    constraints: ["0 <= number of nodes <= 100000"],
    signature: "ListNode* reverseList(ListNode* head)",
    fallbackReturn: "return head;",
  }),

  "valid-parentheses": createQuestion({
    id: "valid-parentheses",
    title: "Valid Parentheses",
    topic: "stack",
    acceptance: 66,
    description:
      "Return true when every opening bracket is closed by the same bracket type in the correct order.",
    exampleInput: "()[]{}",
    exampleOutput: "true",
    constraints: ["1 <= s.length <= 100000"],
    signature: "bool isValid(string s)",
    fallbackReturn: "return false;",
  }),

  "first-non-repeating-character": createQuestion({
    id: "first-non-repeating-character",
    title: "First Non-Repeating Character",
    topic: "queue",
    acceptance: 61,
    description:
      "Return the first character that occurs exactly once in a lowercase string, or # when none exists.",
    exampleInput: "aabc",
    exampleOutput: "b",
    constraints: ["1 <= s.length <= 100000"],
    signature: "char firstUnique(string s)",
    fallbackReturn: "return '#';",
  }),

  "binary-search": createQuestion({
    id: "binary-search",
    title: "Binary Search",
    topic: "binary-search",
    acceptance: 81,
    description:
      "Given a sorted integer array, return the index of target or -1 when target is absent.",
    exampleInput: "nums = [-1,0,3,5,9,12], target = 9",
    exampleOutput: "4",
    constraints: ["1 <= nums.length <= 100000"],
    signature: "int search(vector<int>& nums, int target)",
    fallbackReturn: "return -1;",
  }),

  "maximum-depth-binary-tree": createQuestion({
    id: "maximum-depth-binary-tree",
    title: "Maximum Depth of Binary Tree",
    topic: "trees",
    acceptance: 79,
    description:
      "Return the number of nodes along the longest path from the root to a leaf.",
    exampleInput: "3 9 20 -1 -1 15 7",
    exampleOutput: "3",
    constraints: ["0 <= number of nodes <= 10000"],
    signature: "int maxDepth(TreeNode* root)",
    fallbackReturn: "return 0;",
  }),

  "validate-binary-search-tree": createQuestion({
    id: "validate-binary-search-tree",
    title: "Validate Binary Search Tree",
    topic: "bst",
    difficulty: "Easy",
    acceptance: 55,
    description:
      "Return true if every node in the binary tree satisfies the strict binary-search-tree ordering rules.",
    exampleInput: "2 1 3",
    exampleOutput: "true",
    constraints: ["1 <= number of nodes <= 10000"],
    signature: "bool isValidBST(TreeNode* root)",
    fallbackReturn: "return false;",
  }),

  "kth-largest-element": createQuestion({
    id: "kth-largest-element",
    title: "Kth Largest Element",
    topic: "heap",
    difficulty: "Medium",
    acceptance: 67,
    description:
      "Return the kth largest value in an unsorted integer array.",
    exampleInput: "nums = [3,2,1,5,6,4], k = 2",
    exampleOutput: "5",
    constraints: ["1 <= k <= nums.length <= 100000"],
    signature: "int findKthLargest(vector<int>& nums, int k)",
    fallbackReturn: "return 0;",
  }),

  "number-of-provinces": createQuestion({
    id: "number-of-provinces",
    title: "Number of Provinces",
    topic: "graphs",
    difficulty: "Medium",
    acceptance: 69,
    description:
      "Given an adjacency matrix of directly connected cities, return the number of connected components.",
    exampleInput: "1 1 0 / 1 1 0 / 0 0 1",
    exampleOutput: "2",
    constraints: ["1 <= number of cities <= 200"],
    signature: "int findCircleNum(vector<vector<int>>& isConnected)",
    fallbackReturn: "return 0;",
  }),

  "climbing-stairs": createQuestion({
    id: "climbing-stairs",
    title: "Climbing Stairs",
    topic: "dynamic-programming",
    acceptance: 74,
    description:
      "You may climb one or two steps at a time. Return the number of distinct ways to reach step n.",
    exampleInput: "5",
    exampleOutput: "8",
    constraints: ["1 <= n <= 45"],
    signature: "int climbStairs(int n)",
    fallbackReturn: "return 0;",
  }),

  "jump-game": createQuestion({
    id: "jump-game",
    title: "Jump Game",
    topic: "greedy",
    difficulty: "Medium",
    acceptance: 58,
    description:
      "Each array value is the maximum jump length from that position. Return whether the last index is reachable.",
    exampleInput: "2 3 1 1 4",
    exampleOutput: "true",
    constraints: ["1 <= nums.length <= 100000"],
    signature: "bool canJump(vector<int>& nums)",
    fallbackReturn: "return false;",
  }),

  "generate-parentheses": createQuestion({
    id: "generate-parentheses",
    title: "Generate Parentheses",
    topic: "backtracking",
    difficulty: "Medium",
    acceptance: 76,
    description:
      "Generate every well-formed parentheses string containing n pairs.",
    exampleInput: "3",
    exampleOutput: "((())) (()()) (())() ()(()) ()()()",
    constraints: ["1 <= n <= 8"],
    signature: "vector<string> generateParenthesis(int n)",
    fallbackReturn: "return {};",
  }),

  "single-number": createQuestion({
    id: "single-number",
    title: "Single Number",
    topic: "bit-manipulation",
    acceptance: 83,
    description:
      "Every array value appears twice except one. Return the value that appears once.",
    exampleInput: "4 1 2 1 2",
    exampleOutput: "4",
    constraints: ["1 <= nums.length <= 100000"],
    signature: "int singleNumber(vector<int>& nums)",
    fallbackReturn: "return 0;",
  }),

  "count-primes": createQuestion({
    id: "count-primes",
    title: "Count Primes",
    topic: "math",
    difficulty: "Medium",
    acceptance: 55,
    description:
      "Return the number of prime numbers strictly less than n.",
    exampleInput: "10",
    exampleOutput: "4",
    constraints: ["0 <= n <= 5000000"],
    signature: "int countPrimes(int n)",
    fallbackReturn: "return 0;",
  }),
};

export default additionalQuestionData;
