"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PromptCard from "@/components/PromptCard";
import OutputSection from "@/components/OutputSection";
import ExamplePrompts from "@/components/ExamplePrompts";

const HomeInner = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("general");
  const appRef = useRef<HTMLDivElement>(null);
  const [limitExceeded, setLimitExceeded] = useState(false);

  useEffect(() => {
    const prompt = searchParams.get("prompt");
    const cat = searchParams.get("category");
    if (prompt) setInput(decodeURIComponent(prompt));
    if (cat) setCategory(cat);
  }, [searchParams]);

  const { completion, complete, isLoading } = useCompletion({
    api: "/api/generate-prompt",
    streamProtocol: "text",
    onError: (err) => {
      try {
        const body = JSON.parse(err.message);
        if (body.error === "limit_exceeded") {
          setLimitExceeded(true);
          return;
        }
      } catch {}
      console.error("Completion error:", err);
    },
  });

  const scrollToApp = useCallback(() => {
    appRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleGenerateAndRun = useCallback(async () => {
    if (!user) {
      router.push("/auth");
      return;
    }
    if (!input.trim()) {
      alert("Please enter a prompt request");
      return;
    }
    setLimitExceeded(false);
    await complete(input, { body: { category, userId: user.id } });
  }, [input, category, user, router, complete]);

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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-24" ref={appRef}>
        <PromptCard
          inputValue={input}
          onInputChange={setInput}
          onGenerateAndRun={handleGenerateAndRun}
          isLoading={isLoading}
        />
        <OutputSection
          result={completion}
          isLoading={isLoading}
          limitExceeded={limitExceeded}
          upgradeUrl="/pricing"
        />
        <ExamplePrompts onSelect={handleExampleSelect} />
      </main>
      <footer className="border-t border-border/40 py-8">
        <p className="text-center text-sm text-muted-foreground">
          Built with PromptOps — AI-powered prompt engineering
        </p>
      </footer>
    </motion.div>
  );
};

const Index = () => (
  <Suspense>
    <HomeInner />
  </Suspense>
);

export default Index;
