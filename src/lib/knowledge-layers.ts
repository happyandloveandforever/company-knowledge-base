import type { KnowledgeLayer, KnowledgePoint, KnowledgeUsage } from "./types";

export const LAYER_LABELS: Record<KnowledgeLayer, string> = {
  commons: "通识层",
  company: "公司自有层",
};

export const USAGE_LABELS: Record<KnowledgeUsage, string> = {
  pitch: "汇报/提案",
  training: "培训",
  ops: "运营SOP",
  both: "汇报+培训",
};

export function getLayer(point: KnowledgePoint): KnowledgeLayer {
  return point.layer ?? "company";
}

export function getUsage(point: KnowledgePoint): KnowledgeUsage {
  return point.usage ?? "both";
}

/**
 * 筛选「培训」或「汇报」时，把 usage=both（汇报+培训）一并算上。
 * 「运营SOP」「汇报+培训」仍按精确值匹配。
 */
export function matchesUsageFilter(point: KnowledgePoint, filter: string): boolean {
  if (!filter) return true;
  const usage = getUsage(point);
  if (filter === "training" || filter === "pitch") {
    return usage === filter || usage === "both";
  }
  return usage === filter;
}

export function countByLayer(points: KnowledgePoint[]): Record<KnowledgeLayer, number> {
  const counts: Record<KnowledgeLayer, number> = { commons: 0, company: 0 };
  for (const point of points) {
    counts[getLayer(point)] += 1;
  }
  return counts;
}

export function isInternalOnly(point: KnowledgePoint): boolean {
  return point.internalOnly === true;
}

export function countInternalOnly(points: KnowledgePoint[]): number {
  return points.reduce((sum, point) => sum + (isInternalOnly(point) ? 1 : 0), 0);
}

export function countByUsage(points: KnowledgePoint[]): Record<KnowledgeUsage, number> {
  const counts: Record<KnowledgeUsage, number> = {
    pitch: 0,
    training: 0,
    ops: 0,
    both: 0,
  };
  for (const point of points) {
    counts[getUsage(point)] += 1;
  }
  return counts;
}
