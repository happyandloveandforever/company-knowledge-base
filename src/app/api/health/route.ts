import { NextResponse } from "next/server";
import { getKnowledgePoints } from "@/lib/storage";
import { countByLayer, countByUsage, countInternalOnly } from "@/lib/knowledge-layers";

export async function GET() {
  const points = await getKnowledgePoints();
  return NextResponse.json({
    ok: true,
    points: points.length,
    layers: countByLayer(points),
    usages: countByUsage(points),
    internalOnly: countInternalOnly(points),
    timestamp: new Date().toISOString(),
  });
}
