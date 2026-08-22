#!/usr/bin/env node
/**
 * 列出 Claude 待拆分队列，供 Agent 读取后精细拆分。
 * 用法：node scripts/process-split-queue.mjs
 */
import { readFileSync, existsSync } from "fs";
import path from "path";

const QUEUE_FILE = path.join(process.cwd(), "data", "split-queue.json");

if (!existsSync(QUEUE_FILE)) {
  console.log("拆分队列为空。");
  process.exit(0);
}

const queue = JSON.parse(readFileSync(QUEUE_FILE, "utf-8"));
const pending = queue.filter((i) => i.status === "pending");

console.log(`\n=== Claude 待拆分队列：${pending.length} 个文件 ===\n`);

for (const item of pending) {
  console.log(`--- ${item.filename} ---`);
  console.log(`  队列 ID: ${item.id}`);
  console.log(`  来源 ID: ${item.sourceId}`);
  console.log(`  路径: ${item.savedPath}`);
  console.log(`  提取段数: ${item.extractedChunks?.length || 0}`);
  console.log(`  含图片: ${item.hasImage ? "是" : "否"}`);
  console.log("");
}

if (pending.length === 0) console.log("没有待处理文件。");
