import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { PLAN_LIMITS } from "@/constants/index";

const serverSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  const { data: userRecord } = await serverSupabase
    .from("users")
    .select("plan")
    .eq("id", userId)
    .single();

  const plan = (userRecord?.plan ?? "free") as string;
  const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

  if (limit === Infinity) {
    return Response.json({ plan, limit: null, used: 0, remaining: null });
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await serverSupabase
    .from("prompts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  const used = count ?? 0;
  return Response.json({ plan, limit, used, remaining: limit - used });
}
