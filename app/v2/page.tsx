"use client";

import React, { useState } from "react";
import {
  Folder,
  FileText,
  History,
  Settings,
  ChevronDown,
  Play,
  Download,
  Copy,
  Plus,
  MoreHorizontal,
  Cpu,
  Zap,
  DollarSign,
  GripVertical,
  Braces,
  Library,
  Clock,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";

export function Workspace() {
  const [activeTab, setActiveTab] = useState("editor");
  const [activeModel, setActiveModel] = useState("Claude 3.5 Sonnet");

  return (
    <div className="flex h-full w-full bg-[#ffffff] text-[#09090b] font-sans overflow-hidden selection:bg-[#7c5cfc] selection:bg-opacity-30 text-left">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#e4e4e7] bg-[#fafafa] flex flex-col shrink-0">
        <div className="h-14 flex items-center px-4 border-b border-[#e4e4e7]">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-[#7c5cfc] to-[#22d4c8] flex items-center justify-center text-xs font-bold text-white mr-3 shadow-[0_0_10px_rgba(124,92,252,0.4)]">
            P
          </div>
          <span className="font-semibold text-sm tracking-wide">PromptOps</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          <div>
            <div className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider mb-2 px-2">
              Workspace
            </div>
            <div className="space-y-0.5">
              <SidebarItem icon={<Folder size={14} />} label="Projects" />
              <SidebarItem icon={<Library size={14} />} label="Templates" />
              <SidebarItem icon={<FileText size={14} />} label="My Prompts" active />
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider mb-2 px-2">
              History
            </div>
            <div className="space-y-0.5">
              <SidebarItem
                icon={<Clock size={14} />}
                label="v3 - Added constra..."
                text="10m ago"
              />
              <SidebarItem
                icon={<Clock size={14} />}
                label="v2 - Claude opti..."
                text="1h ago"
              />
              <SidebarItem
                icon={<Clock size={14} />}
                label="v1 - Initial draft"
                text="2h ago"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#e4e4e7]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#e4e4e7] flex items-center justify-center text-xs">
              U
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium">User Account</span>
              <span className="text-[10px] text-[#a1a1aa]">Free Plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Nav / Metrics Bar */}
        <div className="h-14 border-b border-[#e4e4e7] bg-[#ffffff] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-[#71717a]">
              <span>My Prompts</span>
              <span>/</span>
              <span className="text-[#09090b] font-medium flex items-center gap-2">
                E-commerce Scraper{" "}
                <Settings
                  size={14}
                  className="text-[#a1a1aa] cursor-pointer hover:text-[#09090b]"
                />
              </span>
            </div>
            <div className="h-4 w-px bg-[#e4e4e7]"></div>
            <button className="flex items-center gap-2 text-xs text-[#71717a] hover:text-[#09090b] transition-colors">
              <SlidersHorizontal size={14} />
              Parameters
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-[11px] text-[#71717a] font-mono mr-2 hidden md:flex">
              <div className="flex items-center gap-1.5">
                <Cpu size={12} className="text-[#7c5cfc]" /> ~450 tokens
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign size={12} className="text-[#22d4c8]" /> $0.0015
              </div>
              <div className="flex items-center gap-1.5">
                <Zap size={12} className="text-[#f59e0b]" /> 800ms
              </div>
            </div>

            <div className="flex items-center bg-[#ffffff] border border-[#e4e4e7] rounded-lg p-1">
              <button
                onClick={() => setActiveTab("editor")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "editor"
                    ? "bg-[#e4e4e7] text-white"
                    : "text-[#71717a] hover:text-white"
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setActiveTab("test")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "test"
                    ? "bg-[#e4e4e7] text-white"
                    : "text-[#71717a] hover:text-white"
                }`}
              >
                Test
              </button>
            </div>

            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#ffffff] hover:bg-[#f4f4f5] border border-[#e4e4e7] rounded-lg text-xs font-medium transition-colors">
              <Download size={14} />
              Export
            </button>

            <button className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#7c5cfc] to-[#5a3fd4] hover:from-[#8d70fc] hover:to-[#6a4fe4] text-white rounded-lg text-xs font-medium transition-all shadow-[0_0_15px_rgba(124,92,252,0.3)]">
              <Play size={12} fill="currentColor" />
              Run
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Chat/Assistant Panel (Left) */}
          <div className="w-[350px] border-r border-[#e4e4e7] bg-[#fafafa] flex flex-col shrink-0 hidden lg:flex">
            <div className="p-4 border-b border-[#e4e4e7] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#7c5cfc]" />
                <span className="text-sm font-medium">Prompt Assistant</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <ChatMessage
                role="assistant"
                content="I've structured your prompt for the e-commerce scraper. I added constraints for rate limiting and structured the output format. Would you like me to add proxy rotation details?"
              />
              <ChatMessage
                role="user"
                content="Yes, please add proxy rotation using a hypothetical proxy pool."
              />
              <ChatMessage
                role="assistant"
                content="Updated the prompt. I added a new block for 'Execution Constraints' and defined the proxy rotation logic. You can see the updated blocks in the editor."
              />
            </div>

            <div className="p-4 border-t border-[#e4e4e7] bg-[#ffffff]">
              <div className="relative">
                <textarea
                  placeholder="Ask the AI to refine this prompt..."
                  className="w-full bg-[#ffffff] border border-[#d4d4d8] rounded-xl p-3 pr-10 text-sm text-[#09090b] placeholder-[#a1a1aa] focus:outline-none focus:border-[#7c5cfc] resize-none h-[80px]"
                />
                <button className="absolute right-3 bottom-3 p-1.5 bg-[#7c5cfc] rounded-md text-white hover:bg-[#8d70fc] transition-colors">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Main Canvas */}
          <div className="flex-1 bg-[#ffffff] overflow-y-auto p-8 relative">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold tracking-tight">
                  E-commerce Scraper
                </h1>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#a1a1aa] mr-2">
                    Target Model:
                  </span>
                  <div className="flex items-center gap-2 bg-[#ffffff] border border-[#e4e4e7] rounded-lg px-3 py-1.5 text-xs cursor-pointer hover:border-[#d4d4d8]">
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                    {activeModel}
                    <ChevronDown size={14} className="text-[#a1a1aa]" />
                  </div>
                </div>
              </div>

              {/* Variables Section */}
              <div className="mb-8 p-5 bg-[#ffffff] border border-[#e4e4e7] rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Braces size={16} className="text-[#22d4c8]" />
                    <h3 className="text-sm font-semibold">Variables</h3>
                  </div>
                  <button className="text-[11px] text-[#22d4c8] font-medium flex items-center gap-1 hover:text-[#45e8dc]">
                    <Plus size={12} /> Add Variable
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <VariableTag
                    name="target_url"
                    value="https://example.com/products"
                  />
                  <VariableTag name="max_concurrency" value="5" />
                  <VariableTag name="output_format" value="json" />
                </div>
              </div>

              {/* Prompt Blocks */}
              <div className="space-y-4">
                <PromptBlock
                  title="System Instruction"
                  color="#7c5cfc"
                  content="You are an expert Python developer specializing in high-performance web scraping and data extraction. Your task is to write production-ready, robust, and ethical web scrapers."
                />

                <PromptBlock
                  title="Goal"
                  color="#22d4c8"
                  content={`Build a Python web scraper using \`aiohttp\` and \`BeautifulSoup\` to extract product pricing data from {{target_url}}.`}
                />

                <PromptBlock
                  title="Constraints"
                  color="#f59e0b"
                  content={`- Implement exponential backoff for 429 and 5xx errors.\n- Max concurrency must not exceed {{max_concurrency}}.\n- Implement proxy rotation from a provided list of proxies.\n- Respect robots.txt if present.`}
                />

                <PromptBlock
                  title="Output Format"
                  color="#10b981"
                  content={`Provide the complete code in a single Python file. Also provide an example of the expected {{output_format}} output.`}
                />
              </div>

              {/* Add Block Button */}
              <button className="w-full mt-4 py-3 border border-dashed border-[#d4d4d8] rounded-xl text-sm text-[#a1a1aa] hover:text-[#71717a] hover:border-[#d4d4d8] transition-colors flex items-center justify-center gap-2 bg-[#fafafa]">
                <Plus size={16} /> Add Block
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  text,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  text?: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        active
          ? "bg-[#e4e4e7] text-white"
          : "text-[#71717a] hover:bg-[#f4f4f5] hover:text-white"
      }`}
    >
      <div className="flex items-center gap-2.5 truncate">
        <span className="shrink-0">{icon}</span>
        <span className="text-sm truncate">{label}</span>
      </div>
      {text && <span className="text-[10px] text-[#a1a1aa] shrink-0 ml-2">{text}</span>}
    </div>
  );
}

function ChatMessage({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  return (
    <div className={`flex gap-3 ${role === "user" ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-7 h-7 rounded flex-shrink-0 flex items-center justify-center ${
          role === "assistant"
            ? "bg-[#7c5cfc]/10 border border-[#7c5cfc]/30 text-[#7c5cfc]"
            : "bg-[#e4e4e7] text-[#71717a]"
        }`}
      >
        {role === "assistant" ? <Sparkles size={14} /> : "U"}
      </div>
      <div
        className={`text-[13px] leading-relaxed p-3 rounded-lg ${
          role === "assistant"
            ? "bg-transparent text-[#09090b]"
            : "bg-[#e4e4e7] text-[#09090b]"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

function VariableTag({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-col bg-[#ffffff] border border-[#e4e4e7] rounded-lg overflow-hidden w-64 shrink-0">
      <div className="bg-[#f4f4f5] px-3 py-1.5 border-b border-[#e4e4e7] flex justify-between items-center">
        <span className="text-xs font-mono text-[#22d4c8]">{`{{${name}}}`}</span>
        <MoreHorizontal size={14} className="text-[#a1a1aa] cursor-pointer" />
      </div>
      <div className="px-3 py-2">
        <span className="text-xs text-[#71717a] truncate block">{value}</span>
      </div>
    </div>
  );
}

function PromptBlock({
  title,
  color,
  content,
}: {
  title: string;
  color: string;
  content: string;
}) {
  return (
    <div className="group relative bg-[#ffffff] border border-[#e4e4e7] rounded-xl overflow-hidden hover:border-[#d4d4d8] transition-colors shadow-sm">
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: color }}
      ></div>

      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e4e4e7] bg-[#fafafa]">
        <div className="flex items-center gap-3">
          <div className="cursor-grab text-[#d4d4d8] hover:text-[#71717a]">
            <GripVertical size={16} />
          </div>
          <span
            className="text-xs font-bold tracking-wider uppercase"
            style={{ color }}
          >
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 text-[#a1a1aa] hover:text-[#09090b]">
            <Copy size={14} />
          </button>
          <button className="p-1 text-[#a1a1aa] hover:text-[#09090b]">
            <Settings size={14} />
          </button>
        </div>
      </div>

      <div className="p-4 pl-5">
        <textarea
          className="w-full bg-transparent text-[#09090b] text-[15px] leading-relaxed resize-none focus:outline-none"
          defaultValue={content}
          rows={content.split("\n").length}
          spellCheck="false"
        />
      </div>
    </div>
  );
}

export function WorkspaceCompact() {
  const [activeTab, setActiveTab] = useState("editor");
  const [activeModel, setActiveModel] = useState("Claude 3.5 Sonnet");

  return (
    <div className="flex h-full w-full bg-[#ffffff] text-[#09090b] font-sans overflow-hidden selection:bg-[#7c5cfc] selection:bg-opacity-30 text-left">
      {/* Icon-only Sidebar */}
      <div className="w-16 border-r border-[#e4e4e7] bg-[#fafafa] flex flex-col shrink-0 items-center py-4 space-y-8">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-[#7c5cfc] to-[#22d4c8] flex items-center justify-center text-sm font-bold text-white shadow-[0_0_10px_rgba(124,92,252,0.4)]">
          P
        </div>

        <div className="flex-1 flex flex-col items-center space-y-6 w-full">
          <div className="p-2 rounded-lg text-[#71717a] hover:bg-[#f4f4f5] hover:text-white cursor-pointer transition-colors">
            <Folder size={18} />
          </div>
          <div className="p-2 rounded-lg text-[#71717a] hover:bg-[#f4f4f5] hover:text-white cursor-pointer transition-colors">
            <Library size={18} />
          </div>
          <div className="p-2 rounded-lg bg-[#e4e4e7] text-white cursor-pointer transition-colors">
            <FileText size={18} />
          </div>
          <div className="p-2 rounded-lg text-[#71717a] hover:bg-[#f4f4f5] hover:text-white cursor-pointer transition-colors">
            <History size={18} />
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-[#e4e4e7] flex items-center justify-center text-xs">
          U
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Nav / Metrics Bar */}
        <div className="h-14 border-b border-[#e4e4e7] bg-[#ffffff] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[#09090b] font-medium text-sm flex items-center gap-2 truncate">
              E-commerce Scraper
              <ChevronDown size={14} className="text-[#a1a1aa] shrink-0" />
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-4">
            <div className="flex items-center bg-[#ffffff] border border-[#e4e4e7] rounded-lg p-1">
              <button
                onClick={() => setActiveTab("editor")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "editor"
                    ? "bg-[#e4e4e7] text-white"
                    : "text-[#71717a] hover:text-white"
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setActiveTab("test")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "test"
                    ? "bg-[#e4e4e7] text-white"
                    : "text-[#71717a] hover:text-white"
                }`}
              >
                Test
              </button>
            </div>

            <button className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-[#7c5cfc] to-[#5a3fd4] hover:from-[#8d70fc] hover:to-[#6a4fe4] text-white rounded-lg transition-all shadow-[0_0_15px_rgba(124,92,252,0.3)]">
              <Play size={12} fill="currentColor" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Canvas */}
          <div className="flex-1 bg-[#ffffff] overflow-y-auto p-5 relative">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold tracking-tight">
                  Prompt Flow
                </h1>

                <div className="flex items-center gap-2 bg-[#ffffff] border border-[#e4e4e7] rounded-lg px-3 py-1.5 text-xs cursor-pointer hover:border-[#d4d4d8]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></div>
                  {activeModel}
                </div>
              </div>

              {/* Variables Section */}
              <div className="mb-6 p-4 bg-[#ffffff] border border-[#e4e4e7] rounded-xl overflow-x-auto hide-scrollbar">
                <div className="flex items-center justify-between mb-4 min-w-max">
                  <div className="flex items-center gap-2">
                    <Braces size={16} className="text-[#22d4c8]" />
                    <h3 className="text-sm font-semibold">Variables</h3>
                  </div>
                  <button className="text-[11px] text-[#22d4c8] font-medium flex items-center gap-1 hover:text-[#45e8dc] ml-4">
                    <Plus size={12} /> Add
                  </button>
                </div>

                <div className="flex gap-3 min-w-max">
                  <VariableTag
                    name="target_url"
                    value="https://example.com/products"
                  />
                  <VariableTag name="max_concurrency" value="5" />
                </div>
              </div>

              {/* Prompt Blocks */}
              <div className="space-y-4">
                <PromptBlock
                  title="System Instruction"
                  color="#7c5cfc"
                  content="You are an expert Python developer specializing in high-performance web scraping and data extraction."
                />

                <PromptBlock
                  title="Goal"
                  color="#22d4c8"
                  content={`Build a Python web scraper using \`aiohttp\` and \`BeautifulSoup\` to extract product pricing data from {{target_url}}.`}
                />

                <PromptBlock
                  title="Constraints"
                  color="#f59e0b"
                  content={`- Implement exponential backoff for 429 and 5xx errors.\n- Max concurrency must not exceed {{max_concurrency}}.\n- Respect robots.txt.`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="h-screen w-full">
      <Workspace />
    </div>
  );
}
