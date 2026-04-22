"use client";

import { cn } from "@/lib/utils";
import { Search, Layers, Zap } from "lucide-react";
import type React from "react";

interface HowItWorksProps extends React.HTMLAttributes<HTMLElement> {
  accentColor?: string;
}

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  accentColor?: string;
}

const StepCard: React.FC<StepCardProps> = ({
  icon,
  title,
  description,
  benefits,
  accentColor = "#7c5cfc",
}) => (
  <div
    className={cn(
      "relative rounded-2xl border bg-white p-6 text-zinc-900 transition-all duration-300 ease-in-out",
      "hover:scale-105 hover:shadow-lg hover:bg-gray-50",
    )}
    style={{ borderColor: "#e4e4e7" }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = accentColor;
      e.currentTarget.style.boxShadow = `0 10px 30px ${accentColor}20`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "#e4e4e7";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <div
      className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
      style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
    >
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-semibold">{title}</h3>
    <p className="mb-6 text-muted-foreground">{description}</p>
    <ul className="space-y-3">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-center gap-3">
          <div
            className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: accentColor }}
            ></div>
          </div>
          <span className="text-muted-foreground">{benefit}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const HowItWorks: React.FC<HowItWorksProps> = ({
  className,
  accentColor = "#7c5cfc",
  ...props
}) => {
  const stepsData = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Describe your task",
      description:
        "Type your goal in plain English. No prompt engineering expertise needed.",
      benefits: [
        "Natural language processing",
        "Contextual understanding",
        "Goal identification",
      ],
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "PromptOps structures it",
      description:
        "The engine decomposes your intent into Goal, Context, Constraints, and Output Format.",
      benefits: [
        "Clear anatomy of a prompt",
        "Precision engineering",
        "Model-agnostic format",
      ],
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Copy, refine, and save",
      description:
        "Deploy immediately, hit Refine for a sharper version, or save to your library.",
      benefits: [
        "One-click export",
        "Iterative refinement",
        "Team sharing capabilities",
      ],
    },
  ];

  return (
    <section
      id="how-it-works"
      className={cn("w-full py-24", className)}
      {...props}
    >
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <div
            style={{
              display: "inline-block",
              background: "rgba(13,148,136,0.08)",
              border: "1px solid rgba(13,148,136,0.22)",
              borderRadius: 20,
              padding: "5px 14px",
              fontSize: 11,
              color: "#0d9488",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            How it works
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-[#09090b] sm:text-5xl mb-4">
            Three steps to a better prompt
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From rough idea to structured, high-output prompt in under 10
            seconds.
          </p>
        </div>

        <div className="relative mx-auto mb-8 w-full max-w-4xl">
          <div
            aria-hidden="true"
            className="absolute left-[16.6667%] top-1/2 h-0.5 w-[66.6667%] -translate-y-1/2"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)`,
            }}
          ></div>
          <div className="relative grid grid-cols-3">
            {stepsData.map((_, index) => (
              <div
                key={index}
                className="flex h-10 w-10 items-center justify-center justify-self-center rounded-xl font-semibold text-white ring-4 ring-background"
                style={{ background: accentColor }}
              >
                0{index + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          {stepsData.map((step, index) => (
            <StepCard
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              benefits={step.benefits}
              accentColor={accentColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
