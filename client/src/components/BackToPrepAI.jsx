import { FiHome } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const BackToPrepAI = () => {
  const { pathname } = useLocation();

  const handleHomeClick = (event) => {
    const generationInProgress =
      sessionStorage.getItem(
        "prepaiInterviewGenerationInProgress"
      ) === "true";
    const interviewInProgress = pathname === "/interview";

    if (!generationInProgress && !interviewInProgress) {
      return;
    }

    const message = generationInProgress
      ? "Your interview questions are still being generated. Leaving now will cancel the process. Do you want to go Home?"
      : "Your interview is still in progress. Leaving now will end this attempt. Do you want to go Home?";

    if (!window.confirm(message)) {
      event.preventDefault();
    }
  };

  // The dashboard already provides a PrepAI logo and Home navigation in its
  // header; another fixed control would overlap the header actions.
  if (pathname === "/" || pathname === "/dashboard") {
    return null;
  }

  return (
    <Link
      to="/dashboard"
      onClick={handleHomeClick}
      aria-label="Go to dashboard home"
      className="fixed right-4 top-4 z-[100] inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/95 px-4 py-2.5 text-sm font-semibold text-slate-200 shadow-lg shadow-slate-950/20 backdrop-blur transition hover:border-blue-500 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:right-6 sm:top-5"
    >
      <FiHome aria-hidden="true" />
      <span>Home</span>
    </Link>
  );
};

export default BackToPrepAI;
