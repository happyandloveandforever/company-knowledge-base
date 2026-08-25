/**
 * 补卡：恢复力 = 迷走/自主神经弹性，漂浮方舟如何给刹车接手的机会
 *
 * - 通识：COM-019~022（可进客户 PPT）
 * - 文献：WEB-013 Flux 2022
 * - 汇报：CRAFT-026 幻灯片中间口径（公司层设计逻辑）
 * - 内训：TRN-102~103
 *
 * 幂等：KP-COM-019 已存在则跳过。
 * 运行：node scripts/import-vagus-elasticity.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-08-25T13:40:00.000Z";
const sourceId = "SRC-VAGUS-ELASTIC";
const sourceFile = "迷走弹性与漂浮方舟：恢复力机理补强.md";

function com(p) {
  return {
    ...base(p),
    layer: "commons",
    usage: p.usage,
    internalOnly: false,
    conflictNote: "通识层。公开科学/方法，不是本公司临床试验或专有数字。",
    source: {
      file: sourceFile,
      location: p.loc,
      date: "2026-08-25",
      author: "公开文献 + 知识库机理补强",
    },
  };
}

function companyPitch(p) {
  return {
    ...base(p),
    layer: "company",
    usage: "pitch",
    internalOnly: false,
    conflictNote: "公司层讲法。环境设计逻辑，不是已完成的迷走神经临床试验。",
    source: {
      file: sourceFile,
      location: p.loc,
      date: "2026-08-25",
      author: "中友瑞水 / 宣讲机理补强",
    },
  };
}

function trn(p) {
  return {
    ...base(p),
    layer: "commons",
    usage: "training",
    internalOnly: true,
    conflictNote: "漂浮师内训。仅内部使用，禁止进入客户资料与对外 PPT。",
    source: {
      file: sourceFile,
      location: p.loc,
      date: "2026-08-25",
      author: "公司内部培训补充材料",
    },
    scenarios: ["漂浮师内训", "上岗考核", "复训"],
  };
}

function base(p) {
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    tags: p.tags,
    audience: p.audience,
    prerequisites: p.prerequisites || [],
    summary: p.summary,
    body: p.body,
    examples: p.examples || [],
    scenarios: p.scenarios,
    durationMin: p.min,
    version: "1.0",
    status: "approved",
    createdAt: now,
    updatedAt: now,
  };
}

const points = [
  com({
    id: "KP-COM-019",
    loc: "总纲：恢复 vs 恢复力",
    title: "核心句：不是让人恢复，是把自主神经的弹性找回来",
    category: "技术知识",
    tags: ["恢复力", "弹性", "自主神经", "迷走神经", "通识"],
    audience: ["B端客户", "销售团队", "学术", "培训师"],
    usage: "both",
    min: 5,
    scenarios: ["演讲", "B端提案", "销售培训"],
    prerequisites: ["KP-V7-010", "KP-MECH-006"],
    summary:
      "对外主张：现代漂浮要解决的不是「这一次让人觉得恢复了」，而是「身体还能不能自己切回修复档」。这个能力叫恢复力，落点在自主神经——尤其是迷走神经这条刹车还有没有弹性。",
    body: "两套容易混的话：\n- 让人恢复：一次体验后的主观松、困、爽。这是状态。\n- 恢复力：压力来了能动员，压力过了能刹车、能睡觉、能消化。这是系统弹性。\n\n自主神经就是这套弹性的开关。交感是油门，迷走（副交感的主干）是刹车。弹性=油门和刹车还能互相让位；活力=刹车还咬得住，不是一直空转。\n长期压力的典型坏法：不是从来没休息过，而是休息时刹车接不上——睡不着、一停就烦、跑完仍醒。问题是切换失灵，不是缺一次放松。\n现代 flotation-REST 的机制进步：从「提供放松感」讲到「卸掉外界应答负担，让自主神经有机会切回修复模式」。对接 KP-MECH-001 减负—降噪—重置，以及 KP-V7-010/011。\n不要讲成：一次漂浮等于修好迷走；弹性已经用本公司试验测回基线。\n可以讲：先把外界刺激降下来，身体才有机会把休息档打开；我们关心的是这套切换能力，而不只是当场爽不爽。",
    examples: [
      "旧：漂浮让人彻底恢复",
      "新：漂浮先卸掉外界负担，让自主神经重新获得切换弹性",
    ],
  }),
  com({
    id: "KP-COM-020",
    loc: "公开科学：弹性怎么定义",
    title: "迷走弹性：张力 + 切换幅度，HRV 只是线索",
    category: "技术知识",
    tags: ["迷走神经", "HRV", "Thayer", "适应能力", "通识"],
    audience: ["学术", "B端客户", "销售团队"],
    usage: "both",
    min: 6,
    scenarios: ["学术汇报", "演讲", "销售培训"],
    prerequisites: ["KP-COM-019"],
    summary:
      "公开生理学把「恢复力」写成两件事：迷走张力（安静时刹车还在不在）和迷走灵活性（需要时能放开、过后能收回）。HRV 常被当作外周线索，不是漂浮方舟的出厂指标。",
    body: "弹性（flexibility）：自主神经能随环境放大或缩小唤醒。需要时交感上去，过后迷走回来。失去弹性=卡在轻度战斗/逃跑，休息也像备战。\n活力（tone）：迷走对心脏等靶器官的基础牵制还在。张力低时，心率难降、恢复慢。\n神经内脏整合（Thayer & Lane，HRV 作为自我调节能力的外周指标）：较高的迷走介导 HRV，常被讨论为适应、情绪调节与生理灵活性的线索。这是跨领域框架，不是漂浮专属结论。Ann Behav Med 2009;37:141–153。\n负荷视角：长期应对外界而恢复不完全，会累积成适应负荷（allostatic load，McEwen 等）。对外只用来解释「为什么会越来越难切回去」，不说漂浮已清除适应负荷。\n指标纪律：RMSSD / 高频 HRV 可作恢复线索。禁止把洛桑 +45%、单次舱内 HRV、本公司未锁定数字讲成迷走已修复。对接 KP-COM-004、KP-COM-005。\n不要讲成：HRV 高=已治愈；漂浮方舟能量校准迷走。\n可以讲：我们看的是身体还能不能从动员切回休息；HRV 是研究里常用的窗口，不是诊断。",
    examples: ["对客：弹性=能紧张也能松开；不是永远软，也不是永远绷"],
  }),
  com({
    id: "KP-WEB-013",
    loc: "Flux 2022 Frontiers in Neuroscience",
    title: "文献：Floatation-REST 急性心血管——交感唤醒下降、平衡偏向副交感",
    category: "技术知识",
    tags: ["Flux", "Feinstein", "HRV", "血压", "REST"],
    audience: ["学术", "销售团队", "B端客户"],
    usage: "both",
    min: 6,
    scenarios: ["学术汇报", "B端提案", "合规培训"],
    prerequisites: ["KP-WEB-001", "KP-COM-005"],
    summary:
      "Flux, Feinstein 等，Front. Neurosci. 2022;16:995594。90 分钟 Floatation-REST vs 看自然纪录片。血压和呼吸下降，标准化高频 HRV 上升。作者写：降低交感唤醒，自主神经平衡更偏向副交感。这是公开 REST 研究，不是漂浮方舟临床试验。",
    body: "设计：交叉对照；焦虑敏感临床样本 37 + 非焦虑对照 20；90 分钟漂浮 vs 同等时长自然影片；防水设备测心率、HRV、呼吸、血压。NCT03051074。\n主要发现（相对影片）：舒张压、收缩压、呼吸频率下降（p<0.001）；SDNN、低频/极低频 HRV 下降；标准化高频 HRV 上升（p<0.001）。心率仅有下降趋势（p=0.073）。焦虑与非焦虑组模式一致。与状态焦虑下降、平静上升相关的心血管指标主要是血压，不是每一项 HRV。\n作者结论原句级别：Floatation-REST lowers sympathetic arousal and alters the balance of the autonomic nervous system toward a more parasympathetic state.\n怎么用：这是「环境刺激限制 → 自主神经平衡移动」的急性证据，用来支撑「弹性/刹车接手」，不要说「HRV 全面升高」或「已证明修复迷走」。\n限度：单次、实验室漂浮、样本有限；生物标志物在更大综述里仍有异质性（对接 KP-COM-014）。DOI：10.3389/fnins.2022.995594\n对外：有对照研究观察到漂浮时血压下降、副交感相对占比上升；不是本公司产品试验，也不是治疗适应症。",
    examples: [
      "正确：对照条件下交感唤醒下降、平衡偏向副交感",
      "错误：漂浮方舟已验证 HRV 提升 xx%",
    ],
  }),
  com({
    id: "KP-COM-021",
    loc: "机制链：三通道卸载",
    title: "机制链：卸掉重力、温度、声音负担，迷走才有机会接手",
    category: "技术知识",
    tags: ["REST", "减负", "降噪", "迷走神经", "幻灯片"],
    audience: ["B端客户", "销售团队", "学术"],
    usage: "both",
    min: 6,
    scenarios: ["演讲", "B端提案", "学术"],
    prerequisites: ["KP-MECH-004", "KP-MECH-005", "KP-MECH-006", "KP-V7-012"],
    summary:
      "幻灯片中间区的科学链：漂浮不是往身上加恢复，而是先拿掉三件外界功课——抗重力、体温调节、声音扫描。功课少了，交感少空转，迷走才有机会把刹车踩回去。",
    body: "现代 REST 的工作定义（Feinstein 等常用 Reduced Environmental Stimulation）：尽量减弱视、听、触、温度差、本体感觉和抗重力负担，让中枢少为外界做应答。\n三通道（对应常见演示页上的三框，机制用公开语言，数字另走过数字关）：\n1 浮力 / 重力信号：高密度盐水使人不必持续对抗 1G。姿势肌少做功 → 本体感觉和交感动员下降。这是「减负」。\n2 近皮肤温度的恒温水：减少冷热调节带来的血管和交感波动。皮肤不再当警报器。\n3 低声低光：听觉视觉少触发定向反射，大脑少做威胁扫描。这是「降噪」。\n三者同时成立，才接近「中枢暂时不必应对外界」。此时资源才可能从战斗/逃跑转到循环、消化、睡眠——即 KP-MECH-006 的交感→副交感切换。\n弹性在这里的意思：不是把神经剪断，而是给刹车一个没有警报的窗口，让它重新练习接手。一次窗口≠弹性已永久恢复；重复加上睡眠、不过度加码运动，才谈得上能力。\n数字红线：页上「~90% 重力信号屏蔽」「<30 dB」属设计/材料口径，未锁定前不讲成实测迷走修复率。水温对外跟 SOP 36±0.5℃（KP-TRN-070）。禁止「彻底卸载与重置」当已验证生理事实。\n可以讲：先把三件外界功课卸掉，神经系统才有机会从应答档回到修复档。",
    examples: ["中间句：不是加恢复，是卸负担，让刹车重新咬住"],
  }),
  com({
    id: "KP-COM-022",
    loc: "内感受：弹性的主观面",
    title: "内感受：外界安静后，心跳可以被读成安全而不是警报",
    category: "技术知识",
    tags: ["内感受", "Feinstein", "焦虑敏感", "迷走"],
    audience: ["学术", "培训师", "销售团队"],
    usage: "both",
    min: 5,
    scenarios: ["演讲", "培训", "学术"],
    prerequisites: ["KP-WEB-001", "KP-COM-019"],
    summary:
      "弹性不只是心率数字。外界刺激降下来后，人更容易觉察心跳呼吸，且这些信号不一定再被标成危险。这是自主神经「敢松开」的主观面，不是排毒。",
    body: "Feinstein 等（2018, Biological Psychiatry: Cognitive Neuroscience and Neuroimaging）：高焦虑敏感者在 Floatation-REST 中状态焦虑下降、放松上升，同时对心跳呼吸的觉察增强；血压在会话中下降。这与「一感到心跳就更怕」的日常模式相反。\n机制教学：交感空转时，内感受=警报。环境足够安全、低刺激、可预测（KP-V7-012）时，同样的心跳可以连到「我在休息」。刹车要接手，大脑得先允许身体信号不是威胁。\n文献纪律：2018 PLOS ONE 那篇是开放标签（KP-WEB-001），不要升格成 RCT。内感受改变≠治疗惊恐。舱内心跳变大声按红旗纪律，不解释排毒（KP-TRN-075）。\n不要讲成：漂浮方舟纠正了脑内身体地图；能量体被校准。\n可以讲：外界安静以后，人会更听见自己；这常常是切档的开始，不舒服就出舱。",
    examples: ["对客：安静时听见心跳，多半是信号被听见了，不等于发病"],
  }),
  companyPitch({
    id: "KP-CRAFT-026",
    loc: "幻灯片中间区 · 漂浮方舟",
    title: "幻灯片中间：漂浮方舟如何给迷走神经重新练习弹性",
    category: "培训资料",
    tags: ["构想设计", "迷走神经", "幻灯片", "漂浮方舟", "恢复力"],
    audience: ["销售团队", "B端客户", "演讲"],
    min: 6,
    scenarios: ["演讲", "B端提案", "客户演示"],
    prerequisites: ["KP-COM-019", "KP-COM-021", "KP-WEB-013"],
    summary:
      "这一页中间不要写「让人恢复」。写：漂浮方舟用中性浮力场把外界功课卸掉，让自主神经——尤其是迷走神经——有机会恢复原来的切换弹性。下面三框是条件，不是疗效数字。",
    body: "页标题可用：漂浮的科学底层：环境刺激限制 → 自主神经重新获得弹性\n中间主句（选一句上屏）：\n「我们不是把恢复灌进身体，而是拿掉外界负担，让迷走神经这条刹车重新咬得住。」\n三框与主句的关系（只讲设计逻辑）：\n· 浮力场：减少抗重力与姿势维持，交感少为空转的肌肉买单。\n· 近体温恒温：皮肤不再因冷热差持续报警。执行水温以 SOP 为准。\n· 低声环境：减少定向反射与威胁扫描。\n底下收口改为：通过限制环境刺激，降低交感空转，给副交感/迷走一个接手窗口——恢复的是切换能力，不是一次性「被恢复」。\n方舟相对传统 REST：主通路仍是减负+降噪（KP-COM-018）。氢、光、共振、AI 是可选增强，不替代这条主链，也不要讲成已验证的迷走疗法。\n证据怎么垫：公开侧用 Flux 2022「交感唤醒下降、平衡偏向副交感」+ 2025 综述的疼痛/压力/焦虑信号（KP-COM-014）。公司侧只说「我们按这条机制做环境」，不说「方舟 RCT 已修复迷走弹性」。\n禁止：彻底卸载/重置；90% 屏蔽率=迷走修复率；颂钵/频率=临床 VNS；一次疗程恢复原厂弹性。\n邀请：体验一次窗口；规律重复才谈得上弹性，不承诺疗程疗效。\n示意图（透明底 SVG，深色页可直接叠）：完整版 /diagrams/ans-handover-window.svg ；插在三框与底栏之间用 /diagrams/ans-handover-window-middle.svg 。",
    examples: [
      "上屏中间：不是让人恢复，是让刹车恢复弹性",
      "口播：油门踩了能松开，这才是迷走还活着",
      "示意图：/diagrams/ans-handover-window-middle.svg",
    ],
  }),
  trn({
    id: "KP-TRN-102",
    loc: "内训：弹性口径",
    title: "怎么讲迷走弹性：三句能说，五句不能说",
    category: "培训资料",
    tags: ["迷走神经", "话术", "红线", "恢复力", "内训"],
    audience: ["漂浮师", "培训师", "销售团队"],
    min: 6,
    prerequisites: ["KP-COM-019", "KP-CRAFT-026", "KP-TRN-005"],
    summary:
      "学习目标：用「弹性/切换」代替「让人恢复/彻底重置」；能把漂浮方舟讲成给迷走练习接手的环境，而不是神经科治疗。",
    body: "对客三句：\n1 「平时油门容易一直踩着；漂浮是把外界功课卸掉，让刹车有机会接上。」\n2 「我们说的恢复力，就是自主神经还能不能自己切回休息档——迷走神经还弹不弹。」\n3 「当场松是窗口；弹性要靠重复的窗口，加上睡眠，不靠一次神奇重置。」\n禁止五句：\n1 彻底卸载、彻底重置、修复迷走、激活迷走抗炎通路已验证\n2 漂浮方舟治疗焦虑/自主神经紊乱\n3 本公司 HRV 提升 xx%、洛桑 +45% 安到迷走修复\n4 90% 重力屏蔽=神经已休息 90%\n5 劝停药、停跑、替代医生\n考核：把「实现神经系统的彻底卸载与重置」改成合规中句。\n标准改写：限制环境刺激，降低交感空转，给迷走神经一个接手的窗口。\n对接 KP-COM-006、KP-TRN-069、KP-WEB-013。",
    examples: [
      "错：方舟能让迷走神经恢复原厂设置",
      "对：方舟先卸外界负担，让迷走有机会重新练习松开",
    ],
  }),
  trn({
    id: "KP-TRN-103",
    loc: "内训：和跑步对照",
    title: "方舟与跑步：一个给刹车练弹性，一个先把油门用完",
    category: "培训资料",
    tags: ["对照", "跑步", "迷走", "弹性", "内训"],
    audience: ["漂浮师", "培训师"],
    min: 5,
    prerequisites: ["KP-TRN-101", "KP-COM-019"],
    summary:
      "学习目标：客户说「我跑步就能恢复」时，能区分两条路——跑步是放电后等反弹；方舟是降低外界负荷，直接给刹车练习接手。不贬低跑步。",
    body: "对照（仅内训）：\n跑步：交感有出口，停下来后副交感反弹。爽在跑完。失败=越跑越睡不着，刹车在安静时仍接不上。\n漂浮方舟：几乎不要求再动员，先拿掉重力、噪声、温度差这些外界功课，让迷走在低警报环境里接手。窗口在舱内就开始，不靠力竭。\n共同目标：都是为了切换能力。一个从油门用完切回来，一个从外界安静切回去。\n对客：跑负责把劲用掉；若用完仍切不回休息，再考虑一次低刺激窗口。禁止「再跑迷走更坏，必须来漂」。\n对接 KP-TRN-095~101。若客户已运动依赖，先问睡眠，不推销疗程。\n考核：用一句话说清方舟作用在弹性而不是在「让人累完」。",
    examples: ["一句话：跑步把油门踩完；方舟让刹车在安静里重新变软、变活"],
  }),
];

const dataDir = path.join(process.cwd(), "data");
const kpPath = path.join(dataDir, "knowledge-points.json");
const sourcesPath = path.join(dataDir, "sources.json");

const existing = JSON.parse(readFileSync(kpPath, "utf-8"));
if (existing.some((p) => p.id === "KP-COM-019")) {
  console.log("迷走弹性补强已入库，跳过。总数:", existing.length);
  process.exit(0);
}

const ids = new Set(existing.map((p) => p.id));
const dup = points.filter((p) => ids.has(p.id));
if (dup.length) {
  console.error("ID 冲突:", dup.map((p) => p.id).join(","));
  process.exit(1);
}

const merged = [...existing, ...points];
writeFileSync(kpPath, JSON.stringify(merged, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8")).filter((s) => s.id !== sourceId);
sources.push({
  id: sourceId,
  filename: sourceFile,
  fileType: "md",
  uploadedAt: now,
  knowledgePointIds: points.map((p) => p.id),
  status: "done",
  splitMode: "claude-agent",
  note: "迷走/自主神经弹性：COM-019~022 + WEB-013 + CRAFT-026 幻灯片口径 + TRN-102~103。恢复力≠让人恢复。",
});
writeFileSync(sourcesPath, JSON.stringify(sources, null, 2) + "\n");

console.log(
  JSON.stringify(
    {
      imported: points.length,
      ids: points.map((p) => p.id),
      total: merged.length,
    },
    null,
    2
  )
);
