import { Webhooks } from "@polar-sh/nextjs";
import { createClient } from "@supabase/supabase-js";
import { getPostHogClient } from "@/lib/posthog-server";

const serverSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const PRODUCT_PLAN_MAP: Record<string, string> = {
  [process.env.POLAR_PRO_PRODUCT_ID!]: "pro",
  [process.env.POLAR_UNLIMITED_PRODUCT_ID!]: "unlimited",
};

async function setPlan(
  customerEmail: string,
  plan: string,
  polarCustomerId?: string,
) {
  await serverSupabase
    .from("users")
    .update({
      plan,
      ...(polarCustomerId ? { polar_customer_id: polarCustomerId } : {}),
    })
    .eq("email", customerEmail);
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onSubscriptionActive: async ({ data }) => {
    const plan = PRODUCT_PLAN_MAP[data.productId] ?? "free";
    await setPlan(data.customer.email, plan, data.customerId);
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: data.customer.email,
      event: "subscription_activated",
      properties: { plan, product_id: data.productId, customer_id: data.customerId },
    });
    await posthog.shutdown();
  },
  onSubscriptionUpdated: async ({ data }) => {
    const plan = PRODUCT_PLAN_MAP[data.productId] ?? "free";
    await setPlan(data.customer.email, plan);
  },
  onSubscriptionCanceled: async ({ data }) => {
    await setPlan(data.customer.email, "free");
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: data.customer.email,
      event: "subscription_canceled",
      properties: { reason: "canceled", customer_id: data.customerId },
    });
    await posthog.shutdown();
  },
  onSubscriptionRevoked: async ({ data }) => {
    await setPlan(data.customer.email, "free");
    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: data.customer.email,
      event: "subscription_canceled",
      properties: { reason: "revoked", customer_id: data.customerId },
    });
    await posthog.shutdown();
  },
});
