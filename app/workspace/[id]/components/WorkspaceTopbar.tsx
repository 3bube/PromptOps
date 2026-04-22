"use client";

import { Settings, SlidersHorizontal, Download, Play } from "lucide-react";

interface TopbarProps {
  promptName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onExport: () => void;
  onRun: () => void;
}

export function WorkspaceTopbar({ promptName, activeTab, onTabChange, onExport, onRun }: TopbarProps) {
  return (
    <div className="h-14 border-b border-[#e4e4e7] bg-[#ffffff] flex items-center justify-between px-4 shrink-0">
      {/* Left: Breadcrumb + Parameters */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2 text-sm text-[#71717a] min-w-0">
          <span className="hidden sm:inline shrink-0">My Prompts</span>
          <span className="hidden sm:inline shrink-0">/</span>
          <span className="text-[#09090b] font-medium flex items-center gap-1.5 truncate">
            {promptName}
            <Settings size={13} className="text-[#a1a1aa] cursor-pointer hover:text-[#09090b] shrink-0" />
          </span>
        </div>
        <div className="h-4 w-px bg-[#e4e4e7] hidden sm:block" />
        <button className="hidden sm:flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#09090b] transition-colors shrink-0">
          <SlidersHorizontal size={13} />
          Parameters
        </button>
      </div>

      {/* Right: Tabs + Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center bg-[#f4f4f5] rounded-lg p-1 gap-0.5">
          {["editor", "test"].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                activeTab === tab
                  ? "bg-[#ffffff] text-[#09090b] shadow-sm"
                  : "text-[#71717a] hover:text-[#09090b]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={onExport}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#ffffff] hover:bg-[#f4f4f5] border border-[#e4e4e7] rounded-lg text-xs font-medium transition-colors"
          title="Export prompt as Markdown"
        >
          <Download size={13} />
          Export
        </button>

        <button
          onClick={onRun}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7c5cfc] hover:bg-[#6a4fe4] text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
          title="Run in Test tab"
        >
          <Play size={11} fill="currentColor" />
          Run
        </button>
      </div>
    </div>
  );
}
