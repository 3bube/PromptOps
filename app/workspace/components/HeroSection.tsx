import { useRef } from "react";
import { ArrowUp } from "lucide-react";

interface HeroSectionProps {
  description: string;
  creating: boolean;
  onInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onCreate: () => void;
}

export function HeroSection({
  description,
  creating,
  onInput,
  onKeyDown,
  onCreate,
}: HeroSectionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pt-12 pb-16">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center text-[#09090b] mb-3">
        What do you want to build?
      </h1>
      <p className="text-[#71717a] text-base text-center mb-10 max-w-md">
        Describe your prompt and AI will structure it into production-ready blocks.
      </p>

      <div className="w-full max-w-2xl">
        <div className="bg-white/90 backdrop-blur-md border border-[#e4e4e7] rounded-2xl overflow-hidden shadow-lg shadow-[#7c5cfc]/5 focus-within:border-[#7c5cfc]/50 focus-within:shadow-[#7c5cfc]/10 transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={description}
            onChange={onInput}
            onKeyDown={onKeyDown}
            placeholder="A prompt that helps me write cold emails for SaaS sales…"
            rows={3}
            className="w-full bg-transparent text-[15px] text-[#09090b] placeholder-[#a1a1aa] focus:outline-none resize-none px-5 pt-5 pb-3 leading-relaxed"
            style={{ maxHeight: 200 }}
          />

          <div className="flex items-center justify-between px-4 pb-4 pt-1">
            <span className="text-[11px] text-[#a1a1aa]">
              ↵ to generate · Shift+↵ for newline
            </span>
            <button
              onClick={onCreate}
              disabled={!description.trim() || creating}
              className="flex items-center gap-2 px-4 py-2 bg-[#7c5cfc] hover:bg-[#6a4fe4] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              {creating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <ArrowUp size={14} />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
