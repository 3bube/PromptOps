"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Block, Variable } from "../types";

export interface PromptMeta {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  workspace_id: string;
}

export interface VersionEntry {
  id: string;
  version_num: number;
  label: string | null;
  created_at: string;
}

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

export function useWorkspaceData(promptId: string) {
  const [meta, setMeta] = useState<PromptMeta | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Always-current ref so wrappers don't capture stale variables
  const variablesRef = useRef<Variable[]>(variables);
  useEffect(() => {
    variablesRef.current = variables;
  }, [variables]);

  // ----------------------------------------------------------------
  // Load initial data
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!promptId) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const [promptRes, blocksRes, varsRes, versionsRes] = await Promise.all([
        (supabase as any)
          .from("workspace_prompts")
          .select("id, name, description, category, workspace_id")
          .eq("id", promptId)
          .single(),
        (supabase as any)
          .from("prompt_blocks")
          .select("id, title, content, color, position")
          .eq("prompt_id", promptId)
          .order("position"),
        (supabase as any)
          .from("prompt_variables")
          .select("id, name, default_value")
          .eq("prompt_id", promptId),
        (supabase as any)
          .from("prompt_versions")
          .select("id, version_num, label, created_at")
          .eq("prompt_id", promptId)
          .order("version_num", { ascending: false })
          .limit(20),
      ]);

      if (cancelled) return;

      if (promptRes.error) {
        setError(promptRes.error.message);
        setLoading(false);
        return;
      }

      setMeta(promptRes.data as PromptMeta);
      setBlocks(
        (blocksRes.data ?? []).map((b: any) => ({
          id: b.id,
          title: b.title,
          content: b.content,
          color: b.color,
        })),
      );
      setVariables(
        (varsRes.data ?? []).map((v: any) => ({
          name: v.name,
          value: v.default_value,
        })),
      );
      setVersions(versionsRes.data ?? []);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [promptId]);

  // ----------------------------------------------------------------
  // Debounced auto-save (blocks + variables)
  // ----------------------------------------------------------------
  const scheduleSave = useCallback(
    (nextBlocks: Block[], nextVariables: Variable[]) => {
      setSaveStatus("unsaved");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        persist(promptId, nextBlocks, nextVariables, setSaveStatus);
      }, 1200);
    },
    [promptId],
  );

  // ----------------------------------------------------------------
  // Block mutations
  // ----------------------------------------------------------------
  const updateBlock = useCallback(
    (id: string, content: string) => {
      setBlocks((prev) => {
        const next = prev.map((b) => (b.id === id ? { ...b, content } : b));
        scheduleSave(next, variables);
        return next;
      });
    },
    [variables, scheduleSave],
  );

  const updateBlockTitle = useCallback(
    (id: string, title: string) => {
      setBlocks((prev) => {
        const next = prev.map((b) => (b.id === id ? { ...b, title } : b));
        scheduleSave(next, variables);
        return next;
      });
    },
    [variables, scheduleSave],
  );

  const reorderBlocks = useCallback(
    (next: Block[]) => {
      setBlocks(next);
      scheduleSave(next, variables);
    },
    [variables, scheduleSave],
  );

  const deleteBlock = useCallback(
    async (id: string) => {
      setBlocks((prev) => {
        const next = prev.filter((b) => b.id !== id);
        scheduleSave(next, variables);
        return next;
      });
      await (supabase as any).from("prompt_blocks").delete().eq("id", id);
    },
    [variables, scheduleSave],
  );

  const addBlock = useCallback(async () => {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    if (!userId) return;

    const position = blocks.length;
    const COLORS = [
      "#7c5cfc",
      "#22d4c8",
      "#f59e0b",
      "#10b981",
      "#ef4444",
      "#3b82f6",
    ];
    const color = COLORS[position % COLORS.length];

    const existingTitles = new Set(blocks.map((b) => b.title));
    let title = "New Block";
    let n = 2;
    while (existingTitles.has(title)) title = `New Block ${n++}`;

    const { data, error } = await (supabase as any)
      .from("prompt_blocks")
      .insert({
        prompt_id: promptId,
        user_id: userId,
        title,
        content: "",
        color,
        position,
      })
      .select("id, title, content, color, position")
      .single();

    if (!error && data) {
      setBlocks((prev) => [
        ...prev,
        {
          id: data.id,
          title: data.title,
          content: data.content,
          color: data.color,
        },
      ]);
    }
  }, [promptId, blocks.length]);

  // ----------------------------------------------------------------
  // Variable mutations
  // ----------------------------------------------------------------
  const updateVariable = useCallback(
    (name: string, value: string) => {
      setVariables((prev) => {
        const next = prev.map((v) => (v.name === name ? { ...v, value } : v));
        scheduleSave(blocks, next);
        return next;
      });
    },
    [blocks, scheduleSave],
  );

  const addVariable = useCallback(
    async (name: string) => {
      const trimmed = name.trim().replace(/\s+/g, "_");
      if (!trimmed || variables.some((v) => v.name === trimmed)) return;

      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (!userId) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("prompt_variables")
        .insert({
          prompt_id: promptId,
          user_id: userId,
          name: trimmed,
          default_value: "",
        });

      if (!error) {
        setVariables((prev) => [...prev, { name: trimmed, value: "" }]);
      }
    },
    [promptId, variables],
  );

  const deleteVariable = useCallback(
    async (name: string) => {
      setVariables((prev) => {
        const next = prev.filter((v) => v.name !== name);
        scheduleSave(blocks, next);
        return next;
      });
      await (supabase as any)
        .from("prompt_variables")
        .delete()
        .eq("prompt_id", promptId)
        .eq("name", name);
    },
    [promptId, blocks, scheduleSave],
  );

  // ----------------------------------------------------------------
  // Save a named version snapshot
  // ----------------------------------------------------------------
  const saveVersion = useCallback(
    async (label?: string) => {
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;
      if (!userId) return;

      // Include current messages in the snapshot so they restore with the version
      const { data: msgs } = await (supabase as any)
        .from("prompt_messages")
        .select("role, content")
        .eq("prompt_id", promptId)
        .order("created_at", { ascending: true });

      const snapshot = { blocks, variables, messages: msgs ?? [] };
      const { data: ver, error } = await (supabase as any)
        .from("prompt_versions")
        .insert({
          prompt_id: promptId,
          user_id: userId,
          label: label ?? null,
          snapshot,
        })
        .select("id, version_num, label, created_at")
        .single();

      if (!error && ver) {
        setVersions((prev) => [ver, ...prev]);
      }
    },
    [promptId, blocks, variables],
  );

  // ----------------------------------------------------------------
  // Restore a version snapshot
  // ----------------------------------------------------------------
  const restoreVersion = useCallback(
    async (versionId: string) => {
      // Cancel any pending debounced save so it can't overwrite the restore
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("prompt_versions")
        .select("snapshot")
        .eq("id", versionId)
        .single();

      if (error) {
        console.error("restoreVersion: fetch failed", error);
        return;
      }

      if (data?.snapshot) {
        const snap = data.snapshot as {
          blocks: Block[];
          variables: Variable[];
          messages?: { role: string; content: string }[];
        };
        const snapBlocks = snap.blocks ?? [];
        const snapVars = snap.variables ?? [];
        const snapMessages = snap.messages ?? [];

        // Restore blocks
        await (supabase as any)
          .from("prompt_blocks")
          .delete()
          .eq("prompt_id", promptId);
        setBlocks(snapBlocks);
        setVariables(snapVars);
        await persist(promptId, snapBlocks, snapVars, setSaveStatus);

        // Restore messages: wipe current and re-insert snapshot messages
        await (supabase as any)
          .from("prompt_messages")
          .delete()
          .eq("prompt_id", promptId);

        if (snapMessages.length > 0) {
          await (supabase as any)
            .from("prompt_messages")
            .insert(
              snapMessages.map((m) => ({
                prompt_id: promptId,
                user_id: userId,
                role: m.role,
                content: m.content,
              })),
            );
        }
      } else {
        console.error("restoreVersion: no snapshot found for", versionId, data);
      }
    },
    [promptId],
  );

  // Safe wrapper: any external caller that sets blocks also triggers a save
  const setBlocksAndSave = useCallback(
    (updater: Block[] | ((prev: Block[]) => Block[])) => {
      setBlocks((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        scheduleSave(next, variablesRef.current);
        return next;
      });
    },
    [scheduleSave],
  );

  return {
    meta,
    blocks,
    variables,
    versions,
    loading,
    error,
    saveStatus,
    updateBlock,
    updateBlockTitle,
    reorderBlocks,
    deleteBlock,
    addBlock,
    updateVariable,
    addVariable,
    deleteVariable,
    saveVersion,
    restoreVersion,
    setBlocks: setBlocksAndSave,
  };
}

// ----------------------------------------------------------------
// persist – write blocks + variables to DB
// ----------------------------------------------------------------
async function persist(
  promptId: string,
  blocks: Block[],
  variables: Variable[],
  setStatus: (s: SaveStatus) => void,
) {
  setStatus("saving");
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    if (!userId) throw new Error("Not authenticated");

    // Upsert blocks (match on id)
    if (blocks.length > 0) {
      await (supabase as any).from("prompt_blocks").upsert(
        blocks.map((b, i) => ({
          id: b.id,
          prompt_id: promptId,
          user_id: userId,
          title: b.title,
          content: b.content,
          color: b.color,
          position: i,
        })),
        { onConflict: "id" },
      );
    }

    // Upsert variables (match on prompt_id + name)
    if (variables.length > 0) {
      await (supabase as any).from("prompt_variables").upsert(
        variables.map((v) => ({
          prompt_id: promptId,
          user_id: userId,
          name: v.name,
          default_value: v.value,
        })),
        { onConflict: "prompt_id,name" },
      );
    }

    setStatus("saved");
  } catch {
    setStatus("error");
  }
}
