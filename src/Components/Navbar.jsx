import { useState, useContext } from "react";
import { ImBook } from "react-icons/im";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout().catch((err) => console.error(err));
  };

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

          {/* ✅ Auth part */}
          {user ? (
            // logged in: show avatar + logout
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                    {(user.displayName && user.displayName[0]) || "U"}
                  </div>
                )}
                <span className="text-xs text-gray-700 hidden lg:inline">
                  {user.displayName || "User"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          ) : (
            // not logged in: show login + register
            <div className="flex items-center gap-3">
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
          )}
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
        <div className="md:hidden px-4 py-2 space-y-2 text-sm bg-white border-t">
          <NavLink to="/" onClick={() => setOpen(false)} className="block">
            Home
          </NavLink>
          <NavLink
            to="/all-books"
            onClick={() => setOpen(false)}
            className="block"
          >
            All Books
          </NavLink>
          <NavLink
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="block"
          >
            Dashboard
          </NavLink>

          {/* ✅ Mobile auth part */}
          {user ? (
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                    {(user.displayName && user.displayName[0]) || "U"}
                  </div>
                )}
                <span className="text-xs text-gray-700">
                  {user.displayName || "User"}
                </span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 space-y-1">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="block"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
