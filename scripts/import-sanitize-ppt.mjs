/**
 * Claude 精细拆分：消杀.pptx（26页）
 * 运动恢复 + 绿色/物理消杀 + 多矿物配方。含设计口径与未锁死对比表。
 * 追加写入，不覆盖。运行：node scripts/import-sanitize-ppt.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = new Date().toISOString();
const sourceFile = "消杀.pptx";
const sourceId = "SRC-SANITIZE-PPT";

const points = [
  {
    id: "KP-SAN-001",
    title: "消杀PPT定位：竞技恢复下半场与主动干预",
    category: "市场营销",
    tags: ["消杀", "运动恢复", "竞技体育", "构想设计"],
    audience: ["运动队", "B端客户", "销售团队"],
    summary:
      "材料主张：现代竞技是恢复速度的竞争；按摩冰浴难及神经中枢深度放松；漂浮用高浓度硫酸镁创造高浮力、恒温、零压力环境。",
    body: "开篇卖点：从血乳酸清除到高质量睡眠的主动干预\n竞技判断：下半场比的是恢复速度，不只是训练强度\n传统局限：按摩、拉伸、冰浴多为被动，难触及神经中枢深度放松\n方法素描：约 500kg 硫酸镁（Epsom Salt）溶液 → 高浮力、恒温、零压力\n听众：教练、训练中心、运动康复（材料含宁夏中心话术，通用场合去掉地名）",
    location: "第 1–2 页",
    durationMin: 3,
    scenarios: ["运动提案", "演讲", "B端提案"],
  },
  {
    id: "KP-SAN-002",
    title: "生化修复叙事：循环、皮质醇、DOMS与镁",
    category: "技术知识",
    tags: ["乳酸", "皮质醇", "DOMS", "硫酸镁"],
    audience: ["运动队", "学术", "销售团队"],
    summary:
      "材料把恢复写成物理+化学：零压力外周血管舒张、降皮质醇与肾上腺素、镁缓解 DOMS。属讲法，须与已有文献原子对照。",
    body: "材料三句：\n1 循环：零压力下外周血管舒张，提高氧输送\n2 应激激素：降皮质醇、肾上腺素，逆转大强度后的分解代谢\n3 消炎镇痛：硫酸镁与迟发性肌肉酸痛（DOMS）的生化叙事\n对外：可以讲「卸载 + 矿物环境 + 神经降噪」组合\n不要把每一句都说成已完成的本公司随机对照",
    location: "第 3 页",
    durationMin: 3,
    scenarios: ["运动提案", "销售培训"],
  },
  {
    id: "KP-SAN-003",
    title: "材料中的血乳酸对比表（须标注口径）",
    category: "技术知识",
    tags: ["乳酸", "实验", "冲突", "运动恢复"],
    audience: ["学术", "销售团队", "运动队"],
    summary:
      "PPT 给出漂浮组 vs 被动休息的乳酸表（15/30/60min 更快下降，宣称 50–90% 更快、45min 回基线）。与论文原子 MEV-021「乳酸未必更快」冲突，对外必须二选一或并陈。",
    body: "材料表（未在本库核验原始数据）：\n运动即刻 Peak：漂浮 12.50 vs 被动 12.70 mmol/L（无差异）\n15 min：8.20 vs 10.10（P<0.05）\n30 min：4.50 vs 7.20（P<0.01）\n60 min：1.80 vs 4.50（材料称极显著）\n设定：职业运动员 HIIT 后；峰值 10–14 mmol/L；A 组即刻漂浮 45–60min，B 组平卧\n材料解读：60min 内清除快约 50–90%；漂浮约 45min 回基线（<2.0），被动常要 90–120min；RPE 心理恢复快于生理\n引用页提到：Morgan et al., 2013, J Sports Sciences（偏心运动后 REST 急性效应）\n冲突：KP-MEV-021（Driller）称主观恢复升、血乳酸清除无显著加速\n纪律：同一份对外稿不得同时断言「快 50–90%」和「乳酸无差异」而不加出处",
    location: "第 4–5 页",
    durationMin: 5,
    scenarios: ["学术汇报", "合规培训", "运动提案"],
    examples: ["诚实讲法：主观恢复常被报告改善；乳酸是否更快，文献并不一致，我们不把单表写成行业定律。"],
  },
  {
    id: "KP-SAN-004",
    title: "内分泌硬重启：20分钟肾上腺素、45分钟皮质醇",
    category: "技术知识",
    tags: ["皮质醇", "HPA", "肾上腺素", "运动恢复"],
    audience: ["运动队", "学术", "销售团队"],
    summary:
      "材料时间轴：>20min 肾上腺素约减半；45min 皮质醇降 20% 以上，合成代谢窗口提前。并引用 Suedfeld 一次 60min 皮质醇 -21.6% vs 平卧 -1.5%。",
    body: "材料时间轴（设计/汇编口径）：\n- >20min：肾上腺素「腰斩」，交感强制待机\n- 45min：皮质醇显著跌落（-20% 以上），合成代谢窗口提前\n价值句：缩短从极度疲劳到超量恢复的周期\nSuedfeld 皮质醇对照（材料转述）：一次 60min 漂浮平均 -21.6%；安静平卧 -1.5%\n结论句：不只是物理休息，而是经 HPA 关闭应激\n对接：与 KP-BG2-036、KP-MEV-012 同类，对外优先用「有研究观察到皮质醇下降」，百分比锁定一套口径",
    location: "第 6–7 页",
    durationMin: 4,
    scenarios: ["运动提案", "学术汇报", "演讲"],
  },
  {
    id: "KP-SAN-005",
    title: "儿茶酚胺与T/C比值的运动恢复叙事",
    category: "技术知识",
    tags: ["肾上腺素", "睾酮", "过度训练", "构想设计"],
    audience: ["运动队", "学术", "销售团队"],
    summary:
      "材料给训练后即刻 vs 漂浮 60min 的肾上腺素/去甲肾上腺素/STAI 表，并称定期漂浮使 T/C 更快回升、合成代谢提前 12–24 小时。",
    body: "材料监测表（模拟/汇编，须标注非锁死原始实验）：\n肾上腺素 0.45 → 0.22 nmol/L（约 -50%）\n去甲肾上腺素 2.80 → 1.65 nmol/L（约 -41%）\nSTAI 高位 → 低位（下降 30% 以上）\n机制讲法：皮质醇促分解；降皮质醇=从战斗切到修复\nT/C：过度训练监测关键；材料称定期漂浮使 T/C 更快回升，合成代谢比常规休息提前 12–24h\n奖赏叙事：内啡肽/多巴胺缓解大强度后的暴躁低落\n对外：机制可讲，精确 nmol 与「提前 12–24h」未锁死前不要当官方成绩",
    location: "第 8–9 页",
    durationMin: 4,
    scenarios: ["运动提案", "销售培训"],
  },
  {
    id: "KP-SAN-006",
    title: "多矿物配方：从单盐到镁钾锌硒协同",
    category: "产品知识",
    tags: ["漂浮液", "镁", "DOMS", "配方"],
    audience: ["运动队", "采购", "销售团队"],
    summary:
      "材料称方舟从单盐进化到多矿物协同（Mg+K/Zn/Se 等）：镁做电解质与钙拮抗，微量元素服务肌纤维修复与降 CK 渗漏。属产品设计口径。",
    body: "设计主张：Magnesium + Synergistic Minerals 全路径干预肌纤维\n镁：电解质平衡、钙拮抗、强制肌肉放松\n特种微量元素：修补微裂纹、胶原合成、降低 CK 渗漏（材料表述）\n生化优势句：渗透压更接近自然修复，而非单纯脱水\n对接生命元炁：通用款/加强型已有参数卡；本条是运动恢复话术层\n禁止把「全路径干预」说成已注册药品功能",
    location: "第 10 页",
    durationMin: 3,
    scenarios: ["运动提案", "产品培训"],
  },
  {
    id: "KP-SAN-007",
    title: "绿色消杀核心：去掉氯溴才能让矿物被吸收",
    category: "产品知识",
    tags: ["绿色消杀", "物理消杀", "氯", "透皮"],
    audience: ["运动队", "B端客户", "销售团队"],
    summary:
      "核心竞争叙事：化学消杀干扰离子、刺激皮肤；纯物理/绿色消杀保留矿物活性，材料称离子渗透提升约 40–60%。",
    body: "传统代价（材料）：\n- 氯/臭氧残余干扰离子交换，氯与矿物结合降活性\n- 化学物诱发皮肤微观炎症，占用修复资源\n绿色消杀逻辑链：\n1 排除干扰：氯溴强氧化剂使矿物沉淀/络合失活\n2 分子通道：无化学侵蚀时离子通道更自然，透皮吸收更深\n3 对比句：传统=物理放松；特效配方=「生物化学水平的精准灌注」（设计金句）\n材料数字：离子渗透率较传统提升约 40–60%（未锁死，对外用「材料口径」）\n工程对接：与 KP-CHAMP-017 臭氧/紫外/光触媒物理消杀一致，不要另编一套工艺",
    location: "第 11、14 页",
    durationMin: 4,
    scenarios: ["运动提案", "B端提案", "产品培训"],
  },
  {
    id: "KP-SAN-008",
    title: "CK/CRP对比模型：标明是动力学整理而非铁证",
    category: "合规与风控",
    tags: ["CK", "对比表", "口径", "DOMS"],
    audience: ["销售团队", "学术", "管理者"],
    summary:
      "PPT 用「生物利用度与 DOMS 动力学模型整理」对比方舟多矿物+绿色消杀 vs 传统镁+氯溴 vs 静态休息。CK -72% 等数字不得当已发表 RCT。",
    body: "材料三臂：特效方舟（Mg/K/Zn/Se+绿色消杀）｜传统镁+氯/溴｜静态休息\n材料数字：\n- CK 降幅：-72% / -35% / -12%\n- hs-CRP：显著降低 / 轻度降低 / 持续高位\n- 透皮吸收：1.80 vs 0.70 mg/cm²/h\n- Myoton 肌肉硬度评分：95% / 78% / 60%\n页眉写明：基于模型整理\n红线：禁止对教练说「我们有 RCT 证明 CK 降 72%」\n可用：这是内部对比模型，用来解释「消杀方式会改变恢复环境」",
    location: "第 12 页",
    durationMin: 4,
    scenarios: ["合规培训", "销售培训", "学术汇报"],
  },
  {
    id: "KP-SAN-009",
    title: "教练话术：体外生化透析与告别DOMS",
    category: "销售技巧",
    tags: ["话术", "教练", "绿色消杀"],
    audience: ["销售团队", "运动队"],
    summary:
      "材料金句：不只是浮力，是体外生化透析；传统像加漂白粉的池子；绿色消杀去干扰，60 分钟恢复深度称 1.5 倍以上。须降调绝对化。",
    body: "可用骨架：\n- 我们给的不只是浮力，是一次干净的矿物环境\n- 化学消杀让身体边吸镁边对抗刺激\n- 绿色消杀去掉生化干扰\n须降调：\n× 生物导弹毫无阻碍\n× 彻底告别 DOMS\n× 恢复深度铁定 1.5 倍（可改成「材料对比模型显示更高恢复深度」）\n场景：训练中心口头，不进政府公文",
    location: "第 13 页",
    durationMin: 3,
    scenarios: ["销售培训", "运动提案"],
  },
  {
    id: "KP-SAN-010",
    title: "微蓝无菌：物理消杀的视觉表征",
    category: "产品知识",
    tags: ["微蓝", "物理消杀", "纯净度", "构想设计"],
    audience: ["运动队", "B端客户", "销售团队"],
    summary:
      "材料称自然光下微蓝来自极度纯净与有序矿物的瑞利散射，代表零有机污染、零化学抗药菌；发黄暗示杂质或氧化。属品牌视觉叙事。",
    body: "行业对照（材料）：多数漂浮液无色或淡黄；淡黄常被解释为有机残留、代谢物、药剂氧化\n方舟主张：无菌级别 + 纯物理消杀\n微蓝：自然光微微发蓝 = 纯净与有序（瑞利散射）的物理现象叙事\n对外可用：让客户看见液体状态，把卫生做成可见信任\n禁止：把颜色说成国际标准认证本身；「全球唯一/最高表征」需有依据再锁死",
    location: "第 15 页",
    durationMin: 3,
    scenarios: ["运动提案", "B端提案", "客户演示"],
  },
  {
    id: "KP-SAN-011",
    title: "运动员安全：药检、呼吸道与皮肤屏障",
    category: "合规与风控",
    tags: ["药检", "三卤甲烷", "皮肤", "物理消杀"],
    audience: ["运动队", "采购", "销售团队"],
    summary:
      "材料强调化学消杀副产物（THMs、氯胺）可能入血、刺激呼吸道、破坏皮脂；物理消杀零残留，适合皮肤有微伤的运动员。",
    body: "皮肤是吸收器官：漂浮时副交感、θ 波，材料称吸收率是游泳时 3–5 倍（设计口径）\n因此消杀剂比泳池更关键：高盐（比重约 1.28）会放大氯的脱水/氧化\n化学侧风险（材料）：三卤甲烷、氯胺；剥蚀油脂；刺激呼吸道与结膜\n物理侧主张：零有害副产物、保皮脂、只吸矿物、无味深呼吸\n药检话术：避开不必要代谢负担与潜在干扰（不要说「已通过某赛事官方认证」除非有证）\n对接冠军系列兴奋剂检测页：两套材料可互相引用，数字仍以证书为准",
    location: "第 16–17、19 页",
    durationMin: 5,
    scenarios: ["运动提案", "采购尽调", "合规培训"],
  },
  {
    id: "KP-SAN-012",
    title: "训练中心现场讲法：只吸营养不吸毒素",
    category: "销售技巧",
    tags: ["话术", "宁夏", "微蓝", "国家级"],
    audience: ["销售团队", "运动队"],
    summary:
      "材料为宁夏体育训练管理中心写的口头稿：微蓝是门槛，发黄是常态；纯净度即战斗力。通用场合删除地名与「全球唯一」。",
    body: "现场逻辑：发黄常态、无色已是上限、微蓝是我们要的可见纯净\n金句降调版：让皮肤只做一件事——优先吸收矿物，而不是同时扛化学副产物\n通用化：把「宁夏中心/国家级门槛」换成「严肃训练基地的卫生门槛」\n不要用：全球唯一、对运动员身体的主动致敬（可改成「把卫生当成成绩的一部分」）",
    location: "第 18 页",
    durationMin: 3,
    scenarios: ["销售培训", "运动提案"],
  },
  {
    id: "KP-SAN-013",
    title: "神经层：微蓝先验、无味深呼吸与矿物洗脑隐喻",
    category: "技术知识",
    tags: ["Theta", "微蓝", "镁", "构想设计"],
    audience: ["运动队", "销售团队", "学术"],
    summary:
      "材料把消杀接到神经：微蓝缩短入定 5–10 分钟；无氯臭利于腹式呼吸维持 θ；镁/钾/锂硒参与递质平衡。后半段是设计隐喻。",
    body: "可用：\n- 干净的蓝色降低心理排斥，更快进入安静\n- 无刺激气味，才敢深呼吸，利于 REST/θ 状态\n- 镁降低神经兴奋性是通识方向\n须标构想：下丘脑预分泌内啡肽、锂硒稳定情绪、活性矿物「更高效过血脑屏障」「化学洗礼」\n对外删：化学洗礼、微循环过血脑屏障的确定语气",
    location: "第 22 页",
    durationMin: 3,
    scenarios: ["演讲", "销售培训"],
  },
  {
    id: "KP-SAN-014",
    title: "Theta一键重启：中枢疲劳、意象训练、赛前杏仁核",
    category: "技术知识",
    tags: ["Theta", "意象训练", "赛前焦虑", "构想设计"],
    audience: ["运动队", "销售团队"],
    summary:
      "材料：θ 重置中枢疲劳；漂浮中可视化效果称平时 3–5 倍；下调杏仁核保决策。含「1 小时漂浮≈4 小时深睡」卖点，须标构想。",
    body: "实战三句（可讲方向）：\n1 中枢疲劳：脑子想动身体跟不上 → REST 给神经系统降频\n2 意象训练：低干扰下做动作回放\n3 赛前：降过度唤醒，服务冷静决策\n必须降调：\n× 1 小时漂浮 = 4 小时深度睡眠（改：材料卖点，不是睡眠医学等式）\n× 模拟训练效果铁定 3–5 倍\n× 确保冷酷精准决策\n周期应用（第25页，较实）：大强度日后 2h 内偏代谢；伤病期只作无负重活动构想且不替代康复；减量周偏神经；赛期偏快速消疲劳",
    location: "第 23–25 页",
    durationMin: 4,
    scenarios: ["运动提案", "销售培训"],
  },
  {
    id: "KP-SAN-015",
    title: "消杀PPT收束：案例Q&A与星舟测试邀请",
    category: "市场营销",
    tags: ["星舟", "Q&A", "案例"],
    audience: ["销售团队", "运动队"],
    summary:
      "材料建议分享国际运动员漂浮习惯、回答安全/频率/操作，并邀请参与「渡忘星舟」专业测试、建恢复档案。案例须可核对再点名。",
    body: "收束动作：\n1 案例：国际顶尖运动员漂浮习惯——点名（如库里）前确认公开信息，避免虚构代言\n2 Q&A：安全、频率、操作难度（对接 KP-CRAFT-017、消杀工程 SOP）\n3 下一步：渡忘星舟专业测试 + 运动员恢复档案（与实验方案文档衔接）\n定位：这是运动线讲稿，不是医院适应症清单",
    location: "第 26 页",
    durationMin: 2,
    scenarios: ["运动提案", "销售培训"],
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
    author: "中友瑞水（北京）科技有限公司 / 运动恢复消杀材料",
  },
  scenarios: p.scenarios || ["运动提案", "销售培训"],
  durationMin: p.durationMin,
  version: "1.0",
  status: "draft",
  createdAt: now,
  updatedAt: now,
  conflictNote:
    p.id === "KP-SAN-003"
      ? "与 KP-MEV-021 乳酸结论不一致，对外须并陈或只选一套。"
      : "含设计口径与未锁死对比表，数字须标注材料口径。",
}));

const dataDir = path.join(process.cwd(), "data");
const kpPath = path.join(dataDir, "knowledge-points.json");
const sourcesPath = path.join(dataDir, "sources.json");
const existing = JSON.parse(readFileSync(kpPath, "utf-8"));
if (existing.some((p) => p.id === "KP-SAN-001")) {
  console.log("消杀PPT已存在，跳过。总数:", existing.length);
  process.exit(0);
}
const merged = [...existing, ...knowledgePoints];
writeFileSync(kpPath, JSON.stringify(merged, null, 2) + "\n");
const sources = JSON.parse(readFileSync(sourcesPath, "utf-8")).filter((s) => s.id !== sourceId);
sources.push({
  id: sourceId,
  filename: sourceFile,
  fileType: "pptx",
  uploadedAt: now,
  knowledgePointIds: knowledgePoints.map((p) => p.id),
  status: "done",
  splitMode: "claude-agent",
  note: `26页运动消杀PPT→${knowledgePoints.length}条。乳酸表与MEV-021冲突已标注。`,
});
writeFileSync(sourcesPath, JSON.stringify(sources, null, 2) + "\n");
console.log(`Imported ${knowledgePoints.length} from ${sourceFile}`);
console.log(`Total: ${merged.length}`);
