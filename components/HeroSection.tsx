"use client";

import { useEffect } from "react";
import Link from "next/link";
import { renderCanvas } from "@/components/ui/canvas";
import { DIcons } from "dicons";
import { Button } from "@/components/ui/button";
import { HeroBadge } from "@/components/HeroBadge";

interface HeroSectionProps {
  onScrollToApp: () => void;
}

const HeroSection = ({ onScrollToApp }: HeroSectionProps) => {
  useEffect(() => {
    try {
      renderCanvas();
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <section id="home" className="relative pb-16 overflow-hidden">
      <div className="animation-delay-8 animate-fadeIn mt-10 flex flex-col items-center justify-center px-4 text-center md:mt-20">
        <div className="z-10 mb-6 mt-10 sm:justify-center md:mb-4 md:mt-20">
          <HeroBadge onClick={onScrollToApp} />
        </div>

        <div className="mb-10 mt-4 md:mt-6 z-10 w-full max-w-6xl mx-auto">
          <div className="px-2">
            <div className="border-border relative mx-auto h-full max-w-7xl border p-6 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)] md:px-12 md:py-20">
              <h1 className="flex select-none flex-col px-3 py-2 text-center text-5xl font-semibold leading-none tracking-tight md:flex-col md:text-8xl lg:flex-row lg:text-8xl">
                <DIcons.Plus
                  strokeWidth={4}
                  className="text-muted-foreground/30 absolute -left-5 -top-5 h-10 w-10"
                />
                <DIcons.Plus
                  strokeWidth={4}
                  className="text-muted-foreground/30 absolute -bottom-5 -left-5 h-10 w-10"
                />
                <DIcons.Plus
                  strokeWidth={4}
                  className="text-muted-foreground/30 absolute -right-5 -top-5 h-10 w-10"
                />
                <DIcons.Plus
                  strokeWidth={4}
                  className="text-muted-foreground/30 absolute -bottom-5 -right-5 h-10 w-10"
                />
                Your complete platform for AI Prompts.
              </h1>
              {/* <div className="flex items-center justify-center gap-1 mt-6">
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <p className="text-xs text-green-500 font-medium">
                  Available Now
                </p>
              </div> */}
            </div>
          </div>

          <h1 className="mt-8 text-2xl md:text-2xl">
            Welcome to the creative AI playground!
          </h1>

          <p className="md:text-md mx-auto mb-16 mt-2 max-w-2xl px-6 text-sm text-muted-foreground sm:px-6 md:max-w-4xl md:px-20 lg:text-lg">
            Generate, refine, and execute prompts instantly. Craft structured
            prompts that deliver consistent, high-quality results.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="default" size="lg" onClick={onScrollToApp}>
              Start Creating
            </Button>
            <Button variant="outline" size="lg">
              View Examples
            </Button>
          </div>
        </div>
      </div>
      <canvas
        className="bg-transparent pointer-events-none absolute inset-0 mx-auto w-full h-full z-0"
        id="canvas"
      ></canvas>
    </section>
  );
};

export default HeroSection;
