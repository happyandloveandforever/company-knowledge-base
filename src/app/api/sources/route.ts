import { NextRequest, NextResponse } from "next/server";
import { getSourceFiles, deleteSourceFile, getSourceFile } from "@/lib/storage";
import { getSplitQueue, removeFromSplitQueue } from "@/lib/split-queue";

export async function GET() {
  const sources = await getSourceFiles();
  return NextResponse.json({ sources });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const deletePoints = request.nextUrl.searchParams.get("deletePoints") === "1";

  if (!id) {
    return NextResponse.json({ error: "缺少来源 ID" }, { status: 400 });
  }

  const source = await getSourceFile(id);
  if (!source) {
    return NextResponse.json({ error: "来源不存在" }, { status: 404 });
  }

  // 清理拆分队列中关联项
  const queue = await getSplitQueue();
  for (const item of queue) {
    if (item.sourceId === id) {
      await removeFromSplitQueue(item.id);
    }
  }

  const result = await deleteSourceFile(id, { deleteKnowledgePoints: deletePoints });

  if (!result.deleted) {
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    filename: source.filename,
    pointsRemoved: result.pointsRemoved,
  });
}
