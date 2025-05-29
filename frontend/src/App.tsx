import { Toaster } from "sonner";
import { Route, Routes } from "react-router-dom";
import RootLayout from "./_root/RootLayout";
import AuthLayout from "./_auth/AuthLayout";
import { Home } from "./_root/pages";
import RegisterPage from "./_auth/forms/Signup";
import LoginPage from "./_auth/forms/Signin";
import { useAuthStore } from "./store";
import { useEffect } from "react";
import AdminRoute from "./_admin/AdminRoute";
import AddProblem from "./_admin/pages/AddProblem";
import Problems from "./_root/pages/Problems";
import ProblemWorkspace from "./_root/pages/ProblemWorkspace";

export default function App() {
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <main className="flex min-h-screen antialiased">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
        </Route>
        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:id" element={<ProblemWorkspace />} />
          {/* admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/add-problem" element={<AddProblem />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
}
