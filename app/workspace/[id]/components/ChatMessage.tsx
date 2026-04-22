import React from "react";
import { Sparkles } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${role === "user" ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-7 h-7 rounded shrink-0 flex items-center justify-center ${
          role === "assistant"
            ? "bg-[#7c5cfc]/10 border border-[#7c5cfc]/30 text-[#7c5cfc]"
            : "bg-[#e4e4e7] text-[#71717a]"
        }`}
      >
        {role === "assistant" ? <Sparkles size={14} /> : "U"}
      </div>
      <div
        className={`text-[13px] leading-relaxed p-3 rounded-lg ${
          role === "assistant"
            ? "bg-transparent text-[#09090b]"
            : "bg-[#e4e4e7] text-[#09090b]"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
