import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const StrengthCard = ({ strengths = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 shadow-xl shadow-black/10 backdrop-blur-xl"
    >
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
          What went well
        </p>

        <h2 className="mt-2 text-2xl font-bold text-white">
          Strengths
        </h2>
      </div>

      <div className="space-y-4">
        {strengths.length > 0 ? (
          strengths.map((item, index) => (
            <motion.div
              key={`${item}-${index}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.35,
                delay: index * 0.08,
              }}
              className="flex items-start gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.07] p-4"
            >
              <FaCheckCircle className="mt-0.5 shrink-0 text-lg text-emerald-400" />

              <p className="text-sm leading-6 text-slate-300">
                {item}
              </p>
            </motion.div>
          ))
        ) : (
          <p className="text-sm text-slate-400">
            No strengths were provided.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default StrengthCard;