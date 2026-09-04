import { getPatents, getPatentSources } from "@/lib/storage";
import { PatentsClient } from "@/components/patents-client";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function PatentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const kind = typeof sp.kind === "string" ? sp.kind : "";
  const cluster = typeof sp.cluster === "string" ? sp.cluster : "";
  const risk = typeof sp.risk === "string" ? sp.risk : "";
  const lifecycle = typeof sp.lifecycle === "string" ? sp.lifecycle : "";
  const group = typeof sp.group === "string" ? sp.group : "";
  const q = typeof sp.q === "string" ? sp.q : "";

  const [patents, sources] = await Promise.all([getPatents(), getPatentSources()]);

  return (
    <PatentsClient
      initialPatents={patents}
      sourceCount={sources.length}
      initialKind={kind}
      initialCluster={cluster}
      initialRisk={risk}
      initialLifecycle={lifecycle}
      initialGroup={group}
      initialQuery={q}
    />
  );
}
