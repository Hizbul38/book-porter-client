const demoOrders = [
  {
    id: "ORD-001",
    bookTitle: "Atomic Habits",
    orderDate: "2025-01-12",
    status: "pending",
    paymentStatus: "unpaid",
  },
  {
    id: "ORD-002",
    bookTitle: "Clean Code",
    orderDate: "2025-01-15",
    status: "shipped",
    paymentStatus: "paid",
  },
];

const MyOrders = () => {
  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        My Orders
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        All the books you have ordered from BookCourier.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">Order Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {demoOrders.map((order) => {
                const isPending = order.status === "pending";
                const isUnpaid = order.paymentStatus === "unpaid";

                return (
                  <tr key={order.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{order.bookTitle}</td>
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
                      {isPending && (
                        <button className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100">
                          Cancel
                        </button>
                      )}
                      {isPending && isUnpaid && (
                        <button className="text-xs px-3 py-1 rounded-full bg-gray-900 text-white hover:bg-gray-800">
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {demoOrders.length === 0 && (
            <p className="text-sm text-gray-500 px-4 py-6 text-center">
              You have not placed any orders yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyOrders;
