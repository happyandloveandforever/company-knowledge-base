import { readFileSync } from "fs";
import { execSync } from "child_process";
import path from "path";

const root = process.cwd();
const phrases = JSON.parse(
  readFileSync(path.join(root, "scripts/bjhg-mental-health-invest-phrases.json"), "utf8")
);
const html = readFileSync(
  path.join(root, "public/decks/bjhg-mental-health-invest/index.html"),
  "utf8"
);

const missingHtml = phrases.filter((p) => !html.includes(p));
if (missingHtml.length) {
  console.error("HTML missing phrases:", missingHtml);
  process.exit(1);
}
console.log(`HTML ok: ${phrases.length} phrases present`);

const pptxPath = path.join(root, "exports/漂浮方舟_北京化工集团_心理健康产业投资交流_精排版.pptx");
const extracted = execSync(
  `python3 - <<'PY'
import zipfile
from xml.etree import ElementTree as ET
z = zipfile.ZipFile(${JSON.stringify(pptxPath)})
texts = []
for name in z.namelist():
    if name.startswith("ppt/slides/slide") and name.endswith(".xml"):
        root = ET.fromstring(z.read(name))
        for t in root.findall(".//{http://schemas.openxmlformats.org/drawingml/2006/main}t"):
            if t.text:
                texts.append(t.text)
print("\\n".join(texts))
PY`,
  { encoding: "utf8" }
);

const missingPpt = phrases.filter((p) => !extracted.includes(p));
if (missingPpt.length) {
  console.error("PPTX missing phrases:", missingPpt);
  process.exit(1);
}
console.log(`PPTX ok: ${phrases.length} phrases present`);
console.log("PASS");
