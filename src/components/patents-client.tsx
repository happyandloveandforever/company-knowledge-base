"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PenLine, Scale, Search, ShieldAlert } from "lucide-react";
import type { PatentCluster, PatentKind, PatentRecord, PatentRisk } from "@/lib/types";
import {
  PATENT_CLUSTER_LABELS,
  PATENT_KIND_LABELS,
  PATENT_RISK_LABELS,
  countByCluster,
  countByKind,
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

interface PatentsClientProps {
  initialPatents: PatentRecord[];
  sourceCount: number;
  initialKind: string;
  initialCluster: string;
  initialRisk: string;
  initialQuery: string;
}

export function PatentsClient({
  initialPatents,
  sourceCount,
  initialKind,
  initialCluster,
  initialRisk,
  initialQuery,
}: PatentsClientProps) {
  const router = useRouter();
  const [kind, setKind] = useState(initialKind);
  const [cluster, setCluster] = useState(initialCluster);
  const [risk, setRisk] = useState(initialRisk);
  const [query, setQuery] = useState(initialQuery);
  const [expanded, setExpanded] = useState<string | null>(
    initialPatents.find((p) => p.id === "PAT-MAP-001")?.id ?? initialPatents[0]?.id ?? null
  );

  // 站内跳转（如「先写第一件」）只换 searchParams，组件不会重挂载，
  // 得把新的 URL 参数同步回筛选状态，否则列表不跟着变。
  const urlFilters = `${initialKind}|${initialCluster}|${initialRisk}|${initialQuery}`;
  const [syncedFilters, setSyncedFilters] = useState(urlFilters);
  if (urlFilters !== syncedFilters) {
    setSyncedFilters(urlFilters);
    setKind(initialKind);
    setCluster(initialCluster);
    setRisk(initialRisk);
    setQuery(initialQuery);
  }

  const kinds = countByKind(initialPatents);
  const clusters = countByCluster(initialPatents);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialPatents.filter((p) => {
      if (kind && p.kind !== kind) return false;
      if (cluster && p.cluster !== cluster) return false;
      if (risk && p.risk !== risk) return false;
      if (q) {
        const hay = `${p.id} ${p.title} ${p.summary} ${p.body} ${p.tags.join(" ")} ${p.publicationNo ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [initialPatents, kind, cluster, risk, query]);

  function applyFilters(next: { kind?: string; cluster?: string; risk?: string; q?: string }) {
    const k = next.kind ?? kind;
    const c = next.cluster ?? cluster;
    const r = next.risk ?? risk;
    const q = next.q ?? query;
    const params = new URLSearchParams();
    if (k) params.set("kind", k);
    if (c) params.set("cluster", c);
    if (r) params.set("risk", r);
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
              与知识总库分开。六簇全部挂到母案 A/B；多模态交互是 B4–B7，不另立母案 3。写专利查本库，给客户做 PPT 仍走总库。
              当前 {initialPatents.length} 条，来自 {sourceCount} 份来源（含重构版整体报告）。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/library">
              <Button variant="outline">返回知识总库</Button>
            </Link>
            <Link href="/patents?kind=draft">
              <Button>
                <PenLine className="h-4 w-4" />
                先写第一件 {kinds.draft}
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
        <FilterStat label="交底书 / 撰写" value={kinds.draft} hint="第一件先写母案A" />
        <FilterStat label="路线 / 布局" value={kinds.roadmap + kinds.layout} hint="母案与红绿灯" />
        <FilterStat label="技术簇" value={kinds.cluster} hint="六簇结论" />
        <FilterStat label="检索到的专利" value={kinds.retrieved} hint="高风险前案合并卡" />
        <FilterStat label="缺口" value={kinds.gap} hint="数据和法律状态" />
      </div>

      <Card className="mb-6">
        <CardContent className="grid gap-3 p-4 md:grid-cols-4">
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
