"use client";

import React from "react";
import { Search, Clock, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { CopyButton } from "./CopyButton";
import { EmptyState } from "./EmptyState";

interface ActivitySearchProps {
  initialMessages: any[];
}

export function ActivitySearch({ initialMessages }: ActivitySearchProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredMessages = React.useMemo(() => {
    if (!searchTerm.trim()) return initialMessages;
    
    const term = searchTerm.toLowerCase();
    return initialMessages.filter((msg) => {
      const matchInput = msg.inputText?.toLowerCase().includes(term);
      const matchChannel = msg.channel?.toLowerCase().includes(term);
      const matchTool = msg.tool?.toLowerCase().includes(term);
      
      let matchOutput = false;
      try {
        const parsed = typeof msg.outputJson === "string" ? JSON.parse(msg.outputJson) : msg.outputJson;
        if (parsed) {
          if (parsed.replies) {
            matchOutput = parsed.replies.some((r: any) => r.content?.toLowerCase().includes(term));
          } else if (parsed.versions) {
            matchOutput = parsed.versions.some((v: any) => v.content?.toLowerCase().includes(term));
          }
        }
      } catch (e) {}

      return matchInput || matchChannel || matchTool || matchOutput;
    });
  }, [initialMessages, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Search and Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 text-muted">
          <Clock className="h-4.5 w-4.5" />
          <h4 className="font-syne font-bold text-sm uppercase tracking-wider">
            Recent Activity Logs
          </h4>
        </div>
        
        {/* Search input bar */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search logs by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 h-9.5 text-xs bg-white/5 border border-white/10 rounded-xl text-[#F0F4FF] placeholder-[#94A3B8] focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {/* Message Cards List */}
      {filteredMessages.length === 0 ? (
        <EmptyState
          title={searchTerm ? "No matching logs found" : "No activity yet"}
          description={
            searchTerm
              ? `We couldn't find any results matching "${searchTerm}". Try a different keyword.`
              : "Run a new reply generation or draft refinement to get started."
          }
        />
      ) : (
        <div className="space-y-3.5">
          {filteredMessages.map((msg: any) => {
            const isReplyGen = msg.tool === "REPLY_GENERATOR";
            let parsedOutput: any = {};
            try {
              parsedOutput = typeof msg.outputJson === "string" ? JSON.parse(msg.outputJson) : msg.outputJson;
            } catch (e) {
              console.error("Failed to parse outputJson", e);
            }
            
            // Get sample preview text
            let previewText = "";
            if (isReplyGen && parsedOutput?.replies?.length > 0) {
              previewText = parsedOutput.replies[0].content;
            } else if (!isReplyGen && parsedOutput?.versions?.length > 0) {
              previewText = parsedOutput.versions[0].content;
            }

            return (
              <Card key={msg.id} className="bg-white/[0.02] border border-white/5 shadow-sm">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 space-y-1.5 min-w-0">
                    {/* Title & Platforms */}
                    <div className="flex items-center flex-wrap gap-2">
                      <Badge variant="secondary" className="text-[10px] bg-white/5 font-bold uppercase tracking-wider">
                        {isReplyGen ? "Reply Generator" : "Improver"}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                        {msg.channel}
                      </Badge>
                      <span className="text-[10px] text-muted">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Draft Preview */}
                    <p className="text-xs text-muted truncate">
                      <span className="font-bold text-[#F0F4FF]">Inbound:</span> &quot;{msg.inputText}&quot;
                    </p>
                    
                    {/* Generated preview text */}
                    {previewText && (
                      <p className="text-sm text-[#F0F4FF] truncate italic pl-3 border-l border-violet-500/30">
                        &quot;{previewText}&quot;
                      </p>
                    )}
                  </div>
                  
                  {/* Copy actions */}
                  {previewText && (
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <CopyButton text={previewText} variant="outline" size="sm" />
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
