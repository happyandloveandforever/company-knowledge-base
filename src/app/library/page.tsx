import { getKnowledgePoints } from "@/lib/storage";
import { scanAllSimilarities } from "@/lib/similarity";
import { scanContentConflicts, buildConflictGroups } from "@/lib/conflict-detector";
import { LibraryClient } from "@/components/library-client";

export default async function LibraryPage() {
  const points = await getKnowledgePoints();
  const similarities = scanAllSimilarities(points);
  const contentConflicts = scanContentConflicts(points);
  const conflictGroups = buildConflictGroups(points);

  return (
    <LibraryClient
      initialPoints={points}
      initialSimilarities={similarities}
      initialContentConflicts={contentConflicts}
      initialConflictGroups={conflictGroups}
    />
  );
}
