import { NextResponse } from "next/server";
import { getKnowledgePoints } from "@/lib/storage";

export async function GET() {
  const points = await getKnowledgePoints();
  return NextResponse.json({
    ok: true,
    points: points.length,
    timestamp: new Date().toISOString(),
  });
}
