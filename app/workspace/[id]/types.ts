export interface Block {
  id: string;
  title: string;
  color: string;
  content: string;
}

export interface Variable {
  name: string;
  value: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const BLOCK_COLORS = [
  "#7c5cfc",
  "#22d4c8",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
];
