import { useState } from "react";
import { Workspace } from "@/app/v2/page";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { WordmarkIcon } from "@/components/ui/header-2";

const S = {
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

export const Badge = ({ children, color, bg }: any) => (
  <div
    style={{
      display: "inline-block",
      background: bg || "rgba(124,92,252,0.08)",
      border: `1px solid ${color || "rgba(124,92,252,0.22)"}`,
      borderRadius: 20,
      padding: "5px 14px",
      fontSize: 11,
      color: color || S.accent,
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      marginBottom: 20,
    }}
  >
    {children}
  </div>
);

export const SectionHeading = ({
  label,
  title,
  sub,
  labelColor,
  align = "left",
}: any) => (
  <div style={{ textAlign: align, marginBottom: 60 }}>
    <Badge color={labelColor}>{label}</Badge>
    <h2
      style={{
        fontSize: "clamp(30px, 3.8vw, 50px)",
        fontWeight: 700,
        letterSpacing: "-0.035em",
        color: S.text,
        lineHeight: 1.1,
        marginBottom: sub ? 18 : 0,
        maxWidth: align === "center" ? 560 : 560,
        margin: align === "center" ? "0 auto 18px" : "0 0 18px",
      }}
    >
      {title}
    </h2>
    {sub && (
      <p
        style={{
          fontSize: 17,
          color: S.textDim,
          maxWidth: 480,
          margin: align === "center" ? "0 auto" : "0",
          lineHeight: 1.7,
        }}
      >
        {sub}
      </p>
    )}
  </div>
);

// ── HowItWorks ──────────────────────────────────────────────
export function HowItWorks({ accentColor }: any) {
  const accent = accentColor || S.accent;
  const steps = [
    {
      num: "01",
      title: "Describe your task",
      desc: "Type your goal in plain English. No prompt engineering expertise needed — just say what you want to accomplish.",
    },
    {
      num: "02",
      title: "PromptOps structures it",
      desc: "The engine decomposes your intent into Goal, Context, Constraints, and Output Format — the anatomy of a precision prompt.",
    },
    {
      num: "03",
      title: "Copy, refine, and save",
      desc: "Deploy immediately, hit Refine for a sharper version, or save to your library for reuse across projects and teammates.",
    },
  ];
  return (
    <section
      id="how-it-works"
      style={{ padding: "120px 5%", position: "relative" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeading
          align="center"
          label="How it works"
          labelColor={S.cyan}
          title="Three steps to a better prompt"
          sub="From rough idea to structured, high-output prompt in under 10 seconds."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 28,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 36,
              left: "17%",
              right: "17%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${accent}50, transparent)`,
              pointerEvents: "none",
            }}
          />
          {steps.map((step, i) => (
            <div
              key={step.num}
              style={{
                background: S.surface,
                border: "1px solid #e4e4e7",
                borderRadius: 16,
                padding: 32,
                transition: "all 0.25s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${accent}35`;
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = `0 24px 48px rgba(0,0,0,0.05), 0 0 0 1px ${accent}18`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e4e4e7";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${accent}14`,
                  border: `1px solid ${accent}28`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 800,
                  color: accent,
                  marginBottom: 24,
                  letterSpacing: "-0.02em",
                }}
              >
                {step.num}
              </div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: S.text,
                  marginBottom: 12,
                  letterSpacing: "-0.025em",
                }}
              >
                {step.title}
              </h3>
              <p style={{ fontSize: 14, color: S.textDim, lineHeight: 1.72 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features ────────────────────────────────────────────────
export function Features({ accentColor }: any) {
  const accent = accentColor || S.accent;
  const feats = [
    {
      title: "Plain-English Generation",
      desc: "Describe your goal naturally. PromptOps handles structure, specificity, and framing so your AI gets exactly what you mean.",
      color: accent,
    },
    {
      title: "Template Library",
      desc: "500+ pre-built templates organized by use case. Start from proven patterns and customize in seconds.",
      color: S.cyan,
    },
    {
      title: "One-Click Refinement",
      desc: "Not quite right? Refine sharpens your prompt with better specificity, context, and constraints — instantly.",
      color: "#f59e0b",
    },
    {
      title: "Workflow Prompt Packs",
      desc: "Curated prompt sequences for complete workflows — from architecture decisions to launch copy to code review.",
      color: "#10b981",
    },
    {
      title: "History & Organization",
      desc: "Every generated prompt is saved, searchable, and taggable. Your best work builds over time.",
      color: "#f472b6",
    },
    {
      title: "Export & Integrate",
      desc: "One-click copy, Notion export, team sharing, or API access — prompts live wherever your workflow does.",
      color: "#818cf8",
    },
  ];
  return (
    <section
      id="features"
      style={{ padding: "120px 5%", background: "#fafafa" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeading
          label="Features"
          title={
            <>
              Everything you need
              <br />
              to prompt better
            </>
          }
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 22,
          }}
        >
          {feats.map((f) => (
            <div
              key={f.title}
              style={{
                background: S.surface,
                border: "1px solid #e4e4e7",
                borderRadius: 16,
                padding: 28,
                transition: "all 0.25s",
                position: "relative",
                overflow: "hidden",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${f.color}30`;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.05)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e4e4e7";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 130,
                  height: 130,
                  background: `radial-gradient(circle at top right, ${f.color}0e, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: `${f.color}14`,
                  border: `1px solid ${f.color}22`,
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: f.color,
                    opacity: 0.75,
                  }}
                />
              </div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: S.text,
                  marginBottom: 10,
                  letterSpacing: "-0.02em",
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 13.5, color: S.textDim, lineHeight: 1.7 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DemoMockup({ accentColor }: any) {
  const accent = accentColor || S.accent;
  return (
    <section style={{ padding: "120px 5%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeading
          align="center"
          label="Product"
          labelColor={S.cyan}
          title="Built for power users"
          sub="A fast, keyboard-friendly interface that gets out of your way and lets you focus on the work."
        />
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e4e4e7",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow:
              "0 0 0 1px rgba(124,92,252,0.07), 0 80px 160px rgba(0,0,0,0.1)",
            height: 750,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Browser chrome */}
          <div
            style={{
              background: "#fafafa",
              borderBottom: "1px solid #e4e4e7",
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 7 }}>
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <div
                  key={c}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: c,
                    opacity: 0.75,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                flex: 1,
                background: "#ffffff",
                border: "1px solid #e4e4e7",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 12,
                color: "#71717a",
                maxWidth: 360,
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              app.promptops.tech/builder
            </div>
          </div>
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <Workspace />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── UseCases ────────────────────────────────────────────────
export function UseCases({ accentColor }: any) {
  const accent = accentColor || S.accent;
  const [active, setActive] = useState(0);
  const tabs = [
    {
      label: "Coding",
      color: accent,
      title: "Write better code, faster.",
      desc: "Generate prompts for debugging, refactoring, documentation, architecture, and code review. PromptOps knows how to talk to AI about code.",
      examples: [
        "Debug async function with race conditions",
        "Refactor class for SOLID principles",
        "Write unit tests with edge cases",
        "Design a REST API with OpenAPI spec",
        "Explain this SQL query step-by-step",
      ],
    },
    {
      label: "Marketing",
      color: "#f59e0b",
      title: "Copy that converts.",
      desc: "Structured prompts for ad copy, email campaigns, landing pages, social content, and positioning — tuned for high conversion output.",
      examples: [
        "Write a cold email sequence for SaaS trial",
        "Generate Facebook ad variants A/B test",
        "Create a product launch announcement",
        "Draft a LinkedIn thought leadership post",
        "Write homepage hero copy for a B2B tool",
      ],
    },
    {
      label: "Writing",
      color: S.cyan,
      title: "From blank page to first draft.",
      desc: "Prompts for articles, reports, documentation, blog posts, and long-form content — structured for coherence and depth.",
      examples: [
        "Write a technical blog post introduction",
        "Create an executive summary from notes",
        "Draft a case study from customer interview",
        "Generate an outline for a 2,000-word guide",
        "Rewrite for clarity and directness",
      ],
    },
    {
      label: "Operations",
      color: "#10b981",
      title: "Systematize your workflows.",
      desc: "Turn operational tasks into structured AI prompts — SOPs, analysis, process documentation, meeting prep, and reporting.",
      examples: [
        "Create an SOP for customer onboarding",
        "Draft a quarterly business review",
        "Generate a project retrospective template",
        "Analyze survey data for key themes",
        "Write a vendor evaluation framework",
      ],
    },
    {
      label: "Founders",
      color: "#f472b6",
      title: "Move fast and think clearly.",
      desc: "Prompts built for solo founders and small teams — strategy, fundraising, product decisions, and investor communications.",
      examples: [
        "Craft an investor update email",
        "Write a one-pager for Series A deck",
        "Prioritize features with RICE framework",
        "Generate a competitor analysis brief",
        "Draft a go-to-market strategy outline",
      ],
    },
  ];
  const t = tabs[active];
  return (
    <section
      id="use-cases"
      style={{ padding: "120px 5%", background: "#fafafa" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeading
          label="Use cases"
          title={
            <>
              One tool,
              <br />
              every workflow
            </>
          }
        />
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 48,
            flexWrap: "wrap",
          }}
        >
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActive(i)}
              style={{
                background: active === i ? `${tab.color}18` : "transparent",
                border: `1px solid ${active === i ? `${tab.color}40` : "#d4d4d8"}`,
                borderRadius: 10,
                padding: "9px 20px",
                fontSize: 14,
                color: active === i ? tab.color : S.textMuted,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: active === i ? 600 : 400,
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  background: `${t.color}14`,
                  border: `1px solid ${t.color}28`,
                  borderRadius: 8,
                  padding: "4px 12px",
                  fontSize: 11,
                  color: t.color,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                {t.label}
              </div>
              <h3
                style={{
                  fontSize: "clamp(26px, 3vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: S.text,
                  marginBottom: 18,
                  lineHeight: 1.15,
                }}
              >
                {t.title}
              </h3>
              <p
                style={{
                  fontSize: 16,
                  color: S.textDim,
                  lineHeight: 1.75,
                  marginBottom: 36,
                }}
              >
                {t.desc}
              </p>
              <button
                style={{
                  background: accent,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "13px 26px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                  boxShadow: `0 6px 20px ${accent}45`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                Browse {t.label} templates →
              </button>
            </div>
            <div
              style={{
                background: S.surface,
                border: "1px solid #e4e4e7",
                borderRadius: 16,
                padding: 28,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: S.textMuted,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginBottom: 18,
                }}
              >
                Example prompts
              </div>
              {t.examples.map((ex, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom:
                      i < t.examples.length - 1 ? "1px solid #1a1a2e" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: t.color,
                      flexShrink: 0,
                      marginTop: 5,
                    }}
                  />
                  <span
                    style={{ fontSize: 14, color: S.textDim, lineHeight: 1.5 }}
                  >
                    {ex}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 12,
                      color: t.color,
                      flexShrink: 0,
                      cursor: "pointer",
                      opacity: 0.7,
                    }}
                  >
                    →
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── SocialProof ─────────────────────────────────────────────
export function SocialProof({ accentColor }: any) {
  const accent = accentColor || S.accent;
  const metrics = [
    { end: 10000, suffix: "+", label: "Prompts generated" },
    { end: 98, suffix: "%", label: 'Users rate output "good" or better' },
    { end: 4.9, decimals: 1, suffix: " / 5", label: "Average product rating" },
    {
      end: 3.2,
      decimals: 1,
      suffix: "×",
      label: "Faster than writing prompts manually",
    },
  ];
  const testimonials = [
    {
      quote:
        "PromptOps turned what used to be 20 minutes of prompt trial-and-error into 30 seconds of actual work. My AI output quality went up overnight.",
      name: "Marcus T.",
      role: "Founding Engineer, Stealth SaaS",
      avatar: "MT",
    },
    {
      quote:
        "I use it for every marketing brief now. The structure it adds — goal, context, constraints — makes GPT-4 actually useful for copy at scale.",
      name: "Priya M.",
      role: "Head of Growth, Series A startup",
      avatar: "PM",
    },
    {
      quote:
        "As a solo founder, this is like having a senior prompt engineer on call. It thinks through the prompt so I can focus on the output.",
      name: "Alex K.",
      role: "Indie Hacker, 3x product launches",
      avatar: "AK",
    },
  ];
  return (
    <section style={{ padding: "120px 5%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 1,
            background: "#e4e4e7",
            border: "1px solid #e4e4e7",
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 80,
          }}
        >
          {metrics.map((m, i) => (
            <div
              key={m.label}
              style={{
                background: S.surface,
                padding: "36px 28px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: S.text,
                  marginBottom: 8,
                  background: `linear-gradient(135deg, ${accent}, #22d4c8)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                <CountUp
                  end={m.end}
                  decimals={m.decimals || 0}
                  suffix={m.suffix}
                  enableScrollSpy
                  scrollSpyOnce
                  duration={2.5}
                />
              </div>
              <div
                style={{ fontSize: 13, color: S.textMuted, lineHeight: 1.5 }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <SectionHeading
          align="center"
          label="Trusted by builders"
          title="Loved by the people who actually ship"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 24,
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                background: S.surface,
                border: "1px solid #e4e4e7",
                borderRadius: 16,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${accent}28`;
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e4e4e7";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill={accent}
                  >
                    <path d="M7 1L8.8 5.4H13.5L9.8 8.1L11.1 12.5L7 9.8L2.9 12.5L4.2 8.1L0.5 5.4H5.2L7 1Z" />
                  </svg>
                ))}
              </div>
              <p
                style={{
                  fontSize: 14.5,
                  color: S.textDim,
                  lineHeight: 1.75,
                  flex: 1,
                  fontStyle: "italic",
                }}
              >
                "{t.quote}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${accent}40, #22d4c840)`,
                    border: `1px solid ${accent}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: accent,
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: S.text }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 12, color: S.textMuted }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ─────────────────────────────────────────────────
export function Pricing({ accentColor }: any) {
  const accent = accentColor || S.accent;
  const [annual, setAnnual] = useState(false);
  const plans = [
    {
      name: "Free",
      price: 0,
      desc: "Get started with the basics.",
      features: [
        "50 prompts / month",
        "5 prompt templates",
        "Prompt history (7 days)",
        "Copy & export",
        "Community support",
      ],
      cta: "Start free",
      popular: false,
    },
    {
      name: "Pro",
      price: annual ? 9 : 12,
      desc: "For power users and builders.",
      features: [
        "Unlimited prompts",
        "500+ templates",
        "Full history & search",
        "Workflow prompt packs",
        "One-click refinement",
        "Priority support",
        "API access (beta)",
      ],
      cta: "Start Pro trial",
      popular: true,
    },
    {
      name: "Team",
      price: annual ? 29 : 39,
      desc: "Collaborate at scale.",
      features: [
        "Everything in Pro",
        "Up to 10 seats",
        "Shared prompt library",
        "Team collections",
        "Admin dashboard",
        "SSO (coming soon)",
        "Dedicated support",
      ],
      cta: "Talk to us",
      popular: false,
    },
  ];
  return (
    <section
      id="pricing"
      style={{ padding: "120px 5%", background: "#fafafa" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeading
          align="center"
          label="Pricing"
          title="Simple, honest pricing"
          sub="Start free. Upgrade when you're ready. Cancel anytime."
        />
        {/* Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            marginBottom: 56,
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: !annual ? S.text : S.textMuted,
              fontWeight: !annual ? 600 : 400,
            }}
          >
            Monthly
          </span>
          <button
            onClick={() => setAnnual((a) => !a)}
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              border: "none",
              background: annual ? accent : "#d4d4d8",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#fff",
                position: "absolute",
                top: 3,
                left: annual ? 23 : 3,
                transition: "left 0.2s",
              }}
            />
          </button>
          <span
            style={{
              fontSize: 14,
              color: annual ? S.text : S.textMuted,
              fontWeight: annual ? 600 : 400,
            }}
          >
            Annual{" "}
            <span
              style={{
                fontSize: 11,
                color: "#10b981",
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: 8,
                padding: "2px 7px",
                marginLeft: 4,
              }}
            >
              Save 25%
            </span>
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: plan.popular
                  ? `linear-gradient(160deg, #ffffff, #f4f4f5)`
                  : S.surface,
                border: `1px solid ${plan.popular ? `${accent}40` : "#e4e4e7"}`,
                borderRadius: 20,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                position: "relative",
                boxShadow: plan.popular
                  ? `0 0 0 1px ${accent}20, 0 40px 80px rgba(124,92,252,0.12)`
                  : "none",
                transition: "transform 0.25s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-4px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: accent,
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 14px",
                    borderRadius: 10,
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap",
                  }}
                >
                  Most popular
                </div>
              )}
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: plan.popular ? accent : S.textMuted,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  {plan.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 4,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 42,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      color: S.text,
                    }}
                  >
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span style={{ fontSize: 14, color: S.textMuted }}>
                      /mo
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: S.textMuted }}>{plan.desc}</p>
              </div>
              <div style={{ height: 1, background: "#e4e4e7" }} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  flex: 1,
                }}
              >
                {plan.features.map((f) => (
                  <div
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      style={{ flexShrink: 0, marginTop: 1 }}
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="8"
                        fill={plan.popular ? accent : "#e4e4e7"}
                        fillOpacity={plan.popular ? 0.2 : 1}
                      />
                      <path
                        d="M5 8L7 10L11 6"
                        stroke={plan.popular ? accent : S.textMuted}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span style={{ fontSize: 13.5, color: S.textDim }}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>
              <button
                style={{
                  background: plan.popular ? accent : "transparent",
                  color: plan.popular ? "#fff" : S.text,
                  border: `1px solid ${plan.popular ? accent : "#d4d4d8"}`,
                  borderRadius: 10,
                  padding: "13px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                  marginTop: 8,
                  boxShadow: plan.popular ? `0 6px 20px ${accent}45` : "none",
                }}
                onMouseEnter={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.borderColor = "#a1a1aa";
                    e.currentTarget.style.background = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.borderColor = "#d4d4d8";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ─────────────────────────────────────────────────────
export function FAQ({ accentColor }: any) {
  const accent = accentColor || S.accent;
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    {
      q: "What is an AI prompt generator?",
      a: "An AI prompt generator is a tool that turns basic ideas into highly structured, optimized inputs for AI models. PromptOps acts as your personal prompt engineer, formatting your plain-English tasks with Goals, Context, Constraints, and Output Formats to ensure you get the best possible results.",
    },
    {
      q: "How do I write an effective prompt for ChatGPT or Claude?",
      a: "Effective prompts require clear context, specific constraints, and defined output formats. Instead of learning prompt engineering manually, you can use our free AI prompt generator to instantly structure your ideas into professional prompts that work perfectly with ChatGPT, Claude, and Gemini.",
    },
    {
      q: "Which AI models does this prompt generator work with?",
      a: "PromptOps generates universal, model-agnostic prompts that work seamlessly with any large language model. This includes OpenAI's ChatGPT (GPT-4o), Anthropic's Claude 3.5, Google Gemini, and open-source models like Llama and Mistral.",
    },
    {
      q: "Can I use it for image generators like Midjourney?",
      a: "Yes! While primarily designed for text-based LLMs, PromptOps can easily generate highly descriptive, stylized prompts tailored for image generation models like Midjourney, DALL-E 3, and Stable Diffusion.",
    },
    {
      q: "Is this AI prompt generator really free?",
      a: "Yes, our free AI prompt generator allows you to create up to 50 structured prompts per month, access 5 premium templates, and view your 7-day prompt history with absolutely no credit card required.",
    },
    {
      q: "How is this different from ChatGPT's built-in prompting?",
      a: "PromptOps is a layer on top of those models — not a replacement. It structures your prompts before you send them, making your inputs more precise and your outputs significantly more useful. Think of it as an expert prompt engineer that lives between you and the model.",
    },
  ];
  return (
    <section id="faq" style={{ padding: "120px 5%" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <SectionHeading align="center" label="FAQ" title="Common questions" />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                background: open === i ? S.surface : "transparent",
                border: `1px solid ${open === i ? `${accent}28` : "#e4e4e7"}`,
                borderRadius: 12,
                overflow: "hidden",
                transition: "all 0.2s",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: S.text,
                    lineHeight: 1.4,
                  }}
                >
                  {item.q}
                </span>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: open === i ? `${accent}18` : "#e4e4e7",
                    border: `1px solid ${open === i ? `${accent}30` : "#d4d4d8"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      color: open === i ? accent : S.textMuted,
                      transform: open === i ? "rotate(45deg)" : "none",
                      display: "block",
                      transition: "transform 0.2s",
                      lineHeight: 1,
                    }}
                  >
                    +
                  </span>
                </div>
              </button>
              <div
                style={{
                  display: "grid",
                  gridTemplateRows: open === i ? "1fr" : "0fr",
                  transition: "grid-template-rows 0.3s ease-in-out",
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <div
                    style={{
                      padding: "0 24px 20px",
                      fontSize: 14.5,
                      color: S.textDim,
                      lineHeight: 1.78,
                    }}
                  >
                    {item.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTABanner ───────────────────────────────────────────────
export function CTABanner({ accentColor }: any) {
  const accent = accentColor || S.accent;
  return (
    <section
      className="rounded-bl-2xl rounded-br-2xl"
      style={{ padding: "80px 5% 120px" }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: `linear-gradient(135deg, #ffffff 0%, #f4f4f5 100%)`,
          border: `1px solid ${accent}28`,
          borderRadius: 24,
          padding: "80px 60px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 0 80px ${accent}0e`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 300,
            background: `radial-gradient(ellipse, ${accent}14 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <h2
            style={{
              fontSize: "clamp(32px,4vw,52px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: S.text,
              marginBottom: 18,
              lineHeight: 1.1,
            }}
          >
            Stop guessing.
            <br />
            Start prompting with precision.
          </h2>
          <p
            style={{
              fontSize: 18,
              color: S.textDim,
              marginBottom: 40,
              maxWidth: 480,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Join thousands of builders who generate better AI output — every
            single day.
          </p>
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              style={{
                background: accent,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "15px 32px",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                boxShadow: `0 8px 28px ${accent}55`,
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 14px 36px ${accent}65`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 8px 28px ${accent}55`;
              }}
            >
              Get started free →
            </button>
            <button
              style={{
                background: "transparent",
                color: S.text,
                border: "1px solid #d4d4d8",
                borderRadius: 10,
                padding: "15px 32px",
                fontSize: 16,
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
              View pricing
            </button>
          </div>
          <p style={{ marginTop: 24, fontSize: 13, color: S.textMuted }}>
            No credit card required · Free plan available · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Footer ──────────────────────────────────────────────────
export function Footer() {
  const cols = [
    {
      heading: "Product",
      links: ["Features", "Templates", "Pricing", "Changelog"],
    },
    { heading: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  ];
  return (
    <footer
      style={{
        position: "relative",
        height: "min(100vh, 800px)",
        clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
      }}
    >
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "min(100vh, 800px)",
          background: "#141516",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 5% 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            maxWidth: 1400,
            margin: "0 auto",
            width: "100%",
            gap: 40,
          }}
        >
          <div style={{ maxWidth: 300 }}>
            <div style={{ marginBottom: 18 }}>
              <WordmarkIcon className="text-white" />
            </div>
            <p style={{ fontSize: 15, color: "#a1a1aa", lineHeight: 1.6 }}>
              Expert AI prompts, instantly. Turn rough ideas into structured,
              high-output prompts.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "clamp(40px, 8vw, 120px)",
              flexWrap: "wrap",
            }}
          >
            {cols.map((col) => (
              <div key={col.heading}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "0.04em",
                    marginBottom: 24,
                  }}
                >
                  {col.heading}
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {col.links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      style={{
                        fontSize: 15,
                        color: "#a1a1aa",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#fff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#a1a1aa")
                      }
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <WordmarkIcon
            className="text-white mx-auto justify-center mb-10"
            style={{
              fontSize: "clamp(40px, 14vw, 240px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.8,
            }}
          />
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: 24,
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <span style={{ fontSize: 14, color: "#71717a" }}>
              © 2026 PromptOps. All rights reserved.
            </span>
            <div style={{ display: "flex", gap: 20 }}>
              <a
                href="#"
                style={{
                  fontSize: 14,
                  color: "#71717a",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#fff")}
                onMouseLeave={(e) => (e.target.style.color = "#71717a")}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                style={{
                  fontSize: 14,
                  color: "#71717a",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#fff")}
                onMouseLeave={(e) => (e.target.style.color = "#71717a")}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── TweaksPanel ─────────────────────────────────────────────
export function TweaksPanel({ tweaks, updateTweak }: any) {
  const accents = [
    { color: "#7c5cfc", label: "Violet" },
    { color: "#0d9488", label: "Cyan" },
    { color: "#f59e0b", label: "Amber" },
    { color: "#10b981", label: "Emerald" },
    { color: "#f472b6", label: "Pink" },
    { color: "#818cf8", label: "Indigo" },
  ];
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: "#ffffff",
        border: "1px solid #d4d4d8",
        borderRadius: 16,
        padding: 24,
        width: 240,
        boxShadow:
          "0 24px 64px rgba(0,0,0,0.15), 0 0 0 1px rgba(124,92,252,0.1)",
        fontFamily: '"Biennale", sans-serif',
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: S.text,
          marginBottom: 20,
          letterSpacing: "-0.01em",
        }}
      >
        Tweaks
      </div>
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 11,
            color: S.textMuted,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Accent color
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {accents.map((a) => (
            <button
              key={a.color}
              onClick={() => updateTweak("accentColor", a.color)}
              title={a.label}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: a.color,
                border:
                  tweaks.accentColor === a.color
                    ? `2px solid #fff`
                    : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.15s",
                transform:
                  tweaks.accentColor === a.color ? "scale(1.15)" : "scale(1)",
                boxShadow:
                  tweaks.accentColor === a.color
                    ? `0 0 12px ${a.color}80`
                    : "none",
              }}
            />
          ))}
        </div>
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            color: S.textMuted,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Sections
        </div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
          }}
        >
          <div
            onClick={() => updateTweak("showPricing", !tweaks.showPricing)}
            style={{
              width: 36,
              height: 20,
              borderRadius: 10,
              background: tweaks.showPricing ? tweaks.accentColor : "#d4d4d8",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: "#fff",
                position: "absolute",
                top: 3,
                left: tweaks.showPricing ? 19 : 3,
                transition: "left 0.2s",
              }}
            />
          </div>
          <span style={{ fontSize: 13, color: S.textDim }}>Show pricing</span>
        </label>
      </div>
    </div>
  );
}
