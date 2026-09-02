import type { PatentCluster, PatentKind, PatentRecord, PatentRisk } from "./types";

export const PATENT_KIND_LABELS: Record<PatentKind, string> = {
  rule: "使用规则",
  roadmap: "专利路线",
  layout: "专利布局",
  cluster: "技术簇",
  retrieved: "检索到的专利",
  gap: "缺口 / 待补",
};

export const PATENT_CLUSTER_LABELS: Record<PatentCluster, string> = {
  "1": "第一簇 · 舱体液路",
  "2": "第二簇 · 气泡热场",
  "3": "第三簇 · 声振脑波",
  "4": "第四簇 · 传感控制",
  cross: "跨簇",
};

export const PATENT_RISK_LABELS: Record<PatentRisk, string> = {
  critical: "极高",
  high: "高",
  medium: "中",
  low: "低",
  green: "绿灯可申请",
};

export function isPatentPublic(record: PatentRecord): boolean {
  return record.confidentiality === "public";
}

export function countByKind(records: PatentRecord[]): Record<PatentKind, number> {
  const counts: Record<PatentKind, number> = {
    rule: 0,
    roadmap: 0,
    layout: 0,
    cluster: 0,
    retrieved: 0,
    gap: 0,
  };
  for (const record of records) counts[record.kind] += 1;
  return counts;
}

export function countByCluster(records: PatentRecord[]): Record<PatentCluster, number> {
  const counts: Record<PatentCluster, number> = { "1": 0, "2": 0, "3": 0, "4": 0, cross: 0 };
  for (const record of records) counts[record.cluster] += 1;
  return counts;
}
