"use client";

import React, { useState } from "react";
import {
  Clock,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Save,
} from "lucide-react";
import { WordmarkIcon } from "@/components/ui/header-2";
import type { VersionEntry } from "../hooks/useWorkspaceData";
import posthog from "posthog-js";

type SaveStatus = "saved" | "saving" | "unsaved" | "error";

interface WorkspaceSidebarProps {
  versions: VersionEntry[];
  saveStatus: SaveStatus;
  onSaveVersion: (label?: string) => Promise<void>;
  onRestoreVersion: (versionId: string) => Promise<void>;
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

export function WorkspaceSidebar({
  versions,
  saveStatus,
  onSaveVersion,
  onRestoreVersion,
}: WorkspaceSidebarProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [activeVersionId, setActiveVersionId] = useState<string | null>(
    versions[0]?.id ?? null,
  );

  const handleSave = async () => {
    setSaving(true);
    await onSaveVersion();
    posthog.capture("version_saved", { version_count: versions.length + 1 });
    setSaving(false);
    if (versions[0]) setActiveVersionId(versions[0].id);
  };

  const handleRestore = async (versionId: string) => {
    if (restoringId) return;
    setRestoringId(versionId);
    try {
      await onRestoreVersion(versionId);
      posthog.capture("version_restored", { version_id: versionId });
      setActiveVersionId(versionId);
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div
      className="border-r border-[#e4e4e7] bg-[#fafafa] flex flex-col shrink-0 transition-[width] duration-300 ease-in-out overflow-hidden"
      style={{ width: collapsed ? 56 : 240 }}
      data-nextstep="sidebar"
    >
      {/* Brand header */}
      <div
        className={`h-14 flex items-center border-b border-[#e4e4e7] shrink-0 px-3 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && <WordmarkIcon className="text-base text-[#09090b]" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="shrink-0 p-1.5 rounded-md text-[#a1a1aa] hover:text-[#09090b] hover:bg-[#f4f4f5] transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
        </button>
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
          <button
            onClick={handleSave}
            disabled={saving || saveStatus === "saving"}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#e4e4e7] bg-[#ffffff] text-xs font-medium text-[#71717a] hover:text-[#09090b] hover:border-[#d4d4d8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={12} />
            Add Version
          </button>

          <div>
            <div className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider mb-2 px-1">
              Version History
            </div>

            {versions.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center px-2">
                <div className="w-8 h-8 rounded-lg bg-[#f4f4f5] flex items-center justify-center">
                  <Clock size={14} className="text-[#d4d4d8]" />
                </div>
                <p className="text-[11px] text-[#a1a1aa] leading-snug">
                  No versions saved yet. Save a version to track changes.
                </p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {versions.map((item) => {
                  const isActive = (activeVersionId ?? versions[0]?.id) === item.id;
                  const isRestoring = restoringId === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleRestore(item.id)}
                      disabled={!!restoringId}
                      className={`w-full flex items-center justify-between px-2 py-2 rounded-lg transition-colors text-left disabled:cursor-not-allowed ${
                        isActive
                          ? "bg-[#7c5cfc]/8 text-[#09090b]"
                          : "text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#09090b]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isRestoring ? (
                          <Loader2 size={13} className="shrink-0 animate-spin text-[#7c5cfc]" />
                        ) : (
                          <RotateCcw
                            size={13}
                            className={`shrink-0 ${isActive ? "text-[#7c5cfc]" : "text-[#d4d4d8]"}`}
                          />
                        )}
                        <span className="text-sm truncate">
                          {item.label ?? `v${item.version_num}`}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#a1a1aa] shrink-0 ml-2">
                        {timeAgo(item.created_at)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {collapsed && <div className="flex-1" />}

      {/* Save status */}
      {collapsed && saveStatus === "unsaved" && (
        <div className="flex justify-center pb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" title="Unsaved changes" />
        </div>
      )}
      {!collapsed && saveStatus !== "saved" && (
        <div className="px-4 py-2 border-t border-[#e4e4e7] shrink-0">
          <span
            className={`text-[10px] ${
              saveStatus === "saving"
                ? "text-[#a1a1aa]"
                : saveStatus === "unsaved"
                  ? "text-[#f59e0b]"
                  : "text-[#ef4444]"
            }`}
          >
            {saveStatus === "saving"
              ? "Saving…"
              : saveStatus === "unsaved"
                ? "Unsaved changes"
                : "Save failed"}
          </span>
        </div>
      )}
    </div>
  );
}
