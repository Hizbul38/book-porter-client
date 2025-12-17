import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const orderId = params.get("orderId");
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (orderId && sessionId) {
      fetch(`${API_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          transactionId: sessionId,
        }),
      })
        .then(() => {
          navigate("/dashboard/invoices");
        })
        .catch(() => {
          navigate("/dashboard/my-orders");
        });
    }
  }, [orderId, sessionId, navigate]);

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold text-green-600">
        Payment Successful 🎉
      </h2>
      <p className="text-sm text-gray-600 mt-2">
        Processing your payment, please wait...
      </p>
    </div>
  );
};

export default PaymentSuccess;
