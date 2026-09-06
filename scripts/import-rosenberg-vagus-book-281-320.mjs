#!/usr/bin/env node
/**
 * Claude 精细拆分（扫描件 281–320 页）
 *
 * 第二部：基本动作、神经筋膜、火蜥蜴、激痛点、SCM、扭转、自然拉皮，至参考资料开篇
 * 不覆盖 KP-PVB-001~055。步骤不入库为门店 SOP，对接自学手册。
 *
 * 幂等：KP-PVB-056 已存在则跳过。须先有 241–280（KP-PVB-036）。
 * 运行：node scripts/import-rosenberg-vagus-book-281-320.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-06T11:25:00.000Z";
const sourceId = "SRC-PVB-ROSENBERG-281-320";
const sourceFile = "迷走神經的自我檢測與治癒_281-320.pdf";
const handbook = "docs/罗森堡腹侧检验自学流程.md";

const raw = [
  {
    id: "KP-PVB-056",
    loc: "书页 281–320 覆盖范围",
    title: "本批是第二部图解：基本动作、神经筋膜、火蜥蜴、扭转与面部点，318 空白后进入参考资料",
    category: "培训资料",
    layer: "commons",
    tags: ["拆分范围", "第二部", "基本动作", "火蜥蜴", "扭转"],
    audience: ["培训师", "管理者", "销售团队"],
    usage: "training",
    min: 3,
    summary:
      "281–289 基本动作与 C1/C2/椎动脉机制。290–295 神经筋膜放松（单手/双手）。296–301 火蜥蜴半套到跪地全套。302–317 偏头痛激痛点、SCM 俯臥、斜方肌扭转、迎香/攒竹自然拉皮、九头蛇收束。318 空白；319–320 参考资料与注 1–7。",
    body: "步骤不进门店 SOP。基本动作/火蜥蜴/扭转以自学手册为准。本批不覆盖 001~055。",
    examples: [
      "对：第二部是自助图解，门店不代做",
      "错：开舱流程按 281 页给顾客做完一套",
    ],
  },
  {
    id: "KP-PVB-057",
    loc: "p.281–284",
    title: "通识：基本动作目标是社会性参与；点名 C1/C2 与五对颅神经，步骤看手册",
    category: "技术知识",
    layer: "commons",
    tags: ["基本动作", "C1", "C2", "五对颅神经"],
    audience: ["学术", "培训师", "销售团队"],
    usage: "pitch",
    min: 4,
    summary:
      "基本动作被写成增强社会性参与：回复寰椎枢椎位置、增加脑干血流，对腹侧迷走及第 5/7/9/10/11 对有正面功效。易学，不到两分钟。先测左右转头再做再测。仰卧十指扣于枕下，头不动只动眼，等到吞咽、哈欠或叠吸气的叹息。",
    body: "完整步骤、时间上限与停做条件以自学手册为准，本卡不重写长流程。\n对外：这是短的神经定向信号，不是健身拉颈。\n对内：不是开舱模块。\n对接：" + handbook,
    examples: [
      "对：测了做了再测；头不动只动眼",
      "错：漂浮液体在替顾客做基本动作复位颈椎",
    ],
  },
  {
    id: "KP-PVB-058",
    loc: "p.282、285",
    title: "红线：仰卧起步、转头只到不适上限；起身头晕等一到两分钟，不要猛站",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "安全", "头晕", "基本动作"],
    audience: ["培训师", "漂浮师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "前一两次建议仰卧；之后可坐可站。转头只到不适上限。躺完坐起或站起若头晕，作者写成放松后血压一时上不来，等 1–2 分钟让脑血流跟上。最痛头痛、视物旋转、外伤后颈痛立刻停并走医疗。",
    body: "门店不指导顾客在舱里做这套。员工自学同样遵守。\n对接：" + handbook,
    examples: [
      "对：晕了就坐下等，不催着站起来赶下一趟",
      "错：做完立刻转颈椎比赛谁幅度大",
    ],
  },
  {
    id: "KP-PVB-059",
    loc: "p.284、288–289",
    title: "通识：吞咽哈欠叹息是松下来的信号；眼动被写成连着枕下肌",
    category: "技术知识",
    layer: "commons",
    tags: ["吞咽", "哈欠", "叹息", "枕下肌"],
    audience: ["学术", "培训师", "销售团队"],
    usage: "pitch",
    min: 3,
    summary:
      "右视 30–60 秒等到吞咽、哈欠或第二次吸气叠上去的叹息，回中再左视。作者把眼外肌与八块枕下肌写成神经相连，头不动动眼时可在枕缘摸到微小活动。社会性参与被写成依赖 C1/C2 对位，但情绪一变又可立刻掉线。",
    body: "等不到信号也不要硬撑超时，手册有上限。\n对接：KP-PVB-057；" + handbook,
    examples: [
      "对：有效常常是不自觉咽一口或打哈欠",
      "错：没有咽就加大角度按到痛",
    ],
  },
  {
    id: "KP-PVB-060",
    loc: "p.285–287",
    title: "红线：基本动作「几乎一定」复位 C1/C2、一个念头就能错位，不是医学金标准",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "C1", "C2", "念头", "椎动脉"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 4,
    summary:
      "作者写腹侧障碍常伴上颈错位；基本动作几乎一定让 C1/C2 回去。错位被写成压迫椎动脉、减少脑干与枕叶血流。临床观察：一个负面念头就能让 C1/C2 移位。课堂示范用拇指是否水平当错位线索。这是作者机制，不是影像诊断。",
    body: "执行：禁止承诺复位寰枢椎或改善椎动脉。禁止把「想法立刻错位」当恐吓。不扳颈椎。\n对接：KP-PVB-061。",
    examples: [
      "错：国际老师证明想法会把 C1 拧 45 度，漂浮能拧回来",
      "对：这是诊所手感叙事；不当诊断、不扳颈",
    ],
  },
  {
    id: "KP-PVB-061",
    loc: "p.286–288",
    title: "红线：椎动脉软管比喻和 PTSD 额叶血流，不得当漂浮机制广告",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "椎动脉", "PTSD", "枕下肌"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "枕下约十块小肌，八块枕下肌由枕下神经支配。横突孔走椎动脉。作者用弯折软管比喻：对位差则脑干血流差，九头蛇症状起。并引创伤回忆时额叶血流下降。课堂里作者自己掉线，学员用神经筋膜做回来。",
    body: "执行：PTSD 不是适应症。禁止「漂浮给脑干加血」。\n对接：KP-PVB-032、060。",
    examples: [
      "对：肩颈很紧时人会更难进入能交往的档",
      "错：高盐液体在给椎动脉减压治疗 PTSD",
    ],
  },
  {
    id: "KP-PVB-062",
    loc: "p.290–292",
    title: "红线：神经筋膜放松是基本动作的徒手替代，给婴儿和谱系成人；不是门店项目",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "神经筋膜", "SOP", "自闭"],
    audience: ["培训师", "漂浮师", "管理者"],
    usage: "training",
    min: 4,
    summary:
      "基本动作被写成压力和抑郁最重要的技法——此句当红线。神经筋膜放松来自颅荐骨/整骨/罗夫前，作者说早于接触多重迷走。约五分钟内、可自学或由治疗师做；不会说话时（婴儿、儿童、谱系成人）可替代口头指导的基本动作。",
    body: "引用 Porges/Cottingham/Lyon：先让 ANS 进范围，后续手法才更有效。\n执行：禁止当开舱前后手法。禁止把抑郁/自闭写成适应症。步骤见下卡，只留安全原则。\n对接：KP-PVB-049、038。",
    examples: [
      "错：开舱前给顾客做五分钟神经筋膜，治抑郁自闭",
      "对：徒手替代项不是门店 SOP",
    ],
  },
  {
    id: "KP-PVB-063",
    loc: "p.292–296",
    title: "红线：神经筋膜是最轻力、到阻力即停；做完迷走「应该正常」不是验收标准",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "神经筋膜", "轻力", "蜂窝组织"],
    audience: ["培训师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "单手比较枕骨皮肤滑动阻力，向更紧方向极慢滑到第一阻力（常不到 0.3 厘米）停住，等叹息或吞咽。双手版两指反向轻滑。力过大过快会让组织更紧。作者写做完迷走应该正常、转头应该改善。",
    body: "先在自己身上练。这是诊所线索，不是按摩店深按。禁止写成门店 SOP，本卡不列逐步手法当操作单。\n对接：KP-PVB-062。",
    examples: [
      "对：比想象中还轻；顶着干会更紧",
      "错：按到顾客喊痛才叫神经筋膜松了",
    ],
  },
  {
    id: "KP-PVB-064",
    loc: "p.296–298",
    title: "通识：火蜥蜴要头和脊柱当一条；目标是胸廓呼吸，侧弯矫正不是卖点",
    category: "技术知识",
    layer: "commons",
    tags: ["火蜥蜴", "胸廓", "前倾头", "呼吸"],
    audience: ["学术", "培训师", "销售团队"],
    usage: "pitch",
    min: 3,
    summary:
      "火蜥蜴被写成增加胸椎弹性、肋胸关节、气体交换、减轻前倾头，并声称有助于脊椎侧弯。传入纤维约占迷走四倍，呼吸好坏被写成安全信号。火蜥蜴没有独立的脖子，头必须和脊柱一起侧弯，不是单独点头。",
    body: "侧弯、小面关节复位、给椎动脉减压是作者声称，不得当适应症。步骤看手册。\n对接：" + handbook,
    examples: [
      "对：侧弯时不要耸肩去够耳朵，头不要单独点",
      "错：火蜥蜴能治好脊椎侧弯",
    ],
  },
  {
    id: "KP-PVB-065",
    loc: "p.298–301",
    title: "火蜥蜴分半套、反向眼变化式和跪地全套；形态要点进手册，门店不代做",
    category: "培训资料",
    layer: "company",
    tags: ["火蜥蜴", "半套", "全套", "手册"],
    audience: ["培训师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "第一级半套：坐或站，眼向右、耳向右肩 30–60 秒再换边；不要用肩去够耳。变化式眼和侧弯相反。第二级跪地或手撑低桌，头与脊柱平行后再把侧弯做到骶骨。301 收尾换边。",
    body: "头晕、腰痛、腕痛立刻停。不是瑜伽比赛。\n对接：" + handbook,
    examples: [
      "对：一次一侧，回到中间再换",
      "错：给顾客按着头做全套跪地火蜥蜴",
    ],
  },
  {
    id: "KP-PVB-066",
    loc: "p.302–303",
    title: "红线：偏头痛激痛点只轻压活性点；过重会把人推进行交感或背侧",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "激痛点", "偏头痛", "SOP"],
    audience: ["培训师", "漂浮师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "对照附录四张偏头痛图形找 x。点是表层神经密集处，轻压即可；深按整块肌肉被写成不必要且让身体觉得不安全。只做发硬发痛的活性点。小圈等到叹息吞咽，痛或可在数分钟内减轻——此句当红线。",
    body: "偏头痛不是漂浮适应症。禁止门店按图谱做肩颈疗程。突发最痛头痛走急诊。\n对接：KP-PVB-017、018。",
    examples: [
      "错：按附录 x 给顾客揉到不痛，几分钟偏头痛消失",
      "对：自助轻触可以；门店不做；急症走急诊",
    ],
  },
  {
    id: "KP-PVB-067",
    loc: "p.303–304",
    title: "红线：胸锁乳突肌俯臥转头被写成防止偏头痛，不是适应症或开舱操",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "胸锁乳突肌", "偏头痛", "前倾头"],
    audience: ["培训师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "像婴儿撑肘抬头张望：俯臥、肘撑、头向右舒适范围停约 60 秒再向左。声称增大旋转、缓解颈僵、帮助防止偏头痛。",
    body: "颈椎病、眩晕、外伤后不要做。门店不代做。偏头痛不是适应症。\n对接：KP-PVB-066。",
    examples: [
      "错：每天俯臥转头就能防偏头痛，来店里做",
      "对：这是自助选项；病名走医疗",
    ],
  },
  {
    id: "KP-PVB-068",
    loc: "p.305–309",
    title: "红线：斜方肌扭转三高度；首次觉得高了 2–5 厘米不是卖点",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "扭转", "斜方肌", "前倾头"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "抱肘左右转肩带、髋不转：肘在腹前（上斜方）、胸高（中）、尽量高（下），各约三趟，轻、不控制。作者写第一次前倾头的人侧面看可像高了 2–5 厘米。这是刺激协调，不是增肌拉伸比赛。",
    body: "步骤以手册为准。禁止用厘米数做当场增高承诺。\n对接：" + handbook,
    examples: [
      "对：肩带转、髋不转，轻就够",
      "错：扭转一次当场长高五厘米，国际老师验证",
    ],
  },
  {
    id: "KP-PVB-069",
    loc: "p.305",
    title: "红线：颈僵还可被写成肩胛提肌、副神经或裂孔疝/短食道，不是店内复位指征",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "裂孔疝", "肩胛提肌", "副神经"],
    audience: ["培训师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "转头练不够时，作者点名肩胛提肌、第十一对、以及裂孔疝或食道缩短（迷走绕食道）。个案指向书内约第 159 页。疝与短食道不是门店能复位的东西。",
    body: "对接第5章裂孔疝红线。消化症状走消化科。\n对接：KP-PVB-041、083。",
    examples: [
      "错：脖子紧就是胃疝，按肚子就能转头",
      "对：颈肩原因可以有很多条；疝不是开舱适应症",
    ],
  },
  {
    id: "KP-PVB-070",
    loc: "p.309–314",
    title: "红线：四分鐘自然拉皮迎香被写成无副作用变年轻，不是美容项目也不是迷走治疗",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "迎香", "自然拉皮", "面神经"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 4,
    summary:
      "迎香约鼻翼旁 0.3 厘米，大肠经末端。极轻触皮肤→两层面肌→骨膜，等叹息吞咽。声称改善 CN5/7、中脸表情、更会笑、颧骨观感、鼻塞。对比手术疤与肉毒，写没有副作用。",
    body: "执行：禁止美容承诺、禁止「无副作用」。面部感染、近期填充/手术不要按。不是开舱项目。\n对接：KP-PVB-071。",
    examples: [
      "错：按迎香四分鐘拉皮无副作用，比肉毒强",
      "对：轻触面部可以是自学；不是门店美容也不治病",
    ],
  },
  {
    id: "KP-PVB-071",
    loc: "p.315–317",
    title: "红线：攒竹被写成平衡瞪视与无神、干眼与流泪，不是眼科适应症",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "攒竹", "眼轮匝肌", "自然拉皮"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "攒竹在眉头内侧，眼轮匝肌激痛点，也近泪骨。太紧像瞪，太松像无神；并称可平衡眼睛过干或溢泪。泰式按摩把它当美容穴。同样分层轻压等到释放。",
    body: "眼痛、突发视力变化、眼外伤走眼科。禁止把干眼/流泪写成漂浮或穴位疗效。\n对接：KP-PVB-070。",
    examples: [
      "错：攒竹能治干眼和泪溢",
      "对：眼部问题走眼科；轻触不是治疗",
    ],
  },
  {
    id: "KP-PVB-072",
    loc: "p.317",
    title: "红线：斩断九头蛇所有症状只是比喻，不能写成产品保证",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "九头蛇", "腹侧迷走", "承诺"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "第二部收束：自助动作与手法为了离开慢性背侧或交感，进入腹侧。九头蛇代表那一团症状；腹侧被写成斩断所有头。这是隐喻，不是适应症清单，也不是「一舱全好」。",
    body: "对接 KP-PVB-008：禁止把清单当菜单。\n对接：KP-PVB-008、053。",
    examples: [
      "错：只要进腹侧，九头蛇症状全部斩断，我们保证",
      "对：这是比喻；具体不适仍按红旗和转诊",
    ],
  },
  {
    id: "KP-PVB-073",
    loc: "p.319–320",
    title: "参考资料开篇：格洛托夫斯基、罗夫、吉欣颅面手法图谱、第八对管听与平衡",
    category: "培训资料",
    layer: "commons",
    tags: ["参考资料", "吉欣", "罗夫", "听神经"],
    audience: ["学术", "培训师"],
    usage: "training",
    min: 2,
    summary:
      "319 是参考资料分隔页。注 1–7 点名 Grotowski、Ida Rolf、1937 诺贝尔、Alain Gehin 颅面手法图谱、Lawrence & Rosenberg 的 Osteomassage，以及第八对：耳蜗管听、前庭与半规管管平衡。",
    body: "吉欣图谱是手法来源，不是方舟 SOP。第八对本批只出现在注释。\n对接：KP-PVB-074、076。",
    examples: [
      "对：书后注是他的阅读线索",
      "错：吉欣 150 个手法我们照着在舱里做",
    ],
  },
  {
    id: "KP-PVB-074",
    loc: "p.320 注4",
    title: "注四把适度压力写成对机体有益，不能倒过来说压力越大越好",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "压力", "注释"],
    audience: ["培训师", "销售团队"],
    usage: "training",
    min: 2,
    summary:
      "中文夹注把运动训练、断食一类写成可强化肌肉与器官，适度压力有益。这不是让顾客硬扛威胁状态，更不是漂浮适应症理论。",
    body: "对接金发女孩：要的是能恢复的动员，不是关机也不是过载。\n对接：KP-PVB-007。",
    examples: [
      "对：一点挑战可以，长期过载不行",
      "错：压力越大迷走练得越强，来多漂几次",
    ],
  },
  {
    id: "KP-PVB-075",
    loc: "p.281–317 纪律",
    title: "第二部全部动作不是门店 SOP；自闭忧郁偏头痛侧弯仍不是适应症",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "SOP", "适应症", "第二部"],
    audience: ["管理者", "培训师", "销售团队"],
    usage: "training",
    min: 3,
    summary:
      "本批出现的基本动作、神经筋膜、火蜥蜴、激痛点、SCM、扭转、迎香攒竹，一律不写进开舱流程。书里的病名和厘米数、几分钟、无副作用全部停在红线卡。自学走手册。",
    body: "下一包 321–352 是注释、版权页与附录图。\n对接：" + handbook,
    examples: [
      "对：员工想自学看手册；对客不代做、不承诺治病",
      "错：第二部图解复制成门店项目表",
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
        ? "通识层。罗森堡第二部动作目的摘要，不是本公司试验。步骤以自学手册为准，不得当门店 SOP。"
        : "公司口径层。说明第二部手法与厘米/几分钟/无副作用叙事怎么停；禁止写成适应症或开舱模块。",
  };
}

const dataDir = path.join(process.cwd(), "data");
const kpPath = path.join(dataDir, "knowledge-points.json");
const sourcesPath = path.join(dataDir, "sources.json");
const existing = JSON.parse(readFileSync(kpPath, "utf-8"));
if (existing.some((p) => p.id === "KP-PVB-056")) {
  console.log("罗森堡书 281–320 已入库，跳过。总数:", existing.length);
  process.exit(0);
}
if (!existing.some((p) => p.id === "KP-PVB-036")) {
  console.error("请先入库 241–280（KP-PVB-036）。");
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
  note: "扫描件 281–320。第二部图解至参考资料开篇。20 条。动作不入库为门店SOP；C1/C2复位、神经筋膜、侧弯、拉皮无副作用不得外推。",
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
