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

export function countByLayer(points: KnowledgePoint[]): Record<KnowledgeLayer, number> {
  const counts: Record<KnowledgeLayer, number> = { commons: 0, company: 0 };
  for (const point of points) {
    counts[getLayer(point)] += 1;
  }
  return counts;
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
