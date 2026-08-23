import Link from "next/link";
import {
  FileUp,
  Library,
  Presentation,
  Download,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getKnowledgePoints, getSourceFiles } from "@/lib/storage";
import { getLibraryAnalysis } from "@/lib/analysis-cache";
import { getPendingSplitQueue } from "@/lib/split-queue";
import {
  computeDashboardStats,
  groupPointsBySource,
  topCategories,
} from "@/lib/dashboard-stats";
import { SourceListItem } from "@/components/source-list-item";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [points, sources, pendingQueue] = await Promise.all([
    getKnowledgePoints(),
    getSourceFiles(),
    getPendingSplitQueue(),
  ]);
  const analysis = await getLibraryAnalysis(points);
  const stats = computeDashboardStats(points, sources, analysis, pendingQueue.length);
  const sourceGroups = groupPointsBySource(points, sources);
  const categories = topCategories(points);

  const steps = [
    {
      step: "1",
      title: "导入文件",
      desc: "上传 PPT、PDF、Word 等，Claude 精细拆分为结构化知识点",
      href: "/upload",
      icon: FileUp,
      badge: stats.pendingQueue > 0 ? `${stats.pendingQueue} 待拆分` : undefined,
    },
    {
      step: "2",
      title: "审核总库",
      desc: "浏览、编辑、批准知识点，处理冲突与重复",
      href: "/library?status=pending",
      icon: Library,
      badge: stats.pending > 0 ? `${stats.pending} 待审核` : undefined,
    },
    {
      step: "3",
      title: "编排演讲",
      desc: "选择知识点和演讲逻辑，生成大纲并导出 PPT",
      href: "/compose",
      icon: Presentation,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Hero */}
      <section className="mb-8 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 py-10 text-white shadow-lg sm:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Claude 精细拆分 · {stats.total} 条知识点已入库
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">公司知识库</h1>
            <p className="mt-3 max-w-xl text-blue-100">
              把 PPT、PDF 拆成可复用的知识点，建立结构化总库，选题编排，一键生成 PPT。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {stats.pending > 0 && (
              <Link href="/library?status=pending">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                  <Clock className="h-4 w-4" />
                  审核 {stats.pending} 条待审
                </Button>
              </Link>
            )}
            <Link href="/upload">
              <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                <FileUp className="h-4 w-4" />
                导入新文件
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="知识点总数" value={stats.total} sub={`${stats.approved} 已批准 · ${stats.pending} 待审核`} color="blue" />
        <StatCard label="知识分类" value={stats.categories} sub={`来自 ${stats.sources} 个文件`} color="violet" />
        <StatCard
          label="冲突组"
          value={stats.conflictGroups}
          sub={stats.contentConflicts > 0 ? `${stats.contentConflicts} 条内容冲突待核对` : "无待处理冲突"}
          color="amber"
          href="/library/conflicts"
        />
        <StatCard
          label="Claude 队列"
          value={stats.pendingQueue}
          sub={stats.pendingQueue > 0 ? "需在 Cursor 对话中处理" : "无待拆分文件"}
          color="emerald"
          href="/upload"
        />
      </div>

      {/* Pending alerts */}
      {(stats.pending > 0 || stats.pendingQueue > 0 || stats.conflictGroups > 0) && (
        <section className="mb-8 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">待办事项</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {stats.pending > 0 && (
              <TodoCard
                icon={Clock}
                title={`${stats.pending} 条知识点待审核`}
                desc="杨浦财务 55 条 + B端定稿 50 条，建议逐批批准或编辑"
                href="/library?status=pending"
                variant="blue"
              />
            )}
            {stats.conflictGroups > 0 && (
              <TodoCard
                icon={AlertTriangle}
                title={`${stats.conflictGroups} 组内容冲突`}
                desc="不同客户版本可并存，请确认首选版本"
                href="/library/conflicts"
                variant="amber"
              />
            )}
            {stats.pendingQueue > 0 && (
              <TodoCard
                icon={Sparkles}
                title={`${stats.pendingQueue} 个文件待 Claude 拆分`}
                desc="在 Cursor 对话中说「处理拆分队列」"
                href="/upload"
                variant="violet"
              />
            )}
          </div>
        </section>
      )}

      {/* Workflow */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">工作流程</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(({ step, title, desc, href, icon: Icon, badge }) => (
            <Link key={step} href={href}>
              <Card className="h-full transition-all hover:border-blue-200 hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    {badge && <Badge variant="warning">{badge}</Badge>}
                  </div>
                  <CardTitle className="text-base">
                    步骤 {step}：{title}
                  </CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center text-sm font-medium text-blue-600">
                    开始 <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sources */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">已导入文件</h2>
            <Link href="/sources" className="text-sm text-blue-600 hover:underline">
              查看全部 →
            </Link>
          </div>
          <Card>
            <CardContent className="divide-y divide-slate-100 p-0">
              {sourceGroups.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">还没有导入文件</p>
              ) : (
                sourceGroups.slice(0, 5).map(({ source, count, pending }) => (
                  <SourceListItem
                    key={source.id}
                    source={source}
                    count={count}
                    pending={pending}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </section>

        {/* Categories */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">分类分布</h2>
            <Link href="/library" className="text-sm text-blue-600 hover:underline">
              浏览总库 →
            </Link>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {categories.map(({ name, count }) => (
                  <Link
                    key={name}
                    href={`/library?category=${encodeURIComponent(name)}`}
                    className="group flex items-center gap-3"
                  >
                    <Layers className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-500" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate font-medium text-slate-700 group-hover:text-blue-700">{name}</span>
                        <span className="ml-2 shrink-0 text-slate-500">{count}</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all group-hover:bg-blue-600"
                          style={{ width: `${Math.round((count / stats.total) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Export */}
      <section className="mt-8 space-y-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">北京化工集团 · 初次交流</h2>
              <p className="mt-1 text-sm text-slate-600">
                主稿 17 页：脊柱 9 页 + 插件 P1–P5 原样保留，新增 P6 赛道与投资联动两页。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="/api/download?file=bjhg-final-deck-p6.pptx">
                <Button>
                  <Download className="h-4 w-4" />
                  下载主稿（含 P6）
                </Button>
              </a>
              <a href="/api/download?file=bjhg-final-deck.pptx">
                <Button variant="outline">不含 P6 版</Button>
              </a>
              <a href="/api/download?file=bjhg-invest-deck.pptx">
                <Button variant="outline">纯赛道版</Button>
              </a>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">导出 HTML 总库</h2>
              <p className="mt-1 text-sm text-slate-600">
                将所有知识点导出为结构化 HTML，可离线浏览或分享给团队。
              </p>
            </div>
            <a href="/api/library/html" download>
              <Button variant="outline">
                <Download className="h-4 w-4" />
                下载 HTML 总库
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
  href,
}: {
  label: string;
  value: number;
  sub: string;
  color: "blue" | "violet" | "amber" | "emerald";
  href?: string;
}) {
  const colors = {
    blue: "text-blue-600",
    violet: "text-violet-600",
    amber: "text-amber-600",
    emerald: "text-emerald-600",
  };

  const content = (
    <Card className={href ? "transition-shadow hover:shadow-md" : ""}>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className={`text-3xl ${colors[color]}`}>{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-500">{sub}</CardContent>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function TodoCard({
  icon: Icon,
  title,
  desc,
  href,
  variant,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  href: string;
  variant: "blue" | "amber" | "violet";
}) {
  const styles = {
    blue: "border-blue-200 bg-blue-50 hover:bg-blue-100/80",
    amber: "border-amber-200 bg-amber-50 hover:bg-amber-100/80",
    violet: "border-violet-200 bg-violet-50 hover:bg-violet-100/80",
  };
  const iconColors = {
    blue: "text-blue-600",
    amber: "text-amber-600",
    violet: "text-violet-600",
  };

  return (
    <Link href={href}>
      <div className={`rounded-xl border p-4 transition-colors ${styles[variant]}`}>
        <div className="flex items-start gap-3">
          <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColors[variant]}`} />
          <div>
            <p className="font-medium text-slate-900">{title}</p>
            <p className="mt-1 text-sm text-slate-600">{desc}</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-400" />
        </div>
      </div>
    </Link>
  );
}
