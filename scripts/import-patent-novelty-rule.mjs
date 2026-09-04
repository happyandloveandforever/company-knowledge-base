/**
 * 绝对新颖性规则卡 + 国际前案 PAT-PRI-022~025 + A4底稿状态卡。
 * 起因：用户问「国外已授权的点中国还能不能写」，查证后补检索国际前案。
 * 幂等：PAT-RULE-002 已存在则跳过。
 * 运行：node scripts/import-patent-novelty-rule.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-04T05:45:00.000Z";
const author = "绝对新颖性查证与国际补充检索 2026-09-04（公开检索，未核验法律状态）";
const srcFile = "绝对新颖性查证与国际补充检索";

const dataDir = path.join(process.cwd(), "data");
const patentsPath = path.join(dataDir, "patents.json");
const sourcesPath = path.join(dataDir, "patent-sources.json");

const ruleCard = {
  id: "PAT-RULE-002",
  kind: "rule",
  cluster: "cross",
  risk: "critical",
  loc: "专利法第22条第2/5款、第24条；审查指南第二部分第三章",
  tags: ["绝对新颖性", "地域性", "抵触申请", "宽限期"],
  techBranch: "可专利性法律边界",
  title: "绝对新颖性：国外公开就能挡死中国申请，但国外授权挡不住中国生产",
  summary:
    "关键不是「有没有授权」，是「有没有公开」。2008年修法起中国采绝对新颖性，申请日前在国内外以任何方式为公众所知的技术都是现有技术。反过来，国外授权的专利只在该国有效，不能在中国主张侵权。两件事必须分开。",
  body:
    "一 法条原文\n专利法第22条第5款：本法所称现有技术，是指申请日以前在国内外为公众所知的技术。\n审查指南第二部分第三章：现有技术包括在申请日以前在国内外出版物上公开发表、在国内外公开使用或者以其他方式为公众所知的技术；出版物不受地理位置、语言或者获得方式的限制，也不受年代的限制；发行量多少、有没有人读过、申请人知不知道，都不影响。\n\n二 所以「国外已授权就不能再写」这个说法，方向对，表述错，而且实际更严格\n错在：判断标准不是授权，是公开。\n更严格在于，下面这些都算现有技术，都能挡死我们：\n- 国外申请公开了但从未授权\n- 国外专利已经失效、已经放弃\n- 根本没申请专利，只是发过论文、开过会、上过展会、卖过产品、发过视频\n- 任何语言、任何年代、任何国家\n所以只查中国库是不够的，必须同时查美、欧、日、WO，以及非专利公开（标准、手册、规范、行业指南）。\n\n三 反过来的一面：专利权有地域性\n国外授权的专利只在授权国境内有效。别人在美国拿了专利，我们在中国境内生产销售不构成对该美国专利的侵权。\n所以同一份美国专利文件：\n- 评我们中国申请能不能授权（可专利性）时，它是拦路虎\n- 评我们在中国卖会不会被告（FTO）时，它管不着\n这正是 PAT-RULE-001 说的「可专利性/FTO/合规三种风险不要混」。混了就会做出两种错误决定：因为国外有专利就不敢做产品，或者因为国外专利在境外就以为能在国内申请。\n\n四 抵触申请是另一回事，范围反而窄\n专利法第22条第2款的抵触申请，只针对向中国专利局提出过的在先申请（含进入中国国家阶段的PCT国际申请），且在我们申请日以后才公布的。纯国外申请、没进中国的，不构成抵触申请，但只要在我们申请日前已公开，它照样是现有技术。\n抵触申请包括任何单位或个人，含我们自己。所以自家的窄案先交先公开，会挡住自家后交的宽案——这就是母案A必须同日或先交的原因。\n\n五 宽限期只有四种，别指望\n专利法第24条，六个月内不丧失新颖性：国家紧急状态时为公共利益首次公开；中国政府主办或承认的国际展览会首次展出；规定的学术会议或技术会议首次发表；他人未经同意泄露。\n自己发论文、自己参展、自己上线卖，通常都不在里面。这是冻结对外表述的法律依据，不只是内部纪律。\n\n六 落到本项目的动作\n- 检索必须中外并行，且要检非专利公开（IEC/GB/行业规范/产品手册）\n- 立项评估时，先问「这个点在全世界有没有被公开过」，再问「有没有人在中国有专利」\n- 母案A与母案B同日提交的纪律，法律依据在抵触申请\n- 申请前不得对外披露技术细节，见 PAT-RED-001\n\n本卡是内部理解口径，不是法律意见；具体个案由专利代理师判断。",
  examples: [
    "对：某美国专利已失效，我们照样不能拿它公开过的方案去中国申请，但可以在中国生产",
    "错：以为国外专利过期了就等于这技术能重新申请",
  ],
  relatedIds: ["PAT-RULE-001", "PAT-RED-001", "PAT-NO3-001", "PAT-DRAFT-A4", "PAT-GAP-001"],
};

const priorArt = [
  {
    id: "PAT-PRI-022",
    risk: "critical",
    cluster: "4",
    publicationNo: "US12087146B2",
    jurisdiction: "美国",
    techBranch: "传感冗余与故障处置",
    tags: ["冗余气体检测", "故障继电器", "削弱可信度独权"],
    title: "US12087146 冗余气体检测：传感器故障时旁路并告警，已公开",
    summary:
      "直接削弱「传感器不可信也要动作」这一发明点。该案已公开双传感器串联、任一传感器自诊断到故障则由故障继电器旁路其报警、两个都故障则发出声光告警。",
    body: "已公开要点：第一、第二气体传感器与信号模块串联；两者均正常时需同时检出预定浓度才告警；任一故障则该传感器报警被故障继电器旁路，由正常传感器单独触发告警；两者均故障时发出声光警示表明监测已不可靠。\n\n对我们的限制：\n- 「传感器自诊断→故障→仍保持安全侧动作/告警」的思路已被公开，属于功能安全领域常规做法\n- 我们原独权里「判为不可信即按超标处理」不能作为唯一发明点\n\n仍可主张的差别：该案的故障判定依赖传感器自带自诊断，而自诊断明确不覆盖透气孔堵塞（见 PAT-PRI-020）。盐晶堵孔时该案会认为传感器正常。我们的差别在于用盐雾暴露累计时长与读数呆滞度作为独立判据。\n\n法律状态待核验。",
    relatedIds: ["PAT-DRAFT-A4", "PAT-PRI-020", "PAT-RULE-002"],
  },
  {
    id: "PAT-PRI-023",
    risk: "high",
    cluster: "4",
    publicationNo: "US6251243B1",
    jurisdiction: "美国",
    techBranch: "传感自检",
    tags: ["激励自检", "电化学传感器", "撞参考通道从权"],
    title: "US6251243 施加测试信号自检电化学气体传感器，已公开",
    summary:
      "直接撞我们底稿中「周期性施加已知激励、响应不足即判不可信」的从权。该案已公开用瞬态测试信号经放大器判断电化学传感器是否可用。",
    body: "已公开要点：测试信号发生电路产生瞬态测试信号；电化学传感器作为放大器的一个元件接入，决定传递函数；信号装置依据处理后的测试信号判断传感器是否可用并发出故障信号。可检出接线断路（电容骤降、呈开路）与电解液流失（电容下降导致增益降低、脉冲变短）。\n\n对我们的限制：\n- 「施加已知激励看响应幅值，低于阈值判失效」已公开，我方从权6 需改写或降级\n\n仍可主张的差别：该案检的是传感器电学特性（电容、电解液），检不出进气通路被外部物质堵塞。\n\n法律状态待核验。",
    relatedIds: ["PAT-DRAFT-A4", "PAT-PRI-020", "PAT-PRI-022"],
  },
  {
    id: "PAT-PRI-024",
    risk: "high",
    cluster: "1",
    publicationNo: "US7196632B2",
    jurisdiction: "美国",
    techBranch: "失效安全",
    tags: ["自检气体报警器", "断电切断气源", "失效安全"],
    title: "US7196632 具自检功能的燃气安全检测器：断电或故障时机械复位切断气源",
    summary:
      "削弱「失电默认安全阀位」这一点。该案已公开电磁铁因故障或断电停止工作时，机构自动释放使喷嘴复位、停止气体流出。",
    body: "已公开要点：带自检功能的燃气安全检测器；通过气瓶向传感器喷放测试气体验证传感器是否仍有响应（一种主动自检）；电磁铁因故障或断电停止工作时，吸板释放、喷嘴复位，气体停止流出，起到保护作用。\n\n对我们的限制：\n- 「断电即回到不供气的安全位」在燃气安全领域已公开，属常规失效安全设计\n- 「用已知气体主动喷测传感器」也已公开\n\n仍可主张的差别：该案是单一气源的家用燃气报警场景，无多气源互斥、无密闭舱内人员退出、无高盐环境。\n\n法律状态待核验。",
    relatedIds: ["PAT-DRAFT-A4", "PAT-PRI-022", "PAT-PRI-014"],
  },
  {
    id: "PAT-PRI-025",
    risk: "critical",
    cluster: "1",
    publicationNo: "IEC 60079-29-2:2015",
    jurisdiction: "国际标准（非专利公开）",
    techBranch: "行业公知",
    tags: ["非专利公开", "公知常识", "按密度布点", "呼吸区高度"],
    title: "IEC 60079-29-2 与行业布点指南：按气体密度分层布点是教科书做法",
    summary:
      "打掉「分层布点」作为发明点。国际标准与主流厂商指南早已写明：比空气轻的气体探头装顶部，比空气重的装底部；密度接近空气的装在人员呼吸区高度（约1.5—1.8m）。",
    body: "已公开要点：\n- IEC 60079-29-2:2015 给出可燃气体探测器的选型、安装、使用与维护指南，涵盖气体扩散、密度、可燃极限与通风对探头布点的影响。\n- 主流厂商公开指南（Crowcon、Weatherall 等）明确：比空气轻的气体（氢、甲烷）探头应装在泄漏点上方/天花板处，并注意屋顶尖角处的聚集；比空气重的应装在地面或低洼处；密度接近空气的折中装在被保护人员呼吸区高度，典型 1.5—1.8m。\n- 标准同时提醒：不能机械照搬，应尽量靠近泄漏源或沿实际流动路径布置，顶部/底部布点只是辅助。\n\n对我们的限制：\n- 「氢气测舱顶、臭氧测口鼻高度」属于本领域技术人员的常规选择，不能作为创造性的落脚点\n- 结合 PAT-PRI-019 华盛顿州规范已要求在液面上方约六英寸即面部高度测臭氧，这一点更加站不住\n\n仍可用之处：写进背景技术，说明常规布点在本场景下为何仍不足——因为问题不在测点位置，而在测点上的传感器会被盐晶致盲。\n\n引用时注明为非专利公开出版物。",
    relatedIds: ["PAT-DRAFT-A4", "PAT-PRI-019", "PAT-RULE-002"],
  },
];

const draftCard = {
  id: "PAT-DRAFT-A4",
  kind: "draft",
  cluster: "1",
  risk: "high",
  loc: "patent-drafts/申请文件底稿-多气源安全互锁.md",
  tags: ["底稿v0.1", "发明点已收窄", "待工程确认"],
  techBranch: "第一件底稿",
  title: "第一件底稿状态：多气源安全互锁；国际检索后发明点收窄到盐晶致盲",
  summary:
    "已按中国专利体例写出完整底稿（权利要求书+说明书+摘要），文件在 patent-drafts/申请文件底稿-多气源安全互锁.md。国际检索后，原定四个发明点有三个被公知打掉，只剩高盐结晶导致传感器沉默失效这一条可辩护。",
  body:
    "底稿覆盖：权利要求1—14（装置独权+方法独权）、技术领域、背景技术、发明内容、附图说明、两个实施例、摘要、缺口清单、给代理师的移交说明。\n\n国际检索后的判定：\n1 分层布点（氢测顶、臭氧测口鼻高度）→ 打掉。IEC 60079-29-2 与厂商指南是教科书做法，华盛顿州规范已指定面部高度测臭氧。见 PAT-PRI-025、PAT-PRI-019。\n2 传感器不可信即按超标处理 → 严重削弱。US12087146 已公开故障旁路与失效告警。见 PAT-PRI-022。\n3 硬件互锁与失电安全阀位 → 打掉。US7196632 已公开断电复位切断气源；国内水疗机实用新型已公开臭氧与供气互斥。见 PAT-PRI-024、PAT-PRI-014。\n4 高盐雾使传感器透气孔结晶、常规自诊断查不出、造成沉默失效 → 仍然成立。传感器手册明写自诊断不覆盖透气孔堵塞（PAT-PRI-020），US6251243 检的是电容与电解液（PAT-PRI-023），都查不出堵孔。\n\n结论：独权必须以第4点为核心重写，前三点降为从权或组合要素。剩下的保护范围会比原稿窄很多。\n\n候选加强角度（待工程与文献验证，勿当结论）：高盐溶液的盐析效应会降低气体溶解度，同样投加量下臭氧从液面逸出进入头空间的比例可能高于清水系统，因此按清水设计的投加与通风策略在漂浮舱不适用。若此现象属实且可实测，可支撑一个以盐浓度/导电率为输入调整投加与排气的技术方案，且高盐在其中是必要条件而非附带条件。必须先做实验，不得先写进申请。\n\n第一个要问工程师的问题：实际设备到底会不会同时装氢气与臭氧两路气源。若不会，本底稿前提不成立，改写A3热场与液位联锁。",
  examples: [
    "对：独权写成「以盐雾暴露累计时长与读数呆滞度判定传感器致盲」",
    "错：独权还写「按气体密度分层布点」——这是公知",
  ],
  relatedIds: [
    "PAT-WRITE-001",
    "PAT-WRITE-005",
    "PAT-RULE-002",
    "PAT-PRI-013",
    "PAT-PRI-020",
    "PAT-PRI-022",
    "PAT-PRI-025",
    "PAT-ROAD-A",
  ],
};

function card(item, kind) {
  return {
    id: item.id,
    kind: kind || "retrieved",
    title: item.title,
    summary: item.summary,
    body: item.body,
    tags: item.tags,
    cluster: item.cluster,
    risk: item.risk,
    publicationNo: item.publicationNo,
    applicationNo: item.applicationNo,
    jurisdiction: item.jurisdiction,
    techBranch: item.techBranch,
    relatedIds: item.relatedIds || [],
    examples: item.examples || [],
    source: {
      file: srcFile,
      location: item.loc || "公开检索（网络）",
      date: "2026-09",
      author,
    },
    status: "approved",
    confidentiality: "internal",
    createdAt: now,
    updatedAt: now,
  };
}

const patents = JSON.parse(readFileSync(patentsPath, "utf-8"));
if (patents.some((p) => p.id === "PAT-RULE-002")) {
  console.log("绝对新颖性卡与国际前案已入库，跳过。总数:", patents.length);
  process.exit(0);
}

const byId = new Map(patents.map((p) => [p.id, p]));
const built = [];

// 规则卡紧跟总纲
const rule = card(ruleCard, "rule");
// 底稿状态卡放到撰写包末尾
const draft = card(draftCard, "draft");
const pri = priorArt.map((p) => card(p, "retrieved"));

let out = [...patents];

function insertAfter(list, anchorId, cards) {
  const i = list.map((p) => p.id).lastIndexOf(anchorId);
  const at = i === -1 ? list.length : i + 1;
  return [...list.slice(0, at), ...cards, ...list.slice(at)];
}

out = insertAfter(out, "PAT-RULE-001", [rule]);
out = insertAfter(out, "PAT-WRITE-006", [draft]);
out = insertAfter(out, "PAT-PRI-021", pri);
built.push(rule, draft, ...pri);

if (built.some((c) => byId.has(c.id))) {
  console.error("存在重复 id，已中止");
  process.exit(1);
}

writeFileSync(patentsPath, JSON.stringify(out, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const srcId = "SRC-PAT-NOVELTY-INTL";
const nextSources = sources.filter((s) => s.id !== srcId);
nextSources.push({
  id: srcId,
  filename: srcFile,
  cluster: "cross",
  fileType: "other",
  uploadedAt: now,
  patentIds: built.map((c) => c.id),
  status: "done",
  splitMode: "claude-agent",
  note: "绝对新颖性法条查证 + 美国/IEC 国际前案；A4底稿发明点据此收窄。法律状态未核验。",
});
writeFileSync(sourcesPath, JSON.stringify(nextSources, null, 2) + "\n");

console.log(JSON.stringify({ inserted: built.length, total: out.length }, null, 2));
