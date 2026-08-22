"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Check,
  RefreshCw,
  Star,
  Users,
} from "lucide-react";
import type { KnowledgePoint } from "@/lib/types";
import type { ConflictGroup } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

interface EnrichedGroup extends ConflictGroup {
  members: KnowledgePoint[];
}

export function ConflictGroupsClient() {
  const [groups, setGroups] = useState<EnrichedGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "allowed">("all");
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/knowledge/conflict-groups");
      const data = await res.json();
      setGroups(data.groups || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function groupAction(
    action: "allow" | "setPreferred",
    group: EnrichedGroup,
    pointId?: string
  ) {
    await fetch("/api/knowledge/conflict-groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        groupId: group.id,
        memberIds: group.memberIds,
        pointId,
        note: noteInputs[group.id] || group.note,
      }),
    });
    setMessage(action === "allow" ? "已标记为允许冲突（不同客户）" : "已设为首选版本");
    setTimeout(() => setMessage(""), 3000);
    load();
  }

  const filtered = groups.filter((g) => {
    if (filter === "pending") return !g.allowedConflict;
    if (filter === "allowed") return g.allowedConflict;
    return true;
  });

  if (loading) {
    return <div className="py-20 text-center text-slate-500">加载冲突组…</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">冲突组对照</h1>
          <p className="text-sm text-slate-500">
            同一主题的不同版本并排对比 · 冲突不一定是错误，可标记「不同客户」并选择需要的版本
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/library">
            <Button variant="outline">返回总库</Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={load}>
            <RefreshCw className="h-4 w-4" />
            刷新
          </Button>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>
      )}

      <div className="mb-6 flex gap-2">
        {(["all", "pending", "allowed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg border px-4 py-2 text-sm ${
              filter === f ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200"
            }`}
          >
            {f === "all" ? "全部" : f === "pending" ? "待处理" : "已允许冲突"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <p className="text-slate-500">
              {groups.length === 0
                ? "当前没有检测到冲突组。多种愿景/定位表述可手动在编辑时加入同一版本组。"
                : "没有符合筛选的冲突组。"}
            </p>
          </CardContent>
        </Card>
      ) : (
        filtered.map((group) => (
          <Card key={group.id} className="mb-6 overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    {group.topic}
                  </CardTitle>
                  <p className="mt-1 text-xs text-slate-500">
                    {group.type === "numeric" && "数据冲突"}
                    {group.type === "definition" && "定义/表述差异"}
                    {group.type === "mixed" && "自定义版本组"}
                    {" · "}{group.memberIds.length} 个版本
                  </p>
                  {group.details.length > 0 && (
                    <ul className="mt-2 text-xs text-slate-600">
                      {group.details.map((d, i) => (
                        <li key={i}>· {d}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {group.allowedConflict ? (
                  <Badge variant="success" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    已允许·不同客户
                  </Badge>
                ) : (
                  <Badge variant="warning">待确认</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {/* 并排对比 */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.members.map((kp) => (
                  <div
                    key={kp.id}
                    className={`rounded-xl border p-4 ${
                      kp.isPreferredInGroup
                        ? "border-blue-400 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{kp.title}</h3>
                      {kp.isPreferredInGroup && (
                        <Badge variant="default" className="shrink-0">
                          <Star className="mr-0.5 h-3 w-3" />
                          首选
                        </Badge>
                      )}
                    </div>
                    {kp.variantLabel && (
                      <Badge variant="secondary" className="mb-2">{kp.variantLabel}</Badge>
                    )}
                    <p className="mb-2 text-xs text-slate-500">{kp.summary}</p>
                    <pre className="mb-3 max-h-32 overflow-y-auto whitespace-pre-wrap text-xs text-slate-700">
                      {kp.body.slice(0, 300)}
                      {kp.body.length > 300 ? "…" : ""}
                    </pre>
                    <div className="flex flex-wrap gap-1 text-xs text-slate-400">
                      {kp.audience.map((a) => (
                        <span key={a} className="rounded bg-slate-100 px-1.5 py-0.5">{a}</span>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant={kp.isPreferredInGroup ? "default" : "outline"}
                        onClick={() => groupAction("setPreferred", group, kp.id)}
                      >
                        <Star className="h-3 w-3" />
                        选这个
                      </Button>
                      <Link href={`/library?edit=${kp.id}`}>
                        <Button size="sm" variant="ghost">编辑</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* 组级操作 */}
              {!group.allowedConflict && (
                <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-4">
                  <p className="mb-2 text-sm text-slate-600">
                    这些冲突是有意为之（不同客户/场景）？标记后不再提示为错误。
                  </p>
                  <Textarea
                    rows={2}
                    placeholder="说明用途，如：政府版 vs 投资人版 vs 内部培训版"
                    value={noteInputs[group.id] ?? group.note ?? ""}
                    onChange={(e) =>
                      setNoteInputs((prev) => ({ ...prev, [group.id]: e.target.value }))
                    }
                    className="mb-2"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => groupAction("allow", group)}
                  >
                    <Check className="h-3 w-3" />
                    标记为「允许冲突·不同客户」
                  </Button>
                </div>
              )}
              {group.allowedConflict && group.note && (
                <p className="mt-3 text-sm text-slate-500">备注：{group.note}</p>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
