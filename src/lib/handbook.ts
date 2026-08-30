import { promises as fs } from "fs";
import path from "path";
import { HANDBOOK_EDITOR_SNIPPET } from "./handbook-editor-snippet";

export const HANDBOOK_ID = "float-therapy-manual";
export const HANDBOOK_TITLE = "漂浮疗法手册｜紧凑详实版";
export const HANDBOOK_FILENAME = "漂浮疗法手册｜紧凑详实版.html";

const HANDBOOK_PATH = path.join(
  process.cwd(),
  "data",
  "handbooks",
  "float-therapy-manual.html"
);
const HANDBOOK_BACKUP_PATH = path.join(
  process.cwd(),
  "data",
  "handbooks",
  "float-therapy-manual.bak.html"
);

const BOOK_RE = /<main class="book compact-version">[\s\S]*?<\/main>/;
const MAX_BOOK_BYTES = 2_000_000;

export async function readHandbookHtml(): Promise<string> {
  return fs.readFile(HANDBOOK_PATH, "utf-8");
}

export function replaceBookHtml(fullHtml: string, bookOuterHtml: string): string {
  const cleaned = stripEditorAttrs(bookOuterHtml).trim();
  if (!/^<main[\s>]/i.test(cleaned) || !/<\/main>\s*$/i.test(cleaned)) {
    throw new Error("手册正文格式不正确");
  }
  if (!/\bclass="[^"]*\bbook\b/.test(cleaned)) {
    throw new Error("手册正文缺少 book 容器");
  }
  if (Buffer.byteLength(cleaned, "utf-8") > MAX_BOOK_BYTES) {
    throw new Error("手册正文过大");
  }
  if (!fullHtml.includes('<main class="book compact-version">')) {
    throw new Error("源文件找不到手册正文");
  }
  return fullHtml.replace(BOOK_RE, cleaned);
}

export function injectHandbookEditor(fullHtml: string): string {
  if (fullHtml.includes('id="kb-handbook-editor"')) return fullHtml;
  if (!fullHtml.includes("</body>")) {
    return `${fullHtml}${HANDBOOK_EDITOR_SNIPPET}`;
  }
  return fullHtml.replace("</body>", `${HANDBOOK_EDITOR_SNIPPET}\n</body>`);
}

export async function saveHandbookBook(bookOuterHtml: string): Promise<void> {
  const current = await readHandbookHtml();
  const next = replaceBookHtml(current, bookOuterHtml);
  await fs.mkdir(path.dirname(HANDBOOK_PATH), { recursive: true });
  await fs.copyFile(HANDBOOK_PATH, HANDBOOK_BACKUP_PATH).catch(() => undefined);
  await fs.writeFile(HANDBOOK_PATH, next, "utf-8");
}

function stripEditorAttrs(html: string): string {
  return html
    .replace(/\scontenteditable="[^"]*"/gi, "")
    .replace(/\sspellcheck="[^"]*"/gi, "")
    .replace(/\sdata-kb-editing="[^"]*"/gi, "");
}
