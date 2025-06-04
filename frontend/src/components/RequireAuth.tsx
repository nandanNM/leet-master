// components/RequireAuth.tsx
import { useAuthStore } from "@/store";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

export function RequireAuth({ role }: { role?: "USER" | "ADMIN" }) {
  const { isAuthenticated, authUser, isFetchingUser } = useAuthStore();
  if (!authUser && isFetchingUser) {
    <div className="w-full text-center">
      <Loader2 className="mt-9 h-6 w-6 animate-spin" />
    </div>;
  }
  if (!isAuthenticated && !isFetchingUser) {
    return <Navigate to="/login" />;
  }

  if (role && authUser?.role !== role) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
