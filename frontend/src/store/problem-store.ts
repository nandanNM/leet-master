import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import type { Problem } from "@/lib/validations";

interface ProblemStore {
  problems: Problem[];
  problem: Problem | null;
  solvedProblemsByUser: Problem[];
  isProblemsLoading: boolean;
  isProblemLoading: boolean;
  getAllProblems: () => Promise<void>;
  getProblemById: (id: string) => Promise<void>;
  getSolvedProblemsByUser: () => Promise<void>;
}

export const useProblemStore = create<ProblemStore>((set) => ({
  problems: [],
  problem: null,
  solvedProblemsByUser: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });
      const res = (await axiosInstance.get("/problem/get-all-problems")).data;
      set({ problems: res.data });
    } catch (error) {
      console.error("Error getting all problems:", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id: string) => {
    try {
      set({ isProblemLoading: true });

      const res = (await axiosInstance.get(`/problems/get-problem/${id}`)).data;

      set({ problem: res.data });

      toast.success(res.message);
    } catch (error) {
      console.error("Error getting problem by ID:", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemsByUser: async () => {
    try {
      const res = (await axiosInstance.get("/problems/get-solved-problem"))
        .data;
      set({ solvedProblemsByUser: res.data });
    } catch (error) {
      console.error("Error getting solved problems:", error);
      toast.error(getErrorMessage(error));
    }
  },
}));
