// src/Providers/OrderProvider.jsx
import { createContext, useState } from "react";

export const OrderContext = createContext(null);

// demo initial orders – pore API theke asbe
const initialOrders = [
  {
    id: "ORD-001",
    bookTitle: "Atomic Habits",
    orderDate: "2025-01-12",
    status: "pending",      // pending | shipped | delivered | cancelled
    paymentStatus: "unpaid",// unpaid | paid
    amount: 12,
    paymentId: null,
    paymentDate: null,
  },
  {
    id: "ORD-002",
    bookTitle: "Clean Code",
    orderDate: "2025-01-15",
    status: "shipped",
    paymentStatus: "paid",
    amount: 18,
    paymentId: "PAY-1001",
    paymentDate: "2025-01-20",
  },
];

const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(initialOrders);

  const cancelOrder = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id && order.status === "pending"
          ? { ...order, status: "cancelled" }
          : order
      )
    );
  };

  const markOrderPaid = (id, paymentId, paymentDate) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              paymentStatus: "paid",
              paymentId,
              paymentDate,
            }
          : order
      )
    );
  };

  const value = {
    orders,
    cancelOrder,
    markOrderPaid,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export default OrderProvider;
