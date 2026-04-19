"use client";

import { Check, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const PRO_PRODUCT_ID = process.env.NEXT_PUBLIC_POLAR_PRO_PRODUCT_ID;
const UNLIMITED_PRODUCT_ID = process.env.NEXT_PUBLIC_POLAR_UNLIMITED_PRODUCT_ID;

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with prompt generation.",
    limit: "5 generations / month",
    features: ["All 6 categories", "Streaming output", "Prompt history"],
    cta: "Current plan",
    ctaDisabled: true,
    productId: null,
    highlight: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For creators who generate prompts daily.",
    limit: "500 generations / month",
    features: [
      "Everything in Free",
      "500 generations per month",
      "Priority generation",
    ],
    cta: "Upgrade to Pro",
    ctaDisabled: false,
    productId: PRO_PRODUCT_ID,
    highlight: true,
  },
  {
    name: "Unlimited",
    price: "$19",
    period: "per month",
    description: "No limits, no thinking about it.",
    limit: "Unlimited generations",
    features: [
      "Everything in Pro",
      "Unlimited generations",
      "Early access to new features",
    ],
    cta: "Upgrade to Unlimited",
    ctaDisabled: false,
    productId: UNLIMITED_PRODUCT_ID,
    highlight: false,
  },
];

const PricingPage = () => {
  const { user } = useAuth();

  const checkoutUrl = (productId: string | null | undefined) => {
    if (!productId) return "#";
    const email = user?.email ? `&customerEmail=${encodeURIComponent(user.email)}` : "";
    return `/api/polar/checkout?products=${productId}${email}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Simple pricing
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Pick your plan
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Start free, upgrade when you need more. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
              className={`relative rounded-3xl p-8 flex flex-col gap-6 ${
                tier.highlight
                  ? "card-elevated glow-primary ring-1 ring-primary/30"
                  : "card-elevated"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Most popular
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {tier.period}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {tier.description}
                </p>
              </div>

              <div className="text-sm font-medium text-primary bg-primary/10 rounded-xl px-3 py-2 text-center">
                {tier.limit}
              </div>

              <ul className="flex flex-col gap-3 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                asChild={!tier.ctaDisabled}
                variant={tier.highlight ? "hero" : "outline"}
                size="lg"
                className="w-full"
                disabled={tier.ctaDisabled}
              >
                {tier.ctaDisabled ? (
                  <span>{tier.cta}</span>
                ) : (
                  <a href={checkoutUrl(tier.productId)}>{tier.cta}</a>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PricingPage;
