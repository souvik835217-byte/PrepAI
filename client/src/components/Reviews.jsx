import { FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "Arjun Mehta",
    role: "Frontend Developer",
    review:
      "PrepAI helped me practise structured answers and become more confident before my technical interviews.",
    rating: 5,
    initials: "AM",
  },
  {
    name: "Priya Sharma",
    role: "Computer Science Student",
    review:
      "The resume-based questions felt relevant, and the final report clearly showed where I needed improvement.",
    rating: 5,
    initials: "PS",
  },
  {
    name: "Rahul Verma",
    role: "Software Engineer",
    review:
      "The timed interview experience felt realistic and helped me improve my communication under pressure.",
    rating: 5,
    initials: "RV",
  },
];

function Reviews() {
  return (
    <section className="bg-gray-50 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
            Candidate Reviews
          </span>

          <h2 className="mt-5 text-3xl md:text-5xl font-bold text-gray-900">
            Built to make interview practice more effective
          </h2>

          <p className="mt-5 text-gray-600 text-lg">
            See how candidates use PrepAI to improve their confidence,
            communication, and interview performance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mt-14">
          {reviews.map((item) => (
            <article
              key={item.name}
              className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300"
            >
              <div className="flex gap-1">
                {Array.from({ length: item.rating }).map((_, index) => (
                  <FaStar key={index} className="text-yellow-400" />
                ))}
              </div>

              <p className="mt-6 text-gray-600 leading-7">
                “{item.review}”
              </p>

              <div className="flex items-center gap-4 mt-8">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center">
                  {item.initials}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Reviews;