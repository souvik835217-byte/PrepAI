import { motion } from "framer-motion";
import {
  BsFileEarmarkText,
  BsMic,
  BsRobot,
  BsGraphUp,
  BsDownload,
  BsShieldCheck,
} from "react-icons/bs";

const features = [
  {
    icon: <BsFileEarmarkText size={34} />,
    title: "Resume Analysis",
    description:
      "Upload your resume and receive an ATS score with AI-powered improvement suggestions.",
  },
  {
    icon: <BsRobot size={34} />,
    title: "AI Question Generator",
    description:
      "Generate personalized interview questions based on your resume and target job role.",
  },
  {
    icon: <BsMic size={34} />,
    title: "Voice Interview",
    description:
      "Practice interviews with AI using real-time voice conversations and feedback.",
  },
  {
    icon: <BsGraphUp size={34} />,
    title: "Performance Analytics",
    description:
      "Track interview scores, strengths, weaknesses, and improvement over time.",
  },
  {
    icon: <BsDownload size={34} />,
    title: "Download Reports",
    description:
      "Export detailed interview reports and AI feedback as professional PDFs.",
  },
  {
    icon: <BsShieldCheck size={34} />,
    title: "Secure & Private",
    description:
      "Your resumes, interview history, and personal data are securely protected.",
  },
];

function Features() {
  return (
    <section className="bg-slate-900 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white">
            Powerful Features
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Everything you need to prepare smarter, improve faster,
            and confidently crack your next interview.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white mb-6">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-semibold text-white mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-7">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;