"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Sparkles, Cpu } from "lucide-react";
import type { KnowledgePoint } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface UploadResult {
  filename: string;
  count: number;
  rawSlideCount?: number;
  splitMode?: "ai" | "basic";
  aiModel?: string;
  conflictCount?: number;
  contentConflictCount?: number;
  knowledgePoints: KnowledgePoint[];
}

interface AIStatus {
  enabled: boolean;
  label: string;
  provider: string;
  model: string;
}

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<UploadResult[]>([]);
  const [aiStatus, setAiStatus] = useState<AIStatus | null>(null);
  const [splitMode, setSplitMode] = useState<"auto" | "ai" | "basic">("auto");

  useEffect(() => {
    fetch("/api/ai/status")
      .then((r) => r.json())
      .then(setAiStatus)
      .catch(() => null);
  }, []);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setError("");
    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mode", splitMode);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "上传失败");
          continue;
        }

        setResults((prev) => [
          {
            filename: data.filename,
            count: data.count,
            rawSlideCount: data.rawSlideCount,
            splitMode: data.splitMode,
            aiModel: data.aiModel,
            conflictCount: data.conflictCount,
            contentConflictCount: data.contentConflictCount,
            knowledgePoints: data.knowledgePoints,
          },
          ...prev,
        ]);
      } catch {
        setError("网络错误，请重试");
      }
    }

    setUploading(false);
  }, [splitMode]);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }

  const effectiveMode =
    splitMode === "auto"
      ? aiStatus?.enabled
        ? "AI 精细拆分"
        : "基础拆分（未配置 API Key）"
      : splitMode === "ai"
        ? "AI 精细拆分"
        : "基础拆分";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">导入文件</h1>
        <p className="text-sm text-slate-500">
          上传 PPT (.pptx) 或 Word (.docx)，系统拆分为结构化知识点并存入总库
        </p>
      </div>

      {/* AI status & mode selector */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-violet-600" />
            拆分模式
          </CardTitle>
          <CardDescription>
            信息密集的 PPT 建议使用 AI 精细拆分：一页可拆成多个独立知识点，保留数据和案例细节
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Cpu className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">当前模型：</span>
            <Badge variant={aiStatus?.enabled ? "success" : "warning"}>
              {aiStatus?.label || "检测中…"}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {(["auto", "ai", "basic"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSplitMode(m)}
                className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                  splitMode === m
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                {m === "auto" ? "自动（推荐）" : m === "ai" ? "AI 精细拆分" : "基础拆分"}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-500">
            将使用：<strong>{effectiveMode}</strong>
            {!aiStatus?.enabled && splitMode !== "basic" && (
              <span className="text-amber-600"> — 请在 .env 中配置 OPENAI_API_KEY 或 GEMINI_API_KEY</span>
            )}
          </p>
        </CardContent>
      </Card>

      <div
        className={`mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
          dragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-white"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {uploading ? (
          <Loader2 className="mb-3 h-10 w-10 animate-spin text-blue-600" />
        ) : (
          <Upload className="mb-3 h-10 w-10 text-slate-400" />
        )}
        <p className="mb-1 text-lg font-medium text-slate-700">
          {uploading ? "正在拆分知识点，密集内容可能需要 1-3 分钟…" : "拖拽文件到此处"}
        </p>
        <p className="mb-4 text-sm text-slate-400">支持 .pptx 和 .docx 格式</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pptx,.docx,.doc"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
          选择文件
        </Button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {results.map((result, idx) => (
        <Card key={idx} className="mb-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-base">{result.filename}</CardTitle>
            </div>
            <CardDescription>
              成功拆分 {result.count} 个知识点
              {result.rawSlideCount != null && result.rawSlideCount !== result.count && (
                <span>（原 {result.rawSlideCount} 页 → 拆为 {result.count} 个知识点）</span>
              )}
              {" · "}
              {result.splitMode === "ai" ? (
                <span className="text-violet-600">AI 精细拆分{result.aiModel ? ` · ${result.aiModel}` : ""}</span>
              ) : (
                <span>基础拆分</span>
              )}
            </CardDescription>
            {(result.contentConflictCount ?? 0) > 0 && (
              <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
                ⚠ {result.contentConflictCount} 条存在内容冲突（如 5大功效 vs 3大功效），请在总库筛选「内容冲突」核对
              </p>
            )}
            {(result.conflictCount ?? 0) > 0 && (
              <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                ⚠ {result.conflictCount} 条与现有知识点相似或重复，请在总库中核对（可筛选「高度重复」）
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.knowledgePoints.slice(0, 5).map((kp) => (
                <div key={kp.id} className="flex items-start gap-2 text-sm">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div>
                    <span className="font-medium">{kp.title}</span>
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      <Badge variant="secondary">{kp.category}</Badge>
                      {kp.source.location && (
                        <span className="text-xs text-slate-400">{kp.source.location}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {result.count > 5 && (
                <p className="text-xs text-slate-400">还有 {result.count - 5} 个知识点…</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {results.length > 0 && (
        <div className="text-center">
          <Link href="/library">
            <Button variant="outline">前往知识总库审核 →</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
