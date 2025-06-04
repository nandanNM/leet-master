import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import type { DiscussionWithUser } from "@/lib/validations";

interface DiscussionStore {
  discussions: DiscussionWithUser[];
  isLoading: boolean;
  isSending: boolean;

  getAllDiscussions: (problemId: string) => Promise<void>;
  createDiscussion: (input: string, problemId: string) => Promise<void>;
}

export const useDiscussionStore = create<DiscussionStore>((set) => ({
  discussions: [],
  isLoading: false,
  isSending: false,

  getAllDiscussions: async (problemId) => {
    try {
      set({ isLoading: true });
      const res = (await axiosInstance.get(`/discussion/${problemId}`)).data;
      set({ discussions: res.data });
    } catch (error) {
      console.error("Failed to fetch discussions:", error);
      const msg = getErrorMessage(error);
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  createDiscussion: async (input, problemId) => {
    try {
      console.log(
        `Creating discussion with message: ${input} for problem: ${problemId}`,
      );
      set({ isSending: true });
      const res = (
        await axiosInstance.post(`/discussion/create/${problemId}`, {
          message: input,
        })
      ).data;
      console.log(res);
      const newDiscussion = res.data;
      console.log("newDiscussion", newDiscussion);
      set((state) => ({
        discussions: [newDiscussion, ...state.discussions],
      }));
      toast.success("Discussion created");
      return newDiscussion;
    } catch (error) {
      console.error("Failed to create discussion:", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isSending: false });
    }
  },
}));
