export interface RecentPrompt {
  id: string;
  name: string;
  category: string | null;
  created_at: string;
  blocks: { title: string; color: string }[];
}

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

export interface PromptMeta {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  workspace_id: string;
}

export interface VersionEntry {
  id: string;
  version_num: number;
  label: string | null;
  created_at: string;
}

export interface QuotaData {
  plan: string;
  limit: number | null;
  used: number;
  remaining: number | null;
}
