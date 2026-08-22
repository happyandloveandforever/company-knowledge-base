import Link from "next/link";
import { FolderOpen, FileText, Clock, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getKnowledgePoints, getSourceFiles } from "@/lib/storage";
import { getPendingSplitQueue } from "@/lib/split-queue";
import { groupPointsBySource } from "@/lib/dashboard-stats";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadge(status: string, pending: number) {
  if (status === "pending_claude") return <Badge variant="warning">待 Claude 拆分</Badge>;
  if (status === "processing") return <Badge variant="secondary">处理中</Badge>;
  if (status === "error") return <Badge variant="outline">导入失败</Badge>;
  if (pending > 0) return <Badge variant="warning">{pending} 待审核</Badge>;
  return <Badge variant="success">已入库</Badge>;
}

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
          <p className="text-sm text-slate-500">
            查看所有已导入文件及其关联的知识点
          </p>
        </div>
        <Link href="/upload">
          <Button>
            <FolderOpen className="h-4 w-4" />
            导入新文件
          </Button>
        </Link>
      </div>

      {pendingQueue.length > 0 && (
        <Card className="mb-6 border-violet-200 bg-violet-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-violet-900">
              <Sparkles className="h-4 w-4" />
              Claude 待拆分队列（{pendingQueue.length}）
            </CardTitle>
            <CardDescription className="text-violet-800">
              这些文件已上传但尚未拆分。在 Cursor 对话中说「处理拆分队列」即可。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingQueue.map((item) => (
              <div key={item.id} className="flex items-center gap-2 rounded-lg bg-white/60 px-3 py-2 text-sm">
                <Clock className="h-4 w-4 text-violet-600" />
                <span className="font-medium">{item.filename}</span>
                <span className="text-violet-600">{formatDate(item.uploadedAt)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {sourceGroups.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderOpen className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p className="text-slate-500">还没有导入任何文件</p>
              <Link href="/upload" className="mt-4 inline-block">
                <Button variant="outline">去导入 →</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          sourceGroups.map(({ source, count, pending }) => (
            <Card key={source.id}>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <FileText className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{source.filename}</CardTitle>
                      <CardDescription className="mt-1">
                        导入于 {formatDate(source.uploadedAt)}
                        {source.splitMode && ` · ${source.splitMode}`}
                      </CardDescription>
                    </div>
                  </div>
                  {statusBadge(source.status, pending)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">知识点</p>
                    <p className="text-xl font-semibold text-slate-900">{count}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">待审核</p>
                    <p className="text-xl font-semibold text-amber-600">{pending}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">已批准</p>
                    <p className="text-xl font-semibold text-emerald-600">{count - pending}</p>
                  </div>
                </div>

                {source.note && (
                  <p className="mb-3 text-sm text-slate-600">{source.note}</p>
                )}

                {source.error && (
                  <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    {source.error}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Link href={`/library?source=${encodeURIComponent(source.filename)}`}>
                    <Button variant="outline" size="sm">
                      <CheckCircle2 className="h-4 w-4" />
                      查看知识点
                    </Button>
                  </Link>
                  {pending > 0 && (
                    <Link href={`/library?status=pending&source=${encodeURIComponent(source.filename)}`}>
                      <Button size="sm">
                        <Clock className="h-4 w-4" />
                        审核 {pending} 条
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
