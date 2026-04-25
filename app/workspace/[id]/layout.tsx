"use client";

import { NextStep } from "nextstepjs";
import { useState, useEffect } from "react";
import CustomTourCard from "./components/CustomTourCard";
import { TOURS } from "@/constants";
import AutoStartTour from "./components/AutoStartTour";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [filteredTours, setFilteredTours] = useState(TOURS);

  const markDone = () => {
    localStorage.setItem("workspace-tour-done", "1");
  };

  // Filter out steps that target elements that don't exist (client-side only)
  useEffect(() => {
    const filtered = TOURS.map((tour) => ({
      ...tour,
      steps: tour.steps.filter((step) => {
        if (!step.selector) return true;
        const element = document.querySelector(step.selector);
        return element !== null;
      }),
    }));
    setFilteredTours(filtered);
  }, []);

  return (
    <NextStep
      steps={filteredTours}
      onComplete={markDone}
      onSkip={markDone}
      shadowOpacity="0.4"
      cardTransition={{ ease: "easeInOut", duration: 0.3 }}
      cardComponent={CustomTourCard}
      noInViewScroll={true}
    >
      <AutoStartTour />
      {children}
    </NextStep>
  );
}
