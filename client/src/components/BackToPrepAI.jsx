import { FiHome } from "react-icons/fi";
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
      to="/dashboard"
      aria-label="Go to dashboard home"
      className="fixed right-4 top-4 z-[100] inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/95 px-4 py-2.5 text-sm font-semibold text-slate-200 shadow-lg shadow-slate-950/20 backdrop-blur transition hover:border-blue-500 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:right-6 sm:top-5"
    >
      <FiHome aria-hidden="true" />
      <span>Home</span>
    </Link>
  );
};

export default BackToPrepAI;
