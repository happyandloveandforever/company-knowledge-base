"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import type { KnowledgePoint } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface UploadResult {
  filename: string;
  count: number;
  knowledgePoints: KnowledgePoint[];
}

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<UploadResult[]>([]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setError("");
    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

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
            knowledgePoints: data.knowledgePoints,
          },
          ...prev,
        ]);
      } catch {
        setError("网络错误，请重试");
      }
    }

    setUploading(false);
  }, []);

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
          上传 PPT (.pptx) 或 Word (.docx)，系统自动拆分为结构化知识点并存入总库
        </p>
      </div>

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
          {uploading ? "正在解析文件…" : "拖拽文件到此处"}
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
              成功拆分 {result.count} 个知识点（状态：草稿，请在总库中审核）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.knowledgePoints.slice(0, 5).map((kp) => (
                <div key={kp.id} className="flex items-start gap-2 text-sm">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div>
                    <span className="font-medium">{kp.title}</span>
                    <div className="mt-0.5 flex gap-1">
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
