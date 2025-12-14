import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { OrderContext } from "../../Providers/OrderProvider";

const MyOrders = () => {
  const { orders, cancelOrder } = useContext(OrderContext);
  const navigate = useNavigate();

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        My Orders
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        All the books you have ordered and their current status.
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
              {orders.map((order) => {
                const isPending = order.status === "pending";
                const isUnpaid = order.paymentStatus === "unpaid";
                const isCancelled = order.status === "cancelled";

                const showCancelButton = isPending; // only pending
                const showPayNowButton = isPending && isUnpaid; // only pending+unpaid

                // cancel করলে সব buttons hide: conditions already handle it
                return (
                  <tr key={order._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{order.bookTitle}</td>

                    <td className="px-4 py-3">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "—"}
                    </td>

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
                      {showCancelButton && (
                        <button
                          onClick={() => cancelOrder(order._id)}
                          className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      )}

                      {showPayNowButton && (
                        <button
                          onClick={() => navigate(`/dashboard/payment/${order._id}`)}
                          className="text-xs px-3 py-1 rounded-full bg-gray-900 text-white hover:bg-gray-800"
                        >
                          Pay Now
                        </button>
                      )}

                      {isCancelled && null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {orders.length === 0 && (
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
