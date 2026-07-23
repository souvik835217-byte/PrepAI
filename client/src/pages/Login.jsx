import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../context/authContextStore";
import { auth } from "../firebase/firebase";

const getAuthErrorMessage = (error) => {
  const messages = {
    "auth/email-already-in-use":
      "An account already exists for this email. Try logging in.",
    "auth/invalid-credential":
      "The email or password is incorrect.",
    "auth/invalid-email":
      "Enter a valid email address.",
    "auth/operation-not-allowed":
      "Email/password login is not enabled yet. Enable it in Firebase Authentication.",
    "auth/popup-blocked":
      "The Google login popup was blocked. Allow popups and try again.",
    "auth/popup-closed-by-user":
      "The Google login window was closed before completion.",
    "auth/too-many-requests":
      "Too many attempts. Please wait a moment and try again.",
    "auth/unauthorized-domain":
      "This website domain is not authorized in Firebase.",
    "auth/user-not-found":
      "No account was found for this email.",
    "auth/weak-password":
      "Use a password with at least six characters.",
  };

  return (
    messages[error?.code] ||
    error?.message ||
    "Authentication failed. Please try again."
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const isSignUp = searchParams.get("mode") === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingAction, setLoadingAction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const completeAuthentication = (firebaseUser, message) => {
    setUser(firebaseUser);
    navigate("/", {
      replace: true,
      state: {
        authMessage: message,
      },
    });
  };

  const handleEmailAuthentication = async (event) => {
    event.preventDefault();

    if (loadingAction) {
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setErrorMessage("Enter your email and password.");
      return;
    }

    if (isSignUp && !name.trim()) {
      setErrorMessage("Enter your name.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage(
        "Password must contain at least six characters."
      );
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setErrorMessage("The passwords do not match.");
      return;
    }

    setLoadingAction("email");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (isSignUp) {
        const credential =
          await createUserWithEmailAndPassword(
            auth,
            normalizedEmail,
            password
          );

        await updateProfile(credential.user, {
          displayName: name.trim(),
        });

        completeAuthentication(
          credential.user,
          `Welcome, ${name.trim().split(" ")[0]}! Your account is ready.`
        );
        return;
      }

      const credential =
        await signInWithEmailAndPassword(
          auth,
          normalizedEmail,
          password
        );

      completeAuthentication(
        credential.user,
        `Welcome back${
          credential.user.displayName
            ? `, ${credential.user.displayName.split(" ")[0]}`
            : ""
        }!`
      );
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setLoadingAction("");
    }
  };

  const handleGoogleLogin = async () => {
    if (loadingAction) {
      return;
    }

    setLoadingAction("google");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });
      provider.addScope("email");
      provider.addScope("profile");

      const result = await signInWithPopup(auth, provider);

      completeAuthentication(
        result.user,
        `Welcome${
          result.user.displayName
            ? `, ${result.user.displayName.split(" ")[0]}`
            : ""
        }! You are signed in.`
      );
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setLoadingAction("");
    }
  };

  const handleForgotPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMessage(
        "Enter your email first, then select Forgot password."
      );
      return;
    }

    setLoadingAction("reset");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
      setSuccessMessage(
        "Password reset email sent. Check your inbox."
      );
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setLoadingAction("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-5 text-white sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md rounded-3xl border border-gray-800 bg-gray-900 p-7 text-center shadow-2xl sm:p-10"
      >
        <Link
          to="/"
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600"
          aria-label="Back to PrepAI home"
        >
          <FaRobot className="text-3xl" />
        </Link>

        <h1 className="text-3xl font-bold sm:text-4xl">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>

        <p className="mb-7 mt-3 text-sm leading-6 text-gray-400">
          {isSignUp
            ? "Join PrepAI and start practicing for free."
            : "Sign in to continue your interview preparation."}
        </p>

        <form
          onSubmit={handleEmailAuthentication}
          className="space-y-4 text-left"
        >
          {isSignUp && (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-300">
                Name
              </span>
              <span className="relative block">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  autoComplete="name"
                  placeholder="Your name"
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                />
              </span>
            </label>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </span>
            <span className="relative block">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-700 bg-gray-950 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </span>
            <span className="relative block">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete={
                  isSignUp
                    ? "new-password"
                    : "current-password"
                }
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-gray-700 bg-gray-950 py-3 pl-11 pr-12 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword((visible) => !visible)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </span>
          </label>

          {isSignUp && (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-300">
                Confirm password
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                autoComplete="new-password"
                placeholder="Enter password again"
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
              />
            </label>
          )}

          {!isSignUp && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={Boolean(loadingAction)}
                className="text-sm font-medium text-purple-400 transition hover:text-purple-300 disabled:opacity-60"
              >
                {loadingAction === "reset"
                  ? "Sending..."
                  : "Forgot password?"}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={Boolean(loadingAction)}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3 font-semibold text-white shadow-lg shadow-purple-950/20 transition hover:from-purple-700 hover:to-blue-700 disabled:cursor-wait disabled:opacity-60"
          >
            {loadingAction === "email"
              ? isSignUp
                ? "Creating account..."
                : "Signing in..."
              : isSignUp
              ? "Create account"
              : "Log in"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-gray-800" />
          <span className="text-xs uppercase tracking-wider text-gray-500">
            or
          </span>
          <span className="h-px flex-1 bg-gray-800" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={Boolean(loadingAction)}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-wait disabled:opacity-60"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt=""
            className="h-6 w-6"
          />
          {loadingAction === "google"
            ? "Opening Google..."
            : "Continue with Google"}
        </button>

        {errorMessage && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
          >
            {successMessage}
          </div>
        )}

        <p className="mt-6 text-sm text-gray-400">
          {isSignUp
            ? "Already have an account?"
            : "New to PrepAI?"}{" "}
          <Link
            to={
              isSignUp
                ? "/login"
                : "/login?mode=signup"
            }
            className="font-semibold text-purple-400 transition hover:text-purple-300"
          >
            {isSignUp ? "Log in" : "Sign up free"}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
