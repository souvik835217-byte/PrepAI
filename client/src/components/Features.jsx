import { motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#060914] px-6 py-28 text-white">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-cover bg-[68%_center] opacity-[0.13] grayscale-[20%]"
        style={{ backgroundImage: "url('/images/prepai-cinematic-hero.png')" }}
        animate={reduceMotion ? undefined : { scale: [1.04, 1.1, 1.04], x: [0, -18, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#060914] via-[#060914]/90 to-[#060914]/55" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#060914] via-transparent to-[#060914]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.055] [background-image:linear-gradient(to_right,#a5b4fc_1px,transparent_1px),linear-gradient(to_bottom,#a5b4fc_1px,transparent_1px)] [background-size:64px_64px]" />
      <motion.div
        className="pointer-events-none absolute -left-48 top-1/4 h-[34rem] w-[34rem] rounded-full bg-violet-600/20 blur-[130px]"
        animate={reduceMotion ? undefined : { x: [0, 120, 0], y: [0, 55, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-48 bottom-20 h-[32rem] w-[32rem] rounded-full bg-cyan-500/15 blur-[130px]"
        animate={reduceMotion ? undefined : { x: [0, -90, 0], y: [0, -45, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[0.72fr_1.28fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300">
              The PrepAI system
            </p>
            <h2 className="mt-5 max-w-md text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-6xl">
              Everything you need. Nothing you don&apos;t.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
              A focused preparation workflow designed to take you from first review to interview-ready.
            </p>
          </motion.div>

          <div className="border-t border-white/15">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55, delay: index * 0.04 }}
                className="group relative grid gap-5 overflow-hidden border-b border-white/15 py-8 sm:grid-cols-[3.5rem_1fr_auto] sm:items-center sm:py-10"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-violet-600/10 via-cyan-500/[0.06] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-0" />
                <div className="relative text-sm font-semibold text-slate-500">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="relative">
                  <h3 className="text-2xl font-medium tracking-tight transition-colors group-hover:text-cyan-200 sm:text-3xl">
                    {feature.title}
                  </h3>
                  <p className="mt-2 max-w-xl leading-7 text-slate-400">
                    {feature.description}
                  </p>
                </div>
                <motion.div
                  className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-xl text-violet-300"
                  whileHover={{ rotate: 8, scale: 1.08 }}
                >
                  {feature.icon}
                </motion.div>
              </motion.article>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="relative mt-20 overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-violet-600/20 via-slate-900 to-cyan-500/10 p-8 shadow-2xl shadow-black/30 md:p-10"
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
                    PrepAI Code Arena
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
              Explore PrepAI Code Arena
              <span className="ml-2">→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Features;
