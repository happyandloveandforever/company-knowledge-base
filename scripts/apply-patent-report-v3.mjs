/**
 * 整体报告 v3.0 入库：当前生效总图；沉默失效宽方案收窄；撰写菜单①～⑮。
 * 幂等：PAT-MAP-003 已存在则跳过。
 * 运行：node scripts/apply-patent-report-v3.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const now = "2026-09-04T12:00:00.000Z";
const srcFile = "专利布局整体报告-v3";
const author = "专利布局整体报告 v3.0（2026-09-04，过闸后撰写菜单）";

const dataDir = path.join(process.cwd(), "data");
const patentsPath = path.join(dataDir, "patents.json");
const sourcesPath = path.join(dataDir, "patent-sources.json");

const map003 = {
  id: "PAT-MAP-003",
  kind: "roadmap",
  cluster: "cross",
  risk: "critical",
  loc: "v3.0 总图",
  tags: ["v3.0", "当前生效总图", "撰写菜单", "沉默失效收窄"],
  techBranch: "平台路线",
  title: "报告v3.0：架构不改名；沉默失效宽方案收窄；①～⑮给专家选，不是马上提交",
  summary:
    "取代 v2.0 作为当前生效总图。两母案、不设母案3、去环境测试继续有效。没有高信心马上提交的大母专利。盐堵通气口宽方案已被包围。主线是多开撰写思路。",
  body:
    "源文件：patent-drafts/专利布局整体报告-v3.md 与同名 docx。给人看的一页菜单：patent-drafts/最终专利方案.md。\n\n三条核心结论：\n1 现在没有一件可以负责任地标成高信心马上提交的大母专利。\n2 主线仍是多开撰写思路，交给专利专家和技术专家选。过闸不是把清单收成只剩实验。\n3 架构不要改名。仍只立母案A（高盐多物理场稳定化）与母案B（高盐环境下的测量可信度）。紧急离舱、冷凝分流是撰写候选，专家选了再升。不设母案3。\n\n相对 v2.0 必须改口的一句：盐雾致盲不能再当确认站得住的独权。宽方案（盐堵过滤器+识别堵塞）见 PAT-PRI-043。只剩同暴露路径见证件，待验证。不要写「高盐蒸汽」。\n\n候选灯：①②④⑤红；③绿（含气泡高盐液声能测不准）；⑥～⑮黄。不要捆套沉默失效、EIS、液相补偿、冷凝分流。\n\n继续有效：绝对新颖性、去环境测试（含难题还是便宜）、第25条、组合须协同、取消20件硬指标、清水对照、A/B同日提交。",
  examples: [
    "对：把⑫～⑮摆上菜单，母案仍叫 A/B",
    "错：把沉默失效宽方案继续当确认站得住的独权，或把母案改名成紧急离舱",
  ],
  relatedIds: ["PAT-MAP-002", "PAT-EXT-002", "PAT-DRAFT-A4", "PAT-IDEA-003", "PAT-IDEA-012", "PAT-ROAD-A", "PAT-ROAD-B"],
};

const roadB = {
  id: "PAT-ROAD-B",
  kind: "roadmap",
  cluster: "cross",
  risk: "high",
  loc: "v3.0 第五章",
  tags: ["母案B", "已收窄", "见证件窄缝", "角度③"],
  techBranch: "母案B",
  title: "母案B（v3.0）：仍是高盐测量可信度；盐雾致盲宽方案已收窄，角度③升为测量类优先",
  summary:
    "收窄定位不变。v2.0 把盐雾致盲写成已验证亮点——本轮宽方案已被 PAT-PRI-043 包围。测量类目前最有希望的是含气泡高盐液声能测不准。",
  body:
    "被公知覆盖的原独权要素不变：驱动波形、参考传感器差分、时分复用、故障即超标（US12087146）、确定性状态机（IEC 61508）、优先级排序，都不能作发明点。\n\n还能写的方向（v3.0 改判）：\n- 盐雾致盲宽方案已包围。只剩同暴露路径见证件，待验证。不要写高盐蒸汽。见 PAT-DRAFT-A4、PAT-PRI-043。\n- 🟢 含气泡高盐液中声能测不准（PAT-IDEA-003）。不是限功率剂量包络。\n- 待验证：高导电率影响测量基准；高盐声阻抗差异；自由液面耦合路径。\n\n子案：B1中、B2低、B3中（亮点收窄为见证件）、B4低、B5低、B6低、B7低。⑫⑬不是把 B6 改写成一键开门。\n\n不设母案3仍有效。状态机 S0—S8 继续作工程规范与说明书实施例，不作发明点。",
  examples: [
    "对：独权写高盐特有测量失效，状态机写进说明书",
    "错：独权写盐堵过滤器+识别堵塞，或写成一键开门",
  ],
  relatedIds: ["PAT-ROAD-A", "PAT-MAP-003", "PAT-DRAFT-A4", "PAT-IDEA-003", "PAT-PRI-043", "PAT-NO3-001"],
};

const gap002 = {
  id: "PAT-GAP-002",
  kind: "gap",
  cluster: "cross",
  risk: "critical",
  loc: "v3.0 第九章",
  tags: ["清水对照组", "见证件", "气泡开关", "紧急支撑样机"],
  techBranch: "对照实验",
  title: "对照实验优先级（v3.0）：见证件、气泡开关声压、紧急支撑样机、冷凝淡层",
  summary:
    "没有对照，创造性无从证明。v2.0 的「盐雾致盲对照决定底稿生死」改为：见证件能否比真实滤膜更早劣化，决定 A4 窄缝；同时并行③⑫⑭。",
  body:
    "每一项都要有清水（或无盐高湿）对照。\n1 见证件对照：高盐 vs 清水 vs 无盐高湿；电路自检仍正常时，见证件能不能更早反映扩散受限 → A4 窄缝生死。\n2 角度③：气泡开/关各测一次舱内声压。差很小则③不成立。\n3 ⑫样机：无机构/固定扶手/转换机构，不同漂移位置起身。\n4 ⑭：实际舱有没有稳定淡层。没有就停。\n5 问工程师：是否同时装氢气与臭氧。若不会，第一件底稿前提不成立。\n\n液路/热场/导电率/气体安全/低刺激环境的对照仍要做，但不再压过上面四条。本卡优先于 PAT-GAP-001。",
  examples: [
    "对：见证件与真实滤膜同朝向对照，记录谁先劣化",
    "错：只测自己的设备，没有对照，还把宽方案盐堵当已证发明点",
  ],
  relatedIds: ["PAT-GAP-001", "PAT-MAP-003", "PAT-DRAFT-A4", "PAT-IDEA-003", "PAT-IDEA-012", "PAT-IDEA-014"],
};

function card(item, prev) {
  return {
    id: item.id,
    kind: item.kind,
    title: item.title,
    summary: item.summary,
    body: item.body,
    tags: item.tags,
    cluster: item.cluster,
    risk: item.risk,
    techBranch: item.techBranch,
    relatedIds: item.relatedIds || [],
    examples: item.examples || [],
    source: { file: srcFile, location: item.loc, date: "2026-09", author },
    status: "approved",
    confidentiality: "internal",
    createdAt: prev?.createdAt || now,
    updatedAt: now,
  };
}

const patents = JSON.parse(readFileSync(patentsPath, "utf-8"));
if (patents.some((p) => p.id === "PAT-MAP-003")) {
  console.log("整体报告 v3.0 已入库，跳过。总数:", patents.length);
  process.exit(0);
}

const built = {
  "PAT-MAP-003": card(map003, null),
  "PAT-ROAD-B": card(roadB, patents.find((p) => p.id === "PAT-ROAD-B")),
  "PAT-GAP-002": card(gap002, patents.find((p) => p.id === "PAT-GAP-002")),
};

let out = patents.map((p) => built[p.id] || p);
const mapAt = out.map((p) => p.id).lastIndexOf("PAT-MAP-002");
out =
  mapAt === -1
    ? [...out, built["PAT-MAP-003"]]
    : [...out.slice(0, mapAt + 1), built["PAT-MAP-003"], ...out.slice(mapAt + 1)];

const ids = out.map((p) => p.id);
if (ids.length !== new Set(ids).size) {
  console.error("出现重复 id，已中止", ids.filter((id, i) => ids.indexOf(id) !== i));
  process.exit(1);
}

writeFileSync(patentsPath, JSON.stringify(out, null, 2) + "\n");

const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const srcId = "SRC-PAT-REPORT-V3";
const next = sources.filter((s) => s.id !== srcId);
next.push({
  id: srcId,
  filename: srcFile,
  cluster: "cross",
  fileType: "other",
  uploadedAt: now,
  patentIds: ["PAT-MAP-003", "PAT-ROAD-B", "PAT-GAP-002"],
  status: "done",
  splitMode: "claude-agent",
  note: "整体报告 v3.0：当前生效总图；沉默失效宽方案收窄；撰写菜单①～⑮。",
});
writeFileSync(sourcesPath, JSON.stringify(next, null, 2) + "\n");

console.log(JSON.stringify({ inserted: ["PAT-MAP-003"], revised: ["PAT-ROAD-B", "PAT-GAP-002"], total: out.length }, null, 2));
