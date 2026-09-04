/**
 * 角度⑤配液与结晶控制领域检索：独立立案打掉，冷管结晶并入母案A。
 * 幂等：PAT-PRI-036 已存在则跳过。
 * 运行：node scripts/apply-patent-angle5-dosing-search.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-04T09:00:00.000Z";
const srcFile = "角度⑤配液与结晶控制检索";
const author = "角度⑤配液结晶检索 2026-09-04（公开检索，未核验法律状态）";

const dataDir = path.join(process.cwd(), "data");
const patentsPath = path.join(dataDir, "patents.json");
const sourcesPath = path.join(dataDir, "patent-sources.json");

const revised = [
  {
    id: "PAT-IDEA-005",
    kind: "layout",
    cluster: "1",
    risk: "critical",
    loc: "复盘候选角度五（2026-09-04 配液结晶检索后改判）",
    tags: ["已打掉独立立案", "并入母案A", "行业运维公知", "配液闭环已公开"],
    techBranch: "候选角度（已否决独立立案）",
    title: "候选五已打掉独立立案：配液精度是化工与本行业公开运维，并入母案A",
    summary:
      "上一轮把发明点从「调密度」改成「怎么调得准」。补检索后，连这一层也被覆盖：漂浮舱自己就有盐密度传感器闭环，行业手册公开用比重计补盐，化工配液与防结晶更是成熟体系。不建议再当独立案。冷管结晶仍并入母案A的A1。",
    body:
      "打掉原因一：前提写重了。「近饱和」不像我们以为的那么近。行业公开运维（PAT-PRI-036）：工作比重约 1.265—1.285，饱和点在约 35℃ 大约 1.33。店家故意留出一段距离，就是怕泵和管子里结晶体。真正会结晶的地方，是停机后变冷的管路和泵——温度一降，局部才碰到饱和。这是 A1 已经在管的问题，不是「两次使用之间把 1.22 调到 1.28」那种配液精度问题。店家也不会在客人之间改密度，通常选定一个目标比重后只做补盐或补水。\n\n打掉原因二：漂浮舱本领域已经公开「测密度 → 加原液或加水」。申请号 201621389026 用盐密度传感器加进水阀、漂浮原液阀、排水阀自动调浓度；申请号 201920404726 背景里直接写泻盐溶液「低温易结晶」，解法是恒温加热储液。CN115877899 还把「调盐度」写进了姿态联动，那是红线不是缝。见 PAT-PRI-037。\n\n打掉原因三：手段层是化工教科书。US6739408 用流量计和阀组自动配制变密度钻井液（可含盐水）；申请号 202311706304 用称重投放加浓度监控做盐溶液恒温配制；高密度清洁盐水用结晶抑制剂（US10745609）；管道伴热、夹套保温、循环防结晶是大量实用新型的常规写法；电导率按约 2%/℃ 做温度补偿是仪表常识。见 PAT-PRI-038。\n\n打掉原因四：去环境测试追加一问之后更站不住。配液发生在无人时段，E3、E4 约束不到混合过程——可以先加热、搅拌，再降温到皮温。拿掉漂浮舱、只剩一罐高盐液，化工配液方案照样成立。所以「怎么调得准」不是本环境才有的难题，是把化工常规搬进舱里。\n\n处置：不独立立案。管路和泵在停机降温后结晶、需要循环保温，并入母案A 的 A1（高盐液路防结晶），且必须有清水对照。本卡不给出新颖性或创造性的最终结论，那是代理师的事。\n\n不建议投入：把「两次使用之间快速改密度」做成产品功能——行业没有这个需求，手段也已被覆盖。",
    examples: [
      "错：独立立案写「近饱和高盐液快速均匀配比」",
      "对：冷管结晶、循环保温并进母案A的A1，效果写堵塞与恢复时间",
    ],
    relatedIds: [
      "PAT-PRI-035",
      "PAT-PRI-036",
      "PAT-PRI-037",
      "PAT-PRI-038",
      "PAT-ROAD-A",
      "PAT-CLU-001",
      "PAT-RULE-003",
    ],
  },
  {
    id: "PAT-PRI-035",
    risk: "high",
    cluster: "1",
    publicationNo: "CN113359783B / CN113492958B / 申请号 202610513984（合并卡）",
    jurisdiction: "中国",
    techBranch: "浮力与密度调节",
    tags: ["合并卡", "削弱角度五", "盐度-密度-浮力链条", "调密度改浸没深度"],
    title: "「盐度→密度→浮力」与「调密度→改变浸没深度」均已公开",
    summary:
      "削弱候选角度五的第一层。物理链条不仅是教科书，工程应用也已被公开。后一轮配液检索表明，连「怎么调得准」这一层也被覆盖，见 PAT-PRI-036~038。",
    body:
      "已公开要点：\n- CN113359783B 欠驱动式深海潜器水下浮力变化量计算方法及控制方法：分别计算海水温度、**盐度**、压力变化对浮力变化量的影响并综合，再通过控制外油囊体积抵消，实现剖面运动中的精确浮力控制。明确利用了盐度变化→密度变化→浮力变化这条链。\n- 柔性可变密度浮球的液体晃动调控装置（申请号 202610513984）：浮球内设介质腔体，通过调节腔体内介质实现**浮球整体密度的变化，从而改变浮球在液体中的浸没深度及分布状态**；并可通过调节直径、厚度、注入介质种类及注入量来调节浸没深度。\n- CN113492958B 浮力可调式浮筒及调节方法：调节介质进出管加阀组，PLC 控制器结合水位监测装置自动调节浮筒下潜深度。\n- 另有多级缸结构浮力调节装置，0—80L 连续可调、最小步长 1L、精度不低于 0.5%FS。\n- 密度计原理本身：浸没体积与液体密度成反比，属教科书。\n\n对我们的限制：「改变密度以改变浸没深度」这一手段与目的关系已被公开且属公知，不能作为发明点。\n\n原卡留下的缝——「在接近饱和的高盐溶液中快速、均匀、可复现地改变液体本体浓度且抑制析出」——已按 PAT-PRI-036~038 检索。结论：该缝被漂浮舱本领域闭环、行业公开运维、以及化工配液与防结晶体系覆盖，不再作为独立立案依据。法律状态与最终文本待核验。",
    relatedIds: ["PAT-IDEA-005", "PAT-PRI-036", "PAT-PRI-037", "PAT-PRI-038", "PAT-ROAD-A", "PAT-CLU-001"],
  },
];

const fresh = [
  {
    id: "PAT-PRI-036",
    risk: "critical",
    cluster: "1",
    publicationNo:
      "Float Tank Solutions / Superior Float Tanks 运维公开 + 漂浮疗法分会水质标准（非专利公开）",
    jurisdiction: "国际行业公开与中国团体标准（非专利公开）",
    techBranch: "漂浮液运维",
    tags: ["非专利公开", "打掉角度五", "比重计", "工作点低于饱和", "冷管结晶"],
    title: "漂浮舱行业公开运维：比重计补盐、工作点低于饱和、停机冷管才会结晶",
    summary:
      "非专利公开直接打掉「近饱和配液精度」的前提。店家公开写工作比重、饱和点、补盐补水方法和泵结晶原因，这些都是现有技术。",
    body:
      "已公开要点：\n- Float Tank Solutions《Specific Gravity Specifics》：能漂起来大约从 1.24 开始；**饱和点（约 93.5°F / 34°C）大约 1.33**；到 1.3 及以上可能因结晶损坏泵和过滤。建议长期保持 **1.265—1.285**。蒸发会让比重慢慢升高，所以不要顶着饱和点跑。测量用比重计，约每 25 次或每周测一次。\n- Superior Float Tanks 装填与水质手册：盐溶完要数小时甚至过夜；目标 1.265—1.285；偏低加盐，偏高抽走盐水再补清水。过盐（over salting）会在泵和管路形成晶体。\n- 同站播客 DSP 137：泵卡死最常见原因不是舱内液体已经饱和，而是**停机后管路和泵里的液体变冷**，局部达到饱和而结晶；建议每天循环约两次保持管路温度。这与「两次使用之间把 1.22 精调到 1.28」不是同一件事。\n- 中国中医药研究信息会漂浮疗法分会《漂浮液水质标准》：食用级七水合硫酸镁，比重（20℃）**1.23—1.29**；并引用 ASTM D1429 水和盐水比重测试方法。\n- 市售漂浮舱比重计套装（1.15—1.35 与 1.24—1.30）把「测了再加盐或加水」写成商品说明，属使用公开。\n\n对我们的限制：\n- 工作点明显低于饱和点，「近饱和所以调不准」这个前提被行业自己的安全裕度打掉\n- 「测密度 → 加盐或加水 → 循环溶解」是公开运维，不是发明点\n- 真正的结晶事故模式（停机冷管）已被公开讨论，应作为母案A 的背景技术，不能当独立独权\n\n引用时注明为非专利公开出版物与产品说明。",
    relatedIds: ["PAT-IDEA-005", "PAT-PRI-037", "PAT-CLU-001", "PAT-ROAD-A", "PAT-RULE-002"],
  },
  {
    id: "PAT-PRI-037",
    risk: "critical",
    cluster: "1",
    publicationNo: "申请号 201621389026 / 申请号 201920404726 / CN115877899A/B（合并卡）",
    jurisdiction: "中国",
    techBranch: "漂浮舱配液与防结晶装置",
    tags: ["合并卡", "打掉角度五", "盐密度传感器闭环", "低温易结晶", "调盐度红线"],
    title: "漂浮舱本领域已公开：盐密度闭环调浓度，以及低温易结晶要恒温储液",
    summary:
      "不必跨到化工领域。漂浮舱自己的装置已经覆盖「测密度自动加减液」和「泻盐低温会结晶所以要加热保存」。",
    body:
      "已公开要点：\n- 申请号 201621389026《一种可自动调控的漂浮舱控制系统》：信息采集单元含液位传感器、**盐密度传感器**、温度传感器；控制终端含进水阀、**漂浮原液阀**、排水阀和加热模块。控制器按水位指令进排水，**按密度数据向原液阀、进水阀、排水阀发调节浓度的指令**。背景写的就是人工精确控制水温、盐浓度和水位不安全。这就是「怎么把漂浮液调到目标浓度」的装置写法。\n- 申请号 201920404726《一种储水一体漂浮舱》：背景明确「用于漂浮的漂浮溶液为温热高浓度泻盐溶液，具有**低温易结晶**，室温储存易与冷空气结合形成冷凝水的特点；一旦结晶难以清理」。解法是把溶液抽到密闭储水池，漂浮层与储水池各设恒温加热丝。这就是「高盐液停机后结晶」的问题与「加热保存」的常规解。\n- CN115877899A/B 已在库（姿态异常→调温度/水位/溶液含量）。「调盐度」本身被它写成与人体姿态联动，独权再写调盐度会撞红线，见 PAT-RED-001。\n\n对我们的限制：\n- 「盐密度传感器 + 加原液/加水/排水」不能当独立发明点\n- 「泻盐低温易结晶 → 恒温储液/加热」不能当独立发明点\n- 与 PAT-PRI-036 的公开运维叠在一起，角度⑤的装置层和运维层都被占\n\n法律状态与最终文本待核验。公开号以国知局文本为准（上列为申请号）。",
    relatedIds: ["PAT-IDEA-005", "PAT-PRI-036", "PAT-RED-001", "PAT-CLU-001", "PAT-ROAD-A"],
  },
  {
    id: "PAT-PRI-038",
    risk: "high",
    cluster: "1",
    publicationNo:
      "US6739408B2 / 申请号 202311706304 / US10745609B2 / 工业伴热循环与电导率温补（合并卡）",
    jurisdiction: "美国／中国／工业公知",
    techBranch: "工业配液与防结晶",
    tags: ["合并卡", "打掉角度五", "变密度配液", "结晶抑制剂", "电导率温度补偿"],
    title: "工业配液与防结晶是成熟体系：自动混液、伴热循环、结晶抑制剂、电导率温补",
    summary:
      "即使不看漂浮舱本领域，盐溶液「怎么配准、怎么不析晶」在钻井液、氯碱、制盐、仪表里都有现成做法。搬进漂浮舱属于常规应用。",
    body:
      "已公开要点：\n- US6739408B2：可变密度钻井液配制装置与方法。多路进料（含水或盐水）配流量计与自动阀，控制器按设定流量/密度混合。明确介质可以是 brine。这就是「把液体密度调到目标值」的工业闭环。\n- 申请号 202311706304《溶液恒温配制设备及方法》（南方英特空调）：背景写大批量盐溶液人工搅拌浓度不均。方案含纯水、恒温配制箱、药剂自动称重投放、控制系统；按配方自动投药加水控温，并用 pH 与浓度监控闭环到设定值。\n- US10745609B2 / US20200354623A1：高密度清洁盐水（clear brine fluids）加结晶抑制剂（醛糖、酮糖、醛醇、1,3-二羰基化合物等）降低真实结晶温度，以便更高含盐量仍保持清液。说明「近饱和高密度盐水怕结晶」是油田完成液的老问题，化学抑制也已公开。漂浮舱因皮肤接触不宜照搬这些添加剂，但问题本身不是新的。\n- 管道伴热、夹套保温、循环提高流速防结晶：大量中国实用新型（化工溶液保温加热、夹套保温、饱和盐水预冷循环混合等）把「加热 + 循环 → 不析晶」写成常规结构。\n- 电导率温度补偿：工业仪表普遍按约 2%/℃ 把读数折到 25℃；海水还有 PSS-78 / TEOS-10。浓盐水因离子缔合，线性补偿误差更大——这一点仪表行业也公开讨论，不能当发明点。浓盐水更常用密度计（含外夹超声密度计，专门避开探头结垢）。\n\n对我们的限制：\n- 「流量/称重 + 密度或浓度反馈 + 阀组」是配液公知架构\n- 「加热、循环、控制过饱和度」是防结晶公知架构\n- 「电导率要做温度补偿」是仪表公知\n- 去环境测试：拿掉漂浮舱，这些方案在化工罐里照样成立\n\n法律状态与最终文本待核验。",
    relatedIds: ["PAT-IDEA-005", "PAT-PRI-036", "PAT-RULE-003", "PAT-CLU-001"],
  },
];

function card(item, prev, kind) {
  return {
    id: item.id,
    kind: kind || item.kind || "retrieved",
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
    source: { file: srcFile, location: item.loc || "公开检索（网络）", date: "2026-09", author },
    status: "approved",
    confidentiality: "internal",
    createdAt: prev?.createdAt || now,
    updatedAt: now,
  };
}

const patents = JSON.parse(readFileSync(patentsPath, "utf-8"));
if (patents.some((p) => p.id === "PAT-PRI-036")) {
  console.log("角度⑤配液检索结果已入库，跳过。总数:", patents.length);
  process.exit(0);
}

const byId = new Map(patents.map((p) => [p.id, p]));
for (const item of revised) {
  if (!byId.has(item.id)) {
    console.error("待重写的卡不存在:", item.id);
    process.exit(1);
  }
  const kind = item.kind || byId.get(item.id).kind;
  byId.set(item.id, card(item, byId.get(item.id), kind));
}
let out = patents.map((p) => byId.get(p.id) || p);

const pris = fresh.map((f) => card(f, null, "retrieved"));
const i = out.map((p) => p.id).lastIndexOf("PAT-PRI-035");
const at = i === -1 ? out.length : i + 1;
out = [...out.slice(0, at), ...pris, ...out.slice(at)];

const ids = out.map((p) => p.id);
if (ids.length !== new Set(ids).size) {
  console.error("出现重复 id，已中止");
  process.exit(1);
}
writeFileSync(patentsPath, JSON.stringify(out, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const srcId = "SRC-PAT-DOSING-SEARCH";
const next = sources.filter((s) => s.id !== srcId);
next.push({
  id: srcId,
  filename: srcFile,
  cluster: "1",
  fileType: "other",
  uploadedAt: now,
  patentIds: [...revised, ...fresh].map((c) => c.id),
  status: "done",
  splitMode: "claude-agent",
  note: "角度⑤独立立案打掉：行业运维公开工作点低于饱和；漂浮舱已有盐密度闭环；化工配液与防结晶成熟。冷管结晶并入母案A。",
});
writeFileSync(sourcesPath, JSON.stringify(next, null, 2) + "\n");

console.log(JSON.stringify({ revised: revised.length, inserted: pris.length, total: out.length }, null, 2));
