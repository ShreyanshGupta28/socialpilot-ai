import React from "react";
import { Card } from "../ui/Card";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center p-8 py-12 text-center max-w-md mx-auto bg-white/[0.02] border border-white/5 shadow-md">
      <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-white/5 border border-white/10 text-muted mb-4">
        {icon || <FolderOpen className="h-6 w-6 text-[#5C6BC0]" />}
      </div>
      <h3 className="text-lg font-bold font-syne text-[#F0F4FF] tracking-wide">
        {title}
      </h3>
      <p className="text-sm text-muted mt-2 max-w-xs leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-6 w-full flex justify-center">{action}</div>}
    </Card>
  );
}
