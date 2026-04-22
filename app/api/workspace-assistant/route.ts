import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { NextRequest } from "next/server";

const OPENAI_MODEL =
  process.env.ASSISTANT_OPENAI_MODEL ||
  process.env.OPENAI_MODEL ||
  "gpt-4o-mini";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = OPENAI_API_KEY ? createOpenAI({ apiKey: OPENAI_API_KEY }) : null;

const SYSTEM_PROMPT = `You are a prompt engineering assistant. The user has a prompt composed of structured blocks (System Instruction, Goal, Constraints, Output Format, etc.) and is asking you to help refine it.

When the user asks you to modify, improve, or refine specific blocks:
1. Respond conversationally and concisely — explain what you changed and why.
2. If you are updating a block's content, include it clearly marked like:
   [BLOCK:Title]
   <new content here>
   [/BLOCK]
3. Only include block updates when the user explicitly asks to change the prompt.
4. Be specific and engineering-focused. Avoid generic advice.
5. Keep replies under 150 words unless asked for more detail.
6. Never write or suggest block content that asks the end-user for clarification or gathers requirements interactively — prompts must process input immediately and produce output. Use {{variable}} placeholders for things that vary, never interactive questioning.`;

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY || !openai) {
      return Response.json({ error: "API key not configured" }, { status: 500 });
    }

    const { messages, blocks, taggedBlocks } = await request.json();

    const blocksContext = blocks
      ?.map((b: { title: string; content: string }) => `[${b.title}]\n${b.content || "(empty)"}`)
      .join("\n\n");

    const taggedContext = taggedBlocks?.length > 0
      ? `\n\nThe user has specifically tagged these blocks for this request:\n${
          taggedBlocks
            .map((b: { title: string; content: string }) => `[${b.title}]\n${b.content || "(empty)"}`)
            .join("\n\n")
        }\nFocus your response primarily on these tagged blocks. When updating them, use the [BLOCK:Title] format.`
      : "";

    const result = streamText({
      model: openai(OPENAI_MODEL),
      system: SYSTEM_PROMPT + (blocksContext ? `\n\nCurrent prompt blocks:\n${blocksContext}` : "") + taggedContext,
      messages,
      temperature: 0.5,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Workspace assistant error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
