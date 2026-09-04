/**
 * A4 气体安全方向的补充检索前案 PAT-PRI-013~021。
 * 只追加检索卡，不动母案、六簇和撰写包。
 * 幂等：PAT-PRI-013 已存在则跳过。
 * 运行：node scripts/import-patent-gas-safety-prior-art.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-04T05:30:00.000Z";
const author = "A4气体安全方向补充检索 2026-09-04（公开检索，未核验法律状态）";
const srcFile = "A4多气源安全补充检索";

const dataDir = path.join(process.cwd(), "data");
const patentsPath = path.join(dataDir, "patents.json");
const sourcesPath = path.join(dataDir, "patent-sources.json");

const items = [
  {
    id: "PAT-PRI-013",
    risk: "critical",
    cluster: "1",
    publicationNo: "CN112472473A",
    applicationNo: "202011511912.7",
    jurisdiction: "中国",
    techBranch: "密闭舱气体安全",
    tags: ["氢氧舱", "门未关禁止产气", "换气组件", "A4最近前案"],
    title: "CN112472473A 微高压氢气和氧气舱：舱门未关就禁止产气，已有气体传感器与换气",
    summary:
      "A4方向目前查到的最近前案。已公开氢氧发生器 + H2/O2/CO2浓度传感器 + 电磁阀风扇换气组件 + 舱门未关闭则不允许氢氧发生器运行。申请人美魁医疗器械（上海），申请日2020-12-18。",
    body: "已公开要点：底座内氢氧发生器与空调；舱体内传感器组含二氧化碳、氢气、氧气浓度传感器；换气组件由电磁阀和风扇构成，防CO2过高；门磁信号送移动终端，舱门未关闭时不控制氢氧发生器等运行。\n\n对我们的限制：\n- 「密闭舱 + 产氢 + 气体浓度传感器 + 换气」整体已公开，不能作为独权发明点\n- 「门未关闭禁止产气」已公开，不能单独主张\n\n可绕开的方向：该案面向常规气体环境，未涉及高盐雾对传感器读数可信度的破坏、未按气体密度分层布点、未公开失电默认阀位、退出逻辑是「不让开始」而不是「让已在舱内的人安全出来」。\n\n必须由代理师核验最终文本、有效权利要求与法律状态。",
    relatedIds: ["PAT-ROAD-A", "PAT-CLU-001", "PAT-DRAFT-A4"],
  },
  {
    id: "PAT-PRI-014",
    risk: "critical",
    cluster: "2",
    publicationNo: "公开号待核验",
    applicationNo: "200720120670",
    jurisdiction: "中国（实用新型）",
    techBranch: "气源互斥",
    tags: ["臭氧与供气互斥", "控制电路互锁", "水疗机"],
    title: "气泡超声波水疗机：臭氧系统与供气系统互斥运行已被公开",
    summary:
      "直接打掉「两路气源不能同时开」这一单一发明点。该实用新型已公开在浴用水疗设备中，用控制电路使臭氧发生系统与供气系统互斥运行，以避免臭氧泄漏风险。",
    body: "已公开要点：壳体内含供气系统（风机+主电机+主风道）与臭氧发生系统（臭氧发生器+臭氧输送风机+臭氧电机），主机MCU分别通过控制电路控制两者，实现互斥运行；另含温度检测。\n\n对我们的限制：\n- 「臭氧路与另一气路互斥」在浴用设备中已是现有技术，单独写进独权会缺乏新颖性/创造性\n\n可绕开的方向：该案互斥由MCU控制电路实现，属软件/弱电层。我们可主张独立于控制器的硬件互锁件，以及断电时的确定失效安全阀位——控制器死机或断电时该案没有确定安全状态。\n\n注意：公开号与法律状态待核验，申请号来自公开检索页面。",
    relatedIds: ["PAT-CLU-002", "PAT-DRAFT-A4", "PAT-PRI-016"],
  },
  {
    id: "PAT-PRI-015",
    risk: "high",
    cluster: "1",
    publicationNo: "CN110864002A",
    applicationNo: "201922285200（同族实用新型）",
    jurisdiction: "中国",
    techBranch: "密闭空间联锁",
    tags: ["密闭空间", "气体检测联锁", "机械钥匙", "方向相反"],
    title: "CN110864002A 密闭空间气体检测安全联锁：检测合格才准进入，与我们的场景方向相反",
    summary:
      "已公开钥匙开关触发、强制排气、气体浓度检测合格后机械钥匙才能取出进入、二次强制排气的机械联锁流程。方向是阻止人进入受限空间。",
    body: "已公开要点：S1操作钥匙开关A；S2处理器控制首次排气；S3气体浓度传感器检测；S4合格后机械钥匙A1才能转动取下；S5二次强制排气；人员持钥匙进入后气泵持续工作。\n\n对我们的限制：\n- 「气体检测 + 强制排气 + 机械联锁」的组合已公开\n\n可绕开的方向：该案保护的是「未合格不许进」。漂浮舱的真实风险相反——使用者已仰卧在舱内、门已关、听觉视觉被隔离，需要的是「异常时让他安全出来」，涉及解锁优先级、起身缓冲、渐变引导。该案完全未涉及。\n\n法律状态与最终文本待核验。",
    relatedIds: ["PAT-DRAFT-A4", "PAT-CLU-006", "PAT-STATE-001"],
  },
  {
    id: "PAT-PRI-016",
    risk: "high",
    cluster: "2",
    publicationNo: "公开号待核验",
    applicationNo: "201810905776",
    jurisdiction: "中国",
    techBranch: "气液与消毒",
    tags: ["氢气浴", "臭氧清洗", "阀门分时", "微纳米气泡"],
    title: "多气体组合微纳米气泡氢气浴装置：氢气浴与臭氧在同一装置内分时使用已公开",
    summary:
      "已公开在同一浸浴装置内同时具备高溶解氢气水发生系统与臭氧发生器，通过阀门与支路控制实现清洗消毒与气泡产生的分时切换。",
    body: "已公开要点：微纳米气泡发生系统含气液混合泵、气液缓冲罐、释放器、多个阀门与单向阀、自动排气阀；气液混合泵前设臭氧发生器；通过分支管路与阀门开闭切换清洗消毒通道；使用后用臭氧对管路杀菌清洗。\n\n对我们的限制：\n- 「同一漂浮/浸浴装置里既有氢又有臭氧、用阀门分时」不是新的\n- 「臭氧走管路消毒」不是新的\n\n可绕开的方向：该案关注的是清洗流程与气泡质量，不涉及使用者在舱内时头空间的气体安全、传感器可信度与紧急退出。\n\n公开号与法律状态待核验。",
    relatedIds: ["PAT-CLU-002", "PAT-PRI-014", "PAT-DRAFT-A4"],
  },
  {
    id: "PAT-PRI-017",
    risk: "medium",
    cluster: "1",
    publicationNo: "US9956374B2",
    applicationNo: "US 2015/0306341",
    jurisdiction: "美国",
    techBranch: "漂浮舱消毒",
    tags: ["漂浮舱", "UV+臭氧", "溶解臭氧传感"],
    title: "US9956374 Isolation floatation chamber：漂浮舱 UV + 臭氧消毒与溶解臭氧监测",
    summary:
      "漂浮舱本体加UV与臭氧注入消毒、用溶解臭氧传感器验证消毒效果，已是公开技术。漂浮舱用臭氧本身不能主张。",
    body: "已公开要点：隔光隔音舱体 + 支撑漂浮的溶液；消毒系统含泵、过滤、UV系统与臭氧注入系统（4g/h臭氧发生器、注入阀、水封防倒流）；以溶解臭氧传感器验证消毒。\n\n对我们的限制：\n- 漂浮舱 + 臭氧消毒 + 溶解臭氧监测已公开\n\n可绕开的方向：该案监测的是液相溶解臭氧，不是液面上方头空间的气相浓度；无可燃气源共存问题；无互锁与退出逻辑。\n\n法律状态待核验。",
    relatedIds: ["PAT-CLU-001", "PAT-DRAFT-A4"],
  },
  {
    id: "PAT-PRI-018",
    risk: "high",
    cluster: "6",
    publicationNo: "公开号待核验",
    applicationNo: "202510233184",
    jurisdiction: "中国",
    techBranch: "气体分级与解锁",
    tags: ["智能门锁", "分级阈值", "排气后解锁", "撞退出逻辑"],
    title: "多功能智能门锁：气体三级阈值→播报→排气→解锁开门已被公开",
    summary:
      "直接影响我们的分级退出逻辑。该案已公开按三级阈值分别执行语音播报、启动排气、解锁并弹射开门。",
    body: "已公开要点：检测模块采集气体、烟雾等环境数据；主控按三级预设阈值判断——大于第一阈值语音播报；大于第二阈值控制排气模块换气；大于第三阈值解锁并由弹射模块开门。\n\n对我们的限制：\n- 「气体浓度分三级 → 提示 / 排气 / 解锁开门」这一控制逻辑本身已公开，不能作为独权唯一发明点\n\n可绕开的方向：该案针对常规居室门锁，其触发前提是「传感器读数可信」。漂浮舱的核心差别是高盐雾会让传感器读数偏低甚至归零，把「测不到」误判成「安全」；且使用者是仰卧在液体中，退出需要起身缓冲与引导。这两点该案均未涉及。\n\n公开号与法律状态待核验。",
    relatedIds: ["PAT-DRAFT-A4", "PAT-CLU-006", "PAT-STATE-001"],
  },
  {
    id: "PAT-PRI-019",
    risk: "high",
    cluster: "1",
    publicationNo: "WA-DOH-333-219",
    jurisdiction: "美国华盛顿州（非专利公开／监管规范）",
    techBranch: "行业规范",
    tags: ["非专利公开", "公知常识", "臭氧联锁", "0.1ppm"],
    title: "华盛顿州漂浮系统规范：臭氧机必须与循环泵电气联锁、0.1ppm 声光报警",
    summary:
      "不是专利，但属于可以被引为公知常识的公开出版物，同样能破坏新颖性或创造性。写独权时不能把这两条当发明点。",
    body: "已公开要点：处理设备（含臭氧机）必须与循环泵电气联锁，泵停则设备停；使用臭氧机时须配校准过的臭氧检测仪，能在漂浮液面上方约六英寸（使用者面部通常所在位置）读取0.0—0.1ppm的环境浓度；采用电晕放电式臭氧机时须在其近旁另设硬接线（非电池供电）臭氧检测仪，达到0.1ppm即发出声音报警。\n\n对我们的限制：\n- 「臭氧机与泵联锁」是监管强制要求，属公知\n- 「在液面上方约六英寸即面部高度测臭氧」已被公开，我们的分层布点里第二传感器高度不能只靠这一点主张创造性\n\n可用之处：这份规范反过来证明「面部高度的气相臭氧」是业内公认风险点，可以写进背景技术，支撑技术问题的真实性。\n\n引用时注明为非专利公开出版物。",
    relatedIds: ["PAT-DRAFT-A4", "PAT-PRI-017", "PAT-GAP-001"],
  },
  {
    id: "PAT-PRI-020",
    risk: "high",
    cluster: "4",
    publicationNo: "CN120014795A / CN 申请号 202511743265",
    jurisdiction: "中国",
    techBranch: "传感可信度",
    tags: ["传感器自诊断", "参考传感器", "温湿度校准", "公知"],
    title: "气体传感器自诊断与漂移补偿：参考传感器差分、温湿度校准、失效判定都是公知",
    summary:
      "两件近期公开合并记录。主传感器+参考传感器差分、基线补偿、健康状态自诊断、按温湿度动态校准、异常脉冲识别，均已公开。传感器自检本身不能单独作为发明点。",
    body: "已公开要点：\n- 申请号202511743265：主传感器与参考传感器差分剥离环境干扰、基线补偿、逐个分析健康状态、判断老化与同步漂移。\n- CN120014795A：红外/电化学/半导体多类型监测，按环境温度湿度参数构建多项式校准模型动态校准，识别异常脉冲并判定传感器故障。\n另有传感器手册级公知：UL2034 要求的自诊断电路，通过测电容判断断路、短路与灵敏度丧失；但明确不覆盖透气孔堵塞导致的无法进气。\n\n对我们的限制：\n- 「参考传感器 + 差分 + 自诊断 + 温湿度补偿」是公知，写进独权只能作为组合要素，不能当唯一发明点\n\n可用之处：手册那句「自诊断不覆盖透气孔堵塞」正好是我们的技术问题——高盐雾结晶恰恰堵的是透气孔，常规自诊断查不出来，此时传感器仍会输出一个看似正常的低读数。这个缺口可以写进背景技术，支撑「不可信即按超标处理」的必要性。\n\n法律状态待核验。",
    relatedIds: ["PAT-DRAFT-A4", "PAT-ROAD-B", "PAT-CLU-004"],
  },
  {
    id: "PAT-PRI-021",
    risk: "medium",
    cluster: "2",
    publicationNo: "CN113354160A",
    applicationNo: "202010154409.4",
    jurisdiction: "中国",
    techBranch: "富氢富氧沐浴",
    tags: ["电解产氢", "臭氧发生装置", "单向阀"],
    title: "CN113354160A 富氢水和富氧水沐浴系统：电解产氢产氧 + 臭氧 + 单向阀已公开",
    summary:
      "沐浴场景下电解装置产富氢水富氧水、沐浴水管上接臭氧发生装置、其间设单向阀，已被公开。东莞宝杰康氢，申请日2020-03-07。",
    body: "已公开要点：过滤装置 + 电解装置（电解水进口、富氢水出口、富氧水出口）；富氢水出口接沐浴水管；沐浴水管上连接臭氧发生装置；电解装置与臭氧发生装置之间的沐浴水管上设单向阀。\n\n对我们的限制：\n- 沐浴系统中「电解产氢 + 臭氧 + 单向阀防倒流」的组合已公开\n\n可绕开的方向：该案是液路水处理层面，不涉及密闭舱头空间气相安全、传感器可信度与人员退出。\n\n法律状态待核验。",
    relatedIds: ["PAT-CLU-002", "PAT-PRI-016", "PAT-DRAFT-A4"],
  },
];

function card(item) {
  return {
    id: item.id,
    kind: "retrieved",
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
      location: "公开检索（网络）",
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
if (patents.some((p) => p.id === "PAT-PRI-013")) {
  console.log("A4补充前案已入库，跳过。总数:", patents.length);
  process.exit(0);
}

const built = items.map(card);
const lastPri = patents.map((p) => p.id).lastIndexOf("PAT-PRI-012");
const at = lastPri === -1 ? patents.length : lastPri + 1;
const merged = [...patents.slice(0, at), ...built, ...patents.slice(at)];
writeFileSync(patentsPath, JSON.stringify(merged, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const srcId = "SRC-PAT-GAS-SEARCH";
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
  note: "为A4多气源安全底稿做的补充公开检索；均未核验法律状态与最终文本。",
});
writeFileSync(sourcesPath, JSON.stringify(nextSources, null, 2) + "\n");

console.log(JSON.stringify({ inserted: built.length, total: merged.length }, null, 2));
