/**
 * 把 patent-drafts 下的 Markdown 报告转成 .docx，供非技术同事在 Word 里直接改。
 * 依赖 python-docx（scripts/md_to_docx.py 实际干活）。
 * 运行：node scripts/md-to-docx.mjs <输入.md> [输出.docx]
 */
import { spawnSync } from "child_process";
import path from "path";
import { existsSync } from "fs";

const input = process.argv[2];
if (!input) {
  console.error("用法：node scripts/md-to-docx.mjs <输入.md> [输出.docx]");
  process.exit(1);
}
const inPath = path.resolve(input);
if (!existsSync(inPath)) {
  console.error("找不到文件:", inPath);
  process.exit(1);
}
const outPath = path.resolve(process.argv[3] || inPath.replace(/\.md$/, ".docx"));

const py = path.join(process.cwd(), "scripts", "md_to_docx.py");
const res = spawnSync("python3", [py, inPath, outPath], { stdio: "inherit" });
process.exit(res.status ?? 1);
