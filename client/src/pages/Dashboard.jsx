import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  FaArrowRight,
  FaBolt,
  FaBriefcase,
  FaChartLine,
  FaClock,
  FaFileAlt,
  FaHistory,
  FaPlus,
  FaRedo,
  FaSignOutAlt,
  FaStar,
  FaTrophy,
  FaUser,
} from "react-icons/fa";

import { auth } from "../firebase/firebase";

const API_URL =
  import.meta.env.VITE_API_URL || "http://import.meta.env.VITE_API_URL";

const EMPTY_ANALYTICS = {
  totalInterviews: 0,
  averageScore: 0,
  bestScore: 0,
  latestScore: 0,

  strongestSkill: "No data",
  strongestSkillScore: 0,

  weakestSkill: "No data",
  weakestSkillScore: 0,

  categoryAverages: {
    communication: 0,
    technicalKnowledge: 0,
    confidence: 0,
    grammar: 0,
    problemSolving: 0,
  },

  scoreTrend: [],
  recentInterviews: [],
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(EMPTY_ANALYTICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("Candidate");
  const [isLoggingOut, setIsLoggingOut] =
    useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] =
    useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);
      setIsProfileMenuOpen(false);
      setError("");
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (logoutError) {
      console.error("Logout error:", logoutError);
      setError(
        "Could not log out. Please try again."
      );
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        if (isMounted) {
          setLoading(false);
          setError("Please sign in to view your dashboard.");
        }

        return;
      }

      const displayName =
        user.displayName?.split(" ")[0] ||
        user.email?.split("@")[0] ||
        "Candidate";

      if (isMounted) {
        setUserName(displayName);
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/dashboard-analytics/${user.uid}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load dashboard analytics"
          );
        }

        if (isMounted) {
          setAnalytics({
            ...EMPTY_ANALYTICS,
            ...data.analytics,

            categoryAverages: {
              ...EMPTY_ANALYTICS.categoryAverages,
              ...(data.analytics?.categoryAverages || {}),
            },
          });
        }
      } catch (fetchError) {
        console.error(
          "Dashboard analytics error:",
          fetchError
        );

        if (isMounted) {
          setError(
            fetchError.message ||
              "Could not connect to the analytics server."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const skillData = useMemo(() => {
    const scores = analytics.categoryAverages || {};

    return [
      {
        name: "Communication",
        shortName: "Communication",
        score: Number(scores.communication || 0),
      },
      {
        name: "Technical Knowledge",
        shortName: "Technical",
        score: Number(scores.technicalKnowledge || 0),
      },
      {
        name: "Confidence",
        shortName: "Confidence",
        score: Number(scores.confidence || 0),
      },
      {
        name: "Grammar",
        shortName: "Grammar",
        score: Number(scores.grammar || 0),
      },
      {
        name: "Problem Solving",
        shortName: "Problem Solving",
        score: Number(scores.problemSolving || 0),
      },
    ];
  }, [analytics.categoryAverages]);

  const trendData = useMemo(() => {
    return (analytics.scoreTrend || []).map(
      (item, index) => ({
        ...item,
        label: `Interview ${
          item.interviewNumber || index + 1
        }`,
        score: Number(item.score || 0),
      })
    );
  }, [analytics.scoreTrend]);

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Date unavailable";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const openHistoryReport = (interview) => {
    if (!interview?.id) {
      return;
    }

    navigate("/history");
  };

  const startInterviewSetup = () => {
  navigate("/company-selection");
};

  const statCards = [
    {
      title: "Total interviews",
      value: analytics.totalInterviews,
      suffix: "",
      description: "Completed sessions",
      icon: FaBriefcase,
    },
    {
      title: "Average score",
      value: analytics.averageScore,
      suffix: "%",
      description: "Across all interviews",
      icon: FaChartLine,
    },
    {
      title: "Best score",
      value: analytics.bestScore,
      suffix: "%",
      description: "Your highest performance",
      icon: FaTrophy,
    },
    {
      title: "Latest score",
      value: analytics.latestScore,
      suffix: "%",
      description: "Most recent attempt",
      icon: FaClock,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin mx-auto" />

          <h2 className="mt-5 text-xl font-semibold text-slate-900">
            Preparing your dashboard
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Loading your interview performance and progress.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold">
              P
            </div>

            <div className="text-left">
              <h1 className="font-bold text-lg leading-tight">
                PrepAI
              </h1>

              <p className="text-xs text-slate-500">
                Interview intelligence
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/history")}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold hover:bg-slate-50 transition"
            >
              <FaHistory />
              History
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setIsProfileMenuOpen(
                    (isOpen) => !isOpen
                  )
                }
                disabled={isLoggingOut}
                aria-label="Open profile menu"
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
                title="Profile"
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-wait disabled:opacity-60"
              >
                <FaUser />
              </button>

              {isProfileMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-300/30"
                >
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {auth.currentUser?.displayName ||
                        userName}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {auth.currentUser?.email ||
                        "Signed-in account"}
                    </p>
                  </div>

                  <div className="p-2">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
                    >
                      <FaSignOutAlt />
                      {isLoggingOut
                        ? "Logging out..."
                        : "Log out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            <p className="font-semibold">
              Analytics could not be loaded
            </p>

            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        <section className="rounded-[28px] bg-slate-950 text-white px-6 py-8 md:px-10 md:py-10 overflow-hidden relative">
          <div className="absolute w-72 h-72 rounded-full bg-blue-500/20 blur-3xl -top-28 -right-20" />

          <div className="absolute w-56 h-56 rounded-full bg-violet-500/20 blur-3xl -bottom-24 left-1/3" />

          <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <p className="text-blue-300 text-sm font-semibold uppercase tracking-[0.2em]">
                Performance dashboard
              </p>

              <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
                Welcome back, {userName}.
              </h2>

              <p className="mt-4 text-slate-300 max-w-2xl leading-7">
                Review your interview performance, identify
                improvement areas and continue building confidence
                for your next opportunity.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={startInterviewSetup}
                  className="flex items-center gap-2 rounded-xl bg-white text-slate-950 px-5 py-3 font-semibold hover:bg-slate-100 transition"
                >
                  <FaPlus />
                  Start new interview
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/history")}
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold hover:bg-white/15 transition"
                >
                  View history
                  <FaArrowRight />
                </button>
              </div>
            </div>

            <div className="min-w-[190px] rounded-3xl border border-white/10 bg-white/10 backdrop-blur px-6 py-6">
              <p className="text-sm text-slate-300">
                Current average
              </p>

              <div className="mt-2 flex items-end gap-1">
                <span className="text-5xl font-bold">
                  {analytics.averageScore}
                </span>

                <span className="text-xl pb-1 text-slate-300">
                  %
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-300">
                Based on {analytics.totalInterviews} completed{" "}
                {analytics.totalInterviews === 1
                  ? "interview"
                  : "interviews"}
              </p>
            </div>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <Icon />
                  </div>

                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1">
                    Updated
                  </span>
                </div>

                <p className="mt-5 text-sm text-slate-500">
                  {card.title}
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {card.value}
                  {card.suffix}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {card.description}
                </p>
              </div>
            );
          })}
        </section>

        <section className="grid lg:grid-cols-[1.45fr_1fr] gap-6 mt-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Score progress
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  Interview performance trend
                </h3>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FaChartLine />
              </div>
            </div>

            <div className="h-[300px] mt-6">
              {trendData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart
                    data={trendData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -20,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="scoreGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#2563eb"
                          stopOpacity={0.25}
                        />

                        <stop
                          offset="95%"
                          stopColor="#2563eb"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e2e8f0"
                    />

                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      formatter={(value) => [
                        `${value}%`,
                        "Score",
                      ]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#2563eb"
                      strokeWidth={3}
                      fill="url(#scoreGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart
                  title="No score trend yet"
                  description="Complete an interview to see your progress."
                />
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-violet-600">
                  Skill analysis
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  Category averages
                </h3>
              </div>

              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <FaStar />
              </div>
            </div>

            <div className="h-[300px] mt-6">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={skillData}
                  layout="vertical"
                  margin={{
                    top: 0,
                    right: 20,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    horizontal={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    hide
                  />

                  <YAxis
                    type="category"
                    dataKey="shortName"
                    width={105}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${value}%`,
                      "Score",
                    ]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                    }}
                  />

                  <Bar
                    dataKey="score"
                    fill="#7c3aed"
                    radius={[0, 8, 8, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-6">
          <PerformanceCard
            icon={<FaBolt />}
            label="Strongest area"
            title={analytics.strongestSkill}
            score={analytics.strongestSkillScore}
            description="This is currently your most consistent interview skill."
          />

          <PerformanceCard
            icon={<FaRedo />}
            label="Focus area"
            title={analytics.weakestSkill}
            score={analytics.weakestSkillScore}
            description="Improving this area can increase your overall interview score."
          />
        </section>

        <section className="grid lg:grid-cols-[1.35fr_0.65fr] gap-6 mt-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Recent activity
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  Recent interviews
                </h3>
              </div>

              <button
                type="button"
                onClick={() => navigate("/history")}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-2"
              >
                View all
                <FaArrowRight />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {analytics.recentInterviews?.length > 0 ? (
                analytics.recentInterviews.map(
                  (interview) => (
                    <button
                      type="button"
                      key={interview.id}
                      onClick={() =>
                        openHistoryReport(interview)
                      }
                      className="w-full rounded-2xl border border-slate-200 px-4 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                          <FaBriefcase className="text-slate-600" />
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold truncate">
                            {interview.targetRole ||
                              "Software Developer"}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                            <span>
                              {interview.candidateName ||
                                "Candidate"}
                            </span>

                            <span>
                              {formatDate(
                                interview.createdAt
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <p className="text-xl font-bold">
                            {interview.overallScore || 0}%
                          </p>

                          <p className="text-xs text-slate-500">
                            {interview.recommendationTitle ||
                              "Completed"}
                          </p>
                        </div>

                        <FaArrowRight className="text-slate-400" />
                      </div>
                    </button>
                  )
                )
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                  <p className="font-semibold">
                    No interviews completed yet
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Start your first interview to generate
                    analytics.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 md:p-7 shadow-sm">
            <p className="text-blue-100 text-sm font-semibold">
              Continue preparing
            </p>

            <h3 className="mt-2 text-2xl font-bold">
              Ready for your next interview?
            </h3>

            <p className="mt-3 text-sm leading-6 text-blue-100">
              Choose your target company, role and difficulty.
              PrepAI will then generate questions using your
              resume.
            </p>

            <div className="mt-7 space-y-3">
              <button
                type="button"
                onClick={startInterviewSetup}
                className="w-full rounded-xl bg-white text-blue-700 px-4 py-3 font-semibold flex items-center justify-center gap-2 hover:bg-blue-50 transition"
              >
                <FaFileAlt />
                Configure interview
              </button>

              <button
                type="button"
                onClick={startInterviewSetup}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-semibold flex items-center justify-center gap-2 hover:bg-white/15 transition"
              >
                <FaBolt />
                Start new interview
              </button>

              <button
                type="button"
                onClick={() => navigate("/history")}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-semibold flex items-center justify-center gap-2 hover:bg-white/15 transition"
              >
                <FaHistory />
                Interview history
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const PerformanceCard = ({
  icon,
  label,
  title,
  score,
  description,
}) => {
  const safeScore = Math.max(
    0,
    Math.min(Number(score || 0), 100)
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
          {icon}
        </div>

        <div className="flex-1">
          <p className="text-sm text-slate-500">{label}</p>

          <div className="mt-1 flex items-end justify-between gap-4">
            <h3 className="text-xl font-bold">{title}</h3>

            <p className="text-xl font-bold">
              {safeScore}%
            </p>
          </div>

          <div className="mt-4 h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-slate-900 transition-all duration-500"
              style={{
                width: `${safeScore}%`,
              }}
            />
          </div>

          <p className="mt-3 text-sm text-slate-500 leading-6">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const EmptyChart = ({ title, description }) => {
  return (
    <div className="h-full rounded-2xl border border-dashed border-slate-300 flex items-center justify-center text-center px-6">
      <div>
        <FaChartLine className="mx-auto text-2xl text-slate-400" />

        <p className="mt-3 font-semibold">{title}</p>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
