import WorkspaceClient from "./components/WorkspaceClient";

export interface WorkspacePageProps {
  searchParams: {
    prompt?: string;
  };
}

export default async function Page({ searchParams }: WorkspacePageProps) {
  const initDescription = searchParams.prompt ?? "";
  return <WorkspaceClient initDescription={initDescription} />;
}
