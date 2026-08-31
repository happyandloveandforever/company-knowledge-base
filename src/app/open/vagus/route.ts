import { getKnowledgePoints } from "@/lib/storage";
import { PUBLIC_NAV, renderPublicPage, vagusPoints } from "@/lib/public-html";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = vagusPoints(await getKnowledgePoints());
  const html = renderPublicPage({
    title: "漂浮方舟迷走神经与综合干预知识点",
    lead: "含作用机制报告、综合干预专业版、VNS 手段地图，以及库内既有机理/v7 相关卡。给外部 AI 优先抓这一页。",
    extraNav: PUBLIC_NAV,
    items,
  });
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    },
  });
}
