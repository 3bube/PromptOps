import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { NextRequest } from "next/server";

// Test execution needs strong instruction-following — use a capable model.
// Set TEST_OPENAI_MODEL in env to override, or OPENAI_MODEL as a global default.
const OPENAI_MODEL =
  process.env.TEST_OPENAI_MODEL ||
  process.env.OPENAI_MODEL ||
  "gpt-4o-mini";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = OPENAI_API_KEY ? createOpenAI({ apiKey: OPENAI_API_KEY }) : null;

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY || !openai) {
      return Response.json({ error: "API key not configured" }, { status: 500 });
    }

    const { compiledPrompt, userMessage } = await request.json();

    if (!compiledPrompt) {
      return Response.json({ error: "Missing compiledPrompt" }, { status: 400 });
    }

    const userInput = userMessage?.trim();

    // Append a hard override to the compiled prompt so it can never ask for clarification,
    // even if it was authored that way. This is a last-resort safety net — the primary
    // enforcement is in the generation prompt (workspace-generate).
    const systemPrompt = `${compiledPrompt}

---
IMPORTANT: Never ask for clarification or more information. If any details are missing or unspecified, invent realistic values and produce complete output immediately.`;

    const testMessage = userInput
      ? userInput
      : "Demonstrate your capabilities with a realistic, fully worked example. Choose your own specific inputs and produce complete output.";

    const result = streamText({
      model: openai(OPENAI_MODEL),
      system: systemPrompt,
      messages: [{ role: "user", content: testMessage }],
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Workspace test error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
