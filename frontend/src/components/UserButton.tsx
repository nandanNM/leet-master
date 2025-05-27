import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { LogOutIcon, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const user = {
    name: "Nandan Manna",
    username: "nandanmanna",
    avatarUrl: "",
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn("flex-none cursor-pointer rounded-full", className)}
        >
          <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          Logged in as {user.name.split(" ")[0]}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to={`/users/${user.username}`}>
          <DropdownMenuItem>
            <UserIcon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            console.log("Logged out");
          }}
        >
          <LogOutIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
