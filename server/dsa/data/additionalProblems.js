const problem = (
  id,
  title,
  topic,
  difficulty,
  cppDriver,
  cppPrelude = ""
) => ({
  id,
  title,
  topic,
  difficulty,
  points: 100,
  companies: ["Amazon", "Google", "Microsoft"],
  cppDriver,
  cppPrelude,
});

const listNodePrelude = `
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int value) : val(value), next(nullptr) {}
};
`;

const treeNodePrelude = `
struct TreeNode {
    long long val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(long long value) : val(value), left(nullptr), right(nullptr) {}
};
`;

const treeBuilder = `
TreeNode* buildTree(const vector<long long>& values) {
    if (values.empty() || values[0] == LLONG_MIN) return nullptr;
    TreeNode* root = new TreeNode(values[0]);
    queue<TreeNode*> pending;
    pending.push(root);
    size_t index = 1;
    while (!pending.empty() && index < values.size()) {
        TreeNode* node = pending.front();
        pending.pop();
        if (index < values.size() && values[index] != LLONG_MIN) {
            node->left = new TreeNode(values[index]);
            pending.push(node->left);
        }
        index++;
        if (index < values.size() && values[index] != LLONG_MIN) {
            node->right = new TreeNode(values[index]);
            pending.push(node->right);
        }
        index++;
    }
    return root;
}
`;

export const additionalProblems = [
  problem(
    "valid-palindrome",
    "Valid Palindrome",
    "Strings",
    "Easy",
    `
int main() {
    string s;
    getline(cin, s);
    Solution solution;
    cout << (solution.isPalindrome(s) ? "true" : "false");
    return 0;
}`
  ),
  problem(
    "reverse-linked-list",
    "Reverse Linked List",
    "Linked List",
    "Easy",
    `
int main() {
    int n;
    cin >> n;
    ListNode dummy(0);
    ListNode* tail = &dummy;
    for (int i = 0; i < n; i++) {
        int value;
        cin >> value;
        tail->next = new ListNode(value);
        tail = tail->next;
    }
    Solution solution;
    ListNode* head = solution.reverseList(dummy.next);
    bool first = true;
    while (head) {
        if (!first) cout << " ";
        cout << head->val;
        first = false;
        head = head->next;
    }
    return 0;
}`,
    listNodePrelude
  ),
  problem(
    "valid-parentheses",
    "Valid Parentheses",
    "Stack",
    "Easy",
    `
int main() {
    string s;
    cin >> s;
    Solution solution;
    cout << (solution.isValid(s) ? "true" : "false");
    return 0;
}`
  ),
  problem(
    "next-greater-element-ii",
    "Next Greater Element II",
    "Stack",
    "Medium",
    `
int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int& value : nums) cin >> value;
    Solution solution;
    vector<int> result = solution.nextGreaterElements(nums);
    for (int i = 0; i < static_cast<int>(result.size()); i++) {
        if (i > 0) cout << " ";
        cout << result[i];
    }
    return 0;
}`
  ),
  problem(
    "first-non-repeating-character",
    "First Non-Repeating Character",
    "Queue",
    "Easy",
    `
int main() {
    string s;
    cin >> s;
    Solution solution;
    cout << solution.firstUnique(s);
    return 0;
}`
  ),
  problem(
    "binary-search",
    "Binary Search",
    "Binary Search",
    "Easy",
    `
int main() {
    int n, target;
    cin >> n;
    vector<int> nums(n);
    for (int& value : nums) cin >> value;
    cin >> target;
    Solution solution;
    cout << solution.search(nums, target);
    return 0;
}`
  ),
  problem("search-insert-position", "Search Insert Position", "Binary Search", "Easy", `
int main(){int n,target;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;cin>>target;Solution s;cout<<s.searchInsert(a,target);return 0;}`),
  problem("first-last-position", "Find First and Last Position", "Binary Search", "Medium", `
int main(){int n,target;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;cin>>target;Solution s;auto r=s.searchRange(a,target);cout<<r[0]<<" "<<r[1];return 0;}`),
  problem("search-rotated-array", "Search in Rotated Sorted Array", "Binary Search", "Medium", `
int main(){int n,target;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;cin>>target;Solution s;cout<<s.search(a,target);return 0;}`),
  problem("find-min-rotated", "Find Minimum in Rotated Sorted Array", "Binary Search", "Medium", `
int main(){int n;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;Solution s;cout<<s.findMin(a);return 0;}`),
  problem("find-peak-element", "Find Peak Element", "Binary Search", "Medium", `
int main(){int n;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;Solution s;cout<<s.findPeakElement(a);return 0;}`),
  problem("search-2d-matrix", "Search a 2D Matrix", "Binary Search", "Medium", `
int main(){int r,c,target;cin>>r>>c;vector<vector<int>>a(r,vector<int>(c));for(auto&row:a)for(int&x:row)cin>>x;cin>>target;Solution s;cout<<(s.searchMatrix(a,target)?"true":"false");return 0;}`),
  problem("koko-eating-bananas", "Koko Eating Bananas", "Binary Search", "Medium", `
int main(){int n,h;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;cin>>h;Solution s;cout<<s.minEatingSpeed(a,h);return 0;}`),
  problem("ship-within-days", "Capacity To Ship Packages Within D Days", "Binary Search", "Medium", `
int main(){int n,days;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;cin>>days;Solution s;cout<<s.shipWithinDays(a,days);return 0;}`),
  problem("minimum-days-bouquets", "Minimum Days to Make Bouquets", "Binary Search", "Medium", `
int main(){int n,m,k;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;cin>>m>>k;Solution s;cout<<s.minDays(a,m,k);return 0;}`),
  problem("word-ladder", "Word Ladder", "Graph", "Hard", `
int main(){string beginWord,endWord;int n;cin>>beginWord>>endWord>>n;vector<string> words(n);for(string&word:words)cin>>word;Solution s;cout<<s.ladderLength(beginWord,endWord,words);return 0;}`),
  problem("coin-change", "Coin Change", "Dynamic Programming", "Medium", `
int main(){int n,amount;cin>>n;vector<int> coins(n);for(int&coin:coins)cin>>coin;cin>>amount;Solution s;cout<<s.coinChange(coins,amount);return 0;}`),
  problem(
    "maximum-depth-binary-tree",
    "Maximum Depth of Binary Tree",
    "Trees",
    "Easy",
    `${treeBuilder}
int main() {
    int n;
    cin >> n;
    vector<long long> values(n);
    string token;
    for (int i = 0; i < n; i++) {
        cin >> token;
        values[i] = token == "null" ? LLONG_MIN : stoll(token);
    }
    Solution solution;
    cout << solution.maxDepth(buildTree(values));
    return 0;
}`,
    treeNodePrelude
  ),
  problem(
    "validate-binary-search-tree",
    "Validate Binary Search Tree",
    "Binary Search Tree",
    "Medium",
    `${treeBuilder}
int main() {
    int n;
    cin >> n;
    vector<long long> values(n);
    string token;
    for (int i = 0; i < n; i++) {
        cin >> token;
        values[i] = token == "null" ? LLONG_MIN : stoll(token);
    }
    Solution solution;
    cout << (solution.isValidBST(buildTree(values)) ? "true" : "false");
    return 0;
}`,
    treeNodePrelude
  ),
  problem(
    "kth-largest-element",
    "Kth Largest Element",
    "Heap",
    "Medium",
    `
int main() {
    int n, k;
    cin >> n;
    vector<int> nums(n);
    for (int& value : nums) cin >> value;
    cin >> k;
    Solution solution;
    cout << solution.findKthLargest(nums, k);
    return 0;
}`
  ),
  problem(
    "number-of-provinces",
    "Number of Provinces",
    "Graphs",
    "Medium",
    `
int main() {
    int n;
    cin >> n;
    vector<vector<int>> graph(n, vector<int>(n));
    for (auto& row : graph) for (int& value : row) cin >> value;
    Solution solution;
    cout << solution.findCircleNum(graph);
    return 0;
}`
  ),
  problem(
    "climbing-stairs",
    "Climbing Stairs",
    "Dynamic Programming",
    "Easy",
    `
int main() {
    int n;
    cin >> n;
    Solution solution;
    cout << solution.climbStairs(n);
    return 0;
}`
  ),
  problem(
    "jump-game",
    "Jump Game",
    "Greedy",
    "Medium",
    `
int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int& value : nums) cin >> value;
    Solution solution;
    cout << (solution.canJump(nums) ? "true" : "false");
    return 0;
}`
  ),
  problem(
    "generate-parentheses",
    "Generate Parentheses",
    "Backtracking",
    "Medium",
    `
int main() {
    int n;
    cin >> n;
    Solution solution;
    vector<string> answer = solution.generateParenthesis(n);
    sort(answer.begin(), answer.end());
    for (size_t i = 0; i < answer.size(); i++) {
        if (i) cout << " ";
        cout << answer[i];
    }
    return 0;
}`
  ),
  problem("subsets", "Subsets", "Backtracking", "Medium", `
int main(){int n;cin>>n;vector<int> nums(n);for(int& x:nums)cin>>x;Solution s;auto answer=s.subsets(nums);for(auto& row:answer)sort(row.begin(),row.end());sort(answer.begin(),answer.end());for(size_t i=0;i<answer.size();i++){if(i)cout<<"\\n";if(answer[i].empty())cout<<"[]";else for(size_t j=0;j<answer[i].size();j++){if(j)cout<<" ";cout<<answer[i][j];}}return 0;}`),
  problem("permutations", "Permutations", "Backtracking", "Medium", `
int main(){int n;cin>>n;vector<int> nums(n);for(int& x:nums)cin>>x;Solution s;auto answer=s.permute(nums);sort(answer.begin(),answer.end());for(size_t i=0;i<answer.size();i++){if(i)cout<<"\\n";for(size_t j=0;j<answer[i].size();j++){if(j)cout<<" ";cout<<answer[i][j];}}return 0;}`),
  problem("combination-sum", "Combination Sum", "Backtracking", "Medium", `
int main(){int n,target;cin>>n;vector<int> nums(n);for(int& x:nums)cin>>x;cin>>target;Solution s;auto answer=s.combinationSum(nums,target);for(auto& row:answer)sort(row.begin(),row.end());sort(answer.begin(),answer.end());for(size_t i=0;i<answer.size();i++){if(i)cout<<"\\n";for(size_t j=0;j<answer[i].size();j++){if(j)cout<<" ";cout<<answer[i][j];}}return 0;}`),
  problem("letter-combinations-phone", "Letter Combinations of a Phone Number", "Backtracking", "Medium", `
int main(){string digits;cin>>digits;Solution s;auto answer=s.letterCombinations(digits);sort(answer.begin(),answer.end());for(size_t i=0;i<answer.size();i++){if(i)cout<<" ";cout<<answer[i];}return 0;}`),
  problem("word-search", "Word Search", "Backtracking", "Medium", `
int main(){int rows,cols;cin>>rows>>cols;vector<vector<char>> board(rows,vector<char>(cols));for(int i=0;i<rows;i++){string row;cin>>row;for(int j=0;j<cols;j++)board[i][j]=row[j];}string word;cin>>word;Solution s;cout<<(s.exist(board,word)?"true":"false");return 0;}`),
  problem("palindrome-partitioning", "Palindrome Partitioning", "Backtracking", "Medium", `
int main(){string value;cin>>value;Solution s;auto answer=s.partition(value);sort(answer.begin(),answer.end());for(size_t i=0;i<answer.size();i++){if(i)cout<<"\\n";for(size_t j=0;j<answer[i].size();j++){if(j)cout<<" ";cout<<answer[i][j];}}return 0;}`),
  problem("n-queens-ii", "N-Queens II", "Backtracking", "Hard", `
int main(){int n;cin>>n;Solution s;cout<<s.totalNQueens(n);return 0;}`),
  problem("restore-ip-addresses", "Restore IP Addresses", "Backtracking", "Medium", `
int main(){string value;cin>>value;Solution s;auto answer=s.restoreIpAddresses(value);sort(answer.begin(),answer.end());for(size_t i=0;i<answer.size();i++){if(i)cout<<" ";cout<<answer[i];}return 0;}`),
  problem("combination-sum-iii", "Combination Sum III", "Backtracking", "Medium", `
int main(){int k,n;cin>>k>>n;Solution s;auto answer=s.combinationSum3(k,n);for(auto& row:answer)sort(row.begin(),row.end());sort(answer.begin(),answer.end());for(size_t i=0;i<answer.size();i++){if(i)cout<<"\\n";for(size_t j=0;j<answer[i].size();j++){if(j)cout<<" ";cout<<answer[i][j];}}return 0;}`),
  problem(
    "single-number",
    "Single Number",
    "Bit Manipulation",
    "Easy",
    `
int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int& value : nums) cin >> value;
    Solution solution;
    cout << solution.singleNumber(nums);
    return 0;
}`
  ),
  problem("number-of-1-bits", "Number of 1 Bits", "Bit Manipulation", "Easy", `
int main(){uint32_t n;cin>>n;Solution s;cout<<s.hammingWeight(n);return 0;}`),
  problem("counting-bits", "Counting Bits", "Bit Manipulation", "Easy", `
int main(){int n;cin>>n;Solution s;vector<int> answer=s.countBits(n);for(size_t i=0;i<answer.size();i++){if(i)cout<<" ";cout<<answer[i];}return 0;}`),
  problem("reverse-bits", "Reverse Bits", "Bit Manipulation", "Easy", `
int main(){uint32_t n;cin>>n;Solution s;cout<<s.reverseBits(n);return 0;}`),
  problem("missing-number", "Missing Number", "Bit Manipulation", "Easy", `
int main(){int n;cin>>n;vector<int> nums(n);for(int& value:nums)cin>>value;Solution s;cout<<s.missingNumber(nums);return 0;}`),
  problem("power-of-two", "Power of Two", "Bit Manipulation", "Easy", `
int main(){int n;cin>>n;Solution s;cout<<(s.isPowerOfTwo(n)?"true":"false");return 0;}`),
  problem("minimum-bit-flips", "Minimum Bit Flips to Convert Number", "Bit Manipulation", "Easy", `
int main(){int start,goal;cin>>start>>goal;Solution s;cout<<s.minBitFlips(start,goal);return 0;}`),
  problem("single-number-ii", "Single Number II", "Bit Manipulation", "Medium", `
int main(){int n;cin>>n;vector<int> nums(n);for(int& value:nums)cin>>value;Solution s;cout<<s.singleNumber(nums);return 0;}`),
  problem("bitwise-and-range", "Bitwise AND of Numbers Range", "Bit Manipulation", "Medium", `
int main(){int left,right;cin>>left>>right;Solution s;cout<<s.rangeBitwiseAnd(left,right);return 0;}`),
  problem("maximum-xor", "Maximum XOR of Two Numbers", "Bit Manipulation", "Medium", `
int main(){int n;cin>>n;vector<int> nums(n);for(int& value:nums)cin>>value;Solution s;cout<<s.findMaximumXOR(nums);return 0;}`),
  problem(
    "count-primes",
    "Count Primes",
    "Math",
    "Medium",
    `
int main() {
    int n;
    cin >> n;
    Solution solution;
    cout << solution.countPrimes(n);
    return 0;
}`
  ),
  problem("palindrome-number", "Palindrome Number", "Math", "Easy", `
int main(){int x;cin>>x;Solution s;cout<<(s.isPalindrome(x)?"true":"false");return 0;}`),
  problem("gcd-of-two-numbers", "Greatest Common Divisor", "Math", "Easy", `
int main(){int a,b;cin>>a>>b;Solution s;cout<<s.gcd(a,b);return 0;}`),
  problem("sqrt-x", "Sqrt(x)", "Math", "Easy", `
int main(){int x;cin>>x;Solution s;cout<<s.mySqrt(x);return 0;}`),
  problem("happy-number", "Happy Number", "Math", "Easy", `
int main(){int n;cin>>n;Solution s;cout<<(s.isHappy(n)?"true":"false");return 0;}`),
  problem("power-x-n", "Pow(x, n)", "Math", "Medium", `
int main(){double x;int n;cin>>x>>n;Solution s;cout<<fixed<<setprecision(5)<<s.myPow(x,n);return 0;}`),
  problem("factorial-trailing-zeroes", "Factorial Trailing Zeroes", "Math", "Medium", `
int main(){int n;cin>>n;Solution s;cout<<s.trailingZeroes(n);return 0;}`),
  problem("roman-to-integer", "Roman to Integer", "Math", "Easy", `
int main(){string value;cin>>value;Solution s;cout<<s.romanToInt(value);return 0;}`),
  problem("integer-to-roman", "Integer to Roman", "Math", "Medium", `
int main(){int value;cin>>value;Solution s;cout<<s.intToRoman(value);return 0;}`),
  problem("excel-column-number", "Excel Sheet Column Number", "Math", "Easy", `
int main(){string value;cin>>value;Solution s;cout<<s.titleToNumber(value);return 0;}`),
  problem("contains-duplicate", "Contains Duplicate", "Arrays", "Easy", `
int main(){int n;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;Solution s;cout<<(s.containsDuplicate(a)?"true":"false");}`),
  problem("maximum-subarray", "Maximum Subarray", "Arrays", "Easy", `
int main(){int n;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;Solution s;cout<<s.maxSubArray(a);}`),
  problem("product-except-self", "Product of Array Except Self", "Arrays", "Medium", `
int main(){int n;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;Solution s;auto r=s.productExceptSelf(a);for(size_t i=0;i<r.size();i++){if(i)cout<<" ";cout<<r[i];}}`),
  problem("three-sum", "Three Sum", "Arrays", "Medium", `
int main(){int n;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;Solution s;auto r=s.threeSum(a);for(auto&v:r)sort(v.begin(),v.end());sort(r.begin(),r.end());r.erase(unique(r.begin(),r.end()),r.end());for(size_t i=0;i<r.size();i++){if(i)cout<<"\\n";for(size_t j=0;j<r[i].size();j++){if(j)cout<<" ";cout<<r[i][j];}}}`),
  problem("container-most-water", "Container With Most Water", "Arrays", "Medium", `
int main(){int n;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;Solution s;cout<<s.maxArea(a);}`),
  problem("subarray-sum-equals-k", "Subarray Sum Equals K", "Arrays", "Medium", `
int main(){int n,k;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;cin>>k;Solution s;cout<<s.subarraySum(a,k);}`),
  problem("first-missing-positive", "First Missing Positive", "Arrays", "Hard", `
int main(){int n;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;Solution s;cout<<s.firstMissingPositive(a);}`),
  problem("trapping-rain-water", "Trapping Rain Water", "Arrays", "Hard", `
int main(){int n;cin>>n;vector<int>a(n);for(int&x:a)cin>>x;Solution s;cout<<s.trap(a);}`),
];

export const additionalProblemTestCases = {
  "contains-duplicate": [
    { input: "4\n1 2 3 1", expectedOutput: "true" },
    { input: "4\n1 2 3 4", expectedOutput: "false" },
    { input: "10\n1 1 1 3 3 4 3 2 4 2", expectedOutput: "true" },
    { input: "1\n7", expectedOutput: "false" },
    { input: "3\n-1 -2 -1", expectedOutput: "true" },
  ],
  "maximum-subarray": [
    { input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
    { input: "1\n1", expectedOutput: "1" },
    { input: "5\n5 4 -1 7 8", expectedOutput: "23" },
    { input: "3\n-3 -2 -5", expectedOutput: "-2" },
    { input: "4\n0 0 0 0", expectedOutput: "0" },
  ],
  "product-except-self": [
    { input: "4\n1 2 3 4", expectedOutput: "24 12 8 6" },
    { input: "5\n-1 1 0 -3 3", expectedOutput: "0 0 9 0 0" },
    { input: "2\n2 3", expectedOutput: "3 2" },
    { input: "3\n0 0 2", expectedOutput: "0 0 0" },
    { input: "3\n1 1 1", expectedOutput: "1 1 1" },
  ],
  "three-sum": [
    { input: "6\n-1 0 1 2 -1 -4", expectedOutput: "-1 -1 2\n-1 0 1" },
    { input: "3\n0 1 1", expectedOutput: "" },
    { input: "3\n0 0 0", expectedOutput: "0 0 0" },
    { input: "5\n-2 0 1 1 2", expectedOutput: "-2 0 2\n-2 1 1" },
    { input: "4\n1 -1 -1 0", expectedOutput: "-1 0 1" },
  ],
  "container-most-water": [
    { input: "9\n1 8 6 2 5 4 8 3 7", expectedOutput: "49" },
    { input: "2\n1 1", expectedOutput: "1" },
    { input: "3\n1 2 1", expectedOutput: "2" },
    { input: "4\n1 3 2 5", expectedOutput: "6" },
    { input: "5\n5 4 3 2 1", expectedOutput: "6" },
  ],
  "subarray-sum-equals-k": [
    { input: "3\n1 1 1\n2", expectedOutput: "2" },
    { input: "3\n1 2 3\n3", expectedOutput: "2" },
    { input: "3\n1 -1 0\n0", expectedOutput: "3" },
    { input: "1\n5\n5", expectedOutput: "1" },
    { input: "4\n0 0 0 0\n0", expectedOutput: "10" },
  ],
  "first-missing-positive": [
    { input: "3\n1 2 0", expectedOutput: "3" },
    { input: "4\n3 4 -1 1", expectedOutput: "2" },
    { input: "5\n7 8 9 11 12", expectedOutput: "1" },
    { input: "1\n1", expectedOutput: "2" },
    { input: "4\n2 1 3 5", expectedOutput: "4" },
  ],
  "trapping-rain-water": [
    { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6" },
    { input: "6\n4 2 0 3 2 5", expectedOutput: "9" },
    { input: "3\n1 2 3", expectedOutput: "0" },
    { input: "3\n3 2 1", expectedOutput: "0" },
    { input: "5\n2 0 2 0 2", expectedOutput: "4" },
  ],
  "valid-palindrome": [
    { input: "A man, a plan, a canal: Panama", expectedOutput: "true" },
    { input: "race a car", expectedOutput: "false" },
    { input: " ", expectedOutput: "true" },
    { input: "0P", expectedOutput: "false" },
    { input: "Madam", expectedOutput: "true" },
  ],
  "reverse-linked-list": [
    { input: "5\n1 2 3 4 5", expectedOutput: "5 4 3 2 1" },
    { input: "2\n1 2", expectedOutput: "2 1" },
    { input: "1\n7", expectedOutput: "7" },
    { input: "0\n", expectedOutput: "" },
    { input: "4\n-1 0 2 8", expectedOutput: "8 2 0 -1" },
  ],
  "valid-parentheses": [
    { input: "()", expectedOutput: "true" },
    { input: "()[]{}", expectedOutput: "true" },
    { input: "(]", expectedOutput: "false" },
    { input: "([)]", expectedOutput: "false" },
    { input: "{[]}", expectedOutput: "true" },
  ],
  "next-greater-element-ii": [
    { input: "3\n1 2 1", expectedOutput: "2 -1 2" },
    { input: "5\n1 2 3 4 3", expectedOutput: "2 3 4 -1 4" },
    { input: "1\n7", expectedOutput: "-1" },
    { input: "4\n5 4 3 2", expectedOutput: "-1 5 5 5" },
    { input: "4\n2 2 2 2", expectedOutput: "-1 -1 -1 -1" },
  ],
  "first-non-repeating-character": [
    { input: "aabc", expectedOutput: "b" },
    { input: "aabb", expectedOutput: "#" },
    { input: "leetcode", expectedOutput: "l" },
    { input: "x", expectedOutput: "x" },
    { input: "swiss", expectedOutput: "w" },
  ],
  "binary-search": [
    { input: "6\n-1 0 3 5 9 12\n9", expectedOutput: "4" },
    { input: "6\n-1 0 3 5 9 12\n2", expectedOutput: "-1" },
    { input: "1\n5\n5", expectedOutput: "0" },
    { input: "4\n1 2 3 4\n1", expectedOutput: "0" },
    { input: "4\n1 2 3 4\n4", expectedOutput: "3" },
  ],
  "search-insert-position": [
    { input: "4\n1 3 5 6\n5", expectedOutput: "2" },
    { input: "4\n1 3 5 6\n2", expectedOutput: "1" },
    { input: "4\n1 3 5 6\n7", expectedOutput: "4" },
    { input: "1\n1\n0", expectedOutput: "0" },
  ],
  "first-last-position": [
    { input: "6\n5 7 7 8 8 10\n8", expectedOutput: "3 4" },
    { input: "6\n5 7 7 8 8 10\n6", expectedOutput: "-1 -1" },
    { input: "2\n2 2\n2", expectedOutput: "0 1" },
    { input: "1\n1\n1", expectedOutput: "0 0" },
  ],
  "search-rotated-array": [
    { input: "7\n4 5 6 7 0 1 2\n0", expectedOutput: "4" },
    { input: "7\n4 5 6 7 0 1 2\n3", expectedOutput: "-1" },
    { input: "1\n1\n0", expectedOutput: "-1" },
    { input: "2\n3 1\n1", expectedOutput: "1" },
  ],
  "find-min-rotated": [
    { input: "5\n3 4 5 1 2", expectedOutput: "1" },
    { input: "4\n4 5 6 7", expectedOutput: "4" },
    { input: "1\n9", expectedOutput: "9" },
    { input: "7\n6 7 1 2 3 4 5", expectedOutput: "1" },
  ],
  "find-peak-element": [
    { input: "4\n1 2 3 1", expectedOutput: "2" },
    { input: "1\n7", expectedOutput: "0" },
    { input: "2\n1 2", expectedOutput: "1" },
  ],
  "search-2d-matrix": [
    { input: "3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n3", expectedOutput: "true" },
    { input: "3 4\n1 3 5 7\n10 11 16 20\n23 30 34 60\n13", expectedOutput: "false" },
    { input: "1 1\n1\n2", expectedOutput: "false" },
  ],
  "koko-eating-bananas": [
    { input: "4\n3 6 7 11\n8", expectedOutput: "4" },
    { input: "5\n30 11 23 4 20\n5", expectedOutput: "30" },
    { input: "5\n30 11 23 4 20\n6", expectedOutput: "23" },
    { input: "1\n312884470\n968709470", expectedOutput: "1" },
  ],
  "ship-within-days": [
    { input: "10\n1 2 3 4 5 6 7 8 9 10\n5", expectedOutput: "15" },
    { input: "3\n1 2 3\n3", expectedOutput: "3" },
    { input: "6\n3 2 2 4 1 4\n3", expectedOutput: "6" },
  ],
  "minimum-days-bouquets": [
    { input: "5\n1 10 3 10 2\n3 1", expectedOutput: "3" },
    { input: "5\n1 10 3 10 2\n3 2", expectedOutput: "-1" },
    { input: "7\n7 7 7 7 12 7 7\n2 3", expectedOutput: "12" },
  ],
  "word-ladder": [
    { input: "hit cog\n6\nhot dot dog lot log cog", expectedOutput: "5" },
    { input: "hit cog\n5\nhot dot dog lot log", expectedOutput: "0" },
    { input: "a c\n3\na b c", expectedOutput: "2" },
    { input: "hot dog\n3\nhot dog dot", expectedOutput: "3" },
  ],
  "coin-change": [
    { input: "3\n1 2 5\n11", expectedOutput: "3" },
    { input: "1\n2\n3", expectedOutput: "-1" },
    { input: "1\n1\n0", expectedOutput: "0" },
    { input: "4\n1 3 4 5\n7", expectedOutput: "2" },
    { input: "3\n2 5 10\n27", expectedOutput: "4" },
  ],
  "maximum-depth-binary-tree": [
    { input: "7\n3 9 20 null null 15 7", expectedOutput: "3" },
    { input: "2\n1 2", expectedOutput: "2" },
    { input: "1\n1", expectedOutput: "1" },
    { input: "0\n", expectedOutput: "0" },
    { input: "7\n1 2 3 4 null null 5", expectedOutput: "3" },
  ],
  "validate-binary-search-tree": [
    { input: "3\n2 1 3", expectedOutput: "true" },
    { input: "7\n5 1 4 null null 3 6", expectedOutput: "false" },
    { input: "1\n1", expectedOutput: "true" },
    { input: "3\n2 2 3", expectedOutput: "false" },
    { input: "7\n4 2 6 1 3 5 7", expectedOutput: "true" },
  ],
  "kth-largest-element": [
    { input: "6\n3 2 1 5 6 4\n2", expectedOutput: "5" },
    { input: "9\n3 2 3 1 2 4 5 5 6\n4", expectedOutput: "4" },
    { input: "1\n1\n1", expectedOutput: "1" },
    { input: "5\n-1 -2 -3 -4 -5\n2", expectedOutput: "-2" },
    { input: "4\n2 2 2 2\n3", expectedOutput: "2" },
  ],
  "number-of-provinces": [
    { input: "3\n1 1 0\n1 1 0\n0 0 1", expectedOutput: "2" },
    { input: "3\n1 0 0\n0 1 0\n0 0 1", expectedOutput: "3" },
    { input: "1\n1", expectedOutput: "1" },
    { input: "4\n1 1 0 0\n1 1 1 0\n0 1 1 1\n0 0 1 1", expectedOutput: "1" },
    { input: "2\n1 0\n0 1", expectedOutput: "2" },
  ],
  "climbing-stairs": [
    { input: "2", expectedOutput: "2" },
    { input: "3", expectedOutput: "3" },
    { input: "5", expectedOutput: "8" },
    { input: "1", expectedOutput: "1" },
    { input: "10", expectedOutput: "89" },
  ],
  "jump-game": [
    { input: "5\n2 3 1 1 4", expectedOutput: "true" },
    { input: "5\n3 2 1 0 4", expectedOutput: "false" },
    { input: "1\n0", expectedOutput: "true" },
    { input: "2\n0 1", expectedOutput: "false" },
    { input: "6\n2 0 0 1 0 0", expectedOutput: "false" },
  ],
  "generate-parentheses": [
    { input: "1", expectedOutput: "()" },
    { input: "2", expectedOutput: "(()) ()()" },
    { input: "3", expectedOutput: "((())) (()()) (())() ()(()) ()()()" },
    { input: "4", expectedOutput: "(((()))) ((()())) ((())()) ((()))() (()(())) (()()()) (()())() (())(()) (())()() ()((())) ()(()()) ()(())() ()()(()) ()()()()" },
    { input: "2", expectedOutput: "(()) ()()" },
  ],
  "subsets": [
    { input: "2\n1 2", expectedOutput: "[]\n1\n1 2\n2" },
    { input: "0\n", expectedOutput: "[]" },
    { input: "1\n7", expectedOutput: "[]\n7" },
    { input: "3\n1 2 3", expectedOutput: "[]\n1\n1 2\n1 2 3\n1 3\n2\n2 3\n3" },
  ],
  "permutations": [
    { input: "2\n1 2", expectedOutput: "1 2\n2 1" },
    { input: "1\n7", expectedOutput: "7" },
    { input: "3\n1 2 3", expectedOutput: "1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1" },
  ],
  "combination-sum": [
    { input: "4\n2 3 6 7\n7", expectedOutput: "2 2 3\n7" },
    { input: "3\n2 3 5\n8", expectedOutput: "2 2 2 2\n2 3 3\n3 5" },
    { input: "1\n2\n1", expectedOutput: "" },
  ],
  "letter-combinations-phone": [
    { input: "23", expectedOutput: "ad ae af bd be bf cd ce cf" },
    { input: "2", expectedOutput: "a b c" },
    { input: "79", expectedOutput: "pw px py pz qw qx qy qz rw rx ry rz sw sx sy sz" },
  ],
  "word-search": [
    { input: "3 4\nABCE\nSFCS\nADEE\nABCCED", expectedOutput: "true" },
    { input: "3 4\nABCE\nSFCS\nADEE\nSEE", expectedOutput: "true" },
    { input: "3 4\nABCE\nSFCS\nADEE\nABCB", expectedOutput: "false" },
    { input: "1 1\nA\nB", expectedOutput: "false" },
  ],
  "palindrome-partitioning": [
    { input: "aab", expectedOutput: "a a b\naa b" },
    { input: "a", expectedOutput: "a" },
    { input: "aa", expectedOutput: "a a\naa" },
    { input: "abc", expectedOutput: "a b c" },
  ],
  "n-queens-ii": [
    { input: "1", expectedOutput: "1" },
    { input: "4", expectedOutput: "2" },
    { input: "5", expectedOutput: "10" },
    { input: "8", expectedOutput: "92" },
  ],
  "restore-ip-addresses": [
    { input: "25525511135", expectedOutput: "255.255.11.135 255.255.111.35" },
    { input: "0000", expectedOutput: "0.0.0.0" },
    { input: "101023", expectedOutput: "1.0.10.23 1.0.102.3 10.1.0.23 10.10.2.3 101.0.2.3" },
  ],
  "combination-sum-iii": [
    { input: "3 7", expectedOutput: "1 2 4" },
    { input: "3 9", expectedOutput: "1 2 6\n1 3 5\n2 3 4" },
    { input: "4 1", expectedOutput: "" },
    { input: "2 17", expectedOutput: "8 9" },
  ],
  "single-number": [
    { input: "3\n2 2 1", expectedOutput: "1" },
    { input: "5\n4 1 2 1 2", expectedOutput: "4" },
    { input: "1\n1", expectedOutput: "1" },
    { input: "5\n-1 2 2 3 3", expectedOutput: "-1" },
    { input: "7\n0 1 0 2 2 4 4", expectedOutput: "1" },
  ],
  "number-of-1-bits": [
    { input: "11", expectedOutput: "3" },
    { input: "0", expectedOutput: "0" },
    { input: "128", expectedOutput: "1" },
    { input: "4294967295", expectedOutput: "32" },
  ],
  "counting-bits": [
    { input: "5", expectedOutput: "0 1 1 2 1 2" },
    { input: "2", expectedOutput: "0 1 1" },
    { input: "0", expectedOutput: "0" },
    { input: "8", expectedOutput: "0 1 1 2 1 2 2 3 1" },
  ],
  "reverse-bits": [
    { input: "43261596", expectedOutput: "964176192" },
    { input: "1", expectedOutput: "2147483648" },
    { input: "0", expectedOutput: "0" },
    { input: "4294967295", expectedOutput: "4294967295" },
  ],
  "missing-number": [
    { input: "3\n3 0 1", expectedOutput: "2" },
    { input: "2\n0 1", expectedOutput: "2" },
    { input: "1\n1", expectedOutput: "0" },
    { input: "5\n0 1 2 3 5", expectedOutput: "4" },
  ],
  "power-of-two": [
    { input: "16", expectedOutput: "true" },
    { input: "3", expectedOutput: "false" },
    { input: "1", expectedOutput: "true" },
    { input: "0", expectedOutput: "false" },
    { input: "-2", expectedOutput: "false" },
  ],
  "minimum-bit-flips": [
    { input: "10 7", expectedOutput: "3" },
    { input: "3 4", expectedOutput: "3" },
    { input: "8 8", expectedOutput: "0" },
    { input: "0 15", expectedOutput: "4" },
  ],
  "single-number-ii": [
    { input: "4\n2 2 3 2", expectedOutput: "3" },
    { input: "7\n0 1 0 1 0 1 99", expectedOutput: "99" },
    { input: "1\n-5", expectedOutput: "-5" },
    { input: "7\n-2 -2 -2 -7 4 4 4", expectedOutput: "-7" },
  ],
  "bitwise-and-range": [
    { input: "5 7", expectedOutput: "4" },
    { input: "0 0", expectedOutput: "0" },
    { input: "1 2147483647", expectedOutput: "0" },
    { input: "12 15", expectedOutput: "12" },
  ],
  "maximum-xor": [
    { input: "6\n3 10 5 25 2 8", expectedOutput: "28" },
    { input: "2\n0 0", expectedOutput: "0" },
    { input: "3\n2 4 7", expectedOutput: "6" },
    { input: "2\n1 2", expectedOutput: "3" },
  ],
  "count-primes": [
    { input: "10", expectedOutput: "4" },
    { input: "0", expectedOutput: "0" },
    { input: "1", expectedOutput: "0" },
    { input: "2", expectedOutput: "0" },
    { input: "100", expectedOutput: "25" },
  ],
  "palindrome-number": [
    { input: "121", expectedOutput: "true" },
    { input: "-121", expectedOutput: "false" },
    { input: "10", expectedOutput: "false" },
    { input: "0", expectedOutput: "true" },
  ],
  "gcd-of-two-numbers": [
    { input: "48 18", expectedOutput: "6" },
    { input: "17 13", expectedOutput: "1" },
    { input: "0 5", expectedOutput: "5" },
    { input: "1000000000 500000000", expectedOutput: "500000000" },
  ],
  "sqrt-x": [
    { input: "8", expectedOutput: "2" },
    { input: "4", expectedOutput: "2" },
    { input: "0", expectedOutput: "0" },
    { input: "2147395599", expectedOutput: "46339" },
  ],
  "happy-number": [
    { input: "19", expectedOutput: "true" },
    { input: "2", expectedOutput: "false" },
    { input: "1", expectedOutput: "true" },
    { input: "7", expectedOutput: "true" },
  ],
  "power-x-n": [
    { input: "2.0 10", expectedOutput: "1024.00000" },
    { input: "2.0 -2", expectedOutput: "0.25000" },
    { input: "2.1 3", expectedOutput: "9.26100" },
    { input: "1.0 -2147483648", expectedOutput: "1.00000" },
  ],
  "factorial-trailing-zeroes": [
    { input: "25", expectedOutput: "6" },
    { input: "5", expectedOutput: "1" },
    { input: "3", expectedOutput: "0" },
    { input: "100", expectedOutput: "24" },
  ],
  "roman-to-integer": [
    { input: "MCMXCIV", expectedOutput: "1994" },
    { input: "III", expectedOutput: "3" },
    { input: "LVIII", expectedOutput: "58" },
    { input: "IX", expectedOutput: "9" },
  ],
  "integer-to-roman": [
    { input: "58", expectedOutput: "LVIII" },
    { input: "1994", expectedOutput: "MCMXCIV" },
    { input: "3", expectedOutput: "III" },
    { input: "3999", expectedOutput: "MMMCMXCIX" },
  ],
  "excel-column-number": [
    { input: "AB", expectedOutput: "28" },
    { input: "ZY", expectedOutput: "701" },
    { input: "A", expectedOutput: "1" },
    { input: "FXSHRXW", expectedOutput: "2147483647" },
  ],
};
