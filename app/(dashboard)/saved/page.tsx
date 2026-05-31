"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/shared/CopyButton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Bookmark, Search, Trash2, ChevronDown, ChevronUp, Sparkles, PenTool } from "lucide-react";

export default function SavedRepliesPage() {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [toolFilter, setToolFilter] = React.useState<"ALL" | "REPLY_GENERATOR" | "MESSAGE_IMPROVER">("ALL");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const fetchSavedMessages = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages?saved=true");
      if (!res.ok) throw new Error("Failed to fetch library entries");
      const data = await res.json();
      setMessages(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load saved messages");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSavedMessages();
  }, [fetchSavedMessages]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to remove this session from your Saved Library?")) return;

    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "isSaved", value: false }),
      });

      if (!res.ok) throw new Error("Failed to remove item");

      setMessages(messages.filter((msg) => msg.id !== id));
      toast.success("Removed from Saved Library");
      if (expandedId === id) setExpandedId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete item");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Snappy in-memory local filtering
  const filteredMessages = messages.filter((msg) => {
    const matchesTool = toolFilter === "ALL" || msg.tool === toolFilter;
    
    const inputLower = msg.inputText.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    // Check if search matches input or nested replies content
    let matchesContent = inputLower.includes(searchLower);
    
    let parsedOutput: any = {};
    try {
      parsedOutput = typeof msg.outputJson === "string" ? JSON.parse(msg.outputJson) : msg.outputJson;
    } catch (e) {
      console.error("Failed to parse outputJson", e);
    }
    if (msg.tool === "REPLY_GENERATOR" && parsedOutput?.replies) {
      matchesContent = matchesContent || parsedOutput.replies.some((rep: any) => 
        rep.content.toLowerCase().includes(searchLower)
      );
    } else if (msg.tool === "MESSAGE_IMPROVER" && parsedOutput?.versions) {
      matchesContent = matchesContent || parsedOutput.versions.some((ver: any) => 
        ver.content.toLowerCase().includes(searchLower)
      );
    }

    return matchesTool && matchesContent;
  });

  return (
    <div className="space-y-8 text-[#F0F4FF]">
      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-syne text-white tracking-wide flex items-center gap-2.5">
          Saved Library
          <Bookmark className="h-6.5 w-6.5 text-[#5C6BC0] fill-[#5C6BC0]/20" />
        </h2>
        <p className="text-sm text-muted mt-1">
          Review, expand, and copy previously generated replies and draft refinements.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="sm:col-span-8 relative">
          <Input
            placeholder="Search keywords in prompt inputs or generated reply contents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 focus:border-violet-500/50"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted pointer-events-none" />
        </div>

        {/* Tool Filter */}
        <div className="sm:col-span-4">
          <Select
            value={toolFilter}
            onChange={(e) => setToolFilter(e.target.value as any)}
          >
            <option value="ALL" className="bg-[#0E1528] text-white">All Tools</option>
            <option value="REPLY_GENERATOR" className="bg-[#0E1528] text-white">AI Reply Generator</option>
            <option value="MESSAGE_IMPROVER" className="bg-[#0E1528] text-white">AI Message Improver</option>
          </Select>
        </div>
      </div>

      {/* Main content library */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="h-10 w-10 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin mb-4" />
          <span className="text-sm text-muted">Loading your template library...</span>
        </div>
      ) : filteredMessages.length === 0 ? (
        <EmptyState
          title={searchTerm || toolFilter !== "ALL" ? "No matches found" : "Your library is empty"}
          description={
            searchTerm || toolFilter !== "ALL"
              ? "Try adjusting your search keywords or filter settings."
              : "Bookmark generated replies or draft variations to build your custom customer service playbook."
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => {
            const isReplyGen = msg.tool === "REPLY_GENERATOR";
            const isExpanded = expandedId === msg.id;
            let parsedOutput: any = {};
            try {
              parsedOutput = typeof msg.outputJson === "string" ? JSON.parse(msg.outputJson) : msg.outputJson;
            } catch (e) {
              console.error("Failed to parse outputJson", e);
            }

            return (
              <Card
                key={msg.id}
                className={`bg-white/[0.02] border transition-all duration-300 ${
                  isExpanded ? "border-violet-500/30 bg-white/[0.03]" : "border-white/5"
                }`}
              >
                <CardContent className="p-5 space-y-4">
                  {/* Title Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                    <div className="flex items-center flex-wrap gap-2.5">
                      <div className={`p-1.5 rounded-lg ${isReplyGen ? "bg-violet-600/10 text-violet-400" : "bg-indigo-600/10 text-[#5C6BC0]"}`}>
                        {isReplyGen ? <Sparkles className="h-4 w-4" /> : <PenTool className="h-4 w-4" />}
                      </div>
                      <Badge variant="secondary" className="text-[10px] bg-white/5 font-bold uppercase tracking-wider">
                        {isReplyGen ? "Reply Generator" : "Improver"}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                        {msg.channel}
                      </Badge>
                      <span className="text-xs text-muted">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleExpand(msg.id)}
                        className="h-9 px-3 gap-1"
                      >
                        <span>{isExpanded ? "Collapse" : "Expand Results"}</span>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDelete(msg.id, e)}
                        className="h-9 px-2 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Prompt Preview */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted uppercase tracking-widest font-bold block">
                      Inbound Prompt Input:
                    </span>
                    <p className="text-sm text-[#F0F4FF] line-clamp-2 leading-relaxed">
                      &quot;{msg.inputText}&quot;
                    </p>
                  </div>

                  {/* Expanded Variations Grid */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-white/5 space-y-4 animate-fade-in">
                      <span className="text-[10px] text-violet-400 uppercase tracking-widest font-bold block">
                        Saved AI Generations:
                      </span>
                      
                      {isReplyGen && parsedOutput?.replies && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {parsedOutput.replies.map((rep: any, idx: number) => (
                            <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2 flex flex-col justify-between">
                              <div>
                                <span className="text-xs font-bold text-violet-400 block pb-1 border-b border-white/5">
                                  {rep.label}
                                </span>
                                <p className="text-xs text-[#F0F4FF] leading-relaxed pt-2 whitespace-pre-wrap">
                                  {rep.content}
                                </p>
                              </div>
                              <div className="flex justify-end pt-3">
                                <CopyButton text={rep.content} variant="ghost" size="sm" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {!isReplyGen && parsedOutput?.versions && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {parsedOutput.versions.map((ver: any, idx: number) => (
                            <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2 flex flex-col justify-between">
                              <div>
                                <span className="text-xs font-bold text-violet-400 block pb-1 border-b border-white/5">
                                  {ver.label}
                                </span>
                                <p className="text-xs text-[#F0F4FF] leading-relaxed pt-2 whitespace-pre-wrap">
                                  {ver.content}
                                </p>
                              </div>
                              <div className="flex justify-end pt-3">
                                <CopyButton text={ver.content} variant="ghost" size="sm" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
