import { promises as fs } from "fs";
import path from "path";
import type { ParsedChunk } from "./types";

export interface SplitQueueItem {
  id: string;
  sourceId: string;
  filename: string;
  fileType: string;
  savedPath: string;
  extractedChunks: ParsedChunk[];
  rawText?: string;
  hasImage: boolean;
  uploadedAt: string;
  status: "pending" | "processing" | "done" | "error";
  error?: string;
  note?: string;
}

const QUEUE_FILE = path.join(process.cwd(), "data", "split-queue.json");

async function readQueue(): Promise<SplitQueueItem[]> {
  try {
    const raw = await fs.readFile(QUEUE_FILE, "utf-8");
    return JSON.parse(raw) as SplitQueueItem[];
  } catch {
    return [];
  }
}

async function writeQueue(items: SplitQueueItem[]): Promise<void> {
  await fs.mkdir(path.dirname(QUEUE_FILE), { recursive: true });
  await fs.writeFile(QUEUE_FILE, JSON.stringify(items, null, 2), "utf-8");
}

export async function getSplitQueue(): Promise<SplitQueueItem[]> {
  return readQueue();
}

export async function getPendingSplitQueue(): Promise<SplitQueueItem[]> {
  const items = await readQueue();
  return items.filter((i) => i.status === "pending");
}

export async function addToSplitQueue(item: SplitQueueItem): Promise<void> {
  const items = await readQueue();
  items.unshift(item);
  await writeQueue(items);
}

export async function updateSplitQueueItem(
  id: string,
  patch: Partial<SplitQueueItem>
): Promise<void> {
  const items = await readQueue();
  const idx = items.findIndex((i) => i.id === id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...patch };
    await writeQueue(items);
  }
}

export async function removeFromSplitQueue(id: string): Promise<void> {
  const items = await readQueue();
  await writeQueue(items.filter((i) => i.id !== id));
}
