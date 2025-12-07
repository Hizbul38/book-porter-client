import { useState } from "react";
import { ImBook } from "react-icons/im";
import { Link, NavLink } from "react-router-dom";


const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
        <span className="flex items-center gap-1">
          <ImBook /> BookPorter
        </span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/" className="text-gray-700">
            Home
          </NavLink>
          <NavLink to="/all-books" className="text-gray-700">
            All Books
          </NavLink>
          <NavLink to="/dashboard" className="text-gray-700">
            Dashboard
          </NavLink>
          <Link to="/login" className="text-gray-700">
            Login
          </Link>
          <Link
            to="/register"
            className="text-gray-700"
          >
            Register
          </Link>
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden border px-2 py-1 rounded text-sm"
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 py-2 space-y-2 text-sm bg-white">
          <NavLink to="/" onClick={() => setOpen(false)} className="block">
            Home
          </NavLink>
          <NavLink to="/books" onClick={() => setOpen(false)} className="block">
            Books
          </NavLink>
          <NavLink
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="block"
          >
            Dashboard
          </NavLink>
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block mt-2"
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className="block "
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
