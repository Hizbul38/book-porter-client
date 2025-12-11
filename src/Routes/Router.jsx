import { createBrowserRouter } from "react-router-dom";

import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import AllBooks from "../Pages/AllBooks";
import Dashboard from "../Pages/Dashboard";
import HomeLayout from "../Layouts/HomeLayout";
import BookDetails from "../Pages/BookDetails";
import AuthLayout from "../Layouts/AuthLayout";
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import MyOrders from "../Pages/Dashboard/MyOrders";
import MyProfile from "../Pages/Dashboard/MyProfile";
import Invoices from "../Pages/Dashboard/Invoices";
import LibrarianAddBook from "../Pages/Dashboard/LibrarianAddBook";
import LibrarianMyBooks from "../Pages/Dashboard/LibrarianMyBooks";
import LibrarianEditBook from "../Pages/Dashboard/LibrarianEditBook";
import LibrarianOrders from "../Pages/Dashboard/LibrarianOrders";
import AdminProfile from "../Pages/Dashboard/AdminProfile";
import AdminManageBooks from "../Pages/Dashboard/AdminManageBooks";
import AdminAllUsers from "../Pages/Dashboard/AdminAllUsers";
import Payment from "../Pages/Dashboard/Payment";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { 
        path: "/", element: <Home /> 
      },
      { 
        path: "/all-books", element: <AllBooks /> 
      },
      { 
        path: "/dashboard", element: <Dashboard /> 
      },
     { 
       path: "/all-books/:id", element: <BookDetails></BookDetails>
     },
      ]},

      {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [

      // user

      { index: true, element: <DashboardHome /> },
      { path: "my-orders", element: <MyOrders /> },
      { path: "profile", element: <MyProfile /> },
      { path: "invoices", element: <Invoices /> },
      { path: "payment/:id", element: <Payment /> },

      // Librarian

      { path: "librarian/add-book", element: <LibrarianAddBook /> },
      { path: "librarian/my-books", element: <LibrarianMyBooks /> },
      {
        path: "librarian/books/:id/edit",
        element: <LibrarianEditBook />,
      },
      { path: "librarian/orders", element: <LibrarianOrders /> },
      
      // Admin

      { path: "admin/users", element: <AdminAllUsers /> },
    { path: "admin/manage-books", element: <AdminManageBooks /> },
    { path: "admin/profile", element: <AdminProfile /> },
    ],
  },
]);

export default router;
