import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { CATEGORY_CONTEXT, PLAN_LIMITS } from "@/constants/index";
import { savePromptHistory } from "@/app/actions/savePromptHistory";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-nano";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = OPENAI_API_KEY ? createOpenAI({ apiKey: OPENAI_API_KEY }) : null;

const serverSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to transform the user's request into a single high-quality prompt that is ready to use in an AI system.

Rules:
1. Output only the final prompt text. Do not include explanations, labels, headings, preambles, or commentary.
2. Do not say things like "Here is a prompt" or "Sure, here you go."
3. Preserve the user's intent exactly. Do not add unrelated assumptions or features.
4. Make the prompt self-contained, specific, and actionable.
5. Write the prompt in direct second-person language where appropriate, using clear instructions such as "You are…", "Your task is…", and "Return…".
6. Include only the context needed to make the prompt effective. Avoid unnecessary verbosity.
7. When relevant, include:
   - the role the AI should adopt
   - the objective or task
   - important background or context
   - input variables or placeholders
   - constraints and edge cases
   - step-by-step instructions if they improve reliability
   - the required output format
   - success criteria or quality standards
8. If the user's request is ambiguous, write the most generally useful prompt possible without asking follow-up questions.
9. If the user specifies a format, tone, audience, or model behavior, enforce it inside the generated prompt.
10. Never output anything except the final prompt text.

Quality standard:
- The final prompt should be complete enough to use immediately.
- It should be clear enough that another AI model can execute it without extra context.
- It should be optimized for accuracy, consistency, and usefulness.`;

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return Response.json(
        { error: "Server configuration error: API key not available" },
        { status: 500 },
      );
    }

    const { category, prompt: userInput, userId } = await request.json();

    if (!category || !userInput) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const categoryContext = CATEGORY_CONTEXT[category];
    if (!categoryContext) {
      return Response.json({ error: "Invalid category" }, { status: 400 });
    }

    // Usage enforcement
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
      model: openai!(OPENAI_MODEL),
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Category context: ${categoryContext}\n\nUser's request: ${userInput}`,
        },
      ],
      temperature: 0.7,
      onFinish: async ({ text, usage }) => {
        if (userId) {
          await savePromptHistory({
            userId,
            category,
            input: userInput,
            generatedPrompt: text,
            inputTokens: usage.inputTokens ?? 0,
            outputTokens: usage.outputTokens ?? 0,
          });
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in generate-prompt:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
