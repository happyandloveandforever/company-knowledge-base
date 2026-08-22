import type { KnowledgePoint } from "./types";

export type SimilarityLevel = "duplicate" | "similar";

export interface SimilarMatch {
  id: string;
  title: string;
  score: number;
  level: SimilarityLevel;
}

const DUPLICATE_THRESHOLD = 0.85;
const SIMILAR_THRESHOLD = 0.62;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^\w\u4e00-\u9fff]/g, "");
}

function charBigrams(s: string): Set<string> {
  const set = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
  return set;
}

/** Sørensen–Dice 系数，适合中文短文本 */
export function textSimilarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  if (na.length >= 8 && nb.length >= 8 && (na.includes(nb) || nb.includes(na))) {
    return 0.92;
  }

  const ba = charBigrams(na);
  const bb = charBigrams(nb);
  if (ba.size === 0 || bb.size === 0) return 0;

  let inter = 0;
  for (const x of ba) if (bb.has(x)) inter++;
  return (2 * inter) / (ba.size + bb.size);
}

export function compareKnowledgePoints(a: KnowledgePoint, b: KnowledgePoint): number {
  if (a.id === b.id) return 1;

  const titleSim = textSimilarity(a.title, b.title);
  const summarySim = textSimilarity(a.summary, b.summary);
  const bodySim = textSimilarity(a.body.slice(0, 800), b.body.slice(0, 800));

  return titleSim * 0.45 + bodySim * 0.4 + summarySim * 0.15;
}

export function getSimilarityLevel(score: number): SimilarityLevel | null {
  if (score >= DUPLICATE_THRESHOLD) return "duplicate";
  if (score >= SIMILAR_THRESHOLD) return "similar";
  return null;
}

/** 在候选列表中为一条知识点找相似项（不含自身） */
export function findSimilarTo(
  point: KnowledgePoint,
  candidates: KnowledgePoint[],
  excludeIds: Set<string> = new Set()
): SimilarMatch[] {
  const matches: SimilarMatch[] = [];

  for (const other of candidates) {
    if (other.id === point.id || excludeIds.has(other.id)) continue;

    const score = compareKnowledgePoints(point, other);
    const level = getSimilarityLevel(score);
    if (!level) continue;

    matches.push({
      id: other.id,
      title: other.title,
      score: Math.round(score * 100) / 100,
      level,
    });
  }

  return matches.sort((a, b) => b.score - a.score);
}

/** 扫描整个库，返回每条知识点的相似项 */
export function scanAllSimilarities(
  points: KnowledgePoint[]
): Record<string, SimilarMatch[]> {
  const map: Record<string, SimilarMatch[]> = {};

  for (const point of points) {
    const others = points.filter((p) => p.id !== point.id);
    const matches = findSimilarTo(point, others);
    if (matches.length > 0) map[point.id] = matches;
  }

  return map;
}

/** 新导入批次：与已有库 + 批内互相比对 */
export function checkImportConflicts(
  newPoints: KnowledgePoint[],
  existingPoints: KnowledgePoint[]
): Record<string, SimilarMatch[]> {
  const conflicts: Record<string, SimilarMatch[]> = {};

  for (const point of newPoints) {
    const againstExisting = findSimilarTo(point, existingPoints);
    const againstBatch = findSimilarTo(
      point,
      newPoints,
      new Set([point.id])
    );
    const merged = [...againstExisting, ...againstBatch]
      .sort((a, b) => b.score - a.score)
      .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i);

    if (merged.length > 0) conflicts[point.id] = merged;
  }

  return conflicts;
}

export const SIMILARITY_LABELS: Record<SimilarityLevel, string> = {
  duplicate: "高度重复",
  similar: "内容相似",
};
