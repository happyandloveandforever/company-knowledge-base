#!/usr/bin/env node
/**
 * 罗森堡续拆主题合并：KP-PVB-016~085（201–352 过程卡）→ KP-PVB-016~027（能用的地图 + 红线）。
 *
 * 用户 2026-09-06：「对做吧」（把 016～085 像 1–200 那样收成更短的主题卡）。
 * 不覆盖 001~015、不覆盖 VGMECH/CIS/VNSMAP。第二部步骤仍以自学手册为准。
 *
 * 幂等：SRC-PVB-ROSENBERG-CONT-MERGED 已存在则跳过。须先有 KP-PVB-085。
 * 运行：node scripts/apply-rosenberg-continuation-merge.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-06T11:40:00.000Z";
const sourceId = "SRC-PVB-ROSENBERG-CONT-MERGED";
const sourceFile = "罗森堡迷走读本续拆主题合并（201–352页→12条）";
const handbook = "docs/罗森堡腹侧检验自学流程.md";
const MERGED_IDS = Array.from({ length: 12 }, (_, i) => `KP-PVB-${String(i + 16).padStart(3, "0")}`);
const BATCH_SOURCES = [
  "SRC-PVB-ROSENBERG-201-240",
  "SRC-PVB-ROSENBERG-241-280",
  "SRC-PVB-ROSENBERG-281-320",
  "SRC-PVB-ROSENBERG-321-352",
];

const raw = [
  {
    id: "KP-PVB-016",
    loc: "合并说明 / 201–352 页",
    title: "201–352 已主题合并为 12 条：全书扫描件结束，这批补地图和红线",
    category: "合规与风控",
    layer: "commons",
    tags: ["主题合并", "第6章", "第7章", "第二部", "附录"],
    audience: ["管理者", "培训师", "销售团队", "学术"],
    usage: "both",
    min: 4,
    summary:
      "1–200 仍是 KP-PVB-001~015。201–352（从第 241 页续拆到附录）曾拆成 70 条过程卡，现按「能用的」收成 016~027。覆盖第5章偏头痛收束、第6章身心问题、第7章泛自闭、第二部动作目的、注释与附录。第二部步骤以自学手册为准，不入库为门店 SOP。",
    body: "70→12 怎么并：\n- 留下：激痛点/听滤、共同调节、PTSD 关机对战逃、第二部目的与成功信号、附录图怎么读\n- 并进红线：不药而愈、回盲瓣/家暴、忧郁躁郁 ADHD、不要说治好自闭、SSP/神经筋膜/头型/拉皮、英副标不是适应症\n- 丢掉：各批覆盖/待续过程卡、逐步手法、重复个案时间线\n\n怎么用：对外 017~019、024；培训 020~023、025~027。动作步骤：" +
      handbook +
      "。\n不要再跑 201–352 逐页 import。",
    examples: [
      "对：1–200 十五张，后半本十二张，全书能用的都在这儿",
      "错：合并过了就把病名当适应症，或按第二部给顾客做手法",
    ],
  },
  {
    id: "KP-PVB-017",
    loc: "p.201–207、254–266、附录 IX",
    title: "通识：激痛点会画移转痛；听得见纯音不等于听得清人话",
    category: "技术知识",
    layer: "commons",
    tags: ["激痛点", "特拉维尔", "中耳", "三叉神经", "面神经"],
    audience: ["学术", "销售团队", "培训师"],
    usage: "pitch",
    min: 4,
    summary:
      "特拉维尔激痛点比周围硬，可在远处画出固定图形；斜方肌、胸锁乳突肌常牵出偏头痛样图形。听懂口语还要第五对（鼓膜张肌）和第七对（镫骨肌）滤低频背景。标准测听多测第八对，正常不等于嘈杂里听得清人话。",
    body: "对外：头很痛可以先问肩颈一条硬带；没回应可以先问是不是没把你的声音从噪声里捞出来。\n对内：图形和中耳机制不是筛查表，也不是开舱听力训练。\n对接：KP-PVB-004、012。",
    examples: [
      "对：听得见音和听得懂话不是一回事",
      "错：漂浮舱按特拉维尔图谱松激痛点，也是中耳训练仪",
    ],
  },
  {
    id: "KP-PVB-018",
    loc: "p.208–223、241",
    title: "通识：生理也会写情绪；共同调节要找神经系统也健康的人",
    category: "技术知识",
    layer: "commons",
    tags: ["共同调节", "身心", "安全", "社会性哺乳动物"],
    audience: ["学术", "销售团队", "培训师"],
    usage: "pitch",
    min: 3,
    summary:
      "第6章反过来问生理如何影响心理。只谈话常常够不到自律状态。情绪是自己的 ANS 乘上别人的 ANS。和安全的人吃饭散步是调节；冥想太极瑜伽是文化方法，不是漂浮模块。选治疗师看前后测，不看广告名。",
    body: "儿童恐惧：先说出名字并拥抱，不是用更大威胁压回去。\n方舟能借的仍是安全窗口，不是心理咨询室。\n对接：KP-PVB-002、021。",
    examples: [
      "对：和信得过的人在一起，神经系统比较容易回到能交往",
      "错：漂浮取代谈话治疗，也取代安全关系",
    ],
  },
  {
    id: "KP-PVB-019",
    loc: "p.233–240、236–237",
    title: "通识：PTSD 先分清慢性关机还是慢性交感；解离不是放松",
    category: "技术知识",
    layer: "commons",
    tags: ["PTSD", "背侧关机", "交感", "解离", "社会性参与"],
    audience: ["学术", "培训师", "销售团队"],
    usage: "training",
    min: 4,
    summary:
      "危险结束后仍卡在战逃或冻结，作者用来理解 PTSD。标签容易只盯过去，看不到当下是交感拉满还是背侧关机（麻木、不动、没情绪）。把冻结当战逃去泄压或逼回忆，可能再创伤。解离、魂不守舍被写成腹侧掉线。",
    body: "成功方向：一次次回到社会性参与，直到能自我调节。出舱「很静」仍要看能不能对视、说话有没有音调。\nPTSD 不是漂浮适应症。\n对接：KP-PVB-003、007、012。",
    examples: [
      "对：先分清人是绷紧还是关机",
      "错：出舱一动不动就是深度放松；解离就是出体卖点",
    ],
  },
  {
    id: "KP-PVB-020",
    loc: "p.202–207、302–317、附录 IX–X",
    title: "红线：偏头痛不药而愈、激痛点、SCM、自然拉皮都不是门店项目",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "偏头痛", "激痛点", "自然拉皮", "SOP"],
    audience: ["销售团队", "培训师", "漂浮师", "管理者"],
    usage: "training",
    min: 4,
    summary:
      "作者写按到点后二十年偏头痛也可立刻不药而愈；木工记者个案后教自助揉 X 形区。第二部有激痛点轻压、SCM 俯臥转头「防止偏头痛」、迎香攒竹「无副作用拉皮」。全部禁止写成开舱疗程或美容承诺。",
    body: "轻压活性点、过重会推进行交感或背侧——只作自学安全句，不是店内操作单。突发最痛头痛走急诊。偏头痛不是适应症。\n对接：KP-PVB-012、017。",
    examples: [
      "错：按一下二十年偏头痛立刻好，再做四分鐘拉皮无副作用",
      "对：这是诊所/自助叙事；门店不做；急症走急诊",
    ],
  },
  {
    id: "KP-PVB-021",
    loc: "p.214–232",
    title: "红线：焦虑恐慌、回盲瓣内脏按摩、家暴循环不是门店治疗",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "焦虑", "回盲瓣", "家暴", "创伤"],
    audience: ["销售团队", "培训师", "管理者", "漂浮师"],
    usage: "training",
    min: 5,
    summary:
      "恐惧是当下威胁，焦虑是未来和记忆，恐慌约十分钟到高峰。刘女士回盲瓣手术后发啊加捏肩、基本动作、再加内脏按摩——诊所流程，不是 SOP。家暴循环是社交→动员→背侧冻结解离；第一步是安全，不是问「你为什么不走」。",
    body: "疑似家暴不盘问细节、不劝复合、不与施暴者同舱。治疗师是否题不是前台话术。COPD/焦虑/结肠炎不是适应症。\n对接：KP-PVB-012、019。",
    examples: [
      "错：按回盲瓣治焦虑；漂一下家暴就好了",
      "对：内脏手法不是门店项目；先安全，创伤走专业机构",
    ],
  },
  {
    id: "KP-PVB-022",
    loc: "p.242–249",
    title: "红线：忧郁躁郁产后 ADHD 加裂孔疝，一律不是适应症；减药只问开药医生",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "忧郁", "躁郁", "ADHD", "裂孔疝"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 4,
    summary:
      "忧郁被写成背侧过强，躁期写成交感过强，「社会性参与技法成效极为卓著」当红线。产后个案含 C1–C2 与基本动作。五名 ADHD 男孩都有裂孔疝、腹侧后「完全消失」是五例无对照。JAMA 安慰剂句不得拿来劝停药。",
    body: "作者支持想停药的人，但必须在原处方医生指导下减停。禁止店内扳颈椎。\n对接：KP-PVB-012、038 已并入本卡。",
    examples: [
      "错：漂浮替代抗忧郁药；过动都是疝按胃就消失",
      "对：精神与消化病走专科；减药问医生",
    ],
  },
  {
    id: "KP-PVB-023",
    loc: "p.250–275、327、334",
    title: "红线：不要说能治好自闭症；威廉、SSP、头型手法都不是证据",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "泛自闭", "SSP", "神经筋膜", "扁平后脑"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 5,
    summary:
      "第七章泛自闭。作者自己写：不要说能治好自闭症，只说改善听觉、同理与沟通。医院复评「不再有症状」、威廉一次神经筋膜后立刻对视、SCM 1–2 分钟后脑变圆，全部当红线。听音乐计划五天过滤音乐，注里写明后来作为 Safe and Sound Protocol 销售。",
    body: "谱系儿童徒手要先安全、不强迫躺——门店更不是儿童行为治疗。舱内播放列表 ≠ SSP。自闭症不是漂浮适应症。\n对接：KP-PVB-012、017。",
    examples: [
      "错：国际老师治好自闭症；我们舱里放的就是波吉斯 SSP",
      "对：作者禁止宣称治愈；我们更不能；SSP 是独立听力产品",
    ],
  },
  {
    id: "KP-PVB-024",
    loc: "p.279–289",
    title: "通识：第二部目的是回到社会性参与；吞咽哈欠叹息是信号，C1/C2 不是金标准",
    category: "技术知识",
    layer: "commons",
    tags: ["第二部", "基本动作", "C1", "C2", "九头蛇"],
    audience: ["学术", "培训师", "销售团队"],
    usage: "training",
    min: 4,
    summary:
      "第二部从 279 页开始。练习用于从慢性交感或背侧关机转到能交往。成功信号常是吞咽、哈欠、叠吸气的叹息。基本动作被写成不到两分钟、头不动只动眼。C1/C2「几乎一定复位」、一个念头就能错位、椎动脉软管比喻，是作者机制，不是影像诊断。",
    body: "九头蛇日记可自学监测，禁止当适应症表，禁止「斩断所有症状」当保证。起身头晕等 1–2 分钟。步骤看手册，不重写长流程。\n对接：" + handbook,
    examples: [
      "对：测了做了再测；晕了坐下等",
      "错：基本动作保证复位寰枢椎并给脑干加血",
    ],
  },
  {
    id: "KP-PVB-025",
    loc: "p.290–309",
    title: "红线：神经筋膜、火蜥蜴、扭转只点名；步骤在手册，门店不代做",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "神经筋膜", "火蜥蜴", "扭转", "手册"],
    audience: ["培训师", "漂浮师", "管理者"],
    usage: "training",
    min: 4,
    summary:
      "神经筋膜放松是基本动作的徒手替代，给婴儿和不会听话的谱系成人；最轻力、到阻力即停。火蜥蜴要头和脊柱当一条，半套到跪地全套。扭转三肘高，首次「高了 2–5 厘米」不是卖点。压力/抑郁「最重要技法」当红线。",
    body: "力过大组织更紧。侧弯、裂孔疝当颈僵原因不是店内复位指征。完整步骤：" +
      handbook +
      "。\n对接：KP-PVB-015、024。",
    examples: [
      "对：员工自学看手册；对客不代做神经筋膜",
      "错：开舱前后做五分钟神经筋膜，当场长高五厘米",
    ],
  },
  {
    id: "KP-PVB-026",
    loc: "p.319–352 注释与附录",
    title: "附录图可借解剖；注 73 是私信，SSP 是产品，发啊仍不是诊断金标准",
    category: "技术知识",
    layer: "commons",
    tags: ["附录", "注释", "悬雍垂", "SSP", "证据等级"],
    audience: ["学术", "培训师", "销售团队"],
    usage: "training",
    min: 3,
    summary:
      "附录画出五对社交颅神经与椎动脉、腹侧/背侧器官（降结肠不在背侧名单）、悬雍垂发啊、头痛四图、裂孔疝、枕下三角、扁平后脑、面部微表情。注 73：颅荐骨先于谈话的退伍军人叙事来自与 Marc Levin 的私信，不是公开论文。",
    body: "发啊看悬雍垂是观察，不能当开舱筛查。附录病名图仍禁止当菜单。版权页 CIP 作 353 面，扫描件止于附录 XVI（352）。\n对接：KP-PVB-005、013、023、027。",
    examples: [
      "对：图是教学附图；那条退伍军人故事证据等级是私信",
      "错：悬雍垂不正就不能开舱；附录证明漂浮治 COPD 和 ADHD",
    ],
  },
  {
    id: "KP-PVB-027",
    loc: "p.336 版权页 / 全书",
    title: "英副标写了焦虑抑郁创伤自闭，那是书名不是方舟适应症；全书能用的卡到此为止",
    category: "合规与风控",
    layer: "company",
    tags: ["全书", "书名", "适应症", "主题合并"],
    audience: ["管理者", "培训师", "销售团队"],
    usage: "training",
    min: 3,
    summary:
      "原书英副标 Self-Help Exercises for Anxiety, Depression, Trauma, and Autism。中文版权一中心，ISBN 978-957-9517-81-2。书名级主张不是产品菜单。罗森堡读本：001~015 管前半地图，016~027 管后半地图与红线。",
    body: "焦虑、抑郁、创伤、自闭、偏头痛、COPD、疝、ADHD 仍全部不是漂浮适应症。动作自学走手册。1–200 与 201–352 的逐页 import 都不要再跑。\n对接：KP-PVB-001、012；" + handbook,
    examples: [
      "对：地图能借，病名不能借",
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
      date: "2017/繁中译本；2026-09-06 续拆主题合并",
      author: "Stanley Rosenberg / 史丹利·罗森堡；李宇美 译",
    },
    scenarios:
      usage === "training"
        ? ["销售培训", "合规培训", "学术汇报"]
        : usage === "both" || layer === "commons"
          ? ["学术汇报", "医院合作", "销售培训"]
          : ["投资人", "医院合作", "高管汇报", "演讲"],
    durationMin: item.min,
    version: "2.0",
    status: "approved",
    layer,
    usage,
    createdAt: now,
    updatedAt: now,
    conflictNote:
      layer === "commons"
        ? "通识层。罗森堡读本 201–352 主题合并后的可用地图，不是本公司临床试验。书中病名、手法与疗效叙事不得外推为漂浮适应症。"
        : "公司口径层。说明后半本红线怎么对接方舟；禁止写成产品适应症或门店 SOP。",
  };
}

const dataDir = path.join(process.cwd(), "data");
const kpPath = path.join(dataDir, "knowledge-points.json");
const sourcesPath = path.join(dataDir, "sources.json");
const existing = JSON.parse(readFileSync(kpPath, "utf-8"));
const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));

if (sources.some((s) => s.id === sourceId)) {
  console.log("罗森堡续拆已主题合并，跳过。总数:", existing.length);
  process.exit(0);
}
if (!existing.some((p) => p.id === "KP-PVB-085")) {
  console.error("请先入库 201–352 续拆（KP-PVB-085）。");
  process.exit(1);
}
if (!existing.some((p) => p.id === "KP-PVB-001")) {
  console.error("请先有 1–200 合并包（KP-PVB-001）。");
  process.exit(1);
}

const incoming = raw.map(build);
if (incoming.length !== 12 || incoming.some((p, i) => p.id !== MERGED_IDS[i])) {
  throw new Error("续拆合并卡必须是 KP-PVB-016~027");
}

const kept = existing.filter((p) => {
  if (!p.id.startsWith("KP-PVB-")) return true;
  const n = Number(p.id.slice(7));
  return Number.isFinite(n) && n >= 1 && n <= 15;
});

const p001 = kept.find((p) => p.id === "KP-PVB-001");
if (p001) {
  p001.title = "罗森堡读本：1–200 并成 15 条，201–352 并成 12 条；全书能用的都在这两叠";
  p001.summary =
      "1–200 页主题合并为 KP-PVB-001~015。201 页（241 起的后半本）到 352 页 70 条过程卡再并为 KP-PVB-016~027。第二部完整动作步骤以自学手册为准，不入库为门店 SOP。书名级焦虑/抑郁/创伤/自闭不是漂浮适应症。";
  p001.body =
    "这是什么：公开身体治疗读本，补「安全状态 / 社会性参与 / 腹侧与背侧不是同一档」这张通识地图。\n这不是什么：本公司试验、植入式或经皮 VNS 说明书、门店 SOP、疾病适应症清单。\n\n两叠主题合并怎么用：\n- 001~015：三回路、五对颅神经、五态/梯子、神经觉、九头蛇、呼吸肩颈观察、前半本病名红线\n- 016~027：激痛点与听滤、共同调节、PTSD 关机对战逃、后半本病名与手法红线、第二部目的、附录证据等级\n\n丢掉：各批覆盖/待续过程卡、逐步手法、重复个案。\n机制综述仍以 KP-VGMECH-* 为准，器械对照仍以 KP-VNSMAP-* 为准。逐页 import 不要再跑。第二部动作用自学手册，不要当门店 SOP。";
  p001.examples = [
    "对：前半 15 张、后半 12 张，能用的地图和红线都在",
    "错：国际权威证明漂浮能治愈自闭症和慢阻肺；后文动作我们照着做",
  ];
  p001.version = "3.0";
  p001.updatedAt = now;
}
const p015 = kept.find((p) => p.id === "KP-PVB-015");
if (p015) {
  p015.body =
    "对症开药看不见共病后面的自律状态：这是作者的医疗批评，不是方舟诊疗权。\n怎么用：承认「先状态、后干预」有纪律。\n怎么不用：漂浮=基本动作；高盐=神经筋膜松解；承诺测完迷走再开舱。\n第6–7章与第二部目的见 KP-PVB-016~027。第二部完整动作步骤仍以自学手册为准，不入库为门店 SOP。";
  p015.version = "3.0";
  p015.updatedAt = now;
}

const merged = [...kept, ...incoming];
writeFileSync(kpPath, JSON.stringify(merged, null, 2) + "\n");

const nextSources = sources
  .filter((s) => s.id !== sourceId)
  .map((s) => {
    if (!BATCH_SOURCES.includes(s.id)) return s;
    return {
      ...s,
      knowledgePointIds: MERGED_IDS,
      note: `${s.note || ""} 已于 2026-09-06 主题合并为 KP-PVB-016~027，勿再逐页 import。`.trim(),
    };
  });
nextSources.push({
  id: sourceId,
  filename: sourceFile,
  fileType: "other",
  uploadedAt: now,
  knowledgePointIds: MERGED_IDS,
  status: "done",
  splitMode: "claude-agent",
  note: "用户要求把 201–352 的 70 条过程卡主题合并为 12 条。保留 001~015。不覆盖 VGMECH/CIS/VNSMAP。",
});
writeFileSync(sourcesPath, JSON.stringify(nextSources, null, 2) + "\n");

console.log(
  JSON.stringify(
    {
      removed: existing.length - kept.length,
      imported: incoming.length,
      commons: incoming.filter((p) => p.layer === "commons").length,
      company: incoming.filter((p) => p.layer === "company").length,
      total: merged.length,
    },
    null,
    2
  )
);
