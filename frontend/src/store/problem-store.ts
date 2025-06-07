import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import type {
  Problem,
  ProblemWithSolvedStatus,
  UserRankForSolvedProblems,
} from "@/lib/validations";

interface ProblemStore {
  problems: ProblemWithSolvedStatus[];
  problem: Problem | null;
  solvedProblemsByUser: Problem[];
  userRank: UserRankForSolvedProblems | null;
  isProblemsLoading: boolean;
  isProblemLoading: boolean;
  getAllProblems: () => Promise<void>;
  getProblemById: (id: string) => Promise<void>;
  getSolvedProblemsByUser: () => Promise<void>;
  removeProblem: (id: string) => void;
  getUserSolvedProblemsRank: (id: string) => Promise<void>;
}

export const useProblemStore = create<ProblemStore>((set) => ({
  problems: [],
  problem: null,
  solvedProblemsByUser: [],
  isProblemsLoading: false,
  isProblemLoading: false,
  userRank: null,

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

      const res = (await axiosInstance.get(`/problem/get-problem/${id}`)).data;
      set({ problem: res.data });
      // toast.success("Problem loaded successfully");
    } catch (error) {
      console.error("Error getting problem by ID:", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemsByUser: async () => {
    try {
      const res = (await axiosInstance.get("/problem/get-solved-problem")).data;
      set({ solvedProblemsByUser: res.data });
    } catch (error) {
      console.error("Error getting solved problems:", error);
      toast.error(getErrorMessage(error));
    }
  },
  removeProblem: (id: string) =>
    set((state) => ({
      problems: state.problems.filter((problem) => problem.id !== id),
    })),
  getUserSolvedProblemsRank: async (id: string) => {
    try {
      const res = (await axiosInstance.get(`/problem/user-rank/${id}`)).data;
      set({ userRank: res.data });
    } catch (error) {
      console.error("Error getting solved problems:", error);
      toast.error(getErrorMessage(error));
    }
  },
}));
