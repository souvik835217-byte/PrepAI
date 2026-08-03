import React, { useState } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import DSANav from "../components/DSANav";
import DSAHome from "../pages/DSAHome";
import TopicPractice from "../pages/TopicPractice";
import QuestionList from "../pages/QuestionList";
import SolveQuestion from "../pages/SolveQuestion";
import DSASubmissionHistory from "../pages/DSASubmissionHistory";
import CompanyPractice from "../pages/CompanyPractice";
import CompanyQuestions from "../pages/CompanyQuestions";
import DSAAnalytics from "../pages/DSAAnalytics";
import LearningRoadmap from "../pages/LearningRoadmap";
import ContestArena from "../pages/ContestArena";
import ContestDetails from "../pages/ContestDetails";
import ContestSession from "../pages/ContestSession";
import ContestResult from "../pages/ContestResult";
import ContestHistory from "../pages/ContestHistory";
import ContestLeaderboard from "../pages/ContestLeaderboard";
import ContestSolutions from "../pages/ContestSolutions";
import Playground from "../pages/Playground";

const DSALayout = () => {
  const [isSidebarVisible, setIsSidebarVisible] =
    useState(true);

  return (
    <div className="min-h-screen bg-slate-950 lg:flex">
      {isSidebarVisible && <DSANav />}

      <button
        type="button"
        onClick={() =>
          setIsSidebarVisible((currentValue) => !currentValue)
        }
        title={
          isSidebarVisible
            ? "Hide DSA Hub"
            : "Show DSA Hub"
        }
        aria-label={
          isSidebarVisible
            ? "Hide DSA Hub"
            : "Show DSA Hub"
        }
        aria-expanded={isSidebarVisible}
        className={`fixed top-1/2 z-50 hidden h-12 w-8 -translate-y-1/2 items-center justify-center rounded-r-xl border border-l-0 border-slate-700 bg-slate-900 text-slate-300 shadow-xl transition-all duration-300 hover:bg-indigo-600 hover:text-white lg:flex ${
          isSidebarVisible ? "left-64" : "left-0"
        }`}
      >
        {isSidebarVisible ? (
          <FiChevronLeft />
        ) : (
          <FiChevronRight />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
};

const DSARoutes = () => {
  return (
    <Routes>
      <Route element={<DSALayout />}>
        <Route index element={<DSAHome />} />

        <Route path="topics" element={<TopicPractice />} />

        <Route
          path="topics/:topicId"
          element={<QuestionList />}
        />

        <Route
          path="topics/:topicId/questions/:questionId"
          element={<SolveQuestion />}
        />

        <Route
          path="submissions"
          element={<DSASubmissionHistory />}
        />

        <Route path="companies" element={<CompanyPractice />} />

        <Route
          path="companies/:companyId"
          element={<CompanyQuestions />}
        />

        <Route
          path="companies/:companyId/questions/:questionId"
          element={<SolveQuestion />}
        />

        <Route
          path="playground"
          element={<Playground />}
        />

        <Route
          path="contests"
          element={<ContestArena />}
        />

        <Route
          path="contests/:contestId"
          element={<ContestDetails />}
        />

        <Route
          path="contests/:contestId/session"
          element={<ContestSession />}
        />

        <Route
          path="contests/:contestId/result"
          element={<ContestResult />}
        />

        <Route
          path="contests/:contestId/leaderboard"
          element={<ContestLeaderboard />}
        />

        <Route
          path="contests/:contestId/solutions"
          element={<ContestSolutions />}
        />

        <Route
          path="contest-history"
          element={<ContestHistory />}
        />

        <Route
          path="analytics"
          element={<DSAAnalytics />}
        />

        <Route
          path="learning-roadmap"
          element={<LearningRoadmap />}
        />

        <Route
          path="*"
          element={<Navigate to="/dsa" replace />}
        />

      </Route>
    </Routes>
  );
};

export default DSARoutes;
