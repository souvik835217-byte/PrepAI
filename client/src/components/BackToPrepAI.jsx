import { FiArrowLeft } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const BackToPrepAI = () => {
  const { pathname } = useLocation();

  // The dashboard already provides a PrepAI logo and Home navigation in its
  // header; another fixed control would overlap the header actions.
  if (pathname === "/" || pathname === "/dashboard") {
    return null;
  }

  return (
    <Link
      to="/"
      aria-label="Back to PrepAI home"
      className="fixed right-4 top-4 z-[100] inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/95 px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-lg shadow-slate-950/10 backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:right-6 sm:top-5"
    >
      <FiArrowLeft aria-hidden="true" />
      <span className="hidden sm:inline">Back to</span>
      <span>PrepAI</span>
    </Link>
  );
};

export default BackToPrepAI;
