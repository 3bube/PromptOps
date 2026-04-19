import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Templates",
  description:
    "Browse 12+ expert-quality AI prompt templates for coding, writing, marketing, analysis, and creative work. Copy or generate directly.",
  alternates: {
    canonical: "/templates",
  },
  openGraph: {
    title: "AI Prompt Templates — PromptOps",
    description:
      "12+ expert-quality AI prompt templates for coding, writing, marketing, analysis, and creative work. Free to use.",
  },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
