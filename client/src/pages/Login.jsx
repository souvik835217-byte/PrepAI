import React, { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../context/authContextStore";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const isSignUp =
    searchParams.get("mode") === "signup";

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleLogin = async () => {
    if (loading) return;

    setLoading(true);
    setErrorMessage("");

    try {
      // Create a fresh provider for every login attempt
      const provider = new GoogleAuthProvider();

      // Ask Google to show the account chooser
      provider.setCustomParameters({
        prompt: "select_account",
      });

      provider.addScope("email");
      provider.addScope("profile");

      // Call popup directly from the button click.
      // Do not await signOut() before this.
      const result = await signInWithPopup(
        auth,
        provider
      );

      setUser(result.user);
      navigate("/", {
        replace: true,
        state: {
          authMessage: `Welcome${
            result.user.displayName
              ? `, ${result.user.displayName.split(" ")[0]}`
              : ""
          }! You are signed in.`,
        },
      });
    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      if (error.code === "auth/popup-blocked") {
        setErrorMessage(
          "The Google login popup was blocked. Allow popups for this website and try again."
        );
      } else if (
        error.code === "auth/popup-closed-by-user"
      ) {
        setErrorMessage(
          "The Google login window was closed before login completed."
        );
      } else if (
        error.code === "auth/unauthorized-domain"
      ) {
        setErrorMessage(
          "This website domain is not authorized in Firebase."
        );
      } else {
        setErrorMessage(
          error.message ||
            "Google login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-md text-center border border-gray-800"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-purple-600 p-5 rounded-full">
            <FaRobot className="text-4xl" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-3">
          PrepAI 🚀
        </h1>

        <p className="text-gray-400 mb-8">
          {isSignUp
            ? "Create your free account and start practicing."
            : "Sign in to continue your interview preparation."}
        </p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl font-semibold transition duration-300 ${
            loading
              ? "opacity-60 cursor-not-allowed"
              : "hover:bg-gray-200"
          }`}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-6 h-6"
          />

          {loading
            ? "Opening Google..."
            : isSignUp
            ? "Sign up with Google"
            : "Continue with Google"}
        </button>

        {errorMessage && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        <p className="text-gray-500 text-sm mt-6">
          Resume Analysis • AI Interview • Performance Report
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
