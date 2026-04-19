// GPT-4.1 nano pricing: $0.10/MTok input, $0.40/MTok output
const INPUT_COST_PER_TOKEN = 0.0000001; // $0.10 / 1,000,000
const OUTPUT_COST_PER_TOKEN = 0.0000004; // $0.40 / 1,000,000

export function calculateTokenCost(
  inputTokens: number,
  outputTokens: number,
): number {
  return (
    inputTokens * INPUT_COST_PER_TOKEN + outputTokens * OUTPUT_COST_PER_TOKEN
  );
}

export function formatTokenCount(tokens: number): string {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(2)}M`;
  }
  if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(1)}K`;
  }
  return tokens.toString();
}

export function formatCost(cost: number): string {
  return `$${cost.toFixed(4)}`;
}
