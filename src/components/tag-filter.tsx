"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TagFilterProps {
  /** All tags available in the dataset */
  allTags: string[];
  /** Currently applied tags (empty = no filter) */
  appliedTags: string[];
  onApply: (tags: string[]) => void;
  /** Optional: also run when user confirms (e.g. auto-select matching items) */
  onConfirm?: (tags: string[]) => void;
  confirmLabel?: string;
  className?: string;
}

export function TagFilter({
  allTags,
  appliedTags,
  onApply,
  onConfirm,
  confirmLabel = "确认筛选",
  className,
}: TagFilterProps) {
  const [pendingTags, setPendingTags] = useState<string[]>(appliedTags);

  useEffect(() => {
    setPendingTags(appliedTags);
  }, [appliedTags]);

  const hasPendingChanges = useMemo(() => {
    if (pendingTags.length !== appliedTags.length) return true;
    const sortedPending = [...pendingTags].sort();
    const sortedApplied = [...appliedTags].sort();
    return sortedPending.some((t, i) => t !== sortedApplied[i]);
  }, [pendingTags, appliedTags]);

  function toggleTag(tag: string) {
    setPendingTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleConfirm() {
    onApply(pendingTags);
    onConfirm?.(pendingTags);
  }

  function clearAll() {
    setPendingTags([]);
    onApply([]);
  }

  if (allTags.length === 0) return null;

  return (
    <div className={cn("rounded-lg border border-slate-200 bg-slate-50 p-3", className)}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-700">按标签筛选</p>
        {appliedTags.length > 0 && (
          <span className="text-xs text-slate-500">
            已生效：{appliedTags.join("、")}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {allTags.map((tag) => {
          const isPending = pendingTags.includes(tag);
          const isApplied = appliedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                isPending
                  ? "border-blue-500 bg-blue-100 text-blue-800"
                  : isApplied
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100"
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          onClick={handleConfirm}
          disabled={pendingTags.length === 0 && appliedTags.length === 0}
        >
          <Check className="h-3.5 w-3.5" />
          {confirmLabel}
        </Button>
        {(pendingTags.length > 0 || appliedTags.length > 0) && (
          <Button size="sm" variant="ghost" onClick={clearAll}>
            <X className="h-3.5 w-3.5" />
            清除标签
          </Button>
        )}
        {hasPendingChanges && pendingTags.length > 0 && (
          <span className="text-xs text-amber-600">已选 {pendingTags.length} 个标签，请点击「{confirmLabel}」生效</span>
        )}
      </div>
    </div>
  );
}

/** Match if point has ANY of the applied tags (OR logic). Empty applied = match all. */
export function matchesTagFilter(pointTags: string[], appliedTags: string[]): boolean {
  if (appliedTags.length === 0) return true;
  return appliedTags.some((t) => pointTags.includes(t));
}

/** Collect unique tags sorted by frequency */
export function collectTags<T extends { tags: string[] }>(items: T[]): string[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const tag of item.tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh"))
    .map(([tag]) => tag);
}
