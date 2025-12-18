import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Providers/UserProvider";

const AdminRoute = ({ children }) => {
  const { dbUser, loading } = useContext(UserContext);

  if (loading) return <p>Loading...</p>;
  if (dbUser?.role === "admin") return children;

  return <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
