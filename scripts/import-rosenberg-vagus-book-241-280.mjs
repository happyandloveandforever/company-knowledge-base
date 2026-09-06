#!/usr/bin/env node
/**
 * Claude 精细拆分（扫描件 241–280 页）
 *
 * 第6章收束（忧郁/躁郁/ADHD）+ 第7章泛自闭症障碍 + 第二部开篇（279–280）
 * 不覆盖 KP-PVB-001~035。摘要入库；基本动作只点名对接自学手册；神经筋膜/疝手法不是门店 SOP。
 *
 * 幂等：KP-PVB-036 已存在则跳过。须先有 201–240（KP-PVB-016）。
 * 运行：node scripts/import-rosenberg-vagus-book-241-280.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-06T11:20:00.000Z";
const sourceId = "SRC-PVB-ROSENBERG-241-280";
const sourceFile = "迷走神經的自我檢測與治癒_241-280.pdf";
const handbook = "docs/罗森堡腹侧检验自学流程.md";

const raw = [
  {
    id: "KP-PVB-036",
    loc: "书页 241–280 覆盖范围",
    title: "本批拆完第6章病名专章、第7章泛自闭，第二部从 279 页开篇",
    category: "培训资料",
    layer: "commons",
    tags: ["拆分范围", "第6章", "第7章", "第二部", "自闭症"],
    audience: ["培训师", "销售团队", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "241 续创伤后恢复；242–249 忧郁/躁郁/产后/ADHD 与裂孔疝。250 起第七章泛自闭症障碍：听滤、听音乐计划、扁平后脑、威廉个案。279 第二部「恢复社会性参与功能的运动」开篇，280 是九头蛇日记，动作步骤从 281 页起。",
    body: "本批书页：\n- p.241 创伤后恢复：廉价静心、第二部「几分钟」、神经筋膜、选安全的人\n- p.242–249 忧郁、躁郁、产后、ADHD+裂孔疝\n- p.250–278 第七章泛自闭：定义流行率、ANS 读法、中耳肌、听音乐计划、基本动作/神经筋膜伦理、威廉、儿童徒手安全\n- p.279–280 第二部部题与日记，尚无动作步骤\n\n对接：016~035。基本动作步骤用自学手册。本批不覆盖旧卡。",
    examples: [
      "对：第7章是自闭的生理读法，不是漂浮适应症清单",
      "错：第七章证明舱能治自闭症",
    ],
  },
  {
    id: "KP-PVB-037",
    loc: "p.241",
    title: "红线：第二部被写成几分钟恢复腹侧；神经筋膜是诊所手法不是开舱模块",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "神经筋膜", "几分钟", "共同调节"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "危险无法避免，重点是尽快回到腹侧。静心被写成冥想、祷告、钓鱼、独自安静处。第二部动作被写成可在几分钟内恢复腹侧并重新连上感官。神经筋膜放松是徒手；选治疗师看前后测，不看广告名。共同调节要对方也健康。",
    body: "执行：禁止「几分钟恢复迷走」进话术。神经筋膜不是门店项目。和安全的人在一起可以讲，漂浮不是社交治疗。\n对接：KP-PVB-021、062；" + handbook,
    examples: [
      "错：国际老师几分钟神经筋膜就恢复腹侧，我们漂浮也能",
      "对：那是诊所前后测叙事；手法不是开舱模块",
    ],
  },
  {
    id: "KP-PVB-038",
    loc: "p.242–244",
    title: "红线：忧郁被写成背侧过强；减药只问开药医生，不是漂浮适应症",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "忧郁", "背侧", "抗忧郁药", "JAMA"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 4,
    summary:
      "美加致残、丹麦约8.3%在用抗忧郁药等数字是书内引用。背侧过强时可见无力、难专注、纤维肌痛样慢性痛，常被标成临床忧郁并长期用药。作者支持想停药的人，但必须在原处方医生指导下减停。JAMA：轻中度时药物接近安慰剂。",
    body: "对外：有人把提不起劲理解成还停在关机档，这是地图不是诊断。\n执行：忧郁症不是漂浮适应症。禁止用处方量做恐惧营销。用药增减只问医生。\n对接：KP-PVB-022、033。",
    examples: [
      "错：漂浮能替代抗忧郁药，轻中度本来就是安慰剂",
      "对：减药问医生；我们不治疗忧郁症",
    ],
  },
  {
    id: "KP-PVB-039",
    loc: "p.244–248",
    title: "红线：躁郁被写成交感过强；二十年住院个案与颅荐骨不是疗效证明",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "躁郁", "颅荐骨", "社会性参与"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 4,
    summary:
      "躁期被对应脊髓交感过强，郁期对应退缩。约4%美国人数字是书内引用。作者声明不是精神科医生，却写「建立社会性参与」对含躁郁在内的问题成效极为卓著。约五十岁女性二十年进出疗养院，因听说颅荐骨而来。",
    body: "治疗后被写成能回到社会性参与，作者仍建议心理咨询和关系处理。\n执行：躁郁症不是漂浮适应症。禁止「成效极为卓著」「成功解决神经系统」。颅荐骨不是开舱手法。\n对接：KP-PVB-022、034。",
    examples: [
      "错：国际个案证明漂浮能治二十年躁郁",
      "对：那是诊所故事；精神疾病走专科",
    ],
  },
  {
    id: "KP-PVB-040",
    loc: "p.246–247",
    title: "红线：产后忧郁、剖腹产疤痕、扳 C1–C2 加基本动作，不是月子适应症",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "产后忧郁", "剖腹产", "C1", "基本动作"],
    audience: ["培训师", "管理者", "漂浮师"],
    usage: "training",
    min: 3,
    summary:
      "艰难分娩尤其剖腹产被写成加重产后忧郁：腹壁与子宫瘢痕。作者说自己不够格治精神病，可辅助放松自律神经。一则个案：C1–C2 错位，矫正并教基本动作，一周后精力回来。这是诊所叙事。",
    body: "执行：产后忧郁、剖腹产恢复不是漂浮适应症。禁止店内扳颈椎。孕产与术后窗口走禁忌。基本动作见手册。\n对接：KP-PVB-015；" + handbook,
    examples: [
      "错：剖腹产后来漂一下把颈椎放回去，产后忧郁就好",
      "对：不扳颈椎；产后情绪问题走医疗",
    ],
  },
  {
    id: "KP-PVB-041",
    loc: "p.249",
    title: "红线：五名 ADHD 男孩都有裂孔疝；腹侧状态使问题完全消失不是证据",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "ADHD", "裂孔疝", "内脏手法"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "作者写处理过五名 ADHD 男孩，都有横膈膜裂孔疝。不停动被解释成减轻横膈不适。主张基本动作加疝技法放松食道上三分之一、让胃回去。声称进入腹侧后相关问题通常减轻甚至完全消失。",
    body: "执行：ADHD、裂孔疝不是漂浮适应症。禁止内脏复位当门店 SOP。禁止「完全消失」。\n对接：KP-PVB-012、084。",
    examples: [
      "错：过动都是疝，漂浮加按胃就能消失",
      "对：五例无对照；病名走儿科与消化科",
    ],
  },
  {
    id: "KP-PVB-042",
    loc: "p.250–252",
    title: "通识：第七章泛自闭含自闭与亚斯伯格、不含 ADHD；没有生物学金标准检测",
    category: "技术知识",
    layer: "commons",
    tags: ["泛自闭", "ASD", "亚斯伯格", "流行率"],
    audience: ["学术", "销售团队", "培训师"],
    usage: "pitch",
    min: 3,
    summary:
      "ASD 含自闭、亚斯伯格及其他发展障碍，书明确不包括 ADHD。没有针对这些病变的神经生物学检测，诊断主要靠行为观察。基因与环境都是因素；同卵双胞胎相关高，但具体致病基因与治疗突破仍缺。CDC/ADDM 约每 68 名儿童 1 例等数字是书内引用。",
    body: "终身成本、家庭照护负担是公卫背景，不是产品菜单。\n对外：谱系是光谱，不是一种性格。\n对内：不要用美国成本做恐惧营销。\n对接：KP-PVB-012。",
    examples: [
      "对：目前没有一针确诊自闭的生物学化验，评估靠行为",
      "错：漂浮筛查能查出自闭症",
    ],
  },
  {
    id: "KP-PVB-043",
    loc: "p.251–254",
    title: "通识：谱系行为可被读成战逃与关机振荡；目标被写成回到社会性参与",
    category: "技术知识",
    layer: "commons",
    tags: ["泛自闭", "战逃", "关机", "社会性参与"],
    audience: ["学术", "培训师", "销售团队"],
    usage: "training",
    min: 3,
    summary:
      "作者把部分 ASD 行为写成慢性交感或背侧关机，或两者振荡：先抽离再突然过度活动或攻击。刺激可来自外人看来不合理的危险感。波吉斯理论被写成给不同类型行为一个生理读法。干预目标：腹侧迷走及相关颅神经回到能交往。",
    body: "「让他们不再有特殊需求」是书内强句，当红线，不是产品承诺。\n执行：自闭症不是漂浮适应症。观察状态可以，诊断不可以。\n对接：KP-PVB-033、048。",
    examples: [
      "对：有人看起来抽离，不一定是不感兴趣，可能是关机或听不清",
      "错：漂浮能让谱系儿童不再有特殊需求",
    ],
  },
  {
    id: "KP-PVB-044",
    loc: "p.254–258",
    title: "通识：听得见纯音不等于听得清人话；中耳肌由三叉神经和面神经管",
    category: "技术知识",
    layer: "commons",
    tags: ["中耳", "三叉神经", "面神经", "听神经", "恐声"],
    audience: ["学术", "销售团队", "培训师"],
    usage: "pitch",
    min: 4,
    summary:
      "约60% ASD 儿童有听觉问题。安静测听多测第八对；听懂口语还要第五对（鼓膜张肌）和第七对（镫骨肌）。这两肌滤低频背景、对准人话频段。失常则恐声/听觉过敏，吸尘器车流里堵耳朵。表情平淡被写成 VII 也管脸。",
    body: "11 岁男孩火车经过要堵耳朵。有人很会读唇，看不见脸就沟通不了；有人用自己不停说话掩饰听不清。\n对外：听得见音和听得懂话不是一回事。\n对内：不是开舱听力训练。\n对接：KP-PVB-004、078。",
    examples: [
      "对：标准测听正常，嘈杂里仍可能听不清人话",
      "错：漂浮舱就是中耳肌训练仪",
    ],
  },
  {
    id: "KP-PVB-045",
    loc: "p.259–261",
    title: "红线：听音乐计划五天过滤音乐是波吉斯协议，不是漂浮、不是自闭适应症",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "听音乐计划", "SSP", "过滤音乐"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "波吉斯听音乐计划：连续五天、每天约45分钟听算法处理、加强韵律的音乐。对照被写成只有过滤音乐组听觉敏感下降，并增强心脏腹侧迷走。作者试听几分钟觉得中耳肌在跳。后文注明该协议后来作为 Safe and Sound Protocol 销售。",
    body: "执行：禁止把过滤音乐或 SSP 写成方舟模块。自闭/恐声不是漂浮适应症。\n对接：KP-PVB-078。",
    examples: [
      "错：我们舱里放的音乐就是波吉斯听音乐计划",
      "对：那是独立听力协议；我们不做自闭治疗",
    ],
  },
  {
    id: "KP-PVB-046",
    loc: "p.261–263",
    title: "通识：听滤差会被当成不听话；先触碰再说话，不是先惩罚",
    category: "技术知识",
    layer: "commons",
    tags: ["听滤", "沟通", "照顾者"],
    audience: ["学术", "培训师", "销售团队"],
    usage: "pitch",
    min: 3,
    summary:
      "九岁男孩：母亲在另一间房叫三次不应，认定故意不理并打耳光。作者写成第五、第七对差，无法从噪声里分出家长声音。照顾者策略：先触碰再说话。不执行简单指令时，先怀疑听滤，不预设违抗。",
    body: "转身、去掉读唇再给指令，是非正式检查，不是诊断工具。\n对内：门店不体罚、不把「不理人」直接写成性格。未成年人开舱仍走监护与禁忌。\n对接：KP-PVB-026、044。",
    examples: [
      "对：没回应可能是没从噪声里把你的声音捞出来",
      "错：不听话就丢进舱里关一小时",
    ],
  },
  {
    id: "KP-PVB-047",
    loc: "p.264–266",
    title: "通识：哺乳类中耳骨离开下颌才能听高频人声；女声频段被写成特别重要",
    category: "技术知识",
    layer: "commons",
    tags: ["中耳", "进化", "镫骨肌", "语调"],
    audience: ["学术", "销售团队", "培训师"],
    usage: "pitch",
    min: 3,
    summary:
      "大型爬行动物经颌骨听低频；哺乳类听小骨与下颌分离后能听更高频。锤砧镫来自颌骨。镫骨肌由 VII 支配，帮助滤掉过高过低背景、听清人话细微差别。社交参与正常的人说话有韵律；谱系者常语调平坦，被归因于听不出别人的起伏。",
    body: "这是进化叙事，不是听力科指南。\n对外：人耳默认要在噪声里捞人声。\n不要讲成漂浮改变听骨。\n对接：KP-PVB-044。",
    examples: [
      "对：听人话和听环境轰鸣用的不是同一档滤波",
      "错：漂浮能把镫骨肌练回来",
    ],
  },
  {
    id: "KP-PVB-048",
    loc: "p.267–268",
    title: "红线：作者自己写千万不要说能治好自闭症；医院复评不是漂浮终点",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "自闭症", "基本动作", "神经筋膜"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 4,
    summary:
      "基本动作被写成增加流向脑干（V、VII 起点）的血流、减轻颅底与 C3 张力以改善听觉。神经筋膜放松、生物力学颅骨手法被写成评估第 5/7/9/10/11 对后解除障碍。有人治疗后医院复评「不再有自闭症症状」。作者同时写：不要说自己能治好自闭症，应说帮助改善听觉、同理与沟通。",
    body: "执行：采用他的禁语。禁止复评故事进话术。手法不是门店 SOP。基本动作见手册。\n对接：KP-PVB-043；" + handbook,
    examples: [
      "错：国际老师治好自闭症，医院都改诊断了",
      "对：作者禁止宣称治愈；我们更不能",
    ],
  },
  {
    id: "KP-PVB-049",
    loc: "p.271–273",
    title: "红线：威廉一次神经筋膜后立刻对视单脚站，不是适应症证据",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "威廉", "神经筋膜", "自闭症"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 4,
    summary:
      "学员索尔课后给十七岁弟弟威廉做神经筋膜放松。威廉自婴儿期诊断自闭：不社交、回避对视。一次之后立刻正视、能单脚站；作者认为第一次已解决大部分神经系统问题。后文学历、旅行、棋手、游戏公司音效是功能故事。YouTube 被点名为检索线索，不是证据等级。",
    body: "手法来自 Alain Gehin 生物力学课。细节在第二部，本卡不写步骤。\n执行：禁止单次立刻对视当卖点。自闭症不是漂浮适应症。神经筋膜不是开舱项目。\n对接：KP-PVB-062。",
    examples: [
      "错：一次手法自闭就对视交友上大学，我们漂浮同样",
      "对：无对照个案；门店不做神经筋膜",
    ],
  },
  {
    id: "KP-PVB-050",
    loc: "p.269–270",
    title: "红线：右侧 SCM 与扁平后脑、1–2 分钟变圆，不是门店头型项目",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "扁平后脑", "胸锁乳突肌", "ADHD"],
    audience: ["培训师", "漂浮师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "作者观察右侧 SCM 张力异常与 ADHD、自闭相关，常伴后脑扁平，并引 Pediatrics。浅前线把 SCM 张力接到头型。扁平后脑变圆技法：松过紧一侧 SCM，称约 1–2 分钟后脑更圆。成人也可做。",
    body: "执行：禁止店内拉 SCM 改头型。禁止把扁平后脑当 ADHD/自闭筛查。儿童头型问题走儿科。\n对接：KP-PVB-084。",
    examples: [
      "错：后脑平就是自闭，拉两分钟圆了病就好",
      "对：头型手法不是门店项目；病名走专科",
    ],
  },
  {
    id: "KP-PVB-051",
    loc: "p.273–275",
    title: "红线：谱系儿童徒手要先安全、不强迫躺；门店更不是儿童行为治疗",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "儿童", "安全", "徒手"],
    audience: ["漂浮师", "培训师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "谱系儿童很难长时间躺按摩床，怕医院场景。须等孩子觉得安全：玩具分心、家长陪、可趴姿；表情一有痛苦立刻停。第一次不强迫躺下或做抗拒的接触。面诊前先电话与家长谈，避免当着孩子说「问题」。",
    body: "这是作者诊所纪律，可借「先安全」。门店仍走未成年人禁忌与监护人规则，不做头颈手法疗程。\n对接：KP-PVB-026。",
    examples: [
      "对：不强迫、痛就停、先让人觉得安全",
      "错：孩子不躺就按着做神经筋膜",
    ],
  },
  {
    id: "KP-PVB-052",
    loc: "p.276–278",
    title: "通识：第七章结论是先承认自己不总在腹侧，再学习把人带回能交往",
    category: "技术知识",
    layer: "commons",
    tags: ["泛自闭", "社会性参与", "面神经", "语调"],
    audience: ["学术", "培训师", "销售团队"],
    usage: "training",
    min: 3,
    summary:
      "作者称多重迷走让 ASD 读起来更清楚，核心困难是沟通断裂。改善腹侧尤其 V、VII：听滤、表情、同理。批评只靠邮件简讯以及肉毒/整形把脸弄僵。电话有语调，视频有表情，仍不如面对面。探索「才刚起步」。",
    body: "对外：能看见脸、听见语调，社交才有材料。\n对内：不要把这一章写成方舟治愈自闭。ADHD 与自闭在此并提，仍不是适应症。\n对接：KP-PVB-043、048。",
    examples: [
      "对：先问人还在不在能交往这一档",
      "错：第七章证明漂浮是自闭标准疗法",
    ],
  },
  {
    id: "KP-PVB-053",
    loc: "p.279–280",
    title: "通识：第二部从 279 页开始，目的是从交感或关机回到社会性参与",
    category: "技术知识",
    layer: "commons",
    tags: ["第二部", "社会性参与", "九头蛇", "日记"],
    audience: ["培训师", "销售团队", "学术"],
    usage: "training",
    min: 3,
    summary:
      "279 是部题页：恢复社会性参与功能的运动。280：练习用于从慢性交感或背侧关机转到能交往，也可作日常维护。开始前用九头蛇症状日记记频率与严重度，练后再对照。偏头痛「彻底摆脱」被写成理想，同时说任何改善都好。本页无动作步骤。",
    body: "执行：九头蛇清单仍禁止当适应症表。偏头痛不是漂浮适应症。动作步骤见 281 起与自学手册。\n对接：KP-PVB-008、057。",
    examples: [
      "对：先记基线再练，用同一套再看有没有动",
      "错：对照九头蛇清单销售开舱套餐",
    ],
  },
  {
    id: "KP-PVB-054",
    loc: "p.280",
    title: "红线：用偏头痛是否少吃药当练习终点，不是门店疗效承诺",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "偏头痛", "九头蛇", "日记"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "280 页把偏头痛变少、痛减轻、少吃药写成自评例子，并把彻底摆脱当理想。这是作者给读者的自我监测，不是随机对照，更不是漂浮承诺。",
    body: "执行：禁止「练完少吃药/告别偏头痛」。减药问医生。突发最痛头痛走急诊。\n对接：KP-PVB-018、066。",
    examples: [
      "错：按罗森堡日记练，偏头痛和药都能停",
      "对：日记是自学监测；病和药走医疗",
    ],
  },
  {
    id: "KP-PVB-055",
    loc: "p.279–280 待 281",
    title: "第二部动作从 281 页起；基本动作/火蜥蜴/扭转以自学手册为准，不入库为 SOP",
    category: "培训资料",
    layer: "commons",
    tags: ["第二部", "基本动作", "手册", "SOP"],
    audience: ["培训师", "管理者", "销售团队"],
    usage: "training",
    min: 3,
    summary:
      "281 起才有基本动作、神经筋膜、火蜥蜴等图解。门店不教、不代做。自学用手册：测了做了再测。病名个案到此仍全部不是漂浮适应症。",
    body: "已补第6章病名专章与第7章。下一包 281–352 收第二部与附录。\n对接：" + handbook,
    examples: [
      "对：步骤看手册；本卡只标地图和红线",
      "错：开舱前按第二部给顾客做神经筋膜",
    ],
  },
];

function build(item) {
  const layer = item.layer;
  const usage = item.usage || "pitch";
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    tags: item.tags,
    audience: item.audience,
    prerequisites: [],
    summary: item.summary,
    body: item.body,
    examples: item.examples || [],
    source: {
      file: sourceFile,
      location: item.loc,
      date: "2017/繁中译本",
      author: "Stanley Rosenberg / 史丹利·罗森堡；李宇美 译",
    },
    scenarios:
      usage === "training"
        ? ["销售培训", "合规培训", "学术汇报"]
        : layer === "commons"
          ? ["学术汇报", "医院合作", "销售培训"]
          : ["投资人", "医院合作", "高管汇报", "演讲"],
    durationMin: item.min,
    version: "1.0",
    status: "approved",
    layer,
    usage,
    createdAt: now,
    updatedAt: now,
    conflictNote:
      layer === "commons"
        ? "通识层。罗森堡读本第6章收束与第7章摘要，不是本公司临床试验。书中病名与手法不得外推为漂浮适应症。"
        : "公司口径层。说明忧郁/躁郁/ADHD/自闭与神经筋膜、听音乐计划怎么对接方舟；禁止写成适应症或门店SOP。",
  };
}

const dataDir = path.join(process.cwd(), "data");
const kpPath = path.join(dataDir, "knowledge-points.json");
const sourcesPath = path.join(dataDir, "sources.json");
const existing = JSON.parse(readFileSync(kpPath, "utf-8"));
if (existing.some((p) => p.id === "KP-PVB-036")) {
  console.log("罗森堡书 241–280 已入库，跳过。总数:", existing.length);
  process.exit(0);
}
if (!existing.some((p) => p.id === "KP-PVB-016")) {
  console.error("请先入库 201–240（KP-PVB-016）。");
  process.exit(1);
}

const points = raw.map(build);
const ids = new Set(existing.map((p) => p.id));
const dup = points.filter((p) => ids.has(p.id));
if (dup.length) {
  console.error("ID 冲突:", dup.map((p) => p.id).join(","));
  process.exit(1);
}

const merged = [...existing, ...points];
const p035 = merged.find((p) => p.id === "KP-PVB-035");
if (p035) {
  p035.body =
    "已补（相对 KP-PVB-015）：第5章偏头痛收束、第6章焦虑/回盲瓣/家暴/PTSD 框架。第240页后半与第7章、第二部开篇见 KP-PVB-036 起。\n执行：PTSD 不是漂浮适应症。动作步骤用自学手册，不在总库重写长流程。\n对接：KP-PVB-016、036。";
  p035.examples = [
    "错：解离就是漂浮要的出体体验",
    "对：解离是腹侧掉线；复原与第7章见 036 起；PTSD 不是适应症",
  ];
  p035.updatedAt = now;
  p035.version = "1.1";
}

writeFileSync(kpPath, JSON.stringify(merged, null, 2) + "\n");
const sources = JSON.parse(readFileSync(sourcesPath, "utf-8")).filter((s) => s.id !== sourceId);
sources.push({
  id: sourceId,
  filename: sourceFile,
  fileType: "pdf",
  uploadedAt: now,
  knowledgePointIds: points.map((p) => p.id),
  status: "done",
  splitMode: "claude-agent",
  note: "扫描件 241–280。第6章忧郁/躁郁/ADHD + 第7章泛自闭至第二部开篇。20 条。病名、神经筋膜、听音乐计划、扁平后脑不得外推为漂浮适应症或门店SOP。",
});
writeFileSync(sourcesPath, JSON.stringify(sources, null, 2) + "\n");
console.log(
  JSON.stringify(
    {
      imported: points.length,
      commons: points.filter((p) => p.layer === "commons").length,
      company: points.filter((p) => p.layer === "company").length,
      total: merged.length,
    },
    null,
    2
  )
);
