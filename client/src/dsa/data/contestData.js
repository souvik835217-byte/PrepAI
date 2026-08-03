const contestData = [
  {
    id: "weekly-contest-1",
    title: "PrepAI Weekly Contest #1",
    description:
      "Solve four DSA problems within 90 minutes and test your speed and accuracy.",
    status: "live",
    startTime: "2026-07-26T19:30:00",
    duration: 90,
    participants: 128,
    totalProblems: 4,
    difficulty: "Mixed",
    problems: [
      {
        id: "two-sum",
        label: "A",
        title: "Two Sum",
        difficulty: "Easy",
        marks: 100,
      },
      {
        id: "merge-intervals",
        label: "B",
        title: "Merge Intervals",
        difficulty: "Medium",
        marks: 100,
      },
      {
        id: "number-of-islands",
        label: "C",
        title: "Number of Islands",
        difficulty: "Medium",
        marks: 100,
      },
      {
        id: "lru-cache",
        label: "D",
        title: "LRU Cache",
        difficulty: "Hard",
        marks: 100,
      },
    ],
  },
  {
    id: "weekly-contest-2",
    title: "PrepAI Weekly Contest #2",
    description:
      "A timed contest covering arrays, strings, graphs and dynamic programming.",
    status: "upcoming",
    startTime: "2026-08-02T19:30:00",
    duration: 90,
    participants: 84,
    totalProblems: 4,
    difficulty: "Mixed",
    problems: [],
  },
  {
    id: "arrays-sprint-1",
    title: "Arrays Sprint Challenge",
    description:
      "A focused contest containing array and hashing problems.",
    status: "past",
    startTime: "2026-07-20T18:00:00",
    duration: 60,
    participants: 216,
    totalProblems: 3,
    difficulty: "Easy–Medium",
    problems: [],
    winner: "Rahul Sharma",
  },
];

export default contestData;