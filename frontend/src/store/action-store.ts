import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useProblemStore } from "./problem-store";
import { getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";

interface ActionsState {
  isDeletingProblem: boolean;
  onDeleteProblem: (id: string) => Promise<void>;
}

export const useActions = create<ActionsState>((set) => ({
  isDeletingProblem: false,

  onDeleteProblem: async (id: string) => {
    try {
      set({ isDeletingProblem: true });
      await axiosInstance.delete(`/problem/delete-problem/${id}`);
      useProblemStore.getState().removeProblem(id);
      toast.success("Problem deleted successfully");
    } catch (error) {
      console.log("Error deleting problem", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isDeletingProblem: false });
    }
  },
}));
