/**
 * NSF/ANSI 50 第28节 + 氯溴合规文：打开撰写菜单，同时把标准强制项和「不用氯」写入勿主张。
 * 幂等：PAT-PRI-041 已存在则跳过。
 * 运行：node scripts/apply-patent-nsf-sanitation-seeds.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-04T10:10:00.000Z";
const srcFile = "NSF与氯溴撰写菜单";
const author = "NSF/ANSI 50 与氯溴文过闸 2026-09-04（公开检索，未核验法律状态）";

const dataDir = path.join(process.cwd(), "data");
const patentsPath = path.join(dataDir, "patents.json");
const sourcesPath = path.join(dataDir, "patent-sources.json");

const cards = [
  {
    id: "PAT-PRI-041",
    kind: "retrieved",
    cluster: "1",
    risk: "critical",
    loc: "NSF/ANSI/CAN 50-2021 §28 与 CCS-12804 Issue 2",
    publicationNo: "NSF/ANSI/CAN 50-2021 Section 28 / CCS-12804 Issue 2（非专利公开，合并卡）",
    jurisdiction: "美国/加拿大产品标准（非专利公开）",
    techBranch: "漂浮舱设备认证",
    tags: ["非专利公开", "NSF50", "CCS-12804", "勿当发明点", "Annex H"],
    title: "NSF 50 第28节与 CCS-12804 已把过滤、周转、双吸入口、泵联锁、水中臭氧0.1ppm写成强制项",
    summary:
      "漂浮舱专项认证规范是现有技术。通用过滤精度、周转时间、辅助消毒联锁、水中臭氧上限不能当发明点。标准测的是硅粉浊度和水中臭氧，测不到盐晶堵气体传感器透气孔。",
    body:
      "已公开要点（CCS-12804 Issue 2 可从 NSF 公开 PDF 核对，引用时按非专利公开）：\n- 覆盖自包含/非自包含、便携/固定漂浮舱或感官剥夺系统。\n- 循环系统须在清洁滤料、泵与过滤器最大流量下，少于 5 分钟完成一次容积周转；并须达到制造商建议的用户间清洗周转次数。地方规范另有 ≤30 分钟周转的常见写法。\n- 过滤系统须按 NSF/ANSI 50 Section 5 / Annex B：浊度削减 ≥70%（Sil-co-sil 106，TR≤0.30）、静压、压损、滤料可清洁性。\n- 循环须两个或以上吸入口；淹没吸入口按 APSP-16 测卡手、卡肢、卡发、身体卡吸。水深 ≤24 英寸，舱底坡度 ≤1:12。须有撇污/溢流并标记运行水位。\n- 主消毒：使用 EPA 按 FIFRA 注册的药剂，和/或符合 NSF/ANSI 50 的消毒系统（有「或」，并非必须加氯）。机械/流通式/电解氯溴发生器若使用，须 NSF 50 认证，并与循环泵电气联锁（泵停则停药）。投加器须能在用户间清洗程序后把游离氯提高 2.0 ppm（或溴 4.0 ppm）。\n- 必须至少一种辅助/二级处理：臭氧、UV 或铜银；与循环泵电气联锁，用于每次用户间清洗。UV 分辅助 3-log 细菌与二级 3-log 隐孢子虫。\n- 臭氧：按 Section 13.10 与 Annex H 测，舱内水中臭氧不得超过 0.1 ppm（0.2 mg/m³）。该限值写的是水中浓度。\n- Annex H 初始消毒效能：水位、温度、盐浓度按厂商标称；验证水中无游离氯/溴、无过氧化氢后再接种；主消毒关闭，只测辅助系统。标准自己就在「不加卤素」条件下验收辅助消毒。\n- 内衬须在制造商最大推荐盐浓度下不漏；材料走 NSF 50/14、ANSI Z124 等。\n\n对我们的限制：\n- 过滤更细、周转更快、双吸入口、泵—投加联锁、水中臭氧 ≤0.1 ppm、用户间 +2 ppm 氯、UV/臭氧作辅助消毒，都是强制项或测试协议，不能当独权\n- US9956374 已覆盖漂浮舱 UV+臭氧+溶解臭氧监测，见 PAT-PRI 既有卡\n- 「不用氯也能消杀」被 Annex H 的测试方法本身写进了标准，不能当发明\n\n仍未覆盖（给撰写菜单，不是绿灯）：浊度挑战介质是硅粉颗粒，不是盐晶堵塞气体传感器透气孔（沉默失效仍在标准空白里）；Annex H 的 0.1 ppm 是水中臭氧，不是小气室气相；5 分钟周转与硅粉测试是否在 22—30% 硫酸镁工作液上做，规范对消毒测盐浓度、对过滤未写死。见 PAT-IDEA-007~011、PAT-SEED-001。\n\n法律状态不适用。本卡不是认证咨询。",
    relatedIds: [
      "PAT-SEED-001",
      "PAT-IDEA-007",
      "PAT-IDEA-009",
      "PAT-DRAFT-A4",
      "PAT-PRI-019",
    ],
  },
  {
    id: "PAT-PRI-042",
    kind: "retrieved",
    cluster: "1",
    risk: "critical",
    loc: "FTA 北美漂浮舱标准、CDC、NSF 2015 试剂盒报告、氯溴合规文",
    publicationNo:
      "FTA North American Float Tank Standard / CDC 2018 / NSF WQTD 2015 MgSO4 氯试剂盒报告（非专利公开，合并卡）",
    jurisdiction: "国际行业标准与美国联邦卫生文件（非专利公开）",
    techBranch: "漂浮舱卫生共识",
    tags: ["非专利公开", "FTA不用氯溴", "FIFRA超标签", "DPD失灵已公开", "勿主张不用氯"],
    title: "FTA/CDC 公开不推荐氯溴；DPD 在硫酸镁里不准也已发表——不能主张「不用氯」或「我们发现试剂盒失灵」",
    summary:
      "不用氯溴、密闭舱挥发、高盐试剂盒失准，都是公开共识或已发表数据。可写进背景，不能当发明点。FIFRA 超标签是法律不是技术方案。",
    body:
      "已公开要点：\n- FTA《北美漂浮舱标准》（2017 及后续）：主消杀用 UV、臭氧或二者组合；双氧水可作氧化剂；附录明确不推荐氯/溴。理由包括：各国未对漂浮液注册该用途；多数现场试剂盒在漂浮液里不准；卤素副产物在密闭、被动气流舱里更令人担心；溴与皮肤问题相关。\n- CDC 与后续综述（如 Journal of Water and Health 2023 营运调查）：氯和溴目前未获 EPA 针对漂浮舱的注册。把泳池氯溴投入漂浮舱，属于标签外使用风险。这是法规事实，不是装置发明。\n- NSF International 2015 水质实验室报告（MgSO4 溶液中氯试剂盒准确度）：高浓度硫酸镁干扰常见余氯现场方法；AccuVac 出现沉淀、重复性差。FTA 标准把该报告列为不推荐氯溴的依据之一。\n- BCIT 环境公共卫生期刊：DPD 比色在模拟漂浮液（比重约 1.220、约 34℃）中与清水读数有显著差异，并给出 Pocket Colorimeter II 的 0.79 校正系数。所以「高盐里 DPD 测不准」不是新发现。\n- NACCHO 2023 漂浮舱卫生速查：因很少用氯，须用臭氧或 UV；水中臭氧不超过 0.1 ppm；用户间至少约三次容积周转。\n- 用户提供的氯溴合规文把上述问题整理成：FIFRA 标签即法律、头空间卤胺聚集、长时浸泡黏膜/皮肤/呼吸道、高盐+卤素加速腐蚀 316L 与密封件、传感器盐效应。工程描述可用；人体伤害与「破坏感官剥夺」不能进权利要求。\n\n对我们的限制：\n- 「坚决不用氯/溴、改用 UV+臭氧+双氧水」是业界公开推荐路径，NSF 50 也允许药剂或消毒系统二选一，不能当独权\n- FIFRA 超标签、地方卫生局套用泳池余氯，是合规策略，不是技术方案\n- 结膜炎、溴疹、支气管痉挛、刺鼻破坏 REST：第 25 条与 PAT-RED-001\n- 「DPD/安培法在 25% 盐里漂移」现象层已被 NSF 2015 与 BCIT 覆盖；装置层窄缝见 PAT-IDEA-011 与 PAT-PRI-040，须先检索海水电极\n\n仍可用之处：头空间挥发、长时浸泡、高盐腐蚀，作为 A4/A1 的背景技术问题（指标写成头空间卤素或臭氧 ppm、材料失重/点蚀速率），不要写成疗效或体验。\n\n引用时注明为非专利公开。本卡不是法律意见或毒理结论。",
    relatedIds: [
      "PAT-SEED-001",
      "PAT-IDEA-008",
      "PAT-IDEA-011",
      "PAT-PRI-040",
      "PAT-RED-001",
      "PAT-RULE-004",
    ],
  },
  {
    id: "PAT-SEED-001",
    kind: "layout",
    cluster: "cross",
    risk: "high",
    loc: "撰写思路菜单-NSF与氯溴.md",
    tags: ["撰写菜单", "给专家选", "黄灯待检索", "不要结案", "主线多开思路"],
    techBranch: "撰写候选菜单",
    title: "NSF与氯溴文过闸后的撰写菜单：强制项勿主张；⑦～⑪黄灯留给专家选，本批没有新绿灯",
    summary:
      "主线仍是多开撰写思路。NSF 把过滤周转联锁和水中臭氧写死了；FTA 把「不用氯」写进共识。剩下五条候选全是黄灯，供专利专家和技术专家挑选，不代替结案。",
    body:
      "来源：patent-drafts/NSF_ANSI_50_漂浮舱标准汇总.docx、patent-drafts/氯溴消杀合规与安全评估.md、patent-drafts/撰写思路菜单-NSF与氯溴.md。过闸顺序：已打掉清单 → 去环境测试（含「难题还是便宜」）→ 红线与第25条。不是新颖性或创造性最终结论。\n\n一、本批明确勿主张（详见 PAT-PRI-041、PAT-PRI-042）\n过滤/周转/双吸入口/泵联锁/水中臭氧0.1ppm/用户间+2ppm氯/UV3-log；漂浮舱UV+臭氧（US9956374）；不用氯本身；FIFRA；人体伤害与感官剥夺体验；盐析现象本身（Rischbieter 2000 已测臭氧在硫酸镁溶液中的溶解度）；DPD失灵本身（NSF 2015、BCIT 0.79）。卤素腐蚀316L作A1从权，不独立。\n\n二、打开的五条撰写候选（全部须待检索或待验证，存活角度纪律）\n⑦ PAT-IDEA-007 液相NSF达标≠气相安全。盐析只当已知物理，不当发明点。挂A4。\n⑧ PAT-IDEA-008 客用态/维护态两套允许氧化剂，水门与气门分开。挂A4/B5。\n⑨ PAT-IDEA-009 高密度液过滤周转相对清水失配。挂A1，更像从权。\n⑩ PAT-IDEA-010 近中性浮力浅舱吸入口力平衡。信心低，待检索APSP-16。\n⑪ PAT-IDEA-011 NSF +2ppm与失效现场方法的冲突。并入角度E检索，不与沉默失效混模型。\n\n三、和已有点的关系\n沉默失效（盐晶堵透气孔）仍是确认站得住的点：NSF浊度测硅粉，测不到这条故障。⑦⑧可作A4从权或实施例，不要另立母案，也不要和EIS捆套（PAT-EXT-001）。角度③不改。本批没有新的独立绿灯。\n\n四、建议专家怎么选（不是结论）\n若只能加一条到A4：先看⑦的双指标门控是否有清水对照。若产品必须应付强制加氯的卫生局：再看⑧。⑨⑩默认从权。⑪跟E同一条检索清单。\n\n待检索：按盐度调节臭氧投加/吹脱；spa占用态禁冲击加氯；APSP-16浅水低载荷；近饱和硫酸镁下海水型电极额定范围。\n待验证：盐雾致盲对照仍第一；⑦的水0.1ppm时头空间相对清水；⑨的泵滤清水/高盐压差。",
    examples: [
      "对：把⑦～⑪摆上菜单让专家选，标准项写进勿主张",
      "错：主张不用氯，或把NSF 0.1ppm水中臭氧当成我们的发明",
    ],
    relatedIds: [
      "PAT-IDEA-007",
      "PAT-IDEA-008",
      "PAT-IDEA-009",
      "PAT-IDEA-010",
      "PAT-IDEA-011",
      "PAT-PRI-041",
      "PAT-PRI-042",
      "PAT-DRAFT-A4",
      "PAT-EXT-001",
    ],
  },
  {
    id: "PAT-IDEA-007",
    kind: "layout",
    cluster: "1",
    risk: "high",
    loc: "候选角度七（盐析只当背景）",
    tags: ["候选角度", "黄灯", "待验证", "待检索", "盐析不当发明点", "双指标门控"],
    techBranch: "候选角度",
    title: "候选七：液相臭氧达标不等于头空间安全——盐析是已知物理，可写双指标门控（待验证）",
    summary:
      "NSF 只限制水中臭氧 0.1 ppm。高盐降低气体溶解度是教科书，不能主张发现了它。可写的是：同一套投加在小气室里可能水合格、气不合格，装置要两道门都过才允许进人。",
    body:
      "技术问题：CCS-12804 把臭氧限值写在水里（Annex H，0.1 ppm）。漂浮舱头空间只有数百升、门锁密闭（E6），口鼻离液面几厘米。高盐（E1）按 Sechenov/盐析会降低臭氧溶解度——Rischbieter 等 2000 年已在硫酸镁溶液里测过臭氧溶解度，属公知科学，第25条挡「我们发现盐析」。若清水工况按水中 0.1 ppm 设计的投加量，在工作液里可能把更多臭氧赶到空气里，而液相监测仍显示合格。\n\n可写的装置轮廓（待工程师确认，不是权利要求）：水中臭氧（或氧化剂）与头空间气相各一条测量链；盐浓度或电导率作为投加量/排气量的输入；水合格但气不合格 → 禁止占用。盐浓度在这里是必要条件，不是装饰。\n\n去环境测试：拿掉 E1，盐析变弱，水气分配接近清水设计。拿掉 E6，开敞泳池气室大、对流强，积聚不成同一道题。E1 与 E6 都像必要条件。但「面部高度测臭氧 0.1 ppm」华盛顿州规范已要求（PAT-PRI-019），「测头空间」本身不是新的。难题是不是「高盐改变亨利分配后，只看水会漏掉气」。这是难题还是把已知物理化学套进舱里，要靠对照数据和检索回答，现在不能升绿灯。\n\n不要写成：我们发现盐析；我们分层布点；传感器不可信即超标（US12087146）。不要和沉默失效（堵孔）、液相电极补偿（⑪/E）捆成一个模型。\n\n待验证：22—30% MgSO₄、34.5—35.5℃、真实头空间体积，水中臭氧同为约 0.1 ppm 时，气相浓度相对清水对照。文献温度多在 5—25℃、浓度低于工作液，不能直接当本舱数据。\n待检索：按电导率或盐度调节臭氧投加、吹脱、催化消除的水处理专利。\n\n挂靠：PAT-DRAFT-A4 已有「盐析效应」候选加强句，本卡把它从底稿备注升成独立菜单项，仍作从权优先，不另立母案。本卡不给出新颖性或创造性最终结论。",
    examples: [
      "对：水合格且气合格才允许进人，盐浓度是输入",
      "错：独权写成我们发现高盐会赶出臭氧",
    ],
    relatedIds: [
      "PAT-SEED-001",
      "PAT-PRI-041",
      "PAT-DRAFT-A4",
      "PAT-PRI-019",
      "PAT-RULE-003",
      "PAT-RULE-004",
    ],
  },
  {
    id: "PAT-IDEA-008",
    kind: "layout",
    cluster: "1",
    risk: "high",
    loc: "候选角度八（双化学态）",
    tags: ["候选角度", "黄灯", "待检索", "客用维护两态", "不要主张不用氯"],
    techBranch: "候选角度",
    title: "候选八：客用态与维护态两套允许氧化剂，液相达标不能代替气相安全（待检索）",
    summary:
      "NSF 验收辅助消毒时本来就关掉氯溴。客用时人在密闭小气室里躺 45–90 分钟，业界不推荐卤素。可写的不是「不用氯」，而是占用状态切换允许的化学集合，并且水、气两道门分开。",
    body:
      "技术问题：地方卫生局可能按泳池要求维持余氯；FTA/CDC 不推荐在漂浮舱用氯溴；FIFRA 上泳池氯溴标签通常不含高盐密闭舱。这是法规夹缝，法规本身不能当权利要求。工程上可翻译成：维护态（无人、门开或强制排气）允许冲击加卤素以满足抽检；客用态（门锁、人仰卧 45—90 分钟、头空间小）禁止卤素投加，只走 UV/臭氧/双氧水，并在进人前同时满足水中氧化剂上限和头空间挥发物上限。\n\nNSF 自己的 Annex H：关主消毒、关双氧水，只测辅助系统，盐浓度按厂商标称。所以「辅助系统能在无卤素时完成消杀测试」是标准协议，不能主张成发明。本角度的缝不在「能不能不加氯」，而在「占用态改变允许化学集合 + 液相门≠气相门」。\n\n去环境测试：拿掉 E5/E6，普通热水浴缸的客间冲击加氯、通风后进人，题目变弱。拿掉 E1，挥发与测量干扰都减轻。E5、E6、E1 都像在加重问题。但泵—投加联锁、门禁产气联锁、臭氧—泵联锁均已在已打掉清单里。必须写出与这些公知联锁不同的结构关系：例如允许的氧化剂集合随占用变化，且气相超标时即使水中余氯/臭氧合格也不进入客用态。\n\n不要写成：不用氯；破坏感官剥夺；结膜炎/溴疹；FIFRA 合规方法。\n\n待检索：SPA/泳池「between-bather shock」与占用或盖子互锁；酒店浴缸占用时禁投药；卤素投加与舱门/占用传感器的专利。命中则降为从权或打掉。\n待验证：维护态冲击后，头空间降到可进人阈值的时间；客用态零卤素时辅助系统的微生物指标（这是认证测试，未必是发明点）。\n\n与⑦分工：⑦是同一化学下的气液分配；⑧是两套配方。不要捆成一个独权。挂 A4/B5。本卡不给出新颖性或创造性最终结论。",
    examples: [
      "对：占用态切换允许氧化剂集合，水门和气门都要过",
      "错：独权写成我们的舱不用氯所以更安全",
    ],
    relatedIds: [
      "PAT-SEED-001",
      "PAT-PRI-041",
      "PAT-PRI-042",
      "PAT-DRAFT-A4",
      "PAT-IDEA-007",
      "PAT-RED-001",
    ],
  },
  {
    id: "PAT-IDEA-009",
    kind: "layout",
    cluster: "1",
    risk: "high",
    loc: "候选角度九（高密度过滤失配）",
    tags: ["候选角度", "黄灯", "待验证", "待检索", "更像A1从权"],
    techBranch: "候选角度",
    title: "候选九：高密度工作液上过滤与周转相对清水失配（待验证，倾向并入A1）",
    summary:
      "NSF 硅粉浊度和 5 分钟清洁滤料周转，按接近清水的泵滤来写。工作比重液更稠、盐晶会板结滤料。可写的不是「过滤更细」，而是清水铭牌在高盐工况对不上。",
    body:
      "技术问题：CCS-12804 要求清洁滤料下少于 5 分钟完成容积周转，过滤按 Sil-co-sil 106 做 ≥70% 浊度削减。消毒效能测试按厂商标称盐浓度；过滤/周转条款没有同等明确写「必须在 22—30% 硫酸镁里复测泵曲线」。高密度、高粘度、盐析晶会改变扬程、沿程损失和滤饼。同一套在清水或低盐测试水里过 NSF 的泵滤，在工作液里可能达不到铭牌周转，或压差爬升使流量跌破用户间所需周转次数。\n\n去环境测试：拿掉 E1，题目消失，所以 E1 是必要条件。这是难题（流体物性变了），不是便宜。但卤水过滤、压差反洗、结晶过滤器在化工侧成熟，审查员容易说「把泵和滤器按工作液密度重新选型」。要立案必须有「常规按 NSF 清水/测试水选型会在高盐下系统性失效、且失效不能单靠放大流量解决」的对照，例如盐晶板结导致的不可逆压差，而不是简单粘度修正。\n\n不要写成：更细的滤芯、更好的浊度削减、更快周转（均为标准项）。\n\n待验证：同一泵滤清水 vs 工作比重液的流量—扬程、压差—时间、滤料板结是否可反洗恢复。\n待检索：高密度盐水过滤、泻盐溶液滤芯、漂浮舱滤器结晶。\n\n倾向：并入母案 A 的 A1（高盐液路防结晶/压损），不独立成件。仍放进菜单供专家选。本卡不给出新颖性或创造性最终结论。",
    examples: [
      "对：清水过标的泵滤在工作液里流量崩溃或滤料板结，有对照曲线",
      "错：独权写成我们浊度削减超过 70%",
    ],
    relatedIds: ["PAT-SEED-001", "PAT-PRI-041", "PAT-ROAD-A", "PAT-CLU-001", "PAT-RULE-003"],
  },
  {
    id: "PAT-IDEA-010",
    kind: "layout",
    cluster: "1",
    risk: "high",
    loc: "候选角度十（浅舱浮力吸入口）",
    tags: ["候选角度", "黄灯", "待检索", "信心低", "APSP-16"],
    techBranch: "候选角度",
    title: "候选十：近中性浮力浅舱里 APSP-16 卡吸假设可能失配（待检索，信心低）",
    summary:
      "双吸入口是 NSF 强制项，不能主张「我们做了两个口」。唯一可能的缝是：人几乎不压舱底、水深不超过 24 英寸、液体更密，卡吸测试假设和泳池不一样。专家很可能打掉。",
    body:
      "技术问题：CCS-12804 要求两个或以上吸入口，淹没口按 APSP-16 测卡手、卡肢、卡发、身体卡吸，载荷条款含 300 磅垂向负荷等。这些从泳池防卡吸法规抄来。漂浮舱水深 ≤24 英寸；E2 中性浮力下人体浸没体积小、几乎不压舱底；液体密度 1.25—1.30，同一流量下作用在人体上的力和清水泳池不同。若 APSP-16 的身体卡吸试件和载荷假设在这种条件下给出错误的安全/危险结论，才可能有装置缝（例如吸入口布置、格栅、流量分配针对「漂而不是趴」）。\n\n去环境测试：拿掉 E2，人像在浅泳池里压着排水口，回到 APSP-16 原场景。E2 像必要条件。但「两个吸入口」本身是强制项，主张它没有创造性。把泵选小一点或口做多一点，很像便宜的合规设计，不像难题。\n\n待检索：APSP-16 / VGB Act 在浅水、漂浮、高密度液体中的测试假设与已有漂浮舱认证实践。若认证实验室已经在漂浮舱盐液、浅水条件下按 APSP-16 测过，本角度基本关闭。\n\n倾向：默认不独立立案。放进菜单是避免漏看，不是推荐投入。本卡不给出新颖性或创造性最终结论。",
    examples: [
      "对：先查 APSP-16 在浅水高密度下的试件假设再决定写不写",
      "错：独权写成我们的舱有两个吸入口所以更安全",
    ],
    relatedIds: ["PAT-SEED-001", "PAT-PRI-041", "PAT-CLU-001", "PAT-RULE-003"],
  },
  {
    id: "PAT-IDEA-011",
    kind: "layout",
    cluster: "4",
    risk: "high",
    loc: "候选角度十一（NSF +2ppm 与失效测法）",
    tags: ["候选角度", "黄灯", "待检索", "并入角度E", "不要和沉默失效混"],
    techBranch: "候选角度",
    title: "候选十一：NSF 要求用户间余氯+2ppm，但高盐现场方法已公开失灵——装置缝待检索，现象不是发明",
    summary:
      "NSF 给投加器写了用户间 FAC +2.0 ppm。NSF 2015 和 BCIT 已经证明硫酸镁溶液里 DPD 不准。不能主张发现了失灵。还能不能写一条不依赖失效试剂盒、又满足该标准指标的在线链，跟第三方角度 E 是同一条缝。",
    body:
      "技术问题：若产品在某辖区仍配置卤素投加器，CCS-12804 要求它能在用户间清洗后把游离氯提高 2.0 ppm。现场抽检常用 DPD。NSF 2015 WQTD 报告和 BCIT 论文已经公开：MgSO₄ 漂浮液干扰余氯试剂盒；后者还给出 0.79 校正。氯溴合规文里的「安培法盐效应、电极中毒、过量投药—腐蚀循环」是同一测量链问题。现象层不是发明。\n\n仍可能的装置缝（待检索，不立案）：标准指标还在，现场方法失效，需要一条在 22—30% 硫酸镁里可溯源的在线测量与投加控制，且失效模式不能用温度/pH 常规补偿或「换海水型电极」解释。这与 PAT-EXT-001 的角度 E、PAT-PRI-040 是同一检索。22—30% 硫酸镁电导率可能超出部分淡水臭氧/余氯电极额定范围，优先查有没有卤水额定型号，不要先写补偿算法。\n\n去环境测试：拿掉 E1，DPD 恢复可用，题目消失。E1 是必要条件，是难题不是便宜。但手段层（海水电极、离子强度补偿、稀释后测）对本领域技术人员很像常规。没有「额定范围外仍无法用常规补偿解释」的对照，不能升绿灯。\n\n硬限制：头空间气相传感器（沉默失效）和液体余氯/臭氧/双氧水不是一条测量链，不能共用一个电导率补偿独权。不要和⑦的气相门控混成一套。\n\n待检索：近饱和硫酸镁下海水/卤水型余氯与臭氧电极、离子强度补偿专利与手册。命中则关闭独立立案，只留选型说明。\n\n挂母案 B。本卡不给出新颖性或创造性最终结论。",
    examples: [
      "对：跟角度E同一条检索清单，先查海水电极额定范围",
      "错：独权写成我们发现高盐里 DPD 不准，或把它和堵孔沉默失效写成一个补偿模型",
    ],
    relatedIds: [
      "PAT-SEED-001",
      "PAT-PRI-040",
      "PAT-PRI-042",
      "PAT-EXT-001",
      "PAT-ROAD-B",
      "PAT-RULE-003",
    ],
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
if (patents.some((p) => p.id === "PAT-PRI-041")) {
  console.log("NSF与氯溴撰写菜单已入库，跳过。总数:", patents.length);
  process.exit(0);
}

const built = cards.map((c) => card(c, null));
const pris = built.filter((c) => c.id.startsWith("PAT-PRI"));
const ideas = built.filter((c) => c.id.startsWith("PAT-IDEA"));
const seed = built.find((c) => c.id === "PAT-SEED-001");

let out = [...patents];

const priAt = out.map((p) => p.id).lastIndexOf("PAT-PRI-040");
out = priAt === -1 ? [...out, ...pris] : [...out.slice(0, priAt + 1), ...pris, ...out.slice(priAt + 1)];

const ideaAt = out.map((p) => p.id).lastIndexOf("PAT-IDEA-006");
out =
  ideaAt === -1
    ? [...out, ...ideas]
    : [...out.slice(0, ideaAt + 1), ...ideas, ...out.slice(ideaAt + 1)];

const seedAt = out.map((p) => p.id).lastIndexOf("PAT-EXT-001");
out =
  seedAt === -1
    ? [...out, seed]
    : [...out.slice(0, seedAt + 1), seed, ...out.slice(seedAt + 1)];

const ids = out.map((p) => p.id);
if (ids.length !== new Set(ids).size) {
  console.error("出现重复 id，已中止", ids.filter((id, i) => ids.indexOf(id) !== i));
  process.exit(1);
}

writeFileSync(patentsPath, JSON.stringify(out, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const srcId = "SRC-PAT-NSF-SANITATION";
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
  note: "NSF50§28与氯溴文过闸：强制项和不用氯勿主张；打开⑦～⑪黄灯菜单给专家选。现象层盐析/DPD失灵已公开。",
});
writeFileSync(sourcesPath, JSON.stringify(next, null, 2) + "\n");

console.log(JSON.stringify({ inserted: built.length, total: out.length, ids: cards.map((c) => c.id) }, null, 2));
