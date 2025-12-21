import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

const formatDate = (d) => {
  try {
    return d ? new Date(d).toLocaleString() : "—";
  } catch {
    return "—";
  }
};

const nextOptions = (status) => {
  const s = (status || "pending").toLowerCase();
  if (s === "pending") return ["pending", "shipped"];
  if (s === "shipped") return ["shipped", "delivered"];
  if (s === "delivered") return ["delivered"];
  if (s === "cancelled") return ["cancelled"];
  return ["pending"];
};

const LibrarianOrders = () => {
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user) {
        setOrders([]);
        setError("Please login first");
        return;
      }
      if (!API_URL) {
        setOrders([]);
        setError("VITE_API_URL missing");
        return;
      }

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_URL}/librarian/orders`, {
        headers: { authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => []);
      if (!res.ok) {
        setOrders([]);
        setError(data?.message || "Failed to load orders");
        return;
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("loadOrders error:", e);
      setOrders([]);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const rows = useMemo(() => (Array.isArray(orders) ? orders : []), [orders]);

  const handleCancel = async (id) => {
    if (!id) return;
    if (!user) return alert("Please login first");

    const ok = confirm("Cancel this order?");
    if (!ok) return;

    try {
      setActingId(id);
      const token = await user.getIdToken(true);

      const res = await fetch(`${API_URL}/librarian/orders/${id}/cancel`, {
        method: "PATCH",
        headers: { authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data?.message || "Cancel failed");
        return;
      }

      // ✅ update UI
      setOrders((prev) =>
        (Array.isArray(prev) ? prev : []).map((o) =>
          String(o._id) === String(id) ? data : o
        )
      );
    } catch (e) {
      console.error("cancel error:", e);
      alert("Cancel failed");
    } finally {
      setActingId(null);
    }
  };

  const handleStatusChange = async (id, nextStatus) => {
    if (!id) return;
    if (!user) return alert("Please login first");

    try {
      setActingId(id);
      const token = await user.getIdToken(true);

      const res = await fetch(`${API_URL}/librarian/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data?.message || "Status update failed");
        return;
      }

      // ✅ update UI
      setOrders((prev) =>
        (Array.isArray(prev) ? prev : []).map((o) =>
          String(o._id) === String(id) ? data : o
        )
      );
    } catch (e) {
      console.error("status change error:", e);
      alert("Status update failed");
    } finally {
      setActingId(null);
    }
  };

  if (loading) return <p className="text-sm text-gray-600">Loading orders...</p>;

  return (
    <section>
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Orders
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Orders for the books you added. You can cancel and update status.
          </p>
        </div>

        <button
          onClick={loadOrders}
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
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Order Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((o) => {
                const status = (o?.status || "pending").toLowerCase();
                const payment = (o?.paymentStatus || "unpaid").toLowerCase();
                const isCancelled = status === "cancelled";
                const isDelivered = status === "delivered";

                const options = nextOptions(status);
                const disabled = actingId === o._id;

                return (
                  <tr key={o._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{o.bookTitle || "—"}</td>
                    <td className="px-4 py-3">{o.userEmail || "—"}</td>
                    <td className="px-4 py-3">{o.phone || "—"}</td>
                    <td className="px-4 py-3">{o.address || "—"}</td>

                    <td className="px-4 py-3 capitalize">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] ${
                          payment === "paid"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {payment}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={status}
                        disabled={disabled || isCancelled || isDelivered}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className="border border-gray-300 rounded-lg px-2 py-1 text-xs bg-white"
                        title={
                          isCancelled
                            ? "Cancelled order status cannot be changed"
                            : isDelivered
                            ? "Delivered order is final"
                            : "Update status"
                        }
                      >
                        {options.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-3">{formatDate(o.createdAt)}</td>

                    <td className="px-4 py-3 text-right">
                      {!isCancelled && !isDelivered && (
                        <button
                          onClick={() => handleCancel(o._id)}
                          disabled={disabled}
                          className={`text-xs px-3 py-1 rounded-full text-white ${
                            disabled ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          {disabled ? "Working..." : "Cancel"}
                        </button>
                      )}

                      {(isCancelled || isDelivered) && (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {rows.length === 0 && (
            <p className="text-sm text-gray-500 px-4 py-10 text-center">
              No orders found for your books.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default LibrarianOrders;
