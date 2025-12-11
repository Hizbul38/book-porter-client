import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OrderContext } from "../../Providers/OrderProvider";

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, markOrderPaid } = useContext(OrderContext);

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <section>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Payment
        </h1>
        <p className="text-sm text-gray-600">
          No order found for ID: <span className="font-mono">{id}</span>.
        </p>
      </section>
    );
  }

  const handleConfirmPayment = (e) => {
    e.preventDefault();

    // fake payment id & date
    const paymentId = `PAY-${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);

    // update context
    markOrderPaid(order.id, paymentId, today);

    alert("Payment successful (demo). Order marked as paid.");
    navigate("/dashboard/my-orders");
  };

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Pay for Order
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Complete your payment for this order. In real app this page will be
        connected to your payment gateway.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-lg">
        <div className="mb-4 text-sm">
          <p className="mb-1">
            <span className="font-medium text-gray-800">Order ID:</span>{" "}
            <span className="font-mono">{order.id}</span>
          </p>
          <p className="mb-1">
            <span className="font-medium text-gray-800">Book:</span>{" "}
            {order.bookTitle}
          </p>
          <p className="mb-1">
            <span className="font-medium text-gray-800">Order Date:</span>{" "}
            {order.orderDate}
          </p>
          <p>
            <span className="font-medium text-gray-800">Amount:</span>{" "}
            ${order.amount.toFixed(2)}
          </p>
        </div>

        <form onSubmit={handleConfirmPayment} className="space-y-4 text-sm">
          {/* demo payment form fields – optional */}
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Card Number (demo)
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              placeholder="0000 0000 0000 0000"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Expiry (MM/YY)
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                placeholder="12/30"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                CVC
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                placeholder="123"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 px-4 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 w-full"
          >
            Confirm Payment
          </button>
        </form>
      </div>
    </section>
  );
};

export default Payment;
