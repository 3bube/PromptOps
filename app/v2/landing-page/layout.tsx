import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Prompt Generator for ChatGPT, Claude & Gemini | PromptOps",
  description:
    "Turn lazy prompts into expert prompts with the best free AI prompt generator. Get consistent, high-quality prompts for ChatGPT, Claude, and Midjourney.",
  keywords: "AI prompt generator, prompt engineering, ChatGPT prompts, free AI tools",
};

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
