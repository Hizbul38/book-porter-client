const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111827] max-w-6xl mx-auto px-4 text-white py-14 mt-4 rounded-xl text-gray-300 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">

        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">BookPorter</h2>
          <p className="text-sm text-gray-400">
            Library-to-home book delivery service for students, readers and
            researchers. Borrow books from nearby libraries without leaving
            your home.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/all-books" className="hover:text-white">
                All Books
              </a>
            </li>
            <li>
              <a href="/dashboard" className="hover:text-white">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-white">
                Login
              </a>
            </li>
            <li>
              <a href="/register" className="hover:text-white">
                Register
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
            Contact
          </h3>
          <p className="text-sm text-gray-400 mb-3">
            Email: support@bookporter.com <br />
            Phone: +880 1XXX-XXXXXX
          </p>

          <div className="flex items-center gap-3 mt-2">
            {/* X logo */}
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-gray-500 flex items-center justify-center text-xs hover:bg-white hover:text-black transition"
            >
              X
            </a>
            {/* Facebook */}
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-gray-500 flex items-center justify-center text-xs hover:bg-white hover:text-black transition"
            >
              FB
            </a>
            {/* Instagram */}
            <a
              href="#"
              className="w-9 h-9 rounded-full border border-gray-500 flex items-center justify-center text-xs hover:bg-white hover:text-black transition"
            >
              IG
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700">
        <p className="text-center text-xs text-gray-500 py-3">
          © {year} BookPorter. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
