import { NextResponse } from "next/server";
import { getKnowledgePoints } from "@/lib/storage";
import { scanContentConflicts } from "@/lib/conflict-detector";

export async function GET() {
  const points = await getKnowledgePoints();
  const conflicts = scanContentConflicts(points);

  return NextResponse.json({
    conflicts,
    stats: {
      total: points.length,
      withConflicts: Object.keys(conflicts).length,
    },
  });
}
