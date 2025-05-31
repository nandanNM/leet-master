import { Toaster } from "sonner";
import { Navigate, Route, Routes } from "react-router-dom";
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
import ProfilePage from "./_root/pages/Profile";
import PlaylistPage from "./_root/pages/PlaylistPage";

export default function App() {
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);
  const { authUser } = useAuthStore((state) => state);

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
          <Route
            path="/problems"
            element={authUser ? <Problems /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/problems/:id"
            element={
              authUser ? <ProblemWorkspace /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/profile/:id"
            element={
              authUser ? <ProfilePage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/playlist/:id"
            element={
              authUser ? <PlaylistPage /> : <Navigate to="/login" replace />
            }
          />
          {/* admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/add-problem" element={<AddProblem />} />
          </Route>
        </Route>
      </Routes>
      <Toaster richColors />
    </main>
  );
}
