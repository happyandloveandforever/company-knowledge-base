import Link from "next/link";
import { getKnowledgePoints, getSourceFiles } from "@/lib/storage";
import { getPendingSplitQueue } from "@/lib/split-queue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function StatusPage() {
  const [points, sources, pendingQueue] = await Promise.all([
    getKnowledgePoints(),
    getSourceFiles(),
    getPendingSplitQueue(),
  ]);

  const pending = points.filter((p) => p.status !== "approved").length;
  const approved = points.filter((p) => p.status === "approved").length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">系统状态</h1>
      <p className="mb-6 text-sm text-slate-500">
        数据在 Git 仓库 <code className="rounded bg-slate-100 px-1">data/</code> 中，服务重启不会丢失知识点。
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>知识点</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{points.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-500">
            待审核 {pending} · 已批准 {approved}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>已导入文件</CardDescription>
            <CardTitle className="text-3xl text-violet-600">{sources.length}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-500">
            Claude 待拆分队列 {pendingQueue.length} 个
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">数据文件位置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600">
          <p><code>data/knowledge-points.json</code> — 核心知识库（进 Git，永久保存）</p>
          <p><code>data/sources.json</code> — 导入记录</p>
          <p><code>data/split-queue.json</code> — Claude 待拆分队列（运行时）</p>
          <p><code>uploads/</code> — 原始文件备份（本机，不进 Git）</p>
        </CardContent>
      </Card>

      <Card className="mt-6 border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-base text-amber-900">Preview 打不开？</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-amber-900">
          <p>1. 看右上角状态：显示「在线」说明服务正常</p>
          <p>2. Preview 显示 Disconnected → 点 <strong>Reconnect</strong></p>
          <p>3. 仍不行 → 刷新页面，或访问 <Link href="/library" className="underline">知识总库</Link></p>
          <p className="text-xs text-amber-700">服务由 keep-alive 脚本守护，崩溃后 2 秒内自动重启</p>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        <Link href="/library"><Button>知识总库</Button></Link>
        <Link href="/upload"><Button variant="outline">导入文件</Button></Link>
      </div>
    </div>
  );
}
