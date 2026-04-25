import type { CardComponentProps } from "nextstepjs";
import { ChevronLeft, ChevronRight } from "lucide-react";

function CustomTourCard({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: CardComponentProps) {
  return (
    <div className="relative flex flex-col gap-5 bg-white rounded-2xl shadow-2xl p-7 w-96 border border-[#e4e4e7]">
      {/* Arrow */}
      <div className="absolute -top-3 -left-3">{arrow}</div>

      {/* Header with icon and title */}
      <div className="flex items-start gap-3">
        {step.icon && (
          <span className="text-3xl shrink-0">
            {typeof step.icon === "string" ? step.icon : step.icon}
          </span>
        )}
        <h3 className="text-xl font-bold text-[#09090b] leading-tight">
          {step.title}
        </h3>
      </div>

      {/* Content */}
      <p className="text-base text-[#525252] leading-relaxed">{step.content}</p>

      {/* Progress bar */}
      <div className="w-full bg-[#e4e4e7] rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-[#7c5cfc] h-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step counter */}
      <div className="text-xs font-medium text-[#a1a1aa]">
        {currentStep + 1} of {totalSteps}
      </div>

      {/* Footer with buttons */}
      <div className="flex items-center justify-between gap-2 pt-2">
        <button
          onClick={skipTour}
          className="text-sm font-medium text-[#a1a1aa] hover:text-[#09090b] transition-colors"
        >
          Skip Tour
        </button>
        <div className="flex items-center gap-1">
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="p-1.5 rounded-lg hover:bg-[#f4f4f5] text-[#71717a] transition-colors"
              title="Previous step"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          {currentStep < totalSteps - 1 && (
            <button
              onClick={nextStep}
              className="p-1.5 rounded-lg bg-[#7c5cfc] hover:bg-[#6a4fe4] text-white transition-colors"
              title="Next step"
            >
              <ChevronRight size={18} />
            </button>
          )}
          {currentStep === totalSteps - 1 && (
            <button
              onClick={nextStep}
              className="px-4 py-1.5 rounded-lg bg-[#7c5cfc] hover:bg-[#6a4fe4] text-white text-sm font-medium transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomTourCard;
