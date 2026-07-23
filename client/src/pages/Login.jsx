import React, { useState } from "react";
import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setErrorMessage("");

      // Clear any existing Firebase session
      await signOut(auth);

      // Create a fresh provider every time
      const googleProvider = new GoogleAuthProvider();

      // Force Google to show the account-selection screen
      googleProvider.setCustomParameters({
        prompt: "select_account",
      });

      googleProvider.addScope("email");
      googleProvider.addScope("profile");

      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      console.log("Logged in user:", result.user);

      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        setErrorMessage(
          "Google login was cancelled. Please try again."
        );
      } else if (error.code === "auth/popup-blocked") {
        setErrorMessage(
          "The login popup was blocked. Please allow popups for this website."
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
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-purple-600 p-5 rounded-full">
            <FaRobot className="text-4xl" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-3">
          PrepAI 🚀
        </h1>

        <p className="text-gray-400 mb-8">
          AI powered interview preparation platform
        </p>

        {/* Google Login Button */}
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
            : "Continue with Google"}
        </button>

        {errorMessage && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        <p className="text-gray-500 text-sm mt-6">
          Resume Analysis • AI Interview • Performance
          Report
        </p>
      </motion.div>
    </div>
  );
};

export default Login;