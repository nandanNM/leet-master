import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
type AuthUser = {
  id: string;
  name: string;
  email: string;
  avater?: string;
  role: "ADMIN" | "USER";
};
type LoginData = {
  email: string;
  password: string;
};

type SignupData = {
  name: string;
  email: string;
  password: string;
};

interface AuthState {
  authUser: AuthUser | null;
  isSigninUp: boolean;
  isLoggingIn: boolean;
  isFetchingUser: boolean;

  getCurrentUser: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}
export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isFetchingUser: false,

  getCurrentUser: async () => {
    set({ isFetchingUser: true });
    try {
      const res = await axiosInstance.get("/auth/current-user");
      console.log("checkauth response", res.data);
      set({ authUser: res.data.user });
    } catch (error) {
      console.log("❌ Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isFetchingUser: false });
    }
  },

  signup: async (data) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error signing up", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error logging in", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error(getErrorMessage(error));
    }
  },
}));
