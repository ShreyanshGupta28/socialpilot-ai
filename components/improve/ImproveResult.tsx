"use client";

import React from "react";
import { Card, CardContent } from "../ui/Card";
import { CopyButton } from "../shared/CopyButton";
import { Button } from "../ui/Button";
import { Bookmark, BookmarkCheck, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface Version {
  mode: string;
  label: string;
  content: string;
}

interface ImproveResultProps {
  versions: Version[];
  suggestions: string[];
  messageId?: string;
  isSaved?: boolean;
  onSaveToggle?: () => void;
}

export function ImproveResult({
  versions,
  suggestions,
  messageId,
  isSaved = false,
  onSaveToggle,
}: ImproveResultProps) {
  const [saving, setSaving] = React.useState(false);
  const [localSaved, setLocalSaved] = React.useState(isSaved);

  React.useEffect(() => {
    setLocalSaved(isSaved);
  }, [isSaved]);

  const handleSave = async () => {
    if (!messageId) return;

    setSaving(true);
    try {
      const nextSavedState = !localSaved;
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "isSaved", value: nextSavedState }),
      });

      if (!res.ok) throw new Error("Failed to save changes");

      setLocalSaved(nextSavedState);
      if (onSaveToggle) onSaveToggle();
      toast.success(nextSavedState ? "Message added to Saved Library!" : "Removed from Saved Library");
    } catch (err) {
      toast.error("Failed to bookmark message session");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-[#F0F4FF]">
      {/* Upper header section */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h3 className="font-syne font-bold text-base tracking-wide text-white">
          AI Refined Message Variations
        </h3>
        {messageId && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            isLoading={saving}
            className="h-9 gap-1.5"
          >
            {localSaved ? (
              <>
                <BookmarkCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 text-xs">Saved to Library</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4 text-muted" />
                <span className="text-xs">Save Session</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Grid containing the 4 versions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {versions.map((ver, idx) => (
          <Card key={idx} hoverEffect className="bg-white/[0.03] border-white/5 flex flex-col shadow-md">
            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3.5">
                <span className="text-xs font-bold font-syne uppercase tracking-wider text-violet-400">
                  {ver.label || ver.mode}
                </span>
                <CopyButton text={ver.content} variant="ghost" size="sm" />
              </div>
              <p className="text-sm leading-relaxed text-[#F0F4FF] whitespace-pre-wrap flex-1">
                {ver.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sidebar Suggestions Box */}
      {suggestions && suggestions.length > 0 && (
        <Card className="bg-gradient-to-br from-[#0F172E] to-[#0A0F1E] border-white/5 shadow-md">
          <CardContent className="p-5 space-y-3.5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Lightbulb className="h-5 w-5 text-violet-400" />
              <h4 className="font-syne font-bold text-sm tracking-wide text-white">
                AI Optimization Suggestions
              </h4>
            </div>
            <ul className="space-y-2">
              {suggestions.map((sug, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted">
                  <span className="text-violet-500 font-bold block mt-0.5">•</span>
                  <span className="leading-relaxed">{sug}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
