import { Button } from "@/components/ui/button";
import { useState } from "react";
import EditProfileDialog from "./EditProfileDialog";
import type { AuthUser } from "@/types";

interface EditProfileButtonProps {
  user: AuthUser;
}

export default function EditProfileButton({ user }: EditProfileButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setShowDialog(true)}>
        Edit profile
      </Button>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}
