import { create } from "zustand";

import { getErrorMessage } from "@/lib/utils";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

// ----------------- Types ------------------

export interface Problem {
  id: string;
  title: string;
  // Add more fields if needed
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  problems: Problem[];
  createdAt: string;
  updatedAt: string;
  // Add more fields as needed
}

interface PlaylistState {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  isLoading: boolean;
  error: string | null;

  createPlaylist: (playlistData: Partial<Playlist>) => Promise<Playlist>;
  getAllPlaylists: () => Promise<void>;
  getPlaylistDetails: (playlistId: string) => Promise<void>;
  addProblemToPlaylist: (
    playlistId: string,
    problemIds: string[],
  ) => Promise<void>;
  removeProblemFromPlaylist: (
    playlistId: string,
    problemIds: string[],
  ) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,

  createPlaylist: async (playlistData) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post<{ playList: Playlist }>(
        "/playlist/create-playlist",
        playlistData,
      );

      set((state) => ({
        playlists: [...state.playlists, response.data.playList],
      }));

      toast.success("Playlist created successfully");
      return response.data.playList;
    } catch (error) {
      console.error("Error creating playlist:", error);
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getAllPlaylists: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get<{ playLists: Playlist[] }>(
        "/playlist",
      );
      set({ playlists: response.data.playLists });
    } catch (error) {
      console.error("Error fetching playlists:", error);
      toast.error("Failed to fetch playlists");
    } finally {
      set({ isLoading: false });
    }
  },

  getPlaylistDetails: async (playlistId) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get<{ playList: Playlist }>(
        `/playlist/${playlistId}`,
      );
      set({ currentPlaylist: response.data.playList });
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
      toast.error("Failed to add problem to playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  removeProblemFromPlaylist: async (playlistId, problemIds) => {
    try {
      set({ isLoading: true });
      await axiosInstance.post(`/playlist/${playlistId}/remove-problems`, {
        problemIds,
      });

      toast.success("Problem removed from playlist");

      if (get().currentPlaylist?.id === playlistId) {
        await get().getPlaylistDetails(playlistId);
      }
    } catch (error) {
      console.error("Error removing problem from playlist:", error);
      toast.error("Failed to remove problem from playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlaylist: async (playlistId) => {
    try {
      set({ isLoading: true });
      await axiosInstance.delete(`/playlist/${playlistId}`);

      set((state) => ({
        playlists: state.playlists.filter((p) => p.id !== playlistId),
      }));

      toast.success("Playlist deleted successfully");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error("Failed to delete playlist");
    } finally {
      set({ isLoading: false });
    }
  },
}));
