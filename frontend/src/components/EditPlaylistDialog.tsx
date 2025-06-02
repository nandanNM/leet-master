import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PenBoxIcon } from "lucide-react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { playlistSchema, type PlaylistValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePlaylistStore } from "@/store";
import LoadingButton from "./LoadingButton";
interface EditPlaylistDialogProps {
  playlistId: string;
  name: string;
  description: string | undefined;
}
export default function EditPlaylistDialog({
  name,
  description,
  playlistId,
}: EditPlaylistDialogProps) {
  const [open, setOpen] = useState(false);
  const { updatePlaylist, isLoading: isUpdating } = usePlaylistStore();
  const form = useForm<PlaylistValues>({
    resolver: zodResolver(playlistSchema),
    defaultValues: {
      name,
      description: description || "",
    },
  });

  async function onSubmit(data: PlaylistValues) {
    try {
      await updatePlaylist(playlistId, data);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.log("Error updating playlist", error);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <PenBoxIcon className="h-5 w-5 text-white" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Your Playlist</DialogTitle>
          <DialogDescription>
            Make changes to your playlist here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto w-full space-y-8 py-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter youer play list name"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter youer play list description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              loading={isUpdating}
              className="w-full"
              type="submit"
            >
              Update
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
