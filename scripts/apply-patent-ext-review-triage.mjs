/**
 * 第三方「漂浮舱专利发散_整合版」过三道闸的结论。
 * 幂等：PAT-EXT-001 已存在则跳过。
 * 运行：node scripts/apply-patent-ext-review-triage.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-04T09:20:00.000Z";
const srcFile = "外部AI回答-整合版";
const author = "第三方整合版过闸 2026-09-04（公开检索，未核验法律状态）";

const dataDir = path.join(process.cwd(), "data");
const patentsPath = path.join(dataDir, "patents.json");
const sourcesPath = path.join(dataDir, "patent-sources.json");

const cards = [
  {
    id: "PAT-EXT-001",
    kind: "layout",
    cluster: "cross",
    risk: "critical",
    loc: "过闸结论",
    tags: ["第三方评审", "过期任务书", "便宜不是技术问题", "不要捆成一套"],
    techBranch: "外部评审过闸",
    title: "第三方整合版：第一部分过期作废；A/B 独立立案打掉；E 黄灯须先检索；不要把沉默失效和 EIS 捆成一套",
    summary:
      "对方用的是旧任务书，把已经打掉的①判绿、把③拉回剂量安全、把⑤做成密度闭环。新角度里，A 死在「高电导更好测」（又是便宜），B 就是刚打掉的⑤，C/D 邻域或工业常规。E 的难题是真的，手段像仪表常规，先检索再谈。沉默失效仍然最高优先，不要和 A、E 捆成一套阻抗体系。",
    body:
      "来源：patent-drafts/外部AI回答-整合版.md。过闸顺序：已打掉清单 → 去环境测试（含「难题还是便宜」）→ 红线与第25条。不是新颖性或创造性的最终结论。\n\n一、第一部分不能用\n- 角度一判绿：库里已打掉。US7069183 等占了路径；「环境更安静所以更容易」不是技术问题。见 PAT-IDEA-001。\n- 角度三写成「剂量安全阈值」：那是旧定位。限制剂量已有强制标准。现行缝是含气泡高盐液里测不准。见 PAT-IDEA-003、PAT-PRI-034。\n- 角度五做成新角度B「使用中闭环调密度」：独立立案已打掉。行业工作点低于饱和；舱内已有盐密度闭环；化工配液成熟。见 PAT-IDEA-005、PAT-PRI-036~038。还要避开 CN115877899（姿态→调盐度）。\n\n二、新角度过闸\nA 液路 EIS 指纹 🔴\n对方自己写「高电导率提供信噪比，淡水信号太弱」——这是便宜，不是难题，和角度一同一类死法。手段上，卤水/冷却水用阻抗或频率变化看结垢、生物膜、腐蚀已公开（PAT-PRI-039）。拿掉漂浮舱，化工循环水照样做。\n\nB 密度闭环 🔴\n即角度五的「做实版」。补盐/补水/脱盐逼近浸没体积，是配液闭环加阿基米德原理。申请号 201621389026 已用盐密度传感器加原液阀。使用中改密度还可能滑向 CN115877899。\n\nC 头空间微环境解耦 🟡搁置\n物理上口鼻只在液面上小空间里，问题可以成立。但呼吸区独立通风在飞机座舱等邻域已公开；我们的分层布点（氢测顶、臭氧测口鼻）已被 IEC 60079-29-2 与华盛顿州规范打掉。跟沉默失效做交叉验证，接近 US12087146 的冗余旁路。对方自己信心低，同意搁置。\n\nD 跨模块一致性 不独立立案\n加热功率对温升、投加量对浓度，是工业软测量/解析冗余，任意加热罐都能做。拿掉 E1 仍成立。有一处可当沉默失效的从权写法：电路自检正常，但投加量与气体读数对不上——这是「读数呆滞」的一种测法，写进 PAT-DRAFT-A4 实施例，不另立母案。\n\nE 高盐下消毒读数补偿 🟡待检索\n高盐干扰测量是真难题，不是便宜。但温度补偿、pH 补偿是仪表标配；海水/卤水型氯和臭氧电极是在售品类；按电导率或离子强度修正电化学读数，对本领域技术人员很像常规。还要把「头空间气相传感器」（沉默失效那一类）和「液体里的臭氧/双氧水」分开，不能混成一个补偿模型。先检索海水臭氧/双氧水电极与离子强度补偿，再决定是否并入母案B。现在不要标高优先级绿灯。\n\n三、配方 / 体系 / 软件\n- 多元素配方：对方提醒对。经皮吸收、补矿物质踩疗效红线与第25条。US20150320087A1 等已有微量元素浴液。只在「某种离子加速腐蚀或堵孔、设备因此改材料或传感」这种联动上才可能有缝，且须实验。\n- 体系创新整体打包：同意放弃。第25条第2项智力活动规则，商业模式不授权。\n- 自有软件：同意先按「技术数据进、技术效果出」筛选。监控、预约、日历提醒不要申请。沉默失效的判据已经在 A4，不要另立软件母案。\n\n四、市场调研能用的一句\n产品手册没写透气孔堵塞致盲，只说明这个问题可能真实，不能当成「没人做过」。手册级自诊断不覆盖堵孔，库里已有 PAT-PRI-020。\n\n五、最危险的一句建议\n对方要把沉默失效、A、E 捆成「一份多频阻抗数据支撑多个功能」。A 已经因便宜和前案打掉。捆在一起是审查指南里的简单叠加，会把还活着的点拖进拼凑。沉默失效继续单独走，输入仍是盐雾暴露与读数呆滞，不要改成 EIS 主链。\n\n待检索：仅 E 的海水/卤水臭氧与双氧水电极、离子强度补偿。A/B 不再检索。\n待验证：仍是盐雾致盲对照，以及角度③气泡开关声压。",
    examples: [
      "对：沉默失效单独走；E 先检索再决定是否并入B",
      "错：把①判绿，或把沉默失效和 EIS 捆成一套体系",
    ],
    relatedIds: [
      "PAT-IDEA-001",
      "PAT-IDEA-003",
      "PAT-IDEA-005",
      "PAT-DRAFT-A4",
      "PAT-PRI-039",
      "PAT-PRI-040",
      "PAT-RULE-003",
      "PAT-RULE-005",
    ],
  },
  {
    id: "PAT-PRI-039",
    kind: "retrieved",
    cluster: "1",
    risk: "critical",
    publicationNo: "US20240418665A1 / US10234376B2 / US6053032A（合并卡）",
    jurisdiction: "美国",
    techBranch: "阻抗与结垢监测",
    tags: ["合并卡", "打掉角度A", "EIS卤水结垢", "冷却水生物膜"],
    title: "卤水与冷却水用阻抗看结垢、生物膜、腐蚀已公开——打掉液路 EIS 指纹",
    summary:
      "第三方新角度A 担心的化工前案是实的。高盐循环液里用阻抗或频率变化监测结垢，不是漂浮舱才有的问题。",
    body:
      "已公开要点：\n- US20240418665A1（申请号 18/669,457 等公开文本）介观流体阻抗传感器：在不锈钢毛细管流动体系里用 EIS 实时看结垢；工作电极、参比、对电极；可混合不同卤水或油；还评估卤水温度变化。这就是「高盐流动液体 + 阻抗谱看结垢」。\n- US10234376B2：非接触 EIS 监测浸没表面的生物膜与腐蚀。交流信号经水溶液传播，阻抗参数对应微生物/腐蚀特征。EIS 用于水下表面状态是公开手段。\n- US6053032A（Nalco）：过程水流中用探头频率变化测结垢、腐蚀、生物膜质量累积，并据此投加阻垢剂或杀菌剂。冷却水/工艺水在线沉积监测是工业常规。\n- 另有冷却水连续生物膜监测、线性极化电阻测腐蚀等在售与授权体系，不逐条展开。\n\n对我们的限制：\n- 「循环液路多点电极 + 阻抗谱反推结垢/堵塞/污损」在卤水和冷却水里已公开\n- 第三方说高电导率让信噪比更好，等于承认这是更容易的条件，不是技术问题\n- 去环境测试：拿掉漂浮舱，化工循环水方案照样成立\n\n法律状态与最终文本待核验。",
    relatedIds: ["PAT-EXT-001", "PAT-IDEA-001", "PAT-RULE-003", "PAT-CLU-001"],
  },
  {
    id: "PAT-PRI-040",
    kind: "retrieved",
    cluster: "4",
    risk: "high",
    publicationNo:
      "Endress+Hauser CCS58E / 海水型余氯臭氧电极品类 / Pyxis ST-765SS-O3（非专利公开，合并卡）",
    jurisdiction: "国际产品手册与在售仪器（非专利公开）",
    techBranch: "消毒传感器补偿",
    tags: ["非专利公开", "削弱角度E", "温度pH补偿标配", "海水型电极"],
    title: "消毒电极普遍带温度甚至 pH 补偿，海水/卤水型是在售品类",
    summary:
      "削弱第三方新角度E 的「电子传感器自动补偿没人做过」。仪表常规就是补偿；高盐介质另有海水型电极，不必先发明一套电导率补偿算法。",
    body:
      "已公开要点：\n- 膜式安培臭氧/双氧水电极普遍带自动温度补偿。Endress+Hauser Memosens CCS58E：膜扩散安培法测臭氧；电导率工作范围写到 0.03—40 mS/cm；并注明含盐量高时碘/溴会干扰 DPD 参比。说明厂商已经知道盐分会干扰臭氧相关测量，处理方式是限定电导率范围和校准方法，不是漂浮舱才发现的问题。\n- 水消毒电极目录里，游离氯有专门的 seawater/brine 型号，与淡水型号并列。高盐介质用专用膜/专用型号，是产品线公知。\n- Pyxis ST-765SS-O3 等无膜臭氧电极公开「实时 pH + 温度补偿」。补偿模型作为设备内置功能已在售。\n- 离子强度影响电化学传感器，用温度、pH、电导率做修正，是仪表教科书。溶解氧、pH、余氯在海水养殖和冷却塔里都有盐度相关修正实践。\n\n对我们的限制：\n- 「电子传感器按液体状态自动修正读数」不能当独立发明点\n- 22—30% 硫酸镁的电导率可能高于部分淡水型臭氧电极的额定范围，这是选型问题，优先查有没有卤水额定型号，而不是先写补偿算法\n- 头空间气相臭氧（沉默失效那一类）和液体里的臭氧/双氧水不是同一条测量链，不能共用一个「按电导率补偿」的独权\n\n仍可能的窄缝（待检索，不立案）：在额定范围之外的近饱和硫酸镁里，现成海水电极是否仍然失效，以及失效模式是否无法用温度/pH 常规补偿解释。没有这条对照数据，E 不能升绿灯。\n\n引用时注明为产品手册与非专利公开。",
    relatedIds: ["PAT-EXT-001", "PAT-DRAFT-A4", "PAT-CLU-004", "PAT-RULE-003"],
  },
];

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
    source: { file: srcFile, location: item.loc || "公开检索（网络）", date: "2026-09", author },
    status: "approved",
    confidentiality: "internal",
    createdAt: prev?.createdAt || now,
    updatedAt: now,
  };
}

const patents = JSON.parse(readFileSync(patentsPath, "utf-8"));
if (patents.some((p) => p.id === "PAT-EXT-001")) {
  console.log("第三方整合版过闸结果已入库，跳过。总数:", patents.length);
  process.exit(0);
}

const built = cards.map((c) => card(c, null));
const ext = built.find((c) => c.id === "PAT-EXT-001");
const pris = built.filter((c) => c.kind === "retrieved");

let out = [...patents, ext];
const i = out.map((p) => p.id).lastIndexOf("PAT-PRI-038");
const at = i === -1 ? out.length : i + 1;
out = [...out.slice(0, at), ...pris, ...out.slice(at)];

const ids = out.map((p) => p.id);
if (ids.length !== new Set(ids).size) {
  console.error("出现重复 id，已中止");
  process.exit(1);
}
writeFileSync(patentsPath, JSON.stringify(out, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const srcId = "SRC-PAT-EXT-REVIEW";
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
  note: "第三方整合版过闸：第一部分过期；A/B打掉；C搁置；D并入A4从权；E黄灯待检索。不要把沉默失效和EIS捆套。",
});
writeFileSync(sourcesPath, JSON.stringify(next, null, 2) + "\n");

console.log(JSON.stringify({ inserted: built.length, total: out.length }, null, 2));
