/**
 * Claude 精细拆分：医学漂浮诊疗方案.ppt
 * 优浮医学漂浮概念、REST三阶段、失眠/抗衰/关节疗程。
 * 大量「可治什么」与 90% 有效率属材料口径，禁止当适应症或 RCT。
 * 运行：node scripts/import-medf-plan.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = new Date().toISOString();
const sourceFile = "医学漂浮诊疗方案.ppt";
const sourceId = "SRC-MEDF-PLAN";

const points = [
  {
    id: "KP-MEDF-001",
    title: "医学漂浮服务：狭义问询检测到广义资源整体",
    category: "产品知识",
    tags: ["优浮", "医学漂浮", "定义"],
    audience: ["B端客户", "销售团队", "学术"],
    summary:
      "UFLO 优浮®。狭义：问询、检测、漂浮、健康教育与身心支持，以及相关食品、保健品、可穿戴、远程咨询。广义：为完成完整服务而组织的有形与无形资源整体。",
    body: "品牌：UFLO 优浮®\n狭义：问询 / 检测 / 漂浮 / 健康教育 / 身心支持 + 食品保健品、可穿戴、远程咨询\n广义：达成完整服务目标的资源系统\n对外：可讲「检测+漂浮+教育」闭环\n独立门店：不要把保健品和远程咨询说成已标配",
    location: "开篇：医学漂浮服务概念",
    durationMin: 3,
    scenarios: ["B端提案", "销售培训"],
  },
  {
    id: "KP-MEDF-002",
    title: "REST实证三阶段：局部症状→心身整合→敏感特质与基因",
    category: "技术知识",
    tags: ["REST", "研究史", "敏感性"],
    audience: ["学术", "销售团队"],
    summary:
      "材料把 REST 研究分成三阶段：局部症状独立研究；心身医学整合（主打自主神经）；整合人格特质与基因（感觉加工敏感性、单胺递质变异）。前两阶段偏现象，第三阶段追病因。",
    body: "第一阶段：躯体局部——慢性疼痛、肌肉关节修复、慢性皮肤病、高血压与心血管、PTSD/焦虑/抑郁/成瘾、睡眠；测量以量表和主观报告为主\n第二阶段：心身整合——漂浮主要影响自主神经，应激相关疾病可作补充医疗；测量加 fMRI、脑电、心电、血压\n第三阶段：高感觉加工敏感性者更易慢性病，与五羟色胺、多巴胺、去甲肾上腺素变异相关；测量加基因\n对外：这是讲义框架，不是本公司完成的三期临床\n对接：REST 操作定义用 KP-WEB-007",
    location: "限制环境刺激疗法研究三阶段",
    durationMin: 4,
    scenarios: ["学术汇报", "销售培训"],
  },
  {
    id: "KP-MEDF-003",
    title: "REST起效：把感觉刺激降到最小，交感降、副交感升",
    category: "技术知识",
    tags: ["REST", "自主神经", "原理"],
    audience: ["学术", "销售团队", "B端客户"],
    summary:
      "在控制时间的前提下，把感官刺激减到最小，中枢应激减弱：交感下降、副交感上升，主观感受为放松。",
    body: "条件：严格控制时间变量\n动作：感觉刺激 → 最小值\n神经：交感活跃度↓ 副交感↑\n主观：放松\n传导链（材料）：刺激→感受器（眼耳鼻舌身）→中枢（脊髓+脑）→周围（躯体神经+内脏神经）→效应器（肌肉+腺体）\n宣讲：与 SOP「六模块」可并存，这张卡讲生理逻辑，SOP 讲服务模块",
    location: "限制环境刺激疗法起效原理",
    durationMin: 3,
    scenarios: ["演讲", "销售培训", "学术汇报"],
  },
  {
    id: "KP-MEDF-004",
    title: "谁需要低刺激：先天高敏感，或后天重大应激",
    category: "技术知识",
    tags: ["敏感性", "应激", "客群"],
    audience: ["销售团队", "学术", "门店运营"],
    summary:
      "两类人：神经系统敏感性高、同样刺激耐受力低、长期应激、更易慢性病；或先天不敏感但重大事件后处于长短不等的应激（材料称应激时长与基因表达相关）。",
    body: "类型A：感知加工敏感性高 → 耐受力低 → 长期应激 → 材料列举焦虑抑郁PTSD强迫失眠、过敏性皮炎、关节炎、肌痛、内分泌、心血管、消化道等\n类型B：先天不敏感 + 后天重大刺激 → 或长或短应激\n对外：可讲「有人天生账单更贵，有人被大事打高了基线」\n禁止：把清单当诊断或「你会得这些病」",
    location: "哪种人需要低刺激环境",
    durationMin: 3,
    scenarios: ["销售培训", "演讲"],
  },
  {
    id: "KP-MEDF-005",
    title: "漂浮液物理叙事：接触、溶解、高密度、热容量、富氢",
    category: "技术知识",
    tags: ["漂浮液", "富氢", "镁", "构想设计"],
    audience: ["学术", "销售团队", "运动队"],
    summary:
      "材料强调液体全接触、可溶矿物质、高密度必致放松、比热约为空气33倍。并写富氢扩血管、消水肿、降末梢兴奋、经皮抗氧化。须与透皮镁证据不足卡对照。",
    body: "物理：密切接触；可溶解添加物；高密度→深度放松；热容量大（材料：比热>1，约空气33倍）持续温热\n化学/氢（材料）：扩局部血管，利慢性炎/水肿/渗出/血肿吸收；软化瘢痕粘连；降末梢兴奋、降肌张力、镇痛解痉；高浓度氢经皮或附着黏膜抗氧化\n红线：对接 KP-WEB-005，透皮补镁/「体外透析」证据不足；氢医学功效不可当已批准适应症\n对外稳妥句：高密度卸载 + 恒温包裹是主通路",
    location: "漂浮液物理治疗的起效原理",
    durationMin: 4,
    scenarios: ["学术汇报", "合规培训", "销售培训"],
  },
  {
    id: "KP-MEDF-006",
    title: "材料诊疗范围：疼痛失眠焦虑之外还写了三高与术后",
    category: "合规与风控",
    tags: ["诊疗范围", "红线", "慢病"],
    audience: ["销售团队", "管理者", "学术"],
    summary:
      "在优浮运营稿三大症状之外，本 PPT 还列入肥胖、三高、痛风、脊柱与心脑血管慢病、术后康复。一律当内部讨论菜单，禁止写成产品适应症。",
    body: "（1）（2）（3）与 KP-YFOP-004 基本同构：疼痛/失眠/焦虑病种清单\n（4）其他慢病及抗衰：肥胖、三高、痛风；脊柱慢病；心脑血管慢病；术后康复\n塔尖纪律：KP-WEB-010。病种 RCT 只进学术，不进销售第一页\n医院合作：医生已诊断后的辅助讨论可以翻这页\nC端/国企：只保留疼痛睡眠焦虑的「辅助改善」表述",
    location: "医学漂浮的常见诊疗范围",
    durationMin: 3,
    scenarios: ["合规培训", "医院合作"],
  },
  {
    id: "KP-MEDF-007",
    title: "失眠方案示例：16周24次，睡眠模块到排毒模块",
    category: "产品知识",
    tags: ["失眠", "疗程", "脑波", "构想设计"],
    audience: ["销售团队", "B端客户", "学术"],
    summary:
      "材料示例：连续4周以上入睡困难或早醒，排除器质性。16周24次。前2周每周2×60分钟睡眠频率模块；3–8周交替睡眠/排毒模块；9–16周每周1次排毒模块。评价用量表、脑波、HRV。",
    body: "入选（材料）：入睡难/易醒/彻夜不眠≥4周；可伴多梦心烦头痛心悸；无妨碍睡眠的器质性病变\n诊断参照：中医内科常见病指南（2008）；ICD-10（1993）；另写漂浮量表、基因检测\n方案：16周24次\n- 1–2周：2次/周 60min，脑波睡眠频率模块+引导音频；目标=重获放松技能；评=心理量表+睡眠脑波\n- 3–8周：2次/周 60min，睡眠模块与排毒模块交替+神经训练音频；目标=植物神经；评=HRV与体征\n- 9–16周：1次/周 60min，排毒模块；目标=巩固，可加心理访谈；评=HRV与体征\n口径：课程设计示例，不是已注册临床路径\n模块名「排毒」对外建议改成「深度恢复/代谢模块」",
    location: "失眠（不寐）漂浮诊疗方案示例",
    durationMin: 5,
    scenarios: ["B端提案", "销售培训"],
  },
  {
    id: "KP-MEDF-008",
    title: "抗衰方案示例：16周32次，前期按摩，后期富氢小分子团",
    category: "产品知识",
    tags: ["抗衰", "激素", "富氢", "构想设计"],
    audience: ["销售团队", "B端客户"],
    summary:
      "材料把衰老写成血糖血压胆固醇、脂肪、皮肤等综合变化。1–4周：按摩10+漂浮45+按摩10，每周2次；5–16周：每周2×60分钟，要求富氢和小分子团液。评价含唾液皮质醇，血液激素须在医疗机构取。",
    body: "目标（材料）：创造荷尔蒙更平衡的身心环境\n1–4周：2次/周；前按摩10min + 漂浮45 + 后按摩10；目标=淋巴点压、降压力激素；评=荷尔蒙量表、唾液/血液激素、身体指标\n5–16周：2次/周 60min，富氢+小分子团液；目标=深放松、垂体/肾上腺/性激素叙事；评同上\n红线：血液激素必须医疗机构；店内唾液检测若做，不作疾病诊断\n禁止：刺激脑垂体、恢复性功能说成保证疗效",
    location: "综合性抗衰漂浮诊疗方案示例",
    durationMin: 4,
    scenarios: ["B端提案", "合规培训"],
  },
  {
    id: "KP-MEDF-009",
    title: "关节方案示例：12周27次，前四周38℃富硒液每周四次",
    category: "产品知识",
    tags: ["关节", "骨关节炎", "38℃", "构想设计"],
    audience: ["销售团队", "运动队", "B端客户"],
    summary:
      "1–4周每周4次、45分钟、富硒功能性液、38℃；5–7周每周2×60分钟并开运动处方；8–12周每周1次，可选线上心理访谈。水温38℃与 SOP 日常36±0.5℃不一致。",
    body: "目标（材料）：延缓发生、抑制发展、缓解疼痛、保功能、可能的病因干预\n1–4周：4次/周 45min，富硒液+理疗功能，38℃；目标=减痛消炎改善循环；评=疼痛量表\n5–7周：2次/周 60min，漂浮后康复运动处方+健康教育；评=疼痛+身体指标\n8–12周：1次/周 60min，可选线上心理访谈（心因性疼痛）\n冲突：SOP 日常验收 36±0.5℃，入舱话术又说38度——对外先锁一个温度口径\n禁止：消除炎症、保护关节说成已完成临床终点",
    location: "关节疼痛、骨关节炎漂浮诊疗方案示例",
    durationMin: 4,
    scenarios: ["运动提案", "B端提案", "合规培训"],
  },
  {
    id: "KP-MEDF-010",
    title: "疗效六因子：基因、离店应激、店环境、液、舱、漂浮师",
    category: "培训资料",
    tags: ["疗效", "漂浮师", "框架"],
    audience: ["销售团队", "门店运营", "学术"],
    summary:
      "材料认为效果不只靠「泡一次」：先天易感性、离店后是否持续受刺激、店内物理与人为压力、功效性漂浮液、舱是否做到刺激最小、漂浮师评估与技术。",
    body: "1 基因/先天易感性 → 评估准不准、方法选得对不对\n2 离店应激：生活里是否还有持续刺激、有无自我干预\n3 店内环境：物理+人为压力\n4 漂浮液功效\n5 漂浮舱：刺激最小化、模式、引导、功能组件\n6 漂浮师：评估准、技术对\n宣讲：效果是系统，不是单次魔法\n运营：把 3/5/6 做成 SOP 检查项，比夸液更可控",
    location: "支持疗效的六个维度",
    durationMin: 3,
    scenarios: ["销售培训", "运营培训"],
  },
  {
    id: "KP-MEDF-011",
    title: "材料声称失眠总有效率90%以上（禁止当RCT）",
    category: "合规与风控",
    tags: ["有效率", "失眠", "红线"],
    audience: ["销售团队", "管理者", "学术"],
    summary:
      "PPT 写失眠方案总有效率>90%，并列出睡眠质量、GWB 等治疗前后 P<0.05。未附样本、对照、注册号。对外不可当作本公司临床试验。",
    body: "原文要点：总有效率90%以上；睡眠质量、负面心理明显变化；PSQI 各因子与总体幸福感总分治疗前后显著（P<0.05）\n缺失：N、对照、是否开放标签、是否本公司数据\n纪律：与 Feinstein/Garland 公开研究分开写。没有原始报告就不要报 90%\n可说：材料用于内部课程设计；对外用开放标签状态焦虑与可行性 RCT（KP-WEB-001/002）",
    location: "失眠方案效果评价",
    durationMin: 3,
    scenarios: ["合规培训", "销售培训"],
  },
  {
    id: "KP-MEDF-012",
    title: "抗衰评价页的氢医学与性激素话术须降级",
    category: "合规与风控",
    tags: ["氢", "皮质醇", "性激素", "红线"],
    audience: ["销售团队", "学术"],
    summary:
      "材料把氢分子写成明确医学功效，并把漂浮写成根本改善压力荷尔蒙、较大程度恢复性激素与性功能。只能作内部讲义，不能作广告承诺。",
    body: "材料三句：氢抗氧化抗炎、修 T 细胞、维护线粒体；漂浮恢复皮质醇/肾上腺素（称运动医学文献充分）；长期压力抽走生殖激素，漂浮后较大程度恢复性功能\n处理：氢医学文献≠本产品注册功效；性功能不可承诺\n稳妥对外：压力激素与主观放松有研究信号；性功能/抗衰不进销售菜单",
    location: "综合性抗衰方案效果评价",
    durationMin: 3,
    scenarios: ["合规培训"],
  },
  {
    id: "KP-MEDF-013",
    title: "评估工具箱：量表、HRV、多指标、体脂、基因、骨密度",
    category: "运营管理",
    tags: ["检测", "HRV", "量表", "基因"],
    audience: ["门店运营", "学术", "B端客户"],
    summary:
      "PPT 列出心理量表、HRV（压力/疲劳/肥胖/抗老化/心血管/功能障碍/体检）、血糖胆固醇尿酸血压激素、体脂、一滴血、基因>50项、骨密度。独立门店通常只需问卷+HRV。",
    body: "核心且可落地：压力/敏感性量表；HRV；访谈；生活方式评估\n唾液（材料）：皮质醇、免疫球蛋白；量表含 HSP/SPS/SHS、认知敏感、疼痛、焦虑抑郁\n重资产：多指标血生化、体成分、一滴血细胞、基因>50、骨密度 T/Z\n纪律：基因与血液检测须有资质；SOP 门店以 HRV+禁忌症自评为主\n两次体验设计：首次探索感受+评估，二次反馈方案——只做一次易脱落",
    location: "怎么知道客户有哪些问题",
    durationMin: 4,
    scenarios: ["运营培训", "B端提案"],
  },
  {
    id: "KP-MEDF-014",
    title: "在店离店干预：漂浮师协同按摩，离店用心理技术维持",
    category: "运营管理",
    tags: ["漂浮师", "按摩", "离店", "疗程"],
    audience: ["门店运营", "销售团队"],
    summary:
      "在店：漂浮师与按摩师合作。离店：漂浮师用心理咨询技术做维持。体验建议两次再订方案。整体是评估→在店→离店，不是单次浸泡。",
    body: "体验：建议两次。一次不够了解自身、易脱落；二次反馈评估并适应环境\n在店：漂浮师 + 按摩师\n离店：心理咨询技术维持疗效\n对接 SOP：独立门店没有处方权，心理技术须限定在健康教育与跟进问候，不冒充咨询执业\n对接疗程卡：两次体验后再推 8 次，逻辑一致",
    location: "医学漂浮诊疗过程 / 体验与评估",
    durationMin: 3,
    scenarios: ["运营培训", "销售培训"],
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
    date: "2024-08",
    author: "UFLO优浮 / 医学漂浮诊疗方案",
  },
  scenarios: p.scenarios || ["医院合作", "合规培训"],
  durationMin: p.durationMin,
  version: "1.0",
  status: "draft",
  createdAt: now,
  updatedAt: now,
  conflictNote:
    "医学讲义。病种清单与90%有效率不是批准适应症或本公司RCT。与SOP禁用「治疗」词汇冲突。",
}));

const dataDir = path.join(process.cwd(), "data");
const kpPath = path.join(dataDir, "knowledge-points.json");
const sourcesPath = path.join(dataDir, "sources.json");
const existing = JSON.parse(readFileSync(kpPath, "utf-8"));
if (existing.some((p) => p.id === "KP-MEDF-001")) {
  console.log("医学漂浮诊疗方案已存在，跳过。总数:", existing.length);
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
  note: `${knowledgePoints.length}条医学讲义：REST三阶段、失眠/抗衰/关节疗程。90%有效率与病种菜单已标红线。`,
});
writeFileSync(sourcesPath, JSON.stringify(sources, null, 2) + "\n");
console.log(`Imported ${knowledgePoints.length} from ${sourceFile}`);
console.log(`Total: ${merged.length}`);
