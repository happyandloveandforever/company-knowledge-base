/**
 * 把已有知识点打上 layer / usage，并补通识层前沿文献卡。
 * 幂等：若 KP-COM-001 已存在则跳过新增；layer/usage 仅在缺失时回填。
 * 运行：node scripts/apply-knowledge-layers.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-08-24T04:30:00.000Z";
const sourceFile = "通识层架构与前沿文献（2026-08-24）";
const sourceId = "SRC-COMMONS-FRONTIER";

const COMMONS_PREFIX = new Set(["WEB", "MEV", "MEDW"]);

const COMMONS_IDS = new Set([
  "KP-MECH-001",
  "KP-MECH-002",
  "KP-MECH-003",
  "KP-MECH-004",
  "KP-MECH-005",
  "KP-MECH-006",
  "KP-MECH-007",
  "KP-MECH-008",
  "KP-MECH-010",
  "KP-MECH-011",
  "KP-MECH-012",
  "KP-CRAFT-006",
  "KP-CRAFT-007",
  "KP-CRAFT-008",
  "KP-CRAFT-016",
  "KP-CRAFT-018",
  "KP-CRAFT-024",
  "KP-FAF-002",
  "KP-FAF-003",
  "KP-FAF-004",
  "KP-FAF-005",
  "KP-FAF-006",
  "KP-FAF-008",
  "KP-FAF-009",
  "KP-FAF-010",
  "KP-FAF-018",
  "KP-FAF-019",
  "KP-FAF-020",
  "KP-V7-002",
  "KP-V7-004",
  "KP-V7-005",
  "KP-V7-006",
  "KP-V7-007",
  "KP-V7-008",
  "KP-V7-009",
  "KP-V7-010",
  "KP-V7-011",
  "KP-V7-018",
  "KP-BRAND-003",
  "KP-BRAND-007",
  "KP-BRAND-008",
  "KP-BG2-003",
  "KP-BG2-006",
  "KP-BG2-008",
  "KP-BG2-040",
  "KP-MEDF-002",
  "KP-MEDF-003",
  "KP-MEDF-004",
]);

const TRAINING_IDS = new Set([
  "KP-WEB-010",
  "KP-WEB-011",
  "KP-CRAFT-001",
  "KP-CRAFT-020",
  "KP-CRAFT-021",
  "KP-CRAFT-024",
  "KP-BRAND-033",
  "KP-BRAND-034",
  "KP-BRAND-035",
  "KP-SOP-010",
  "KP-SOP-016",
  "KP-SOP-018",
  "KP-MEV-101",
  "KP-MEV-102",
  "KP-MECH-012",
  "KP-MEDF-010",
  "KP-EXP-010",
]);

function prefixOf(id) {
  return id.split("-")[1] || "";
}

function classifyLayer(id) {
  const prefix = prefixOf(id);
  if (COMMONS_PREFIX.has(prefix) || COMMONS_IDS.has(id) || prefix === "COM") return "commons";
  return "company";
}

function classifyUsage(id) {
  const prefix = prefixOf(id);
  if (prefix === "SOP" || prefix === "SAN" || prefix === "EXP") return "ops";
  if (id === "KP-WEB-012" || id === "KP-CHAMP-020") return "ops";
  if (TRAINING_IDS.has(id)) return "training";
  if (["WEB", "MEV", "MEDW", "MECH", "COM"].includes(prefix)) return "both";
  return "pitch";
}

function makePoint(p) {
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
    source: {
      file: sourceFile,
      location: p.location,
      date: "2026-08-24",
      author: "公开文献 / 政策 / 知识库架构",
    },
    scenarios: p.scenarios,
    durationMin: p.durationMin,
    version: "1.0",
    status: "approved",
    layer: "commons",
    usage: p.usage,
    createdAt: now,
    updatedAt: now,
    conflictNote: "通识层。公开科学/政策/方法，不是本公司临床试验或专有数字。",
  };
}

const newPoints = [
  makePoint({
    id: "KP-COM-001",
    title: "两层架构：通识层给客户，公司层守资产",
    category: "培训资料",
    tags: ["通识层", "公司层", "B端资料", "架构"],
    audience: ["管理者", "销售团队", "培训师"],
    usage: "training",
    durationMin: 5,
    scenarios: ["内部培训", "资料包设计", "战略研讨"],
    location: "知识库架构 2026-08-24",
    summary:
      "面对大量B端客户，总库只分两层：通识层（公开科学、政策、卫生标准、证据边界）可进资料包；公司自有层（产品参数、报价、SOP、具名案例、专利口径）按客户授权给。批准状态不是分层。",
    body: "为什么要两层：B端客户要的是可核验的公共证据 + 可交付的我司方案。把二者混在「已批准」里，客户会分不清哪句是世界卫生组织、哪句是我们自己的数字。\n通识层（layer=commons）：WHO/政策、REST文献、卫生标准、证据金字塔、培训红线。谁都能查到出处。给客户不泄密。\n公司自有层（layer=company）：产品模块、报价、开业SOP、消杀配方叙事、优浮套餐、具名案例、财务模型。只给签约/尽调授权范围。\n不是分层的东西：approved/draft 只表示审核进度；培训 vs 汇报是 usage，不是第三层。\n给客户资料包默认顺序：通识层一页纸 → 证据边界 → 卫生 → 邀请体验；公司层参数另附，数字未锁定就写「以合同/铭牌为准」。",
    examples: [
      "可以给客户：Garland 2024 可行性RCT原文级别的结论",
      "不能当通识给客户：优浮次卡价、杨浦财务模型、Jun案例数字",
    ],
  }),
  makePoint({
    id: "KP-COM-002",
    title: "培训卡和汇报卡不是同一条知识：放在 usage，不另建一层",
    category: "培训资料",
    tags: ["培训", "汇报", "usage", "卡片结构"],
    audience: ["培训师", "销售团队", "管理者"],
    usage: "training",
    durationMin: 6,
    scenarios: ["内部培训", "拆分规范", "资料包设计"],
    location: "知识库架构 2026-08-24",
    summary:
      "培训初稿和PPT汇报用的知识完全不一样，但不要建成第三层。同一主题拆成两条：usage=pitch 给客户看；usage=training 给自己人练。层（通识/公司）仍按内容归属。",
    body: "结论：培训放在 usage=training。科学培训进通识层，SOP/产品培训进公司层。PPT/提案放 usage=pitch。运营手册放 usage=ops。\n为什么不能合成一条：汇报要短、要边界、要邀请；培训要目标、要误区、要练习、要考核。合成后对客户太长，对学员太虚。\n汇报卡结构：一句话主张 → 一条可核验证据 → 一句边界（不讲什么） → 一句邀请（体验/尽调/试点）。\n培训卡结构：学习目标 → 不要讲成 → 可以讲 → 练习（30秒口播） → 考核（问一句就露馅的题）。\n同一文献的正确拆法：Garland 2024 事实卡（both）+ 培训卡「不要讲成疗效RCT」（training）。不要把培训初稿直接贴进客户PPT。\n你有培训初稿时：上传后说「按培训卡结构拆，usage=training，科学进通识、SOP进公司」。",
    examples: [
      "汇报：六次池漂依从约85%/89%，无严重不良事件；这是可行性，不是治愈率",
      "培训考核：客户问「所以你们能治抑郁？」正确回答是把问题转回深度恢复与体验，而不是背疗效数字",
    ],
  }),
  makePoint({
    id: "KP-COM-003",
    title: "B端资料包六件套：先通识，后公司",
    category: "市场营销",
    tags: ["B端资料", "一页纸", "尽调", "通识层"],
    audience: ["B端客户", "销售团队", "管理者"],
    usage: "pitch",
    durationMin: 5,
    scenarios: ["B端提案", "尽调", "资料包"],
    location: "知识库架构 2026-08-24",
    summary:
      "给产业客户的标准包：①问题与政策通识 ②REST证据与边界 ③卫生与安全 ④参观/体验路径 ⑤FAQ红线 ⑥公司方案附录（数字以合同为准）。前五件主要来自通识层。",
    body: "①问题与政策：全球精神障碍规模、中国抑郁焦虑体量、健康中国/主动健康转向。只引官方或可核验来源。\n②证据与边界：Feinstein 2018 开放标签；Garland 2024 安全/可行性RCT；病种RCT不进销售菜单。\n③卫生：NSF/NAFTS 主流是UV/臭氧，不把泳池氯方案当卖点恐吓。\n④参观：看动线、看消杀、看一次完整体验，不在舱边讲病种。\n⑤FAQ：不治病、数字未锁定、案例需授权。\n⑥公司附录：设备参数、合作模式、报价、SOP——单独装订，授权后给。\n不要：把财务模型和论文摘要订成一本让客户自己翻。",
    examples: ["产业集团第一轮只给①–⑤；进入尽调再给⑥"],
  }),
  makePoint({
    id: "KP-COM-004",
    title: "尽调口径：数字未锁定就写材料口径，不编专有数字",
    category: "合规与风控",
    tags: ["尽调", "数字", "口径", "B端"],
    audience: ["销售团队", "管理者", "B端客户"],
    usage: "both",
    durationMin: 4,
    scenarios: ["尽调", "B端提案", "合规培训"],
    location: "知识库架构 2026-08-24",
    summary:
      "客户问机构数、专利数、C端量、回本模型时：通识层只提供公共证据；公司数字未老板锁定前，统一答「以合同、铭牌、最新授权材料为准」，禁止现场发明。",
    body: "可立刻引用（通识）：WHO 2025 全球超十亿精神障碍；中国抑郁约5400万、焦虑约4100万（WHO中国页）；Garland 2024 无严重不良事件。\n必须等老板锁（公司层）：对外机构数、专利数、C端用户数、水温、58%/2000项研究、优浮历史价。见 KP-CRAFT-023、KP-SOP-022。\n现场句式：这个问题我们按合同文本答，不在口头把宣传页数字说死。\n红线：不要用通识文献的样本量冒充我司临床数据。",
    examples: ["问：你们有没有国家级认证疗效？答：漂浮不是已批准精神科治疗；我们交付的是可运营的深度恢复服务。"],
  }),
  makePoint({
    id: "KP-COM-005",
    title: "文献更新纪律：只写到作者原话级别，禁止升格",
    category: "合规与风控",
    tags: ["文献", "引用纪律", "前沿", "通识层"],
    audience: ["学术", "销售团队", "培训师"],
    usage: "training",
    durationMin: 4,
    scenarios: ["合规培训", "学术汇报", "拆分规范"],
    location: "知识库架构 2026-08-24",
    summary:
      "通识层更新前沿文献时：写清设计、样本、主终点、作者自己的限度。开放标签不写成RCT；可行性RCT不写成疗效金标准；综述不写成元分析定论；在研试验没有结果就不能当证据。",
    body: "允许：作者、年份、期刊、DOI/试验号、n、设计、安全事件、作者结论原句级别。\n禁止：把 p 值讲成「已证明治好」；把单中心讲成「全球金标准」；把正在招募的 NCT 讲成「最新疗效」。\n升格梯子（从低到高）：案例/开放标签 → 可行性/安全性RCT → 疗效RCT → 多中心重复 → 系统综述/指南。销售默认停在可行性+即时状态。\n更新频率：有新RCT或WHO报告再补卡；不要每周刮新闻标题。",
    examples: ["正确：作者写明 larger RCTs evaluating clinical efficacy are warranted", "错误：最新研究证明漂浮可以治疗焦虑抑郁"],
  }),
  makePoint({
    id: "KP-COM-006",
    title: "培训：漂浮不是治疗，对外怎么把话收回来",
    category: "培训资料",
    tags: ["培训", "合规", "不治病", "话术"],
    audience: ["培训师", "销售团队", "门店运营"],
    usage: "training",
    durationMin: 5,
    scenarios: ["销售培训", "合规培训", "开业陪跑"],
    location: "知识库架构 2026-08-24",
    summary:
      "学习目标：学员能在10秒内把「治病/治愈/处方」纠正为「深度恢复/状态管理/非药物服务」。这是培训卡，不是客户PPT页。",
    body: "学习目标：不把漂浮说成精神科治疗、医保项目或医疗器械适应症。\n不要讲成：治疗抑郁症、处方漂浮、有效率90%、替代药物。\n可以讲：非药物、可体验、可重复的深度恢复；研究在追问焦虑/疼痛等信号；我们交付卫生与流程。\n练习：客户说「你们是不是能治失眠？」——先承认失眠很常见，再把服务定义成睡眠管理入口，建议体验+规律作息，不承诺治愈。\n考核：说出三句禁用词（治疗、治愈、医治）和三句替换词（修复、调节、重置/深度恢复）。对接 SOP-009。",
    examples: ["禁用：这是治疗焦虑的医疗项目", "可用：这是帮助神经系统降噪重启的恢复服务"],
  }),
  makePoint({
    id: "KP-COM-007",
    title: "WHO 2025：全球超十亿人生活在精神障碍中",
    category: "战略规划",
    tags: ["WHO", "2025", "精神健康", "通识"],
    audience: ["政府汇报", "B端客户", "投资人"],
    usage: "pitch",
    durationMin: 4,
    scenarios: ["政府汇报", "B端提案", "演讲"],
    location: "https://www.who.int/news/item/02-09-2025-over-a-billion-people-living-with-mental-health-conditions-services-require-urgent-scale-up",
    summary:
      "世界卫生组织 2025 年《World mental health today》：2021年全球约14%人口、超过十亿人生活在精神障碍中；焦虑与抑郁最常见。服务仍严重不足。用于打开问题，不用于证明我司疗效。",
    body: "出处：WHO, World mental health today（ISBN 9789240113817），2025-09 发布；新闻稿 2025-09-02。\n核心数：2021年估计超过十亿人（约14%全球人口）生活在精神障碍中；多数在中低收入国家。\n病种：男女均以焦虑障碍、抑郁障碍最常见；女性总体受影响更重。\n服务：与 Mental Health Atlas 2024 一起发布，强调政策有进展但投资和人力跟不上。\n经济：间接成本（生产力损失）远大于直接医疗费用；对外引用时用「WHO指出负担沉重」，不要把全球万亿美元级口径说成我司可回收的市场。\n边界：这是流行病学与卫生系统数据，不是漂浮适应症。\n对外句：心理健康需求巨大且服务不足；我们提供的是可体验的主动健康入口，不是替代专科医疗。",
    examples: ["PPT只放：超十亿人；焦虑与抑郁最常见；服务缺口仍大"],
  }),
  makePoint({
    id: "KP-COM-008",
    title: "中国规模：抑郁约5400万、焦虑约4100万，健康中国要治疗可及",
    category: "战略规划",
    tags: ["WHO中国", "抑郁", "焦虑", "健康中国2030"],
    audience: ["政府汇报", "B端客户", "投资人"],
    usage: "pitch",
    durationMin: 4,
    scenarios: ["政府汇报", "B端提案", "演讲"],
    location: "https://www.who.int/china/health-topics/mental-health",
    summary:
      "WHO中国页：估计中国约5400万人患抑郁、约4100万人患焦虑障碍。健康中国2019–2030目标包括到2030年至少80%抑郁症患者获得治疗可及。用来讲需求与政策，不讲我们覆盖了多少患者。",
    body: "出处：WHO China, Mental health 主题页（与世界精神卫生日材料口径一致）。\n数字：抑郁约 54 million；焦虑障碍约 41 million。这是WHO估计，不是我司普查。\n政策：Healthy China 2019–2030 — 抑郁症患者获得治疗的比例，目标2030年至少80%（材料中并提2022年至少30%的阶段性表述，引用时核对最新官方文本）。\n对接：主动健康、社会心理服务体系要的是可及、可体验、可协同的入口；漂浮可以是恢复服务，不能自称已纳入基本公卫或医保。\n禁止：把5400万说成目标客户量或可转化漏斗。",
    examples: ["政府页：需求体量大 + 治疗可及目标；下一页才是我们的非医疗恢复角色"],
  }),
  makePoint({
    id: "KP-COM-009",
    title: "Mental Health Atlas 2024：人力与预算仍薄",
    category: "战略规划",
    tags: ["WHO", "Atlas 2024", "人力", "服务缺口"],
    audience: ["政府汇报", "B端客户", "投资人"],
    usage: "pitch",
    durationMin: 4,
    scenarios: ["政府汇报", "B端提案", "战略研讨"],
    location: "https://www.who.int/publications/i/item/9789240114487",
    summary:
      "WHO《Mental Health Atlas 2024》（144国）：全球专科精神卫生人力中位数约13.5/10万；低收入与中低收入国家约1.1–2.4，高收入约67.2。政府卫生预算中精神卫生中位数仍约2%。讲缺口，不讲我们能补上专科医生。",
    body: "出处：WHO Mental Health Atlas 2024，ISBN 9789240114487；第七版，2001年起系列。\n人力：全球专科精神卫生工作者中位数 13.5 / 10万人口；儿童青少年专科中位数约 1.5 / 10万。构成大约：护士43%、心理师22%、精神科医师16%。\n预算：政府卫生支出中精神卫生中位数仍约2%。\n含义：专科供给跟不上需求，才会出现「基层可体验的心理与睡眠管理服务」空间。\n边界：Atlas 描述的是卫生系统，不是漂浮行业报告。禁止说「所以国家要采购我们的舱」。\n对外句：政策在增加，但人力和预算仍然薄；产业可以做主动健康的可体验补充，不能假装自己是精神科扩容。",
    examples: [],
  }),
  makePoint({
    id: "KP-COM-010",
    title: "政策通识：社会心理服务要可及，主动健康要可体验",
    category: "战略规划",
    tags: ["社会心理服务体系", "主动健康", "政策", "通识"],
    audience: ["政府汇报", "B端客户", "销售团队"],
    usage: "both",
    durationMin: 4,
    scenarios: ["政府汇报", "B端提案", "销售培训"],
    location: "对接 KP-WEB-008、KP-WEB-009",
    summary:
      "通识层政策卡：卫生健康工作转向以健康为中心；心理与睡眠是主动健康支柱。我们的角色是可体验的深度恢复入口，不是基本公卫项目，也不是医院科室替代。",
    body: "可引：全民健康素养提升三年行动（治病中心→健康中心）；健康中国行动；主动健康六支柱中的心理与睡眠（见 WEB-008/009）。\n产业翻译：客户要的是员工/市民「用得上、敢进去、可重复」的恢复服务，而不是再听一堂心理健康课。\n培训不要讲成：我们已经是社会心理服务体系指定供应商。\n汇报可以讲：政策要可及，我们提供可参观、可体验、可运营的一种形态。\n红线：不写进医保、不写进强制筛查、不写治疗率承诺。",
    examples: ["先政策缺口，再邀请参观；不要先设备参数"],
  }),
  makePoint({
    id: "KP-COM-011",
    title: "培训：Garland 2024 是安全/可行性RCT，不是疗效金标准",
    category: "培训资料",
    tags: ["Garland", "RCT", "可行性", "培训"],
    audience: ["培训师", "销售团队", "学术"],
    usage: "training",
    durationMin: 5,
    scenarios: ["销售培训", "合规培训", "学术汇报"],
    location: "https://doi.org/10.1371/journal.pone.0286899",
    summary:
      "学习目标：能准确背出 Garland et al., PLoS ONE 2024;19(6):e0286899 的设计级别，并拒绝把它讲成「已经证明治疗焦虑抑郁」。事实细节见 KP-WEB-002。",
    body: "学习目标：区分可行性终点 vs 疗效终点。\n事实锚点（WEB-002）：n=75，焦虑+抑郁；pool-REST / pool-REST preferred / chair-REST；约6次；依从 85% / 89% / 74%；无与干预相关严重不良事件；NCT03899090。\n不要讲成：疗效RCT、治愈焦虑、比药物更好、我司临床试验。\n可以讲：重复使用可行、耐受较好、体验以正向为主；作者要求更大疗效RCT。\n练习：用20秒说完「能做完、较安全、功效还要等」。\n考核：主终点是依从/可行性，不是抑郁量表治愈率。答错则停用该文献直到复训。",
    examples: ["客户追问疗效 → 把文献级别说清楚，再邀请体验，不补编数字"],
  }),
  makePoint({
    id: "KP-COM-012",
    title: "培训：Feinstein 2018 是开放标签，效果量再大也不是RCT",
    category: "培训资料",
    tags: ["Feinstein", "开放标签", "培训", "焦虑"],
    audience: ["培训师", "销售团队", "学术"],
    usage: "training",
    durationMin: 4,
    scenarios: ["销售培训", "合规培训"],
    location: "https://doi.org/10.1371/journal.pone.0190292",
    summary:
      "学习目标：Feinstein 2018（n=50，约1小时，状态焦虑下降信号强）必须标注 open-label。作者要求更大对照试验。事实见 KP-WEB-001。",
    body: "不要讲成：RCT、金标准、已验证治疗。\n可以讲：有开放标签研究观察到单次后状态焦虑显著下降；这不是已批准精神科治疗。\n练习：先说设计，再说结果，最后说限度。顺序反了就算失败。\n考核：ClinicalTrials.gov 号 NCT03051074；设计标签必须含「开放标签」。\n与 Garland 2024 的关系：2018 给即时状态信号，2024 给重复使用安全/可行性；两张卡不要合成「已经完全证明」。",
    examples: [],
  }),
  makePoint({
    id: "KP-COM-013",
    title: "培训：Choquette 2023 住院厌食RCT不可写成产品适应症",
    category: "培训资料",
    tags: ["Choquette", "身体意象", "红线", "培训"],
    audience: ["培训师", "销售团队", "学术"],
    usage: "training",
    durationMin: 4,
    scenarios: ["合规培训", "学术汇报"],
    location: "https://doi.org/10.1016/j.eclinm.2023.102173",
    summary:
      "eClinicalMedicine 2023 住院神经性厌食女性RCT有信号，但是单中心、样本有限。禁止说「漂浮方舟治疗厌食症」。学术可引用，销售菜单不放。",
    body: "学习目标：塔尖文献只对学术/内部。\n不要讲成：我们的适应症、已在中国复制、餐饮/医美客户的承诺。\n可以讲：顶刊级研究说明 REST 对身体意象与状态焦虑被认真研究过；推广性有限。\n考核：能否指出「住院样本 ≠ 门店客群」。\n对接 WEB-003、WEB-010。",
    examples: [],
  }),
  makePoint({
    id: "KP-COM-014",
    title: "2025系统综述：63项研究显示痛、压力、焦虑有信号，睡眠与戒烟弱",
    category: "技术知识",
    tags: ["系统综述", "Lashgari", "2025", "REST"],
    audience: ["学术", "B端客户", "销售团队"],
    usage: "both",
    durationMin: 5,
    scenarios: ["学术汇报", "B端提案", "销售培训"],
    location: "https://doi.org/10.1186/s12906-025-04973-0",
    summary:
      "Lashgari 等，BMC Complementary Medicine and Therapies 2025。检索至2024-05，纳入63项、约1800+参与者。痛、运动表现、压力、临床焦虑偏正向；睡眠障碍与戒烟证据弱。作者强调机制与方案仍待研究。",
    body: "出处：Lashgari E, Chen E, Gregory J, Maoz U. A systematic review of flotation-restricted environmental stimulation therapy (REST). BMC Complement Med Ther. 2025.\n范围：PRISMA；数据库检索至 2024-05-23；排除非 flotation-REST 与综述本身。\n体量：63项研究；摘要写 1,838 名参与者，正文样本特征处另有合计口径，对外用「六十余项、约两千人量级」并指向原文，不锁单一总数。\n作者归纳的正向领域：疼痛、运动表现、压力、心理健康、临床焦虑。\n弱/无：睡眠相关障碍、戒烟。\n限度：研究仍少、方案异质、需要更多机制与优化方案研究。有一项疼痛对照甚至与安慰剂接近——不能把综述写成「已证明镇痛药替代」。\n对外句：系统综述支持「值得认真研究的恢复工具」，不是「已经批准的治疗」。\n红线：不要用这项综述覆盖我司产品模块（氢、光、AI）的功效。",
    examples: ["汇报只列：痛/压力/焦虑有文献簇；睡眠不要当主打功效承诺"],
  }),
  makePoint({
    id: "KP-COM-015",
    title: "2026范围综述：慢性痛文献簇有信号，但还不能做元分析定论",
    category: "技术知识",
    tags: ["慢性痛", "scoping review", "2026", "Stuart"],
    audience: ["学术", "B端客户", "销售团队"],
    usage: "both",
    durationMin: 4,
    scenarios: ["学术汇报", "B端提案", "合规培训"],
    location: "https://doi.org/10.2147/JPR.S565238",
    summary:
      "Stuart 等，Journal of Pain Research 2026-02-11。检索至2025-01，8项研究（6项RCT）共401人。疼痛强度/频次等多报改善，生理指标不一致，异质性大到无法元分析。作者要高质量长随访RCT。",
    body: "出处：Stuart SJ, Achury LK, Kline M, Bair MJ. J Pain Res. 2026. DOI 10.2147/JPR.S565238；PMC12912093。\n设计：scoping review，不是 meta-analysis。\n结果方向：疼痛强度与频率、疼痛部位数、耐受；多数研究中焦虑抑郁下降；压力下降；睡眠有的改善有的无。\n生理/生物标志物：不清晰。\n作者结论级别：appears promising；需要标准化干预与纵向随访的高质量随机试验。\n对外：可以放在证据金字塔中段「疼痛信号较一致」；不能说「已确认治疗慢性痛」。\n与 MECH-008 对齐：疼痛与心理福祉相对更一致，仍有研究缺口。",
    examples: [],
  }),
  makePoint({
    id: "KP-COM-016",
    title: "研究管线：医护PTSS漂浮试验在招募，没有结果可引用",
    category: "合规与风控",
    tags: ["NCT07710417", "PTSS", "在研", "红线"],
    audience: ["学术", "销售团队", "培训师"],
    usage: "training",
    durationMin: 3,
    scenarios: ["合规培训", "学术汇报"],
    location: "https://clinicaltrials.gov/study/NCT07710417",
    summary:
      "Laureate Institute NCT07710417（2026年启动招募）：一线医护/急救人员创伤应激症状，两次60分钟漂浮 vs 看纪录片，目标约15名完成者。这是前沿方向，不是证据。",
    body: "状态：RECRUITING（以 ClinicalTrials.gov 当时页面为准）。\n设计：单中心、早期、可行性/耐受/安全为主；最多约30人，计划保留15名完成者。\n禁止：说「最新研究证明漂浮治疗PTSD/医护职业耗竭」。\n可以讲：国际实验室仍在把 REST 推进到职业应激场景，说明品类被认真对待；我们等待结果。\n考核：在研试验有没有主终点结果？没有就不能进客户PPT。",
    examples: [],
  }),
  makePoint({
    id: "KP-COM-017",
    title: "B端一页纸：卫生用国际标准讲，不靠恐吓氯",
    category: "运营管理",
    tags: ["卫生", "NSF", "NAFTS", "尽调"],
    audience: ["采购", "B端客户", "工程实施"],
    usage: "pitch",
    durationMin: 4,
    scenarios: ["采购尽调", "B端提案", "参观讲解"],
    location: "对接 KP-WEB-004、KP-WEB-012",
    summary:
      "给客户的卫生通识：高镁溶液里氯溴不是主流推荐；UV/臭氧或组合是国际浮舱常见路径；用户间清洁循环要达到认证量级（约3-log）。细节检查单见 WEB-012，公司具体设备参数走公司层。",
    body: "一句话主张：卫生是经营信任，不是形容词。\n证据：North American Float Tank Standard / NSF/ANSI/CAN 50 方向——认证消杀系统在规定循环后对主舱细菌约 3-log 灭活；氯溴因测不准且未按浮舱用途注册，普遍不推荐。\n边界：具体臭氧残留、翻转次数以说明书与本地法规为准，不在口头锁死。\n邀请：看机房、看循环、看出舱后的清洁，而不是看宣传片。\n不要讲成：氯致癌所以必须买我们。改口：行业标准本来就不靠泳池氯方案。",
    examples: ["参观顺序：淋浴→舱沿→循环机→记录表"],
  }),
  makePoint({
    id: "KP-COM-018",
    title: "机制红线培训：主通路是REST卸载，不是输液式补镁或乳酸神话",
    category: "培训资料",
    tags: ["镁", "乳酸", "机制", "培训"],
    audience: ["培训师", "销售团队", "运动队"],
    usage: "training",
    durationMin: 4,
    scenarios: ["销售培训", "运动提案", "合规培训"],
    location: "对接 KP-WEB-005、KP-WEB-006",
    summary:
      "把两条最容易讲过头的机制收口：透皮补镁证据不足；血乳酸加速清除并不稳定。对外锁定「主观恢复 + 神经降噪 + 浮力卸载」。",
    body: "学习目标：运动/抗衰场景不把漂浮液讲成体外透析。\n不要讲成：矿物像生物导弹、乳酸清除快50–90%（除非有可追溯且已锁定的试验）。\n可以讲：高镁溶液提供浮力与皮肤接触；物理消杀减少化学刺激；主观疲劳/放松更常被报告。\n练习：教练追问生化表，改答「主观恢复更稳，生化指标研究不一致」。\n考核：能否指向 Gröber 2017 Nutrients 综述与库内乳酸冲突仲裁（WEB-005/006）。",
    examples: [],
  }),
];

const dataDir = path.join(process.cwd(), "data");
const kpPath = path.join(dataDir, "knowledge-points.json");
const sourcesPath = path.join(dataDir, "sources.json");

const existing = JSON.parse(readFileSync(kpPath, "utf-8"));
const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));

let stamped = 0;
for (const point of existing) {
  let changed = false;
  if (!point.layer) {
    point.layer = classifyLayer(point.id);
    changed = true;
  }
  if (!point.usage) {
    point.usage = classifyUsage(point.id);
    changed = true;
  }
  if (changed) {
    stamped += 1;
    point.updatedAt = now;
  }
}

const alreadyHasCom = existing.some((p) => p.id === "KP-COM-001");
let merged = existing;
if (!alreadyHasCom) {
  const ids = new Set(existing.map((p) => p.id));
  const toAdd = newPoints.filter((p) => !ids.has(p.id));
  merged = [...existing, ...toAdd];
  const idx = sources.findIndex((s) => s.id === sourceId);
  const record = {
    id: sourceId,
    filename: sourceFile,
    fileType: "other",
    uploadedAt: now,
    knowledgePointIds: toAdd.map((p) => p.id),
    status: "done",
    splitMode: "claude-agent",
    note: `${toAdd.length}条通识层：两层架构、培训vs汇报、WHO 2025、Atlas 2024、2025/2026 REST综述、在研试验红线。`,
  };
  if (idx >= 0) sources[idx] = record;
  else sources.push(record);
}

writeFileSync(kpPath, JSON.stringify(merged, null, 2) + "\n");
writeFileSync(sourcesPath, JSON.stringify(sources, null, 2) + "\n");

const commons = merged.filter((p) => p.layer === "commons").length;
const company = merged.filter((p) => p.layer === "company").length;
const usageCounts = merged.reduce((acc, p) => {
  acc[p.usage] = (acc[p.usage] || 0) + 1;
  return acc;
}, {});

console.log(
  JSON.stringify(
    {
      total: merged.length,
      stampedMissing: stamped,
      addedCom: alreadyHasCom ? 0 : newPoints.length,
      commons,
      company,
      usageCounts,
    },
    null,
    2
  )
);
