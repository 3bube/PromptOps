"use client";

import { useNextStep } from "nextstepjs";
import { useEffect } from "react";

export default function AutoStartTour() {
  const { startNextStep } = useNextStep();

  useEffect(() => {
    const isDone = localStorage.getItem("workspace-tour-done");
    if (!isDone) {
      // Wait for elements to be mounted before checking visibility
      const timer = setTimeout(() => {
        // Check if AI Assistant Panel is visible (lg+ only) before starting tour
        const assistantPanel = document.querySelector(
          '[data-nextstep="assistant-panel"]',
        );
        const isLgScreen = window.matchMedia("(min-width: 1024px)").matches;

        // Only start tour if on lg+ screen or if assistant panel exists
        if (isLgScreen || assistantPanel) {
          startNextStep("workspace-tour");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [startNextStep]);

  return null;
}
