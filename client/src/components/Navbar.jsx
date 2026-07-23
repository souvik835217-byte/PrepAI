import {
  useEffect,
  useRef,
  useState,
} from "react";
import { signOut } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiGrid,
  FiLogIn,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
  const [toastMessage, setToastMessage] = useState("");
  const profileMenuRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOutsideInteraction = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener(
      "pointerdown",
      handleOutsideInteraction
    );
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsideInteraction
      );
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  useEffect(() => {
    const authMessage = location.state?.authMessage;

    if (!authMessage) {
      return;
    }

    setToastMessage(authMessage);

    navigate(
      `${location.pathname}${location.search}${location.hash}`,
      {
        replace: true,
        state: null,
      }
    );
  }, [
    location.hash,
    location.pathname,
    location.search,
    location.state,
    navigate,
  ]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToastMessage("");
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);
      setLogoutError("");
      await signOut(auth);
      setIsProfileOpen(false);
      setToastMessage("You have been logged out.");
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

        <div
          ref={profileMenuRef}
          className="relative"
        >
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

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                id="profile-menu"
                role="menu"
                initial={{
                  opacity: 0,
                  y: -8,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -6,
                  scale: 0.97,
                }}
                transition={{ duration: 0.16 }}
                className="absolute right-0 top-14 w-64 origin-top-right overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-300/30"
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed right-4 top-24 z-[60] max-w-[calc(100vw-2rem)] rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-xl shadow-emerald-900/10 sm:right-6"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
