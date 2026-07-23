import { Link } from "react-router-dom";
import { BsRobot } from "react-icons/bs";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-purple-600 text-white p-2 rounded-xl">
            <BsRobot size={22} />
          </div>

          <span className="text-2xl font-bold text-gray-900">
            PrepAI
          </span>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex gap-8 text-gray-600 font-medium">
          <a href="#features" className="hover:text-purple-600">
            Features
          </a>

          <a href="#how" className="hover:text-purple-600">
            How it Works
          </a>

          <a href="#reviews" className="hover:text-purple-600">
            Reviews
          </a>
        </div>

        {/* Login Button */}
        <Link
          to="/login"
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl transition"
        >
          Login
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;
