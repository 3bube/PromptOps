"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Block, Variable } from "../types";
import {
  useWorkspaceData as useWorkspaceDataQuery,
  useAddBlock,
  useDeleteBlock,
  useAddVariable,
  useDeleteVariable,
  useSaveVersion,
  useRestoreVersion,
  usePersistBlocks,
} from "@/hooks/data/prompts.hooks";

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
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const variablesRef = useRef<Variable[]>(variables);

  useEffect(() => {
    variablesRef.current = variables;
  }, [variables]);

  // Load initial data
  const { data: workspaceData, isLoading: loading, error } = useWorkspaceDataQuery(promptId);

  // Mutations
  const addBlockMutation = useAddBlock(promptId);
  const deleteBlockMutation = useDeleteBlock(promptId);
  const addVariableMutation = useAddVariable(promptId);
  const deleteVariableMutation = useDeleteVariable(promptId);
  const saveVersionMutation = useSaveVersion(promptId);
  const restoreVersionMutation = useRestoreVersion(promptId);
  const persistMutation = usePersistBlocks(promptId);

  // Initialize blocks/variables/versions from loaded data
  useEffect(() => {
    if (workspaceData) {
      setBlocks(workspaceData.blocks);
      setVariables(workspaceData.variables);
    }
  }, [workspaceData]);

  const scheduleSave = useCallback(
    (nextBlocks: Block[], nextVariables: Variable[]) => {
      setSaveStatus("unsaved");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        try {
          await persistMutation.mutateAsync({
            blocks: nextBlocks,
            variables: nextVariables,
          });
          setSaveStatus("saved");
        } catch {
          setSaveStatus("error");
        }
      }, 1200);
    },
    [persistMutation],
  );

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
      await deleteBlockMutation.mutateAsync(id);
    },
    [variables, scheduleSave, deleteBlockMutation],
  );

  const addBlock = useCallback(async () => {
    try {
      const newBlock = await addBlockMutation.mutateAsync(blocks.length);
      setBlocks((prev) => [...prev, newBlock]);
    } catch (err) {
      console.error("Failed to add block:", err);
    }
  }, [blocks.length, addBlockMutation]);

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

      try {
        await addVariableMutation.mutateAsync(name);
        setVariables((prev) => [...prev, { name: trimmed, value: "" }]);
      } catch (err) {
        console.error("Failed to add variable:", err);
      }
    },
    [variables, addVariableMutation],
  );

  const deleteVariable = useCallback(
    async (name: string) => {
      setVariables((prev) => {
        const next = prev.filter((v) => v.name !== name);
        scheduleSave(blocks, next);
        return next;
      });
      await deleteVariableMutation.mutateAsync(name);
    },
    [blocks, scheduleSave, deleteVariableMutation],
  );

  const saveVersion = useCallback(
    async (label?: string) => {
      try {
        await saveVersionMutation.mutateAsync({
          blocks,
          variables,
          label,
        });
      } catch (err) {
        console.error("Failed to save version:", err);
      }
    },
    [blocks, variables, saveVersionMutation],
  );

  const restoreVersion = useCallback(
    async (versionId: string) => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }

      try {
        await restoreVersionMutation.mutateAsync(versionId);
      } catch (err) {
        console.error("Failed to restore version:", err);
      }
    },
    [restoreVersionMutation],
  );

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
    meta: workspaceData?.meta ?? null,
    blocks,
    variables,
    versions: workspaceData?.versions ?? [],
    loading,
    error: error ? (error as Error).message : null,
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
