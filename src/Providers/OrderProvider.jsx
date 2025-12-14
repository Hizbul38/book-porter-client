import { createContext, useEffect, useState } from "react";

export const OrderContext = createContext(null);

const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // demo user – pore real logged in user diye replace korba
  const user = {
    email: "demo@bookcourier.com",
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/orders?email=${encodeURIComponent(user.email)}`
      );
      const data = await res.json();

      if (!res.ok) return;

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchOrders error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addOrderToList = (newOrder) => {
    if (!newOrder?._id) return;
    setOrders((prev) => [newOrder, ...prev]);
  };

  const cancelOrder = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/orders/${id}/cancel`, {
        method: "PATCH",
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Cancel failed");
        return;
      }

      setOrders((prev) => prev.map((o) => (o._id === id ? data : o)));
    } catch (err) {
      console.error("cancelOrder error:", err);
      alert("Something went wrong!");
    }
  };

  const markOrderPaid = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/orders/${id}/pay`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ paymentId: `PAY-${Date.now()}` }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Payment failed");
        return null;
      }

      setOrders((prev) => prev.map((o) => (o._id === id ? data : o)));
      return data;
    } catch (err) {
      console.error("markOrderPaid error:", err);
      alert("Something went wrong!");
      return null;
    }
  };

  const value = {
    orders,
    fetchOrders,
    addOrderToList,
    cancelOrder,
    markOrderPaid,
    user, // payment/invoices/profile page e email lagbe
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export default OrderProvider;
