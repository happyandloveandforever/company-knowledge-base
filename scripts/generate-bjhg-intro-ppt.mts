/**
 * 为北京化工集团初次交流生成 PPT（对齐方向，不硬推投资细账）
 * 内容全部来自知识库已批准知识点，叙事按国企首次接触定制。
 * 运行：npx tsx scripts/generate-bjhg-intro-ppt.mts
 */
import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { generatePptBuffer } from "../src/lib/ppt-export";
import { saveOutline, getKnowledgePoints } from "../src/lib/storage";
import type { Outline, OutlineSlide } from "../src/lib/types";
import { generateId } from "../src/lib/utils";

const TITLE = "漂浮方舟 × 北京化工集团 · 初次交流";
const AUDIENCE = "北京化工集团（首次了解 / 方向对齐）";
const DURATION = 20;

/** 引用的知识库 ID（全部已 approved） */
const SOURCE_KP_IDS = [
  "KP-V7-001",
  "KP-V7-002",
  "KP-BRAND-001",
  "KP-BRAND-001",
  "KP-BG2-003",
  "KP-BG2-006",
  "KP-MECH-003",
  "KP-WEB-010",
  "KP-WEB-002",
  "KP-BG2-040",
  "KP-BG2-041",
  "KP-BG2-048",
  "KP-BG2-051",
  "KP-BRAND-031",
  "KP-BG2-057",
  "KP-BRAND-031",
  "KP-BG2-064",
  "KP-BG2-071",
  "KP-BG2-074",
  "KP-CHAMP-001",
  "KP-CHAMP-007",
  "KP-CHAMP-013",
  "KP-CHAMP-022",
  "KP-V7-003",
];

function slide(
  order: number,
  title: string,
  bullets: string[],
  knowledgePointIds: string[],
  logicStep: string,
  speakerNotes: string
): OutlineSlide {
  return { order, title, bullets, knowledgePointIds, logicStep, speakerNotes };
}

async function main() {
  const all = await getKnowledgePoints();
  const missing = SOURCE_KP_IDS.filter((id) => !all.some((p) => p.id === id));
  if (missing.length) {
    console.error("缺少知识点:", missing.join(", "));
    process.exit(1);
  }

  const slides: OutlineSlide[] = [
    slide(
      1,
      TITLE,
      [
        "目标：相互了解 · 方向对齐",
        "受众：北京化工集团首次交流",
        "时长：约 20 分钟",
        "原则：先看是否同路，再谈怎么走",
      ],
      SOURCE_KP_IDS,
      "封面",
      "开场保持轻松：这是初次交流材料，不是融资路演。先对齐「我们在解决什么、和贵集团可能的交集」。"
    ),
    slide(
      2,
      "今天想对齐的三件事",
      [
        "我们是谁：漂浮方舟在做的事",
        "我们往哪走：主动健康 / 深度恢复方向",
        "可能和贵集团怎么同路：先找契合，不急于谈条款",
      ],
      ["KP-BRAND-001", "KP-V7-001"],
      "交流目标",
      "合伙人口径：让对方了解我们，确认方向与需求一致即可。避免一上来谈估值、对赌、财务模型细节。"
    ),
    slide(
      3,
      "我们是谁",
      [
        "中友瑞水（北京）科技：漂浮舱系统研发制造 + 疗法科研 + 解决方案",
        "定位：标准化、可复制的身心深度恢复系统（不是普通 SPA）",
        "基地在北京亦庄；服务覆盖健康管理、运动恢复、企业精力、园区与康养空间",
        "业务：设备供应 · 运营管理 · 资质认证 · 执证人才培训",
      ],
      ["KP-CHAMP-022", "KP-BG2-057", "KP-BRAND-001"],
      "公司介绍",
      "亦庄这一点可轻提：与北化亦庄生命健康相关载体在地理与产业氛围上接近，便于后续对接，但今天不展开招商细节。"
    ),
    slide(
      4,
      "时代课题：从被动治疗到主动健康",
      [
        "政策与产业都在转向：心理健康 · 非药物 · 主动干预",
        "用户不再只为「放松一下」买单，而为睡眠、疲劳、压力和状态改善付费",
        "对企业与园区：人才过载、精力管理，正在从福利讲座变成可体验的恢复服务",
      ],
      ["KP-V7-002", "KP-BG2-003", "KP-BG2-048"],
      "背景趋势",
      "可与北化「生物医药 / 抗衰老药械 / AI 数字健康」叙事轻轻对接：我们站在非药物主动健康一侧，是互补而非替代临床。"
    ),
    slide(
      5,
      "市场空白：轻体验与重干预之间",
      [
        "轻体验（App / 普通 SPA）：门槛低，效果浅，难形成刚需",
        "重干预（医疗设备 / 药物）：专业强，门槛高，部署重",
        "空白地带：比普通放松更深，又比医疗干预更轻 —— 可商业交付的深度恢复",
        "漂浮方舟切入的，正是这条「可及的深度恢复」通道",
      ],
      ["KP-BG2-006"],
      "问题定义",
      "这是和产业方沟通时最清晰的定位句：我们不是抢医院的活，也不是再做一个按摩店。"
    ),
    slide(
      6,
      "漂浮方舟是什么",
      [
        "核心方法：Floatation-REST（限制环境刺激疗法）",
        "泻盐浮力 + 恒温 + 感官降噪 → 身体从持续应对外界，转向内部恢复",
        "交付物不只是舱：舱体 + 控制净化 + 服务 SOP + 数据反馈 = 深度恢复系统",
        "主张：激活自愈与恢复能力的入口，而不是单次新奇体验",
      ],
      ["KP-MECH-003", "KP-BRAND-001", "KP-BG2-027", "KP-BG2-064"],
      "方案本质",
      "强调「系统」：设备、流程、消杀、培训、复访。国企对方通常更关心可复制交付与边界清晰。"
    ),
    slide(
      7,
      "科学底座，也讲清楚边界",
      [
        "学术体系：Floatation-REST 有较成熟国际研究基础（材料口径：60+ 研究 / 1800+ 受试者）",
        "证据较充分：焦虑抑郁状态、皮质醇调节、身体意象、单次极度放松等",
        "仍需更大样本：长期睡眠、成瘾干预、慢性疼痛特异性等 —— 我们不包装万能疗法",
        "对外原则：卖可验证的深度恢复，不卖「治病」",
      ],
      ["KP-WEB-010", "KP-WEB-002", "KP-BG2-040", "KP-BG2-041"],
      "证据与合规",
      "对化工/医药背景听众，诚实边界反而加分。可主动说：二类器械在推进，现阶段不作已取得资质宣称。"
    ),
    slide(
      8,
      "我们看到的契合点（供讨论）",
      [
        "主动健康 / 抗衰方向：冠军系列面向心力脑力高消耗与运动恢复，含抗衰相关功能模块",
        "AI 与数据健康：体征监测、多屏反馈、可记录的恢复变化（健康管理表达）",
        "产业载体：可进入康养空间、园区示范、企业人才服务，而非单一零售门店逻辑",
        "地理与生态：我们扎根亦庄，便于与首都生命健康产业氛围对接",
      ],
      ["KP-CHAMP-001", "KP-CHAMP-007", "KP-BG2-048", "KP-BG2-051", "KP-BRAND-031"],
      "方向对齐",
      "本页是全场关键。用「供讨论」语气，邀请对方修正：贵集团更关心抗衰赛道、园区载体，还是企业服务？我们按对方真实需求收窄。"
    ),
    slide(
      9,
      "如果同路，常见的进入方式",
      [
        "企业精力管理：高管/核心人才可体验、可复访的恢复服务包",
        "园区 / 公共健康示范：把「宣传健康」做成可体验空间",
        "康养与酒店会所载体：高客单差异化恢复记忆点",
        "合作形态可分层：采购 / 租赁 / 联营 / 样板共建 / 项目制（按资源匹配）",
      ],
      ["KP-BG2-048", "KP-BG2-051", "KP-BG2-071", "KP-V7-003"],
      "场景入口",
      "只列入口，不报具体价格。若对方追问投资结构，可回答：今天先确认场景偏好，再做适配测算。"
    ),
    slide(
      10,
      "能力一瞥：我们交付什么",
      [
        "产品线：D / O 型舱体系统 + P 型定制漂浮池 + 生命元炁漂浮液配套",
        "工程：舱体 / 智能主机 / 独立储液三分体，便于安装维护与连续运营",
        "消杀与水质：物理消杀闭环，强调可检验、可运维",
        "交付支持：SOP 培训、人员配置、质量审查 —— 门店级「中央处理器」，不是说明书",
      ],
      ["KP-CHAMP-001", "KP-BG2-027", "KP-BG2-064", "KP-CHAMP-013"],
      "能力证明",
      "保持克制：证明我们能交付，但不展开冠军系列每一项参数表。"
    ),
    slide(
      11,
      "资质与合作安全感",
      [
        "质量与合规矩阵：ISO / CE / RoHS / FCC / UL / FDA 注册等（以交付证书为准）",
        "漂浮液相关检测与饮用水级别认证路径",
        "二类医疗器械认证推进中：现阶段不作为已取得资质列示",
        "合作纪律：参数与承诺以型号铭牌、合同和技术文件为准",
      ],
      ["KP-BRAND-031", "KP-CHAMP-013"],
      "信任基础",
      "国企采购思维：可见的认证 + 清晰的边界。主动说明「推进中」比夸大更稳妥。"
    ),
    slide(
      12,
      "建议的轻量下一步",
      [
        "① 贵方内部对齐更关心的切口：抗衰 / 园区载体 / 企业服务 / 其他",
        "② 安排一次实景体验或样板参观（效果自己发声）",
        "③ 若方向一致：做一场场地与客群的轻量适配评估（不是报价施压）",
        "④ 再决定是否进入合作模式与商务细节讨论",
      ],
      ["KP-BG2-074"],
      "下一步",
      "收尾金句：下一步不是直接报价，而是精准的项目适配。把决策权交还给对方。"
    ),
    slide(
      13,
      "谢谢交流",
      [
        "漂浮方舟 · 深度恢复系统",
        "中友瑞水（北京）科技有限公司",
        "北京 · 亦庄",
        "欢迎提问与指正",
      ],
      ["KP-CHAMP-022"],
      "结束",
      "预留 Q&A。若被问投资条款：感谢关注，我们愿意在方向确认后再单独安排投资人沟通会。"
    ),
  ];

  const outline: Outline = {
    id: generateId("OL"),
    title: TITLE,
    audience: AUDIENCE,
    durationMin: DURATION,
    logicId: "background-trend-product",
    logicName: "初次对齐（定制）· 背景→方向→契合→轻量下一步",
    slides,
    knowledgePointIds: SOURCE_KP_IDS,
    createdAt: new Date().toISOString(),
  };

  await saveOutline(outline);

  const buf = await generatePptBuffer(outline);
  const outDir = path.join(process.cwd(), "exports");
  mkdirSync(outDir, { recursive: true });
  const filename = "漂浮方舟_北京化工集团_初次交流.pptx";
  const outPath = path.join(outDir, filename);
  const artifactPath = path.join("/opt/cursor/artifacts", filename);
  writeFileSync(outPath, buf);
  writeFileSync(artifactPath, buf);

  const mdPath = path.join(outDir, "漂浮方舟_北京化工集团_初次交流-大纲.md");
  const md = [
    `# ${outline.title}`,
    "",
    `- 受众：${outline.audience}`,
    `- 时长：约 ${outline.durationMin} 分钟`,
    `- 结构：${outline.logicName}`,
    `- 引用知识点：${outline.knowledgePointIds.length} 个（均已 approved）`,
    `- Outline ID：${outline.id}`,
    "",
    "> 合伙人口径：让对方了解我们，确认方向一致即可；本材料按「初识对齐」编写，未展开融资条款与财务细账。",
    "",
    "---",
    "",
    ...slides.flatMap((s) => [
      `## ${s.order}. ${s.title}`,
      s.logicStep ? `> ${s.logicStep}` : "",
      "",
      ...s.bullets.map((b) => `- ${b}`),
      "",
      s.speakerNotes ? `**备注**：${s.speakerNotes}` : "",
      s.knowledgePointIds.length
        ? `**知识库**：${s.knowledgePointIds.join(", ")}`
        : "",
      "",
    ]),
  ]
    .filter((line) => line !== undefined)
    .join("\n");
  writeFileSync(mdPath, md);
  writeFileSync(path.join("/opt/cursor/artifacts", "漂浮方舟_北京化工集团_初次交流-大纲.md"), md);

  console.log("outline:", outline.id);
  console.log("pptx:", outPath);
  console.log("artifact:", artifactPath);
  console.log("slides:", slides.length);
  console.log("bytes:", buf.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
