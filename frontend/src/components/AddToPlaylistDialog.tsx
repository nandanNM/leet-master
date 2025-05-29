"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePlaylistStore } from "@/store";
import LoadingButton from "./LoadingButton";
import { capitalizeWords } from "@/lib/utils";

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemId: string;
}

const AddToPlaylistModal = ({
  isOpen,
  onClose,
  problemId,
}: AddToPlaylistModalProps) => {
  const { playlists, getAllPlaylists, addProblemToPlaylist, isLoading } =
    usePlaylistStore();
  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  useEffect(() => {
    if (isOpen) {
      getAllPlaylists();
    }
  }, [isOpen, getAllPlaylists]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlaylist) return;
    await addProblemToPlaylist(selectedPlaylist, [problemId]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add to Playlist
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="playlist"
              className="text-muted-foreground block text-sm font-medium"
            >
              Select Playlist
            </label>
            <Select
              value={selectedPlaylist}
              onValueChange={setSelectedPlaylist}
              disabled={isLoading}
            >
              <SelectTrigger id="playlist" className="w-full">
                <SelectValue placeholder="Select a playlist" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {playlists.map((playlist) => (
                  <SelectItem
                    key={playlist.id}
                    value={playlist.id}
                    className="data-[state=checked]"
                  >
                    {capitalizeWords(playlist.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <LoadingButton loading={isLoading} type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Add to Playlist
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddToPlaylistModal;
