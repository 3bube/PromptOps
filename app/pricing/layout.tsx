import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free with 5 AI prompt generations per month. Upgrade to Pro for 500/month or Unlimited for no cap. Cancel anytime.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "PromptOps Pricing — Free, Pro & Unlimited Plans",
    description:
      "Start free with 5 AI prompt generations per month. Upgrade to Pro for 500/month or Unlimited for no cap.",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
