import { motion } from "framer-motion";
import {
  BsFileEarmarkText,
  BsMic,
  BsRobot,
  BsGraphUp,
  BsDownload,
  BsShieldCheck,
  BsCodeSlash,
} from "react-icons/bs";
import { Link } from "react-router-dom";

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
              key={feature.title || index}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
              transition={{ duration: 0.3 }}
              className="h-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 text-white">
                {feature.icon}
              </div>

              <h3 className="mb-3 text-2xl font-semibold text-white">
                {feature.title}
              </h3>

              <p className="leading-7 text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="relative mt-10 overflow-hidden rounded-3xl border border-purple-400/20 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-8 shadow-2xl shadow-purple-950/20 md:p-10"
        >
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10 text-2xl text-purple-300">
                  <BsCodeSlash />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
                    Coding Workspace
                  </p>
                  <h3 className="mt-1 text-3xl font-bold text-white">
                    DSA Hub
                  </h3>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Build interview-ready problem-solving skills through
                structured practice, timed contests,
                personalized roadmaps, and performance analytics.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Topic Practice",
                  "Coding Contests",
                  "Learning Roadmaps",
                  "Analytics",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-sm text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <Link
              to="/dsa"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-purple-50"
            >
              Explore DSA Hub
              <span className="ml-2">→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Features;
