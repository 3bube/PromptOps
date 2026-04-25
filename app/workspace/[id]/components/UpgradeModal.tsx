import { PRICING_PLANS } from "@/constants";
import { User } from "@supabase/supabase-js";
import { useState } from "react";

interface UpgradeModalProps {
  exceededLimit: any;
  user: User | null;
  handleUpgrade: (
    productId: string,
    user: User | null,
    planName: string,
  ) => void;
  setShowUpgradeModal: (show: boolean) => void;
}

function UpgradeModal({
  exceededLimit,
  user,
  handleUpgrade,
  setShowUpgradeModal,
}: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#e4e4e7] p-8 max-w-2xl w-full mx-4 flex flex-col gap-6">
        <div>
          <div className="w-10 h-10 rounded-xl bg-[#7c5cfc]/10 flex items-center justify-center mb-4">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z"
                fill="#7c5cfc"
                fillOpacity="0.8"
              />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-[#09090b]">
            You've used all {exceededLimit?.limit} generations this month
          </h2>
          <p className="text-sm text-[#71717a] mt-2 leading-relaxed">
            Choose a plan to continue generating prompts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRICING_PLANS.filter((plan) => plan.productId).map((plan) => (
            <button
              key={plan.name}
              onClick={() => {
                setSelectedPlan(plan.name);
                handleUpgrade(plan.productId!, user, plan.name);
              }}
              disabled={!!selectedPlan}
              className="relative flex flex-col gap-4 p-6 border-2 border-[#e4e4e7] rounded-lg hover:border-[#7c5cfc] hover:bg-[#fafafa] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7c5cfc] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Popular
                </div>
              )}
              <div className="text-left">
                <h3 className="text-lg font-semibold text-[#09090b]">
                  {plan.name}
                </h3>
                <p className="text-2xl font-bold text-[#09090b] mt-2">
                  ${plan.price}
                  <span className="text-sm font-normal text-[#71717a]">
                    {plan.period}
                  </span>
                </p>
                <p className="text-sm text-[#71717a] mt-2">{plan.limit}</p>
              </div>
              <ul className="text-sm text-[#71717a] space-y-2 text-left">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="text-[#7c5cfc] mt-1">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              {selectedPlan === plan.name && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80">
                  <div className="w-5 h-5 border-2 border-[#7c5cfc] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowUpgradeModal(false)}
          className="px-4 py-2.5 bg-[#f4f4f5] hover:bg-[#e4e4e7] text-[#71717a] rounded-lg text-sm font-medium transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

export default UpgradeModal;
