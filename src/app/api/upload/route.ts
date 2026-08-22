import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import {
  extractDocument,
  isSupportedExtension,
  normalizeFileType,
  getFileExtension,
} from "@/lib/document-extractor";
import {
  inferCategory,
  inferTags,
  inferAudience,
  estimateDuration,
} from "@/lib/parser";
import { getAIConfig, getAIStatusLabel, isClaudeProvider } from "@/lib/ai-config";
import { splitDenseContentWithAI } from "@/lib/ai-splitter";
import {
  addKnowledgePoints,
  addSourceFile,
  updateSourceFile,
  getUploadsDir,
  getKnowledgePoints,
} from "@/lib/storage";
import { addToSplitQueue } from "@/lib/split-queue";
import type { KnowledgePoint } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { checkImportConflicts } from "@/lib/similarity";
import { checkImportContentConflicts } from "@/lib/conflict-detector";

export const runtime = "nodejs";
export const maxDuration = 300;

type SourceFileType = "pptx" | "docx" | "pdf" | "md" | "html" | "txt" | "image" | "other";

function mapFileTypeForSource(ext: string): SourceFileType {
  const t = normalizeFileType(ext);
  if (t === "pptx" || t === "docx") return t;
  if (t === "pdf") return "pdf";
  if (t === "md") return "md";
  if (t === "html") return "html";
  if (t === "txt") return "txt";
  if (["png", "jpg", "jpeg", "webp"].includes(t)) return "image";
  return "other";
}

type SplitChunk = {
  title: string;
  body: string;
  location?: string;
  summary?: string;
  category?: string;
  tags?: string[];
  audience?: string[];
  examples?: string[];
};

function toKnowledgePoints(chunks: SplitChunk[], filename: string, now: string): KnowledgePoint[] {
  return chunks.map((chunk) => ({
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
}

function basicChunksToResults(
  rawChunks: { title: string; body: string; location?: string }[]
): SplitChunk[] {
  return rawChunks.map((chunk) => ({
    ...chunk,
    summary: chunk.body.slice(0, 120),
    category: "未分类",
    tags: ["通用", "基础拆分"],
    audience: ["通用"],
    examples: [] as string[],
  }));
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const mode = (formData.get("mode") as string) || "claude";

    if (!file) {
      return NextResponse.json({ error: "请选择文件" }, { status: 400 });
    }

    const filename = file.name;
    const ext = getFileExtension(filename);

    if (!isSupportedExtension(ext)) {
      return NextResponse.json(
        {
          error: `不支持 .${ext} 格式。支持：.pptx .docx .pdf .md .html .txt .png .jpg .jpeg .webp`,
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sourceId = generateId("SRC");
    const queueId = generateId("SQ");
    const uploadsDir = getUploadsDir();
    const savedPath = path.join(uploadsDir, `${sourceId}-${filename}`);
    await fs.writeFile(savedPath, buffer);

    const fileType = mapFileTypeForSource(ext);
    const now = new Date().toISOString();

    await addSourceFile({
      id: sourceId,
      filename,
      fileType,
      uploadedAt: now,
      knowledgePointIds: [],
      status: "processing",
    });

    const extracted = await extractDocument(buffer, filename);
    const rawChunks = extracted.chunks;

    if (rawChunks.length === 0) {
      await updateSourceFile({
        id: sourceId,
        filename,
        fileType,
        uploadedAt: now,
        knowledgePointIds: [],
        status: "error",
        error: "未能提取有效内容",
      });
      return NextResponse.json({ error: "未能提取有效内容" }, { status: 422 });
    }

    const aiConfig = getAIConfig();
    const wantClaude = mode === "claude" || mode === "auto" || mode === "ai";
    const useAI = wantClaude && aiConfig.enabled;
    const forceQueue = mode === "queue" || (wantClaude && !aiConfig.enabled);

    // 无 API Key：加入 Claude Agent 待拆分队列
    if (forceQueue) {
      await addToSplitQueue({
        id: queueId,
        sourceId,
        filename,
        fileType: ext,
        savedPath,
        extractedChunks: rawChunks,
        rawText: extracted.rawText,
        hasImage: !!extracted.imageBase64,
        uploadedAt: now,
        status: "pending",
        note: "等待 Cursor Claude Agent 精细拆分",
      });

      await updateSourceFile({
        id: sourceId,
        filename,
        fileType,
        uploadedAt: now,
        knowledgePointIds: [],
        status: "pending_claude",
        splitMode: "queued",
        note: `已加入 Claude 拆分队列（${queueId}）。请在 Cursor 对话中说「处理拆分队列」`,
      });

      return NextResponse.json({
        success: true,
        queued: true,
        queueId,
        sourceId,
        filename,
        fileType: ext,
        rawChunkCount: rawChunks.length,
        message:
          "文件已保存并加入 Claude 精细拆分队列。在 Cursor 对话中说「处理拆分队列」或把文件发给我继续拆分。",
      });
    }

    let splitMode: "claude-api" | "ai" | "basic" = "basic";
    let aiModel: string | undefined;
    let results: ReturnType<typeof basicChunksToResults>;

    if (useAI) {
      splitMode = isClaudeProvider(aiConfig) ? "claude-api" : "ai";
      aiModel = getAIStatusLabel(aiConfig);

      const vision = extracted.imageBase64
        ? { base64: extracted.imageBase64, mediaType: extracted.imageMediaType || "image/png" }
        : undefined;

      results = await splitDenseContentWithAI(aiConfig, rawChunks, filename, vision);
    } else {
      results = basicChunksToResults(rawChunks);
    }

    let knowledgePoints = toKnowledgePoints(results, filename, now);

    if (knowledgePoints.length === 0) {
      await updateSourceFile({
        id: sourceId,
        filename,
        fileType,
        uploadedAt: now,
        knowledgePointIds: [],
        status: "error",
        error: "未能生成有效知识点",
      });
      return NextResponse.json({ error: "未能生成有效知识点" }, { status: 422 });
    }

    const existingPoints = await getKnowledgePoints();
    const conflicts = checkImportConflicts(knowledgePoints, existingPoints);
    const contentConflicts = checkImportContentConflicts(knowledgePoints, existingPoints);

    knowledgePoints = knowledgePoints.map((kp) => {
      const simMatches = conflicts[kp.id];
      const contMatches = contentConflicts[kp.id];
      let tags = kp.tags.filter(
        (t) => !["可能重复", "高度重复", "内容冲突"].includes(t)
      );

      if (simMatches?.some((m) => m.level === "duplicate")) tags.unshift("高度重复");
      else if (simMatches?.length) tags.unshift("可能重复");
      if (contMatches?.length) tags.unshift("内容冲突");

      return { ...kp, tags };
    });

    await addKnowledgePoints(knowledgePoints);

    await updateSourceFile({
      id: sourceId,
      filename,
      fileType,
      uploadedAt: now,
      knowledgePointIds: knowledgePoints.map((kp) => kp.id),
      status: "done",
      splitMode,
    });

    return NextResponse.json({
      success: true,
      queued: false,
      sourceId,
      filename,
      count: knowledgePoints.length,
      rawSlideCount: rawChunks.length,
      splitMode,
      aiModel,
      conflictCount: Object.keys(conflicts).length,
      contentConflictCount: Object.keys(contentConflicts).length,
      knowledgePoints,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "上传处理失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
