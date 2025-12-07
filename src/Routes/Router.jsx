import { createBrowserRouter } from "react-router-dom";

import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import AllBooks from "../Pages/AllBooks";
import Dashboard from "../Pages/Dashboard";
import HomeLayout from "../Layouts/HomeLayout";

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
      ]},
      
     { 
      path: "/login", element: <Login /> 
     },
     { 
       path: "/register", element: <Register /> 
    },
]);

export default router;
