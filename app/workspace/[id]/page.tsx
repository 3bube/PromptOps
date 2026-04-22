"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { WorkspaceSidebar } from "./components/WorkspaceSidebar";
import { WorkspaceTopbar } from "./components/WorkspaceTopbar";
import { AssistantPanel } from "./components/AssistantPanel";
import { PromptCanvas } from "./components/PromptCanvas";
import { TestPanel } from "./components/TestPanel";
import { useWorkspaceData } from "./hooks/useWorkspaceData";
import { useGenerateBlocks } from "./hooks/useGenerateBlocks";
import type { Block } from "./types";

function Workspace({ id, initDescription }: { id: string; initDescription: string | null }) {
  const [activeTab, setActiveTab] = useState("editor");
  const {
    meta, blocks, variables, versions,
    loading, error, saveStatus,
    updateBlock, updateBlockTitle, reorderBlocks, deleteBlock, addBlock,
    updateVariable, addVariable, deleteVariable,
    saveVersion, restoreVersion,
    setBlocks,
  } = useWorkspaceData(id);

  const handleBlocksUpdate = useCallback(
    (generated: Block[]) => setBlocks(() => generated),
    [setBlocks]
  );

  // After generation completes, persist the blocks to DB via a regular update
  const handleGenerationComplete = useCallback(() => {
    // Trigger a save by touching the first block; the debounce will flush all
    setBlocks((prev) => [...prev]);
  }, [setBlocks]);

  const { start: startGeneration, stop: stopGeneration, isGenerating } = useGenerateBlocks({
    onBlocksUpdate: handleBlocksUpdate,
    onComplete: handleGenerationComplete,
  });

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
    const lines: string[] = [`# Prompt: ${meta.name}\n`];
    if (variables.length) {
      lines.push(`## Variables\n`);
      variables.forEach((v) => lines.push(`- \`{{${v.name}}}\` = \`${v.value}\``));
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
          <p className="text-sm font-medium text-[#09090b]">Could not load prompt</p>
          <p className="text-[12px] text-[#a1a1aa]">{error ?? "Prompt not found."}</p>
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
        onRestoreVersion={restoreVersion}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <WorkspaceTopbar
          promptName={meta.name}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onExport={handleExport}
          onRun={handleRun}
        />

        <div className="flex flex-1 overflow-hidden">
          {activeTab === "editor" ? (
            <>
              <AssistantPanel promptId={id} blocks={blocks} onBlocksChange={setBlocks} />
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
