"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PenLine, Scale, Search, ShieldAlert } from "lucide-react";
import type {
  PatentCluster,
  PatentGroup,
  PatentKind,
  PatentLifecycle,
  PatentRecord,
  PatentRisk,
} from "@/lib/types";
import {
  PATENT_CLUSTER_LABELS,
  PATENT_GROUP_LABELS,
  PATENT_KIND_LABELS,
  PATENT_LIFECYCLE_LABELS,
  PATENT_RISK_LABELS,
  countByCluster,
  countByGroup,
  countByKind,
  countByLifecycle,
  lifecycleOf,
} from "@/lib/patent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";

const RISK_CLASS: Record<string, string> = {
  critical: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-slate-100 text-slate-700",
  green: "bg-emerald-100 text-emerald-800",
};

const LIFECYCLE_CLASS: Record<PatentLifecycle, string> = {
  active: "bg-emerald-100 text-emerald-800",
  superseded: "bg-slate-200 text-slate-600",
  killed: "bg-red-100 text-red-800",
  stale: "bg-amber-100 text-amber-800",
};

interface PatentsClientProps {
  initialPatents: PatentRecord[];
  sourceCount: number;
  initialKind: string;
  initialCluster: string;
  initialRisk: string;
  initialLifecycle: string;
  initialGroup: string;
  initialQuery: string;
}

export function PatentsClient({
  initialPatents,
  sourceCount,
  initialKind,
  initialCluster,
  initialRisk,
  initialLifecycle,
  initialGroup,
  initialQuery,
}: PatentsClientProps) {
  const router = useRouter();
  const [kind, setKind] = useState(initialKind);
  const [cluster, setCluster] = useState(initialCluster);
  const [risk, setRisk] = useState(initialRisk);
  const [lifecycle, setLifecycle] = useState(initialLifecycle);
  const [group, setGroup] = useState(initialGroup);
  const [query, setQuery] = useState(initialQuery);
  const [expanded, setExpanded] = useState<string | null>(
    initialPatents.find((p) => p.id === "PAT-INDEX-001")?.id ?? initialPatents[0]?.id ?? null
  );

  // 站内跳转（如「先写第一件」）只换 searchParams，组件不会重挂载，
  // 得把新的 URL 参数同步回筛选状态，否则列表不跟着变。
  const urlFilters = `${initialKind}|${initialCluster}|${initialRisk}|${initialLifecycle}|${initialGroup}|${initialQuery}`;
  const [syncedFilters, setSyncedFilters] = useState(urlFilters);
  if (urlFilters !== syncedFilters) {
    setSyncedFilters(urlFilters);
    setKind(initialKind);
    setCluster(initialCluster);
    setRisk(initialRisk);
    setLifecycle(initialLifecycle);
    setGroup(initialGroup);
    setQuery(initialQuery);
  }

  const kinds = countByKind(initialPatents);
  const clusters = countByCluster(initialPatents);
  const lifecycles = countByLifecycle(initialPatents);
  const groups = countByGroup(initialPatents);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialPatents.filter((p) => {
      if (kind && p.kind !== kind) return false;
      if (cluster && p.cluster !== cluster) return false;
      if (risk && p.risk !== risk) return false;
      if (lifecycle && lifecycleOf(p) !== lifecycle) return false;
      if (group && (p.group ?? "none") !== group) return false;
      if (q) {
        const hay = `${p.id} ${p.title} ${p.summary} ${p.body} ${p.tags.join(" ")} ${p.publicationNo ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [initialPatents, kind, cluster, risk, lifecycle, group, query]);

  function applyFilters(next: {
    kind?: string;
    cluster?: string;
    risk?: string;
    lifecycle?: string;
    group?: string;
    q?: string;
  }) {
    const k = next.kind ?? kind;
    const c = next.cluster ?? cluster;
    const r = next.risk ?? risk;
    const lc = next.lifecycle ?? lifecycle;
    const g = next.group ?? group;
    const q = next.q ?? query;
    const params = new URLSearchParams();
    if (k) params.set("kind", k);
    if (c) params.set("cluster", c);
    if (r) params.set("risk", r);
    if (lc) params.set("lifecycle", lc);
    if (g) params.set("group", g);
    if (q) params.set("q", q);
    const qs = params.toString();
    router.replace(qs ? `/patents?${qs}` : "/patents");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <section className="mb-6 rounded-2xl border border-red-200 bg-red-50/60 px-6 py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-red-800">
              <ShieldAlert className="h-4 w-4" />
              仅内部 · 禁止外发 · 非正式法律意见
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">公司专利库</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              与知识总库分开。库里同时存着现行结论和被推翻的旧结论，先看每张卡的生命周期标记再读内容。
              母案框架已退役，改按四个申请组组织（PAT-BATCH-002）。入口先读 PAT-INDEX-001。
              当前 {initialPatents.length} 条，来自 {sourceCount} 份来源。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/library">
              <Button variant="outline">返回知识总库</Button>
            </Link>
            <Link href="/patents?lifecycle=active">
              <Button>
                <PenLine className="h-4 w-4" />
                只看现行 {lifecycles.active}
              </Button>
            </Link>
            <Link href="/patents?lifecycle=killed">
              <Button variant="secondary">
                <ShieldAlert className="h-4 w-4" />
                不要写 {lifecycles.killed}
              </Button>
            </Link>
            <Link href="/patents?kind=retrieved">
              <Button variant="secondary">
                <Scale className="h-4 w-4" />
                只看检索卡 {kinds.retrieved}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Link href="/patents?group=g1" className="block">
          <FilterStat label={PATENT_GROUP_LABELS.g1} value={groups.g1} hint="独权候选 PAT-ROAD-A" />
        </Link>
        <Link href="/patents?group=g2" className="block">
          <FilterStat label={PATENT_GROUP_LABELS.g2} value={groups.g2} hint="独权候选 PAT-IDEA-046 · 第一梯队" />
        </Link>
        <Link href="/patents?group=g3" className="block">
          <FilterStat label={PATENT_GROUP_LABELS.g3} value={groups.g3} hint="独权候选 PAT-IDEA-049" />
        </Link>
        <Link href="/patents?group=g4" className="block">
          <FilterStat label={PATENT_GROUP_LABELS.g4} value={groups.g4} hint="独权候选 PAT-ROAD-B" />
        </Link>
        <Link href="/patents?group=g5" className="block">
          <FilterStat label={PATENT_GROUP_LABELS.g5} value={groups.g5} hint="独权候选 PAT-IDEA-055" />
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="grid gap-3 p-4 md:grid-cols-3 lg:grid-cols-6">
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">状态</span>
            <Select
              value={lifecycle}
              onChange={(e) => {
                setLifecycle(e.target.value);
                applyFilters({ lifecycle: e.target.value });
              }}
            >
              <option value="">全部状态</option>
              {(Object.keys(PATENT_LIFECYCLE_LABELS) as PatentLifecycle[]).map((l) => (
                <option key={l} value={l}>
                  {PATENT_LIFECYCLE_LABELS[l]} ({lifecycles[l]})
                </option>
              ))}
            </Select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">申请组</span>
            <Select
              value={group}
              onChange={(e) => {
                setGroup(e.target.value);
                applyFilters({ group: e.target.value });
              }}
            >
              <option value="">全部分组</option>
              {(Object.keys(PATENT_GROUP_LABELS) as PatentGroup[]).map((g) => (
                <option key={g} value={g}>
                  {PATENT_GROUP_LABELS[g]} ({groups[g]})
                </option>
              ))}
            </Select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">搜索</span>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                className="pl-9"
                placeholder="公开号、标题、红灯…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyFilters({ q: query });
                }}
              />
            </div>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">类型</span>
            <Select
              value={kind}
              onChange={(e) => {
                setKind(e.target.value);
                applyFilters({ kind: e.target.value });
              }}
            >
              <option value="">全部类型</option>
              {(Object.keys(PATENT_KIND_LABELS) as PatentKind[]).map((k) => (
                <option key={k} value={k}>
                  {PATENT_KIND_LABELS[k]}
                </option>
              ))}
            </Select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">技术簇</span>
            <Select
              value={cluster}
              onChange={(e) => {
                setCluster(e.target.value);
                applyFilters({ cluster: e.target.value });
              }}
            >
              <option value="">全部簇</option>
              {(Object.keys(PATENT_CLUSTER_LABELS) as PatentCluster[]).map((c) => (
                <option key={c} value={c}>
                  {PATENT_CLUSTER_LABELS[c]} ({clusters[c]})
                </option>
              ))}
            </Select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">风险</span>
            <Select
              value={risk}
              onChange={(e) => {
                setRisk(e.target.value);
                applyFilters({ risk: e.target.value });
              }}
            >
              <option value="">全部风险</option>
              {(Object.keys(PATENT_RISK_LABELS) as PatentRisk[]).map((r) => (
                <option key={r} value={r}>
                  {PATENT_RISK_LABELS[r]}
                </option>
              ))}
            </Select>
          </label>
        </CardContent>
      </Card>

      <p className="mb-3 text-sm text-slate-500">
        显示 {filtered.length} / {initialPatents.length}。矩阵原文未逐条入库，高风险前案已主题合并。
      </p>

      <div className="space-y-3">
        {filtered.map((p) => {
          const open = expanded === p.id;
          return (
            <Card key={p.id} id={p.id} className={open ? "border-slate-300 shadow-sm" : ""}>
              <button
                type="button"
                className="w-full text-left"
                onClick={() => setExpanded(open ? null : p.id)}
              >
                <CardHeader className="py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{p.id}</Badge>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${LIFECYCLE_CLASS[lifecycleOf(p)]}`}
                    >
                      {PATENT_LIFECYCLE_LABELS[lifecycleOf(p)]}
                    </span>
                    {p.group && p.group !== "none" && (
                      <Badge variant="secondary">{PATENT_GROUP_LABELS[p.group]}</Badge>
                    )}
                    <Badge>{PATENT_KIND_LABELS[p.kind]}</Badge>
                    <Badge variant="secondary">{PATENT_CLUSTER_LABELS[p.cluster]}</Badge>
                    {p.risk && (
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${RISK_CLASS[p.risk]}`}>
                        {PATENT_RISK_LABELS[p.risk]}
                      </span>
                    )}
                    {p.publicationNo && <Badge variant="outline">{p.publicationNo}</Badge>}
                  </div>
                  <CardTitle className="mt-2 text-base">{p.title}</CardTitle>
                  <CardDescription>{p.summary}</CardDescription>
                  {p.supersededBy && (
                    <p className="mt-1 text-xs text-slate-500">已被 {p.supersededBy} 取代，保留做决策留痕</p>
                  )}
                </CardHeader>
              </button>
              {open && (
                <CardContent className="space-y-3 border-t border-slate-100 pt-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-slate-700">{p.body}</pre>
                  {p.examples.length > 0 && (
                    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                      {p.examples.map((ex) => (
                        <li key={ex}>{ex}</li>
                      ))}
                    </ul>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                    <span>来源：{p.source.file}</span>
                    {p.source.location && <span>· {p.source.location}</span>}
                    {p.techBranch && <span>· {p.techBranch}</span>}
                    {p.jurisdiction && <span>· {p.jurisdiction}</span>}
                  </div>
                  {p.relatedIds.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {p.relatedIds.map((id) => (
                        <button
                          key={id}
                          type="button"
                          className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700 hover:bg-slate-200"
                          onClick={() => {
                            setExpanded(id);
                            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                        >
                          {id}
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function FilterStat({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-slate-500">{hint}</CardContent>
    </Card>
  );
}
