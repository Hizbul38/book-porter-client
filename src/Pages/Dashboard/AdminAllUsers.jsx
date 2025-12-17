import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

const AdminAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch all users
  // =========================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users/all`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // Update role
  // =========================
  const updateRole = async (userId, role) => {
    try {
      const res = await fetch(`${API_URL}/users/role/${userId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        alert("Failed to update role");
        return;
      }

      const updatedUser = await res.json();

      // 🔥 Update UI instantly
      setUsers((prev) =>
        prev.map((u) =>
          String(u._id) === String(userId) ? updatedUser : u
        )
      );
    } catch (err) {
      console.error("Update role error:", err);
    }
  };

  const roleBadgeClass = (role) => {
    if (role === "admin") return "bg-purple-100 text-purple-700";
    if (role === "librarian") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  if (loading) return <p className="p-6">Loading users...</p>;

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold mb-4">
        All Users (Admin)
      </h1>

      <p className="text-sm text-gray-600 mb-4">
        All registered users are listed here. You can promote users to
        Librarian or Admin.
      </p>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
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
                    disabled={user.role === "librarian"}
                    onClick={() =>
                      updateRole(user._id, "librarian")
                    }
                    className="text-xs px-3 py-1 rounded-full border disabled:opacity-50"
                  >
                    Make Librarian
                  </button>

                  <button
                    disabled={user.role === "admin"}
                    onClick={() =>
                      updateRole(user._id, "admin")
                    }
                    className="text-xs px-3 py-1 rounded-full bg-gray-900 text-white disabled:opacity-50"
                  >
                    Make Admin
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center py-6 text-sm text-gray-500">
            No users found
          </p>
        )}
      </div>
    </section>
  );
};

export default AdminAllUsers;
