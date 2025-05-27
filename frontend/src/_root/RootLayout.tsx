import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="h-full w-full p-2">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default RootLayout;
