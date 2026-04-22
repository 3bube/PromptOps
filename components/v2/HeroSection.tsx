import { useState, useEffect } from "react";
import { BlurInText } from "../ui/blur-in-text";
import { Workspace, WorkspaceCompact } from "@/app/v2/page";

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
      {/* Chrome */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: "1px solid #e4e4e7",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#fafafa",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div
              key={c}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: c,
                opacity: 0.75,
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '140%', height: '140%', transform: 'scale(0.71428)', transformOrigin: 'top left' }}>
          <WorkspaceCompact />
        </div>
      </div>
    </div>
  );
}

export function Hero({ accentColor }: { accentColor: string }) {
  const accent = accentColor || C.accent;

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
            models like ChatGPT, Claude, and Gemini. Better input —
            dramatically better output.
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
            >
              Start for free →
            </button>
            <button
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
            </button>
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
