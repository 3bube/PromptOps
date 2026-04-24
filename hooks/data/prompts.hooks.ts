import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PromptsService } from "@/services";
import { qk } from "@/lib/queryKeys";

const service = new PromptsService();

export function useRecentPrompts(userId: string | null) {
  return useQuery({
    queryKey: qk.recentPrompts(userId),
    queryFn: async () => {
      if (!userId) return [];
      return await service.getRecentPrompts(userId);
    },
    enabled: !!userId,
  });
}

export function useCreatePrompt() {
  return useMutation({
    mutationFn: async (params: { userId: string; description: string }) => {
      return await service.createPrompt(params.userId, params.description);
    },
  });
}

export function useDeletePrompt(userId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (promptId: string) => {
      return await service.deletePrompt(promptId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.recentPrompts(userId) });
    },
  });
}

export function useWorkspaceData(promptId: string) {
  return useQuery({
    queryKey: qk.workspaceData(promptId),
    queryFn: async () => {
      return await service.getWorkspaceData(promptId);
    },
    enabled: !!promptId,
  });
}

export function useAddBlock(promptId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (position: number) => {
      return await service.addBlock(promptId, position);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.workspaceBlocks(promptId) });
    },
  });
}

export function useDeleteBlock(promptId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (blockId: string) => {
      return await service.deleteBlock(blockId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.workspaceBlocks(promptId) });
    },
  });
}

export function useAddVariable(promptId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      return await service.addVariable(promptId, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.workspaceVariables(promptId) });
    },
  });
}

export function useDeleteVariable(promptId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      return await service.deleteVariable(promptId, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.workspaceVariables(promptId) });
    },
  });
}

export function useSaveVersion(promptId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      blocks: any[];
      variables: any[];
      label?: string;
    }) => {
      return await service.saveVersion(promptId, params.blocks, params.variables, params.label);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.workspaceVersions(promptId) });
    },
  });
}

export function useRestoreVersion(promptId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (versionId: string) => {
      return await service.restoreVersion(promptId, versionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.workspaceData(promptId) });
    },
  });
}

export function usePersistBlocks(promptId: string) {
  return useMutation({
    mutationFn: async (params: { blocks: any[]; variables: any[] }) => {
      return await service.persistBlocks(promptId, params.blocks, params.variables);
    },
  });
}

export function useMessages(promptId: string) {
  return useQuery({
    queryKey: qk.messages(promptId),
    queryFn: async () => {
      return await service.getMessages(promptId);
    },
    enabled: !!promptId,
  });
}

export function useAddMessage(promptId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { role: "user" | "assistant"; content: string }) => {
      return await service.addMessage(promptId, params.role, params.content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.messages(promptId) });
    },
  });
}
