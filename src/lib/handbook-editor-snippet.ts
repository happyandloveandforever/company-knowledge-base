/** Injected into the handbook HTML so the printed layout itself is the editor. */
export const HANDBOOK_EDITOR_SNIPPET = `
<style id="kb-handbook-editor-style">
  #kb-handbook-editor{
    position:fixed;left:0;right:0;top:0;z-index:1000;
    display:flex;align-items:center;gap:10px;flex-wrap:wrap;
    padding:10px 16px;background:#191b18;color:#fffdf8;
    font:600 13px/1.4 "Noto Sans SC","Microsoft YaHei",sans-serif;
    box-shadow:0 8px 24px rgba(0,0,0,.28)
  }
  #kb-handbook-editor .kb-brand{font-weight:800;letter-spacing:.04em;color:#e6c56a;white-space:nowrap}
  #kb-handbook-editor .kb-hint{color:#d7d0c6;font-weight:500;flex:1;min-width:180px}
  #kb-handbook-editor .kb-status{font-size:12px;color:#d9a48f;min-width:92px}
  #kb-handbook-editor .kb-status.ok{color:#b7d3b8}
  #kb-handbook-editor select,#kb-handbook-editor button{
    border:0;border-radius:4px;padding:8px 12px;font:700 12px/1 "Noto Sans SC","Microsoft YaHei",sans-serif;cursor:pointer
  }
  #kb-handbook-editor select{background:#fffdf8;color:#191b18;max-width:240px}
  #kb-handbook-editor button.primary{background:#c95738;color:#fff}
  #kb-handbook-editor button.ghost{background:#fffdf8;color:#191b18}
  body.kb-editing{padding-top:58px}
  body.kb-editing > .print-btn{display:none!important}
  main.book[contenteditable="true"] .page:focus-within{
    outline:2px solid #c95738;outline-offset:3px
  }
  @media print{
    #kb-handbook-editor{display:none!important}
    body.kb-editing{padding-top:0}
  }
</style>
<div id="kb-handbook-editor" data-kb-chrome="1">
  <span class="kb-brand">点文字即可改</span>
  <span class="kb-hint">点手册里的任何字就能改，停一下会自动保存。Ctrl+S 也可保存。</span>
  <span class="kb-status" id="kb-status">就绪</span>
  <select id="kb-page-jump" title="跳到某一页"></select>
  <button type="button" class="primary" id="kb-save">保存</button>
  <button type="button" class="ghost" id="kb-download">下载 HTML</button>
  <button type="button" class="ghost" id="kb-print">导出 PDF</button>
</div>
<script id="kb-handbook-editor-script">
(function () {
  const book = document.querySelector("main.book");
  const statusEl = document.getElementById("kb-status");
  const jump = document.getElementById("kb-page-jump");
  if (!book) return;

  document.body.classList.add("kb-editing");
  book.setAttribute("contenteditable", "true");
  book.setAttribute("spellcheck", "false");
  book.setAttribute("data-kb-editing", "1");

  let dirty = false;
  let saving = false;
  let timer = 0;

  function setStatus(text, ok) {
    statusEl.textContent = text;
    statusEl.classList.toggle("ok", !!ok);
  }

  function snapshot() {
    const clone = book.cloneNode(true);
    clone.removeAttribute("contenteditable");
    clone.removeAttribute("spellcheck");
    clone.removeAttribute("data-kb-editing");
    return clone.outerHTML;
  }

  document.querySelectorAll("main.book a").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });

  const pages = Array.from(document.querySelectorAll("main.book .page"));
  jump.innerHTML = pages.map(function (page, i) {
    const heading = page.querySelector("h1, h2, h3");
    const raw = heading ? heading.innerText.replace(/\\s+/g, " ").slice(0, 22) : (page.id || "页");
    const label = (i + 1) + " · " + raw;
    return '<option value="' + page.id + '">' + label.replace(/</g, "") + "</option>";
  }).join("");
  jump.addEventListener("change", function () {
    const target = document.getElementById(jump.value);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  book.addEventListener("input", function () {
    dirty = true;
    setStatus("未保存");
    clearTimeout(timer);
    timer = setTimeout(save, 1600);
  });

  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      save();
    }
  });

  window.addEventListener("beforeunload", function (e) {
    if (dirty) { e.preventDefault(); e.returnValue = ""; }
  });

  async function save() {
    if (saving) return;
    saving = true;
    setStatus("保存中…");
    try {
      const res = await fetch("/api/handbook", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookHtml: snapshot() })
      });
      const data = await res.json().catch(function () { return {}; });
      if (!res.ok) throw new Error(data.error || "保存失败");
      dirty = false;
      setStatus("已保存", true);
    } catch (err) {
      setStatus(err.message || "保存失败");
    } finally {
      saving = false;
    }
  }

  document.getElementById("kb-save").addEventListener("click", save);
  document.getElementById("kb-print").addEventListener("click", function () { window.print(); });
  document.getElementById("kb-download").addEventListener("click", function () {
    const a = document.createElement("a");
    a.href = "/api/handbook?download=1";
    a.download = "漂浮疗法手册｜紧凑详实版.html";
    a.click();
  });
})();
</script>
`;
