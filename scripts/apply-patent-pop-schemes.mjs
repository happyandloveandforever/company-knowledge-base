/**
 * 人群舱 / 疗法形态 / 运营：新方案 + 先案入库。
 * 幂等：PAT-MAP-004 已存在则跳过。
 * 运行：node scripts/apply-patent-pop-schemes.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-04T14:00:00.000Z";
const srcFile = "有效技术方案-人群疗法运营";
const author = "人群舱/疗法形态/运营检索 2026-09-04（公开检索，未核验法律状态）";

const dataDir = path.join(process.cwd(), "data");
const patentsPath = path.join(dataDir, "patents.json");
const sourcesPath = path.join(dataDir, "patent-sources.json");

const cards = [
  {
    id: "PAT-MAP-004",
    kind: "roadmap",
    cluster: "cross",
    risk: "critical",
    loc: "有效技术方案.md",
    tags: ["有效方案", "人群舱", "疗法形态", "运营", "推倒重建叙事"],
    techBranch: "有效方案总图",
    title: "有效方案：青少年REST封套拒绝、老年高盐姿态转换、监护空气舱、离舱联锁；运营只写过程就绪",
    summary:
      "给人看的有效方案见 patent-drafts/有效技术方案.md。能写的是四条装置加一条窄运营。同池双人、预约消杀门锁、情绪灯舱、无障碍开门本身不要写。",
    body:
      "源文件：patent-drafts/有效技术方案.md。不是新颖性或创造性最终结论。\n\n有效方案：\n1 青少年占用时硬件拒绝全REST（灯声不能到零、门不能全锁、监护回路必须闭合）。PAT-IDEA-016。\n2 老年舱：高盐中性浮力下座椅卸载，机构在无接触漂浮与离舱反力面之间切换。PAT-IDEA-017。\n3 监护在干燥空气舱，青少年在高盐舱，液不共用，机械通路解除占用锁。PAT-IDEA-018。\n4 离舱前灯亮、底抬、冲洗到温才放锁。PAT-IDEA-019。\n5 运营只写高盐过程向量进窗才就绪，门禁是输出。PAT-IDEA-020。不要报预约软件。\n\n疗法改造：同一套液路，模式令牌互斥切换「全REST / 非REST高盐浸泡」。PAT-IDEA-021。不要写治疗。\n\n不要写：同池双人（PAT-IDEA-022 / US4000749）；预约消杀门锁（PAT-IDEA-023）；情绪灯舱（PAT-IDEA-024）；无障碍开门升降机本身（PAT-IDEA-025）。\n\n第25条、绝对新颖性、去环境测试、组合须协同继续有效。本卡不改工程师没确认过的结构参数。",
    examples: [
      "对：先做青少年封套拒绝和老年姿态转换的样机",
      "错：报一个预约小程序，或把两个人放进同一缸盐液当发明",
    ],
    relatedIds: [
      "PAT-IDEA-016",
      "PAT-IDEA-017",
      "PAT-IDEA-018",
      "PAT-IDEA-019",
      "PAT-IDEA-020",
      "PAT-IDEA-021",
      "PAT-RULE-004",
    ],
  },
  {
    id: "PAT-GAP-003",
    kind: "gap",
    cluster: "cross",
    risk: "critical",
    loc: "有效技术方案 待验证",
    tags: ["对照实验", "人群舱", "样机"],
    techBranch: "对照实验",
    title: "人群舱待验证：封套拒绝离开高盐还成不成立、升底板会不会被盐卡住、监护机械释放会不会变成普通开门",
    summary: "四条有效方案都还没有样机。没有对照不要申报。",
    body:
      "1 去环境：青少年封套在清水浴缸里用同一套凭证逻辑，问题是否还在。若还在，高盐不是必要条件，降级或打掉。\n2 升起底板/转换机构在 22–30% 硫酸镁、34.5–35.5℃ 运行后，结晶是否卡住；与清水对照。\n3 监护机械释放与坐浴一键开门（US11930968）的结构差是否站得住：必须是空气舱到高盐舱的传力，不能是舱内按钮。\n4 离舱三联锁：缺任何一条时老年人仿体在湿盐地面起身的失败率。\n5 问工程师：会不会做两套壳体（青少年/老年）还是一台双模式。\n\n本卡优先于空谈运营系统。",
    examples: [
      "对：清水对照升底板卡滞",
      "错：没做样机就按人群营销口径写独权",
    ],
    relatedIds: ["PAT-MAP-004", "PAT-IDEA-016", "PAT-IDEA-017", "PAT-IDEA-018", "PAT-IDEA-019"],
  },
  {
    id: "PAT-IDEA-016",
    kind: "layout",
    cluster: "6",
    risk: "high",
    loc: "青少年舱",
    tags: ["有效方案", "黄灯", "待验证", "青少年", "REST封套"],
    techBranch: "青少年舱",
    title: "青少年舱：占用凭证拒绝全REST——灯声有下限、门不全锁、监护回路必须闭合（待验证）",
    summary:
      "不是给孩子漂浮减压。装置在青少年凭证下不允许进入经典全剥夺+全闭锁。成人凭证才允许。",
    body:
      "技术问题：高盐浅液里人几乎站不起来（E1+E2），再加全黑全静和门锁（E3+E6），未成年人自救和被监护都难。西澳卫生文件把 16 岁以下列为不适合商业漂浮舱。行业做法是家长在房间里看着——那是运营规则，舱本身仍能进入全REST。\n\n可写的装置轮廓：占用凭证分成人/青少年。青少年：照明和声场有硬件下限，门锁到「可从外机械打开/不能完全闭锁」，监护在位信号必须为真。缺任一条件禁止占用。成人凭证才允许灯声到零和全锁。\n\n去环境测试：拿掉 E3+E6，这就是带家长的浅水池，问题弱。拿掉 E1+E2，人可以站起来走到门边，必要性下降。四条都像在起作用。要对照：同一套逻辑装在普通浴缸上还成不成立。\n\n不要写成：改善注意力或焦虑（第25条）；舱内可选灯和音乐（US20150141741 已写用户可以不要全剥夺）；灯声渐变疗法（US5518497）。\n\n待验证：见 PAT-GAP-003。本卡不给出新颖性或创造性最终结论。",
    examples: [
      "对：青少年凭证下舱进不了全REST",
      "错：独权写成我们为青少年加了星星灯所以更安全",
    ],
    relatedIds: ["PAT-MAP-004", "PAT-PRI-054", "PAT-PRI-055", "PAT-PRI-060", "PAT-IDEA-018", "PAT-RULE-004"],
  },
  {
    id: "PAT-IDEA-017",
    kind: "layout",
    cluster: "1",
    risk: "high",
    loc: "老年舱",
    tags: ["有效方案", "黄灯", "待验证", "老年", "姿态转换"],
    techBranch: "老年舱",
    title: "老年舱：高盐中性浮力下的坐–仰卧转换，不是加扶手（待验证）",
    summary:
      "高盐浅液里人几乎不压座面。老年人要的是占用时不碰机构、离舱时有反力面。无障碍坐凳和升降机本身不要主张。",
    body:
      "技术问题：E2 下座椅当椅子会空。老年人常不能从完全仰卧借力坐起。行业无障碍是坐凳、泳池升降机、开敞池沿侧翻进入——那些在清水或坐浴里成立。\n\n可写的装置轮廓：同一机构占用态退出漂浮包络，离舱态进入可达空间并提供起身反力；或升起底板减小有效水深，使半坐能借力。结构必须按高盐结晶和浅液来做。\n\n去环境测试：拿掉 E2，固定座椅就够，问题消失。E2 是必要条件。E1 加重（结晶卡机构、密度更高更难借力）。\n\n不要写成：ADA 合规、扶手、一键开门（US11930968）、普通泳池升降底板（清水可变水深是已知工程）。\n\n待验证：见 PAT-GAP-003。与 PAT-IDEA-012 同族力学，本卡把使用对象收成老年离舱，是否合并由专家选。本卡不给出新颖性或创造性最终结论。",
    examples: [
      "对：占用不碰、离舱有反力，按高盐结晶来做",
      "错：独权写成我们给老人加了扶手和升降机",
    ],
    relatedIds: ["PAT-MAP-004", "PAT-IDEA-012", "PAT-PRI-064", "PAT-PRI-050"],
  },
  {
    id: "PAT-IDEA-018",
    kind: "layout",
    cluster: "6",
    risk: "high",
    loc: "监护舱",
    tags: ["有效方案", "黄灯", "待验证", "监护", "液压隔离"],
    techBranch: "监护空气舱",
    title: "监护空气舱与高盐舱液压隔离，机械通路解除占用锁（待验证）",
    summary:
      "不是两个人泡在同一缸盐液里。监护人在干舱，青少年在盐舱。液不共用。要有机械解除，不是只靠摄像头。",
    body:
      "技术问题：监护人进盐液就变成同池双人（US4000749 已写一人或多人）。只在房间里站着是运营。需要：看见、够得着解除、自己不进高盐液。\n\n可写的装置轮廓：并排两室，隔墙不漏工作液。高盐室给青少年占用。空气室给监护人。单向光学。一条机械传力从空气室作用到高盐室的占用锁和离舱转换。\n\n去环境测试：拿掉 E1，普通亲子浴缸+观察窗就成立，必要性下降。E1 把「监护人不能进液」变成更硬的约束（盐蚀、密度、卫生）。E6 让机械解除有对象。\n\n不要写成：泳池水下观察窗（US1921230）；实验室观察柜（GB2407048）；摄像头看护。\n\n待验证：见 PAT-GAP-003。可与 PAT-IDEA-016 做成一套。本卡不给出新颖性或创造性最终结论。",
    examples: [
      "对：干舱监护 + 盐舱占用 + 机械解除",
      "错：独权写成亲子一起漂，或装个监控摄像头",
    ],
    relatedIds: ["PAT-MAP-004", "PAT-IDEA-016", "PAT-PRI-053", "PAT-PRI-059"],
  },
  {
    id: "PAT-IDEA-019",
    kind: "layout",
    cluster: "1",
    risk: "high",
    loc: "离舱联锁",
    tags: ["有效方案", "黄灯", "待验证", "老年", "离舱"],
    techBranch: "离舱联锁",
    title: "离舱联锁：照明下限、离舱姿态、冲洗到温都满足才放锁（待验证）",
    summary:
      "占用结束不等于可以开门。高盐地面滑，长时间漂浮后前庭不稳。三条过程条件是输出锁的输入。",
    body:
      "技术问题：E1 结晶地面摩擦系数差，E2+E5 后人体对重力的再适应变慢。直接开门是把人放到最危险的界面上。\n\n可写的装置轮廓：占用结束到放锁之间，照明≥下限、底板/支撑进入离舱态、冲洗水到温。缺一不可。不是预约倒计时结束就开锁。\n\n去环境测试：拿掉 E1，普通湿滑浴室也有跌倒，联锁仍可能成立——要证明高盐使失败率显著更高，否则是通用浴室安全，不立案。\n\n不要写成：温泉盖传感器开始过滤（US10934729）；订单结束开电磁锁（共享浴房/汗蒸）。\n\n待验证：见 PAT-GAP-003。本卡不给出新颖性或创造性最终结论。",
    examples: [
      "对：三条过程条件都真才放锁",
      "错：独权写成预约时间到了就开门",
    ],
    relatedIds: ["PAT-MAP-004", "PAT-IDEA-017", "PAT-PRI-062", "PAT-PRI-061"],
  },
  {
    id: "PAT-IDEA-020",
    kind: "layout",
    cluster: "cross",
    risk: "high",
    loc: "运营过程就绪",
    tags: ["有效方案", "黄灯偏低", "待验证", "运营", "过程就绪"],
    techBranch: "运营过程就绪",
    title: "运营只写高盐过程向量进窗才就绪；预约排班软件不要报（待验证，信心偏低）",
    summary:
      "扫码开门、用完消杀、下一单：现成。还能看的是密度/温度/氧化剂/补盐溶解都进窗，门禁只是输出。",
    body:
      "技术问题：淋浴带进淡水会稀释 22–30% 硫酸镁。补盐溶解慢，时钟到点不等于液体回到工作点。\n\n可写的装置轮廓：就绪判定输入包括密度或电导、温度、水中氧化剂、头空间氧化剂、补盐溶解完成。输出才是允许下一占用。排班软件本身不是发明。\n\n去环境测试：拿掉 E1，就是温泉「水温到了才能用」，US9655810 / US11720085 已覆盖远程温泉控制、盐度测试、清洁周期。必须证明硫酸镁溶解/稀释动力学带来清水温泉没有的就绪约束，否则打掉。\n\n不要写成：景区预约、会员库存、无人健身房。本卡默认作从权。待验证：见 PAT-GAP-003。本卡不给出新颖性或创造性最终结论。",
    examples: [
      "对：过程向量进窗才允许下一占用",
      "错：独权写成我们做了漂浮舱预约小程序",
    ],
    relatedIds: ["PAT-MAP-004", "PAT-PRI-058", "PAT-PRI-061", "PAT-RULE-004"],
  },
  {
    id: "PAT-IDEA-021",
    kind: "layout",
    cluster: "6",
    risk: "high",
    loc: "疗法形态装置化",
    tags: ["有效方案", "黄灯", "待验证", "疗法改造", "模式令牌"],
    techBranch: "疗法形态",
    title: "疗法改造：模式令牌互斥切换全REST与非REST高盐浸泡，不是治疗方法（待验证）",
    summary:
      "不要全员 60 分钟全黑全静。两条物理封套共用液路，一次只能成立一个。不要写治疗、正念、远程心理咨询。",
    body:
      "技术问题：经典 REST 对青少年和许多老年人不是可占用状态。另做一台「有灯的盐池」只是产品 SKU，容易被 US20150141741（可选灯声）和 CN112081420A（情绪沉浸舱）挡住。\n\n可写的装置轮廓：一个模式令牌同时改几何（底板/支撑）、门锁允许范围、刺激封套下限。全REST与非REST高盐浸泡互斥。令牌来自占用凭证，不是来自心率或「情绪识别」（那会撞生理闭环）。\n\n去环境测试：拿掉高盐，这就是灯光房/情绪舱。E1+E2 必须是封套切换的理由（浮力卸载+浅液站不起来），否则第25条和情绪舱前案一起打死。\n\n不要写成：正念训练、心理咨询、改善睡眠。待验证：见 PAT-GAP-003。本卡不给出新颖性或创造性最终结论。",
    examples: [
      "对：一个令牌同时切几何、锁、刺激封套，两种封套互斥",
      "错：独权写成我们发明了青少年漂浮疗法",
    ],
    relatedIds: ["PAT-MAP-004", "PAT-IDEA-016", "PAT-IDEA-017", "PAT-PRI-054", "PAT-PRI-057", "PAT-RULE-004"],
  },
  {
    id: "PAT-IDEA-022",
    kind: "layout",
    cluster: "6",
    risk: "critical",
    loc: "同池双人",
    tags: ["已打掉", "同池双人", "亲子"],
    techBranch: "不要写",
    title: "同池双人 / 亲子共漂：已打掉",
    summary: "1976 年隔离模块已写一人或多人。亲子套池另有中国实用新型。",
    body:
      "打掉原因：US4000749 隔离模块用高密度盐液，帐篷式围护，明确一人或多人。CN204326597U 大池套小浮池给儿童、成人在外看护。商业中心让家长进房间也是公开做法。\n不要投入：情侣舱、亲子同液、加宽缸体当发明。监护应走 PAT-IDEA-018 的液压隔离。",
    examples: ["对：监护人在干舱", "错：把缸加宽让两个人一起躺"],
    relatedIds: ["PAT-PRI-053", "PAT-PRI-056", "PAT-IDEA-018"],
  },
  {
    id: "PAT-IDEA-023",
    kind: "layout",
    cluster: "cross",
    risk: "critical",
    loc: "运营软件",
    tags: ["已打掉", "运营软件", "预约", "消杀门锁"],
    techBranch: "不要写",
    title: "预约排班 + 消杀 + 电磁锁：已打掉独立立案",
    summary: "共享浴房、汗蒸云平台、温泉联网已经覆盖订单、时长、门锁、臭氧、清洁周期。",
    body:
      "打掉原因：CN216866143U 模块化共享浴房（语音/小程序、紫外、喷雾消毒）；公开的智能汗蒸控制系统（云平台订单、时长、臭氧、门锁）；US9655810 温泉无线节点（温度、盐度测试、清洁周期、锁）；US10934729 盖到位启动过滤。中国对纯商业方法+常规物联网组合通常不给发明。\n不要投入：漂浮舱 SaaS、会员库存、扫码开门。窄缝只留 PAT-IDEA-020 的过程就绪，且信心偏低。",
    examples: ["对：过程向量进窗才就绪", "错：报一个预约小程序"],
    relatedIds: ["PAT-PRI-058", "PAT-PRI-061", "PAT-PRI-062", "PAT-IDEA-020"],
  },
  {
    id: "PAT-IDEA-024",
    kind: "layout",
    cluster: "6",
    risk: "critical",
    loc: "情绪灯舱",
    tags: ["已打掉", "情绪舱", "灯声疗法"],
    techBranch: "不要写",
    title: "灯光音乐情绪舱 / 远程心理咨询舱：已打掉",
    summary: "漂浮舱可选灯声、灯声渐变疗法、情绪沉浸舱都已公开。治疗方法本身第25条不授权。",
    body:
      "打掉原因：US20150141741 写明有人不要全剥夺，可装光纤/LED 和扬声器。US5518497 灯声渐入渐出、双耳拍。CN112081420A 密闭情绪沉浸舱：灯、音乐、视频、正念、远程心理咨询。True REST 公开卖感官增强选项。\n不要投入：星空灯、冥想内容库、情绪识别调舱。青少年方案必须是「拒绝全REST」而不是「加内容」。",
    examples: ["对：青少年凭证禁止全REST", "错：独权写成青少年冥想舱"],
    relatedIds: ["PAT-PRI-054", "PAT-PRI-055", "PAT-PRI-057", "PAT-IDEA-016", "PAT-RULE-004"],
  },
  {
    id: "PAT-IDEA-025",
    kind: "layout",
    cluster: "1",
    risk: "critical",
    loc: "无障碍本身",
    tags: ["已打掉", "无障碍", "ADA", "升降机"],
    techBranch: "不要写",
    title: "无障碍坐凳、泳池升降机、向外开门：已打掉独立立案",
    summary: "ADA/坐浴紧急开门/行业公开的开敞池沿侧翻，都不是高盐漂浮的发明点。",
    body:
      "打掉原因：美国无障碍指南要求泳池/水疗有升降机或转移墙；Float Tank Solutions 公开讲 ADA 漂浮房：转身半径、坐浴凳、开敞池沿侧翻。US11930968 无障碍坐浴向外开门+断电释放（库内 PAT-PRI-050）。可变水深泳池是已知工程（PAT-PRI-064）。\n不要投入：宣称「适老」「无障碍」本身。老年方案必须落在高盐浮力卸载后的姿态转换（PAT-IDEA-017）。",
    examples: ["对：浮力卸载下的机构切换", "错：独权写成适老开门和扶手"],
    relatedIds: ["PAT-PRI-050", "PAT-PRI-064", "PAT-IDEA-017"],
  },
  {
    id: "PAT-PRI-053",
    kind: "retrieved",
    cluster: "6",
    risk: "critical",
    loc: "同池多人",
    publicationNo: "US4000749A",
    jurisdiction: "美国",
    techBranch: "隔离模块",
    tags: ["已核验公开文本", "多人", "高密度盐液"],
    title: "1976 年隔离模块已用高密度盐液，明确一人或多人同时占用",
    summary: "同池双人、情侣舱、亲子共液被这条直接挡住。",
    body:
      "US4000749 Isolation module。充气围护 + 底部高密度液体（写明硫酸镁或氯化钠）形成漂浮池，恒温、供气、净化。围护尺寸写明一人或多人。人躺着液面过耳、口鼻露出。\n对我们的限制：把缸加宽让两个人漂，不是发明。监护必须离开工作液。法律状态待核验，公开文本已构成现有技术。",
    relatedIds: ["PAT-IDEA-022", "PAT-IDEA-018"],
  },
  {
    id: "PAT-PRI-054",
    kind: "retrieved",
    cluster: "6",
    risk: "critical",
    loc: "可选灯声",
    publicationNo: "US20150141741A1",
    jurisdiction: "美国",
    techBranch: "治疗用隔离舱",
    tags: ["已核验公开文本", "可选灯声", "非全剥夺"],
    title: "治疗用隔离舱已写：有人不要全剥夺，可装灯和扬声器",
    summary: "「给青少年开着灯漂」本身不是发明。有效方案必须是凭证拒绝全REST，不是加灯。",
    body:
      "US20150141741 Therapeutic isolation tank。硫酸镁漂浮。写明主要用于隔离刺激，也理解有人想漂但不做全剥夺；可在舱内装光纤/LED 和扬声器。分体轻量化壳体。\n对我们的限制：可选灯声、可选不全黑，已在漂浮舱本领域公开。True REST 也公开卖感官增强。青少年方案不能落在「有灯」。法律状态待核验。",
    relatedIds: ["PAT-IDEA-016", "PAT-IDEA-024", "PAT-IDEA-021"],
  },
  {
    id: "PAT-PRI-055",
    kind: "retrieved",
    cluster: "6",
    risk: "critical",
    loc: "灯声渐变",
    publicationNo: "US5518497A",
    jurisdiction: "美国",
    techBranch: "营养性反应系统",
    tags: ["已核验公开文本", "灯声渐入渐出", "双耳拍"],
    title: "灯声渐入渐出和双耳拍已作为放松装置公开，不能当漂浮疗法发明",
    summary: "入舱出舱把灯慢慢亮、把声音慢慢关，前人已经写过。",
    body:
      "US5518497 Trophotropic response system。控制模块给出视觉信号和带海洋声+双耳拍的听觉信号，可渐入渐出，而不是突然开关。\n对我们的限制：渐亮渐暗、渐强渐弱不是漂浮舱新点。离舱联锁必须绑照明下限+姿态+冲洗，不能只写淡入。法律状态待核验。",
    relatedIds: ["PAT-IDEA-024", "PAT-IDEA-019"],
  },
  {
    id: "PAT-PRI-056",
    kind: "retrieved",
    cluster: "1",
    risk: "high",
    loc: "亲子套池",
    publicationNo: "CN204326597U",
    jurisdiction: "中国",
    techBranch: "儿童浮池",
    tags: ["实用新型", "亲子", "套池"],
    title: "可移动大池里套儿童浮池、成人在外看护，已是中国实用新型",
    summary: "亲子水上结构不要当漂浮舱发明。",
    body:
      "CN204326597U 浮动泳池中的池。大储水腔里再放带浮体的儿童池，壁面透水，儿童在内、成人在外看护，有抓手和垫高底。\n对我们的限制：大套小、成人看护儿童戏水，已公开。不是高盐 REST 舱。法律状态待核验。",
    relatedIds: ["PAT-IDEA-022"],
  },
  {
    id: "PAT-PRI-057",
    kind: "retrieved",
    cluster: "6",
    risk: "critical",
    loc: "情绪沉浸舱",
    publicationNo: "CN112081420A",
    jurisdiction: "中国",
    techBranch: "情绪沉浸舱",
    tags: ["已核验公开文本", "灯音乐视频", "心理咨询", "正念"],
    title: "多功能情绪沉浸舱已写灯、音乐、视频、正念和远程心理咨询",
    summary: "干燥情绪舱当「疗法改造」会被这条挡住。疗法改造必须绑高盐封套，且不能写治疗。",
    body:
      "CN112081420A 多功能情绪沉浸舱。密闭舱、座椅、空调、氛围灯和音响，主控选正念/冥想，还可远程心理咨询。\n对我们的限制：密闭舱里调灯和内容、心理咨询，已公开。第25条再挡治疗方法。法律状态待核验。",
    relatedIds: ["PAT-IDEA-024", "PAT-IDEA-021", "PAT-RULE-004"],
  },
  {
    id: "PAT-PRI-058",
    kind: "retrieved",
    cluster: "cross",
    risk: "critical",
    loc: "温泉联网",
    publicationNo: "US9655810B2 / US11720085B2（合并卡）",
    jurisdiction: "美国",
    techBranch: "温泉/泳池远程控制",
    tags: ["已核验公开文本", "远程控制", "盐度", "清洁周期"],
    title: "温泉联网已覆盖远程温度、盐度测试、清洁周期和设备联锁",
    summary: "漂浮舱物联网总控、远程准备、盐度显示，不能当发明。",
    body:
      "US9655810B2：无线温泉节点，温度设定、水处理参数、盐度测试、清洁周期、按键锁。US11720085B2：泳池/温泉设备联网监测与控制，泵、加热、加氯、传感器联锁。\n对我们的限制：App 看舱、远程加热、测盐、排清洁，温泉领域已公开。运营专利只可能落在硫酸镁过程就绪的窄缝。法律状态待核验。",
    relatedIds: ["PAT-IDEA-023", "PAT-IDEA-020"],
  },
  {
    id: "PAT-PRI-059",
    kind: "retrieved",
    cluster: "6",
    risk: "high",
    loc: "观察窗",
    publicationNo: "US1921230A",
    jurisdiction: "美国",
    techBranch: "泳池观察窗",
    tags: ["已核验公开文本", "水下观察", "救生"],
    title: "泳池水下观察窗让救生员从隔舱看水下，观察本身不是发明",
    summary: "监护方案不能只主张「开一扇窗」。必须液压隔离加机械解除。",
    body:
      "US1921230 Observation port。泳池边界内、水面以下的隔舱，墙上透明观察口，救生员看水下。\n对我们的限制：隔墙观察是 1933 年的泳池技术。PAT-IDEA-018 若只写单向玻璃，创造性不足。法律状态待核验。",
    relatedIds: ["PAT-IDEA-018"],
  },
  {
    id: "PAT-PRI-060",
    kind: "retrieved",
    cluster: "6",
    risk: "critical",
    loc: "西澳漂浮舱指引",
    publicationNo: "WA Health Floatation tanks 指引 / WA DOH Special Use Pools 333-219（非专利公开，合并卡）",
    jurisdiction: "澳大利亚/美国州卫生文件（非专利公开）",
    techBranch: "漂浮舱卫生与准入",
    tags: ["非专利公开", "16岁以下不适合", "单人占用", "占用时停循环"],
    title: "卫生文件已写：16岁以下不适合；同时只许一人；占用时循环必须停",
    summary: "青少年能不能进舱、能不能双人、占用时能不能开泵，先看这些公开规则，不要当成我们的发现。",
    body:
      "西澳 HealthyWA：漂浮舱不适合 16 岁以下及若干医学情况；行业惯例 16 岁以上。华盛顿州特殊用途池指引：同时只许一人，因为占用时不连续循环；占用时循环必须关，防卡吸；还要有屏障或方案防止无人看管的儿童进舱溺水。\n对我们的限制：「我们发现儿童不能全隔离」不是发明。装置要解决的是：规则要求单人+停泵+防儿童误入之后，合法青少年占用怎么做。循环占用时停泵是强制安全，不能当独权。",
    relatedIds: ["PAT-IDEA-016", "PAT-IDEA-022", "PAT-PRI-041"],
  },
  {
    id: "PAT-PRI-061",
    kind: "retrieved",
    cluster: "cross",
    risk: "critical",
    loc: "共享浴房",
    publicationNo: "CN216866143U / 公开汗蒸云控制（合并卡）",
    jurisdiction: "中国",
    techBranch: "共享卫浴运营",
    tags: ["实用新型", "共享浴房", "小程序", "消毒"],
    title: "共享浴房和小程序/语音控制、紫外与喷雾消毒已公开；汗蒸云平台已做订单时长门锁臭氧",
    summary: "漂浮店无人值守运营套件不要当发明。",
    body:
      "CN216866143U 智能模块化共享浴房：壁板模块、语音/小程序控制淋浴、紫外消毒灯、喷雾消毒、观察窗。公开文本「一种智能汗蒸控制系统」：云平台授权与订单时长、设备状态、蓝牙开关、温度、时长、灯光、负离子和臭氧、呼叫。\n对我们的限制：订单驱动的舱状态机+消毒+门锁，邻域已公开。法律状态待核验。",
    relatedIds: ["PAT-IDEA-023", "PAT-IDEA-020"],
  },
  {
    id: "PAT-PRI-062",
    kind: "retrieved",
    cluster: "cross",
    risk: "high",
    loc: "温泉盖传感",
    publicationNo: "US10934729B2",
    jurisdiction: "美国",
    techBranch: "占用检测启动过滤",
    tags: ["已核验公开文本", "盖传感器", "过滤周期", "人体负荷"],
    title: "温泉盖传感器已用开盖启动设定、关盖启动过滤，并按使用时长和人体负荷算清洁",
    summary: "「有人用过再清洗」不是发明。离舱联锁不能只写盖或门的开关。",
    body:
      "US10934729 Spa cover with sensor。盖打开启动欢迎/温度/灯光/喷流；盖关闭启动节能和过滤。还写按使用时间和人体负荷计算过滤周期。\n对我们的限制：占用检测→清洁周期是温泉常规。PAT-IDEA-019 必须是照明+姿态+冲洗到温的联锁，不能只是门磁。法律状态待核验。",
    relatedIds: ["PAT-IDEA-019", "PAT-IDEA-023"],
  },
  {
    id: "PAT-PRI-063",
    kind: "retrieved",
    cluster: "1",
    risk: "low",
    loc: "外观",
    publicationNo: "USD936851S1",
    jurisdiction: "美国",
    techBranch: "漂浮舱外观",
    tags: ["外观设计", "True REST", "不挡发明结构"],
    title: "True REST 漂浮荚是外观设计，挡外形模仿，不挡内部机构和控制逻辑",
    summary: "不要抄那颗豆形外壳。它不是发明专利，也不覆盖人群封套。",
    body:
      "USD936851 Float pod，True Rest Franchising。只保护所示外形。公开商业还卖感官增强选项。\n对我们的限制：外观不要撞。人群舱、监护舱、模式令牌不在此外观范围内。法律状态按外观专利期间计算，待核验。",
    relatedIds: ["PAT-MAP-004"],
  },
  {
    id: "PAT-PRI-064",
    kind: "retrieved",
    cluster: "1",
    risk: "critical",
    loc: "可变水深",
    publicationNo: "可变水深泳池/水疗升降底板（已知工程，非单号）",
    jurisdiction: "国际工程公知 + 多辖区专利族（非专利公开为主）",
    techBranch: "升降池底",
    tags: ["非专利公开", "可变水深", "升降底板", "清水工况"],
    title: "泳池和水疗的升降底板、可变水深是已知工程，不能主张「底板会升」",
    summary: "老年方案不能写成可变水深本身。必须写高盐结晶浅液里这套机构还能不能动。",
    body:
      "竞赛池、康复池普遍采用可升降池底调节水深；无障碍水疗用升降机把人放入水中。具体专利族很多，作为公知工程手段引用。\n对我们的限制：升起底板改变水深，清水领域已有。PAT-IDEA-017 只可能落在：中性浮力占用时机构必须退出包络，以及 22–30% 硫酸镁结晶后仍能切换。没有这两点就打掉。",
    relatedIds: ["PAT-IDEA-017", "PAT-IDEA-025", "PAT-IDEA-012"],
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
if (patents.some((p) => p.id === "PAT-MAP-004")) {
  console.log("人群舱/疗法/运营方案已入库，跳过。总数:", patents.length);
  process.exit(0);
}

const built = cards.map((c) => card(c, null));
const idsNew = built.map((c) => c.id);
const clash = idsNew.filter((id) => patents.some((p) => p.id === id));
if (clash.length) {
  console.error("与已有 id 冲突，已中止", clash);
  process.exit(1);
}

const out = [...patents, ...built];
const ids = out.map((p) => p.id);
if (ids.length !== new Set(ids).size) {
  console.error("出现重复 id，已中止");
  process.exit(1);
}

writeFileSync(patentsPath, JSON.stringify(out, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const srcId = "SRC-PAT-POP-SCHEMES";
const next = sources.filter((s) => s.id !== srcId);
next.push({
  id: srcId,
  filename: srcFile,
  cluster: "cross",
  fileType: "other",
  uploadedAt: now,
  patentIds: idsNew,
  status: "done",
  splitMode: "claude-agent",
  note: "人群舱/疗法形态/运营：有效方案四条+窄运营；同池双人/预约门锁/情绪舱/无障碍本身打掉；先案 PAT-PRI-053～064。",
});
writeFileSync(sourcesPath, JSON.stringify(next, null, 2) + "\n");

console.log(JSON.stringify({ inserted: idsNew, total: out.length }, null, 2));
