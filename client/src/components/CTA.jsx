import { motion } from "framer-motion";
import { BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function CTA() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <section className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Ready to Ace Your Next Interview?
        </h2>

        <p className="text-gray-200 mt-6 text-lg leading-8">
          Upload your resume, practice with AI, improve your confidence, and
          receive instant feedback.
        </p>

        <button
          type="button"
          onClick={handleGetStarted}
          className="mt-10 bg-white text-purple-700 px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 mx-auto hover:scale-105 hover:shadow-xl transition duration-300"
        >
          Get Started Free
          <BsArrowRight />
        </button>
      </motion.div>
    </section>
  );
}

export default CTA;