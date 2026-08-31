/**
 * 生成只读公开站：网页浏览 + JSON（给外部 AI 直接 GET，不走 GitHub 登录）。
 * 运行：node scripts/export-public-site.mjs
 * 输出：public-site/  （不入库，由 GitHub Actions 发布到 Pages）
 */
import { mkdirSync, writeFileSync, readFileSync, copyFileSync } from "fs";
import path from "path";

const root = process.cwd();
const outDir = path.join(root, "public-site");
mkdirSync(outDir, { recursive: true });

const points = JSON.parse(readFileSync(path.join(root, "data/knowledge-points.json"), "utf-8"));
const sources = JSON.parse(readFileSync(path.join(root, "data/sources.json"), "utf-8"));
const external = points.filter((p) => p.internalOnly !== true);

writeFileSync(path.join(outDir, "knowledge-points.json"), JSON.stringify(points));
writeFileSync(path.join(outDir, "knowledge-external.json"), JSON.stringify(external));
copyFileSync(path.join(root, "data/sources.json"), path.join(outDir, "sources.json"));

writeFileSync(
  path.join(outDir, "health.json"),
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

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>公司知识库（公开只读）</title>
  <style>
    :root { --primary:#1e3a5f; --accent:#2563eb; --bg:#f8fafc; --card:#fff; --text:#1f2937; --muted:#6b7280; --border:#e5e7eb; }
    * { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif; background:var(--bg); color:var(--text); line-height:1.55; }
    header { background:linear-gradient(135deg,#1e40af,#1e3a5f); color:#fff; padding:1.75rem 1.25rem; }
    header h1 { font-size:1.6rem; }
    header p { opacity:.85; margin-top:.4rem; max-width:52rem; }
    .wrap { max-width:1100px; margin:0 auto; padding:1.25rem; }
    .links { display:flex; flex-wrap:wrap; gap:.5rem; margin:.9rem 0 0; }
    .links a { background:#fff; color:#1e3a5f; text-decoration:none; font-size:.85rem; padding:.35rem .7rem; border-radius:999px; }
    .toolbar { display:flex; flex-wrap:wrap; gap:.6rem; margin:1rem 0; align-items:center; }
    input, select { padding:.5rem .7rem; border:1px solid var(--border); border-radius:8px; font-size:.95rem; }
    input[type=search] { flex:1; min-width:16rem; }
    .stats { display:flex; gap:.6rem; flex-wrap:wrap; margin-bottom:1rem; }
    .stat { background:var(--card); border:1px solid var(--border); border-radius:10px; padding:.7rem 1rem; min-width:6.5rem; }
    .stat b { display:block; font-size:1.25rem; color:var(--primary); }
    .stat span { font-size:.8rem; color:var(--muted); }
    .card { background:var(--card); border:1px solid var(--border); border-radius:12px; padding:1rem 1.1rem; margin-bottom:.75rem; }
    .card h3 { font-size:1.02rem; }
    .id { font-size:.75rem; color:var(--muted); margin-left:.35rem; }
    .badges { display:flex; flex-wrap:wrap; gap:.25rem; margin:.35rem 0; }
    .badges span { font-size:.72rem; padding:.12rem .45rem; border-radius:999px; }
    .layer-commons { background:#dbeafe; color:#1e40af; }
    .layer-company { background:#e2e8f0; color:#334155; }
    .internal { background:#fee2e2; color:#991b1b; font-weight:600; }
    .approved { background:#d1fae5; color:#065f46; }
    .draft { background:#fef3c7; color:#92400e; }
    .summary { color:var(--muted); font-size:.9rem; }
    details { margin-top:.4rem; }
    summary { cursor:pointer; color:var(--accent); font-size:.875rem; }
    .body { white-space:pre-wrap; font-size:.9rem; margin-top:.5rem; }
    .empty { color:var(--muted); padding:2rem; text-align:center; }
    footer { text-align:center; color:var(--muted); font-size:.8rem; padding:2rem; }
  </style>
</head>
<body>
  <header>
    <div class="wrap">
      <h1>公司知识库 · 公开只读</h1>
      <p>用浏览器直接看。给外部 AI 请发下面的 JSON 链接（不是 GitHub 仓库页，也不要登录授权）。</p>
      <div class="links">
        <a href="./knowledge-external.json">给外部 AI 的 JSON（不含内训）</a>
        <a href="./knowledge-points.json">完整 JSON（含内训）</a>
        <a href="./sources.json">来源清单</a>
        <a href="./health.json">条数健康检查</a>
      </div>
    </div>
  </header>
  <div class="wrap">
    <div class="stats" id="stats"></div>
    <div class="toolbar">
      <input id="q" type="search" placeholder="搜索标题、正文、编号…" />
      <select id="layer">
        <option value="">全部层级</option>
        <option value="commons">通识层</option>
        <option value="company">公司自有层</option>
      </select>
      <label><input id="hideInternal" type="checkbox" checked /> 隐藏仅内训</label>
    </div>
    <div id="list" class="empty">正在加载…</div>
  </div>
  <footer>只读镜像 · 更新以 GitHub main 为准 · 编辑请在 Cursor 知识库项目里进行</footer>
  <script>
    const LAYER = { commons: "通识层", company: "公司自有层" };
    const USAGE = { pitch: "汇报/提案", training: "培训", ops: "运营SOP", both: "汇报+培训" };
    let all = [];
    function render() {
      const q = document.getElementById("q").value.trim().toLowerCase();
      const layer = document.getElementById("layer").value;
      const hideInternal = document.getElementById("hideInternal").checked;
      const rows = all.filter((p) => {
        if (hideInternal && p.internalOnly) return false;
        if (layer && (p.layer || "company") !== layer) return false;
        if (!q) return true;
        const blob = [p.id, p.title, p.summary, p.body, (p.tags||[]).join(" ")].join("\\n").toLowerCase();
        return blob.includes(q);
      });
      const list = document.getElementById("list");
      if (!rows.length) { list.className = "empty"; list.textContent = "没有匹配的知识点"; return; }
      list.className = "";
      list.innerHTML = rows.map((p) => {
        const layerKey = p.layer || "company";
        const badges = [
          p.internalOnly ? '<span class="internal">仅内训 · 禁止外发</span>' : "",
          '<span class="layer-' + layerKey + '">' + (LAYER[layerKey] || layerKey) + "</span>",
          "<span>" + (USAGE[p.usage] || p.usage || "") + "</span>",
          '<span class="' + (p.status === "approved" ? "approved" : "draft") + '">' + (p.status === "approved" ? "已批准" : p.status) + "</span>"
        ].join("");
        const src = (p.source && p.source.file) ? p.source.file : "";
        const body = (p.body || "").replace(/[&<>]/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;" }[c]));
        const title = (p.title || "").replace(/[&<>]/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;" }[c]));
        const summary = (p.summary || "").replace(/[&<>]/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;" }[c]));
        return '<article class="card"><h3>' + title + ' <span class="id">' + p.id + '</span></h3><div class="badges">' + badges + '</div><p class="summary">' + summary + '</p><details><summary>查看正文 · ' + src + '</summary><div class="body">' + body + "</div></details></article>";
      }).join("");
    }
    fetch("./knowledge-points.json").then((r) => r.json()).then((data) => {
      all = data;
      const internal = data.filter((p) => p.internalOnly).length;
      const commons = data.filter((p) => p.layer === "commons").length;
      document.getElementById("stats").innerHTML = [
        ["知识点", data.length],
        ["通识层", commons],
        ["公司层", data.length - commons],
        ["仅内训", internal],
        ["可外发", data.length - internal]
      ].map(([k,v]) => '<div class="stat"><b>' + v + "</b><span>" + k + "</span></div>").join("");
      render();
    }).catch(() => {
      document.getElementById("list").textContent = "加载失败。请确认本页和 knowledge-points.json 在同一目录。";
    });
    document.getElementById("q").addEventListener("input", render);
    document.getElementById("layer").addEventListener("change", render);
    document.getElementById("hideInternal").addEventListener("change", render);
  </script>
</body>
</html>
`;

writeFileSync(path.join(outDir, "index.html"), html);

console.log(
  JSON.stringify(
    {
      outDir,
      points: points.length,
      external: external.length,
      sources: sources.length,
    },
    null,
    2
  )
);
