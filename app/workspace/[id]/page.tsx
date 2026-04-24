"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { WorkspaceSidebar } from "./components/WorkspaceSidebar";
import { WorkspaceTopbar } from "./components/WorkspaceTopbar";
import { AssistantPanel } from "./components/AssistantPanel";
import { PromptCanvas } from "./components/PromptCanvas";
import { TestPanel } from "./components/TestPanel";
import { useWorkspaceData } from "./hooks/useWorkspaceData";
import { useGenerateBlocks } from "./hooks/useGenerateBlocks";
import { useAuth } from "@/contexts/AuthContext";
import { useQuota } from "@/hooks/data/useQuota";
import type { Block } from "./types";
import posthog from "posthog-js";

function Workspace({
  id,
  initDescription,
}: {
  id: string;
  initDescription: string | null;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("editor");
  const [messageReloadKey, setMessageReloadKey] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [exceededLimit, setExceededLimit] = useState<{ plan: string; limit: number } | null>(null);
  const autoV1Created = useRef(false);

  const { plan, limit, used, refetch: refetchQuota } = useQuota(user?.id);

  const {
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
    setBlocks,
  } = useWorkspaceData(id);

  const handleBlocksUpdate = useCallback(
    (generated: Block[]) => setBlocks(() => generated),
    [setBlocks],
  );

  const extractAndAddVariables = useCallback(
    (sourceBlocks: Block[]) => {
      const seen = new Set<string>();
      for (const block of sourceBlocks) {
        for (const [, name] of block.content.matchAll(/\{\{([a-zA-Z0-9_]+)\}\}/g)) {
          if (!seen.has(name)) {
            seen.add(name);
            addVariable(name);
          }
        }
      }
    },
    [addVariable],
  );

  const handleGenerationComplete = useCallback(
    (finalBlocks: Block[]) => {
      setBlocks(() => finalBlocks);
      extractAndAddVariables(finalBlocks);
      refetchQuota();
    },
    [setBlocks, extractAndAddVariables, refetchQuota],
  );

  const handleAssistantBlocksChange = useCallback(
    (updater: Block[] | ((prev: Block[]) => Block[])) => {
      setBlocks((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        extractAndAddVariables(next);
        return next;
      });
    },
    [setBlocks, extractAndAddVariables],
  );

  const handleLimitExceeded = useCallback((exceededPlan: string, exceededPlanLimit: number) => {
    setExceededLimit({ plan: exceededPlan, limit: exceededPlanLimit });
    setShowUpgradeModal(true);
  }, []);

  const {
    start: startGeneration,
    stop: stopGeneration,
    isGenerating,
  } = useGenerateBlocks({
    userId: user?.id,
    onBlocksUpdate: handleBlocksUpdate,
    onComplete: handleGenerationComplete,
    onLimitExceeded: handleLimitExceeded,
  });

  // Auto-create v1 once blocks are saved and no versions exist yet
  useEffect(() => {
    if (
      !loading &&
      saveStatus === "saved" &&
      blocks.length > 0 &&
      versions.length === 0 &&
      !autoV1Created.current
    ) {
      autoV1Created.current = true;
      saveVersion("v1");
    }
  }, [loading, saveStatus, blocks.length, versions.length, saveVersion]);

  // Auto-start generation when workspace loads empty with an init description
  useEffect(() => {
    if (!loading && !error && blocks.length === 0 && initDescription) {
      startGeneration(initDescription);
    }
    // Only run once when data finishes loading
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const handleExport = useCallback(() => {
    if (!meta) return;
    posthog.capture("prompt_exported", { prompt_id: id, block_count: blocks.length, variable_count: variables.length });
    const lines: string[] = [`# Prompt: ${meta.name}\n`];
    if (variables.length) {
      lines.push(`## Variables\n`);
      variables.forEach((v) =>
        lines.push(`- \`{{${v.name}}}\` = \`${v.value}\``),
      );
      lines.push("");
    }
    blocks.forEach((b) => {
      lines.push(`## ${b.title}\n`);
      lines.push(b.content);
      lines.push("");
    });
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${meta.name.toLowerCase().replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [blocks, variables, meta]);

  const handleRun = useCallback(() => setActiveTab("test"), []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#ffffff]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#7c5cfc] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#a1a1aa]">Loading workspace…</p>
        </div>
      </div>
    );
  }

  if (error || !meta) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#ffffff]">
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <p className="text-sm font-medium text-[#09090b]">
            Could not load prompt
          </p>
          <p className="text-[12px] text-[#a1a1aa]">
            {error ?? "Prompt not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-[#ffffff] text-[#09090b] font-sans overflow-hidden text-left">
      <WorkspaceSidebar
        versions={versions}
        saveStatus={saveStatus}
        onSaveVersion={saveVersion}
        onRestoreVersion={async (versionId) => {
          await restoreVersion(versionId);
          setMessageReloadKey((k) => k + 1);
        }}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <WorkspaceTopbar
          promptName={meta.name}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onExport={handleExport}
          onRun={handleRun}
          plan={plan}
          used={used}
          limit={limit}
        />

        <div className="flex flex-1 overflow-hidden">
          {activeTab === "editor" ? (
            <>
              <AssistantPanel
                promptId={id}
                messageReloadKey={messageReloadKey}
                blocks={blocks}
                onBlocksChange={handleAssistantBlocksChange}
              />
              <PromptCanvas
                promptName={meta.name}
                blocks={blocks}
                variables={variables}
                isGenerating={isGenerating}
                onStopGeneration={stopGeneration}
                onBlockChange={updateBlock}
                onBlockTitleChange={updateBlockTitle}
                onBlockDelete={deleteBlock}
                onBlockAdd={addBlock}
                onBlockReorder={reorderBlocks}
                onVariableChange={updateVariable}
                onVariableAdd={addVariable}
                onVariableDelete={deleteVariable}
              />
            </>
          ) : (
            <TestPanel blocks={blocks} variables={variables} />
          )}
        </div>
      </div>

      {/* Upgrade modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#e4e4e7] p-8 max-w-sm w-full mx-4 flex flex-col gap-5">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#7c5cfc]/10 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" fill="#7c5cfc" fillOpacity="0.8"/>
                </svg>
              </div>
              <h2 className="text-base font-semibold text-[#09090b]">
                You've used all {exceededLimit?.limit} generations this month
              </h2>
              <p className="text-sm text-[#71717a] mt-2 leading-relaxed">
                Upgrade to Pro for 500 generations/month, or go Unlimited for no limits — ever.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-[#71717a] bg-[#fafafa] border border-[#e4e4e7] rounded-lg px-3 py-2">
                <span>Pro</span>
                <span className="font-semibold text-[#09090b]">$9 / month · 500 generations</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#71717a] bg-[#fafafa] border border-[#e4e4e7] rounded-lg px-3 py-2">
                <span>Unlimited</span>
                <span className="font-semibold text-[#09090b]">$19 / month · No limits</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => router.push("/pricing")}
                className="flex-1 px-4 py-2.5 bg-[#7c5cfc] hover:bg-[#6a4fe4] text-white rounded-lg text-sm font-medium transition-colors"
              >
                Upgrade now
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2.5 bg-[#f4f4f5] hover:bg-[#e4e4e7] text-[#71717a] rounded-lg text-sm font-medium transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const initDescription = searchParams.get("init");

  return (
    <div className="h-screen w-full">
      <Workspace id={params.id} initDescription={initDescription} />
    </div>
  );
}
