import type { KnowledgePoint, ConflictGroup } from "./types";

/** 内容冲突：同一主题下数据/表述不一致（如 5大功效 vs 3大功效） */
export interface ContentConflict {
  id: string;
  title: string;
  topic: string;
  myValue: string;
  theirValue: string;
  mySnippet: string;
  theirSnippet: string;
}

interface Claim {
  entity: string;
  attribute: string;
  value: number;
  display: string;
  snippet: string;
}

const CN_NUM: Record<string, number> = {
  零: 0, 一: 1, 二: 2, 两: 2, 双: 2, 三: 3, 四: 4, 五: 5,
  六: 6, 七: 7, 八: 8, 九: 9, 十: 10,
};

const ENTITY_KEYWORDS = [
  "漂浮方舟", "FA-D", "FAD", "方舟", "设备", "系统", "干预", "漂浮", "FA-D系统",
];

const ATTRIBUTE_ALIASES: Record<string, string> = {
  功效: "功效数量",
  优势: "优势数量",
  特点: "特点数量",
  模块: "模块数量",
  路径: "路径数量",
  步骤: "步骤数量",
  阶段: "阶段数量",
  收入来源: "收入来源数量",
  收入: "收入来源数量",
  指标: "指标数量",
  维度: "维度数量",
  会话: "会话数量",
  城市: "城市数量",
  合作伙伴: "合作伙伴数量",
};

function parseNumber(raw: string): number | null {
  const s = raw.trim();
  if (/^\d+$/.test(s)) return parseInt(s, 10);
  if (s.length === 1 && CN_NUM[s] !== undefined) return CN_NUM[s];
  if (s === "十") return 10;
  if (s.startsWith("十") && s.length === 2 && CN_NUM[s[1]] !== undefined) {
    return 10 + CN_NUM[s[1]];
  }
  if (s.endsWith("十") && s.length === 2 && CN_NUM[s[0]] !== undefined) {
    return CN_NUM[s[0]] * 10;
  }
  return null;
}

function inferEntity(text: string): string {
  const lower = text.toLowerCase();
  for (const kw of ENTITY_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) return kw;
  }
  return "通用";
}

function normalizeAttribute(word: string): string {
  return ATTRIBUTE_ALIASES[word] || `${word}数量`;
}

/** 从文本中提取带数字的主张（N大功效、四条路径 等） */
export function extractClaims(point: KnowledgePoint): Claim[] {
  const text = `${point.title}\n${point.summary}\n${point.body}`;
  const entity = inferEntity(text);
  const claims: Claim[] = [];
  const seen = new Set<string>();

  const patterns: RegExp[] = [
    /(\d+|[一二三四五六七八九十两双]+)\s*(?:大|个|项|条|种|点|款|台|家|座|层)\s*(功效|优势|特点|模块|路径|步骤|阶段|收入来源|指标|维度|会话|城市|合作伙伴)/g,
    /(功效|优势|特点|模块|路径|步骤|阶段|收入来源|指标|维度|会话|城市|合作伙伴)\s*[：:为是有]?\s*(\d+|[一二三四五六七八九十两双]+)\s*(?:大|个|项|条|种|点)?/g,
  ];

  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    const re = new RegExp(pattern.source, pattern.flags);
    while ((match = re.exec(text)) !== null) {
      const context = text.slice(Math.max(0, match.index - 5), match.index + match[0].length + 10);

      // 排除「路径01」「步骤02」等编号，不是数量陈述
      if (/路径\s*\d{1,2}\s*[：:]|步骤\s*\d{1,2}|第\s*\d{1,2}\s*[页节]/.test(context)) {
        continue;
      }

      let numRaw: string;
      let attrRaw: string;

      if (/^(功效|优势|特点|模块|路径|步骤|阶段|收入来源|指标|维度|会话|城市|合作伙伴)/.test(match[1])) {
        attrRaw = match[1];
        numRaw = match[2];
      } else {
        numRaw = match[1];
        attrRaw = match[2];
      }

      const value = parseNumber(numRaw);
      if (value === null || value < 2 || value > 99) continue;

      // 「路径」「步骤」必须是明确的数量表达（N大/N条/N个），避免误报
      if (["路径", "步骤"].includes(attrRaw)) {
        const hasQuantifier = /大|个|条|种|项|点/.test(match[0]);
        const hasCountPhrase = new RegExp(`${numRaw}\\s*(大|个|条|种|项)`).test(match[0]);
        if (!hasQuantifier && !hasCountPhrase) continue;
      }

      const attribute = normalizeAttribute(attrRaw);
      const key = `${entity}|${attribute}|${value}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const start = Math.max(0, match.index - 10);
      const end = Math.min(text.length, match.index + match[0].length + 15);
      const snippet = text.slice(start, end).replace(/\n/g, " ").trim();

      claims.push({
        entity,
        attribute,
        value,
        display: `${value}${attrRaw.includes("大") ? "大" : "个"}${attrRaw}`,
        snippet,
      });
    }
  }

  return claims;
}

function claimsConflict(a: Claim, b: Claim): boolean {
  if (a.attribute !== b.attribute) return false;
  if (a.value === b.value) return false;

  // 同实体或至少一方为「通用」且属性相同
  if (a.entity !== b.entity && a.entity !== "通用" && b.entity !== "通用") {
    return false;
  }

  return true;
}

/** 比较两条知识点是否存在内容冲突 */
export function findContentConflictsBetween(
  a: KnowledgePoint,
  b: KnowledgePoint
): ContentConflict[] {
  if (a.id === b.id) return [];

  const claimsA = extractClaims(a);
  const claimsB = extractClaims(b);
  const conflicts: ContentConflict[] = [];
  const seen = new Set<string>();

  for (const ca of claimsA) {
    for (const cb of claimsB) {
      if (!claimsConflict(ca, cb)) continue;

      const pairKey = [a.id, b.id].sort().join("|") + `|${ca.attribute}`;
      if (seen.has(pairKey)) continue;
      seen.add(pairKey);

      conflicts.push({
        id: b.id,
        title: b.title,
        topic: ca.attribute.replace("数量", ""),
        myValue: ca.display,
        theirValue: cb.display,
        mySnippet: ca.snippet,
        theirSnippet: cb.snippet,
      });
    }
  }

  return conflicts;
}

/** 扫描整个库的内容冲突 */
export function scanContentConflicts(
  points: KnowledgePoint[]
): Record<string, ContentConflict[]> {
  const map: Record<string, ContentConflict[]> = {};

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i];
      const b = points[j];
      const ab = findContentConflictsBetween(a, b);
      const ba = findContentConflictsBetween(b, a);

      if (ab.length > 0) {
        if (!map[a.id]) map[a.id] = [];
        map[a.id].push(...ab);
      }
      if (ba.length > 0) {
        if (!map[b.id]) map[b.id] = [];
        for (const c of ba) {
          map[b.id].push({
            ...c,
            id: a.id,
            title: a.title,
            myValue: c.theirValue,
            theirValue: c.myValue,
            mySnippet: c.theirSnippet,
            theirSnippet: c.mySnippet,
          });
        }
      }
    }
  }

  // dedupe per point
  for (const id of Object.keys(map)) {
    const unique = new Map<string, ContentConflict>();
    for (const c of map[id]) {
      unique.set(`${c.id}|${c.topic}|${c.myValue}|${c.theirValue}`, c);
    }
    map[id] = Array.from(unique.values());
  }

  return map;
}

/** 新导入批次与已有库的内容冲突检测 */
export function checkImportContentConflicts(
  newPoints: KnowledgePoint[],
  existingPoints: KnowledgePoint[]
): Record<string, ContentConflict[]> {
  const conflicts: Record<string, ContentConflict[]> = {};

  for (const point of newPoints) {
    const all: ContentConflict[] = [];

    for (const existing of existingPoints) {
      all.push(...findContentConflictsBetween(point, existing));
    }

    for (const other of newPoints) {
      if (other.id === point.id) continue;
      all.push(...findContentConflictsBetween(point, other));
    }

    if (all.length > 0) {
      const unique = new Map<string, ContentConflict>();
      for (const c of all) {
        unique.set(`${c.id}|${c.topic}`, c);
      }
      conflicts[point.id] = Array.from(unique.values());
    }
  }

  return conflicts;
}

const DEFINITION_KEYWORDS = ["愿景", "使命", "定位", "核心理念", "价值主张", "标语"];

function localTextSimilarity(a: string, b: string): number {
  const na = a.toLowerCase().replace(/\s+/g, "");
  const nb = b.toLowerCase().replace(/\s+/g, "");
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  const shorter = na.length < nb.length ? na : nb;
  const longer = na.length < nb.length ? nb : na;
  if (longer.includes(shorter) && shorter.length > 10) return 0.9;
  let matches = 0;
  for (let i = 0; i < shorter.length - 1; i++) {
    if (longer.includes(shorter.slice(i, i + 2))) matches++;
  }
  return matches / Math.max(shorter.length, 1);
}

export function findDefinitionVariantGroups(points: KnowledgePoint[]): ConflictGroup[] {
  const groups: ConflictGroup[] = [];
  const paired = new Set<string>();

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i];
      const b = points[j];
      const pairKey = [a.id, b.id].sort().join("|");
      if (paired.has(pairKey)) continue;

      const textA = `${a.title} ${a.summary}`;
      const textB = `${b.title} ${b.summary}`;
      const sharedKw = DEFINITION_KEYWORDS.filter(
        (kw) => textA.includes(kw) && textB.includes(kw)
      );
      if (sharedKw.length === 0) continue;

      const bodySim = localTextSimilarity(a.body.slice(0, 400), b.body.slice(0, 400));
      const titleSim = localTextSimilarity(a.title, b.title);
      if (bodySim >= 0.85) continue;
      if (bodySim < 0.25 && titleSim < 0.3) continue;

      paired.add(pairKey);
      const topic = sharedKw[0];
      groups.push({
        id: `CG-DEF-${topic}-${pairKey.replace(/\|/g, "-")}`,
        topic: `${topic}（多种表述）`,
        type: "definition",
        memberIds: [a.id, b.id],
        allowedConflict: !!(a.conflictAllowed && b.conflictAllowed),
        note: a.conflictNote || b.conflictNote,
        details: [`${a.title} ↔ ${b.title}`],
      });
    }
  }

  return groups;
}

function memberIdsKey(ids: string[]): string {
  return [...ids].sort().join(",");
}

export function buildConflictGroups(points: KnowledgePoint[]): ConflictGroup[] {
  const pairMap = scanContentConflicts(points);
  const edges: Array<[string, string, string]> = [];

  for (const [id, conflicts] of Object.entries(pairMap)) {
    for (const c of conflicts) {
      edges.push([id, c.id, `${c.topic}：${c.myValue} vs ${c.theirValue}`]);
    }
  }

  const parent = new Map<string, string>();
  function find(x: string): string {
    if (!parent.has(x)) parent.set(x, x);
    if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!));
    return parent.get(x)!;
  }
  function union(a: string, b: string) {
    parent.set(find(a), find(b));
  }

  for (const [a, b] of edges) union(a, b);

  const clusters = new Map<string, { ids: Set<string>; details: Set<string> }>();
  for (const [a, b, detail] of edges) {
    const root = find(a);
    if (!clusters.has(root)) clusters.set(root, { ids: new Set(), details: new Set() });
    clusters.get(root)!.ids.add(a);
    clusters.get(root)!.ids.add(b);
    clusters.get(root)!.details.add(detail);
  }

  const numericGroups: ConflictGroup[] = [];
  for (const [root, { ids, details }] of clusters) {
    const memberIds = Array.from(ids);
    const members = memberIds.map((id) => points.find((p) => p.id === id)!).filter(Boolean);
    const topic = [...details][0]?.split("：")[0] || "内容冲突";
    const existingGroupId = members.find((m) => m.variantGroupId)?.variantGroupId;

    numericGroups.push({
      id: existingGroupId || `CG-NUM-${root.slice(0, 12)}`,
      topic,
      type: "numeric",
      memberIds,
      allowedConflict: members.length > 0 && members.every((m) => m.conflictAllowed),
      note: members.find((m) => m.conflictNote)?.conflictNote,
      details: Array.from(details),
    });
  }

  const defGroups = findDefinitionVariantGroups(points);

  const manualMap = new Map<string, string[]>();
  for (const p of points) {
    if (p.variantGroupId) {
      if (!manualMap.has(p.variantGroupId)) manualMap.set(p.variantGroupId, []);
      manualMap.get(p.variantGroupId)!.push(p.id);
    }
  }
  const manualGroups: ConflictGroup[] = [];
  for (const [gid, memberIds] of manualMap) {
    if (memberIds.length < 2) continue;
    const members = memberIds.map((id) => points.find((p) => p.id === id)!).filter(Boolean);
    manualGroups.push({
      id: gid,
      topic: members[0]?.title.slice(0, 20) || "自定义版本组",
      type: "mixed",
      memberIds,
      allowedConflict: members.every((m) => m.conflictAllowed),
      note: members.find((m) => m.conflictNote)?.conflictNote,
      details: members.map((m) => m.variantLabel || m.title),
    });
  }

  const all = [...numericGroups, ...defGroups, ...manualGroups];
  const seen = new Map<string, ConflictGroup>();
  for (const g of all) {
    const key = memberIdsKey(g.memberIds);
    if (!seen.has(key) || g.memberIds.length > seen.get(key)!.memberIds.length) {
      seen.set(key, g);
    }
  }
  return Array.from(seen.values());
}

export function getGroupForPoint(
  pointId: string,
  groups: ConflictGroup[]
): ConflictGroup | undefined {
  return groups.find((g) => g.memberIds.includes(pointId));
}
