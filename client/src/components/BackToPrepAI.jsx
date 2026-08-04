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
      to="/"
      onClick={handleHomeClick}
      aria-label="Go to PrepAI landing page"
      title="PrepAI Home"
      className="fixed bottom-4 left-4 z-[100] inline-flex items-center gap-2 rounded-xl border border-slate-700/90 bg-slate-950/95 px-3.5 py-3 text-sm font-semibold text-slate-200 shadow-xl shadow-slate-950/25 backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-500 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:bottom-auto sm:left-5 sm:top-1/2 sm:-translate-y-1/2 sm:hover:-translate-y-[calc(50%+2px)]"
    >
      <FiHome aria-hidden="true" />
      <span className="sm:hidden xl:inline">Home</span>
    </Link>
  );
};

export default BackToPrepAI;
