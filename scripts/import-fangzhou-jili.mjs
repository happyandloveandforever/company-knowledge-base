/**
 * Claude 精细拆分：方舟机理.pdf（4页）
 * 追加写入，不覆盖已有知识点。
 * 运行：node scripts/import-fangzhou-jili.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = new Date().toISOString();
const sourceFile = "方舟机理.pdf";
const sourceId = "SRC-MECH-JILI";

const points = [
  {
    id: "KP-MECH-001",
    title: "漂浮方舟作用机理总览：减负—降噪—重置—整合",
    category: "技术知识",
    tags: ["作用机理", "flotation-REST", "总览"],
    audience: ["学术", "B端客户", "技术团队", "投资人"],
    summary: "漂浮方舟（flotation-REST）以低刺激环境与浮力支持为核心，作用路径可概括为「减负—降噪—重置—整合」。",
    body: "文件定位：漂浮方舟作用机理文件\n副标题：基于浮力减负、感官降噪与自主神经重置的综合机制阐释\n核心路径：减负 —— 降噪 —— 重置 —— 整合\n干预属性：整体状态调节型干预，而非单一靶点治疗",
    location: "摘要 / 第 1 页",
    durationMin: 4,
    scenarios: ["学术", "演讲", "B端提案", "培训"],
  },
  {
    id: "KP-MECH-002",
    title: "摘要证据定位：疼痛与心理福祉信号较一致",
    category: "技术知识",
    tags: ["系统综述", "证据", "异质性"],
    audience: ["学术", "B端客户", "投资人"],
    summary: "研究表明 flotation-REST 可能通过降低机械负荷、减少感官输入、调节自主神经与改善主观压力体验产生积极影响；2025–2026 综述显示疼痛与心理福祉信号较一致，睡眠与生物标志物仍有异质性。",
    body: "可能路径：降低机械负荷 · 减少感官输入 · 调节自主神经活动 · 改善主观压力体验\n可能获益域：疼痛、焦虑、情绪负荷、恢复质量\n2025–2026 系统综述/范围综述要点：\n· 浮疗对慢性疼痛与心理福祉的改善信号较为一致\n· 睡眠、生理指标及生物标志物结果仍存在异质性\n定位提示：更适合作为整体状态调节型干预，而非单一靶点治疗",
    location: "摘要 / 第 1 页",
    durationMin: 5,
    scenarios: ["学术", "演讲", "投资人"],
    examples: ["2025–2026 系统综述与范围综述"],
  },
  {
    id: "KP-MECH-003",
    title: "研究背景：REST 与漂浮方舟的实现形式",
    category: "技术知识",
    tags: ["REST", "研究背景", "低刺激"],
    audience: ["学术", "技术团队", "B端客户"],
    summary: "REST 强调降低外界刺激，使机体退出高唤醒、持续应激模式；漂浮方舟用高浮力盐水与封闭低刺激空间削弱视觉、听觉、触觉与姿势维持负担。",
    body: "REST（Restricted Environmental Stimulation Therapy）：通过降低外界刺激，使机体退出高唤醒、持续应激的工作模式。\n漂浮方舟作为 REST 典型实现：高浮力盐水 + 封闭式低刺激空间，最大限度削弱视觉、听觉、触觉与姿势维持等外部负担。\n设计目的：并非仅为「放松感」，而是让神经系统从持续外部应答中撤离，进入更适合恢复的内在调节状态。",
    location: "第 1 节 / 第 1 页",
    durationMin: 4,
    scenarios: ["学术", "培训", "演讲"],
  },
  {
    id: "KP-MECH-004",
    title: "第一层机理：浮力减负与机械去负荷",
    category: "技术知识",
    tags: ["浮力减负", "第一层", "慢性疼痛"],
    audience: ["学术", "B端客户", "技术团队", "销售团队"],
    summary: "浮力显著支持体重，关节、脊柱、筋膜和肌肉暂时退出对抗重力；去负荷降低本体感觉输入与防御性肌紧张，为神经系统松动创造前提。",
    body: "层级：第一层 · 浮力减负\n直接改变：机体所承受的重力与姿势控制压力\n组织效应：关节、脊柱、筋膜和肌肉不再持续对抗重力，长期紧张组织从机械性负荷中暂时退出\n适用人群提示：慢性疼痛、肌筋膜紧张、姿势性疲劳及高压职业人群尤为重要\n后续意义：降低本体感觉输入与防御性肌紧张，为后续神经系统松动创造前提",
    location: "第 2 页",
    durationMin: 5,
    scenarios: ["学术", "B端提案", "培训", "客户演示"],
  },
  {
    id: "KP-MECH-005",
    title: "第二层机理：感官降噪与注意转向内感受",
    category: "技术知识",
    tags: ["感官降噪", "第二层", "REST"],
    audience: ["学术", "B端客户", "技术团队"],
    summary: "REST 关键是减少大脑必须处理的感官信息量；低光、低噪声、低触觉与低空间定向刺激使注意从外部扫描转向内部感受。",
    body: "层级：第二层 · 感官降噪\n关键：不是「少做事」，而是减少大脑必须处理的感官信息量\n手段：低光、低噪声、低触觉、低空间定向刺激，显著削弱外界传入信号\n注意转向：从外部扫描转向内部感受\n主观体验：更深层宁静、时间感减弱、身体边界感模糊、心身松沉\n系统效应：持续维持警觉的感觉整合系统被逐步安静下来",
    location: "第 2 页",
    durationMin: 5,
    scenarios: ["学术", "演讲", "培训", "B端提案"],
  },
  {
    id: "KP-MECH-006",
    title: "第三层机理：自主神经从交感应激切至副交感修复",
    category: "技术知识",
    tags: ["自主神经", "第三层", "副交感"],
    audience: ["学术", "B端客户", "技术团队", "销售团队"],
    summary: "感官输入下降与肌肉防御松解后，更易从交感神经主导的应激模式切换至副交感主导的修复模式，资源分配给循环、消化、睡眠、免疫与组织恢复。",
    body: "层级：第三层 · 自主神经重置\n切换：交感神经主导的应激模式 → 副交感神经主导的修复模式\n意义：机体不再优先「应对外界」，开始分配资源给循环、消化、睡眠、免疫与组织恢复\n研究提示：flotation-REST 与焦虑减轻、压力下降、情绪稳定和睡眠改善相关\n定位：可作为自主神经再平衡工具",
    location: "第 2–3 页",
    durationMin: 5,
    scenarios: ["学术", "B端提案", "演讲", "培训"],
  },
  {
    id: "KP-MECH-007",
    title: "第四层机理：脑状态整合与 theta/alpha 变化",
    category: "技术知识",
    tags: ["脑状态", "第四层", "EEG", "theta", "alpha"],
    audience: ["学术", "技术团队", "B端客户"],
    summary: "低刺激条件下 EEG 显示 theta 与 alpha 活动可显著变化，提示大脑进入更内在、更整合的活动状态，有助于情绪加工、内感受重建与自我调节。",
    body: "层级：第四层 · 脑状态整合\nEEG 线索：theta 与 alpha 活动在放松、冥想与感官输入降低时可出现显著变化\n机制含义：促使大脑进入更内在、更整合的活动状态\n功能收益：情绪加工、内感受重建、自我调节能力恢复\n体验现象解释：部分体验者出现灵感涌现、记忆浮现或情绪松动",
    location: "第 3 页",
    durationMin: 5,
    scenarios: ["学术", "演讲", "培训"],
  },
  {
    id: "KP-MECH-008",
    title: "第五层机理：疼痛与心理福祉的证据最一致",
    category: "技术知识",
    tags: ["疼痛", "心理福祉", "第五层", "系统综述"],
    audience: ["学术", "B端客户", "投资人", "销售团队"],
    summary: "证据最一致地支持浮疗在疼痛与心理福祉方面的价值；2025 年系统综述（63 项研究、约 1838 人）总体积极；2026 范围综述多数改善疼痛与焦虑抑郁指标，但生理标志物尚不一致。",
    body: "层级：第五层 · 疼痛与心理福祉\n2025 系统综述：纳入 63 项研究、约 1,838 名参与者；flotation-REST 在疼痛、压力、心理健康和临床焦虑方面总体呈积极结果\n2026 范围综述：8 项纳入研究中，多数在疼痛强度、疼痛位置数量、疼痛耐受和焦虑抑郁指标上观察到改善\n异质性：生理与生物标志物结果尚不一致\n机制定位：作用更偏整体调节，而非单一路径干预",
    location: "第 3 页",
    durationMin: 6,
    scenarios: ["学术", "投资人", "B端提案", "演讲"],
    examples: ["2025 系统综述：63 项 / ~1838 人", "2026 范围综述：8 项研究"],
  },
  {
    id: "KP-MECH-009",
    title: "第六层机理：分子氢辅助的氧化压力支持",
    category: "技术知识",
    tags: ["分子氢", "第六层", "氧化压力", "抗氧化"],
    audience: ["学术", "技术团队", "B端客户"],
    summary: "若漂浮系统配合分子氢，机制可扩展到氧化压力管理；分子氢具有选择性抗氧化，尤其作用于羟自由基和过氧亚硝酸盐，并具抗炎、抗凋亡与调节能量代谢潜力。",
    body: "层级：第六层 · 氧化压力支持（可选扩展）\n条件：漂浮系统配合分子氢相关支持\n分子氢特性：选择性抗氧化，尤其可作用于羟自由基和过氧亚硝酸盐等高反应性氧化分子；兼具抗炎、抗凋亡和调节能量代谢潜力\n严谨表述：在漂浮所创造的低负荷状态中，氢分子等辅助因素可帮助降低氧化应激，为组织恢复提供更稳定的内环境",
    location: "第 3–4 页",
    durationMin: 5,
    scenarios: ["学术", "技术讲解", "B端提案"],
  },
  {
    id: "KP-MECH-010",
    title: "六层机理递进关系：由外而内的恢复链条",
    category: "技术知识",
    tags: ["六层机理", "递进", "框架"],
    audience: ["学术", "销售团队", "B端客户", "全员"],
    summary: "六层机理按由外而内递进：浮力减负→感官降噪→自主神经重置→脑状态整合→疼痛与心理福祉→（可选）氧化压力支持。",
    body: "递进链条：\n1. 浮力减负（机械去负荷）\n2. 感官降噪（减少传入）\n3. 自主神经重置（交感→副交感）\n4. 脑状态整合（theta/alpha 与内感受）\n5. 疼痛与心理福祉（证据最一致的临床获益域）\n6. 氧化压力支持（分子氢等辅助，扩展内环境稳定性）\n销售/培训可用一句话：先卸掉身体负担，再关掉外界噪音，然后让神经切换到修复档，最后整合脑状态与情绪—疼痛系统。",
    location: "全书结构",
    durationMin: 4,
    scenarios: ["销售培训", "演讲", "培训", "B端提案"],
  },
  {
    id: "KP-MECH-011",
    title: "结论：由外而内递进，证据边界与研究缺口",
    category: "技术知识",
    tags: ["结论", "RCT", "研究缺口"],
    audience: ["学术", "投资人", "B端客户"],
    summary: "机制是由外而内的递进过程；证据最支持疼痛缓解、焦虑减轻与整体心理福祉；仍需更多高质量 RCT、标准化方案与长期随访明确疗效边界。",
    body: "机制总结：解除机械负荷 → 削弱感官输入 → 重置自主神经 → 促成脑状态整合与情绪—疼痛系统再平衡\n证据最支持：疼痛缓解、焦虑减轻、整体心理福祉改善\n研究仍需：更多高质量随机对照试验、标准化干预方案、长期随访，以明确疗效边界与稳定性",
    location: "第 9 节 / 第 4 页",
    durationMin: 4,
    scenarios: ["学术", "投资人", "演讲"],
  },
  {
    id: "KP-MECH-012",
    title: "关键文献锚点：flotation-REST 与分子氢综述",
    category: "培训资料",
    tags: ["参考文献", "GAD", "慢性疼痛", "分子氢"],
    audience: ["学术", "技术团队", "销售团队"],
    summary: "机理文件引用 flotation-REST 治疗广泛性焦虑的 RCT 试点、系统综述、范围综述、慢性疼痛可行性 RCT，以及分子氢抗氧化与营养治疗综述。",
    body: "代表性文献方向（文件所列）：\n1. flotation-REST 治疗广泛性焦虑障碍（GAD）的随机对照试点试验\n2. flotation-REST 综合系统综述\n3. flotation-REST 范围综述（Scoping Review）\n4. floatation-REST 用于慢性疼痛的安全性与可行性 RCT\n5–7. 分子氢作为治疗性抗氧化剂 / 新型营养疗法 / 抗氧化获益综述\n用途：对外学术沟通、方案背书与合规话术时引用证据层级，避免过度医疗宣称",
    location: "参考文献 / 第 4 页",
    durationMin: 4,
    scenarios: ["学术", "培训", "合规审核"],
    examples: [
      "GAD flotation-REST RCT pilot",
      "flotation-REST systematic review",
      "flotation-REST scoping review 2026",
      "chronic pain floatation-REST RCT",
      "molecular hydrogen antioxidant reviews",
    ],
  },
  {
    id: "KP-MECH-013",
    title: "对客话术：用六层机理解释「为什么有效」",
    category: "销售技巧",
    tags: ["销售话术", "机理", "B端"],
    audience: ["销售团队", "新人", "B端客户"],
    summary: "向客户解释效果时，可按六层递进讲清：先减负、再降噪、再切副交感、再整合脑状态，证据最硬的是疼痛与心理福祉；分子氢是可选增强，不替代主体机制。",
    body: "推荐对客顺序：\n1. 你不是「多休息一下」——身体一直在对抗重力、处理噪音（痛点）\n2. 浮力先把机械负担卸掉（第一层）\n3. 低刺激环境让大脑少处理外界信息（第二层）\n4. 神经从「打仗」切到「修复」（第三层）\n5. 脑电与内感受进入更整合状态（第四层）\n6. 文献里最一致的改善是疼痛与心理福祉（第五层）\n7. 若系统含分子氢，可额外支持氧化压力管理（第六层，辅助）\n注意：表述为整体状态调节，不承诺单一疾病治愈。",
    location: "全书应用",
    durationMin: 5,
    scenarios: ["销售培训", "B端提案", "客户演示"],
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
    date: "2026-08",
    author: "中友瑞水（北京）科技有限公司",
  },
  scenarios: p.scenarios || ["学术", "演讲"],
  durationMin: p.durationMin,
  version: "1.0",
  status: "draft",
  createdAt: now,
  updatedAt: now,
}));

const dataDir = path.join(process.cwd(), "data");
const kpPath = path.join(dataDir, "knowledge-points.json");
const sourcesPath = path.join(dataDir, "sources.json");

const existing = JSON.parse(readFileSync(kpPath, "utf-8"));
if (existing.some((p) => p.id === "KP-MECH-001")) {
  console.log("方舟机理知识点已存在，跳过。当前总数:", existing.length);
  process.exit(0);
}

const merged = [...existing, ...knowledgePoints];
writeFileSync(kpPath, JSON.stringify(merged, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const filtered = sources.filter((s) => s.id !== sourceId);
filtered.push({
  id: sourceId,
  filename: sourceFile,
  fileType: "pdf",
  uploadedAt: now,
  knowledgePointIds: knowledgePoints.map((p) => p.id),
  status: "done",
  splitMode: "claude-agent",
  note: `Cursor Claude 精细拆分，4页→${knowledgePoints.length}个知识点（作用机理）`,
});
// 同步品牌来源 ID 列表与实际知识点（用户可能已删除 KP-BRAND-002）
const brandSrc = filtered.find((s) => s.id === "SRC-BRAND-BROCHURE");
if (brandSrc) {
  brandSrc.knowledgePointIds = merged
    .filter((p) => p.id.startsWith("KP-BRAND-"))
    .map((p) => p.id);
  brandSrc.note = `Cursor Claude 精细拆分，38页→${brandSrc.knowledgePointIds.length}个知识点（品牌画册）`;
}
writeFileSync(sourcesPath, JSON.stringify(filtered, null, 2) + "\n");

console.log(`Imported ${knowledgePoints.length} from ${sourceFile}`);
console.log(`Total: ${merged.length}`);
