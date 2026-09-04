/**
 * 整合方案 v5.0：在 v4.0 之上并入两份模块迁移评估。
 * 写卡 + 生成 patent-drafts/专利整合方案-v5.md（先案/红灯从库自动列全）。
 * 运行：node scripts/apply-patent-report-v5.mjs
 */
import { writeFileSync } from "fs";
import path from "path";
import { openStore, readPatents } from "./lib/patent-store.mjs";

const BATCH = {
  batchId: "SRC-PAT-REPORT-V5",
  srcFile: "专利整合方案-v5",
  author: "整合方案 v5.0 2026-09-04（模块迁移过闸后）",
  now: "2026-09-04T17:00:00.000Z",
  guardId: "PAT-MAP-008",
  note: "v5.0：信噪比架构不变；SPA/床/冥想舱模块平移全部打掉；打开自由漂浮流场与光路/投送可信度黄灯。产出 patent-drafts/专利整合方案-v5.md。",
};

const PRI_BUCKETS = [
  ["2", "一 消杀、气体与水质"],
  ["1", "二 舱体、液路与配液"],
  ["3", "三 声、光、振与低刺激"],
  ["4", "四 传感、测量与安全控制"],
  ["5", "五 迷走与生理机制"],
  ["6", "六 人群、运营、冥想与光照"],
  ["cross", "六 人群、运营、冥想与光照"],
];

const GROUP_ORDER = {
  g1: [
    "PAT-DRAFT-A4",
    "PAT-IDEA-026",
    "PAT-IDEA-027",
    "PAT-IDEA-028",
    "PAT-IDEA-029",
    "PAT-IDEA-030",
    "PAT-IDEA-031",
    "PAT-ROAD-A",
    "PAT-IDEA-060",
    "PAT-IDEA-061",
    "PAT-IDEA-062",
    "PAT-IDEA-066",
    "PAT-IDEA-069",
    "PAT-IDEA-071",
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
  g3: ["PAT-IDEA-032", "PAT-IDEA-033", "PAT-IDEA-049", "PAT-IDEA-050", "PAT-IDEA-063", "PAT-IDEA-064"],
  g4: [
    "PAT-IDEA-003",
    "PAT-IDEA-012",
    "PAT-IDEA-013",
    "PAT-ROAD-B",
    "PAT-STATE-001",
    "PAT-IDEA-067",
    "PAT-IDEA-068",
    "PAT-IDEA-070",
  ],
  g5: ["PAT-IDEA-055", "PAT-IDEA-056"],
};

const GROUP_META = {
  g1: {
    heading: "组一 · 液路与化学",
    feature:
      "共同特定技术特征：高盐工作液的物理化学状态量，以及自由漂浮区的液路动量约束，作为运行准入与流路切换依据。独权候选仍是 `PAT-ROAD-A`。",
  },
  g2: {
    heading: "组二 · 残余量闭环控制",
    feature:
      "共同特定技术特征：以实测残余量为反馈量、以联合优化与准入联锁为手段。独权候选 `PAT-IDEA-046`。所需数据仍是执行器三态本底和交叉影响矩阵两张表。**不需要样机。第一梯队。**",
  },
  g3: {
    heading: "组三 · 高盐声耦合",
    feature:
      "共同特定技术特征：高盐工作液作为声耦合介质时的阻抗设计与腔体模态处理。独权候选仍是 `PAT-IDEA-049`（工作液即可调声阻抗层）。",
  },
  g4: {
    heading: "组四 · 测量可信度",
    feature:
      "共同特定技术特征：高盐、含气、脏窗条件下测量是否可信，不可信则冻结动作。独权候选仍是 `PAT-ROAD-B`。",
  },
  g5: {
    heading: "组五 · 舱体与表面",
    feature: "共同特定技术特征：同一块内表面必须同时满足互相打架的几何与材料约束。独权候选 `PAT-IDEA-055`。本轮没有新卡。",
  },
};

function cell(s) {
  return String(s ?? "")
    .replace(/\|/g, "／")
    .replace(/\n/g, " ");
}

function priCell(p) {
  const ids = (p.relatedIds ?? []).filter((id) => id.startsWith("PAT-PRI-"));
  return ids.length ? ids.map((id) => `\`${id}\``).join("、") : "—";
}

function groupRows(patents, group) {
  const active = patents.filter((p) => p.group === group && p.lifecycle === "active");
  const byId = new Map(active.map((p) => [p.id, p]));
  const ordered = [];
  for (const id of GROUP_ORDER[group] ?? []) {
    if (byId.has(id)) {
      ordered.push(byId.get(id));
      byId.delete(id);
    }
  }
  for (const p of [...byId.values()].sort((a, b) => a.id.localeCompare(b.id))) ordered.push(p);
  return ordered;
}

function groupTable(patents, group) {
  const rows = groupRows(patents, group);
  const meta = GROUP_META[group];
  const lines = [
    `#### ${meta.heading}（${rows.length} 张）\n`,
    meta.feature,
    "",
    "| 卡号 | 标题 | 相关先案 |",
    "|---|---|---|",
  ];
  for (const p of rows) {
    lines.push(`| \`${p.id}\` | ${cell(p.title)} | ${priCell(p)} |`);
  }
  return lines.join("\n");
}

function generateV5(patents) {
  const pri = patents.filter((p) => p.kind === "retrieved");
  const killed = patents.filter((p) => p.lifecycle === "killed");
  const byLife = patents.reduce((a, p) => ({ ...a, [p.lifecycle]: (a[p.lifecycle] ?? 0) + 1 }), {});

  const priTables = [];
  const used = new Set();
  for (const [cluster, heading] of PRI_BUCKETS) {
    const rows = pri.filter((p) => p.cluster === cluster && !used.has(p.id));
    if (!rows.length) continue;
    rows.forEach((p) => used.add(p.id));
    priTables.push(`### ${heading}（${rows.length} 条）\n`);
    priTables.push("| 卡号 | 公开号 / 公开方式 | 挡住什么 |");
    priTables.push("|---|---|---|");
    for (const p of rows) {
      priTables.push(`| \`${p.id}\` | ${cell(p.publicationNo)} | ${cell(p.title)} |`);
    }
    priTables.push("");
  }
  const leftover = pri.filter((p) => !used.has(p.id));
  if (leftover.length) {
    priTables.push(`### 未归簇（${leftover.length} 条）\n`);
    priTables.push("| 卡号 | 公开号 / 公开方式 | 挡住什么 |");
    priTables.push("|---|---|---|");
    for (const p of leftover) {
      priTables.push(`| \`${p.id}\` | ${cell(p.publicationNo)} | ${cell(p.title)} |`);
    }
    priTables.push("");
  }

  const killRows = ["| 卡号 | 不要写什么 | 被什么挡住 |", "|---|---|---|"];
  for (const p of killed) {
    const what = cell(p.title).replace(/^已打掉[:：]\s*/, "");
    const blockers = (p.relatedIds ?? []).filter((id) => id.startsWith("PAT-PRI-"));
    killRows.push(
      `| \`${p.id}\` | ${what} | ${blockers.length ? blockers.map((id) => `\`${id}\``).join("、") : "见卡内"} |`
    );
  }

  return `# 漂浮方舟 · 专利整合方案 v5.0

内部工作底稿｜2026年9月4日｜模块迁移过闸后

> 不是授权结论，也不是自由实施意见。结构、参数、配方、阈值、频率全部由工程师签字。权利要求由代理师定稿。法条条号请代理师按现行文本核对。

**库现状：${patents.length} 张卡** —— 现行 ${byLife.active ?? 0}、已取代 ${byLife.superseded ?? 0}、已打掉 ${byLife.killed ?? 0}、待重估 ${byLife.stale ?? 0}。其中检索到的先案 **${pri.length} 条**，本文全部列出。

网页：https://company-knowledge-base-nine.vercel.app/patents ｜ 入口卡：\`PAT-INDEX-001\`

本版相对 v4.0 只多做一件事：**把两份专项评估过闸后并进来。** 信噪比架构、五个申请组、组二第一梯队、使用公开硬规则，都不改。被推翻的是「把 SPA / 体感床 / 冥想舱的模块搬进来就能形成母专利」。

---

## 一、一句话说清现在的路线

**低刺激不是目的，是让目标信号用极小功率起作用的前提。**

把"最低刺激环境"从"什么都没有"重新定义成"信噪比最大"：除目标频段外，所有通道的残余量压到各自的绝对感知阈值以下；目标刺激的功率由**实测本底反算**，而不是设一个固定值；本底上升时第一动作是**降本底**，不是加大功率。

这形成正反馈：本底越低 → 所需功率越小 → 失真、发热、结构振动越小 → 本底进一步降低。低刺激和有效刺激从互相妥协变成互为前提。

它顺带回应了独立审计的第一级破洞——审计说声能到颅骨要降额 50% 以上，"近乎全功率穿透"不成立。**在信噪比架构下这不构成障碍**：需要的是信噪比不是绝对能量，本底压到绝对阈值以下时所需绝对能量本来就极小。

总图 \`PAT-MAP-006\`，独权候选 \`PAT-IDEA-046\`。

本轮补上第二句：

**平移的是自由漂浮才出现的物理问题，不是床、灯、气、冥想舱的现成模块。**

床靠固定接触面；漂浮舱没有固定接触面。浴缸可以造浪；漂浮舱还要管口鼻附近的自由液面、空气声、壳体声和 45–90 分钟的累积漂移。SPA 可以照光、溶氢、对置喷水；那些在固定座位里成立的方案，拿到近中性浮力的自由漂浮体上，要么已经有人写过，要么发明点根本不在种类和波长上。

因此：

- 继续按五个申请组写，不恢复母案称谓，不另立「光疗组」或「体感音乐组」。
- 组二的两张表仍然是整个库最该立刻做的事。
- 本轮新开的结构台架，穿插在第二、第三优先：零合力投送（\`PAT-IDEA-069\`）、拉格朗日漂移（\`PAT-IDEA-060\`）、光窗物态（\`PAT-IDEA-067\`）、气体交叉误判（\`PAT-IDEA-070\`）。清单见 \`PAT-GAP-009\`。

---

## 二、必须先认的现有技术

v4.0 的八条红线全部保留。本轮再加七条，每条都点到了具体的公开：

| 想报的 | 为什么报不了 |
|---|---|
| 漂浮舱用 AOP（紫外+臭氧+双氧水） | 行业公开在售标配，制造商官网写明原理 \`PAT-PRI-065\` |
| 用光触媒处理水 | UV/TiO₂ 泳池反应器是商品且有专利 \`PAT-PRI-066\`、\`PAT-PRI-067\` |
| 舱内触觉换能器、舱体当声腔 | Dreampod 公开在售 \`PAT-PRI-080\` + US11759705 \`PAT-PRI-084\` |
| 骨传导振动放松 | 振动枕已商业化并宣称专利 \`PAT-PRI-081\` |
| 40Hz 诱导 gamma | MIT GENUS + Cognito，**含触觉振动通道** \`PAT-PRI-082\` |
| 蛋形等特殊舱体外形 | 属外观设计；自排空与防冷凝顶盖形状已公开在售 \`PAT-PRI-085\` |
| 抗结晶/超疏水涂层 | 领域拥挤，专利族庞大 \`PAT-PRI-087\` |
| 降液位调承重 | US5295929、US6042602 封死 \`PAT-PRI-075\`、\`PAT-PRI-076\` |
| **冥想舱 + 声光呼吸提示 + 生理闭环** | JP2549469B2 等 \`PAT-PRI-088\`；人体信号调多模块已在第 7 节 |
| **体感音乐床 / 多换能器平移进漂浮舱** | 水床与浴缸换能器族 \`PAT-PRI-089\`；硫酸镁舱水听器反馈 \`PAT-PRI-004\` |
| **摇舱、造浪、海浪感、移动喷流** | 1900 年摇摆浴缸起 \`PAT-PRI-090\` |
| **彩光 / 红光 / 红外搬进漂浮舱** | CN209019285U 等 \`PAT-PRI-092\`；隔离舱加灯加氧泡已有 \`PAT-PRI-054\` |
| **光和气泡共用喷嘴** | EP1245216A1 等 \`PAT-PRI-093\` |
| **氧氢二氧化碳的种类、比例、浓度、气泡尺寸** | WO2016023394A1 \`PAT-PRI-009\` + 日本氢氧/氢碳浴 \`PAT-PRI-094\` |
| **分区密度差当浮力力矩执行器** | 角度⑤ + 变密度静水压族 \`PAT-PRI-046\` + 姿态调盐度 \`PAT-PRI-002\` |

还有一条方法论上的硬规则，比上面任何一条都重要：

> **\`PAT-RULE-006\`：别人公开卖了就是现有技术，跟他有没有申请专利无关——而且他没申请对我们更糟。**
>
> 依据专利法第二十二条第五款与审查指南 2.1.2，公开方式含出版物公开、**使用公开**、其他方式公开，均无地域限制。对方申请了专利，我们失去的是实施自由，但边界清楚可绕、专利会到期；对方只是公开卖，技术进了公有领域，**谁都不能再就它取得专利，包括我们**，而且它会当对比文件打掉我们的申请。
>
> 这条同样适用于我们自己：**任何对外销售、展示、官网写明原理之前，先问代理师能不能公开。** 中国的宽限期不含商业销售。

**交底书第一段就要写：我们承认这些是现有技术，我们主张的是高盐条件下的特定结构与联锁。** 不这么写，审查员一检索就完。

光窗这条再单独说一句：\`PAT-PRI-095\` 已经覆盖污染监测、凝露校正、凝露和结晶列为光窗异常。「窗口脏了」和「盐堵滤网」是同一类宽方案。\`PAT-IDEA-067\` 只剩两种物态动态可分且直接改变准入这一窄缝，没有实验就不写。

---

## 三、五个申请组

母案框架已退役（\`PAT-BATCH-002\`）。原因不是路线选择，是前提没了：四组之间没有共同的**特定技术特征**（专利法第三十一条第一款，单一性上分不到一起），且分案不得超出原申请记载范围而实测数据全缺。

改按贡献点分组，组内用从属权利要求做层次。本轮两份评估建议另立「液体律动场 / 干湿界面 / 光路可信 / 含气液投送」——那是研发筛选顺序，不是现在改架构。新点全部挂进既有五组。

${groupTable(patents, "g1")}

${groupTable(patents, "g2")}

${groupTable(patents, "g3")}

不要把 \`PAT-IDEA-064\` 写成姿态调盐度或人体信号策略库。

${groupTable(patents, "g4")}

${groupTable(patents, "g5")}

**排队依据是数据门槛，不是重要性：**

**第一梯队 —— 组二。** 所需数据只有两张表：执行器三态本底实测、交叉影响矩阵。**不需要样机、不需要新材料、不需要新配方，只要传感器和时间。**

**第二梯队 —— 数据决定生死，必须先测再决定写不写：** \`PAT-IDEA-027\` 溴酸盐（测不到溴整条打掉）、\`PAT-IDEA-042\` 余辉（曲线不相交就降级）、\`PAT-IDEA-051\` 心冲击（解不出心跳就收窄成只要呼吸相位）、\`PAT-IDEA-049\` 阻抗（曲线与浮力窗口不相交就得改独立匹配层）。本轮可穿插的廉价台架见 \`PAT-GAP-009\`：\`PAT-IDEA-069\` 假体投送、\`PAT-IDEA-070\` 溶气电导对照、\`PAT-IDEA-067\` 光窗盲测分类。

**第三梯队 —— 需要透明舱和替身：** \`PAT-IDEA-060\` 拉格朗日漂移（必须在相同往复指标下比累计漂移）、\`PAT-IDEA-062\` 柔性界面、\`PAT-IDEA-028\` 空舱气相、\`PAT-IDEA-032\` 双相对消、\`PAT-IDEA-050\` 腔体模态、\`PAT-IDEA-055\` 几何三张分布图。

时间压力用**本国优先权**（第二十九条第二款，12 个月内补数据，在先申请视为撤回），不要提前递一件写不实的宽案。装置类可考虑**发明与实用新型同日申请**以更快形成权利存量。规则见 \`PAT-RULE-007\`。

---

## 四、最值钱的技术落点

v4.0 的四条继续最值钱，因为它们已经和信噪比架构、消杀、舱体几何咬在一起：

**1. 空舱气相光催化（\`PAT-IDEA-028\`）** —— 循环式 AOP 只处理流经反应器的液体，**舱壁生物膜不流经反应器**；而液相羟基自由基又被高盐清除。最脏的地方恰好氧化能力最弱。排空式架构给了别人没有的空舱窗口：气相里没有硫酸根和卤素清除，自由基路径才真成立。臭氧从液路挪到气路，**同时把溴酸盐问题也解掉了**。

**2. 工作液即可调声阻抗层（\`PAT-IDEA-049\`）** —— 声阻抗 Z = 密度 × 声速，高盐液两者都随浓度变，所以阻抗**可设计可调**，清水没有这个自由度。发明点在冲突上：**同一个浓度变量同时被浮力窗口和阻抗匹配约束，两个最优点通常不重合。** 一个物理量承担两个功能且必须联合设计——组合发明最干净的形态。

**3. 光催化余辉污染暗环境（\`PAT-IDEA-042\`）** —— 公开研究里有一整个方向是把 TiO₂ 和长余辉磷光体复合，让光催化在停止照射后靠余辉继续工作。而人进舱后要暗适应 40 分钟，阈值降到 10⁻⁶ cd/m² 量级。**消杀越强，暗环境越脏。** 这是消杀与低刺激两条线耦合最硬的证据，而且**验证最便宜**——紫外照一下涂层，暗室里量衰减曲线即可。

**4. 内表面几何五约束联合（\`PAT-IDEA-055\`）** —— 完全排净、辐照均匀、声学模态、波吸收、低反射，五个约束共用一块表面且互相冲突：声学要斜壁但斜壁造排液死角，排净要单调下降但限死声学自由度，辐照要凹面但凹面造声学聚焦。

本轮新开、值得进第二梯队台架的两条，不要抬成新的总图：

**5. 零合力—零力矩含气液投送（\`PAT-IDEA-069\`）** —— 拿掉中性浮力题目就消失。对称喷嘴已经有人写过（\`PAT-PRI-097\`），必须写自由漂浮体的合力/力矩约束。假体台架，不需要人体。

**6. 零累积漂移的拉格朗日律动场（\`PAT-IDEA-060\`）** —— 造浪和消晃荡两端都有前案。发明只能落在「保留往复、约束周期积分位移」，且不能靠把总能量降下来。Stokes 漂移本身是公开物理（\`PAT-PRI-091\`）。

---

## 五、全部先案清单（${pri.length} 条）

按主题归并。每一条都写明公开号或公开方式，以及它挡住什么。详细的"对我们的限制"与"对我们的支撑"见各卡正文。本轮新增 \`PAT-PRI-088\`～\`PAT-PRI-097\`。

${priTables.join("\n")}
---

## 六、全部红灯（${killed.length} 条）

打掉的结论和能写的结论一样值钱——下次不用重查，也不会有人再提一遍。

${killRows.join("\n")}

---

## 七、下一步只有三件事

**第一，测两张表。** 执行器三态本底、交叉影响矩阵。这是组二的全部数据依赖，也是整个信噪比架构从"说法"变成"权利要求依据"的唯一途径。**不需要样机。** 见 \`PAT-GAP-007\`。

**第二，测四条生死曲线，并穿插四条廉价台架。** 泻盐溴本底与溴酸盐累积、光催化涂层余辉衰减、腔压能否解出心动周期、工作液声阻抗随浓度——每一条都直接决定对应方案写还是不写。本轮另加：零合力投送假体对照（\`PAT-IDEA-069\`）；气体注入后电导与密度是否分叉（\`PAT-IDEA-070\`）；光窗凝露/盐晶膜盲测（\`PAT-IDEA-067\`）；气体切换液相记忆（\`PAT-IDEA-071\`）。见 \`PAT-GAP-009\`。测不到就停，不要写专利。

**第三，请医疗器械监管律师核对专利说明书措辞，并与投资材料彻底分开。** 专利文件公开后全球可见，是三份材料里最危险的一份。

实验全清单见 \`PAT-GAP-007\`（合并优先级表）、\`PAT-GAP-008\`（组五）与 \`PAT-GAP-009\`（本轮专项）。

不要去做：体感音乐人体试验、色光疗程、氢氧比例、40Hz、冥想脑波闭环。

---

## 八、撰写纪律（交给代理师时一并给）

不得出现：40Hz 或任何治疗频率数值、gamma、脑波同步、淀粉样蛋白、微胶质细胞、皮质醇、改善 HRV、音疗、声音疗愈、频率疗法、冥想状态、改善睡眠。

不得引用：98.7% 声阻抗匹配率论证穿透率（已被独立审计打穿，\`PAT-EXT-003\`）。

不得主张：AOP、光触媒、舱内触觉换能器、骨传导放松、抗结晶涂层、调光材料、掩蔽声、被动隔声、色光灯、体感音乐漂浮舱、摇舱造浪、多气体配方、光泡一体喷嘴、密度差力矩——这些一律写进前序部分当现有技术。

不得把「光窗脏了」或「盐堵滤网」按宽概念申报。

必须写足：组合发明的协同论证。为什么是彼此支持而不是简单叠加，这一段决定创造性成立与否（\`PAT-RULE-005\`）。

输入只用设备与流体物理量。输出是设备动作。效果是可测量的工程指标。

---

## 附：这个库怎么继续长

每张卡都有**生命周期标记**（现行/已取代/已打掉/待重估）和**申请组**。网页可按状态和分组筛选，默认打开就是入口卡 \`PAT-INDEX-001\`。

三份文件分工：\`PAT-INDEX-001\` 管全库导航，\`PAT-MAP-006\` 管技术路线，\`PAT-MAP-008\`（本文）管对外交付。v4.0（\`PAT-MAP-007\`）保留做上一版交付留痕。

新思路进库走同一条流水线：先查先案 → 过闸门 → 定状态 → 归组 → 写卡 → 跑测试。模板 \`scripts/_template-new-batch.mjs\`，流程 \`patent-drafts/新思路入库流程.md\`，规则 \`PAT-RULE-008\`。校验不通过不写盘。

**你只需要做一件事：把想法说成「技术问题」而不是「效果」。** 说得出，剩下六步交给流水线。
`;
}

const store = openStore(BATCH);

store.add({
  id: "PAT-MAP-008",
  kind: "roadmap",
  cluster: "cross",
  risk: "critical",
  lifecycle: "active",
  group: "none",
  loc: "专利整合方案-v5.md",
  tags: ["整合方案", "v5.0", "模块迁移", "先案全清单", "给代理师"],
  techBranch: "整合方案",
  title: "整合方案 v5.0：信噪比架构不变；SPA/床/冥想舱模块平移打掉；打开流场与光路投送黄灯",
  summary:
    "在 v4.0 之上并入两份专项评估。技术总图仍是 PAT-MAP-006，申请策略仍是 PAT-BATCH-002，入口仍是 PAT-INDEX-001。本卡管对外交付。",
  body:
    "源文件：patent-drafts/专利整合方案-v5.md，Word 版 patent-drafts/漂浮方舟_专利整合方案_v5.0.docx。归档评估：patent-drafts/冥想体感音乐与律动床技术迁移专利评估.md、patent-drafts/光照与多气体漂浮舱专利专项评估.md。\n\n本卡不改信噪比总图，只做过闸后的整合与交付。八节与 v4.0 同构：\n一 路线两句话：低刺激是手段；平移的是自由漂浮才出现的物理问题。\n二 必须先认的现有技术：v4.0 八条加本轮七条。\n三 五个申请组。新点挂组一（060/061/062/066/069/071）、组三（063/064）、组四（067/068/070）。不另立组，不恢复母案称谓。\n四 最值钱的仍是 028/049/042/055；本轮台架优先 069 与 060。\n五 全部先案按簇列全。\n六 全部红灯列全。\n七 下一步：两张表、四条生死曲线加四条廉价台架、监管律师核措辞。\n八 撰写纪律。\n\n过闸结论卡：PAT-EXT-004、PAT-EXT-005。实验：PAT-GAP-009，不取代 PAT-GAP-007。\n\n与既有报告的关系：v4.0（PAT-MAP-007）仍是上一版交付件。v2.0/v3.0 已取代。INDEX 管导航，MAP-006 管技术路线，本卡管对外交付。\n\n本卡不给出新颖性或创造性最终结论，不构成正式法律意见。",
  examples: [
    "对：把 v5.0 的 docx 发给代理师，先案和红灯已列全",
    "错：另立体感音乐或光疗母专利，或拿 v3.0 的两件母案去谈",
  ],
  relatedIds: [
    "PAT-INDEX-001",
    "PAT-MAP-006",
    "PAT-MAP-007",
    "PAT-EXT-004",
    "PAT-EXT-005",
    "PAT-GAP-009",
    "PAT-IDEA-069",
    "PAT-IDEA-060",
  ],
});

store.append(
  "PAT-INDEX-001",
  "【2026-09-04 v5.0 补注】",
  "对外交付改用 patent-drafts/专利整合方案-v5.md（卡号 PAT-MAP-008）。v4.0 仍可读，不删。本轮过闸：SPA/床/冥想舱模块平移全部打掉（072～077、065）；打开组一 060/061/062/066/069/071、组三 063/064、组四 067/068/070。实验穿插见 PAT-GAP-009。不另立申请组，不恢复母案称谓。"
);

store.append(
  "PAT-BATCH-002",
  "【2026-09-04 v5.0 补注】",
  "两份模块迁移评估建议另立律动场/光路/投送母题。不采纳为新的申请组。新点分别挂组一、组三、组四，见 PAT-MAP-008。组二第一梯队不变。"
);

const result = store.commit();

const patents = readPatents();
const md = generateV5(patents);
const mdPath = path.join(process.cwd(), "patent-drafts", "专利整合方案-v5.md");
writeFileSync(mdPath, md);
console.log(
  "wrote",
  mdPath,
  "chars",
  md.length,
  "pri",
  patents.filter((p) => p.kind === "retrieved").length,
  "killed",
  patents.filter((p) => p.lifecycle === "killed").length
);

if (result?.skipped) {
  // still rewrite md so later test/doc fixes can land without new cards
}
