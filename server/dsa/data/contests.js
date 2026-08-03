export const contests = [
  {
    id: "weekly-contest-1",
    title: "PrepAI Weekly Contest #1",
    description:
      "Solve four interview-focused DSA problems within the contest time.",
    duration: 90,
    totalPoints: 400,
    status: "live",
    startTime: null,
    endTime: null,

    problemIds: [
      "two-sum",
      "merge-intervals",
      "number-of-islands",
      "lru-cache",
    ],
  },

  {
    id: "array-mock-test",
    title: "Array Interview Mock Test",
    description:
      "Practice important array questions commonly asked in technical interviews.",
    duration: 45,
    totalPoints: 200,
    status: "upcoming",
    startTime: null,
    endTime: null,

    problemIds: ["two-sum", "merge-intervals"],
  },

  {
    id: "weekly-contest-2",
    title: "PrepAI Weekly Contest #2",
    description: "Second weekly coding contest.",
    duration: 60,
    totalPoints: 300,
    status: "upcoming",

    problemIds: [
      "two-sum",
      "number-of-islands",
      "lru-cache",
    ],
  },
];

export const getContestById = (contestId) => {
  return contests.find((contest) => contest.id === contestId);
};
