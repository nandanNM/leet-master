import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="w-full">
      {/* <Navbar /> */}
      <Outlet />
    </div>
  );
};

export default RootLayout;
