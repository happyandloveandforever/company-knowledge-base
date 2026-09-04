/**
 * Claude 精细拆分：NSF_ANSI_50_漂浮舱标准汇总.docx
 *
 * 来源是内部汇编（CCS-12804 Issue 2 + NSF/ANSI/CAN 50-2021 §28），
 * 文档头写「仅内部参考、禁止整份外发」；标准条款本身是公开的。
 *
 * 分层：
 * - 公开标准事实 → layer=commons，usage=both（通识资料包 + 培训都能抽）
 * - 工程/认证清单、与产品口径对照 → layer=company，usage=both 或 ops
 * - 专利空白 / 已标准化领域 → layer=company，usage=training，internalOnly
 *
 * 用户要求：有的知识公司库和培训库都标记 → usage=both。
 * 幂等：KP-NSF-001 已存在则跳过。
 * 运行：node scripts/import-nsf-ansi50.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-04T08:40:00.000Z";
const sourceId = "SRC-NSF-ANSI50";
const sourceFile = "NSF_ANSI_50_漂浮舱标准汇总.docx";

const raw = [
  {
    id: "KP-NSF-001",
    loc: "文首 / 一、标准框架概览",
    title: "NSF/ANSI/CAN 50 §28：漂浮舱第一次有专项认证条款",
    category: "合规与风控",
    tags: ["NSF50", "CCS-12804", "Section28", "认证", "卫生标准"],
    audience: ["工程实施", "采购", "销售团队", "培训师", "管理者"],
    layer: "commons",
    usage: "both",
    min: 4,
    summary:
      "NSF/ANSI/CAN 50 是泳池/水疗/热水浴缸设备与化学品标准。2021 年修订新增第 28 节，专门覆盖漂浮舱/感官剥夺系统；NSF 另发 CCS-12804 给厂商走第三方认证。对外可讲「有专项条款」，不要把这份内部汇编当附件外发。",
    body: "全称：NSF/ANSI/CAN 50《游泳池、水疗池、热水浴缸及其他休闲水设施的设备与化学品标准》。\n2021 年修订：新增 Section 28（Flotation or Sensory Deprivation Systems and Related Equipment）。\n专项认证规范：CCS-12804 Issue 2，Component Certification Specification for Floatation or Sensory Deprivation Systems and Related Equipment。\n本系列：KP-NSF-001~018，精细拆自《NSF_ANSI_50_漂浮舱标准汇总》。汇编头标注仅内部参考、禁止整份发给客户/投资人/展会。\n对外怎么用：可以说「漂浮舱已进入 NSF/ANSI/CAN 50 专项条款，厂商可走 CCS-12804 认证」。引用落到条款号，不把内部汇编当证书或合同附件。\n不是什么：不是本公司已获证声明；不是 NAFTS 行业指南的替代；不是消杀 PPT 的氯致癌叙事。\n对接：卫生叙事总卡仍是 KP-WEB-004；认证口径以本系列为准。氯/溴路径冲突见 KP-NSF-011。",
    examples: [
      "对：漂浮舱在 NSF/ANSI/CAN 50 里有专项条款，认证走 CCS-12804",
      "错：把这份 Word 汇总印进客户标书当 NSF 证书",
    ],
  },
  {
    id: "KP-NSF-002",
    loc: "一、标准覆盖的设备类型 / 认证合规时间表",
    title: "NSF 覆盖四类舱体，认证节点 2024 / 2025",
    category: "合规与风控",
    tags: ["NSF50", "认证时间表", "自包含", "CCS-12804"],
    audience: ["工程实施", "采购", "管理者", "培训师"],
    layer: "commons",
    usage: "both",
    min: 3,
    summary:
      "标准覆盖自包含式、非自包含式、便携/固定、工厂预制与现场组装。已按 CCS 认证的产品须在 2025-01-01 完成审查与必要测试；自动化阀门、超细过滤、流量计量等修订条款 2024-01-01 生效。",
    body: "设备类型：\n- 自包含式（self-contained）：工厂集成控制、加热、循环\n- 非自包含式（non-self-contained）：加热/循环不必是舱体组件\n- 便携式与固定式\n- 工厂预制舱体与现场组装系统\n时间表（汇编摘录，以 NSF 官方通告为准）：\n- 2024-01-01：自动化阀门、超细过滤、流量计量装置等修订生效\n- 2025-01-01：已按 CCS 认证的产品完成审查与必要测试\n对内：新产品设计按现行 CCS-12804 一次做到位，不要按「旧泳池条款」只改外观。\n对外：不要口头承诺「我们已经 NSF 认证」；只能讲路径和计划，证书未签发就不说获证。\n考核：自包含和非自包含差在哪？",
    examples: [],
  },
  {
    id: "KP-NSF-003",
    loc: "二、2.1 浊度削减测试",
    title: "浊度削减主考：5 次周转后削减率 ≥70%",
    category: "技术知识",
    tags: ["浊度", "过滤器", "Sil-co-sil", "NSF50", "测试"],
    audience: ["工程实施", "采购", "培训师"],
    layer: "company",
    usage: "both",
    min: 5,
    summary:
      "过滤系统主考项。挑战液用 Sil-co-sil 106 把浊度调到 45±10 NTU，按厂商标称最大流量连续测 5 个水箱容积。通过标准：残留比 TR≤0.30，即浊度削减率≥70%。工程验收和培训都要会读这张表。",
    body: "依据：NSF/ANSI 50 Section 5, Annex B；CCS-12804 §1.7.1.4.1。\n挑战液：Sil-co-sil 106（#140 硅粉），测试水箱浊度 45±10 NTU。\n流程：过滤器以厂商标称最大设计流量运行；每循环一个水箱容积取样测浊度；连续 5 个循环容积。\n通过：TR = (TB3−TB1)/(TB2−TB1) ≤ 0.30 → 浊度削减率 ≥70%。\n高容量筒式滤芯特例：5 次后 TR 仍 >0.30 但滤芯未到厂商建议清洗条件，允许不清洗滤芯重新排水做第二次测试，以第二次为准。\n间歇：每次浊度测量后至少停机 10±0.5 分钟。\n浊度计：0–10 NTU 精度 ±0.5 NTU；10 NTU 以上取 ±5% 读数或 ±1 NTU 的较大值。\n培训误区：不要把「我们过滤很精密」当成已通过 NSF 浊度测试。没有按 Annex B 出的报告，就还没过。\n专利提示：这套颗粒物削减流程已经极度具体，见 KP-NSF-017。",
    examples: ["验收问法：要看 5 次周转后的 TR，不是看宣传页微米数"],
  },
  {
    id: "KP-NSF-004",
    loc: "二、2.2 水体周转时间",
    title: "最大周转 ≤30 分钟；用户间清洁按制造商周期",
    category: "合规与风控",
    tags: ["周转", "turnover", "用户间清洁", "NSF50"],
    audience: ["工程实施", "门店运营", "销售团队", "培训师"],
    layer: "commons",
    usage: "both",
    min: 4,
    summary:
      "整个舱内液体量必须在 30 分钟内被循环过滤系统完整处理一遍。用户之间还要跑满制造商建议的清洁周转次数。产品材料里的「15 分钟三翻转」若实测成立，严于这条上限，但不能拿宣传页代替测试。",
    body: "依据：NSF/ANSI/CAN 50 Section 28；CCS-12804 §1.7.1.2。\n硬指标：最大水体周转时间 ≤30 分钟。\n用户间：循环系统需达到制造商建议的用户间清洁周期所需周转次数——次数由厂商写进说明书，不是销售口头锁死。\n对照 NACCHO / KP-WEB-004：实务常用用户之间至少约 3 次容积翻转；开业前 1 次、收工后 4 次量级。那是卫生实务，不是 NSF 把 3 次写进条款。\n对照 KP-CHAMP-018：冠军系列写「15 分钟内 3 次完整液体翻转、单循环 3-log」。若泵滤真能 5 分钟一周转，则严于 NSF 的 30 分钟上限。两口径都要保留：认证跟 CCS 实测；门店跟型号程序。\n另见 KP-NSF-009：清洁介质条件下循环系统须 5 分钟完成一次完整周转——那是过滤器性能测试，不是把最大周转改成 5 分钟。\n对外：讲「按 NSF，舱液体积要能在半小时内被完整过滤一遍」；不要把 15 分钟三翻转说成 NSF 原文。",
    examples: [
      "对：最大周转 30 分钟是上限；我们某型号若能 5 分钟一周转，是产品能力不是标准原文",
      "错：NSF 规定必须 15 分钟翻三次",
    ],
  },
  {
    id: "KP-NSF-005",
    loc: "二、2.3 吸入口数量",
    title: "循环系统必须两个及以上吸入口，防负压卡吸",
    category: "合规与风控",
    tags: ["吸入口", "卡吸", "entrapment", "安全", "NSF50"],
    audience: ["工程实施", "采购", "门店运营", "培训师"],
    layer: "commons",
    usage: "both",
    min: 3,
    summary:
      "漂浮舱循环系统必须有两个或以上吸入口配件，防止单一吸入口负压卡吸。这是泳池防卡吸法规在漂浮舱上的对应条款，不是装饰。",
    body: "依据：NSF/ANSI/CAN 50 Section 28。\n要求：两个或以上 suction outlet fittings。\n原因：单吸入口堵塞或人体封堵时，负压可造成 entrapment（卡吸）。双吸入口把风险分走。\n安装还要看 KP-NSF-013：完全浸没吸入口须 APSP-16 认证，并评估方向、单/双配置、最大流量评级。\n培训：客户问「为什么舱底两个回水口」→ 答防卡吸，不是为了好看。\n设计红线：不要为了「极简舱底」改回单吸入口。",
    examples: [],
  },
  {
    id: "KP-NSF-006",
    loc: "二、2.4 消毒效能测试",
    title: "消毒两档：辅助 3-log 细菌，二级 3-log 隐孢子虫",
    category: "合规与风控",
    tags: ["3-log", "UV", "消毒", "隐孢子虫", "NSF50"],
    audience: ["工程实施", "销售团队", "培训师", "采购"],
    layer: "commons",
    usage: "both",
    min: 4,
    summary:
      "紫外设备分两档。辅助消毒：进水细菌 ≥3-log（99.9%）。二级消毒：隐孢子虫（C. parvum）≥3-log。库内常说的 3-log 要对上是哪一档，不能把隐孢子虫灭活说成已经测过。",
    body: "依据：NSF/ANSI 50 Section 15.18；CCS-12804 §1.7.1.4.9。\n辅助消毒 Supplemental：对象是进水中的细菌，灭活率 ≥3-log（99.9%）。\n二级消毒 Secondary：对象是隐孢子虫 C. parvum，灭活率 ≥3-log。\n对外可用：认证消杀系统在规定程序后对主舱细菌约 3-log——与 KP-WEB-004、KP-CHAMP-018 同数量级。\n对外不可用：把「3-log」自动升级成「杀灭隐孢子虫 / 医疗灭菌 / 无菌」。没有二级消毒测试报告，就只讲细菌档。\n对接主/辅系统架构：KP-NSF-011。Annex H 实测时主消毒氯溴关闭、只考辅助系统：KP-NSF-012。",
    examples: [
      "对：辅助消毒档是细菌 99.9% 灭活",
      "错：我们 NSF 3-log 所以寄生虫、病毒、芽孢都杀完了",
    ],
  },
  {
    id: "KP-NSF-007",
    loc: "三、3.1–3.2 材料与舱体",
    title: "水接触材料与舱壳/内衬：认证要用的标准清单",
    category: "产品知识",
    tags: ["材料", "内衬", "NSF-pw", "ASTM", "舱壳"],
    audience: ["工程实施", "采购", "产品研发"],
    layer: "company",
    usage: "ops",
    min: 6,
    summary:
      "所有与舱液接触的材料须过 NSF/ANSI 50 §3 及 Annex A 的健康安全与耐腐蚀评估。管件走 NSF-pw / IAPMO Z1033；塑料内衬有厚度、穿刺、撕裂、拉伸和 100 天耐化学；舱壳走 ANSI Z124 系列含阻燃。这是工程选型清单，不是销售形容词。",
    body: "依据：CCS-12804 §1.4、§1.5.3.1。\n水接触材料：NSF/ANSI 50 Section 3 + Annex A。\n- 刚性塑料管件：NSF/ANSI 14（NSF-pw 饮用水终端）\n- 柔性增强/非增强塑料软管：NSF/ANSI 50 Section 4 + IAPMO Z1033\n塑料内衬（非增强）要点：\n- 厚度 ≥0.030 英寸\n- 耐穿刺 ASTM D4551 或 D4833；耐凹陷、静水压力 ASTM D4551\n- 撕裂强度 ASTM D1004 ≥225 lbs/in\n- 拉伸强度 ASTM D638 ≥2000 psi\n- 100% 伸长率模量 ASTM D882 ≥950 psi\n- 耐化学：NSF/ANSI 50 Annex G.1，100 天暴露于最大推荐化学品浓度\n塑料舱壳：ANSI Z124.1.2 耐污；ANSI Z124.7 表面/基底/色牢度/耐磨可清洁/香烟/耐化学/静载荷/空载均布/点冲击；阻燃 UL94 HB/HBF 或 Z124.1.2 §5.6 点火。\n运营用法：采购和开模前对清单打勾。不要对客户念 psi 和 ASTM 编号，除非对方是工程尽调。",
    examples: [],
  },
  {
    id: "KP-NSF-008",
    loc: "三、3.3–3.5 防滑、水深、台阶扶手",
    title: "防滑、最大水深 24 英寸、坡度 1:12、台阶扶手尺寸",
    category: "产品知识",
    tags: ["防滑", "水深", "台阶", "扶手", "安全"],
    audience: ["工程实施", "门店运营", "培训师", "产品研发"],
    layer: "company",
    usage: "both",
    min: 5,
    summary:
      "台阶/落脚点必须防滑（ASTM F462 或 D1894）。最大水深 ≤24 英寸（约 62 cm），舱外要有颜色对比的深度标记。舱底坡度 ≤1:12。台阶踏面、踢面、扶手高度和载荷都有数。培训要会：漂浮舱不是深水池。",
    body: "依据：CCS-12804 §1.5.3.2–1.5.3.4、§1.5.4。\n防滑：ASTM F462（洗浴设施消费者安全）或 ASTM D1894（塑料薄膜静/动摩擦系数），台阶或进出落脚点必须满足其一。\n水深：最大 ≤24 英寸（62 cm）；舱外颜色对比深度标记。\n坡度：舱底 ≤1 英寸/英尺（最大 1:12）。\n台阶：\n- 踏面最小深度 ≥10 英寸（25.4 cm）\n- 踏面最小面积 ≥240 in²（1550 cm²）\n- 踢面高度 7–12 英寸（17.78–30.48 cm）；底层踏面当座椅时最大 14 英寸（35.56 cm）\n扶手：最低点距运行水位 ≤9 英寸；150 磅拉力或 300 磅垂直载荷下不得永久变形或脱落。\n对外：可讲浅水、有深度标记、进出防滑。不要讲成「深海浸泡」或把水深锁成体验卖点而突破 24 英寸。\n对接 SOP 防滑地垫、应急：标准管的是舱体本身，门店地垫仍要按 SOP。",
    examples: ["考核：最大水深多少？没有深度标记算不算过？"],
  },
  {
    id: "KP-NSF-009",
    loc: "四、4.1 过滤器性能测试",
    title: "过滤系统要过静压、压损、5 分钟周转和浊度全套",
    category: "技术知识",
    tags: ["过滤器", "循环", "静压", "NSF50"],
    audience: ["工程实施", "采购", "培训师"],
    layer: "company",
    usage: "both",
    min: 4,
    summary:
      "整套过滤须过 NSF/ANSI 50 §5：1.5 倍最小工作压力（50 psi）静压、压力损失、循环性能、浊度≥70%、介质可清洁性、有效过滤面积与过滤速率。清洁介质条件下泵+过滤器要在 5 分钟内完成一次完整水体周转。",
    body: "依据：CCS-12804 §1.7.1.4.1。\n必测：\n- 静水压力：1.5 × 最小工作压力 50 psi\n- 压力损失\n- 循环性能：回水设计须辅助舱内水体循环及排出处理\n- 清洁介质条件下，循环系统（泵+过滤器）5 分钟内完成一次完整水体周转\n- 浊度削减率 ≥70%（Sil-co-sil 106，见 KP-NSF-003）\n- 过滤介质可清洁性\n- 有效过滤面积与过滤速率\n和 KP-NSF-004 的关系：30 分钟是标准允许的最慢周转；5 分钟是过滤性能测试在清洁介质下的能力要求。门店脏滤材、高盐度会变慢，运营不要拿实验室 5 分钟当日常承诺。\n培训误区：滤材该换不换，周转再快的铭牌也无效。",
    examples: [],
  },
  {
    id: "KP-NSF-010",
    loc: "四、4.2 表面撇污与溢流",
    title: "必须有撇污/溢流，并标明理想运行水位",
    category: "运营管理",
    tags: ["撇污", "skimmer", "溢流", "水位标记"],
    audience: ["工程实施", "门店运营"],
    layer: "company",
    usage: "ops",
    min: 3,
    summary:
      "舱体必须集成表面撇污，快速去掉漂浮碎屑。周边溢流格栅、溢流沟、撇污器或湍流进水口四选一或组合。所有这类系统都要标理想运行水位和可接受范围。",
    body: "依据：CCS-12804 §1.7.1.4.2。\n实现方式之一即可：周边溢流格栅 / 溢流沟 / 撇污器（skimmers） / 湍流进水口。\n标记：理想运行水位 + 可接受范围。位置可在撇污器面板、舱体内衬或外壳外部。\n运营：水位不在标记范围，撇污失效，表面膜和毛发会停在舱里。开舱检查先看水位线，再看泵。\n对接 KP-NSF-014 产品标记。",
    examples: ["班前：水位是否在标记范围内"],
  },
  {
    id: "KP-NSF-011",
    loc: "四、4.3.1–4.3.2 主消毒与辅助处理",
    title: "NSF 主消毒可走氯溴；辅助 UV/臭氧/铜银至少一种且强制",
    category: "合规与风控",
    tags: ["氯", "溴", "臭氧", "UV", "主消毒", "冲突"],
    audience: ["工程实施", "销售团队", "培训师", "门店运营", "采购"],
    layer: "company",
    usage: "both",
    min: 6,
    variantGroupId: "VG-NSF-DISINFECT",
    variantLabel: "NSF CCS-12804 认证口径",
    conflictAllowed: true,
    isPreferredInGroup: true,
    conflictNote:
      "与 KP-WEB-004 并存。WEB-004 的「氯溴不推荐」来自 NAFTS/FTA（高镁试纸不准、未按浮舱注册）。NSF CCS-12804 写主消毒须用 EPA 注册消毒剂（氯/溴等）或符合 NSF/ANSI 50 的消毒系统，并强制至少一种辅助处理（臭氧/UV/铜银）。认证与工程跟本卡；对客不要说「NSF 禁止氯」，也不要说「必须上氯」。",
    summary:
      "CCS-12804：主消毒 = EPA 注册氯/溴等，或 NSF/ANSI 50 认证消毒系统。化学投加须与循环泵联锁，用户间清洁后能把自由有效氯提到 2.0 ppm（或溴 4.0 ppm）。另外必须指定至少一种辅助系统：臭氧、UV 或铜/银，同样与泵联锁。这和 NAFTS「不推荐氯溴」不是同一句话。",
    body: "依据：CCS-12804 §1.7.1.4.8、§1.7.1.4.9。\n主消毒：\n- EPA 注册消毒剂（氯/溴等）或符合 NSF/ANSI 50 的消毒系统\n- 自动水质/投加控制器须 NSF/ANSI 50 认证\n- 机械/流通式化学投加器、电解氯/溴发生器须认证，且与循环泵电气联锁（泵停则投加停）\n- 投加器须能在用户间清洁程序后将自由有效氯提升 2.0 ppm（或溴 4.0 ppm）\n辅助/二级（必须至少一种）：臭氧 / 紫外 / 铜银离子；与循环泵联锁，在每次用户间清洁周期运行。\n和 KP-WEB-004 怎么并存：\n- NAFTS/FTA：高镁溶液里氯溴试纸常测不准，且氯溴往往未按浮舱用途完成注册说明 → 行业指南不推荐当主策略\n- NSF：认证框架仍按休闲水设施写了氯/溴主路径，同时把 UV/臭氧/铜银写成强制辅助\n- Annex H 测辅助效能时主消毒氯溴关闭（KP-NSF-012）→ 真正考漂浮场景的是辅助系统\n对外改口：\n- 不要：NSF 禁止氯，所以必须买我们的物理消杀\n- 不要：氯致癌\n- 可以：行业指南（NAFTS）不把氯溴当浮舱主策略；NSF 认证要求辅助 UV/臭氧/铜银，并可用认证消毒系统代替简单投氯\n门店执行：以设备说明书与本地法规为准，不在口头锁死「我们加氯」或「我们绝不加氯」。",
    examples: [
      "对：NSF 强制辅助 UV 或臭氧或铜银；主路径可以是认证消毒系统，不一定是泳池氯方案",
      "错：国际标准禁止氯，氯会致癌",
    ],
  },
  {
    id: "KP-NSF-012",
    loc: "四、4.3.3–4.3.4 臭氧限制与初始消毒效能",
    title: "舱液臭氧不得超过 0.1 ppm；Annex H 关氯只考辅助系统",
    category: "合规与风控",
    tags: ["臭氧", "0.1ppm", "Annex H", "辅助消毒"],
    audience: ["工程实施", "门店运营", "销售团队", "培训师"],
    layer: "commons",
    usage: "both",
    min: 4,
    summary:
      "用臭氧的系统须过 NSF/ANSI 50 §13.10 及 Annex H，舱内水中臭氧 ≤0.1 ppm（0.2 mg/m³）。初始消毒效能测试按制造商的水位、温度、盐浓度来，并且验证水中无游离氯/溴、无过氧化氢，只跑用户间清洁程序考辅助系统。",
    body: "臭氧上限：CCS-12804 §1.7.1.4.9.2；NSF/ANSI 50 Section 13.10 + Annex H。舱内水中臭氧不得超过 0.1 ppm（0.2 mg/m³）。与 KP-WEB-004 / NACCHO 2023 同数量级。\nAnnex H 初始消毒效能（§1.7.1.4.9.3）测试条件：\n- 水位、温度、盐浓度、铜/银含量按制造商规格\n- 验证水中无自由有效氯或溴\n- 验证水中无过氧化氢或其他推荐氧化剂\n- 按 Annex H 接种挑战微生物\n- 执行制造商推荐的用户间维护/清洁程序\n- 主消毒（氯/溴）关闭，仅测试辅助处理系统\n这句话的训练价值：NSF 承认浮舱认证要在高盐、无氯条件下证明 UV/臭氧/铜银够不够。销售可讲「认证考的是辅助系统在盐舱里的真实程序」，不要讲成「标准要求必须加氯」。\n运营：臭氧传感器和上限以说明书为准，不在口头加严或放宽。",
    examples: [],
  },
  {
    id: "KP-NSF-013",
    loc: "五、安全与防护",
    title: "入口警报、SVRS、APSP-16 吸入口和空气吹送防回流",
    category: "合规与风控",
    tags: ["SVRS", "UL2017", "APSP-16", "防回流", "安全"],
    audience: ["工程实施", "采购", "门店运营", "培训师"],
    layer: "company",
    usage: "both",
    min: 5,
    summary:
      "舱门可装 UL2017 入口警报。若用吸力真空释放（SVRS），须 ASME A112.19.17 或 ASTM F2387，并由 ISO 17025 机构测。浸没吸入口须 APSP-16。空气吹送要防污水回流到吹风机。",
    body: "依据：CCS-12804 §1.6、§1.7.1.4.3、§1.7.1.4.7。\n入口警报：可选，须符合 UL2017（OSHA 认可的 NRTL 测试）。\nSVRS：Suction Vacuum Release System。ASME A112.19.17 或 ASTM F2387；ISO 17025 第三方。\n完全浸没吸入口：APSP-16，ISO 17025 第三方。安装评估方向（地板/墙壁）、单个或成对、该开口最大流量评级。与 KP-NSF-005 双吸入口一起看。\n空气吹送/诱导（如使用）：\n- 防回流：止回阀，或 Hartford 回路，或吹风机安装高于水位线\n- 进气不得从外部引入水、灰尘、污染物\n- 集成空气通道承受 150% 最大额定工作压力至少 5 分钟\n- 吹风管道符合 NSF/ANSI 50 及 IAPMO Z1033\n培训：气泡/气吹是体验功能，安全条款管的是污水别灌进电机。没有防回流设计就不要开这功能。",
    examples: [],
  },
  {
    id: "KP-NSF-014",
    loc: "六、标记与使用说明",
    title: "产品要有 NSF CCS 标志，手册要写清安装使用清洁",
    category: "运营管理",
    tags: ["标记", "NSF标志", "用户手册", "水位"],
    audience: ["工程实施", "门店运营", "采购"],
    layer: "company",
    usage: "ops",
    min: 3,
    summary:
      "获证产品必须带 NSF CCS-12804 认证标志。用户手册必须有清晰的安装、使用与清洁说明。撇污/溢流系统还要标理想水位。没有标志就不是「已认证产品」。",
    body: "依据：CCS-12804 Physical Evaluation；§1.7.1.4.2。\n必须：NSF CCS-12804 认证标志 + 其他要求标记。\n手册：安装、使用、清洁写清楚——用户间清洁程序写进这里，才是 Annex H 要跑的那套。\n水位标记见 KP-NSF-010。\n销售纪律：样机照片上的 NSF 标、宣传「符合 NSF 精神」、供应商零件获证，都不等于整舱已认证。整舱获证以铭牌和证书为准。",
    examples: ["尽调问法：看铭牌 CCS-12804，不要看 PPT 里的 NSF logo"],
  },
  {
    id: "KP-NSF-015",
    loc: "下一步建议 / Water Online 解读",
    title: "认证策略：优先用已获 NSF/ANSI 50 认证的泵滤 UV 臭氧组件",
    category: "战略规划",
    tags: ["认证路径", "组件", "采购", "CCS-12804"],
    audience: ["管理者", "采购", "工程实施", "培训师"],
    layer: "company",
    usage: "both",
    min: 4,
    summary:
      "计划做 NSF 认证时，优先选用已经通过 NSF/ANSI 50 的泵、过滤器、UV/臭氧系统，缩短整舱 CCS-12804 周期和成本。这是工程策略，不是「零件获证=整舱获证」。",
    body: "依据：汇编「下一步建议」；Water Online《The New Addition To NSF/ANSI/CAN 50: Float Tanks》（NSF 高级经理 Kristina Laszlo）。\n做法：泵、过滤器、UV、臭氧发生器尽量买已列名 NSF/ANSI 50 的型号，整舱再按 CCS-12804 做系统级浊度、周转、消毒效能、材料、防卡吸。\n不要：用一堆未认证零件指望一次过；也不要只换标不改水路。\n对外：可以说「认证路径是组件先过 50、系统再过 12804」。在证书出来前，禁止「已获 NSF 认证」。\n和专利卡分工：认证走本卡；哪些测试别去抢专利见 KP-NSF-017，空白点见 KP-NSF-018。",
    examples: [],
  },
  {
    id: "KP-NSF-016",
    loc: "全稿数字汇总（培训）",
    title: "NSF 漂浮舱培训必背：数字、误区、考核",
    category: "培训资料",
    tags: ["培训", "必背", "NSF50", "考核", "汇报+培训"],
    audience: ["培训师", "工程实施", "销售团队", "门店运营"],
    layer: "company",
    usage: "both",
    min: 8,
    summary:
      "公司库和培训库都标记。学习目标：能背出周转、浊度、3-log、臭氧、双吸入口、水深，并能把 NSF 与 NAFTS、产品宣传页三套口径拆开。销售汇报和内训用同一张卡。",
    body: "学习目标：闭卷写出 6 个数字，并指出 3 个对外禁句。\n必背数字：\n- 最大周转 ≤30 分钟\n- 清洁介质过滤测试：5 分钟一周转\n- 浊度 5 次周转后削减 ≥70%（TR≤0.30）；挑战浊度 45±10 NTU\n- 辅助消毒细菌 ≥3-log；二级消毒才轮到隐孢子虫 3-log\n- 臭氧舱液 ≤0.1 ppm\n- 吸入口 ≥2；最大水深 ≤24 英寸（62 cm）；坡度 ≤1:12\n- 用户间清洁后自由氯可提升至 2.0 ppm（或溴 4.0 ppm）——这是主消毒投加能力，不是门店必须加氯\n三套口径：\n1 NSF/CCS：认证测试，跟本系列\n2 NAFTS/FTA + WEB-004：行业指南不推荐氯溴当主策略\n3 冠军系列 CHAMP-018：15 分钟三翻转 + 3-log，产品材料，须实测\n误区：\n- NSF=已经获证\n- 3-log=无菌=杀隐孢子虫\n- 15 分钟三翻转写在 NSF 原文里\n- NSF 禁止氯 / 氯致癌所以必须买我们\n考核：\n1 客户问「你们符合 NSF 吗」标准答？\n2 客户问「为什么不用氯」标准答？\n3 工程师问「30 分钟和 5 分钟哪个是日常承诺」标准答？",
    examples: [
      "答1：漂浮舱有 NSF/ANSI/CAN 50 第 28 节专项条款；我们按 CCS-12804 路径做，获证以铭牌为准",
      "答2：NAFTS 不把氯溴当浮舱主策略；NSF 要求辅助 UV/臭氧/铜银，主路径也可以是认证消毒系统",
      "答3：30 分钟是标准上限；5 分钟是清洁介质实验室能力；日常跟说明书和滤材状态",
    ],
  },
  {
    id: "KP-NSF-017",
    loc: "七、7.1 已高度标准化的领域",
    title: "内训：浊度、周转、双吸入口、臭氧上限不是专利空间",
    category: "战略规划",
    tags: ["专利", "标准化", "仅内训", "研发"],
    audience: ["产品研发", "管理者", "培训师"],
    layer: "company",
    usage: "training",
    internalOnly: true,
    min: 4,
    summary:
      "仅内训。浊度≥70% 的测试流程、周转≤30 分钟、吸入口≥2、臭氧≤0.1 ppm、辅助消毒与循环泵电气联锁，都是硬性或已公开的工程手段。不要在这些点上再写「过滤精度提升」类专利叙事。",
    body: "汇编判断（内部）：\n- 浊度削减 ≥70% 的挑战液、取样节奏、TR 公式已经极度具体，任何「过滤精度提升」「浊度削减方法」很难绕开这套测试去主张新颖性\n- 水体周转 ≤30 分钟、吸入口 ≥2、臭氧 ≤0.1 ppm 是硬性安全要求，不是创新空间\n- 辅助消毒（UV/臭氧/铜银）必须与循环泵电气联锁是通用工程手段；汇编写 US9956374 已公开类似逻辑\n怎么用：立项评审先问「这是不是 NSF 已经考过的项」。是 → 做合规，不包装成发明点。\n怎么不用：对投资人讲「我们首创 3-log / 双吸入口 / 半小时周转」。\n对接空白点：KP-NSF-018。",
    examples: [],
  },
  {
    id: "KP-NSF-018",
    loc: "七、7.2 可能的空白点",
    title: "内训：高盐结晶堵塞传感器透气孔是 NSF 未覆盖的故障模式",
    category: "技术知识",
    tags: ["专利", "沉默失效", "高盐结晶", "传感器", "仅内训"],
    audience: ["产品研发", "管理者", "培训师"],
    layer: "company",
    usage: "training",
    internalOnly: true,
    min: 5,
    summary:
      "仅内训。NSF 浊度测试用硅粉悬浊液，考的是颗粒物削减。任务书里的「高盐蒸汽在传感器透气孔结晶」是另一类失效：盐分堵塞传感透气路径，不是滤材被颗粒堵住。汇编认为这是标准未触及的传感/自诊断空白。",
    body: "汇编论点（内部技术叙事，不是已授权专利声明）：\n- NSF 挑战介质 = 硅粉，测颗粒物削减能力\n- 高盐蒸汽在传感器透气孔结晶 = 盐分结晶堵塞透气路径\n- 故障模式不在 NSF 50 现有测试项里\n- 「沉默失效」属于传感与自诊断，不是过滤功能差异化\n对内可用：把独特性放在故障模式发现 + 自诊断，而不是再发明一遍过滤器。\n对外/专利文件：具体权利要求、实施例、是否申请，以知识产权文件为准。本卡只保存汇编对 NSF 测试盲区的判断，不当新闻稿。\n禁止：在客户 PPT 讲「NSF 测不到我们的沉默失效所以我们更安全」——那是贬低标准，也提前暴露内部技术点。\n参考文件卡：CCS-12804 Issue 2；NSF/ANSI/CAN 50-2021 Issue 106 §28；Water Online Laszlo 文；Section 5 Annex B；Section 15.18；Section 13.10 Annex H。",
    examples: [
      "对内：标准考的是滤材颗粒物，我们要管的是盐雾把传感器「悄悄」堵死",
      "错：对外说 NSF 有漏洞所以只有我们安全",
    ],
  },
];

function build(item) {
  const point = {
    id: item.id,
    title: item.title,
    category: item.category,
    tags: item.tags,
    audience: item.audience,
    prerequisites: item.id === "KP-NSF-001" ? [] : ["KP-NSF-001", "KP-NSF-016"],
    summary: item.summary,
    body: item.body,
    examples: item.examples || [],
    source: {
      file: sourceFile,
      location: item.loc,
      date: "2026-09-04",
      author: "内部汇编（NSF CCS-12804 / NSF/ANSI/CAN 50-2021 §28）",
    },
    scenarios:
      item.usage === "ops"
        ? ["工程对接", "开业验收", "运营培训"]
        : item.internalOnly
          ? ["内部培训", "研发评审"]
          : ["合规培训", "工程对接", "B端提案", "销售培训"],
    durationMin: item.min,
    version: "1.0",
    status: "approved",
    layer: item.layer,
    usage: item.usage,
    createdAt: now,
    updatedAt: now,
  };
  if (item.internalOnly) point.internalOnly = true;
  if (item.variantGroupId) {
    point.variantGroupId = item.variantGroupId;
    point.variantLabel = item.variantLabel;
    point.conflictAllowed = item.conflictAllowed;
    point.isPreferredInGroup = item.isPreferredInGroup;
  }
  if (item.conflictNote) point.conflictNote = item.conflictNote;
  else if (item.internalOnly) {
    point.conflictNote =
      "仅内训。专利/研发判断，不是已获证声明，不进客户资料与对外 PPT。";
  } else if (item.layer === "commons") {
    point.conflictNote =
      "通识层。公开标准条款摘录，不是本公司已获 NSF 认证。整份内部汇编不外发。";
  } else {
    point.conflictNote =
      "公司层。工程/认证口径。数字以 CCS 实测和铭牌为准，宣传页不能代替测试报告。";
  }
  return point;
}

const dataDir = path.join(process.cwd(), "data");
const kpPath = path.join(dataDir, "knowledge-points.json");
const sourcesPath = path.join(dataDir, "sources.json");

const existing = JSON.parse(readFileSync(kpPath, "utf-8"));
if (existing.some((p) => p.id === "KP-NSF-001")) {
  console.log("NSF/ANSI 50 已入库，跳过。总数:", existing.length);
  process.exit(0);
}

const points = raw.map(build);
const ids = new Set(existing.map((p) => p.id));
const dup = points.filter((p) => ids.has(p.id));
if (dup.length) {
  console.error("ID 冲突:", dup.map((p) => p.id).join(","));
  process.exit(1);
}

const web004Note =
  "公开文献/标准摘录。用于纠偏与补强，不构成本公司临床试验。与 KP-NSF-011 并存：本卡「氯溴不推荐」来自 NAFTS/FTA；NSF CCS-12804 仍写主消毒可用 EPA 氯/溴或认证消毒系统，并强制辅助 UV/臭氧/铜银。认证口径跟 NSF 卡；对客卫生叙事不要说「NSF 禁止氯」。";
const champ018Note =
  "产品材料口径。NSF 最大周转 30 分钟（KP-NSF-004）；「15 分钟三翻转」若实测成立则严于标准，不能用宣传页代替 CCS 测试报告。";

const merged = existing.map((p) => {
  if (p.id === "KP-WEB-004") {
    return {
      ...p,
      updatedAt: now,
      variantGroupId: "VG-NSF-DISINFECT",
      variantLabel: "NAFTS/FTA 行业指南口径",
      conflictAllowed: true,
      isPreferredInGroup: false,
      conflictNote: web004Note,
    };
  }
  if (p.id === "KP-CHAMP-018") {
    return {
      ...p,
      updatedAt: now,
      conflictNote: champ018Note,
    };
  }
  return p;
});

merged.push(...points);
writeFileSync(kpPath, JSON.stringify(merged, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const next = sources.filter((s) => s.id !== sourceId);
next.push({
  id: sourceId,
  filename: sourceFile,
  fileType: "docx",
  uploadedAt: now,
  knowledgePointIds: points.map((p) => p.id),
  status: "done",
  splitMode: "claude-agent",
  note: "NSF/ANSI 50 漂浮舱标准汇总精细拆分 18 条。公开条款通识+both；工程清单公司+both/ops；专利空白仅内训。直接批准。氯溴口径与 WEB-004 并存。",
});
writeFileSync(sourcesPath, JSON.stringify(next, null, 2) + "\n");

const both = points.filter((p) => p.usage === "both").length;
const internal = points.filter((p) => p.internalOnly).length;
console.log(
  JSON.stringify(
    {
      imported: points.length,
      total: merged.length,
      both,
      ops: points.filter((p) => p.usage === "ops").length,
      trainingInternal: internal,
      commons: points.filter((p) => p.layer === "commons").length,
      company: points.filter((p) => p.layer === "company").length,
      approved: merged.filter((p) => p.status === "approved").length,
    },
    null,
    2
  )
);
