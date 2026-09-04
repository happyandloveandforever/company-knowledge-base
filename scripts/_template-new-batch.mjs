/**
 * 新思路入库模板。复制这个文件，改名成 apply-patent-<你的主题>.mjs，改下面的内容。
 *
 * 用法：
 *   cp scripts/_template-new-batch.mjs scripts/apply-patent-你的主题.mjs
 *   改 BATCH / cards 两处，然后：
 *   node scripts/apply-patent-你的主题.mjs
 *   node scripts/test-patent-library.mjs
 *
 * 规则见 PAT-RULE-008 与 patent-drafts/新思路入库流程.md。
 * 校验不通过会在写盘前中止并列出原因，不会污染库。
 */
import { openStore } from "./lib/patent-store.mjs";

const BATCH = {
  batchId: "SRC-PAT-改成你的批次ID", // 形如 SRC-PAT-SHELL
  srcFile: "改成批次名", // 会写进每张卡的来源
  author: "改成：xx检索 2026-xx-xx（公开检索，未核验法律状态）",
  now: new Date().toISOString().replace(/\.\d+Z$/, ".000Z"),
  guardId: "PAT-IDEA-改成本批第一张卡的ID", // 幂等键
  note: "一句话说明这批干了什么，写进来源登记",
};

const cards = [
  // ── 方案卡（要写的东西）──────────────────────────────────────────
  {
    id: "PAT-IDEA-NNN",
    kind: "layout",
    cluster: "6", // 1舱体液路 2气泡热场 3声振 4传感控制 5迷走 6低刺激 cross跨簇
    risk: "high", // critical/high/medium/low/green
    lifecycle: "active", // active现行 / stale待重估
    group: "g2", // g1液路化学 g2残余量闭环 g3声耦合 g4测量可信 g5舱体表面 none未归组
    loc: "卡片在源文件中的位置或主题",
    tags: ["有效方案", "待验证"],
    techBranch: "技术分支名",
    title: "一句话说清主张什么，别用形容词",
    summary: "两三句：解决什么、跟现有技术差在哪、不要写成什么",
    body:
      "技术问题：……（现有技术为什么解决不了，越具体越好）\n\n" +
      "可写的装置轮廓：……（结构、联锁、判据，不写疗效）\n\n" +
      "去环境测试：拿掉高盐会怎样，拿掉中性浮力会怎样。都不影响就说明高盐不是必要条件，应降级或打掉。\n\n" +
      "不要写成：……（列出会撞上的现有技术）\n\n" +
      "待验证：见 PAT-GAP-00X。本卡不给出新颖性或创造性最终结论。",
    examples: ["对：……", "错：……"],
    relatedIds: ["PAT-INDEX-001"],
  },

  // ── 打掉卡（查完发现不能写的）────────────────────────────────────
  {
    id: "PAT-IDEA-NNN",
    kind: "layout",
    cluster: "6",
    risk: "critical",
    lifecycle: "killed",
    group: "none", // 打掉的卡不进任何组
    loc: "主题",
    tags: ["已打掉"],
    techBranch: "技术分支名",
    title: "已打掉：……",
    summary: "一句话说清为什么不能写",
    body: "打掉原因：……（点名现有技术，写清公开号或公开方式）\n\n不建议投入。可以改写的落点是：……",
    examples: ["错：……"],
    relatedIds: ["PAT-INDEX-001"],
  },

  // ── 先案卡（查到的现有技术）──────────────────────────────────────
  {
    id: "PAT-PRI-NNN",
    kind: "retrieved",
    cluster: "6",
    risk: "critical",
    lifecycle: "active",
    group: "none",
    loc: "主题",
    publicationNo: "US1234567 或「非专利公开：xxx 官网/论文」", // 检索卡必填
    jurisdiction: "美国 / 中国 / 商业公开使用 / 国际学术公开",
    techBranch: "技术分支名",
    tags: ["红灯"],
    title: "这份现有技术公开了什么，一句话",
    summary: "对我们意味着什么",
    body:
      "公开要点：……\n\n对我们的限制：不得主张……\n\n对我们的支撑：……（有时先案能当技术问题的证据）\n\n" +
      "法律状态待核验。本卡为公开检索结果，不构成正式法律意见。",
    relatedIds: ["PAT-INDEX-001"],
  },
];

const store = openStore(BATCH);
for (const c of cards) store.add(c);

// 需要改写已有卡时用这两个（都幂等）：
// store.patch("PAT-IDEA-020", { lifecycle: "superseded", supersededBy: "PAT-IDEA-031", group: "none" });
// store.append("PAT-RULE-001", "【2026-xx-xx 补注】", "……");

store.commit();
