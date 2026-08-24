"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Check, X, Save, Trash2, Link2 } from "lucide-react";
import type { KnowledgePoint, KnowledgeStatus, KnowledgeLayer, KnowledgeUsage } from "@/lib/types";
import {
  LAYER_LABELS,
  USAGE_LABELS,
  getLayer,
  getUsage,
} from "@/lib/knowledge-layers";
import type { SimilarMatch } from "@/lib/similarity";
import type { ContentConflict } from "@/lib/conflict-detector";
import { SIMILARITY_LABELS } from "@/lib/similarity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";

const STATUS_LABELS: Record<KnowledgeStatus, string> = {
  draft: "待审核",
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
  similarMatches?: SimilarMatch[];
  contentConflicts?: ContentConflict[];
  conflictGroupId?: string;
  onToggleExpand: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (updated: KnowledgePoint, approve?: boolean) => Promise<void>;
  onUpdateStatus: (status: KnowledgeStatus) => Promise<void>;
  onDelete: () => Promise<void>;
  onJumpToSimilar?: (id: string) => void;
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
  onDelete,
  onJumpToSimilar,
  similarMatches = [],
  contentConflicts = [],
  conflictGroupId,
}: KnowledgePointCardProps) {
  const [form, setForm] = useState(kp);
  const [tagsInput, setTagsInput] = useState(kp.tags.join("、"));
  const [audienceInput, setAudienceInput] = useState(kp.audience.join("、"));
  const [autoSyncSummary, setAutoSyncSummary] = useState(false);
  const [summaryTouched, setSummaryTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm(kp);
      setTagsInput(kp.tags.join("、"));
      setAudienceInput(kp.audience.join("、"));
      setAutoSyncSummary(false);
      setSummaryTouched(false);
    }
  }, [editing, kp.id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  const topSimilar = similarMatches[0];
  const hasContentConflict = contentConflicts.length > 0;

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
              <label className="mb-1 block text-sm font-medium text-slate-700">知识层级</label>
              <Select
                value={getLayer(form)}
                onChange={(e) => setForm({ ...form, layer: e.target.value as KnowledgeLayer })}
              >
                <option value="commons">{LAYER_LABELS.commons}</option>
                <option value="company">{LAYER_LABELS.company}</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">用途</label>
              <Select
                value={getUsage(form)}
                onChange={(e) => setForm({ ...form, usage: e.target.value as KnowledgeUsage })}
              >
                <option value="pitch">{USAGE_LABELS.pitch}</option>
                <option value="training">{USAGE_LABELS.training}</option>
                <option value="ops">{USAGE_LABELS.ops}</option>
                <option value="both">{USAGE_LABELS.both}</option>
              </Select>
            </div>
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
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-3">
            <p className="text-sm font-medium text-slate-700">版本与冲突设置</p>
            <div>
              <label className="mb-1 block text-xs text-slate-600">版本标签（如「政府版愿景」）</label>
              <Input
                value={form.variantLabel || ""}
                onChange={(e) => setForm({ ...form, variantLabel: e.target.value })}
                placeholder="投资人版 · 愿景"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600">版本组 ID（同组并排对比，可留空自动生成）</label>
              <Input
                value={form.variantGroupId || ""}
                onChange={(e) => setForm({ ...form, variantGroupId: e.target.value })}
                placeholder="CG-VISION-001"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-600">冲突说明（不同客户/场景）</label>
              <Input
                value={form.conflictNote || ""}
                onChange={(e) => setForm({ ...form, conflictNote: e.target.value })}
                placeholder="杨浦政府汇报专用表述"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={!!form.conflictAllowed}
                onChange={(e) => setForm({ ...form, conflictAllowed: e.target.checked })}
                className="rounded border-slate-300"
              />
              允许与其他版本冲突（针对不同客户，非错误）
            </label>
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
    <Card
      id={`kp-${kp.id}`}
      className={`overflow-hidden ${
        hasContentConflict
          ? "border-red-400 ring-1 ring-red-100"
          : topSimilar?.level === "duplicate"
            ? "border-amber-400 ring-1 ring-amber-100"
            : topSimilar?.level === "similar"
              ? "border-orange-200"
              : ""
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-base">{kp.title}</CardTitle>
            <p className="mt-1 text-sm text-slate-500">{kp.summary}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={getLayer(kp) === "commons" ? "default" : "secondary"}>
              {LAYER_LABELS[getLayer(kp)]}
            </Badge>
            <Badge variant="outline">{USAGE_LABELS[getUsage(kp)]}</Badge>
            <Badge variant={STATUS_VARIANT[kp.status]}>
              {STATUS_LABELS[kp.status]}
            </Badge>
            {hasContentConflict && (
              <Badge variant="warning" className="bg-red-100 text-red-800">
                内容冲突
              </Badge>
            )}
            {topSimilar && (
              <Badge variant={topSimilar.level === "duplicate" ? "warning" : "outline"}>
                {SIMILARITY_LABELS[topSimilar.level]} {Math.round(topSimilar.score * 100)}%
              </Badge>
            )}
          </div>
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
        {contentConflicts.length > 0 && (
          <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-900">
            <div className="mb-1 font-medium">⚠ 内容冲突：同一主题数据不一致</div>
            <ul className="space-y-2 text-xs">
              {contentConflicts.slice(0, 3).map((c, i) => (
                <li key={`${c.id}-${c.topic}-${i}`} className="rounded bg-white/80 p-2">
                  <div className="font-medium">{c.topic}：本条「{c.myValue}」 vs 冲突条「{c.theirValue}」</div>
                  <button
                    type="button"
                    className="mt-1 text-blue-700 hover:underline"
                    onClick={() => onJumpToSimilar?.(c.id)}
                  >
                    对比：{c.title}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-red-700">
              建议：在「冲突组」页并排对比，选需要的版本；若针对不同客户，标记「允许冲突」
            </p>
            <Link
              href={`/library/conflicts${conflictGroupId ? `#${conflictGroupId}` : ""}`}
              className="mt-2 inline-block text-xs font-medium text-blue-700 hover:underline"
            >
              打开冲突组并排对比 →
            </Link>
          </div>
        )}
        {(conflictGroupId || kp.conflictAllowed) && contentConflicts.length === 0 && (
          <div className="mt-3 rounded-lg bg-slate-50 p-2 text-xs text-slate-600">
            版本组：{kp.variantLabel || kp.variantGroupId}
            {kp.conflictAllowed && " · 已允许冲突"}
            <Link href="/library/conflicts" className="ml-2 text-blue-600 hover:underline">
              查看冲突组
            </Link>
          </div>
        )}
        {similarMatches.length > 0 && (
          <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            <div className="mb-1 flex items-center gap-1 font-medium">
              <Link2 className="h-3.5 w-3.5" />
              与现有知识点相似，请核对后再入库
            </div>
            <ul className="space-y-1 text-xs">
              {similarMatches.slice(0, 3).map((m) => (
                <li key={m.id} className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-white/80 px-1.5 py-0.5">
                    {SIMILARITY_LABELS[m.level]} · {Math.round(m.score * 100)}%
                  </span>
                  <button
                    type="button"
                    className="text-left text-blue-700 hover:underline"
                    onClick={() => onJumpToSimilar?.(m.id)}
                  >
                    {m.title}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-amber-700">
              建议：高度重复可删除本条；内容相似但不同场景可都保留并改标题区分
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          className="text-sm text-blue-600 hover:underline"
          onClick={onToggleExpand}
        >
          {expanded ? "收起" : "查看完整内容"}
        </button>
        <div className="flex flex-wrap gap-2">
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
          {!confirmDelete ? (
            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="h-3 w-3" /> 删除
            </Button>
          ) : (
            <>
              <Button size="sm" variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? "删除中…" : "确认删除"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                取消
              </Button>
            </>
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
