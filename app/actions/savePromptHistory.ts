"use server";

import { supabase } from "@/integrations/supabase/client";
import { createClient } from "@supabase/supabase-js";
import { INPUT_COST_PER_TOKEN, OUTPUT_COST_PER_TOKEN } from "@/constants/index";

interface SavePromptParams {
  userId: string;
  category: string;
  input: string;
  generatedPrompt: string;
  inputTokens: number;
  outputTokens: number;
}

export async function savePromptHistory(params: SavePromptParams) {
  const {
    userId,
    category,
    input,
    generatedPrompt,
    inputTokens,
    outputTokens,
  } = params;

  // Calculate cost
  const totalCost =
    inputTokens * INPUT_COST_PER_TOKEN + outputTokens * OUTPUT_COST_PER_TOKEN;

  // Get current date
  const today = new Date().toISOString().split("T")[0];

  try {
    // Create a server-side Supabase client with service role key
    const serverSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    // Insert new prompt record
    const { data: promptData, error: promptError } = await serverSupabase
      .from("prompts")
      .insert({
        user_id: userId,
        prompt_template: category,
        user_input: { input },
        generated_prompt: generatedPrompt,
        category,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        total_cost: totalCost,
      })
      .select()
      .single();

    if (promptError) {
      console.error("Error saving prompt:", promptError);
      throw new Error(`Failed to save prompt: ${promptError.message}`);
    }

    // Update or insert daily token usage
    const { data: existingDaily } = await serverSupabase
      .from("token_usage_daily")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    if (existingDaily) {
      const { error: updateError } = await serverSupabase
        .from("token_usage_daily")
        .update({
          total_input_tokens: existingDaily.total_input_tokens + inputTokens,
          total_output_tokens: existingDaily.total_output_tokens + outputTokens,
          total_cost: existingDaily.total_cost + totalCost,
          request_count: existingDaily.request_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("date", today);

      if (updateError) {
        console.error("Error updating daily stats:", updateError);
      }
    } else {
      const { error: insertError } = await serverSupabase
        .from("token_usage_daily")
        .insert({
          user_id: userId,
          date: today,
          total_input_tokens: inputTokens,
          total_output_tokens: outputTokens,
          total_cost: totalCost,
          request_count: 1,
        });

      if (insertError) {
        console.error("Error inserting daily stats:", insertError);
      }
    }

    return {
      success: true,
      data: {
        ...promptData,
        totalCost,
      },
    };
  } catch (error) {
    console.error("Error in savePromptHistory:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to save prompt history",
    };
  }
}
