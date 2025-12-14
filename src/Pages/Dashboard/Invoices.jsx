import { useContext, useEffect, useState } from "react";
import { OrderContext } from "../../Providers/OrderProvider";

const Invoices = () => {
  const { user } = useContext(OrderContext);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3000/invoices?email=${encodeURIComponent(user.email)}`
        );
        const data = await res.json();
        if (res.ok) setInvoices(Array.isArray(data) ? data : []);
      } catch {
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [user.email]);

  if (loading) return <p className="text-sm text-gray-600">Loading...</p>;

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Invoices
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Payment ID</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Book</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{inv.paymentId}</td>
                  <td className="px-4 py-3">${Number(inv.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    {inv.paymentDate ? new Date(inv.paymentDate).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">{inv.bookTitle || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {invoices.length === 0 && (
            <p className="text-sm text-gray-500 px-4 py-6 text-center">
              No invoices found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Invoices;
