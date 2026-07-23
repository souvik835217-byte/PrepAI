import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContextStore";
import { auth } from "../firebase/firebase";

const navigationItems = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it Works" },
  { href: "#reviews", label: "Reviews" },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);
      setLogoutError("");
      await signOut(auth);
      setIsMenuOpen(false);
      navigate("/", { replace: true });
    } catch {
      setLogoutError("Could not log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-gray-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="group flex items-center gap-3"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg transition-transform duration-300 group-hover:scale-105">
            <img
              src="/favicon.svg"
              alt=""
              className="h-7 w-7"
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

        <div className="hidden items-center gap-8 font-medium text-gray-600 md:flex">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition hover:text-purple-600"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {!user && (
            <Link
              to="/login"
              className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2.5 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700 sm:px-6"
            >
              Login
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="site-navigation-menu"
            aria-label={
              isMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            className={`rounded-xl border border-gray-200 p-2.5 text-xl text-gray-700 transition hover:border-purple-300 hover:text-purple-600 ${
              user ? "" : "md:hidden"
            }`}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div
          id="site-navigation-menu"
          className={`border-t border-gray-200 bg-white px-6 py-4 shadow-lg ${
            user ? "" : "md:hidden"
          }`}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-3 font-medium text-gray-700 transition hover:bg-purple-50 hover:text-purple-700"
              >
                {item.label}
              </a>
            ))}

            {user && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-2 rounded-lg border-t border-gray-200 px-3 py-3 font-semibold text-purple-700 transition hover:bg-purple-50"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="mt-2 rounded-lg border-t border-gray-200 px-3 py-3 text-left font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
                >
                  {isLoggingOut
                    ? "Logging out..."
                    : "Log out"}
                </button>

                {logoutError && (
                  <p
                    role="alert"
                    className="px-3 pb-2 text-sm text-red-600"
                  >
                    {logoutError}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
