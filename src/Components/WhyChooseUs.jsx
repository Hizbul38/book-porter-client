// src/Components/WhyChooseUs.jsx

const features = [
  {
    title: "Fast Doorstep Delivery",
    desc: "Get your books delivered from nearby libraries within a short time without standing in queues.",
    icon: "🚚",
  },
  {
    title: "Library-to-Home Service",
    desc: "Borrow books directly from partnered libraries and return them without visiting physically.",
    icon: "📚",
  },
  {
    title: "Track Your Orders",
    desc: "Track every book you order from pending to delivered with real-time status updates.",
    icon: "📍",
  },
  {
    title: "Student-Friendly & Affordable",
    desc: "Specially designed for students and readers so they can access books at a low cost.",
    icon: "🎓",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mt-1 mb-3">
            Why Choose BookPorter
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            BookPorter makes it easier to borrow, receive and return library
            books without leaving your home. Here’s why readers love us.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {features.map((item) => (
            <div
              key={item.title}
              className="bg-[#f6f3ec] rounded-xl px-4 py-5 border border-amber-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl mb-3 bg-white shadow">
                {item.icon}
              </div>
              <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
