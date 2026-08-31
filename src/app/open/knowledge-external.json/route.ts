import { getKnowledgePoints } from "@/lib/storage";
import { publicPoints } from "@/lib/public-html";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = publicPoints(await getKnowledgePoints());
  return Response.json(items, {
    headers: { "Cache-Control": "public, max-age=60" },
  });
}
