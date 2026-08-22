"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Clock,
  MessageSquare,
} from "lucide-react";
import type { KnowledgePoint } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const ACCEPT =
  ".pptx,.docx,.doc,.pdf,.md,.markdown,.html,.htm,.txt,.png,.jpg,.jpeg,.webp";

const FORMATS = "PPT · Word · PDF · Markdown · HTML · TXT · PNG · JPG · WebP";

interface UploadResult {
  filename: string;
  count?: number;
  rawSlideCount?: number;
  splitMode?: string;
  aiModel?: string;
  conflictCount?: number;
  contentConflictCount?: number;
  knowledgePoints?: KnowledgePoint[];
  queued?: boolean;
  queueId?: string;
  message?: string;
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
  const [pendingCount, setPendingCount] = useState(0);
  const [splitMode, setSplitMode] = useState<"claude" | "basic">("claude");

  useEffect(() => {
    fetch("/api/ai/status")
      .then((r) => r.json())
      .then(setAiStatus)
      .catch(() => null);
    fetch("/api/split-queue?pending=1")
      .then((r) => r.json())
      .then((d) => setPendingCount(d.pendingCount || 0))
      .catch(() => null);
  }, [results]);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setError("");
      setUploading(true);

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("mode", splitMode === "claude" ? "claude" : "basic");

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
              rawSlideCount: data.rawSlideCount || data.rawChunkCount,
              splitMode: data.splitMode,
              aiModel: data.aiModel,
              conflictCount: data.conflictCount,
              contentConflictCount: data.contentConflictCount,
              knowledgePoints: data.knowledgePoints,
              queued: data.queued,
              queueId: data.queueId,
              message: data.message,
            },
            ...prev,
          ]);
        } catch {
          setError("网络错误，请重试");
        }
      }

      setUploading(false);
    },
    [splitMode]
  );

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">导入文件</h1>
        <p className="text-sm text-slate-500">
          支持 {FORMATS}，默认使用 <strong>Claude 精细拆分</strong>
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-violet-600" />
            Claude 精细拆分
          </CardTitle>
          <CardDescription>
            密集材料一页拆多个知识点，保留数据与案例细节。图片（PNG/JPG）支持 Claude 视觉识别。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-600">拆分方式：</span>
            <Badge variant={aiStatus?.enabled ? "success" : "default"}>
              {aiStatus?.label || "检测中…"}
            </Badge>
          </div>

          {!aiStatus?.enabled && (
            <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900">
              <p className="font-medium">✓ 默认使用 Cursor 内置 Claude（无需 API Key）</p>
              <p className="mt-2 text-violet-800">
                上传后文件进入待拆分队列，在<strong>本对话</strong>中说：
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-violet-800">
                <li>「处理拆分队列」</li>
                <li>「帮我 Claude 精细拆 xxx.pdf」</li>
              </ul>
              <p className="mt-2 text-xs text-violet-600">
                杨浦财务、B端定稿都是这样拆的 — 不是网页自动拆，是我在对话里帮你拆。
              </p>
              {pendingCount > 0 && (
                <p className="mt-3 flex items-center gap-1 font-medium text-violet-700">
                  <Clock className="h-4 w-4" />
                  当前队列中有 {pendingCount} 个文件待拆分
                </p>
              )}
            </div>
          )}

          {aiStatus?.enabled && (
            <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              已配置 API Key，上传后网页会自动调用 Claude 拆分（1–5 分钟）。
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSplitMode("claude")}
              className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                splitMode === "claude"
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              Cursor Claude 精细拆分（推荐）
            </button>
            <button
              onClick={() => setSplitMode("basic")}
              className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                splitMode === "basic"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              基础机械拆分
            </button>
          </div>
        </CardContent>
      </Card>

      <div
        className={`mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
          dragging ? "border-violet-500 bg-violet-50" : "border-slate-300 bg-white"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {uploading ? (
          <Loader2 className="mb-3 h-10 w-10 animate-spin text-violet-600" />
        ) : (
          <Upload className="mb-3 h-10 w-10 text-slate-400" />
        )}
        <p className="mb-1 text-lg font-medium text-slate-700">
          {uploading ? "正在处理，Claude 拆分可能需要 1-5 分钟…" : "拖拽文件到此处"}
        </p>
        <p className="mb-4 text-center text-sm text-slate-400">{FORMATS}</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
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
              {result.queued ? (
                <Clock className="h-5 w-5 text-amber-600" />
              ) : (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              )}
              <CardTitle className="text-base">{result.filename}</CardTitle>
            </div>
            {result.queued ? (
              <CardDescription className="text-amber-800">
                {result.message}
                {result.queueId && (
                  <span className="mt-1 block text-xs text-amber-600">队列 ID：{result.queueId}</span>
                )}
              </CardDescription>
            ) : (
              <CardDescription>
                成功拆分 {result.count} 个知识点
                {result.rawSlideCount != null && result.rawSlideCount !== result.count && (
                  <span>（原 {result.rawSlideCount} 段 → {result.count} 个知识点）</span>
                )}
                {" · "}
                {result.splitMode === "claude-api" ? (
                  <span className="text-violet-600">
                    Claude 精细拆分{result.aiModel ? ` · ${result.aiModel}` : ""}
                  </span>
                ) : result.splitMode === "ai" ? (
                  <span className="text-violet-600">AI 拆分 · {result.aiModel}</span>
                ) : (
                  <span>基础拆分</span>
                )}
              </CardDescription>
            )}
            {(result.contentConflictCount ?? 0) > 0 && (
              <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
                ⚠ {result.contentConflictCount} 条存在内容冲突，请在总库核对
              </p>
            )}
          </CardHeader>
          {!result.queued && result.knowledgePoints && (
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
                {(result.count ?? 0) > 5 && (
                  <p className="text-xs text-slate-400">还有 {(result.count ?? 0) - 5} 个知识点…</p>
                )}
              </div>
            </CardContent>
          )}
          {result.queued && (
            <CardContent>
              <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  在 Cursor 对话中说：<strong>「处理拆分队列」</strong> 或 <strong>「帮我 Claude 精细拆 xxx.pdf」</strong>
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      {(results.some((r) => !r.queued) || pendingCount > 0) && (
        <div className="text-center">
          <Link href="/library">
            <Button variant="outline">前往知识总库审核 →</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
