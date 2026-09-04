/**
 * 漂浮舱卫生安全标准五问 → KP-WEB-013~020（通识层，可外发）
 *
 * 来源：docs/漂浮舱卫生安全标准五问.md
 * 展开 KP-WEB-004 / KP-WEB-012 的条款号，不覆盖旧卡。
 * 幂等：KP-WEB-013 已存在则跳过。
 * 运行：node scripts/import-nsf-standards-qa.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-04T09:50:00.000Z";
const sourceId = "SRC-NSF-STANDARDS-QA";
const sourceFile = "docs/漂浮舱卫生安全标准五问.md";

const raw = [
  {
    id: "KP-WEB-013",
    loc: "§0 三套文件分清",
    title: "卫生标准三套文件：CCS-12804、NSF 50 第28节、FTA 运营建议不要混",
    category: "合规与风控",
    tags: ["NSF50", "CCS-12804", "FTA", "卫生"],
    audience: ["工程实施", "采购", "销售团队", "门店运营"],
    usage: "both",
    min: 4,
    scenarios: ["采购尽调", "工程对接", "合规培训", "B端提案"],
    summary:
      "CCS-12804 是实验室部件认证规范；NSF/ANSI/CAN 50 第 28 节是 2021 年起的共识标准；FTA 北美浮舱标准是门店运营建议。认证数字和客人之间怎么跑循环不是同一句话。",
    body: "三套文件：\n1 NSF CCS-12804（约 2013）：休闲水项目部件认证规范。管工厂造的感觉剥夺/漂浮系统：材料、内衬、循环、过滤、消杀、寿命试验。后来被吸收进 NSF/ANSI/CAN 50。\n2 NSF/ANSI/CAN 50 第 28 节（2021 写入，2025 续更空气质量）：共识标准。认证时按制造商指定的泵、滤器、流量计、撇渣、消杀、吸入口、回水口整系统评。公开说明：挑战液在最长 30 分钟周转内达到 70% 浊度去除。\n3 North American Float Tank Standard（FTA v3，2025-05）：行业协会运营建议，不是认证证书。用户之间至少 3 次容积翻转（约滤掉 95%）；主消杀 UV/臭氧；空气臭氧按 OSHA。\n\n怎么用：CCS/NSF 50 回答「设备过不过实验室」；FTA 回答「门店每次客人之间跑几圈」。\n怎么不用：把 5 分钟周转能力、30 分钟浊度窗口、3 次周转说成同一个数。\n对接：浅讲仍用 KP-WEB-004 / KP-COM-017；条款号用本系列 WEB-014~020。\n全文底稿：docs/漂浮舱卫生安全标准五问.md",
    examples: [
      "对：认证按 NSF 50 第 28 节整系统评；门店按说明书完成用户间循环",
      "错：我们 NSF 认证所以每次只要循环 5 分钟",
    ],
  },
  {
    id: "KP-WEB-014",
    loc: "§1.1–1.3 CCS 材料与壳体",
    title: "CCS-12804：内衬力学、水深不超过 24 英寸、踏步防滑引用 F462",
    category: "技术知识",
    tags: ["CCS-12804", "内衬", "水深", "ASTM F462"],
    audience: ["工程实施", "采购", "学术"],
    usage: "both",
    min: 5,
    scenarios: ["采购尽调", "工程对接", "合规培训"],
    summary:
      "CCS-12804 对非增强柔性内衬有厚度、穿刺、撕裂、拉伸等硬杠；刚性舱体走 ANSI Z124。水深标记对比色、水深不得超过 24 in（62 cm）；进出踏步按 ASTM F462 或薄膜 D1894。",
    body: "规范范围：工厂制造的自含/非自含、便携或预制感觉剥夺系统。材料接触水部件按 NSF/ANSI 50 第 3 节 + Annex A 做毒理。不声称覆盖使用中全部安全风险。\n\n非增强柔性内衬（CCS 接受值）：\n- 厚度 ≥ 0.030 in（约 0.76 mm）\n- 穿刺：ASTM D4551 或 D4833\n- 压痕/静水压：ASTM D4551\n- 撕裂 ASTM D1004 ≥ 225 lb/in\n- 拉伸 ASTM D638 ≥ 2000 psi\n- 100% 伸长模量 ASTM D882 ≥ 950 psi\n- 耐化学品：Annex G.1，按最大推荐药剂浓度暴露 100 天，或等效证明\n- 最大推荐盐浓度与水位下整舱不漏\n\n刚性塑料舱体：ANSI Z124.1.2 / Z124.7（耐污、色牢度、耐磨、香烟、化学品、静水载荷、点冲击、阻燃）。\n\n结构硬杠：\n- 水深标记对比色、标在舱外；水深不得超过 24 in（62 cm）\n- 底坡不大于 1:12\n- 踏步（若有）踏面水平深度 ≥ 10 in、面积 ≥ 240 in²；踢面 7–12 in\n- 拉手：至少一处最低点不高于工作水位以上 9 in；150 lb 拉力或 300 lb 垂向载荷不脱落\n- 进出落脚面：ASTM F462 或 ASTM D1894（见 KP-WEB-018）\n\n还引用：NSF/ANSI 14 管件、APSP-16 吸入口、IAPMO Z1033 软管、UL 2017 门禁报警。\n对外：可讲「按 NSF 浮舱条款做材料与结构试验」。不要口头锁死某型号的实测值。",
    examples: [],
  },
  {
    id: "KP-WEB-015",
    loc: "§1.4–1.6 CCS 循环与消杀试验",
    title: "CCS-12804 测试方法：5 分钟周转能力、70% 浊度、Annex H 3-log、3000 小时复测",
    category: "技术知识",
    tags: ["CCS-12804", "3-log", "Annex H", "过滤", "消杀"],
    audience: ["工程实施", "采购", "门店运营", "销售团队"],
    usage: "both",
    min: 6,
    scenarios: ["采购尽调", "工程对接", "合规培训", "运营培训"],
    summary:
      "CCS 实验室主线：清洁滤材下 1 次容积周转小于 5 分钟；Sil-co-sil 106 浊度去除 ≥70%；用户间循环后挑战菌 3-log；3000 小时寿命试验后再测 3-log。二次处理（臭氧/UV/铜银）至少一种，与泵联锁。",
    body: "循环与过滤（滤材清洁、泵滤最大流量）：\n1 单次容积周转 < 5 分钟——这是设备能力，不是门店间隔\n2 整系统按 NSF/ANSI 50 第 5 节 + Annex B：静水压 1.5×最低工作压力（按 50 psi 计）、压损、循环性能\n3 浊度去除 ≥ 70%：挑战物 Sil-co-sil 106（#140 硅粉），在做完制造商规定的用户间清洁循环之后测\n4 第一级滤器须达温泉级过滤面积与过滤速率；滤材可清洁性须过\n5 泵按温泉温度工况核泵曲线，并实测总水量 5 分钟走完一轮\n6 必须有撇渣/溢流/水面取水，把液面油脂皮屑抽走\n\n消杀效能（§1.7.1.4.9.3）：\n- 二次处理必须有至少一种：臭氧、UV、铜银离子；与循环泵电气联锁，只在用户之间清洁循环工作\n- 按 Annex H 接种挑战菌；测二次系统时关掉一次卤素（无游离氯/溴、无过氧化氢）\n- 取样点：舱内使用者区域，不是机房取样口\n- 接受准则：3-log（99.9%）杀灭或灭活\n- 若同时有氯溴和臭氧/UV，效能试验关掉卤素，只评二次系统\n\n寿命：初次 3-log 通过后做模拟 3000 小时启停，再对两种挑战菌达到 3-log。\n铭牌必须写：用户间清洁循环步骤和时长；清洁循环期间舱内不得有人。\n对接：浅讲 3-log 用 WEB-004；本卡给尽调条款号。",
    examples: [
      "对：认证要求用户间循环后主舱细菌约 3-log，并以 3000 小时复测",
      "错：有臭氧就等于已经 3-log，不用看试验报告",
    ],
  },
  {
    id: "KP-WEB-016",
    loc: "§2 30 分钟周转率",
    title: "过滤如何满足 30 分钟周转率：5 分钟能力、30 分钟浊度、三次周转分开算",
    category: "运营管理",
    tags: ["周转率", "过滤", "NSF50", "FTA"],
    audience: ["工程实施", "采购", "门店运营"],
    usage: "ops",
    min: 5,
    scenarios: ["工程对接", "开业陪跑", "采购尽调", "运营培训"],
    summary:
      "NSF 50 第 28 节：最长 30 分钟周转内浊度去除 70%。CCS 设备能力是 1 次周转 <5 分钟。FTA 门店是客人之间至少 3 次周转（约 95%）。流量按比重 1.23–1.30 的盐溶液读泵曲线，并要有撇渣。",
    body: "三套数字：\n- CCS-12804：清洁滤材、最大流量下 1 次容积周转 < 5 min → 泵和滤器够不够大\n- NSF/ANSI/CAN 50 第 28 节（NSF 2023 公开说明）：挑战液在最长 30 min 周转时间内 70% 浊度去除 → 过滤真的去掉颗粒\n- FTA v3 §4.1.6：用户之间至少 95% 溶液更新；无外置储液罐 = 至少 3 次周转（鼓励 4 次）。Gage–Bidwell：3 次≈95%，4 次≈98%\n\n算法：周转时间（分钟）= 舱液体积 ÷ 循环流量。循环流量 ≥ 体积 ÷ 允许时间。\n演示（400 L，不是某型号参数）：\n- 1 次周转 ≤30 min → ≥13.3 L/min\n- 30 min 内完成 3 次周转 → ≥40 L/min\n- CCS 1 次 <5 min → ≥80 L/min\n没有流量计时，FTA 要求跟制造商标定时间走。\n\n过滤侧还要：\n1 第一级滤器达 NSF 50 温泉级面积与速率\n2 整系统 Sil-co-sil 106 浊度 ≥70%\n3 表面撇渣，避免只靠底吸\n4 回水搅拌，避免使用者区域死区\n5 高镁溶液比水密、比水黏，按盐溶液工况留余量，并核对吸入口 APSP-16 最大流量\n6 外置储液罐型：FTA 允许抽空滤一次算 100%；北美少见\n\n门店：泵/臭氧/UV 电气联锁；按说明书跑完用户间循环；清洁循环舱内无人。\n工程一句话：Q 选到 5 分钟能走完一舱（CCS），30 分钟窗口内浊度降 70%（NSF 50），排班按 3 次周转（FTA）。",
    examples: [
      "对：问周转先问体积、流量计和说明书规定的用户间分钟数",
      "错：循环 30 分钟就等于三次周转、也等于 NSF 认证",
    ],
  },
  {
    id: "KP-WEB-017",
    loc: "§3 臭氧限值与检测",
    title: "臭氧：水中约 0.1 mg/L，空气 OSHA 0.10/0.30 ppm，靛蓝法与空气仪分开测",
    category: "合规与风控",
    tags: ["臭氧", "OSHA", "Annex H", "检测"],
    audience: ["工程实施", "门店运营", "采购"],
    usage: "ops",
    min: 5,
    scenarios: ["开业陪跑", "工程对接", "合规培训", "采购尽调"],
    summary:
      "水中溶解臭氧按 CCS/Annex H/NACCHO 约 0.1 mg/L。空气按 OSHA PEL 0.10 ppm（8 h）和 STEL 0.30 ppm（15 min）。两个 0.1 ppm 不是同一张合格证。水用靛蓝法，气用 OSHA ID-214 或校准电化学仪。",
    body: "水中：\n- CCS-12804 §1.7.1.4.9.2：按 NSF/ANSI 50 Annex H 测，水中臭氧不得超过 0.1 ppm。原文括号写 0.2 mg/m³，那是空气 0.1 ppm 的质量浓度换算，执行时按「水中 0.1 mg/L」+「空气按 OSHA」两套\n- NACCHO 2023：舱液臭氧不宜超过约 0.1 ppm\n- 臭氧是二次处理，与泵联锁，主要在用户之间循环里工作\n\n空气（FTA v3 §4.1.4.5：舱内、舱周、发生器附近）：\n- PEL：0.10 ppm（体积）8 h 时间加权平均，OSHA 29 CFR 1910.1000\n- STEL：0.30 ppm，任意 15 min。员工进舱擦洗看 STEL\n- NSF/ANSI 50-2025 第 28.11 节补了浮舱空气质量试验\n- 发生器选型过大 + 密闭舱 + 通风不足是超标典型组合\n\n检测方法：\n- 水：APHA 4500-O3 B 靛蓝三磺酸盐比色，600 nm；低量程约 0–0.25 mg/L。取样避免曝气逸散。不要用泳池氯试纸凑数\n- 气：OSHA ID-214 紫外光度，或校准过的电化学个人采样器\n- ORP 只作趋势：FTA 称仅过氧化氢时约 300 mV；有臭氧或氯时往往 >650 mV。ORP 不是浮舱卫生法定合格指标\n\n氯溴：EPA 未按浮舱用途注册；高镁溶液里多数余氯试纸不准。过氧化氢作氧化剂上限 100 ppm 是体感微泡，不是毒理上限。\n对外：臭氧按 NSF 50 做产量与关气，水、气分开管。不要讲「臭氧无残留所以不用测」。",
    examples: [
      "对：水用靛蓝法，气用校准仪，两个 0.1 分开记录",
      "错：舱液 0.1 ppm 合格就等于房间空气合格",
    ],
  },
  {
    id: "KP-WEB-018",
    loc: "§4 ASTM F462",
    title: "NSF 50 踏步防滑引用 ASTM F462：皂液 Mark I，SCOF≥0.04，标准已撤回",
    category: "合规与风控",
    tags: ["ASTM F462", "防滑", "NSF50", "踏步"],
    audience: ["工程实施", "采购", "门店运营", "销售团队"],
    usage: "both",
    min: 4,
    scenarios: ["采购尽调", "工程对接", "合规培训"],
    summary:
      "CCS/NSF 50 浮舱条款对进出踏步点名 ASTM F462（或薄膜 D1894）。试验用 NBS–Brungraber Mark I、皂液池，静摩擦系数 ≥0.04。F462 已于 2016 年撤回。不要把嬉水铺面的摆锤 SRV≥40 套到浮舱踏步上。",
    body: "出现位置：CCS-12804 §1.5.3.2（被 NSF/ANSI/CAN 50 第 28 节吸收）。舱内主要用于进出的踏步或落脚面须防滑：ASTM F462 或 ASTM D1894。\n\nF462 怎么测：\n- 标准号 ASTM F462-79，2007 再确认；2016 年撤回，迄今无正式替代件\n- 仪器：NBS–Brungraber Mark I 静摩擦系数仪\n- 试块：历史上指定 Dow Corning Silastic 382 硅橡胶（已停产）\n- 污染物：肥皂水溶液（联邦规格 P-S-624G 或 ASTM D799，二者均已废止）；文献常用约 1:4 肥皂:水\n- 液膜：试块坐在 0.5–1.5 in 深的皂液池里再启动\n- 合格线：静摩擦系数 SCOF ≥ 0.04\n\n限度：\n1 0.04 几乎贴着仪器零点（Mark I 有效零读数约 0.01–0.02）；阈值按 1970 年代「95% 量产浴缸能过」选定，不是按人体步态所需摩擦力\n2 皂液浓度远高于真人洗澡\n3 CPSC 正资助 ASTM F15.03 做 F462+，倾向摆锤 + Slider 55；还不是 CCS 现行引用\n4 NSF/ANSI/CAN 50 第 26 节（互动嬉水铺面）用湿态 SRV/BPN ≥40，是另一套，不要套到浮舱踏步\n\n落地：进出踏步按 F462/D1894；舱外淋浴更衣地面另按地方规范。FTA：浮舱场景最显著伤害风险是滑倒。\n对外可讲：进出踏步按入浴设施防滑规范设计。不要讲「已通过 F462 所以绝对不会滑」。",
    examples: [],
  },
  {
    id: "KP-WEB-019",
    loc: "§5 ASME A112.19.17",
    title: "防卡吸：SVRS 走 A112.19.17 或 F2387，吸入口走 APSP-16，建议双吸口",
    category: "合规与风控",
    tags: ["A112.19.17", "SVRS", "APSP-16", "防卡吸"],
    audience: ["工程实施", "采购", "门店运营"],
    usage: "ops",
    min: 5,
    scenarios: ["采购尽调", "工程对接", "合规培训", "开业陪跑"],
    summary:
      "ASME A112.19.17 管真空释放装置（SVRS）：探测吸入口真空骤升，引入空气或停泵。浮舱若采用 SVRS 须第三方认证。头发缠绕靠 APSP-16 吸入口盖。NSF 50 要求两个或以上吸入口。循环时禁止入舱（吸入口未按清单安装时手册强制写）。",
    body: "ASME A112.19.17-2010 (R2023)：Manufactured Safety Vacuum Release Systems。管 SVRS 器件：探测真空骤升，向泵引入空气和/或切断泵电机。不管头发缠绕、首饰卡入——那些主要靠 APSP-16/PHTA-16 吸入口盖。符合性只表明器件达到本标准；具体管网上的效果由设计负责人验证。\n\nCCS-12804 §1.6.2：使用 SVRS 则须由具备该试验标准 ISO 17025、且作为泳池产品认证机构具备 ISO 17021 的独立第三方，按 A112.19.17 或 ASTM F2387 最新要求认证。\n\nNSF 50 浮舱条款：循环系统两个或以上吸入口。吸入口按 APSP-16 认证，遵守清单上的安装方位、单只或必须成对、所接开孔对应的最大流量。\n\nSVRS 性能意图（公开摘要 + VGBA 实务）：探测模拟人体封堵；在规范时限内卸真空（行业与 VGBA 文件普遍引用 3 秒，具体以试验报告为准）；释放后不得无复位再次吸住；自身故障不得让泵无保护继续吸；安装管长/弯头/泵功率须在制造商边界内。现行文本 2010 版、2023 再确认，未随变频泵更新。CPSC 已指出变频工况可能误判；F2387-21 已补变频，选型要书面确认兼容。\n\n水面紊流取水还要按 APSP-16 做手指/肢体/头发/躯体卡吸，以及 300 lb 垂向载荷。撇渣器喉口须通向大气。双吸入口管路等长等径。\n\n浮舱水深 ≤24 in、用户之间才开泵，不能因此省略合格吸入口。没有 SVRS 时靠双吸口 + APSP-16 盖 + 「循环时禁止入舱」。\n对外：吸入口按 APSP-16，成对布置；若配备真空释放则按 A112.19.17 或 F2387 认证。不要讲「有 SVRS 就不会卡头发」。",
    examples: [
      "对：要第三方 SVRS 报告，并核对泵型是否在覆盖范围内",
      "错：装了真空释放就可以开着泵让人进舱",
    ],
  },
  {
    id: "KP-WEB-020",
    loc: "§6–7 对照与对外红线",
    title: "五问对照一页纸：认证硬杠、门店硬杠、对外不要锁死数字",
    category: "合规与风控",
    tags: ["NSF50", "尽调", "对外口径", "检查单"],
    audience: ["采购", "销售团队", "工程实施", "管理者"],
    usage: "both",
    min: 4,
    scenarios: ["采购尽调", "B端提案", "合规培训", "参观讲解"],
    summary:
      "把 CCS 试验、30 分钟周转、臭氧、F462、A112.19.17 压成尽调对照。浅讲仍用 WEB-004/012；条款号给工程。流量、臭氧残留、认证型号以铭牌、说明书和第三方报告为准。",
    body: "对照：\n1 CCS 测什么：材料 + 内衬力学 + 5 min 周转能力 + Sil-co-sil 70% 浊度 + Annex H 3-log + 3000 h 后再 3-log。门店按铭牌做用户间循环，循环时舱内无人。误读：把 CCS 当卫生局巡检手册。\n2 30 min 周转：NSF 50 是 ≤30 min 内 70% 浊度去除；FTA 是用户间 ≥3 次周转。误读：30 min、5 min、3 次周转是同一个数。\n3 臭氧：水中约 0.1 mg/L（Annex H）；空气 PEL 0.10 / STEL 0.30 ppm；靛蓝法 + 空气仪。误读：水、气两个 0.1 ppm 混用；氯试纸测臭氧。\n4 ASTM F462：踏步 SCOF ≥0.04（皂液、Mark I）；标准 2016 撤回。误读：用嬉水铺面 SRV 40 替代，或夸大 0.04 的人体意义。\n5 A112.19.17：SVRS 第三方认证；吸入口 APSP-16；建议双吸口；循环时禁止入舱（若吸入口未按清单安装）。误读：只装 SVRS、省略篦子；变频泵套用 2010 证书。\n\n对接已批准卡：\n- KP-WEB-004 / KP-COM-017：氯溴不推荐，UV/臭氧主流，约 3-log\n- KP-WEB-012：七项检查单\n- KP-CHAMP-017：公司层工艺（臭氧/紫外/光触媒 + 两段过滤），具体孔径压力时长以型号文件为准\n\n对外可讲：按 NSF / 北美浮舱实务设计与检测。\n不要口头锁死流量、臭氧残留、认证型号。\n不要用「氯会致癌」恐吓。改口：行业标准本来就不靠泳池氯方案。\n全文：docs/漂浮舱卫生安全标准五问.md",
    examples: ["参观顺序：淋浴→舱沿→循环机→流量/消杀记录→吸入口盖"],
  },
];

function build(item) {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    tags: item.tags,
    audience: item.audience,
    prerequisites: item.id === "KP-WEB-013" ? ["KP-WEB-004"] : ["KP-WEB-004", "KP-WEB-013"],
    summary: item.summary,
    body: item.body,
    examples: item.examples || [],
    source: {
      file: sourceFile,
      location: item.loc,
      date: "2026-09-04",
      author: "公开标准摘录 / 知识库整理",
    },
    scenarios: item.scenarios,
    durationMin: item.min,
    version: "1.0",
    status: "approved",
    layer: "commons",
    usage: item.usage,
    createdAt: now,
    updatedAt: now,
    conflictNote:
      "公开标准与行业实务摘录，不是本公司试验或认证证书。具体参数以铭牌、说明书和第三方报告为准。浅讲仍用 WEB-004/012。",
  };
}

const dataDir = path.join(process.cwd(), "data");
const kpPath = path.join(dataDir, "knowledge-points.json");
const sourcesPath = path.join(dataDir, "sources.json");

const existing = JSON.parse(readFileSync(kpPath, "utf-8"));
if (existing.some((p) => p.id === "KP-WEB-013")) {
  console.log("NSF 标准五问已入库，跳过。总数:", existing.length);
  process.exit(0);
}

const points = raw.map(build);
const ids = new Set(existing.map((p) => p.id));
const dup = points.filter((p) => ids.has(p.id));
if (dup.length) {
  console.error("ID 冲突:", dup.map((p) => p.id).join(","));
  process.exit(1);
}

const web004 = existing.find((p) => p.id === "KP-WEB-004");
if (!web004) {
  console.error("缺少 KP-WEB-004，拒绝入库以免拆掉卫生通识主卡。");
  process.exit(1);
}

const merged = [...existing, ...points];
writeFileSync(kpPath, JSON.stringify(merged, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const next = sources.filter((s) => s.id !== sourceId);
next.push({
  id: sourceId,
  filename: sourceFile,
  fileType: "md",
  uploadedAt: now,
  knowledgePointIds: points.map((p) => p.id),
  status: "done",
  splitMode: "claude-agent",
  note: "CCS-12804 / 30min周转 / 臭氧 / F462 / A112.19.17 拆为 8 条通识卡 KP-WEB-013~020。直接批准。不覆盖 WEB-001~012。",
});
writeFileSync(sourcesPath, JSON.stringify(next, null, 2) + "\n");

const usage = { pitch: 0, training: 0, ops: 0, both: 0 };
for (const p of merged) usage[p.usage] = (usage[p.usage] || 0) + 1;

console.log(
  JSON.stringify(
    {
      imported: points.length,
      total: merged.length,
      approved: merged.filter((p) => p.status === "approved").length,
      draft: merged.filter((p) => p.status === "draft").length,
      commons: merged.filter((p) => p.layer === "commons").length,
      company: merged.filter((p) => p.layer === "company").length,
      internalOnly: merged.filter((p) => p.internalOnly === true).length,
      usage,
      web: merged.filter((p) => p.id.startsWith("KP-WEB-")).length,
    },
    null,
    2
  )
);
