import { NextRequest, NextResponse } from "next/server";
import {
  getKnowledgePoints,
  updateKnowledgePoint,
  deleteKnowledgePoint,
} from "@/lib/storage";

export async function GET() {
  const points = await getKnowledgePoints();
  return NextResponse.json({ knowledgePoints: points });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "缺少 id" }, { status: 400 });
    }
    await updateKnowledgePoint(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "缺少 id" }, { status: 400 });
  }
  const ok = await deleteKnowledgePoint(id);
  return NextResponse.json({ success: ok });
}
