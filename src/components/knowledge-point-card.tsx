"use client";

import { useEffect, useState } from "react";
import { Pencil, Check, X, Save } from "lucide-react";
import type { KnowledgePoint, KnowledgeStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

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

const CATEGORY_OPTIONS = [
  "产品知识",
  "技术知识",
  "财务分析",
  "战略规划",
  "市场营销",
  "管理技能",
  "培训资料",
  "销售技巧",
  "未分类",
];

interface KnowledgePointCardProps {
  kp: KnowledgePoint;
  expanded: boolean;
  editing: boolean;
  onToggleExpand: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (updated: KnowledgePoint, approve?: boolean) => Promise<void>;
  onUpdateStatus: (status: KnowledgeStatus) => Promise<void>;
}

function splitCsv(value: string): string[] {
  return value
    .split(/[,，、]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** 从正文提取一句话摘要（取首段，最多 120 字） */
function generateSummaryFromBody(body: string, maxLen = 120): string {
  const firstBlock = body.split(/\n{2,}/)[0]?.trim() || body.trim();
  const line = firstBlock.split(/\n/)[0]?.trim() || firstBlock;
  const cleaned = line.replace(/\s+/g, " ");
  return cleaned.length > maxLen ? `${cleaned.slice(0, maxLen)}…` : cleaned;
}

export function KnowledgePointCard({
  kp,
  expanded,
  editing,
  onToggleExpand,
  onStartEdit,
  onCancelEdit,
  onSave,
  onUpdateStatus,
}: KnowledgePointCardProps) {
  const [form, setForm] = useState(kp);
  const [tagsInput, setTagsInput] = useState(kp.tags.join("、"));
  const [audienceInput, setAudienceInput] = useState(kp.audience.join("、"));
  const [autoSyncSummary, setAutoSyncSummary] = useState(false);
  const [summaryTouched, setSummaryTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm(kp);
      setTagsInput(kp.tags.join("、"));
      setAudienceInput(kp.audience.join("、"));
      setAutoSyncSummary(false);
      setSummaryTouched(false);
    }
  }, [editing, kp.id]);

  function updateBody(body: string) {
    setForm((prev) => ({
      ...prev,
      body,
      summary:
        autoSyncSummary && !summaryTouched
          ? generateSummaryFromBody(body)
          : prev.summary,
    }));
  }

  async function handleSave(approve = false) {
    setSaving(true);
    try {
      const updated: KnowledgePoint = {
        ...form,
        tags: splitCsv(tagsInput),
        audience: splitCsv(audienceInput),
        status: approve ? "approved" : form.status,
      };
      await onSave(updated, approve);
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <Card className="overflow-hidden border-blue-300 ring-2 ring-blue-100">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-blue-700">编辑知识点</CardTitle>
            <Badge variant="warning">编辑中</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">标题</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <label className="text-sm font-medium text-slate-700">摘要</label>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-500">
                  <input
                    type="checkbox"
                    checked={autoSyncSummary}
                    onChange={(e) => {
                      const on = e.target.checked;
                      setAutoSyncSummary(on);
                      if (on && !summaryTouched) {
                        setForm((prev) => ({
                          ...prev,
                          summary: generateSummaryFromBody(prev.body),
                        }));
                      }
                    }}
                    className="rounded border-slate-300"
                  />
                  随正文自动更新
                </label>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() => {
                    setSummaryTouched(false);
                    setForm((prev) => ({
                      ...prev,
                      summary: generateSummaryFromBody(prev.body),
                    }));
                  }}
                >
                  从正文生成
                </button>
              </div>
            </div>
            <Textarea
              rows={2}
              value={form.summary}
              onChange={(e) => {
                setSummaryTouched(true);
                setForm({ ...form, summary: e.target.value });
              }}
              placeholder="一句话概括；默认不随正文变化，可手动改或点「从正文生成」"
            />
            <p className="mt-1 text-xs text-slate-400">
              摘要独立保存，修改正文不会自动改摘要，除非勾选「随正文自动更新」
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">完整内容</label>
            <Textarea
              rows={8}
              className="min-h-[160px] font-mono text-sm"
              value={form.body}
              onChange={(e) => updateBody(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">分类</label>
              <Input
                list="category-options"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <datalist id="category-options">
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">预计时长（分钟）</label>
              <Input
                type="number"
                min={1}
                value={form.durationMin}
                onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) || 1 })}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">标签（逗号分隔）</label>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="漂浮方舟、定位、神经重置"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">适用受众（逗号分隔）</label>
            <Input
              value={audienceInput}
              onChange={(e) => setAudienceInput(e.target.value)}
              placeholder="政府汇报、投资人"
            />
          </div>
          <p className="text-xs text-slate-400">
            来源：{kp.source.file}{kp.source.location ? ` · ${kp.source.location}` : ""}
          </p>
          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <Button onClick={() => handleSave(false)} disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "保存中…" : "保存修改"}
            </Button>
            {kp.status !== "approved" && (
              <Button variant="default" onClick={() => handleSave(true)} disabled={saving}>
                <Check className="h-4 w-4" />
                保存并批准入库
              </Button>
            )}
            <Button variant="ghost" onClick={onCancelEdit} disabled={saving}>
              <X className="h-4 w-4" />
              取消
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
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
          onClick={onToggleExpand}
        >
          {expanded ? "收起" : "查看完整内容"}
        </button>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onStartEdit}>
            <Pencil className="h-3 w-3" /> 编辑
          </Button>
          {kp.status !== "approved" && (
            <Button size="sm" variant="outline" onClick={() => onUpdateStatus("approved")}>
              <Check className="h-3 w-3" /> 批准
            </Button>
          )}
          {kp.status === "approved" && (
            <Button size="sm" variant="ghost" onClick={() => onUpdateStatus("review")}>
              <X className="h-3 w-3" /> 退回审核
            </Button>
          )}
        </div>
      </CardContent>
      {expanded && (
        <CardContent className="border-t border-slate-100 bg-slate-50 pt-4">
          <pre className="whitespace-pre-wrap text-sm text-slate-700">{kp.body}</pre>
        </CardContent>
      )}
    </Card>
  );
}
