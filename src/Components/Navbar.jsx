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
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* LEFT: Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600 shrink-0">
          <span className="flex items-center gap-1">
            <ImBook /> BookPorter
          </span>
        </Link>

        {/* MIDDLE: Nav links (center) */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-6 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-gray-700 ${isActive ? "font-semibold text-blue-600" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/all-books"
            className={({ isActive }) =>
              `text-gray-700 ${isActive ? "font-semibold text-blue-600" : ""}`
            }
          >
            All Books
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-gray-700 ${isActive ? "font-semibold text-blue-600" : ""}`
            }
          >
            Dashboard
          </NavLink>
        </div>

        {/* RIGHT: Auth controls (desktop) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <>
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover border"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                  {(user.email && user.email[0].toUpperCase()) || "U"}
                </div>
              )}
              <button
                onClick={handleLogout}
                className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 text-sm">
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* RIGHT: Mobile menu button */}
        <button
          className="md:hidden border px-2 py-1 rounded text-sm ml-auto"
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

          {user ? (
            <div className="mt-3 flex items-center justify-between">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User"
                  className="w-9 h-9 rounded-full object-cover border"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                  {(user.email && user.email[0].toUpperCase()) || "U"}
                </div>
              )}
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
