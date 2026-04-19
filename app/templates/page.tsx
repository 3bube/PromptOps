"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Code,
  Pen,
  BarChart3,
  Lightbulb,
  Mail,
  Search,
  ArrowLeft,
  Copy,
  Check,
  Megaphone,
  FileText,
  Briefcase,
  GraduationCap,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ExpandableCard,
  ExpandableCardBody,
  ExpandableCardContent,
  ExpandableCardExpandContainer,
} from "@/components/ui/expandable-card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  icon: LucideIcon;
}

const TEMPLATES: Template[] = [
  {
    id: "1",
    title: "REST API Code Reviewer",
    description:
      "Get a senior engineer's critique of your API design with prioritized fixes",
    category: "coding",
    prompt:
      "You are a senior backend engineer who values security, performance, and maintainability above all. Review the following REST API design as if you're a skeptical code reviewer preparing it for a production launch. For each issue you find: (1) label it Critical / Important / Minor, (2) explain the exact risk it creates, (3) show a corrected code snippet. End with a prioritized fix list and one architectural change that would make the biggest long-term difference.",
    icon: Code,
  },
  {
    id: "2",
    title: "React Component Architect",
    description:
      "Design a bulletproof React component with accessibility, tests, and edge cases",
    category: "coding",
    prompt:
      "You are a React expert who has been burned by accessibility lawsuits and flaky tests. Design a production-ready React component for [describe the component]. Deliver: (1) the full TypeScript component with props interface and JSDoc, (2) every ARIA attribute needed and why, (3) three edge cases most developers miss and how to handle them, (4) unit tests for the happy path and each edge case using React Testing Library. Flag any performance pitfalls in your implementation.",
    icon: Code,
  },
  {
    id: "3",
    title: "SEO Article That Actually Ranks",
    description:
      "Write a search-optimized article with three headline variants and a meta description",
    category: "writing",
    prompt:
      "You are an SEO strategist who has ranked dozens of articles on page one. Write a 1500-word article targeting the keyword [your keyword] for an audience of [describe reader]. Structure: hook (first 100 words must make them stay), three H2 sections each answering a different search intent, one data point or statistic per section, and a CTA in the final paragraph. Then deliver: (A) three headline options — curiosity-gap, benefit-driven, and number-based, (B) a meta description under 155 characters, (C) two internal linking suggestions. Do not keyword-stuff; write for humans first.",
    icon: Pen,
  },
  {
    id: "4",
    title: "Docs That Developers Actually Read",
    description:
      "Write technical documentation at three depth levels for different readers",
    category: "writing",
    prompt:
      "You are a technical writer who believes documentation fails when it talks to no one in particular. Write documentation for [your feature or API] at three depth levels in one document: (1) a 3-sentence TL;DR for the developer who's skimming, (2) a getting-started guide with copy-paste code for the developer who has 10 minutes, (3) a full reference section with every parameter, error code, and edge case for the developer who is debugging at 2am. Flag any assumption you had to make about the system — those are gaps the team needs to fill.",
    icon: FileText,
  },
  {
    id: "5",
    title: "Sales Data Interrogator",
    description:
      "Surface the uncomfortable patterns in your sales data most reports miss",
    category: "analysis",
    prompt:
      "You are a data analyst who is paid to find what leadership doesn't want to see. Analyze the following sales data: [paste data or describe it]. Go beyond surface trends. Identify: (1) the metric that looks healthy but is masking a problem, (2) the customer segment that is quietly churning, (3) the second-order effect of the top-line trend that nobody is discussing. Present each finding as: Observation → Why it matters → What happens if ignored → Recommended action. End with the one question this data cannot answer but absolutely should.",
    icon: BarChart3,
  },
  {
    id: "6",
    title: "Steelman Competitor Analysis",
    description:
      "Argue your toughest competitor's case before finding your real edge",
    category: "analysis",
    prompt:
      "You are a strategist preparing a board presentation. Analyze [your competitor] against [your product]. First, steelman your competitor — argue their case as their best advocate would, including why a smart customer would choose them over you. Then shift perspective: identify the one thing they cannot do without breaking their business model. Build your differentiation strategy around that constraint. Deliver a one-page summary: their genuine strengths, your genuine weaknesses, the single wedge where you can win, and the three moves to take in the next 90 days.",
    icon: Briefcase,
  },
  {
    id: "7",
    title: "Launch Email Sequence",
    description:
      "5-email launch campaign with A/B subject lines and psychology-driven CTAs",
    category: "marketing",
    prompt:
      "You are an email copywriter who has launched products to cold lists and warm audiences. Write a 5-email product launch sequence for [your product] targeting [your audience]. Emails: (1) problem agitation — no product mention, (2) story-driven reveal, (3) feature-to-benefit translation, (4) objection-busting social proof, (5) urgency close. For each email include: two A/B subject lines with different psychological triggers labeled (curiosity / benefit / urgency / fear of missing out), preheader text, body copy, and a CTA. Note the one sentence in each email where most readers will decide to stop reading — make it impossible to stop there.",
    icon: Mail,
  },
  {
    id: "8",
    title: "Platform-Native Content Plan",
    description:
      "2-week content calendar written for how each platform's algorithm actually works",
    category: "marketing",
    prompt:
      "You are a social media strategist who understands that content that works on LinkedIn dies on Twitter and vice versa. Create a 2-week content plan for [your brand/product] across Instagram, LinkedIn, and Twitter/X. For each platform write natively — different hook style, different optimal length, different CTA. Include: the post angle, opening line (critical — this determines reach), full caption or thread, hashtag strategy (with reasoning, not just a list), and the one engagement question that will generate real replies, not just likes. Flag which posts should be boosted with paid spend and why.",
    icon: Megaphone,
  },
  {
    id: "9",
    title: "Startup Idea Devil's Advocate",
    description:
      "Pressure-test your idea the way a skeptical VC would before you build anything",
    category: "creative",
    prompt:
      "You are a venture capitalist who has seen 10,000 pitches and funds fewer than 1%. I am going to pitch you my startup idea: [your idea]. Your job is to destroy it — find the assumption I am most in love with and explain exactly why it's wrong. Then identify the one version of this idea that could actually work (it may be a pivot). Deliver: (1) the fatal flaw in the original thesis, (2) the market insight I'm missing, (3) the reformulated idea with a defensible wedge, (4) the first three things I should do to validate it for under $500 and 30 days. Be honest, not encouraging.",
    icon: Lightbulb,
  },
  {
    id: "10",
    title: "Brand Voice Architect",
    description:
      "Build a brand voice with concrete do/don't examples, not vague adjectives",
    category: "creative",
    prompt:
      "You are a brand strategist who hates brand guidelines that say things like 'we are authentic and human.' Build a brand voice framework for [your brand] that a new hire could use on day one without any coaching. Deliver: (1) three voice dimensions — each defined by a specific do and don't example using real sentences, not adjectives, (2) the one topic the brand should never joke about and why, (3) three rewrites of this generic sentence in the brand's voice: 'We help businesses grow with our software,' (4) a tagline shortlist — three options in completely different styles with the reasoning for each.",
    icon: Heart,
  },
  {
    id: "11",
    title: "Course That Gets Completed",
    description:
      "Design a curriculum around how people actually learn, not how schools teach",
    category: "creative",
    prompt:
      "You are a learning designer who optimizes for course completion rates, not enrollment numbers. Design a course on [your topic] for [your target learner — describe their current skill level and their goal]. The course must be structured around the forgetting curve: short modules, spaced repetition, and application before theory. Deliver: (1) course promise — what will the student be able to do on day one after finishing, (2) 6 modules with a one-sentence outcome for each (what can they do, not what will they learn), (3) one real-world mini-project per module, (4) the three moments where students typically quit — and what to put at each to keep them going.",
    icon: GraduationCap,
  },
  {
    id: "12",
    title: "Database Schema Auditor",
    description:
      "Design or review a schema with performance, scalability, and migration safety in mind",
    category: "coding",
    prompt:
      "You are a database architect who has been called in to fix schemas that brought down production systems. Design a PostgreSQL schema for [describe your data model and scale]. For every design decision, state the alternative you rejected and why. Deliver: (1) full table definitions with data types, constraints, and indexes, (2) the three queries this schema will run most often — show the execution plan reasoning, (3) the one denormalization you would make and the trade-off it creates, (4) migration SQL that is safe to run on a live database without downtime, (5) the first thing that will break at 10x current scale and how to prevent it now.",
    icon: Code,
  },
];

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "coding", label: "Coding" },
  { value: "writing", label: "Writing" },
  { value: "marketing", label: "Marketing" },
  { value: "analysis", label: "Analysis" },
  { value: "creative", label: "Creative" },
];

const Templates = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchesCategory =
        activeCategory === "all" || t.category === activeCategory;
      const matchesSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  const handleCopy = (template: Template) => {
    navigator.clipboard.writeText(template.prompt);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUse = (template: Template) => {
    router.push(
      `/?prompt=${encodeURIComponent(template.prompt)}&category=${template.category}#prompt-card`,
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto px-4 sm:px-6 pt-20 pb-24">
        {/* Header */}
        <div className="mb-10">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-3">
            Prompt Templates
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse pre-built prompt templates to jumpstart your work. Click
            "Use" to load one directly into the generator.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md input-glow rounded-xl transition-shadow duration-300">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-11 rounded-xl border-border/60 bg-surface-sunken placeholder:text-text-tertiary focus-visible:ring-primary/20"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.value
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((template) => (
            <ExpandableCard key={template.id}>
              <ExpandableCardBody className="card-elevated rounded-2xl p-6 gap-4 group hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <template.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground leading-tight mb-1">
                      {template.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                </div>

                <div className="bg-surface-sunken rounded-xl p-3 text-xs text-muted-foreground leading-relaxed line-clamp-3 font-mono">
                  {template.prompt}
                </div>

                <div className="flex items-center gap-2 mt-auto pt-1">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground capitalize">
                    {template.category}
                  </span>
                  <div className="ml-auto flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(template);
                      }}
                    >
                      {copiedId === template.id ? (
                        <Check className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 px-4 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUse(template);
                      }}
                    >
                      Use
                    </Button>
                  </div>
                </div>
              </ExpandableCardBody>

              <ExpandableCardExpandContainer>
                <ExpandableCardContent>
                  <div className="flex items-center justify-between mb-3 pr-8">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Prompt
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-lg"
                      onClick={() => handleCopy(template)}
                    >
                      {copiedId === template.id ? (
                        <Check className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                  <div className="bg-surface-sunken rounded-xl p-4">
                    <p className="font-mono text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {template.prompt}
                    </p>
                  </div>
                </ExpandableCardContent>
              </ExpandableCardExpandContainer>
            </ExpandableCard>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No templates found. Try a different search or category.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Templates;
