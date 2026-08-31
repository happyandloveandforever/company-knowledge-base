import { getKnowledgePoints } from "@/lib/storage";
import { PUBLIC_NAV, renderPublicPage, vagusPoints } from "@/lib/public-html";

export const dynamic = "force-dynamic";

export async function GET() {
  const all = await getKnowledgePoints();
  const items = vagusPoints(all);
  const html = renderPublicPage({
    title: "漂浮方舟迷走神经与综合干预知识点",
    lead: `已合并进总库。本页只是迷走/综合干预子集 ${items.length} 条，不是总库。完整可外发见 /open（${all.filter((p) => p.internalOnly !== true).length} 条）。仅内训 ${all.filter((p) => p.internalOnly).length} 条不进公开页。`,
    extraNav: PUBLIC_NAV,
    items,
    total: all.length,
    internalOnly: all.filter((p) => p.internalOnly).length,
  });
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    },
  });
}
