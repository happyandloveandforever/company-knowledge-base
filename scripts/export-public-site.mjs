/**
 * 生成只读公开站。
 * 关键：把知识点正文写进 HTML，让只能抓网页、不能解析 JSON 的 AI 也能读到。
 * 默认页面不含 internalOnly 内训卡。
 *
 * 运行：node scripts/export-public-site.mjs
 * 输出：
 *   docs/*.html     进 Git，jsDelivr 当网页抓
 *   public-site/    不入库，给 GitHub Pages 用
 */
import { mkdirSync, writeFileSync, readFileSync, copyFileSync } from "fs";
import path from "path";

const root = process.cwd();
const publicSite = path.join(root, "public-site");
const docsDir = path.join(root, "docs");
mkdirSync(publicSite, { recursive: true });
mkdirSync(docsDir, { recursive: true });

const points = JSON.parse(readFileSync(path.join(root, "data/knowledge-points.json"), "utf-8"));
const sources = JSON.parse(readFileSync(path.join(root, "data/sources.json"), "utf-8"));
const external = points.filter((p) => p.internalOnly !== true);
const vagus = points.filter((p) => /^(KP-VGMECH|KP-CIS|KP-VNSMAP|KP-MECH|KP-V7)-/.test(p.id) && p.internalOnly !== true);

writeFileSync(path.join(publicSite, "knowledge-points.json"), JSON.stringify(points));
writeFileSync(path.join(publicSite, "knowledge-external.json"), JSON.stringify(external));
copyFileSync(path.join(root, "data/sources.json"), path.join(publicSite, "sources.json"));
writeFileSync(
  path.join(publicSite, "health.json"),
  JSON.stringify(
    {
      ok: true,
      points: points.length,
      external: external.length,
      internalOnly: points.length - external.length,
      sources: sources.length,
      generatedAt: new Date().toISOString(),
    },
    null,
    2
  )
);

function esc(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const LAYER = { commons: "通识层", company: "公司自有层" };
const USAGE = { pitch: "汇报/提案", training: "培训", ops: "运营SOP", both: "汇报+培训" };
const PREFIX_LABEL = {
  "KP-FAF": "杨浦财务",
  "KP-B2B": "B端定稿",
  "KP-BRAND": "品牌画册",
  "KP-MECH": "方舟机理",
  "KP-V7": "漂浮方舟v7",
  "KP-BG2": "增强背景",
  "KP-CHAMP": "冠军系列",
  "KP-CRAFT": "宣讲设计",
  "KP-MEDW": "医用失重舱",
  "KP-MEV": "论文主题",
  "KP-SAN": "消杀",
  "KP-EXP": "核心实验",
  "KP-WEB": "公开文献",
  "KP-YFOP": "优浮运营",
  "KP-MEDF": "医学诊疗",
  "KP-SOP": "SOP手册",
  "KP-COM": "通识前沿",
  "KP-TRN": "漂浮培训（仅内训）",
  "KP-ATOM": "内部原子库（仅内训）",
  "KP-RX": "疗法叙事脊柱（仅内训）",
  "KP-MAN": "产品手册运营",
  "KP-VGMECH": "迷走机制报告",
  "KP-CIS": "综合干预专业版",
  "KP-VNSMAP": "VNS手段地图",
};

function pointPrefix(id) {
  const m = String(id).match(/^(KP-[A-Z0-9]+)/);
  return m ? m[1] : "other";
}

function countByPrefix(list) {
  const map = new Map();
  for (const p of list) {
    const prefix = pointPrefix(p.id);
    const cur = map.get(prefix) || { total: 0, public: 0, internalOnly: 0 };
    cur.total += 1;
    if (p.internalOnly === true) cur.internalOnly += 1;
    else cur.public += 1;
    map.set(prefix, cur);
  }
  return [...map.entries()].map(([prefix, c]) => ({
    prefix,
    label: PREFIX_LABEL[prefix] || prefix,
    ...c,
  }));
}

function prefixLine(list) {
  return countByPrefix(list)
    .map((r) => `${r.prefix.replace(/^KP-/, "")} ${r.public || r.total}`)
    .join(" · ");
}

function inventoryTable(all) {
  const rows = countByPrefix(all)
    .map((r) => {
      const onPage = r.internalOnly === r.total ? "未收录（仅内训）" : `已收录 ${r.public}`;
      return `<tr><td>${esc(r.prefix)}</td><td>${esc(r.label)}</td><td>${r.total}</td><td>${onPage}</td></tr>`;
    })
    .join("\n");
  return `<table class="inv">
<thead><tr><th>前缀</th><th>来源</th><th>总库</th><th>可外发页</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>`;
}

function article(p) {
  const layer = p.layer || "company";
  const usage = p.usage || "both";
  const tags = (p.tags || []).map(esc).join("、");
  const loc = p.source?.location ? ` · ${esc(p.source.location)}` : "";
  return `<article id="${esc(p.id)}" data-layer="${esc(layer)}" data-usage="${esc(usage)}">
<h2>${esc(p.title)} <small>${esc(p.id)}</small></h2>
<p class="meta">${esc(LAYER[layer] || layer)} · ${esc(USAGE[usage] || usage)} · ${esc(p.status)} · ${tags}</p>
<p class="summary">${esc(p.summary)}</p>
<div class="body">${esc(p.body).replace(/\n/g, "<br>")}</div>
<p class="src">来源：${esc(p.source?.file || "")}${loc}</p>
</article>`;
}

function page({ title, lead, extraNav, items, showInventory }) {
  const commons = items.filter((p) => p.layer === "commons").length;
  const toc = items
    .map((p) => `<li><a href="#${esc(p.id)}">${esc(p.id)} ${esc(p.title)}</a></li>`)
    .join("\n");
  const internalOnly = points.length - external.length;
  const inventory = showInventory ? inventoryTable(points) : "";
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(title)}</title>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;max-width:920px;margin:0 auto;padding:1.25rem;line-height:1.55;color:#1f2937;background:#f8fafc}
h1{font-size:1.5rem}
h2{font-size:1.05rem;margin:0 0 .35rem}
h2 small{font-weight:400;color:#6b7280;font-size:.8rem}
nav a{margin-right:.8rem}
.stats,.inv-line{color:#334155;margin:.6rem 0 1rem}
.inv{width:100%;border-collapse:collapse;background:#fff;margin:1rem 0;font-size:.9rem}
.inv th,.inv td{border:1px solid #e5e7eb;padding:.4rem .55rem;text-align:left}
.inv th{background:#f1f5f9}
.toc{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:1rem 1.2rem;margin:1rem 0}
.toc li{margin:.2rem 0;font-size:.9rem}
article{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:1rem 1.1rem;margin:0 0 .9rem}
.meta,.src{color:#6b7280;font-size:.82rem}
.summary{color:#374151}
.body{margin:.6rem 0;white-space:normal}
footer{color:#6b7280;font-size:.8rem;margin:2rem 0;text-align:center}
</style>
</head>
<body>
<h1>${esc(title)}</h1>
<p>${esc(lead)}</p>
<nav>${extraNav}</nav>
<p class="stats">总库 ${points.length} 条已合并 · 本页 ${items.length} 条可外发 · 通识 ${commons} · 公司 ${items.length - commons} · 仅内训 ${internalOnly} 条未收录（不是没合并）</p>
<p class="inv-line">本页分源：${esc(prefixLine(items))}</p>
${inventory}
<nav class="toc">
<p><strong>目录</strong></p>
<ol>
${toc}
</ol>
</nav>
${items.map(article).join("\n")}
<footer>公开只读镜像 · 更新以 GitHub main 为准 · 仅内训卡未收录</footer>
</body>
</html>`;
}

const nav =
  '<a href="./">可外发总库</a><a href="./catalog.html">来源清单</a><a href="./vagus.html">迷走/综合干预专页</a>';

const catalogHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>公司知识库来源清单（已合并）</title>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;max-width:920px;margin:0 auto;padding:1.25rem;line-height:1.55;color:#1f2937;background:#f8fafc}
nav a{margin-right:.8rem}
.inv{width:100%;border-collapse:collapse;background:#fff;margin:1rem 0;font-size:.95rem}
.inv th,.inv td{border:1px solid #e5e7eb;padding:.45rem .6rem;text-align:left}
.inv th{background:#f1f5f9}
.stats{color:#334155}
footer{color:#6b7280;font-size:.8rem;margin:2rem 0;text-align:center}
</style>
</head>
<body>
<h1>公司知识库来源清单（已合并）</h1>
<p>总库已经合并进 Git，不是没合并。可外发页故意不收仅内训卡。</p>
<nav>${nav}</nav>
<p class="stats">总库 ${points.length} 条已合并 · 可外发 ${external.length} 条 · 仅内训 ${points.length - external.length} 条（KP-TRN / KP-ATOM / KP-RX）不进公开页</p>
${inventoryTable(points)}
<p>完整正文：<a href="./index.html">index.html</a>。迷走三份新稿：VGMECH / CIS / VNSMAP，都在可外发里。</p>
<footer>公开只读镜像 · 仅内训卡未收录</footer>
</body>
</html>`;

const indexHtml = page({
  title: "公司知识库（可外发，只读网页）",
  lead: `总库已合并 ${points.length} 条，不是没合并。本页 ${external.length} 条可外发（含迷走机制 22、综合干预 18、VNS 地图 16）。仅内训 ${points.length - external.length} 条不进本页。`,
  extraNav: nav,
  items: external,
  showInventory: true,
});
const vagusHtml = page({
  title: "漂浮方舟迷走神经与综合干预知识点",
  lead: `已合并进总库。本页只是迷走/综合干预子集 ${vagus.length} 条，不是总库。完整可外发总库见 index.html（${external.length} 条）。`,
  extraNav: nav,
  items: vagus,
  showInventory: false,
});

for (const dir of [publicSite, docsDir]) {
  writeFileSync(path.join(dir, "index.html"), indexHtml);
  writeFileSync(path.join(dir, "vagus.html"), vagusHtml);
  writeFileSync(path.join(dir, "catalog.html"), catalogHtml);
}

console.log(
  JSON.stringify(
    {
      index: external.length,
      vagus: vagus.length,
      catalogBytes: Buffer.byteLength(catalogHtml),
      indexBytes: Buffer.byteLength(indexHtml),
      vagusBytes: Buffer.byteLength(vagusHtml),
      docs: docsDir,
    },
    null,
    2
  )
);
