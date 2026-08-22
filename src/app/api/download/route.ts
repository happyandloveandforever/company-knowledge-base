import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const ALLOWED: Record<string, { file: string; type: string }> = {
  "bjhg-intro.pptx": {
    file: "bjhg-intro.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  "bjhg-intro-outline.md": {
    file: "bjhg-intro-outline.md",
    type: "text/markdown; charset=utf-8",
  },
  "北京化工集团-初次交流.pptx": {
    file: "漂浮方舟_北京化工集团_初次交流.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  "bjhg-intro-global.pptx": {
    file: "bjhg-intro-global.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  "bjhg-intro-global-outline.md": {
    file: "bjhg-intro-global-outline.md",
    type: "text/markdown; charset=utf-8",
  },
  "北京化工集团-国际视野版.pptx": {
    file: "漂浮方舟_北京化工集团_国际视野版.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
};

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("file") || "bjhg-intro.pptx";
  const item = ALLOWED[name];
  if (!item) {
    return NextResponse.json({ error: "文件不存在或未开放下载" }, { status: 404 });
  }
  const filePath = path.join(process.cwd(), "exports", item.file);
  try {
    const buf = await readFile(filePath);
    return new NextResponse(buf, {
      headers: {
        "Content-Type": item.type,
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(item.file)}`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "读取文件失败" }, { status: 500 });
  }
}
