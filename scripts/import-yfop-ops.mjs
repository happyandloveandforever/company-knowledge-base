/**
 * Claude 精细拆分：优浮医疗联合运营执行方案.doc
 * 医院联合中心架构、三大症状范围、套餐与价格。
 * 与 SOP「独立健康中心、禁止治疗词汇」冲突，对外须分场景。
 * 运行：node scripts/import-yfop-ops.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = new Date().toISOString();
const sourceFile = "优浮医疗联合运营执行方案.doc";
const sourceId = "SRC-YFOP-OPS";

const points = [
  {
    id: "KP-YFOP-001",
    title: "优浮三联架构：引流体验、理疗漂浮、慢病养护",
    category: "战略规划",
    tags: ["优浮", "联合运营", "架构", "医院"],
    audience: ["管理者", "B端客户", "销售团队"],
    summary:
      "材料把中心拆成三块：体验引流做品牌；漂浮理疗做主业；慢病养护由医生出方案、中心执行辅助项目。",
    body: "（1）引流：体验式进入，核心是引流和品牌广宣\n（2）理疗：漂浮治疗\n（3）慢病养护：医生出诊断治疗方案，中心执行其中的辅助项目\n使用边界：这是医院联合运营稿，不是 SOP 独立门店稿\n对外：医院合作可以说「医生诊断、中心做物理辅助」\n禁止：把独立配楼门店也讲成医院科室",
    location: "一、项目架构",
    durationMin: 3,
    scenarios: ["B端提案", "医院合作", "战略研讨"],
  },
  {
    id: "KP-YFOP-002",
    title: "中心定位：疼痛、睡眠、焦虑的辅助治疗末环",
    category: "产品知识",
    tags: ["定位", "疼痛", "睡眠", "焦虑"],
    audience: ["B端客户", "销售团队", "学术"],
    summary:
      "专注疼痛、睡眠、焦虑三大症状的辅助性治疗。核心技术是漂浮物理辅助，位于临床路径「诊断+治疗+辅助治疗」的最后环节。流程：心理检测+漂浮。",
    body: "三症状：疼痛 / 睡眠 / 焦虑\n路径位置：诊断 → 治疗 → 辅助治疗（本中心在最后一环）\n流程：心理检测 + 漂浮治疗\n与 SOP 对照：SOP 禁止「治疗/治愈/医治」，统一「修复/调节/重置/辅助改善」\n医院合作可用「辅助治疗末环」；独立门店跟 SOP 用语",
    location: "一（4）中心定位",
    durationMin: 3,
    scenarios: ["医院合作", "销售培训", "合规培训"],
  },
  {
    id: "KP-YFOP-003",
    title: "多科室协作：心身、疼痛、精神、神经、骨科、睡眠",
    category: "运营管理",
    tags: ["科室", "转介", "医院"],
    audience: ["管理者", "B端客户", "门店运营"],
    summary:
      "与门诊和康复多科室合作，服务三大症状病人。设备：心理量表、植物神经功能检测、漂浮舱。手段以物理仪器辅助为主。",
    body: "合作科室：心身科、疼痛科、精神科、心理科、神经内科、骨科、睡眠科\n设备：心理量表检测、植物神经功能检测、漂浮舱\n面向：门诊 + 住院部\n对外：医院联合中心才讲转介网；独立门店不要假装有科室医生坐诊",
    location: "二、中心简介",
    durationMin: 3,
    scenarios: ["医院合作", "运营培训"],
  },
  {
    id: "KP-YFOP-004",
    title: "材料中的三大症状诊疗清单（非批准适应症）",
    category: "合规与风控",
    tags: ["适应症", "红线", "疼痛", "失眠", "焦虑"],
    audience: ["销售团队", "学术", "管理者"],
    summary:
      "文档列出疼痛/失眠/焦虑下的病种清单，含纤维肌痛、抑郁、成瘾、多动症等。只作医院合作内部菜单，不作产品适应症宣传。",
    body: "疼痛：偏头痛、肌紧张性头痛；中枢性/交感神经相关性神经痛；腰腿痛、颈椎病、膝关节炎；腰肌劳损、纤维肌痛、肩周炎、软组织损伤；痛经、慢性盆腔痛；植物神经功能紊乱、更年期\n失眠：失眠、嗜睡、睡眠节律紊乱；抑郁/焦虑/强迫/应激等心理因素\n焦虑：植物神经功能紊乱、抑郁/焦虑/睡眠/惊恐/强迫、物质与酒精依赖、进食障碍、应激、更年期、多动症\n红线：对接 KP-WEB-010 / KP-MEV-102。销售菜单禁止铺病种\n医院内部：可作为「医生已诊断后的辅助范围讨论稿」",
    location: "三、诊疗范围",
    durationMin: 4,
    scenarios: ["合规培训", "医院合作"],
  },
  {
    id: "KP-YFOP-005",
    title: "人员分工：科室医生开方，漂浮师评估与实施",
    category: "运营管理",
    tags: ["漂浮师", "医生", "岗位"],
    audience: ["门店运营", "管理者", "工程实施"],
    summary:
      "科室医生负责诊断、用药、开具处方给漂浮中心。漂浮师评估患者、制定并实施漂浮方案，可与物理治疗师、心理治疗师协作。",
    body: "医生：诊断、用药、处方到中心\n漂浮师：再评估、订方案、实施；可协同其他物理/心理治疗师\n与 SOP 冲突：SOP 说「没有医生、没有处方、没有治疗」\n用法：联合院内中心用本卡；独立配楼门店用 SOP 三句话撇清",
    location: "五、医务人员",
    durationMin: 3,
    scenarios: ["运营培训", "医院合作", "合规培训"],
  },
  {
    id: "KP-YFOP-006",
    title: "评估：敏感性量表为主，首次不与门诊重复测",
    category: "运营管理",
    tags: ["量表", "评估", "SOP"],
    audience: ["门店运营", "学术", "销售团队"],
    summary:
      "主工具：感觉敏感性量表、知觉敏感性量表。辅助：疼痛、睡眠障碍、焦虑、抑郁。作为门诊评估补充；首次不重复评估，过程疗效由中心监测。",
    body: "主：感觉敏感性、知觉敏感性\n辅：疼痛 / 睡眠障碍 / 焦虑 / 抑郁\n规则：参与医院门诊评估补充；首次不重复测；疗程中监测放在中心\n可转化：独立门店用 HRV+问卷即可，不必上齐精神科量表",
    location: "六、评估工具",
    durationMin: 3,
    scenarios: ["运营培训", "学术汇报"],
  },
  {
    id: "KP-YFOP-007",
    title: "情绪管理套餐：10周16次，漂浮前教放松冥想正念",
    category: "产品知识",
    tags: ["套餐", "疗程", "正念"],
    audience: ["销售团队", "门店运营", "B端客户"],
    summary:
      "面向焦虑、抑郁、失眠、情绪调节困难、慢性疲劳、社交焦虑。10周16次：1–3周每周2次×45分钟；第4周1次×45；5–7周每周2次×60；8–10周每周1次自由模式。赠三门课程U盘。",
    body: "适应人群（材料）：焦虑、抑郁、失眠、情绪调节困难、慢性疲劳、社交焦虑\n节奏：1–3周 2次/周 45min → 第4周 1次 45min → 5–7周 2次/周 60min → 8–10周 1次/周 自由模式\n方法：放松技术 + 漂浮 + 冥想 + 正念；均在漂浮前教授\n赠品：三技术课程 U 盘；要求对照学习，下次漂浮检验\n对外：可作「疗程化」范本；病名不要当适应症广告",
    location: "八、套餐分类",
    durationMin: 4,
    scenarios: ["销售培训", "B端提案"],
  },
  {
    id: "KP-YFOP-008",
    title: "材料次卡价：30分钟390到90分钟990，首次体验免费",
    category: "财务模型",
    tags: ["报价", "次卡", "价格"],
    audience: ["管理者", "销售团队", "门店运营"],
    summary:
      "文档次卡：30分钟390（首次体验不收费）、45分钟590、60分钟790、90分钟990。属历史方案价，须老板确认后才能对外。",
    body: "30min 390（首次体验免费）\n45min 590\n60min 790\n90min 990\n口径：2021–2023 方案稿，不是现行价目表\n使用：对内测算参考；对外先问老板是否仍有效",
    location: "九（一）次卡",
    durationMin: 2,
    scenarios: ["报价", "管理决策"],
  },
  {
    id: "KP-YFOP-009",
    title: "月卡年卡：满次后不限次，积分不转让，至少办三个月",
    category: "财务模型",
    tags: ["月卡", "年卡", "会员"],
    audience: ["管理者", "销售团队", "门店运营"],
    summary:
      "月卡：60分钟2360、90分钟3160；当月满5次后不限次（每天最多1次）。年卡：60分钟23600、90分钟31600；年内满30次后不限次。会员至少三个月，积分不过期不可转让。",
    body: "月卡：60min 2360/月；90min 3160/月\n月卡权益：同月个人满5次 → 当月不限次，每天最多1次；积分逐月累积永不过期；可会员折扣买给亲友；生日月额外额度；至少办3个月，其后可免费取消\n年卡：60min无限 23600/年；90min无限 31600/年；年内满30次后不限次，每天最多1次；无限制额度不累积、不转让、不共享\n口径：历史方案价，须确认\n与 SOP 对照：SOP 主推 3次入门 / 8次系统 / 24次年卡，不卖单次——两套产品结构不要混在一张报价单",
    location: "九（二）（三）月卡年卡",
    durationMin: 4,
    scenarios: ["报价", "销售培训"],
  },
  {
    id: "KP-YFOP-010",
    title: "就诊路径：排器质性疾病后，漂浮是辅助而非首诊",
    category: "运营管理",
    tags: ["路径", "转介", "知情同意"],
    audience: ["门店运营", "B端客户", "学术"],
    summary:
      "流程图要点：患者先排除器质性疾病、做功能性检查；门诊/住院走药物、中医、物理、心理、康复；漂浮在辅助层。含知情同意、疗程报告、定期回访，不适合者转介。",
    body: "上游：器质性疾病排除 → 功能性检查 → 得到诊断；不适合则转介\n并行治疗：药物 / 中医 / 物理 / 心理 / 康复\n本中心：签署知情同意 → 漂浮 → 单次疗程报告 → 定期监测 → 维持调整 → 复查回访\n宣讲：漂浮不替代首诊和排病\n医院合作按此路径；独立门店按 SOP 健康问卷+禁忌症自评",
    location: "四、就诊流程图 / 文末流程图",
    durationMin: 3,
    scenarios: ["医院合作", "运营培训", "合规培训"],
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
    date: "2023-04",
    author: "优浮医疗联合运营方案",
  },
  scenarios: p.scenarios || ["医院合作", "运营培训"],
  durationMin: p.durationMin,
  version: "1.0",
  status: "draft",
  createdAt: now,
  updatedAt: now,
  conflictNote:
    "医院联合运营稿。与 SOP「独立中心、无医生无处方」冲突，须分场景使用，不把病种清单当批准适应症。",
}));

const dataDir = path.join(process.cwd(), "data");
const kpPath = path.join(dataDir, "knowledge-points.json");
const sourcesPath = path.join(dataDir, "sources.json");
const existing = JSON.parse(readFileSync(kpPath, "utf-8"));
if (existing.some((p) => p.id === "KP-YFOP-001")) {
  console.log("优浮运营方案已存在，跳过。总数:", existing.length);
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
  note: `${knowledgePoints.length}条医院联合运营：架构/病种菜单/价格。与SOP独立门店口径冲突已标注。`,
});
writeFileSync(sourcesPath, JSON.stringify(sources, null, 2) + "\n");
console.log(`Imported ${knowledgePoints.length} from ${sourceFile}`);
console.log(`Total: ${merged.length}`);
