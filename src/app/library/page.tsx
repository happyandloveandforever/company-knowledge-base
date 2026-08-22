"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Download, Check, X } from "lucide-react";
import type { KnowledgePoint, KnowledgeStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";

const STATUS_LABELS: Record<KnowledgeStatus, string> = {
  draft: "草稿",
  review: "待审核",
  approved: "已批准",
};

const STATUS_VARIANT: Record<KnowledgeStatus, "warning" | "default" | "success"> = {
  draft: "warning",
  review: "default",
  approved: "success",
};

export default function LibraryPage() {
  const [points, setPoints] = useState<KnowledgePoint[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/knowledge");
    const data = await res.json();
    setPoints(data.knowledgePoints || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(
    () => Array.from(new Set(points.map((p) => p.category))).sort(),
    [points]
  );

  const filtered = useMemo(() => {
    return points.filter((p) => {
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${p.title} ${p.summary} ${p.body} ${p.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [points, search, categoryFilter, statusFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, KnowledgePoint[]>();
    for (const p of filtered) {
      const cat = p.category || "未分类";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
    }
    return map;
  }, [filtered]);

  async function updateStatus(id: string, status: KnowledgeStatus) {
    const point = points.find((p) => p.id === id);
    if (!point) return;
    await fetch("/api/knowledge", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...point, status }),
    });
    load();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        加载知识库…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">知识总库</h1>
          <p className="text-sm text-slate-500">
            共 {points.length} 个知识点，当前显示 {filtered.length} 个
          </p>
        </div>
        <a href="/api/library/html" download>
          <Button variant="outline">
            <Download className="h-4 w-4" />
            导出 HTML 总库
          </Button>
        </a>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="搜索标题、内容、标签…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="sm:w-40"
        >
          <option value="">全部分类</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="sm:w-36"
        >
          <option value="">全部状态</option>
          <option value="draft">草稿</option>
          <option value="review">待审核</option>
          <option value="approved">已批准</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <p className="text-slate-500">暂无知识点。请先前往「导入文件」上传 PPT 或 Word。</p>
          </CardContent>
        </Card>
      ) : (
        Array.from(grouped.entries()).map(([category, items]) => (
          <section key={category} className="mb-8">
            <h2 className="mb-3 border-b-2 border-blue-500 pb-2 text-lg font-semibold text-slate-800">
              {category}
              <span className="ml-2 text-sm font-normal text-slate-400">({items.length})</span>
            </h2>
            <div className="grid gap-3">
              {items.map((kp) => (
                <Card key={kp.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className="text-base">{kp.title}</CardTitle>
                        <p className="mt-1 text-sm text-slate-500">{kp.summary}</p>
                      </div>
                      <Badge variant={STATUS_VARIANT[kp.status]}>
                        {STATUS_LABELS[kp.status]}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {kp.tags.map((t) => (
                        <Badge key={t} variant="secondary">{t}</Badge>
                      ))}
                      <span className="text-xs text-slate-400">约 {kp.durationMin} 分钟</span>
                      <span className="text-xs text-slate-400">
                        来源：{kp.source.file}
                        {kp.source.location ? ` · ${kp.source.location}` : ""}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <button
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => setExpanded(expanded === kp.id ? null : kp.id)}
                    >
                      {expanded === kp.id ? "收起" : "查看完整内容"}
                    </button>
                    <div className="flex gap-2">
                      {kp.status !== "approved" && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(kp.id, "approved")}>
                          <Check className="h-3 w-3" /> 批准
                        </Button>
                      )}
                      {kp.status === "approved" && (
                        <Button size="sm" variant="ghost" onClick={() => updateStatus(kp.id, "review")}>
                          <X className="h-3 w-3" /> 退回审核
                        </Button>
                      )}
                    </div>
                  </CardContent>
                  {expanded === kp.id && (
                    <CardContent className="border-t border-slate-100 bg-slate-50 pt-4">
                      <pre className="whitespace-pre-wrap text-sm text-slate-700">{kp.body}</pre>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
