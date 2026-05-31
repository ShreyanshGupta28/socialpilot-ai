"use client";

import React from "react";
import { Button } from "../ui/Button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function CopyButton({ text, className, variant = "outline", size = "sm" }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={className}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-1.5 text-emerald-400" />
          <span className="text-emerald-400 text-xs">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 mr-1.5 text-muted" />
          <span className="text-xs">Copy</span>
        </>
      )}
    </Button>
  );
}
