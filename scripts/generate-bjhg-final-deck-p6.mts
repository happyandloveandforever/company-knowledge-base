/**
 * 北京化工集团第一次交流 · 对外成品稿（含 P6 赛道插件）。
 * 结构 = 脊柱 9 页 + 插件 P1–P5 + 新增 P6 两页；脊柱与 P1–P5 内容与全插件版逐页一致。
 * P6 位置在 P3 底数之后、三个接口之前：先讲赛道与投资联动，再讲和集团的接口。
 * 口径遵守库内红线：不讲治病与病种有效率；未锁数字标「材料口径」；
 * 院内联合运营稿与独立门店 SOP 不混；不出估值与财务模型。
 * 运行：npx tsx scripts/generate-bjhg-final-deck.mts
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
const TOTAL = 17;

function footer(s: PptxGenJS.Slide, n: number, tag = "漂浮方舟 · 中友瑞水（北京）科技有限公司") {
  s.addText(tag, {
    x: 0.5, y: 7.08, w: 9.5, h: 0.26,
    fontSize: 10, color: C.muted, fontFace: F,
  });
  s.addText(`${n} / ${TOTAL}`, {
    x: 11.4, y: 7.08, w: 1.4, h: 0.26,
    fontSize: 10, color: C.muted, align: "right", fontFace: F,
  });
}

function head(
  s: PptxGenJS.Slide,
  pptx: PptxGenJS,
  kicker: string,
  title: string,
  accent = C.blue
) {
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

/** 卡片：标题 + 若干短句 */
function cards(
  s: PptxGenJS.Slide,
  pptx: PptxGenJS,
  items: { title: string; lines: string[] }[],
  opts: { y: number; cols: number; h: number; fill?: string; titleColor?: string }
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
      x, y, w, h: opts.h,
      fill: { color: opts.fill ?? C.bg }, rectRadius: 0.08,
    });
    s.addText(item.title, {
      x: x + 0.24, y: y + 0.16, w: w - 0.48, h: 0.42,
      fontSize: 15, bold: true, color: opts.titleColor ?? C.navy, fontFace: F, valign: "top",
    });
    s.addText(
      item.lines.map((t) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: true } })),
      {
        x: x + 0.24, y: y + 0.62, w: w - 0.44, h: opts.h - 0.8,
        fontSize: 12.5, color: C.text, fontFace: F, valign: "top", lineSpacingMultiple: 1.15,
      }
    );
  });
}

async function main() {
  const pptx = new PptxGenJS();
  pptx.author = "中友瑞水（北京）科技有限公司";
  pptx.company = "漂浮方舟 FLOATING ARK";
  pptx.title = "漂浮方舟 × 北京化工集团 · 初次交流";
  pptx.subject = "首次了解与方向对齐";
  pptx.layout = "LAYOUT_WIDE";

  // ── 封面 ────────────────────────────────────────────────
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.navy } });
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 6.9, w: "100%", h: 0.6, fill: { color: C.navyDeep } });
    s.addText("FLOATING ARK · 漂浮方舟", {
      x: 0.8, y: 1.05, w: 11, h: 0.35,
      fontSize: 14, color: "93C5FD", fontFace: F, charSpacing: 2,
    });
    s.addText("让身心快速恢复，\n成为标准化、可复制的系统", {
      x: 0.8, y: 1.55, w: 11.4, h: 1.9,
      fontSize: 34, bold: true, color: C.white, fontFace: F, lineSpacingMultiple: 1.15,
    });
    s.addText("与北京化工集团第一次交流 · 认识我们，看方向是否同路", {
      x: 0.8, y: 3.75, w: 11.4, h: 0.4,
      fontSize: 17, color: "CBD5E1", fontFace: F,
    });
    s.addShape(pptx.ShapeType.line, {
      x: 0.85, y: 4.4, w: 3.2, h: 0, line: { color: "3B82F6", width: 2 },
    });
    s.addText("中友瑞水（北京）科技有限公司 · 北京亦庄", {
      x: 0.8, y: 4.65, w: 11, h: 0.32,
      fontSize: 13, color: "94A3B8", fontFace: F,
    });
    s.addText("本场只做介绍与方向对齐，不涉及估值与投资条款", {
      x: 0.8, y: 7.0, w: 11.4, h: 0.4,
      fontSize: 11.5, color: "64748B", fontFace: F, valign: "middle",
    });
  }

  // ── 1 我们是谁 ──────────────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "一句话", "我们做的是可复制的深度恢复系统");
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 1.3, w: 12.25, h: 1.35, fill: { color: C.greenBg }, rectRadius: 0.1,
    });
    s.addText(
      "用高浮力盐水与低刺激环境，让神经系统从持续外部应答中撤离，进入更适合恢复的状态；\n再把评估、入舱、感知、消杀、复访连成一套可交付、可复制的标准流程。",
      { x: 0.8, y: 1.48, w: 11.8, h: 1, fontSize: 16, color: C.green, fontFace: F, lineSpacingMultiple: 1.2 }
    );
    cards(
      s,
      pptx,
      [
        { title: "不是 SPA、不是理疗店", lines: ["安静只是环境", "交付来自系统"] },
        { title: "不是单一靶点治疗", lines: ["整体状态调节型干预", "不承诺治好某个病"] },
        { title: "是可复制的系统", lines: ["设备 + SOP + 培训 + 认证", "换个城市也能开出同样的店"] },
      ],
      { y: 2.9, cols: 3, h: 1.75 }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 4.95, w: 12.25, h: 1.55, fill: { color: C.bg }, rectRadius: 0.1,
    });
    s.addText("公司在做四件事", {
      x: 0.8, y: 5.1, w: 11.8, h: 0.32,
      fontSize: 14, bold: true, color: C.blue, fontFace: F,
    });
    s.addText("漂浮舱系统供应   ｜   运营管理服务   ｜   资质认证服务   ｜   执证人才培训", {
      x: 0.8, y: 5.5, w: 11.8, h: 0.4,
      fontSize: 16, color: C.text, fontFace: F,
    });
    s.addText("十年只做恢复这一件事。设备我们自己造，店怎么开我们也管。", {
      x: 0.8, y: 5.95, w: 11.8, h: 0.35,
      fontSize: 13, color: C.muted, fontFace: F,
    });
    footer(s, 2);
  }

  // ── 2 为什么是现在 ──────────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "为什么是现在", "从以治病为中心，转向以健康为中心");
    cards(
      s,
      pptx,
      [
        {
          title: "国家口径已经转了",
          lines: [
            "《全民健康素养提升三年行动方案（2024—2027）》：从治病中心转向健康中心",
            "《基本医疗卫生与健康促进法》：公民是自己健康的第一责任人",
          ],
        },
        {
          title: "主动健康六支柱",
          lines: [
            "膳食｜运动｜心理｜睡眠｜居住环境｜健康管理",
            "我们不抢医院的治病那一柱",
            "补的是心理恢复与睡眠管理的可体验入口",
          ],
        },
      ],
      { y: 1.35, cols: 2, h: 2.35 }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 3.95, w: 12.25, h: 2.45, fill: { color: C.blueSoft }, rectRadius: 0.1,
    });
    s.addText("缺口在哪：方向有了，入口没有", {
      x: 0.8, y: 4.12, w: 11.8, h: 0.35,
      fontSize: 16, bold: true, color: C.navy, fontFace: F,
    });
    s.addText(
      [
        "主动健康目前仍偏研发与示范，公众实际参与率偏低",
        "企业侧最常见的做法是讲座和年度体检——缺日常参与感，也留不下数据",
        "「十五五」语境下，主动健康要从示范走向社会实践，需要能落地、能复制的载体",
      ].map((t) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: true } })),
      { x: 0.85, y: 4.55, w: 11.7, h: 1.7, fontSize: 14, color: C.text, fontFace: F, lineSpacingMultiple: 1.2 }
    );
    footer(s, 3);
  }

  // ── 3 P2 政策与人力资本（插件）────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "插件 P2 · 政策与人力资本", "对一个产业集团，这件事的价值在「人」这一侧");
    cards(
      s,
      pptx,
      [
        { title: "减少决策失误成本", lines: ["神经过载时判断力下降", "一次有效恢复，胜过多开一天会"] },
        { title: "降低核心人才流失", lines: ["替换成本通常是年薪 50%–150%", "关怀要能被感受到，不只是文件"] },
        { title: "提升单位时间产出", lines: ["睡眠不足会吃掉每天数小时有效工作", "恢复是产能问题，不只是福利"] },
        { title: "减少隐性误工", lines: ["「在岗不在状态」可干预", "比事后请假更省"] },
        { title: "健康投入变资产", lines: ["以 HRV 等指标追踪", "可写进 ESG 与雇主品牌"] },
        { title: "园区与公共示范", lines: ["主动健康的可视化抓手", "提升政企园区高端配套"] },
      ],
      { y: 1.4, cols: 3, h: 1.8 }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.35, w: 12.25, h: 1.15, fill: { color: C.amberBg }, rectRadius: 0.1,
    });
    s.addText("边界先说清楚", {
      x: 0.8, y: 5.5, w: 3, h: 0.3,
      fontSize: 13, bold: true, color: C.amber, fontFace: F,
    });
    s.addText("这不是国家基本公共卫生项目，也没有纳入医保。它是主动健康的一种服务形态，走市场化落地。", {
      x: 0.8, y: 5.85, w: 11.8, h: 0.45,
      fontSize: 14, color: C.text, fontFace: F,
    });
    footer(s, 4);
  }

  // ── 4 方法一页 ──────────────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "方法", "减负 — 降噪 — 重置 — 整合");
    const steps = [
      { k: "减负", t: "浮力去负荷", d: "高浮力盐水托住身体，卸掉姿势维持与骨骼肌负担" },
      { k: "降噪", t: "感官降噪", d: "封闭低刺激空间，削弱视觉、听觉、触觉输入" },
      { k: "重置", t: "自主神经切换", d: "从交感应激模式转向副交感修复模式" },
      { k: "整合", t: "脑状态整合", d: "研究中观察到 theta / alpha 相关变化" },
    ];
    steps.forEach((st, i) => {
      const x = 0.55 + i * 3.13;
      s.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.45, w: 2.95, h: 3.05, fill: { color: C.bg }, rectRadius: 0.1,
      });
      s.addShape(pptx.ShapeType.ellipse, {
        x: x + 1.08, y: 1.68, w: 0.78, h: 0.78, fill: { color: C.navy },
      });
      s.addText(`${i + 1}`, {
        x: x + 1.08, y: 1.68, w: 0.78, h: 0.78,
        fontSize: 18, bold: true, color: C.white, align: "center", valign: "middle", fontFace: F,
      });
      s.addText(st.k, {
        x: x + 0.2, y: 2.6, w: 2.55, h: 0.4,
        fontSize: 20, bold: true, color: C.navy, align: "center", fontFace: F,
      });
      s.addText(st.t, {
        x: x + 0.2, y: 3.02, w: 2.55, h: 0.32,
        fontSize: 13, color: C.blue, align: "center", fontFace: F,
      });
      s.addText(st.d, {
        x: x + 0.25, y: 3.4, w: 2.45, h: 0.95,
        fontSize: 12, color: C.text, align: "center", fontFace: F, valign: "top",
      });
      if (i < 3) {
        s.addText("›", {
          x: x + 2.95, y: 2.75, w: 0.18, h: 0.4,
          fontSize: 22, bold: true, color: C.muted, align: "center", fontFace: F,
        });
      }
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 4.75, w: 12.25, h: 1.7, fill: { color: C.greenBg }, rectRadius: 0.1,
    });
    s.addText("和传统漂浮舱的区别", {
      x: 0.8, y: 4.92, w: 11.8, h: 0.32,
      fontSize: 14, bold: true, color: C.green, fontFace: F,
    });
    s.addText(
      "传统漂浮舱提供黑暗、静水与隔音，效果高度依赖使用者状态与门店人员经验。\n我们把评估、入舱、感知、调度、消杀、复访连成标准流程，并建立专属档案——安静只是环境，交付来自系统。",
      { x: 0.8, y: 5.28, w: 11.8, h: 1, fontSize: 14, color: C.text, fontFace: F, lineSpacingMultiple: 1.2 }
    );
    footer(s, 5);
  }

  // ── 5 一次体验 ──────────────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "一次体验", "一个人走进来，会经历什么");
    const flow = [
      { t: "5 min", n: "到店与评估", d: "健康问卷，测定 HRV 与应激状态" },
      { t: "10 min", n: "入舱准备", d: "淋浴，进入独立私密舱室" },
      { t: "60–90 min", n: "沉浸漂浮", d: "零重力支撑，频率与光声环境调度" },
      { t: "15 min", n: "出舱复原", d: "再次检测，形成可对比的记录" },
    ];
    flow.forEach((f, i) => {
      const y = 1.4 + i * 1.24;
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.55, y, w: 12.25, h: 1.12, fill: { color: i === 2 ? C.blueSoft : C.bg }, rectRadius: 0.08,
      });
      s.addText(f.t, {
        x: 0.8, y: y + 0.28, w: 1.9, h: 0.5,
        fontSize: 17, bold: true, color: C.blue, fontFace: F, valign: "middle",
      });
      s.addText(f.n, {
        x: 2.9, y: y + 0.28, w: 3.1, h: 0.5,
        fontSize: 16, bold: true, color: C.navy, fontFace: F, valign: "middle",
      });
      s.addText(f.d, {
        x: 6.2, y: y + 0.28, w: 6.3, h: 0.5,
        fontSize: 14, color: C.text, fontFace: F, valign: "middle",
      });
    });
    s.addText("每一次都留下可比对的记录。这也是它能被管理、被复制的原因。", {
      x: 0.55, y: 6.4, w: 12.25, h: 0.4,
      fontSize: 14, italic: true, color: C.muted, fontFace: F,
    });
    footer(s, 6);
  }

  // ── 6 P4 证据塔（插件）───────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "插件 P4 · 证据", "我们怎么说证据：先安全可行，再状态，最后才是研究前沿", C.green);
    const tiers = [
      {
        name: "塔基 · 每次都能讲",
        color: C.greenBg,
        title: "安全与可重复",
        lines: [
          "纯物理消杀路线，不加化学药剂",
          "2024 年 PLOS ONE 可行性 RCT：75 人、各约 6 次，依从约 85%–89%，无与干预相关的严重不良事件",
        ],
      },
      {
        name: "塔身 · 对企业与产业",
        color: C.blueSoft,
        title: "即时状态改善",
        lines: [
          "2018 年开放标签试验（不是 RCT）：单次约 1 小时后状态焦虑显著下降，作者本人要求更大对照试验复核",
          "运动人群主观恢复有观察，生化指标仍有争议",
        ],
      },
      {
        name: "塔尖 · 只作学术讨论",
        color: C.amberBg,
        title: "特定病种研究",
        lines: [
          "国际上确有针对特定病种的试验，但多为小样本",
          "我们的表述只到「研究在追问」，不作治疗承诺，也不进销售口径",
        ],
      },
    ];
    tiers.forEach((t, i) => {
      const y = 1.35 + i * 1.62;
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.55, y, w: 12.25, h: 1.5, fill: { color: t.color }, rectRadius: 0.08,
      });
      s.addText(t.name, {
        x: 0.78, y: y + 0.14, w: 3.1, h: 0.3,
        fontSize: 11.5, bold: true, color: C.muted, fontFace: F,
      });
      s.addText(t.title, {
        x: 0.78, y: y + 0.46, w: 3.1, h: 0.5,
        fontSize: 17, bold: true, color: C.navy, fontFace: F, valign: "top",
      });
      s.addText(
        t.lines.map((x) => ({ text: x, options: { bullet: { indent: 14 }, breakLine: true } })),
        { x: 4.1, y: y + 0.16, w: 8.4, h: 1.25, fontSize: 12.5, color: C.text, fontFace: F, valign: "middle", lineSpacingMultiple: 1.15 }
      );
    });
    s.addText("我们宁愿把边界自己说出来。恢复类产品最大的风险不是说得少，是说过头。", {
      x: 0.55, y: 6.35, w: 12.25, h: 0.4,
      fontSize: 14, italic: true, color: C.green, fontFace: F,
    });
    footer(s, 7);
  }

  // ── 7 边界 ──────────────────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "边界", "我们不做什么", C.amber);
    cards(
      s,
      pptx,
      [
        { title: "不治病", lines: ["不替代精神科与临床治疗", "不做病种疗效承诺"] },
        { title: "不进医保口径", lines: ["不是国家基本公卫项目", "走市场化服务"] },
        { title: "不夸口径", lines: ["未经核验的营销数字不上台", "参数以铭牌、合同、检验报告为准"] },
        { title: "不混场景", lines: ["医院共建与独立门店是两套口径", "不互相借用话术"] },
      ],
      { y: 1.4, cols: 2, h: 1.85, fill: C.amberBg, titleColor: C.amber }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.35, w: 12.25, h: 1.2, fill: { color: C.greenBg }, rectRadius: 0.1,
    });
    s.addText(
      "为什么第一次见面就讲这个：和国企合作，能不能长期做下去，取决于有没有人替对方守住风险边界。",
      { x: 0.8, y: 5.6, w: 11.8, h: 0.6, fontSize: 15, color: C.green, fontFace: F, valign: "middle" }
    );
    footer(s, 8);
  }

  // ── 8 P1 工程可巡检（插件）───────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "插件 P1 · 工程与运维", "它是能连续运行、能被巡检的设备");
    const steps = ["01 漂浮液回收", "02 精密过滤", "03 物理消杀", "04 无菌储存"];
    steps.forEach((t, i) => {
      const x = 0.55 + i * 3.13;
      s.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.35, w: 2.95, h: 0.72, fill: { color: C.navy }, rectRadius: 0.06,
      });
      s.addText(t, {
        x, y: 1.35, w: 2.95, h: 0.72,
        fontSize: 14, bold: true, color: C.white, align: "center", valign: "middle", fontFace: F,
      });
      if (i < 3) {
        s.addText("→", {
          x: x + 2.95, y: 1.45, w: 0.18, h: 0.5,
          fontSize: 16, color: C.muted, align: "center", fontFace: F,
        });
      }
    });
    cards(
      s,
      pptx,
      [
        {
          title: "纯物理路线",
          lines: ["臭氧、紫外、光触媒降解有机物", "不添加澄清剂与养护剂", "无添加，也要彻底洁净"],
        },
        {
          title: "两段精密过滤",
          lines: ["第一段最小孔径 0.1 μm", "第二段碳及复合滤材", "净化后进独立无菌储液"],
        },
        {
          title: "分区与空气",
          lines: ["漂浮液、储液箱、舱体、空气分区处理", "舱体紫外与负离子空气消杀"],
        },
        {
          title: "日常可查",
          lines: ["观察回水速度、泵压、滤材与渗漏", "滤棉与毛发过滤器按周期更换", "水温按恒温标准执行并记录"],
        },
      ],
      { y: 2.3, cols: 4, h: 2.6 }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.2, w: 12.25, h: 1.3, fill: { color: C.bg }, rectRadius: 0.1,
    });
    s.addText("工程纪律", {
      x: 0.8, y: 5.35, w: 3, h: 0.3,
      fontSize: 13, bold: true, color: C.blue, fontFace: F,
    });
    s.addText(
      "具体工艺、处理时长与检测结果，一律以对应型号技术文件与最新检验报告为准；不同型号的消杀程序不互换。报价与验收锁定机型后再引用参数。",
      { x: 0.8, y: 5.7, w: 11.8, h: 0.65, fontSize: 13.5, color: C.text, fontFace: F, valign: "top" }
    );
    footer(s, 9);
  }

  // ── 9 我们已经在做的事 + P3 底气（插件）──────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "插件 P3 · 我们已经在做的事", "不是从零起步，但数字我们只按材料口径讲");
    cards(
      s,
      pptx,
      [
        {
          title: "产品与平台",
          lines: ["自研舱体、控制与净化三件套", "冠军系列面向高消耗人群与专业运动恢复", "五条产品线组成一套完整交付"],
        },
        {
          title: "资质与检测",
          lines: ["ISO 9001 体系", "欧盟 CE、RoHS；美国 FCC、UL", "漂浮液通过饮用水级别检测", "二类医疗器械认证仍在推进中"],
        },
        {
          title: "科研与专家",
          lines: ["与院士、心理学与临床专家共建技术路线", "参与行业标准制定", "世界漂浮学会全球平台"],
        },
      ],
      { y: 1.4, cols: 3, h: 2.55 }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 4.2, w: 12.25, h: 1.5, fill: { color: C.blueSoft }, rectRadius: 0.1,
    });
    s.addText("规模（企业宣传材料口径，具体以交付资料与最新报告为准）", {
      x: 0.8, y: 4.35, w: 11.8, h: 0.3,
      fontSize: 12, color: C.muted, fontFace: F,
    });
    s.addText("三十余项国家专利   ｜   32 项质量安全标准检测   ｜   双高新 · 金种子 · 首批专精特新   ｜   服务机构逾八百家", {
      x: 0.8, y: 4.72, w: 11.8, h: 0.45,
      fontSize: 14.5, bold: true, color: C.navy, fontFace: F, valign: "middle",
    });
    s.addText("这些数字我们正在做统一核定，所以今天只作口径引用，不当承诺。需要精确数据我们会出具书面材料。", {
      x: 0.8, y: 5.18, w: 11.8, h: 0.4,
      fontSize: 12.5, italic: true, color: C.text, fontFace: F,
    });
    s.addText("被验证，才值得被信任。", {
      x: 0.55, y: 5.95, w: 12.25, h: 0.5,
      fontSize: 20, bold: true, color: C.navy, align: "center", fontFace: F,
    });
    footer(s, 10);
  }

  // ── P6-1 赛道（新增插件）─────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "插件 P6 · 赛道", "心理健康：大健康里最重要，也最薄弱的一环");
    const nums = [
      { n: "5,900 亿", l: "精神健康问题全社会年度总成本", src: "北大精神卫生研究所 ·《柳叶刀》系列" },
      { n: "> 15%", l: "占当年全国卫生总支出比例", src: "同一研究口径" },
      { n: "< 5%", l: "非药物神经干预覆盖率与主动健康渗透率", src: "行业研究口径" },
    ];
    nums.forEach((it, i) => {
      const x = 0.55 + i * 4.18;
      s.addShape(pptx.ShapeType.roundRect, {
        x, y: 1.3, w: 3.95, h: 1.68, fill: { color: C.blueSoft }, rectRadius: 0.08,
      });
      s.addText(it.n, {
        x: x + 0.15, y: 1.44, w: 3.65, h: 0.58,
        fontSize: 29, bold: true, color: C.navy, align: "center", fontFace: F,
      });
      s.addText(it.l, {
        x: x + 0.15, y: 2.06, w: 3.65, h: 0.5,
        fontSize: 12.5, color: C.text, align: "center", fontFace: F, valign: "top",
      });
      s.addText(it.src, {
        x: x + 0.15, y: 2.62, w: 3.65, h: 0.3,
        fontSize: 10, color: C.muted, align: "center", fontFace: F,
      });
    });
    cards(
      s,
      pptx,
      [
        { title: "药物", lines: ["面向已确诊人群", "覆盖不到亚健康与高压状态"] },
        { title: "心理咨询", lines: ["依赖咨询师供给", "产能与价格都受限，难标准化"] },
        { title: "讲座与体检", lines: ["缺日常参与感", "留不下过程数据，做完就结束"] },
        { title: "缺的正是这一类", lines: ["非药物、可体验、可重复", "有记录、能被管理、能复制"] },
      ],
      { y: 3.25, cols: 4, h: 1.85 }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.3, w: 12.25, h: 1.2, fill: { color: C.greenBg }, rectRadius: 0.1,
    });
    s.addText(
      "重要、代价高、供给空白、渗透率低——四个条件同时成立的赛道并不多。这一环的空白，就是我们所在的位置。",
      { x: 0.8, y: 5.3, w: 11.8, h: 1.2, fontSize: 15.5, bold: true, color: C.green, fontFace: F, valign: "middle" }
    );
    footer(s, 11);
  }

  // ── P6-2 投资联动（新增插件）─────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "插件 P6 · 投资联动", "为什么这一环能做长，也能往外扩");
    cards(
      s,
      pptx,
      [
        {
          title: "能做长：不是一次性买卖",
          lines: [
            "疗程化运营带来复购、档案与顾问关系",
            "壁垒分四层：技术、内容、运营、标准",
            "体验、数据、关系三重锁定，迁移成本随时间上升",
          ],
        },
        {
          title: "能往外扩：纵横两向",
          lines: [
            "纵向：从设备到运营、认证、培训、数据",
            "横向：体育、文旅、康养、企业健康、公共示范",
            "生态已在接线：国家训练基地、京东方、中旅、国药等",
          ],
        },
        {
          title: "和集团的产业接口",
          lines: [
            "漂浮液与母液本质是化工配方，规模化后有原料接口",
            "消杀与过滤材料、舱体制造对得上制造与质量体系",
            "集团信用有助于打开国企、园区与公共机构渠道",
          ],
        },
      ],
      { y: 1.35, cols: 3, h: 2.75, fontSize: 12 }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 4.32, w: 12.25, h: 1.35, fill: { color: C.greenBg }, rectRadius: 0.1,
    });
    s.addText("放进大健康布局里，它是一块能自己长、也能带动别的板块的拼图", {
      x: 0.8, y: 4.48, w: 11.8, h: 0.38,
      fontSize: 16, bold: true, color: C.green, fontFace: F,
    });
    s.addText(
      "心理健康是大健康组合里目前最空的一格。它可以单独成为一条业务线，也能与既有健康、文旅、制造资产互补，且不依赖单一客户或单一区域。",
      { x: 0.8, y: 4.88, w: 11.8, h: 0.7, fontSize: 13.5, color: C.text, fontFace: F, valign: "top" }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.82, w: 12.25, h: 0.7, fill: { color: C.amberBg }, rectRadius: 0.08,
    });
    s.addText(
      "本场不谈估值与条款。投入产出模型、价格带与分成比例属内部规划口径，尚未锁定；进入尽调阶段我们逐项出具书面材料。",
      { x: 0.8, y: 5.82, w: 11.8, h: 0.7, fontSize: 13, color: C.amber, fontFace: F, valign: "middle" }
    );
    footer(s, 12);
  }

  // ── 10 三个接口 ─────────────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "和北京化工集团", "我们看得见的三个接口");
    cards(
      s,
      pptx,
      [
        {
          title: "一 · 内部：员工与骨干精力",
          lines: [
            "高压岗位、连续作业、值班倒班人群的恢复入口",
            "高管体验日、团队恢复课程、人才健康服务包",
            "可复访、可记录，不是一次性讲座",
          ],
        },
        {
          title: "二 · 园区：可体验的示范配套",
          lines: [
            "主动健康的可视化抓手，能对外讲、能带人看",
            "提升政企园区的高端配套能力",
            "可与文旅、康养场景衔接",
          ],
        },
        {
          title: "三 · 产业：向外的健康板块",
          lines: [
            "把设备、SOP、认证、培训作为一条可复制的业务线",
            "化工集团熟悉的正是标准化与过程管理",
            "先做能力验证，再谈规模",
          ],
        },
      ],
      { y: 1.4, cols: 3, h: 3.35 }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.05, w: 12.25, h: 1.45, fill: { color: C.greenBg }, rectRadius: 0.1,
    });
    s.addText("哪一个更靠近你们今年的议题，我们就从那一个谈起。", {
      x: 0.8, y: 5.22, w: 11.8, h: 0.4,
      fontSize: 17, bold: true, color: C.green, fontFace: F,
    });
    s.addText("今天不需要选。我们更想听你们内部现在最头疼的是哪一块。", {
      x: 0.8, y: 5.7, w: 11.8, h: 0.5,
      fontSize: 14, color: C.text, fontFace: F,
    });
    footer(s, 13);
  }

  // ── 11 P5 落地（插件）───────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "插件 P5 · 如果要往下走", "一个点位、一个季度、可退出", C.green);
    cards(
      s,
      pptx,
      [
        { title: "先选一个点位", lines: ["总部或园区一个空间", "1–2 舱起步，不铺开"] },
        { title: "跑一个季度", lines: ["固定人群、固定节奏", "留下可对比的记录"] },
        { title: "看三件事", lines: ["用不用得起来（使用率）", "反馈是否稳定", "运维是否可交给自己人"] },
        { title: "不合适就停", lines: ["季度结束可退出", "不绑长约、不压库存"] },
      ],
      { y: 1.4, cols: 4, h: 1.95 }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 3.6, w: 12.25, h: 2.05, fill: { color: C.bg }, rectRadius: 0.1,
    });
    s.addText("合作形式可以很轻，也可以很重——由你们的节奏决定", {
      x: 0.8, y: 3.78, w: 11.8, h: 0.35,
      fontSize: 15, bold: true, color: C.navy, fontFace: F,
    });
    s.addText(
      [
        "设备租赁：月付使用，压低初始投入",
        "样板共建：1–2 舱先行，验证后再扩容",
        "联合运营：你们出空间与客流，我们出设备与 SOP，按收益分成",
        "企业 / 园区项目制：作为服务包采购，不承担门店经营风险",
        "一次性采购：适合已经想自己长期运营的场景",
      ].map((t) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: true } })),
      { x: 0.85, y: 4.18, w: 11.7, h: 1.4, fontSize: 13.5, color: C.text, fontFace: F, lineSpacingMultiple: 1.12 }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.85, w: 12.25, h: 0.72, fill: { color: C.amberBg }, rectRadius: 0.08,
    });
    s.addText("今天不报价、不签约。这一页只是让你们知道：入口可以做得很小，退出也不难。", {
      x: 0.8, y: 5.85, w: 11.8, h: 0.72,
      fontSize: 14, color: C.amber, fontFace: F, valign: "middle",
    });
    footer(s, 14);
  }

  // ── 12 入口很轻 ─────────────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "下一步", "最省事的方式是先来一趟");
    cards(
      s,
      pptx,
      [
        { title: "来看一次", lines: ["实地看舱体、净化与运维流程", "半天即可", "看完自然知道是不是一回事"] },
        { title: "试一次", lines: ["安排 2–3 位同事亲身体验", "带走一份自己的记录", "比任何一页 PPT 都直观"] },
        { title: "再谈往哪走", lines: ["体验之后，讨论从哪个接口切入", "需要什么材料我们准备"] },
      ],
      { y: 1.45, cols: 3, h: 2.6 }
    );
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 4.4, w: 12.25, h: 2.1, fill: { color: C.greenBg }, rectRadius: 0.12,
    });
    s.addText("今天只请你们同意一件小事", {
      x: 0.8, y: 4.62, w: 11.8, h: 0.4,
      fontSize: 15, color: C.green, fontFace: F,
    });
    s.addText("定一个时间，来看一次，试一次。", {
      x: 0.8, y: 5.05, w: 11.8, h: 0.6,
      fontSize: 26, bold: true, color: C.navy, fontFace: F,
    });
    s.addText("合作可以很大，入口很轻。至于投资，等我们双方都确认是同一件事再谈。", {
      x: 0.8, y: 5.75, w: 11.8, h: 0.45,
      fontSize: 14, color: C.text, fontFace: F,
    });
    footer(s, 15);
  }

  // ── 13 一页回顾 ─────────────────────────────────────────
  {
    const s = pptx.addSlide();
    head(s, pptx, "一页回顾", "今天讲了什么");
    const rows: [string, string][] = [
      ["我们是谁", "可复制的深度恢复系统：设备 + SOP + 认证 + 培训，不是 SPA"],
      ["方向", "从治病中心到健康中心，我们补心理恢复与睡眠管理的可体验入口"],
      ["方法", "减负 — 降噪 — 重置 — 整合，整体状态调节，不做单一靶点治疗"],
      ["证据", "先讲安全与可重复，再讲即时状态；病种研究只作学术讨论"],
      ["运维", "纯物理消杀四步闭环，参数以型号文件与检验报告为准"],
      ["接口", "员工与骨干精力 / 园区示范配套 / 对外健康业务线"],
      ["下一步", "来看一次、试一次；入口可小、可退出，本场不谈钱"],
    ];
    rows.forEach((r, i) => {
      const y = 1.35 + i * 0.78;
      s.addShape(pptx.ShapeType.roundRect, {
        x: 0.55, y, w: 12.25, h: 0.68,
        fill: { color: i % 2 === 0 ? C.bg : C.white }, rectRadius: 0.05,
        line: { color: C.line, width: 0.5 },
      });
      s.addText(r[0], {
        x: 0.8, y, w: 2.1, h: 0.68,
        fontSize: 14, bold: true, color: C.blue, fontFace: F, valign: "middle",
      });
      s.addText(r[1], {
        x: 3.0, y, w: 9.5, h: 0.68,
        fontSize: 13.5, color: C.text, fontFace: F, valign: "middle",
      });
    });
    footer(s, 16);
  }

  // ── 14 封底 ─────────────────────────────────────────────
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.navy } });
    s.addText("谢谢", {
      x: 0.9, y: 1.85, w: 11, h: 0.8,
      fontSize: 40, bold: true, color: C.white, fontFace: F,
    });
    s.addText("让身心快速恢复，成为标准化、可复制的系统", {
      x: 0.9, y: 2.85, w: 11, h: 0.45,
      fontSize: 18, color: "CBD5E1", fontFace: F,
    });
    s.addShape(pptx.ShapeType.line, {
      x: 0.95, y: 3.6, w: 3.2, h: 0, line: { color: "3B82F6", width: 2 },
    });
    s.addText(
      "中友瑞水（北京）科技有限公司 · 漂浮方舟 FLOATING ARK\n北京亦庄   ｜   400-8869-783   ｜   www.float-ark.com",
      { x: 0.9, y: 3.85, w: 11, h: 0.9, fontSize: 14, color: "94A3B8", fontFace: F, lineSpacingMultiple: 1.3 }
    );
    s.addText("本材料用于初次交流，数据口径以书面交付资料为准；不构成疗效承诺或投资要约。", {
      x: 0.9, y: 6.7, w: 11.4, h: 0.4,
      fontSize: 11, color: "64748B", fontFace: F,
    });
  }

  const buf = (await pptx.write({ outputType: "nodebuffer" })) as Buffer;
  const filename = "漂浮方舟_北京化工集团_初次交流_全插件版_含P6赛道.pptx";
  const outDir = path.join(process.cwd(), "exports");
  mkdirSync(outDir, { recursive: true });
  mkdirSync("/opt/cursor/artifacts", { recursive: true });
  mkdirSync(path.join(process.cwd(), "public/exports"), { recursive: true });

  const pptPath = path.join(outDir, filename);
  writeFileSync(pptPath, buf);
  writeFileSync(path.join("/opt/cursor/artifacts", filename), buf);
  copyFileSync(pptPath, path.join(process.cwd(), "public/exports", filename));
  copyFileSync(pptPath, path.join("/opt/cursor/artifacts", "bjhg-final-deck-p6.pptx"));

  console.log("pptx bytes", buf.length);
  console.log("pptx", pptPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
