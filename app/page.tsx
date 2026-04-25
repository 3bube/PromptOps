"use client";

import React, { useState, useEffect } from "react";
import { Hero, ProductMockup } from "@/components/v2/HeroSection";
import { Header } from "@/components/ui/header-2";
import {
  DemoMockup,
  UseCases,
  SocialProof,
  Pricing,
  FAQ,
  CTABanner,
  Footer,
} from "@/components/v2/sections";
import { HowItWorks } from "@/components/ui/how-it-works";
import { Features } from "@/components/blocks/features-8";

const TWEAK_DEFAULTS = {
  accentColor: "#7c5cfc",
  showPricing: true,
};

export default function LandingPage() {
  const [tweaks, setTweaks] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("promptops-tweaks");
        return saved
          ? { ...TWEAK_DEFAULTS, ...JSON.parse(saved) }
          : TWEAK_DEFAULTS;
      } catch {
        return TWEAK_DEFAULTS;
      }
    }
    return TWEAK_DEFAULTS;
  });
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data?.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", handler);
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    }
    return () => window.removeEventListener("message", handler);
  }, []);

  const updateTweak = (key: string, val: any) => {
    const next = { ...tweaks, [key]: val };
    setTweaks(next);
    localStorage.setItem("promptops-tweaks", JSON.stringify(next));
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        { type: "__edit_mode_set_keys", edits: next },
        "*",
      );
    }
  };

  const a = tweaks.accentColor;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `

        html { scroll-behavior: smooth; background: #141516; }
        body { font-family: "Biennale", sans-serif; background: #141516; color: #09090b; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; overflow-x: hidden; margin: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #141516; }
        ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 3px; }
        ::selection { background: rgba(124, 92, 252, 0.3); }
        :focus-visible { outline: 2px solid #7c5cfc; outline-offset: 2px; border-radius: 4px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes blurIn { from { filter: blur(14px); opacity: 0; } to { filter: blur(0px); opacity: 1; } }
        .blur-in { animation: blurIn 1.1s cubic-bezier(0.22, 0.68, 0, 1) both; animation-delay: 0.55s; display: inline-block; }
        .fade-up { animation: fadeUp 0.65s cubic-bezier(0.22, 0.68, 0, 1.2) both; }
        .fade-up-1 { animation-delay: 0.12s; }
        .fade-up-2 { animation-delay: 0.22s; }
        .fade-up-3 { animation-delay: 0.32s; }
        .fade-up-4 { animation-delay: 0.44s; }
        .float { animation: float 7s ease-in-out infinite; }
        button, a { font-family: "Biennale", sans-serif; }
        select { appearance: none; outline: none; cursor: pointer; }
      `,
        }}
      />
      <div
        style={{
          background: "#141516",
          color: "#09090b",
          minHeight: "100vh",
          fontFamily: '"Biennale", sans-serif',
        }}
      >
        <div
          style={{
            background: "#fafafa",
            borderBottomLeftRadius: 80,
            borderBottomRightRadius: 80,
            position: "relative",
            zIndex: 10,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          }}
        >
          <Header />
          <main>
            <Hero accentColor={a} />
            <HowItWorks accentColor={a} />
            <Features accentColor={a} />
            <DemoMockup accentColor={a} />
            <UseCases accentColor={a} />
            <SocialProof accentColor={a} />
            <Pricing accentColor={a} />
            <FAQ accentColor={a} />
            <CTABanner accentColor={a} />
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}
