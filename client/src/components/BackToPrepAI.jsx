import { FiHome } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const BackToPrepAI = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    const generationInProgress =
      sessionStorage.getItem(
        "prepaiInterviewGenerationInProgress"
      ) === "true";
    const interviewInProgress = pathname === "/interview";

    if (generationInProgress || interviewInProgress) {
      const message = generationInProgress
        ? "Your interview questions are still being generated. Leaving now will cancel the process. Do you want to go Home?"
        : "Your interview is still in progress. Leaving now will end this attempt. Do you want to go Home?";

      if (!window.confirm(message)) {
        return;
      }
    }

    navigate("/", {
      replace: true,
      state: { resetPrepAIHistory: true },
    });
  };

  // The dashboard already provides a PrepAI logo and Home navigation in its
  // header; another fixed control would overlap the header actions.
  if (pathname === "/" || pathname === "/dashboard") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleHomeClick}
      aria-label="Go to PrepAI landing page"
      title="PrepAI Home"
      className="fixed right-4 top-3 z-[100] inline-flex h-9 items-center gap-2 rounded-lg border border-indigo-400/30 bg-slate-900/95 px-3.5 text-sm font-semibold text-slate-100 shadow-lg shadow-slate-950/30 backdrop-blur transition hover:-translate-y-0.5 hover:border-indigo-400/60 hover:bg-indigo-500/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 sm:right-6 sm:px-4"
    >
      <FiHome aria-hidden="true" />
      <span>Home</span>
    </button>
  );
};

export default BackToPrepAI;
