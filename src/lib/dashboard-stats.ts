import type { KnowledgePoint, SourceFile } from "./types";
import type { LibraryAnalysis } from "./analysis-cache";

export interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  categories: number;
  sources: number;
  conflictGroups: number;
  contentConflicts: number;
  duplicates: number;
  pendingQueue: number;
}

export function computeDashboardStats(
  points: KnowledgePoint[],
  sources: SourceFile[],
  analysis: LibraryAnalysis,
  pendingQueue: number
): DashboardStats {
  const approved = points.filter((p) => p.status === "approved").length;
  return {
    total: points.length,
    pending: points.length - approved,
    approved,
    categories: new Set(points.map((p) => p.category)).size,
    sources: sources.length,
    conflictGroups: analysis.stats.conflictGroups,
    contentConflicts: analysis.stats.contentConflicts,
    duplicates: analysis.stats.duplicateCount,
    pendingQueue,
  };
}

export function groupPointsBySource(
  points: KnowledgePoint[],
  sources: SourceFile[]
): { source: SourceFile; count: number; pending: number }[] {
  return sources
    .map((source) => {
      const related = points.filter((p) => source.knowledgePointIds.includes(p.id));
      return {
        source,
        count: related.length,
        pending: related.filter((p) => p.status !== "approved").length,
      };
    })
    .sort((a, b) => new Date(b.source.uploadedAt).getTime() - new Date(a.source.uploadedAt).getTime());
}

export function topCategories(points: KnowledgePoint[], limit = 6): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of points) {
    map.set(p.category, (map.get(p.category) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
