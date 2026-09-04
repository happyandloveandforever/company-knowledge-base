import type {
  PatentCluster,
  PatentGroup,
  PatentKind,
  PatentLifecycle,
  PatentRecord,
  PatentRisk,
} from "./types";

export const PATENT_KIND_LABELS: Record<PatentKind, string> = {
  rule: "使用规则",
  roadmap: "专利路线",
  layout: "专利布局",
  cluster: "技术簇",
  retrieved: "检索到的专利",
  gap: "缺口 / 待补",
  draft: "交底书 / 撰写",
};

export const PATENT_CLUSTER_LABELS: Record<PatentCluster, string> = {
  "1": "第一簇 · 舱体液路",
  "2": "第二簇 · 气泡热场",
  "3": "第三簇 · 声振脑波",
  "4": "第四簇 · 传感控制",
  "5": "第五簇 · 迷走（间接）",
  "6": "第六簇 · 低刺激环境",
  cross: "跨簇",
};

export const PATENT_RISK_LABELS: Record<PatentRisk, string> = {
  critical: "极高",
  high: "高",
  medium: "中",
  low: "低",
  green: "绿灯可申请",
};

export const PATENT_LIFECYCLE_LABELS: Record<PatentLifecycle, string> = {
  active: "现行",
  superseded: "已取代",
  killed: "已打掉",
  stale: "待重估",
};

export const PATENT_GROUP_LABELS: Record<PatentGroup, string> = {
  g1: "组一 · 液路与化学",
  g2: "组二 · 残余量闭环",
  g3: "组三 · 高盐声耦合",
  g4: "组四 · 测量可信度",
  g5: "组五 · 舱体与表面",
  none: "未归组",
};

export function isPatentPublic(record: PatentRecord): boolean {
  return record.confidentiality === "public";
}

export function lifecycleOf(record: PatentRecord): PatentLifecycle {
  return record.lifecycle ?? "active";
}

export function countByLifecycle(records: PatentRecord[]): Record<PatentLifecycle, number> {
  const counts: Record<PatentLifecycle, number> = { active: 0, superseded: 0, killed: 0, stale: 0 };
  for (const record of records) counts[lifecycleOf(record)] += 1;
  return counts;
}

export function countByGroup(records: PatentRecord[]): Record<PatentGroup, number> {
  const counts: Record<PatentGroup, number> = { g1: 0, g2: 0, g3: 0, g4: 0, g5: 0, none: 0 };
  for (const record of records) counts[record.group ?? "none"] += 1;
  return counts;
}

export function countByKind(records: PatentRecord[]): Record<PatentKind, number> {
  const counts: Record<PatentKind, number> = {
    rule: 0,
    roadmap: 0,
    layout: 0,
    cluster: 0,
    retrieved: 0,
    gap: 0,
    draft: 0,
  };
  for (const record of records) counts[record.kind] += 1;
  return counts;
}

export function countByCluster(records: PatentRecord[]): Record<PatentCluster, number> {
  const counts: Record<PatentCluster, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, cross: 0 };
  for (const record of records) counts[record.cluster] += 1;
  return counts;
}
