import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContextStore";

function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const disableMotion = reduceMotion || isMobile;

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const updateMobileState = () => setIsMobile(mobileQuery.matches);

    updateMobileState();
    mobileQuery.addEventListener("change", updateMobileState);

    return () => mobileQuery.removeEventListener("change", updateMobileState);
  }, []);

  const handleStartFree = () => {
    navigate(user ? "/company-selection" : "/login");
  };

  const handleLearnMore = () => {
    document.getElementById("features")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section className="relative min-h-[calc(100vh-1rem)] overflow-hidden bg-slate-950 text-white">
      <motion.div
        className="absolute -inset-[3%] bg-cover bg-[70%_center] md:bg-center"
        style={{
          backgroundImage:
            "url('/images/prepai-cinematic-hero.png')",
        }}
        initial={disableMotion ? false : { scale: 1.06, x: "0%", y: "0%" }}
        animate={
          disableMotion
            ? { scale: 1 }
            : {
                scale: [1.06, 1.11, 1.07, 1.06],
                x: ["0%", "-1.2%", "0.7%", "0%"],
                y: ["0%", "-0.7%", "0.4%", "0%"],
              }
        }
        transition={{
          duration: 22,
          repeat: disableMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/55 to-slate-950/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />

      <motion.div
        className="absolute inset-y-0 left-[-20%] w-[65%] bg-gradient-to-r from-transparent via-cyan-300/[0.08] to-transparent blur-3xl"
        animate={
          disableMotion
            ? undefined
            : { x: ["-15%", "70%", "-15%"] }
        }
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="pointer-events-none absolute -right-24 top-[18%] h-[30rem] w-[30rem] rounded-full bg-blue-500/15 blur-[110px]"
        animate={
          disableMotion
            ? undefined
            : {
                x: [0, -90, 20, 0],
                y: [0, 55, -20, 0],
                opacity: [0.45, 0.75, 0.5, 0.45],
              }
        }
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="pointer-events-none absolute inset-y-0 right-[8%] w-px bg-gradient-to-b from-transparent via-cyan-200/40 to-transparent shadow-[0_0_32px_rgba(34,211,238,0.45)]"
        animate={disableMotion ? undefined : { x: [0, -520, 0], opacity: [0, 0.8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          [58, 28, 7, 0],
          [67, 38, 5, 1.5],
          [76, 55, 8, 0.8],
          [84, 31, 4, 2.1],
          [62, 69, 6, 2.8],
          [91, 63, 5, 1.1],
          [72, 78, 4, 3.2],
        ].map(([left, top, size, delay], index) => (
          <motion.span
            key={`${left}-${top}`}
            className={`absolute rounded-full ${index % 2 === 0 ? "bg-cyan-300" : "bg-violet-300"}`}
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
            animate={
              disableMotion
                ? undefined
                : {
                    y: [0, -22, 0],
                    x: [0, index % 2 === 0 ? 12 : -10, 0],
                    opacity: [0.15, 0.8, 0.15],
                    scale: [0.8, 1.25, 0.8],
                  }
            }
            transition={{
              duration: 4.5 + index * 0.45,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-1rem)] max-w-7xl items-center px-6 pb-16 pt-32 sm:px-8 lg:px-10">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 38 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
            AI-powered career preparation
          </p>

          <h1 className="text-5xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-8xl">
            Prepare smarter.
            <span className="mt-2 block text-white/70">
              Make it real.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-200/85 sm:text-xl">
            Analyze your resume, master DSA, and practice AI-powered
            interviews in one focused platform.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleStartFree}
              className="min-w-44 rounded-lg bg-white px-7 py-4 text-sm font-bold uppercase tracking-wide text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-50 hover:shadow-[0_16px_45px_rgba(34,211,238,0.22)]"
            >
              Get started
            </button>

            <button
              type="button"
              onClick={handleLearnMore}
              className="min-w-44 rounded-lg border border-white/35 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white backdrop-blur-md transition duration-300 hover:border-white/70 hover:bg-white/10"
            >
              Explore PrepAI
            </button>
          </div>

          <p className="mt-5 text-sm text-slate-300/75">
            Start for free. Build confidence before the real interview.
          </p>
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={handleLearnMore}
        aria-label="Scroll to features"
        className="absolute bottom-8 right-8 z-10 hidden h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/15 text-xl text-white backdrop-blur md:flex"
        animate={disableMotion ? undefined : { y: [0, 7, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        ↓
      </motion.button>
    </section>
  );
}

export default Hero;
