import { promises as fs } from "fs";
import path from "path";
import { invalidateAnalysisCache } from "./analysis-cache";
import type { KnowledgePoint, Outline, PatentRecord, PatentSourceFile, SourceFile } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

const KNOWLEDGE_FILE = path.join(DATA_DIR, "knowledge-points.json");
const SOURCES_FILE = path.join(DATA_DIR, "sources.json");
const OUTLINES_FILE = path.join(DATA_DIR, "outlines.json");
const PATENTS_FILE = path.join(DATA_DIR, "patents.json");
const PATENT_SOURCES_FILE = path.join(DATA_DIR, "patent-sources.json");

async function ensureDirs() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch {
    // Vercel 等只读文件系统上 mkdir 会失败，读取仍可用仓库里的 data/
  }
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  await ensureDirs();
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(filePath: string, data: T): Promise<void> {
  await ensureDirs();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function getKnowledgePoints(): Promise<KnowledgePoint[]> {
  return readJson<KnowledgePoint[]>(KNOWLEDGE_FILE, []);
}

export async function getKnowledgePoint(id: string): Promise<KnowledgePoint | undefined> {
  const all = await getKnowledgePoints();
  return all.find((kp) => kp.id === id);
}

export async function saveKnowledgePoints(points: KnowledgePoint[]): Promise<void> {
  await writeJson(KNOWLEDGE_FILE, points);
  await invalidateAnalysisCache();
}

export async function addKnowledgePoints(newPoints: KnowledgePoint[]): Promise<void> {
  const existing = await getKnowledgePoints();
  await saveKnowledgePoints([...existing, ...newPoints]);
}

export async function updateKnowledgePoint(point: KnowledgePoint): Promise<void> {
  const all = await getKnowledgePoints();
  const idx = all.findIndex((kp) => kp.id === point.id);
  if (idx >= 0) {
    all[idx] = { ...point, updatedAt: new Date().toISOString() };
    await saveKnowledgePoints(all);
  }
}

export async function deleteKnowledgePoint(id: string): Promise<boolean> {
  const all = await getKnowledgePoints();
  const filtered = all.filter((kp) => kp.id !== id);
  if (filtered.length === all.length) return false;
  await saveKnowledgePoints(filtered);

  const sources = await getSourceFiles();
  let sourcesChanged = false;
  for (const source of sources) {
    if (source.knowledgePointIds.includes(id)) {
      source.knowledgePointIds = source.knowledgePointIds.filter((kid) => kid !== id);
      sourcesChanged = true;
    }
  }
  if (sourcesChanged) await saveSourceFiles(sources);

  return true;
}

export async function getSourceFiles(): Promise<SourceFile[]> {
  return readJson<SourceFile[]>(SOURCES_FILE, []);
}

export async function saveSourceFiles(sources: SourceFile[]): Promise<void> {
  await writeJson(SOURCES_FILE, sources);
}

export async function addSourceFile(source: SourceFile): Promise<void> {
  const existing = await getSourceFiles();
  await saveSourceFiles([...existing, source]);
}

export async function updateSourceFile(source: SourceFile): Promise<void> {
  const all = await getSourceFiles();
  const idx = all.findIndex((s) => s.id === source.id);
  if (idx >= 0) {
    all[idx] = source;
    await saveSourceFiles(all);
  }
}

export async function getSourceFile(id: string): Promise<SourceFile | undefined> {
  const all = await getSourceFiles();
  return all.find((s) => s.id === id);
}

/** 删除来源记录，可选同时删除关联知识点与 uploads 文件 */
export async function deleteSourceFile(
  id: string,
  options: { deleteKnowledgePoints?: boolean } = {}
): Promise<{ deleted: boolean; pointsRemoved: number }> {
  const sources = await getSourceFiles();
  const source = sources.find((s) => s.id === id);
  if (!source) return { deleted: false, pointsRemoved: 0 };

  let pointsRemoved = 0;
  if (options.deleteKnowledgePoints && source.knowledgePointIds.length > 0) {
    const all = await getKnowledgePoints();
    const removeIds = new Set(source.knowledgePointIds);
    const filtered = all.filter((p) => !removeIds.has(p.id));
    pointsRemoved = all.length - filtered.length;
    await saveKnowledgePoints(filtered);
  }

  // 清理 uploads 目录中该来源的文件
  try {
    const uploadsDir = getUploadsDir();
    const files = await fs.readdir(uploadsDir);
    for (const f of files) {
      if (f.startsWith(`${id}-`)) {
        await fs.unlink(path.join(uploadsDir, f)).catch(() => {});
      }
    }
  } catch {
    // uploads 目录可能不存在
  }

  await saveSourceFiles(sources.filter((s) => s.id !== id));
  return { deleted: true, pointsRemoved };
}

/** 查找同名文件的未完成导入（处理中断/失败/队列中） */
export async function findStaleSourcesByFilename(filename: string): Promise<SourceFile[]> {
  const sources = await getSourceFiles();
  return sources.filter(
    (s) =>
      s.filename === filename &&
      s.knowledgePointIds.length === 0 &&
      (s.status === "processing" || s.status === "error" || s.status === "pending_claude")
  );
}

export async function getOutlines(): Promise<Outline[]> {
  return readJson<Outline[]>(OUTLINES_FILE, []);
}

export async function saveOutline(outline: Outline): Promise<void> {
  const all = await getOutlines();
  all.unshift(outline);
  await writeJson(OUTLINES_FILE, all);
}

export function getUploadsDir(): string {
  return UPLOADS_DIR;
}

export async function getCategories(): Promise<string[]> {
  const points = await getKnowledgePoints();
  const cats = new Set(points.map((p) => p.category).filter(Boolean));
  return Array.from(cats).sort();
}

export async function getAllTags(): Promise<string[]> {
  const points = await getKnowledgePoints();
  const tags = new Set(points.flatMap((p) => p.tags));
  return Array.from(tags).sort();
}

export async function getPatents(): Promise<PatentRecord[]> {
  return readJson<PatentRecord[]>(PATENTS_FILE, []);
}

export async function getPatent(id: string): Promise<PatentRecord | undefined> {
  const all = await getPatents();
  return all.find((p) => p.id === id);
}

export async function savePatents(patents: PatentRecord[]): Promise<void> {
  await writeJson(PATENTS_FILE, patents);
}

export async function updatePatent(patent: PatentRecord): Promise<void> {
  const all = await getPatents();
  const idx = all.findIndex((p) => p.id === patent.id);
  if (idx >= 0) {
    all[idx] = { ...patent, updatedAt: new Date().toISOString() };
    await savePatents(all);
  }
}

export async function deletePatent(id: string): Promise<boolean> {
  const all = await getPatents();
  const filtered = all.filter((p) => p.id !== id);
  if (filtered.length === all.length) return false;
  await savePatents(filtered);

  const sources = await getPatentSources();
  let changed = false;
  for (const source of sources) {
    if (source.patentIds.includes(id)) {
      source.patentIds = source.patentIds.filter((pid) => pid !== id);
      changed = true;
    }
  }
  if (changed) await savePatentSources(sources);
  return true;
}

export async function getPatentSources(): Promise<PatentSourceFile[]> {
  return readJson<PatentSourceFile[]>(PATENT_SOURCES_FILE, []);
}

export async function savePatentSources(sources: PatentSourceFile[]): Promise<void> {
  await writeJson(PATENT_SOURCES_FILE, sources);
}
