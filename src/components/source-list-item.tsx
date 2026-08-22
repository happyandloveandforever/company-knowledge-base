"use client";

import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SourceDeleteButton } from "@/components/source-delete-button";
import type { SourceFile } from "@/lib/types";

interface SourceListItemProps {
  source: SourceFile;
  count: number;
  pending: number;
}

function statusLabel(source: SourceFile, pending: number, count: number) {
  if (source.status === "processing") return { text: "处理中断", variant: "warning" as const };
  if (source.status === "pending_claude") return { text: "待拆分", variant: "warning" as const };
  if (source.status === "error") return { text: "导入失败", variant: "outline" as const };
  if (count === 0) return { text: "无知识点", variant: "warning" as const };
  if (pending > 0) return { text: `${pending} 待审`, variant: "warning" as const };
  return { text: "已入库", variant: "success" as const };
}

export function SourceListItem({ source, count, pending }: SourceListItemProps) {
  const badge = statusLabel(source, pending, count);
  const canDelete = count === 0 || source.status === "processing" || source.status === "error";

  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <Link
        href={count > 0 ? `/library?source=${encodeURIComponent(source.filename)}` : "/sources"}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <FolderOpen className="h-5 w-5 shrink-0 text-slate-400" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-slate-900">{source.filename}</p>
          <p className="text-xs text-slate-500">
            {count} 个知识点
            {pending > 0 && ` · ${pending} 待审核`}
            {source.status === "processing" && count === 0 && " · 上传中断，请删除后重新上传"}
          </p>
        </div>
        <Badge variant={badge.variant}>{badge.text}</Badge>
      </Link>
      <SourceDeleteButton
        sourceId={source.id}
        filename={source.filename}
        pointCount={count}
        variant={canDelete ? "prominent" : "button"}
      />
    </div>
  );
}
