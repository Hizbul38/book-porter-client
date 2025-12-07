const PartnerSection = () => {
  return (
    <section className="bg-[#f6f3ec] max-w-6xl mx-auto px-4 text-white py-14 mt-4 rounded-xl py-16 mt-6">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT TEXT BLOCK */}
        <div>
          <p className="text-sm font-semibold text-blue-600 tracking-wide mb-2">
            Become Our Partner
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug mb-4">
            Join BookPorter as a Library Partner & Reach More Readers.
          </h2>

          <p className="text-gray-700 text-sm md:text-base mb-6">
            Partner with us to make your library books accessible to thousands
            of learners, students and readers across multiple cities.  
            BookPorter helps libraries expand their reach with seamless delivery
            and digital visibility.
          </p>

          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Become a Partner Library
          </button>
        </div>

        {/* RIGHT IMAGE / ILLUSTRATION */}
        <div className="bg-white shadow-md border border-gray-200 rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
            alt="Library Partner"
            className="w-full h-72 object-cover"
          />
        </div>

      </div>
    </section>
  );
};

export default PartnerSection;
