"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SourceDeleteButtonProps {
  sourceId: string;
  filename: string;
  pointCount: number;
  variant?: "button" | "icon" | "prominent";
  className?: string;
  onDeleted?: () => void;
}

export function SourceDeleteButton({
  sourceId,
  filename,
  pointCount,
  variant = "button",
  className,
  onDeleted,
}: SourceDeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const msg =
      pointCount > 0
        ? `确定删除「${filename}」？\n\n将同时删除关联的 ${pointCount} 个知识点，此操作不可恢复。`
        : `确定删除「${filename}」？\n\n该文件尚未生成知识点，删除后可重新上传。`;

    if (!window.confirm(msg)) return;

    setLoading(true);
    try {
      const deletePoints = pointCount > 0 ? "1" : "0";
      const res = await fetch(
        `/api/sources?id=${encodeURIComponent(sourceId)}&deletePoints=${deletePoints}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "删除失败");

      onDeleted?.();
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "删除失败");
    } finally {
      setLoading(false);
    }
  }

  if (variant === "prominent") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        disabled={loading}
        className={`shrink-0 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 ${className ?? ""}`}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        删除
      </Button>
    );
  }

  if (variant === "icon") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        disabled={loading}
        className={`shrink-0 text-red-600 hover:bg-red-50 ${className ?? ""}`}
        title="删除此来源"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        删除
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className={`text-red-600 hover:bg-red-50 hover:text-red-700 ${className ?? ""}`}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      删除
    </Button>
  );
}
