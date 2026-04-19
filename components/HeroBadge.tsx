import { DIcons } from "dicons";
import { ShineBorder } from "@/components/ShineBorder";

interface HeroBadgeProps {
  onClick: () => void;
}

export function HeroBadge({ onClick }: HeroBadgeProps) {
  return (
    <div
      onClick={onClick}
      className="relative inline-flex items-center whitespace-nowrap rounded-full border bg-popover px-3 py-1 text-xs leading-6 text-black dark:text-white cursor-pointer"
    >
      <ShineBorder
        borderWidth={1}
        shineColor="#5162f5"
        className="rounded-full"
      />
      <DIcons.Shapes className="h-5 p-1" /> Introducing PromptOps.
      <div className="hover:text-foreground ml-1 flex items-center font-semibold">
        <div className="absolute inset-0 flex" aria-hidden="true" />
        Explore{" "}
        <span aria-hidden="true">
          <DIcons.ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}
