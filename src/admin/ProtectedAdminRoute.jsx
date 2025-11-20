import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
