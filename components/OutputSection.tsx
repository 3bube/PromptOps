import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OutputSectionProps {
  prompt: string;
  result: string;
  isLoading: boolean;
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

const OutputSection = ({ prompt, result, isLoading }: OutputSectionProps) => {
  const [copied, setCopied] = useState<string | null>(null);

  if (!prompt && !result && !isLoading) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="card-elevated rounded-3xl p-8 animate-fade-in mt-6">
      <Tabs defaultValue="prompt" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-surface-sunken rounded-xl p-1 h-auto">
            <TabsTrigger
              value="prompt"
              className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              Prompt
            </TabsTrigger>
            <TabsTrigger
              value="result"
              className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              Result
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="prompt" className="mt-0">
          {isLoading && !prompt ? (
            <ShimmerBlock />
          ) : prompt ? (
            <div className="relative group">
              <pre className="bg-surface-sunken rounded-2xl p-5 text-sm leading-relaxed whitespace-pre-wrap font-mono text-foreground/90 overflow-auto max-h-[400px]">
                {prompt}
              </pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                onClick={() => handleCopy(prompt, "prompt")}
              >
                {copied === "prompt" ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Your generated prompt will appear here.
            </p>
          )}
        </TabsContent>

        <TabsContent value="result" className="mt-0">
          {isLoading && !result ? (
            <ShimmerBlock />
          ) : result ? (
            <div className="relative group">
              <div className="bg-surface-sunken rounded-2xl p-5 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap overflow-auto max-h-[400px]">
                {result}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                onClick={() => handleCopy(result, "result")}
              >
                {copied === "result" ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Run a prompt to see the AI result here.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OutputSection;
