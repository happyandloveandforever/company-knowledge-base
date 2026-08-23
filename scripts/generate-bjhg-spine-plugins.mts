/**
 * 北化第一次交流 v2：脊柱 + 插件。
 * 不再让合伙人在五套完整 PPT 里挑，而是固定一根主叙事，只勾要不要加半页。
 * 运行：npx tsx scripts/generate-bjhg-spine-plugins.mts
 */
import { writeFileSync, mkdirSync, copyFileSync } from "fs";
import path from "path";
import PptxGenJS from "pptxgenjs";

const C = {
  navy: "1E3A5F",
  blue: "2563EB",
  text: "1F2937",
  muted: "6B7280",
  line: "E5E7EB",
  bg: "F8FAFC",
  rec: "065F46",
  recBg: "ECFDF5",
  warn: "92400E",
  warnBg: "FFF7ED",
};

/** 散场时必须成立的三件事。写在最前面，后面每一页都得为它服务。 */
const exitCriteria = [
  ["听懂我们是什么", "可复制的深度恢复系统，不是 SPA、不是理疗店"],
  ["知道方向", "主动健康 / 非药物恢复，和他们的产业与人力议题挨得上"],
  ["愿意再谈", "觉得值得下一步，但本场不谈钱、不谈估值"],
];

const spine: { title: string; note: string }[] = [
  { title: "一句话我们是谁", note: "可复制的深度恢复系统" },
  { title: "为什么是现在", note: "从治病到主动健康，非药物恢复缺入口" },
  { title: "方法一页", note: "减负—降噪—重置，不堆模块名词" },
  { title: "一次体验里发生什么", note: "让他们脑子里有画面，60–90 分钟" },
  { title: "我们已经在做的事", note: "只讲能公开的，数字标口径或不写" },
  { title: "边界写清楚", note: "不治病、不替代医疗、不做承诺" },
  { title: "和北化的三个可能接口", note: "企业精力 / 园区示范 / 产业布局" },
  { title: "入口很轻", note: "参观或一次小体验，不用先决策" },
  { title: "下一步一句话", note: "只请他们同意一件小事" },
];

type Plugin = {
  key: string;
  name: string;
  size: string;
  trigger: string;
  add: string[];
  why: string;
  risk: string;
};

const plugins: Plugin[] = [
  {
    key: "P1",
    name: "工程可巡检",
    size: "1 页",
    trigger: "席上有工程、质量、安全、生产口的人",
    add: [
      "三分体结构与消杀闭环",
      "水温、水质、记录：谁测、多久测一次",
      "一句话：这是能连续运行的设备，不是网红体验",
    ],
    why: "化工的人信过程和记录，不信形容词。这页把我们从「概念」拉到「可巡检」。",
    risk: "讲太细会变工厂参观，压到 1 页，不展开台账。",
  },
  {
    key: "P2",
    name: "政策与人力口",
    size: "1 页",
    trigger: "规划、党委、工会、HR、园区主导这次会",
    add: [
      "治病中心 → 健康中心，我们补心理与睡眠这一格",
      "企业过载：讲座解决不了，需要可体验入口",
      "明确不是医保、不是治病",
    ],
    why: "让这件事能被写进他们自己的规划和员工议题，而不是只当一个供应商。",
    risk: "只讲政策会显空，必须紧跟脊柱的方法页，别单独放。",
  },
  {
    key: "P3",
    name: "底气半页",
    size: "0.5 页",
    trigger: "担心被当成小作坊；对方级别高、看惯大场面",
    add: [
      "平台与冠军产品线、认证与消杀能力",
      "专家与合作生态各一行",
      "规模数字标「材料口径」，未锁的不写死",
    ],
    why: "压住「你们多大」这个问题，但不把它做成路演封面。",
    risk: "一旦写具体机构数、用户数、专利数，追问就被动。宁少写。",
  },
  {
    key: "P4",
    name: "证据塔",
    size: "0.5 页",
    trigger: "席上有医学、科研、医院背景的人",
    add: [
      "塔基安全与可重复 → 塔身即时状态改善",
      "国际研究说到哪一步，如实说：多为小样本、可行性",
      "塔尖病种效果不进主页",
    ],
    why: "懂行的人在场，先示弱反而更可信；把边界自己说出来，别等他们挑。",
    risk: "别把病种 RCT 当卖点；乳酸这类争议只讲主观恢复。",
  },
  {
    key: "P5",
    name: "落地一页",
    size: "1 页（只在对方先问时打开）",
    trigger: "对方主动问「怎么合作、落哪个点、怎么投」",
    add: [
      "一个点位、一个季度、可退出",
      "三选一：企业精力 / 园区示范 / 康养旗舰",
      "采购 / 联营 / 样板，各一行，不报价",
    ],
    why: "把「想投资」软着陆成「先试一个点」，比谈估值安全得多。",
    risk: "不要主动翻这页。没人问就留在附录，否则像默认他们要买。",
  },
];

const combos: string[][] = [
  ["只来了战略投资口", "脊柱 + P3", "他们要判断你有多大、值不值得再谈"],
  ["带了工程或安全", "脊柱 + P1", "有人会问怎么消杀、怎么保证不出事"],
  ["规划 / 党委 / HR 主导", "脊柱 + P2", "他们要能把这件事写进自己的口径"],
  ["有医学背景在场", "脊柱 + P4", "先自己划边界，比被追问好"],
  ["对方开场就问合作", "脊柱 + P5", "顺着他们走，但只到一个可退出试点"],
  ["一大桌人都来了", "脊柱 + P1 + P2", "其余全部进附录，现场按提问再翻"],
];

const redlines = [
  "不讲治病、不讲病种有效率、不提医保与科室话术",
  "机构数 / 专利数 / C 端用户：标「材料口径」或不写",
  "医院联合运营稿与独立门店 SOP 两套口径，不混在一页",
  "本场不出估值、不出财务模型、不主动提融资金额",
];

function addFooter(s: PptxGenJS.Slide, n: number, total: number) {
  s.addText("内部 · 给合伙人圈选 · 非正式对外稿", {
    x: 0.5, y: 7.1, w: 10, h: 0.25,
    fontSize: 11, color: C.muted, fontFace: "Arial",
  });
  s.addText(`${n} / ${total}`, {
    x: 11.5, y: 7.1, w: 1.3, h: 0.25,
    fontSize: 11, color: C.muted, align: "right", fontFace: "Arial",
  });
}

function addTitle(s: PptxGenJS.Slide, pptx: PptxGenJS, title: string, sub?: string, accent = C.blue) {
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: "100%", fill: { color: accent } });
  s.addText(title, {
    x: 0.5, y: 0.24, w: 12.2, h: 0.45,
    fontSize: 23, bold: true, color: C.navy, fontFace: "Arial",
  });
  if (sub) {
    s.addText(sub, {
      x: 0.5, y: 0.72, w: 12.2, h: 0.3,
      fontSize: 12, color: C.muted, fontFace: "Arial",
    });
  }
}

async function main() {
  const pptx = new PptxGenJS();
  pptx.author = "中友瑞水 / 知识库";
  pptx.title = "北化交流 · 脊柱 + 插件（给合伙人）";
  pptx.layout = "LAYOUT_WIDE";
  const total = 8;

  // 1 封面
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.navy } });
    s.addText("内部选型 · 第二版思路", {
      x: 0.7, y: 1.1, w: 11, h: 0.35,
      fontSize: 14, color: "93C5FD", fontFace: "Arial",
    });
    s.addText("北京化工集团第一次交流\n一根脊柱 + 按人加插件", {
      x: 0.7, y: 1.55, w: 11, h: 1.7,
      fontSize: 32, bold: true, color: "FFFFFF", fontFace: "Arial",
    });
    s.addText(
      "上一版让你在五套完整 PPT 里挑，太重，而且那五套不在同一个维度。\n这一版只固定一套主叙事（9 页），其余做成可勾的插件（半页到一页）。合伙人只需要勾插件。",
      { x: 0.7, y: 3.4, w: 11.4, h: 1.1, fontSize: 16, color: "CBD5E1", fontFace: "Arial" }
    );
  }

  // 2 为什么换思路
  {
    const s = pptx.addSlide();
    addTitle(s, pptx, "为什么把五套改成「脊柱 + 插件」", "先说清上一版的毛病，再说这版怎么修");
    const rows: [string, string][] = [
      ["上一版的问题", "A 初识、E 落地讲的是「到哪一步」；B 工业品、C 政策、D 国际讲的是「用谁的语言」。两个维度混在一张表里，所以你会想拼「A 加半页消杀」。"],
      ["这版怎么修", "阶段只有一个答案：第一次见面就是介绍。语言才是变量，做成插件，按谁到场加。"],
      ["合伙人要做的事", "从「选一整套」变成「勾两三个半页」。决策更小，也更不容易选错。"],
      ["对外稿只做一版", "脊柱固定，插件换。第二次见面不用重做，只换插件。"],
    ];
    rows.forEach((row, i) => {
      const y = 1.15 + i * 1.34;
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.5, y, w: 12.2, h: 1.22, fill: { color: i === 1 ? C.recBg : C.bg }, rectRadius: 0.08,
      });
      s.addText(row[0], {
        x: 0.7, y: y + 0.12, w: 2.5, h: 0.95,
        fontSize: 14, bold: true, color: i === 1 ? C.rec : C.blue, fontFace: "Arial", valign: "top",
      });
      s.addText(row[1], {
        x: 3.3, y: y + 0.12, w: 9.2, h: 0.98,
        fontSize: 14, color: C.text, fontFace: "Arial", valign: "top",
      });
    });
    addFooter(s, 2, total);
  }

  // 3 散场标准
  {
    const s = pptx.addSlide();
    addTitle(s, pptx, "先定散场标准，再定页数", "这三件事成立就算成功；不成立，页数再多也白讲", C.rec);
    exitCriteria.forEach((row, i) => {
      const y = 1.3 + i * 1.5;
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.5, y, w: 12.2, h: 1.3, fill: { color: C.recBg }, rectRadius: 0.1,
      });
      s.addText(`${i + 1}`, {
        x: 0.75, y: y + 0.32, w: 0.6, h: 0.6,
        fontSize: 26, bold: true, color: C.rec, fontFace: "Arial",
      });
      s.addText(row[0], {
        x: 1.5, y: y + 0.2, w: 4.2, h: 0.5,
        fontSize: 18, bold: true, color: C.navy, fontFace: "Arial", valign: "middle",
      });
      s.addText(row[1], {
        x: 5.8, y: y + 0.2, w: 6.6, h: 0.9,
        fontSize: 14, color: C.text, fontFace: "Arial", valign: "middle",
      });
    });
    s.addText("注意：投资不在这三条里。同路了他们自己会问。", {
      x: 0.5, y: 6.1, w: 12.2, h: 0.35,
      fontSize: 14, italic: true, color: C.warn, fontFace: "Arial",
    });
    addFooter(s, 3, total);
  }

  // 4 脊柱
  {
    const s = pptx.addSlide();
    addTitle(s, pptx, "脊柱：固定 9 页 / 15 分钟", "不管谁到场都讲这些，顺序不动", C.rec);
    spine.forEach((item, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 0.5 + col * 4.1;
      const y = 1.15 + row * 1.85;
      s.addShape(pptx.ShapeType.roundRect, {
        x, y, w: 3.9, h: 1.7, fill: { color: C.bg }, rectRadius: 0.08,
      });
      s.addText(`${i + 1}`, {
        x: x + 0.18, y: y + 0.12, w: 0.5, h: 0.35,
        fontSize: 13, bold: true, color: C.rec, fontFace: "Arial",
      });
      s.addText(item.title, {
        x: x + 0.62, y: y + 0.12, w: 3.1, h: 0.6,
        fontSize: 15, bold: true, color: C.navy, fontFace: "Arial", valign: "top",
      });
      s.addText(item.note, {
        x: x + 0.2, y: y + 0.78, w: 3.5, h: 0.8,
        fontSize: 12, color: C.muted, fontFace: "Arial", valign: "top",
      });
    });
    addFooter(s, 4, total);
  }

  // 5–6 插件卡（每页 3 个 + 2 个）
  {
    const pages = [plugins.slice(0, 3), plugins.slice(3)];
    pages.forEach((group, pageIdx) => {
      const s = pptx.addSlide();
      addTitle(
        s,
        pptx,
        `插件菜单 ${pageIdx + 1}/2：按谁到场加`,
        "每个插件半页到一页。没有触发条件就不加，宁短不长"
      );
      group.forEach((p, i) => {
        const y = 1.15 + i * 1.83;
        s.addShape(pptx.ShapeType.roundRect, {
          x: 0.5, y, w: 12.2, h: 1.7, fill: { color: C.bg }, rectRadius: 0.08,
        });
        s.addText(`${p.key}  ${p.name}`, {
          x: 0.72, y: y + 0.1, w: 3.2, h: 0.4,
          fontSize: 16, bold: true, color: C.blue, fontFace: "Arial",
        });
        s.addText(p.size, {
          x: 0.72, y: y + 0.52, w: 3.2, h: 0.3,
          fontSize: 12, color: C.muted, fontFace: "Arial",
        });
        s.addText(`触发：${p.trigger}`, {
          x: 0.72, y: y + 0.86, w: 3.4, h: 0.7,
          fontSize: 12, color: C.text, fontFace: "Arial", valign: "top",
        });
        s.addText(
          p.add.map((t) => ({ text: t, options: { bullet: true, breakLine: true } })),
          { x: 4.3, y: y + 0.12, w: 4.3, h: 1.5, fontSize: 12.5, color: C.text, fontFace: "Arial", valign: "top" }
        );
        s.addText("为什么加", {
          x: 8.8, y: y + 0.1, w: 3.7, h: 0.28,
          fontSize: 11, bold: true, color: C.rec, fontFace: "Arial",
        });
        s.addText(p.why, {
          x: 8.8, y: y + 0.36, w: 3.7, h: 0.62,
          fontSize: 11.5, color: C.text, fontFace: "Arial", valign: "top",
        });
        s.addText("风险", {
          x: 8.8, y: y + 1.0, w: 3.7, h: 0.26,
          fontSize: 11, bold: true, color: C.warn, fontFace: "Arial",
        });
        s.addText(p.risk, {
          x: 8.8, y: y + 1.24, w: 3.7, h: 0.42,
          fontSize: 11.5, color: C.text, fontFace: "Arial", valign: "top",
        });
      });
      addFooter(s, 5 + pageIdx, total);
    });
  }

  // 7 组合建议 + 红线
  {
    const s = pptx.addSlide();
    addTitle(s, pptx, "常见几种席位，直接照抄这个配置", "拿不准就用第一行；现场按提问再翻附录");
    s.addTable(
      [
        [
          { text: "对方来了谁", options: { fill: { color: C.navy }, color: "FFFFFF", bold: true } },
          { text: "配置", options: { fill: { color: C.navy }, color: "FFFFFF", bold: true } },
          { text: "为什么", options: { fill: { color: C.navy }, color: "FFFFFF", bold: true } },
        ],
        ...combos.map((row) => row.map((cell) => ({ text: cell }))),
      ],
      {
        x: 0.5, y: 1.1, w: 12.2, h: 3.1,
        colW: [3.2, 3.0, 6.0],
        border: [{ pt: 0.5, color: C.line }],
        fontFace: "Arial", fontSize: 12, color: C.text, valign: "middle", align: "left",
      }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: 4.45, w: 12.2, h: 2.25, fill: { color: C.warnBg }, rectRadius: 0.1,
    });
    s.addText("四条红线（任何配置都不许破）", {
      x: 0.72, y: 4.58, w: 11.8, h: 0.32,
      fontSize: 14, bold: true, color: C.warn, fontFace: "Arial",
    });
    s.addText(
      redlines.map((t) => ({ text: t, options: { bullet: true, breakLine: true } })),
      { x: 0.72, y: 4.95, w: 11.8, h: 1.65, fontSize: 13, color: C.text, fontFace: "Arial", valign: "top" }
    );
    addFooter(s, 7, total);
  }

  // 8 圈选
  {
    const s = pptx.addSlide();
    addTitle(s, pptx, "请合伙人只勾插件", "脊柱不用选。默认配置已经勾好，觉得不对就改", C.rec);
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: 1.05, w: 12.2, h: 1.25, fill: { color: C.recBg }, rectRadius: 0.1,
    });
    s.addText("推荐：脊柱 9 页 + P3 底气半页。合计约 10 页 / 20 分钟。", {
      x: 0.72, y: 1.18, w: 11.8, h: 0.4,
      fontSize: 18, bold: true, color: C.rec, fontFace: "Arial",
    });
    s.addText(
      "第一次来了解，最可能出席的是战略投资口，他们心里的问题是「你们多大、值不值得再谈」。P3 用半页回答，且不写死数字。其余插件带在附录，现场按提问翻。",
      { x: 0.72, y: 1.6, w: 11.8, h: 0.65, fontSize: 13.5, color: C.text, fontFace: "Arial" }
    );

    const boxes = [
      "☑  脊柱 9 页（固定，不用勾）",
      "☑  P3 底气半页（默认加）",
      "□  P1 工程可巡检 1 页",
      "□  P2 政策与人力口 1 页",
      "□  P4 证据塔 0.5 页",
      "□  P5 落地一页（只在对方问时翻）",
      "□  改散场标准：____________",
      "□ 我不同意，理由：__________",
    ];
    boxes.forEach((t, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const y = 2.55 + row * 0.72;
      const isDefault = i < 2;
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.5 + col * 6.15, y, w: 5.95, h: 0.62,
        fill: { color: isDefault ? C.recBg : C.bg }, rectRadius: 0.06,
      });
      s.addText(t, {
        x: 0.72 + col * 6.15, y: y + 0.1, w: 5.6, h: 0.42,
        fontSize: 14, bold: isDefault, color: isDefault ? C.rec : C.text,
        fontFace: "Arial", valign: "middle",
      });
    });
    s.addText("勾完告诉我，我按这个配置出对外稿。脊柱不动，所以第二次见面只换插件即可。", {
      x: 0.5, y: 6.35, w: 12.2, h: 0.35,
      fontSize: 13, color: C.muted, fontFace: "Arial",
    });
    addFooter(s, 8, total);
  }

  const buf = (await pptx.write({ outputType: "nodebuffer" })) as Buffer;
  const filename = "北化交流_脊柱加插件_给合伙人.pptx";
  const mdName = "北化交流_脊柱加插件_给合伙人.md";
  const outDir = path.join(process.cwd(), "exports");
  mkdirSync(outDir, { recursive: true });
  mkdirSync("/opt/cursor/artifacts", { recursive: true });
  mkdirSync(path.join(process.cwd(), "public/exports"), { recursive: true });

  const pptPath = path.join(outDir, filename);
  writeFileSync(pptPath, buf);
  writeFileSync(path.join("/opt/cursor/artifacts", filename), buf);
  copyFileSync(pptPath, path.join(process.cwd(), "public/exports", filename));

  const md = `# 北化第一次交流 v2：脊柱 + 插件（给合伙人）

> 内部文件。北京化工集团第一次接触，想了解项目，如果可以有投资意向。  
> 合伙人口径：**让对方了解我们，知道方向和他们的需求一致就行。**

## 为什么不再给你五套完整方案

上一版的 A–E 不在同一个维度：A 初识、E 样板讲的是「谈到哪一步」，B 工业品、C 政策、D 国际讲的是「用谁的语言」。
两个维度混在一张表里，所以会想拼「A 加半页消杀」。

这版把阶段写死——**第一次见面就是介绍**——只让语言当变量：

- **脊柱**：9 页，固定，谁到场都讲
- **插件**：半页到一页，按谁到场加

合伙人要做的事从「选一整套」变成「勾两三个半页」。

## 散场标准（先定这个，再定页数）

${exitCriteria.map((r, i) => `${i + 1}. **${r[0]}**：${r[1]}`).join("\n")}

投资不在这三条里。同路了他们自己会问。

## 脊柱（9 页 / 约 15 分钟）

| # | 页 | 讲法 |
|---|----|------|
${spine.map((s, i) => `| ${i + 1} | ${s.title} | ${s.note} |`).join("\n")}

## 插件菜单

${plugins
  .map(
    (p) => `### ${p.key} ${p.name}（${p.size}）

**触发：** ${p.trigger}

**加什么**
${p.add.map((x) => `- ${x}`).join("\n")}

**为什么加：** ${p.why}  
**风险：** ${p.risk}
`
  )
  .join("\n")}

## 常见席位，直接照抄

| 对方来了谁 | 配置 | 为什么 |
|------------|------|--------|
${combos.map((r) => `| ${r[0]} | ${r[1]} | ${r[2]} |`).join("\n")}

## 四条红线（任何配置都不许破）

${redlines.map((x) => `- ${x}`).join("\n")}

## 推荐

**脊柱 9 页 + P3 底气半页，合计约 10 页 / 20 分钟。**

第一次来了解，最可能出席的是战略投资口，他们心里的问题是「你们多大、值不值得再谈」。
P3 用半页回答，且不写死数字。其余插件带在附录，现场按提问翻。

## 请只勾插件

- [x] 脊柱 9 页（固定，不用勾）
- [x] P3 底气半页（默认加）
- [ ] P1 工程可巡检 1 页
- [ ] P2 政策与人力口 1 页
- [ ] P4 证据塔 0.5 页
- [ ] P5 落地一页（只在对方问时翻）
- [ ] 改散场标准：____________
- [ ] 我不同意，理由：____________
`;

  writeFileSync(path.join(outDir, mdName), md);
  writeFileSync(path.join("/opt/cursor/artifacts", mdName), md);
  writeFileSync(path.join(process.cwd(), "public/exports", mdName), md);

  console.log("pptx bytes", buf.length);
  console.log("pptx", pptPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
