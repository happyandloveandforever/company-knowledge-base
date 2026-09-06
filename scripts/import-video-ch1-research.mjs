/**
 * 宣传片第一章「国际研究基础」分镜 003–005 改写入库
 * KP-CRAFT-026：给制作/销售用的本章结构与旁白
 *
 * 口径只复用已批准卡：WEB-001/002/003、COM-014、CRAFT-006。
 * 幂等：KP-CRAFT-026 已存在则跳过。
 * 运行：node scripts/import-video-ch1-research.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-06T08:10:00.000Z";
const sourceId = "SRC-VID-CH1-RESEARCH";
const sourceFile = "exports/宣传片_第一章_国际研究基础_分镜003-005.md";

const raw = [
  {
    id: "KP-CRAFT-026",
    loc: "第一章 0:30–1:20 改写",
    title: "宣传片第一章：用谱系+地标试验+综述地图讲国际研究基础",
    category: "销售技巧",
    tags: ["宣讲结构", "宣传片", "Floatation-REST", "证据金字塔"],
    audience: ["销售团队", "B端客户", "学术", "管理者"],
    usage: "pitch",
    min: 2,
    scenarios: ["对外宣讲", "宣传片制作", "B端提案", "销售培训"],
    summary:
      "第一章 50 秒不要闪期刊封面、不要用机制占最长镜头。改成：方法谱系兑现六十年 → 四张可点名论文（一次变化/重复可完成/对照功效/六月信号）→ 2025 系统综述地图与限度。机制旁白挪到机理章。",
    body:
      "原片为什么不够：003 只闪 PLoS/BMC 刊名，六十年没有谱系；004 用 25 秒讲浮力卸载/感官降噪/状态转换，那是机理不是研究基础；005 把 63 项与五条信号塞进 10 秒，旁白念不完，综述像附录。\n\n" +
      "改写后一条线（总长仍 0:30–1:20）：\n" +
      "003 0:30–0:42 谱系三张指定图：① 1950s 隔离舱实验＝John C. Lilly 与早期箱式漂浮舱（不要写成 1954 某日现场）；② 1970–80s 被定名为 REST＝Suedfeld 1980 Wiley 专著把 REST 写进书名（不是开会起名仪式；1983 会议不写进封面字）；③ 2010s– 临床与影像＝漂浮中脑电与生理监测（视频首帧；不要写成 Feinstein 2018 或 2021 首次 fMRI）。旁白：Floatation-REST 不是近年体验概念，是二十世纪中叶实验室走出来的方法，已有六十余年研究积累。六十年=方法史，不是六十年临床试验。\n" +
      "004 0:42–1:07 四张论文卡（一文一图，首页标题区截屏，不扫正文）：① 一次有没有变化＝Laureate 2018 开放标签，五十人、单次后状态焦虑显著下降（禁止写成 RCT）；② 重复能不能做完＝同一实验室 2024 可行性 RCT，六次人能做完，无严重不良事件只作小字，没有功效主终点；③ 用临床对照的标准看有没有功效＝Kjellgren 2014 BMC 随机对照试点，六十五人十二次，压力与焦虑指标下降（禁止写成治疗 GAD/抑郁）；④ 会不会很快没了＝柳叶子刊 2023 RCT，状态焦虑与身体意象、六个月仍有信号。旁白收束：一次看见变化，重复做得完，对照有信号。四宫格标题：一次有结果，多次也显著，完成疗程无不良，长期效果仍持续。底部：先有漂浮疗法，后有中式漂浮。禁止写成治疗厌食或我方适应症。\n" +
      "005 1:07–1:20 全景：2025 BMC 系统综述，六十余项、约两千人量级、1960–2024。画面可列压力/焦虑、疼痛、心理福祉、运动恢复、自主神经相关指标；旁白只抓压力焦虑疼痛 + 方案差异大、不足以对所有人群形成统一疗效结论。不要口播锁死 1838。\n\n" +
      "机制三词（浮力卸载、感官降噪、状态转换）整段移出本章，放到「方法/机理」备用镜。\n" +
      "对接：事实卡 WEB-001/002/003、COM-014；证据塔 WEB-010；REST 来源 CRAFT-006。\n" +
      "红线：不说我方发明 REST 或完成这些试验；2018≠RCT；不治病；综述不覆盖氢/光/AI 模块功效。\n" +
      "完整分镜：exports/宣传片_第一章_国际研究基础_分镜003-005.md",
    examples: [
      "对：一次看见变化，重复做得完，对照有信号",
      "对（四宫格标题）：一次有结果，多次也显著，完成疗程无不良，长期效果仍持续",
      "错：把 2024 可行性试验写成疗效，或把三篇论文像参考文献一样念完",
    ],
  },
];

const dataDir = path.join(process.cwd(), "data");
const kpPath = path.join(dataDir, "knowledge-points.json");
const sourcesPath = path.join(dataDir, "sources.json");
const existing = JSON.parse(readFileSync(kpPath, "utf-8"));

const required = ["KP-WEB-001", "KP-WEB-002", "KP-WEB-003", "KP-COM-014", "KP-CRAFT-006"];
const missing = required.filter((id) => !existing.some((p) => p.id === id));
if (missing.length) {
  console.error("缺少口径源卡，拒绝入库:", missing.join(", "));
  process.exit(1);
}

const points = raw.map((p) => ({
  id: p.id,
  title: p.title,
  category: p.category,
  tags: p.tags,
  audience: p.audience,
  prerequisites: ["KP-WEB-001", "KP-WEB-002", "KP-WEB-003", "KP-COM-014"],
  summary: p.summary,
  body: p.body,
  examples: p.examples || [],
  source: {
    file: sourceFile,
    location: p.loc,
    date: "2026-09-06",
    author: "中友瑞水（北京）科技有限公司 / 宣传片第一章分镜改写",
  },
  scenarios: p.scenarios,
  durationMin: p.min,
    version: "1.3",
  status: "approved",
  createdAt: now,
  updatedAt: now,
  conflictNote:
    "宣讲/分镜结构。试验事实以 WEB-001/002/003、COM-014 为准；不是本公司临床试验。谱系三张图：Lilly 早期舱、Suedfeld 1980 书封、漂浮中脑电首帧（不是 2021 fMRI 论文图）。",
  layer: "company",
  usage: p.usage,
}));

const idx = existing.findIndex((p) => p.id === "KP-CRAFT-026");
let merged;
if (idx >= 0) {
  const prev = existing[idx];
  existing[idx] = {
    ...prev,
    ...points[0],
    createdAt: prev.createdAt || now,
    updatedAt: now,
    version: "1.3",
  };
  merged = existing;
} else {
  merged = [...existing, ...points];
}
writeFileSync(kpPath, JSON.stringify(merged, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const next = sources.filter((s) => s.id !== sourceId);
next.push({
  id: sourceId,
  filename: sourceFile,
  fileType: "md",
  uploadedAt: now,
  knowledgePointIds: points.map((p) => p.id),
  status: "done",
  splitMode: "claude-agent",
  note: "宣传片第一章国际研究基础分镜 003–005 改写。1 条宣讲结构卡，直接批准。不覆盖已有知识点。",
});
writeFileSync(sourcesPath, JSON.stringify(next, null, 2) + "\n");

const usage = { pitch: 0, training: 0, ops: 0, both: 0 };
for (const p of merged) usage[p.usage] = (usage[p.usage] || 0) + 1;

console.log(
  JSON.stringify(
    {
      imported: points.length,
      total: merged.length,
      approved: merged.filter((p) => p.status === "approved").length,
      draft: merged.filter((p) => p.status === "draft").length,
      commons: merged.filter((p) => p.layer === "commons").length,
      company: merged.filter((p) => p.layer === "company").length,
      usage,
    },
    null,
    2
  )
);
