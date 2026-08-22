import type { PresentationLogic } from "./types";

export const PRESENTATION_LOGICS: PresentationLogic[] = [
  {
    id: "problem-solution-case",
    name: "问题 → 方案 → 案例",
    description: "先抛出问题与痛点，给出解决方案，最后用真实案例佐证。适合销售、产品推介。",
    steps: ["开场与目标", "问题与痛点", "解决方案", "实施步骤", "成功案例", "总结与行动"],
  },
  {
    id: "background-trend-product",
    name: "背景 → 趋势 → 产品",
    description: "从行业背景切入，分析趋势，再引出产品价值。适合对外宣讲、市场分析。",
    steps: ["背景介绍", "行业趋势", "机会与挑战", "产品/方案", "核心优势", "下一步"],
  },
  {
    id: "pain-method-practice",
    name: "痛点 → 方法 → 练习",
    description: "培训场景常用：识别痛点，讲解方法，安排练习与反馈。适合内训、工作坊。",
    steps: ["培训目标", "现状与痛点", "方法论", "操作步骤", "练习环节", "总结答疑"],
  },
  {
    id: "story-evidence-action",
    name: "故事 → 证据 → 行动",
    description: "用故事开场，用数据与证据支撑，以明确行动号召收尾。适合激励、变革类演讲。",
    steps: ["故事开场", "核心观点", "数据与证据", "关键洞察", "行动号召", "Q&A"],
  },
  {
    id: "timeline-milestone",
    name: "时间线 → 里程碑",
    description: "按时间顺序梳理项目、产品或战略演进。适合复盘、规划汇报。",
    steps: ["回顾起点", "阶段一", "阶段二", "阶段三", "当前状态", "未来规划"],
  },
];

export function getLogicById(id: string): PresentationLogic | undefined {
  return PRESENTATION_LOGICS.find((l) => l.id === id);
}
