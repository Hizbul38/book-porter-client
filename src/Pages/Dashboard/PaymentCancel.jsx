const PaymentCancel = () => {
  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold text-red-600">
        Payment Cancelled
      </h2>
      <p className="text-sm text-gray-600 mt-2">
        You cancelled the payment. You can try again from My Orders.
      </p>
    </div>
  );
};

export default PaymentCancel;
