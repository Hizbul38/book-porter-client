import { useContext } from "react";
import { OrderContext } from "../../Providers/OrderProvider";

const Invoices = () => {
  const { orders } = useContext(OrderContext);

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Invoices
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        All the payments you have made for your orders.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Payment ID</th>
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {paidOrders.map((order) => (
                <tr key={order.paymentId || order.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    {order.paymentId || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {order.bookTitle}
                  </td>
                  <td className="px-4 py-3">
                    {order.paymentDate || "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    ${order.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paidOrders.length === 0 && (
            <p className="text-sm text-gray-500 px-4 py-6 text-center">
              You have not made any payments yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Invoices;
