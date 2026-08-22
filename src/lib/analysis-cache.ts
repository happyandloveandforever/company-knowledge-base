import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { KnowledgePoint, ConflictGroup } from "./types";
import type { SimilarMatch } from "./similarity";
import type { ContentConflict } from "./conflict-detector";
import { scanAllSimilarities } from "./similarity";
import { scanContentConflicts, buildConflictGroups } from "./conflict-detector";
import { getKnowledgePoints } from "./storage";

const CACHE_FILE = path.join(process.cwd(), "data", "analysis-cache.json");
const CACHE_VERSION = 1;

export interface LibraryAnalysis {
  similarities: Record<string, SimilarMatch[]>;
  contentConflicts: Record<string, ContentConflict[]>;
  conflictGroups: ConflictGroup[];
  stats: {
    withSimilar: number;
    duplicateCount: number;
    similarCount: number;
    contentConflicts: number;
    conflictGroups: number;
  };
  cached: boolean;
  computedAt: string;
}

interface AnalysisCacheFile {
  version: number;
  pointsHash: string;
  pointsCount: number;
  computedAt: string;
  similarities: Record<string, SimilarMatch[]>;
  contentConflicts: Record<string, ContentConflict[]>;
  conflictGroups: ConflictGroup[];
}

export function hashKnowledgePoints(points: KnowledgePoint[]): string {
  const sig = points
    .map((p) => `${p.id}:${p.updatedAt}:${p.status}`)
    .sort()
    .join("|");
  return createHash("sha256").update(sig).digest("hex").slice(0, 16);
}

function buildStats(
  similarities: Record<string, SimilarMatch[]>,
  contentConflicts: Record<string, ContentConflict[]>,
  conflictGroups: ConflictGroup[]
) {
  const withSimilar = Object.keys(similarities).length;
  const duplicateCount = Object.values(similarities).filter((m) =>
    m.some((x) => x.level === "duplicate")
  ).length;
  const similarCount = Object.values(similarities).filter((m) =>
    m.some((x) => x.level === "similar")
  ).length;
  return {
    withSimilar,
    duplicateCount,
    similarCount,
    contentConflicts: Object.keys(contentConflicts).length,
    conflictGroups: conflictGroups.length,
  };
}

async function readCacheFile(): Promise<AnalysisCacheFile | null> {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf-8");
    const data = JSON.parse(raw) as AnalysisCacheFile;
    if (data.version !== CACHE_VERSION) return null;
    return data;
  } catch {
    return null;
  }
}

async function writeCacheFile(data: AnalysisCacheFile): Promise<void> {
  await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
  await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function computeAnalysis(points: KnowledgePoint[]): Omit<LibraryAnalysis, "cached"> {
  const contentConflicts = scanContentConflicts(points);
  const similarities = scanAllSimilarities(points);
  const conflictGroups = buildConflictGroups(points, contentConflicts);
  const computedAt = new Date().toISOString();
  return {
    similarities,
    contentConflicts,
    conflictGroups,
    stats: buildStats(similarities, contentConflicts, conflictGroups),
    computedAt,
  };
}

/** 获取相似/冲突分析，有缓存则直接读缓存（数据变更后自动失效） */
export async function getLibraryAnalysis(
  points?: KnowledgePoint[]
): Promise<LibraryAnalysis> {
  const pts = points ?? (await getKnowledgePoints());
  const pointsHash = hashKnowledgePoints(pts);
  const cached = await readCacheFile();

  if (
    cached &&
    cached.pointsHash === pointsHash &&
    cached.pointsCount === pts.length
  ) {
    return {
      similarities: cached.similarities,
      contentConflicts: cached.contentConflicts,
      conflictGroups: cached.conflictGroups,
      stats: buildStats(cached.similarities, cached.contentConflicts, cached.conflictGroups),
      cached: true,
      computedAt: cached.computedAt,
    };
  }

  const result = computeAnalysis(pts);
  await writeCacheFile({
    version: CACHE_VERSION,
    pointsHash,
    pointsCount: pts.length,
    computedAt: result.computedAt,
    similarities: result.similarities,
    contentConflicts: result.contentConflicts,
    conflictGroups: result.conflictGroups,
  });

  return { ...result, cached: false };
}

/** 知识点增删改后调用，下次分析会重新计算 */
export async function invalidateAnalysisCache(): Promise<void> {
  try {
    await fs.unlink(CACHE_FILE);
  } catch {
    // cache may not exist
  }
}

/** 手动预热缓存（导入大批量数据后） */
export async function warmAnalysisCache(): Promise<LibraryAnalysis> {
  await invalidateAnalysisCache();
  return getLibraryAnalysis();
}
