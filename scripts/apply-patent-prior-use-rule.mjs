/**
 * 规则卡：公开销售即现有技术（使用公开），与对方是否申请专利无关。
 * 并补入真实存在的多感官振动舱专利先案。
 * 幂等：PAT-RULE-006 已存在则跳过。
 * 运行：node scripts/apply-patent-prior-use-rule.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-04T19:00:00.000Z";
const srcFile = "使用公开规则与振动舱先案";
const author = "专利法22条5款/审查指南2.1.2 + 振动舱专利检索 2026-09-04（公开检索，未核验法律状态）";

const dataDir = path.join(process.cwd(), "data");
const patentsPath = path.join(dataDir, "patents.json");
const sourcesPath = path.join(dataDir, "patent-sources.json");

const cards = [
  {
    id: "PAT-RULE-006",
    kind: "rule",
    cluster: "cross",
    risk: "critical",
    loc: "专利法22条5款 / 审查指南第二部分第三章2.1.2",
    tags: ["硬规则", "现有技术", "使用公开", "常见误解"],
    techBranch: "撰写纪律",
    title: "硬规则：别人公开卖了就是现有技术，跟他有没有申请专利完全无关——而且他没申请对我们更糟",
    summary:
      "最常见也最贵的误解是「他没申请专利，那这个坑是空的，我去占」。实际是他把坑填平了，谁都不能再在那儿挖，包括我们。",
    body:
      "法条依据：专利法第二十二条第五款规定，现有技术是指申请日以前在国内外为公众所知的技术。专利审查指南第二部分第三章 2.1.2 规定，公开方式包括出版物公开、使用公开和以其他方式公开三种，均无地域限制。其中使用公开包括销售、使用、展出、演示等使公众能够得知技术内容的方式；对于不能仅从外观获知内部结构的产品，公众可通过拆解、借助仪器分析检测等正当方法获知实质性技术内容的，同样构成使用公开。指南同时强调，为公众所知是一种公众想得知就能得知的状态，不要求公众实际获得。\n\n因此判断某项技术能不能主张，看的是它有没有在申请日前处于公众能得知的状态，不是看有没有人申请过专利。一个从未申请专利、但在官网上写明原理并公开销售多年的产品，其公开效力与一篇专利文献相同。\n\n方向必须掰过来：对方没有申请专利，对我们不是好消息，是更坏的消息。\n\n对方申请了专利：他获得一段有期限、有地域范围的排他权。我们不能未经许可实施，但边界清楚可以绕开设计；专利会到期、可能因未缴年费失效、可以被无效；在中国没申请的，中国境内可自由实施（仍不能就该技术本身获得专利）。\n\n对方只是公开销售没申请：该技术进入公有领域，任何人都可以实施，但任何人都不能再就它取得专利，包括我们。我们既拿不到排他权，它还会作为对比文件来打掉我们的申请。也就是说我们失去的是「独占的可能」，而不只是「实施的自由」。\n\n实务后果：即便侥幸授权，无效程序中对方只要提交产品官网的网页存档、产品手册、展会资料、销售发票或购机实物，就足以构成使用公开或出版物公开的证据。审查员的检索本来就包含非专利文献。为一件必然被无效的权利花钱和时间，比不申请更亏。\n\n实用新型同样要求新颖性，不能靠改申请类型绕过。\n\n正确做法不是放弃方向，而是改写落点。中国独立权利要求采用两段式：前序部分写与最接近现有技术共有的必要技术特征，特征部分写区别技术特征。承认对方产品是现有技术并把它写进前序部分，恰恰是规范的撰写方式，不是认输。参见 PAT-IDEA-040（承认 AOP 是现有技术，主张高盐下的对策）与 PAT-IDEA-053（承认舱内换能器是现有技术，主张高盐耦合与腔体模态的联合处理）。\n\n最后提醒自己人：本条同样适用于我方。我方产品一旦公开销售、公开展示或在官网写明原理，就构成对自己后续申请的现有技术，且中国的宽限期极窄（专利法第二十四条仅限于国家紧急状态、指定学术会议首次发表、他人未经同意泄露等有限情形，商业销售不在其列）。任何对外展示之前先问代理师能不能公开。见 PAT-RULE-002 绝对新颖性。",
    examples: [
      "对：他没申请专利＝这条我们也拿不到专利，改写落点到区别技术特征上",
      "错：他没申请专利＝这个坑空着，我们赶紧去占",
      "错：我们先卖一年攒口碑，明年再申请",
    ],
    relatedIds: ["PAT-RULE-002", "PAT-IDEA-040", "PAT-IDEA-053", "PAT-PRI-080", "PAT-PRI-065", "PAT-PRI-070"],
  },
  {
    id: "PAT-PRI-084",
    kind: "retrieved",
    cluster: "6",
    risk: "critical",
    loc: "多感官沉浸舱",
    publicationNo: "US11759705",
    jurisdiction: "美国",
    techBranch: "信噪比架构",
    title: "多感官沉浸舱专利：模块化围合体内设振动换能器向表面传递低频振动供人体感知",
    summary: "所以振动舱这个方向不只有公开销售，还真的有人申请了专利。是双重障碍。",
    body:
      "US11759705 公开一种用于构建可变交互平台与围合体、实现对音频及视听内容深度多感官沉浸的模块化系统，最早优先权可追溯至 2015 年的美国临时申请。说明书明确记载：系统包括一个或多个振动换能器（vibration transducer，亦称触觉换能器 tactile transducer）与放大器，换能器将音频信号转换为振动并将低频振动传递至各表面以便被人感知；可为每个换能器配独立放大器，也可用一个放大器驱动多个换能器。系统还包括与视听同步的其他触觉效果，如气流、加速度、温度、冲击、气味等。另有 US11960650 公开将触觉刺激按音频信号调制后与声音扩散在时间上关联地施加于听者。检索结果还提示存在把振动触觉换能器与音频节拍频率同步的舱室类在审申请。\n\n对我们的限制，两层。第一层与 PAT-PRI-080 相同：在围合舱体内以振动换能器向表面与人体传递音频相关振动，属现有技术，不能主张。第二层更重：本专利族在有效期内可能构成实施障碍，不只是新颖性障碍。若产品要进入美国市场，需就振动通道做自由实施分析。\n\n对我们的支撑：本专利族处理的是空气环境中的围合体与表面传振。我们主张的落点在高盐液体作为耦合介质时出现的问题——工作液阻抗与浮力窗口的双约束（PAT-IDEA-049）、封闭高盐腔模态随声速漂移的在线修正（PAT-IDEA-050）、以及振动失真进入低刺激本底预算（PAT-IDEA-046、047）。这些在空气围合体中都不存在。\n\n权项范围、同族与法律状态待核验，建议由代理师就振动通道做一次针对性 FTO 检索。本卡为公开检索结果，不构成正式法律意见。",
    relatedIds: ["PAT-MAP-006", "PAT-RULE-006", "PAT-IDEA-053", "PAT-IDEA-049", "PAT-IDEA-050", "PAT-PRI-080"],
  },
];

const patchPri080 = {
  summary:
    "官网原文：用舱体内壁作声学腔，触觉换能器把整个内部变成一个大扬声器。注意：除这项使用公开外，振动舱方向另有在效专利（PAT-PRI-084），是双重障碍。",
};

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
if (patents.some((p) => p.id === "PAT-RULE-006")) {
  console.log("使用公开规则已入库，跳过。总数:", patents.length);
  process.exit(0);
}

const built = cards.map((c) => card(c, null));
const idsNew = built.map((c) => c.id);
const clash = idsNew.filter((id) => patents.some((p) => p.id === id));
if (clash.length) {
  console.error("与已有 id 冲突，已中止", clash);
  process.exit(1);
}

const out = [...patents, ...built].map((p) =>
  p.id === "PAT-PRI-080"
    ? { ...p, ...patchPri080, relatedIds: [...new Set([...p.relatedIds, "PAT-PRI-084", "PAT-RULE-006"])], updatedAt: now }
    : p
);

const ids = out.map((p) => p.id);
if (ids.length !== new Set(ids).size) {
  console.error("出现重复 id，已中止");
  process.exit(1);
}

writeFileSync(patentsPath, JSON.stringify(out, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const srcId = "SRC-PAT-PRIOR-USE";
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
  note: "使用公开＝现有技术的硬规则（专利法22条5款、审查指南2.1.2），纠正「对方没申请专利所以坑是空的」这一误解；补入 US11759705 多感官振动舱专利。",
});
writeFileSync(sourcesPath, JSON.stringify(next, null, 2) + "\n");

console.log(JSON.stringify({ inserted: idsNew, patched: ["PAT-PRI-080"], total: out.length }, null, 2));
