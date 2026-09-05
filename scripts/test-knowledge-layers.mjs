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
check("WEB 至少 20 条（含标准五问）", web.length >= 20, String(web.length));
check("KP-WEB-013 三套文件卡存在", points.some((p) => p.id === "KP-WEB-013"));
check("KP-WEB-020 五问对照存在", points.some((p) => p.id === "KP-WEB-020"));
check(
  "来源 SRC-NSF-STANDARDS-QA 已记录",
  sources.some((s) => s.id === "SRC-NSF-STANDARDS-QA" && s.status === "done")
);
const web013 = points.find((p) => p.id === "KP-WEB-013");
check("WEB-013~020 可外发", web.filter((p) => /^KP-WEB-01[3-9]$|^KP-WEB-020$/.test(p.id)).every((p) => p.internalOnly !== true && p.status === "approved"));
check("WEB-013 声明三套文件不要混", !!web013 && /CCS-12804/.test(`${web013.summary}\n${web013.body}`) && /不要混|不是同一个/.test(`${web013.title}\n${web013.body}`));
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
check("库总量不少于 539", points.length >= 539, String(points.length));

// ── 培训教材隔离 ─────────────────────────────────────
const trn = points.filter((p) => p.id.startsWith("KP-TRN-"));
check("培训卡 KP-TRN 至少 94 条", trn.length >= 94, String(trn.length));
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

const vagusSrc = ["SRC-VG-MECH", "SRC-CIS-PRO", "SRC-VNS-MAP"];
check(
  "三份迷走/综合干预来源已记录",
  vagusSrc.every((id) => sources.some((s) => s.id === id && s.status === "done"))
);
check("KP-VGMECH 至少 22 条", points.filter((p) => p.id.startsWith("KP-VGMECH-")).length >= 22);
check("KP-CIS 至少 18 条", points.filter((p) => p.id.startsWith("KP-CIS-")).length >= 18);
check("KP-VNSMAP 至少 16 条", points.filter((p) => p.id.startsWith("KP-VNSMAP-")).length >= 16);
const resetRa = points.find((p) => p.id === "KP-VNSMAP-007");
check(
  "RESET-RA 卡声明不是漂浮适应症",
  !!resetRa && /不是漂浮|严禁外推|禁止外推/.test(`${resetRa.summary}\n${resetRa.body}`)
);
check("KP-CIS-013 五步流程为 ops", points.find((p) => p.id === "KP-CIS-013")?.usage === "ops");
const vagusNew = points.filter((p) => /^(KP-VGMECH|KP-CIS|KP-VNSMAP)-/.test(p.id));
check("新三套全部 approved", vagusNew.length === 56 && vagusNew.every((p) => p.status === "approved"), String(vagusNew.length));
check(
  "新三套每条都有 layer/usage",
  vagusNew.every((p) => layers.has(p.layer) && usages.has(p.usage))
);
check("新三套全部可外发", vagusNew.every((p) => p.internalOnly !== true));

const publicOnly = points.filter((p) => p.internalOnly !== true);
const internal = points.filter((p) => p.internalOnly === true);
check("可外发页不含仅内训卡", publicOnly.every((p) => p.internalOnly !== true));
check("仅内训卡都是 training", internal.every((p) => p.usage === "training"));
check("可外发数量 = 总量 - 仅内训", publicOnly.length === points.length - internal.length, `${publicOnly.length} vs ${points.length}-${internal.length}`);
function isInternalPrefix(id) {
  return (
    id.startsWith("KP-TRN-") ||
    id.startsWith("KP-ATOM-") ||
    id.startsWith("KP-RX-") ||
    id.startsWith("KP-RD-")
  );
}
check(
  "仅内训全是 KP-TRN 或 KP-ATOM 或 KP-RX 或 KP-RD",
  internal.every((p) => isInternalPrefix(p.id)),
  internal.filter((p) => !isInternalPrefix(p.id)).map((p) => p.id).join(",")
);

const atom = points.filter((p) => p.id.startsWith("KP-ATOM-"));
check("原子库主题卡 KP-ATOM 至少 20 条", atom.length >= 20, String(atom.length));
check("原子库全部 usage=training", atom.every((p) => p.usage === "training"));
check("原子库全部 internalOnly", atom.every((p) => p.internalOnly === true));
check("原子库全部 approved", atom.every((p) => p.status === "approved"));
check("原子库全部公司层", atom.every((p) => p.layer === "company"));
check(
  "来源 SRC-ATOM-LIB 已记录",
  sources.some((s) => s.id === "SRC-ATOM-LIB" && s.status === "done")
);
const atomText = atom.map((p) => `${p.title}\n${p.summary}\n${p.body}`).join("\n");
check("原子库总纲声明禁止整库外发", /禁止整库外发|禁止.*外发/.test(atomText));
check("原子库声明经皮氢不得当给药", /经皮氢/.test(atomText) && /输液|给药/.test(atomText));
check("原子库声明对外用 CIS", /CIS A–F|CIS-004|CIS A-F/.test(atomText));

const rx = points.filter((p) => p.id.startsWith("KP-RX-"));
check("疗法叙事 KP-RX 至少 13 条", rx.length >= 13, String(rx.length));
check("疗法叙事全部 usage=training", rx.every((p) => p.usage === "training"));
check("疗法叙事全部 internalOnly", rx.every((p) => p.internalOnly === true));
check("疗法叙事全部 approved", rx.every((p) => p.status === "approved"));
check("疗法叙事全部公司层", rx.every((p) => p.layer === "company"));
check(
  "来源 SRC-RX-THERAPY 已记录",
  sources.some((s) => s.id === "SRC-RX-THERAPY" && s.status === "done")
);
const rxText = rx.map((p) => `${p.title}\n${p.summary}\n${p.body}`).join("\n");
check("疗法叙事声明五维不是对外模块", /不是第四套|不要把五维/.test(rxText));
check("疗法叙事冻结概率矩阵", /95%/.test(rxText) && /不得外发|冻结/.test(rxText));
check("疗法叙事排毒不得当透析", /系统透析|排毒/.test(rxText) && /WEB-005|透皮/.test(rxText));
check(
  "可外发含迷走三套",
  publicOnly.filter((p) => p.id.startsWith("KP-VGMECH-")).length === 22 &&
    publicOnly.filter((p) => p.id.startsWith("KP-CIS-")).length === 18 &&
    publicOnly.filter((p) => p.id.startsWith("KP-VNSMAP-")).length === 16
);

const rd = points.filter((p) => p.id.startsWith("KP-RD-"));
check("应用研发 KP-RD 至少 12 条", rd.length >= 12, String(rd.length));
check("应用研发全部 usage=training", rd.every((p) => p.usage === "training"));
check("应用研发全部 internalOnly", rd.every((p) => p.internalOnly === true));
check("应用研发全部 approved", rd.every((p) => p.status === "approved"));
check("应用研发全部公司层", rd.every((p) => p.layer === "company"));
check(
  "来源 SRC-RD-VAGUS-APP 已记录",
  sources.some((s) => s.id === "SRC-RD-VAGUS-APP" && s.status === "done")
);
const rdText = rd.map((p) => `${p.title}\n${p.summary}\n${p.body}`).join("\n");
check("应用研发声明不写专利", /不写专利|不是专利/.test(rdText));
check("应用研发声明默认深度 REST 全关", /深度 REST/.test(rdText) && /全关/.test(rdText));
check("应用研发声明 40Hz 不要做", /40Hz/.test(rdText));
check("KP-RD 不进可外发", publicOnly.every((p) => !p.id.startsWith("KP-RD-")));

if (failed) {
  console.log(`\n${failed} failed`);
  process.exit(1);
}
console.log(`\nAll ${points.length} points checked.`);
