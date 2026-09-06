/**
 * Claude 精细拆分（扫描件 121–160 页）
 *
 * 迷走神經的自我檢測與治癒 第3章收束 + 第4章检测 + 第5章开头
 * 不覆盖 KP-PVB-001~060。摘要入库，不复述原文长段；检测只留启发式，不作门店 SOP。
 *
 * 幂等：KP-PVB-061 已存在则跳过。
 * 运行：node scripts/import-rosenberg-vagus-book-121-160.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-06T04:20:00.000Z";
const sourceId = "SRC-PVB-ROSENBERG-121-160";
const sourceFile = "迷走神經的自我檢測與治癒_121-160.pdf";

const raw = [
  {
    id: "KP-PVB-061",
    loc: "书页 121–160 覆盖范围",
    title: "本批收束第3章、拆完第4章检测启发式，第5章只开到 COPD 个案",
    category: "培训资料",
    layer: "commons",
    tags: ["拆分范围", "第4章", "检测", "待续"],
    audience: ["培训师", "销售团队", "管理者"],
    usage: "training",
    min: 3,
    summary:
      "121 页收束「感受身体」；122–150 是第4章：看脸、HRV、吸呼脉搏、咽部发啊、不碰触检测预告；151–160 第5章开头：对症医学批评 + COPD/裂孔疝个案。基本动作步骤仍没有。",
    body: "本批书页：\n- p.121 第3章收：手放着让人感受，帮助解离者回到身体\n- p.122–125 看脸评估腹侧\n- p.126–142 其他检测：HRV、Traube-Hering-Mayer、骨盆上提研究\n- p.143–150 咽部分支发啊观察；85 人个案；基本动作预告\n- p.151–160 第5章：新医疗思维、COPD 70%→102% 叙事\n\n仍未到：第5章后半病谱、第二部动作图解。\n对接：前 120 页用 KP-PVB-001~060。本批不覆盖旧卡。",
    examples: [],
  },
  {
    id: "KP-PVB-062",
    loc: "p.121",
    title: "观察：解离时先让人感觉到自己的身体；手只是锚，不是按摩复位",
    category: "技术知识",
    layer: "commons",
    tags: ["解离", "身体感受", "腹侧迷走", "神经觉"],
    audience: ["培训师", "漂浮师", "学术"],
    usage: "both",
    min: 3,
    summary:
      "对退缩和解离，作者把手放在同一处皮肤上，不揉、不搬脊椎，只请对方「感受我的手」。乱念头清空后才能感到身体。时刻感受身体、脚在当下，有助于停在腹侧档，少被情绪带去神经觉失灵。",
    body: "这是注意练习，不是手法疗程。作者自己也练感受手或脚。\n对漂浮：出舱后能感到皮肤、呼吸、脚，比「睡死了」更接近腹侧。禁止把失重讲成解离治疗。\n对接：KP-PVB-059。",
    examples: [
      "对：人还飘着，先让他感到毛巾或地面，再聊天",
      "错：我们用手把迷走神经按回去了",
    ],
  },
  {
    id: "KP-PVB-063",
    loc: "p.122–124",
    title: "观察：腹侧在不在线，先看眼睛和耳朵能不能社交——中脸有没有流动",
    category: "技术知识",
    layer: "commons",
    tags: ["面部观察", "社会性参与", "微表情", "腹侧迷走"],
    audience: ["培训师", "漂浮师", "销售团队", "学术"],
    usage: "both",
    min: 4,
    summary:
      "波吉斯把社交能力落在「看」和「听」。能对视、能听懂，中脸（下眼睑到上唇）有自发微表情，比挤笑更说明腹侧在线。眼轮匝肌像快门：眯眼减光、睁大增感官，还连着听。",
    body: "自发表情按持续时间三档：\n- 脸上常年挂着的紧张纹=慢性情绪底色\n- 持续一阵的心情脸\n- 眼嘴之间一秒内闪几次的微流动：婴儿明显；成人出现时，书当作坦诚、无恐惧\n拍照假笑是另一回事。\n现场禁止诊断面神经损伤。\n对接：KP-PVB-029。",
    examples: [
      "对：能挤笑但眼嘴之间是死的，先当防卫未解除",
      "错：我已经用中脸测出你的腹侧断裂",
    ],
  },
  {
    id: "KP-PVB-064",
    loc: "p.125",
    title: "观察：三档回路会写在脸上和呼吸上——瞪、躲、低头叹气不是性格标签",
    category: "技术知识",
    layer: "commons",
    tags: ["观察", "交感", "冻结", "背侧迷走"],
    audience: ["培训师", "漂浮师", "销售团队"],
    usage: "both",
    min: 4,
    summary:
      "腹侧：脸有流动、声音有韵律。交感压力：对视像威胁、爱打断、听不懂要澄清。恐惧冻结：躲开目光、呼吸只到上胸、吸完憋着。背侧关机：头低、脸平、动作慢、开口前常叹气。行为被回路推着，不是固定人设。",
    body: "启发式，不是精神科检查。出舱对照这四档，决定要降刺激还是允许社交，不要给人贴「抑郁体质」。\n对接：KP-PVB-050。",
    examples: ["错：他爱叹气所以我们治好了他的背侧"],
  },
  {
    id: "KP-PVB-065",
    loc: "p.126、p.131",
    title: "纪律：先测再做再测；旧减压课往往不测生理，把关机当成放松",
    category: "技术知识",
    layer: "commons",
    tags: ["检测", "基本动作", "证据", "通识"],
    audience: ["培训师", "学术", "销售团队"],
    usage: "training",
    min: 4,
    summary:
      "作者诊所每次前后都测腹侧。有九头蛇症状且腹侧检测差，才预期第二部动作会帮上忙。早期颅荐骨老师只教固定流程、不测生理。旧模型只有压力/放松，把解离关机误认成放松。离店时应平静但清醒，不是软到要路边停车睡觉。",
    body: "发啊看咽、吸呼对脉搏，是他用的量尺。太松、面无光、像解离，不是疗程成功。\n对漂浮：体验「很飘」要和「能对视、能走路」分开写。禁止承诺测完迷走再开舱。\n对接：KP-PVB-054。",
    examples: [
      "对：出舱能对话、能站稳，比睡死更接近社交档",
      "错：客人开不了车回家说明迷走激活很深",
    ],
  },
  {
    id: "KP-PVB-066",
    loc: "p.127–129",
    title: "红线：HRV 高低相关一长串病名，禁止写成漂浮筛查或适应症",
    category: "合规与风控",
    layer: "company",
    tags: ["HRV", "红线", "COPD", "适应症不外推"],
    audience: ["销售团队", "培训师", "管理者", "学术"],
    usage: "training",
    min: 5,
    summary:
      "第4章把高 HRV 写成腹侧好、寿命相关；低 HRV 连到时间压力、PTSD、焦虑、ADHD 冲动、肥胖糖尿病、神经病变、SIDS/早产存活、冠心病、心梗、女性和男性性功能、COPD 膈肌不动。那是文献与作者诊所口径，不是门店检测包。",
    body: "作者还问：若心理问题根在自律状态，要不要先改善 HRV/腹侧，再上谈话或处方药。这是研究问题，不是我们的医疗主张。\n执行：禁止 HRV 手环=罗森堡检测；禁止漂浮防癌、治 COPD、治 ADHD。\n对接：KP-PVB-044、051。",
    examples: [
      "对：实验室用 HRV 看迷走张力，和漂浮不是同一套试验",
      "错：舱内 HRV 升了就说明治好了慢阻肺",
    ],
  },
  {
    id: "KP-PVB-067",
    loc: "p.133",
    title: "通识：吸气脉搏较快、呼气较慢，差距越大书当作腹侧越好",
    category: "技术知识",
    layer: "commons",
    tags: ["脉搏", "呼吸", "Traube-Hering-Mayer", "腹侧迷走"],
    audience: ["学术", "培训师", "合作医院"],
    usage: "pitch",
    min: 3,
    summary:
      "1980 年代初作者从 Rolfing 老师处学到：摸腕脉同时看呼吸。吸快呼慢=腹侧尚可，差距越大越好。科学名字指向 Traube-Hering-Mayer 波。当时靠指感，没有仪器。谱系：那些老师是 Levine 的学生，Levine 受波吉斯影响。",
    body: "这是启发式，不是心内科报告。吸呼之间脉搏完全不变，前面已当弹性不足（KP-PVB-043）。\n门店不要上手摸客人脉搏当迷走检测。\n对接：KP-PVB-043。",
    examples: [],
  },
  {
    id: "KP-PVB-068",
    loc: "p.132–137",
    title: "红线：气喘一次手法消失、听音乐计划改善自闭，都是作者叙事，不是漂浮证据",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "气喘", "自闭", "听音乐计划"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 4,
    summary:
      "作者 1980 年代观察气喘与迷走障碍同现，一次手法后功能与症状「消失」，2002 想做成研究，经 Jim Oschman 认识波吉斯。波吉斯放了听音乐计划（特殊耳机、五日、每日 45 分钟）影片：过敏听和社交改善。作者于是把课题从气喘改成颅荐骨+五对社交神经，并开始做自闭。",
    body: "听音乐计划是波吉斯的听觉干预，不是漂浮隔声。颅荐骨改善自闭是作者信念。\n禁止：漂浮=听音乐计划；一次开舱气喘消失；我们治自闭。\n对接：KP-PVB-016、023。",
    examples: ["错：国际迷走权威用舱治好了自闭和气喘"],
  },
  {
    id: "KP-PVB-069",
    loc: "p.138–139",
    title: "通识：筋膜手法做不动，往往是腹侧没在线上，不是手法不够狠",
    category: "技术知识",
    layer: "commons",
    tags: ["肌筋膜", "腹侧迷走", "咽部分支", "通识"],
    audience: ["学术", "培训师", "销售团队"],
    usage: "pitch",
    min: 3,
    summary:
      "肌筋膜放松反复无效，作者改问腹侧在不在。咽部分支功能检测成了他看慢背痛或复杂症状的第一步。腹侧差，疗效留不住；恢复后，工作、家人、人际关系也会一起变——这是诊所观察。老师、教练、家长也可先看社交能力，再砸高等教育资源。",
    body: "对漂浮：环境再好，人若停在压力或退缩档，体验和「疗效」都会短。不要承诺手法或漂浮能永久改掉腹侧。\n基本动作「做一两次咽部反应就正常」仍无步骤，见第二部。\n对接：KP-PVB-007。",
    examples: [],
  },
  {
    id: "KP-PVB-070",
    loc: "p.140–142",
    title: "通识：1988 骨盆上提研究——同样手法，HRV 低的人会更僵更怒；预测因子是状态不是年龄",
    category: "技术知识",
    layer: "commons",
    tags: ["HRV", "Rolfing", "骨盆上提", "证据"],
    audience: ["学术", "合作医院", "培训师"],
    usage: "pitch",
    min: 4,
    summary:
      "Cottingham、Lyon 与波吉斯 1988 年在 Physical Therapy：Rolfing 结束时的骨盆上提。年轻男性弯腰变好、心情变好；年长组更僵、心情更差、有人发怒。测 HRV 后发现：成功与自律状态相关，强于与年龄相关。年轻组 HRV 往往更高。",
    body: "研究含义：先问神经系统在哪一档，再决定动手。仪器适合科研；作者后来说临床有更便宜的观察法。\n本库不收录骨盆上提操作步骤，也不把它写成漂浮收尾动作。\n对接：KP-PVB-065。",
    examples: [
      "对：同一套放松手法，人若在防卫档可能更烦更硬",
      "错：漂浮结束时给我们做一次骨盆上提就能对齐迷走",
    ],
  },
  {
    id: "KP-PVB-071",
    loc: "p.143–146",
    title: "观察：发短促的「啊」时软腭两侧是否对称上提——咽部分支的启发式，不是神经科检查",
    category: "技术知识",
    layer: "commons",
    tags: ["咽部分支", "悬雍垂", "软腭举肌", "检测"],
    audience: ["培训师", "学术", "合作医院"],
    usage: "training",
    min: 4,
    summary:
      "腹侧咽支管软腭和咽，主吞咽和发声。盖伦从角斗士失声和猪实验连到这条神经。作者和盖恩都看咽后壁。发短「啊、啊、啊」（不要拖长）时，两侧弓应对称快提；一侧不动，书当作该侧腹侧咽支没送到软腭举肌。",
    body: "还连耳咽管：吞咽时可能耳内「噗」一声。膈肌功能作者认为会跟着咽支改善。\n执行：\n- 可作培训观察，禁止门店当「迷走检测套餐」\n- 禁止下手压舌、探喉，有呕吐反射和感染风险\n- 幼儿、自闭者可能不配合，书后文另有不碰触法\n对接：KP-PVB-031。",
    examples: ["错：请张嘴，我们免费测迷走神经"],
  },
  {
    id: "KP-PVB-072",
    loc: "p.147–148",
    title: "通识：心理学家不能碰患者，所以需要不碰触的腹侧观察；斜方肌挤压细节在第5章",
    category: "技术知识",
    layer: "commons",
    tags: ["不碰触检测", "波吉斯", "斜方肌", "通识"],
    audience: ["培训师", "学术", "销售团队"],
    usage: "training",
    min: 3,
    summary:
      "2008 年圣塔菲，作者与波吉斯给心理师和身体治疗师办工作坊。美国多州心理师一碰患者就可能丢执照。儿童和触觉敏感的自闭者也不适合上手。书把「不碰触测腹侧」放到第5章；斜方肌挤压测试点到名，本批无步骤。",
    body: "心理师也可在谈话前后看发啊时的咽，当作社交能力有没有生理变化。\n对漂浮：我们本来就少上手，不等于已经在做罗森堡不碰触检测。\n对接：KP-PVB-032 副神经/斜方肌。",
    examples: [],
  },
  {
    id: "KP-PVB-073",
    loc: "p.149–150",
    title: "红线：工作坊几分钟全员转腹侧、85 名患者百分百有效，是作者个案链，禁止当治愈率",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "基本动作", "治愈率", "证据边界"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 4,
    summary:
      "约 60 名心理师的工作坊：做基本动作前约一半咽部检测差，几分钟后「全都回到腹侧」。回诊所后连续 85 人教一次基本动作再看咽，「全部正面疗效」，当周和数周后评价仍高。一位心理师来信：先测、先做动作，再谈话才听得进去。",
    body: "没有对照、没有独立复制、百分百在医学上不可外推。\n禁止：漂浮治愈率 100%；几分钟重置迷走。\n基本动作步骤仍等第二部，到了按培训卡拆，并写禁忌。\n对接：KP-COM-005。",
    examples: ["错：国际读本 85 例全好，我们同样保证"],
  },
  {
    id: "KP-PVB-074",
    loc: "p.151–153",
    title: "通识：对症开药看不见共病后面的自律状态；这是作者的医疗批评，不是方舟诊疗权",
    category: "技术知识",
    layer: "commons",
    tags: ["共病", "对症医学", "腹侧迷走", "通识"],
    audience: ["学术", "销售团队", "培训师"],
    usage: "pitch",
    min: 3,
    summary:
      "第5章问「迷走的医疗保健新思维」：西医听症状、化验、开吸入剂/止痛药/胃肠药，可能漏掉自律功能障碍这条共线。共病的行为心理变化常被当成另一个病。波吉斯把激素和回路写成心理情绪的底层；作者认为先把腹侧拉回来，有些慢病才有非药物窗口。",
    body: "作者有十五年颅荐骨经验后才接到这套模型。\n对外可借：一串不适可能共享状态。\n不可借：我们替代精神科或呼吸科。\n对接：KP-PVB-024。",
    examples: [],
  },
  {
    id: "KP-PVB-075",
    loc: "p.152、p.156",
    title: "红线：用多重迷走「治疗身心疾病」是书名级主张，禁止写成漂浮适应症菜单",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "适应症", "COPD", "纤维肌痛"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 5,
    summary:
      "作者把乏力、低血压、晕眩、COPD 呼吸难、慢性肌骨痛（常被叫纤维肌痛）、抑郁退缩、解离、无助、部分创伤焦虑，都写成慢性背侧启动。并说保证腹侧正常即可减轻或消除许多问题；后文还点名偏头痛、自闭、精神科诊断。那是临床信念。",
    body: "多数医生不测迷走、不把 ANS 写进诊断、没学过非药物改状态——这是作者批评。\n执行：这些病名不进海报、问诊、适应症。有病找专科。\n对接：KP-PVB-051。",
    examples: ["错：漂浮用多重迷走法治疗身心疾病"],
  },
  {
    id: "KP-PVB-076",
    loc: "p.154–155",
    title: "边界：专业颅荐骨要小班手把手；这本书改写成大众能做的动作，步骤仍在后文",
    category: "培训资料",
    layer: "commons",
    tags: ["自助动作", "颅荐骨", "边界", "培训"],
    audience: ["培训师", "管理者", "销售团队"],
    usage: "training",
    min: 3,
    summary:
      "2002 年后作者按盖恩技法做临床实验课，教丹麦挪威五百多名治疗师调五对社交神经。他承认专业颅荐骨很难靠一本书教会，所以另写「多数人有效、好学好用」的自助动作。对象含大众和各科临床作补充。",
    body: "本批只有预告，没有第二部图解。\n硬规则：现有处方药要减量或停药，必须先问开药医生；这些动作不替代正规医疗。把这条写进任何对外材料。\n对接：KP-PVB-013。",
    examples: ["错：看完书就可以在门店给人做颅荐骨"],
  },
  {
    id: "KP-PVB-077",
    loc: "p.155",
    title: "红线：想改处方药必须先问医生；自助动作不是停药方案",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "处方药", "知情同意", "安全"],
    audience: ["销售团队", "培训师", "漂浮师", "管理者"],
    usage: "training",
    min: 4,
    summary:
      "书用黑体警告：正在服药、想减量或停药，必须先咨询医生；技巧不能取代专业医疗，未经同意不得改药。这是本批最硬的安全句，门店口径直接采用。",
    body: "对接：KP-PVB-057 登山服药个案；KP-SOP 禁忌。禁止任何「漂了就可以停抗抑郁/吸入剂」的话术。",
    examples: ["错：抗压药会挡住迷走，来之前先停"],
  },
  {
    id: "KP-PVB-078",
    loc: "p.156",
    title: "流程：测 ANS → 示范自助动作 → 带着做 → 再测 → 建议日常做；这是作者诊所，不是开舱 SOP",
    category: "培训资料",
    layer: "commons",
    tags: ["流程", "检测", "自助动作", "培训"],
    audience: ["培训师", "管理者"],
    usage: "training",
    min: 2,
    summary:
      "给治疗师的五步：先测自律状态，示范并教会自助动作，再测确认生理变化，建议每天和需要时做。作者声称读完书不必再找治疗师。那是卖书承诺，不是我们的服务承诺。",
    body: "漂浮流程仍以 SOP 为准。可以把「先看人在哪一档」借来培训，不要把五步贴成开舱清单。动作步骤未到。",
    examples: [],
  },
  {
    id: "KP-PVB-079",
    loc: "p.157–160",
    title: "红线：COPD 肺活量 70%→102%、哥本哈根爬梯个案，禁止当呼吸科适应症",
    category: "合规与风控",
    layer: "company",
    tags: ["红线", "COPD", "裂孔疝", "个案"],
    audience: ["销售团队", "培训师", "管理者"],
    usage: "training",
    min: 5,
    summary:
      "第5章用慢阻肺开篇：全球常见、纤维化阻塞、吸入剂和激素只暂时缓解、宣称无治愈。作者认为根在 ANS，测腹侧便宜。一例患者医院测肺活量 70%，七次手法加基本动作后到 102%，摄氧自称再升 25%。另一位 44 岁哥本哈根男子爬诊所楼梯要歇两次，CT 白影是纤维化；作者不否认阴影，但主张肋骨和膈肌机械问题加上管肺的自律神经也要管。",
    body: "慢阻肺医学上不能承诺逆转纤维化。102% 是相对同龄同体重均值，单案例。\n执行：禁止漂浮治 COPD/裂孔疝；呼吸困难按禁忌和急救，不解释成疗效。第5章后文还有裂孔疝细节，下一包再拆。\n对接：KP-PVB-016、051。",
    examples: [
      "错：国际个案肺活量从 70 到 102，我们同样能让肺好回来",
      "对：呼吸科疾病找专科；我们提供低刺激环境，不治疗慢阻肺",
    ],
  },
  {
    id: "KP-PVB-080",
    loc: "p.160 截断；目录第5章后文与第二部",
    title: "待续：第5章 COPD/裂孔疝收束、更多病谱，以及第二部基本动作",
    category: "培训资料",
    layer: "commons",
    tags: ["待续", "COPD", "基本动作", "第5章"],
    audience: ["管理者", "培训师"],
    usage: "training",
    min: 2,
    summary:
      "160 页停在哥本哈根肺纤维化个案的假说。第5章后文应有裂孔疝与更多「医疗新思维」病例。第二部动作仍约 279 页。下一包优先 161 页起。",
    body: "已补（相对 KP-PVB-060）：第3章感受身体、第4章看脸/HRV/咽部启发式、第5章开头与 COPD 红线。\n仍缺：第5章后文、不碰触检测细节、自助动作图解。到了也只作理论对照，病名不进适应症。",
    examples: [],
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
        ? "通识层。罗森堡读本第4章检测/第5章开头的摘要，不是本公司临床试验。书中病名、治愈率与颅荐骨不得外推为漂浮适应症。"
        : "公司口径层。说明本批 HRV、气喘/自闭叙事、百分百疗效和 COPD 个案怎么对接方舟；禁止写成产品适应症。",
  };
}

const dataDir = path.join(process.cwd(), "data");
const kpPath = path.join(dataDir, "knowledge-points.json");
const sourcesPath = path.join(dataDir, "sources.json");

const existing = JSON.parse(readFileSync(kpPath, "utf-8"));
if (JSON.parse(readFileSync(sourcesPath, "utf-8")).some((s) => s.id === "SRC-PVB-ROSENBERG-MERGED")) {
  console.log("罗森堡读本已主题合并为 KP-PVB-001~015，跳过逐页 import。");
  process.exit(0);
}
if (existing.some((p) => p.id === "KP-PVB-061")) {
  console.log("罗森堡书 121–160 已入库，跳过。总数:", existing.length);
  process.exit(0);
}
if (!existing.some((p) => p.id === "KP-PVB-041")) {
  console.error("请先入库 81–120（KP-PVB-041）。");
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

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const filtered = sources.filter((s) => s.id !== sourceId);
filtered.push({
  id: sourceId,
  filename: sourceFile,
  fileType: "pdf",
  uploadedAt: now,
  knowledgePointIds: points.map((p) => p.id),
  status: "done",
  splitMode: "claude-agent",
  note: "扫描件 121–160 页。第3章收束 + 第4章检测启发式 + 第5章 COPD 开头。20 条摘要卡。HRV/气喘自闭/百分百/COPD 个案不得外推为漂浮适应症。",
});
writeFileSync(sourcesPath, JSON.stringify(filtered, null, 2) + "\n");

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
