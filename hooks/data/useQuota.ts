"use client";

import { useQuery } from "@tanstack/react-query";

interface QuotaData {
  plan: string;
  limit: number | null;
  used: number;
  remaining: number | null;
}

async function fetchQuota(userId: string): Promise<QuotaData> {
  const res = await fetch(`/api/usage?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch quota");
  return res.json();
}

export function useQuota(userId: string | undefined) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["quota", userId],
    queryFn: () => fetchQuota(userId!),
    enabled: !!userId,
    staleTime: 30_000,
  });

  return {
    plan: data?.plan ?? "free",
    limit: data?.limit ?? null,
    used: data?.used ?? 0,
    remaining: data?.remaining ?? null,
    loading: isLoading,
    refetch,
  };
}
