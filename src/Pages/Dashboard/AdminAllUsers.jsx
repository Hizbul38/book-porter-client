import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

const AdminAllUsers = () => {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user) {
        setUsers([]);
        setError("Please login first");
        return;
      }
      if (!API_URL) {
        setUsers([]);
        setError("VITE_API_URL missing");
        return;
      }

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_URL}/users`, {
        headers: { authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => []);
      if (!res.ok) {
        setUsers([]);
        setError(data?.message || "Failed to load users");
        return;
      }

      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("loadUsers error:", e);
      setUsers([]);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const rows = useMemo(() => (Array.isArray(users) ? users : []), [users]);

  const updateRole = async (id, role) => {
    if (!id) return;
    if (!user) return alert("Please login first");

    try {
      setActingId(id);

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_URL}/users/role/${id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data?.message || "Role update failed");
        return;
      }

      // ✅ update UI locally
      setUsers((prev) =>
        (Array.isArray(prev) ? prev : []).map((u) =>
          String(u._id) === String(id) ? { ...u, role } : u
        )
      );
    } catch (e) {
      console.error("updateRole error:", e);
      alert("Role update failed");
    } finally {
      setActingId(null);
    }
  };

  if (loading) return <p className="text-sm text-gray-600">Loading users...</p>;

  return (
    <section>
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            All Users
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage roles: Make Librarian / Make Admin
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="text-xs px-3 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((u) => {
                const role = (u?.role || "user").toLowerCase();
                const disabled = actingId === u._id;

                return (
                  <tr key={u._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{u.email || "—"}</td>

                    <td className="px-4 py-3 capitalize">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] ${
                          role === "admin"
                            ? "bg-purple-50 text-purple-700"
                            : role === "librarian"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {role}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        disabled={disabled || role === "librarian"}
                        onClick={() => updateRole(u._id, "librarian")}
                        className={`text-xs px-3 py-1 rounded-full border ${
                          disabled || role === "librarian"
                            ? "border-gray-200 text-gray-400"
                            : "border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        Make Librarian
                      </button>

                      <button
                        disabled={disabled || role === "admin"}
                        onClick={() => updateRole(u._id, "admin")}
                        className={`text-xs px-3 py-1 rounded-full ${
                          disabled || role === "admin"
                            ? "bg-gray-200 text-gray-500"
                            : "bg-gray-900 text-white hover:bg-gray-800"
                        }`}
                      >
                        Make Admin
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {rows.length === 0 && (
            <p className="text-sm text-gray-500 px-4 py-10 text-center">
              No users found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminAllUsers;
