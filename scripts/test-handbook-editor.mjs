/**
 * 手册可视化编辑：正文替换、编辑器注入、非法保存被拒绝。
 * 运行：node scripts/test-handbook-editor.mjs
 */
import { readFileSync } from "fs";
import path from "path";

const BOOK_RE = /<main class="book compact-version">[\s\S]*?<\/main>/;

function stripEditorAttrs(html) {
  return html
    .replace(/\scontenteditable="[^"]*"/gi, "")
    .replace(/\sspellcheck="[^"]*"/gi, "")
    .replace(/\sdata-kb-editing="[^"]*"/gi, "");
}

function replaceBookHtml(fullHtml, bookOuterHtml) {
  const cleaned = stripEditorAttrs(bookOuterHtml).trim();
  if (!/^<main[\s>]/i.test(cleaned) || !/<\/main>\s*$/i.test(cleaned)) {
    throw new Error("手册正文格式不正确");
  }
  if (!/\bclass="[^"]*\bbook\b/.test(cleaned)) {
    throw new Error("手册正文缺少 book 容器");
  }
  if (!BOOK_RE.test(fullHtml)) {
    throw new Error("源文件找不到手册正文");
  }
  return fullHtml.replace(BOOK_RE, cleaned);
}

let failed = 0;
function check(name, ok, detail = "") {
  if (ok) console.log(`PASS ${name}`);
  else {
    failed += 1;
    console.log(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const html = readFileSync(
  path.join(process.cwd(), "data", "handbooks", "float-therapy-manual.html"),
  "utf-8"
);
const snippet = readFileSync(
  path.join(process.cwd(), "src", "lib", "handbook-editor-snippet.ts"),
  "utf-8"
);

check("源文件是紧凑详实版", html.includes("<title>漂浮疗法手册｜紧凑详实版</title>"));
check("源文件有 compact 正文", html.includes('<main class="book compact-version">'));
check("可见正文含封面标题", html.includes("漂浮不是神秘体验"));
check("旧版归档藏在 template", html.includes('<template id="previous-version-archive">'));

const nextBook = `<main class="book compact-version" contenteditable="true">
    <section class="page" id="c01"><h1>可视化改字测试标题</h1></section>
  </main>`;
const replaced = replaceBookHtml(html, nextBook);
const mainOnly = replaced.match(BOOK_RE)[0];
const archive = replaced.slice(replaced.indexOf("<template"));

check("替换后正文有新标题", mainOnly.includes("可视化改字测试标题"));
check("保存时去掉 contenteditable", !mainOnly.includes("contenteditable"));
check("替换后封面原句不在正文", !mainOnly.includes("漂浮不是神秘体验"));
check("旧版归档仍在", archive.includes("previous-version-archive"));
check("样式还在", replaced.includes("--paper:#f2eee5"));

check("编辑器片段含工具条", snippet.includes('id="kb-handbook-editor"'));
check("编辑器会自动保存", snippet.includes("/api/handbook"));
check("编辑器可跳页", snippet.includes("kb-page-jump"));

let threw = false;
try {
  replaceBookHtml(html, "<div>nope</div>");
} catch {
  threw = true;
}
check("拒绝非 main 正文", threw);

threw = false;
try {
  replaceBookHtml(html, '<main class="other">x</main>');
} catch {
  threw = true;
}
check("拒绝缺少 book 的 main", threw);

if (failed) {
  console.error(`\n${failed} checks failed`);
  process.exit(1);
}
console.log("\nall handbook editor checks passed");
