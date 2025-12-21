import { createBrowserRouter } from "react-router-dom";

// =====================
// Public pages
// =====================
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import AllBooks from "../Pages/AllBooks";
import BookDetails from "../Pages/BookDetails";

// =====================
// Layouts
// =====================
import HomeLayout from "../Layouts/HomeLayout";
import AuthLayout from "../Layouts/AuthLayout";
import DashboardLayout from "../Layouts/DashboardLayout";

// =====================
// Dashboard common
// =====================
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import MyOrders from "../Pages/Dashboard/MyOrders";
import MyProfile from "../Pages/Dashboard/MyProfile";
import Invoices from "../Pages/Dashboard/Invoices";

// =====================
// Stripe / Payment
// =====================
import Payment from "../Pages/Dashboard/Payment";
import PaymentSuccess from "../Pages/Dashboard/PaymentSuccess";
import PaymentCancel from "../Pages/Dashboard/PaymentCancel";

// =====================
// Librarian
// =====================
import LibrarianAddBook from "../Pages/Dashboard/LibrarianAddBook";
import LibrarianMyBooks from "../Pages/Dashboard/LibrarianMyBooks";

// ✅ OPTION A: যদি তোমার ফাইল নাম LibrarianEditBook থাকে
import LibrarianEditBook from "../Pages/Dashboard/LibrarianEditBook";

// ✅ OPTION B: যদি তুমি আমার দেওয়া নতুন ফাইল EditBook.jsx ব্যবহার করো,
// তাহলে উপরেরটা comment করে এটা use করো:
// import LibrarianEditBook from "../Pages/Dashboard/EditBook";

import LibrarianOrders from "../Pages/Dashboard/LibrarianOrders";

// =====================
// Admin
// =====================
import AdminProfile from "../Pages/Dashboard/AdminProfile";
import AdminManageBooks from "../Pages/Dashboard/AdminManageBooks";
import AdminAllUsers from "../Pages/Dashboard/AdminAllUsers";

// (Optional but recommended)
import ErrorPage from "../Pages/ErrorPage";

const router = createBrowserRouter([
  // =====================
  // Public (Home)
  // =====================
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },

      // ✅ All books (support both /books and /all-books)
      { path: "books", element: <AllBooks /> },
      { path: "all-books", element: <AllBooks /> },

      // ✅ Book Details
      { path: "books/:id", element: <BookDetails /> },
    ],
  },

  // =====================
  // Auth
  // =====================
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  // =====================
  // Dashboard
  // =====================
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      // -------- User --------
      { index: true, element: <DashboardHome /> },
      { path: "my-orders", element: <MyOrders /> },
      { path: "profile", element: <MyProfile /> },
      { path: "invoices", element: <Invoices /> },

      // -------- Payment --------
      { path: "payment/:id", element: <Payment /> },
      { path: "payment-success", element: <PaymentSuccess /> },
      { path: "payment-cancel", element: <PaymentCancel /> },

      // -------- Librarian --------
      { path: "librarian/add-book", element: <LibrarianAddBook /> },
      { path: "librarian/my-books", element: <LibrarianMyBooks /> },

      // ✅ Edit page route (requirement অনুযায়ী)
      {
        path: "librarian/books/:id/edit",
        element: <LibrarianEditBook />,
      },

      { path: "librarian/orders", element: <LibrarianOrders /> },

      // -------- Admin --------
      { path: "admin/users", element: <AdminAllUsers /> },
      { path: "admin/manage-books", element: <AdminManageBooks /> },
      { path: "admin/profile", element: <AdminProfile /> },
    ],
  },
]);

export default router;
