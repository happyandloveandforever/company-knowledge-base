/**
 * 北京化工集团交流 PPT v2：深入浅出 · 国际视野 · 能力更辉煌
 * 不局限亦庄地理叙事；仍基于知识库已批准知识点。
 * 运行：npx tsx scripts/generate-bjhg-intro-ppt-v2.mts
 */
import { writeFileSync, mkdirSync, copyFileSync } from "fs";
import path from "path";
import { generatePptBuffer } from "../src/lib/ppt-export";
import { saveOutline, getKnowledgePoints } from "../src/lib/storage";
import type { Outline, OutlineSlide } from "../src/lib/types";
import { generateId } from "../src/lib/utils";

const TITLE = "漂浮方舟 · 全球深度恢复系统";
const SUBTITLE = "与北京化工集团的战略沟通（深入浅出版）";
const AUDIENCE = "北京化工集团（国际视野 / 能力呈现）";
const DURATION = 25;

const SOURCE_KP_IDS = [
  "KP-V7-001",
  "KP-FAF-001",
  "KP-BRAND-001",
  "KP-BG2-001",
  "KP-BG2-006",
  "KP-BG2-009",
  "KP-MECH-001",
  "KP-BG2-033",
  "KP-BG2-034",
  "KP-BG2-039",
  "KP-BG2-040",
  "KP-BG2-041",
  "KP-CHAMP-001",
  "KP-CHAMP-003",
  "KP-CHAMP-007",
  "KP-CHAMP-010",
  "KP-CHAMP-013",
  "KP-CHAMP-017",
  "KP-CHAMP-022",
  "KP-BG2-053",
  "KP-BG2-055",
  "KP-BG2-060",
  "KP-BG2-061",
  "KP-BG2-073",
  "KP-BG2-048",
  "KP-BG2-071",
  "KP-BG2-074",
  "KP-BRAND-021",
  "KP-BRAND-022",
  "KP-V7-002",
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
        SUBTITLE,
        "一句话：把「真正恢复」做成可复制的全球级系统",
        "面向：产业伙伴 · 战略投资者 · 主动健康布局者",
        "今天：把复杂的事讲清楚，把硬实力讲到位",
      ],
      SOURCE_KP_IDS,
      "封面",
      "开场气场要足但不空：我们不是本地小项目汇报，而是把一套已验证的深度恢复系统带到产业级对话桌。"
    ),
    slide(
      2,
      "先用一分钟听懂我们在做什么",
      [
        "现代人看起来休息了很多，身体和神经系统却常常没真正恢复",
        "漂浮方舟做的事很简单：让外界噪音归零，让身体自己重启",
        "方法来自国际成熟体系 Floatation-REST（限制环境刺激疗法）",
        "我们把它工程化、标准化、可复制 —— 从实验室到可运营系统",
      ],
      ["KP-BG2-003", "KP-BG2-009", "KP-BG2-001", "KP-BRAND-001"],
      "深入浅出",
      "用「降噪重启」类比手机重启：人人能懂。然后落回 REST 专业名词，建立可信度。"
    ),
    slide(
      3,
      "全球同题：高压时代缺的不是刺激，是重置",
      [
        "从华尔街到竞技赛场，高心力脑力消耗正在变成文明级命题",
        "轻体验太多（App、普通水疗），重干预太重（药物与复杂医疗路径）",
        "中间那条路 —— 更深、更轻、可规模交付的深度恢复 —— 仍是空白",
        "谁先把这条路做成标准，谁就握住主动健康的产业入口",
      ],
      ["KP-BG2-006", "KP-V7-002", "KP-CHAMP-001"],
      "国际视野",
      "把北化听众拉到全球赛道：抗衰、主动健康、数字健康，是国际资本与产业同时在押的方向。"
    ),
    slide(
      4,
      "漂浮方舟：激活人体自愈系统的金钥匙",
      [
        "定位：心理健康与主动健康的非药物干预系统",
        "本质：标准化、可复制的身心深度恢复系统（不是一次性新奇体验）",
        "交付：设备 + 消杀运维 + SOP + 数据反馈 + 培训认证 = 完整能力闭环",
        "目标：让深度恢复像工业品一样稳定、可检验、可扩张",
      ],
      ["KP-BG2-001", "KP-V7-001", "KP-FAF-001", "KP-BG2-064"],
      "定位辉煌",
      "「金钥匙」是品牌主张；紧接着用系统闭环证明不是口号。"
    ),
    slide(
      5,
      "方法并不神秘：四步讲清作用机理",
      [
        "减负：高浓度泻盐浮力托起身体，对抗重力负荷",
        "降噪：恒温与感官限制，让外界刺激尽可能归零",
        "重置：神经系统从高压警戒切到恢复模式（REST）",
        "整合：睡眠、抗衰、减压、抗焦虑等功能模块按场景叠加",
      ],
      ["KP-MECH-001", "KP-BG2-009", "KP-CHAMP-001"],
      "机理浅讲",
      "四字诀方便记忆。被追问细节时再展开 Theta/HRV/皮质醇等指标。"
    ),
    slide(
      6,
      "国际科学底座：不是概念，是可引用的证据链",
      [
        "Floatation-REST 已是国际科研体系，而非营销黑话",
        "材料口径：60+ 项研究、1800+ 受试者的全球证据规模",
        "顶刊线索：Lancet 子刊 RCT —— 身体意象与状态焦虑的显著改善，且随访仍维持",
        "我们的态度同样国际：证据充分处敢讲，证据不足处不包装万能疗法",
      ],
      ["KP-BG2-033", "KP-BG2-034", "KP-BG2-039", "KP-BG2-040"],
      "学术辉煌",
      "辉煌与诚实并行：国企/产业方最吃「有顶刊 + 有边界」。"
    ),
    slide(
      7,
      "冠军系列：为极限恢复而生的强功效平台",
      [
        "面向精英与竞技运动员等超负荷身心损耗人群",
        "睡眠调理：多体征监测、多屏同步、异常实时报警",
        "全身抗衰：纳米水溶氢、医疗级增氧、矿泉级抗衰漂浮液方向",
        "神经平静：脑波调频（国际高精度芯片路径）+ 地球频率（舒曼波）等模块",
      ],
      ["KP-CHAMP-001", "KP-CHAMP-007", "KP-CHAMP-010", "KP-CHAMP-005"],
      "产品辉煌",
      "用「平台」而非「浴缸」叙事。参数点到为止，气势放在能力组合上。"
    ),
    slide(
      8,
      "全球级信任：认证、标准与严肃客户背书",
      [
        "质量与市场准入矩阵：ISO / 欧盟 CE / RoHS / 美国 FCC / UL / FDA 注册等",
        "严肃场景门槛：康复辅具质检路径、兴奋剂检测相关认证口径",
        "国际组织角色：世界漂浮学会理事长单位等行业位置",
        "国家队与顶尖学府合作网络：奥运体系供应商、北大/北中医等科研战略伙伴",
      ],
      ["KP-CHAMP-013", "KP-BG2-061", "KP-CHAMP-003", "KP-BG2-055"],
      "信任辉煌",
      "强调「能进严肃客户门」。二类器械推进中可口头补充，不写成已拿证。"
    ),
    slide(
      9,
      "把卫生与连续运营做成工业级能力",
      [
        "全球首创取向的物理消杀闭环：回收 → 精密过滤 → 臭氧/紫外/光触媒 → 无菌储液",
        "最小过滤孔径可达 0.1 μm 量级；追求无化学添加维持液体状态",
        "舱体 / 智能主机 / 独立储液三分体：为商业连续运营与可维护性设计",
        "意义：让「高端体验」同时经得起巡检、复购与规模化排班",
      ],
      ["KP-CHAMP-017", "KP-BG2-027", "KP-CHAMP-014"],
      "工程辉煌",
      "化工背景听众会对流程、过滤、闭环特别有感觉——把这页讲成「工业品思维」。"
    ),
    slide(
      10,
      "专家与生态：不是单点技术，是体系共建",
      [
        "系统工程总体把关：俞梦孙院士 · 人民健康系统工程理念牵引",
        "跨学科矩阵：医学心理、生命科学、运动康复、信息智能、中医养护",
        "战略生态：训练基地实证、供应链、文旅康养、智慧健康等协同",
        "目标位置：标准制定者与系统定义者，而不只是设备制造商",
      ],
      ["KP-BRAND-022", "KP-BG2-060", "KP-BG2-055", "KP-BG2-073"],
      "生态辉煌",
      "「标准制定者」是收束句。配合专利、机构客户、C端服务规模口径。"
    ),
    slide(
      11,
      "已经跑通的规模与服务半径",
      [
        "材料口径：30+ 核心专利 · 200+ 机构客户 · 3万+ C端深度服务支持",
        "500+ 场论坛培训科普；服务网络覆盖医疗、体育、康养、政企、学校等",
        "四大业务板块：系统供应 · 运营管理 · 资质认证 · 执证人才培训",
        "专精特新与双高等级企业背书，深度参与行业标准制定",
      ],
      ["KP-BG2-053", "KP-CHAMP-022", "KP-BG2-073"],
      "规模辉煌",
      "数字用「材料口径」提醒自己可核对；对外可以说「公开材料显示」。"
    ),
    slide(
      12,
      "与产业资本同频的四条价值轴",
      [
        "抗衰与主动健康：把「状态改善」做成可体验、可复购的产品",
        "数字健康：体征与恢复过程可记录、可管理（健康管理表达）",
        "人力资本：为企业与高负荷人群提供可规模化的精力恢复入口",
        "载体赋能：康养、酒店、园区、公共健康示范 —— 同一套系统多入口落地",
      ],
      ["KP-CHAMP-007", "KP-BG2-048", "KP-BG2-051", "KP-V7-003"],
      "契合升级",
      "不再提亦庄绑定。用四条价值轴让北化自己对号入座：生科抗衰、园区载体、还是企业服务。"
    ),
    slide(
      13,
      "合作可以很大，入口可以很轻",
      [
        "分层合作：采购 / 租赁 / 联营 / 样板共建 / 项目制集采",
        "先选一个真场景跑通：企业精力包、示范空间、或旗舰恢复单元",
        "我们输出的是可运转系统：培训、SOP、质量审查与持续陪跑",
        "原则：先对齐伟大目标，再用轻量试点验证同路",
      ],
      ["KP-BG2-071", "KP-BG2-064", "KP-BG2-074"],
      "合作路径",
      "辉煌之后给台阶：入口轻、天花板高。符合「了解后若一致再深入」。"
    ),
    slide(
      14,
      "一句话收束",
      [
        "漂浮方舟：把国际 REST 科学，做成可复制的深度恢复工业",
        "我们交付的不是舱体零件，而是一套可持续运营的恢复能力",
        "若贵集团在主动健康、抗衰与产业赋能上同频 —— 我们值得认真走下一步",
        "谢谢。欢迎用最尖锐的问题考验我们。",
      ],
      ["KP-BG2-001", "KP-BG2-073", "KP-CHAMP-022"],
      "收束",
      "结束要稳：邀请挑战，而不是乞求投资。气场在「经得起问」。"
    ),
  ];

  // filter KP ids that exist on each slide (some referenced optional)
  for (const s of slides) {
    s.knowledgePointIds = s.knowledgePointIds.filter((id) =>
      all.some((p) => p.id === id)
    );
  }

  const outline: Outline = {
    id: generateId("OL"),
    title: `${TITLE}（国际视野版）`,
    audience: AUDIENCE,
    durationMin: DURATION,
    logicId: "background-trend-product",
    logicName: "深入浅出·国际视野·能力呈现（定制v2）",
    slides,
    knowledgePointIds: SOURCE_KP_IDS,
    createdAt: new Date().toISOString(),
  };

  await saveOutline(outline);
  const buf = await generatePptBuffer(outline);

  const outDir = path.join(process.cwd(), "exports");
  const pubDir = path.join(process.cwd(), "public", "exports");
  mkdirSync(outDir, { recursive: true });
  mkdirSync(pubDir, { recursive: true });
  mkdirSync("/opt/cursor/artifacts", { recursive: true });

  const cnName = "漂浮方舟_北京化工集团_国际视野版.pptx";
  const asciiName = "bjhg-intro-global.pptx";
  const mdCn = "漂浮方舟_北京化工集团_国际视野版-大纲.md";
  const mdAscii = "bjhg-intro-global-outline.md";

  writeFileSync(path.join(outDir, cnName), buf);
  writeFileSync(path.join(outDir, asciiName), buf);
  writeFileSync(path.join(pubDir, asciiName), buf);
  writeFileSync(path.join("/opt/cursor/artifacts", asciiName), buf);
  writeFileSync(path.join("/opt/cursor/artifacts", cnName), buf);

  const md = [
    `# ${outline.title}`,
    "",
    `- 受众：${outline.audience}`,
    `- 时长：约 ${outline.durationMin} 分钟`,
    `- 结构：${outline.logicName}`,
    `- 引用知识点：${outline.knowledgePointIds.length} 个`,
    `- Outline ID：${outline.id}`,
    "",
    "> 相对初版：更强调国际视野与能力辉煌；弱化地域绑定；保持深入浅出与诚实证据边界。",
    "",
    "---",
    "",
    ...slides.flatMap((s) => [
      `## ${s.order}. ${s.title}`,
      `> ${s.logicStep}`,
      "",
      ...s.bullets.map((b) => `- ${b}`),
      "",
      `**备注**：${s.speakerNotes}`,
      `**知识库**：${s.knowledgePointIds.join(", ")}`,
      "",
    ]),
  ].join("\n");

  writeFileSync(path.join(outDir, mdCn), md);
  writeFileSync(path.join(outDir, mdAscii), md);
  writeFileSync(path.join(pubDir, mdAscii), md);
  writeFileSync(path.join("/opt/cursor/artifacts", mdAscii), md);

  console.log("outline:", outline.id);
  console.log("pptx:", asciiName, buf.length, "bytes");
  console.log("slides:", slides.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
