import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

const RootLayout = () => {
  const { isFetchingUser, isAuthenticated, authUser: user } = useAuthStore();
  if (isFetchingUser || !user) {
    return (
      <div className="mt-24 w-full items-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="h-full w-full p-2">
      <Navbar />
      <div className="pt-18 md:pt-22">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
