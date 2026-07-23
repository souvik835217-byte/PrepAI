import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import CompanySelection from "../pages/CompanySelection";
import EvaluatingInterview from "../pages/EvaluatingInterview";
import InterviewSetup from "../pages/InterviewSetup";
import PreparingInterview from "../pages/PreparingInterview";

const Home = lazy(() => import("../pages/Home"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Login = lazy(() => import("../pages/Login"));
const ResumeUpload = lazy(() => import("../pages/ResumeUpload"));
const Interview = lazy(() => import("../pages/Interview"));
const Result = lazy(() => import("../pages/Result"));
const ResumeAnalysis = lazy(() =>
  import("../pages/ResumeAnalysis")
);
const History = lazy(() => import("../pages/History"));

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
    Loading...
  </div>
);

const requireAuth = (page) => (
  <ProtectedRoute>{page}</ProtectedRoute>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={requireAuth(<Dashboard />)}
        />
        <Route
          path="/history"
          element={requireAuth(<History />)}
        />
        <Route
          path="/company-selection"
          element={requireAuth(<CompanySelection />)}
        />
        <Route
          path="/interview-setup"
          element={requireAuth(<InterviewSetup />)}
        />
        <Route
          path="/resume"
          element={requireAuth(<ResumeUpload />)}
        />
        <Route
          path="/resume-upload"
          element={requireAuth(<ResumeUpload />)}
        />
        <Route
          path="/resume-analysis"
          element={requireAuth(<ResumeAnalysis />)}
        />
        <Route
          path="/preparing-interview"
          element={requireAuth(<PreparingInterview />)}
        />
        <Route
          path="/interview"
          element={requireAuth(<Interview />)}
        />
        <Route
          path="/evaluating-interview"
          element={requireAuth(<EvaluatingInterview />)}
        />
        <Route
          path="/result"
          element={requireAuth(<Result />)}
        />
        <Route
          path="/interview/result"
          element={requireAuth(<Result />)}
        />
      </Routes>
    </Suspense>
  );
}
