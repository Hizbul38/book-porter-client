// src/Components/AnimatedStats.jsx
import { useEffect, useState } from "react";

const stats = [
  { label: "Books Delivered", value: 1200 },
  { label: "Active Readers", value: 850 },
  { label: "Partner Libraries", value: 35 },
  { label: "Cities Covered", value: 7 },
];

const AnimatedStats = () => {
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);

      const updated = stats.map((item, index) => {
        return Math.floor(item.value * progress);
      });

      setCounts(updated);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, []);

  return (
    <section className="bg-[#111827] max-w-6xl mx-auto px-4 text-white py-14 mt-4 rounded-xl">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">
            Readers Are Already Using BookPorter
          </h2>
          <p className="text-sm md:text-base text-gray-300 mt-2 max-w-xl mx-auto">
            A quick look at how BookPorter helps readers, students and libraries
            stay connected through books.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {stats.map((item, index) => (
            <div
              key={item.label}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-5 text-center hover:bg-white/10 transition-transform hover:-translate-y-1"
            >
              <p className="text-3xl font-bold mb-1 text-amber-400">
                {counts[index]}+
              </p>
              <p className="text-xs md:text-sm font-medium text-gray-100">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedStats;
