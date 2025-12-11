import { useState } from "react";

const initialOrders = [
  {
    id: "ORD-001",
    bookTitle: "Atomic Habits",
    customerName: "Demo User",
    orderDate: "2025-01-12",
    status: "pending",
    paymentStatus: "unpaid",
  },
  {
    id: "ORD-002",
    bookTitle: "Clean Code",
    customerName: "Another User",
    orderDate: "2025-01-15",
    status: "shipped",
    paymentStatus: "paid",
  },
];

const LibrarianOrders = () => {
  const [orders, setOrders] = useState(initialOrders);

  const cancelOrder = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? { ...order, status: "cancelled" } // buttons e pore hide
          : order
      )
    );
  };

  const nextStatus = (current) => {
    if (current === "pending") return "shipped";
    if (current === "shipped") return "delivered";
    return current;
  };

  const updateStatus = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? { ...order, status: nextStatus(order.status) }
          : order
      )
    );
  };

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Orders for My Books
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Manage orders placed for the books you have added. You can cancel an order or update its delivery status.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Order Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isCancelled = order.status === "cancelled";
                const isDelivered = order.status === "delivered";

                return (
                  <tr key={order.id} className="border-top border-gray-100">
                    <td className="px-4 py-3">{order.bookTitle}</td>
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3">{order.orderDate}</td>
                    <td className="px-4 py-3 capitalize">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] ${
                          order.status === "pending"
                            ? "bg-yellow-50 text-yellow-700"
                            : order.status === "shipped"
                            ? "bg-blue-50 text-blue-700"
                            : order.status === "delivered"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] ${
                          order.paymentStatus === "paid"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {/* Cancel button only if not cancelled / delivered */}
                      {!isCancelled && !isDelivered && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      )}

                      {/* Status update: pending -> shipped -> delivered */}
                      {!isCancelled && !isDelivered && (
                        <button
                          onClick={() => updateStatus(order.id)}
                          className="text-xs px-3 py-1 rounded-full bg-gray-900 text-white hover:bg-gray-800"
                        >
                          Mark as {nextStatus(order.status)}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {orders.length === 0 && (
            <p className="text-sm text-gray-500 px-4 py-6 text-center">
              No orders for your books yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default LibrarianOrders;
