import { motion } from "framer-motion";
import {
  BsRobot,
  BsFileEarmarkText,
  BsMic,
  BsGraphUp,
} from "react-icons/bs";

function DashboardPreview() {
  return (
    <section className="bg-slate-950 py-28 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="text-purple-400 font-semibold mb-3">
            Dashboard Preview
          </p>

          <h2 className="text-5xl font-bold text-white leading-tight">
            Experience AI-powered
            <br />
            Interview Preparation
          </h2>

          <p className="text-gray-400 mt-6 text-lg leading-8">
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
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
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