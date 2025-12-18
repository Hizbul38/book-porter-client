import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import router from "./Routes/Router";
import "./index.css";

import AuthProvider from "./Providers/AuthProvider";
import OrderProvider from "./Providers/OrderProvider";
import BooksProvider from "./Providers/BooksProvider";

// Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <BooksProvider>
          <OrderProvider>
            <RouterProvider router={router} />
          </OrderProvider>
        </BooksProvider>
      </AuthProvider>
    </Elements>
  </React.StrictMode>
);
