import { Layers } from "lucide-react";

interface PromptThumbnailProps {
  blocks: { title: string; color: string }[];
}

export function PromptThumbnail({ blocks }: PromptThumbnailProps) {
  if (blocks.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Layers size={18} className="text-[#d4d4d8]" />
      </div>
    );
  }
  return (
    <div className="w-full h-full p-3 flex flex-col gap-2 justify-center">
      {blocks.slice(0, 4).map((b, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-1 h-3.5 rounded-full shrink-0"
            style={{ backgroundColor: b.color }}
          />
          <div
            className="h-1.5 rounded-full"
            style={{
              backgroundColor: b.color,
              opacity: 0.2,
              width: `${Math.max(35, 85 - i * 15)}%`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
