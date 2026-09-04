/**
 * 申请策略重排：母案框架退役，改按「相同或相应的特定技术特征」分组独立申请。
 * 并新增单一性/分案/公开充分/本国优先权的硬规则卡。
 * 幂等：PAT-BATCH-002 已存在则跳过。
 * 运行：node scripts/apply-patent-filing-strategy.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-04T20:00:00.000Z";
const srcFile = "申请策略-母案退役与分组";
const author = "申请策略复盘 2026-09-04（法条与条号请代理师核对，本卡不构成法律意见）";

const dataDir = path.join(process.cwd(), "data");
const patentsPath = path.join(dataDir, "patents.json");
const sourcesPath = path.join(dataDir, "patent-sources.json");

const cards = [
  {
    id: "PAT-RULE-007",
    kind: "rule",
    cluster: "cross",
    risk: "critical",
    loc: "专利法31条1款、26条3/4款、29条2款；实施细则分案条款",
    tags: ["硬规则", "单一性", "分案", "公开充分", "本国优先权"],
    techBranch: "撰写纪律",
    title: "硬规则：能不能合成一件不由我们决定，由「相同或相应的特定技术特征」决定；分案不得超出原申请记载范围",
    summary:
      "单一性是法定要求不是策略选择。分案能不能拆得出来，取决于母案说明书今天写了多少——而说明书能写多少，取决于今天有多少实测数据。",
    body:
      "四条硬约束，任何申请方案都必须先过：\n\n一、单一性（专利法第三十一条第一款）。一件发明专利申请应当限于一项发明；属于一个总的发明构思的两项以上发明，可以作为一件申请提出。实施细则进一步要求这些发明之间在技术上相互关联，含有一个或多个相同或相应的特定技术特征，而特定技术特征是指每一项发明作为整体考虑后对现有技术作出贡献的技术特征。注意落脚点是「对现有技术作出贡献的特征」——不是「都属于同一台设备」，也不是「都归同一个控制器管」。用同一台机器、共用一个状态机、写在同一份报告里，都不构成单一性。硬把没有共同特定技术特征的方案合成一件，结果是收到单一性审查意见后被迫分案，多花申请费与代理费并拖延授权。\n\n二、分案不得超出原申请记载范围（实施细则分案条款，2023 年修订后条号有变动，请代理师核对）。分案保留原申请日，但内容必须在原申请文件记载的范围之内。这意味着：母案说明书今天没写进去的东西，将来分不出来。所谓「先递一个大母案，以后慢慢拆」只有在说明书当下就写足的前提下才成立。\n\n三、公开充分与权利要求的支持（第二十六条第三款、第四款）。说明书应当对发明作出清楚、完整的说明，以所属技术领域的技术人员能够实现为准；权利要求书应当以说明书为依据。没有实测数据时，参数范围、阈值、配比只能靠猜，猜出来的数值既写不出可实现的技术方案，也支撑不了含数值限定的权利要求。这两款是驳回理由，也是无效理由。数据不足不是写作技巧问题。\n\n四、自家在先申请构成抵触申请（第二十二条第二款）。先提交的宽泛申请公开后，会成为自家后续改进案的在先技术或抵触申请。PAT-BATCH-001 已就此提醒过，PAT-RULE-006 又从使用公开的角度强化了一遍。抢先递一件占坑，代价是挡住自己后面所有真正有数据的好案。\n\n可用的两个正规工具，由代理师判断是否使用：\n\n本国优先权（第二十九条第二款）：自在先中国申请之日起十二个月内，可就相同主题提出新申请并要求优先权，把这十二个月内取得的数据补进说明书；在先申请视为撤回。适用于「怕被抢先但数据没齐」的处境。代价是十二个月是硬期限，到期数据仍不足则前一件白费。\n\n发明与实用新型同日申请（第九条第一款及相关规定）：同一申请人就同样的发明创造同日分别申请发明专利和实用新型专利的，实用新型先获授权且尚未终止、申请人声明放弃该实用新型的，可以授予发明专利权。装置类方案可借此更快形成可以今天拿出来的权利存量，回应独立审计第五级破洞。具体条件与放弃声明的时点请代理师确认。\n\n本卡不构成法律意见，条号请代理师核对现行文本。",
    examples: [
      "对：先问这几个方案有没有共同的、对现有技术作出贡献的特征；没有就分开递",
      "错：都装在同一台舱上，所以合成一件申请",
      "错：先递个大的占坑，数据以后补——分案不得超范围，补不进去",
    ],
    relatedIds: ["PAT-RULE-002", "PAT-RULE-006", "PAT-BATCH-001", "PAT-BATCH-002", "PAT-NO3-001"],
  },
  {
    id: "PAT-BATCH-002",
    kind: "roadmap",
    cluster: "cross",
    risk: "critical",
    loc: "申请策略 v2",
    tags: ["当前生效策略", "母案退役", "分组", "节奏", "数据门槛"],
    techBranch: "申请节奏",
    title: "母案框架退役：改按特定技术特征分成四组独立申请，按数据成熟度排队，不再讲母案带子案",
    summary:
      "不是「母案改平行」的路线选择。是母案的成立前提没了——四组之间没有共同的特定技术特征，且说明书写不足，母案的母字失去意义。",
    body:
      "为什么母案框架现在不成立，三条，任何一条单独就够：\n\n一、单一性上分不到一起。按 PAT-RULE-007，能否合案取决于是否存在相同或相应的特定技术特征，即各自对现有技术作出贡献的那个特征。现在库里四类方案的贡献点分别是：高盐工作液中氧化路径的时空分离与化学量准入（消杀）；以实测残余量为反馈的联合准入与联合优化（低刺激控制）；高盐液作为声耦合介质的阻抗与腔体模态处理（声耦合）；高盐液路多物理场稳定（原母案A）。这四个贡献点互不重叠。它们共用一台舱体、共用一个控制器、写在同一份报告里，都不构成单一性。硬合一件的结果是被要求分案，多花钱并拖延。\n\n二、母案的价值前提是说明书能一次写足，而我们一条实测数据都没有。分案不得超出原申请记载范围，所以母案说明书今天没写的将来分不出来。而清除速率、溴本底、余辉衰减曲线、本底三态、交叉影响矩阵、工作液声速曲线，GAP-004 至 GAP-006 列的全部条目一条都没做。没有数据的说明书同时踩第二十六条第三款与第四款。\n\n三、母案数量已经失控。原有 PAT-ROAD-A、PAT-ROAD-B 两件，本轮又出现 PAT-IDEA-037 与 PAT-IDEA-046 两个「母案候选」。四个母案等于没有母案。PAT-NO3-001 当初拒绝设立母案3 的四个条件（技术问题独立、技术特征独立、技术效果独立、原型与数据成熟），037 与 046 目前只满足前两条，第四条完全不满足。按同一把尺子，它们现在都不够格立为母案。\n\n新框架：四个申请组，各自独立，组内用从属权利要求做层次，不再使用母案与子案的说法。\n\n组一 液路与化学。原母案A 与 A1—A5，加消杀六条 PAT-IDEA-026 至 031。共同特定技术特征：高盐工作液的物理化学状态量作为运行准入与流路切换的依据。\n\n组二 残余量闭环控制。PAT-IDEA-046 为独权候选，037、041、047、048 为从权层次，042 的余辉准入挂在光通道下。共同特定技术特征：以实测残余量为反馈量、以联合优化与准入联锁为手段。这一组内部的共同特征是四组里最扎实的。\n\n组三 高盐声耦合。PAT-IDEA-049 为独权候选，050、032、033 为从权，051 传感可同时挂组二与组三。共同特定技术特征：高盐工作液作为声耦合介质时的阻抗设计与腔体模态处理。\n\n组四 测量可信度。原母案B 维持现状，见 PAT-ROAD-B。\n\n排队依据是数据门槛而不是重要性：\n\n第一梯队，数据门槛最低、不需要样机与新材料，只要传感器和时间——组二。所需数据仅为 GAP-006 第 6、7 条，即执行器三态本底实测与交叉影响矩阵两张表。测完即可撰写。这是目前最快能递的一组。\n\n第二梯队，数据决定生死，必须先测再决定要不要写——PAT-IDEA-027 溴酸盐（测不到溴则整条打掉）、042 余辉（两条曲线不相交则降级为说明书内容）、051 心冲击（解不出心动周期则收窄为仅呼吸相位）、049 阻抗（阻抗曲线与浮力窗口不相交则必须改独立匹配层方案）。这四条绝对不能先申请再补数据。\n\n第三梯队，需要样机——028 空舱气相、032 双相对消、050 腔体模态、组一的界面传递效率实测。\n\n组四按原节奏。\n\n件数仍按 PAT-BATCH-001 的原则由绿灯数量决定，不设硬指标。取消原「母案A与母案B同日提交」的安排中关于母案统领关系的表述；两件是否仍同日提交由代理师按抵触申请风险判断。\n\n如果确实存在被抢先的时间压力，正规工具是本国优先权而不是提前递一件写不实的大案，见 PAT-RULE-007。装置类另可考虑发明与实用新型同日申请，以更快形成可以今天拿出来的权利存量。\n\n本卡取代 PAT-BATCH-001 中与母案统领相关的部分，PAT-BATCH-001 关于不为凑数申请、自家在先公开会挡死后续案的判断继续有效。本卡不给出新颖性或创造性最终结论。",
    examples: [
      "对：先花最小成本测本底与交叉矩阵两张表，组二先递",
      "错：把消杀、降噪、降光、声耦合合成一件大母案递上去",
      "错：因为怕被抢先，先递一个没有数据的宽案占坑",
    ],
    relatedIds: [
      "PAT-RULE-007",
      "PAT-BATCH-001",
      "PAT-NO3-001",
      "PAT-ROAD-A",
      "PAT-ROAD-B",
      "PAT-MAP-006",
      "PAT-IDEA-046",
      "PAT-IDEA-049",
      "PAT-GAP-006",
    ],
  },
];

// 标题与摘要的改写与卡片插入分开判断，两边各自幂等。
const patch037 = {
  title:
    "组二从权：低刺激不是关灯关声，是五个通道的残余量被实测并闭环压到阈值以下，不达标不许进深度模式",
  summary:
    "组二（残余量闭环控制）的从权层次。按 PAT-NO3-001 的四条件，原型与数据尚未成熟，不立为独权。独权候选见 PAT-IDEA-046。",
};
const patch046 = {
  title: "组二独权候选：目标刺激的功率由实测本底反算，本底上升时先降本底而不是加大功率",
  summary:
    "组二（残余量闭环控制）的独权候选。按 PAT-BATCH-002，母案框架已退役。所需数据仅为本底三态与交叉影响矩阵两张表，是所有方向里门槛最低的一组。",
};

function card(item, prev) {
  return {
    id: item.id,
    kind: item.kind || "retrieved",
    title: item.title,
    summary: item.summary,
    body: item.body,
    tags: item.tags,
    cluster: item.cluster,
    risk: item.risk,
    publicationNo: item.publicationNo,
    jurisdiction: item.jurisdiction,
    techBranch: item.techBranch,
    relatedIds: item.relatedIds || [],
    examples: item.examples || [],
    source: { file: srcFile, location: item.loc || "内部策略", date: "2026-09", author },
    status: "approved",
    confidentiality: "internal",
    createdAt: prev?.createdAt || now,
    updatedAt: now,
  };
}

const patents = JSON.parse(readFileSync(patentsPath, "utf-8"));

const missing = cards.filter((c) => !patents.some((p) => p.id === c.id));
const built = missing.map((c) => card(c, null));

const patchTargets = { "PAT-IDEA-037": patch037, "PAT-IDEA-046": patch046 };
const patched = [];
const out = [...patents, ...built].map((p) => {
  const patch = patchTargets[p.id];
  if (!patch || p.title === patch.title) return p;
  patched.push(p.id);
  return { ...p, ...patch, updatedAt: now };
});

if (!built.length && !patched.length) {
  console.log("申请策略 v2 已入库且称谓已改写，跳过。总数:", patents.length);
  process.exit(0);
}

const ids = out.map((p) => p.id);
if (ids.length !== new Set(ids).size) {
  console.error("出现重复 id，已中止");
  process.exit(1);
}

writeFileSync(patentsPath, JSON.stringify(out, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const srcId = "SRC-PAT-FILING-STRATEGY";
const next = sources.filter((s) => s.id !== srcId);
next.push({
  id: srcId,
  filename: srcFile,
  cluster: "cross",
  fileType: "other",
  uploadedAt: now,
  patentIds: cards.map((c) => c.id),
  status: "done",
  splitMode: "claude-agent",
  note: "母案框架退役，改四组独立申请按数据门槛排队；单一性/分案不超范围/公开充分/本国优先权硬规则。",
});
writeFileSync(sourcesPath, JSON.stringify(next, null, 2) + "\n");

console.log(JSON.stringify({ inserted: built.map((c) => c.id), patched, total: out.length }, null, 2));
