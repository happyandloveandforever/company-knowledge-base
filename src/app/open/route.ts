import { getKnowledgePoints } from "@/lib/storage";
import { PUBLIC_NAV, publicPoints, renderPublicPage } from "@/lib/public-html";

export const dynamic = "force-dynamic";

export async function GET() {
  const all = await getKnowledgePoints();
  const items = publicPoints(all);
  const html = renderPublicPage({
    title: "公司知识库（可外发，只读网页）",
    lead: `总库已合并 ${all.length} 条，不是没合并。本页 ${items.length} 条可外发（含迷走机制 KP-VGMECH 22、综合干预 KP-CIS 18、VNS 地图 KP-VNSMAP 16、罗森堡读本 KP-PVB 20）。仅内训 ${all.length - items.length} 条不进本页（培训教材 KP-TRN + 内部原子库 KP-ATOM + 疗法叙事 KP-RX）。`,
    extraNav: PUBLIC_NAV,
    items,
    total: all.length,
    internalOnly: all.length - items.length,
    inventoryAll: all,
  });
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    },
  });
}
