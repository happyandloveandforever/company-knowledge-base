#!/usr/bin/env node
/**
 * Claude 精细拆分（扫描件 321–352 页）
 *
 * 参考资料注 8–94、版权页、附录 I–XVI。正文教学到此结束。
 * 不覆盖 KP-PVB-001~075。图版只摘要，不把病名当适应症。
 *
 * 幂等：KP-PVB-076 已存在则跳过。须先有 281–320（KP-PVB-056）。
 * 运行：node scripts/import-rosenberg-vagus-book-321-352.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-06T11:30:00.000Z";
const sourceId = "SRC-PVB-ROSENBERG-321-352";
const sourceFile = "迷走神經的自我檢測與治癒_321-352.pdf";
const handbook = "docs/罗森堡腹侧检验自学流程.md";

const raw = [
  {
    id: "KP-PVB-076",
    loc: "书页 321–352 覆盖范围",
    title: "本批是全书末：注释 8–94、版权页、附录十六张图，正文不再续",
    category: "培训资料",
    layer: "commons",
    tags: ["拆分范围", "参考资料", "附录", "全书"],
    audience: ["培训师", "管理者", "学术"],
    usage: "training",
    min: 3,
    summary:
      "321–335 续参考资料注 8–94。336 版权/CIP：一中心、ISBN 978-957-9517-81-2、CIP 作 353 面。337–352 附录 I–XVI：脑干与五对颅神经、腹背侧器官、副神经、悬雍垂、斜方肌 SCM、婴儿运动、头痛图、迎香攒竹、裂孔疝、枕下肌、婴儿颅缝、扁平后脑、面部微表情。扫描件止于 352。",
    body: "无新的长动作章节。无索引、无独立作者传。CIP 353 面，本包最后一页是附录 XVI。\n对接：001~075。自学动作仍用手册。",
    examples: [
      "对：书看到附录图就结束了，不是没拆完正文",
      "错：附录图是新的适应症菜单",
    ],
  },
  {
    id: "KP-PVB-077",
    loc: "p.331 注73",
    title: "红线：丹麦退伍军人叙事有一条注写的是与 Marc Levin 的私信，不是公开论文",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "注释", "PTSD", "Levin"],
    audience: ["培训师", "销售团队", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "注 73：美国某治疗项目没有发表报告，书中总结来自与神经科/心理学者 Marc Levin 多年私信。这把第6章「颅荐骨先于谈话」的证据等级钉死：不是可检索的 RCT。",
    body: "执行：禁止把该项目讲成发表研究。PTSD 仍不是漂浮适应症。\n对接：KP-PVB-034。",
    examples: [
      "错：论文证明先漂再谈话能治退伍军人",
      "对：作者自己注了是私信，不是公开报告",
    ],
  },
  {
    id: "KP-PVB-078",
    loc: "p.327、334 注43/88–91",
    title: "红线：Safe and Sound Protocol 是波吉斯听力产品，不是方舟音乐模块",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "SSP", "听音乐计划", "波吉斯"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "听音乐计划在注里写明后来作为 Integrated Listening Systems 的 Safe and Sound Protocol 销售。另有 RSA 与听处理、降低听觉过敏的论文指针。作者镫骨肌功能被测过两次，是逸事。",
    body: "执行：舱内播放列表 ≠ SSP。自闭/恐声不是适应症。\n对接：KP-PVB-045。",
    examples: [
      "错：我们用的就是波吉斯授权 SSP",
      "对：那是独立听力协议；方舟不治疗自闭",
    ],
  },
  {
    id: "KP-PVB-079",
    loc: "附录 I–III、V p.337–341",
    title: "通识：附录把五对社交颅神经和椎动脉画在脑干细胞上",
    category: "技术知识",
    layer: "commons",
    tags: ["附录", "五对颅神经", "椎动脉", "脑干"],
    audience: ["学术", "销售团队", "培训师"],
    usage: "pitch",
    min: 3,
    summary:
      "图示：椎动脉供脑干；除 I、II 外颅神经起自脑干。社会性参与点名 V、VII、IX、X、XI。第十一对画出几种走行，到斜方肌与胸锁乳突肌。上颈错位被画成可减少脑干血流。",
    body: "这是作者教学图，不是影像报告。禁止承诺漂浮改变椎动脉。\n对接：KP-PVB-004、060。",
    examples: [
      "对：能交往的那几对神经从脑干出来，血供绕上颈",
      "错：漂浮专给椎动脉加流量",
    ],
  },
  {
    id: "KP-PVB-080",
    loc: "附录 II p.338",
    title: "通识：附录器官图再次分开腹侧与背侧迷走，降结肠不在背侧名单里",
    category: "技术知识",
    layer: "commons",
    tags: ["附录", "腹侧迷走", "背侧迷走", "器官"],
    audience: ["学术", "培训师", "销售团队"],
    usage: "pitch",
    min: 3,
    summary:
      "腹侧、背侧都到心、肺、气管。腹侧还到喉咽表达肌。背侧到膈下消化管，图注写明降结肠除外：胃、肝、胰、脾、升结肠、横结肠、小肠。",
    body: "对接书前新/老迷走器官图。不要讲成漂浮选择性只开腹侧。\n对接：KP-PVB-003、005。",
    examples: [
      "对：同一条迷走，腹侧和背侧管的器官名单不一样",
      "错：漂浮关掉背侧、只留腹侧",
    ],
  },
  {
    id: "KP-PVB-081",
    loc: "附录 IV p.340",
    title: "红线：发啊看悬雍垂是观察，不是诊断金标准，更不是开舱筛查",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "悬雍垂", "发啊", "诊断"],
    audience: ["培训师", "销售团队", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "附录把发啊时软腭/悬雍垂是否对称上抬，写成腹侧迷走咽支测试：不上抬的一侧为障碍。这与书前观察一致，仍不是百分百诊断，也不能当漂浮准入测验。",
    body: "不压舌探喉。不对客做正式神经检查。\n对接：KP-PVB-013。",
    examples: [
      "对：可以当自学前后对照的观察",
      "错：悬雍垂不正就不能开舱，或者就能诊断迷走病",
    ],
  },
  {
    id: "KP-PVB-082",
    loc: "附录 IX–X p.345–346",
    title: "红线：附录头痛四图和迎香攒竹，仍禁止当门店按摩或美容菜单",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "偏头痛", "激痛点", "迎香", "攒竹"],
    audience: ["培训师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "四张紧张性头痛/偏头痛图标 SCM 与上斜方肌 x 及牵涉区，作者把它接到第十一对，并写可能与常规范式冲突。流程点名：先基本动作再按标记点。迎香、攒竹图对应自然拉皮，声称调 CN5/7。",
    body: "偏头痛不是适应症。禁止店内按图做。基本动作见手册。\n对接：KP-PVB-066、070；" + handbook,
    examples: [
      "错：照附录 x 给顾客做偏头痛疗程加拉皮",
      "对：图是读本附图；门店不做",
    ],
  },
  {
    id: "KP-PVB-083",
    loc: "附录 XI p.347",
    title: "红线：裂孔疝图把腹侧障碍画成把胃拖进裂孔；几乎每个 COPD 都有疝是诊所印象",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "裂孔疝", "COPD", "食道"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "图对比正常食道过裂孔 vs 胃底疝上去。腹侧管食道上段；障碍时食道缩短、胃被拖过裂孔、横膈吸气下不来。作者写几乎每个见到的 COPD 都有疝征且处在背侧状态。",
    body: "执行：COPD、裂孔疝不是漂浮适应症。禁止用「几乎每个」当统计。\n对接：KP-PVB-041、069。",
    examples: [
      "错：慢阻肺都是疝，漂浮把胃拉回去",
      "对：这是附图假说；呼吸困难走医疗",
    ],
  },
  {
    id: "KP-PVB-084",
    loc: "附录 XII–XV p.348–351",
    title: "红线：枕下三角与扁平后脑图声称立刻改善腹侧；成人拉 SCM 仍可改头型不是门店项目",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "枕下肌", "扁平后脑", "ADHD"],
    audience: ["培训师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "枕下肌群与三角、寰枢、椎动脉图：紧张可压神经血管。基本动作被写成温和地让骨坐正、椎动脉更好、腹侧立刻改善。婴儿颅缝图之后：慢性单侧（常右侧）SCM 把后脑拉扁，许多被标 ADHD 的孩子有此头型；松 SCM 后成人头型也可更对称。",
    body: "立刻改善、ADHD 头型、成人改头型全部当红线。禁止店内拉颈改头。\n对接：KP-PVB-050、060。",
    examples: [
      "错：后脑平就是 ADHD，拉 SCM 立刻腹侧恢复",
      "对：附图不是筛查表；儿童头型走儿科",
    ],
  },
  {
    id: "KP-PVB-085",
    loc: "p.336、352",
    title: "全书拆完：版权页英副标含焦虑抑郁创伤自闭，那是书名不是方舟适应症",
    category: "合规与风控",
    layer: "company",
    tags: ["全书", "书名", "适应症", "附录"],
    audience: ["管理者", "培训师", "销售团队"],
    usage: "training",
    min: 3,
    summary:
      "英副标 Self-Help Exercises for Anxiety, Depression, Trauma, and Autism 是原书定位。附录末张：自发微表情尤其眼与唇之间，被写成社会性参与在线。中文版权一中心 2019/2020，ISBN 978-957-9517-81-2。罗森堡读本扫描件到此结束。",
    body: "焦虑、抑郁、创伤、自闭仍全部不是漂浮适应症。动作自学走手册，不入库为 SOP。1–200 主题合并 001~015 保留；201 页后续拆至 085。\n对接：" + handbook,
    examples: [
      "对：书名级主张不是产品菜单；地图能借，病名不能借",
      "错：英文副标写了这四类，所以我们治这四类",
    ],
  },
];

function build(item) {
  const layer = item.layer;
  const usage = item.usage || "pitch";
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    tags: item.tags,
    audience: item.audience,
    prerequisites: [],
    summary: item.summary,
    body: item.body,
    examples: item.examples || [],
    source: {
      file: sourceFile,
      location: item.loc,
      date: "2017/繁中译本",
      author: "Stanley Rosenberg / 史丹利·罗森堡；李宇美 译",
    },
    scenarios:
      usage === "training"
        ? ["销售培训", "合规培训", "学术汇报"]
        : layer === "commons"
          ? ["学术汇报", "医院合作", "销售培训"]
          : ["投资人", "医院合作", "高管汇报", "演讲"],
    durationMin: item.min,
    version: "1.0",
    status: "approved",
    layer,
    usage,
    createdAt: now,
    updatedAt: now,
    conflictNote:
      layer === "commons"
        ? "通识层。罗森堡书附录与注释摘要，不是本公司试验。图中病名不得外推为漂浮适应症。"
        : "公司口径层。说明注释证据等级、SSP、附录病名图怎么停；禁止写成适应症或门店SOP。",
  };
}

const dataDir = path.join(process.cwd(), "data");
const kpPath = path.join(dataDir, "knowledge-points.json");
const sourcesPath = path.join(dataDir, "sources.json");
const existing = JSON.parse(readFileSync(kpPath, "utf-8"));
if (existing.some((p) => p.id === "KP-PVB-076")) {
  console.log("罗森堡书 321–352 已入库，跳过。总数:", existing.length);
  process.exit(0);
}
if (!existing.some((p) => p.id === "KP-PVB-056")) {
  console.error("请先入库 281–320（KP-PVB-056）。");
  process.exit(1);
}
const points = raw.map(build);
const ids = new Set(existing.map((p) => p.id));
const dup = points.filter((p) => ids.has(p.id));
if (dup.length) {
  console.error("ID 冲突:", dup.map((p) => p.id).join(","));
  process.exit(1);
}
const merged = [...existing, ...points];
const p001 = merged.find((p) => p.id === "KP-PVB-001");
if (p001) {
  p001.title = "罗森堡读本 1–200 已主题合并为 15 条；201–352 已按用户要求续拆完";
  p001.summary =
    "英文原书 Accessing the Healing Power of the Vagus Nerve，史丹利·罗森堡著、李宇美译。1–200 页主题合并为 KP-PVB-001~015。201–352 页续拆为 KP-PVB-016~085。第二部完整动作步骤以自学手册为准，不入库为门店 SOP。书名级焦虑/抑郁/创伤/自闭不是漂浮适应症。";
  p001.updatedAt = now;
  p001.version = "2.2";
}
writeFileSync(kpPath, JSON.stringify(merged, null, 2) + "\n");
const sources = JSON.parse(readFileSync(sourcesPath, "utf-8")).filter((s) => s.id !== sourceId);
sources.push({
  id: sourceId,
  filename: sourceFile,
  fileType: "pdf",
  uploadedAt: now,
  knowledgePointIds: points.map((p) => p.id),
  status: "done",
  splitMode: "claude-agent",
  note: "扫描件 321–352。注释8–94、版权页、附录I–XVI。10 条。全书正文结束。SSP/私信注/附录病名图不得外推为漂浮适应症。",
});
writeFileSync(sourcesPath, JSON.stringify(sources, null, 2) + "\n");
console.log(
  JSON.stringify(
    {
      imported: points.length,
      commons: points.filter((p) => p.layer === "commons").length,
      company: points.filter((p) => p.layer === "company").length,
      total: merged.length,
    },
    null,
    2
  )
);
