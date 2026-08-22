import { getKnowledgePoints } from "@/lib/storage";
import { LibraryClient } from "@/components/library-client";

export default async function LibraryPage() {
  const points = await getKnowledgePoints();
  return <LibraryClient initialPoints={points} />;
}
