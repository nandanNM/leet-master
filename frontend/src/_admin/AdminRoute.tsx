import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/store";

export default function AdminRoute() {
  const { authUser, isFetchingUser } = useAuthStore();
  if (isFetchingUser) {
    return (
      <div className="mt-6 flex h-screen justify-center">
        <Loader className="size-6 animate-spin" />
      </div>
    );
  }

  if (!authUser || authUser.role !== "ADMIN") {
    return <Navigate to="/" />;
  }
  return <Outlet />;
}
