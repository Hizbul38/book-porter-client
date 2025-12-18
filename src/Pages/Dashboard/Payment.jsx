import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const API_URL = import.meta.env.VITE_API_URL;

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  // ===============================
  // Load order
  // ===============================
  useEffect(() => {
    fetch(`${API_URL}/orders/${id}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .finally(() => setLoading(false));
  }, [id]);

  // ===============================
  // Create payment intent
  // ===============================
  useEffect(() => {
    if (order?.amount > 0) {
      fetch(`${API_URL}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: order.amount }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            setError("Payment initialization failed");
          }
        })
        .catch(() => setError("Payment initialization failed"));
    }
  }, [order]);

  // ===============================
  // Handle payment
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setPaying(true);
    setError("");

    const card = elements.getElement(CardElement);

    const { error: confirmError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

    if (confirmError) {
      setError(confirmError.message);
      setPaying(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      await fetch(`${API_URL}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id,
          transactionId: paymentIntent.id,
        }),
      });

      alert("✅ Payment Successful!");
      navigate("/dashboard/invoices");
    }

    setPaying(false);
  };

  // ===============================
  // UI states
  // ===============================
  if (loading) return <p className="text-sm">Loading...</p>;
  if (!order) return <p className="text-sm">Order not found.</p>;
  if (order.paymentStatus === "paid")
    return <p className="text-green-600">✅ This order is already paid.</p>;

  return (
    <section>
      <h1 className="text-xl font-bold mb-4">Payment</h1>

      <div className="bg-white border rounded-xl p-5 max-w-xl">
        <p className="text-sm">
          <strong>Book:</strong> {order.bookTitle}
        </p>
        <p className="text-sm mb-4">
          <strong>Amount:</strong> ${Number(order.amount).toFixed(2)}
        </p>

        <form onSubmit={handleSubmit}>
          <CardElement className="p-3 border rounded-lg" />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            disabled={!stripe || !clientSecret || paying}
            className={`mt-4 w-full py-2 rounded-full text-white ${
              paying
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-900 hover:bg-gray-800"
            }`}
          >
            {paying ? "Paying..." : `Pay $${order.amount}`}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Payment;
