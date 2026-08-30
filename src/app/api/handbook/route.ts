import { NextRequest, NextResponse } from "next/server";
import {
  HANDBOOK_FILENAME,
  HANDBOOK_ID,
  HANDBOOK_TITLE,
  readHandbookHtml,
  saveHandbookBook,
} from "@/lib/handbook";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const html = await readHandbookHtml();
  if (request.nextUrl.searchParams.get("download") === "1") {
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(HANDBOOK_FILENAME)}"`,
        "Cache-Control": "no-store",
      },
    });
  }
  return NextResponse.json({
    id: HANDBOOK_ID,
    title: HANDBOOK_TITLE,
    bytes: Buffer.byteLength(html, "utf-8"),
  });
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as { bookHtml?: string };
    if (!body?.bookHtml || typeof body.bookHtml !== "string") {
      return NextResponse.json({ error: "缺少手册正文" }, { status: 400 });
    }
    await saveHandbookBook(body.bookHtml);
    return NextResponse.json({ success: true, title: HANDBOOK_TITLE });
  } catch (error) {
    const message = error instanceof Error ? error.message : "保存失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
