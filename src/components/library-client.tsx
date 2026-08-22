"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Download, AlertCircle, RefreshCw, AlertTriangle, X } from "lucide-react";
import type { KnowledgePoint, KnowledgeStatus, ConflictGroup } from "@/lib/types";
import type { SimilarMatch } from "@/lib/similarity";
import type { ContentConflict } from "@/lib/conflict-detector";
import { KnowledgePointCard } from "@/components/knowledge-point-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TagFilter, collectTags, matchesTagFilter } from "@/components/tag-filter";
import { Input, Select } from "@/components/ui/input";

interface LibraryClientProps {
  initialPoints: KnowledgePoint[];
  initialSimilarities?: Record<string, SimilarMatch[]>;
  initialContentConflicts?: Record<string, ContentConflict[]>;
  initialConflictGroups?: ConflictGroup[];
}

function matchesStatusFilter(status: KnowledgeStatus, filter: string): boolean {
  if (!filter) return true;
  if (filter === "pending") return status === "draft" || status === "review";
  return status === filter;
}

export function LibraryClient({
  initialPoints,
  initialSimilarities = {},
  initialContentConflicts = {},
  initialConflictGroups = [],
}: LibraryClientProps) {
  const [points, setPoints] = useState<KnowledgePoint[]>(initialPoints);
  const [similarities, setSimilarities] = useState(initialSimilarities);
  const [contentConflicts, setContentConflicts] = useState(initialContentConflicts);
  const [conflictGroups, setConflictGroups] = useState(initialConflictGroups);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [similarFilter, setSimilarFilter] = useState("");
  const [appliedTags, setAppliedTags] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(timer);
  }, [search]);

  const loadConflicts = useCallback(async () => {
    try {
      const [simRes, contRes, groupRes] = await Promise.all([
        fetch("/api/knowledge/similarities"),
        fetch("/api/knowledge/conflicts"),
        fetch("/api/knowledge/conflict-groups"),
      ]);
      if (simRes.ok) {
        const data = await simRes.json();
        setSimilarities(data.similarities || {});
      }
      if (contRes.ok) {
        const data = await contRes.json();
        setContentConflicts(data.conflicts || {});
      }
      if (groupRes.ok) {
        const data = await groupRes.json();
        setConflictGroups(data.groups || []);
      }
    } catch {
      // non-blocking
    }
  }, []);

  const load = useCallback(async () => {
    setRefreshing(true);
    setError("");
    try {
      const kpRes = await fetch("/api/knowledge");
      if (!kpRes.ok) throw new Error(`加载失败 (${kpRes.status})`);
      const data = await kpRes.json();
      setPoints(data.knowledgePoints || []);
      await loadConflicts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载知识库失败，请刷新页面");
    } finally {
      setRefreshing(false);
    }
  }, [loadConflicts]);

  const categories = useMemo(
    () => Array.from(new Set(points.map((p) => p.category))).sort(),
    [points]
  );

  const allTags = useMemo(() => collectTags(points), [points]);

  const statusCounts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    for (const p of points) {
      if (p.status === "approved") approved++;
      else pending++;
    }
    return { pending, approved, total: points.length };
  }, [points]);

  const hasActiveFilters =
    !!debouncedSearch ||
    !!categoryFilter ||
    !!statusFilter ||
    !!similarFilter ||
    appliedTags.length > 0;

  function resetFilters() {
    setSearch("");
    setDebouncedSearch("");
    setCategoryFilter("");
    setStatusFilter("");
    setSimilarFilter("");
    setAppliedTags([]);
  }

  const similarStats = useMemo(() => {
    const withSimilar = Object.keys(similarities).length;
    const duplicates = Object.values(similarities).filter((m) =>
      m.some((x) => x.level === "duplicate")
    ).length;
    return { withSimilar, duplicates };
  }, [similarities]);

  const conflictStats = useMemo(() => {
    return { contentConflicts: Object.keys(contentConflicts).length };
  }, [contentConflicts]);

  const filtered = useMemo(() => {
    return points.filter((p) => {
      if (!matchesTagFilter(p.tags, appliedTags)) return false;
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (!matchesStatusFilter(p.status, statusFilter)) return false;
      if (similarFilter === "similar" && !similarities[p.id]?.length) return false;
      if (similarFilter === "duplicate" && !similarities[p.id]?.some((m) => m.level === "duplicate")) {
        return false;
      }
      if (similarFilter === "content" && !contentConflicts[p.id]?.length) return false;
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const hay = `${p.title} ${p.summary} ${p.body} ${p.tags.join(" ")} ${p.audience.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [points, debouncedSearch, categoryFilter, statusFilter, similarFilter, similarities, contentConflicts, appliedTags]);

  const grouped = useMemo(() => {
    const map = new Map<string, KnowledgePoint[]>();
    for (const p of filtered) {
      const cat = p.category || "未分类";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
    }
    return map;
  }, [filtered]);

  function getGroupIdForPoint(pointId: string): string | undefined {
    const g = conflictGroups.find((gr) => gr.memberIds.includes(pointId));
    return g?.id;
  }

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
      loadConflicts();
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
      loadConflicts();
    } catch {
      setError("删除失败，请重试");
    }
  }

  function jumpToSimilar(id: string) {
    setExpanded(id);
    setEditing(null);
    document.getElementById(`kp-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function emptyMessage(): string {
    if (points.length === 0) {
      return "暂无知识点。请先前往「导入文件」上传 PPT 或 Word。";
    }
    if (statusFilter === "pending" && statusCounts.pending === 0) {
      return "当前没有待审核的知识点。";
    }
    if (similarFilter === "similar" && similarStats.withSimilar === 0) {
      return "当前库内未检测到相似项。";
    }
    if (similarFilter === "content" && conflictStats.contentConflicts === 0) {
      return "当前库内未检测到内容冲突。";
    }
    return "没有符合筛选条件的知识点，试试放宽条件或清除筛选。";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">知识总库</h1>
          <p className="text-sm text-slate-500">
            共 {points.length} 个知识点，当前显示 {filtered.length} 个
            <span className="text-slate-400">
              {" "}（待审核 {statusCounts.pending} · 已批准 {statusCounts.approved}）
            </span>
            {similarStats.withSimilar > 0 && (
              <span className="text-amber-600">
                {" "}· {similarStats.withSimilar} 条存在相似项
                {similarStats.duplicates > 0 && `（${similarStats.duplicates} 条高度重复）`}
              </span>
            )}
            {conflictStats.contentConflicts > 0 && (
              <span className="text-red-600">
                {" "}· {conflictStats.contentConflicts} 条存在内容冲突
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/library/conflicts">
            <Button variant="outline" size="sm">
              <AlertTriangle className="h-4 w-4" />
              冲突组对照
            </Button>
          </Link>
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

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-9"
            placeholder="输入关键词即时筛选，如：一龄、REST、V4.0…"
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
          className="sm:w-44"
        >
          <option value="">全部状态（{statusCounts.total}）</option>
          <option value="pending">待审核（{statusCounts.pending}）</option>
          <option value="approved">已批准（{statusCounts.approved}）</option>
        </Select>
        <Select
          value={similarFilter}
          onChange={(e) => setSimilarFilter(e.target.value)}
          className="sm:w-44"
        >
          <option value="">相似/冲突：全部</option>
          <option value="similar">有相似项（{similarStats.withSimilar}）</option>
          <option value="duplicate">高度重复（{similarStats.duplicates}）</option>
          <option value="content">内容冲突（{conflictStats.contentConflicts}）</option>
        </Select>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="h-4 w-4" />
            清除
          </Button>
        )}
      </div>

      <TagFilter
        className="mb-6"
        allTags={allTags}
        appliedTags={appliedTags}
        onApply={setAppliedTags}
      />

      {filtered.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <p className="text-slate-500">{emptyMessage()}</p>
            {hasActiveFilters && (
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                清除全部筛选
              </Button>
            )}
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
                  contentConflicts={contentConflicts[kp.id]}
                  conflictGroupId={getGroupIdForPoint(kp.id)}
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
