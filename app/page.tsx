"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PromptCard from "@/components/PromptCard";
import OutputSection from "@/components/OutputSection";
import ExamplePrompts from "@/components/ExamplePrompts";

const PROMPT_TEMPLATES: Record<string, string> = {
  coding: `You are an expert software engineer. Given the user's request, generate a detailed, structured prompt that another AI could use to produce high-quality code. Include:\n- Clear objective\n- Technical requirements\n- Expected output format\n- Edge cases to handle`,
  writing: `You are a professional content strategist. Given the user's request, generate a structured prompt for producing compelling written content. Include:\n- Target audience\n- Tone and style\n- Key points to cover\n- SEO considerations`,
  marketing: `You are a senior marketing strategist. Given the user's request, generate a structured prompt for marketing content. Include:\n- Campaign objective\n- Target demographic\n- Key messaging\n- Call to action`,
  analysis: `You are a data analyst. Given the user's request, generate a structured prompt for data analysis. Include:\n- Analysis objective\n- Data requirements\n- Methodology\n- Expected deliverables`,
  creative: `You are a creative director. Given the user's request, generate a structured prompt for creative ideation. Include:\n- Creative brief\n- Constraints\n- Inspiration references\n- Output format`,
  general: `You are a prompt engineering expert. Given the user's request, generate a well-structured, detailed prompt that will produce the best possible AI output. Include clear instructions, context, and expected format.`,
};

function generatePrompt(input: string, category: string, tone: string): string {
  const template = PROMPT_TEMPLATES[category] || PROMPT_TEMPLATES.general;
  return `${template}\n\nTone: ${tone}\n\nUser Request: "${input}"\n\nGenerate the optimized prompt now.`;
}

function simulateResult(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        `Based on the generated prompt, here's a high-quality AI output:\n\n` +
          `---\n\n` +
          `This is a simulated result. Connect an AI backend (like Lovable Cloud) to get real AI-generated responses.\n\n` +
          `The prompt was well-structured with clear objectives, constraints, and output formatting — which would produce excellent results with a real LLM.\n\n` +
          `Key elements identified:\n` +
          `• Clear task definition\n` +
          `• Specific tone and style guidelines\n` +
          `• Structured output format\n` +
          `• Context-aware instructions`,
      );
    }, 1500);
  });
}

const Index = () => {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("general");
  const [tone, setTone] = useState("professional");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const appRef = useRef<HTMLDivElement>(null);

  const scrollToApp = useCallback(() => {
    appRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleGenerate = useCallback(() => {
    const generated = generatePrompt(input, category, tone);
    setPrompt(generated);
    setResult("");
  }, [input, category, tone]);

  const handleGenerateAndRun = useCallback(async () => {
    setIsLoading(true);
    const generated = generatePrompt(input, category, tone);
    setPrompt(generated);
    setResult("");

    try {
      const res = await simulateResult(generated);
      setResult(res);
    } finally {
      setIsLoading(false);
    }
  }, [input, category, tone]);

  const handleExampleSelect = useCallback(
    (label: string, cat: string) => {
      setInput(label);
      setCategory(cat);
      scrollToApp();
    },
    [scrollToApp],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-background"
    >
      <Navbar />

      <HeroSection onScrollToApp={scrollToApp} />

      <main className="max-w-3xl mx-auto px-6 pb-24" ref={appRef}>
        <PromptCard
          inputValue={input}
          onInputChange={setInput}
          onGenerateAndRun={handleGenerateAndRun}
          isLoading={isLoading}
        />

        <OutputSection prompt={prompt} result={result} isLoading={isLoading} />

        <ExamplePrompts onSelect={handleExampleSelect} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <p className="text-center text-sm text-muted-foreground">
          Built with PromptOps — AI-powered prompt engineering
        </p>
      </footer>
    </motion.div>
  );
};

export default Index;
