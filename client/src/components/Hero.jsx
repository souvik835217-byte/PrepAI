import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContextStore";

function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartFree = () => {
    navigate(user ? "/company-selection" : "/login");
  };

  const handleLearnMore = () => {
    document
      .getElementById("features")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <section className="flex min-h-[90vh] items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 px-6 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 font-semibold text-purple-400">
            PrepAI — Learn. Practice. Compete. Succeed.
          </p>

          <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
            Prepare Smarter.
            <br />
            <span className="text-purple-400">
              Practice DSA. Ace Interviews.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-300">
            Analyze your resume, master coding problems, compete in contests,
            and practice AI-powered interviews—all in one platform.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={handleStartFree}
              className="rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700"
            >
              Start Free
            </button>

            <button
              type="button"
              onClick={handleLearnMore}
              className="rounded-xl border border-gray-400 px-6 py-3 hover:border-white"
            >
              Learn More
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center"
        >
          <div className="flex h-52 w-52 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-6xl shadow-2xl sm:h-64 sm:w-64 sm:text-7xl lg:h-80 lg:w-80 lg:text-8xl">
            🤖
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
