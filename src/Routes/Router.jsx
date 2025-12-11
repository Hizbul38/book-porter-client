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
      { index: true, element: <DashboardHome /> },
      { path: "my-orders", element: <MyOrders /> },
      { path: "profile", element: <MyProfile /> },
      { path: "invoices", element: <Invoices /> },
    ],
  },
]);

export default router;
