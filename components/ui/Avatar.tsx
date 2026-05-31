import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string | null;
  email?: string | null;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ className, name, email, size = "md", ...props }: AvatarProps) {
  const getInitials = () => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "US";
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-bold select-none text-white bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-md",
        size === "sm" && "h-8 w-8 text-xs border border-violet-500/20",
        size === "md" && "h-10 w-10 text-sm border border-violet-500/30",
        size === "lg" && "h-16 w-16 text-xl border-2 border-violet-500/30",
        className
      )}
      {...props}
    >
      {getInitials()}
    </div>
  );
}
