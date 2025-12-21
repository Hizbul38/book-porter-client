import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { AuthContext } from "../../Providers/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

const Payment = () => {
  const { id } = useParams(); // orderId
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const { user } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  // ✅ Load order (protected)
  useEffect(() => {
    const run = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const token = await user.getIdToken(true);

        const res = await fetch(`${API_URL}/orders/${id}`, {
          headers: { authorization: `Bearer ${token}` },
        });

        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setError(data?.message || "Failed to load order");
          setOrder(null);
          return;
        }

        setOrder(data);
      } catch (e) {
        setError("Failed to load order");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id, user]);

  // ✅ Create payment intent (protected)
  useEffect(() => {
    const run = async () => {
      if (!user) return;
      if (!order?.amount || order?.amount <= 0) return;

      try {
        const token = await user.getIdToken(true);

        const res = await fetch(`${API_URL}/create-payment-intent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: order.amount }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.clientSecret) {
          setError(data?.message || "Payment initialization failed");
          return;
        }

        setClientSecret(data.clientSecret);
      } catch {
        setError("Payment initialization failed");
      }
    };

    run();
  }, [order, user]);

  // ✅ Handle payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!user) return alert("Please login first");

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

    if (paymentIntent?.status === "succeeded") {
      try {
        const token = await user.getIdToken(true);

        const res = await fetch(`${API_URL}/payments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: order._id,
            transactionId: paymentIntent.id,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          alert(data?.message || "Payment save failed");
          setPaying(false);
          return;
        }

        alert("✅ Payment Successful!");
        navigate("/dashboard/my-orders"); // requirement wise better to go back
      } catch {
        alert("Payment save failed");
      }
    }

    setPaying(false);
  };

  if (loading) return <p className="text-sm">Loading...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
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
