import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "./AuthProvider";

export const OrderContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

const OrderProvider = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // ✅ Fetch Orders
  const fetchOrders = useCallback(async () => {
    if (!user?.email) return;

    try {
      setLoadingOrders(true);

      const token = await user.getIdToken(true);
      const res = await fetch(`${API_URL}/orders`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => []);

      if (!res.ok) {
        console.error("fetchOrders API error:", res.status, data);
        setOrders([]);
        return;
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchOrders error:", err);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, [user?.email, user]);

  useEffect(() => {
    if (loading) return;

    if (user?.email) {
      fetchOrders();
    } else {
      setOrders([]);
      setLoadingOrders(false);
    }
  }, [user?.email, loading, fetchOrders]);

  // ✅ Instant UI add (optional)
  const addOrderToList = (newOrder) => {
    if (!newOrder?._id) return;

    setOrders((prev) => {
      const exists = prev.some((o) => o._id === newOrder._id);
      if (exists) return prev;
      return [newOrder, ...prev];
    });
  };

  // ✅ Cancel Order
  const cancelOrder = async (id) => {
    if (!id) return;
    if (!user) return alert("Please login first");

    try {
      const token = await user.getIdToken(true);

      const res = await fetch(`${API_URL}/orders/${id}/cancel`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data?.message || "Cancel failed");
        return;
      }

      // ✅ update UI
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: "cancelled" } : o))
      );
    } catch (err) {
      console.error("cancelOrder error:", err);
      alert("Cancel failed");
    }
  };

  // ✅ Local paid mark (used in MyOrders after verify-payment)
  const markOrderPaidLocal = (orderId) => {
    if (!orderId) return;

    setOrders((prev) =>
      prev.map((o) =>
        String(o._id) === String(orderId) ? { ...o, paymentStatus: "paid" } : o
      )
    );
  };

  const value = {
    orders,
    loadingOrders,
    fetchOrders,
    addOrderToList,
    cancelOrder,
    markOrderPaidLocal,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export default OrderProvider;
