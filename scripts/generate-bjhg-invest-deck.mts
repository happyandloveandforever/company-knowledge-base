/**
 * 北京化工集团 · 心理健康赛道投资联动版。
 * 主线：心理健康是大健康里最重要也最薄弱的一环 → 我们在这一环的位置 →
 *       为什么这一环可持续、可扩展 → 作为北化大健康投资的联动切口。
 * 与「全插件版」的区别：不讲对方园区员工用不用，不以试点为落点，改讲赛道与产业逻辑。
 * 口径红线：不讲治病与病种有效率；测算与规划数字一律标口径；不出估值与投资条款。
 * 运行：npx tsx scripts/generate-bjhg-invest-deck.mts
 */
import { writeFileSync, mkdirSync, copyFileSync } from "fs";
import path from "path";
import PptxGenJS from "pptxgenjs";

const C = {
  navy: "1E3A5F",
  navyDeep: "16304F",
  blue: "2563EB",
  blueSoft: "DBEAFE",
  text: "1F2937",
  muted: "6B7280",
  line: "E5E7EB",
  bg: "F8FAFC",
  green: "065F46",
  greenBg: "ECFDF5",
  amber: "92400E",
  amberBg: "FFF7ED",
  white: "FFFFFF",
};

const F = "Arial";
const TOTAL = 15;

function footer(s: PptxGenJS.Slide, n: number) {
  s.addText("漂浮方舟 · 中友瑞水（北京）科技有限公司", {
    x: 0.5, y: 7.08, w: 9.5, h: 0.26, fontSize: 10, color: C.muted, fontFace: F,
  });
  s.addText(`${n} / ${TOTAL}`, {
    x: 11.4, y: 7.08, w: 1.4, h: 0.26,
    fontSize: 10, color: C.muted, align: "right", fontFace: F,
  });
}

function head(s: PptxGenJS.Slide, pptx: PptxGenJS, kicker: string, title: string, accent = C.blue) {
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.14, h: "100%", fill: { color: accent } });
  s.addText(kicker, {
    x: 0.55, y: 0.26, w: 12, h: 0.28,
    fontSize: 11.5, color: accent, fontFace: F, charSpacing: 1,
  });
  s.addText(title, {
    x: 0.55, y: 0.55, w: 12.2, h: 0.55,
    fontSize: 26, bold: true, color: C.navy, fontFace: F,
  });
}

function cards(
  s: PptxGenJS.Slide,
  pptx: PptxGenJS,
  items: { title: string; lines: string[] }[],
  opts: { y: number; cols: number; h: number; fill?: string; titleColor?: string; fontSize?: number }
) {
  const gap = 0.3;
  const totalW = 12.25;
  const w = (totalW - gap * (opts.cols - 1)) / opts.cols;
  items.forEach((item, i) => {
    const col = i % opts.cols;
    const row = Math.floor(i / opts.cols);
    const x = 0.55 + col * (w + gap);
    const y = opts.y + row * (opts.h + gap);
    s.addShape(pptx.ShapeType.roundRect, {
      x, y, w, h: opts.h, fill: { color: opts.fill ?? C.bg }, rectRadius: 0.08,
    });
    s.addText(item.title, {
      x: x + 0.24, y: y + 0.16, w: w - 0.48, h: 0.42,
      fontSize: 15, bold: true, color: opts.titleColor ?? C.navy, fontFace: F, valign: "top",
    });
    s.addText(
      item.lines.map((t) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: true } })),
      {
        x: x + 0.24, y: y + 0.62, w: w - 0.44, h: opts.h - 0.8,
        fontSize: opts.fontSize ?? 12.5, color: C.text, fontFace: F, valign: "top", lineSpacingMultiple: 1.15,
      }
    );
  });
}

/** 大数字块 */
function stats(
  s: PptxGenJS.Slide,
  pptx: PptxGenJS,
  items: { num: string; label: string; note?: string }[],
  y: number,
  fill = C.bg,
  numColor = C.navy
) {
  const gap = 0.3;
  const w = (12.25 - gap * (items.length - 1)) / items.length;
  items.forEach((it, i) => {
    const x = 0.55 + i * (w + gap);
    s.addShape(pptx.ShapeType.roundRect, { x, y, w, h: 1.75, fill: { color: fill }, rectRadius: 0.08 });
    s.addText(it.num, {
      x: x + 0.15, y: y + 0.18, w: w - 0.3, h: 0.6,
      fontSize: 30, bold: true, color: numColor, align: "center", fontFace: F,
    });
    s.addText(it.label, {
      x: x + 0.15, y: y + 0.82, w: w - 0.3, h: 0.5,
      fontSize: 13, color: C.text, align: "center", fontFace: F, valign: "top",
    });
    if (it.note) {
      s.addText(it.note, {
        x: x + 0.15, y: y + 1.36, w: w - 0.3, h: 0.32,
        fontSize: 10, color: C.muted, align: "center", fontFace: F,
      });
    }
  });
}

async function main() {
  const pptx = new PptxGenJS();
  pptx.author = "中友瑞水（北京）科技有限公司";
  pptx.company = "漂浮方舟 FLOATING ARK";
  pptx.title = "漂浮方舟 × 北京化工集团 · 心理健康赛道与产业联动";
  pptx.subject = "首次交流：赛道、可持续性与联动方向";
  pptx.layout = "LAYOUT_WIDE";

  // ── 封面 ───────────────────────────────────────────────
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.navy } });
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 6.9, w: "100%", h: 0.6, fill: { color: C.navyDeep } });
    s.addText("FLOATING ARK · 漂浮方舟", {
      x: 0.8, y: 1.0, w: 11, h: 0.35,
      fontSize: 14, color: "93C5FD", fontFace: F, charSpacing: 2,
    });
    s.addText("心理健康：\n大健康里最重要，也最薄弱的一环", {
      x: 0.8, y: 1.5, w: 11.6, h: 1.9,
      fontSize: 33, bold: true, color: C.white, fontFace: F, lineSpacingMultiple: 1.15,
    });
    s.addText("与北京化工集团第一次交流 · 这一环的产业前景，与可联动、可扩展的位置", {
      x: 0.8, y: 3.7, w: 11.6, h: 0.4,
      fontSize: 17, color: "CBD5E1", fontFace: F,
    });
    s.addShape(pptx.ShapeType.line, { x: 0.85, y: 4.35, w: 3.2, h: 0, line: { color: "3B82F6", width: 2 } });
    s.addText("中友瑞水（北京）科技有限公司 · 北京亦庄", {
      x: 0.8, y: 4.6, w: 11, h: 0.32,
      fontSize: 13, color: "94A3B8", fontFace: F,
    });
    s.addText("本材料用于首次交流，测算与规划数字均标注口径；不构成疗效承诺或投资要约", {
      x: 0.8, y: 7.0, w: 11.6, h: 0.4,
      fontSize: 11.5, color: "64748B", fontFace: F, valign: "middle",
    });
  }

  // ── 1 全篇一页 ─────────────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "先说结论", "我们想谈的，是心理健康这一环的产业机会");
    const rows: [string, string][] = [
      ["这一环重要", "精神健康的社会代价已是千亿量级，且仍在上升；心理与睡眠被明确写进主动健康议程"],
      ["这一环薄弱", "供给几乎只有药物、谈话与讲座；非药物、可体验、可复制的物理入口近乎空白"],
      ["我们的位置", "在这一环做非药物主动干预系统：设备 + 标准流程 + 认证 + 人才，不是单店生意"],
      ["为什么可持续", "疗程化运营而非一次性买卖；专利、认证、标准与数据构成可累积的壁垒"],
      ["为什么值得联动", "它可以作为大健康投资组合里一个能横向扩展、纵向做深的独立品类"],
    ];
    rows.forEach((r, i) => {
      const y = 1.3 + i * 1.05;
      const hot = i === 4;
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.55, y, w: 12.25, h: 0.95,
        fill: { color: hot ? C.greenBg : C.bg }, rectRadius: 0.08,
      });
      s.addText(r[0], {
        x: 0.8, y: y + 0.1, w: 2.5, h: 0.75,
        fontSize: 16, bold: true, color: hot ? C.green : C.blue, fontFace: F, valign: "middle",
      });
      s.addText(r[1], {
        x: 3.4, y: y + 0.1, w: 9.1, h: 0.75,
        fontSize: 14, color: C.text, fontFace: F, valign: "middle",
      });
    });
    footer(s, 2);
  }

  // ── 2 这一环有多重要 ────────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "重要性", "心理这一环的代价，已经不是「软性福利」问题");
    stats(
      s,
      pptx,
      [
        { num: "5,900 亿", label: "精神健康问题全社会年度总成本", note: "北大精神卫生研究所 ·《柳叶刀》系列研究" },
        { num: "> 15%", label: "占当年全国卫生总支出比例", note: "同一研究口径" },
        { num: "4 倍", label: "2005 → 2013 八年增长", note: "1,470 亿 → 5,900 亿" },
      ],
      1.35
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 3.35, w: 12.25, h: 1.6, fill: { color: C.blueSoft }, rectRadius: 0.1,
    });
    s.addText("在产业侧，这些代价大多不进账本", {
      x: 0.8, y: 3.52, w: 11.8, h: 0.35,
      fontSize: 16, bold: true, color: C.navy, fontFace: F,
    });
    s.addText(
      [
        "制造业职业倦怠检出率约 60%；管理岗职业紧张风险显著更高（中国疾控 2024）",
        "多数人选择「带病上班」，损失以效率下降的形式内化，不显现为医疗支出",
        "行业内粗略估算：倦怠造成的隐性产出损失约 5 万亿元／年（估算口径，非统计数据）",
      ].map((t) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: true } })),
      { x: 0.85, y: 3.92, w: 11.7, h: 0.95, fontSize: 13.5, color: C.text, fontFace: F, lineSpacingMultiple: 1.15 }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.15, w: 12.25, h: 1.35, fill: { color: C.bg }, rectRadius: 0.1,
    });
    s.addText("政策已经把这一环点出来", {
      x: 0.8, y: 5.3, w: 11.8, h: 0.32,
      fontSize: 14, bold: true, color: C.blue, fontFace: F,
    });
    s.addText(
      "主动健康六支柱为膳食、运动、心理、睡眠、居住环境、健康管理。心理与睡眠是其中两柱，也是目前可体验供给最少的两柱。国家口径已从以治病为中心转向以健康为中心。",
      { x: 0.8, y: 5.66, w: 11.8, h: 0.7, fontSize: 13.5, color: C.text, fontFace: F, valign: "top" }
    );
    footer(s, 3);
  }

  // ── 3 这一环有多薄弱 ────────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "薄弱环节 = 机会所在", "现有供给解决不了「日常恢复」这件事", C.amber);
    cards(
      s,
      pptx,
      [
        { title: "药物", lines: ["面向已确诊人群", "覆盖不到亚健康与高压状态", "多数人不愿也不需要走到这一步"] },
        { title: "心理咨询", lines: ["依赖咨询师供给与个人意愿", "起效慢、价格与产能都受限", "很难标准化复制"] },
        { title: "讲座与体检", lines: ["企业最常见的做法", "缺日常参与感，留不下过程数据", "做完就结束"] },
        { title: "缺的是这一类", lines: ["非药物、可体验、可重复", "有过程记录、能被管理", "能像门店一样复制开出去"] },
      ],
      { y: 1.4, cols: 4, h: 2.5, fontSize: 12 }
    );
    stats(
      s,
      pptx,
      [
        { num: "< 5%", label: "社区卫生体系中非药物神经干预覆盖率", note: "行业研究口径" },
        { num: "< 5%", label: "主动健康万亿市场当前渗透率", note: "行业研究口径" },
        { num: "6 万亿", label: "2040 年健康产业预测规模", note: "第三方预测，非承诺" },
      ],
      4.2,
      C.amberBg,
      C.amber
    );
    s.addText("重要、代价高、供给空白、渗透率低——这四个条件同时成立的赛道并不多。", {
      x: 0.55, y: 6.2, w: 12.25, h: 0.4,
      fontSize: 15, bold: true, color: C.navy, fontFace: F,
    });
    footer(s, 4);
  }

  // ── 4 我们的位置 ────────────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "我们的位置", "在心理这一环，做非药物的主动干预系统");
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 1.3, w: 12.25, h: 1.2, fill: { color: C.greenBg }, rectRadius: 0.1,
    });
    s.addText(
      "用高浮力盐水与低刺激环境，让神经系统从持续外部应答中撤离；再把评估、入舱、感知调度、消杀、复访连成一套标准流程。",
      { x: 0.8, y: 1.48, w: 11.8, h: 0.85, fontSize: 15.5, color: C.green, fontFace: F, valign: "middle", lineSpacingMultiple: 1.2 }
    );
    const steps = [
      { k: "减负", d: "浮力去负荷" },
      { k: "降噪", d: "感官输入下降" },
      { k: "重置", d: "自主神经切换" },
      { k: "整合", d: "脑状态整合" },
    ];
    steps.forEach((st, i) => {
      const x = 0.55 + i * 3.13;
      s.addShape(pptx.ShapeType.roundRect, { x, y: 2.7, w: 2.95, h: 1.0, fill: { color: C.bg }, rectRadius: 0.08 });
      s.addText(st.k, {
        x, y: 2.82, w: 2.95, h: 0.42,
        fontSize: 19, bold: true, color: C.navy, align: "center", fontFace: F,
      });
      s.addText(st.d, {
        x, y: 3.24, w: 2.95, h: 0.32,
        fontSize: 12.5, color: C.muted, align: "center", fontFace: F,
      });
      if (i < 3) {
        s.addText("›", { x: x + 2.95, y: 2.98, w: 0.18, h: 0.4, fontSize: 20, bold: true, color: C.muted, align: "center", fontFace: F });
      }
    });
    cards(
      s,
      pptx,
      [
        {
          title: "心理学不是我们贴上去的标签",
          lines: [
            "胡佩诚教授：北大医学心理学系博导，国务院特殊津贴专家",
            "郝树伟副教授：北大医学院临床心理学系，催眠与漂浮结合",
            "杜文东教授：南京中医药大学心理学院前院长",
          ],
        },
        {
          title: "定位写得很清楚",
          lines: [
            "心理健康与精神卫生服务的主动干预系统",
            "整体状态调节型干预，不是单一靶点治疗",
            "不替代临床诊疗，不做病种承诺",
          ],
        },
      ],
      { y: 3.95, cols: 2, h: 2.5, fontSize: 12.5 }
    );
    footer(s, 5);
  }

  // ── 5 为什么不是一个店 ──────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "可扩展性 · 之一", "我们卖的不是一台设备，是一套能复制的经营系统");
    cards(
      s,
      pptx,
      [
        { title: "设备供应", lines: ["自研舱体、控制与净化", "纯物理消杀，不加化学药剂", "参数以型号文件为准"] },
        { title: "运营管理", lines: ["从选址到日常运维的标准流程", "疗程设计与复访机制", "换个城市开出同样的店"] },
        { title: "资质认证", lines: ["ISO 9001、CE、RoHS、FCC、UL", "漂浮液饮用水级检测", "二类医疗器械认证推进中"] },
        { title: "人才培训", lines: ["执证人才培养体系", "解决行业最缺的操作端", "培训本身也是收入与门槛"] },
      ],
      { y: 1.4, cols: 4, h: 2.35, fontSize: 12 }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 4.05, w: 12.25, h: 2.4, fill: { color: C.blueSoft }, rectRadius: 0.1,
    });
    s.addText("能力被拆成模块，所以换场景不用重新摸索", {
      x: 0.8, y: 4.24, w: 11.8, h: 0.35,
      fontSize: 16, bold: true, color: C.navy, fontFace: F,
    });
    s.addText(
      [
        "硬件输出库：设备输出参数沉淀为可选择、可组合的模块",
        "传感采集库：持续采集心率、压力、睡眠等体征变化",
        "模型匹配库：把用户状态匹配到声、光、频率、水体与温控方案",
        "指令与验证库：效果回流形成下一次可调用的经验",
      ].map((t) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: true } })),
      { x: 0.85, y: 4.65, w: 11.7, h: 1.3, fontSize: 13.5, color: C.text, fontFace: F, lineSpacingMultiple: 1.15 }
    );
    s.addText("可调用的模块，才是真正的积累。这也是能从单点走向网络的前提。", {
      x: 0.85, y: 5.98, w: 11.7, h: 0.35,
      fontSize: 13, italic: true, color: C.blue, fontFace: F,
    });
    footer(s, 6);
  }

  // ── 6 可持续性：收入结构 ────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "可持续性 · 之一", "不是一次性买卖，收入有多条腿", C.green);
    cards(
      s,
      pptx,
      [
        { title: "设备与租赁", lines: ["一次性采购，或按月租赁", "降低客户初始门槛", "我们获得持续现金流"] },
        { title: "运营与服务包", lines: ["联合运营按收益分成", "企业与园区项目制服务包", "疗程制而非单次消费"] },
        { title: "认证与培训", lines: ["资质认证服务", "执证人才培训", "同时构成行业门槛"] },
        { title: "数据与协议", lines: ["过程数据形成资产", "算法与协议可订阅授权", "长期看这是最值钱的一层"] },
      ],
      { y: 1.4, cols: 4, h: 2.35, fontSize: 12 }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 4.05, w: 12.25, h: 1.45, fill: { color: C.greenBg }, rectRadius: 0.1,
    });
    s.addText("关键差别：疗程化运营比单次体验更能沉淀客户价值", {
      x: 0.8, y: 4.22, w: 11.8, h: 0.35,
      fontSize: 16, bold: true, color: C.green, fontFace: F,
    });
    s.addText(
      "单次漂浮只是触感体验，恢复靠疗程建立。疗程带来复购、档案与顾问关系，客户迁移成本随时间上升——这决定了它是一门可以做长的生意，而不是一次设备交易。",
      { x: 0.8, y: 4.62, w: 11.8, h: 0.8, fontSize: 13.5, color: C.text, fontFace: F, valign: "top" }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.68, w: 12.25, h: 0.82, fill: { color: C.amberBg }, rectRadius: 0.08,
    });
    s.addText(
      "价格带、分成比例与单店模型均为内部规划口径，尚未最终锁定；本场不展开财务测算，需要时另出书面材料。",
      { x: 0.8, y: 5.68, w: 11.8, h: 0.82, fontSize: 13, color: C.amber, fontFace: F, valign: "middle" }
    );
    footer(s, 7);
  }

  // ── 7 可持续性：壁垒 ────────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "可持续性 · 之二", "壁垒不在一台机器上，在标准和积累上", C.green);
    cards(
      s,
      pptx,
      [
        { title: "技术", lines: ["专有设备与配方", "高精度控温与声学环境", "三十余项国家专利（材料口径）"] },
        { title: "内容与知识", lines: ["机理与疗程设计", "医学化表述与报告体系", "与院士、心理学专家共建路线"] },
        { title: "运营", lines: ["疗程化 SOP", "培训与认证形成操作端门槛", "服务质量可被复制与检查"] },
        { title: "标准与生态", lines: ["深度参与行业标准制定", "世界漂浮学会 2026 年法国注册", "从设备制造商走向标准制定者"] },
      ],
      { y: 1.4, cols: 4, h: 2.4, fontSize: 12 }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 4.1, w: 12.25, h: 1.5, fill: { color: C.bg }, rectRadius: 0.1,
    });
    s.addText("三重锁定：为什么客户走不掉", {
      x: 0.8, y: 4.26, w: 11.8, h: 0.32,
      fontSize: 15, bold: true, color: C.blue, fontFace: F,
    });
    s.addText(
      "体验锁定（温控精度、配方与环境难以简单模仿）｜数据锁定（HRV、睡眠与疗程档案连续积累）｜关系锁定（顾问与复访机制，成为长期健康管理伙伴）",
      { x: 0.8, y: 4.66, w: 11.8, h: 0.85, fontSize: 13.5, color: C.text, fontFace: F, valign: "top" }
    );
    s.addText("这一环最终会有标准。我们的目标是参与定标准的人，而不是被标准筛掉的人。", {
      x: 0.55, y: 5.85, w: 12.25, h: 0.5,
      fontSize: 16, bold: true, color: C.navy, fontFace: F,
    });
    footer(s, 8);
  }

  // ── 8 生态已在联动 ──────────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "可扩展性 · 之二", "这一环不用我们一家做完，生态已经在搭");
    const partners = [
      ["秦皇岛国家综合训练基地", "体能修复与国家级运动康复实证"],
      ["俞梦孙人民健康系统工程", "环境干预模块与主动预防研究"],
      ["京东方健康", "生理数据物联网闭环"],
      ["中国旅游集团", "文旅康养疗愈空间"],
      ["国药集团", "临床级供应链与漂浮液安全"],
      ["中国数字文化集团", "光影声场沉浸式疗愈内容"],
    ];
    partners.forEach((p, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.55 + col * 6.275;
      const y = 1.4 + row * 1.28;
      s.addShape(pptx.ShapeType.roundRect, { x, y, w: 5.975, h: 1.15, fill: { color: C.bg }, rectRadius: 0.08 });
      s.addShape(pptx.ShapeType.rect, { x, y, w: 0.09, h: 1.15, fill: { color: C.blue } });
      s.addText(p[0], {
        x: x + 0.28, y: y + 0.16, w: 5.5, h: 0.42,
        fontSize: 15, bold: true, color: C.navy, fontFace: F,
      });
      s.addText(p[1], {
        x: x + 0.28, y: y + 0.6, w: 5.5, h: 0.42,
        fontSize: 12.5, color: C.text, fontFace: F,
      });
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.35, w: 12.25, h: 1.15, fill: { color: C.greenBg }, rectRadius: 0.1,
    });
    s.addText(
      "已有合作说明一件事：这一环可以横向接进体育、文旅、医药、数据与内容——它不是一个孤立品类，而是一个能不断接线的接口。",
      { x: 0.8, y: 5.35, w: 11.8, h: 1.15, fontSize: 14.5, color: C.green, fontFace: F, valign: "middle" }
    );
    footer(s, 9);
  }

  // ── 9 和北化的联动（简单提）─────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "和北京化工集团", "如果放进你们的大健康布局，联动点大致是这些");
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 1.28, w: 12.25, h: 0.95, fill: { color: C.blueSoft }, rectRadius: 0.1,
    });
    s.addText(
      "先说清主次：我们今天不是来找一个使用场地，也不是来卖一批设备。我们谈的是这一环值不值得进，以及进来以后能往哪里扩。",
      { x: 0.8, y: 1.28, w: 11.8, h: 0.95, fontSize: 14.5, color: C.navy, fontFace: F, valign: "middle" }
    );
    cards(
      s,
      pptx,
      [
        {
          title: "投资联动：一个可独立成长的品类",
          lines: [
            "心理健康是大健康组合里目前最空的一格",
            "可以单独成为一条业务线，也能与既有健康资产互补",
            "不依赖单一客户或单一区域",
          ],
        },
        {
          title: "产业接口（简单提）",
          lines: [
            "漂浮液与母液本质是化工配方，规模化后有原料与配套液接口",
            "消杀与过滤材料、舱体制造，与集团制造与质量体系能对接",
            "集团信用有助于打开国企、园区与公共机构渠道",
          ],
        },
        {
          title: "扩展方向",
          lines: [
            "纵向：从设备到运营、认证、培训、数据",
            "横向：体育、文旅、康养、企业健康、公共示范",
            "长期：参与标准与认证体系，占据定义权",
          ],
        },
      ],
      { y: 2.42, cols: 3, h: 2.85, fontSize: 12 }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.45, w: 12.25, h: 1.05, fill: { color: C.greenBg }, rectRadius: 0.1,
    });
    s.addText(
      "我们希望被看成大健康投资里的一块拼图：自己能长，也能带动别的板块一起长。",
      { x: 0.8, y: 5.45, w: 11.8, h: 1.05, fontSize: 15.5, bold: true, color: C.green, fontFace: F, valign: "middle" }
    );
    footer(s, 10);
  }

  // ── 10 增长路径 ─────────────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "路径", "我们自己的三步走（内部规划口径）");
    const phases = [
      { t: "第一步", n: "验证与标准化", d: ["样板站跑通标准流程", "启动规范化临床与数据队列", "把「非药物恢复」做成一个被认识的品类"] },
      { t: "第二步", n: "B 端规模输出", d: ["从卖设备转向卖解决方案包", "渗透医疗、企业健康与康养渠道", "顾问服务 + 订阅 + 授权并行"] },
      { t: "第三步", n: "平台化与标准", d: ["以效果数据与客户深度绑定", "年度包干替代单次服务", "推进注册申报与标准参与"] },
    ];
    phases.forEach((p, i) => {
      const x = 0.55 + i * 4.18;
      s.addShape(pptx.ShapeType.roundRect, { x, y: 1.4, w: 3.95, h: 3.6, fill: { color: C.bg }, rectRadius: 0.1 });
      s.addShape(pptx.ShapeType.rect, { x, y: 1.4, w: 3.95, h: 0.62, fill: { color: C.navy } });
      s.addText(`${p.t} · ${p.n}`, {
        x, y: 1.4, w: 3.95, h: 0.62,
        fontSize: 15, bold: true, color: C.white, align: "center", valign: "middle", fontFace: F,
      });
      s.addText(
        p.d.map((t) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: true } })),
        { x: x + 0.25, y: 2.2, w: 3.5, h: 2.6, fontSize: 12.5, color: C.text, fontFace: F, valign: "top", lineSpacingMultiple: 1.2 }
      );
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.2, w: 12.25, h: 1.3, fill: { color: C.amberBg }, rectRadius: 0.1,
    });
    s.addText("关于时间表与投入", {
      x: 0.8, y: 5.34, w: 11.8, h: 0.3,
      fontSize: 13, bold: true, color: C.amber, fontFace: F,
    });
    s.addText(
      "三步的年份、投入与产出模型属内部规划，尚未对外锁定。若你们决定深入，我们再按尽调要求提供逐项书面材料，而不是在第一次见面给一个漂亮但不牢的数字。",
      { x: 0.8, y: 5.68, w: 11.8, h: 0.7, fontSize: 13.5, color: C.text, fontFace: F, valign: "top" }
    );
    footer(s, 11);
  }

  // ── 11 证据与边界 ───────────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "证据与边界", "我们怎么说效果，以及我们不说什么", C.amber);
    const tiers = [
      { name: "能讲的", color: C.greenBg, title: "安全与可重复", lines: ["纯物理消杀路线，不加化学药剂", "2024 年 PLOS ONE 可行性研究：75 人各约 6 次，依从约 85%–89%，无与干预相关的严重不良事件"] },
      { name: "谨慎讲的", color: C.blueSoft, title: "即时状态改善", lines: ["2018 年开放标签试验（不是随机对照）：单次约 1 小时后状态焦虑显著下降；作者本人要求更大对照试验复核"] },
      { name: "不讲的", color: C.amberBg, title: "特定病种疗效", lines: ["国际上确有病种试验，多为小样本；我们只说「研究在追问」", "不作治疗承诺，不进销售口径，不替代临床诊疗"] },
    ];
    tiers.forEach((t, i) => {
      const y = 1.35 + i * 1.42;
      s.addShape(pptx.ShapeType.roundRect, { x: 0.55, y, w: 12.25, h: 1.3, fill: { color: t.color }, rectRadius: 0.08 });
      s.addText(t.name, {
        x: 0.78, y: y + 0.12, w: 2.6, h: 0.28,
        fontSize: 11.5, bold: true, color: C.muted, fontFace: F,
      });
      s.addText(t.title, {
        x: 0.78, y: y + 0.42, w: 2.9, h: 0.5,
        fontSize: 16, bold: true, color: C.navy, fontFace: F, valign: "top",
      });
      s.addText(
        t.lines.map((x) => ({ text: x, options: { bullet: { indent: 14 }, breakLine: true } })),
        { x: 3.9, y: y + 0.14, w: 8.6, h: 1.05, fontSize: 12.5, color: C.text, fontFace: F, valign: "middle", lineSpacingMultiple: 1.15 }
      );
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.7, w: 12.25, h: 0.8, fill: { color: C.bg }, rectRadius: 0.08,
    });
    s.addText(
      "对投资方我们更愿意先说边界：这个赛道最大的风险不是说得少，是说过头。守住边界，这门生意才能做长。",
      { x: 0.8, y: 5.7, w: 11.8, h: 0.8, fontSize: 14, color: C.text, fontFace: F, valign: "middle" }
    );
    footer(s, 12);
  }

  // ── 12 我们已经在做的事 ────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "底数", "不是从零起步，但数字只按材料口径讲");
    cards(
      s,
      pptx,
      [
        { title: "十年只做一件事", lines: ["设备、液体、消杀、运营已成闭环", "四大业务：供应、运营、认证、培训", "五条产品线组成完整交付"] },
        { title: "资质与检测", lines: ["ISO 9001 体系", "欧盟 CE、RoHS；美国 FCC、UL", "漂浮液饮用水级别检测", "二类医疗器械认证推进中"] },
        { title: "资质荣誉", lines: ["国家及中关村双高新", "中关村金种子", "首批国家专精特新", "参与行业标准制定"] },
      ],
      { y: 1.4, cols: 3, h: 2.5, fontSize: 12.5 }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 4.15, w: 12.25, h: 1.45, fill: { color: C.blueSoft }, rectRadius: 0.1,
    });
    s.addText("规模（企业宣传材料口径，正在统一核定，以书面交付资料为准）", {
      x: 0.8, y: 4.3, w: 11.8, h: 0.3,
      fontSize: 12, color: C.muted, fontFace: F,
    });
    s.addText("三十余项国家专利   ｜   32 项质量安全标准检测   ｜   服务机构逾八百家   ｜   国家社科基金重大项目参与", {
      x: 0.8, y: 4.66, w: 11.8, h: 0.45,
      fontSize: 14, bold: true, color: C.navy, fontFace: F, valign: "middle",
    });
    s.addText("需要精确数据与凭证，我们按尽调清单逐项出具，不在演示材料里写死。", {
      x: 0.8, y: 5.12, w: 11.8, h: 0.4,
      fontSize: 12.5, italic: true, color: C.text, fontFace: F,
    });
    s.addText("被验证，才值得被信任。", {
      x: 0.55, y: 5.85, w: 12.25, h: 0.5,
      fontSize: 20, bold: true, color: C.navy, align: "center", fontFace: F,
    });
    footer(s, 13);
  }

  // ── 13 下一步 ───────────────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "下一步", "如果你们觉得这一环值得看，接下来可以这样", C.green);
    cards(
      s,
      pptx,
      [
        { title: "一 · 实地看一次", lines: ["看设备、净化与运营流程", "亲身体验一次", "半天时间，判断是不是一回事"] },
        { title: "二 · 我们出材料", lines: ["按你们的尽调清单逐项准备", "专利、检测、认证凭证", "客户与运营数据口径核定后提供"] },
        { title: "三 · 再谈怎么进", lines: ["财务与合作结构那时候再谈", "可以是投资，也可以是产业协同", "由你们的节奏决定"] },
      ],
      { y: 1.45, cols: 3, h: 2.6, fontSize: 12.5, fill: C.greenBg, titleColor: C.green }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 4.4, w: 12.25, h: 2.1, fill: { color: C.bg }, rectRadius: 0.12,
    });
    s.addText("今天只想留下一个判断", {
      x: 0.8, y: 4.62, w: 11.8, h: 0.4,
      fontSize: 15, color: C.muted, fontFace: F,
    });
    s.addText("心理健康这一环，值得一个产业集团认真进入。", {
      x: 0.8, y: 5.05, w: 11.8, h: 0.6,
      fontSize: 24, bold: true, color: C.navy, fontFace: F,
    });
    s.addText("我们已经在里面做了十年，愿意把这十年放进一个更大的盘子里一起做大。", {
      x: 0.8, y: 5.75, w: 11.8, h: 0.45,
      fontSize: 14, color: C.text, fontFace: F,
    });
    footer(s, 14);
  }

  // ── 14 封底 ─────────────────────────────────────────────
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.navy } });
    s.addText("谢谢", {
      x: 0.9, y: 1.8, w: 11, h: 0.8,
      fontSize: 40, bold: true, color: C.white, fontFace: F,
    });
    s.addText("心理健康是大健康里最重要、也最薄弱的一环", {
      x: 0.9, y: 2.8, w: 11.4, h: 0.45,
      fontSize: 18, color: "CBD5E1", fontFace: F,
    });
    s.addShape(pptx.ShapeType.line, { x: 0.95, y: 3.55, w: 3.2, h: 0, line: { color: "3B82F6", width: 2 } });
    s.addText(
      "中友瑞水（北京）科技有限公司 · 漂浮方舟 FLOATING ARK\n北京亦庄   ｜   400-8869-783   ｜   www.float-ark.com",
      { x: 0.9, y: 3.8, w: 11, h: 0.9, fontSize: 14, color: "94A3B8", fontFace: F, lineSpacingMultiple: 1.3 }
    );
    s.addText(
      "本材料用于初次交流。测算与规划数字为内部口径，尚未最终锁定；不构成疗效承诺、收益预测或投资要约。",
      { x: 0.9, y: 6.65, w: 11.6, h: 0.45, fontSize: 11, color: "64748B", fontFace: F }
    );
  }

  const buf = (await pptx.write({ outputType: "nodebuffer" })) as Buffer;
  const filename = "漂浮方舟_北京化工集团_心理健康赛道_投资联动版.pptx";
  const outDir = path.join(process.cwd(), "exports");
  mkdirSync(outDir, { recursive: true });
  mkdirSync("/opt/cursor/artifacts", { recursive: true });
  mkdirSync(path.join(process.cwd(), "public/exports"), { recursive: true });

  const pptPath = path.join(outDir, filename);
  writeFileSync(pptPath, buf);
  writeFileSync(path.join("/opt/cursor/artifacts", filename), buf);
  copyFileSync(pptPath, path.join(process.cwd(), "public/exports", filename));
  copyFileSync(pptPath, path.join("/opt/cursor/artifacts", "bjhg-invest-deck.pptx"));

  console.log("pptx bytes", buf.length);
  console.log("pptx", pptPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
