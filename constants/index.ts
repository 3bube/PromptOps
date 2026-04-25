import { BarChart3, Lightbulb, Mail, Code, Pen } from "lucide-react";
import type { Tour } from "nextstepjs";

// Prompt types for the chat interface
export const PROMPT_TYPES = [
  { label: "Standard", description: "Catch-all for any task" },
  { label: "Research", description: "Analyze, investigate, summarize" },
  { label: "Writing", description: "Blogs, emails, articles & more" },
  { label: "Planning", description: "Explore, strategize, figure it out" },
  {
    label: "Agent",
    description: "Custom GPT, persona, assistant",
    isSelected: true,
  },
  { label: "Image", description: "Pictures, graphics, visuals" },
  { label: "Video", description: "Clips, animations, scenes" },
  { label: "Code", description: "Development, debugging, refactoring" },
  { label: "Automation", description: "Zapier, N8N, Make workflows" },
];

// Plan generation limits (generations per month)
export const PLAN_LIMITS: Record<string, number> = {
  free: 5,
  pro: 500,
  unlimited: Infinity,
};

// Category context for the AI system prompt
export const CATEGORY_CONTEXT: Record<string, string> = {
  coding:
    "The user wants a prompt for a software development task. Focus on technical precision, language/framework specifics, edge cases, and testability.",
  writing:
    "The user wants a prompt for a writing or content creation task. Focus on tone, audience, structure, style, and clarity.",
  marketing:
    "The user wants a prompt for a marketing or copywriting task. Focus on persuasion, target audience, value proposition, and call to action.",
  analysis:
    "The user wants a prompt for a data analysis or research task. Focus on methodology, data sources, metrics, and actionable insights.",
  creative:
    "The user wants a prompt for a creative or imaginative task. Focus on originality, vivid detail, narrative, and unexpected angles.",
  general:
    "The user wants a general-purpose prompt. Focus on clarity, completeness, and actionable instruction.",
};

// File upload configuration
export const FILE_UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
  maxFiles: 5, // Max files per message

  // Accepted file types grouped by category
  acceptedTypes: {
    images: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
    documents: [".pdf", ".txt", ".md", ".doc", ".docx"],
    code: [
      ".js",
      ".ts",
      ".tsx",
      ".jsx",
      ".py",
      ".java",
      ".go",
      ".rs",
      ".cpp",
      ".c",
      ".h",
      ".cs",
      ".php",
      ".rb",
      ".sh",
      ".bash",
    ],
    data: [".json", ".yaml", ".yml", ".xml", ".csv", ".sql"],
    other: [".log", ".env", ".gitignore", ".toml", ".ini"],
    archives: [".zip", ".tar", ".gz", ".tar.gz"],
  },

  // MIME type mappings
  mimeTypes: {
    // Images
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
    // Documents
    "application/pdf": ".pdf",
    "text/plain": ".txt",
    "text/markdown": ".md",
    "application/msword": ".doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      ".docx",
    // Code
    "application/javascript": ".js",
    "text/typescript": ".ts",
    "text/x-python": ".py",
    "text/x-java": ".java",
    "text/x-go": ".go",
    "text/x-rust": ".rs",
    // Data
    "application/json": ".json",
    "application/yaml": ".yaml",
    "text/xml": ".xml",
    "text/csv": ".csv",
    "application/sql": ".sql",
    // Other
    "text/x-log": ".log",
    "text/x-sh": ".sh",
  },
};

// Helper function to get all accepted file extensions
export function getAllAcceptedExtensions(): string[] {
  return Object.values(FILE_UPLOAD_CONFIG.acceptedTypes).flat();
}

// Helper function to get accepted MIME types
export function getAcceptedMimeTypes(): string[] {
  return Object.keys(FILE_UPLOAD_CONFIG.mimeTypes);
}

// Helper function to validate file
export function validateFile(file: File): { valid: boolean; error?: string } {
  const acceptedExtensions = getAllAcceptedExtensions();
  const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

  // Check file size
  if (file.size > FILE_UPLOAD_CONFIG.maxFileSize) {
    return {
      valid: false,
      error: `File size exceeds ${FILE_UPLOAD_CONFIG.maxFileSize / 1024 / 1024}MB limit`,
    };
  }

  // Check file extension
  if (!acceptedExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: `File type ${fileExtension} is not supported`,
    };
  }

  return { valid: true };
}

// Helper function to categorize file by extension
export function categorizeFile(
  fileName: string,
): keyof typeof FILE_UPLOAD_CONFIG.acceptedTypes | null {
  const fileExtension = "." + fileName.split(".").pop()?.toLowerCase();

  for (const [category, extensions] of Object.entries(
    FILE_UPLOAD_CONFIG.acceptedTypes,
  )) {
    if (extensions.includes(fileExtension)) {
      return category as keyof typeof FILE_UPLOAD_CONFIG.acceptedTypes;
    }
  }

  return null;
}

// GPT-4.1 nano pricing: $0.10/MTok input, $0.40/MTok output
export const INPUT_COST_PER_TOKEN = 0.0000001;
export const OUTPUT_COST_PER_TOKEN = 0.0000004;

export const EXAMPLE_PROMPTS = [
  {
    icon: Code,
    label: "Build a REST API",
    desc: "Node.js + Express",
    category: "coding",
  },
  {
    icon: Pen,
    label: "Write a blog post",
    desc: "SEO optimized",
    category: "writing",
  },
  {
    icon: BarChart3,
    label: "Analyze sales data",
    desc: "Quarterly report",
    category: "analysis",
  },
  {
    icon: Lightbulb,
    label: "Brainstorm startup ideas",
    desc: "AI + Healthcare",
    category: "creative",
  },
  {
    icon: Mail,
    label: "Cold email sequence",
    desc: "B2B SaaS outreach",
    category: "marketing",
  },
];

export const COLORS = [
  "#7c5cfc",
  "#22d4c8",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#3b82f6",
];

export const TOURS: Tour[] = [
  {
    tour: "workspace-tour",
    steps: [
      {
        icon: "👋",
        title: "Welcome to your workspace",
        content:
          "This is where you build and refine your prompts. Let's take a quick tour to get you started.",
        selector: undefined,
        side: "bottom",
        showSkip: true,
      },
      {
        icon: "🤖",
        title: "AI Assistant Panel",
        content:
          "Chat with the AI assistant to get suggestions for your prompt blocks. Mention block titles with @ to reference them.",
        selector: '[data-nextstep="assistant-panel"]',
        side: "right",
        showSkip: true,
      },
      {
        icon: "🔧",
        title: "Variables",
        content:
          "Define variables like {{user_name}} to inject dynamic values into your prompts at test time.",
        selector: '[data-nextstep="variables-section"]',
        side: "bottom",
        showSkip: true,
      },
      {
        icon: "📝",
        title: "Prompt Blocks",
        content:
          "Drag and reorder blocks to structure your prompt. Click a block to edit its content.",
        selector: '[data-nextstep="add-block-btn"]',
        side: "top",
        showSkip: true,
      },
      {
        icon: "▶️",
        title: "Test your prompt",
        content:
          "Click Run to test your prompt with actual variables and see the AI response.",
        selector: '[data-nextstep="run-btn"]',
        side: "bottom",
        showSkip: true,
      },
      {
        icon: "📥",
        title: "Export your prompt",
        content: "Export your completed prompt as Markdown for use elsewhere.",
        selector: '[data-nextstep="export-btn"]',
        side: "bottom",
        showSkip: true,
      },
      {
        icon: "📚",
        title: "Version History",
        content:
          "Save snapshots of your prompt and restore previous versions anytime.",
        selector: '[data-nextstep="sidebar"]',
        side: "right",
        showSkip: true,
      },
    ],
  },
];

export const PRICING_PLANS = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    desc: "Get started with prompt generation.",
    limit: "5 generations / month",
    features: ["All 6 categories", "Streaming output", "Prompt history"],
    cta: "Current plan",
    popular: false,
    productId: null,
  },
  {
    name: "Pro",
    price: 9,
    period: "/month",
    desc: "For creators who generate prompts daily.",
    limit: "500 generations / month",
    features: [
      "Everything in Free",
      "500 generations per month",
      "Priority generation",
    ],
    cta: "Upgrade to Pro",
    popular: true,
    productId: process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID,
  },
  {
    name: "Unlimited",
    price: 19,
    period: "/month",
    desc: "No limits, no thinking about it.",
    limit: "Unlimited generations",
    features: [
      "Everything in Pro",
      "Unlimited generations",
      "Early access to new features",
    ],
    cta: "Upgrade to Unlimited",
    popular: false,
    productId: process.env.NEXT_PUBLIC_POLAR_UNLIMITED_PRODUCT_ID,
  },
];
