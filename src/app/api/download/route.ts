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
  "bjhg-structure-choice.pptx": {
    file: "北化交流_PPT结构选型_给合伙人.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  "bjhg-structure-choice.md": {
    file: "北化交流_PPT结构选型_给合伙人.md",
    type: "text/markdown; charset=utf-8",
  },
  "北化交流-结构选型.pptx": {
    file: "北化交流_PPT结构选型_给合伙人.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  "bjhg-spine-plugins.pptx": {
    file: "北化交流_脊柱加插件_给合伙人.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  "bjhg-spine-plugins.md": {
    file: "北化交流_脊柱加插件_给合伙人.md",
    type: "text/markdown; charset=utf-8",
  },
  "北化交流-脊柱加插件.pptx": {
    file: "北化交流_脊柱加插件_给合伙人.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  "bjhg-final-deck.pptx": {
    file: "漂浮方舟_北京化工集团_初次交流_全插件版.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  "北京化工集团-初次交流-全插件版.pptx": {
    file: "漂浮方舟_北京化工集团_初次交流_全插件版.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  "bjhg-final-deck-p6.pptx": {
    file: "漂浮方舟_北京化工集团_初次交流_全插件版_含P6赛道.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  "北京化工集团-初次交流-含P6赛道.pptx": {
    file: "漂浮方舟_北京化工集团_初次交流_全插件版_含P6赛道.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  "bjhg-invest-deck.pptx": {
    file: "漂浮方舟_北京化工集团_心理健康赛道_投资联动版.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  "北京化工集团-心理健康赛道-投资联动版.pptx": {
    file: "漂浮方舟_北京化工集团_心理健康赛道_投资联动版.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  "bjhg-mental-health-invest.pptx": {
    file: "漂浮方舟_北京化工集团_心理健康产业投资交流_精排版.pptx",
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
  "北京化工集团-心理健康产业投资交流-精排版.pptx": {
    file: "漂浮方舟_北京化工集团_心理健康产业投资交流_精排版.pptx",
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
