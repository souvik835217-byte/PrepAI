import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/70 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <img
              src="/favicon.svg"
              alt="PrepAI Logo"
              className="w-7 h-7"
            />
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              PrepAI
            </span>

            <span className="text-xs text-gray-500">
              AI Interview Platform
            </span>
          </div>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
          <a
            href="#features"
            className="hover:text-purple-600 transition"
          >
            Features
          </a>

          <a
            href="#how"
            className="hover:text-purple-600 transition"
          >
            How it Works
          </a>

          <a
            href="#reviews"
            className="hover:text-purple-600 transition"
          >
            Reviews
          </a>
        </div>

        {/* Login Button */}
        <Link
          to="/login"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md transition-all duration-300 hover:scale-105"
        >
          Login
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;