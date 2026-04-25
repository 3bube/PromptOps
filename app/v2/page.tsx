"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import {
  Play,
  Download,
  Copy,
  Plus,
  GripVertical,
  Braces,
  Clock,
  ArrowUp,
  PanelLeftOpen,
  PanelLeftClose,
  Save,
  RotateCcw,
  Trash2,
  Check,
  X,
  Loader2,
  Layers,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Folder,
  Library,
  FileText,
  History,
} from "lucide-react";
import { WordmarkIcon } from "@/components/ui/header-2";

const COLORS = [
  "#7c5cfc",
  "#22d4c8",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
];

type Block = { id: string; title: string; color: string; content: string };
type Variable = { name: string; value: string };
type Message = { role: "user" | "assistant"; content: string };
type Version = {
  id: string;
  label: string;
  version_num: number;
  created_at: string;
};

const MOCK_RESPONSES = [
  "I've updated the blocks based on your request. Let me know if you'd like any further refinements.",
  "Done! I've incorporated that into the relevant blocks. Want me to adjust the tone or add more technical details?",
  "Great idea. I've added that constraint to the appropriate block. You can edit it directly or ask me to make more changes.",
  "Updated. The prompt now reflects that requirement. Should I also adjust the output format block?",
];

const INITIAL_BLOCKS: Block[] = [
  {
    id: "1",
    title: "System Instruction",
    color: "#7c5cfc",
    content:
      "You are an expert Python developer specializing in high-performance web scraping and data extraction. Your task is to write production-ready, robust, and ethical web scrapers.",
  },
  {
    id: "2",
    title: "Goal",
    color: "#22d4c8",
    content:
      "Build a Python web scraper using `aiohttp` and `BeautifulSoup` to extract product pricing data from {{target_url}}.",
  },
  {
    id: "3",
    title: "Constraints",
    color: "#f59e0b",
    content:
      "- Implement exponential backoff for 429 and 5xx errors.\n- Max concurrency must not exceed {{max_concurrency}}.\n- Implement proxy rotation from a provided list of proxies.\n- Respect robots.txt if present.",
  },
  {
    id: "4",
    title: "Output Format",
    color: "#10b981",
    content:
      "Provide the complete code in a single Python file. Also provide an example of the expected {{output_format}} output.",
  },
];

const INITIAL_VARS: Variable[] = [
  { name: "target_url", value: "https://example.com/products" },
  { name: "max_concurrency", value: "5" },
  { name: "output_format", value: "json" },
];

const INITIAL_VERSIONS: Version[] = [
  {
    id: "v3",
    label: "v3",
    version_num: 3,
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: "v2",
    label: "v2",
    version_num: 2,
    created_at: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: "v1",
    label: "v1",
    version_num: 1,
    created_at: new Date(Date.now() - 120 * 60000).toISOString(),
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    content:
      "I've structured your prompt for the e-commerce scraper. I added constraints for rate limiting and structured the output format. Would you like me to add proxy rotation details?",
  },
  {
    role: "user",
    content: "Yes, please add proxy rotation using a hypothetical proxy pool.",
  },
  {
    role: "assistant",
    content:
      "Updated the prompt. I added proxy rotation logic to the Constraints block. You can see the updated content in the editor.",
  },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

//actual workspace being used
export function Workspace() {
  const [activeTab, setActiveTab] = useState("editor");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);
  const [variables, setVariables] = useState<Variable[]>(INITIAL_VARS);
  const [versions, setVersions] = useState<Version[]>(INITIAL_VERSIONS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [activeVersionId, setActiveVersionId] = useState("v3");
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">(
    "saved",
  );
  const [input, setInput] = useState("");
  const [assistantTyping, setAssistantTyping] = useState(false);
  const [addingVariable, setAddingVariable] = useState(false);
  const [newVarName, setNewVarName] = useState("");
  const [testRunState, setTestRunState] = useState<
    "idle" | "running" | "done" | "error"
  >("idle");
  const [testOutput, setTestOutput] = useState("");
  const [testUserMessage, setTestUserMessage] = useState("");
  const [testTokenCount, setTestTokenCount] = useState(0);
  const [testPromptScore, setTestPromptScore] = useState<number | null>(null);
  const [showCompiledPrompt, setShowCompiledPrompt] = useState(false);
  const [testCopied, setTestCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mockResponseIdx = useRef(0);
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, assistantTyping]);

  const markUnsaved = useCallback(() => setSaveStatus("unsaved"), []);

  const updateBlock = useCallback(
    (id: string, content: string) => {
      setBlocks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, content } : b)),
      );
      markUnsaved();
    },
    [markUnsaved],
  );

  const updateBlockTitle = useCallback(
    (id: string, title: string) => {
      setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, title } : b)));
      markUnsaved();
    },
    [markUnsaved],
  );

  const deleteBlock = useCallback(
    (id: string) => {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
      markUnsaved();
    },
    [markUnsaved],
  );

  const addBlock = useCallback(() => {
    const position = blocks.length;
    const color = COLORS[position % COLORS.length];
    const existingTitles = new Set(blocks.map((b) => b.title));
    let title = "New Block";
    let n = 2;
    while (existingTitles.has(title)) title = `New Block ${n++}`;
    setBlocks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, color, content: "" },
    ]);
    markUnsaved();
  }, [blocks, markUnsaved]);

  const updateVariable = useCallback(
    (name: string, value: string) => {
      setVariables((prev) =>
        prev.map((v) => (v.name === name ? { ...v, value } : v)),
      );
      markUnsaved();
    },
    [markUnsaved],
  );

  const deleteVariable = useCallback(
    (name: string) => {
      setVariables((prev) => prev.filter((v) => v.name !== name));
      markUnsaved();
    },
    [markUnsaved],
  );

  const addVariable = useCallback(() => {
    const trimmed = newVarName.trim().replace(/\s+/g, "_");
    if (!trimmed || variables.some((v) => v.name === trimmed)) return;
    setVariables((prev) => [...prev, { name: trimmed, value: "" }]);
    setNewVarName("");
    setAddingVariable(false);
    markUnsaved();
  }, [newVarName, variables, markUnsaved]);

  const saveVersion = useCallback(() => {
    setSaveStatus("saving");
    setTimeout(() => {
      const newVer: Version = {
        id: `v${versions.length + 1}`,
        label: `v${versions.length + 1}`,
        version_num: versions.length + 1,
        created_at: new Date().toISOString(),
      };
      setVersions((prev) => [newVer, ...prev]);
      setActiveVersionId(newVer.id);
      setSaveStatus("saved");
    }, 600);
  }, [versions.length]);

  const sendMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || assistantTyping) return;
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setAssistantTyping(true);
    setTimeout(
      () => {
        const reply =
          MOCK_RESPONSES[mockResponseIdx.current % MOCK_RESPONSES.length];
        mockResponseIdx.current += 1;
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        setAssistantTyping(false);
      },
      1200 + Math.random() * 800,
    );
  }, [input, assistantTyping]);

  const compilePrompt = useCallback(
    () =>
      blocks
        .map((b) => {
          let content = b.content;
          variables.forEach((v) => {
            content = content.replaceAll(`{{${v.name}}}`, v.value);
          });
          return `[${b.title}]\n${content}`;
        })
        .join("\n\n"),
    [blocks, variables],
  );

  const handleTestRun = useCallback(() => {
    if (testRunState === "running") return;
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);

    setTestRunState("running");
    setTestOutput("");
    setTestTokenCount(0);
    setTestPromptScore(null);

    const compiled = compilePrompt();
    let score = 20;
    if (compiled.length > 200) score += 20;
    if (variables.length > 0) score += 20;
    if (blocks.length > 1) score += 20;
    if (/(markdown|json|xml|format|structure|output)/i.test(compiled))
      score += 20;
    const finalScore = Math.min(100, score);

    const targetUrl =
      variables.find((v) => v.name === "target_url")?.value ??
      "https://example.com/products";
    const maxConcurrency =
      variables.find((v) => v.name === "max_concurrency")?.value ?? "5";
    const outputFormat =
      variables.find((v) => v.name === "output_format")?.value ?? "json";

    const mockOutput = `## Scraper Implementation

Here's a production-ready async scraper based on your prompt:

\`\`\`python
import asyncio
import aiohttp
from bs4 import BeautifulSoup

async def scrape_products(target_url: str, max_concurrency: int = ${maxConcurrency}):
    semaphore = asyncio.Semaphore(max_concurrency)
    results = []

    async with aiohttp.ClientSession() as session:
        async def fetch(url: str):
            async with semaphore:
                for attempt in range(5):
                    try:
                        async with session.get(url) as r:
                            if r.status in (429, 500, 502, 503):
                                await asyncio.sleep(2 ** attempt)
                                continue
                            html = await r.text()
                            soup = BeautifulSoup(html, "html.parser")
                            # Parse product data...
                            return {"url": url, "status": r.status}
                    except aiohttp.ClientError:
                        await asyncio.sleep(2 ** attempt)

        await fetch("${targetUrl}")
    return results
\`\`\`

### Sample Output (${outputFormat})

\`\`\`${outputFormat}
{
  "products": [
    {"name": "Widget Pro", "price": 29.99, "in_stock": true, "url": "${targetUrl}"},
    {"name": "Widget Max", "price": 49.99, "in_stock": false, "url": "${targetUrl}"}
  ],
  "scraped_at": "${new Date().toISOString()}",
  "concurrent_workers": ${maxConcurrency},
  "source": "${targetUrl}"
}
\`\`\`

### Notes
- Exponential backoff handles 429 and 5xx errors automatically
- robots.txt is checked before crawling begins
- Proxy rotation can be added via \`aiohttp.TCPConnector\``;

    const chunkSize = 8;
    let i = 0;
    streamIntervalRef.current = setInterval(() => {
      i += chunkSize;
      setTestOutput(mockOutput.slice(0, i));
      if (i >= mockOutput.length) {
        clearInterval(streamIntervalRef.current!);
        streamIntervalRef.current = null;
        setTestTokenCount(Math.ceil(mockOutput.length / 4));
        setTestPromptScore(finalScore);
        setTestRunState("done");
      }
    }, 16);
  }, [testRunState, compilePrompt, variables, blocks]);

  return (
    <div className="flex h-full w-full bg-[#ffffff] text-[#09090b] overflow-hidden text-left">
      {/* Sidebar */}
      <div
        className="border-r border-[#e4e4e7] bg-[#fafafa] flex flex-col shrink-0 transition-[width] duration-300 ease-in-out overflow-hidden"
        style={{ width: sidebarCollapsed ? 56 : 240 }}
      >
        {/* Brand header */}
        <div
          className={`h-14 flex items-center border-b border-[#e4e4e7] shrink-0 px-3 ${sidebarCollapsed ? "justify-center" : "justify-between"}`}
        >
          {!sidebarCollapsed && <WordmarkIcon />}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="shrink-0 p-1.5 rounded-md text-[#a1a1aa] hover:text-[#09090b] hover:bg-[#f4f4f5] transition-colors"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={15} />
            ) : (
              <PanelLeftClose size={15} />
            )}
          </button>
        </div>

        {!sidebarCollapsed && (
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
            <button
              onClick={saveVersion}
              disabled={saveStatus === "saving"}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#e4e4e7] bg-[#ffffff] text-xs font-medium text-[#71717a] hover:text-[#09090b] hover:border-[#d4d4d8] transition-colors disabled:opacity-50"
            >
              {saveStatus === "saving" ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Save size={12} />
              )}
              Add Version
            </button>

            <div>
              <div className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-wider mb-2 px-1">
                Version History
              </div>
              <div className="space-y-0.5">
                {versions.map((ver) => {
                  const isActive = activeVersionId === ver.id;
                  return (
                    <button
                      key={ver.id}
                      onClick={() => setActiveVersionId(ver.id)}
                      className={`w-full flex items-center justify-between px-2 py-2 rounded-lg transition-colors text-left ${isActive ? "bg-[#7c5cfc]/8 text-[#09090b]" : "text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#09090b]"}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <RotateCcw
                          size={13}
                          className={`shrink-0 ${isActive ? "text-[#7c5cfc]" : "text-[#d4d4d8]"}`}
                        />
                        <span className="text-sm truncate">{ver.label}</span>
                      </div>
                      <span className="text-[10px] text-[#a1a1aa] shrink-0 ml-2">
                        {timeAgo(ver.created_at)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {sidebarCollapsed && <div className="flex-1" />}

        {sidebarCollapsed && saveStatus === "unsaved" && (
          <div className="flex justify-center pb-3">
            <div
              className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"
              title="Unsaved changes"
            />
          </div>
        )}
        {!sidebarCollapsed && saveStatus === "unsaved" && (
          <div className="px-4 py-2 border-t border-[#e4e4e7] shrink-0">
            <span className="text-[10px] text-[#f59e0b]">Unsaved changes</span>
          </div>
        )}
      </div>

      {/* Main (topbar + content) */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar */}
        <div className="h-14 border-b border-[#e4e4e7] bg-[#ffffff] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2 text-sm text-[#71717a] min-w-0">
            <span className="hidden sm:inline shrink-0">My Prompts</span>
            <span className="hidden sm:inline shrink-0">/</span>
            <span className="text-[#09090b] font-medium truncate">
              E-commerce Scraper
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center bg-[#f4f4f5] rounded-lg p-1 gap-0.5">
              {["editor", "test"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${activeTab === tab ? "bg-[#ffffff] text-[#09090b] shadow-sm" : "text-[#71717a] hover:text-[#09090b]"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#ffffff] hover:bg-[#f4f4f5] border border-[#e4e4e7] rounded-lg text-xs font-medium transition-colors">
              <Download size={13} />
              Export
            </button>

            <button
              onClick={() => setActiveTab("test")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7c5cfc] hover:bg-[#6a4fe4] text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
            >
              <Play size={11} fill="currentColor" />
              Run
            </button>

            <div className="w-px h-5 bg-[#e4e4e7]" />
            <div className="w-7 h-7 rounded-full bg-[#7c5cfc] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
              E
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {activeTab === "editor" ? (
            <>
              {/* Assistant Panel */}
              <div className="w-[350px] border-r border-[#e4e4e7] bg-[#fafafa] flex-col shrink-0 hidden lg:flex h-full min-h-0">
                <div className="p-4 border-b border-[#e4e4e7] shrink-0">
                  <span className="text-sm font-semibold">
                    Prompt Assistant
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 min-h-0">
                  <div className="flex flex-col gap-4">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex gap-2.5 max-w-[95%] ${msg.role === "user" ? "flex-row-reverse ml-auto" : ""}`}
                      >
                        <div
                          className={`w-6 h-6 rounded shrink-0 flex items-center justify-center text-[11px] ${msg.role === "user" ? "bg-[#e4e4e7] text-[#71717a]" : ""}`}
                        >
                          {msg.role === "assistant" ? (
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#22d4c8]" />
                          ) : (
                            "U"
                          )}
                        </div>
                        <div
                          className={
                            msg.role === "user"
                              ? "bg-[#e4e4e7] text-[#09090b] px-3 py-2 rounded-xl text-[13px] leading-relaxed max-w-[82%]"
                              : "text-[#09090b] text-[13px] leading-relaxed"
                          }
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {assistantTyping && (
                      <div className="flex gap-2.5">
                        <div className="w-6 h-6 rounded shrink-0 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#22d4c8]" />
                        </div>
                        <span className="flex gap-1 pt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] animate-bounce [animation-delay:0ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] animate-bounce [animation-delay:300ms]" />
                        </span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="p-3 border-t border-[#e4e4e7] bg-[#ffffff] shrink-0">
                  <div className="flex items-end gap-2 bg-[#fafafa] border border-[#e4e4e7] rounded-xl p-2 focus-within:border-[#7c5cfc] transition-colors">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Refine a block, type @ to tag one…"
                      rows={1}
                      className="flex-1 bg-transparent text-sm placeholder-[#a1a1aa] focus:outline-none resize-none leading-relaxed"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || assistantTyping}
                      className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-[#7c5cfc] hover:bg-[#6a4fe4] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
                    >
                      {assistantTyping ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <ArrowUp size={13} />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#a1a1aa] mt-1.5 px-1">
                    ↵ to send · Shift+↵ for newline
                  </p>
                </div>
              </div>

              {/* Prompt Canvas */}
              <div className="flex-1 bg-[#ffffff] overflow-y-auto p-8 relative">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight">
                      E-commerce Scraper
                    </h1>
                    <p className="text-sm text-[#a1a1aa] mt-1">
                      Compose your prompt using blocks. Use{" "}
                      <code className="font-mono bg-[#f4f4f5] px-1 py-0.5 rounded text-[#22d4c8] text-[11px]">
                        {"{{variable}}"}
                      </code>{" "}
                      to inject dynamic values.
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
                          No variables yet.
                        </p>
                      )}
                      {variables.map((v) => (
                        <MockVariableTag
                          key={v.name}
                          variable={v}
                          onChange={updateVariable}
                          onDelete={deleteVariable}
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
                                setNewVarName(
                                  e.target.value.replace(/\s/g, "_"),
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") addVariable();
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
                              onClick={addVariable}
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

                  {/* Blocks */}
                  {blocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-[#f4f4f5] flex items-center justify-center mb-4">
                        <Layers size={22} className="text-[#d4d4d8]" />
                      </div>
                      <p className="text-sm font-medium text-[#71717a]">
                        No blocks yet
                      </p>
                      <button
                        onClick={addBlock}
                        className="mt-5 flex items-center gap-2 px-4 py-2 bg-[#7c5cfc] hover:bg-[#6a4fe4] text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Plus size={15} /> Add First Block
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {blocks.map((block, i) => (
                          <MockPromptBlock
                            key={block.id}
                            block={block}
                            index={i}
                            variables={variables}
                            onContentChange={updateBlock}
                            onTitleChange={updateBlockTitle}
                            onDelete={deleteBlock}
                          />
                        ))}
                      </div>
                      <button
                        onClick={addBlock}
                        className="w-full mt-4 py-3 border border-dashed border-[#d4d4d8] rounded-xl text-sm text-[#a1a1aa] hover:text-[#71717a] hover:border-[#a1a1aa] transition-colors flex items-center justify-center gap-2 bg-[#fafafa] hover:bg-[#f4f4f5]"
                      >
                        <Plus size={16} /> Add Block
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Test Panel */
            <div className="flex-1 flex overflow-hidden bg-[#fafafa]">
              {/* Left: Input panel */}
              <div className="w-80 border-r border-[#e4e4e7] bg-[#ffffff] flex flex-col shrink-0">
                <div className="p-4 border-b border-[#e4e4e7]">
                  <h2 className="text-sm font-semibold text-[#09090b]">
                    Test Input
                  </h2>
                  <p className="text-[11px] text-[#a1a1aa] mt-0.5">
                    Set variable values and run against your prompt.
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                  {variables.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-3">
                        <Braces size={13} className="text-[#22d4c8]" />
                        <span className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider">
                          Variables
                        </span>
                      </div>
                      <div className="space-y-3">
                        {variables.map((v) => (
                          <div key={v.name}>
                            <label className="text-[11px] font-mono text-[#22d4c8] mb-1 block">{`{{${v.name}}}`}</label>
                            <input
                              type="text"
                              value={v.value}
                              onChange={(e) =>
                                updateVariable(v.name, e.target.value)
                              }
                              className="w-full bg-[#fafafa] border border-[#e4e4e7] rounded-lg px-3 py-2 text-sm text-[#09090b] placeholder-[#a1a1aa] focus:outline-none focus:border-[#7c5cfc] transition-colors font-mono"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider mb-2 block">
                      User Message{" "}
                      <span className="normal-case font-normal text-[#d4d4d8]">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      value={testUserMessage}
                      onChange={(e) => setTestUserMessage(e.target.value)}
                      placeholder="Add a user-turn message to test against your system prompt..."
                      rows={4}
                      className="w-full bg-[#fafafa] border border-[#e4e4e7] rounded-lg px-3 py-2 text-sm text-[#09090b] placeholder-[#a1a1aa] focus:outline-none focus:border-[#7c5cfc] transition-colors resize-none"
                    />
                  </div>

                  {blocks.length > 0 && (
                    <div>
                      <button
                        onClick={() =>
                          setShowCompiledPrompt(!showCompiledPrompt)
                        }
                        className="flex items-center gap-1.5 text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider w-full"
                      >
                        {showCompiledPrompt ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )}
                        Compiled Prompt Preview
                      </button>
                      {showCompiledPrompt && (
                        <div className="mt-2 bg-[#fafafa] border border-[#e4e4e7] rounded-lg p-3 text-[12px] font-mono text-[#71717a] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                          {compilePrompt()}
                        </div>
                      )}
                    </div>
                  )}

                  {blocks.length === 0 && (
                    <p className="text-[12px] text-[#a1a1aa] text-center py-4">
                      Add blocks in the Editor tab first.
                    </p>
                  )}
                </div>

                <div className="p-4 border-t border-[#e4e4e7]">
                  <button
                    onClick={handleTestRun}
                    disabled={testRunState === "running" || blocks.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7c5cfc] hover:bg-[#6a4fe4] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    {testRunState === "running" ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Running…
                      </>
                    ) : (
                      <>
                        <Play size={13} fill="currentColor" />
                        Run Test
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right: Output panel */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="h-12 border-b border-[#e4e4e7] bg-[#ffffff] flex items-center justify-between px-4 shrink-0">
                  <div className="flex items-center gap-2">
                    {testRunState === "done" && (
                      <CheckCircle2 size={14} className="text-[#10b981]" />
                    )}
                    {testRunState === "error" && (
                      <AlertCircle size={14} className="text-[#ef4444]" />
                    )}
                    <span className="text-sm font-medium text-[#09090b]">
                      {testRunState === "idle" && "Output"}
                      {testRunState === "running" && "Generating…"}
                      {testRunState === "done" && "Response"}
                      {testRunState === "error" && "Error"}
                    </span>
                  </div>

                  {(testRunState === "done" || testRunState === "error") &&
                    testOutput && (
                      <div className="flex items-center gap-3">
                        {testRunState === "done" && (
                          <div className="flex items-center gap-3">
                            {testPromptScore !== null && (
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${testPromptScore >= 80 ? "bg-emerald-100 text-emerald-700" : testPromptScore >= 50 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}
                              >
                                {testPromptScore >= 80
                                  ? "Great"
                                  : testPromptScore >= 50
                                    ? "Fair"
                                    : "Poor"}{" "}
                                ({testPromptScore}%)
                              </span>
                            )}
                            <span className="text-[11px] text-[#a1a1aa] font-mono">
                              ~{testTokenCount} tokens
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(testOutput);
                            setTestCopied(true);
                            setTimeout(() => setTestCopied(false), 2000);
                          }}
                          className="flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#09090b] transition-colors"
                        >
                          {testCopied ? (
                            <Check size={13} className="text-[#10b981]" />
                          ) : (
                            <Copy size={13} />
                          )}
                          {testCopied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {testRunState === "idle" && (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#f4f4f5] flex items-center justify-center mb-4">
                        <Play size={20} className="text-[#a1a1aa]" />
                      </div>
                      <p className="text-sm font-medium text-[#71717a]">
                        Ready to run
                      </p>
                      <p className="text-[12px] text-[#a1a1aa] mt-1 max-w-xs">
                        Fill in your variables and hit Run Test to see the
                        output.
                      </p>
                    </div>
                  )}

                  {testRunState === "running" && testOutput === "" && (
                    <div className="h-full flex flex-col items-center justify-center">
                      <Loader2
                        size={24}
                        className="animate-spin text-[#7c5cfc] mb-3"
                      />
                      <p className="text-sm text-[#71717a]">
                        Running your prompt…
                      </p>
                    </div>
                  )}

                  {(testRunState === "running" ||
                    testRunState === "done" ||
                    testRunState === "error") &&
                    testOutput &&
                    (testRunState === "error" ? (
                      <pre className="bg-[#ffffff] border border-[#fecaca] rounded-xl p-5 text-[13px] font-mono leading-loose whitespace-pre-wrap overflow-x-auto text-[#ef4444]">
                        {testOutput}
                      </pre>
                    ) : (
                      <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-xl p-5 text-[13px] leading-loose overflow-x-auto text-[#09090b] prose prose-sm max-w-none">
                        <ReactMarkdown>{testOutput}</ReactMarkdown>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MockVariableTag({
  variable,
  onChange,
  onDelete,
}: {
  variable: Variable;
  onChange: (name: string, value: string) => void;
  onDelete: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(variable.value);

  const commit = () => {
    onChange(variable.name, draft);
    setEditing(false);
  };

  return (
    <div className="group flex flex-col bg-[#ffffff] border border-[#e4e4e7] rounded-lg overflow-hidden w-56 shrink-0 hover:border-[#d4d4d8] transition-colors">
      <div className="bg-[#f4f4f5] px-3 py-1.5 border-b border-[#e4e4e7] flex justify-between items-center">
        <span className="text-xs font-mono text-[#22d4c8]">{`{{${variable.name}}}`}</span>
        <button
          onClick={() => onDelete(variable.name)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#a1a1aa] hover:text-[#ef4444]"
        >
          <X size={11} />
        </button>
      </div>
      <div className="px-3 py-2">
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") {
                setDraft(variable.value);
                setEditing(false);
              }
            }}
            className="w-full text-xs text-[#09090b] bg-transparent focus:outline-none"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-[#71717a] truncate block w-full text-left hover:text-[#09090b] transition-colors"
          >
            {variable.value || (
              <span className="text-[#d4d4d8] italic">no value</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function MockPromptBlock({
  block,
  index,
  variables,
  onContentChange,
  onTitleChange,
  onDelete,
}: {
  block: Block;
  index: number;
  variables: Variable[];
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(block.title);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

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

  const commitTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== block.title) onTitleChange(block.id, trimmed);
    else setTitleDraft(block.title);
    setEditingTitle(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(block.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderHighlighted = () => {
    const regex = /(\{\{[a-zA-Z0-9_]+\}\})/g;
    const parts = block.content.split(regex);
    return parts.map((part, i) => {
      if (regex.test(part)) {
        const varName = part.slice(2, -2);
        const exists = variables.some((v) => v.name === varName);
        if (exists)
          return (
            <span key={i} className="bg-[#7c5cfc]/20 text-[#7c5cfc] rounded-sm">
              {part}
            </span>
          );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="group relative bg-[#ffffff] border border-[#e4e4e7] rounded-xl transition-all shadow-sm hover:border-[#d4d4d8]">
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: block.color }}
      />

      <div className="flex items-center justify-between pl-5 pr-3 py-3 border-b border-[#e4e4e7] bg-[#fafafa]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="cursor-grab text-[#d4d4d8] hover:text-[#71717a] shrink-0">
            <GripVertical size={15} />
          </div>
          {editingTitle ? (
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
              style={{ color: block.color, borderColor: block.color + "60" }}
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
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
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="pl-5 pr-4 py-4 relative">
        <div className="relative text-[14px] leading-relaxed w-full font-mono">
          <div className="absolute top-0 left-0 w-full h-full text-[#09090b] whitespace-pre-wrap pointer-events-none break-words">
            {!block.content && (
              <span className="text-[#a1a1aa]">Enter prompt content…</span>
            )}
            {renderHighlighted()}
            {block.content.endsWith("\n") && " "}
          </div>
          <textarea
            ref={textareaRef}
            className="relative z-10 w-full bg-transparent resize-none focus:outline-none overflow-hidden"
            style={{ color: "transparent", caretColor: "#09090b" }}
            value={block.content}
            onChange={(e) => onContentChange(block.id, e.target.value)}
            spellCheck={false}
            rows={1}
          />
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
