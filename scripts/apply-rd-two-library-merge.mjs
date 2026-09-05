/**
 * 把「低刺激×迷走应用研发」同时并进两个库：
 * - 知识库：已有 KP-RD-001~012；本脚本只补两库对照注脚（不覆盖旧卡）
 * - 专利库：新增 PAT-MAP-009（应用菜单入口）+ PAT-XREF-002（两库对照）
 *
 * 不写新权要、不改五个申请组、不取代 MAP-006 / MAP-008。
 * 幂等：正文已含标记则跳过改写。
 * 运行：node scripts/apply-rd-two-library-merge.mjs
 *       node scripts/test-patent-library.mjs
 *       node scripts/test-knowledge-layers.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { openStore } from "./lib/patent-store.mjs";

const now = "2026-09-05T09:20:00.000Z";
const KP_MARK = "【2026-09-05 两库合并】";
const INDEX_MARK = "【2026-09-05 应用研发对照】";

const BATCH = {
  batchId: "SRC-PAT-RD-APP-MERGE",
  srcFile: "低刺激迷走-应用研发两库合并",
  author: "应用研发并入两库 2026-09-05（不写新专利）",
  now,
  guardId: "PAT-MAP-009",
  note: "应用层研发已在知识库 KP-RD-001~012。专利库只收对照入口 PAT-MAP-009 与两库对照 PAT-XREF-002，不新写权要，不改申请组。",
};

const store = openStore(BATCH);

store.add({
  id: "PAT-MAP-009",
  kind: "roadmap",
  cluster: "cross",
  risk: "high",
  lifecycle: "active",
  group: "none",
  loc: "应用研发对照入口",
  tags: ["应用研发", "两库合并", "不写新专利", "低刺激", "迷走"],
  techBranch: "与总库分工",
  title: "应用层研发已并入知识库：专利库只收对照入口，不新写权要、不改五个申请组",
  summary:
    "2026-09-05 把低刺激×迷走的应用取舍写进总库 KP-RD-* 和 Word。专利这边不另立申请、不取代信噪比总图。要做产品改默认程序、测本底；要写专利仍按 MAP-006 与五个组排队。",
  body:
    "这不是新的对外交付件，也不构成正式法律意见。不给出新颖性或创造性最终结论。\n\n" +
    "两库各管一层：\n" +
    "- 知识库（可编排、仅内训）：KP-RD-001～012。全文 internal/低刺激迷走-应用研发思考.md，Word 在首页下载。\n" +
    "- 专利库（本卡）：只登记「应用层已经拍板的取舍」和「分别对应哪张已有专利卡」。对照表见 PAT-XREF-002。\n\n" +
    "应用拍板、专利侧已经有卡、因此本批不新写：\n" +
    "1 默认深度 REST 全关（灯声振动香气）→ 深度模式许可 PAT-IDEA-037；掩蔽声已打掉 038\n" +
    "2 先出本底三态表，本底升先降本底 → 组二 046/047，实验第一优先 PAT-GAP-007\n" +
    "3 占用静默、空舱才消杀 → 028/030/031\n" +
    "4 液面热中性按水活度 → 034\n" +
    "5 暗适应时间表 + 近红外监护 → 041/036\n" +
    "6 液气双通道对消、随头误差点：有本底数据再立项 → 032/033，待验证\n" +
    "7 振动只留浅模式、功率由本底反算 → 046/049/050；舱内换能器本身已打掉 053\n" +
    "8 不做 40Hz、不做占用态彩光气泡碳氧气 → 054、075～077\n" +
    "9 共振呼吸每例必做：方法训练，走 VGMECH/SOP，第 25 条不进专利\n" +
    "10 氢/光/冷热放舱外工位：CIS 第二层，不是舱内默认程序\n\n" +
    "明确不改：PAT-MAP-006 仍是技术总图；PAT-MAP-008 仍是对外交付；PAT-BATCH-002 五个申请组不动；不恢复母案称谓。\n\n" +
    "怎么用：产品/运营读 KP-RD 和 Word；代理师仍读 MAP-008；两边打架时以本卡「不新写」为准，不要把应用 SOP 写进独权。",
  examples: [
    "对：默认程序改全关，本底表按 GAP-007 做，专利仍排组二两张表",
    "错：因为应用文档写了对消，就立刻另立第七组或重写独权",
  ],
  relatedIds: [
    "PAT-INDEX-001",
    "PAT-MAP-006",
    "PAT-MAP-008",
    "PAT-XREF-001",
    "PAT-IDEA-046",
    "PAT-GAP-007",
    "PAT-BATCH-002",
  ],
});

store.add({
  id: "PAT-XREF-002",
  kind: "rule",
  cluster: "cross",
  risk: "high",
  lifecycle: "active",
  group: "none",
  loc: "两库对照表",
  tags: ["总库冲突", "对照表", "KP-RD", "仅内部"],
  techBranch: "与总库分工",
  title: "两库对照：应用研发 KP-RD 对应哪张已有专利卡，禁止把 SOP 写进独权",
  summary:
    "知识库讲怎么改产品和开舱；专利库讲哪些装置还可能写、哪些已经打掉。同一份低刺激×迷走取舍必须两边都能查到，但不能混写成一套权要。",
  body:
    "分轨（接着 PAT-XREF-001）：\n" +
    "- /library 的 KP-RD-*：仅内训，讲默认程序、九通道泄漏、90 天任务\n" +
    "- /patents 的本表：把每条应用动作钉到已有 PAT-*，没有对应卡的就标「不进专利」\n" +
    "- /open：两边都不进\n\n" +
    "对照（应用 → 知识卡 → 专利卡，专利列全是已有卡）：\n" +
    "1 默认深度 REST 全关 → KP-RD-003、008 → PAT-IDEA-037；不要掩蔽声 → 038 已打掉\n" +
    "2 本底三态 / 交叉影响 / 功率反算 → KP-RD-006、011 → PAT-IDEA-046、047；实验 PAT-GAP-007 表一表二\n" +
    "3 占用静默、空舱气相打壁面、五项化学量就绪 → KP-RD-008、009 → PAT-IDEA-028、030、031\n" +
    "4 液面冷线、按水活度控湿 → KP-RD-005、009 → PAT-IDEA-034\n" +
    "5 暗适应变严、近红外监护、可见光占用断电 → KP-RD-009 → PAT-IDEA-041、036、042、043\n" +
    "6 气+液对消、误差点随头（有数据再做） → KP-RD-009 → PAT-IDEA-032、033，待验证\n" +
    "7 回波吸收（主观明显再做） → KP-RD-009 → PAT-IDEA-035，待验证\n" +
    "8 浅模式至多一个振动通道、浓度先保浮力窗 → KP-RD-009 → PAT-IDEA-046、049、050；053 换能器当卖点已打掉\n" +
    "9 腔压/液面起伏只做调度掩蔽窗 → KP-RD-004、009 → PAT-IDEA-051、048；禁止写成 HRV 诊断\n" +
    "10 不做 40Hz / 占用态彩光气泡混气 → KP-RD-010 → PAT-IDEA-054、075、076、077\n" +
    "11 共振呼吸 5 分钟每例必做 → KP-RD-004、008、VGMECH-019～022 → 不进专利（方法训练，第 25 条）\n" +
    "12 氢、PBM、冷热放会话前后另一工位 → KP-RD-007、CIS-003 → 不进舱内默认程序；模块平移已过闸 PAT-EXT-004、005\n\n" +
    "打架时怎么裁：产品改动跟 KP-RD；交底书跟 MAP-008 红灯；本表禁止把「每例做呼吸」「默认关振动」写成独立权利要求。\n\n" +
    "Word：exports/漂浮方舟_低刺激迷走_应用研发思考.docx。入口：PAT-MAP-009。",
  examples: [
    "对：开舱改默认全关，交底书仍写 037 的残余量联锁，不写「激活迷走」",
    "错：把 KP-RD 的 90 天任务复制进说明书当治疗效果",
  ],
  relatedIds: [
    "PAT-INDEX-001",
    "PAT-XREF-001",
    "PAT-MAP-009",
    "PAT-MAP-006",
    "PAT-MAP-008",
    "PAT-IDEA-037",
    "PAT-IDEA-046",
    "PAT-GAP-007",
    "PAT-IDEA-054",
    "PAT-EXT-004",
  ],
});

const index = store.patents.find((p) => p.id === "PAT-INDEX-001");
const indexRelated = [...new Set([...(index?.relatedIds ?? []), "PAT-MAP-009", "PAT-XREF-002"])];
store.patch("PAT-INDEX-001", { relatedIds: indexRelated });
store.append(
  "PAT-INDEX-001",
  INDEX_MARK,
  "应用层低刺激×迷走研发已写入知识库 KP-RD-001～012（仅内训，不进 /open）。专利库对照入口 PAT-MAP-009，两库对照表 PAT-XREF-002。不新写权要，不改五个申请组，不取代 PAT-MAP-006 / PAT-MAP-008。产品改默认程序和测本底；写专利仍按本卡原来的主线。"
);

store.append(
  "PAT-XREF-001",
  INDEX_MARK,
  "2026-09-05 补一张对照：PAT-XREF-002。总库新增仅内训 KP-RD-*（应用研发，明确不写专利）。分轨不变：PPT/开舱跟知识库，交底书跟专利红灯。"
);

store.append(
  "PAT-MAP-006",
  INDEX_MARK,
  "应用层已把「默认全关、先降本底、氢光冷热放舱外」写进知识库 KP-RD-*。本卡仍是专利技术总图，不被应用文档取代。对照见 PAT-MAP-009。"
);

store.append(
  "PAT-GAP-007",
  INDEX_MARK,
  "应用研发 90 天第一批就是本卡的表一（本底三态）。产品侧 KP-RD-011 与本卡第一优先对齐，不是另开一套实验。"
);

store.commit();

const kpPath = path.join(process.cwd(), "data", "knowledge-points.json");
const points = JSON.parse(readFileSync(kpPath, "utf-8"));
const footnotes = {
  "KP-RD-001":
    `${KP_MARK}专利库对照入口 PAT-MAP-009，两库对照表 PAT-XREF-002。知识库管产品默认程序与 90 天任务；专利库不新写权要、不改五个申请组。`,
  "KP-RD-012":
    `${KP_MARK}检索专利对照用 PAT-MAP-009 / PAT-XREF-002，不要把本系列拆进 patents.json 当新 IDEA。对外交付专利仍是 PAT-MAP-008。`,
};
let kpTouched = 0;
const nextPoints = points.map((p) => {
  const extra = footnotes[p.id];
  if (!extra || p.body.includes(KP_MARK)) return p;
  kpTouched += 1;
  return { ...p, body: `${p.body}\n\n${extra}`, updatedAt: now };
});
if (kpTouched) {
  writeFileSync(kpPath, JSON.stringify(nextPoints, null, 2) + "\n");
}
console.log(JSON.stringify({ knowledgePatched: kpTouched, ids: Object.keys(footnotes) }));
