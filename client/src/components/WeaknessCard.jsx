import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { motion } from "framer-motion";

const WeaknessCard = ({ weaknesses }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200"
    >
      <h2 className="text-xl font-bold text-slate-900 mb-5">
        ⚠ Needs Improvement
      </h2>

      <div className="space-y-4">
        {weaknesses.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3"
          >
            <FaExclamationTriangle className="text-yellow-500 text-xl" />

            <p className="text-slate-700">
              {item}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default WeaknessCard;