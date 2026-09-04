/**
 * 称谓清理：母案框架退役后，仍有现行卡的标题与摘要在讲母案A/B。
 * 正文已补注，但标题才是人扫的，必须一并改掉。
 * 走 scripts/lib/patent-store.mjs 流水线，幂等。
 * 运行：node scripts/apply-patent-title-cleanup.mjs
 */
import { openStore } from "./lib/patent-store.mjs";

const BATCH = {
  batchId: "SRC-PAT-TITLE-CLEANUP",
  srcFile: "称谓清理-母案改申请组",
  author: "全库称谓审计 2026-09-04",
  now: "2026-09-04T23:00:00.000Z",
  guardId: "PAT-RULE-001",
  note: "现行卡标题与摘要里遗留的母案A/B称谓统一改为申请组；正文原文保留不动，只改导航性文字。",
};

const store = openStore(BATCH);

// 标题：人扫库时只看这一行，必须自洽
store.patch("PAT-RULE-001", {
  title: "专利库总纲：五个申请组、六簇作检索标签，先读 PAT-INDEX-001，仍不是正式法律意见",
  summary:
    "本库不是正式法律意见，不做FTO，不进 /open、不进编排、不与总库知识点混号。组织方式是五个申请组（母案框架已于 PAT-BATCH-002 退役），六簇保留作检索标签。每张卡都有生命周期标记，先按标记筛再读内容。",
});

store.patch("PAT-ROAD-A", {
  title: "组一独权候选：高盐漂浮液多物理场稳定化装置及运行方法",
  summary:
    "解决液体和物理环境是否稳定，不是用户生理或疗效。组一独权候选，A1—A5 改为组内从属权利要求层次，并入消杀六条 PAT-IDEA-026 至 031。是否与其他组同日提交由代理师按抵触申请风险判断。",
});

store.patch("PAT-ROAD-B", {
  title: "组四独权候选：高盐测量可信度；盐雾致盲宽方案已收窄，角度③升为测量类优先",
  summary:
    "收窄定位不变。盐雾致盲宽方案已被 PAT-PRI-043 包围。测量类目前最有希望的是含气泡高盐液声能测不准。B6/B7 低刺激交互已迁出，现归组二。",
});

store.patch("PAT-STATE-001", {
  title: "组四状态机：S0待机到S8维护，紧急停机优先于体验",
});

store.patch("PAT-WRITE-003", {
  title: "组一交底书七节骨架：每节问什么、写到什么程度算够",
  summary:
    "按报告A.2的七个要素排成七节。可填空版在仓库 patent-drafts/交底书-母案A.md（文件名沿用旧称，内容对应组一）。每节都给了「要问什么、写够的标准、常见错误」，照着填即可。",
});

store.patch("PAT-WRITE-004", {
  summary:
    "按组一独权七要素和 A1—A5 排的问题。你不需要听懂全部答案，只需要记准、追问到能画出图为止。最后一题最重要，它能直接指出发明点。新增必问项见 PAT-GAP-007 的两张表。",
});

store.patch("PAT-RED-001", {
  title: "红灯升级：人体AI闭环、直接VNS、模块堆叠、没有数据就概念化立案，都不要写进独权",
});

store.patch("PAT-PRI-007", {
  title: "EEG/脑波刺激族：采集—分析—调声电光，当前各申请组完全剥离",
});

store.patch("PAT-PRI-006", {
  summary:
    "心率或呼吸监测，计算压力指标/HRV，确定机械振动节律，连续实时反馈；可穿戴胸部振动；文献描述低于30Hz。组四不以人体HRV作为振动主控输入；另见 PAT-IDEA-051 只取周期信号用于装置调度，不做HRV分析。",
});

store.commit();
