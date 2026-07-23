import React from "react";
import { motion } from "framer-motion";

const CircularScore = ({ score }) => {
  const safeScore = Math.max(0, Math.min(Number(score) || 0, 100));
  const size = 120;
  const stroke = 8;
  const radius = (size - stroke) / 2;

  const circumference = radius * 2 * Math.PI;

  const strokeDashoffset =
    circumference -
    (safeScore / 100) * circumference;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center"
    >
      <div className="relative h-44 w-44 sm:h-48 sm:w-48">

        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="h-full w-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            stroke="#E5E7EB"
            fill="transparent"
            strokeWidth={stroke}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />

          <circle
            stroke="#2563EB"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: "stroke-dashoffset 1s ease",
            }}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">

          <p className="flex items-start font-bold leading-none tracking-tight text-white drop-shadow-sm">
            <span className="text-4xl sm:text-5xl">{safeScore}</span>
            <span className="ml-0.5 mt-1 text-base text-cyan-300 sm:text-lg">%</span>
          </p>

          <p className="mt-2 text-sm font-medium text-violet-100">
            Overall Score
          </p>

        </div>

      </div>
    </motion.div>
  );
};

export default CircularScore;
