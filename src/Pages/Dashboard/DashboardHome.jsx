const DashboardHome = () => {
  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        Dashboard Overview
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Quick view of your BookCourier activity. Later this data will come from your database.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total Orders</p>
          <p className="text-2xl font-semibold text-gray-900">0</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Pending Orders</p>
          <p className="text-2xl font-semibold text-gray-900">0</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total Paid</p>
          <p className="text-2xl font-semibold text-gray-900">$0.00</p>
        </div>
      </div>
    </section>
  );
};

export default DashboardHome;
