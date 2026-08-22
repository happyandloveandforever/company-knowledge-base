"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TagFilterProps {
  allTags: string[];
  appliedTags: string[];
  onApply: (tags: string[]) => void;
  className?: string;
}

/** 点击标签即时筛选，无需确认 */
export function TagFilter({ allTags, appliedTags, onApply, className }: TagFilterProps) {
  function toggleTag(tag: string) {
    const next = appliedTags.includes(tag)
      ? appliedTags.filter((t) => t !== tag)
      : [...appliedTags, tag];
    onApply(next);
  }

  if (allTags.length === 0) return null;

  return (
    <div className={cn("rounded-lg border border-slate-200 bg-slate-50 p-3", className)}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-700">按标签筛选（点击即生效）</p>
        {appliedTags.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => onApply([])}>
            <X className="h-3.5 w-3.5" />
            清除标签
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {allTags.map((tag) => {
          const active = appliedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                active
                  ? "border-blue-500 bg-blue-100 text-blue-800"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100"
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function matchesTagFilter(pointTags: string[], appliedTags: string[]): boolean {
  if (appliedTags.length === 0) return true;
  return appliedTags.some((t) => pointTags.includes(t));
}

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
