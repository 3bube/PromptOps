import { Copy, Check, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface OutputSectionProps {
  result: string;
  isLoading: boolean;
  limitExceeded?: boolean;
  upgradeUrl?: string;
}

const ShimmerBlock = () => (
  <div className="space-y-3">
    {[80, 100, 60, 90].map((w, i) => (
      <div
        key={i}
        className="h-4 rounded-lg bg-muted animate-shimmer"
        style={{
          width: `${w}%`,
          backgroundImage:
            "linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--border)) 50%, hsl(var(--muted)) 100%)",
          backgroundSize: "200% 100%",
        }}
      />
    ))}
  </div>
);

const OutputSection = ({
  result,
  isLoading,
  limitExceeded,
  upgradeUrl = "/pricing",
}: OutputSectionProps) => {
  const [copied, setCopied] = useState(false);

  if (!result && !isLoading && !limitExceeded) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card-elevated rounded-2xl sm:rounded-3xl p-4 sm:p-8 animate-fade-in mt-6">
      {limitExceeded ? (
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">
              You've used all your free generations this month
            </p>
            <p className="text-sm text-muted-foreground">
              Upgrade to Pro for 500/month or Unlimited for no cap.
            </p>
          </div>
          <Button asChild variant="default" size="lg">
            <a href={upgradeUrl}>See plans</a>
          </Button>
        </div>
      ) : isLoading && !result ? (
        <ShimmerBlock />
      ) : result ? (
        <div className="relative group">
          <div className="bg-surface-sunken rounded-2xl p-5 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap overflow-auto max-h-100">
            {result}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default OutputSection;
