import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./Routes/Router";
import "./index.css";
import AuthProvider from "./Providers/AuthProvider";
import OrderProvider from "./Providers/OrderProvider";
import BooksProvider from "./Providers/BooksProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BooksProvider>
        <OrderProvider>
        <RouterProvider router={router} />
      </OrderProvider>
      </BooksProvider>
    </AuthProvider>
  </React.StrictMode>
);
