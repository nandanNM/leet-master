import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store";

export default function AdminRoute() {
  const { isAuthenticated, authUser: user } = useAuthStore();

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
