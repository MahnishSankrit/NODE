import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  console.log("not authenticated");
  

  return token ? <Outlet /> : <Navigate to="/" />;
}
