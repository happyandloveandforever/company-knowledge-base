import { NextResponse } from "next/server";
import { generateLibraryHtml } from "@/lib/html-export";
import { getKnowledgePoints } from "@/lib/storage";

export async function GET() {
  const points = await getKnowledgePoints();
  const html = generateLibraryHtml(points);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": 'attachment; filename="知识总库.html"',
    },
  });
}
