import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getKnowledgePoints, getSourceFiles } from "@/lib/storage";
import { getPendingSplitQueue } from "@/lib/split-queue";
import { groupPointsBySource } from "@/lib/dashboard-stats";
import { SourcesClient } from "@/components/sources-client";

export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  const [points, sources, pendingQueue] = await Promise.all([
    getKnowledgePoints(),
    getSourceFiles(),
    getPendingSplitQueue(),
  ]);
  const sourceGroups = groupPointsBySource(points, sources);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">来源管理</h1>
          <p className="text-sm text-slate-500">查看、删除已导入文件，管理关联知识点</p>
        </div>
        <Link href="/upload">
          <Button>
            <FolderOpen className="h-4 w-4" />
            导入新文件
          </Button>
        </Link>
      </div>

      <SourcesClient sourceGroups={sourceGroups} pendingQueue={pendingQueue} />
    </div>
  );
}
