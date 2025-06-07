import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import {
  CheckIcon,
  LogOutIcon,
  Monitor,
  Moon,
  Sun,
  UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "./theme-provider";
import { useAuthStore } from "@/store";

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { theme, setTheme } = useTheme();
  const { authUser: user } = useAuthStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn("flex-none cursor-pointer rounded-full", className)}
        >
          <UserAvatar avatarUrl={user?.avatar} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {user && (
          <DropdownMenuLabel>
            Logged in as {user.name.split(" ")[0]}
          </DropdownMenuLabel>
        )}
        {user ? (
          <>
            <DropdownMenuSeparator />
            <Link to={`/profile/${user?.id}`}>
              <DropdownMenuItem>
                <UserIcon className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>
            </Link>
          </>
        ) : (
          <Link to={`/login`}>
            <DropdownMenuItem>
              <UserIcon className="mr-2 size-4" />
              Login
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 size-4" />
              Light
              {theme === "light" && (
                <CheckIcon className="text-primary ml-2 size-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 size-4" />
              Dark
              {theme === "dark" && (
                <CheckIcon className="text-primary ml-2 size-4" />
              )}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {user && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOutIcon className="mr-2 size-4" />
              Logout
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
