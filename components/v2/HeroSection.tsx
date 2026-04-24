"use client";

import { useState, useEffect } from "react";
import { BlurInText } from "../ui/blur-in-text";
import { useRouter } from "next/navigation";

const C = {
  bg: "#fafafa",
  surface: "#ffffff",
  surface2: "#f4f4f5",
  border: "#e4e4e7",
  borderMid: "#d4d4d8",
  text: "#09090b",
  textMuted: "#71717a",
  textDim: "#52525b",
  accent: "#7c5cfc",
  cyan: "#0d9488",
};

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const lnk = {
    color: C.textDim,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    background: "none",
    border: "none",
    fontFamily: "inherit",
    transition: "color 0.2s",
    padding: "4px 0",
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "0 5%",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.3s",
        background: scrolled ? "rgba(250,250,250,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(228,228,231,0.7)"
          : "1px solid transparent",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #7c5cfc 0%, #22d4c8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.02em",
            boxShadow: "0 4px 12px rgba(124,92,252,0.4)",
          }}
        >
          P
        </div>
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: C.text,
            letterSpacing: "-0.03em",
          }}
        >
          PromptOps
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        {[
          ["Features", "#features"],
          ["How it works", "#how-it-works"],
          ["Use cases", "#use-cases"],
          ["Pricing", "#pricing"],
        ].map(([label, href]) => (
          <a
            key={label}
            href={href}
            style={lnk}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.textDim)}
          >
            {label}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button style={{ ...lnk, padding: "8px 16px", color: C.textDim }}>
          Sign in
        </button>
        <button
          style={{
            background: C.accent,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "9px 20px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
            boxShadow: "0 0 24px rgba(124,92,252,0.35)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#8d70fc";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = C.accent;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Get started free
        </button>
      </div>
    </nav>
  );
}

export function ProductMockup() {
  const blocks = [
    {
      title: "System Instruction",
      color: "#7c5cfc",
      content:
        "You are an expert web scraper. Extract structured product data from e-commerce pages using {{target_url}}.",
    },
    {
      title: "Goal",
      color: "#22d4c8",
      content:
        "Return a JSON array of products with name, price, rating, and availability. Limit concurrency to {{max_concurrency}}.",
    },
    {
      title: "Constraints",
      color: "#f59e0b",
      content:
        "Never expose PII. Respect robots.txt. Handle pagination automatically.",
    },
  ];

  const assistantMessages = [
    {
      role: "assistant",
      content:
        "I've structured your prompt into 3 focused blocks. Want me to add error handling?",
    },
    { role: "user", content: "Yes, add retry logic for failed requests." },
  ];

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e4e4e7",
        borderRadius: 16,
        overflow: "hidden",
        fontFamily: '"Biennale", sans-serif',
        boxShadow:
          "0 0 0 1px rgba(124,92,252,0.1), 0 60px 120px rgba(0,0,0,0.1), 0 0 80px rgba(124,92,252,0.07)",
        height: 600,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: 0,
      }}
    >
      {/* Browser Chrome */}
      <div
        style={{
          padding: "8px 14px",
          borderBottom: "1px solid #e4e4e7",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#fafafa",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 5 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div
              key={c}
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: c,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              background: "#ededef",
              borderRadius: 6,
              padding: "3px 12px",
              fontSize: 10,
              color: "#71717a",
              minWidth: 160,
              textAlign: "center",
            }}
          >
            promptops.tech/workspace/abc123
          </div>
        </div>
      </div>

      {/* App Shell */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar — collapsed (56px) */}
        <div
          style={{
            width: 56,
            borderRight: "1px solid #e4e4e7",
            background: "#fafafa",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Brand header */}
          <div
            style={{
              height: 56,
              borderBottom: "1px solid #e4e4e7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* PanelLeftOpen icon replica */}
            <div
              style={{
                width: 15,
                height: 15,
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                opacity: 0.4,
              }}
            >
              <div
                style={{ height: 1.5, background: "#09090b", borderRadius: 1 }}
              />
              <div
                style={{ height: 1.5, background: "#09090b", borderRadius: 1 }}
              />
              <div
                style={{ height: 1.5, background: "#09090b", borderRadius: 1 }}
              />
            </div>
          </div>
          <div style={{ flex: 1 }} />
          {/* Unsaved dot */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: 12,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#f59e0b",
              }}
            />
          </div>
        </div>

        {/* Main (topbar + content) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* Topbar */}
          <div
            style={{
              height: 56,
              borderBottom: "1px solid #e4e4e7",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: 16,
              paddingRight: 12,
              gap: 12,
              flexShrink: 0,
            }}
          >
            {/* Left: breadcrumb */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                minWidth: 0,
              }}
            >
              <span style={{ fontSize: 11, color: "#71717a" }}>My Prompts</span>
              <span style={{ fontSize: 11, color: "#d4d4d8" }}>/</span>
              <span
                style={{
                  fontSize: 12,
                  color: "#09090b",
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                E-commerce Scraper
              </span>
            </div>
            {/* Right: tabs + actions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              {/* Tab switcher */}
              <div
                style={{
                  display: "flex",
                  background: "#f4f4f5",
                  borderRadius: 8,
                  padding: 3,
                  gap: 2,
                }}
              >
                {["Editor", "Test"].map((tab) => (
                  <div
                    key={tab}
                    style={{
                      padding: "4px 10px",
                      fontSize: 11,
                      fontWeight: 500,
                      borderRadius: 6,
                      background: tab === "Editor" ? "#ffffff" : "transparent",
                      color: tab === "Editor" ? "#09090b" : "#71717a",
                      boxShadow:
                        tab === "Editor"
                          ? "0 1px 2px rgba(0,0,0,0.06)"
                          : "none",
                    }}
                  >
                    {tab}
                  </div>
                ))}
              </div>
              {/* Export */}
              <div
                style={{
                  padding: "4px 10px",
                  fontSize: 11,
                  fontWeight: 500,
                  borderRadius: 7,
                  border: "1px solid #e4e4e7",
                  background: "#ffffff",
                  color: "#09090b",
                }}
              >
                Export
              </div>
              {/* Run */}
              <div
                style={{
                  padding: "4px 10px",
                  fontSize: 11,
                  fontWeight: 500,
                  borderRadius: 7,
                  background: "#7c5cfc",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderLeft: "6px solid #fff",
                    borderTop: "4px solid transparent",
                    borderBottom: "4px solid transparent",
                  }}
                />
                Run
              </div>
              {/* Divider */}
              <div style={{ width: 1, height: 20, background: "#e4e4e7" }} />
              {/* User avatar */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "#7c5cfc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                E
              </div>
            </div>
          </div>

          {/* Content: AssistantPanel + PromptCanvas */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* Assistant Panel */}
            <div
              style={{
                width: 200,
                borderRight: "1px solid #e4e4e7",
                background: "#fafafa",
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "10px 14px",
                  borderBottom: "1px solid #e4e4e7",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{ fontSize: 11, fontWeight: 600, color: "#09090b" }}
                >
                  Prompt Assistant
                </span>
              </div>
              {/* Messages */}
              <div
                style={{
                  flex: 1,
                  padding: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  overflow: "hidden",
                }}
              >
                {assistantMessages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection:
                        msg.role === "user" ? "row-reverse" : "row",
                      gap: 6,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        background:
                          msg.role === "user" ? "#e4e4e7" : "transparent",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 9,
                        color: "#71717a",
                      }}
                    >
                      {msg.role === "user" ? (
                        "U"
                      ) : (
                        <div
                          style={{
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg,#7c5cfc,#22d4c8)",
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        maxWidth: "80%",
                        padding: msg.role === "user" ? "5px 8px" : "0",
                        background:
                          msg.role === "user" ? "#e4e4e7" : "transparent",
                        borderRadius: msg.role === "user" ? 10 : 0,
                        fontSize: 9.5,
                        color: "#09090b",
                        lineHeight: 1.45,
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              {/* Input */}
              <div
                style={{
                  padding: 8,
                  borderTop: "1px solid #e4e4e7",
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 6,
                    background: "#fafafa",
                    border: "1px solid #e4e4e7",
                    borderRadius: 10,
                    padding: "6px 8px",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      fontSize: 9.5,
                      color: "#a1a1aa",
                      paddingBottom: 2,
                    }}
                  >
                    Refine a block, type @ to tag…
                  </div>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 7,
                      background: "#7c5cfc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: "5px solid transparent",
                        borderRight: "5px solid transparent",
                        borderBottom: "7px solid #fff",
                        marginBottom: 1,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Canvas */}
            <div
              style={{
                flex: 1,
                background: "#ffffff",
                overflowY: "auto",
                padding: "20px 24px",
              }}
            >
              {/* Canvas header */}
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#09090b",
                    marginBottom: 4,
                  }}
                >
                  E-commerce Scraper
                </div>
                <div
                  style={{ fontSize: 10, color: "#a1a1aa", lineHeight: 1.5 }}
                >
                  Compose your prompt using blocks. Use{" "}
                  <code
                    style={{
                      fontFamily: "monospace",
                      background: "#f4f4f5",
                      padding: "1px 3px",
                      borderRadius: 3,
                      color: "#22d4c8",
                      fontSize: 9,
                    }}
                  >
                    {"{{variable}}"}
                  </code>{" "}
                  to inject dynamic values.
                </div>
              </div>

              {/* Variables */}
              <div
                style={{
                  border: "1px solid #e4e4e7",
                  borderRadius: 10,
                  padding: "10px 12px",
                  marginBottom: 12,
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        background: "#22d4c8",
                        borderRadius: 3,
                        opacity: 0.8,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#09090b",
                      }}
                    >
                      Variables
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        color: "#a1a1aa",
                        fontFamily: "monospace",
                      }}
                    >
                      2 defined
                    </span>
                  </div>
                  <span
                    style={{ fontSize: 9, color: "#22d4c8", fontWeight: 500 }}
                  >
                    + Add
                  </span>
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {["target_url", "max_concurrency"].map((v) => (
                    <div
                      key={v}
                      style={{
                        border: "1px solid #d4d4d8",
                        borderRadius: 6,
                        padding: "3px 7px",
                        fontSize: 9,
                        fontFamily: "monospace",
                        color: "#71717a",
                        background: "#ffffff",
                      }}
                    >
                      {`{{${v}}}`}
                    </div>
                  ))}
                </div>
              </div>

              {/* Blocks */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {blocks.map((block) => (
                  <div
                    key={block.title}
                    style={{
                      border: "1px solid #e4e4e7",
                      borderLeftWidth: 3,
                      borderLeftColor: block.color,
                      borderRadius: 8,
                      background: "#fafafa",
                      overflow: "hidden",
                    }}
                  >
                    {/* Block header */}
                    <div
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid #f4f4f5",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "#ffffff",
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                          background: block.color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: block.color,
                        }}
                      >
                        {block.title}
                      </span>
                    </div>
                    {/* Block content */}
                    <div
                      style={{
                        padding: "7px 10px",
                        fontSize: 9.5,
                        color: "#71717a",
                        lineHeight: 1.5,
                      }}
                    >
                      {block.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add block */}
              <div
                style={{
                  marginTop: 10,
                  border: "1.5px dashed #d4d4d8",
                  borderRadius: 10,
                  padding: "10px",
                  textAlign: "center",
                  fontSize: 10,
                  color: "#a1a1aa",
                }}
              >
                + Add Block
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero({ accentColor }: { accentColor: string }) {
  const accent = accentColor || C.accent;
  const router = useRouter();

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "120px 5% 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glows */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "45%",
          width: 700,
          height: 700,
          background: `radial-gradient(circle, ${accent}18 0%, transparent 65%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "10%",
          width: 400,
          height: 400,
          background:
            "radial-gradient(circle, rgba(34,212,200,0.07) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr",
          gap: 60,
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Copy */}
        <div>
          <div
            className="fade-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: `rgba(124,92,252,0.08)`,
              border: `1px solid rgba(124,92,252,0.22)`,
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: 12,
              color: accent,
              fontWeight: 600,
              letterSpacing: "0.04em",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: accent,
                boxShadow: `0 0 8px ${accent}`,
              }}
            />
            Now in beta · 10,000+ prompts generated
          </div>

          <div
            className="fade-up fade-up-1"
            style={{
              fontSize: "clamp(40px, 4.8vw, 66px)",
              fontWeight: 700,
              lineHeight: 1.07,
              letterSpacing: "-0.04em",
              color: C.text,
              marginBottom: 24,
            }}
          >
            <h1>
              The ultimate
              <br />
              AI Prompt Generator
              <br />
            </h1>
            <BlurInText
              text="- instantly."
              className="flex"
              style={{
                background: `linear-gradient(120deg, ${accent} 0%, #22d4c8 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            />
          </div>

          <p
            className="fade-up fade-up-2"
            style={{
              fontSize: 18,
              color: C.textDim,
              lineHeight: 1.72,
              maxWidth: 460,
              marginBottom: 40,
            }}
          >
            PromptOps structures your thinking into precision AI prompts for
            models like ChatGPT, Claude, and Gemini. Better input — dramatically
            better output.
          </p>

          <div
            className="fade-up fade-up-3"
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              marginBottom: 32,
              alignItems: "center",
            }}
          >
            <button
              style={{
                background: accent,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                boxShadow: `0 8px 24px ${accent}50`,
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 14px 32px ${accent}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 8px 24px ${accent}50`;
              }}
              onClick={() => {
                router.push("/auth");
              }}
            >
              Start for free →
            </button>
            {/* <button
              style={{
                background: "transparent",
                color: C.text,
                border: "1px solid #d4d4d8",
                borderRadius: 10,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#a1a1aa";
                e.currentTarget.style.background = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#d4d4d8";
                e.currentTarget.style.background = "transparent";
              }}
            >
              See how it works
            </button> */}
          </div>

          <div
            className="fade-up fade-up-4"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            {[
              "No credit card required",
              "Free plan available",
              "500+ templates",
            ].map((item) => (
              <span
                key={item}
                style={{
                  fontSize: 13,
                  color: C.textMuted,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle
                    cx="7"
                    cy="7"
                    r="7"
                    fill={accent}
                    fillOpacity={0.14}
                  />
                  <path
                    d="M4.5 7L6 8.5L9.5 5"
                    stroke={accent}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Mockup */}
        <div
          className="fade-up fade-up-2 float"
          style={{ position: "relative" }}
        >
          <ProductMockup />
        </div>
      </div>
    </section>
  );
}
