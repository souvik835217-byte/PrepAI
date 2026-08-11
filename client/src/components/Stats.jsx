import { motion } from "framer-motion";
import {
  BsPeople,
  BsRobot,
  BsGraphUp,
  BsAward,
} from "react-icons/bs";

const stats = [
  {
    icon: <BsPeople size={20} />,
    number: "5,000+",
    title: "Students",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <BsRobot size={20} />,
    number: "50,000+",
    title: "AI Interviews",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <BsGraphUp size={20} />,
    number: "98%",
    title: "Success Rate",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <BsAward size={20} />,
    number: "24/7",
    title: "AI Available",
    color: "from-orange-500 to-yellow-500",
  },
];

function Stats() {
  return (
    <section className="border-t border-white/10 bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[1.1fr_2fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Built for ambitious learners
          </p>
          <h2 className="mt-3 max-w-md text-2xl font-medium tracking-tight sm:text-3xl">
            Trusted by future professionals
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
            Practical preparation supported by AI, available whenever you need it.
          </p>
        </div>

        <div className="grid grid-cols-2 border-l border-white/10 sm:grid-cols-4">
          {stats.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="border-r border-white/10 px-5 py-4 last:border-r-0"
            >
              <div className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${item.color} text-sm text-white`}>
                {item.icon}
              </div>
              <div className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {item.number}
              </div>
              <p className="mt-1 text-sm text-slate-400">{item.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
