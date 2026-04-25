"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, ArrowUp, Loader2, X } from "lucide-react";
import type { Block, ChatMessage } from "../types";
import Image from "next/image";
import { useMessages, useAddMessage } from "@/hooks/data/prompts.hooks";
import posthog from "posthog-js";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";

interface AssistantPanelProps {
  promptId: string;
  messageReloadKey?: number;
  blocks: Block[];
  onBlocksChange: (updater: (prev: Block[]) => Block[]) => void;
}

function parseBlockUpdates(text: string): Record<string, string> {
  const updates: Record<string, string> = {};
  for (const m of text.matchAll(
    /\[BLOCK:([^\]]+)\]\n?([\s\S]*?)\[\/BLOCK\]/g,
  )) {
    updates[m[1].trim()] = m[2].trim();
  }
  return updates;
}

function stripBlockMarkers(text: string): string {
  return text.replace(/\[BLOCK:[^\]]+\]\n?[\s\S]*?\[\/BLOCK\]\n?/g, "").trim();
}

// Render text with @BlockTitle spans coloured by the block's accent colour
function highlightMentions(text: string, blocks: Block[]) {
  if (!text || !blocks.length) return text;

  const colorMap: Record<string, string> = {};
  for (const b of blocks) colorMap[b.title] = b.color;

  const escaped = Object.keys(colorMap)
    .sort((a, b) => b.length - a.length)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const pattern = new RegExp(`(@(?:${escaped.join("|")}))`, "g");
  const parts = text.split(pattern);

  return parts.map((part, i) => {
    if (part.startsWith("@")) {
      const color = colorMap[part.slice(1)];
      if (color)
        return (
          <span key={i} style={{ color }} className="font-medium">
            {part}
          </span>
        );
    }
    return <span key={i}>{part}</span>;
  });
}

// Extract @BlockTitle mentions from a message string
function extractMentions(text: string, blocks: Block[]): Block[] {
  const titles = new Set(blocks.map((b) => b.title));
  const mentioned: Block[] = [];
  for (const m of text.matchAll(/@([^\s@]+(?:\s[^\s@]+)*)/g)) {
    const title = m[1].trim();
    if (titles.has(title)) {
      const block = blocks.find((b) => b.title === title);
      if (block && !mentioned.find((b) => b.id === block.id)) {
        mentioned.push(block);
      }
    }
  }
  return mentioned;
}

export function AssistantPanel({
  promptId,
  messageReloadKey,
  blocks,
  onBlocksChange,
}: AssistantPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionAnchor, setMentionAnchor] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Load messages from query hook
  const { data: loadedMessages } = useMessages(promptId);
  const addMessageMutation = useAddMessage(promptId);

  // Update local messages when loaded data changes
  useEffect(() => {
    if (loadedMessages) {
      setMessages(loadedMessages as ChatMessage[]);
    }
  }, [loadedMessages, messageReloadKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setMentionQuery(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredBlocks =
    mentionQuery !== null
      ? blocks.filter((b) =>
          b.title.toLowerCase().includes(mentionQuery.toLowerCase()),
        )
      : [];

  const insertMention = useCallback(
    (block: Block) => {
      const ta = textareaRef.current;
      if (!ta) return;

      const before = input.slice(0, mentionAnchor);
      const after = input.slice(ta.selectionStart);
      const newInput = `${before}@${block.title} ${after}`;
      setInput(newInput);
      setMentionQuery(null);

      // Restore focus and move cursor after the inserted mention
      requestAnimationFrame(() => {
        ta.focus();
        const pos = mentionAnchor + block.title.length + 2; // @title + space
        ta.setSelectionRange(pos, pos);
        ta.style.height = "auto";
        ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
      });
    },
    [input, mentionAnchor],
  );

  // Fire-and-forget helper — doesn't block the UI
  const persistMessage = useCallback(
    async (role: "user" | "assistant", content: string) => {
      try {
        await addMessageMutation.mutateAsync({ role, content });
      } catch (err) {
        console.error("Failed to persist message:", err);
      }
    },
    [addMessageMutation],
  );

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const taggedBlocks = extractMentions(trimmed, blocks);
    posthog.capture("assistant_message_sent", {
      prompt_id: promptId,
      message_length: trimmed.length,
      tagged_block_count: taggedBlocks.length,
    });

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setMentionQuery(null);
    persistMessage("user", trimmed);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/workspace-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          blocks: blocks.map((b) => ({ title: b.title, content: b.content })),
          taggedBlocks: taggedBlocks.map((b) => ({
            title: b.title,
            content: b.content,
          })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: fullText,
          };
          return updated;
        });
      }

      const blockUpdates = parseBlockUpdates(fullText);
      const finalText =
        Object.keys(blockUpdates).length > 0
          ? stripBlockMarkers(fullText)
          : fullText;

      if (Object.keys(blockUpdates).length > 0) {
        onBlocksChange((prev) => {
          const next = [...prev];

          for (const [title, content] of Object.entries(blockUpdates)) {
            const index = next.findIndex((b) => b.title === title);
            if (index >= 0) {
              next[index] = { ...next[index], content };
            } else {
              // Creating a new block with a random color
              const colors = [
                "#18181b",
                "#ef4444",
                "#f97316",
                "#eab308",
                "#22c55e",
                "#06b6d4",
                "#3b82f6",
                "#6366f1",
                "#8b5cf6",
                "#a855f7",
                "#ec4899",
                "#f43f5e",
              ];
              const randomColor =
                colors[Math.floor(Math.random() * colors.length)];

              next.push({
                id: crypto.randomUUID(),
                title,
                content,
                color: randomColor,
              });
            }
          }
          return next;
        });

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: finalText,
          };
          return updated;
        });
      }

      persistMessage("assistant", finalText);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Let picker intercept Enter/Escape when open
    if (mentionQuery !== null) {
      if (e.key === "Escape") {
        e.preventDefault();
        setMentionQuery(null);
        return;
      }
      if (e.key === "Enter" && filteredBlocks.length > 0) {
        e.preventDefault();
        insertMention(filteredBlocks[0]);
        return;
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);

    const cursor = e.target.selectionStart ?? value.length;
    const textBefore = value.slice(0, cursor);
    const atMatch = textBefore.match(/@([\w\s]*)$/);

    if (atMatch) {
      setMentionAnchor(cursor - atMatch[0].length);
      setMentionQuery(atMatch[1]);
    } else {
      setMentionQuery(null);
    }

    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  // Keep mirror div scrolled in sync with textarea
  const syncMirrorScroll = useCallback(() => {
    if (mirrorRef.current && textareaRef.current) {
      mirrorRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  // Render input text with @mentions highlighted
  const taggedInInput = extractMentions(input, blocks);

  return (
    <div className="w-87.5 border-r border-[#e4e4e7] bg-[#fafafa] flex-col shrink-0 hidden lg:flex h-full min-h-0" data-nextstep="assistant-panel">
      {/* Header */}
      <div className="p-4 border-b border-[#e4e4e7] flex items-center gap-2">
        <span className="text-sm font-semibold">Prompt Assistant</span>
      </div>

      {/* Messages */}
      <Conversation className="bg-[#fafafa]">
        <ConversationContent className="p-4">
          {messages.length === 0 && (
            <ConversationEmptyState
              title="Prompt Assistant"
              description="Ask me to refine blocks, add constraints, or optimize your prompt. Type @ to tag a block."
              icon={
                <Image
                  src="/logo-dark.svg"
                  alt="Promptops"
                  width={30}
                  height={30}
                />
              }
            />
          )}

          {messages.map((msg, i) => (
            <Message
              key={i}
              from={msg.role === "user" ? "user" : "assistant"}
              className={`flex flex-row gap-2.5 max-w-[95%] ${msg.role === "user" ? "flex-row-reverse ml-auto" : ""}`}
            >
              <div
                className={`w-6 h-6 rounded shrink-0 flex items-center justify-center ${
                  msg.role === "user" && "bg-[#e4e4e7] text-[#71717a]"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Image
                    src="/logo-dark.svg"
                    alt="Promptops"
                    width={15}
                    height={15}
                  />
                ) : (
                  "U"
                )}
              </div>
              <MessageContent
                className={
                  msg.role === "assistant"
                    ? "bg-transparent text-[#09090b]"
                    : "bg-[#e4e4e7] text-[#09090b] px-3 py-2 rounded-xl max-w-[82%]"
                }
              >
                {msg.content ? (
                  <span>{highlightMentions(msg.content, blocks)}</span>
                ) : (
                  <span className="flex gap-1 pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] animate-bounce [animation-delay:300ms]" />
                  </span>
                )}
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Input */}
      <div className="p-3 border-t border-[#e4e4e7] bg-[#ffffff]">
        {/* Tagged block chips */}
        {taggedInInput.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {taggedInInput.map((b) => (
              <span
                key={b.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium"
                style={{ backgroundColor: b.color + "18", color: b.color }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: b.color }}
                />
                {b.title}
                <button
                  onClick={() => {
                    setInput((prev) =>
                      prev.replace(new RegExp(`@${b.title}\\s?`, "g"), ""),
                    );
                  }}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  <X size={9} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Mention picker */}
        <div className="relative">
          {mentionQuery !== null && filteredBlocks.length > 0 && (
            <div
              ref={pickerRef}
              className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-[#e4e4e7] rounded-xl shadow-lg overflow-hidden z-20"
            >
              <div className="px-3 py-1.5 border-b border-[#f4f4f5]">
                <span className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider">
                  Tag a block
                </span>
              </div>
              {filteredBlocks.map((b) => (
                <button
                  key={b.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertMention(b);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#fafafa] transition-colors text-left"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: b.color }}
                  />
                  <span className="text-sm text-[#09090b] font-medium truncate">
                    {b.title}
                  </span>
                  {b.content ? (
                    <span className="text-[11px] text-[#a1a1aa] truncate flex-1 text-right">
                      {b.content.slice(0, 40)}…
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#d4d4d8] flex-1 text-right italic">
                      empty
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2 bg-[#fafafa] border border-[#e4e4e7] rounded-xl p-2 focus-within:border-[#7c5cfc] transition-colors">
            <div className="relative flex-1 min-w-0">
              {/* Mirror div — renders coloured @mention text behind the textarea */}
              <div
                ref={mirrorRef}
                aria-hidden
                className="absolute inset-0 text-sm leading-relaxed pointer-events-none overflow-hidden whitespace-pre-wrap wrap-break-word"
              >
                {highlightMentions(input, blocks)}
              </div>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onScroll={syncMirrorScroll}
                placeholder="Refine a block, type @ to tag one…"
                rows={1}
                className="relative w-full bg-transparent text-sm placeholder-[#a1a1aa] focus:outline-none resize-none leading-relaxed"
                style={{
                  maxHeight: 120,
                  color: input ? "transparent" : undefined,
                  caretColor: "#09090b",
                }}
              />
            </div>
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-[#7c5cfc] hover:bg-[#6a4fe4] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
            >
              {loading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <ArrowUp size={13} />
              )}
            </button>
          </div>
        </div>
        <p className="text-[10px] text-[#a1a1aa] mt-1.5 px-1">
          ↵ to send · Shift+↵ for newline · @ to tag a block
        </p>
      </div>
    </div>
  );
}
