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
check("通识新卡 KP-COM 至少 22 条", com.length >= 22, String(com.length));
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
check("库总量不少于 450", points.length >= 450, String(points.length));

// ── 培训教材隔离 ─────────────────────────────────────
const trn = points.filter((p) => p.id.startsWith("KP-TRN-"));
check("培训卡 KP-TRN 至少 103 条", trn.length >= 103, String(trn.length));
check("培训卡全部 usage=training", trn.every((p) => p.usage === "training"));
check("培训卡全部 internalOnly", trn.every((p) => p.internalOnly === true));

const trnText = trn.map((p) => `${p.title}\n${p.summary}\n${p.body}`).join("\n");
check("培训卡保留禁忌症六条", /恶性肿瘤/.test(trnText) && /怀孕初期和末期/.test(trnText));
check("培训卡标注水温冲突", /36±0\.5/.test(trnText));
check("培训卡标注透皮吸收冲突", /KP-WEB-005/.test(trnText));

const landmines = [
  "KP-TRN-007",
  "KP-TRN-060",
  "KP-TRN-065",
  "KP-TRN-066",
  "KP-TRN-067",
];
const notDraft = landmines.filter(
  (id) => points.find((p) => p.id === id)?.status !== "draft"
);
check("命理/适应症/处方/疗效案例留 draft", notDraft.length === 0, notDraft.join(","));

const leaked = points.filter(
  (p) => p.internalOnly === true && p.usage !== "training"
);
check("没有非培训卡被标成仅内训", leaked.length === 0, leaked.map((p) => p.id).join(","));

const trnSource = sources.find((s) => s.id === "SRC-FLOAT-TRAINING");
check("来源 SRC-FLOAT-TRAINING 已记录", !!trnSource && trnSource.status === "done");
check(
  "来源登记的 ID 与库内一致",
  !!trnSource && trnSource.knowledgePointIds.every((id) => points.some((p) => p.id === id))
);

const extraSrc = ["SRC-TRN-REACTION", "SRC-TRN-INDICATIONS", "SRC-TRN-CONTRA", "SRC-PRODUCT-MANUAL"];
check(
  "四份补充材料来源已记录",
  extraSrc.every((id) => sources.some((s) => s.id === id && s.status === "done"))
);
check("KP-TRN-080 绝对禁忌存在", points.some((p) => p.id === "KP-TRN-080"));
check("KP-SOP-023 门店拒客清单为 ops", points.find((p) => p.id === "KP-SOP-023")?.usage === "ops");
check("KP-MAN-004 周维护为 ops", points.find((p) => p.id === "KP-MAN-004")?.usage === "ops");
const newDrafts = ["KP-TRN-072", "KP-TRN-073", "KP-TRN-074", "KP-TRN-079"];
check(
  "好转反应理论与适应症清单仍为 draft",
  newDrafts.every((id) => points.find((p) => p.id === id)?.status === "draft"),
  newDrafts.filter((id) => points.find((p) => p.id === id)?.status !== "draft").join(",")
);
const indOps = points.filter(
  (p) => p.usage === "ops" && /一般适应症分系统|类风湿性关节炎/.test(`${p.title}\n${p.body}`)
);
check("适应症病谱没有写进运营卡", indOps.length === 0, indOps.map((p) => p.id).join(","));

const ansRunIds = [
  "KP-TRN-095",
  "KP-TRN-096",
  "KP-TRN-097",
  "KP-TRN-098",
  "KP-TRN-099",
  "KP-TRN-100",
  "KP-TRN-101",
];
check(
  "焦虑跑步自主神经补训 7 条存在",
  ansRunIds.every((id) => points.some((p) => p.id === id)),
  ansRunIds.filter((id) => !points.some((p) => p.id === id)).join(",")
);
const ansRun = points.filter((p) => ansRunIds.includes(p.id));
check(
  "焦虑跑步卡通识层+仅内训+已批准",
  ansRun.length === 7 &&
    ansRun.every(
      (p) => p.layer === "commons" && p.internalOnly === true && p.usage === "training" && p.status === "approved"
    )
);
const ansText = ansRun.map((p) => `${p.title}\n${p.summary}\n${p.body}`).join("\n");
check("焦虑跑步卡禁止贬低跑步或宣称治焦虑", /放电换刹车/.test(ansText) && /不治病/.test(ansText));
check(
  "来源 SRC-TRN-ANS-RUN 已记录",
  sources.some((s) => s.id === "SRC-TRN-ANS-RUN" && s.status === "done" && s.knowledgePointIds.length === 7)
);

const vagusIds = [
  "KP-COM-019",
  "KP-COM-020",
  "KP-COM-021",
  "KP-COM-022",
  "KP-WEB-013",
  "KP-CRAFT-026",
  "KP-TRN-102",
  "KP-TRN-103",
];
check(
  "迷走弹性补强 8 条存在",
  vagusIds.every((id) => points.some((p) => p.id === id)),
  vagusIds.filter((id) => !points.some((p) => p.id === id)).join(",")
);
check("KP-WEB-013 为通识文献卡", points.find((p) => p.id === "KP-WEB-013")?.layer === "commons");
check("KP-CRAFT-026 为公司层汇报卡", points.find((p) => p.id === "KP-CRAFT-026")?.layer === "company" && points.find((p) => p.id === "KP-CRAFT-026")?.usage === "pitch");
const vagusText = vagusIds.map((id) => {
  const p = points.find((x) => x.id === id);
  return `${p.title}\n${p.summary}\n${p.body}`;
}).join("\n");
check("迷走弹性卡区分恢复与恢复力", /不是让人恢复/.test(vagusText) && /弹性/.test(vagusText));
check("迷走弹性卡引用 Flux 2022", /995594/.test(vagusText));
check(
  "来源 SRC-VAGUS-ELASTIC 已记录",
  sources.some((s) => s.id === "SRC-VAGUS-ELASTIC" && s.status === "done" && s.knowledgePointIds.length === 8)
);

if (failed) {
  console.log(`\n${failed} failed`);
  process.exit(1);
}
console.log(`\nAll ${points.length} points checked.`);
