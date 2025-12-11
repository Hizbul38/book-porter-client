const demoInvoices = [
  {
    id: "PAY-001",
    amount: 12,
    date: "2025-01-15",
    bookTitle: "Atomic Habits",
  },
  {
    id: "PAY-002",
    amount: 18,
    date: "2025-01-20",
    bookTitle: "Clean Code",
  },
];

const Invoices = () => {
  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Invoices
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Payments you have made for your book orders.
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
              {demoInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">{invoice.id}</td>
                  <td className="px-4 py-3">{invoice.bookTitle}</td>
                  <td className="px-4 py-3">{invoice.date}</td>
                  <td className="px-4 py-3 text-right">
                    ${invoice.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {demoInvoices.length === 0 && (
            <p className="text-sm text-gray-500 px-4 py-6 text-center">
              No invoices found yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Invoices;
