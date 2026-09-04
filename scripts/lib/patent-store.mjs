/**
 * 专利库读写与校验的唯一入口。
 *
 * 每次有新思路要进库，复制 scripts/_template-new-batch.mjs 改内容即可，
 * 不要再手写 readFileSync/writeFileSync——校验规则集中在这里，
 * 漏字段、指错卡、重复 id 会在写盘前被拦下。
 *
 * 校验规则同时被 scripts/test-patent-library.mjs 复用，两边不会走偏。
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

export const KINDS = ["rule", "roadmap", "layout", "cluster", "retrieved", "gap", "draft"];
export const CLUSTERS = ["1", "2", "3", "4", "5", "6", "cross"];
export const RISKS = ["critical", "high", "medium", "low", "green"];
export const LIFECYCLES = ["active", "superseded", "killed", "stale"];
export const GROUPS = ["g1", "g2", "g3", "g4", "g5", "none"];

const ID_RE = /^PAT-[A-Z0-9]+-[A-Z0-9]+$/;

function dataPath(name) {
  return path.join(process.cwd(), "data", name);
}

/**
 * 全库校验。返回错误字符串数组，空数组表示通过。
 * 写盘前调用，测试里也调用同一个函数。
 */
export function validate(patents) {
  const errors = [];
  const ids = new Set();
  const push = (id, msg) => errors.push(`${id}: ${msg}`);

  for (const p of patents) {
    if (!ID_RE.test(p.id)) push(p.id, "id 格式不合法，应为 PAT-XXX-NNN");
    if (ids.has(p.id)) push(p.id, "id 重复");
    ids.add(p.id);

    if (!KINDS.includes(p.kind)) push(p.id, `kind 非法：${p.kind}`);
    if (!CLUSTERS.includes(p.cluster)) push(p.id, `cluster 非法：${p.cluster}`);
    if (p.risk && !RISKS.includes(p.risk)) push(p.id, `risk 非法：${p.risk}`);
    if (!LIFECYCLES.includes(p.lifecycle)) push(p.id, `lifecycle 缺失或非法：${p.lifecycle}`);
    if (!GROUPS.includes(p.group)) push(p.id, `group 缺失或非法：${p.group}`);

    for (const f of ["title", "summary", "body"]) {
      if (!p[f] || !String(p[f]).trim()) push(p.id, `${f} 不能为空`);
    }
    if (!Array.isArray(p.tags) || !p.tags.length) push(p.id, "tags 不能为空");
    if (!p.source?.file) push(p.id, "source.file 缺失");
    if (p.confidentiality !== "internal") push(p.id, "专利卡必须 internal，不得外发");
    if (p.status !== "approved") push(p.id, "status 应为 approved");

    if (p.kind === "retrieved" && !p.publicationNo) push(p.id, "检索卡必须有 publicationNo");

    if (p.lifecycle === "superseded" && !p.supersededBy) push(p.id, "已取代的卡必须写明被谁取代");
    if (p.supersededBy === p.id) push(p.id, "supersededBy 不能指向自己");

    if (p.lifecycle === "killed" && !/打掉原因|不建议投入|前提作废/.test(p.body)) {
      push(p.id, "已打掉的卡必须在正文写明打掉原因");
    }
    if (
      p.id.startsWith("PAT-IDEA") &&
      p.lifecycle === "active" &&
      !/待检索|待验证/.test(p.body)
    ) {
      push(p.id, "现行的方案卡必须写明还缺什么（待检索或待验证）");
    }
    if ((p.lifecycle === "killed" || p.lifecycle === "superseded") && p.group !== "none") {
      push(p.id, "已打掉或已取代的卡不得编进申请组");
    }
    // 方案卡必须带免责或打掉原因，否则会被当成已下的结论去用
    if (p.kind === "layout" && !/最终结论|不构成正式法律意见|打掉原因|不建议投入/.test(p.body)) {
      push(p.id, "方案卡必须带免责表述（不给出新颖性或创造性最终结论）或打掉原因");
    }
  }

  for (const p of patents) {
    for (const rid of p.relatedIds ?? []) {
      if (!ids.has(rid)) push(p.id, `relatedIds 指向不存在的卡：${rid}`);
    }
    if (p.supersededBy && !ids.has(p.supersededBy)) {
      push(p.id, `supersededBy 指向不存在的卡：${p.supersededBy}`);
    }
  }
  return errors;
}

/**
 * 打开一个入库批次。
 *
 * @param {object} opts
 * @param {string} opts.batchId   来源 id，形如 SRC-PAT-XXX
 * @param {string} opts.srcFile   批次名，会写进每张卡的 source.file
 * @param {string} opts.author    检索者与日期说明
 * @param {string} opts.now       ISO 时间戳，全批次统一
 * @param {string} opts.guardId   幂等键：这张卡已存在且无待改写内容时整批跳过
 * @param {string} [opts.note]    来源登记的备注
 */
export function openStore({ batchId, srcFile, author, now, guardId, note = "" }) {
  const patentsPath = dataPath("patents.json");
  const sourcesPath = dataPath("patent-sources.json");
  const patents = JSON.parse(readFileSync(patentsPath, "utf-8"));

  const additions = [];
  const patches = new Map();
  const appends = new Map();

  function add(item) {
    additions.push({
      id: item.id,
      kind: item.kind,
      title: item.title,
      summary: item.summary,
      body: item.body,
      tags: item.tags,
      cluster: item.cluster,
      risk: item.risk,
      lifecycle: item.lifecycle ?? "active",
      group: item.group ?? "none",
      supersededBy: item.supersededBy,
      publicationNo: item.publicationNo,
      jurisdiction: item.jurisdiction,
      techBranch: item.techBranch,
      relatedIds: item.relatedIds ?? [],
      examples: item.examples ?? [],
      source: { file: srcFile, location: item.loc ?? "公开检索（网络）", date: now.slice(0, 7), author },
      status: "approved",
      confidentiality: "internal",
      createdAt: now,
      updatedAt: now,
    });
  }

  /** 改写已有卡的字段。幂等：目标字段已是该值则不动。 */
  function patch(id, fields) {
    patches.set(id, { ...(patches.get(id) ?? {}), ...fields });
  }

  /** 在已有卡正文追加补注。幂等：正文已含该标记则不重复追加。 */
  function append(id, mark, text) {
    appends.set(id, { mark, text });
  }

  function commit() {
    const existing = new Set(patents.map((p) => p.id));
    const fresh = additions.filter((c) => !existing.has(c.id));

    let touched = 0;
    const out = [...patents, ...fresh].map((p) => {
      let next = p;
      const fields = patches.get(p.id);
      if (fields) {
        // 数组和对象要按值比，否则每次重跑都会判成有改动，幂等性就没了
        const same = (a, b) =>
          a === b || (typeof a === "object" && typeof b === "object" && JSON.stringify(a) === JSON.stringify(b));
        const changed = Object.entries(fields).some(([k, v]) => !same(next[k], v));
        if (changed) {
          next = { ...next, ...fields, updatedAt: now };
          touched += 1;
        }
      }
      const ap = appends.get(p.id);
      if (ap && !next.body.includes(ap.mark)) {
        next = { ...next, body: `${next.body}\n\n${ap.mark}${ap.text}`, updatedAt: now };
        touched += 1;
      }
      return next;
    });

    if (!fresh.length && !touched) {
      console.log(`${srcFile}：已入库且无待改写内容，跳过。总数: ${patents.length}`);
      return { skipped: true, total: patents.length };
    }

    const errors = validate(out);
    if (errors.length) {
      console.error(`校验未通过，已中止（共 ${errors.length} 条）：`);
      for (const e of errors.slice(0, 30)) console.error("  " + e);
      process.exit(1);
    }

    writeFileSync(patentsPath, JSON.stringify(out, null, 2) + "\n");

    const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
    const next = sources.filter((s) => s.id !== batchId);
    next.push({
      id: batchId,
      filename: srcFile,
      cluster: "cross",
      fileType: "other",
      uploadedAt: now,
      patentIds: additions.map((c) => c.id),
      status: "done",
      splitMode: "claude-agent",
      note,
    });
    writeFileSync(sourcesPath, JSON.stringify(next, null, 2) + "\n");

    const stat = out.reduce((a, p) => ({ ...a, [p.lifecycle]: (a[p.lifecycle] ?? 0) + 1 }), {});
    console.log(
      JSON.stringify(
        { batch: srcFile, inserted: fresh.map((c) => c.id), touched, total: out.length, lifecycle: stat },
        null,
        2
      )
    );
    return { skipped: false, total: out.length };
  }

  /** 幂等前置检查：guardId 已存在时，仍会继续跑，由 commit 判断有没有实际改动。 */
  function has(id) {
    return patents.some((p) => p.id === id);
  }

  return { add, patch, append, commit, has, guardId, patents };
}

export function readPatents() {
  return JSON.parse(readFileSync(dataPath("patents.json"), "utf-8"));
}
