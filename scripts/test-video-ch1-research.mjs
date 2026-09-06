/**
 * 校验宣传片第一章改写稿：时长可念完、红线未破、口径卡在库里。
 * 运行：node scripts/test-video-ch1-research.mjs
 */
import { readFileSync } from "fs";
import path from "path";

const root = process.cwd();
const md = readFileSync(path.join(root, "exports/宣传片_第一章_国际研究基础_分镜003-005.md"), "utf-8");
const kps = JSON.parse(readFileSync(path.join(root, "data/knowledge-points.json"), "utf-8"));

const errors = [];
const notes = [];

function extractVo(heading) {
  const idx = md.indexOf(heading);
  if (idx < 0) {
    errors.push(`找不到章节 ${heading}`);
    return "";
  }
  const slice = md.slice(idx, idx + 2500);
  const m = slice.match(/\*\*旁白[：:][^*]*\*\*[\s\S]*?>\s*([^<]+?)\s*(?:\n\n|\*\*)/);
  if (!m) {
    errors.push(`${heading} 未解析到旁白`);
    return "";
  }
  return m[1].replace(/\s+/g, "").trim();
}

const vo003 = extractVo("## 分镜003（改）");
const vo004 = extractVo("## 分镜004（改）");
const vo005 = extractVo("## 分镜005（改）");

function chineseLen(s) {
  return [...s.replace(/[A-Za-z0-9.,;:()（）、，。；：\s>·]/g, "")].length;
}

const budgets = [
  ["003", vo003, 70],
  ["004", vo004, 150],
  ["005", vo005, 85],
];
for (const [id, vo, max] of budgets) {
  const n = chineseLen(vo);
  notes.push(`${id} 旁白汉字约 ${n} 字（上限 ${max}）`);
  if (n === 0) errors.push(`${id} 旁白为空`);
  if (n > max) errors.push(`${id} 旁白过长：${n} > ${max}`);
}

const spoken = [vo003, vo004, vo005].join("\n");
const forbidden = [
  [/治疗厌食/, "治疗厌食"],
  [/治疗GAD|治疗焦虑症|治疗抑郁症/, "治疗病种"],
  [/我们发明/, "我们发明 REST"],
  [/1838/, "锁死 1838"],
  [/浮力卸载|感官降噪|状态转换/, "机制三词占回研究章旁白"],
];
for (const [re, label] of forbidden) {
  if (re.test(spoken)) errors.push(`旁白出现红线用语：${label}`);
}

const shot005 = md.match(/## 分镜005（改）[\s\S]*?(?=## )/)?.[0] || "";
if (/63项研究　1838/.test(shot005) || /「1838名/.test(shot005)) {
  errors.push("005 画面仍锁死 1838");
}

if (/Feinstein 2018[^\n]{0,40}RCT/.test(md) && !/开放标签/.test(md)) {
  errors.push("2018 未标开放标签");
}
if (!md.includes("开放标签")) errors.push("全稿未出现「开放标签」");
if (!md.includes("柳叶子刊") && !md.includes("eClinicalMedicine")) {
  errors.push("004 未点名柳叶子刊/eClinicalMedicine");
}
if (!md.includes("六十余年")) errors.push("003 未兑现方法史「六十余年」");
if (!md.includes("浮力卸载")) errors.push("机制备用镜丢失");

const craft = kps.find((p) => p.id === "KP-CRAFT-026");
if (!craft) errors.push("库中缺少 KP-CRAFT-026");
else {
  if (craft.status !== "approved") errors.push("KP-CRAFT-026 未批准");
  if (craft.layer !== "company") errors.push("KP-CRAFT-026 分层错误");
}

const required = ["KP-WEB-001", "KP-WEB-002", "KP-WEB-003", "KP-COM-014"];
for (const id of required) {
  if (!kps.some((p) => p.id === id && p.status === "approved")) {
    errors.push(`口径源卡缺失或未批准：${id}`);
  }
}

const out = { ok: errors.length === 0, errors, notes, vo003, vo004, vo005 };
console.log(JSON.stringify(out, null, 2));
if (!out.ok) process.exit(1);
