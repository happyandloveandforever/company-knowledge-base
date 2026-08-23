/**
 * Claude 精细拆分：项目核心实验方案.docx
 * 「渡忘星舟」运动性疲劳预警/防治/快速恢复申报向方案。
 * 含设计指标与 N=5 预实验表，一律标构想/申报口径，不作已完成国家队 RCT。
 * 运行：node scripts/import-core-exp.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = new Date().toISOString();
const sourceFile = "项目核心实验方案.docx";
const sourceId = "SRC-CORE-EXP";

const points = [
  {
    id: "KP-EXP-001",
    title: "实验方案总览：运动疲劳预警与快速恢复",
    category: "战略规划",
    tags: ["星舟", "实验方案", "申报", "构想设计"],
    audience: ["学术", "运动队", "政府汇报"],
    summary:
      "方案名：运动性疲劳的早期预警、防治及快速恢复关键技术研究与应用。基于渡忘星舟原子逻辑，做生化稳态与能级对流的闭环管理。属申报设计，不是已结题报告。",
    body: "目标：对基础代谢、自主神经、细胞能量利用率做实时干预，精准治理运动疲劳\n方法骨架：监测（HRV/呼吸熵/生化）→ 预防（光频、呼吸）→ 恢复（液态方舟卸载 + 氢氧）→ 复测\n术语来源：渡忘星舟原子库转写为申报语境\n对外：可以说「我们在把恢复做成可监测的科研方案」\n禁止：说成国家体育总局已立项通过或已完成大规模临床",
    location: "文首总述",
    durationMin: 3,
    scenarios: ["学术汇报", "运动提案", "政府汇报"],
  },
  {
    id: "KP-EXP-002",
    title: "入组：能级分层取代单一疲劳问卷",
    category: "技术知识",
    tags: ["入组", "HRV", "能级", "实验方案"],
    audience: ["学术", "运动队"],
    summary:
      "拟筛国家队高负荷运动员。入组看 HRV 持续下滑、慢性疲劳指征、表现提升需求；排除氢氧过敏与急性损伤不宜进零重力液态方舟者。",
    body: "入组（方案）：\n- 耗散态初期：HRV 持续下滑\n- 有慢性疲劳综合征临床指征、基础代谢受阻\n- 有运动表现提升需求与代谢瓶颈\n排除：\n- 氢氧雾化过敏\n- 急性运动损伤修复期，不宜液态方舟零重力环境\n宣讲转译：恢复方案开始前先分层，不靠一张问卷定生死\n合规：慢性疲劳综合征是临床概念，对外对商业客户不要当诊断工具推销",
    location: "受试者筛选",
    durationMin: 3,
    scenarios: ["学术汇报", "运动提案"],
  },
  {
    id: "KP-EXP-003",
    title: "监测三模态：HRV、呼吸熵、生化能级",
    category: "技术知识",
    tags: ["HRV", "呼吸熵", "预警", "实验方案"],
    audience: ["学术", "技术团队", "运动队"],
    summary:
      "方案要建感知-响应网：HRV 的 LF/HF 标应激预警；呼吸熵看肺泡交换/线粒体效率；血氧与血氢波动做多维疲劳模型。",
    body: "1 HRV：实时 LF/HF，进入应激能量预警区间则标记疲劳阈值\n2 气体代谢呼吸熵：偏离基准 → 判线粒体氧化磷酸化效率下降（方案定义）\n3 生化能级：血氧饱和度 + 血氢浓度波动\n专家注：申报时需补具体设备型号与星舟系统接口协议\n对外浅讲：恢复可以测，不只是「感觉好了」",
    location: "监测模态",
    durationMin: 4,
    scenarios: ["学术汇报", "技术讲解"],
  },
  {
    id: "KP-EXP-004",
    title: "双轨干预：光频呼吸预防 + 方舟氢氧恢复",
    category: "产品知识",
    tags: ["液态方舟", "氢氧", "红光", "构想设计"],
    audience: ["学术", "运动队", "销售团队"],
    summary:
      "预防：660nm 红光脉冲、4-7-8 呼吸。恢复：液态方舟浮力卸载 + 1.6ppm+ 饱和氢，并辅助 66.6%:33.3% 氢氧雾化。属方案参数，须与真实设备能力核对。",
    body: "预防：\n- 光频：检到 ATP 缺口时 660nm 红光，材料称激活线粒体 CCO，防疲劳深积\n- 呼吸：4-7-8 节律，提升电子传递链效率（方案表述）\n恢复：\n- 重力屏蔽：液态方舟，浮力抵消重力，卸载神经负荷\n- 高压氢氧：零重力下 1.6ppm+ 饱和氢；雾化氢氧比 66.6%:33.3%\n对接冠军/消杀：方舟是已有产品；红光与氢氧比例是方案设计，未写入产品手册前不要当标配卖点\n红线：自由基清除、ATP、CCO 不要说成已批准药物机制",
    location: "干预手段",
    durationMin: 4,
    scenarios: ["学术汇报", "运动提案", "产品培训"],
  },
  {
    id: "KP-EXP-005",
    title: "时间表：T0基准、T1六十分钟、T2复测",
    category: "运营管理",
    tags: ["SOP", "实验设计", "闭环"],
    audience: ["学术", "运动队", "技术团队"],
    summary:
      "T0：训练后 30 分钟建能级初值。T1：每 30 秒生理闭环 + 60 分钟液态方舟。T2：结束后 1h、12h 看回升速率。",
    body: "T0 基准：标准训练后 30min，测生理/临床参数\nT1 干预：30 秒一次参数闭环，动态调光频与呼吸熵；60min 持续液态方舟卸载\nT2 恢复：干预后 1h、12h 二次评估，看「能级对流」回升\n可转化的门店/基地 SOP：训练后尽早进舱、结束做复测，而不是只做单次体验",
    location: "数据采集周期",
    durationMin: 3,
    scenarios: ["学术汇报", "运营培训"],
  },
  {
    id: "KP-EXP-006",
    title: "成功标准：预警提前与12小时回弹",
    category: "技术知识",
    tags: ["KPI", "ATP", "HRV", "构想设计"],
    audience: ["学术", "管理者", "运动队"],
    summary:
      "方案成功线：疲劳预判提前量较对照提升 30%+、漏报<5%；12h 内 ATP 生成效率（推算）回基准 95%+；外周阻力降、副交感占优。均为申报目标，不是已测到的大样本结果。",
    body: "预警：预判提前量 +30% 以上，漏报率 <5%\n能量：12h 内 ATP 生成效率（代谢指标推算）≥ 基准 95%\n物理：外周阻力显著下降，交感 → 副交感\n专家注：申报时补氢氧机、红光仪的行业标准或自研专利名\n对外：用「我们按这些指标设计验证」；不用「已经做到漏报 5%」",
    location: "成功判定",
    durationMin: 3,
    scenarios: ["学术汇报", "政府汇报"],
  },
  {
    id: "KP-EXP-007",
    title: "申报问题：监测破碎、修复滞后、闭环缺失",
    category: "战略规划",
    tags: ["申报书", "科学问题", "星舟"],
    audience: ["学术", "政府汇报", "投资人"],
    summary:
      "拟解决问题：疲劳评价维度破碎；物理干预渗透效率不足；监测到干预缺少闭环算法。对应 M6 数字营养、M5 光频、M2 氢氧模块语言。",
    body: "问题 1 监测：问卷或单一血清指标，缺实时能级模型；要融合 HRV 与气体交换，捕捉耗散态→坍塌态阈值\n问题 2 修复滞后：宏观理疗多；要提高光频/气流对神经生化环境的渗透，缩短恢复周期\n问题 3 闭环缺失：用数字营养逻辑匹配生物节律，从物理介入走向生化稳态构建\n宣讲：把「恢复」升级成可申报的科技攻关题，而不是 SPA 项目申请书",
    location: "拟解决的主要问题 1.3",
    durationMin: 4,
    scenarios: ["政府汇报", "学术汇报", "投资人"],
  },
  {
    id: "KP-EXP-008",
    title: "三维度研究：预警传感、协同修复、SOP示范",
    category: "战略规划",
    tags: ["申报书", "M5", "M2", "M6"],
    audience: ["学术", "政府汇报"],
    summary:
      "基础：多参数疲劳预警。共性技术：10Hz Alpha/红光 + 氢-氧-重力屏蔽复合场。应用：监测-评估-干预-复测 SOP，服务国家队快速恢复。",
    body: "维度 A 预警传感：HRV、呼吸熵、血氧、皮温 → 能级阈值预警（M6）\n维度 B 协同修复：\n- M5 光频：10Hz Alpha + 红光脉冲，材料称优化放电、提升突触血清素/多巴胺（构想机制）\n- M2 氢氧：1.6ppm+ 饱和氢，氢-氧-重力屏蔽复合场，清自由基、修呼吸链（构想机制）\n维度 C 落地：实验室疲劳消解系数 → 临床处方 SOP，对齐运动损伤防治与体能优化导向\n匹配句：把看不见的化学平衡做成看得见的物理干预，走非药物抗疲劳",
    location: "主要研究 2.1",
    durationMin: 5,
    scenarios: ["政府汇报", "学术汇报"],
  },
  {
    id: "KP-EXP-009",
    title: "N=5预实验表：必须标小样本申报口径",
    category: "合规与风控",
    tags: ["预实验", "8-OHdG", "MDA", "口径"],
    audience: ["学术", "管理者", "销售团队"],
    summary:
      "文中 5 名国家级耐力运动员 14 天闭环测试表：8-OHdG 12.4→7.2、MDA 6.8→4.1、HRV 48.2→69.5、LOC 52→88。仅作申报前期基础话术，不得当大规模 RCT。",
    body: "设计：N=5，14 天，氢能生化干预 + 重力屏蔽\n材料表：\n| 指标 | 疲劳态 | 恢复态 | P |\n| 8-OHdG | 12.4±1.2 | 7.2±0.8 | <0.01 |\n| MDA | 6.8±0.5 | 4.1±0.4 | <0.01 |\n| HRV ms | 48.2±3.5 | 69.5±4.2 | <0.05 |\n| LOC 能级 | 52 | 88 | — |\n解读口径（原文）：8-OHdG 降 41.9%，MDA 降 39.7%；对应氢中和/DNA 修复叙事\n红线：\n× 国家队已证明\n× 玄学气感已科学减龄（原文有此句，对外删除）\n× 用 N=5 外推免疫重塑与职业合同变现\n可用：这是方案里的预实验叙事，正式对外前要有可追溯原始记录",
    location: "前期工作基础·数据表",
    durationMin: 5,
    scenarios: ["合规培训", "学术汇报", "政府汇报"],
  },
  {
    id: "KP-EXP-010",
    title: "与消杀PPT、REST文献的对接与分层",
    category: "培训资料",
    tags: ["对接", "星舟", "消杀", "宣讲结构"],
    audience: ["销售团队", "学术", "管理者"],
    summary:
      "三层一起用：REST/消杀讲已能交付的舱与卫生；实验方案讲要验证的监测与氢氧光频；论文原子提供独立文献。不要把申报指标说成产品规格。",
    body: "已交付层（可卖）：漂浮方舟系统、物理/绿色消杀、SOP、冠军系列\n设计层（可讲方向）：液态方舟+氢氧+红光+数字闭环的星舟实验方案\n文献层（可引用）：KP-MEV 原子，带作者年份\n冲突提醒：消杀 PPT 乳酸加速 vs MEV-021 乳酸未加速 — 实验方案不要再写第三套乳酸结论\n一句话：舱已经在；闭环实验是把舱升级成可申报的科技体系",
    location: "知识库合成",
    durationMin: 3,
    scenarios: ["销售培训", "学术汇报"],
  },
];

const knowledgePoints = points.map((p) => ({
  id: p.id,
  title: p.title,
  category: p.category,
  tags: p.tags,
  audience: p.audience,
  prerequisites: [],
  summary: p.summary,
  body: p.body,
  examples: p.examples || [],
  source: {
    file: sourceFile,
    location: p.location,
    date: "2026",
    author: "渡忘星舟 / 项目核心实验方案",
  },
  scenarios: p.scenarios || ["学术汇报", "运动提案"],
  durationMin: p.durationMin,
  version: "1.0",
  status: "draft",
  createdAt: now,
  updatedAt: now,
  conflictNote: "申报/构想方案与小样本预实验表，非已结题国家队RCT。",
}));

const dataDir = path.join(process.cwd(), "data");
const kpPath = path.join(dataDir, "knowledge-points.json");
const sourcesPath = path.join(dataDir, "sources.json");
const existing = JSON.parse(readFileSync(kpPath, "utf-8"));
if (existing.some((p) => p.id === "KP-EXP-001")) {
  console.log("实验方案已存在，跳过。总数:", existing.length);
  process.exit(0);
}
const merged = [...existing, ...knowledgePoints];
writeFileSync(kpPath, JSON.stringify(merged, null, 2) + "\n");
const sources = JSON.parse(readFileSync(sourcesPath, "utf-8")).filter((s) => s.id !== sourceId);
sources.push({
  id: sourceId,
  filename: sourceFile,
  fileType: "docx",
  uploadedAt: now,
  knowledgePointIds: knowledgePoints.map((p) => p.id),
  status: "done",
  splitMode: "claude-agent",
  note: `${knowledgePoints.length}条。N=5预实验与氢氧/光频参数标为申报口径。`,
});
writeFileSync(sourcesPath, JSON.stringify(sources, null, 2) + "\n");
console.log(`Imported ${knowledgePoints.length} from ${sourceFile}`);
console.log(`Total: ${merged.length}`);
