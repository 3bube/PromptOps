"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Play,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Braces,
} from "lucide-react";
import type { Block, Variable } from "../types";
import posthog from "posthog-js";

type RunState = "idle" | "running" | "done" | "error";

interface TestPanelProps {
  blocks: Block[];
  variables: Variable[];
}

export function TestPanel({
  blocks,
  variables: initialVariables,
}: TestPanelProps) {
  const [variables, setVariables] = useState<Variable[]>(initialVariables);
  const [userMessage, setUserMessage] = useState("");
  const [runState, setRunState] = useState<RunState>("idle");
  const [output, setOutput] = useState("");
  const [tokenCount, setTokenCount] = useState(0);
  const [promptScore, setPromptScore] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const compilePrompt = () =>
    blocks
      .map((b) => {
        let content = b.content;
        variables.forEach((v) => {
          content = content.replaceAll(`{{${v.name}}}`, v.value);
        });
        return `[${b.title}]\n${content}`;
      })
      .join("\n\n");

  const handleRun = async () => {
    setRunState("running");
    setOutput("");
    setTokenCount(0);
    setPromptScore(null);

    const compiled = compilePrompt();

    // Simple heuristic-based input prompt quality score
    let score = 20; // Base score
    if (compiled.length > 200) score += 20; // Good length
    if (variables.length > 0) score += 20; // Uses structured variables
    if (blocks.length > 1) score += 20; // Well structured into blocks
    if (/(markdown|json|xml|format|structure|output)/i.test(compiled))
      score += 20; // Specifies format
    setPromptScore(Math.min(100, score));

    try {
      const res = await fetch("/api/workspace-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compiledPrompt: compiled,
          userMessage: userMessage.trim() || undefined,
        }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setOutput(fullText);
      }

      const finalTokenCount = Math.ceil(fullText.length / 4);
      setTokenCount(finalTokenCount);
      setRunState("done");
      posthog.capture("prompt_test_run", {
        block_count: blocks.length,
        variable_count: variables.length,
        has_user_message: !!userMessage.trim(),
        prompt_score: Math.min(100, score),
        estimated_tokens: finalTokenCount,
      });
    } catch (err) {
      setOutput(err instanceof Error ? err.message : "Something went wrong.");
      setRunState("error");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateVariable = (index: number, value: string) => {
    setVariables((prev) =>
      prev.map((v, i) => (i === index ? { ...v, value } : v)),
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#fafafa]">
      {/* Left: Input panel */}
      <div className="w-80 border-r border-[#e4e4e7] bg-[#ffffff] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#e4e4e7]">
          <h2 className="text-sm font-semibold text-[#09090b]">Test Input</h2>
          <p className="text-[11px] text-[#a1a1aa] mt-0.5">
            Set variable values and run against your prompt.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Variables */}
          {variables.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <Braces size={13} className="text-[#22d4c8]" />
                <span className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider">
                  Variables
                </span>
              </div>
              <div className="space-y-3">
                {variables.map((variable, i) => (
                  <div key={variable.name}>
                    <label className="text-[11px] font-mono text-[#22d4c8] mb-1 block">
                      {`{{${variable.name}}}`}
                    </label>
                    <input
                      type="text"
                      value={variable.value}
                      onChange={(e) => updateVariable(i, e.target.value)}
                      className="w-full bg-[#fafafa] border border-[#e4e4e7] rounded-lg px-3 py-2 text-sm text-[#09090b] placeholder-[#a1a1aa] focus:outline-none focus:border-[#7c5cfc] transition-colors font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional user message */}
          <div>
            <label className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider mb-2 block">
              User Message{" "}
              <span className="normal-case font-normal text-[#d4d4d8]">
                (optional)
              </span>
            </label>
            <textarea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Add a user-turn message to test against your system prompt..."
              rows={4}
              className="w-full bg-[#fafafa] border border-[#e4e4e7] rounded-lg px-3 py-2 text-sm text-[#09090b] placeholder-[#a1a1aa] focus:outline-none focus:border-[#7c5cfc] transition-colors resize-none"
            />
          </div>

          {/* Compiled prompt preview */}
          {blocks.length > 0 && (
            <div>
              <button
                onClick={() => setShowPrompt(!showPrompt)}
                className="flex items-center gap-1.5 text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider w-full"
              >
                {showPrompt ? (
                  <ChevronUp size={12} />
                ) : (
                  <ChevronDown size={12} />
                )}
                Compiled Prompt Preview
              </button>
              {showPrompt && (
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

        {/* Run button */}
        <div className="p-4 border-t border-[#e4e4e7]">
          <button
            onClick={handleRun}
            disabled={runState === "running" || blocks.length === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7c5cfc] hover:bg-[#6a4fe4] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            {runState === "running" ? (
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
            {runState === "done" && (
              <CheckCircle2 size={14} className="text-[#10b981]" />
            )}
            {runState === "error" && (
              <AlertCircle size={14} className="text-[#ef4444]" />
            )}
            <span className="text-sm font-medium text-[#09090b]">
              {runState === "idle" && "Output"}
              {runState === "running" && "Generating…"}
              {runState === "done" && "Response"}
              {runState === "error" && "Error"}
            </span>
          </div>

          {(runState === "done" || runState === "error") && output && (
            <div className="flex items-center gap-3">
              {runState === "done" && (
                <div className="flex items-center gap-3">
                  {promptScore !== null && (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        promptScore >= 80
                          ? "bg-emerald-100 text-emerald-700"
                          : promptScore >= 50
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {promptScore >= 80
                        ? "Great"
                        : promptScore >= 50
                          ? "Fair"
                          : "Poor"}{" "}
                      ({promptScore}%)
                    </span>
                  )}
                  <span className="text-[11px] text-[#a1a1aa] font-mono">
                    ~{tokenCount} tokens
                  </span>
                </div>
              )}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#09090b] transition-colors"
              >
                {copied ? (
                  <Check size={13} className="text-[#10b981]" />
                ) : (
                  <Copy size={13} />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {runState === "idle" && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#f4f4f5] flex items-center justify-center mb-4">
                <Play size={20} className="text-[#a1a1aa]" />
              </div>
              <p className="text-sm font-medium text-[#71717a]">Ready to run</p>
              <p className="text-[12px] text-[#a1a1aa] mt-1 max-w-xs">
                Fill in your variables and hit Run Test to see the output.
              </p>
            </div>
          )}

          {runState === "running" && (
            <div className="h-full flex flex-col items-center justify-center">
              <Loader2 size={24} className="animate-spin text-[#7c5cfc] mb-3" />
              <p className="text-sm text-[#71717a]">Running your prompt…</p>
            </div>
          )}

          {(runState === "done" || runState === "error") &&
            (runState === "error" ? (
              <pre className="bg-[#ffffff] border border-[#fecaca] rounded-xl p-5 text-[13px] font-mono leading-loose whitespace-pre-wrap overflow-x-auto text-[#ef4444]">
                {output}
              </pre>
            ) : (
              <div className="bg-[#ffffff] border border-[#e4e4e7] rounded-xl p-5 text-[13px] leading-loose overflow-x-auto text-[#09090b] prose prose-sm max-w-none">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
