import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";

export const OrderContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

const OrderProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // ✅ REAL USER
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // ===============================
  // FETCH ORDERS
  // ===============================
  const fetchOrders = async () => {
    if (!user?.email) return;

    try {
      setLoadingOrders(true);
      const res = await fetch(
        `${API_URL}/orders?email=${encodeURIComponent(user.email)}`
      );
      const data = await res.json();

      if (res.ok) {
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("fetchOrders error:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.email]);

  // ===============================
  // ADD ORDER (INSTANT UI UPDATE)
  // ===============================
  const addOrderToList = (newOrder) => {
    if (!newOrder?._id) return;
    setOrders((prev) => [newOrder, ...prev]);
  };

  // ===============================
  // CANCEL ORDER (LOCAL ONLY)
  // ===============================
  const cancelOrder = async (id) => {
    // ⚠️ backend cancel API নাই → UI only
    setOrders((prev) =>
      prev.map((o) =>
        o._id === id ? { ...o, status: "cancelled" } : o
      )
    );
  };

  // ===============================
  // UPDATE PAYMENT STATUS (CALLED AFTER STRIPE SUCCESS)
  // ===============================
  const markOrderPaidLocal = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId
          ? { ...o, paymentStatus: "paid" }
          : o
      )
    );
  };

  const value = {
    orders,
    loadingOrders,
    fetchOrders,
    addOrderToList,
    cancelOrder,
    markOrderPaidLocal, // ✅ Stripe success page use করবে
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;
