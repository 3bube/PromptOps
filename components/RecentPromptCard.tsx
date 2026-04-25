"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PromptThumbnail } from "./PromptThumbnail";
import { timeAgo } from "@/lib/formatters";
import { MoreVertical, Trash2, Clock } from "lucide-react";
import type { RecentPrompt } from "@/types";

interface RecentPromptCardProps {
  prompt: RecentPrompt;
  onDelete: (id: string) => void;
}

export function RecentPromptCard({ prompt, onDelete }: RecentPromptCardProps) {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  return (
    <div
      key={prompt.id}
      onClick={() => router.push(`/workspace/${prompt.id}`)}
      className="group relative cursor-pointer text-left bg-white/80 backdrop-blur-sm border border-[#e4e4e7] rounded-xl overflow-hidden hover:border-[#7c5cfc]/40 hover:shadow-md hover:shadow-[#7c5cfc]/5 transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="h-28 bg-[#fafafa] border-b border-[#e4e4e7] group-hover:border-[#7c5cfc]/20 transition-colors">
        <PromptThumbnail blocks={prompt.blocks} />
      </div>

      {/* Meta */}
      <div className="p-3">
        <p className="text-sm font-medium text-[#09090b] truncate leading-snug pr-5">
          {prompt.name}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          {prompt.category && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#7c5cfc]/8 text-[#7c5cfc]">
              {prompt.category}
            </span>
          )}
          <span className="text-[10px] text-[#a1a1aa] flex items-center gap-1">
            <Clock size={10} />
            {timeAgo(prompt.created_at)}
          </span>
        </div>
      </div>

      {/* Menu trigger */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenuId(openMenuId === prompt.id ? null : prompt.id);
        }}
        className="absolute top-2 right-2 p-1 rounded-md text-[#a1a1aa] hover:text-[#09090b] hover:bg-black/5 opacity-0 group-hover:opacity-100 transition-all"
      >
        <MoreVertical size={13} />
      </button>

      {/* Dropdown */}
      {openMenuId === prompt.id && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-8 right-2 z-20 min-w-30 bg-white border border-[#e4e4e7] rounded-lg shadow-lg overflow-hidden"
        >
          <button
            onClick={() => onDelete(prompt.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
          >
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default RecentPromptCard;
