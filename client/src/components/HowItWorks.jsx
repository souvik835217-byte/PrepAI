import { motion } from "framer-motion";
import {
  BsUpload,
  BsRobot,
  BsMic,
  BsBarChart,
  BsCheckCircle,
} from "react-icons/bs";

const steps = [
  {
    icon: <BsUpload size={32} />,
    title: "Upload Resume",
    desc: "Upload your PDF resume securely in just a few seconds.",
  },
  {
    icon: <BsRobot size={32} />,
    title: "AI Analysis",
    desc: "PrepAI analyzes your resume and identifies your skills and experience.",
  },
  {
    icon: <BsRobot size={32} />,
    title: "Generate Questions",
    desc: "AI creates personalized interview questions based on your profile.",
  },
  {
    icon: <BsMic size={32} />,
    title: "Voice Interview",
    desc: "Answer questions naturally using your microphone in a mock interview.",
  },
  {
    icon: <BsBarChart size={32} />,
    title: "Performance Report",
    desc: "Receive scores, strengths, weaknesses, and improvement tips.",
  },
];

function HowItWorks() {
  return (
    <section className="bg-[#060914] py-28 px-6 text-white">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-20">
          <h2 className="text-5xl font-medium tracking-[-0.04em] text-white">
            How PrepAI Works
          </h2>

          <p className="text-slate-400 mt-4">
            Five simple steps to become interview ready.
          </p>
        </div>

        <div className="space-y-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-950/40">
                {step.icon}
              </div>

              <div className="group flex-1 rounded-2xl border border-white/10 bg-white/[0.035] p-8 backdrop-blur transition duration-500 hover:border-cyan-400/30 hover:bg-white/[0.065]">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-medium text-white">
                    {step.title}
                  </h3>

                  <BsCheckCircle className="text-green-400 text-2xl" />
                </div>

                <p className="text-slate-400 mt-3 leading-7">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;
