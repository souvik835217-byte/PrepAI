import { useState } from "react";
import { signOut } from "firebase/auth";
import {
  FiGrid,
  FiLogIn,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContextStore";
import { auth } from "../firebase/firebase";

const navigationItems = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it Works" },
  { href: "#reviews", label: "Reviews" },
];

function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
      setIsProfileOpen(false);
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
          onClick={() => setIsProfileOpen(false)}
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

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setLogoutError("");
              setIsProfileOpen((open) => !open);
            }}
            aria-expanded={isProfileOpen}
            aria-controls="profile-menu"
            aria-label="Open account menu"
            title="Account"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-purple-200 bg-purple-50 text-xl text-purple-700 shadow-sm transition hover:border-purple-300 hover:bg-purple-100 focus:outline-none focus:ring-4 focus:ring-purple-100"
          >
            <FiUser />
          </button>

          {isProfileOpen && (
            <div
              id="profile-menu"
              className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-300/30"
            >
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {user?.displayName ||
                    (user ? "Signed-in user" : "Guest")}
                </p>
                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {user?.email ||
                    "Sign in to access your dashboard"}
                </p>
              </div>

              <div className="p-2">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-purple-50 hover:text-purple-700"
                    >
                      <FiGrid />
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
                    >
                      <FiLogOut />
                      {isLoggingOut
                        ? "Logging out..."
                        : "Log out"}
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
                  >
                    <FiLogIn />
                    Log in
                  </Link>
                )}

                {logoutError && (
                  <p
                    role="alert"
                    className="px-3 pb-2 pt-1 text-sm text-red-600"
                  >
                    {logoutError}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
