import KnowledgeDocument from "./KnowledgeDocument";

export default async function Page({ searchParams }:{ searchParams: Promise<{ path?: string }> }) {
  const params = await searchParams;
  const path = params.path || "";
  return <KnowledgeDocument path={path} />;
}