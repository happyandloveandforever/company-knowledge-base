/**
 * 整体报告 v2.0 的结论入库：去盐测试闸门、母案B收窄、取消20件硬指标、对照组要求。
 * 幂等：PAT-RULE-003 已存在则跳过。
 * 运行：node scripts/apply-patent-report-v2.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-04T06:10:00.000Z";
const report = "漂浮方舟_专利布局整体报告_v2.0.docx";
const author = "专利布局整体报告 v2.0（2026-09-04，基于绝对新颖性与国际检索修订）";

const dataDir = path.join(process.cwd(), "data");
const patentsPath = path.join(dataDir, "patents.json");
const sourcesPath = path.join(dataDir, "patent-sources.json");

const updates = [
  {
    id: "PAT-MAP-002",
    kind: "roadmap",
    cluster: "cross",
    risk: "critical",
    loc: "v2.0 第一章",
    tags: ["v2.0", "总图修订", "A升B降"],
    techBranch: "平台路线",
    title: "报告v2.0：结构不变，发明点选择依据全改；母案A升、母案B降",
    summary:
      "重构版的六簇、两母案、不设母案3继续有效。被推翻的是发明点的选择依据：中国采绝对新颖性，通用工程安全手段在国际上基本是公知，只有高盐是我们的护城河。",
    body: "三条核心结论：\n1 检索范围必须中外并行，且必须含非专利公开（IEC/GB/行业规范/产品手册）。只查专利会严重低估风险。本项目最致命的两条限制，一条来自IEC 60079-29-2与厂商布点指南，一条来自华盛顿州漂浮系统监管规范，都不是专利。\n2 通用工程安全手段拿不到创造性。冗余、自诊断、故障即告警、失电安全位、分级联锁、确定性状态机、按气体密度布点，在IEC 60079/61508体系与美国专利中早有沉淀。\n3 母案A升、母案B降。A的技术问题以高盐为必要条件，复核通过；B的独权骨架有相当部分落在公知范围内，必须收窄重构。\n\n继续有效：首案只立A与B、不设母案3、B4—B7预埋、不写直接VNS与疗效、AI不能发明真实技术。\n\n源文件：patent-drafts/专利布局整体报告-v2.md 与同名 docx。",
    examples: [
      "对：先过去盐测试再决定立不立案",
      "错：因为重构版写了就照原样提交母案B",
    ],
    relatedIds: ["PAT-MAP-001", "PAT-RULE-002", "PAT-RULE-003", "PAT-ROAD-A", "PAT-ROAD-B", "PAT-GAP-002"],
  },
  {
    id: "PAT-RULE-003",
    kind: "rule",
    cluster: "cross",
    risk: "critical",
    loc: "v2.0 第二章",
    tags: ["去盐测试", "立项闸门", "必做"],
    techBranch: "立项判断",
    title: "去盐测试：把「高盐」去掉方案还成立，就不要立案",
    summary:
      "所有候选发明点立项前必做。把方案描述里的高盐、漂浮液、漂浮舱换成液体、容器、密闭舱，再问一句这个方案是不是照样成立。照样成立的，大概率已被公知覆盖。",
    body: "三种结果：\n绿 去掉后完全不成立 → 高盐是必要条件 → 可以立案，优先\n黄 去掉后仍成立但效果显著变差 → 高盐是加重条件 → 需对照数据支撑后立案\n红 去掉后照样成立 → 通用工程手段 → 不立案，最多作从权或组合要素\n\n为什么有效：全世界做密闭空间安全、气体检测、传感器诊断、功能安全状态机的人力与资金远超我们，通用层面不可能领先。但在22—30%硫酸镁溶液+密闭舱+人仰卧其中+同时跑气泡加热循环声振这个组合上做工程的团队极少。高盐是唯一可能领先、也是别人绕不开的地方。\n\n已验证的案例：第一件底稿原定四个发明点，过完去盐测试与国际检索，三个被打掉，剩下的正是唯一没通过「去掉高盐还成立」的那一个——高盐结晶致传感器沉默失效。这不是巧合。\n\n现有候选的评级见 PAT-MAP-002 与 v2.0 报告第五、六、七章。",
    examples: [
      "红：确定性安全状态机——换成任何密闭设备都成立，IEC 61508 公知",
      "绿：高盐蒸汽在传感器透气孔结晶致盲——清水不会发生",
    ],
    relatedIds: ["PAT-MAP-002", "PAT-RULE-002", "PAT-DRAFT-A4", "PAT-GAP-002", "PAT-ROAD-B"],
  },
  {
    id: "PAT-ROAD-B",
    kind: "roadmap",
    cluster: "cross",
    risk: "high",
    loc: "v2.0 第六章",
    tags: ["母案B", "已收窄", "B1-B7降级"],
    techBranch: "母案B",
    title: "母案B（v2.0收窄版）：从通用安全控制收窄为高盐环境下的测量可信度维持",
    summary:
      "原定位「激励—测量抗干扰与设备安全状态控制」过宽，独权骨架大部分落入公知，创造性风险高。收窄为「高盐环境下的测量可信度维持与设备安全控制」。通用安全架构仍要在说明书充分披露，但独权落脚点必须是高盐特有失效模式。",
    body: "被公知覆盖的原独权要素（均未通过去盐测试）：\n执行模块及驱动波形——通用，不能作发明点\n工作传感器+参考传感器——参考传感器差分为公知，降为从权\n激励窗/静默采样窗/同步采样窗——时分复用为通用信号处理，降为从权\n可信度判断补偿隔离降级——US12087146冗余+故障旁路已公开，降为从权\n确定性安全状态机——IEC 61508体系公知，不能作发明点\n优先级排序——通用安全设计惯例，不能作发明点\n\n还能救回的方向：\n已验证 盐雾致盲——高盐蒸汽结晶堵塞传感器透气孔，传感器仍输出正常低读数；手册明写常规自诊断不覆盖透气孔堵塞\n待验证 高导电率影响测量基准、接地与漏电保护判据\n待验证 高盐液声阻抗与密度异于清水，换能器耦合与隔振冲突点不同\n待验证 自由液面+人体直接漂浮，振动经液体耦合到人体的路径不同\n后三条必须先做对照实验，不得先写进申请。\n\n子案重新评级：B1中、B2低、B3中（盐雾致盲是唯一亮点）、B4低、B5低、B6低、B7低。\n\n不设母案3的结论仍有效，理由更强：B6/B7核心逻辑已被公开，拆出来也拿不到创造性。\n状态机S0—S8继续作为工程规范与说明书实施例，不再作为发明点。",
    examples: [
      "对：独权写高盐致盲判据，状态机写进说明书作实施环境",
      "错：独权写「确定性安全状态机+优先级排序」",
    ],
    relatedIds: ["PAT-ROAD-A", "PAT-RULE-003", "PAT-STATE-001", "PAT-NO3-001", "PAT-PRI-022", "PAT-PRI-025", "PAT-GAP-002"],
  },
  {
    id: "PAT-BATCH-001",
    kind: "roadmap",
    cluster: "cross",
    risk: "medium",
    loc: "v2.0 第九章",
    tags: ["取消20件硬指标", "4-14件", "同日提交"],
    techBranch: "申请节奏",
    title: "节奏重排：取消20件硬指标，改为按绿灯数量决定，预期4—14件",
    summary:
      "为凑数提交的红灯案不但拿不到授权，还会因自家在先公开挡住后续好案。件数改为由去盐测试的绿灯数量与对照数据决定。",
    body: "新节奏：\n第一批 母案A + 母案B收窄版，2件，同日提交（法律依据见 PAT-RULE-002 抵触申请）\n第二批 A1、A5 两件绿灯，首案后按研发节奏\n第三批 A2、A3 黄灯 0—2件，拿到高盐vs清水对照数据之后\n第四批 B3 盐雾致盲方向 0—1件，对照实验证实后\n第五批 运维软件 0—3件，可并行，但软件案须有明确技术效果\n第六批 二期科研场景 0—4件，伦理与对照组成熟后\n\n合计 4—14 件。比20难看，但是真的。\n\n提交时间比重构版后移约5周，换取对照数据。没有对照数据的申请提交了也大概率拿不到授权，而且会因自家在先公开挡死后续改进案。\n\n对外口径：总库「30+核心技术专利」与本库无对应关系，数字锁定前不得对外使用。",
    examples: [
      "对：绿灯够几件就报几件",
      "错：为了对齐宣传口径把同一控制逻辑改标题报满20件",
    ],
    relatedIds: ["PAT-MAP-002", "PAT-RULE-002", "PAT-RULE-003", "PAT-ROAD-A", "PAT-ROAD-B", "PAT-GAP-002"],
  },
  {
    id: "PAT-GAP-002",
    kind: "gap",
    cluster: "cross",
    risk: "critical",
    loc: "v2.0 第十章",
    tags: ["清水对照组", "创造性证据", "最高优先级"],
    techBranch: "对照实验",
    title: "所有测试必须设清水对照组：没有对照，创造性无从证明",
    summary:
      "本版最核心的工程要求。创造性要证明本领域技术人员不容易想到，最有力的证据是同样的通用方案在高盐条件下失效或效果显著不同。没有对照组，我们手里只有「我们也做了一套系统」。",
    body: "有对照组和没对照组的区别：\n没有——「我们做了一套安全系统/液路系统」，审查员会说通用手段的常规应用，缺乏创造性。\n有——「通用方案在高盐条件下会失效，我们的方案不会」，这才是创造性论据。\n\n测试优先级（每一项都要有清水对照组）：\n1 最高 盐雾致盲对照：高盐vs清水下传感器多久被结晶堵塞、堵后读数是归零还是卡住、常规自诊断能否发现 → 决定 PAT-DRAFT-A4 与 B3 生死\n2 高盐液路与流场对照：盐析、腐蚀、压损、流速、液面波动、温度方差、稳态恢复 → A1 A2 A5\n3 热场与绝缘对照：红外热像、热斑、液温方差、低液位切断、漏电、过冲 → A3\n4 高盐导电率对测量与漏电保护的影响 → 母案B新方向\n5 声振在高盐液中的传递与耦合对照 → B1 B3\n6 气体与排气安全 → A4 B5\n7 低刺激环境 → A2 A3 B4\n\n做任何测试之前先确认一件事：设备实际会不会同时装氢气与臭氧两路气源。若不会，第一件底稿前提不成立，应改写A3或直接做A1。\n\n本卡优先于 PAT-GAP-001 的原测试计划。",
    examples: [
      "对：同一套传感器分别泡在高盐头空间和清水头空间，记录多久失真",
      "错：只测我们自己的设备，没有对照，数据无法证明创造性",
    ],
    relatedIds: ["PAT-GAP-001", "PAT-RULE-003", "PAT-DRAFT-A4", "PAT-ROAD-A", "PAT-ROAD-B", "PAT-BATCH-001"],
  },
];

function card(item, prev) {
  return {
    id: item.id,
    kind: item.kind,
    title: item.title,
    summary: item.summary,
    body: item.body,
    tags: item.tags,
    cluster: item.cluster,
    risk: item.risk,
    techBranch: item.techBranch,
    relatedIds: item.relatedIds || [],
    examples: item.examples || [],
    source: { file: report, location: item.loc, date: "2026-09", author },
    status: "approved",
    confidentiality: "internal",
    createdAt: prev?.createdAt || now,
    updatedAt: now,
  };
}

const patents = JSON.parse(readFileSync(patentsPath, "utf-8"));
if (patents.some((p) => p.id === "PAT-RULE-003")) {
  console.log("报告v2.0结论已入库，跳过。总数:", patents.length);
  process.exit(0);
}

const byId = new Map(patents.map((p) => [p.id, p]));
let inserted = 0;
let replaced = 0;
const fresh = [];
for (const item of updates) {
  const prev = byId.get(item.id);
  const next = card(item, prev);
  if (prev) {
    replaced += 1;
    byId.set(item.id, next);
  } else {
    inserted += 1;
    fresh.push(next);
  }
}

// 已有卡原位替换，新卡插到总图之后
let out = patents.map((p) => byId.get(p.id) || p);
const anchor = out.map((p) => p.id).lastIndexOf("PAT-MAP-001");
const at = anchor === -1 ? 1 : anchor + 1;
out = [...out.slice(0, at), ...fresh, ...out.slice(at)];

writeFileSync(patentsPath, JSON.stringify(out, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const srcId = "SRC-PAT-REPORT-V2";
const nextSources = sources.filter((s) => s.id !== srcId);
nextSources.push({
  id: srcId,
  filename: report,
  cluster: "cross",
  fileType: "docx",
  uploadedAt: now,
  patentIds: updates.map((u) => u.id),
  status: "done",
  splitMode: "claude-agent",
  note: "整体报告v2.0：去盐测试闸门、母案B收窄、取消20件硬指标、全部测试改带清水对照组。",
});
writeFileSync(sourcesPath, JSON.stringify(nextSources, null, 2) + "\n");

console.log(JSON.stringify({ inserted, replaced, total: out.length }, null, 2));
