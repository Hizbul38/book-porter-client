import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import AllBooks from "../Pages/AllBooks";
import Dashboard from "../Pages/Dashboard";
const router = createBrowserRouter([
  { 
    path: "/", element: <Home /> 
  },
  {
    path: "/all-books", element: <AllBooks></AllBooks>
  },
  {
    path: "/dashboard", element: <Dashboard></Dashboard>
  },
  { 
    path: "/login", element: <Login /> 
  },
  {
    path: "/register", element: <Register></Register>
  },
]);

export default router;
