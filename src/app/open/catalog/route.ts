import { getKnowledgePoints } from "@/lib/storage";
import { renderCatalogPage } from "@/lib/public-html";

export const dynamic = "force-dynamic";

export async function GET() {
  const all = await getKnowledgePoints();
  return new Response(renderCatalogPage(all), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=60",
    },
  });
}
