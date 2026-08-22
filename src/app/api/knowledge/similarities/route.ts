import { NextResponse } from "next/server";
import { getKnowledgePoints } from "@/lib/storage";
import { getLibraryAnalysis } from "@/lib/analysis-cache";

export async function GET() {
  const points = await getKnowledgePoints();
  const analysis = await getLibraryAnalysis(points);

  return NextResponse.json({
    similarities: analysis.similarities,
    stats: analysis.stats,
    cached: analysis.cached,
    computedAt: analysis.computedAt,
  });
}
