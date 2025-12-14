import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OrderContext } from "../../Providers/OrderProvider";

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { markOrderPaid } = useContext(OrderContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/orders/${id}`);
        const data = await res.json();
        if (res.ok) setOrder(data);
        else setOrder(null);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const handlePay = async () => {
    if (!order) return;
    setPaying(true);

    const updated = await markOrderPaid(order._id);

    setPaying(false);

    if (updated) {
      alert("✅ Payment successful!");
      navigate("/dashboard/my-orders");
    }
  };

  if (loading) return <p className="text-sm text-gray-600">Loading...</p>;
  if (!order) return <p className="text-sm text-gray-600">Order not found.</p>;

  const alreadyPaid = order.paymentStatus === "paid";
  const cancelled = order.status === "cancelled";

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Payment
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-xl">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Book:</span> {order.bookTitle}
        </p>
        <p className="text-sm text-gray-700 mt-1">
          <span className="font-semibold">Amount:</span> ${Number(order.amount).toFixed(2)}
        </p>
        <p className="text-sm text-gray-700 mt-1">
          <span className="font-semibold">Status:</span> {order.status}
        </p>
        <p className="text-sm text-gray-700 mt-1">
          <span className="font-semibold">Payment:</span> {order.paymentStatus}
        </p>

        <button
          onClick={handlePay}
          disabled={paying || alreadyPaid || cancelled}
          className={`mt-4 px-4 py-2 rounded-full text-sm font-medium text-white ${
            paying || alreadyPaid || cancelled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-900 hover:bg-gray-800"
          }`}
        >
          {alreadyPaid ? "Paid" : cancelled ? "Cancelled" : paying ? "Paying..." : "Pay Now"}
        </button>
      </div>
    </section>
  );
};

export default Payment;
