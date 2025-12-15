// src/Pages/Librarian/LibrarianOrders.jsx
import { useEffect, useState } from "react";

const LibrarianOrders = () => {
  const librarian = { email: "librarian@bookcourier.com" }; // demo

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3000/librarian/orders?email=${encodeURIComponent(
          librarian.email
        )}`
      );
      const data = await res.json();

      if (!res.ok) {
        console.error("fetchOrders failed:", data);
        setOrders([]);
        return;
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchOrders error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ librarian cancel order
  const handleCancel = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/orders/${id}/librarian-cancel`,
        { method: "PATCH" }
      );
      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Cancel failed");
        return;
      }

      setOrders((prev) => prev.map((o) => (o._id === id ? data : o)));
    } catch (err) {
      console.error("cancel error:", err);
      alert("Something went wrong!");
    }
  };

  // ✅ status update: pending->shipped, shipped->delivered
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/orders/${id}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Status update failed");
        return;
      }

      setOrders((prev) => prev.map((o) => (o._id === id ? data : o)));
    } catch (err) {
      console.error("status update error:", err);
      alert("Something went wrong!");
    }
  };

  if (loading) return <p className="text-sm text-gray-600">Loading...</p>;

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Orders
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Here you can see all user orders for the books you added. You can cancel
        an order and update status from <b>pending → shipped → delivered</b>.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">User Email</th>
                <th className="px-4 py-3 text-left">Order Date</th>
                <th className="px-4 py-3 text-left">Order Status</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => {
                const isCancelled = o.status === "cancelled";
                const isDelivered = o.status === "delivered";

                const canCancel = !isCancelled && !isDelivered;

                // ✅ Only allow status change when pending/shipped and not cancelled
                const canChangeStatus =
                  !isCancelled && (o.status === "pending" || o.status === "shipped");

                // ✅ Dropdown values based on current status
                const statusOptions =
                  o.status === "pending"
                    ? ["pending", "shipped"]
                    : o.status === "shipped"
                    ? ["shipped", "delivered"]
                    : [o.status];

                return (
                  <tr key={o._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{o.bookTitle}</td>
                    <td className="px-4 py-3">{o.userEmail}</td>
                    <td className="px-4 py-3">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString()
                        : "—"}
                    </td>

                    {/* ✅ Status dropdown */}
                    <td className="px-4 py-3">
                      {canChangeStatus ? (
                        <select
                          value={o.status}
                          onChange={(e) =>
                            handleStatusChange(o._id, e.target.value)
                          }
                          className="border border-gray-300 rounded-lg px-2 py-1 text-xs outline-none"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-700 capitalize">
                          {o.status}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 capitalize">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] ${
                          o.paymentStatus === "paid"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      {canCancel ? (
                        <button
                          onClick={() => handleCancel(o._id)}
                          className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {orders.length === 0 && (
            <p className="text-sm text-gray-500 px-4 py-6 text-center">
              No orders found for your books.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default LibrarianOrders;
