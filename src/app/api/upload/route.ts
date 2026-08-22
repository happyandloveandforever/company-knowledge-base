import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import {
  parseDocument,
  inferCategory,
  inferTags,
  inferAudience,
  estimateDuration,
} from "@/lib/parser";
import {
  addKnowledgePoints,
  addSourceFile,
  updateSourceFile,
  getUploadsDir,
} from "@/lib/storage";
import type { KnowledgePoint } from "@/lib/types";
import { generateId } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "请选择文件" }, { status: 400 });
    }

    const filename = file.name;
    const ext = filename.toLowerCase().split(".").pop();
    if (!["pptx", "docx", "doc"].includes(ext || "")) {
      return NextResponse.json(
        { error: "仅支持 .pptx 和 .docx 格式" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sourceId = generateId("SRC");
    const uploadsDir = getUploadsDir();
    const savedPath = path.join(uploadsDir, `${sourceId}-${filename}`);
    await fs.writeFile(savedPath, buffer);

    await addSourceFile({
      id: sourceId,
      filename,
      fileType: ext === "pptx" ? "pptx" : "docx",
      uploadedAt: new Date().toISOString(),
      knowledgePointIds: [],
      status: "processing",
    });

    const chunks = await parseDocument(buffer, filename);
    const now = new Date().toISOString();

    const knowledgePoints: KnowledgePoint[] = chunks.map((chunk) => ({
      id: generateId("KP"),
      title: chunk.title,
      category: inferCategory(filename, chunk.title),
      tags: inferTags(chunk.title, chunk.body),
      audience: inferAudience(chunk.title, chunk.body),
      prerequisites: [],
      summary: chunk.body.slice(0, 120) + (chunk.body.length > 120 ? "…" : ""),
      body: chunk.body,
      examples: [],
      source: {
        file: filename,
        location: chunk.location,
        date: now.split("T")[0],
      },
      scenarios: ["演讲", "培训"],
      durationMin: estimateDuration(chunk.body),
      version: "1.0",
      status: "draft",
      createdAt: now,
      updatedAt: now,
    }));

    await addKnowledgePoints(knowledgePoints);

    await updateSourceFile({
      id: sourceId,
      filename,
      fileType: ext === "pptx" ? "pptx" : "docx",
      uploadedAt: now,
      knowledgePointIds: knowledgePoints.map((kp) => kp.id),
      status: "done",
    });

    return NextResponse.json({
      success: true,
      sourceId,
      filename,
      count: knowledgePoints.length,
      knowledgePoints,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "上传处理失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
