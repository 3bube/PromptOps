import { Plus, Layers, Clock } from "lucide-react";
import RecentPromptCard from "@/components/RecentPromptCard";
import type { RecentPrompt } from "@/types";

interface RecentPromptsSectionProps {
  recentPrompts: RecentPrompt[];
  loadingPrompts: boolean;
  onDelete: (id: string) => void;
}

export function RecentPromptsSection({
  recentPrompts,
  loadingPrompts,
  onDelete,
}: RecentPromptsSectionProps) {
  return (
    <div className="px-6 sm:px-10 pb-16 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">
          Recent Prompts
        </h2>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-1.5 text-xs text-[#7c5cfc] hover:text-[#6a4fe4] transition-colors font-medium"
        >
          <Plus size={13} />
          New prompt
        </button>
      </div>

      {loadingPrompts ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-xl bg-white/60 border border-[#e4e4e7] animate-pulse"
            />
          ))}
        </div>
      ) : recentPrompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/80 border border-[#e4e4e7] flex items-center justify-center mb-4 shadow-sm">
            <Layers size={18} className="text-[#d4d4d8]" />
          </div>
          <p className="text-sm text-[#a1a1aa]">
            No prompts yet — generate your first one above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {recentPrompts.map((prompt) => (
            <RecentPromptCard key={prompt.id} prompt={prompt} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
