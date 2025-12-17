import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

// ✅ Stripe public key from .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

// ✅ API base URL from .env
const API_URL = import.meta.env.VITE_API_URL;

const CheckoutForm = ({ order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  // ===============================
  // CREATE PAYMENT INTENT (DEMO)
  // ===============================
  useEffect(() => {
    if (order?.amount > 0) {
      fetch(`${API_URL}/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price: order.amount }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        })
        .catch(() => setError("Payment initialization failed"));
    }
  }, [order]);

  // ===============================
  // HANDLE STRIPE PAYMENT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaying(true);
    setError("");

    const card = elements.getElement(CardElement);

    // create payment method
    const { error: methodError } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (methodError) {
      setError(methodError.message);
      setPaying(false);
      return;
    }

    // confirm payment
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

    if (confirmError) {
      setError(confirmError.message);
      setPaying(false);
      return;
    }

    // ===============================
    // PAYMENT SUCCESS
    // ===============================
    if (paymentIntent.status === "succeeded") {
      await fetch(`${API_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order._id,
          email: order.userEmail,
          amount: order.amount,
          transactionId: paymentIntent.id,
        }),
      });

      alert("✅ Payment Successful!");
      navigate("/dashboard/invoices");
    }

    setPaying(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <CardElement
        className="p-3 border rounded-lg"
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#1f2937",
            },
          },
        }}
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || !clientSecret || paying}
        className={`mt-4 px-4 py-2 rounded-full text-sm font-medium text-white ${
          paying
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-900 hover:bg-gray-800"
        }`}
      >
        {paying ? "Paying..." : `Pay $${Number(order.amount).toFixed(2)}`}
      </button>
    </form>
  );
};

const Payment = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // LOAD ORDER
  // ===============================
  useEffect(() => {
    fetch(`${API_URL}/orders/${id}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-gray-600">Loading...</p>;
  if (!order) return <p className="text-sm text-gray-600">Order not found.</p>;
  if (order.paymentStatus === "paid")
    return (
      <p className="text-green-600 font-medium">
        ✅ This order is already paid.
      </p>
    );
  if (order.status === "cancelled")
    return (
      <p className="text-red-500 font-medium">
        ❌ Cancelled orders cannot be paid.
      </p>
    );

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
          <span className="font-semibold">Amount:</span> $
          {Number(order.amount).toFixed(2)}
        </p>

        <Elements stripe={stripePromise}>
          <CheckoutForm order={order} />
        </Elements>
      </div>
    </section>
  );
};

export default Payment;
