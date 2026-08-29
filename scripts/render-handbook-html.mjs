/**
 * 把漂浮知识手册正文 Markdown 渲成阅读版 HTML（内容校对用，不是印刷排版）。
 * 运行：node scripts/render-handbook-html.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "exports/漂浮知识手册-v2/01-正文.md");
const out = path.join(root, "exports/漂浮知识手册-v2/阅读版.html");
const publicDir = path.join(root, "public/exports/漂浮知识手册-v2");

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(text) {
  let s = escapeHtml(text);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return s;
}

function slug(title) {
  return title
    .replace(/<[^>]+>/g, "")
    .replace(/[^\u4e00-\u9fff\w]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function parseTable(rows) {
  const parsed = rows.map((r) =>
    r
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim())
  );
  const head = parsed[0];
  const body = parsed.slice(2);
  return `<div class="table-wrap"><table><thead><tr>${head
    .map((c) => `<th>${inline(c)}</th>`)
    .join("")}</tr></thead><tbody>${body
    .map((row) => `<tr>${row.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
    .join("")}</tbody></table></div>`;
}

function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  const toc = [];
  let i = 0;
  let inCode = false;
  let codeBuf = [];

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCode) {
        out.push(`<pre class="ascii"><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
        codeBuf = [];
        inCode = false;
      } else {
        inCode = true;
      }
      i++;
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      i++;
      continue;
    }

    if (line.startsWith("# ")) {
      out.push(`<h1>${inline(line.slice(2))}</h1>`);
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      const title = line.slice(3).trim();
      const id = "s-" + slug(title);
      toc.push({ level: 2, title, id });
      out.push(`<h2 id="${id}">${inline(title)}</h2>`);
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      const title = line.slice(4).trim();
      const id = "s-" + slug(title);
      toc.push({ level: 3, title, id });
      out.push(`<h3 id="${id}">${inline(title)}</h3>`);
      i++;
      continue;
    }
    if (line === "---") {
      out.push("<hr />");
      i++;
      continue;
    }
    if (line.startsWith("> ")) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      const cls = buf[0].includes("编者按") ? "callout editor" : "callout";
      out.push(`<blockquote class="${cls}">${buf.map((b) => `<p>${inline(b)}</p>`).join("")}</blockquote>`);
      continue;
    }
    if (line.startsWith("| ")) {
      const buf = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        buf.push(lines[i]);
        i++;
      }
      out.push(parseTable(buf));
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        buf.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      out.push(`<ol>${buf.map((b) => `<li>${inline(b)}</li>`).join("")}</ol>`);
      continue;
    }
    if (line.startsWith("- ")) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("  - "))) {
        const nested = lines[i].startsWith("  - ");
        const text = lines[i].replace(/^\s*- /, "");
        items.push({ nested, text });
        i++;
      }
      let html = "<ul>";
      let inNested = false;
      for (const it of items) {
        if (it.nested && !inNested) {
          html += "<ul>";
          inNested = true;
        }
        if (!it.nested && inNested) {
          html += "</ul>";
          inNested = false;
        }
        html += `<li>${inline(it.text)}</li>`;
      }
      if (inNested) html += "</ul>";
      html += "</ul>";
      out.push(html);
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }
    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,3} |---|```|> |\| |\d+\. |- )/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    const hardBreak = buf.some((l) => / {2}$/.test(l));
    const htmlP = buf.map((l) => inline(l.replace(/ {2}$/, ""))).join(hardBreak ? "<br>" : " ");
    const raw = buf.join(" ");
    const cls =
      raw.startsWith("**内部使用") ||
      raw.startsWith("KNOWLEDGE") ||
      raw.startsWith("查阅手册") ||
      raw.startsWith("版权所有") ||
      raw.startsWith("**版本")
        ? "lede"
        : "";
    out.push(cls ? `<p class="${cls}">${htmlP}</p>` : `<p>${htmlP}</p>`);
  }

  const tocHtml = toc
    .filter((t) => t.level === 2)
    .map((t) => `<li><a href="#${t.id}">${escapeHtml(t.title)}</a></li>`)
    .join("");

  return { body: out.join("\n"), tocHtml };
}

const md = readFileSync(src, "utf8");
const { body, tocHtml } = mdToHtml(md);

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>漂浮方舟 · 漂浮知识手册（内部 · 内容版 v0.1）</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600&family=Noto+Serif+SC:wght@500;600;700&display=swap" rel="stylesheet" />
  <style>
    :root {
      --ink: #1c2a32;
      --muted: #5c6b73;
      --paper: #f7f1e8;
      --card: #fffdf8;
      --line: #d9cfc0;
      --teal: #0e4a56;
      --teal-deep: #082f38;
      --gold: #b0893e;
      --flag: #8b2e2e;
      --ok: #2c5f4a;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "SimSun", serif;
      color: var(--ink);
      background: var(--paper);
      line-height: 1.75;
    }
    .print-bar {
      position: sticky;
      top: 0;
      z-index: 20;
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px;
      background: #082f38;
      color: #f7f1e8;
      font-family: "Noto Sans SC", "PingFang SC", sans-serif;
      font-size: 13px;
    }
    .print-bar button {
      background: var(--gold);
      color: #082f38;
      border: 0;
      padding: 8px 14px;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .cover {
      background: linear-gradient(165deg, var(--teal-deep) 0%, var(--teal) 55%, #1a6a78 100%);
      color: #f7f1e8;
      min-height: 72vh;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 48px 8vw 56px;
    }
    .cover .brand { letter-spacing: 0.35em; font-size: 13px; opacity: 0.8; }
    .cover h1 {
      font-weight: 600;
      font-size: clamp(32px, 5vw, 56px);
      margin: 16px 0 8px;
      letter-spacing: 0.08em;
    }
    .cover .en { font-family: "Palatino Linotype", Palatino, serif; letter-spacing: 0.22em; opacity: 0.75; font-size: 14px; }
    .cover .meta { margin-top: 28px; font-size: 14px; opacity: 0.85; max-width: 40em; }
    .badge {
      display: inline-block;
      border: 1px solid rgba(247,241,232,0.45);
      padding: 4px 10px;
      font-size: 12px;
      letter-spacing: 0.12em;
      margin-bottom: 18px;
    }
    .layout {
      display: grid;
      grid-template-columns: 240px minmax(0, 760px);
      gap: 48px;
      max-width: 1100px;
      margin: 0 auto;
      padding: 48px 24px 96px;
    }
    nav.toc {
      position: sticky;
      top: 56px;
      align-self: start;
      font-family: "Noto Sans SC", "PingFang SC", sans-serif;
      font-size: 13px;
      line-height: 1.5;
    }
    nav.toc p { color: var(--gold); letter-spacing: 0.18em; font-size: 11px; margin: 0 0 12px; }
    nav.toc ol { margin: 0; padding: 0 0 0 18px; color: var(--muted); }
    nav.toc a { color: var(--muted); text-decoration: none; }
    nav.toc a:hover { color: var(--teal); }
    article h1 { display: none; }
    article h2 {
      font-size: 26px;
      color: var(--teal-deep);
      border-top: 2px solid var(--teal);
      padding-top: 28px;
      margin: 56px 0 16px;
      letter-spacing: 0.04em;
    }
    article h2:first-of-type { margin-top: 0; }
    article h3 { font-size: 18px; color: var(--teal); margin: 32px 0 8px; }
    article p { margin: 0 0 1em; }
    article .lede { color: var(--muted); font-size: 15px; }
    article ul, article ol { margin: 0 0 1em; padding-left: 1.4em; }
    article li { margin: 0.25em 0; }
    hr { border: 0; border-top: 1px solid var(--line); margin: 32px 0; }
    blockquote.callout {
      margin: 16px 0 24px;
      padding: 16px 20px;
      background: var(--card);
      border-left: 4px solid var(--gold);
    }
    blockquote.editor { border-left-color: var(--flag); background: #f8ece8; }
    blockquote p { margin: 0 0 0.5em; }
    blockquote p:last-child { margin: 0; }
    .table-wrap { overflow-x: auto; margin: 12px 0 24px; }
    table { border-collapse: collapse; width: 100%; font-size: 14px; font-family: "Noto Sans SC", "PingFang SC", sans-serif; }
    th, td { border: 1px solid var(--line); padding: 8px 10px; text-align: left; vertical-align: top; }
    th { background: #efe6d6; color: var(--teal-deep); }
    code { font-family: ui-monospace, monospace; font-size: 0.88em; background: #efe6d6; padding: 0 4px; }
    pre.ascii {
      background: var(--teal-deep);
      color: #e8f0f2;
      padding: 20px 24px;
      overflow-x: auto;
      font-size: 13px;
      line-height: 1.45;
    }
    pre.ascii code { background: none; color: inherit; }
    strong { color: var(--teal-deep); }
    footer.note {
      max-width: 1100px;
      margin: 0 auto 64px;
      padding: 0 24px;
      color: var(--muted);
      font-size: 13px;
      font-family: "Noto Sans SC", "PingFang SC", sans-serif;
    }
    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; }
      nav.toc { position: static; }
    }
    @page { size: A4; margin: 16mm 14mm 18mm; }
    @media print {
      .print-bar { display: none !important; }
      body { background: white; }
      .cover {
        min-height: 100vh;
        padding: 48mm 18mm 24mm;
        break-after: page;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      nav.toc {
        position: static;
        break-after: page;
        font-size: 14px;
        padding-top: 12mm;
      }
      nav.toc ol { columns: 1; }
      .layout { display: block; max-width: none; padding: 0; }
      article h2 { break-after: avoid; }
      article h3 { break-after: avoid; }
      table, blockquote, pre { break-inside: avoid; }
      a { color: inherit; text-decoration: none; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <span>内部文件 · 浏览器打开后点右侧按钮，目的选「另存为 PDF」，并勾选「背景图形」。</span>
    <button type="button" onclick="window.print()">打印 / 另存为 PDF</button>
  </div>
  <header class="cover">
    <div class="badge">INTERNAL · CONTENT DRAFT v0.1</div>
    <div class="brand">FLOATING ARK</div>
    <h1>漂浮知识手册</h1>
    <div class="en">KNOWLEDGE OF FLOATATION REST</div>
    <p class="meta">对照旧稿 40 页《漂浮疗法知识手册》与公司知识库重写。单文件 HTML，可用浏览器另存为 PDF。纸质编号发放，禁止外发原件。</p>
  </header>
  <div class="layout">
    <nav class="toc" aria-label="目录">
      <p>CONTENTS</p>
      <ol>${tocHtml}</ol>
    </nav>
    <article>
${body}
    </article>
  </div>
  <footer class="note">中友瑞水（北京）科技有限公司 · 内部文件 · 2026-08-29 内容版</footer>
</body>
</html>
`;

writeFileSync(out, html);
mkdirSync(publicDir, { recursive: true });
mkdirSync(path.join(root, "public/exports"), { recursive: true });
copyFileSync(out, path.join(publicDir, "阅读版.html"));
copyFileSync(out, path.join(root, "public/exports/float-handbook-v2.html"));
console.log("wrote", out);
console.log("public: /exports/float-handbook-v2.html");
