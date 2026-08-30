import { NextResponse } from "next/server";
import { injectHandbookEditor, readHandbookHtml } from "@/lib/handbook";

export const dynamic = "force-dynamic";

export async function GET() {
  const html = injectHandbookEditor(await readHandbookHtml());
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
