import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 text-center">
      <h1 className="text-2xl md:text-3xl font-bold text-green-600 mb-3">
        ✅ Payment Successful
      </h1>

      <p className="text-sm md:text-base text-gray-600 mb-6">
        Your payment has been completed successfully.
        An invoice has been generated automatically.
      </p>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => navigate("/dashboard/invoices")}
          className="px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm hover:bg-gray-800"
        >
          View Invoice
        </button>

        <button
          onClick={() => navigate("/dashboard/my-orders")}
          className="px-5 py-2.5 rounded-full border border-gray-300 text-sm hover:bg-gray-100"
        >
          My Orders
        </button>
      </div>
    </section>
  );
};

export default PaymentSuccess;
