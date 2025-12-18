import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

const Invoices = () => {
  const { user, loading } = useContext(AuthContext); // ✅ Auth user
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  useEffect(() => {
    // 🛑 guard clause (MOST IMPORTANT)
    if (loading || !user?.email) return;

    const loadInvoices = async () => {
      try {
        setLoadingInvoices(true);
        const res = await fetch(
          `${API_URL}/invoices?email=${encodeURIComponent(user.email)}`
        );
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setInvoices(data);
        } else {
          setInvoices([]);
        }
      } catch (error) {
        console.error("Invoice fetch error:", error);
        setInvoices([]);
      } finally {
        setLoadingInvoices(false);
      }
    };

    loadInvoices();
  }, [user?.email, loading]);

  // ===============================
  // UI STATES
  // ===============================
  if (loading || loadingInvoices) {
    return <p className="text-sm text-gray-600">Loading invoices...</p>;
  }

  if (!user) {
    return (
      <p className="text-sm text-red-500">
        Please login to view invoices.
      </p>
    );
  }

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
                  <td className="px-4 py-3">
                    ${Number(inv.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    {inv.paymentDate
                      ? new Date(inv.paymentDate).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {inv.bookTitle || "—"}
                  </td>
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
