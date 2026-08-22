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
import { getAIConfig, getAIStatusLabel } from "@/lib/ai-config";
import { splitDenseContentWithAI } from "@/lib/ai-splitter";
import {
  addKnowledgePoints,
  addSourceFile,
  updateSourceFile,
  getUploadsDir,
} from "@/lib/storage";
import type { KnowledgePoint } from "@/lib/types";
import { generateId } from "@/lib/utils";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const mode = (formData.get("mode") as string) || "auto";

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

    const rawChunks = await parseDocument(buffer, filename);
    const aiConfig = getAIConfig();
    const useAI = mode === "ai" || (mode === "auto" && aiConfig.enabled);

    let splitMode: "ai" | "basic" = "basic";
    let aiModel: string | undefined;
    let knowledgePoints: KnowledgePoint[];
    const now = new Date().toISOString();

    if (useAI && aiConfig.enabled) {
      splitMode = "ai";
      aiModel = getAIStatusLabel(aiConfig);

      const aiResults = await splitDenseContentWithAI(aiConfig, rawChunks, filename);

      knowledgePoints = aiResults.map((chunk) => ({
        id: generateId("KP"),
        title: chunk.title,
        category: chunk.category || inferCategory(filename, chunk.title),
        tags: chunk.tags || inferTags(chunk.title, chunk.body),
        audience: chunk.audience || inferAudience(chunk.title, chunk.body),
        prerequisites: [],
        summary: chunk.summary || chunk.body.slice(0, 120) + (chunk.body.length > 120 ? "…" : ""),
        body: chunk.body,
        examples: chunk.examples || [],
        source: {
          file: filename,
          location: chunk.location,
          date: now.split("T")[0],
        },
        scenarios: ["演讲", "培训"],
        durationMin: estimateDuration(chunk.body),
        version: "1.0",
        status: "draft" as const,
        createdAt: now,
        updatedAt: now,
      }));
    } else {
      knowledgePoints = rawChunks.map((chunk) => ({
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
        status: "draft" as const,
        createdAt: now,
        updatedAt: now,
      }));
    }

    if (knowledgePoints.length === 0) {
      await updateSourceFile({
        id: sourceId,
        filename,
        fileType: ext === "pptx" ? "pptx" : "docx",
        uploadedAt: now,
        knowledgePointIds: [],
        status: "error",
        error: "未能提取有效知识点",
      });
      return NextResponse.json({ error: "未能提取有效知识点，请检查文件内容" }, { status: 422 });
    }

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
      rawSlideCount: rawChunks.length,
      splitMode,
      aiModel,
      knowledgePoints,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "上传处理失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
