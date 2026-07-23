import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FiArrowLeft,
  FiBriefcase,
  FiCheckCircle,
  FiFileText,
  FiShield,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const ResumeUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const selectedCompany = useMemo(() => {
    return localStorage.getItem("selectedCompany") || "General";
  }, []);

  const selectFile = (selectedFile) => {
    if (!selectedFile) {
      return;
    }

    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setFile(null);
      setAnalysisComplete(false);
      setMessage("Please upload only a PDF resume.");
      setMessageType("error");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setAnalysisComplete(false);
      setMessage("The resume must be smaller than 5 MB.");
      setMessageType("error");
      return;
    }

    setFile(selectedFile);
    setAnalysisComplete(false);
    setMessage("");
    setMessageType("");
  };

  const handleFileChange = (event) => {
    selectFile(event.target.files?.[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    selectFile(event.dataTransfer.files?.[0]);
  };

  const removeFile = (event) => {
    event.stopPropagation();

    setFile(null);
    setMessage("");
    setMessageType("");
    setAnalysisComplete(false);

    localStorage.removeItem("resumeData");
    localStorage.removeItem("interviewData");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const analyzeResume = async () => {
    if (!file) {
      setMessage("Please select your resume first.");
      setMessageType("error");
      return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisComplete(false);
      setMessage(
        `Analyzing your resume for the ${selectedCompany} interview...`
      );
      setMessageType("loading");

      const formData = new FormData();

      formData.append("resume", file);
      formData.append("company", selectedCompany);

      const response = await fetch(
        `${API_URL}/api/resume/analyze`,
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText = await response.text();

      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = {
          message:
            responseText ||
            "The server returned an invalid response.",
        };
      }

      if (!response.ok || data.success === false) {
        throw new Error(
          data.error ||
            data.message ||
            "Resume analysis failed."
        );
      }

      const resumeData = {
        ...data,
        selectedCompany,
        company: selectedCompany,
      };

      localStorage.setItem(
        "resumeData",
        JSON.stringify(resumeData)
      );

      /*
        Some backends return the interview details inside
        data.interview, while others return them directly.
        This supports both structures.
      */
      const generatedInterview =
        data.interview ||
        data.interviewData ||
        data.data?.interview ||
        data.data?.interviewData ||
        null;

      if (
        generatedInterview &&
        typeof generatedInterview === "object"
      ) {
        localStorage.setItem(
          "interviewData",
          JSON.stringify({
            ...generatedInterview,
            selectedCompany,
            company: selectedCompany,
          })
        );
      }

      setMessage(
        `${selectedCompany} interview profile created successfully.`
      );
      setMessageType("success");
      setAnalysisComplete(true);
    } catch (error) {
      console.error("Resume analysis error:", error);

      let errorMessage =
        error.message ||
        "Could not analyze the resume.";

      if (
        error instanceof TypeError &&
        error.message === "Failed to fetch"
      ) {
        errorMessage =
          "Could not connect to the PrepAI backend. Make sure the server is running on port 5000.";
      }

      setMessage(errorMessage);
      setMessageType("error");
      setAnalysisComplete(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openAnalysis = () => {
    navigate("/resume-analysis");
  };

  const formatFileSize = (bytes) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f2f5fa] text-slate-900">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-blue-200/45 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-44 -right-32 h-[460px] w-[460px] rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-3xl" />

      <header className="relative z-10 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm">
              P
            </div>

            <div className="text-left">
              <p className="font-bold tracking-tight">
                PrepAI
              </p>

              <p className="text-xs text-slate-500">
                Personal interview preparation
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
            <FiShield className="text-emerald-600" />
            Secure resume processing
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
        <button
          type="button"
          onClick={() => navigate("/company-selection")}
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <FiArrowLeft />
          Back to company selection
        </button>

        <div className="grid items-stretch gap-7 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.section
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="flex flex-col justify-between rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-[#172554] p-7 text-white shadow-2xl shadow-slate-400/20 sm:p-9"
          >
            <div>
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/80">
                Resume-based mock interview
              </span>

              <h1 className="mt-7 text-4xl font-semibold leading-tight tracking-[-0.04em]">
                Your resume becomes your interview.
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-white/65">
                Upload your resume and PrepAI will
                understand your projects, skills and
                experience to create relevant interview
                questions.
              </p>

              <div className="mt-7 rounded-2xl border border-blue-300/20 bg-blue-400/10 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-blue-200">
                    <FiBriefcase />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-blue-300">
                      Target company
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {selectedCompany}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/60">
                  Questions and evaluation will be adjusted
                  for the selected interview mode.
                </p>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              {[
                `Questions tailored for ${selectedCompany}`,
                "Questions based on your real projects",
                "Technical and HR interview preparation",
                "Answer ratings and improvement feedback",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-slate-900">
                    <FiCheckCircle size={15} />
                  </div>

                  <p className="text-sm text-white/85">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-xl shadow-slate-300/25 backdrop-blur-xl sm:p-8"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Resume upload
                </p>

                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  <FiBriefcase />
                  {selectedCompany}
                </span>
              </div>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Upload your latest resume
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Select a PDF file to begin your personalized
                analysis.
              </p>
            </div>

            <div
              onClick={() =>
                fileInputRef.current?.click()
              }
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-7 cursor-pointer rounded-2xl border-2 border-dashed p-6 transition ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : file
                    ? "border-emerald-300 bg-emerald-50/70"
                    : "border-slate-300 bg-slate-50/80 hover:border-blue-400 hover:bg-blue-50/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {!file ? (
                <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-lg shadow-blue-200">
                    <FiUploadCloud />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    Drop your resume here
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Click this area or drag and drop your PDF
                    resume.
                  </p>

                  <p className="mt-4 text-xs font-medium text-slate-400">
                    PDF only · Maximum file size 5 MB
                  </p>
                </div>
              ) : (
                <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-2xl text-white shadow-lg shadow-emerald-200">
                    <FiFileText />
                  </div>

                  <p className="mt-5 max-w-full truncate text-lg font-semibold">
                    {file.name}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    {formatFileSize(file.size)} · PDF
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                    <FiCheckCircle />
                    Ready to analyze
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-700"
                  >
                    <FiX />
                    Remove
                  </button>
                </div>
              )}
            </div>

            {message && (
              <div
                className={`mt-5 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
                  messageType === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : messageType === "loading"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {messageType === "loading" ? (
                  <span className="mt-0.5 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : messageType === "success" ? (
                  <FiCheckCircle className="mt-0.5 shrink-0" />
                ) : (
                  <FiX className="mt-0.5 shrink-0" />
                )}

                <span>{message}</span>
              </div>
            )}

            {!analysisComplete ? (
              <button
                type="button"
                onClick={analyzeResume}
                disabled={!file || isAnalyzing}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isAnalyzing ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Analyzing resume...
                  </>
                ) : (
                  `Analyze for ${selectedCompany}`
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={openAnalysis}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                View AI resume analysis
              </button>
            )}

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              Your resume is processed only for interview
              preparation.
            </p>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default ResumeUpload;
