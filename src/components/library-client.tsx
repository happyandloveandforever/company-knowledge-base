"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Download, AlertCircle, RefreshCw, AlertTriangle, X, Check } from "lucide-react";
import type { KnowledgePoint, KnowledgeStatus, ConflictGroup } from "@/lib/types";
import type { SimilarMatch } from "@/lib/similarity";
import type { ContentConflict } from "@/lib/conflict-detector";
import {
  type FilterState,
  filtersKey,
  filtersToParams,
} from "@/lib/library-filters";
import {
  LAYER_LABELS,
  USAGE_LABELS,
  countByLayer,
  countByUsage,
  countInternalOnly,
  getLayer,
  getUsage,
  isInternalOnly,
} from "@/lib/knowledge-layers";
import { KnowledgePointCard } from "@/components/knowledge-point-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TagFilter, collectTags, matchesTagFilter } from "@/components/tag-filter";
import { Input, Select } from "@/components/ui/input";

interface LibraryClientProps {
  initialPoints: KnowledgePoint[];
  initialSimilarities: Record<string, SimilarMatch[]>;
  initialContentConflicts: Record<string, ContentConflict[]>;
  initialConflictGroups: ConflictGroup[];
  initialFilters: FilterState;
}

function matchesStatusFilter(status: KnowledgeStatus, filter: string): boolean {
  if (!filter) return true;
  if (filter === "pending") return status === "draft" || status === "review";
  return status === filter;
}

function applyFilterLogic(
  points: KnowledgePoint[],
  f: FilterState,
  similarities: Record<string, SimilarMatch[]>,
  contentConflicts: Record<string, ContentConflict[]>
): KnowledgePoint[] {
  return points.filter((p) => {
    if (!matchesTagFilter(p.tags, f.tags)) return false;
    if (f.category && p.category !== f.category) return false;
    if (!matchesStatusFilter(p.status, f.status)) return false;
    if (f.similar === "similar" && !similarities[p.id]?.length) return false;
    if (f.similar === "duplicate" && !similarities[p.id]?.some((m) => m.level === "duplicate")) {
      return false;
    }
    if (f.similar === "content" && !contentConflicts[p.id]?.length) return false;
    if (f.source && p.source.file !== f.source) return false;
    if (f.layer && getLayer(p) !== f.layer) return false;
    if (f.usage && getUsage(p) !== f.usage) return false;
    if (f.internal === "only" && !isInternalOnly(p)) return false;
    if (f.internal === "external" && isInternalOnly(p)) return false;
    if (f.search) {
      const q = f.search.toLowerCase();
      const hay = `${p.id} ${p.title} ${p.summary} ${p.body} ${p.tags.join(" ")} ${p.audience.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function LibraryClient({
  initialPoints,
  initialSimilarities,
  initialContentConflicts,
  initialConflictGroups,
  initialFilters,
}: LibraryClientProps) {
  const [points, setPoints] = useState(initialPoints);
  const [similarities, setSimilarities] = useState(initialSimilarities);
  const [contentConflicts, setContentConflicts] = useState(initialContentConflicts);
  const [conflictGroups, setConflictGroups] = useState(initialConflictGroups);
  const [pending, setPending] = useState(initialFilters);

  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const applied = initialFilters;

  useEffect(() => {
    setPoints(initialPoints);
    setSimilarities(initialSimilarities);
    setContentConflicts(initialContentConflicts);
    setConflictGroups(initialConflictGroups);
  }, [initialPoints, initialSimilarities, initialContentConflicts, initialConflictGroups]);

  useEffect(() => {
    setPending(initialFilters);
  }, [filtersKey(initialFilters)]);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    setError("");
    try {
      window.location.reload();
    } catch {
      setError("刷新失败");
      setRefreshing(false);
    }
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(points.map((p) => p.category))).sort(),
    [points]
  );

  const allTags = useMemo(() => collectTags(points), [points]);

  const statusCounts = useMemo(() => {
    let pendingCount = 0;
    let approved = 0;
    for (const p of points) {
      if (p.status === "approved") approved++;
      else pendingCount++;
    }
    return { pending: pendingCount, approved, total: points.length };
  }, [points]);

  const layerCounts = useMemo(() => countByLayer(points), [points]);
  const usageCounts = useMemo(() => countByUsage(points), [points]);
  const internalCount = useMemo(() => countInternalOnly(points), [points]);

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

  const hasPendingChanges = filtersKey(pending) !== filtersKey(applied);

  const hasActiveFilters = filtersKey(applied) !== "";

  const filtered = useMemo(
    () => applyFilterLogic(points, applied, similarities, contentConflicts),
    [points, applied, similarities, contentConflicts]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, KnowledgePoint[]>();
    for (const p of filtered) {
      const cat = p.category || "未分类";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
    }
    return map;
  }, [filtered]);

  function navigateWithFilters(f: FilterState) {
    const qs = filtersToParams(f);
    window.location.href = qs ? `/library?${qs}` : "/library";
  }

  function applyFilters() {
    navigateWithFilters(pending);
  }

  function resetFilters() {
    navigateWithFilters({
      search: "",
      category: "",
      status: "",
      similar: "",
      source: "",
      layer: "",
      usage: "",
      internal: "",
      tags: [],
    });
  }

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
      setPoints((prev) => prev.map((p) => (p.id === updated.id ? payload : p)));
      setEditing(null);
      setSuccess(approve ? "已保存并批准入库" : "修改已保存");
      setTimeout(() => setSuccess(""), 3000);
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
    if (points.length === 0) return "暂无知识点。请先前往「导入文件」上传 PPT 或 Word。";
    if (applied.status === "pending" && statusCounts.pending === 0) return "当前没有待审核的知识点。";
    if (applied.similar === "similar" && similarStats.withSimilar === 0) return "当前库内未检测到相似项。";
    if (applied.similar === "content" && conflictStats.contentConflicts === 0) return "当前库内未检测到内容冲突。";
    return "没有符合筛选条件的知识点，试试放宽条件。";
  }

  function appliedLabel(): string {
    const parts: string[] = [];
    if (applied.search) parts.push(`「${applied.search}」`);
    if (applied.status === "pending") parts.push("待审核");
    if (applied.status === "approved") parts.push("已批准");
    if (applied.category) parts.push(applied.category);
    if (applied.similar === "similar") parts.push("有相似项");
    if (applied.similar === "duplicate") parts.push("高度重复");
    if (applied.similar === "content") parts.push("内容冲突");
    if (applied.tags.length) parts.push(`标签:${applied.tags.join("、")}`);
    if (applied.source) parts.push(`来源:${applied.source}`);
    if (applied.layer === "commons") parts.push("通识层");
    if (applied.layer === "company") parts.push("公司自有层");
    if (applied.usage && applied.usage in USAGE_LABELS) {
      parts.push(USAGE_LABELS[applied.usage as keyof typeof USAGE_LABELS]);
    }
    if (applied.internal === "only") parts.push("仅内训");
    if (applied.internal === "external") parts.push("可对外");
    return parts.length ? parts.join(" · ") : "";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">知识总库</h1>
          <p className="text-sm text-slate-500">
            共 {points.length} 个知识点，当前显示 {filtered.length} 个
            <span className="text-slate-400">
              {" "}（通识 {layerCounts.commons} · 公司 {layerCounts.company} · 待审核 {statusCounts.pending} · 已批准 {statusCounts.approved}）
            </span>
            {similarStats.withSimilar > 0 && (
              <span className="text-amber-600">
                {" "}· {similarStats.withSimilar} 条存在相似项
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
          <Button variant="ghost" size="sm" onClick={refreshData} disabled={refreshing}>
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
        <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>
      )}

      <form
        className="mb-4 rounded-lg border border-slate-200 bg-white p-4"
        action="/library"
        method="GET"
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters();
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-9"
              name="q"
              placeholder="搜索标题、内容、标签，如：一龄"
              value={pending.search}
              onChange={(e) => setPending((p) => ({ ...p, search: e.target.value }))}
            />
          </div>
          <Select
            name="category"
            value={pending.category}
            onChange={(e) => setPending((p) => ({ ...p, category: e.target.value }))}
            className="sm:w-40"
          >
            <option value="">全部分类</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          <Select
            name="layer"
            value={pending.layer}
            onChange={(e) => setPending((p) => ({ ...p, layer: e.target.value }))}
            className="sm:w-44"
          >
            <option value="">全部层级</option>
            <option value="commons">{LAYER_LABELS.commons}（{layerCounts.commons}）</option>
            <option value="company">{LAYER_LABELS.company}（{layerCounts.company}）</option>
          </Select>
          <Select
            name="usage"
            value={pending.usage}
            onChange={(e) => setPending((p) => ({ ...p, usage: e.target.value }))}
            className="sm:w-44"
          >
            <option value="">全部用途</option>
            <option value="pitch">{USAGE_LABELS.pitch}（{usageCounts.pitch}）</option>
            <option value="training">{USAGE_LABELS.training}（{usageCounts.training}）</option>
            <option value="ops">{USAGE_LABELS.ops}（{usageCounts.ops}）</option>
            <option value="both">{USAGE_LABELS.both}（{usageCounts.both}）</option>
          </Select>
          <Select
            name="internal"
            value={pending.internal}
            onChange={(e) => setPending((p) => ({ ...p, internal: e.target.value }))}
            className="sm:w-44"
          >
            <option value="">外发范围：全部</option>
            <option value="external">可对外（{points.length - internalCount}）</option>
            <option value="only">仅内训（{internalCount}）</option>
          </Select>
          <Select
            name="status"
            value={pending.status}
            onChange={(e) => setPending((p) => ({ ...p, status: e.target.value }))}
            className="sm:w-44"
          >
            <option value="">全部状态（{statusCounts.total}）</option>
            <option value="pending">待审核（{statusCounts.pending}）</option>
            <option value="approved">已批准（{statusCounts.approved}）</option>
          </Select>
          <Select
            name="similar"
            value={pending.similar}
            onChange={(e) => setPending((p) => ({ ...p, similar: e.target.value }))}
            className="sm:w-44"
          >
            <option value="">相似/冲突：全部</option>
            <option value="similar">有相似项（{similarStats.withSimilar}）</option>
            <option value="duplicate">高度重复（{similarStats.duplicates}）</option>
            <option value="content">内容冲突（{conflictStats.contentConflicts}）</option>
          </Select>
          {pending.tags.length > 0 && (
            <input type="hidden" name="tags" value={pending.tags.join(",")} />
          )}
          {pending.source && (
            <input type="hidden" name="source" value={pending.source} />
          )}
        </div>

        {applied.source && (
          <div className="mt-2 flex items-center gap-2 text-sm text-blue-700">
            <span>来源文件：{applied.source}</span>
            <button
              type="button"
              className="text-xs text-slate-500 underline hover:text-slate-700"
              onClick={() => navigateWithFilters({ ...applied, source: "" })}
            >
              清除
            </button>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button type="submit">
            <Check className="h-4 w-4" />
            应用筛选
          </Button>
          {hasActiveFilters && (
            <Button type="button" variant="ghost" onClick={resetFilters}>
              <X className="h-4 w-4" />
              清除条件
            </Button>
          )}
          {hasPendingChanges && (
            <span className="text-xs text-amber-600">条件已改，请点击「应用筛选」</span>
          )}
          {!hasPendingChanges && hasActiveFilters && (
            <span className="text-xs text-slate-500">
              当前：{appliedLabel()} · 显示 {filtered.length} 条
            </span>
          )}
        </div>
      </form>

      <TagFilter
        className="mb-6"
        allTags={allTags}
        appliedTags={pending.tags}
        onApply={(tags) => setPending((p) => ({ ...p, tags }))}
      />
      {pending.tags.join(",") !== applied.tags.join(",") && (
        <p className="-mt-4 mb-6 text-xs text-amber-600">标签已改，请点击上方「应用筛选」</p>
      )}

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
                  onToggleExpand={() => setExpanded(expanded === kp.id ? null : kp.id)}
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
