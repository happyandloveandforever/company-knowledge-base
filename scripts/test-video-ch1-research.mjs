/**
 * 校验宣传片第一章改写稿：时长可念完、红线未破、口径卡在库里。
 * 运行：node scripts/test-video-ch1-research.mjs
 */
import { existsSync, readFileSync } from "fs";
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
  const slice = md.slice(idx, idx + 5000);
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
const vo006 = extractVo("## 分镜006（新）");

function chineseLen(s) {
  return [...s.replace(/[A-Za-z0-9.,;:()（）、，。；：\s>·]/g, "")].length;
}

const budgets = [
  ["003", vo003, 70],
  ["004", vo004, 150],
  ["005", vo005, 85],
  ["006", vo006, 120],
];
for (const [id, vo, max] of budgets) {
  const n = chineseLen(vo);
  notes.push(`${id} 旁白汉字约 ${n} 字（上限 ${max}）`);
  if (n === 0) errors.push(`${id} 旁白为空`);
  if (n > max) errors.push(`${id} 旁白过长：${n} > ${max}`);
}

const spoken = [vo003, vo004, vo005, vo006].join("\n");
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
if (!md.includes("一次看见变化，重复做得完，对照有信号")) {
  errors.push("004 未写入营销收束金句");
}
if (!md.includes("一次有结果，多次也显著，完成疗程无不良，长期效果仍持续。")) {
  errors.push("004 四宫格标题未改为「一次有结果…长期效果仍持续」");
}
if (!md.includes("先有漂浮疗法，后有中式漂浮")) {
  errors.push("004 底部未改为「先有漂浮疗法，后有中式漂浮」");
}
if (!vo006.includes("中式漂浮")) errors.push("006 旁白未点名中式漂浮");
if (!vo006.includes("疼痛") || !vo006.includes("睡眠")) {
  errors.push("006 旁白未承接疼痛与睡眠");
}
if (!vo006.includes("收集研究数据")) errors.push("006 旁白未落到收集研究数据");
if (/治疗失眠|治疗慢性疼痛/.test(vo006)) {
  errors.push("006 旁白写成治疗病种");
}
if (!md.includes("006c-chinese.jpg")) errors.push("006 未指定中式漂浮画面文件");
if (!md.includes("i-sopod") || !md.includes("Dreampod")) {
  errors.push("006b 未写入国际常见舱品牌名");
}
if (!md.includes("视频位") || !md.includes("chinese-float.mp4")) {
  errors.push("006c 未写明用户视频占位与成片文件");
}
if (!vo004.includes("开放标签")) errors.push("004 旁白未说开放标签");
if (!vo004.includes("一次")) errors.push("004 旁白未从「一次」起钩");
if (!md.includes("Kjellgren")) errors.push("004 未加入功效论文 Kjellgren 2014");
if (!md.includes("用临床对照的标准看，有没有功效？")) {
  errors.push("004 功效卡问句未改为「用临床对照的标准看，有没有功效？」");
}
if (/问：对照，有没有功效？/.test(md)) {
  errors.push("004 功效卡仍用旧问句「对照，有没有功效？」");
}
if (/问：重复，人能不能做完/.test(md)) {
  errors.push("004 重复卡仍用负面问句「人能不能做完」");
}
if (/徽章：可行性随机对照 · 不是疗效金标准/.test(md)) {
  errors.push("004 重复卡绿框仍写「不是疗效金标准」");
}
if (!md.includes("多次使用，是否舒适安全？")) {
  errors.push("004 重复卡未改为「多次使用，是否舒适安全？」");
}
if (!md.includes("七十五人全部完成")) {
  errors.push("004 重复卡未写「七十五人全部完成」");
}
if (!md.includes("依从度高，使人舒适的安全疗法")) {
  errors.push("004 重复卡绿框未改为舒适安全口径");
}
if (!vo004.includes("依从度很高")) {
  errors.push("004 旁白未说依从度很高");
}
if (!md.includes("先有研究，后发展成疗法")) {
  errors.push("003 底部未改为「先有研究，后发展成疗法」");
}
if (/先有方法，后有舱/.test(md)) {
  errors.push("003 分镜稿仍写旧底部「先有方法，后有舱」");
}
if (!md.includes("六十余年")) errors.push("003 未兑现方法史「六十余年」");
if (!md.includes("浮力卸载")) errors.push("机制备用镜丢失");
if (!md.includes("John C. Lilly")) errors.push("003 图一未写 Lilly / 早期箱式舱");
if (!md.includes("Suedfeld 1980")) errors.push("003 图二未写 Suedfeld 1980 专著");
if (!md.includes("脑电")) errors.push("003 图三未写脑电监测");
if (!md.includes("这就是 Feinstein 2018")) {
  errors.push("003 图三未禁止冒充 2018 论文图");
}

const craft = kps.find((p) => p.id === "KP-CRAFT-026");
if (!craft) errors.push("库中缺少 KP-CRAFT-026");
else {
  if (craft.status !== "approved") errors.push("KP-CRAFT-026 未批准");
  if (craft.layer !== "company") errors.push("KP-CRAFT-026 分层错误");
  if (!craft.body.includes("Lilly") || !craft.body.includes("脑电")) {
    errors.push("KP-CRAFT-026 未写入三张指定图口径");
  }
  if (!craft.body.includes("先有研究，后发展成疗法")) {
    errors.push("KP-CRAFT-026 未写入 003 新底部句");
  }
  if (!craft.body.includes("一次看见变化")) {
    errors.push("KP-CRAFT-026 未写入 004 营销阶梯");
  }
  if (!craft.body.includes("Kjellgren")) {
    errors.push("KP-CRAFT-026 未写入功效论文");
  }
  if (!craft.body.includes("用临床对照的标准看有没有功效")) {
    errors.push("KP-CRAFT-026 功效卡问句未改为临床对照标准");
  }
  if (!craft.body.includes("一次有结果，多次也显著，完成疗程无不良，长期效果仍持续")) {
    errors.push("KP-CRAFT-026 未写入四宫格新标题");
  }
  if (!craft.body.includes("先有漂浮疗法，后有中式漂浮")) {
    errors.push("KP-CRAFT-026 未写入 004 新底部句");
  }
  if (!craft.body.includes("使人舒适的安全疗法")) {
    errors.push("KP-CRAFT-026 未写入 2024 卡正面口径");
  }
  if (!craft.body.includes("006") || !craft.body.includes("中式漂浮扩大内涵")) {
    errors.push("KP-CRAFT-026 未写入 006 承接中式漂浮");
  }
}

const stillDir006 = path.join(root, "exports/video-assets/shot006");
for (const f of [
  "006a-watch.jpg",
  "006b-gap.jpg",
  "006c-chinese.jpg",
  "user-source/chinese-float-video-frame0.jpg",
  "user-source/chinese-float.mp4",
]) {
  if (!existsSync(path.join(stillDir006, f))) errors.push(`缺少画面文件：shot006/${f}`);
}
const stillDir004 = path.join(root, "exports/video-assets/shot004");
for (const f of [
  "004a-once.jpg",
  "004b-repeat.jpg",
  "004c-efficacy.jpg",
  "004d-followup.jpg",
  "004e-four-up.jpg",
  "user-source/feinstein-2018-p1.jpg",
  "user-source/garland-2024-p1.jpg",
  "user-source/kjellgren-2014-p1.jpg",
  "user-source/choquette-2023-p1.jpg",
]) {
  if (!existsSync(path.join(stillDir004, f))) errors.push(`缺少画面文件：shot004/${f}`);
}
const compose003 = readFileSync(path.join(root, "scripts/compose-shot003-stills.py"), "utf-8");
if (!compose003.includes("先有研究，后发展成疗法")) {
  errors.push("compose-shot003-stills.py 未写入新底部句");
}
if (compose003.includes("先有方法，后有舱")) {
  errors.push("compose-shot003-stills.py 仍写旧底部「先有方法，后有舱」");
}

const stillDir = path.join(root, "exports/video-assets/shot003");
for (const f of [
  "user-source/lilly-early-tank.jpg",
  "user-source/suedfeld-1980-cover.jpg",
  "user-source/eeg-video-frame0.jpg",
  "003c-1950s.jpg",
  "003d-1980-book.jpg",
  "003e-eeg-frame.jpg",
  "003b-timeline-03.jpg",
]) {
  if (!existsSync(path.join(stillDir, f))) errors.push(`缺少画面文件：${f}`);
}

const required = ["KP-WEB-001", "KP-WEB-002", "KP-WEB-003", "KP-COM-014"];
for (const id of required) {
  if (!kps.some((p) => p.id === id && p.status === "approved")) {
    errors.push(`口径源卡缺失或未批准：${id}`);
  }
}

const out = { ok: errors.length === 0, errors, notes, vo003, vo004, vo005, vo006 };
console.log(JSON.stringify(out, null, 2));
if (!out.ok) process.exit(1);
