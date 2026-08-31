import type { KnowledgePoint } from "./types";

const LAYER: Record<string, string> = { commons: "通识层", company: "公司自有层" };
const USAGE: Record<string, string> = {
  pitch: "汇报/提案",
  training: "培训",
  ops: "运营SOP",
  both: "汇报+培训",
};

export const PREFIX_LABEL: Record<string, string> = {
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
  "KP-MAN": "产品手册运营",
  "KP-VGMECH": "迷走机制报告",
  "KP-CIS": "综合干预专业版",
  "KP-VNSMAP": "VNS手段地图",
};

export function publicPoints(points: KnowledgePoint[]): KnowledgePoint[] {
  return points.filter((p) => p.internalOnly !== true);
}

export function vagusPoints(points: KnowledgePoint[]): KnowledgePoint[] {
  return publicPoints(points).filter((p) =>
    /^(KP-VGMECH|KP-CIS|KP-VNSMAP|KP-MECH|KP-V7)-/.test(p.id)
  );
}

export function pointPrefix(id: string): string {
  const m = id.match(/^(KP-[A-Z0-9]+)/);
  return m ? m[1] : "other";
}

export function countByPrefix(points: KnowledgePoint[]) {
  const map = new Map<string, { total: number; public: number; internalOnly: number }>();
  for (const p of points) {
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

export function prefixLine(points: KnowledgePoint[]): string {
  return countByPrefix(points)
    .map((r) => `${r.prefix.replace(/^KP-/, "")} ${r.public || r.total}`)
    .join(" · ");
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

export function inventoryTable(all: KnowledgePoint[]): string {
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

export function renderPublicPage(opts: {
  title: string;
  lead: string;
  extraNav: string;
  items: KnowledgePoint[];
  total?: number;
  internalOnly?: number;
  inventoryAll?: KnowledgePoint[];
}): string {
  const commons = opts.items.filter((p) => p.layer === "commons").length;
  const toc = opts.items
    .map((p) => `<li><a href="#${esc(p.id)}">${esc(p.id)} ${esc(p.title)}</a></li>`)
    .join("\n");
  const inventory = opts.inventoryAll ? inventoryTable(opts.inventoryAll) : "";
  const thisPageLine = prefixLine(opts.items);
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
<h1>${esc(opts.title)}</h1>
<p>${esc(opts.lead)}</p>
<nav>${opts.extraNav}</nav>
<p class="stats">总库 ${esc(String(opts.total ?? opts.items.length))} 条已合并 · 本页 ${opts.items.length} 条可外发 · 通识 ${commons} · 公司 ${opts.items.length - commons} · 仅内训 ${esc(String(opts.internalOnly ?? 0))} 条未收录（不是没合并）</p>
<p class="inv-line">本页分源：${esc(thisPageLine)}</p>
${inventory}
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

export function renderCatalogPage(all: KnowledgePoint[]): string {
  const external = publicPoints(all);
  const internal = all.length - external.length;
  return `<!DOCTYPE html>
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
<nav>${PUBLIC_NAV}</nav>
<p class="stats">总库 ${all.length} 条已合并 · 可外发 ${external.length} 条 · 仅内训 ${internal} 条（KP-TRN）不进 /open</p>
${inventoryTable(all)}
<p>完整正文：<a href="/open">/open</a>。迷走三份新稿：VGMECH / CIS / VNSMAP，都在可外发里。</p>
<footer>公开只读镜像 · 仅内训卡未收录</footer>
</body>
</html>`;
}

export const PUBLIC_NAV =
  '<a href="/open">可外发总库</a><a href="/open/catalog">来源清单</a><a href="/open/vagus">迷走/综合干预专页</a><a href="/open/knowledge-external.json">JSON（部分工具读不了）</a>';
