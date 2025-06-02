import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store";
import { Loader2 } from "lucide-react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const { isFetchingUser, isAuthenticated, authUser: user } = useAuthStore();
  console.log("isAuthenticated", isAuthenticated, user, isFetchingUser);
  if (isFetchingUser && !user) {
    return (
      <div className="mt-24 flex w-full justify-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
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
