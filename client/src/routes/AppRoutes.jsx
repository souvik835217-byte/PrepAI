import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import InterviewSetup from "../pages/InterviewSetup";
import PreparingInterview from "../pages/PreparingInterview";
import EvaluatingInterview from "../pages/EvaluatingInterview";
import CompanySelection from "../pages/CompanySelection";

const Home = lazy(() => import("../pages/Home"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Login = lazy(() => import("../pages/Login"));
const ResumeUpload = lazy(() =>
  import("../pages/ResumeUpload")
);
const Interview = lazy(() =>
  import("../pages/Interview")
);
const Result = lazy(() =>
  import("../pages/Result")
);
const ResumeAnalysis = lazy(() =>
  import("../pages/ResumeAnalysis")
);
const History = lazy(() =>
  import("../pages/History")
);

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
    Loading...
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/resume"
          element={<ResumeUpload />}
        />

        <Route
          path="/resume-upload"
          element={<ResumeUpload />}
        />

        <Route
          path="/resume-analysis"
          element={<ResumeAnalysis />}
        />

        <Route
          path="/interview"
          element={<Interview />}
        />

        <Route
          path="/result"
          element={<Result />}
        />

        <Route
          path="/interview/result"
          element={<Result />}
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/interview-setup" element={<InterviewSetup />} />


   

        <Route
        path="/preparing-interview"
        element={<PreparingInterview />}
        />

          <Route
          path="/evaluating-interview"
         element={<EvaluatingInterview />}
         />


        <Route
  path="/company-selection"
  element={<CompanySelection />}
/>




      </Routes>
    </Suspense>
  );
}