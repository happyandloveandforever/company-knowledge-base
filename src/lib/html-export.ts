import type { KnowledgePoint } from "./types";
import {
  LAYER_LABELS,
  USAGE_LABELS,
  getLayer,
  getUsage,
  countByLayer,
  countInternalOnly,
  isInternalOnly,
} from "./knowledge-layers";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function groupByCategory(points: KnowledgePoint[]): Map<string, KnowledgePoint[]> {
  const map = new Map<string, KnowledgePoint[]>();
  for (const p of points) {
    const cat = p.category || "未分类";
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(p);
  }
  return map;
}

export function generateLibraryHtml(points: KnowledgePoint[]): string {
  const grouped = groupByCategory(points);
  const categories = Array.from(grouped.keys()).sort();
  const allTags = Array.from(new Set(points.flatMap((p) => p.tags))).sort();
  const now = new Date().toLocaleString("zh-CN");
  const layers = countByLayer(points);
  const internal = countInternalOnly(points);

  const navItems = categories
    .map((cat) => `<li><a href="#cat-${encodeURIComponent(cat)}">${escapeHtml(cat)} (${grouped.get(cat)!.length})</a></li>`)
    .join("\n");

  const sections = categories
    .map((cat) => {
      const items = grouped.get(cat)!;
      const cards = items
        .map(
          (kp) => `
        <article class="kp-card" id="${kp.id}" data-tags="${escapeHtml(kp.tags.join(","))}" data-status="${kp.status}" data-layer="${getLayer(kp)}" data-usage="${getUsage(kp)}">
          <header>
            <h3>${escapeHtml(kp.title)}</h3>
            <div class="badges">
              ${isInternalOnly(kp) ? `<span class="internal">仅内训 · 禁止外发</span>` : ""}
              <span class="layer layer-${getLayer(kp)}">${LAYER_LABELS[getLayer(kp)]}</span>
              <span class="usage">${USAGE_LABELS[getUsage(kp)]}</span>
              <span class="status status-${kp.status}">${statusLabel(kp.status)}</span>
            </div>
          </header>
          <p class="summary">${escapeHtml(kp.summary)}</p>
          <div class="meta">
            <span class="tag-list">${kp.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</span>
            <span class="duration">约 ${kp.durationMin} 分钟</span>
          </div>
          <details>
            <summary>查看完整内容</summary>
            <div class="body">${escapeHtml(kp.body).replace(/\n/g, "<br>")}</div>
            ${kp.examples.length ? `<div class="examples"><strong>示例：</strong>${kp.examples.map(escapeHtml).join("；")}</div>` : ""}
            <div class="source">
              来源：${escapeHtml(kp.source.file)}${kp.source.location ? ` · ${escapeHtml(kp.source.location)}` : ""}
            </div>
          </details>
        </article>`
        )
        .join("\n");

      return `
      <section class="category" id="cat-${encodeURIComponent(cat)}">
        <h2>${escapeHtml(cat)}</h2>
        <div class="kp-grid">${cards}</div>
      </section>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>公司知识总库</title>
  <style>
    :root {
      --primary: #1e3a5f;
      --accent: #2563eb;
      --bg: #f8fafc;
      --card: #ffffff;
      --text: #1f2937;
      --muted: #6b7280;
      --border: #e5e7eb;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }
    .header {
      background: var(--primary);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    .header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .header p { opacity: 0.8; }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; display: grid; grid-template-columns: 240px 1fr; gap: 2rem; }
    @media (max-width: 768px) { .container { grid-template-columns: 1fr; } }
    .sidebar {
      position: sticky; top: 1rem; align-self: start;
      background: var(--card); border-radius: 12px; padding: 1.5rem;
      border: 1px solid var(--border);
    }
    .sidebar h3 { font-size: 0.875rem; color: var(--muted); margin-bottom: 0.75rem; text-transform: uppercase; }
    .sidebar ul { list-style: none; }
    .sidebar li { margin-bottom: 0.5rem; }
    .sidebar a { color: var(--accent); text-decoration: none; font-size: 0.9rem; }
    .sidebar a:hover { text-decoration: underline; }
    .search-box {
      width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border);
      border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem;
    }
    .stats { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; }
    .stat { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 1rem 1.5rem; }
    .stat strong { display: block; font-size: 1.5rem; color: var(--primary); }
    .stat span { font-size: 0.875rem; color: var(--muted); }
    .category { margin-bottom: 2.5rem; }
    .category h2 {
      font-size: 1.25rem; color: var(--primary); margin-bottom: 1rem;
      padding-bottom: 0.5rem; border-bottom: 2px solid var(--accent);
    }
    .kp-grid { display: grid; gap: 1rem; }
    .kp-card {
      background: var(--card); border: 1px solid var(--border); border-radius: 12px;
      padding: 1.25rem; transition: box-shadow 0.2s;
    }
    .kp-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .kp-card header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem; gap: 0.75rem; }
    .kp-card h3 { font-size: 1rem; flex: 1; }
    .badges { display: flex; flex-wrap: wrap; gap: 0.25rem; justify-content: flex-end; }
    .status { font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 999px; white-space: nowrap; }
    .status-draft { background: #fef3c7; color: #92400e; }
    .status-review { background: #dbeafe; color: #1e40af; }
    .status-approved { background: #d1fae5; color: #065f46; }
    .layer, .usage { font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 999px; white-space: nowrap; }
    .layer-commons { background: #dbeafe; color: #1e40af; }
    .layer-company { background: #e2e8f0; color: #334155; }
    .usage { border: 1px solid var(--border); color: var(--muted); }
    .internal { font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 999px; white-space: nowrap; background: #fee2e2; color: #991b1b; font-weight: 600; }
    .summary { color: var(--muted); font-size: 0.9rem; margin-bottom: 0.75rem; }
    .meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .tag { display: inline-block; background: #eff6ff; color: var(--accent); font-size: 0.75rem; padding: 0.1rem 0.5rem; border-radius: 999px; margin-right: 0.25rem; }
    .duration { font-size: 0.75rem; color: var(--muted); }
    details summary { cursor: pointer; color: var(--accent); font-size: 0.875rem; }
    .body { margin-top: 0.75rem; font-size: 0.9rem; white-space: pre-wrap; }
    .source, .examples { margin-top: 0.5rem; font-size: 0.8rem; color: var(--muted); }
    .footer { text-align: center; padding: 2rem; color: var(--muted); font-size: 0.875rem; }
  </style>
</head>
<body>
  <header class="header">
    <h1>公司知识总库</h1>
    <p>结构化知识点 · 可检索 · 可复用 · 可导出</p>
  </header>
  <div class="container">
    <aside class="sidebar">
      <input type="text" class="search-box" id="search" placeholder="搜索知识点…" oninput="filterCards()">
      <h3>知识分类</h3>
      <ul>${navItems}</ul>
      <h3 style="margin-top:1.5rem">标签</h3>
      <div class="tag-list">${allTags.map((t) => `<span class="tag" style="margin-bottom:0.25rem">${escapeHtml(t)}</span>`).join(" ")}</div>
    </aside>
    <main>
      <div class="stats">
        <div class="stat"><strong>${points.length}</strong><span>知识点总数</span></div>
        <div class="stat"><strong>${layers.commons}</strong><span>通识层</span></div>
        <div class="stat"><strong>${layers.company}</strong><span>公司自有层</span></div>
        <div class="stat"><strong>${internal}</strong><span>仅内训</span></div>
        <div class="stat"><strong>${points.filter((p) => p.status === "approved").length}</strong><span>已批准</span></div>
      </div>
      ${sections}
    </main>
  </div>
  <footer class="footer">生成时间：${now} · 由知识库系统自动导出</footer>
  <script>
    function filterCards() {
      const q = document.getElementById('search').value.toLowerCase();
      document.querySelectorAll('.kp-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? '' : 'none';
      });
    }
  </script>
</body>
</html>`;
}

function statusLabel(status: string): string {
  switch (status) {
    case "approved": return "已批准";
    case "review": return "待审核";
    default: return "草稿";
  }
}
