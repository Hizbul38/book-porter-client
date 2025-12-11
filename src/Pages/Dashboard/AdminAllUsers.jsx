import { useState } from "react";

const initialUsers = [
  {
    id: 1,
    name: "Demo User",
    email: "user@example.com",
    role: "user",
  },
  {
    id: 2,
    name: "Librarian One",
    email: "librarian@example.com",
    role: "librarian",
  },
  {
    id: 3,
    name: "Admin One",
    email: "admin@example.com",
    role: "admin",
  },
];

const AdminAllUsers = () => {
  const [users, setUsers] = useState(initialUsers);

  const updateRole = (id, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );

    // TODO: later send PATCH/PUT to backend
    console.log(`Role updated for user ${id} => ${newRole}`);
  };

  const roleBadgeClass = (role) => {
    if (role === "admin") return "bg-purple-50 text-purple-700";
    if (role === "librarian") return "bg-green-50 text-green-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        All Users
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Manage user roles. You can promote users to Librarian or Admin.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] capitalize ${roleBadgeClass(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => updateRole(user.id, "librarian")}
                      className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
                    >
                      Make Librarian
                    </button>
                    <button
                      onClick={() => updateRole(user.id, "admin")}
                      className="text-xs px-3 py-1 rounded-full bg-gray-900 text-white hover:bg-gray-800"
                    >
                      Make Admin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="text-sm text-gray-500 px-4 py-6 text-center">
              No users found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminAllUsers;
