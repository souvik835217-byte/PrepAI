import React from "react";
import { motion } from "framer-motion";

const QuestionBreakdown = ({ questions }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200"
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        📋 Question Breakdown
      </h2>

      <div className="space-y-6">
        {questions.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-slate-700">
                Question {index + 1}
              </span>

              <span className="font-bold text-blue-600">
                {item.score}%
              </span>
            </div>

            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-blue-600 rounded-full"
              />
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {item.feedback}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuestionBreakdown;