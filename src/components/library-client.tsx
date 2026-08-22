"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Download, AlertCircle, RefreshCw } from "lucide-react";
import type { KnowledgePoint, KnowledgeStatus } from "@/lib/types";
import type { SimilarMatch } from "@/lib/similarity";
import { KnowledgePointCard } from "@/components/knowledge-point-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";

interface LibraryClientProps {
  initialPoints: KnowledgePoint[];
}

export function LibraryClient({ initialPoints }: LibraryClientProps) {
  const [points, setPoints] = useState<KnowledgePoint[]>(initialPoints);
  const [similarities, setSimilarities] = useState<Record<string, SimilarMatch[]>>({});
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [similarFilter, setSimilarFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadSimilarities = useCallback(async () => {
    try {
      const res = await fetch("/api/knowledge/similarities");
      if (!res.ok) return;
      const data = await res.json();
      setSimilarities(data.similarities || {});
    } catch {
      // non-blocking
    }
  }, []);

  const load = useCallback(async () => {
    setRefreshing(true);
    setError("");
    try {
      const [kpRes] = await Promise.all([
        fetch("/api/knowledge"),
        loadSimilarities(),
      ]);
      if (!kpRes.ok) throw new Error(`加载失败 (${kpRes.status})`);
      const data = await kpRes.json();
      setPoints(data.knowledgePoints || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载知识库失败，请刷新页面");
    } finally {
      setRefreshing(false);
    }
  }, [loadSimilarities]);

  useEffect(() => {
    loadSimilarities();
  }, [loadSimilarities]);

  const categories = useMemo(
    () => Array.from(new Set(points.map((p) => p.category))).sort(),
    [points]
  );

  const similarStats = useMemo(() => {
    const withSimilar = Object.keys(similarities).length;
    const duplicates = Object.values(similarities).filter((m) =>
      m.some((x) => x.level === "duplicate")
    ).length;
    return { withSimilar, duplicates };
  }, [similarities]);

  const filtered = useMemo(() => {
    return points.filter((p) => {
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (similarFilter === "similar" && !similarities[p.id]?.length) return false;
      if (similarFilter === "duplicate" && !similarities[p.id]?.some((m) => m.level === "duplicate")) {
        return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const hay = `${p.title} ${p.summary} ${p.body} ${p.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [points, search, categoryFilter, statusFilter, similarFilter, similarities]);

  const grouped = useMemo(() => {
    const map = new Map<string, KnowledgePoint[]>();
    for (const p of filtered) {
      const cat = p.category || "未分类";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
    }
    return map;
  }, [filtered]);

  async function savePoint(updated: KnowledgePoint, approve?: boolean) {
    setError("");
    setSuccess("");
    try {
      const payload = approve ? { ...updated, status: "approved" as const } : updated;
      const res = await fetch("/api/knowledge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("保存失败");
      setPoints((prev) =>
        prev.map((p) => (p.id === updated.id ? payload : p))
      );
      setEditing(null);
      setSuccess(approve ? "已保存并批准入库" : "修改已保存");
      setTimeout(() => setSuccess(""), 3000);
      loadSimilarities();
    } catch {
      setError("保存失败，请重试");
    }
  }

  async function updateStatus(id: string, status: KnowledgeStatus) {
    const point = points.find((p) => p.id === id);
    if (!point) return;
    await savePoint({ ...point, status });
  }

  async function deletePoint(id: string) {
    setError("");
    try {
      const res = await fetch(`/api/knowledge?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("删除失败");
      setPoints((prev) => prev.filter((p) => p.id !== id));
      if (editing === id) setEditing(null);
      if (expanded === id) setExpanded(null);
      setSuccess("知识点已删除");
      setTimeout(() => setSuccess(""), 3000);
      loadSimilarities();
    } catch {
      setError("删除失败，请重试");
    }
  }

  function jumpToSimilar(id: string) {
    setExpanded(id);
    setEditing(null);
    document.getElementById(`kp-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">知识总库</h1>
          <p className="text-sm text-slate-500">
            共 {points.length} 个知识点，当前显示 {filtered.length} 个
            {similarStats.withSimilar > 0 && (
              <span className="text-amber-600">
                {" "}· {similarStats.withSimilar} 条存在相似项
                {similarStats.duplicates > 0 && `（${similarStats.duplicates} 条高度重复）`}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={load} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            刷新
          </Button>
          <a href="/api/library/html" download>
            <Button variant="outline">
              <Download className="h-4 w-4" />
              导出 HTML 总库
            </Button>
          </a>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative min-w-[200px] flex-1">
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
        <Select
          value={similarFilter}
          onChange={(e) => setSimilarFilter(e.target.value)}
          className="sm:w-40"
        >
          <option value="">相似度：全部</option>
          <option value="similar">有相似项</option>
          <option value="duplicate">高度重复</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <p className="text-slate-500">
              {points.length === 0
                ? "暂无知识点。请先前往「导入文件」上传 PPT 或 Word。"
                : "没有符合筛选条件的知识点。"}
            </p>
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
                <KnowledgePointCard
                  key={kp.id}
                  kp={kp}
                  expanded={expanded === kp.id}
                  editing={editing === kp.id}
                  similarMatches={similarities[kp.id]}
                  onToggleExpand={() =>
                    setExpanded(expanded === kp.id ? null : kp.id)
                  }
                  onStartEdit={() => {
                    setEditing(kp.id);
                    setExpanded(kp.id);
                  }}
                  onCancelEdit={() => setEditing(null)}
                  onSave={savePoint}
                  onUpdateStatus={(status) => updateStatus(kp.id, status)}
                  onDelete={() => deletePoint(kp.id)}
                  onJumpToSimilar={jumpToSimilar}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
