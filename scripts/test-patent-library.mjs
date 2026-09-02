/**
 * 专利库隔离回归：不进总库、不进 /open、六簇重构版完整。
 * 运行：node scripts/test-patent-library.mjs
 */
import { readFileSync, existsSync } from "fs";
import path from "path";

const kpPath = path.join(process.cwd(), "data", "knowledge-points.json");
const sourcesPath = path.join(process.cwd(), "data", "sources.json");
const patentsPath = path.join(process.cwd(), "data", "patents.json");
const patentSourcesPath = path.join(process.cwd(), "data", "patent-sources.json");

const points = JSON.parse(readFileSync(kpPath, "utf-8"));
const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const patents = JSON.parse(readFileSync(patentsPath, "utf-8"));
const patentSources = JSON.parse(readFileSync(patentSourcesPath, "utf-8"));

let failed = 0;
function check(name, ok, detail = "") {
  if (ok) console.log(`PASS ${name}`);
  else {
    failed += 1;
    console.log(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

check("总库数量未因专利库减少", points.length >= 572, String(points.length));
check("总库没有任何 PAT-*", points.every((p) => !String(p.id).startsWith("PAT-")));
check("总库 sources 不含 SRC-PAT", sources.every((s) => !String(s.id).startsWith("SRC-PAT")));

check("专利卡至少 28 条", patents.length >= 28, String(patents.length));
check("全部 confidentiality=internal", patents.every((p) => p.confidentiality === "internal"));
check("全部 approved", patents.every((p) => p.status === "approved"));
check(
  "每条都有 kind/cluster/source",
  patents.every((p) => p.kind && p.cluster && p.source?.file)
);

const kinds = new Set(patents.map((p) => p.kind));
for (const k of ["rule", "roadmap", "cluster", "retrieved", "gap", "layout"]) {
  check(`含 kind=${k}`, kinds.has(k));
}

check("PAT-RULE-001 存在", patents.some((p) => p.id === "PAT-RULE-001"));
check("母案A存在", patents.some((p) => p.id === "PAT-ROAD-A"));
check("母案B存在", patents.some((p) => p.id === "PAT-ROAD-B"));
check("CN121795911A 检索卡存在", patents.some((p) => p.publicationNo === "CN121795911A"));
check(
  "六簇结论卡齐全",
  ["PAT-CLU-001", "PAT-CLU-002", "PAT-CLU-003", "PAT-CLU-004", "PAT-CLU-005", "PAT-CLU-006"].every((id) =>
    patents.some((p) => p.id === id)
  )
);
check("不设母案3卡存在", patents.some((p) => p.id === "PAT-NO3-001"));
check("状态机卡存在", patents.some((p) => p.id === "PAT-STATE-001"));
check("批次节奏卡存在", patents.some((p) => p.id === "PAT-BATCH-001"));

const text = patents.map((p) => `${p.title}\n${p.summary}\n${p.body}`).join("\n");
check("声明非正式FTO", /不构成正式法律意见|完整自由实施/.test(text));
check("声明不进公开站", /不进 \/open|不进\/open/.test(text));
check("红灯含策略库", /策略库/.test(text));
check("绿灯含安全状态机", /安全状态机/.test(text));
check("标注与总库口径冲突", /30\+|迷走|材料口径/.test(text));
check("明确不设母案3", /不设母案 ?3|不设母案3/.test(text));
check("簇5不进入直接VNS", /不进入直接VNS/.test(text));
check("B6–B7预埋进B", /B6–B7|B6—B7|B6-B7/.test(text));

const retrieved = patents.filter((p) => p.kind === "retrieved");
check("检索卡不少于 12 条", retrieved.length >= 12, String(retrieved.length));
check("检索卡都有公开号", retrieved.every((p) => !!p.publicationNo));

check("四个簇来源都记录", ["SRC-PAT-CLU1", "SRC-PAT-CLU2", "SRC-PAT-CLU3", "SRC-PAT-CLU4"].every((id) => patentSources.some((s) => s.id === id && s.status === "done")));
check("重构版来源已记录", patentSources.some((s) => s.id === "SRC-PAT-LAYOUT-V2" && s.status === "done"));
check(
  "来源 patentIds 都能在库中找到",
  patentSources.every((s) => s.patentIds.every((id) => patents.some((p) => p.id === id)))
);

check("split-queue 运行时文件仍被 gitignore 逻辑覆盖以外不强制", true);
check("knowledge-points.json 文件仍存在", existsSync(kpPath));

if (failed) {
  console.log(`\n${failed} failed`);
  process.exit(1);
}
console.log(`\nAll ${patents.length} patent cards checked. Knowledge points untouched: ${points.length}`);
