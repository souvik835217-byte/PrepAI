import { motion } from "framer-motion";
import {
  BsPeople,
  BsRobot,
  BsGraphUp,
  BsAward,
} from "react-icons/bs";

const stats = [
  {
    icon: <BsPeople size={32} />,
    number: "5,000+",
    title: "Students",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <BsRobot size={32} />,
    number: "50,000+",
    title: "AI Interviews",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <BsGraphUp size={32} />,
    number: "98%",
    title: "Success Rate",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <BsAward size={32} />,
    number: "24/7",
    title: "AI Available",
    color: "from-orange-500 to-yellow-500",
  },
];

function Stats() {
  return (
    <section className="bg-slate-950 py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-white">
            Trusted by Future Professionals
          </h2>

          <p className="text-gray-400 mt-3">
            Thousands of students are preparing for interviews using AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center"
            >
              <div
                className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center bg-gradient-to-r ${item.color} text-white`}
              >
                {item.icon}
              </div>

              <h3 className="text-4xl font-bold text-white mt-6">
                {item.number}
              </h3>

              <p className="text-gray-400 mt-2">
                {item.title}
              </p>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Stats;