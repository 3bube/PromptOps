import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/Providers";

const biennale = localFont({
  src: "../public/fonts/Biennale.woff2",
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://promptops.tech";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "PromptOps — AI Prompt Generator for Any Task",
    template: "%s | PromptOps",
  },
  description:
    "Generate expert-quality AI prompts in seconds. PromptOps turns your rough idea into a structured, high-output prompt for coding, writing, marketing, analysis, and more.",
  keywords: [
    "AI prompt generator",
    "prompt engineering tool",
    "ChatGPT prompt generator",
    "AI prompt templates",
    "prompt generation",
    "AI prompts for coding",
    "AI prompts for writing",
    "AI prompts for marketing",
    "best AI prompt generator",
    "prompt builder",
  ],
  authors: [{ name: "PromptOps" }],
  creator: "PromptOps",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "PromptOps",
    title: "Free AI Prompt Generator for ChatGPT, Claude & Gemini | PromptOps",
    description:
      "Turn lazy prompts into expert prompts with the best free AI prompt generator. Get consistent, high-quality prompts for ChatGPT, Claude, and Midjourney.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "PromptOps — AI Prompt Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptOps — AI Prompt Generator for Any Task",
    description:
      "Turn rough ideas into expert-quality AI prompts for coding, writing, marketing, and more. Free to start.",
    images: ["/og.png"],
    creator: "@promptops",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        biennale.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
