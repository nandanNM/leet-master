import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { getErrorMessage } from "@/lib/utils";
import type {
  BasicPlaylist,
  PlaylistValues,
  PlaylistWithProblems,
} from "@/lib/validations";
import { toast } from "sonner";

interface PlaylistStore {
  playlists: BasicPlaylist[];
  currentPlaylist: PlaylistWithProblems | null;
  isLoading: boolean;
  error: string | null;

  createPlaylist: (playlistData: PlaylistValues) => Promise<BasicPlaylist>;
  getAllPlaylists: (id: string) => Promise<void>;
  getPlaylistDetails: (playlistId: string) => Promise<void>;
  addProblemToPlaylist: (
    playlistId: string,
    problemIds: string[],
  ) => Promise<void>;
  removeProblemFromPlaylist: (
    playlistId: string,
    problemIds: string[],
  ) => Promise<void>;
  isRemovingPoblem: boolean;
  deletePlaylist: (playlistId: string) => Promise<void>;

  getAllPlaylistsForUser: () => Promise<void>;
  userPlaylists: BasicPlaylist[];
  isLoadingUserPlaylists: boolean;

  updatePlaylist: (
    playlistId: string,
    playlistData: PlaylistValues,
  ) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,
  userPlaylists: [],
  isLoadingUserPlaylists: false,
  isRemovingPoblem: false,

  createPlaylist: async (playlistData) => {
    try {
      set({ isLoading: true });
      const res = (await axiosInstance.post("/playlist/create", playlistData))
        .data;
      set((state) => ({
        playlists: [...state.playlists, res.data],
      }));

      toast.success("Playlist created successfully");
      return res.data.data;
    } catch (error) {
      console.error("Error creating playlist:", error);
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getAllPlaylists: async (id) => {
    try {
      set({ isLoading: true });
      const res = (await axiosInstance.get(`/playlist/${id}`)).data;
      set({ playlists: res.data });
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isLoading: false });
    }
  },

  getAllPlaylistsForUser: async () => {
    try {
      set({ isLoadingUserPlaylists: true });
      const res = (await axiosInstance.get("/playlist")).data;
      set({ userPlaylists: res.data });
    } catch (error) {
      console.error("Error fetching user playlists:", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isLoadingUserPlaylists: false });
    }
  },

  getPlaylistDetails: async (playlistId) => {
    try {
      set({ isLoading: true });
      const res = (await axiosInstance.get(`/playlist/details/${playlistId}`))
        .data;
      set({ currentPlaylist: res.data });
    } catch (error) {
      console.error("Error fetching playlist details:", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isLoading: false });
    }
  },

  addProblemToPlaylist: async (playlistId, problemIds) => {
    try {
      set({ isLoading: true });
      await axiosInstance.post(`/playlist/${playlistId}/add-problem`, {
        problemIds,
      });

      toast.success("Problem added to playlist");

      if (get().currentPlaylist?.id === playlistId) {
        await get().getPlaylistDetails(playlistId);
      }
    } catch (error) {
      console.error("Error adding problem to playlist:", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isLoading: false });
    }
  },
  removeProblemFromPlaylist: async (playlistId, problemIds) => {
    try {
      set({ isRemovingPoblem: true });
      await axiosInstance.post(`/playlist/${playlistId}/remove-problems`, {
        problemIds,
      });
      toast.success("Problem removed from playlist");
      if (get().currentPlaylist?.id === playlistId) {
        await get().getPlaylistDetails(playlistId);
      }
    } catch (error) {
      console.error("Error removing problem from playlist:", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isRemovingPoblem: false });
    }
  },

  deletePlaylist: async (playlistId) => {
    try {
      set({ isLoading: true });
      await axiosInstance.delete(`/playlist/${playlistId}`);
      set((state) => ({
        playlists: state.playlists.filter((p) => p.id !== playlistId),
      }));
      if (get().currentPlaylist?.id === playlistId) {
        set({ currentPlaylist: null });
      }
      toast.success("Playlist deleted successfully");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isLoading: false });
    }
  },
  updatePlaylist: async (playlistId, playlistData) => {
    try {
      set({ isLoading: true });
      const res = (
        await axiosInstance.post(`/playlist/update/${playlistId}`, playlistData)
      ).data;

      set((state) => ({
        userPlaylists: state.userPlaylists.map((p) =>
          p.id === playlistId ? { ...p, ...res.data } : p,
        ),
      }));
      if (get().currentPlaylist?.id === playlistId) {
        set({ currentPlaylist: { ...get().currentPlaylist, ...res.data } });
      }
      toast.success("Playlist updated successfully");
    } catch (error) {
      console.error("Error updating playlist:", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isLoading: false });
    }
  },
}));
