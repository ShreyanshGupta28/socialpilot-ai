"use client";

import React from "react";
import { Card, CardContent } from "../ui/Card";
import { CopyButton } from "../shared/CopyButton";
import { Button } from "../ui/Button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";

interface ReplyOption {
  tone: string;
  label: string;
  content: string;
}

interface ReplyCardProps {
  reply: ReplyOption;
  messageId?: string;
  isSaved?: boolean;
  onSaveToggle?: () => void;
}

export function ReplyCard({ reply, messageId, isSaved = false, onSaveToggle }: ReplyCardProps) {
  const [saving, setSaving] = React.useState(false);
  const [localSaved, setLocalSaved] = React.useState(isSaved);

  React.useEffect(() => {
    setLocalSaved(isSaved);
  }, [isSaved]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!messageId) return;

    setSaving(true);
    try {
      const nextSavedState = !localSaved;
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "isSaved", value: nextSavedState }),
      });

      if (!res.ok) throw new Error("Failed to save message");
      
      setLocalSaved(nextSavedState);
      if (onSaveToggle) onSaveToggle();
      toast.success(nextSavedState ? "Message added to Saved Library!" : "Removed from Saved Library");
    } catch (err) {
      toast.error("Failed to bookmark message");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card hoverEffect className="flex flex-col bg-white/[0.03] border-white/5 shadow-md">
      <CardContent className="flex-1 flex flex-col p-5">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
          <span className="text-xs font-bold font-syne uppercase tracking-wider text-violet-400">
            {reply.label}
          </span>
          <div className="flex items-center gap-2">
            <CopyButton text={reply.content} variant="ghost" size="sm" />
            {messageId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                isLoading={saving}
                className="h-8 px-2"
              >
                {localSaved ? (
                  <BookmarkCheck className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Bookmark className="h-4 w-4 text-muted" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Content body */}
        <p className="text-sm leading-relaxed text-[#F0F4FF] whitespace-pre-wrap flex-1">
          {reply.content}
        </p>
      </CardContent>
    </Card>
  );
}
