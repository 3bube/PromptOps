"use client";

import { Suspense } from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUp, Clock, Layers, Plus, LayoutTemplate } from "lucide-react";
import Link from "next/link";
import { WordmarkIcon } from "@/components/ui/header-2";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Grainient from "@/components/Grainient";

interface RecentPrompt {
  id: string;
  name: string;
  category: string | null;
  created_at: string;
  blocks: { title: string; color: string }[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function PromptThumbnail({
  blocks,
}: {
  blocks: { title: string; color: string }[];
}) {
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

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <WorkspaceDashboard />
    </Suspense>
  );
}

function WorkspaceDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [description, setDescription] = useState(
    () => searchParams.get("prompt") ?? "",
  );
  const [creating, setCreating] = useState(false);
  const [recentPrompts, setRecentPrompts] = useState<RecentPrompt[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [authLoading, user, router]);

  // Fetch recent prompts
  useEffect(() => {
    if (!user) return;

    async function load() {
      setLoadingPrompts(true);

      const { data: prompts } = await (supabase as any)
        .from("workspace_prompts")
        .select("id, name, category, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(8);

      if (!prompts || prompts.length === 0) {
        setRecentPrompts([]);
        setLoadingPrompts(false);
        return;
      }

      const { data: blocks } = await (supabase as any)
        .from("prompt_blocks")
        .select("prompt_id, title, color, position")
        .in(
          "prompt_id",
          prompts.map((p: any) => p.id),
        )
        .order("position");

      const blocksByPrompt: Record<string, { title: string; color: string }[]> =
        {};
      for (const b of blocks ?? []) {
        if (!blocksByPrompt[b.prompt_id]) blocksByPrompt[b.prompt_id] = [];
        blocksByPrompt[b.prompt_id].push({ title: b.title, color: b.color });
      }

      setRecentPrompts(
        prompts.map((p: any) => ({
          ...p,
          blocks: blocksByPrompt[p.id] ?? [],
        })),
      );
      setLoadingPrompts(false);
    }

    load();
  }, [user]);

  const handleCreate = useCallback(async () => {
    const trimmed = description.trim();
    if (!trimmed || creating || !user) return;

    setCreating(true);

    try {
      // Get or create the user's default workspace
      let workspaceId: string;
      const { data: existing } = await (supabase as any)
        .from("workspaces")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (existing?.id) {
        workspaceId = existing.id;
      } else {
        const { data: created, error } = await (supabase as any)
          .from("workspaces")
          .insert({ user_id: user.id, name: "My Workspace" })
          .select("id")
          .single();
        if (error || !created) throw new Error("Could not create workspace");
        workspaceId = created.id;
      }

      const name = trimmed.length > 60 ? trimmed.slice(0, 57) + "…" : trimmed;

      const { data: prompt, error: promptError } = await (supabase as any)
        .from("workspace_prompts")
        .insert({ workspace_id: workspaceId, user_id: user.id, name })
        .select("id")
        .single();

      if (promptError || !prompt) throw new Error("Could not create prompt");

      router.push(
        `/workspace/${prompt.id}?init=${encodeURIComponent(trimmed)}`,
      );
    } catch (err) {
      console.error(err);
      setCreating(false);
    }
  }, [description, creating, user, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreate();
    }
  };

  // Keep textarea height in sync with content, including programmatic changes
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [description]);

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
          <Link
            href="/templates"
            className="flex items-center gap-1.5 text-sm text-[#71717a] hover:text-[#09090b] transition-colors font-medium"
          >
            <LayoutTemplate size={15} />
            Templates
          </Link>
        </nav>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-12 pb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center text-[#09090b] mb-3">
            What do you want to build?
          </h1>
          <p className="text-[#71717a] text-base text-center mb-10 max-w-md">
            Describe your prompt and AI will structure it into production-ready
            blocks.
          </p>

          {/* Input card */}
          <div className="w-full max-w-2xl">
            <div className="bg-white/90 backdrop-blur-md border border-[#e4e4e7] rounded-2xl overflow-hidden shadow-lg shadow-[#7c5cfc]/5 focus-within:border-[#7c5cfc]/50 focus-within:shadow-[#7c5cfc]/10 transition-all duration-200">
              <textarea
                ref={textareaRef}
                value={description}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
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
                  onClick={handleCreate}
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

        {/* Recent prompts */}
        <div className="px-6 sm:px-10 pb-16 max-w-6xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold text-[#a1a1aa] uppercase tracking-wider">
              Recent Prompts
            </h2>
            <button
              onClick={() => textareaRef.current?.focus()}
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
                <button
                  key={prompt.id}
                  onClick={() => router.push(`/workspace/${prompt.id}`)}
                  className="group text-left bg-white/80 backdrop-blur-sm border border-[#e4e4e7] rounded-xl overflow-hidden hover:border-[#7c5cfc]/40 hover:shadow-md hover:shadow-[#7c5cfc]/5 transition-all duration-200"
                >
                  {/* Thumbnail */}
                  <div className="h-28 bg-[#fafafa] border-b border-[#e4e4e7] group-hover:border-[#7c5cfc]/20 transition-colors">
                    <PromptThumbnail blocks={prompt.blocks} />
                  </div>

                  {/* Meta */}
                  <div className="p-3">
                    <p className="text-sm font-medium text-[#09090b] truncate leading-snug">
                      {prompt.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {prompt.category && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#7c5cfc]/8 text-[#7c5cfc]">
                          {prompt.category}
                        </span>
                      )}
                      <span className="text-[10px] text-[#a1a1aa] flex items-center gap-1">
                        <Clock size={10} />
                        {timeAgo(prompt.created_at)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
