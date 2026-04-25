"use client";

import React, { useState, useRef, useEffect } from "react";
import { GripVertical, Copy, Trash2, Check, Braces } from "lucide-react";
// @ts-ignore
import getCaretCoordinates from "textarea-caret";
import type { Block, Variable } from "../types";

interface PromptBlockProps {
  block: Block;
  index: number;
  availableVariables: Variable[];
  isDraggingOver: boolean;
  existingTitles: string[];
  onChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
}

export function PromptBlock({
  block,
  index,
  availableVariables,
  isDraggingOver,
  existingTitles,
  onChange,
  onTitleChange,
  onDelete,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: PromptBlockProps) {
  const [copied, setCopied] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(block.title);
  const isDuplicateTitle =
    titleDraft.trim() !== block.title &&
    existingTitles.includes(titleDraft.trim());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStartIndex, setMentionStartIndex] = useState<number | null>(
    null,
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [menuCoord, setMenuCoord] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [block.content]);

  useEffect(() => {
    if (editingTitle) titleInputRef.current?.select();
  }, [editingTitle]);

  // Keep draft in sync if block title changes externally
  useEffect(() => {
    if (!editingTitle) setTitleDraft(block.title);
  }, [block.title, editingTitle]);

  const commitTitle = () => {
    const trimmed = titleDraft.trim();
    if (!trimmed || isDuplicateTitle) {
      setTitleDraft(block.title);
      setEditingTitle(false);
      return;
    }
    if (trimmed !== block.title) onTitleChange(block.id, trimmed);
    setEditingTitle(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(block.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Variable autocomplete logic
  const filteredVariables = availableVariables.filter((v) =>
    v.name.toLowerCase().includes(mentionQuery.toLowerCase()),
  );

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(block.id, val);

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, cursorPosition);

    // Look for "{{" or "{" slightly before the cursor
    const match = textBeforeCursor.match(/\{\{?([a-zA-Z0-9_]*)$/);

    if (match) {
      setMentionStartIndex(match.index!);
      setMentionQuery(match[1] || "");
      setShowMentionMenu(true);
      setSelectedIndex(0);

      // Get exact pixel coordinates for the caret dropdown
      if (textareaRef.current) {
        const coords = getCaretCoordinates(textareaRef.current, cursorPosition);
        // Move slightly right and substantially under the line height
        setMenuCoord({
          top: coords.top + 24, // approx line height + offset
          left: coords.left,
        });
      }
    } else {
      setShowMentionMenu(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMentionMenu) return;

    if (filteredVariables.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredVariables.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) =>
            (prev - 1 + filteredVariables.length) % filteredVariables.length,
        );
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        insertVariable(filteredVariables[selectedIndex].name);
      } else if (e.key === "Escape") {
        setShowMentionMenu(false);
      }
    }
  };

  const insertVariable = (varName: string) => {
    if (mentionStartIndex === null || !textareaRef.current) return;

    const val = textareaRef.current.value;
    const before = val.slice(0, mentionStartIndex);
    const after = val.slice(textareaRef.current.selectionStart);

    // Auto complete to {{varName}}
    const newContent = `${before}{{${varName}}}${after}`;
    onChange(block.id, newContent);
    setShowMentionMenu(false);

    // Reset cursor safely after React updates
    setTimeout(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        const newCursorPos = mentionStartIndex + varName.length + 4; // "{{name}}".length
        el.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Highlights variables with purple styling
  const renderHighlightedText = () => {
    // Regex matches instances of {{variable_name}}
    const regex = /(\{\{[a-zA-Z0-9_]+\}\})/g;
    const parts = block.content.split(regex);

    return parts.map((part, i) => {
      if (regex.test(part)) {
        // Only highlight if the variable actually exists in availableVariables
        const varName = part.slice(2, -2);
        const exists = availableVariables.some((v) => v.name === varName);

        if (exists) {
          return (
            <span key={i} className="bg-[#7c5cfc]/20 text-[#7c5cfc] rounded-sm">
              {part}
            </span>
          );
        }
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`group relative bg-[#ffffff] border rounded-xl transition-all shadow-sm ${
        isDraggingOver
          ? "border-[#7c5cfc] shadow-md shadow-[#7c5cfc]/10 scale-[1.01]"
          : "border-[#e4e4e7] hover:border-[#d4d4d8]"
      }`}
    >
      {/* Color accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: block.color }}
      />

      {/* Block header */}
      <div className="flex items-center justify-between pl-5 pr-3 py-3 border-b border-[#e4e4e7] bg-[#fafafa]">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="cursor-grab text-[#d4d4d8] hover:text-[#71717a] active:cursor-grabbing shrink-0"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GripVertical size={15} />
          </div>

          {editingTitle ? (
            <div className="flex flex-col min-w-0 w-full gap-0.5">
              <input
                ref={titleInputRef}
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={commitTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitTitle();
                  if (e.key === "Escape") {
                    setTitleDraft(block.title);
                    setEditingTitle(false);
                  }
                }}
                className="text-[11px] font-bold tracking-widest uppercase bg-transparent focus:outline-none border-b border-dashed min-w-0 w-full"
                style={{
                  color: isDuplicateTitle ? "#ef4444" : block.color,
                  borderColor: isDuplicateTitle
                    ? "#ef444460"
                    : block.color + "60",
                }}
              />
              {isDuplicateTitle && (
                <span className="text-[9px] text-[#ef4444] font-normal normal-case tracking-normal">
                  Name already taken
                </span>
              )}
            </div>
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              title="Click to rename"
              className="text-[11px] font-bold tracking-widest uppercase truncate hover:opacity-70 transition-opacity text-left"
              style={{ color: block.color }}
            >
              {block.title}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-[#a1a1aa] hover:text-[#09090b] hover:bg-[#f4f4f5] transition-colors"
            title="Copy block"
          >
            {copied ? (
              <Check size={13} className="text-[#10b981]" />
            ) : (
              <Copy size={13} />
            )}
          </button>
          <button
            onClick={() => onDelete(block.id)}
            className="p-1.5 rounded-md text-[#a1a1aa] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
            title="Delete block"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Editable content */}
      <div className="pl-5 pr-4 py-4 relative">
        <div className="relative text-[14px] leading-relaxed w-full font-mono bg-transparent">
          {/* Overlay to handle color grading */}
          <div className="absolute top-0 left-0 w-full h-full text-[#09090b] whitespace-pre-wrap pointer-events-none break-words">
            {!block.content && (
              <span className="text-[#a1a1aa]">Enter prompt content…</span>
            )}
            {renderHighlightedText()}
            {/* HTML ignores trailing newlines in a div, so we append a space to keep sizes identical to the textarea */}
            {block.content.endsWith("\n") && " "}
          </div>

          <textarea
            ref={textareaRef}
            className="relative z-10 w-full bg-transparent resize-none focus:outline-none overflow-hidden text-[#09090b]"
            style={{
              color: "transparent",
              caretColor: "#09090b", // Caret visible, text invisible
            }}
            value={block.content}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            rows={1}
          />
        </div>

        {showMentionMenu && filteredVariables.length > 0 && (
          <div
            className="absolute z-20 w-56 mt-2 bg-white border border-[#e4e4e7] rounded-xl shadow-lg overflow-hidden flex flex-col items-center"
            style={{
              top: `${menuCoord.top}px`,
              left: `${menuCoord.left}px`,
            }}
          >
            <span className="text-[10px] uppercase font-bold text-[#a1a1aa] bg-[#f4f4f5] border-b border-[#e4e4e7] w-full px-3 py-1.5 flex items-center justify-between">
              Variables
              <span className="font-mono text-[9px] lowercase bg-[#e4e4e7] text-[#71717a] py-0.5 px-1.5 rounded">
                Enter or Tab
              </span>
            </span>
            <ul className="my-1 max-h-48 overflow-y-auto space-y-1 p-1 w-full flex flex-col">
              {filteredVariables.map((v, i) => (
                <li
                  key={v.name}
                  onClick={() => insertVariable(v.name)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`flex items-center gap-2 cursor-pointer px-2 py-1.5 text-xs font-mono rounded w-full ${
                    selectedIndex === i
                      ? "bg-[#7c5cfc]/10 text-[#7c5cfc]"
                      : "text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#09090b]"
                  }`}
                >
                  <Braces size={12} className="shrink-0" />
                  <span className="truncate">{v.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
