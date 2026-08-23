/**
 * 网上高价值通识卡（2026-08-23）
 * 纠正库内误标、补国际卫生标准与政策语言。非本公司试验。
 * 运行：node scripts/import-web-enrich.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = new Date().toISOString();
const sourceFile = "公开文献与标准摘录（Web 2026-08-23）";
const sourceId = "SRC-WEB-ENRICH";

const points = [
  {
    id: "KP-WEB-001",
    title: "纠偏：Feinstein 2018 是开放标签试验，不是RCT",
    category: "合规与风控",
    tags: ["Feinstein", "PLOS ONE", "文献纠偏", "焦虑"],
    audience: ["学术", "销售团队", "管理者"],
    summary:
      "Feinstein et al., PLoS ONE 2018;13(2):e0190292。单次约1小时 Floatation-REST，50名焦虑/应激障碍患者（多数共病抑郁）。状态焦虑效应量估计 Cohen’s d>2。开放标签、非随机，作者要求更大对照试验复核。",
    body: "正确标签：开放标签试验（open-label），ClinicalTrials.gov NCT03051074\n不是：随机对照试验 RCT（库内 MEV-001 标题曾写成 RCT，对外请改口）\n样本：50 名临床焦虑/应激相关障碍，46 名共病单相抑郁；另有 30 名非焦虑参照\n主终点：Spielberger 状态焦虑量表，漂浮前后变化\n结果：状态焦虑大幅下降（估计 d>2）；压力、肌紧张、疼痛、抑郁与负性情绪下降；平静、放松、幸福与总体幸福感上升（文中 p<.0001）\n安全：单次耐受良好，无重大安全问题\n作者自己的限度：需在更大对照试验中重复\nDOI：10.1371/journal.pone.0190292\n对外句：有开放标签研究观察到单次漂浮后状态焦虑显著下降；这不是已批准的精神科治疗。",
    location: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0190292",
    durationMin: 4,
    scenarios: ["学术汇报", "合规培训", "销售培训"],
  },
  {
    id: "KP-WEB-002",
    title: "2024年PLOS ONE：六次漂浮的安全性与可行性RCT",
    category: "技术知识",
    tags: ["Garland", "RCT", "可行性", "安全"],
    audience: ["学术", "销售团队", "B端客户"],
    summary:
      "Garland, Feinstein 等，PLoS ONE 2024;19(6):e0286899。75名焦虑抑郁者随机分到池漂、灵活池漂或零重力椅对照，各约6次。池漂依从85%/89%，无严重不良事件。功效仍需更大RCT。",
    body: "设计：单盲安全/可行性；pool-REST 每周1小时 ×6；pool-REST preferred 时长频率可灵活；chair-REST 零重力椅对照\n入组：筛 1715，随机 75\n依从：pool-REST 85%（均 5.1 次）；preferred 89%（5.3）；椅 74%（4.4）\n时长：固定池约 53 分钟；灵活池约 75 分钟；椅约 58 分钟\n安全：无与干预相关的严重不良事件；正性体验多于负性\n结论边界：证明「能做完、较安全、体验以正向为主」，不是证明治愈焦虑抑郁\nDOI：10.1371/journal.pone.0286899\n对外：比 2018 更进一步的是「重复使用可行」；功效仍要等更大试验。",
    location: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0286899",
    durationMin: 4,
    scenarios: ["学术汇报", "B端提案", "销售培训"],
  },
  {
    id: "KP-WEB-003",
    title: "Choquette 2023：住院厌食身体意象RCT的准确口径",
    category: "技术知识",
    tags: ["Lancet", "eClinicalMedicine", "身体意象", "RCT"],
    audience: ["学术", "销售团队"],
    summary:
      "Choquette 等，eClinicalMedicine 2023。住院神经性厌食女性，2:1 随机，8次×60分钟漂浮+常规护理 vs 仅常规护理。会后状态焦虑 d≈1.52；6个月身体不满意仍较低。单中心、样本有限。不作产品适应症。",
    body: "出处：The Lancet 子刊 eClinicalMedicine，DOI 10.1016/j.eclinm.2023.102173；NCT03610451\n设计：平行组 RCT；Tulsa 住院 AN；随机 68（45 漂浮 / 23 常规）\n干预：4周内每周两次、共8次、每次60分钟，叠加常规住院治疗\n会后：身体不满意即时下降；状态焦虑大幅下降（文献报告约 Cohen’s d=1.52 量级）\n6个月：漂浮组身体不满意仍低于基线（文献 d=0.53 量级）；对照组随访无同等改善\n限度：单中心住院样本，作者写明推广性有限\n红线：禁止说「漂浮方舟治疗厌食症」。可用：顶刊级研究说明 REST 对身体意象与状态焦虑有被认真研究过的信号。",
    location: "https://www.thelancet.com/journals/eclinm/article/PIIS2589-5370(23)00350-4/fulltext",
    durationMin: 4,
    scenarios: ["学术汇报", "合规培训"],
  },
  {
    id: "KP-WEB-004",
    title: "国际漂浮舱卫生：氯溴不推荐，UV/臭氧是主流",
    category: "合规与风控",
    tags: ["NSF50", "NAFTS", "消杀", "氯"],
    audience: ["工程实施", "采购", "销售团队", "运动队"],
    summary:
      "北美浮舱标准与 NSF/ANSI/CAN 50：公共卫生浮舱应以紫外、臭氧或二者组合为主；氯/溴因高镁溶液测不准且未按浮舱注册，普遍不推荐。设备认证要求用户间清洁循环达到约 3-log 灭菌。",
    body: "North American Float Tank Standard / Floatation Tank Association：\n- 卫生策略：UV、臭氧，或组合；过氧化氢可作氧化剂协助澄清\n- 不推荐氯、溴：多数试纸在高浓度硫酸镁里测不准；且氯溴未按浮舱用途完成相应注册说明\nNSF/ANSI/CAN 50：认证消杀系统须在制造商规定的用户间清洁循环后，对主舱细菌达到约 3-log（99.9%）灭活\nNACCHO 2023 实务：臭氧在舱液中不宜超过约 0.1 ppm；UV 要有校准传感器；用户之间至少约 3 次容积翻转；开业前 1 次、收工后 4 次翻转量级\n硫酸镁应用 USP 级\n对接消杀PPT：绿色/物理消杀与国际主流一致；不要用「氯会致癌」恐吓，改用「行业标准本来就不推荐氯溴」",
    location: "NACCHO 2023; NSF/ANSI/CAN 50; North American Float Tank Standard",
    durationMin: 5,
    scenarios: ["采购尽调", "工程对接", "运动提案", "合规培训"],
  },
  {
    id: "KP-WEB-005",
    title: "透皮补镁证据不足：消杀话术不要写成输液",
    category: "合规与风控",
    tags: ["镁", "透皮", "文献", "消杀"],
    audience: ["销售团队", "学术", "运动队"],
    summary:
      "Gröber 等 2017《Nutrients》综述认为：把透皮镁说成优于口服、能快速补满细胞镁，科学依据不足。皮肤局部舒适可以讲，不要讲成体外生化透析。",
    body: "文献：Gröber U, Werner T, Vormann J, Kisters K. Myth or Reality—Transdermal Magnesium? Nutrients. 2017;9(8):813.\n结论大意：口服补镁证据充分；喷雾/盐浴「几乎100%吸收、优于口服」的营销缺乏可靠支持\n常被引用的 Epsom 盐浴升血镁研究：未正式同行评议发表，质量受质疑\n对外升级：\n- 可讲：高镁溶液提供浮力与皮肤接触环境；物理消杀减少化学刺激\n- 不可讲：矿物像生物导弹直达肌纤维、离子渗透已测到 1.80 mg/cm²/h（除非有可追溯实验）\n专业加分句：恢复的主通路是 REST 与卸载，不是把漂浮液当成输液",
    location: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5579607/",
    durationMin: 4,
    scenarios: ["销售培训", "合规培训", "学术汇报"],
  },
  {
    id: "KP-WEB-006",
    title: "乳酸文献不一致：对外只讲「主观恢复更稳」",
    category: "合规与风控",
    tags: ["乳酸", "Driller", "冲突", "运动"],
    audience: ["销售团队", "运动队", "学术"],
    summary:
      "消杀PPT称乳酸清除快50–90%；Driller 等运动研究更常报告主观恢复改善，血乳酸加速并不稳定。对外锁定主观恢复+神经降噪，乳酸当开放问题。",
    body: "库内冲突：KP-SAN-003 vs KP-MEV-021\n处理：同一份教练PPT只保留一句——漂浮后主观疲劳/恢复感受常改善；血乳酸是否更快，研究并不一致\nMorgan 2013（偏心运动后 REST）可作「有人观察到恢复指标变化」的一条，不升格为全行业定律\n与 2024 可行性RCT一致的精神：先讲安全、可完成、体验正向，再讲代谢数字",
    location: "知识库冲突仲裁（对照公开运动文献）",
    durationMin: 3,
    scenarios: ["销售培训", "运动提案", "合规培训"],
  },
  {
    id: "KP-WEB-007",
    title: "REST操作定义：尽量关掉九条感觉通道",
    category: "技术知识",
    tags: ["REST", "通识框架", "Feinstein"],
    audience: ["学术", "销售团队", "B端客户"],
    summary:
      "Feinstein 2018 对 Floatation-REST 的操作定义：仰卧于饱和泻盐溶液，尽量减小视听嗅味温触前庭重力本体感觉输入，并减少运动与言语。",
    body: "定义来源：PLoS ONE 2018 方法学表述\n校准目标：视觉、听觉、嗅觉、味觉、温度、触觉、前庭、重力、本体感觉九类信号尽量降低\n同时减少：大部分运动与说话\n宣讲：漂浮不是泡澡，是把神经系统的外部账单临时关掉\n不要说：我们发明了 REST",
    location: "Feinstein 2018 Methods",
    durationMin: 3,
    scenarios: ["演讲", "销售培训", "学术汇报"],
  },
  {
    id: "KP-WEB-008",
    title: "政策语言：从以治病为中心转向以健康为中心",
    category: "战略规划",
    tags: ["健康中国", "主动健康", "政策"],
    audience: ["政府汇报", "B端客户", "销售团队"],
    summary:
      "国家卫生健康委等2024年全民健康素养提升三年行动：推动卫生健康工作从以治病为中心向以健康为中心转变。公民是自己健康的第一责任人（基本医疗卫生与健康促进法）。",
    body: "可引用：\n- 《全民健康素养提升三年行动方案（2024—2027年）》（国卫办宣传发〔2024〕13号）：从治病中心转向健康中心\n- 2023年居民健康素养水平监测约 29.70%（文件披露）\n- 《基本医疗卫生与健康促进法》：公民是自己健康的第一责任人\n- 《健康中国行动（2019—2030年）》：主动学习健康知识、养成健康生活方式\n对接我们：非药物、可体验、可运营的深度恢复，是主动健康的一种服务形态\n禁止：把漂浮写成国家基本公卫项目或已纳入医保",
    location: "https://www.gov.cn/zhengce/zhengceku/202406/content_6955867.htm",
    durationMin: 3,
    scenarios: ["政府汇报", "B端提案", "演讲"],
  },
  {
    id: "KP-WEB-009",
    title: "主动健康六支柱：心理与睡眠是官方议事日程",
    category: "战略规划",
    tags: ["主动健康", "睡眠", "心理", "十五五"],
    audience: ["政府汇报", "投资人", "B端客户"],
    summary:
      "中国工程院刊综述将主动健康概括为全人群、全周期、全要素；六支柱含膳食、运动、心理、睡眠、居住环境与健康管理。心理与睡眠正是漂浮最能对话的两柱。",
    body: "来源：我国主动健康发展现状、挑战及对策研究（中国工程科学相关综述，2025 前后）\n要义：个人主动促进健康；目标少生病、晚生病、生小病\n原则：个人主体、政府引导、社会参与、创新驱动、国际协作\n六支柱：膳食｜运动｜心理｜睡眠｜居住环境｜健康管理\n现状判断：仍偏研发示范，公众参与率偏低\n宣讲：我们不抢医院的治病柱，我们补心理恢复与睡眠管理的可体验入口\n「十五五」语境：主动健康要从示范走向社会实践——产业集团听得懂",
    location: "https://www.engineering.org.cn/sscae/CN/10.15302/J-SSCAE-2025.08.014",
    durationMin: 4,
    scenarios: ["政府汇报", "投资人", "演讲"],
  },
  {
    id: "KP-WEB-010",
    title: "对外证据金字塔：先安全可行，再即时状态，再病种",
    category: "培训资料",
    tags: ["宣讲结构", "证据", "金字塔"],
    audience: ["销售团队", "管理者"],
    summary:
      "塔基：卫生标准+重复使用安全。塔身：即时状态焦虑/放松/主观恢复。塔尖病种RCT只作学术，不进销售菜单。",
    body: "塔基（每次都能讲）：物理/UV/臭氧消杀符合国际浮舱主流；重复漂浮可行性RCT无严重不良事件\n塔身（对产业/酒店/企业）：单次后状态焦虑与主观放松的开放标签与临床观察；运动主观恢复\n塔尖（只对学术/内部）：厌食住院RCT、纤维肌痛等——「研究在追问」，不是「我们在治疗」\n不要把塔尖数字铺在教练或国企第一页",
    location: "知识库合成（基于公开文献）",
    durationMin: 3,
    scenarios: ["销售培训", "合规培训"],
  },
  {
    id: "KP-WEB-011",
    title: "库结构诊断：厚在论文与宣传，薄在经营闭环",
    category: "培训资料",
    tags: ["库结构", "待办", "平衡"],
    audience: ["管理者", "销售团队"],
    summary:
      "入库网上卡之前约458条：论文原子过百、产品技术很厚；FAQ/售后/公司一页纸/统一数字口径仍然薄。下一阶段优先锁数字、补经营卡，而不是再堆同主题画册。",
    body: "体检时点：2026-08-23，WEB卡入库前约458条 approved；本批再加12条 draft（KP-WEB）\n过厚：KP-MEV 文献卡、各版定位/机理重复、杨浦/一龄定制\n过薄：售后维保、耗材周期、真实案例回访、统一报价、工程验收清单\n已补但仍需人审：宣讲结构、失重舱谱系、消杀、星舟实验方案、本批网上卡\n网上已补：Feinstein/Garland 纠偏、NSF卫生、透皮镁限度、健康中国语言、证据金字塔\n你必须本人做的：锁死机构数/专利数/C端数；提供可公开案例；售后制度原文",
    location: "2026-08-23 库体检",
    durationMin: 3,
    scenarios: ["战略研讨", "管理决策"],
  },
  {
    id: "KP-WEB-012",
    title: "浮舱卫生检查单：国际标准可执行的七项",
    category: "运营管理",
    tags: ["SOP", "NSF", "消杀", "检查单"],
    audience: ["门店运营", "工程实施", "采购"],
    summary:
      "把北美实务压成七项：UV或臭氧在线、用户间约三倍容积循环、臭氧残留受限、USP镁盐、检测假单胞菌、淋浴更衣日消毒、防生物膜。",
    body: "1 主消杀是 UV 和/或臭氧，而不是把泳池氯方案照搬进饱和镁溶液\n2 每位客人之间完成制造商规定的过滤+消杀循环（常见要求约 3 次容积翻转）\n3 开业前与收工后按规程多跑循环，避免隔夜死水\n4 舱液臭氧残留与空气臭氧按职业卫生上限管理（常见讨论值约 0.1 ppm 量级，以本地法规与说明书为准）\n5 只用符合药典/约定规格的硫酸镁，不私兑来路不明的盐\n6 定期送检菌落/铜绿假单胞菌（国际建议）\n7 淋浴、更衣、舱沿防生物膜，粪便/呕吐污染则排空并消毒再注液\n这是经营信任，不是营销形容词",
    location: "NACCHO / NAFTS 实务综合",
    durationMin: 4,
    scenarios: ["运营培训", "开业陪跑", "采购尽调"],
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
    date: "2026-08-23",
    author: "公开文献与标准 / 知识库摘录",
  },
  scenarios: p.scenarios || ["销售培训", "学术汇报"],
  durationMin: p.durationMin,
  version: "1.0",
  status: "draft",
  createdAt: now,
  updatedAt: now,
  conflictNote: "公开文献/标准摘录。用于纠偏与补强，不构成本公司临床试验。",
}));

const dataDir = path.join(process.cwd(), "data");
const kpPath = path.join(dataDir, "knowledge-points.json");
const sourcesPath = path.join(dataDir, "sources.json");
const existing = JSON.parse(readFileSync(kpPath, "utf-8"));
if (existing.some((p) => p.id === "KP-WEB-001")) {
  console.log("Web enrich 已存在，跳过。总数:", existing.length);
  process.exit(0);
}
const merged = [...existing, ...knowledgePoints];
writeFileSync(kpPath, JSON.stringify(merged, null, 2) + "\n");
const sources = JSON.parse(readFileSync(sourcesPath, "utf-8")).filter((s) => s.id !== sourceId);
sources.push({
  id: sourceId,
  filename: sourceFile,
  fileType: "other",
  uploadedAt: now,
  knowledgePointIds: knowledgePoints.map((p) => p.id),
  status: "done",
  splitMode: "claude-agent",
  note: `${knowledgePoints.length}条公开文献/标准摘录：Feinstein纠偏、NSF卫生、透皮镁限度、健康中国。`,
});
writeFileSync(sourcesPath, JSON.stringify(sources, null, 2) + "\n");
console.log(`Imported ${knowledgePoints.length}`);
console.log(`Total: ${merged.length}`);
