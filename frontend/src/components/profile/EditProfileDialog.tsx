import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import LoadingButton from "../LoadingButton";
import { Label } from "../ui/label";
import { Camera } from "lucide-react";
import Resizer from "react-image-file-resizer";
import type { AuthUser } from "@/types";
import {
  updateUserProfileSchema,
  type UpdateUserProfileValues,
} from "@/lib/validations";
import CropImageDialog from "../CropImageDialog";
import { useRef, useState } from "react";
import { useAuthStore } from "@/store";
interface EditProfileDialogProps {
  user: AuthUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const [croppedAvater, setCroppedAvater] = useState<Blob | null>(null);
  const { updateProfile, isUpdatingUser } = useAuthStore();
  const form = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      name: user.name,
      bio: user.bio || "",
    },
  });

  function onSubmit(values: UpdateUserProfileValues) {
    // submit the form data
    const newAvatarFile = croppedAvater
      ? new File([croppedAvater], `avatar_${user.id}.webp`)
      : undefined;
    updateProfile({ ...values, avatar: newAvatarFile });
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-4 md:p-6">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label>Avatar</Label>
          <AvaterInput
            src={
              croppedAvater
                ? URL.createObjectURL(croppedAvater)
                : user.avatar || "/images/avatar-placeholder.png"
            }
            onImageCroped={setCroppedAvater}
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your display name.." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Tall us a little bit about yourself.."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton type="submit" loading={isUpdatingUser}>
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface AvaterInputProps {
  src: string;
  onImageCroped: (blob: Blob | null) => void;
}

function AvaterInput({ src, onImageCroped }: AvaterInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  function onImageSelected(image: File | undefined) {
    if (!image) return;
    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => {
        setImageToCrop(uri as File);
      },
      "file",
    );
  }
  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        ref={fileInputRef}
        className="sr-only hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block cursor-pointer"
      >
        <img
          src={src}
          alt="Avatar preview"
          width={150}
          height={150}
          className="size-32 flex-none rounded-full object-cover"
        />
        <span className="bg-opacity-30 group-hover:bg-opacity-25 absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black/40 text-white transition-colors duration-200">
          <Camera size={24} />
        </span>
      </button>
      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onCropped={onImageCroped}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
        />
      )}
    </>
  );
}
