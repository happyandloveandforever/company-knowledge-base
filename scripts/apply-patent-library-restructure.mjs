/**
 * 专利库重构：给每张卡标 lifecycle（现行/已取代/已打掉/待重估）与 group（四个申请组），
 * 修掉母案框架退役后遗留的自相矛盾，并新增唯一入口索引卡与合并实验清单。
 * 幂等：插入与改写分开判断，两边各自可重复运行。
 * 运行：node scripts/apply-patent-library-restructure.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-04T21:00:00.000Z";
const srcFile = "专利库重构-生命周期与分组";
const author = "全库审计与重构 2026-09-04";

const dataDir = path.join(process.cwd(), "data");
const patentsPath = path.join(dataDir, "patents.json");
const sourcesPath = path.join(dataDir, "patent-sources.json");

// ---------------------------------------------------------------------------
// 1. 生命周期与分组：逐张显式指定，不靠猜。未列出的按下方兜底规则。
// ---------------------------------------------------------------------------

/** 已被更新结论取代，保留做档案；值为取代它的卡。 */
const SUPERSEDED = {
  "PAT-MAP-001": "PAT-INDEX-001",
  "PAT-MAP-002": "PAT-INDEX-001",
  "PAT-MAP-003": "PAT-INDEX-001",
  "PAT-MAP-004": "PAT-MAP-005",
  "PAT-MAP-005": "PAT-MAP-006",
  "PAT-CLU-001": "PAT-BATCH-002",
  "PAT-CLU-002": "PAT-BATCH-002",
  "PAT-CLU-003": "PAT-BATCH-002",
  "PAT-CLU-004": "PAT-BATCH-002",
  "PAT-CLU-005": "PAT-BATCH-002",
  "PAT-CLU-006": "PAT-BATCH-002",
  "PAT-BATCH-001": "PAT-BATCH-002",
  "PAT-NO3-001": "PAT-BATCH-002",
  "PAT-WRITE-001": "PAT-BATCH-002",
  "PAT-NEXT-001": "PAT-BATCH-002",
  "PAT-EXT-001": "PAT-EXT-002",
  "PAT-IDEA-020": "PAT-IDEA-031",
  "PAT-IDEA-021": "PAT-IDEA-046",
  "PAT-GAP-001": "PAT-GAP-007",
  "PAT-GAP-002": "PAT-GAP-007",
  "PAT-GAP-003": "PAT-GAP-007",
};

/** 明确否定，不要再投入。 */
const KILLED = new Set([
  "PAT-IDEA-001",
  "PAT-IDEA-005",
  "PAT-IDEA-017",
  "PAT-IDEA-022",
  "PAT-IDEA-023",
  "PAT-IDEA-024",
  "PAT-IDEA-025",
  "PAT-IDEA-038",
  "PAT-IDEA-039",
  "PAT-IDEA-040",
  "PAT-IDEA-044",
  "PAT-IDEA-045",
  "PAT-IDEA-052",
  "PAT-IDEA-053",
  "PAT-IDEA-054",
]);

/** 没被打掉，但已无人推进或结论未定，重新立项前必须先复评。 */
const STALE = new Set([
  "PAT-IDEA-002",
  "PAT-IDEA-004",
  "PAT-IDEA-006",
  "PAT-IDEA-007",
  "PAT-IDEA-008",
  "PAT-IDEA-009",
  "PAT-IDEA-010",
  "PAT-IDEA-011",
  "PAT-IDEA-014",
  "PAT-IDEA-015",
  "PAT-IDEA-016",
  "PAT-IDEA-018",
  "PAT-IDEA-019",
]);

/** 申请分组（PAT-BATCH-002）。只给现行且确有归属的卡。 */
const GROUP = {
  g1: [
    "PAT-ROAD-A",
    "PAT-DRAFT-A4",
    "PAT-IDEA-026",
    "PAT-IDEA-027",
    "PAT-IDEA-028",
    "PAT-IDEA-029",
    "PAT-IDEA-030",
    "PAT-IDEA-031",
  ],
  g2: [
    "PAT-IDEA-034",
    "PAT-IDEA-035",
    "PAT-IDEA-036",
    "PAT-IDEA-037",
    "PAT-IDEA-041",
    "PAT-IDEA-042",
    "PAT-IDEA-043",
    "PAT-IDEA-046",
    "PAT-IDEA-047",
    "PAT-IDEA-048",
    "PAT-IDEA-051",
  ],
  g3: ["PAT-IDEA-032", "PAT-IDEA-033", "PAT-IDEA-049", "PAT-IDEA-050"],
  g4: ["PAT-ROAD-B", "PAT-STATE-001", "PAT-IDEA-003", "PAT-IDEA-012", "PAT-IDEA-013"],
};

// ---------------------------------------------------------------------------
// 2. 内容改写：母案框架退役后仍在讲母案的卡，逐张补上现行口径。
//    只追加说明，不删原文，保留决策留痕。
// ---------------------------------------------------------------------------

const NOTE_MARK = "【2026-09-04 重构补注】";

const APPENDS = {
  "PAT-RULE-001":
    "本库不再按两件母案组织。母案框架已于 PAT-BATCH-002 退役，理由是四组方案之间没有共同的特定技术特征（单一性上分不到一起），且分案不得超出原申请记载范围而实测数据全缺。现行组织方式是四个申请组：组一液路与化学、组二残余量闭环控制、组三高盐声耦合、组四测量可信度。入口见 PAT-INDEX-001。本卡关于「不是正式法律意见」的声明继续有效。",
  "PAT-MAP-001":
    "已取代。六簇分类仍作为检索标签保留（cluster 字段），但「两件母案」的组织方式已退役，见 PAT-BATCH-002。现行入口见 PAT-INDEX-001。",
  "PAT-MAP-002": "已取代。见 PAT-INDEX-001。本卡保留做决策留痕。",
  "PAT-MAP-003":
    "已取代。本卡的角度①～⑮清单已按 PAT-BATCH-002 重新归组，其中多条被打掉或转为待重估，逐条状态见 PAT-INDEX-001。本卡保留做决策留痕。",
  "PAT-MAP-004":
    "已取代。其中老年方案 PAT-IDEA-017 的前提已作废（工作液回收到储液罐，使用者在空舱内起身）。青少年封套、监护空气舱、离舱联锁三条转为待重估。见 PAT-MAP-005 与 PAT-INDEX-001。",
  "PAT-MAP-005":
    "已被 PAT-MAP-006 取代为总图。本卡的消杀六条与低刺激六条继续有效，作为组一与组二的具体实现。本卡不再是入口，入口见 PAT-INDEX-001。",
  "PAT-MAP-006":
    "本卡是现行技术总图。申请如何分组与排队见 PAT-BATCH-002，全库入口与逐卡状态见 PAT-INDEX-001。",
  "PAT-CLU-001":
    "「归母案A」的表述已失效，母案框架见 PAT-BATCH-002 已退役。第一簇内容现归组一（液路与化学）。六簇分类本身作为检索标签保留。",
  "PAT-CLU-002":
    "「归母案A」的表述已失效。第二簇内容现归组一（液路与化学），其中液面热流与水活度部分转入组二（PAT-IDEA-034）。",
  "PAT-CLU-003":
    "「归母案B」的表述已失效。第三簇的声振内容现归组三（高盐声耦合），并已新增红灯：舱内触觉换能器与 40Hz 均为现有技术，见 PAT-IDEA-053、054。",
  "PAT-CLU-004": "「归母案B」的表述已失效。第四簇内容现归组四（测量可信度）。",
  "PAT-CLU-005": "「不进首案独权」的判断继续有效。第五簇不进入任何一组的独权，仅作说明书背景。",
  "PAT-CLU-006":
    "「归母案B」的表述已失效。第六簇内容现归组二（残余量闭环控制），且发明点已从「低扰动维持」改写为「以实测残余量为反馈的联合优化」，见 PAT-IDEA-046。",
  "PAT-ROAD-A":
    "「第一批同日提交」的安排已失效，见 PAT-BATCH-002。本卡现为组一（液路与化学）的独权候选，与其他组无统领关系，A1—A5 不再称子案，改为组一内部的从属权利要求层次。是否与组四同日提交由代理师按抵触申请风险判断。组一还需并入消杀六条 PAT-IDEA-026 至 031。",
  "PAT-ROAD-B":
    "「母案B」改称组四（测量可信度）。B1—B7 不再称子案。B6/B7 低刺激交互内容已迁出，现归组二并由 PAT-IDEA-046 统领，本组不再承担低刺激。",
  "PAT-BATCH-001":
    "关于母案与同日提交的部分已由 PAT-BATCH-002 取代。本卡仍然有效的判断有两条：不为凑数提交红灯案；自家在先公开会挡死后续改进案（另见 PAT-RULE-006）。对外口径「30+核心技术专利」与本库无对应关系，数字锁定前不得对外使用——这一条继续有效。",
  "PAT-NO3-001":
    "「不设母案3」的表述已失效，母案框架已退役。但本卡定的四个条件（技术问题独立、技术特征独立、技术效果独立、原型与数据成熟）继续作为任何方案能否立为独权的尺子，PAT-BATCH-002 正是用这把尺子判定 PAT-IDEA-037 与 046 当前不满足第四条。",
  "PAT-WRITE-001":
    "「第一件写母案A、两件同日提交」的安排已失效，见 PAT-BATCH-002。现行排队按数据门槛：组二最先（只需本底三态与交叉影响矩阵两张表，不需要样机）。本卡关于「先写看得见、量得出的那件」的判断方法仍可参考。",
  "PAT-WRITE-002": "本卡关于交底书与权利要求书区别、以及撰写人角色的说明继续有效，不受母案退役影响。",
  "PAT-WRITE-003": "七节骨架继续有效，但「母案A」改称组一。撰写前先读 PAT-RULE-007 的单一性要求。",
  "PAT-WRITE-004": "采访问题清单继续有效。新增必问项见 PAT-GAP-007 的两张表（本底三态、交叉影响矩阵）。",
  "PAT-WRITE-005":
    "红线自检表继续有效，并新增三条硬红线：不得写 40Hz 或任何治疗频率数值、gamma、淀粉样蛋白、改善 HRV 等适应症语言（PAT-IDEA-054）；不得引用 98.7% 论证穿透率（PAT-EXT-003）；不得主张 AOP、光触媒、舱内触觉换能器本身（PAT-IDEA-040、053）。",
  "PAT-WRITE-006": "「B用同一套方法」中的 B 改称组四。方法本身继续有效。",
  "PAT-NEXT-001":
    "本卡的 1—15 周排期与「同日提交A/B」已失效，见 PAT-BATCH-002。现行第一动作不是撰写，是测两张表：执行器三态本底、交叉影响矩阵，见 PAT-GAP-007。",
  "PAT-STATE-001": "「母案B状态机」改称组四状态机。状态机继续作工程规范与说明书实施例，不作发明点。",
  "PAT-EXT-001": "本卡已由 PAT-EXT-002 与 PAT-EXT-003 的后续评审取代，保留做决策留痕。",
  "PAT-IDEA-020":
    "已被 PAT-IDEA-031 取代。031 把「高盐过程向量」落实为五个可测化学量（密度、温度、双氧水余量、残余臭氧、溴酸盐），比本卡的抽象表述更能支撑权利要求。不要按本卡撰写。",
  "PAT-IDEA-021":
    "已被 PAT-IDEA-046 取代。046 的信噪比架构把「两种封套互斥」推进为「除目标频段外压到绝对阈值以下、目标功率由实测本底反算」，覆盖并超出本卡。不要按本卡撰写。",
  "PAT-IDEA-016":
    "待重估。人群叙事已不再是本库主线，本卡的凭证准入逻辑与组二 PAT-IDEA-037、046 的准入联锁高度重叠，重新立项前须先判断是否并入组二作为从权。原「待验证」项见 PAT-GAP-003，该缺口卡已由 PAT-GAP-007 合并。",
  "PAT-IDEA-018":
    "待重估。液压隔离的结构主张本身仍成立，但与当前四组均无共同的特定技术特征，单独立案需重新论证。重新立项前先过 PAT-NO3-001 的四条件。",
  "PAT-IDEA-019":
    "待重估。离舱三联锁与组一 PAT-IDEA-031 的占用准入互补而非重叠（一个管进、一个管出），可考虑并入组一作为从权。原「升底板」相关表述受 PAT-IDEA-017 前提作废影响，须重写。",
  "PAT-IDEA-017":
    "本卡状态为已打掉：前提作废，不是方案被现有技术挡住。工作液回收到储液罐，使用者在空舱内起身，「中性浮力下坐不起来」这个技术问题在本产品上不存在。另有 US5295929、US6042602 封死降液位调承重方向。老年方向暂不作为立案对象。",
  "PAT-GAP-001": "已并入 PAT-GAP-007 统一优先级表。本卡保留做留痕，排期以 007 为准。",
  "PAT-GAP-002": "已并入 PAT-GAP-007。本卡保留做留痕，排期以 007 为准。",
  "PAT-GAP-003":
    "已并入 PAT-GAP-007，且其中「升底板会不会被盐卡住」一条随 PAT-IDEA-017 前提作废而取消，不必再做。其余条目排期以 007 为准。",
  "PAT-RED-001":
    "红灯清单继续有效并已扩充。新增红灯：AOP 与光触媒本身、舱内触觉换能器与舱体声腔、骨传导振动放松、40Hz 诱导 gamma、毫米波穿高盐测 HRV、反相消光、电控调光材料本身、掩蔽声、被动隔声本身、降液位调承重。逐条见 PAT-INDEX-001 的红灯段。",
  "PAT-GRN-001": "绿灯判据继续有效。当前最接近绿灯的是组二，因其所需数据只有两张表且不需要样机，见 PAT-GAP-007。",
  "PAT-SEED-001": "撰写菜单中的⑦～⑪已随本库重组重新定位，逐条状态见 PAT-INDEX-001。菜单本身保留做留痕。",
  "PAT-XREF-001": "与总库分轨的规则继续有效。新增：专利文件公开后全球可见，其中的适应症语言同时触发第25条与监管认定，须与投资材料彻底分开措辞，见 PAT-EXT-003。",
  "PAT-DRAFT-A4": "本卡现属组一。宽方案已被包围的结论不变。",
};

// ---------------------------------------------------------------------------
// 3. 新增卡片
// ---------------------------------------------------------------------------

const cards = [
  {
    id: "PAT-INDEX-001",
    kind: "roadmap",
    cluster: "cross",
    risk: "critical",
    lifecycle: "active",
    group: "none",
    loc: "全库入口",
    tags: ["唯一入口", "索引", "生命周期", "分组", "先读这张"],
    techBranch: "全库索引",
    title: "先读这张：全库唯一入口——哪些还算数、哪些被取代、哪些已打掉、分别归哪个申请组",
    summary:
      "库里同时存着现行结论和被推翻的旧结论。每张卡现在都有生命周期标记（现行／已取代／已打掉／待重估）和申请分组，先按标记筛，再读内容。",
    body:
      "怎么用这个库，三步：\n第一步，看生命周期标记。现行＝当前算数；已取代＝有更新的结论，卡上写了指向哪一张；已打掉＝明确否定，不要再投入；待重估＝没被打掉但已无人推进，重新立项前必须先复评。\n第二步，看申请分组。组一液路与化学、组二残余量闭环控制、组三高盐声耦合、组四测量可信度，依据见 PAT-BATCH-002。母案框架已退役。\n第三步，再读卡片内容。\n\n现行主线，按读的顺序：\nPAT-MAP-006 技术总图（低刺激是手段不是目的，信噪比架构）。\nPAT-BATCH-002 申请策略（四组独立申请，按数据门槛排队）。\nPAT-GAP-007 实验清单（按成本乘决定性排序，先做哪两张表）。\nPAT-RULE-001 至 007 七条硬规则，撰写前必读。\n\n四个组的独权候选与从权：\n组一 液路与化学。独权候选 PAT-ROAD-A。从权与并入项：消杀六条 PAT-IDEA-026 至 031，A4 底稿 PAT-DRAFT-A4。共同特定技术特征是高盐工作液的物理化学状态量作为运行准入与流路切换依据。\n组二 残余量闭环控制。独权候选 PAT-IDEA-046。从权 037、041、042、043、047、048，通道实现 034、035、036，传感 051。共同特定技术特征是以实测残余量为反馈量、以联合优化与准入联锁为手段。数据门槛最低，第一梯队。\n组三 高盐声耦合。独权候选 PAT-IDEA-049。从权 050、032、033。共同特定技术特征是高盐工作液作为声耦合介质时的阻抗设计与腔体模态处理。\n组四 测量可信度。独权候选 PAT-ROAD-B。从权 PAT-STATE-001、PAT-IDEA-003、012、013。\n\n红灯，全部不要写：\n漂浮舱采用先进氧化或光触媒本身（PAT-IDEA-040）；舱内触觉换能器与以舱体作声腔（053）；骨传导振动放松（053）；40Hz 及一切适应症表述（054）；毫米波穿高盐测 HRV（052）；反相消光（044）；电控调光材料本身（045）；掩蔽声与白噪音（038）；被动隔声隔振本身（039）；同池双人（022）；预约消杀门锁（023）；情绪灯舱（024）；无障碍开门升降机本身（025）；降液位调承重（PAT-PRI-075、076 封死）；老年中性浮力坐仰卧转换（017 前提作废）。\n\n已取代的卡不要当依据：PAT-MAP-001 至 005、PAT-CLU-001 至 006、PAT-BATCH-001、PAT-NO3-001、PAT-WRITE-001、PAT-NEXT-001、PAT-EXT-001、PAT-IDEA-020、021、PAT-GAP-001 至 003。它们保留是为了留痕，不是为了执行。每张都写明了被谁取代。\n\n待重估的卡：PAT-IDEA-002、004、006、007 至 011、014、015、016、018、019。这些是早期候选或人群舱方向，没被打掉但当前没有归组。重新立项前先过 PAT-NO3-001 的四个条件。\n\n给人看的文档：patent-drafts/信噪比架构.md 是当前总菜单；真实技术保护.md 是上一版，其消杀与低刺激内容仍有效。\n\n本卡不给出新颖性或创造性最终结论，全库同此声明。",
    examples: [
      "对：先按生命周期筛掉已取代和已打掉，再读现行卡",
      "错：搜到 PAT-MAP-001 就照着两件母案去安排申请",
    ],
    relatedIds: [
      "PAT-MAP-006",
      "PAT-BATCH-002",
      "PAT-GAP-007",
      "PAT-RULE-007",
      "PAT-ROAD-A",
      "PAT-ROAD-B",
      "PAT-IDEA-046",
      "PAT-IDEA-049",
    ],
  },
  {
    id: "PAT-GAP-007",
    kind: "gap",
    cluster: "cross",
    risk: "critical",
    lifecycle: "active",
    group: "none",
    loc: "合并实验清单",
    tags: ["实验清单", "优先级", "成本", "决定性", "合并 GAP-001至006"],
    techBranch: "对照实验",
    title: "合并实验清单：按成本乘决定性排序，先做两张表，再做四条生死判定，最后才是样机",
    summary:
      "GAP-001 至 006 分散在六张卡里各说各的。这张按「做起来多贵」乘「做完能不能决定要不要写」重新排了一遍。",
    body:
      "排序依据是成本与决定性的乘积，不是重要性。决定性指做完之后能否直接决定某条方案写还是不写。\n\n第一优先，最便宜且决定组二能否立案。不需要样机、不需要新材料、不需要新配方，只要传感器和时间：\n表一 执行器三态本底。全部执行器关闭、单个开启、全部开启三种状态下，分别量声、光、热、触、化学五个通道的残余量。\n表二 交叉影响矩阵。每个执行器在给定动作量下对其他每个通道的注入量。这张表就是 PAT-IDEA-047 权利要求的数据依据。\n没有这两张表，整个信噪比架构只是说法。这是当前唯一该立刻做的事。\n\n第二优先，单项实验直接决定某条方案的生死，做完才知道要不要写：\n溴本底与溴酸盐累积曲线。测不到溴，PAT-IDEA-027 整条打掉。\n光催化涂层余辉衰减曲线，与暗适应阈值曲线画在同一张图上。不相交则 PAT-IDEA-042 降级为说明书内容。\n腔内压力与液面微起伏能否解出心动周期，与陆地心冲击基线对照。解不出则 PAT-IDEA-051 收窄为仅呼吸相位。\n工作液声阻抗随浓度曲线，与浮力密度窗口画在同一张图上。不相交则 PAT-IDEA-049 必须改独立匹配层方案。\n\n第三优先，需要样机或专门装置：\n工作液中羟基自由基表观清除速率，与清水对照；工作液紫外可见衰减曲线。决定 PAT-IDEA-026 的间隙能否写成结构限定。\n壁面生物膜刮取计数对照：液相循环若干遍 对比 空舱气相光催化加臭氧。是 PAT-IDEA-028 的命门。\n半浸耳位液相与气相两条通路的传递函数。决定 PAT-IDEA-032 的双通道是否必要。\n工作液声速随浓度温度变化量级与驻波分布图。决定 PAT-IDEA-050 的在线修正是否必要。\n各组织界面声能传递效率实测与个体差异范围。回应审计第一级破洞。\n头部漂移与转动幅度实测，可与相位矩阵声压均匀性一次采集两用。\n盐霜厚度与光催化活性关系曲线；空舱气相臭氧分解半衰期；舱内漏光空间分布；液面温度梯度与主动跟随后残余热流；波在舱壁的反射系数。\n\n第四优先，只为留下书面依据：\n毫米波穿透充满高盐溶液的实际舱体后的信噪比。预期不可行，做这条是为了归档说明为何转向。\n\n每一条都要在清水与干燥空气中做一遍同样的事。问题仍在，说明高盐不是必要条件，该条降级或打掉。\n\n非技术但同样紧急的一件：请医疗器械监管律师核对专利说明书措辞，并与投资材料彻底分开处理。专利文件会公开，是三份材料里最危险的一份。\n\n已取消的实验：升起底板在高盐中是否卡滞（随 PAT-IDEA-017 前提作废）。\n\n本卡合并并取代 PAT-GAP-001 至 006 的排期功能；原卡保留做留痕，具体条目描述仍可回查。",
    examples: [
      "对：这个月只做表一和表二，其他全部等",
      "错：先去做40Hz人体试验或者先找代理师写稿",
    ],
    relatedIds: [
      "PAT-INDEX-001",
      "PAT-BATCH-002",
      "PAT-GAP-004",
      "PAT-GAP-005",
      "PAT-GAP-006",
      "PAT-IDEA-046",
      "PAT-IDEA-047",
    ],
  },
];

// ---------------------------------------------------------------------------

function card(item) {
  return {
    id: item.id,
    kind: item.kind,
    title: item.title,
    summary: item.summary,
    body: item.body,
    tags: item.tags,
    cluster: item.cluster,
    risk: item.risk,
    lifecycle: item.lifecycle,
    group: item.group,
    techBranch: item.techBranch,
    relatedIds: item.relatedIds || [],
    examples: item.examples || [],
    source: { file: srcFile, location: item.loc, date: "2026-09", author },
    status: "approved",
    confidentiality: "internal",
    createdAt: now,
    updatedAt: now,
  };
}

const groupOf = {};
for (const [g, ids] of Object.entries(GROUP)) for (const id of ids) groupOf[id] = g;

function lifecycleFor(p) {
  if (KILLED.has(p.id)) return "killed";
  if (SUPERSEDED[p.id]) return "superseded";
  if (STALE.has(p.id)) return "stale";
  return "active";
}

const patents = JSON.parse(readFileSync(patentsPath, "utf-8"));

const missing = cards.filter((c) => !patents.some((p) => p.id === c.id));
const built = missing.map(card);

let touched = 0;
const out = [...patents, ...built].map((p) => {
  const next = { ...p };
  let changed = false;

  const lc = next.lifecycle ?? lifecycleFor(next);
  if (next.lifecycle !== lc) {
    next.lifecycle = lc;
    changed = true;
  }
  const g = next.group ?? groupOf[next.id] ?? "none";
  if (next.group !== g) {
    next.group = g;
    changed = true;
  }
  const sb = SUPERSEDED[next.id];
  if (sb && next.supersededBy !== sb) {
    next.supersededBy = sb;
    changed = true;
  }

  const note = APPENDS[next.id];
  if (note && !next.body.includes(NOTE_MARK)) {
    next.body = `${next.body}\n\n${NOTE_MARK}${note}`;
    changed = true;
  }

  if (changed) {
    touched += 1;
    next.updatedAt = now;
  }
  return next;
});

if (!built.length && !touched) {
  console.log("专利库重构已完成，跳过。总数:", patents.length);
  process.exit(0);
}

const ids = out.map((p) => p.id);
if (ids.length !== new Set(ids).size) {
  console.error("出现重复 id，已中止");
  process.exit(1);
}
const badRef = Object.values(SUPERSEDED).filter((id) => !ids.includes(id));
if (badRef.length) {
  console.error("supersededBy 指向了不存在的卡，已中止", badRef);
  process.exit(1);
}

writeFileSync(patentsPath, JSON.stringify(out, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const srcId = "SRC-PAT-RESTRUCTURE";
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
  note: "全库标注生命周期与申请分组；母案框架退役后的自相矛盾逐张补注；新增唯一入口 PAT-INDEX-001 与合并实验清单 PAT-GAP-007。",
});
writeFileSync(sourcesPath, JSON.stringify(next, null, 2) + "\n");

const stat = out.reduce((acc, p) => {
  acc[p.lifecycle] = (acc[p.lifecycle] || 0) + 1;
  return acc;
}, {});
const gstat = out.reduce((acc, p) => {
  acc[p.group] = (acc[p.group] || 0) + 1;
  return acc;
}, {});
console.log(
  JSON.stringify({ inserted: built.map((c) => c.id), touched, total: out.length, lifecycle: stat, group: gstat }, null, 2)
);
