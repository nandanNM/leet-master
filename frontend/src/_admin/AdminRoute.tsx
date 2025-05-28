import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store";

export default function AdminRoute() {
  const { isFetchingUser, isAuthenticated, authUser: user } = useAuthStore();
  if (isFetchingUser || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
