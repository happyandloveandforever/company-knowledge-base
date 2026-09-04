/**
 * 整合方案 v4.0 入库：合并前定稿版，含全部 87 条先案与 18 条红灯清单。
 * 走 scripts/lib/patent-store.mjs 流水线，幂等。
 * 运行：node scripts/apply-patent-report-v4.mjs
 */
import { openStore } from "./lib/patent-store.mjs";

const BATCH = {
  batchId: "SRC-PAT-REPORT-V4",
  srcFile: "专利整合方案-v4",
  author: "整合方案 v4.0 定稿 2026-09-04（合并前）",
  now: "2026-09-05T00:00:00.000Z",
  guardId: "PAT-MAP-007",
  note: "合并前定稿的整合方案：信噪比架构 + 五个申请组 + 全部87条先案清单 + 18条红灯 + 三件下一步。产出 patent-drafts/专利整合方案-v4.md 与 docx。",
};

const store = openStore(BATCH);

store.add({
  id: "PAT-MAP-007",
  kind: "roadmap",
  cluster: "cross",
  risk: "critical",
  lifecycle: "active",
  group: "none",
  loc: "专利整合方案-v4.md",
  tags: ["整合方案", "v4.0", "合并前定稿", "先案全清单", "给代理师"],
  techBranch: "整合方案",
  title: "整合方案 v4.0：合并前定稿，把 87 条先案和 18 条红灯一次列全，交代理师用这一份",
  summary:
    "不改技术结论，是把现行结论整理成一份能直接交出去的文件。技术总图仍是 PAT-MAP-006，申请策略仍是 PAT-BATCH-002，入口仍是 PAT-INDEX-001。",
  body:
    "源文件：patent-drafts/专利整合方案-v4.md，Word 版 patent-drafts/漂浮方舟_专利整合方案_v4.0.docx。\n\n本卡不产生新的技术结论，只做整合与交付。八节：\n一 一句话说清路线（信噪比架构，PAT-MAP-006、PAT-IDEA-046）。\n二 必须先认的现有技术，八条红线加 PAT-RULE-006 使用公开硬规则。\n三 五个申请组与按数据门槛的排队（PAT-BATCH-002、PAT-RULE-007）。\n四 四条最值钱的技术落点：空舱气相光催化 028、工作液即阻抗层 049、光催化余辉污染暗环境 042、内表面几何五约束 055。\n五 全部 87 条先案，按消杀与水质、舱体液路与配液、声光振与低刺激、传感测量与安全控制、迷走与生理机制、人群运营六类归并，每条给出公开号或公开方式。\n六 全部 18 条红灯及其被什么挡住。\n七 下一步三件事：测两张表、测四条生死曲线、请监管律师核对措辞。\n八 撰写纪律，交代理师时一并给。\n\n完整性已机器核验：文档引用的 145 个卡号全部存在于库中无悬空；87 条先案与 18 条红灯全部出现在文档中。\n\n与既有报告的关系：v2.0（PAT-MAP-002）与 v3.0（PAT-MAP-003）已标为已取代，保留做留痕。v4.0 不取代 PAT-MAP-006 的技术总图地位，也不取代 PAT-INDEX-001 的入口地位，三者分工是：INDEX 管全库导航，MAP-006 管技术路线，本卡管对外交付。\n\n本卡不给出新颖性或创造性最终结论，不构成正式法律意见。法条条号请代理师按现行文本核对。",
  examples: [
    "对：把 v4.0 的 docx 直接发给代理师，先案清单已在第五节列全",
    "错：拿 v2.0 或 v3.0 的报告去谈，那两版的发明点选择依据已经被推翻",
  ],
  relatedIds: [
    "PAT-INDEX-001",
    "PAT-MAP-006",
    "PAT-BATCH-002",
    "PAT-RULE-006",
    "PAT-RULE-007",
    "PAT-GAP-007",
    "PAT-GAP-008",
    "PAT-EXT-003",
  ],
});

store.append(
  "PAT-INDEX-001",
  "【2026-09-05 v4.0 补注】",
  "对外交付用 patent-drafts/专利整合方案-v4.md（卡号 PAT-MAP-007），其中第五节列全了 87 条先案、第六节列全了 18 条红灯。三份文件分工：本卡管全库导航，PAT-MAP-006 管技术路线，PAT-MAP-007 管对外交付。"
);

store.commit();
