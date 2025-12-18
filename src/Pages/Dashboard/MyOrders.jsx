import { useContext } from "react";
import { OrderContext } from "../../Providers/OrderProvider";

const API_URL = import.meta.env.VITE_API_URL;

const MyOrders = () => {
  const { orders, cancelOrder } = useContext(OrderContext);

  // ✅ Stripe Checkout redirect (FINAL)
  const handlePayNow = async (orderId) => {
    try {
      const res = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url; // 🔥 Redirect to Stripe Checkout
      } else {
        alert("Payment initiation failed");
      }
    } catch (error) {
      console.error(error);
      alert("Payment initiation failed");
    }
  };

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
                const showCancel = order.status === "pending";
                const showPay =
                  order.status === "pending" &&
                  order.paymentStatus === "unpaid";

                return (
                  <tr key={order._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{order.bookTitle}</td>

                    <td className="px-4 py-3">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>

                    <td className="px-4 py-3 capitalize">
                      <span className="px-2 py-0.5 rounded-full text-[11px] bg-yellow-50 text-yellow-700">
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
                      {showCancel && (
                        <button
                          onClick={() => cancelOrder(order._id)}
                          className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      )}

                      {showPay && (
                        <button
                          onClick={() => handlePayNow(order._id)}
                          className="text-xs px-3 py-1 rounded-full bg-gray-900 text-white hover:bg-gray-800"
                        >
                          Pay Now
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
              You have not placed any orders yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyOrders;
