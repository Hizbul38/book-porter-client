import { createContext, useEffect, useState } from "react";

export const OrderContext = createContext(null);

const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // demo user – pore real logged in user diye replace korba
  const user = {
    email: "demo@bookcourier.com",
  };

  // ✅ fetch orders from DB
  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:3000/orders?email=${user.email}`);
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch (err) {
      console.error("fetchOrders error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ instant UI update after placing order
  const addOrderToList = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  // ✅ cancel order in DB + update UI
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

  // ✅ pay order in DB + update UI (demo)
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
        return;
      }

      setOrders((prev) => prev.map((o) => (o._id === id ? data : o)));
    } catch (err) {
      console.error("markOrderPaid error:", err);
      alert("Something went wrong!");
    }
  };

  // 🔥 book delete hole oi bookId er sob order delete (local state)
  const deleteOrdersByBook = (bookId) => {
    setOrders((prev) => prev.filter((order) => String(order.bookId) !== String(bookId)));
  };

  const value = {
    orders,
    fetchOrders,
    addOrderToList,
    cancelOrder,
    markOrderPaid,
    deleteOrdersByBook,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export default OrderProvider;
