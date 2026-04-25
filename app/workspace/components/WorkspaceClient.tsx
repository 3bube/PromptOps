"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LayoutTemplate } from "lucide-react";
import Link from "next/link";
import { WordmarkIcon } from "@/components/ui/header-2";
import { UserMenu } from "@/components/ui/user-menu";
import { HeroSection } from "./HeroSection";
import { RecentPromptsSection } from "./RecentPromptsSection";
import { useAuth } from "@/contexts/AuthContext";
import Grainient from "@/components/Grainient";
import {
  useRecentPrompts,
  useCreatePrompt,
  useDeletePrompt,
} from "@/hooks/data/prompts.hooks";
import posthog from "posthog-js";

export default function WorkspaceDashboard({
  initDescription,
}: {
  initDescription: string;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [description, setDescription] = useState(initDescription ?? "");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const { data: recentPrompts = [], isLoading: loadingPrompts } =
    useRecentPrompts(user?.id ?? null);
  const createPromptMutation = useCreatePrompt();
  const deletePromptMutation = useDeletePrompt(user?.id ?? null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!openMenuId) return;
    const close = () => setOpenMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openMenuId]);

  const handleDelete = useCallback(
    async (promptId: string) => {
      setOpenMenuId(null);
      await deletePromptMutation.mutateAsync(promptId);
      posthog.capture("prompt_deleted", { prompt_id: promptId });
    },
    [deletePromptMutation],
  );

  const handleCreate = useCallback(async () => {
    const trimmed = description.trim();
    if (!trimmed || createPromptMutation.isPending || !user) return;

    try {
      const result = await createPromptMutation.mutateAsync({
        userId: user.id,
        description: trimmed,
      });
      posthog.capture("prompt_created", {
        prompt_id: result.promptId,
        description_length: trimmed.length,
      });
      setDescription("");
      router.push(
        `/workspace/${result.promptId}?init=${encodeURIComponent(trimmed)}`,
      );
    } catch (err) {
      console.error(err);
    }
  }, [description, createPromptMutation, user, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreate();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#09090b] flex flex-col relative overflow-hidden">
      {/* Animated grain background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <Grainient
          color1="#ede9fe"
          color2="#ccfbf1"
          color3="#ffffff"
          timeSpeed={0.15}
          warpStrength={0.6}
          warpFrequency={3.5}
          warpSpeed={1.2}
          warpAmplitude={80}
          grainAmount={0.04}
          contrast={1.1}
          saturation={0.8}
          zoom={0.85}
          className="w-full h-full"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 sm:px-10 h-14 border-b border-[#e4e4e7]/60 bg-white/60 backdrop-blur-md shrink-0">
          <WordmarkIcon className="text-xl text-[#09090b]" />
          <div className="flex items-center gap-4">
            <Link
              href="/templates"
              className="flex items-center gap-1.5 text-sm text-[#71717a] hover:text-[#09090b] transition-colors font-medium"
            >
              <LayoutTemplate size={15} />
              Templates
            </Link>
            <UserMenu />
          </div>
        </nav>

        {/* Hero */}
        <HeroSection
          description={description}
          creating={createPromptMutation.isPending}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onCreate={handleCreate}
        />

        {/* Recent prompts */}
        <RecentPromptsSection
          recentPrompts={recentPrompts}
          loadingPrompts={loadingPrompts}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
