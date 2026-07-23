import React from "react";
import { motion } from "framer-motion";

const ScoreCard = ({ title, score, icon }) => {
  const safeScore = Math.max(0, Math.min(Number(score) || 0, 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            {title}
          </p>

          <h3 className="mt-1 text-2xl font-bold text-white">
            {safeScore}%
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-xl text-blue-300">
          {icon}
        </div>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeScore}%` }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
        />
      </div>
    </motion.div>
  );
};

export default ScoreCard;