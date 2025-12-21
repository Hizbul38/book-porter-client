import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { OrderContext } from "../../Providers/OrderProvider";
import { AuthContext } from "../../Providers/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

const MyOrders = () => {
  const {
    orders,
    loadingOrders,
    fetchOrders,
    cancelOrder,
    markOrderPaidLocal,
  } = useContext(OrderContext);

  const { user } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  const [payLoadingId, setPayLoadingId] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // ✅ Stripe redirect handler
  // success_url: /dashboard/my-orders?success=1&session_id=...
  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(location.search);
      const success = params.get("success");
      const sessionId = params.get("session_id");
      const cancel = params.get("cancel");

      // cancel -> refresh + clean URL
      if (cancel) {
        await fetchOrders?.();
        navigate(location.pathname, { replace: true });
        return;
      }

      // success + session -> verify with backend
      if (success && sessionId) {
        if (!user) {
          navigate(location.pathname, { replace: true });
          return;
        }

        try {
          setVerifying(true);

          const token = await user.getIdToken(true);

          const res = await fetch(`${API_URL}/verify-payment`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ sessionId }),
          });

          const data = await res.json().catch(() => ({}));

          if (!res.ok) {
            console.error("verify-payment error:", data);
            alert(data?.message || "Payment verification failed");
          } else {
            // ✅ instant UI update
            if (data?.orderId) {
              markOrderPaidLocal?.(data.orderId);
            }
          }

          // ✅ always refetch to confirm DB truth
          await fetchOrders?.();
        } catch (e) {
          console.error("verify-payment crash:", e);
          alert("Payment verification failed");
        } finally {
          setVerifying(false);
          // ✅ clean URL
          navigate(location.pathname, { replace: true });
        }
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, user]);

  // ✅ Pay Now -> Stripe checkout redirect
  const handlePayNow = async (orderId) => {
    if (!orderId) return;
    if (!user) return alert("Please login first");

    try {
      setPayLoadingId(orderId);

      const token = await user.getIdToken(true);

      const res = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data?.message || "Payment initiation failed");
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("Payment initiation failed");
      }
    } catch (error) {
      console.error("Pay now error:", error);
      alert("Payment initiation failed");
    } finally {
      setPayLoadingId(null);
    }
  };

  const rows = useMemo(() => {
    return Array.isArray(orders) ? orders : [];
  }, [orders]);

  if (loadingOrders || verifying) {
    return (
      <p className="text-sm text-gray-600">
        {verifying ? "Verifying payment..." : "Loading orders..."}
      </p>
    );
  }

  return (
    <section>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        My Orders
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        All the books you have ordered and their current status.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">Order Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((order) => {
                const status = (order?.status || "").toLowerCase();
                const payment = (order?.paymentStatus || "unpaid").toLowerCase();

                const isPending = status === "pending";
                const isCancelled = status === "cancelled";
                const isPaid = payment === "paid";

                const showCancel = isPending;
                const showPayNow = isPending && !isPaid;

                return (
                  <tr key={order._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{order.bookTitle || "—"}</td>

                    <td className="px-4 py-3">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "—"}
                    </td>

                    <td className="px-4 py-3 capitalize">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] ${
                          isCancelled
                            ? "bg-gray-100 text-gray-700"
                            : isPending
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {status || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-3 capitalize">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] ${
                          isPaid
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {payment}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      {!isCancelled && (
                        <>
                          {showCancel && (
                            <button
                              onClick={() => cancelOrder(order._id)}
                              className="text-xs px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                          )}

                          {showPayNow && (
                            <button
                              onClick={() => handlePayNow(order._id)}
                              disabled={payLoadingId === order._id}
                              className={`text-xs px-3 py-1 rounded-full text-white ${
                                payLoadingId === order._id
                                  ? "bg-gray-400"
                                  : "bg-gray-900 hover:bg-gray-800"
                              }`}
                            >
                              {payLoadingId === order._id
                                ? "Redirecting..."
                                : "Pay Now"}
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {rows.length === 0 && (
            <p className="text-sm text-gray-500 px-4 py-6 text-center">
              You have not placed any orders yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyOrders;
