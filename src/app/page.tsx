import Link from "next/link";
import { FileUp, Library, Presentation, Download, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getKnowledgePoints, getSourceFiles } from "@/lib/storage";

export default async function HomePage() {
  const [points, sources] = await Promise.all([getKnowledgePoints(), getSourceFiles()]);
  const approved = points.filter((p) => p.status === "approved").length;
  const categories = new Set(points.map((p) => p.category)).size;

  const steps = [
    {
      step: "1",
      title: "导入文件",
      desc: "上传现有 PPT 或 Word，系统自动拆分为结构化知识点",
      href: "/upload",
      icon: FileUp,
    },
    {
      step: "2",
      title: "浏览总库",
      desc: "在知识总库中审核、编辑、搜索和分类管理所有知识点",
      href: "/library",
      icon: Library,
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
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          公司知识库
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600">
          把 PPT 和 Word 拆成可复用的知识点，建立结构化总库，一起选题编排，一键生成 PPT。
        </p>
      </section>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>知识点总数</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{points.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>已批准 / 知识分类</CardDescription>
            <CardTitle className="text-3xl text-emerald-600">
              {approved} / {categories}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>已导入文件</CardDescription>
            <CardTitle className="text-3xl text-violet-600">{sources.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">工作流程</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(({ step, title, desc, href, icon: Icon }) => (
            <Link key={step} href={href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">
                    步骤 {step}：{title}
                  </CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center text-sm text-blue-600">
                    开始 <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-2 text-lg font-semibold">导出 HTML 总库</h2>
        <p className="mb-4 text-sm text-slate-600">
          将当前所有知识点导出为一个结构化 HTML 文件，可离线浏览、分享，或作为公司知识库的静态版本。
        </p>
        <a href="/api/library/html" download>
          <Button variant="outline">
            <Download className="h-4 w-4" />
            下载 HTML 总库
          </Button>
        </a>
      </section>
    </div>
  );
}
