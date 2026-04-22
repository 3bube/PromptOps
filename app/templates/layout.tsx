import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Prompt Templates Library | PromptOps",
  description:
    "Browse our library of pre-built, expert AI prompt templates for coding, marketing, writing, and analysis. Instantly use them with ChatGPT, Claude, and Gemini.",
  keywords: "AI prompt templates, ChatGPT templates, Claude prompts, prompt library",
  alternates: {
    canonical: "/templates",
  },
  openGraph: {
    title: "AI Prompt Templates Library | PromptOps",
    description:
      "Browse our library of pre-built, expert AI prompt templates for coding, marketing, writing, and analysis. Instantly use them with ChatGPT, Claude, and Gemini.",
  },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
