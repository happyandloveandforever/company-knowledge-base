#!/usr/bin/env node
/**
 * 北化 PPT「与产业资本同频的四条价值轴」白话改写（幂等）。
 * 跳过条件：已有 KP-CRAFT-027。
 * 运行：node scripts/import-four-value-axes.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const root = process.cwd();
const kpPath = path.join(root, "data/knowledge-points.json");
const srcPath = path.join(root, "data/sources.json");
const olPath = path.join(root, "data/outlines.json");

const now = "2026-08-25T15:50:00.000Z";
const sourceId = "SRC-FOUR-AXES";
const sourceFile = "四条价值轴白话改写.md";

const points = JSON.parse(readFileSync(kpPath, "utf-8"));
if (points.some((p) => p.id === "KP-CRAFT-027")) {
  console.log("skip: KP-CRAFT-027 exists");
  process.exit(0);
}

points.push({
  id: "KP-CRAFT-027",
  title: "与产业资本同频的四条价值轴（白话改写）",
  category: "销售技巧",
  tags: [
    "北化",
    "产业资本",
    "价值轴",
    "心理与主动健康",
    "数字健康",
    "人力资本",
    "场景落地",
    "PPT",
  ],
  audience: ["销售团队", "B端客户", "政府汇报", "演讲"],
  prerequisites: ["KP-CRAFT-012", "KP-CHAMP-007", "KP-BG2-048", "KP-V7-003"],
  summary:
    "这一页不是迷走机制，是告诉产业资本：漂浮方舟对得上他们已经在投的四条赛道。原稿「同频 / 载体赋能 / 健康管理表达」偏咨询腔。改写原则：每条先点赛道名，再补一句人话结果。",
  body: `【这一页在干什么】
不是讲漂浮怎么卸交感。是讲：对方口袋里已经有心理/主动健康、数字健康、企业服务、康养载体这几类布局时，方舟分别对哪一口。四条是「对号入座」，不是新造四个产品名。

【原稿为什么涩】
- 「同频」是咨询词，听众要猜我们在跟谁同频。
- 01 把赛道、体验、复购三件事塞进一句。
- 02 括号「健康管理表达」是内部黑话。
- 04 「载体赋能」像政策文件，后面一长串场景才是人能听懂的。
- 幻灯片若写「心理」、大纲若写「抗衰」：对北化生科口用抗衰，对心理健康赛道用心理，后半句不用改。

【PPT 可贴（推荐）】
01 心理与主动健康：让人先感到状态变好，并且愿意反复来
02 数字健康：把体征和恢复过程记下来，管理才说得上
03 人力资本：给企业和高压岗位一条能铺开的精力恢复通道
04 场景落地：康养、酒店、园区、公共示范，同一套系统多门进入

【标题】
可留「与产业资本同频的四条价值轴」。更直的备选：产业资本已经在看的四件事。

【口播一句】
他们已经在买这四类资产；方舟是能同时对上这四口的恢复系统，不是再开一条跟他们无关的赛道。

【不要】
不要在这一页展开迷走弹性。机制页讲刹车，资本页讲对得上哪几口袋。`,
  examples: [
    "01 心理与主动健康：让人先感到状态变好，并且愿意反复来",
    "02 数字健康：把体征和恢复过程记下来，管理才说得上",
    "03 人力资本：给企业和高压岗位一条能铺开的精力恢复通道",
    "04 场景落地：康养、酒店、园区、公共示范，同一套系统多门进入",
    "北化生科口可将 01 的「心理」换成「抗衰」，后半句不动",
  ],
  source: {
    file: sourceFile,
    location: "北化国际视野版大纲第12页改写",
    date: "2026-08-25",
    author: "中友瑞水 / 宣讲口径补强",
  },
  scenarios: ["演讲", "B端提案", "政府汇报"],
  durationMin: 4,
  version: "1.0",
  status: "approved",
  createdAt: now,
  updatedAt: now,
  layer: "company",
  usage: "pitch",
  internalOnly: false,
  conflictNote: "公司层讲法。四条是产业对位，不是产品机理，也不宣称已获产业资本投资。",
});

writeFileSync(kpPath, `${JSON.stringify(points, null, 2)}\n`);

const sources = JSON.parse(readFileSync(srcPath, "utf-8"));
if (!sources.some((s) => s.id === sourceId)) {
  sources.push({
    id: sourceId,
    filename: sourceFile,
    fileType: "md",
    uploadedAt: now,
    knowledgePointIds: ["KP-CRAFT-027"],
    status: "done",
    splitMode: "claude-agent",
    note: "北化 PPT 四条价值轴白话改写。对号入座，不写迷走机制。",
  });
  writeFileSync(srcPath, `${JSON.stringify(sources, null, 2)}\n`);
}

const outlines = JSON.parse(readFileSync(olPath, "utf-8"));
const ol = outlines.find((o) => o.id === "OL-MT4LJR86-8NKRE");
if (ol) {
  const slide = ol.slides.find((s) => s.order === 12);
  if (slide) {
    slide.title = "与产业资本同频的四条价值轴";
    slide.bullets = [
      "01 心理与主动健康：让人先感到状态变好，并且愿意反复来",
      "02 数字健康：把体征和恢复过程记下来，管理才说得上",
      "03 人力资本：给企业和高压岗位一条能铺开的精力恢复通道",
      "04 场景落地：康养、酒店、园区、公共示范，同一套系统多门进入",
    ];
    if (!slide.knowledgePointIds.includes("KP-CRAFT-027")) {
      slide.knowledgePointIds.push("KP-CRAFT-027");
    }
    slide.speakerNotes =
      "这一页是对号入座，不是新发明四个产品。对方已经在看心理/主动健康、数字健康、企业精力、康养与园区载体；方舟分别对「状态变好且复购」「过程可记录才叫管理」「能铺开的恢复入口」「同一套系统多门进入」。对北化生科口，01 可改成「抗衰与主动健康」，后半句不用改。不要在这一页展开迷走机制。";
  }
  writeFileSync(olPath, `${JSON.stringify(outlines, null, 2)}\n`);
}

console.log("imported KP-CRAFT-027, outline slide 12 updated, total", points.length);
