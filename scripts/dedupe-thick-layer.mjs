/**
 * 压缩过厚层：论文原子主题合并 + 删除跨稿重复宣传卡。
 * 保留：杨浦财务/创始人、一龄共建与 Jun 案例、品牌交付、机理、冠军工程、SOP/WEB。
 * 运行：node scripts/dedupe-thick-layer.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = new Date().toISOString();
const dataDir = path.join(process.cwd(), "data");
const kpPath = path.join(dataDir, "knowledge-points.json");
const sourcesPath = path.join(dataDir, "sources.json");
const outlinesPath = path.join(dataDir, "outlines.json");

const points = JSON.parse(readFileSync(kpPath, "utf-8"));
if (points.some((p) => p.id === "KP-MEV-201")) {
  console.log("去重已执行，跳过。总数:", points.length);
  process.exit(0);
}

const byId = Object.fromEntries(points.map((p) => [p.id, p]));

function cite(id) {
  const p = byId[id];
  if (!p) return `${id}（已缺）`;
  const src = (p.body.match(/论文出处：(.+)/) || [])[1] || "";
  const core = (p.body.match(/核心结论：(.+)/) || [])[1] || p.summary;
  return `${id.replace("KP-", "")}｜${src}｜${core}`;
}

function hub(id, title, memberIds, extra = "") {
  const lines = memberIds.filter((m) => byId[m]).map(cite);
  return {
    id,
    title,
    category: "技术知识",
    tags: ["论文主题卡", "REST", "文献合并"],
    audience: ["学术", "销售团队"],
    prerequisites: [],
    summary: `由 ${memberIds.length} 条论文原子合并。对外只说「有研究观察到」，禁止写成适应症。`,
    body: `合并自：${memberIds.join("、")}\n\n${lines.join("\n")}\n\n${extra}纪律：文献≠产品适应症。首选公开纠偏卡 KP-WEB-001/002/003/010。`,
    examples: [],
    source: {
      file: "100个论文原子.md（2026-08-23 主题合并）",
      location: memberIds.join(", "),
      date: "2026-08-23",
      author: "论文原子库合并",
    },
    scenarios: ["学术汇报", "销售培训"],
    durationMin: 4,
    version: "2.0",
    status: "approved",
    createdAt: now,
    updatedAt: now,
    conflictNote: "主题合并卡。原 100 条原子已删除，细节以本卡条目为准。",
  };
}

const hubs = [
  hub("KP-MEV-201", "主题卡：焦虑、惊恐与社交焦虑文献簇", ["KP-MEV-001", "KP-MEV-022", "KP-MEV-078", "KP-MEV-084"], "对外首选 Feinstein 开放标签口径见 KP-WEB-001，重复使用安全见 KP-WEB-002。\n"),
  hub("KP-MEV-202", "主题卡：身体意象与进食障碍文献簇", ["KP-MEV-003"], "准确 RCT 口径见 KP-WEB-003。禁止说治疗厌食症。\n"),
  hub("KP-MEV-203", "主题卡：脑连接、内感受与元认知", ["KP-MEV-002", "KP-MEV-071", "KP-MEV-077", "KP-MEV-080", "KP-MEV-090", "KP-MEV-091"]),
  hub("KP-MEV-204", "主题卡：HRV、血压与心血管急性效应", ["KP-MEV-004", "KP-MEV-028", "KP-MEV-038", "KP-MEV-062", "KP-MEV-066", "KP-MEV-070"]),
  hub("KP-MEV-205", "主题卡：运动恢复与竞技表现", ["KP-MEV-005", "KP-MEV-017", "KP-MEV-042", "KP-MEV-045", "KP-MEV-050", "KP-MEV-060", "KP-MEV-063", "KP-MEV-076", "KP-MEV-089", "KP-MEV-094", "KP-MEV-096", "KP-MEV-099"], "乳酸是否更快清除见独立卡 KP-MEV-021 与 KP-WEB-006。\n"),
  hub("KP-MEV-206", "主题卡：睡眠与昼夜节律线索", ["KP-MEV-008", "KP-MEV-065", "KP-MEV-081"]),
  hub("KP-MEV-207", "主题卡：疼痛、纤维肌痛与头痛", ["KP-MEV-007", "KP-MEV-011", "KP-MEV-018", "KP-MEV-058", "KP-MEV-072", "KP-MEV-073", "KP-MEV-079", "KP-MEV-085"]),
  hub("KP-MEV-208", "主题卡：HPA 轴与皮质醇", ["KP-MEV-012", "KP-MEV-014", "KP-MEV-016", "KP-MEV-057", "KP-MEV-059", "KP-MEV-093"], "对外百分比未锁，只说「有研究观察到皮质醇下降」。\n"),
  hub("KP-MEV-209", "主题卡：免疫、炎症与关节", ["KP-MEV-006", "KP-MEV-013", "KP-MEV-023", "KP-MEV-043"]),
  hub("KP-MEV-210", "主题卡：成瘾、吸烟与酒精（不对外销售）", ["KP-MEV-009", "KP-MEV-027", "KP-MEV-039", "KP-MEV-053", "KP-MEV-068", "KP-MEV-075", "KP-MEV-087"], "学术内部用。禁止写成戒烟戒酒产品。\n"),
  hub("KP-MEV-211", "主题卡：创造力、学习与半球加工", ["KP-MEV-010", "KP-MEV-015", "KP-MEV-033", "KP-MEV-037", "KP-MEV-048", "KP-MEV-052", "KP-MEV-067", "KP-MEV-074", "KP-MEV-083", "KP-MEV-097"]),
  hub("KP-MEV-212", "主题卡：PTSD 安全性与耐受", ["KP-MEV-020"], "只讲耐受/安全信号，不讲治疗 PTSD。\n"),
  hub("KP-MEV-213", "主题卡：零散病种线索（默认不对外）", ["KP-MEV-019", "KP-MEV-026", "KP-MEV-032", "KP-MEV-034", "KP-MEV-035", "KP-MEV-041", "KP-MEV-046", "KP-MEV-054", "KP-MEV-092"], "含自闭症、哮喘、肥胖、皮肤、乳腺癌等。禁止进销售菜单。\n"),
  hub("KP-MEV-214", "主题卡：情绪、倦怠与长期福祉", ["KP-MEV-040", "KP-MEV-047", "KP-MEV-049", "KP-MEV-069", "KP-MEV-088"]),
  hub("KP-MEV-215", "主题卡：感知位移、联觉与幻觉辨析", ["KP-MEV-025", "KP-MEV-044", "KP-MEV-055", "KP-MEV-061", "KP-MEV-082", "KP-MEV-086", "KP-MEV-095", "KP-MEV-098", "KP-MEV-100"]),
  hub("KP-MEV-216", "主题卡：方法、个体差异与引导技术", ["KP-MEV-024", "KP-MEV-029", "KP-MEV-030", "KP-MEV-031", "KP-MEV-036", "KP-MEV-051", "KP-MEV-056", "KP-MEV-064"]),
];

const deleteIds = new Set([
  ...["001", "002", "003", "004", "005"].map((n) => `KP-DEMO-${n}`),
  ...Array.from({ length: 100 }, (_, i) => `KP-MEV-${String(i + 1).padStart(3, "0")}`).filter((id) => id !== "KP-MEV-021"),
  "KP-FAF-013", "KP-FAF-014", "KP-FAF-015", "KP-FAF-016",
  "KP-FAF-028", "KP-FAF-029", "KP-FAF-030", "KP-FAF-031", "KP-FAF-032", "KP-FAF-033", "KP-FAF-034",
  "KP-FAF-038", "KP-FAF-039",
  "KP-B2B-008", "KP-B2B-009", "KP-B2B-010", "KP-B2B-011", "KP-B2B-012", "KP-B2B-013",
  "KP-B2B-023", "KP-B2B-024", "KP-B2B-025", "KP-B2B-026", "KP-B2B-027", "KP-B2B-028", "KP-B2B-029",
  "KP-B2B-038", "KP-B2B-039", "KP-B2B-040",
  "KP-BG2-001", "KP-BG2-002", "KP-BG2-004", "KP-BG2-009", "KP-BG2-010", "KP-BG2-011",
  "KP-BG2-015", "KP-BG2-016", "KP-BG2-017", "KP-BG2-018", "KP-BG2-019", "KP-BG2-020", "KP-BG2-021", "KP-BG2-022", "KP-BG2-023",
  "KP-BG2-024", "KP-BG2-025", "KP-BG2-029", "KP-BG2-030", "KP-BG2-031",
  "KP-BG2-033", "KP-BG2-034", "KP-BG2-035", "KP-BG2-036", "KP-BG2-037", "KP-BG2-038", "KP-BG2-039",
  "KP-BG2-043", "KP-BG2-053", "KP-BG2-054", "KP-BG2-055", "KP-BG2-060", "KP-BG2-061", "KP-BG2-062",
  "KP-BG2-066", "KP-BG2-075",
  "KP-V7-015", "KP-V7-019",
]);

const remap = {
  "KP-BG2-001": "KP-BRAND-001",
  "KP-BG2-002": "KP-BG2-006",
  "KP-BG2-004": "KP-BRAND-004",
  "KP-BG2-009": "KP-MECH-003",
  "KP-BG2-010": "KP-MECH-007",
  "KP-BG2-011": "KP-WEB-007",
  "KP-BG2-015": "KP-BG2-014",
  "KP-BG2-016": "KP-BG2-014",
  "KP-BG2-017": "KP-BG2-014",
  "KP-BG2-018": "KP-BG2-014",
  "KP-BG2-019": "KP-BG2-014",
  "KP-BG2-020": "KP-BG2-014",
  "KP-BG2-021": "KP-BG2-014",
  "KP-BG2-022": "KP-BG2-014",
  "KP-BG2-023": "KP-BG2-014",
  "KP-BG2-024": "KP-MECH-006",
  "KP-BG2-025": "KP-MECH-001",
  "KP-BG2-029": "KP-SOP-015",
  "KP-BG2-030": "KP-CHAMP-021",
  "KP-BG2-031": "KP-SOP-011",
  "KP-BG2-033": "KP-WEB-010",
  "KP-BG2-034": "KP-WEB-002",
  "KP-BG2-035": "KP-MECH-010",
  "KP-BG2-036": "KP-MEV-208",
  "KP-BG2-037": "KP-WEB-001",
  "KP-BG2-038": "KP-BG2-041",
  "KP-BG2-039": "KP-WEB-003",
  "KP-BG2-043": "KP-BG2-044",
  "KP-BG2-053": "KP-BRAND-032",
  "KP-BG2-054": "KP-BRAND-025",
  "KP-BG2-055": "KP-BRAND-031",
  "KP-BG2-060": "KP-BRAND-021",
  "KP-BG2-061": "KP-BRAND-031",
  "KP-BG2-062": "KP-BRAND-032",
  "KP-BG2-066": "KP-SOP-021",
  "KP-BG2-075": "KP-BG2-074",
  "KP-V7-015": "KP-B2B-021",
  "KP-V7-019": "KP-BRAND-021",
  "KP-FAF-013": "KP-CRAFT-006",
  "KP-FAF-014": "KP-CRAFT-006",
  "KP-FAF-015": "KP-WEB-002",
  "KP-FAF-016": "KP-FAF-018",
  "KP-FAF-028": "KP-MEV-204",
  "KP-FAF-029": "KP-MEV-208",
  "KP-FAF-030": "KP-MECH-007",
  "KP-FAF-031": "KP-WEB-001",
  "KP-FAF-032": "KP-MEV-206",
  "KP-FAF-033": "KP-MEV-209",
  "KP-FAF-034": "KP-WEB-010",
  "KP-FAF-038": "KP-BRAND-023",
  "KP-FAF-039": "KP-BRAND-024",
  "KP-B2B-008": "KP-MECH-003",
  "KP-B2B-009": "KP-BRAND-007",
  "KP-B2B-010": "KP-MECH-004",
  "KP-B2B-011": "KP-CRAFT-006",
  "KP-B2B-012": "KP-CRAFT-006",
  "KP-B2B-013": "KP-WEB-001",
  "KP-B2B-023": "KP-WEB-010",
  "KP-B2B-024": "KP-MEV-207",
  "KP-B2B-025": "KP-WEB-002",
  "KP-B2B-026": "KP-MEV-204",
  "KP-B2B-027": "KP-WEB-010",
  "KP-B2B-028": "KP-WEB-002",
  "KP-B2B-029": "KP-WEB-001",
  "KP-B2B-038": "KP-BRAND-022",
  "KP-B2B-039": "KP-BRAND-023",
  "KP-B2B-040": "KP-BRAND-024",
  "KP-MEV-001": "KP-WEB-001",
  "KP-MEV-002": "KP-MEV-203",
  "KP-MEV-003": "KP-WEB-003",
  "KP-MEV-004": "KP-MEV-204",
  "KP-MEV-005": "KP-MEV-205",
  "KP-MEV-012": "KP-MEV-208",
};

const deleted = points.filter((p) => deleteIds.has(p.id));
let next = points.filter((p) => !deleteIds.has(p.id));

const bg2_014 = next.find((p) => p.id === "KP-BG2-014");
if (bg2_014) {
  bg2_014.title = "九大功效一览（辅助定位，已合并分条）";
  bg2_014.summary =
    "原 015–023 九条功效合并为一张：睡眠、疼痛辅助、焦虑情绪低刺激支持、PTSD 边界、运动主观恢复、压力激素、疲劳链条、身体意象边界、认知创造。一律辅助，不替代医疗。";
  bg2_014.body =
    "1 睡眠：神经降噪→更快入睡、深睡比例、次日回弹\n2 慢性疼痛/纤维肌痛：低负荷放松辅助，不替代医疗\n3 焦虑抑郁：低刺激支持路径，不替代诊断与治疗\n4 PTSD：仅作专业指导下的辅助放松场景\n5 运动恢复：主观恢复与睡眠补偿；乳酸是否更快见 KP-MEV-021 / KP-WEB-006\n6 压力激素：材料称皮质醇/肾上腺素下降，百分比未锁\n7 疲劳：过度唤醒+体感负荷+睡眠不足，不是电量归零\n8 身体意象：无评判环境练感受身体；不替代进食障碍治疗（RCT 见 KP-WEB-003）\n9 认知创造：注意重置与发散思维线索，不作智力承诺\n对外：卖深度恢复，不卖治病。证据塔见 KP-WEB-010。";
  bg2_014.updatedAt = now;
  bg2_014.version = "2.0";
}

function patch(id, fields) {
  const p = next.find((x) => x.id === id);
  if (!p) return;
  Object.assign(p, fields, { updatedAt: now });
}

patch("KP-MEV-101", {
  title: "论文主题卡怎么用（原100原子已合并）",
  summary: "100条原子已收成 16 张主题卡 + 乳酸独立卡 + 红线。按听众抽 2–3 张主题卡，不要念文献目录。",
  body: "现用卡：\n- KP-MEV-201 焦虑惊恐\n- KP-MEV-202 身体意象\n- KP-MEV-203 脑与内感受\n- KP-MEV-204 HRV/血压\n- KP-MEV-205 运动表现\n- KP-MEV-021 乳酸诚实句（保留原卡）\n- KP-MEV-206 睡眠\n- KP-MEV-207 疼痛\n- KP-MEV-208 皮质醇\n- KP-MEV-209 免疫关节\n- KP-MEV-210 成瘾（不对外）\n- KP-MEV-211 创造认知\n- KP-MEV-212 PTSD 耐受\n- KP-MEV-213 零散病种（不对外）\n- KP-MEV-214 情绪倦怠\n- KP-MEV-215 感知联觉\n- KP-MEV-216 方法个体差\n- KP-MEV-102 红线\n公开纠偏优先：KP-WEB-001/002/003/006/010",
  version: "2.0",
});

patch("KP-MEV-102", {
  body: "允许：\n- Feinstein 2018 开放标签：KP-WEB-001（不要叫 RCT）\n- Garland 2024 可行性 RCT：KP-WEB-002\n- Choquette 身体意象：KP-WEB-003\n- 运动主观恢复、乳酸未决：KP-MEV-021 / KP-WEB-006\n禁止：\n× 治疗 GAD/PTSD/厌食/纤维肌痛/关节炎/哮喘/自闭症/癌症/成瘾\n× 把 1990 年代小样本写成现代指南\n× 电竞段落写成已服务职业战队\n对外先走证据金字塔 KP-WEB-010，再按需抽主题卡。",
  version: "2.0",
});

patch("KP-MEV-103", {
  title: "宣讲抽卡：三种听众带主题卡",
  summary: "国企听 WEB 纠偏+HRV+红线；酒店听睡眠与即时放松；运动队听主观恢复与乳酸诚实句。",
  body: "产业集团：KP-WEB-001、KP-MEV-204、KP-MEV-208、KP-WEB-002、KP-MEV-102\n酒店会所：KP-WEB-001、KP-MEV-206、KP-MEV-214，不讲病种\n运动队：KP-MEV-205、KP-MEV-021、KP-WEB-006\n学术加：KP-MEV-203、KP-WEB-003\n永远不要当众打开 KP-MEV-213。",
  version: "2.0",
});

patch("KP-WEB-011", {
  summary: "2026-08-23 已压缩过厚层：论文原子改主题卡，跨稿重复宣传已删。经营闭环仍薄在案例与锁数字。",
  body: "压缩后：文献改 16 张主题卡+乳酸卡+红线；删除跨 FAF/B2B/BG2/V7 的 REST 史、专家复读、证据墙、功效分条与脚手架 DEMO。\n保留：杨浦财务与创始人、一龄共建与 Jun 案例、品牌交付、方舟机理、冠军工程参数、SOP/优浮/医学稿。\n仍薄：具名案例、售后厂家维保、统一数字口径。\n你必须本人做的：锁机构/专利/C端数；提供可公开案例。",
});

const insertAt = next.findIndex((p) => p.id === "KP-MEV-103");
next.splice(insertAt + 1, 0, ...hubs);

const outlines = JSON.parse(readFileSync(outlinesPath, "utf-8"));
function remapList(ids) {
  if (!Array.isArray(ids)) return ids;
  const out = [];
  const seen = new Set();
  for (const id of ids) {
    const nextId = remap[id] || id;
    if (deleteIds.has(nextId) && !remap[nextId]) continue;
    if (seen.has(nextId)) continue;
    seen.add(nextId);
    out.push(nextId);
  }
  return out;
}
for (const ol of outlines) {
  ol.knowledgePointIds = remapList(ol.knowledgePointIds);
  for (const slide of ol.slides || []) {
    slide.knowledgePointIds = remapList(slide.knowledgePointIds);
  }
}

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
for (const s of sources) {
  s.knowledgePointIds = (s.knowledgePointIds || []).filter((id) => !deleteIds.has(id));
  if (s.id === "SRC-MEV-100-ATOMS") {
    s.knowledgePointIds = [
      "KP-MEV-021",
      "KP-MEV-101",
      "KP-MEV-102",
      "KP-MEV-103",
      ...hubs.map((h) => h.id),
    ];
    s.note = "原103条原子已主题合并为16张+乳酸卡+用法/红线。勿再跑 import-mev-atoms.mjs 生成100条。";
  }
}

writeFileSync(kpPath, JSON.stringify(next, null, 2) + "\n");
writeFileSync(sourcesPath, JSON.stringify(sources, null, 2) + "\n");
writeFileSync(outlinesPath, JSON.stringify(outlines, null, 2) + "\n");

const pref = {};
for (const p of next) {
  const k = (p.id.match(/^(KP-[A-Z0-9]+)/) || ["", "X"])[1];
  pref[k] = (pref[k] || 0) + 1;
}
console.log(JSON.stringify({
  before: points.length,
  deleted: deleted.length,
  hubs: hubs.length,
  after: next.length,
  prefixes: pref,
}, null, 2));
