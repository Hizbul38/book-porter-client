import { useContext, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../Providers/AuthProvider";

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(true);

  const handleLogout = () => {
    logout().catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-200 ${
          open ? "w-60" : "w-16"
        }`}
      >
        {/* Top user section */}
        <div className="h-16 px-3 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-2">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="User"
                className="w-9 h-9 rounded-full object-cover border"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                {(user?.email && user.email[0].toUpperCase()) || "U"}
              </div>
            )}
            {open && (
              <span className="text-xs text-gray-700">
                {/* optional: role badge pore add korbo */}
                Dashboard
              </span>
            )}
          </div>
          <button
            onClick={() => setOpen(!open)}
            className="text-xs text-gray-500 border rounded px-1 py-0.5"
          >
            {open ? "<" : ">"}
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 py-4 space-y-1 text-sm">
          <p className={`px-2 text-[11px] uppercase text-gray-400 mb-2 ${!open && "hidden"}`}>
            User Dashboard
          </p>

          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-2 py-2 ${
                isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <span className="text-xs">🏠</span>
            {open && <span>Overview</span>}
          </NavLink>

          <NavLink
            to="/dashboard/my-orders"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-2 py-2 ${
                isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <span className="text-xs">📚</span>
            {open && <span>My Orders</span>}
          </NavLink>

          <NavLink
            to="/dashboard/invoices"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-2 py-2 ${
                isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <span className="text-xs">🧾</span>
            {open && <span>Invoices</span>}
          </NavLink>

          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-2 py-2 ${
                isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <span className="text-xs">👤</span>
            {open && <span>My Profile</span>}
          </NavLink>

          <div>
            {open && (
              <p className="px-2 text-[11px] uppercase text-gray-400 mb-2">
                Librarian
              </p>
            )}

            <NavLink
              to="/dashboard/librarian/add-book"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-2 py-2 ${
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <span className="text-xs">➕</span>
              {open && <span>Add Book</span>}
            </NavLink>

            <NavLink
              to="/dashboard/librarian/my-books"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-2 py-2 ${
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <span className="text-xs">📘</span>
              {open && <span>My Books</span>}
            </NavLink>

            <NavLink
              to="/dashboard/librarian/orders"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-2 py-2 ${
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <span className="text-xs">📦</span>
              {open && <span>Orders</span>}
            </NavLink>
          </div>

          {/* Admin Section */}
          <div>
            {open && (
              <p className="px-2 text-[11px] uppercase text-gray-400 mb-2">
                Admin
              </p>
            )}

            <NavLink
              to="/dashboard/admin/users"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-2 py-2 ${
                  isActive
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <span className="text-xs">👥</span>
              {open && <span>All Users</span>}
            </NavLink>

            <NavLink
              to="/dashboard/admin/manage-books"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-2 py-2 ${
                  isActive
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <span className="text-xs">📚</span>
              {open && <span>Manage Books</span>}
            </NavLink>

            <NavLink
              to="/dashboard/admin/profile"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-2 py-2 ${
                  isActive
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <span className="text-xs">🧑‍💼</span>
              {open && <span>Admin Profile</span>}
            </NavLink>
          </div>

        </nav>

        {/* Bottom logout */}
        <div className="border-t border-gray-200 px-3 py-3">
          <button
            onClick={handleLogout}
            className="w-full text-xs px-3 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
