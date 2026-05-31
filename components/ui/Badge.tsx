import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "outline";
}

export function Badge({ className, variant = "primary", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === "primary" && "border-transparent bg-violet-600 text-white shadow-sm",
        variant === "secondary" && "border-transparent bg-white/10 text-[#F0F4FF]",
        variant === "success" && "border-transparent bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
        variant === "warning" && "border-transparent bg-amber-500/20 text-amber-400 border border-amber-500/30",
        variant === "error" && "border-transparent bg-red-500/20 text-red-400 border border-red-500/30",
        variant === "outline" && "text-[#F0F4FF] border border-white/20",
        className
      )}
      {...props}
    />
  );
}
