import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import { useAuthStore } from "./store";

import RootLayout from "./_root/RootLayout";
import AuthLayout from "./_auth/AuthLayout";
import { RequireAuth } from "./components/RequireAuth";

import {
  Home,
  PlaylistPage,
  ProblemWorkspace,
  Problems,
  ProfilePage,
} from "./_root/pages";
import LoginPage from "./_auth/forms/Signin";
import RegisterPage from "./_auth/forms/Signup";
import AddProblem from "./_admin/pages/AddProblem";
export default function App() {
  const { getCurrentUser } = useAuthStore();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <main className="flex min-h-screen antialiased">
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
        </Route>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Authenticated routes */}
        <Route element={<RequireAuth />}>
          <Route element={<RootLayout />}>
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:id" element={<ProblemWorkspace />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/playlist/:id" element={<PlaylistPage />} />
          </Route>
        </Route>

        {/* Admin-only routes */}
        <Route element={<RequireAuth role="ADMIN" />}>
          <Route element={<RootLayout />}>
            <Route path="/add-problem" element={<AddProblem />} />
          </Route>
        </Route>
      </Routes>
      <Toaster richColors />
    </main>
  );
}
