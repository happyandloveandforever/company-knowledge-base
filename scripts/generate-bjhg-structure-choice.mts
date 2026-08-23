/**
 * 给合伙人选型：北化第一次交流，PPT 结构方案对照。
 * 运行：npx tsx scripts/generate-bjhg-structure-choice.mts
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
};

type Scheme = {
  key: string;
  name: string;
  rec?: boolean;
  when: string;
  pages: string;
  content: string[];
  pros: string[];
  cons: string[];
};

const schemes: Scheme[] = [
  {
    key: "A",
    name: "初识对齐",
    rec: true,
    when: "第一次见面，目标是了解我们、确认方向是否同路",
    pages: "约 12 页 / 20 分钟",
    content: [
      "我们是谁：可复制的深度恢复系统，不是 SPA",
      "往哪走：主动健康 / 非药物恢复",
      "方法一页：减负—降噪—重置（不堆模块）",
      "证据只讲安全、可重复、即时状态，不讲治病",
      "和北化可能的接口：企业精力 / 园区示范 / 产业布局",
      "合作可以很大，入口很轻；下一步参观或小体验",
    ],
    pros: [
      "完全贴合「先了解、对齐方向」",
      "不像融资路演，对方不紧张",
      "不暴露未锁死的机构数、用户数",
      "投资意向可以自然发生，本场不逼",
    ],
    cons: [
      "气场不够「大」，可能显得朴素",
      "工程和认证展示少",
      "如果对方带着投资尽调清单，会觉得信息不够",
    ],
  },
  {
    key: "B",
    name: "工业品叙事",
    when: "席上有工程、质量、生命健康板块的人",
    pages: "约 13 页 / 25 分钟",
    content: [
      "把恢复讲成可连续运行的工业品",
      "三分体结构 + 消杀闭环（化工听得懂）",
      "运营可检验：水温、水质、记录",
      "证据塔：先安全再状态",
      "对北化两种用法：赋能外部 / 服务内部",
      "90 天试点看什么，不看融资故事",
    ],
    pros: [
      "最贴「化工集团」的语言",
      "显得正经、可巡检、可尽调",
      "用得上库里新补的卫生与 SOP",
    ],
    cons: [
      "第一次见面偏「工厂感」",
      "品牌与格局展示弱",
      "超出合伙人「了解即可」的剂量",
    ],
  },
  {
    key: "C",
    name: "政策与人力资本",
    when: "对方关心十五五、健康中国、员工或园区",
    pages: "约 12 页 / 20 分钟",
    content: [
      "治病中心 → 健康中心",
      "主动健康六支柱：我们补心理与睡眠",
      "企业过载：讲座解决不了，要可体验入口",
      "明确：不是医保、不是治病",
      "一个点位、一个季度、可退出",
    ],
    pros: [
      "舆论和规划最安全",
      "方便写进产业/园区叙事",
      "几乎不涉及未锁数字",
    ],
    cons: [
      "产品硬实力展示少",
      "技术口可能觉得空",
      "不像在介绍「一个项目」，像在讲政策",
    ],
  },
  {
    key: "D",
    name: "国际能力",
    when: "要压住「是不是小公司」，展示格局",
    pages: "约 14 页 / 25 分钟（已有底稿）",
    content: [
      "全球同题 + 定位 + 机理",
      "冠军平台、认证、消杀、专家生态",
      "规模与四条价值轴",
      "须改证据页：不用病种 RCT 当封面",
      "规模数字标「材料口径」，未锁不写死",
    ],
    pros: [
      "气场最大，已有一版可改",
      "适合「了解之后还想被镇住」",
    ],
    cons: [
      "第一次见面像路演，容易被当成要钱",
      "机构/用户/专利数字一追问就被动",
      "和合伙人「对齐即可」不一致",
    ],
  },
  {
    key: "E",
    name: "样板共建",
    when: "对方已经问「怎么合作、落哪个点」",
    pages: "约 10 页 / 15 分钟",
    content: [
      "复述他们的场景（一页）",
      "三选一：企业精力 / 园区 / 康养旗舰",
      "交付包与 90 天验收",
      "采购 / 联营 / 样板，各一行",
      "请拍板的一件事",
    ],
    pros: [
      "最能往前推一步",
      "投资也可以落成「先试点」",
    ],
    cons: [
      "第一次用会显得默认他们要买",
      "还没介绍清楚项目就谈落地",
      "和「先了解」冲突",
    ],
  },
];

function addFooter(s: PptxGenJS.Slide, pptx: PptxGenJS, n: number, total: number) {
  s.addText("内部 · 给合伙人选型 · 非正式对外稿", {
    x: 0.5,
    y: 7.1,
    w: 10,
    h: 0.25,
    fontSize: 11,
    color: C.muted,
    fontFace: "Arial",
  });
  s.addText(`${n} / ${total}`, {
    x: 11.5,
    y: 7.1,
    w: 1.3,
    h: 0.25,
    fontSize: 11,
    color: C.muted,
    align: "right",
    fontFace: "Arial",
  });
}

async function main() {
  const pptx = new PptxGenJS();
  pptx.author = "中友瑞水 / 知识库";
  pptx.title = "北化交流 PPT 结构选型（给合伙人）";
  pptx.layout = "LAYOUT_WIDE"; // 13.3" × 7.5"，方便对照表
  const total = 10;

  // 1 cover
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: "100%", h: "100%",
      fill: { color: C.navy },
    });
    s.addText("内部选型", {
      x: 0.7, y: 1.15, w: 11, h: 0.35,
      fontSize: 14, color: "93C5FD", fontFace: "Arial",
    });
    s.addText("北京化工集团第一次交流\nPPT 用哪套结构？", {
      x: 0.7, y: 1.6, w: 11, h: 1.6,
      fontSize: 32, bold: true, color: "FFFFFF", fontFace: "Arial",
    });
    s.addText("给合伙人圈选。先对齐这次会的目标，再看五套方案的内容和优缺点。\n推荐默认：A 初识对齐。", {
      x: 0.7, y: 3.45, w: 11, h: 0.8,
      fontSize: 16, color: "CBD5E1", fontFace: "Arial",
    });
  }

  // 2 demand
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: "100%", fill: { color: C.blue } });
    s.addText("这次会，我们到底要什么", {
      x: 0.5, y: 0.28, w: 12, h: 0.5,
      fontSize: 24, bold: true, color: C.navy, fontFace: "Arial",
    });
    s.addText("先写清需求，再选结构。结构跟错了，页数再漂亮也是错的。", {
      x: 0.5, y: 0.82, w: 12, h: 0.32,
      fontSize: 12, color: C.muted, fontFace: "Arial",
    });
    const facts = [
      ["对方是谁", "北京化工集团。第一次接触我们。想来了解项目；如果可以，有投资意向。"],
      ["合伙人口径", "让对方了解我们，知道我们的方向和他们的需求一致就行。"],
      ["本场不是", "融资路演、估值对赌、财务三模型、病种疗效承诺。"],
      ["本场是", "他们听懂我们在做什么；我们听懂他们要什么；双方觉得「同路」再往下走。"],
    ];
    facts.forEach((row, i) => {
      const y = 1.28 + i * 0.85;
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.5, y, w: 12.1, h: 0.78,
        fill: { color: C.bg }, rectRadius: 0.08,
      });
      s.addText(row[0], {
        x: 0.7, y: y + 0.1, w: 2.1, h: 0.55,
        fontSize: 14, bold: true, color: C.blue, fontFace: "Arial", valign: "middle",
      });
      s.addText(row[1], {
        x: 2.9, y: y + 0.1, w: 9.5, h: 0.55,
        fontSize: 14, color: C.text, fontFace: "Arial", valign: "middle",
      });
    });
    addFooter(s, pptx, 2, total);
  }

  // 3 principle
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: "100%", fill: { color: C.blue } });
    s.addText("选型原则（按这次需求）", {
      x: 0.5, y: 0.3, w: 12, h: 0.5,
      fontSize: 24, bold: true, color: C.navy, fontFace: "Arial",
    });
    const rules = [
      "第一次见面：先当介绍，不当路演。投资意向是背景，不是本场标题。",
      "国企听确定性：正经、有边界、可退出；少江湖感、少包治、少暴利。",
      "数字未锁：机构数 / 专利数 / C 端用户先不写死，或标「材料口径」。",
      "不卖治病：病种 RCT、医保、医院科室话术不进主页。",
      "选完一套主结构即可；其他方案可留到第二次或附录。",
    ];
    rules.forEach((t, i) => {
      const y = 1.05 + i * 0.7;
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.5, y, w: 12.1, h: 0.6,
        fill: { color: i === 0 ? C.recBg : C.bg }, rectRadius: 0.08,
      });
      s.addText(`${i + 1}`, {
        x: 0.65, y: y + 0.12, w: 0.4, h: 0.36,
        fontSize: 16, bold: true, color: C.blue, fontFace: "Arial",
      });
      s.addText(t, {
        x: 1.15, y: y + 0.1, w: 11.2, h: 0.4,
        fontSize: 15, color: C.text, fontFace: "Arial", valign: "middle",
      });
    });
    addFooter(s, pptx, 3, total);
  }

  // 4–8 schemes
  schemes.forEach((sc, idx) => {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: "100%", fill: { color: sc.rec ? C.rec : C.blue } });
    s.addText(`方案 ${sc.key}  ·  ${sc.name}${sc.rec ? "    ★ 按本次需求推荐" : ""}`, {
      x: 0.5, y: 0.22, w: 12.2, h: 0.45,
      fontSize: 22, bold: true, color: sc.rec ? C.rec : C.navy, fontFace: "Arial",
    });
    s.addText(`${sc.when}   ｜    ${sc.pages}`, {
      x: 0.5, y: 0.68, w: 12.2, h: 0.3,
      fontSize: 13, color: C.muted, fontFace: "Arial",
    });

    s.addText("讲什么", {
      x: 0.5, y: 1.15, w: 6.2, h: 0.3,
      fontSize: 13, bold: true, color: C.blue, fontFace: "Arial",
    });
    s.addText(sc.content.map((x) => ({ text: x, options: { bullet: true, breakLine: true } })), {
      x: 0.5, y: 1.5, w: 6.2, h: 5.2,
      fontSize: 15, color: C.text, fontFace: "Arial", valign: "top",
    });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 6.95, y: 1.15, w: 5.85, h: 2.55,
      fill: { color: C.recBg }, rectRadius: 0.08,
    });
    s.addText("优点", {
      x: 7.15, y: 1.25, w: 5.5, h: 0.3,
      fontSize: 13, bold: true, color: C.rec, fontFace: "Arial",
    });
    s.addText(sc.pros.map((x) => ({ text: x, options: { bullet: true, breakLine: true } })), {
      x: 7.15, y: 1.6, w: 5.5, h: 1.95,
      fontSize: 14, color: C.text, fontFace: "Arial", valign: "top",
    });

    s.addShape(pptx.ShapeType.roundRect, {
      x: 6.95, y: 3.85, w: 5.85, h: 2.85,
      fill: { color: "FFF7ED" }, rectRadius: 0.08,
    });
    s.addText("缺点 / 风险", {
      x: 7.15, y: 3.95, w: 5.5, h: 0.3,
      fontSize: 13, bold: true, color: C.warn, fontFace: "Arial",
    });
    s.addText(sc.cons.map((x) => ({ text: x, options: { bullet: true, breakLine: true } })), {
      x: 7.15, y: 4.3, w: 5.5, h: 2.25,
      fontSize: 14, color: C.text, fontFace: "Arial", valign: "top",
    });

    addFooter(s, pptx, 4 + idx, total);
  });

  // 9 compare
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: "100%", fill: { color: C.blue } });
    s.addText("五套对照（圈给合伙人）", {
      x: 0.5, y: 0.25, w: 12, h: 0.4,
      fontSize: 22, bold: true, color: C.navy, fontFace: "Arial",
    });
    s.addTable(
      [
        [
          { text: "方案", options: { fill: { color: C.navy }, color: "FFFFFF", bold: true } },
          { text: "一句话", options: { fill: { color: C.navy }, color: "FFFFFF", bold: true } },
          { text: "选它，如果…", options: { fill: { color: C.navy }, color: "FFFFFF", bold: true } },
          { text: "别选，如果…", options: { fill: { color: C.navy }, color: "FFFFFF", bold: true } },
        ],
        [
          { text: "A 初识 ★" },
          { text: "先当朋友，再谈本事" },
          { text: "真·第一次，口径是了解对齐" },
          { text: "对方已经很熟、只要落地" },
        ],
        [
          { text: "B 工业品" },
          { text: "用过程语言讲恢复" },
          { text: "席上有工程/质量" },
          { text: "只要轻松认识一下" },
        ],
        [
          { text: "C 政策人力" },
          { text: "写进主动健康叙事" },
          { text: "规划/党委/园区/HR 主导" },
          { text: "他们要看舱和认证" },
        ],
        [
          { text: "D 国际能力" },
          { text: "格局和硬实力" },
          { text: "怕被看成小作坊" },
          { text: "第一次、数字还没锁" },
        ],
        [
          { text: "E 样板" },
          { text: "只推一个可退出试点" },
          { text: "已经问怎么合作" },
          { text: "对方还在「这是什么」" },
        ],
      ],
      {
        x: 0.45,
        y: 0.9,
        w: 12.2,
        h: 5.8,
        colW: [1.8, 3.1, 3.7, 3.6],
        border: [{ pt: 0.5, color: C.line }],
        fontFace: "Arial",
        fontSize: 12,
        color: C.text,
        valign: "middle",
        align: "left",
      }
    );
    addFooter(s, pptx, 9, total);
  }

  // 10 pick
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: "100%", fill: { color: C.rec } });
    s.addText("建议与圈选", {
      x: 0.5, y: 0.25, w: 12, h: 0.4,
      fontSize: 22, bold: true, color: C.navy, fontFace: "Arial",
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.5, y: 0.8, w: 12.1, h: 1.55,
      fill: { color: C.recBg }, rectRadius: 0.1,
    });
    s.addText("按本次需求，推荐 A。", {
      x: 0.7, y: 0.95, w: 11.7, h: 0.35,
      fontSize: 18, bold: true, color: C.rec, fontFace: "Arial",
    });
    s.addText("对方第一次来了解，投资只是「如果可以」。合伙人要的是了解 + 方向一致。A 最不容易做成路演，也最不容易被数字和病种问住。B/D 留到第二次，或作附录 2 页。", {
      x: 0.7, y: 1.35, w: 11.7, h: 0.8,
      fontSize: 14, color: C.text, fontFace: "Arial",
    });

    s.addText("请合伙人勾选一套（可拼：例如「A，加半页消杀」）", {
      x: 0.5, y: 2.5, w: 12, h: 0.32,
      fontSize: 13, color: C.muted, fontFace: "Arial",
    });

    const boxes = [
      "□  A 初识对齐（推荐）",
      "□  B 工业品叙事",
      "□  C 政策与人力资本",
      "□  D 国际能力",
      "□  E 样板共建",
      "□  拼法：A + ______",
    ];
    boxes.forEach((t, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.5 + col * 6.15,
        y: 2.95 + row * 0.58,
        w: 5.95,
        h: 0.5,
        fill: { color: C.bg },
        rectRadius: 0.06,
      });
      s.addText(t, {
        x: 0.7 + col * 6.15,
        y: 3.03 + row * 0.58,
        w: 5.6,
        h: 0.35,
        fontSize: 14,
        color: C.text,
        fontFace: "Arial",
        valign: "middle",
      });
    });
    addFooter(s, pptx, 10, total);
  }

  const buf = (await pptx.write({ outputType: "nodebuffer" })) as Buffer;
  const filename = "北化交流_PPT结构选型_给合伙人.pptx";
  const mdName = "北化交流_PPT结构选型_给合伙人.md";
  const outDir = path.join(process.cwd(), "exports");
  mkdirSync(outDir, { recursive: true });
  mkdirSync("/opt/cursor/artifacts", { recursive: true });
  mkdirSync(path.join(process.cwd(), "public/exports"), { recursive: true });

  const pptPath = path.join(outDir, filename);
  writeFileSync(pptPath, buf);
  writeFileSync(path.join("/opt/cursor/artifacts", filename), buf);
  copyFileSync(pptPath, path.join(process.cwd(), "public/exports", filename));

  const md = `# 北化第一次交流：PPT 结构选型（给合伙人）

> 内部文件。对方是北京化工集团，**第一次接触**；想来了解项目，如果可以有投资意向。  
> 合伙人口径：**让对方了解我们，知道方向和他们的需求一致就行。**

## 这次会是什么

| | |
|--|--|
| 本场是 | 听懂我们在做什么；确认是否同路 |
| 本场不是 | 融资路演、估值、财务模型、治病承诺 |
| 数字 | 机构 / 专利 / C 端未锁，主页不写死 |
| 投资 | 是背景，不是标题。同路了自然会谈 |

## 按本次需求：推荐 A

第一次 + 了解 + 对齐方向 = **方案 A 初识对齐**（约 12 页 / 20 分钟）。  
B / D 更像第二次或附录。E 要等对方先问「怎么合作」。

---

${schemes
  .map(
    (sc) => `## 方案 ${sc.key}  ${sc.name}${sc.rec ? "  ★推荐" : ""}

**何时用：** ${sc.when}  
**体量：** ${sc.pages}

**讲什么**
${sc.content.map((x) => `- ${x}`).join("\n")}

**优点**
${sc.pros.map((x) => `- ${x}`).join("\n")}

**缺点**
${sc.cons.map((x) => `- ${x}`).join("\n")}
`
  )
  .join("\n---\n\n")}

## 对照

| 方案 | 一句话 | 选它，如果… | 别选，如果… |
|------|--------|-------------|-------------|
| A 初识 ★ | 先当朋友，再谈本事 | 真·第一次，口径是了解对齐 | 对方已经很熟、只要落地 |
| B 工业品 | 用过程语言讲恢复 | 席上有工程/质量 | 只要轻松认识一下 |
| C 政策人力 | 写进主动健康叙事 | 规划/党委/园区/HR 主导 | 他们要看舱和认证 |
| D 国际能力 | 格局和硬实力 | 怕被看成小作坊 | 第一次、数字还没锁 |
| E 样板 | 只推一个可退出试点 | 已经问怎么合作 | 对方还在「这是什么」 |

## 请圈选

- [ ] A 初识对齐（推荐）
- [ ] B 工业品叙事
- [ ] C 政策与人力资本
- [ ] D 国际能力
- [ ] E 样板共建
- [ ] 拼法：A + ________
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
