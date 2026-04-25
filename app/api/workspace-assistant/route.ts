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

Core responsibilities:
1. **Detect generation requests**: When users ask to "generate", "create", or "add" something (e.g., "generate me a prompt for X" or "add a constraints block"), proactively create new blocks even if they don't exist.
2. **Smart block generation**: Infer appropriate block titles from context. If a user requests "generate constraints for a code reviewer", create a [BLOCK:Constraints] with relevant content. Map user intent to logical block structures.
3. **Block format for updates and new creations**: Use [BLOCK:Title] format for ANY block modification or creation:
   [BLOCK:Title]
   <new content here>
   [/BLOCK]
4. **Respond conversationally**: Explain what you're creating and why, in 1-2 sentences.
5. **Never ask for clarification**: Prompts must process input immediately and produce output. Use {{variable}} placeholders for dynamic content.
6. **Focus on tagged blocks first**: If the user mentions specific blocks, prioritize updating those while also creating new ones if requested.

Block hierarchy for generation context:
- System Instruction: Core behavior & tone
- Goal: What the prompt should accomplish
- Input Spec: What data it accepts
- Constraints: Limitations & rules
- Output Format: Expected response structure
- Examples: Few-shot demonstrations
- Variables: Placeholders like {{context}}, {{tone}}
- Instructions: Step-by-step guidance

When a user wants to generate a prompt for a task, you:
1. Ask yourself: what blocks does this task need?
2. Create each block with sensible, production-ready content
3. Use [BLOCK:Title] for all new blocks`;

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY || !openai) {
      return Response.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    const { messages, blocks, taggedBlocks } = await request.json();

    const blocksContext = blocks
      ?.map(
        (b: { title: string; content: string }) =>
          `[${b.title}]\n${b.content || "(empty)"}`,
      )
      .join("\n\n");

    const taggedContext =
      taggedBlocks?.length > 0
        ? `\n\nThe user has specifically tagged these blocks for this request:\n${taggedBlocks
            .map(
              (b: { title: string; content: string }) =>
                `[${b.title}]\n${b.content || "(empty)"}`,
            )
            .join(
              "\n\n",
            )}\nFocus your response primarily on these tagged blocks. When updating them, use the [BLOCK:Title] format.`
        : "";

    const result = streamText({
      model: openai(OPENAI_MODEL),
      system:
        SYSTEM_PROMPT +
        (blocksContext ? `\n\nCurrent prompt blocks:\n${blocksContext}` : "") +
        taggedContext,
      messages,
      temperature: 0.5,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Workspace assistant error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
