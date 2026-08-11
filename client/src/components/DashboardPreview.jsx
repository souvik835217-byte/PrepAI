import { motion } from "framer-motion";
import {
  BsRobot,
  BsFileEarmarkText,
  BsMic,
  BsGraphUp,
} from "react-icons/bs";

function DashboardPreview() {
  return (
    <section className="border-y border-slate-200 bg-[#f4f5f8] py-28 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-violet-600">
            Dashboard Preview
          </p>

          <h2 className="text-5xl font-medium leading-[1.04] tracking-[-0.045em] text-slate-950 lg:text-6xl">
            Experience AI-powered
            <br />
            Interview Preparation
          </h2>

          <p className="text-slate-600 mt-6 text-lg leading-8">
            Upload your resume, track interview progress, receive AI feedback,
            and improve your communication with real-time analytics.
          </p>
        </motion.div>

        {/* Right Dashboard */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          whileHover={{ y: -8, rotate: -0.5 }}
          className="rounded-[2rem] border border-slate-800 bg-slate-950 p-8 shadow-[0_35px_90px_rgba(15,23,42,0.25)] transition-shadow hover:shadow-[0_45px_110px_rgba(79,70,229,0.25)]"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-white text-2xl font-bold">
                PrepAI Dashboard
              </h3>

              <p className="text-gray-400">
                Welcome back 👋
              </p>
            </div>

            <div className="bg-purple-600 p-4 rounded-2xl">
              <BsRobot className="text-white text-2xl" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-5">

            <div className="bg-slate-900 rounded-2xl p-5">
              <BsFileEarmarkText className="text-purple-400 text-3xl mb-3" />
              <h4 className="text-white font-bold text-xl">92%</h4>
              <p className="text-gray-400">Resume Score</p>
            </div>

            <div className="bg-slate-900 rounded-2xl p-5">
              <BsMic className="text-blue-400 text-3xl mb-3" />
              <h4 className="text-white font-bold text-xl">12</h4>
              <p className="text-gray-400">Mock Interviews</p>
            </div>

          </div>

          {/* Progress */}
          <div className="mt-8">

            <div className="flex justify-between text-white mb-2">
              <span>Interview Progress</span>
              <span>80%</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-3">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full w-4/5"></div>
            </div>

          </div>

          {/* Analytics */}
          <div className="mt-8 bg-slate-900 rounded-2xl p-5">

            <div className="flex items-center gap-3 mb-4">
              <BsGraphUp className="text-green-400 text-2xl" />

              <h4 className="text-white font-semibold">
                AI Performance
              </h4>
            </div>

            <div className="space-y-4">

              <div>
                <div className="flex justify-between text-gray-300">
                  <span>Communication</span>
                  <span>90%</span>
                </div>

                <div className="bg-slate-700 h-2 rounded-full mt-2">
                  <div className="bg-green-400 h-2 rounded-full w-[90%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-300">
                  <span>Confidence</span>
                  <span>84%</span>
                </div>

                <div className="bg-slate-700 h-2 rounded-full mt-2">
                  <div className="bg-blue-400 h-2 rounded-full w-[84%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-300">
                  <span>Technical</span>
                  <span>95%</span>
                </div>

                <div className="bg-slate-700 h-2 rounded-full mt-2">
                  <div className="bg-purple-400 h-2 rounded-full w-[95%]"></div>
                </div>
              </div>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}

export default DashboardPreview;
