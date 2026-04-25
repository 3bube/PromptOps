"use client";

import React, { useState, useRef } from "react";
import { Trash2, Check, Pencil } from "lucide-react";
import type { Variable } from "../types";

interface VariableTagProps {
  variable: Variable;
  onChange: (name: string, value: string) => void;
  onDelete: (name: string) => void;
}

export function VariableTag({ variable, onChange, onDelete }: VariableTagProps) {
  const [editingValue, setEditingValue] = useState(false);
  const [draft, setDraft] = useState(variable.value);
  const inputRef = useRef<HTMLInputElement>(null);

  const commitEdit = () => {
    onChange(variable.name, draft);
    setEditingValue(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") {
      setDraft(variable.value);
      setEditingValue(false);
    }
  };

  return (
    <div className="group flex flex-col bg-[#ffffff] border border-[#e4e4e7] rounded-lg overflow-hidden w-52 shrink-0 hover:border-[#d4d4d8] transition-colors">
      {/* Header */}
      <div className="bg-[#f4f4f5] px-3 py-1.5 border-b border-[#e4e4e7] flex justify-between items-center">
        <span className="text-xs font-mono text-[#22d4c8]">{`{{${variable.name}}}`}</span>
        <button
          onClick={() => onDelete(variable.name)}
          className="opacity-0 group-hover:opacity-100 p-0.5 text-[#a1a1aa] hover:text-[#ef4444] transition-all"
          title="Remove variable"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Value */}
      <div className="px-3 py-1.5 flex items-center gap-1.5 min-h-[32px]">
        {editingValue ? (
          <input
            ref={inputRef}
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="flex-1 text-xs text-[#09090b] bg-transparent focus:outline-none font-mono"
          />
        ) : (
          <span
            className="flex-1 text-xs text-[#71717a] truncate font-mono cursor-text"
            onClick={() => { setDraft(variable.value); setEditingValue(true); }}
            title="Click to edit"
          >
            {variable.value || <span className="text-[#d4d4d8]">empty</span>}
          </span>
        )}
        {editingValue ? (
          <button onClick={commitEdit} className="text-[#10b981] shrink-0">
            <Check size={12} />
          </button>
        ) : (
          <button
            onClick={() => { setDraft(variable.value); setEditingValue(true); }}
            className="opacity-0 group-hover:opacity-100 text-[#a1a1aa] hover:text-[#09090b] transition-all shrink-0"
          >
            <Pencil size={11} />
          </button>
        )}
      </div>
    </div>
  );
}
