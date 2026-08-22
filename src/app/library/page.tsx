import { getKnowledgePoints } from "@/lib/storage";
import { scanAllSimilarities } from "@/lib/similarity";
import { scanContentConflicts, buildConflictGroups } from "@/lib/conflict-detector";
import { parseFilters } from "@/lib/library-filters";
import { LibraryClient } from "@/components/library-client";

export const dynamic = "force-dynamic";

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }

  const initialFilters = parseFilters(params);
  const points = await getKnowledgePoints();
  const similarities = scanAllSimilarities(points);
  const contentConflicts = scanContentConflicts(points);
  const groups = buildConflictGroups(points);

  return (
    <LibraryClient
      initialPoints={points}
      initialSimilarities={similarities}
      initialContentConflicts={contentConflicts}
      initialConflictGroups={groups}
      initialFilters={initialFilters}
    />
  );
}
