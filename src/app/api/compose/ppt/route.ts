import { NextRequest, NextResponse } from "next/server";
import { generateOutline } from "@/lib/outline";
import { generatePptBuffer } from "@/lib/ppt-export";
import { getKnowledgePoints } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, audience, durationMin, logicId, knowledgePointIds } = body;

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

    const pptBuffer = await generatePptBuffer(outline);
    const filename = `${title.replace(/[^\w\u4e00-\u9fff-]/g, "_")}.pptx`;

    return new NextResponse(new Uint8Array(pptBuffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "生成 PPT 失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
