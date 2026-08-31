import type { KnowledgePoint } from "./types";

const LAYER: Record<string, string> = { commons: "通识层", company: "公司自有层" };
const USAGE: Record<string, string> = {
  pitch: "汇报/提案",
  training: "培训",
  ops: "运营SOP",
  both: "汇报+培训",
};

export function publicPoints(points: KnowledgePoint[]): KnowledgePoint[] {
  return points.filter((p) => p.internalOnly !== true);
}

export function vagusPoints(points: KnowledgePoint[]): KnowledgePoint[] {
  return publicPoints(points).filter((p) =>
    /^(KP-VGMECH|KP-CIS|KP-VNSMAP|KP-MECH|KP-V7)-/.test(p.id)
  );
}

function esc(text: unknown): string {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function article(p: KnowledgePoint): string {
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

export function renderPublicPage(opts: {
  title: string;
  lead: string;
  extraNav: string;
  items: KnowledgePoint[];
}): string {
  const commons = opts.items.filter((p) => p.layer === "commons").length;
  const toc = opts.items
    .map((p) => `<li><a href="#${esc(p.id)}">${esc(p.id)} ${esc(p.title)}</a></li>`)
    .join("\n");
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(opts.title)}</title>
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
<h1>${esc(opts.title)}</h1>
<p>${esc(opts.lead)}</p>
<nav>${opts.extraNav}</nav>
<p class="stats">本页 ${opts.items.length} 条 · 通识 ${commons} · 公司 ${opts.items.length - commons} · 不含仅内训卡</p>
<nav class="toc">
<p><strong>目录</strong></p>
<ol>
${toc}
</ol>
</nav>
${opts.items.map(article).join("\n")}
<footer>公开只读镜像 · 仅内训卡未收录</footer>
</body>
</html>`;
}

export const PUBLIC_NAV =
  '<a href="/open">可外发总库</a><a href="/open/vagus">迷走/综合干预专页</a><a href="/open/knowledge-external.json">JSON（部分工具读不了）</a>';
