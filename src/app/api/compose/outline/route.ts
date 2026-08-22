import { NextRequest, NextResponse } from "next/server";
import { generateOutline, outlineToMarkdown } from "@/lib/outline";
import { getKnowledgePoints, saveOutline } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, audience, durationMin, logicId, knowledgePointIds, format } = body;

    if (!title || !logicId || !knowledgePointIds?.length) {
      return NextResponse.json(
        { error: "请填写演讲标题、选择演讲逻辑和至少一个知识点" },
        { status: 400 }
      );
    }

    const knowledgePoints = await getKnowledgePoints();
    const outline = generateOutline({
      title,
      audience: audience || "通用",
      durationMin: durationMin || 60,
      logicId,
      knowledgePointIds,
      knowledgePoints,
    });

    await saveOutline(outline);

    if (format === "markdown") {
      return new NextResponse(outlineToMarkdown(outline), {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(title)}-大纲.md"`,
        },
      });
    }

    return NextResponse.json({ success: true, outline });
  } catch (err) {
    const message = err instanceof Error ? err.message : "生成大纲失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
