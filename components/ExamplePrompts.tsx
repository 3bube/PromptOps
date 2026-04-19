import { Code, Pen, BarChart3, Lightbulb, Mail } from "lucide-react";
import { EXAMPLE_PROMPTS } from "../constants/index";

interface ExamplePromptsProps {
  onSelect: (label: string, category: string) => void;
}

const ExamplePrompts = ({ onSelect }: ExamplePromptsProps) => {
  return (
    <div className="mt-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <p className="text-sm font-medium text-muted-foreground mb-4 text-center">
        Try an example
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {EXAMPLE_PROMPTS.map((ex) => (
          <button
            key={ex.label}
            onClick={() => onSelect(ex.label, ex.category)}
            className="group flex items-center gap-3 px-5 py-3 rounded-2xl border border-border/60 bg-card hover:bg-secondary hover:border-border transition-all duration-200 hover:shadow-elegant active:scale-[0.98]"
          >
            <ex.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground leading-tight">
                {ex.label}
              </p>
              <p className="text-xs text-muted-foreground">{ex.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePrompts;
