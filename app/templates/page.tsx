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
    title: "REST API Builder",
    description:
      "Generate a complete REST API with routes, controllers, and validation",
    category: "coding",
    prompt:
      "Build a REST API with Express.js that includes CRUD operations, input validation with Zod, error handling middleware, and JWT authentication. Include proper TypeScript types and folder structure.",
    icon: Code,
  },
  {
    id: "2",
    title: "React Component Generator",
    description: "Create reusable React components with TypeScript and tests",
    category: "coding",
    prompt:
      "Create a reusable React component with TypeScript props interface, proper accessibility attributes, responsive design with Tailwind CSS, and unit tests using React Testing Library.",
    icon: Code,
  },
  {
    id: "3",
    title: "SEO Blog Post",
    description: "Write an SEO-optimized blog post with meta descriptions",
    category: "writing",
    prompt:
      "Write a 1500-word SEO-optimized blog post. Include a compelling headline, meta description under 160 characters, proper H2/H3 structure, internal linking suggestions, and a clear CTA. Target keyword density of 1-2%.",
    icon: Pen,
  },
  {
    id: "4",
    title: "Technical Documentation",
    description: "Generate comprehensive technical docs for your project",
    category: "writing",
    prompt:
      "Write technical documentation that includes an overview, getting started guide, API reference with code examples, configuration options, troubleshooting section, and FAQ. Use clear, concise language suitable for developers.",
    icon: FileText,
  },
  {
    id: "5",
    title: "Sales Data Analysis",
    description: "Analyze quarterly sales data with actionable insights",
    category: "analysis",
    prompt:
      "Analyze the provided sales data. Include: revenue trends, top-performing products/regions, year-over-year comparisons, seasonal patterns, customer segmentation insights, and 3 actionable recommendations backed by the data.",
    icon: BarChart3,
  },
  {
    id: "6",
    title: "Competitor Analysis",
    description: "Deep-dive competitor research with strategic recommendations",
    category: "analysis",
    prompt:
      "Conduct a competitor analysis covering: market positioning, pricing strategy, product features comparison, SWOT analysis, content strategy evaluation, and strategic recommendations for differentiation.",
    icon: Briefcase,
  },
  {
    id: "7",
    title: "Product Launch Email Sequence",
    description: "Multi-email campaign for launching a new product",
    category: "marketing",
    prompt:
      "Create a 5-email product launch sequence: teaser, announcement, features deep-dive, social proof, and last-chance. Include subject lines with A/B variants, preheader text, and clear CTAs for each email. Tone: exciting but not pushy.",
    icon: Mail,
  },
  {
    id: "8",
    title: "Social Media Campaign",
    description: "Full social media content plan with captions and hashtags",
    category: "marketing",
    prompt:
      "Create a 2-week social media campaign plan covering Instagram, Twitter/X, and LinkedIn. Include: daily post topics, caption copy, relevant hashtags, optimal posting times, and engagement prompts. Align with brand voice: professional yet approachable.",
    icon: Megaphone,
  },
  {
    id: "9",
    title: "Startup Idea Validator",
    description: "Evaluate and refine a startup concept systematically",
    category: "creative",
    prompt:
      "Evaluate this startup idea by analyzing: problem-solution fit, target market size (TAM/SAM/SOM), competitive landscape, unique value proposition, potential revenue models, key risks, and a lean MVP scope. Provide a go/no-go recommendation with reasoning.",
    icon: Lightbulb,
  },
  {
    id: "10",
    title: "Brand Story Creator",
    description: "Craft a compelling brand narrative and messaging framework",
    category: "creative",
    prompt:
      "Create a brand story framework including: origin story, mission and vision statements, brand values (3-5), brand voice guidelines with do/don't examples, elevator pitch (30 seconds), and tagline options (3 variants).",
    icon: Heart,
  },
  {
    id: "11",
    title: "Course Curriculum Designer",
    description: "Design a structured online course with modules and lessons",
    category: "creative",
    prompt:
      "Design an online course curriculum with: learning objectives, 6-8 modules with 3-5 lessons each, key takeaways per module, suggested assignments/exercises, assessment rubric, and recommended supplementary resources.",
    icon: GraduationCap,
  },
  {
    id: "12",
    title: "Database Schema Designer",
    description: "Design a normalized database schema with relationships",
    category: "coding",
    prompt:
      "Design a normalized PostgreSQL database schema. Include: table definitions with proper data types, primary/foreign keys, indexes for common queries, junction tables for many-to-many relationships, and migration SQL. Follow 3NF normalization.",
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
      `/?prompt=${encodeURIComponent(template.prompt)}&category=${template.category}`,
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-24">
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
            <div
              key={template.id}
              className="card-elevated rounded-2xl p-6 flex flex-col gap-4 group hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
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
                    onClick={() => handleCopy(template)}
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
                    onClick={() => handleUse(template)}
                  >
                    Use
                  </Button>
                </div>
              </div>
            </div>
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
