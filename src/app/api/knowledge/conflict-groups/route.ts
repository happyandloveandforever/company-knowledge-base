import { NextRequest, NextResponse } from "next/server";
import { getKnowledgePoints, saveKnowledgePoints } from "@/lib/storage";
import { buildConflictGroups } from "@/lib/conflict-detector";

export async function GET() {
  const points = await getKnowledgePoints();
  const groups = buildConflictGroups(points);

  const enriched = groups.map((g) => ({
    ...g,
    members: g.memberIds
      .map((id) => points.find((p) => p.id === id))
      .filter(Boolean),
  }));

  return NextResponse.json({
    groups: enriched,
    stats: {
      total: groups.length,
      allowed: groups.filter((g) => g.allowedConflict).length,
      pending: groups.filter((g) => !g.allowedConflict).length,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, groupId, memberIds, pointId, note } = body as {
      action: "allow" | "setPreferred" | "assignGroup";
      groupId: string;
      memberIds: string[];
      pointId?: string;
      note?: string;
    };

    if (!action || !groupId || !memberIds?.length) {
      return NextResponse.json({ error: "参数不完整" }, { status: 400 });
    }

    const all = await getKnowledgePoints();
    const idSet = new Set(memberIds);

    if (action === "allow") {
      for (const p of all) {
        if (idSet.has(p.id)) {
          p.conflictAllowed = true;
          p.variantGroupId = groupId;
          if (note) p.conflictNote = note;
        }
      }
    } else if (action === "setPreferred") {
      if (!pointId) {
        return NextResponse.json({ error: "缺少 pointId" }, { status: 400 });
      }
      for (const p of all) {
        if (idSet.has(p.id)) {
          p.isPreferredInGroup = p.id === pointId;
          p.variantGroupId = groupId;
        }
      }
    } else if (action === "assignGroup") {
      for (const p of all) {
        if (idSet.has(p.id)) {
          p.variantGroupId = groupId;
        }
      }
    }

    await saveKnowledgePoints(all);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}
