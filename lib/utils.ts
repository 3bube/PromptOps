import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import posthog from "posthog-js";
import { User } from "@supabase/supabase-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isDevelopement = process.env.NODE_ENV === "development";

export const handleUpgrade = (
  productId: string | null | undefined,
  user: User | null,
  tierName?: string,
) => {
  if (!productId) return;
  posthog.capture("upgrade_clicked", {
    tier: tierName,
    product_id: productId,
    logged_in: !!user,
  });
  if (!user) {
    window.location.href = "/auth?next=/pricing";
    return;
  }
  const email = `&customerEmail=${encodeURIComponent(user.email!)}`;
  window.location.href = `/api/polar/checkout?products=${productId}${email}`;
};
