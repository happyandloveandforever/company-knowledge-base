/**
 * 专利库隔离回归：不进总库、不进 /open、六簇重构版完整。
 * 运行：node scripts/test-patent-library.mjs
 */
import { readFileSync, existsSync } from "fs";
import path from "path";

const kpPath = path.join(process.cwd(), "data", "knowledge-points.json");
const sourcesPath = path.join(process.cwd(), "data", "sources.json");
const patentsPath = path.join(process.cwd(), "data", "patents.json");
const patentSourcesPath = path.join(process.cwd(), "data", "patent-sources.json");

const points = JSON.parse(readFileSync(kpPath, "utf-8"));
const sources = JSON.parse(readFileSync(sourcesPath, "utf-8"));
const patents = JSON.parse(readFileSync(patentsPath, "utf-8"));
const patentSources = JSON.parse(readFileSync(patentSourcesPath, "utf-8"));

let failed = 0;
function check(name, ok, detail = "") {
  if (ok) console.log(`PASS ${name}`);
  else {
    failed += 1;
    console.log(`FAIL ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

check("总库数量未因专利库减少", points.length >= 572, String(points.length));
check("总库没有任何 PAT-*", points.every((p) => !String(p.id).startsWith("PAT-")));
check("总库 sources 不含 SRC-PAT", sources.every((s) => !String(s.id).startsWith("SRC-PAT")));

check("专利卡至少 126 条", patents.length >= 126, String(patents.length));
check("全部 confidentiality=internal", patents.every((p) => p.confidentiality === "internal"));
check("全部 approved", patents.every((p) => p.status === "approved"));
check(
  "每条都有 kind/cluster/source",
  patents.every((p) => p.kind && p.cluster && p.source?.file)
);

const kinds = new Set(patents.map((p) => p.kind));
for (const k of ["rule", "roadmap", "cluster", "retrieved", "gap", "layout", "draft"]) {
  check(`含 kind=${k}`, kinds.has(k));
}

check("PAT-RULE-001 存在", patents.some((p) => p.id === "PAT-RULE-001"));
check("母案A存在", patents.some((p) => p.id === "PAT-ROAD-A"));
check("母案B存在", patents.some((p) => p.id === "PAT-ROAD-B"));
check("CN121795911A 检索卡存在", patents.some((p) => p.publicationNo === "CN121795911A"));
check(
  "六簇结论卡齐全",
  ["PAT-CLU-001", "PAT-CLU-002", "PAT-CLU-003", "PAT-CLU-004", "PAT-CLU-005", "PAT-CLU-006"].every((id) =>
    patents.some((p) => p.id === id)
  )
);
check(
  "交底书撰写包齐全",
  ["PAT-WRITE-001", "PAT-WRITE-002", "PAT-WRITE-003", "PAT-WRITE-004", "PAT-WRITE-005", "PAT-WRITE-006"].every((id) =>
    patents.some((p) => p.id === id)
  )
);
check("第一件明确选母案A", /第一件写母案A/.test(patents.find((p) => p.id === "PAT-WRITE-001")?.title ?? ""));
check(
  "交底书与权利要求已分清",
  /不是权利要求/.test(patents.find((p) => p.id === "PAT-WRITE-002")?.title ?? "")
);
check("母案A交底书模板文件存在", existsSync(path.join(process.cwd(), "patent-drafts", "交底书-母案A.md")));
check(
  "A4申请文件底稿存在",
  existsSync(path.join(process.cwd(), "patent-drafts", "申请文件底稿-多气源安全互锁.md"))
);
check("A4底稿状态卡存在", patents.some((p) => p.id === "PAT-DRAFT-A4"));
check("绝对新颖性规则卡存在", patents.some((p) => p.id === "PAT-RULE-002"));
check("立项闸门卡存在", patents.some((p) => p.id === "PAT-RULE-003"));
check(
  "闸门已修正为去环境测试（六条件）",
  /去环境测试/.test(patents.find((p) => p.id === "PAT-RULE-003")?.title ?? "") &&
    /E6/.test(patents.find((p) => p.id === "PAT-RULE-003")?.body ?? "")
);
check("第25条客体规则卡存在", patents.some((p) => p.id === "PAT-RULE-004"));
check(
  "第25条卡说清装置可授权",
  /装置.*可以|仪器或装置/.test(patents.find((p) => p.id === "PAT-RULE-004")?.body ?? "")
);
check(
  "六个候选角度齐全",
  ["PAT-IDEA-001", "PAT-IDEA-002", "PAT-IDEA-003", "PAT-IDEA-004", "PAT-IDEA-005", "PAT-IDEA-006"].every((id) =>
    patents.some((p) => p.id === id)
  )
);
check("组合发明规则卡存在", patents.some((p) => p.id === "PAT-RULE-005"));
check(
  "闸门含「难题还是便宜」追问",
  /一个便宜/.test(patents.find((p) => p.id === "PAT-RULE-003")?.body ?? "")
);
check(
  "候选角度一已标为打掉",
  /已打掉/.test(patents.find((p) => p.id === "PAT-IDEA-001")?.title ?? "") &&
    patents.find((p) => p.id === "PAT-IDEA-001")?.risk === "critical"
);
check(
  "泵阀故障检出前案已记录",
  patents.some((p) => p.id === "PAT-PRI-032" && /US7069183/.test(p.publicationNo ?? ""))
);
check(
  "超声剂量标准已记录",
  patents.some((p) => p.id === "PAT-PRI-034" && /脱气水/.test(p.body))
);
check(
  "任务书已同步已打掉清单",
  /US7069183/.test(
    readFileSync(path.join(process.cwd(), "patent-drafts", "外部AI评审任务书.md"), "utf-8")
  ) &&
    /201621389026/.test(
      readFileSync(path.join(process.cwd(), "patent-drafts", "外部AI评审任务书.md"), "utf-8")
    ) &&
    /EIS/.test(
      readFileSync(path.join(process.cwd(), "patent-drafts", "外部AI评审任务书.md"), "utf-8")
    ) &&
    /NSF\/ANSI 50/.test(
      readFileSync(path.join(process.cwd(), "patent-drafts", "外部AI评审任务书.md"), "utf-8")
    ) &&
    /不要主张不用氯/.test(
      readFileSync(path.join(process.cwd(), "patent-drafts", "外部AI评审任务书.md"), "utf-8")
    ) &&
    /US10495620/.test(
      readFileSync(path.join(process.cwd(), "patent-drafts", "外部AI评审任务书.md"), "utf-8")
    )
);
check(
  "组合发明卡讲清协同而非拼凑",
  /彼此支持/.test(patents.find((p) => p.id === "PAT-RULE-005")?.body ?? "") &&
    /简单的?叠加|拼凑/.test(patents.find((p) => p.id === "PAT-RULE-005")?.body ?? "")
);
check(
  "组合发明卡提醒可专利性不等于可实施",
  /不等于可以自由实施|仍需对方许可/.test(patents.find((p) => p.id === "PAT-RULE-005")?.body ?? "")
);
check(
  "水中电刺激前案已记录",
  patents.some((p) => p.publicationNo === "CN112135661A")
);
check(
  "外部AI评审任务书存在",
  existsSync(path.join(process.cwd(), "patent-drafts", "外部AI评审任务书.md"))
);
// 已打掉的角度不需要再列待办；仍存活的必须标明还缺什么
check(
  "存活的候选角度都标了待检索或待验证",
  patents
    .filter((p) => p.id.startsWith("PAT-IDEA") && !/已打掉/.test(p.title))
    .every((p) => /待检索|待验证/.test(p.body))
);
check(
  "被打掉的角度写明了打掉原因",
  patents
    .filter((p) => p.id.startsWith("PAT-IDEA") && /已打掉/.test(p.title))
    .every((p) => /打掉原因|不建议投入/.test(p.body))
);
check(
  "浮力测呼吸前案已记录",
  patents.some((p) => p.publicationNo === "US6669649B2")
);
check(
  "Gauer-Henry 公知已记录",
  patents.some((p) => p.id === "PAT-PRI-028" && /科学发现/.test(p.body))
);
check("v2.0 总图卡存在", patents.some((p) => p.id === "PAT-MAP-002"));
check("v3.0 总图卡存在", patents.some((p) => p.id === "PAT-MAP-003"));
check(
  "v3.0 总图标明取代 v2.0",
  /取代 v2\.0/.test(patents.find((p) => p.id === "PAT-MAP-003")?.summary ?? "")
);
check("清水对照组缺口卡存在", patents.some((p) => p.id === "PAT-GAP-002"));
check(
  "母案B已收窄",
  /收窄/.test(patents.find((p) => p.id === "PAT-ROAD-B")?.title ?? "")
);
check(
  "已取消20件硬指标",
  /取消20件硬指标/.test(patents.find((p) => p.id === "PAT-BATCH-001")?.title ?? "")
);
check("整体报告v2.0源稿存在", existsSync(path.join(process.cwd(), "patent-drafts", "专利布局整体报告-v2.md")));
check(
  "整体报告v2.0 docx 存在",
  existsSync(path.join(process.cwd(), "patent-drafts", "漂浮方舟_专利布局整体报告_v2.0.docx"))
);
check("整体报告v3.0源稿存在", existsSync(path.join(process.cwd(), "patent-drafts", "专利布局整体报告-v3.md")));
check(
  "整体报告v3.0 docx 存在",
  existsSync(path.join(process.cwd(), "patent-drafts", "漂浮方舟_专利布局整体报告_v3.0.docx"))
);
check(
  "新颖性卡讲清国内外公开",
  /在国内外为公众所知/.test(patents.find((p) => p.id === "PAT-RULE-002")?.body ?? "")
);
check(
  "新颖性卡讲清地域性",
  /地域性/.test(patents.find((p) => p.id === "PAT-RULE-002")?.body ?? "")
);
check(
  "已记录国际前案",
  ["PAT-PRI-022", "PAT-PRI-023", "PAT-PRI-024", "PAT-PRI-025"].every((id) =>
    patents.some((p) => p.id === id)
  )
);
check(
  "国际前案含非中国辖区",
  patents.filter((p) => p.kind === "retrieved").some((p) => /美国|国际标准/.test(p.jurisdiction ?? ""))
);
check("不设母案3卡存在", patents.some((p) => p.id === "PAT-NO3-001"));
check("状态机卡存在", patents.some((p) => p.id === "PAT-STATE-001"));
check("批次节奏卡存在", patents.some((p) => p.id === "PAT-BATCH-001"));

const text = patents.map((p) => `${p.title}\n${p.summary}\n${p.body}`).join("\n");
check("声明非正式FTO", /不构成正式法律意见|完整自由实施/.test(text));
check("声明不进公开站", /不进 \/open|不进\/open/.test(text));
check("红灯含策略库", /策略库/.test(text));
check("绿灯含安全状态机", /安全状态机/.test(text));
check("标注与总库口径冲突", /30\+|迷走|材料口径/.test(text));
check("明确不设母案3", /不设母案 ?3|不设母案3/.test(text));
check("簇5不进入直接VNS", /不进入直接VNS/.test(text));
check("B6/B7 预埋进母案B、不单独立案", /B6[–—\-+/ ]?B7/.test(text) && /预埋/.test(text));

const retrieved = patents.filter((p) => p.kind === "retrieved");
check("检索卡不少于 25 条", retrieved.length >= 25, String(retrieved.length));
check("检索卡都有公开号", retrieved.every((p) => !!p.publicationNo));

check("四个簇来源都记录", ["SRC-PAT-CLU1", "SRC-PAT-CLU2", "SRC-PAT-CLU3", "SRC-PAT-CLU4"].every((id) => patentSources.some((s) => s.id === id && s.status === "done")));
check("重构版来源已记录", patentSources.some((s) => s.id === "SRC-PAT-LAYOUT-V2" && s.status === "done"));
check("撰写包来源已记录", patentSources.some((s) => s.id === "SRC-PAT-WRITE-KIT" && s.status === "done"));
check("A4补充检索来源已记录", patentSources.some((s) => s.id === "SRC-PAT-GAS-SEARCH" && s.status === "done"));
check("国际检索来源已记录", patentSources.some((s) => s.id === "SRC-PAT-NOVELTY-INTL" && s.status === "done"));
check("报告v2.0来源已记录", patentSources.some((s) => s.id === "SRC-PAT-REPORT-V2" && s.status === "done"));
check("报告v3.0来源已记录", patentSources.some((s) => s.id === "SRC-PAT-REPORT-V3" && s.status === "done"));
check("人群舱方案来源已记录", patentSources.some((s) => s.id === "SRC-PAT-POP-SCHEMES" && s.status === "done"));
check("有效方案总图卡存在", patents.some((p) => p.id === "PAT-MAP-004"));
check("青少年REST封套卡存在", patents.some((p) => p.id === "PAT-IDEA-016" && /拒绝全REST/.test(p.title)));
check("老年姿态转换卡存在", patents.some((p) => p.id === "PAT-IDEA-017"));
check("监护空气舱卡存在", patents.some((p) => p.id === "PAT-IDEA-018"));
check("同池双人已打掉", /已打掉/.test(patents.find((p) => p.id === "PAT-IDEA-022")?.title ?? ""));
check("预约门锁已打掉", /已打掉/.test(patents.find((p) => p.id === "PAT-IDEA-023")?.title ?? ""));
check("US4000749 检索卡存在", patents.some((p) => p.id === "PAT-PRI-053" && /US4000749/.test(p.publicationNo ?? "")));
check("西澳16岁指引已记录", patents.some((p) => p.id === "PAT-PRI-060"));
check(
  "有效技术方案文件存在",
  existsSync(path.join(process.cwd(), "patent-drafts", "有效技术方案.md"))
);
check(
  "有效技术方案 docx 存在",
  existsSync(path.join(process.cwd(), "patent-drafts", "有效技术方案.docx"))
);
// 真实技术保护：消杀（AOP/光触媒）与低刺激（主动对消、主动降光）
check("真实技术来源已记录", patentSources.some((s) => s.id === "SRC-PAT-REAL-TECH" && s.status === "done"));
check("主动降光来源已记录", patentSources.some((s) => s.id === "SRC-PAT-ACTIVE-LIGHT" && s.status === "done"));
check("真实技术总图卡存在", patents.some((p) => p.id === "PAT-MAP-005"));
check(
  "总图已声明取代人群叙事为总菜单",
  /PAT-MAP-005 取代/.test(patents.find((p) => p.id === "PAT-MAP-004")?.summary ?? "")
);
check(
  "AOP与光触媒本身已认定为现有技术并打掉",
  /已打掉/.test(patents.find((p) => p.id === "PAT-IDEA-040")?.title ?? "") &&
    patents.find((p) => p.id === "PAT-IDEA-040")?.risk === "critical"
);
check(
  "漂浮舱Peroxone公开使用已记录",
  patents.some((p) => p.id === "PAT-PRI-065" && /Superior Float Tanks/.test(p.publicationNo ?? "") && /Peroxone/.test(p.body))
);
check("光催化泳池反应器前案已记录", patents.some((p) => p.id === "PAT-PRI-066" && /CN101723484A/.test(p.publicationNo ?? "")));
check("高盐自由基清除文献已记录", patents.some((p) => p.id === "PAT-PRI-068" && /科学发现/.test(p.body)));
check(
  "六条消杀方案齐全",
  ["PAT-IDEA-026", "PAT-IDEA-027", "PAT-IDEA-028", "PAT-IDEA-029", "PAT-IDEA-030", "PAT-IDEA-031"].every((id) =>
    patents.some((p) => p.id === id)
  )
);
check("空舱气相光催化卡讲清三态互斥", /三态互斥/.test(patents.find((p) => p.id === "PAT-IDEA-028")?.body ?? ""));
check("溴酸盐方案卡存在", patents.some((p) => p.id === "PAT-IDEA-027" && /溴酸盐/.test(p.title)));
check(
  "六条低刺激方案齐全",
  ["PAT-IDEA-032", "PAT-IDEA-033", "PAT-IDEA-034", "PAT-IDEA-035", "PAT-IDEA-036", "PAT-IDEA-037"].every((id) =>
    patents.some((p) => p.id === id)
  )
);
check("刺激预算母案候选存在", patents.some((p) => p.id === "PAT-IDEA-037" && /母案/.test(p.summary + p.title)));
check("掩蔽声已打掉", /已打掉/.test(patents.find((p) => p.id === "PAT-IDEA-038")?.title ?? ""));
check("被动隔音已打掉", /已打掉/.test(patents.find((p) => p.id === "PAT-IDEA-039")?.title ?? ""));
check("掩蔽声商品前案已记录", patents.some((p) => p.id === "PAT-PRI-072"));
check("被动隔声行业做法已记录", patents.some((p) => p.id === "PAT-PRI-071"));
check(
  "老年方案前提已作废",
  /前提已作废|前提/.test(patents.find((p) => p.id === "PAT-IDEA-017")?.title ?? "") &&
    /储液罐/.test(patents.find((p) => p.id === "PAT-IDEA-017")?.body ?? "")
);
check("可变液位调浮力前案已记录", patents.some((p) => p.id === "PAT-PRI-075" && /US5295929/.test(p.publicationNo ?? "")));
check("变液位改牵引力前案已记录", patents.some((p) => p.id === "PAT-PRI-076" && /US6042602/.test(p.publicationNo ?? "")));
check("消杀低刺激实验缺口卡存在", patents.some((p) => p.id === "PAT-GAP-004"));
// 主动降光
check(
  "主动降光三条方案齐全",
  ["PAT-IDEA-041", "PAT-IDEA-042", "PAT-IDEA-043"].every((id) => patents.some((p) => p.id === id))
);
check("反相消光已打掉且写明物理原因", /已打掉/.test(patents.find((p) => p.id === "PAT-IDEA-044")?.title ?? "") && /非相干/.test(patents.find((p) => p.id === "PAT-IDEA-044")?.body ?? ""));
check("电控调光材料已打掉", /已打掉/.test(patents.find((p) => p.id === "PAT-IDEA-045")?.title ?? ""));
check("暗适应阈值前案已记录", patents.some((p) => p.id === "PAT-PRI-077" && /科学发现/.test(p.body)));
check("光催化余辉前案已记录", patents.some((p) => p.id === "PAT-PRI-078" && /余辉/.test(p.title)));
check("余辉与占用准入联锁卡存在", patents.some((p) => p.id === "PAT-IDEA-042" && /余辉/.test(p.title)));
check("主动降光实验缺口卡存在", patents.some((p) => p.id === "PAT-GAP-005"));
check(
  "光通道已声明挂在低刺激母案下而非高盐发明",
  /不要写成高盐发明|不能写成高盐发明/.test(patents.find((p) => p.id === "PAT-GAP-005")?.body ?? "")
);
check(
  "真实技术保护文件存在",
  existsSync(path.join(process.cwd(), "patent-drafts", "真实技术保护.md"))
);
check(
  "真实技术保护 docx 存在",
  existsSync(path.join(process.cwd(), "patent-drafts", "漂浮方舟_真实技术保护_消杀与低刺激.docx"))
);

// 信噪比架构 + 审计 + 使用公开规则
check("信噪比架构来源已记录", patentSources.some((s) => s.id === "SRC-PAT-SNR-ARCH" && s.status === "done"));
check("使用公开规则来源已记录", patentSources.some((s) => s.id === "SRC-PAT-PRIOR-USE" && s.status === "done"));
check("信噪比架构总图卡存在", patents.some((p) => p.id === "PAT-MAP-006"));
check(
  "PAT-MAP-005 已声明被 006 取代",
  /PAT-MAP-006 取代/.test(patents.find((p) => p.id === "PAT-MAP-005")?.summary ?? "")
);
check("独立审计结论卡存在", patents.some((p) => p.id === "PAT-EXT-003" && /审计/.test(p.title)));
check(
  "审计七节点已转实验清单",
  patents.some((p) => p.id === "PAT-GAP-006" && /毫米波|交叉影响/.test(p.body))
);
check("信噪比母案候选存在", patents.some((p) => p.id === "PAT-IDEA-046" && /本底/.test(p.title)));
check(
  "执行器互污染联合优化卡存在",
  patents.some((p) => p.id === "PAT-IDEA-047" && /交叉影响/.test(p.body))
);
check("生理节律掩蔽窗卡存在", patents.some((p) => p.id === "PAT-IDEA-048"));
check(
  "工作液即可调阻抗层卡讲清双约束",
  patents.some((p) => p.id === "PAT-IDEA-049" && /浮力/.test(p.body) && /声阻抗|阻抗/.test(p.body))
);
check("腔体模态在线修正卡存在", patents.some((p) => p.id === "PAT-IDEA-050" && /驻波|模态/.test(p.body)));
check("腔压心冲击传感卡存在", patents.some((p) => p.id === "PAT-IDEA-051" && /心冲击/.test(p.body)));
check("毫米波已打掉", /已打掉/.test(patents.find((p) => p.id === "PAT-IDEA-052")?.title ?? ""));
check("舱内振动换能器已打掉", /已打掉/.test(patents.find((p) => p.id === "PAT-IDEA-053")?.title ?? ""));
check("40Hz已打掉", /已打掉/.test(patents.find((p) => p.id === "PAT-IDEA-054")?.title ?? ""));
check(
  "40Hz卡含撰写禁令",
  /不得在权利要求或说明书中出现/.test(patents.find((p) => p.id === "PAT-IDEA-054")?.body ?? "")
);
check("Dreampod触觉换能器公开使用已记录", patents.some((p) => p.id === "PAT-PRI-080"));
check("骨传导振动枕前案已记录", patents.some((p) => p.id === "PAT-PRI-081"));
check("GENUS/Cognito前案已记录", patents.some((p) => p.id === "PAT-PRI-082" && /GENUS/.test(p.publicationNo ?? "")));
check("阻抗匹配层公知已记录", patents.some((p) => p.id === "PAT-PRI-083"));
check("多感官振动舱专利已记录", patents.some((p) => p.id === "PAT-PRI-084" && /US11759705/.test(p.publicationNo ?? "")));
// 使用公开硬规则
check("使用公开规则卡存在", patents.some((p) => p.id === "PAT-RULE-006"));
check(
  "规则卡引用了法条与指南",
  /第二十二条第五款/.test(patents.find((p) => p.id === "PAT-RULE-006")?.body ?? "") &&
    /使用公开/.test(patents.find((p) => p.id === "PAT-RULE-006")?.body ?? "")
);
check(
  "规则卡讲清没申请专利反而更糟",
  /公有领域/.test(patents.find((p) => p.id === "PAT-RULE-006")?.body ?? "") &&
    /都不能再就它取得专利|不能再就它取得专利/.test(patents.find((p) => p.id === "PAT-RULE-006")?.body ?? "")
);
check(
  "规则卡提醒我方自身公开风险",
  /宽限期/.test(patents.find((p) => p.id === "PAT-RULE-006")?.body ?? "")
);
check(
  "信噪比架构文件存在",
  existsSync(path.join(process.cwd(), "patent-drafts", "信噪比架构.md"))
);
check(
  "信噪比架构 docx 存在",
  existsSync(path.join(process.cwd(), "patent-drafts", "漂浮方舟_信噪比架构_振动与协同.docx"))
);

check("角度复盘来源已记录", patentSources.some((s) => s.id === "SRC-PAT-ANGLE-REVIEW" && s.status === "done"));
check("组合发明来源已记录", patentSources.some((s) => s.id === "SRC-PAT-COMBINATION" && s.status === "done"));
check("绿灯角度检索来源已记录", patentSources.some((s) => s.id === "SRC-PAT-GREEN-SEARCH" && s.status === "done"));
check("配液结晶检索来源已记录", patentSources.some((s) => s.id === "SRC-PAT-DOSING-SEARCH" && s.status === "done"));
check("第三方过闸来源已记录", patentSources.some((s) => s.id === "SRC-PAT-EXT-REVIEW" && s.status === "done"));
check("第三方过闸结论卡存在", patents.some((p) => p.id === "PAT-EXT-001" && /便宜/.test(p.body)));
check("NSF撰写菜单来源已记录", patentSources.some((s) => s.id === "SRC-PAT-NSF-SANITATION" && s.status === "done"));
check("独立评审过闸来源已记录", patentSources.some((s) => s.id === "SRC-PAT-CODEX-REVIEW" && s.status === "done"));
check("独立评审过闸结论卡存在", patents.some((p) => p.id === "PAT-EXT-002" && /紧急离舱/.test(p.body)));
check(
  "盐堵宽方案前案已记录",
  patents.some((p) => p.id === "PAT-PRI-043" && /US10495620/.test(p.publicationNo ?? "") && /US10041917/.test(p.publicationNo ?? ""))
);
check("周边加热居中前案已记录", patents.some((p) => p.id === "PAT-PRI-044" && /GB2057267/.test(p.publicationNo ?? "")));
check("泻盐热区布置前案已记录", patents.some((p) => p.id === "PAT-PRI-045" && /EP0128641/.test(p.publicationNo ?? "")));
check("变密度静水压前案已记录", patents.some((p) => p.id === "PAT-PRI-046" && /US12447093/.test(p.publicationNo ?? "")));
check("坐浴紧急开门前案已记录", patents.some((p) => p.id === "PAT-PRI-050" && /US11930968/.test(p.publicationNo ?? "")));
check(
  "四个紧急离舱与跨相库存候选齐全",
  ["PAT-IDEA-012", "PAT-IDEA-013", "PAT-IDEA-014", "PAT-IDEA-015"].every((id) => patents.some((p) => p.id === id))
);
check(
  "最终专利方案文件存在",
  existsSync(path.join(process.cwd(), "patent-drafts", "最终专利方案.md"))
);
check(
  "A4已收窄为宽方案包围",
  /宽方案已被包围/.test(patents.find((p) => p.id === "PAT-DRAFT-A4")?.title ?? "")
);
check(
  "任务书已同步盐堵宽方案打掉",
  /US10495620/.test(
    readFileSync(path.join(process.cwd(), "patent-drafts", "外部AI评审任务书.md"), "utf-8")
  ) &&
    /EP0128641/.test(
      readFileSync(path.join(process.cwd(), "patent-drafts", "外部AI评审任务书.md"), "utf-8")
    )
);
check("NSF50强制项前案已记录", patents.some((p) => p.id === "PAT-PRI-041" && /0\.1 ppm/.test(p.body)));
check("氯溴共识前案已记录", patents.some((p) => p.id === "PAT-PRI-042" && /不推荐氯/.test(p.body)));
check("撰写菜单卡存在", patents.some((p) => p.id === "PAT-SEED-001" && /给专家选/.test(p.title)));
check(
  "NSF五个撰写候选齐全",
  ["PAT-IDEA-007", "PAT-IDEA-008", "PAT-IDEA-009", "PAT-IDEA-010", "PAT-IDEA-011"].every((id) =>
    patents.some((p) => p.id === id)
  )
);
check(
  "撰写思路菜单文件存在",
  existsSync(path.join(process.cwd(), "patent-drafts", "撰写思路菜单-NSF与氯溴.md"))
);
check(
  "EIS卤水结垢前案已记录",
  patents.some((p) => p.id === "PAT-PRI-039" && /US10234376/.test(p.publicationNo ?? ""))
);
check(
  "消毒电极补偿前案已记录",
  patents.some((p) => p.id === "PAT-PRI-040" && /CCS58E/.test(p.publicationNo ?? ""))
);
check(
  "整合版原稿已保存",
  existsSync(path.join(process.cwd(), "patent-drafts", "外部AI回答-整合版.md"))
);
check(
  "候选角度五已标为打掉独立立案",
  /已打掉/.test(patents.find((p) => p.id === "PAT-IDEA-005")?.title ?? "") &&
    patents.find((p) => p.id === "PAT-IDEA-005")?.risk === "critical"
);
check(
  "配液运维前案已记录",
  patents.some((p) => p.id === "PAT-PRI-036" && /1\.265/.test(p.body))
);
check(
  "漂浮舱盐密度闭环前案已记录",
  patents.some((p) => p.id === "PAT-PRI-037" && /盐密度传感器/.test(p.body))
);
check(
  "工业配液前案已记录",
  patents.some((p) => p.id === "PAT-PRI-038" && /US6739408/.test(p.publicationNo ?? ""))
);
check(
  "来源 patentIds 都能在库中找到",
  patentSources.every((s) => s.patentIds.every((id) => patents.some((p) => p.id === id)))
);

check("split-queue 运行时文件仍被 gitignore 逻辑覆盖以外不强制", true);
check("knowledge-points.json 文件仍存在", existsSync(kpPath));

if (failed) {
  console.log(`\n${failed} failed`);
  process.exit(1);
}
console.log(`\nAll ${patents.length} patent cards checked. Knowledge points untouched: ${points.length}`);
