"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Download,
  Presentation,
  CheckSquare,
  Square,
  FileText,
  Loader2,
  ArrowDown,
} from "lucide-react";
import type { KnowledgePoint, Outline } from "@/lib/types";
import {
  LAYER_LABELS,
  USAGE_LABELS,
  getLayer,
  getUsage,
  matchesUsageFilter,
  isInternalOnly,
} from "@/lib/knowledge-layers";
import { PRESENTATION_LOGICS } from "@/lib/presentation-logic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { TagFilter, collectTags, matchesTagFilter } from "@/components/tag-filter";

export default function ComposePage() {
  const [points, setPoints] = useState<KnowledgePoint[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState("通用");
  const [durationMin, setDurationMin] = useState(60);
  const [logicId, setLogicId] = useState(PRESENTATION_LOGICS[0].id);
  const [outline, setOutline] = useState<Outline | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [appliedTags, setAppliedTags] = useState<string[]>([]);
  const [layerFilter, setLayerFilter] = useState("");
  const [usageFilter, setUsageFilter] = useState("");
  const [includeInternal, setIncludeInternal] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/knowledge")
      .then((r) => r.json())
      .then((d) => {
        setPoints(d.knowledgePoints || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(timer);
  }, [search]);

  const allTags = useMemo(() => collectTags(points), [points]);

  const filtered = useMemo(() => {
    return points.filter((p) => {
      if (!includeInternal && isInternalOnly(p)) return false;
      if (layerFilter && getLayer(p) !== layerFilter) return false;
      if (usageFilter && !matchesUsageFilter(p, usageFilter)) return false;
      if (!matchesTagFilter(p.tags, appliedTags)) return false;
      if (!debouncedSearch) return true;
      const q = debouncedSearch.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [points, debouncedSearch, appliedTags, layerFilter, usageFilter, includeInternal]);

  const internalCount = useMemo(() => points.filter(isInternalOnly).length, [points]);

  const selectedPoints = useMemo(
    () => points.filter((p) => selected.has(p.id)),
    [points, selected]
  );

  const totalDuration = useMemo(
    () => selectedPoints.reduce((sum, p) => sum + p.durationMin, 0),
    [selectedPoints]
  );

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected(new Set(filtered.map((p) => p.id)));
  }, [filtered]);

  const clearAll = useCallback(() => {
    setSelected(new Set());
  }, []);

  function scrollToSettings() {
    settingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function generateOutline() {
    setError("");
    if (!title.trim()) {
      setError("请填写演讲标题");
      return;
    }
    if (selected.size === 0) {
      setError("请至少选择一个知识点");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/compose/outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          audience,
          durationMin,
          logicId,
          knowledgePointIds: Array.from(selected),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "生成失败");
        return;
      }
      setOutline(data.outline);
    } catch {
      setError("网络错误");
    } finally {
      setGenerating(false);
    }
  }

  async function downloadMarkdown() {
    const res = await fetch("/api/compose/outline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        audience,
        durationMin,
        logicId,
        knowledgePointIds: Array.from(selected),
        format: "markdown",
      }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}-大纲.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadPpt() {
    setExporting(true);
    setError("");
    try {
      const res = await fetch("/api/compose/ppt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          audience,
          durationMin,
          logicId,
          knowledgePointIds: Array.from(selected),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "导出 PPT 失败");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.pptx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("导出失败");
    } finally {
      setExporting(false);
    }
  }

  const currentLogic = PRESENTATION_LOGICS.find((l) => l.id === logicId);

  if (loading) {
    return <div className="py-20 text-center text-slate-500">加载中…</div>;
  }

  return (
    <div className={`mx-auto max-w-7xl px-4 py-8 sm:px-6 ${selected.size > 0 ? "pb-24" : ""}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">编排演讲</h1>
        <p className="text-sm text-slate-500">
          选择知识点和演讲逻辑，生成大纲，然后导出 PPT
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: knowledge point selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">选择知识点</CardTitle>
              <CardDescription>
                已选 {selected.size} 个 · 预计 {totalDuration} 分钟
              </CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-9"
                  placeholder="输入关键词即时筛选…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <Select value={layerFilter} onChange={(e) => setLayerFilter(e.target.value)}>
                  <option value="">全部层级</option>
                  <option value="commons">{LAYER_LABELS.commons}</option>
                  <option value="company">{LAYER_LABELS.company}</option>
                </Select>
                <Select value={usageFilter} onChange={(e) => setUsageFilter(e.target.value)}>
                  <option value="">全部用途</option>
                  <option value="pitch">{USAGE_LABELS.pitch}</option>
                  <option value="training">{USAGE_LABELS.training}</option>
                  <option value="ops">{USAGE_LABELS.ops}</option>
                  <option value="both">{USAGE_LABELS.both}</option>
                </Select>
              </div>
              <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                <input
                  type="checkbox"
                  checked={includeInternal}
                  onChange={(e) => setIncludeInternal(e.target.checked)}
                  className="rounded border-red-300"
                />
                包含「仅内训」{internalCount} 条（培训教材 + 内部原子库 + 疗法叙事，默认排除）
              </label>
              <TagFilter
                className="mt-3"
                allTags={allTags}
                appliedTags={appliedTags}
                onApply={setAppliedTags}
              />
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="ghost" onClick={selectAll}>全选当前列表</Button>
                <Button size="sm" variant="ghost" onClick={clearAll}>清空选择</Button>
              </div>
            </CardHeader>
            <CardContent className="max-h-[500px] space-y-2 overflow-y-auto">
              {filtered.map((kp) => {
                const isSelected = selected.has(kp.id);
                return (
                  <button
                    key={kp.id}
                    onClick={() => toggle(kp.id)}
                    className={`flex w-full items-start gap-2 rounded-lg border p-3 text-left transition-colors ${
                      isSelected
                        ? "border-blue-300 bg-blue-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    ) : (
                      <Square className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">{kp.title}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {isInternalOnly(kp) && (
                          <Badge className="bg-red-100 text-red-800">仅内训</Badge>
                        )}
                        <Badge variant={getLayer(kp) === "commons" ? "default" : "secondary"}>
                          {LAYER_LABELS[getLayer(kp)]}
                        </Badge>
                        <Badge variant="outline">{USAGE_LABELS[getUsage(kp)]}</Badge>
                        <Badge variant="secondary">{kp.category}</Badge>
                        {kp.tags.slice(0, 3).map((t) => (
                          <Badge key={t} variant="outline">{t}</Badge>
                        ))}
                        <span className="text-xs text-slate-400">{kp.durationMin}min</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right: config + outline */}
        <div className="space-y-4 lg:col-span-3" ref={settingsRef}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">演讲设置</CardTitle>
              {selected.size > 0 && (
                <CardDescription className="text-blue-600">
                  已选 {selected.size} 个知识点 · 预计 {totalDuration} 分钟 · 填写标题后点「生成大纲」
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">演讲标题</label>
                <Input
                  placeholder="例：2024 Q4 销售培训"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">目标受众</label>
                  <Input
                    placeholder="例：新人销售"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">预计时长（分钟）</label>
                  <Input
                    type="number"
                    value={durationMin}
                    onChange={(e) => setDurationMin(Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">演讲逻辑</label>
                <Select value={logicId} onChange={(e) => setLogicId(e.target.value)}>
                  {PRESENTATION_LOGICS.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </Select>
                {currentLogic && (
                  <p className="mt-1 text-xs text-slate-500">{currentLogic.description}</p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex flex-wrap gap-2">
                <Button onClick={generateOutline} disabled={generating}>
                  {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                  生成大纲
                </Button>
                {outline && (
                  <>
                    <Button variant="outline" onClick={downloadMarkdown}>
                      <Download className="h-4 w-4" />
                      导出 Markdown 大纲
                    </Button>
                    <Button variant="default" onClick={downloadPpt} disabled={exporting}>
                      {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Presentation className="h-4 w-4" />}
                      生成并下载 PPT
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {outline && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">演讲大纲预览</CardTitle>
                <CardDescription>
                  {outline.slides.length} 页 · 逻辑：{outline.logicName}
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[600px] space-y-3 overflow-y-auto">
                {outline.slides.map((slide) => (
                  <div key={slide.order} className="rounded-lg border border-slate-200 p-4">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {slide.order}
                      </span>
                      <h4 className="font-medium text-slate-900">{slide.title}</h4>
                      {slide.logicStep && (
                        <Badge variant="outline">{slide.logicStep}</Badge>
                      )}
                    </div>
                    <ul className="ml-8 list-disc text-sm text-slate-600">
                      {slide.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {selected.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-700">
              已选 <strong>{selected.size}</strong> 个知识点 · 预计 <strong>{totalDuration}</strong> 分钟
              {appliedTags.length > 0 && (
                <span className="text-slate-500"> · 标签：{appliedTags.join("、")}</span>
              )}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={scrollToSettings}>
                <ArrowDown className="h-4 w-4" />
                去生成大纲
              </Button>
              <Button size="sm" onClick={() => { scrollToSettings(); generateOutline(); }} disabled={generating}>
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                确认并生成大纲
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
