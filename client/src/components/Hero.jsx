import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContextStore";

function AnimatedRobot() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-96 lg:w-96"
      role="img"
      aria-label="Animated PrepAI robot assistant"
    >
      <motion.div
        className="absolute inset-3 rounded-full bg-gradient-to-br from-purple-500 via-violet-500 to-blue-500 shadow-[0_0_90px_rgba(139,92,246,0.45)]"
        animate={reduceMotion ? undefined : { scale: [1, 1.035, 1], rotate: [0, 2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-7 rounded-full border border-dashed border-white/30"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_16px_#67e8f9]" />
        <span className="absolute -bottom-1 left-1/4 h-2 w-2 rounded-full bg-fuchsia-200 shadow-[0_0_14px_#f5d0fe]" />
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-center"
        animate={reduceMotion ? undefined : { y: [-8, 8, -8] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={reduceMotion ? undefined : { scale: 1.06, rotate: -2 }}
      >
        <div className="relative h-12 w-1.5 rounded-full bg-slate-200">
          <motion.span
            className="absolute -left-2.5 -top-5 h-6 w-6 rounded-full bg-amber-300 shadow-[0_0_22px_#fcd34d]"
            animate={reduceMotion ? undefined : { scale: [1, 1.25, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative -mt-1 h-36 w-44 rounded-[2.25rem] border-4 border-white/80 bg-gradient-to-b from-white to-violet-200 shadow-[0_22px_45px_rgba(15,23,42,0.4)] sm:h-40 sm:w-48">
          <div className="absolute -left-4 top-12 h-14 w-5 rounded-l-xl bg-fuchsia-400" />
          <div className="absolute -right-4 top-12 h-14 w-5 rounded-r-xl bg-fuchsia-400" />

          <div className="absolute left-1/2 top-7 flex h-16 w-[82%] -translate-x-1/2 items-center justify-around rounded-3xl bg-slate-900 px-5 shadow-inner shadow-black/60">
            {[0, 1].map((eye) => (
              <motion.span
                key={eye}
                className="h-8 w-4 rounded-full bg-cyan-300 shadow-[0_0_18px_#22d3ee]"
                animate={reduceMotion ? undefined : { scaleY: [1, 1, 0.12, 1, 1] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  times: [0, 0.43, 0.47, 0.51, 1],
                  delay: eye * 0.04,
                }}
              />
            ))}
          </div>

          <motion.div
            className="absolute bottom-5 left-1/2 h-3 w-12 -translate-x-1/2 rounded-full bg-slate-700"
            animate={reduceMotion ? undefined : { width: [48, 34, 48] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="mt-3 h-16 w-28 rounded-b-3xl rounded-t-xl border-4 border-white/70 bg-gradient-to-b from-violet-200 to-violet-400 shadow-xl">
          <motion.div
            className="mx-auto mt-4 h-5 w-5 rounded-full border-4 border-cyan-200 bg-cyan-400 shadow-[0_0_18px_#22d3ee]"
            animate={reduceMotion ? undefined : { opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-7 h-5 w-36 rounded-full bg-slate-950/50 blur-md"
        animate={reduceMotion ? undefined : { scaleX: [1, 0.78, 1], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

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
    <section className="flex min-h-[90vh] items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 px-5 py-16 text-white sm:px-6 md:py-20">
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 md:grid-cols-[1.15fr_0.85fr] md:gap-8 lg:gap-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 font-semibold text-purple-400">
            PrepAI — Learn. Practice. Compete. Succeed.
          </p>

          <h1 className="font-extrabold leading-tight">
            <span className="block text-4xl sm:text-5xl md:text-[2.75rem] lg:text-6xl">
              Prepare Smarter.
            </span>
            <span className="mt-2 block text-3xl text-purple-400 sm:text-4xl md:text-[2.35rem] lg:whitespace-nowrap lg:text-[3.25rem] xl:text-[3.5rem]">
              Practice DSA. Ace Interviews.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-300">
            Analyze your resume, master coding problems, compete in contests,
            and practice AI-powered interviews—all in one platform.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={handleStartFree}
              className="w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700 sm:w-auto"
            >
              Start Free
            </button>

            <button
              type="button"
              onClick={handleLearnMore}
              className="w-full rounded-xl border border-gray-400 px-6 py-3 hover:border-white sm:w-auto"
            >
              Learn More
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center md:justify-end"
        >
          <AnimatedRobot />
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
