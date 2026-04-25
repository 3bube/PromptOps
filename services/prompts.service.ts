import { supabase } from "@/integrations/supabase/client";
import type {
  RecentPrompt,
  Block,
  Variable,
  ChatMessage,
  PromptMeta,
  VersionEntry,
  QuotaData,
} from "@/types";
import { COLORS } from "@/constants";

export class PromptsService {
  async getRecentPrompts(userId: string): Promise<RecentPrompt[]> {
    const { data: prompts } = await (supabase as any)
      .from("workspace_prompts")
      .select("id, name, category, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(8);

    if (!prompts || prompts.length === 0) return [];

    const { data: blocks } = await (supabase as any)
      .from("prompt_blocks")
      .select("prompt_id, title, color, position")
      .in(
        "prompt_id",
        (prompts as Pick<RecentPrompt, "id">[]).map((p) => p.id),
      )
      .order("position");

    const blocksByPrompt: Record<string, Pick<Block, "title" | "color">[]> = {};
    for (const b of (blocks ?? []) as {
      prompt_id: string;
      title: string;
      color: string;
    }[]) {
      if (!blocksByPrompt[b.prompt_id]) blocksByPrompt[b.prompt_id] = [];
      blocksByPrompt[b.prompt_id].push({ title: b.title, color: b.color });
    }

    return (
      prompts as Pick<RecentPrompt, "id" | "name" | "category" | "created_at">[]
    ).map((p) => ({ ...p, blocks: blocksByPrompt[p.id] ?? [] }));
  }

  async createPrompt(
    userId: string,
    description: string,
  ): Promise<{ promptId: string; workspaceId: string }> {
    const trimmed = description.trim();
    if (!trimmed) throw new Error("Description cannot be empty");

    let workspaceId: string;
    const { data: existing } = await (supabase as any)
      .from("workspaces")
      .select("id")
      .eq("user_id", userId)
      .limit(1)
      .single();

    if (existing?.id) {
      workspaceId = existing.id as string;
    } else {
      const { data: created, error } = await (supabase as any)
        .from("workspaces")
        .insert({ user_id: userId, name: "My Workspace" })
        .select("id")
        .single();
      if (error || !created) throw new Error("Could not create workspace");
      workspaceId = (created as { id: string }).id;
    }

    const name = trimmed.length > 60 ? trimmed.slice(0, 57) + "…" : trimmed;

    const { data: prompt, error: promptError } = await (supabase as any)
      .from("workspace_prompts")
      .insert({ workspace_id: workspaceId, user_id: userId, name })
      .select("id")
      .single();

    if (promptError || !prompt) throw new Error("Could not create prompt");

    await (supabase as any).from("prompt_messages").insert({
      prompt_id: (prompt as { id: string }).id,
      user_id: userId,
      role: "user",
      content: trimmed,
    });

    return { promptId: (prompt as { id: string }).id, workspaceId };
  }

  async deletePrompt(promptId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from("workspace_prompts")
      .delete()
      .eq("id", promptId);

    if (error) throw new Error(`Could not delete prompt: ${error.message}`);
  }

  async getWorkspaceData(promptId: string): Promise<{
    meta: PromptMeta;
    blocks: Block[];
    variables: Variable[];
    versions: VersionEntry[];
  }> {
    const [promptRes, blocksRes, varsRes, versionsRes] = await Promise.all([
      (supabase as any)
        .from("workspace_prompts")
        .select("id, name, description, category, workspace_id")
        .eq("id", promptId)
        .single(),
      (supabase as any)
        .from("prompt_blocks")
        .select("id, title, content, color, position")
        .eq("prompt_id", promptId)
        .order("position"),
      (supabase as any)
        .from("prompt_variables")
        .select("id, name, default_value")
        .eq("prompt_id", promptId),
      (supabase as any)
        .from("prompt_versions")
        .select("id, version_num, label, created_at")
        .eq("prompt_id", promptId)
        .order("version_num", { ascending: false })
        .limit(20),
    ]);

    if (promptRes.error) throw promptRes.error;

    return {
      meta: promptRes.data as PromptMeta,
      blocks: (blocksRes.data ?? []).map((b: Block & { position: number }) => ({
        id: b.id,
        title: b.title,
        content: b.content,
        color: b.color,
      })),
      variables: (varsRes.data ?? []).map(
        (v: { name: string; default_value: string }) => ({
          name: v.name,
          value: v.default_value,
        }),
      ),
      versions: (versionsRes.data ?? []) as VersionEntry[],
    };
  }

  async addBlock(promptId: string, position: number): Promise<Block> {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    if (!userId) throw new Error("Not authenticated");

    const color = COLORS[position % COLORS.length];

    const { data, error } = await (supabase as any)
      .from("prompt_blocks")
      .insert({
        prompt_id: promptId,
        user_id: userId,
        title: "New Block",
        content: "",
        color,
        position,
      })
      .select("id, title, content, color, position")
      .single();

    if (error || !data) throw error ?? new Error("Failed to add block");

    const row = data as Block & { position: number };
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      color: row.color,
    };
  }

  async deleteBlock(blockId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from("prompt_blocks")
      .delete()
      .eq("id", blockId);

    if (error) throw error;
  }

  async addVariable(promptId: string, name: string): Promise<void> {
    const trimmed = name.trim().replace(/\s+/g, "_");
    if (!trimmed) throw new Error("Variable name cannot be empty");

    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    if (!userId) throw new Error("Not authenticated");

    const { error } = await (supabase as any).from("prompt_variables").insert({
      prompt_id: promptId,
      user_id: userId,
      name: trimmed,
      default_value: "",
    });

    if (error) throw error;
  }

  async deleteVariable(promptId: string, name: string): Promise<void> {
    const { error } = await (supabase as any)
      .from("prompt_variables")
      .delete()
      .eq("prompt_id", promptId)
      .eq("name", name);

    if (error) throw error;
  }

  async saveVersion(
    promptId: string,
    blocks: Block[],
    variables: Variable[],
    label?: string,
  ): Promise<VersionEntry> {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    if (!userId) throw new Error("Not authenticated");

    const { data: msgs } = await (supabase as any)
      .from("prompt_messages")
      .select("role, content")
      .eq("prompt_id", promptId)
      .order("created_at", { ascending: true });

    const snapshot = {
      blocks,
      variables,
      messages: (msgs ?? []) as ChatMessage[],
    };
    const { data: ver, error } = await (supabase as any)
      .from("prompt_versions")
      .insert({
        prompt_id: promptId,
        user_id: userId,
        label: label ?? null,
        snapshot,
      })
      .select("id, version_num, label, created_at")
      .single();

    if (error || !ver) throw error ?? new Error("Failed to save version");
    return ver as VersionEntry;
  }

  async restoreVersion(promptId: string, versionId: string): Promise<void> {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    if (!userId) throw new Error("Not authenticated");

    const { data, error } = await (supabase as any)
      .from("prompt_versions")
      .select("snapshot")
      .eq("id", versionId)
      .single();

    if (error || !data?.snapshot) throw error ?? new Error("Version not found");

    const snap = data.snapshot as {
      blocks: Block[];
      variables: Variable[];
      messages?: ChatMessage[];
    };

    await (supabase as any)
      .from("prompt_blocks")
      .delete()
      .eq("prompt_id", promptId);

    if (snap.blocks.length > 0) {
      await (supabase as any).from("prompt_blocks").insert(
        snap.blocks.map((b, i) => ({
          ...b,
          prompt_id: promptId,
          user_id: userId,
          position: i,
        })),
      );
    }

    if (snap.variables.length > 0) {
      await (supabase as any).from("prompt_variables").upsert(
        snap.variables.map((v) => ({
          prompt_id: promptId,
          user_id: userId,
          name: v.name,
          default_value: v.value,
        })),
        { onConflict: "prompt_id,name" },
      );
    }

    await (supabase as any)
      .from("prompt_messages")
      .delete()
      .eq("prompt_id", promptId);

    if (snap.messages && snap.messages.length > 0) {
      await (supabase as any).from("prompt_messages").insert(
        snap.messages.map((m) => ({
          prompt_id: promptId,
          user_id: userId,
          role: m.role,
          content: m.content,
        })),
      );
    }
  }

  async persistBlocks(
    promptId: string,
    blocks: Block[],
    variables: Variable[],
  ): Promise<void> {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    if (!userId) throw new Error("Not authenticated");

    if (blocks.length > 0) {
      await (supabase as any).from("prompt_blocks").upsert(
        blocks.map((b, i) => ({
          id: b.id,
          prompt_id: promptId,
          user_id: userId,
          title: b.title,
          content: b.content,
          color: b.color,
          position: i,
        })),
        { onConflict: "id" },
      );
    }

    if (variables.length > 0) {
      await (supabase as any).from("prompt_variables").upsert(
        variables.map((v) => ({
          prompt_id: promptId,
          user_id: userId,
          name: v.name,
          default_value: v.value,
        })),
        { onConflict: "prompt_id,name" },
      );
    }
  }

  async getMessages(promptId: string): Promise<ChatMessage[]> {
    const { data } = await (supabase as any)
      .from("prompt_messages")
      .select("role, content")
      .eq("prompt_id", promptId)
      .order("created_at", { ascending: true });

    return (data ?? []) as ChatMessage[];
  }

  async addMessage(
    promptId: string,
    role: "user" | "assistant",
    content: string,
  ): Promise<void> {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    if (!userId) throw new Error("Not authenticated");

    const { error } = await (supabase as any).from("prompt_messages").insert({
      prompt_id: promptId,
      user_id: userId,
      role,
      content,
    });

    if (error) throw error;
  }

  async fetchQuota(userId: string): Promise<QuotaData> {
    const res = await fetch(`/api/usage?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch quota");
    return res.json();
  }
}
