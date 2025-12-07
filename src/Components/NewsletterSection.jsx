const NewsletterSection = () => {
  return (
    <section className="py-20 max-w-6xl mx-auto px-4 text-white py-14 mt-4 rounded-xl bg-gradient-to-br from-[#fdf1e4] via-[#f9ead7] to-[#f6e7d5] mt-10">
      <div className="max-w-4xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-amber-600 tracking-[0.25em] uppercase">
            Join The Community
          </p>

          <h2 className="text-[32px] md:text-[40px] font-extrabold text-gray-900 leading-tight mt-2">
            Subscribe & Stay Updated With<br />
            <span className="text-blue-600">BookPorter</span>
          </h2>

          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto mt-3">
            Get updates on new arrivals, exclusive discounts, recommended books,
            and curated reading lists straight to your inbox. Become a part of
            our reading family.
          </p>
        </div>

        {/* Stylish Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-amber-100 px-6 py-10 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-2xl transition-all duration-300">

          {/* Left Text + Icon */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center shadow-inner text-3xl">
              📬
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                Never Miss a Book Update
              </h3>
              <p className="text-gray-600 text-sm">
                Be first to know when new books arrive.
              </p>
            </div>
          </div>

          {/* Input + Button */}
          <form className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="email"
              required
              placeholder="Your email address"
              className="px-5 py-3 w-full sm:w-72 rounded-full border border-gray-300 shadow-sm outline-none text-sm focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md"
            >
              Subscribe
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          We respect your privacy. No spam — only book updates.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;
