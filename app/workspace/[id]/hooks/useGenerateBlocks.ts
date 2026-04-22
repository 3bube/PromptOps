"use client";

import { useState, useRef, useCallback } from "react";
import type { Block } from "../types";
import { BLOCK_COLORS } from "../types";

interface UseGenerateBlocksOptions {
  onBlocksUpdate: (blocks: Block[]) => void;
  onComplete: () => void;
}

export function useGenerateBlocks({ onBlocksUpdate, onComplete }: UseGenerateBlocksOptions) {
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(
    async (description: string) => {
      if (!description.trim()) return;

      const controller = new AbortController();
      abortRef.current = controller;
      setIsGenerating(true);

      // Mutable working state — we mutate these in the loop and snapshot to React state
      const blocks: Block[] = [];
      let currentBlock: Block | null = null;
      let buffer = "";
      let colorIndex = 0;

      const MARKER = "§BLOCK§";

      const pushUpdate = () => onBlocksUpdate(blocks.map((b) => ({ ...b })));

      try {
        const res = await fetch("/api/workspace-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) throw new Error("Request failed");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Drain all complete markers from the buffer
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const markerStart = buffer.indexOf(MARKER);

            if (markerStart === -1) {
              // No marker — stream content into current block, but keep a tail
              // that might be the start of a future marker
              if (currentBlock) {
                const safeLen = Math.max(0, buffer.length - MARKER.length);
                if (safeLen > 0) {
                  currentBlock.content += buffer.slice(0, safeLen);
                  buffer = buffer.slice(safeLen);
                  pushUpdate();
                }
              }
              break;
            }

            // Flush content before the marker into current block
            if (markerStart > 0 && currentBlock) {
              currentBlock.content += buffer.slice(0, markerStart);
              pushUpdate();
            }

            // Find closing § of the marker header
            const headerEnd = buffer.indexOf("§", markerStart + MARKER.length);
            if (headerEnd === -1) {
              // Incomplete header — wait for more data
              buffer = buffer.slice(markerStart);
              break;
            }

            // Parse title and color from "Title|#color"
            const header = buffer.slice(markerStart + MARKER.length, headerEnd);
            const pipeIdx = header.lastIndexOf("|");
            let title = header.trim();
            let color = BLOCK_COLORS[colorIndex % BLOCK_COLORS.length];
            colorIndex++;

            if (pipeIdx !== -1) {
              title = header.slice(0, pipeIdx).trim();
              const maybeColor = header.slice(pipeIdx + 1).trim();
              if (maybeColor.startsWith("#")) color = maybeColor;
            }

            currentBlock = { id: crypto.randomUUID(), title, color, content: "" };
            blocks.push(currentBlock);
            pushUpdate();

            // Advance buffer past the header, skip leading newline
            const afterHeader = buffer.slice(headerEnd + 1);
            buffer = afterHeader.startsWith("\n") ? afterHeader.slice(1) : afterHeader;
          }
        }

        // Flush remaining buffer into last block
        if (currentBlock && buffer.trim()) {
          currentBlock.content += buffer.trim();
          pushUpdate();
        }

        onComplete();
      } catch (err: unknown) {
        if (!(err instanceof Error && err.name === "AbortError")) {
          console.error("Generation error:", err);
        }
        // On abort or error, keep whatever blocks were generated
        if (blocks.length > 0) pushUpdate();
      } finally {
        setIsGenerating(false);
      }
    },
    [onBlocksUpdate, onComplete]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { start, stop, isGenerating };
}
