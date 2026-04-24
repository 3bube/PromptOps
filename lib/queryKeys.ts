const RECENT_PROMPTS_KEY = "recent-prompts";
const WORKSPACE_DATA_KEY = "workspace-data";
const MESSAGES_KEY = "messages";

export const qk = {
  recentPrompts: (userId: string | null) => [RECENT_PROMPTS_KEY, userId],
  workspaceData: (promptId: string) => [WORKSPACE_DATA_KEY, promptId],
  workspaceBlocks: (promptId: string) => [WORKSPACE_DATA_KEY, promptId, "blocks"],
  workspaceVariables: (promptId: string) => [WORKSPACE_DATA_KEY, promptId, "variables"],
  workspaceVersions: (promptId: string) => [WORKSPACE_DATA_KEY, promptId, "versions"],
  messages: (promptId: string) => [MESSAGES_KEY, promptId],
};
