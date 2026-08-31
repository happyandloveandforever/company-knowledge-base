import { getKnowledgePoints } from "@/lib/storage";
import { PUBLIC_NAV, publicPoints, renderPublicPage } from "@/lib/public-html";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = publicPoints(await getKnowledgePoints());
  const html = renderPublicPage({
    title: "公司知识库（可外发，只读网页）",
    lead: "这是 HTML 网页，不是 GitHub 仓库。请直接抓取本页正文。internalOnly 内训卡已排除。",
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
