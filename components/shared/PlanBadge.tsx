import React from "react";
import { Badge } from "../ui/Badge";
import { Sparkles } from "lucide-react";

interface PlanBadgeProps {
  plan?: string;
}

export function PlanBadge({ plan }: PlanBadgeProps = {}) {
  return (
    <Badge variant="primary" className="bg-gradient-to-r from-violet-600 to-indigo-500 border-none font-bold uppercase tracking-wider text-[10px] gap-1 px-2.5 py-0.5 shadow-md shadow-violet-500/10">
      <Sparkles className="h-3 w-3 text-white fill-white animate-pulse" />
      Creator
    </Badge>
  );
}
