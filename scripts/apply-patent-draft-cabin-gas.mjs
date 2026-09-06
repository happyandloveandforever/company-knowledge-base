/**
 * 幂等：空舱气相消杀发明专利申请正文底稿入库。
 * 不新立 IDEA。新增 PAT-DRAFT-028。
 * 运行：node scripts/apply-patent-draft-cabin-gas.mjs
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { openStore } from "./lib/patent-store.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MARK = "【2026-09-06 申请正文底稿】";

if (!existsSync(join(ROOT, "patent-drafts/申请文件底稿-空舱气相消杀.md"))) {
  throw new Error("missing 申请文件底稿-空舱气相消杀.md");
}

const BATCH = {
  batchId: "SRC-PAT-DRAFT-CABIN-GAS",
  srcFile: "申请文件底稿-空舱气相消杀",
  author: "空舱气相消杀申请正文 2026-09-06（不构成正式法律意见）",
  now: "2026-09-06T09:00:00.000Z",
  guardId: "PAT-DRAFT-028",
  note: "用户确认新机已改齐。按专利法结构写出说明书+权利要求书+摘要底稿。权要由代理师定稿。不编杀菌率。",
};

const store = openStore(BATCH);

store.add({
  id: "PAT-DRAFT-028",
  kind: "draft",
  cluster: "1",
  risk: "high",
  lifecycle: "active",
  group: "g1",
  loc: "发明专利申请正文底稿",
  tags: ["申请底稿", "空舱气相", "通气孔分态", "仅内部"],
  techBranch: "组一撰写",
  title: "空舱气相消杀申请正文已起草：通气孔分态+臭氧仅入气腔+三态互斥，权要代理师定稿",
  summary:
    "按中国发明专利说明书结构起草。新机为实施例。独权落在通气孔分态、臭氧液路断开、三态互斥，不主张冲洗/紫外/光触媒本身，不写杀菌率。",
  body:
    "本卡不构成正式法律意见，不给出新颖性或创造性最终结论。全文：patent-drafts/申请文件底稿-空舱气相消杀.md。权要由代理师定稿（PAT-WRITE-002）。\n\n" +
    "用户确认机子已改为新机。说明书以新机为实施例1，过滤位为实施例2，冲洗水不回罐为实施例3（优选从权）。\n\n" +
    "独权：占用时通气孔强制打开、激发光源硬件断电、臭氧不对气腔供气；空舱处理时排空+占用假+门关+冲洗完成+通气孔关或过滤后，臭氧只进气腔；气腔臭氧低于探头厂家预定阈才许回填。臭氧唯一出口进气腔，液路盲断。\n\n" +
    "前序已知：排空（PAT-PRI-069）、冲壁（PAT-PRI-070）、循环UV+臭氧（PAT-PRI-065）。不写灭活率、溴酸盐、霜层、余光、治疗/迷走/40Hz。方法权要声明非疾病诊断治疗方法（PAT-RULE-004）。建议发明+实用新型同日，实用新型删方法权要。\n\n" +
    "阈值不编 ppm，按探头制造商说明书设定。占用检测具体选型、孔位数量、涂层具体涂面由实施例用「至少一种」覆盖，代理师可按实物收窄。",
  examples: [
    "对：把说明书和权利要求书交给代理师按新机实物核对附图后再递",
    "错：把杀菌率或编造的 ppm 写进权利要求",
    "错：把本件当著作权登记文本去版权中心登记来代替专利申请",
  ],
  relatedIds: [
    "PAT-INDEX-001",
    "PAT-WRITE-007",
    "PAT-WRITE-002",
    "PAT-IDEA-028",
    "PAT-RULE-004",
    "PAT-RULE-007",
    "PAT-PRI-065",
    "PAT-PRI-069",
    "PAT-PRI-070",
  ],
});

store.append(
  "PAT-INDEX-001",
  MARK,
  "空舱气相消杀发明专利申请正文底稿已出：patent-drafts/申请文件底稿-空舱气相消杀.md，状态卡 PAT-DRAFT-028。权要代理师定稿。余光仍暂停。"
);

store.append(
  "PAT-WRITE-007",
  MARK,
  "新机已改齐。正在写的件已从交底书推进到申请正文底稿 PAT-DRAFT-028。首页下载申请正文。仍不写杀菌率，余光仍暂停。"
);

store.append(
  "PAT-IDEA-028",
  MARK,
  "申请正文底稿已按新机实施例写出，见 PAT-DRAFT-028。待验证：代理师按实物核对孔位、占用信号类型、涂层涂面和探头型号后定稿权要。壁面刮菌对照仍不写入说明书。"
);

store.commit();
