import { NextResponse } from "next/server";
import { getKnowledgePoints } from "@/lib/storage";
import { scanAllSimilarities } from "@/lib/similarity";

export async function GET() {
  const points = await getKnowledgePoints();
  const similarities = scanAllSimilarities(points);

  const duplicateCount = Object.values(similarities).filter((matches) =>
    matches.some((m) => m.level === "duplicate")
  ).length;

  const similarCount = Object.values(similarities).filter((matches) =>
    matches.some((m) => m.level === "similar")
  ).length;

  return NextResponse.json({
    similarities,
    stats: {
      total: points.length,
      withSimilar: Object.keys(similarities).length,
      duplicateCount,
      similarCount,
    },
  });
}
