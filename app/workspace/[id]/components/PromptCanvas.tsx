"use client";

import { useState, useRef } from "react";
import { Braces, Plus, X, Layers, Square } from "lucide-react";
import { VariableTag } from "./VariableTag";
import { PromptBlock } from "./PromptBlock";
import type { Block, Variable } from "../types";

interface PromptCanvasProps {
  promptName: string;
  blocks: Block[];
  variables: Variable[];
  isGenerating?: boolean;
  onStopGeneration?: () => void;
  onBlockChange: (id: string, content: string) => void;
  onBlockTitleChange: (id: string, title: string) => void;
  onBlockDelete: (id: string) => void;
  onBlockAdd: () => void;
  onBlockReorder: (blocks: Block[]) => void;
  onVariableChange: (name: string, value: string) => void;
  onVariableAdd: (name: string) => void;
  onVariableDelete: (name: string) => void;
}

export function PromptCanvas({
  promptName,
  blocks,
  variables,
  isGenerating = false,
  onStopGeneration,
  onBlockChange,
  onBlockTitleChange,
  onBlockDelete,
  onBlockAdd,
  onBlockReorder,
  onVariableChange,
  onVariableAdd,
  onVariableDelete,
}: PromptCanvasProps) {
  const [addingVariable, setAddingVariable] = useState(false);
  const [newVarName, setNewVarName] = useState("");
  const dragIndexRef = useRef<number | null>(null);
  const [draggingOverIndex, setDraggingOverIndex] = useState<number | null>(
    null,
  );

  const commitNewVariable = () => {
    const trimmed = newVarName.trim().replace(/\s+/g, "_");
    if (trimmed) onVariableAdd(trimmed);
    setNewVarName("");
    setAddingVariable(false);
  };

  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
  };

  const handleDragEnter = (index: number) => {
    setDraggingOverIndex(index);
  };

  const handleDragEnd = () => {
    const from = dragIndexRef.current;
    const to = draggingOverIndex;
    if (from !== null && to !== null && from !== to) {
      const next = [...blocks];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      onBlockReorder(next);
    }
    dragIndexRef.current = null;
    setDraggingOverIndex(null);
  };

  return (
    <div className="flex-1 bg-[#ffffff] overflow-y-auto p-8 relative">
      {/* Generation banner */}
      {isGenerating && (
        <div className="sticky top-0 z-10 -mx-8 -mt-8 mb-6 px-8 py-3 bg-[#7c5cfc]/5 border-b border-[#7c5cfc]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc] animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc] animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc] animate-bounce [animation-delay:300ms]" />
            </span>
            <span className="text-xs font-medium text-[#7c5cfc]">
              AI is building your prompt…
            </span>
          </div>
          <button
            onClick={onStopGeneration}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#7c5cfc]/30 text-[#7c5cfc] text-xs font-medium hover:bg-[#7c5cfc]/10 transition-colors"
          >
            <Square size={11} fill="currentColor" />
            Stop
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Canvas Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">{promptName}</h1>
          <p className="text-sm text-[#a1a1aa] mt-1">
            Compose your prompt using blocks below. Use{" "}
            <code className="font-mono bg-[#f4f4f5] px-1 py-0.5 rounded text-[#22d4c8] text-[11px]">
              {"{{variable}}"}
            </code>{" "}
            syntax to inject dynamic values at test time.
          </p>
        </div>

        {/* Variables */}
        <div className="mb-8 p-5 bg-[#ffffff] border border-[#e4e4e7] rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Braces size={15} className="text-[#22d4c8]" />
              <h3 className="text-sm font-semibold">Variables</h3>
              <span className="text-[10px] text-[#a1a1aa] font-mono">
                {variables.length} defined
              </span>
            </div>
            <button
              onClick={() => setAddingVariable(true)}
              className="text-[11px] text-[#22d4c8] font-medium flex items-center gap-1 hover:text-[#45e8dc] transition-colors"
            >
              <Plus size={12} /> Add Variable
            </button>
          </div>

          <div className="flex flex-wrap gap-3 items-start">
            {variables.length === 0 && !addingVariable && (
              <p className="text-[12px] text-[#a1a1aa]">
                No variables yet. Add one to inject dynamic values into your
                blocks.
              </p>
            )}
            {variables.map((v) => (
              <VariableTag
                key={v.name}
                variable={v}
                onChange={onVariableChange}
                onDelete={onVariableDelete}
              />
            ))}

            {addingVariable && (
              <div className="flex flex-col bg-[#ffffff] border border-[#7c5cfc] rounded-lg overflow-hidden w-52 shrink-0 shadow-sm">
                <div className="bg-[#f4f4f5] px-3 py-1.5 border-b border-[#e4e4e7] flex items-center gap-1">
                  <span className="text-[11px] font-mono text-[#22d4c8]">
                    {"{{"}
                  </span>
                  <input
                    autoFocus
                    value={newVarName}
                    onChange={(e) =>
                      setNewVarName(e.target.value.replace(/\s/g, "_"))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitNewVariable();
                      if (e.key === "Escape") {
                        setAddingVariable(false);
                        setNewVarName("");
                      }
                    }}
                    placeholder="variable_name"
                    className="flex-1 text-xs font-mono text-[#09090b] bg-transparent focus:outline-none placeholder:text-[#d4d4d8]"
                  />
                  <span className="text-[11px] font-mono text-[#22d4c8]">
                    {"}}"}
                  </span>
                </div>
                <div className="px-3 py-2 flex gap-2">
                  <button
                    onClick={commitNewVariable}
                    className="text-[10px] text-[#7c5cfc] font-medium hover:underline"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setAddingVariable(false);
                      setNewVarName("");
                    }}
                    className="text-[10px] text-[#a1a1aa] hover:text-[#09090b]"
                  >
                    <X size={11} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prompt Blocks */}
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#f4f4f5] flex items-center justify-center mb-4">
              <Layers size={22} className="text-[#d4d4d8]" />
            </div>
            <p className="text-sm font-medium text-[#71717a]">No blocks yet</p>
            <p className="text-[12px] text-[#a1a1aa] mt-1 mb-5 max-w-xs">
              Add your first block to start building your prompt.
            </p>
            <button
              onClick={onBlockAdd}
              className="flex items-center gap-2 px-4 py-2 bg-[#7c5cfc] hover:bg-[#6a4fe4] text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Plus size={15} /> Add First Block
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {blocks.map((block, i) => (
                <PromptBlock
                  key={block.id}
                  block={block}
                  index={i}
                  availableVariables={variables}
                  isDraggingOver={draggingOverIndex === i}
                  existingTitles={blocks
                    .filter((b) => b.id !== block.id)
                    .map((b) => b.title)}
                  onChange={onBlockChange}
                  onTitleChange={onBlockTitleChange}
                  onDelete={onBlockDelete}
                  onDragStart={handleDragStart}
                  onDragEnter={handleDragEnter}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>
            <button
              onClick={onBlockAdd}
              className="w-full mt-4 py-3 border border-dashed border-[#d4d4d8] rounded-xl text-sm text-[#a1a1aa] hover:text-[#71717a] hover:border-[#a1a1aa] transition-colors flex items-center justify-center gap-2 bg-[#fafafa] hover:bg-[#f4f4f5]"
            >
              <Plus size={16} /> Add Block
            </button>
          </>
        )}
      </div>
    </div>
  );
}
