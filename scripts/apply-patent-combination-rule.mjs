/**
 * 组合发明规则 + taVNS 接入角度 + 水中电刺激前案 + 外部AI评审任务书登记。
 * 幂等：PAT-RULE-005 已存在则跳过。
 * 运行：node scripts/apply-patent-combination-rule.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-04T07:55:00.000Z";
const srcFile = "组合发明查证与迷走接入检索";
const author = "组合发明规则查证与水中电刺激检索 2026-09-04（公开检索，未核验法律状态）";

const dataDir = path.join(process.cwd(), "data");
const patentsPath = path.join(dataDir, "patents.json");
const sourcesPath = path.join(dataDir, "patent-sources.json");

const cards = [
  {
    id: "PAT-RULE-005",
    kind: "rule",
    cluster: "cross",
    risk: "critical",
    loc: "审查指南第二部分第四章 4.2",
    tags: ["组合发明", "协同作用", "拼凑不行", "用别人的技术可以"],
    techBranch: "组合发明创造性",
    title: "组合发明：用别人成熟的技术完全可以，但必须证明1+1>2的协同",
    summary:
      "把已有技术接进我们设备能不能申请专利，答案是能，而且被组合的技术是否已知不影响创造性评价。唯一的关卡是协同——各技术特征在功能上必须彼此支持并产生新效果，简单叠加会被驳。",
    body:
      "审查指南第二部分第四章 4.2 原文要点：\n\n显而易见的组合（不具备创造性）：仅将某些已知产品或方法组合或连接在一起，各自以其常规的方式工作，总的技术效果是各组合部分效果之总和，组合后的各技术特征之间在功能上无相互作用关系，仅仅是一种简单的叠加。指南给的反例是「带有电子表的圆珠笔」——两者组合后仍各自以常规方式工作，功能上没有相互作用，只是简单叠加。\n\n非显而易见的组合（具备创造性）：如果组合的各技术特征在功能上彼此支持，并取得了新的技术效果；或者组合后的技术效果比每个技术特征效果的总和更优越，则具有突出的实质性特点和显著的进步。\n\n最关键的一句原文：「组合发明的每个单独的技术特征本身是否完全或部分已知并不影响对该发明创造性的评价。」\n\n判断时通常考虑四点：组合后各技术特征在功能上是否彼此相互支持、组合的难易程度、现有技术中是否存在组合的启示、组合后的技术效果。\n\n落到本项目：\n- 「把成熟的迷走刺激模块装进漂浮舱」如果两者各自照常工作，就是圆珠笔加电子表，会被驳\n- 要有创造性，必须证明两者在本环境下会互相干扰或互相增强，我们解决的是这个耦合冲突\n- 协同点不能是「防水」，那已被 PAT-PRI-029 覆盖\n\n一个必须同时讲清的商业风险：**拿到组合专利不等于可以自由实施。** 若被组合的基础技术在中国有有效专利，我们实施仍需对方许可或交叉许可。这正是 PAT-RULE-002 讲的可专利性与 FTO 分开。组合专利通常只是改进专利。",
    examples: [
      "会被驳：漂浮舱 + 现成耳夹式刺激器，各自照常工作",
      "可能成立：证明高电导率液体或感官剥夺环境使现有刺激参数标定失效，我们解决该冲突",
    ],
    relatedIds: ["PAT-RULE-002", "PAT-RULE-003", "PAT-RULE-004", "PAT-IDEA-006", "PAT-PRI-029", "PAT-PRI-030"],
  },
  {
    id: "PAT-IDEA-006",
    kind: "layout",
    cluster: "5",
    risk: "high",
    loc: "复盘候选角度六",
    tags: ["候选角度", "组合发明", "迷走接入", "协同点待锁定"],
    techBranch: "候选角度",
    title: "候选六：把成熟迷走技术接入本舱——路是通的，但协同点还没锁定",
    summary:
      "法律上可行：组合发明不因被组合技术已知而失去创造性。检索也显示 taVNS 与漂浮舱结合尚未见专利。但「水中可用的电刺激」这一层已被占，协同点必须落在高盐高电导或感官剥夺上。",
    body:
      "好消息：\n1 规则允许。见 PAT-RULE-005，被组合技术已知不影响创造性评价。\n2 组合有先例范式。US12337178 把 VNS 与 EMG 控制的功能性电刺激配对，主张对神经可塑性的叠加或超叠加效果（PAT-PRI-031）。\n3 检索范围内未见 taVNS 与漂浮舱结合的专利。US6623632 只是漂浮浴槽本体；US11324916 只是颈耳多模态刺激可穿戴设备。\n\n坏消息：\n「水中/入浴时可用的电刺激」这一层已被占。CN112135661A 用绝缘体电极（靠介质极化产生位移电流而非电子传导电流）使低频电刺激装置可在水中与入浴热水中使用，还提到电热浴池中导电电极固定于缸壁的局限；另有防水片状电刺激装置带水感知传感器、检测到水即调整电极电压。所以「防水」「水中不电解」「遇水调压」都不能当协同点。见 PAT-PRI-029。\n\n还剩的协同点候选（全部待验证，按我的看好程度排）：\nC1 感官剥夺下的刺激强度标定。现有 taVNS 普遍以个体感知阈值的倍数设定强度。E3 感官剥夺使背景刺激极低，感知阈值可能显著低于常规环境，因此沿用常规标定会导致剂量偏差。「在极低背景刺激环境下如何标定刺激强度」是本环境特有的标定问题，且属于设备参数标定而非治疗方法。拿掉 E3 → 常规阈值 → 问题不存在。\nC2 极高电导率介质中的电流分布。22—30% 硫酸镁的电导率远高于自来水与常规浴水，绝缘体电极方案在如此高电导介质中的行为可能不同。这是 CN112135661A 之外更窄的差别，需要先算再测。\nC3 中性浮力与身体自由漂移下的电极位置与接触阻抗稳定性。问题真实，但解法可能落入常规固定手段。\n\n必须同时评估的两个非专利风险：\n- 医疗器械监管：装入电刺激模块可能使整机被认定为医疗器械，需注册证。这个风险比专利本身大。\n- FTO：即使拿到组合专利，若基础 taVNS 专利在中国有效，实施仍需许可。\n\n待检索：高电导介质经皮电刺激剂量、感官剥夺环境感知阈值标定、漂浮舱结合神经调控，均未检索。\n待验证：C1 的感知阈值在本舱内是否真的显著偏移，需要人体测试与伦理审批；C2 需先做电流场计算。",
    examples: [
      "对：写成「在高电导漂浮液环境中维持经皮刺激剂量可控的装置」",
      "错：写成「漂浮舱内进行迷走神经刺激以缓解焦虑的方法」——撞第25条又撞红线",
    ],
    relatedIds: ["PAT-RULE-005", "PAT-RULE-004", "PAT-IDEA-004", "PAT-PRI-029", "PAT-PRI-030", "PAT-PRI-031", "PAT-CLU-005"],
  },
  {
    id: "PAT-PRI-029",
    kind: "retrieved",
    cluster: "5",
    risk: "critical",
    publicationNo: "CN112135661A",
    jurisdiction: "中国（日本申请人）",
    techBranch: "水中电刺激",
    tags: ["绝缘体电极", "位移电流", "水中可用", "打掉防水协同点"],
    title: "CN112135661A 绝缘体电极使低频电刺激可在水中与入浴热水中使用",
    summary:
      "打掉「把电刺激做成能在水里用」这个协同点。该案明确指出以往电刺激装置因导电性电极无法在皮肤湿润或水中使用，并用绝缘体电极膜解决——靠介质极化产生位移电流，电极与水之间实质不发生电子授受，因而不发生电解与电极材料溶出。",
    body:
      "已公开要点：低频电刺激装置用防水壳体；具备一定静电电容的低频电刺激用绝缘体电极膜或电极片的防水袋；附带通电许可传感器功能与水中通信功能的无绳装置，使其在水中与入浴热水中均可使用；在树脂中分散高相对介电常数无机氧化物微粒实现柔性绝缘电极。\n该案背景部分还指出：电热浴池中导电性电极被固定于浴缸壁，无法自由将电极抵接于患部；装置主体设在其它房间，入浴者无法自由调节刺激强度与波形。\n\n另有同方向公开（合并记录）：防水片状电刺激装置，含防水部件与水感知传感器，检测到水时自动调整施加于电极的电压；以及全身电浴槽，浴缸内多组电极板由控制系统调节至不同电位，配液位与温度传感。\n\n对我们的限制：\n- 「水中可用」「不电解」「遇水调压」「浴缸内多电极控制」都已公开，不能作为组合发明的协同点\n\n还剩的窄缝：该案面向自来水与常规入浴热水。22—30% 硫酸镁的电导率远高于此，绝缘体电极在极高电导介质中的位移电流行为与剂量可控性是否仍成立，未见讨论。需先做电流场计算再判断。\n\n法律状态与最终文本待核验。",
    relatedIds: ["PAT-IDEA-006", "PAT-RULE-005", "PAT-CLU-005"],
  },
  {
    id: "PAT-PRI-030",
    kind: "retrieved",
    cluster: "5",
    risk: "high",
    publicationNo: "US11324916B2 / US6623632B1（合并卡）",
    jurisdiction: "美国",
    techBranch: "迷走刺激与漂浮浴",
    tags: ["合并卡", "颈耳多模态刺激", "漂浮浴槽本体"],
    title: "迷走刺激可穿戴与漂浮浴槽各自已公开，但两者结合尚未检索到",
    summary:
      "US11324916 公开颈部与耳部的电、磁、触觉多模态迷走刺激可穿戴设备并含迭代生物测量与调整；US6623632 公开高密度盐溶液漂浮浴槽本体。检索范围内未见两者结合的专利。",
    body:
      "US11324916 已公开要点：一对置于耳廓腔内的耳件，各含至少一个电刺激器；提供刺激指令的连接；作用于喉部两侧迷走神经上方与耳廓表面；采用随时间变化的电流与磁场经皮施加；含振动扬声器提供触觉刺激，并称同频触觉刺激可增强刺激效果；方法含迭代的生物测量与刺激调整。\n\nUS6623632 已公开要点：开放式槽体，使用者仰卧漂浮于微加热的高密度盐溶液中；槽内电加热；下部接抽液管、含泵与过滤；出口接储液罐，罐内亦有电加热；罐底出口接带阀的回灌管，每次使用可重新灌注。\n\n对我们的意义：\n- 迷走刺激侧与漂浮舱侧各自都是成熟公开技术，因此按 PAT-RULE-005，单独已知不影响组合的创造性评价\n- 检索范围内未见 taVNS 与漂浮舱结合的专利，说明组合本身可能还有空间\n- 但 US11324916 已含「迭代生物测量与刺激调整」，我们若做闭环调参会同时撞它和 PAT-PRI-001（CN121795911A）\n\n注意：仅为公开渠道方向性检索，未使用专业专利数据库，不排除存在未检出的在先申请。法律状态待核验。",
    relatedIds: ["PAT-IDEA-006", "PAT-PRI-001", "PAT-PRI-031", "PAT-CLU-005"],
  },
  {
    id: "PAT-PRI-031",
    kind: "retrieved",
    cluster: "5",
    risk: "medium",
    publicationNo: "US12337178B2",
    jurisdiction: "美国",
    techBranch: "组合发明范式",
    tags: ["VNS+FES配对", "超叠加效果", "组合范式参考"],
    title: "US12337178 VNS 与功能性电刺激配对：可参考的「组合发明」写法范式",
    summary:
      "不是拦路虎，是范式参考。该案把迷走刺激与 EMG 控制的功能性电刺激配对，明确主张两者产生叠加或超叠加效果——正是组合发明要证明的「功能上彼此支持」。",
    body:
      "已公开要点：闭环功能性电刺激（FES）与迷走神经刺激（VNS）联合系统；由检测到的 EMG 信号判断肢体运动或运动意图；先施加 FES 诱发运动，再施加 VNS 增强神经可塑性；说明书明确表述该组合可带来对神经可塑性与恢复的叠加或超叠加效果；并提到以 taVNS 与 FES 结合作为非侵入神经调控方案，两系统可共用同一可穿戴衣袖采集信号与施加刺激。\n\n为什么值得研究：它示范了组合发明的论证结构——不是把两个装置装在一起，而是说明两者在时序与作用机理上如何互相支持，并给出效果为何优于各自之和。我们做角度六时应参考这种论证方式。\n\n对我们的限制：其领域是神经损伤后运动功能康复，与我们的放松恢复场景不同；但若我们写「刺激与测量的时序配合」，需注意不要落入其闭环配对逻辑。\n\n法律状态待核验。",
    relatedIds: ["PAT-IDEA-006", "PAT-RULE-005", "PAT-PRI-030"],
  },
];

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
    publicationNo: item.publicationNo,
    jurisdiction: item.jurisdiction,
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

const patents = JSON.parse(readFileSync(patentsPath, "utf-8"));
if (patents.some((p) => p.id === "PAT-RULE-005")) {
  console.log("组合发明规则已入库，跳过。总数:", patents.length);
  process.exit(0);
}

const built = cards.map(card);
function insertAfter(list, anchorId, cs) {
  const i = list.map((p) => p.id).lastIndexOf(anchorId);
  const at = i === -1 ? list.length : i + 1;
  return [...list.slice(0, at), ...cs, ...list.slice(at)];
}

let out = patents;
out = insertAfter(out, "PAT-RULE-004", built.filter((c) => c.kind === "rule"));
out = insertAfter(out, "PAT-IDEA-005", built.filter((c) => c.kind === "layout"));
out = insertAfter(out, "PAT-PRI-028", built.filter((c) => c.kind === "retrieved"));

const ids = out.map((p) => p.id);
if (ids.length !== new Set(ids).size) {
  console.error("出现重复 id，已中止");
  process.exit(1);
}
writeFileSync(patentsPath, JSON.stringify(out, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const srcId = "SRC-PAT-COMBINATION";
const next = sources.filter((s) => s.id !== srcId);
next.push({
  id: srcId,
  filename: srcFile,
  cluster: "cross",
  fileType: "other",
  uploadedAt: now,
  patentIds: built.map((c) => c.id),
  status: "done",
  splitMode: "claude-agent",
  note: "组合发明创造性规则（协同 vs 拼凑）；迷走接入角度六；水中电刺激与迷走刺激前案。另产出外部AI评审任务书。",
});
writeFileSync(sourcesPath, JSON.stringify(next, null, 2) + "\n");

console.log(JSON.stringify({ inserted: built.length, total: out.length }, null, 2));
