import React from "react";
import { Loader2 as Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils"; // adjust this path as needed
import { Button } from "@/components/ui/button"; // adjust this path too

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  disabled,
  className,
  children,
  ...props
}) => {
  return (
    <Button
      disabled={loading || disabled}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {loading && <Loader2Icon className="h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};

export default LoadingButton;
