import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { PLAN_LIMITS } from "@/constants/index";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-nano";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = OPENAI_API_KEY ? createOpenAI({ apiKey: OPENAI_API_KEY }) : null;

const serverSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const SYSTEM_PROMPT = `You are a prompt architect. Given a description of what the user wants to build, generate 3–6 structured prompt blocks that together form a complete, production-ready system prompt.

Output ONLY in this exact format — no preamble, no explanation, nothing else:

§BLOCK§Block Title|#7c5cfc§
Block content here.
§BLOCK§Next Block Title|#22d4c8§
More content here.

Rules:
1. Use these hex colors in order for each block: #7c5cfc, #22d4c8, #f59e0b, #10b981, #ef4444, #3b82f6
2. Choose appropriate block titles for the use case, e.g.: System Instruction, Role, Goal, Context, Constraints, Output Format, Examples, Tone
3. Block content must be detailed, specific, and immediately usable — not generic advice
4. Use {{variable_name}} syntax for values the user would want to customize at runtime
5. Write block content as plain text and bullet points — no markdown headers
6. Each block should have meaningful, non-trivial content (at least 2–3 sentences or bullet points)
7. NEVER write blocks that ask the user for clarification, gather requirements, or request more information — the prompt must process whatever input it receives and produce output immediately
8. Write every block in execution mode: describe what to DO with the input, not how to collect it. Assume the user will provide their request directly and the prompt must handle it
9. If the use case needs varying inputs, use {{variable}} placeholders — never write instructions to ask for those values interactively`;

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY || !openai) {
      return Response.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    const { description, userId } = await request.json();
    if (!description?.trim()) {
      return Response.json({ error: "Missing description" }, { status: 400 });
    }

    // Quota enforcement
    if (userId) {
      const { data: userRecord } = await serverSupabase
        .from("users")
        .select("plan")
        .eq("id", userId)
        .single();

      const plan = (userRecord?.plan ?? "free") as string;
      const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

      if (limit !== Infinity) {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count } = await serverSupabase
          .from("prompts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId)
          .gte("created_at", startOfMonth.toISOString());

        if ((count ?? 0) >= limit) {
          return Response.json(
            { error: "limit_exceeded", plan, limit },
            { status: 429 },
          );
        }
      }
    }

    const result = streamText({
      model: openai(OPENAI_MODEL),
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: description.trim() }],
      temperature: 0.7,
      onFinish: async ({ usage }) => {
        if (userId) {
          const inputTokens = usage?.inputTokens ?? 0;
          const outputTokens = usage?.outputTokens ?? 0;
          const INPUT_COST = 0.0000001;
          const OUTPUT_COST = 0.0000004;
          await serverSupabase.from("prompts").insert({
            user_id: userId,
            category: "general",
            prompt_template: "workspace",
            user_input: { input: description.trim() },
            generated_prompt: "",
            input_tokens: inputTokens,
            output_tokens: outputTokens,
            total_cost: inputTokens * INPUT_COST + outputTokens * OUTPUT_COST,
          });
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Workspace generate error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
