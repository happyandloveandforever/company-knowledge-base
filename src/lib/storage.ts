import { promises as fs } from "fs";
import path from "path";
import type { KnowledgePoint, Outline, SourceFile } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

const KNOWLEDGE_FILE = path.join(DATA_DIR, "knowledge-points.json");
const SOURCES_FILE = path.join(DATA_DIR, "sources.json");
const OUTLINES_FILE = path.join(DATA_DIR, "outlines.json");

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
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
