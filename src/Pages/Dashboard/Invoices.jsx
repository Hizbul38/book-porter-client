import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../Providers/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

const formatMoney = (n) => {
  const num = Number(n || 0);
  return `$${num.toFixed(2)}`;
};

const formatDateTime = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString();
};

const Invoices = () => {
  const { user, loading } = useContext(AuthContext);

  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [error, setError] = useState("");

  // UI helpers
  const [query, setQuery] = useState("");
  const [showBook, setShowBook] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user?.email) {
      setInvoices([]);
      setLoadingInvoices(false);
      return;
    }

    const loadInvoices = async () => {
      try {
        setLoadingInvoices(true);
        setError("");

        const token = await user.getIdToken(true);

        const res = await fetch(`${API_URL}/invoices`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json().catch(() => []);

        if (!res.ok) {
          console.error("Invoices API error:", res.status, data);
          setInvoices([]);
          setError(data?.message || "Failed to load invoices");
          return;
        }

        // ✅ normalize + newest first fallback
        const arr = Array.isArray(data) ? data : [];
        arr.sort((a, b) => {
          const da = new Date(a?.paymentDate || a?.createdAt || 0).getTime();
          const db = new Date(b?.paymentDate || b?.createdAt || 0).getTime();
          return db - da;
        });

        setInvoices(arr);
      } catch (err) {
        console.error("Invoice fetch error:", err);
        setInvoices([]);
        setError("Invoice fetch failed");
      } finally {
        setLoadingInvoices(false);
      }
    };

    loadInvoices();
  }, [user?.email, loading, user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return invoices;

    return invoices.filter((inv) => {
      const paymentId = String(inv?.paymentId || inv?.transactionId || inv?._id || "").toLowerCase();
      const bookTitle = String(inv?.bookTitle || "").toLowerCase();
      return paymentId.includes(q) || bookTitle.includes(q);
    });
  }, [invoices, query]);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(String(text));
      // lightweight feedback
      alert("Payment ID copied ✅");
    } catch {
      alert("Copy failed");
    }
  };

  if (loading || loadingInvoices) {
    return <p className="text-sm text-gray-600">Loading invoices...</p>;
  }

  if (!user) {
    return <p className="text-sm text-red-500">Please login to view invoices.</p>;
  }

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Invoices
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Your payment history (Payment ID, Amount, Date).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Payment ID or Book name..."
            className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-200"
          />

          <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
            <input
              type="checkbox"
              checked={showBook}
              onChange={(e) => setShowBook(e.target.checked)}
            />
            Show book
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Payment ID</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Date</th>
                {showBook && <th className="px-4 py-3 text-left">Book</th>}
              </tr>
            </thead>

            <tbody>
              {filtered.map((inv) => {
                const paymentId = inv?.paymentId || inv?.transactionId || inv?._id;
                return (
                  <tr key={inv._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs break-all">
                          {paymentId || "—"}
                        </span>
                        {paymentId && (
                          <button
                            onClick={() => handleCopy(paymentId)}
                            className="text-[11px] px-2 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
                            title="Copy Payment ID"
                          >
                            Copy
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">{formatMoney(inv?.amount)}</td>

                    <td className="px-4 py-3">
                      {formatDateTime(inv?.paymentDate || inv?.createdAt)}
                    </td>

                    {showBook && (
                      <td className="px-4 py-3">{inv?.bookTitle || "—"}</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-gray-500">
                {query.trim()
                  ? "No invoices matched your search."
                  : "No invoices found."}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Tip: Complete a payment to generate an invoice automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Invoices;
