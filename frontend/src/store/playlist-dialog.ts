import { create } from "zustand";

interface PlaylistDialogState {
  open: boolean;
  problemId: string | null;
  openDialog: (id: string) => void;
  closeDialog: () => void;
}

export const usePlaylistDialog = create<PlaylistDialogState>((set) => ({
  open: false,
  problemId: null,
  openDialog: (id) => set({ open: true, problemId: id }),
  closeDialog: () => set({ open: false, problemId: null }),
}));
