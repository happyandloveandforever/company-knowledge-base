/**
 * 两层知识库回归：分层字段齐全、通识卡存在、WEB 进通识、SOP 进公司。
 * 运行：node scripts/test-knowledge-layers.mjs
 */
import { readFileSync } from "fs";
import path from "path";

const kpPath = path.join(process.cwd(), "data", "knowledge-points.json");
const sourcesPath = path.join(process.cwd(), "data", "sources.json");
const points = JSON.parse(readFileSync(kpPath, "utf-8"));
const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));

let failed = 0;
function check(name, ok, detail = "") {
  if (ok) console.log(`PASS ${name}`);
  else {
    failed += 1;
    console.log(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const layers = new Set(["commons", "company"]);
const usages = new Set(["pitch", "training", "ops", "both"]);
const missing = points.filter((p) => !layers.has(p.layer) || !usages.has(p.usage));
check("每条都有 layer 和 usage", missing.length === 0, missing.slice(0, 5).map((p) => p.id).join(","));

const com = points.filter((p) => p.id.startsWith("KP-COM-"));
check("通识新卡 KP-COM 至少 18 条", com.length >= 18, String(com.length));
check("KP-COM-002 培训vs汇报卡存在", points.some((p) => p.id === "KP-COM-002"));
check("COM 全部在通识层", com.every((p) => p.layer === "commons"));

const web = points.filter((p) => p.id.startsWith("KP-WEB-"));
check("WEB 全部通识层", web.length > 0 && web.every((p) => p.layer === "commons"));
const sop = points.filter((p) => p.id.startsWith("KP-SOP-"));
check("SOP 全部公司层", sop.length > 0 && sop.every((p) => p.layer === "company"));
const yfop = points.filter((p) => p.id.startsWith("KP-YFOP-"));
check("YFOP 全部公司层", yfop.length > 0 && yfop.every((p) => p.layer === "company"));

check(
  "来源 SRC-COMMONS-FRONTIER 已记录",
  sources.some((s) => s.id === "SRC-COMMONS-FRONTIER" && s.status === "done")
);

const comBodies = com.map((p) => `${p.title}\n${p.summary}\n${p.body}`).join("\n");
check("通识新卡不写疗效承诺数字", !/治愈率\s*\d|治疗率\s*\d/.test(comBodies));
check("通识新卡包含 WHO 2025", /WHO 2025|World mental health today/.test(comBodies));
check("通识新卡包含 Garland 可行性培训", /可行性RCT/.test(comBodies));
check("库总量不少于 379", points.length >= 379, String(points.length));

if (failed) {
  console.log(`\n${failed} failed`);
  process.exit(1);
}
console.log(`\nAll ${points.length} points checked.`);
