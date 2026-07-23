import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate("/login");
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
    <section className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 text-white px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-purple-400 font-semibold mb-4">
            🚀 AI Powered Interview Preparation
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Practice Smarter.
            <br />
            <span className="text-purple-400">
              Get Hired Faster.
            </span>
          </h1>

          <p className="mt-6 text-gray-300 text-lg">
            Upload your resume, let AI generate personalized interview
            questions, practice with voice interaction, and receive instant
            feedback.
          </p>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={handleStartFree}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold"
            >
              Start Free
            </button>

            <button
              type="button"
              onClick={handleLearnMore}
              className="border border-gray-400 hover:border-white px-6 py-3 rounded-xl"
            >
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center"
        >
          <div className="w-80 h-80 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-8xl shadow-2xl">
            🤖
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default Hero;
