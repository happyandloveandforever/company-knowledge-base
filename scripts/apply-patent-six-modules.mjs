/**
 * 按《专利布局整体报告_重构版》把专利库从四簇升级为六簇。
 * 两件母案不变；簇5迷走、簇6低刺激环境；多模态交互=B4–B7，不设母案3。
 * 幂等：PAT-CLU-005 已存在且含「不进入直接VNS」则跳过。
 * 运行：node scripts/apply-patent-six-modules.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-02T12:00:00.000Z";
const report = "漂浮方舟_专利布局整体报告_重构版.docx";
const author = "漂浮方舟专利布局整体报告 重构版 2026-09";

const dataDir = path.join(process.cwd(), "data");
const patentsPath = path.join(dataDir, "patents.json");
const sourcesPath = path.join(dataDir, "patent-sources.json");

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
    applicationNo: item.applicationNo,
    jurisdiction: item.jurisdiction,
    techBranch: item.techBranch,
    productLine: item.productLine,
    familyId: item.familyId,
    relatedIds: item.relatedIds || [],
    examples: item.examples || [],
    source: {
      file: item.file || report,
      location: item.loc,
      date: "2026-09",
      author,
    },
    status: "approved",
    confidentiality: "internal",
    createdAt: now,
    updatedAt: now,
  };
}

const updates = [
  {
    id: "PAT-MAP-001",
    kind: "roadmap",
    cluster: "cross",
    risk: "high",
    loc: "一、唯一正确的总架构 / 七、六簇映射",
    tags: ["总图", "母案A", "母案B", "六簇", "不设母案3"],
    techBranch: "平台路线",
    title: "六簇两母案：A管液体稳定，B管测量安全与低刺激交互，不另立母案3",
    summary:
      "首案只提交母案A与母案B。六大技术簇全部挂到这两件上。多模态交互与安全状态机是B4—B7，不是第三件母案。疗效/直接VNS后置。",
    body: "关系公式：\n母案A = 液体与多物理场稳定。\n母案B = 测量可信、控制安全与低刺激交互。\n多模态交互与安全状态机 = 母案B的B4+B5+B6+B7，不是与A、B并列的母案3。\n\n六簇归属：\n1 舱体/盐水循环/温控/安全 → A为主，B5辅助\n2 氢氧微纳气泡/石墨烯远红外 → A为主\n3 水中声学/低频振动/频率引导 → B为主\n4 生理姿态采集/AI调节 → B为主（设备状态机，不做人体策略库）\n5 迷走神经调节 → 不进入直接VNS；A/B共同支撑间接低刺激环境\n6 低刺激环境构建 → A为主，B4—B6支撑开门过渡与安全退出\n\n当前提交：A、B同日作为第一批。外围运维案可并行。二期科研案等对照数据。\n不要为凑20件把同一控制逻辑改标题反复申请。",
    examples: [
      "对：首案只立A和B，B说明书预埋B1—B7两套实施",
      "错：把出舱交互先写成概念化母案3",
    ],
    relatedIds: [
      "PAT-ROAD-A",
      "PAT-ROAD-B",
      "PAT-NO3-001",
      "PAT-CLU-001",
      "PAT-CLU-002",
      "PAT-CLU-003",
      "PAT-CLU-004",
      "PAT-CLU-005",
      "PAT-CLU-006",
      "PAT-BATCH-001",
    ],
  },
  {
    id: "PAT-CLU-001",
    kind: "cluster",
    cluster: "1",
    risk: "high",
    loc: "七、技术簇1",
    tags: ["第一簇", "舱体", "液路", "归属母案A"],
    techBranch: "舱体与液路",
    productLine: "漂浮舱平台",
    title: "第一簇：平台层公开区，归母案A；感官隔离基础改挂第六簇",
    summary:
      "基础平台、储液、泵阀、过滤、臭氧、液位/温度控制早已公开。最终归属母案A为主、B5辅助。可布局高盐防结晶、分区回流、热场、设备物理状态安全控制。黑静暖漂/隔光隔音本身改看簇6。",
    body: "主要现有技术风险：早期漂浮仪、主机柜循环、UV/臭氧卫生、姿态调液体（CN115877899）。\n归属：母案A（A1液路、A2流场、A3热场）+ B5设备安全辅助。\n与簇6分工：常规隔光隔音通风是行业基础，算簇6；本簇只打高盐液路冲突。\n红灯仍见 PAT-RED-001。检索细表仍用第一簇矩阵。",
    relatedIds: ["PAT-ROAD-A", "PAT-CLU-006", "PAT-PRI-002", "PAT-PRI-011"],
  },
  {
    id: "PAT-CLU-002",
    kind: "cluster",
    cluster: "2",
    risk: "high",
    loc: "七、技术簇2",
    tags: ["第二簇", "微纳气泡", "石墨烯", "归属母案A"],
    techBranch: "气液与热场",
    productLine: "氢氧/加热模块",
    title: "第二簇：不抢纳米泡和石墨烯模块权，整簇归母案A",
    summary:
      "加压混合/释压成泡、富氢泡浴、石墨烯PID/低液位已拥挤。归属母案A。重点：高盐气液隔离、分区释放、热场绝缘、气路安全互锁。",
    body: "对应子案 A1、A3、A4、A5。氢氧臭氧不可同时注入。不主张通用制泡主链（WO2016023394A1/CN104174311B）和石墨烯+PID（CN111166216A）。\n检索细表仍用第二簇矩阵。",
    relatedIds: ["PAT-ROAD-A", "PAT-PRI-008", "PAT-PRI-009", "PAT-PRI-010"],
  },
  {
    id: "PAT-CLU-003",
    kind: "cluster",
    cluster: "3",
    risk: "high",
    loc: "七、技术簇3",
    tags: ["第三簇", "声振", "归属母案B"],
    techBranch: "声振耦合",
    productLine: "声频/振动模块",
    title: "第三簇：频率不是蓝海，整簇归母案B的隔振、静默采样与停机",
    summary:
      "水下扬声器、多换能器、HRV驱动振动、脑波引导密集。归属母案B。可布局隔振、声振泄漏、静默采样、参考校准、安全停机。",
    body: "对应子案 B1、B2、B3、B5。不主张US9364387B2水听器反馈调频、US9504625B2壳体共振体验。脑波/HRV闭环仍红灯。\n检索细表仍用第三簇矩阵。",
    relatedIds: ["PAT-ROAD-B", "PAT-PRI-004", "PAT-PRI-005", "PAT-PRI-006", "PAT-PRI-007"],
  },
  {
    id: "PAT-CLU-004",
    kind: "cluster",
    cluster: "4",
    risk: "critical",
    loc: "七、技术簇4",
    tags: ["第四簇", "AI闭环", "归属母案B", "最危险"],
    techBranch: "传感与控制",
    productLine: "监测/算法/安全",
    title: "第四簇：最危险，归母案B；人体AI闭环改成设备状态机",
    summary:
      "CN121795911A等多模态生理AI闭环高度近似。归属母案B。只布局设备物理状态、传感可信度、确定性安全状态机、离线审计。",
    body: "对应子案 B2、B3、B5、B7。原「神经—代谢—免疫多维协同母案」取消，不作为首案。实时HRV/生理→AI调热声振气泡改为设备物理状态→确定性安全状态机。\n检索细表仍用第四簇矩阵。",
    relatedIds: ["PAT-ROAD-B", "PAT-STATE-001", "PAT-PRI-001", "PAT-PRI-002", "PAT-PRI-003"],
  },
  {
    id: "PAT-CLU-005",
    kind: "cluster",
    cluster: "5",
    risk: "critical",
    loc: "七、技术簇5 / 二、调整原则",
    tags: ["第五簇", "迷走", "不进直接VNS", "传播分轨"],
    techBranch: "迷走神经调节",
    productLine: "自主神经叙事（非独权）",
    title: "第五簇：迷走不进首案独权；商业可讲恢复环境，专利写间接低刺激",
    summary:
      "直接VNS/taVNS、耳颈电刺激、HRV/呼吸同步刺激高度拥挤，医学与监管风险高。不进入直接VNS。A/B只支撑间接低刺激环境和研究性过程数据的可信采集。",
    body: "原问题：迷走神经激活/直接刺激表述，容易被理解为直接VNS或治疗。\n调整后：不为副交感占优「创造条件、支持自主神经重平衡」可以作传播语言；独权不写刺激、激活、治疗、调参闭环。\n工程上能进专利的只有：低刺激环境是否稳定（簇6/母案A）、测量是否可信（母案B）、过程数据是否可审计（B7）。HRV/皮质醇/睡眠作为二期科研证据，不挤占当前工程母案。\n对接总库：VGMECH/VNSMAP 仍是通识与边界卡；写交底书以本簇为准，不得把器械适应症抄进独权。",
    examples: [
      "商业：自主神经恢复环境、为副交感占优创造条件",
      "专利：环境稳定、安全切断、传感可信度；不写直接刺激迷走",
    ],
    relatedIds: ["PAT-XREF-001", "PAT-CLU-006", "PAT-ROAD-A", "PAT-ROAD-B"],
  },
  {
    id: "PAT-CLU-006",
    kind: "cluster",
    cluster: "6",
    risk: "medium",
    loc: "七、技术簇6 / 五、状态机交互",
    tags: ["第六簇", "低刺激环境", "出舱", "归属A+B4B6"],
    techBranch: "低刺激环境构建",
    productLine: "舱内体验与退出",
    title: "第六簇：黑静暖漂是公知，专利点在低扰动维持和开门进出过渡",
    summary:
      "隔光隔音、常规通风温控是行业基础。归属母案A为主，B4—B6支撑。可布局遮光消声新风的工程耦合、低扰动循环、开门过渡、安全退出。不把「感官剥夺」当独权。",
    body: "与簇1分工：簇1打高盐液路；本簇打人在舱里时环境突变和进出舱冲突。\n对应：A2/A3低扰动流场热场；B4模块低突变切换；B6正常/紧急出舱多模态交互（渐变照明、提示音、应急照明、门锁释放、排气、用户手动优先）。\n拆成独立母案3的条件见 PAT-NO3-001，当前不满足。",
    relatedIds: ["PAT-ROAD-A", "PAT-ROAD-B", "PAT-STATE-001", "PAT-NO3-001", "PAT-CLU-001"],
  },
  {
    id: "PAT-ROAD-A",
    kind: "roadmap",
    cluster: "cross",
    risk: "green",
    loc: "三、母案A",
    tags: ["母案A", "高盐", "第一批", "独权骨架"],
    techBranch: "母案A",
    productLine: "液路/气路/热场",
    title: "母案A：高盐漂浮液多物理场稳定化装置及运行方法（第一批同日提交）",
    summary:
      "解决液体和物理环境是否稳定，不是用户生理或疗效。统领A1—A5。与母案B同日作为唯一首案骨架。",
    body: "技术问题：高浓度硫酸镁中，气泡、循环、加热、回流、排气和可选声振同时运行，可能盐析、腐蚀、浓度偏差、热斑、液面波动、浮力扰动、压力波和密闭积气。现有技术多解决单一模块。\n\n独立权利要求骨架：\n1 高盐漂浮液舱体与主循环液路\n2 与主循环可切换的处理/维护/再生支路\n3 气液处理、分区释放、回流口、挡流/整流件的相对结构或流路关系\n4 热源、绝缘/隔离、热流或液位安全联锁\n5 温度、压力、流量、液位、导电率、气泡状态代理、气体等设备物理传感\n6 控制器以设备/液体物理状态为输入，对泵阀热源排气执行准入、稳定、再生、暂停或停机\n7 可验证效果：温度方差、液面波动、浓度偏差、压力波、结晶/腐蚀、稳态恢复或安全风险降低\n\n子案：A1气液支路；A2分区流场；A3热场协同；A4多气路安全；A5稳定/再生/维护方法。\n输入：温度、流量、压力、液位、导电率、气体、泡径代理。输出：泵阀热源排气的运行模式。",
    relatedIds: ["PAT-ROAD-B", "PAT-CLU-001", "PAT-CLU-002", "PAT-CLU-006", "PAT-BATCH-001", "PAT-GAP-001"],
  },
  {
    id: "PAT-ROAD-B",
    kind: "roadmap",
    cluster: "cross",
    risk: "green",
    loc: "四、母案B / B.3子案树",
    tags: ["母案B", "B1-B7", "状态机", "第一批"],
    techBranch: "母案B",
    productLine: "传感/声振/控制/交互",
    title: "母案B：激励—测量抗干扰与设备安全状态控制（含B4—B7交互，不是母案3）",
    summary:
      "解决测量是否可信、设备如何低突变运行并在异常时安全降级。B4—B7是多模态交互与安全状态机，必须在首案B里预埋，不单独当第三件母案。",
    body: "与A的边界：A管液体稳定；B管执行模块工作时的测量可信和安全控制。B的输入是驱动波形、加速度、液体压力、门锁、通信、传感可信度、设备状态。输出是模块准入、限功率、静默采样、排气、停机、恢复、交互提示。\n\n独立权利要求骨架：\n1 至少一个产生声/振/热/流/气扰动的执行模块及驱动波形\n2 至少一个工作传感器+至少一个参考传感器（壳体加速度、液压、液面、热流、阀态、泵态、流量）\n3 激励窗、静默采样窗或同步采样窗\n4 基于参考量和驱动波形的可信度判断、补偿、隔离或降级\n5 确定性安全状态机：设备物理状态+传感可信度+故障等级 → 允许/限功率/静默/排气/停机/维护/恢复\n6 优先级：紧急停机 > 安全排气 > 限功率 > 静默采样 > 正常体验\n7 效果：SNR提高、伪迹下降、误报/漏报下降、切断更快、环境突变降低\n\n子案：\nB1 传动隔振（硬件，否交互层）\nB2 激励—测量时分复用（数据可信，否）\nB3 多参考量校准与传感自检（数据可信，否）\nB4 多模块低突变过渡（是，交互前置）\nB5 设备安全状态机与故障降级（是，核心层）\nB6 正常/紧急出舱多模态交互（是，用户可感知）\nB7 离线安全事件追溯与维护审计（是，运维延伸）\n\n首案B必须把B1—B7的至少两套实施结构、状态转换图、故障场景和交互逻辑完整预埋；再按样机成熟度分案。状态表见 PAT-STATE-001。",
    relatedIds: [
      "PAT-ROAD-A",
      "PAT-STATE-001",
      "PAT-NO3-001",
      "PAT-CLU-003",
      "PAT-CLU-004",
      "PAT-CLU-006",
      "PAT-PRI-001",
      "PAT-BATCH-001",
    ],
  },
  {
    id: "PAT-STATE-001",
    kind: "layout",
    cluster: "cross",
    risk: "green",
    loc: "五、安全状态机与交互状态",
    tags: ["状态机", "S0-S8", "B5", "B6"],
    techBranch: "设备安全状态机",
    title: "母案B状态机：S0待机到S8维护，紧急停机优先于体验",
    summary:
      "九态：自检、准备稳定、入舱过渡、低刺激体验、静默采样、限功率、安全排气、紧急退出、维护。优先级写进独权，不靠AI策略库跳转。",
    body: "S0 待机自检：上电或维护结束；检查传感器、门锁、液位、通信、气体、漏电；显示自检中；关键项通过才离开。\nS1 准备稳定：用户确认进入前；缓调温、低扰动循环、通风；禁用高扰动模块；渐变准备提示。\nS2 入舱过渡：门锁关闭；降照度、降风机噪声、低扰动运行；语音/灯光渐变；门锁稳定且环境达标。\nS3 低刺激体验：环境与通信满足窗口；维持低剪切循环，模块受限；非必要交互静默。\nS4 静默采样：需要采样或自检；限制/暂停泵、换能器、气泡；无或极低刺激提示。\nS5 限功率保护：接近阈值或可信度下降；降低热源、泵速、声振、气泡；温和提示。\nS6 安全排气/恢复：气体、湿度、CO2、热负荷异常；关非必要模块，启动排气/新风；明确提示。\nS7 紧急停机/退出：门锁、液位、漏电、气体、通信严重异常；切断热源/换能器/气泡；应急照明、门锁释放、排气；高优先级逃生提示；须人工复位和全流程自检。\nS8 维护/清洁：用户退出或故障后；过滤、消毒、排液/补液、日志固化。\n\n优先级：紧急停机 > 安全排气 > 限功率 > 静默采样 > 正常体验。\n这是确定性表，不是「状态概率映射策略库」。",
    relatedIds: ["PAT-ROAD-B", "PAT-CLU-006", "PAT-NO3-001"],
  },
  {
    id: "PAT-NO3-001",
    kind: "rule",
    cluster: "cross",
    risk: "high",
    loc: "六、什么时候才考虑母案3",
    tags: ["不设母案3", "B6", "分案条件"],
    techBranch: "申请架构纪律",
    title: "当前不设母案3：出舱交互先预埋进B，四个条件齐了再拆",
    summary:
      "把B6低刺激交互与安全退出拆成独立母案，必须同时满足技术问题独立、特征独立、效果独立、原型数据成熟。现在拆会造成说明书重复和分案边界不清。",
    body: "必要条件：\n1 技术问题独立：解决的是密闭低刺激环境里理解状态、正常/紧急退出冲突，而不是采样可信度或设备控制。例：如何兼顾低刺激渐变与紧急逃生。\n2 技术特征独立：有独特交互硬件/空间/时序，独立于参考传感与安全控制。例：灯带、门锁、声学提示、触觉、风道、应急照明的特定关系。\n3 技术效果独立：能量化证明交互系统本身的效果。例：照度峰值降低、退出时间缩短、误操作率下降、应急更快。\n4 原型与数据成熟：真实样机、正常/紧急流程、对照测试；至少两种退出流程和状态日志。\n\n未满足前的正确动作：B6/B7预埋进母案B，不要抢先提交概念化第三母案。",
    relatedIds: ["PAT-MAP-001", "PAT-ROAD-B", "PAT-STATE-001", "PAT-CLU-006"],
  },
  {
    id: "PAT-BATCH-001",
    kind: "roadmap",
    cluster: "cross",
    risk: "medium",
    loc: "九、20项重新分组",
    tags: ["20件", "六批", "提交节奏"],
    techBranch: "申请节奏",
    title: "约20件目标：两件首案同日交，其余按测试成熟度拆，不为凑数改标题",
    summary:
      "第一批A+B共2件同日提交。随后A1—A5共5、B1—B5共5、B6—B7共2、运维软件3、科研场景3—4。每件必须有独立技术问题、结构/步骤、效果和可实施数据。",
    body: "第一批：母案A、母案B。唯一首案骨架。同日提交。\n第二批：A1—A5 气液支路、流场、热场、气路安全、运行模式。从A原始记载拆分。\n第三批：B1—B5 隔振、时分采样、参考校准、低突变过渡、安全状态机。按工程测试成熟度拆。\n第四批：B6—B7 出舱交互、离线审计。先预埋，硬件与数据成熟后再分案/新案。\n第五批：运维软件 维护预测、耗材水质追溯、多机构权限。可并行，以真实系统架构为基础。\n第六批：科研增强 压力恢复、睡眠支持、运动恢复等。伦理、对照组和数据成熟后。\n\n20是目标数量，不是考核KPI。",
    relatedIds: ["PAT-MAP-001", "PAT-ROAD-A", "PAT-ROAD-B", "PAT-NEXT-001"],
  },
  {
    id: "PAT-NEXT-001",
    kind: "gap",
    cluster: "cross",
    risk: "medium",
    loc: "十二、时间表与管理层六件事",
    tags: ["下一步", "1-15周", "管理层拍板"],
    techBranch: "工作计划",
    title: "1—15周：冻结话术、两件交底、同日提交A/B；管理层先拍六件事",
    summary:
      "第1—2周取证；第3—4周交底与FTO初筛；第5—8周同日提交A/B；第9—14周拆子案；第15周起拆B6/B7并启动二期科研。先确认不设母案3、不写直接VNS。",
    body: "时间表：\n第1—2周：冻结对外表述；收集BOM、图纸、数据流、状态机草图；开始工程取证。输出保密清单、架构图、FMEA初稿、测试计划。\n第3—4周：专项检索与FTO初筛；完成母案A/B交底书。输出特征对照表、规避清单、两件交底。\n第5—8周：AI辅助初稿、三方审核、同日提交A/B。\n第9—14周：按测试成熟度拆A1—A5、B1—B5。\n第15周起：拆B6/B7、推进运维案，启动二期科研准备。\n\n管理层需拍板：\n1 首案只立A与B，不设概念化母案3\n2 多模态交互与安全状态机归属B，作B4—B7预埋\n3 工程专利不写直接迷走刺激、AI诊断、HRV治疗式调参、免疫/抗衰疗效\n4 授权技术组两周内完成高盐、热场、声振干扰、气体安全、状态机故障注入\n5 授权专利专家核验CN121795911A、CN115877899A/B等最终文本与法律状态\n6 授权AI辅助交底和初稿，但工程师确认真实性、代理师确认法律边界\n\nAI不能发明真实技术。",
    relatedIds: ["PAT-GAP-001", "PAT-BATCH-001", "PAT-MAP-001", "PAT-NO3-001"],
  },
  {
    id: "PAT-GAP-001",
    kind: "gap",
    cluster: "cross",
    risk: "high",
    loc: "十、工程数据与测试计划",
    tags: ["缺口", "六类测试", "法律状态"],
    techBranch: "提交前缺口",
    title: "最缺工程数据：六类测试对齐A/B子案，人体疗效可以后置",
    summary:
      "当前最紧缺的不是人体疗效数据。六类测试：高盐流场、热场绝缘、气体排气、声振干扰、安全状态机、低刺激环境。对照表「原始数据」仍空白。",
    body: "优先级1 高盐液路与流场：盐析、腐蚀、压损、流速、液面波动、温度方差、稳态恢复 → A1 A2 A5\n2 热场与绝缘安全：红外热像、热斑、液温方差、低液位切断、漏电、过冲 → A3 B5\n3 气体与排气安全：泄漏、头空间浓度、排气效率、阀态互锁、开门/断电 → A4 B5 B6\n4 声振与传感干扰：声压、加速度、液压波、SNR、伪迹、丢帧、泄漏 → B1 B2 B3 B4\n5 安全状态机：门锁、液位、温度、通信、泵阀、换能器故障的切断/恢复 → B5 B6 B7\n6 低刺激环境：漏光、噪声、气流、湿度、开门突变、恢复时间 → A2 A3 B4 B6\n\n法律状态仍待核验：CN121795911A、CN115877899A/B、CN104174311B、US9364387B2、US9504625B2、CN111166216A 等。见各 PAT-PRI 卡。",
    relatedIds: ["PAT-NEXT-001", "PAT-ROAD-A", "PAT-ROAD-B", "PAT-STATE-001"],
  },
  {
    id: "PAT-RED-001",
    kind: "layout",
    cluster: "cross",
    risk: "critical",
    loc: "二、原方案问题 / 八、重点风险专利",
    tags: ["红灯", "冻结话术", "直接VNS", "母案3"],
    techBranch: "表达与独权边界",
    title: "红灯升级：人体AI闭环、直接VNS、模块堆叠、概念化母案3都不要写进独权",
    summary:
      "在原四簇红灯之上，重构版明确取消「神经—代谢—免疫多维协同」首案，禁止直接迷走刺激表述，禁止把出舱交互先立成母案3。",
    body: "继续红灯（独权剥离，不做换词规避）：\n- 非接触多模态体征→AI判断用户状态→策略库→多模块协同（CN121795911A）\n- 姿态异常→调温/水位/盐度（CN115877899）\n- 氢氧纳米泡/石墨烯/特定频率本身\n- 实时HRV/生理数据→AI自动调热、声、振、气泡\n新增红灯：\n- 神经—代谢—免疫多维协同漂浮干预作为首案母案\n- 迷走神经激活/直接刺激/taVNS写进独权\n- 概念化「漂浮舱多模态交互和安全状态机」第三母案\n传播与专利分轨：商业可讲「自主神经恢复环境」；独权写环境稳定、安全和可测工程效果。",
    examples: [
      "对外可说：为副交感占优创造条件，支持自主神经重平衡",
      "独权不说：刺激迷走神经、AI识别焦虑后自动治疗",
    ],
    relatedIds: ["PAT-CLU-005", "PAT-NO3-001", "PAT-XREF-001", "PAT-PRI-001"],
  },
  {
    id: "PAT-XREF-001",
    kind: "rule",
    cluster: "cross",
    risk: "high",
    loc: "二、传播与专利分轨 / 簇5",
    tags: ["总库冲突", "迷走口径", "CIS六模块"],
    techBranch: "与总库分工",
    title: "与总库分轨：CIS/迷走可以讲环境，专利六簇只保护稳定与安全",
    summary:
      "总库对外仍可用CIS六模块和迷走通识。专利库六簇不是再做一套对外菜名。写交底书以本库红灯为准：不写直接VNS、不写AI策略库、数字未锁不写30+。",
    body: "已知张力（不删总库）：\n- 总库可编程神经重置/AI调度 vs 专利红灯人体策略库\n- 总库VGMECH/VNSMAP器械证据 vs 簇5「不进入直接VNS」\n- 总库冠军系列氢氧、脑波芯片 vs 簇2/3/4红灯\n- 总库30+专利未锁，本库20件是目标节奏不是已授权清单\n- 对外CIS A–F 六模块 ≠ 专利六大技术簇。前者是产品叙事，后者是申请架构\n\n分轨句式：\n商业/总库：自主神经恢复环境；为副交感占优创造条件。\n专利独权：高盐稳定、传感可信、确定性状态机、低突变切换、安全退出。\n\n/library 做PPT；/patents 写专利；/open 不含本库。",
    examples: [
      "对：PPT讲恢复环境，交底书画S0—S8和液路结构",
      "错：为了和官网一致，把迷走激活写进独立权利要求",
    ],
    relatedIds: ["PAT-RULE-001", "PAT-RED-001", "PAT-CLU-005", "PAT-MAP-001"],
  },
  {
    id: "PAT-RULE-001",
    kind: "rule",
    cluster: "cross",
    risk: "critical",
    loc: "一、重要提示",
    tags: ["规则", "仅内部", "非正式FTO", "六簇"],
    techBranch: "专利库纪律",
    title: "专利库总纲：两件母案、六簇支撑，仍不是正式法律意见",
    summary:
      "布局以重构版整体报告为准：首案只有A和B，六簇全部挂上去。检索矩阵仍是前案细表。不构成正式法律意见、无效分析或完整FTO。不进/open，不进编排，不与572条知识点混号。",
    body: "本库命名空间 PAT-*，数据在 data/patents.json。\n\n层级：\n- 总图/规则：本卡、PAT-MAP-001、PAT-NO3-001\n- 路线：PAT-ROAD-A / PAT-ROAD-B / PAT-BATCH-001 / PAT-STATE-001\n- 六簇：PAT-CLU-001~006\n- 前案：PAT-PRI-*（来自四份全景矩阵，未作废）\n- 缺口：PAT-GAP-001 / PAT-NEXT-001\n\n硬规则不变：量产融资出口前须代理师按最终BOM比对有效权利要求；失效专利仍是在先技术；可专利性/FTO/合规三种风险不要混；未公开交底密级internal；总库宣传口径不是本库清单。\nAI不能发明真实结构、参数、阈值和技术效果。",
    examples: [
      "对：交底书挂 PAT-ROAD / PAT-CLU / PAT-PRI 号",
      "错：把六簇再写成第三套对外产品模块名",
    ],
    relatedIds: ["PAT-MAP-001", "PAT-RED-001", "PAT-XREF-001"],
  },
];

const patents = JSON.parse(readFileSync(patentsPath, "utf-8"));
const existing005 = patents.find((p) => p.id === "PAT-CLU-005");
if (existing005 && /不进入直接VNS/.test(`${existing005.summary}\n${existing005.body}`)) {
  console.log("六簇升级已入库，跳过。总数:", patents.length);
  process.exit(0);
}

const byId = new Map(patents.map((p) => [p.id, p]));
let inserted = 0;
let replaced = 0;
for (const item of updates) {
  const next = card(item);
  if (byId.has(item.id)) {
    const prev = byId.get(item.id);
    next.createdAt = prev.createdAt || now;
    replaced += 1;
  } else {
    inserted += 1;
  }
  byId.set(item.id, next);
}

const order = [
  "PAT-RULE-001",
  "PAT-MAP-001",
  "PAT-CLU-001",
  "PAT-CLU-002",
  "PAT-CLU-003",
  "PAT-CLU-004",
  "PAT-CLU-005",
  "PAT-CLU-006",
  "PAT-RED-001",
  "PAT-GRN-001",
  "PAT-PRI-001",
  "PAT-PRI-002",
  "PAT-PRI-003",
  "PAT-PRI-004",
  "PAT-PRI-005",
  "PAT-PRI-006",
  "PAT-PRI-007",
  "PAT-PRI-008",
  "PAT-PRI-009",
  "PAT-PRI-010",
  "PAT-PRI-011",
  "PAT-PRI-012",
  "PAT-ROAD-A",
  "PAT-ROAD-B",
  "PAT-STATE-001",
  "PAT-NO3-001",
  "PAT-BATCH-001",
  "PAT-GAP-001",
  "PAT-NEXT-001",
  "PAT-XREF-001",
];
const rest = [...byId.values()].filter((p) => !order.includes(p.id));
const merged = [...order.map((id) => byId.get(id)).filter(Boolean), ...rest];
writeFileSync(patentsPath, JSON.stringify(merged, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const srcId = "SRC-PAT-LAYOUT-V2";
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
  note: "重构版：六大技术簇 + 两件母案；多模态交互归B4–B7，不设母案3。",
});
writeFileSync(sourcesPath, JSON.stringify(nextSources, null, 2) + "\n");

console.log(
  JSON.stringify(
    {
      inserted,
      replaced,
      total: merged.length,
      clusters: merged.filter((p) => p.kind === "cluster").length,
    },
    null,
    2
  )
);
