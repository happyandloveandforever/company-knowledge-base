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

function page({ title, lead, extraNav, items }) {
  const commons = items.filter((p) => p.layer === "commons").length;
  const toc = items
    .map((p) => `<li><a href="#${esc(p.id)}">${esc(p.id)} ${esc(p.title)}</a></li>`)
    .join("\n");
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
.stats{color:#334155;margin:.6rem 0 1rem}
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
<p class="stats">本页 ${items.length} 条 · 通识 ${commons} · 公司 ${items.length - commons} · 不含仅内训卡</p>
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
  '<a href="./">可外发总库</a><a href="./vagus.html">迷走/综合干预专页</a>';

const indexHtml = page({
  title: "公司知识库（可外发，只读网页）",
  lead: "这是 HTML 网页，不是 GitHub 仓库，也不是 JSON。请直接抓取本页正文。internalOnly 内训卡已排除。",
  extraNav: nav,
  items: external,
});
const vagusHtml = page({
  title: "漂浮方舟迷走神经与综合干预知识点",
  lead: "含作用机制报告、综合干预专业版、VNS 手段地图，以及库内既有机理/v7 相关卡。给外部 AI 优先抓这一页。",
  extraNav: nav,
  items: vagus,
});

for (const dir of [publicSite, docsDir]) {
  writeFileSync(path.join(dir, "index.html"), indexHtml);
  writeFileSync(path.join(dir, "vagus.html"), vagusHtml);
}

console.log(
  JSON.stringify(
    {
      index: external.length,
      vagus: vagus.length,
      indexBytes: Buffer.byteLength(indexHtml),
      vagusBytes: Buffer.byteLength(vagusHtml),
      docs: docsDir,
    },
    null,
    2
  )
);
