import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
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
