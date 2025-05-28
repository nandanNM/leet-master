import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store";
import { Navigate, Outlet } from "react-router-dom";

const RootLayout = () => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="h-full w-full p-2">
      <Navbar />
      <div className="pt-18 md:pt-22">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
