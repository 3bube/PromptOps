import WorkspaceClient from "./components/WorkspaceClient";

export interface WorkspacePageProps {
  searchParams: Promise<{
    prompt?: string;
  }>;
}

export default async function Page({ searchParams }: WorkspacePageProps) {
  const { prompt } = await searchParams;
  return <WorkspaceClient initDescription={prompt ?? ""} />;
}
