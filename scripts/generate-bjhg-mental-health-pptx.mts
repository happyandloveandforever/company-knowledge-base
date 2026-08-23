/**
 * 北化心理健康产业投资交流 · 精排版 PPTX
 * 文字以用户认可的成品版为准，只重排版，不删减。
 * 运行：npx tsx scripts/generate-bjhg-mental-health-pptx.mts
 */
import { copyFileSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import PptxGenJS from "pptxgenjs";

const C = {
  ink: "161410",
  inkSoft: "3A342C",
  muted: "6E675C",
  paper: "F3EEE4",
  card: "FFFCF7",
  navy: "1A2C36",
  navyDeep: "121C24",
  copper: "A67C52",
  copperSoft: "E8D7C2",
  rule: "D8CFC2",
  good: "2F5D50",
  goodBg: "E6EFEA",
  warn: "8A5A28",
  warnBg: "F3E8D8",
  white: "F4EFE6",
  blueSoft: "EEF3F6",
};

const F = "微软雅黑";
const TOTAL = 15;
const FILE = "漂浮方舟_北京化工集团_心理健康产业投资交流_精排版.pptx";

function footer(s: PptxGenJS.Slide, n: number) {
  s.addText("漂浮方舟 · 中友瑞水（北京）科技有限公司", {
    x: 0.5, y: 7.12, w: 9.6, h: 0.24, fontSize: 11, color: C.muted, fontFace: F,
  });
  s.addText(`${n} / ${TOTAL}`, {
    x: 11.3, y: 7.12, w: 1.5, h: 0.24, fontSize: 11, color: C.muted, align: "right", fontFace: F,
  });
}

function kicker(s: PptxGenJS.Slide, text: string) {
  s.addText(text, {
    x: 0.55, y: 0.28, w: 12.2, h: 0.28,
    fontSize: 12, color: C.copper, fontFace: F, bold: true, charSpacing: 1.2,
  });
}

function title(s: PptxGenJS.Slide, text: string, y = 0.56, h = 0.7, size = 24) {
  s.addText(text, {
    x: 0.55, y, w: 12.2, h, fontSize: size, bold: true, color: C.ink, fontFace: F,
  });
}

function card(
  s: PptxGenJS.Slide,
  pptx: PptxGenJS,
  x: number, y: number, w: number, h: number,
  fill = C.card
) {
  s.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h, fill: { color: fill }, rectRadius: 0.06,
    line: { color: C.rule, width: 1 },
  });
}

async function main() {
  const pptx = new PptxGenJS();
  pptx.author = "中友瑞水（北京）科技有限公司";
  pptx.company = "漂浮方舟 FLOATING ARK";
  pptx.title = "漂浮方舟 × 北京化工集团 · 心理健康产业投资交流";
  pptx.subject = "成品文字精排版，不删减";
  pptx.layout = "LAYOUT_WIDE";

  // 1 封面
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.navy } });
    s.addText("FLOATING ARK · 漂浮方舟", {
      x: 0.7, y: 1.35, w: 12, h: 0.35, fontSize: 14, color: "D4B48A", fontFace: F, charSpacing: 2,
    });
    s.addText("心理健康产业的\n深度恢复入口", {
      x: 0.7, y: 1.85, w: 12, h: 2.1, fontSize: 40, bold: true, color: C.white, fontFace: F,
    });
    s.addShape(pptx.ShapeType.rect, { x: 0.72, y: 4.15, w: 0.9, h: 0.04, fill: { color: C.copper } });
    s.addText("与北京化工集团第一次交流 · 产业方向与投资协同", {
      x: 0.7, y: 4.4, w: 12, h: 0.4, fontSize: 18, color: "C9D0C6", fontFace: F,
    });
    s.addText("中友瑞水（北京）科技有限公司 · 北京亦庄", {
      x: 0.7, y: 4.9, w: 12, h: 0.32, fontSize: 14, color: "8E9AA3", fontFace: F,
    });
    s.addText("本场只做项目介绍与方向判断，不涉及估值与投资条款", {
      x: 0.7, y: 6.85, w: 12, h: 0.32, fontSize: 13, color: "7D8891", fontFace: F,
    });
  }

  // 2 一句话
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.paper } });
    kicker(s, "一句话");
    title(s, "我们把深度恢复，做成可复制的心理健康基础能力", 0.54, 0.7, 24);
    s.addText(
      "在日常压力管理与专业心理服务之间，提供一个非药物、低刺激、可标准化交付的恢复环节；\n再把设备、评估、体验、消杀、复访连成一套可运营、可扩展的系统。",
      { x: 0.55, y: 1.28, w: 12.2, h: 0.95, fontSize: 15, color: C.inkSoft, fontFace: F }
    );
    const items = [
      ["不只是一台漂浮舱", "舱体只是入口\n交付来自整套系统"],
      ["不替代专业心理服务", "守住非医疗边界\n与咨询、医疗形成补充"],
      ["是可复制的产业单元", "设备 + SOP + 培训 + 认证\n可跨地点、跨场景交付"],
    ];
    items.forEach((it, i) => {
      const x = 0.55 + i * 4.15;
      card(s, pptx, x, 2.4, 3.95, 2.15);
      s.addText(it[0], { x: x + 0.22, y: 2.55, w: 3.5, h: 0.7, fontSize: 16, bold: true, color: C.ink, fontFace: F });
      s.addText(it[1], { x: x + 0.22, y: 3.3, w: 3.5, h: 1.05, fontSize: 14, color: C.inkSoft, fontFace: F });
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 4.75, w: 12.25, h: 2.05, fill: { color: C.navy }, rectRadius: 0.06,
    });
    s.addText("公司在做四件事", {
      x: 0.8, y: 4.9, w: 11.8, h: 0.32, fontSize: 14, color: "D4B48A", fontFace: F,
    });
    s.addText("系统供应   ｜   运营服务   ｜   资质认证   ｜   人才培训", {
      x: 0.8, y: 5.28, w: 11.8, h: 0.45, fontSize: 18, bold: true, color: C.white, fontFace: F,
    });
    s.addText("从设备到运营，把“恢复”做成长期能力。", {
      x: 0.8, y: 5.82, w: 11.8, h: 0.4, fontSize: 15, color: "C9D0C6", fontFace: F,
    });
    footer(s, 2);
  }

  // 3 产业
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.paper } });
    kicker(s, "心理健康产业");
    title(s, "这是一个长期需求正在被正式承接的方向");
    card(s, pptx, 0.55, 1.4, 6.0, 2.7);
    s.addText("政策正在搭服务体系", { x: 0.78, y: 1.55, w: 5.55, h: 0.4, fontSize: 18, bold: true, color: C.ink, fontFace: F });
    s.addText("国家提出到 2030 年，基本形成覆盖全人群、全生命周期的社会心理服务体系\n\n心理健康服务正在从少数专业场景，走向更广泛、持续的社会供给", {
      x: 0.78, y: 2.05, w: 5.55, h: 1.85, fontSize: 14, color: C.inkSoft, fontFace: F,
    });
    card(s, pptx, 6.75, 1.4, 6.05, 2.7);
    s.addText("供给仍有明显缺口", { x: 6.98, y: 1.55, w: 5.6, h: 0.4, fontSize: 18, bold: true, color: C.ink, fontFace: F });
    s.addText("世界卫生组织指出，全球近 1/7 人受精神障碍影响，多数人仍未获得有效照护\n\n需求真实而长期，但可触达、可持续的服务载体仍不足", {
      x: 6.98, y: 2.05, w: 5.6, h: 1.85, fontSize: 14, color: C.inkSoft, fontFace: F,
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 4.3, w: 12.25, h: 2.5, fill: { color: C.copperSoft }, rectRadius: 0.06,
    });
    s.addText("我们的判断：缺口不只在“治疗”，也在“平时怎么恢复”", {
      x: 0.8, y: 4.45, w: 11.8, h: 0.4, fontSize: 16, bold: true, color: C.ink, fontFace: F,
    });
    const gaps = ["一次性科普多，持续参与少", "内容服务多，可体验的线下载体少", "单点项目多，能跨场景复制的系统少"];
    gaps.forEach((g, i) => {
      s.addText(g, { x: 0.8 + i * 4.0, y: 5.1, w: 3.8, h: 1.3, fontSize: 15, color: C.inkSoft, fontFace: F });
    });
    footer(s, 3);
  }

  // 4 心理学
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.paper } });
    kicker(s, "与心理学的关系");
    title(s, "我们补的是心理健康链条中“恢复”这一段", 0.54, 0.6, 22);
    const cells: [string, string, string][] = [
      ["评估之后", "把状态识别", "接到可体验的恢复动作"],
      ["专业服务之前", "给尚未进入临床的人", "一个低门槛入口"],
      ["专业服务之间", "提供恢复支持", "不替代心理咨询"],
      ["医疗之外", "非药物、非临床", "不做病种疗效承诺"],
      ["线下承载", "把心理服务延伸为", "可感知的空间体验"],
      ["长期管理", "复访记录沉淀", "个体恢复轨迹"],
    ];
    cells.forEach((c, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 0.55 + col * 4.15;
      const y = 1.3 + row * 2.05;
      card(s, pptx, x, y, 3.95, 1.9);
      s.addText(c[0], { x: x + 0.2, y: y + 0.14, w: 3.55, h: 0.28, fontSize: 12, color: C.muted, fontFace: F });
      s.addText(`${c[1]}\n${c[2]}`, { x: x + 0.2, y: y + 0.48, w: 3.55, h: 1.2, fontSize: 16, bold: true, color: C.ink, fontFace: F });
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.5, w: 12.25, h: 1.3, fill: { color: C.goodBg }, rectRadius: 0.06,
    });
    s.addText("二者是什么关系", {
      x: 0.8, y: 5.6, w: 11.8, h: 0.28, fontSize: 12, color: C.good, fontFace: F,
    });
    s.addText("心理学提供评估与干预框架；漂浮方舟提供可体验、可运营、可复制的恢复载体。二者互补，不互相替代。", {
      x: 0.8, y: 5.92, w: 11.8, h: 0.7, fontSize: 15, color: C.good, fontFace: F,
    });
    footer(s, 4);
  }

  // 5 机理
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.paper } });
    kicker(s, "工作机理");
    title(s, "减负 — 降噪 — 重置 — 整合");
    const steps = [
      ["1", "减负", "浮力降低负荷", "高浮力盐水托住身体，降低姿势维持与骨骼肌负荷"],
      ["2", "降噪", "减少感官输入", "低刺激环境减少视觉、听觉与触觉输入"],
      ["3", "重置", "状态切换", "为自主神经从持续应答转向休息恢复创造条件"],
      ["4", "整合", "恢复整合", "研究提示脑电节律可能变化，仍需更多验证"],
    ];
    steps.forEach((st, i) => {
      const x = 0.55 + i * 3.15;
      card(s, pptx, x, 1.4, 3.0, 2.85);
      s.addText(st[0], { x: x + 0.18, y: 1.52, w: 2.65, h: 0.4, fontSize: 22, bold: true, color: C.copper, fontFace: F });
      s.addText(st[1], { x: x + 0.18, y: 1.95, w: 2.65, h: 0.38, fontSize: 20, bold: true, color: C.ink, fontFace: F });
      s.addText(st[2], { x: x + 0.18, y: 2.38, w: 2.65, h: 0.35, fontSize: 14, color: C.ink, fontFace: F });
      s.addText(st[3], { x: x + 0.18, y: 2.78, w: 2.65, h: 1.25, fontSize: 13, color: C.inkSoft, fontFace: F });
    });
    card(s, pptx, 0.55, 4.45, 12.25, 2.35);
    s.addText("“神经重置”如何理解", { x: 0.8, y: 4.6, w: 11.8, h: 0.38, fontSize: 16, bold: true, color: C.ink, fontFace: F });
    s.addText("这是品牌对恢复过程的表达，不等同于医学意义上的神经系统重启。\n真正可交付的是：低刺激环境 + 浮力支持 + 评估、入舱、调度、消杀与复访的标准流程。", {
      x: 0.8, y: 5.05, w: 11.8, h: 1.5, fontSize: 15, color: C.inkSoft, fontFace: F,
    });
    footer(s, 5);
  }

  // 6 流程
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.paper } });
    kicker(s, "可交付单元");
    title(s, "它不是一次放松，而是一套可重复运行的服务流程", 0.54, 0.7, 22);
    const flow = [
      ["5 min", "到店与筛查", "禁忌与基础状态问询"],
      ["10 min", "入舱准备", "淋浴，进入独立私密舱室"],
      ["60–90 min", "沉浸漂浮", "浮力支撑与低刺激环境"],
      ["15 min", "出舱记录", "主观状态记录与复访建议"],
    ];
    flow.forEach((f, i) => {
      const x = 0.55 + i * 3.15;
      card(s, pptx, x, 1.55, 3.0, 3.4);
      s.addText(f[0], { x: x + 0.18, y: 1.75, w: 2.65, h: 0.7, fontSize: 24, bold: true, color: C.copper, fontFace: F });
      s.addText(f[1], { x: x + 0.18, y: 2.6, w: 2.65, h: 0.7, fontSize: 20, bold: true, color: C.ink, fontFace: F });
      s.addText(f[2], { x: x + 0.18, y: 3.4, w: 2.65, h: 1.2, fontSize: 15, color: C.inkSoft, fontFace: F });
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.2, w: 12.25, h: 1.55, fill: { color: C.navy }, rectRadius: 0.06,
    });
    s.addText("从准入、体验、净化到复访，每一环都有 SOP；这才具备跨地点复制的条件。", {
      x: 0.8, y: 5.2, w: 11.8, h: 1.55, fontSize: 18, color: C.white, fontFace: F, valign: "middle",
    });
    footer(s, 6);
  }

  // 7 证据
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.paper } });
    kicker(s, "证据边界");
    title(s, "先证明安全可行，再谈即时状态，最后才是研究前沿", 0.54, 0.6, 20);
    const tiers = [
      [C.goodBg, "塔基 · 每次都能讲", "安全与可重复", "2024 年 PLOS ONE 可行性 RCT：75 人、约 6 次体验\n依从性约 85%–89%，未报告与干预相关的严重不良事件"],
      [C.blueSoft, "塔身 · 谨慎表达", "即时状态", "单次体验后状态焦虑下降的初步研究\n运动恢复以主观感受为主，生化指标并不一致"],
      [C.warnBg, "塔尖 · 只作学术讨论", "病种研究", "已有小样本探索，但证据仍有限\n不转成治疗承诺，也不进入销售口径"],
    ] as const;
    tiers.forEach((t, i) => {
      const y = 1.28 + i * 1.55;
      s.addShape(pptx.ShapeType.roundRect, { x: 0.55, y, w: 12.25, h: 1.42, fill: { color: t[0] }, rectRadius: 0.06 });
      s.addText(t[1], { x: 0.8, y: y + 0.1, w: 3.2, h: 0.28, fontSize: 12, color: C.muted, fontFace: F });
      s.addText(t[2], { x: 0.8, y: y + 0.4, w: 3.2, h: 0.8, fontSize: 18, bold: true, color: C.ink, fontFace: F });
      s.addText(t[3], { x: 4.2, y: y + 0.18, w: 8.3, h: 1.1, fontSize: 14, color: C.inkSoft, fontFace: F, valign: "middle" });
    });
    s.addText("恢复类产品最大的风险不是说得少，而是把早期研究说成确定疗效。", {
      x: 0.55, y: 6.05, w: 12.25, h: 0.7, fontSize: 16, bold: true, color: C.ink, fontFace: F,
    });
    footer(s, 7);
  }

  // 8 边界
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.paper } });
    kicker(s, "长期边界");
    title(s, "边界说清楚，项目才有长期价值");
    const bounds = [
      ["不替代专业服务", "不替代心理咨询、精神科\n以及临床治疗"],
      ["不承诺病种疗效", "不使用治愈、治疗率\n等医疗化口径"],
      ["不把研究当销售话术", "先讲安全与可行\n再讲即时状态"],
      ["不写未核验规模数字", "机构、专利、用户数据\n尽调阶段逐项核验"],
    ];
    bounds.forEach((b, i) => {
      const x = 0.55 + i * 3.15;
      card(s, pptx, x, 1.45, 3.0, 3.35);
      s.addText(b[0], { x: x + 0.18, y: 1.65, w: 2.65, h: 1.15, fontSize: 18, bold: true, color: C.ink, fontFace: F });
      s.addText(b[1], { x: x + 0.18, y: 2.9, w: 2.65, h: 1.6, fontSize: 15, color: C.inkSoft, fontFace: F });
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.05, w: 12.25, h: 1.7, fill: { color: C.warnBg }, rectRadius: 0.06,
    });
    s.addText("心理健康产业越敏感，越要先把边界做成制度。合规不是减速，而是规模化的前提。", {
      x: 0.8, y: 5.05, w: 11.8, h: 1.7, fontSize: 18, color: C.warn, fontFace: F, valign: "middle",
    });
    footer(s, 8);
  }

  // 9 底座
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.paper } });
    kicker(s, "产业化底座");
    title(s, "能连续运行、能被巡检，才有资格成为产业", 0.54, 0.6, 22);
    ["01 漂浮液回收", "02 精密过滤", "03 物理消杀", "04 独立储存"].forEach((t, i) => {
      const x = 0.55 + i * 3.15;
      s.addShape(pptx.ShapeType.roundRect, { x, y: 1.28, w: 3.0, h: 0.85, fill: { color: C.navy }, rectRadius: 0.06 });
      s.addText(t, { x, y: 1.28, w: 3.0, h: 0.85, fontSize: 16, bold: true, color: C.white, align: "center", valign: "middle", fontFace: F });
    });
    const specs = [
      ["纯物理路线", "臭氧、紫外与光触媒路线\n不添加澄清剂与养护剂\n参数以型号文件为准"],
      ["过滤与储液", "精密过滤 + 复合滤材\n净化后进入独立储液\n不跨型号引用参数"],
      ["分区与空气", "漂浮液、储液箱、舱体与空气\n分区处理、分别巡检"],
      ["日常可查", "回水、泵压、滤材、渗漏与水温\n按周期检查并留记录"],
    ];
    specs.forEach((sp, i) => {
      const x = 0.55 + i * 3.15;
      card(s, pptx, x, 2.3, 3.0, 2.85);
      s.addText(sp[0], { x: x + 0.16, y: 2.45, w: 2.68, h: 0.5, fontSize: 16, bold: true, color: C.ink, fontFace: F });
      s.addText(sp[1], { x: x + 0.16, y: 3.05, w: 2.68, h: 1.9, fontSize: 13, color: C.inkSoft, fontFace: F });
    });
    s.addText("工程纪律　心理健康服务进入线下设备，就必须像工业设备一样管理。具体工艺、时长与检测结果，以锁定型号的技术文件和最新检验报告为准。", {
      x: 0.55, y: 5.3, w: 12.25, h: 1.45, fontSize: 14, color: C.muted, fontFace: F,
    });
    footer(s, 9);
  }

  // 10 起点
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.paper } });
    kicker(s, "产业化起点");
    title(s, "我们已经具备从产品到交付的基本闭环", 0.54, 0.55, 22);
    const blocks = [
      ["产品与平台", "自研舱体、控制与净化系统\n多产品线适配不同恢复场景\n设备与服务共同交付"],
      ["资质与检测", "质量体系与产品合规持续建设\n相关认证以证书原件为准\n检测参数按型号核验"],
      ["科研与专家", "心理学与临床专家参与技术路线\n持续跟踪国际研究\n守住证据表达边界"],
      ["运营与人才", "准入评估   ｜   体验 SOP   ｜   消杀巡检   ｜   复访记录   ｜   人才培训"],
    ];
    blocks.forEach((b, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.55 + col * 6.25;
      const y = 1.25 + row * 2.05;
      card(s, pptx, x, y, 6.05, 1.9);
      s.addText(b[0], { x: x + 0.22, y: y + 0.14, w: 5.6, h: 0.36, fontSize: 16, bold: true, color: C.ink, fontFace: F });
      s.addText(b[1], { x: x + 0.22, y: y + 0.55, w: 5.6, h: 1.2, fontSize: 14, color: C.inkSoft, fontFace: F });
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.5, w: 12.25, h: 1.3, fill: { color: C.navy }, rectRadius: 0.06,
    });
    s.addText("机构、专利与用户规模本场不写死；投资尽调阶段按证书、合同与台账逐项核验。", {
      x: 0.8, y: 5.6, w: 11.8, h: 0.4, fontSize: 13, color: "C9D0C6", fontFace: F,
    });
    s.addText("被验证，才值得被信任。", {
      x: 0.8, y: 6.05, w: 11.8, h: 0.5, fontSize: 20, bold: true, color: C.white, fontFace: F,
    });
    footer(s, 10);
  }

  // 11 前景
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.paper } });
    kicker(s, "产业前景");
    title(s, "可持续，不靠一次销售，靠五层能力叠加", 0.54, 0.6, 22);
    const layers = [
      ["一 · 产品与工程", "自研设备与关键系统持续迭代\n工程化、质量与成本形成产品壁垒\n设备销售只是产业起点"],
      ["二 · 运营与标准", "SOP、培训、认证、维护持续交付\n把一次体验变成稳定服务\n把人员经验沉淀为组织能力"],
      ["三 · 数据、证据与网络", "复访记录推动方案优化\n证据积累提高行业可信度\n多场景复制形成品牌与标准网络"],
    ];
    layers.forEach((l, i) => {
      const x = 0.55 + i * 4.15;
      card(s, pptx, x, 1.35, 3.95, 3.35);
      s.addText(l[0], { x: x + 0.2, y: 1.5, w: 3.55, h: 0.7, fontSize: 17, bold: true, color: C.ink, fontFace: F });
      s.addText(l[1], { x: x + 0.2, y: 2.3, w: 3.55, h: 2.15, fontSize: 14, color: C.inkSoft, fontFace: F });
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 4.9, w: 12.25, h: 1.85, fill: { color: C.copperSoft }, rectRadius: 0.06,
    });
    s.addText("设备是起点，运营与证据让项目持续，标准与网络把单点做成产业。\n扩展方向：心理恢复 / 睡眠管理 / 运动恢复 / 高压人群恢复——统一以合规证据边界为前提。", {
      x: 0.8, y: 5.05, w: 11.8, h: 1.55, fontSize: 15, color: C.ink, fontFace: F,
    });
    footer(s, 11);
  }

  // 12 北化
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.paper } });
    kicker(s, "北化协同");
    title(s, "北化接入的不是一个点位，而是一条产业能力链", 0.54, 0.55, 22);
    const links = [
      ["资本", "战略投资或分阶段增持\n支持核心能力建设"],
      ["孵化", "接入孵化—加速—产业化体系\n补齐治理、人才与渠道"],
      ["制造", "导入质量、供应链与材料工艺\n推动工程化与成本优化"],
      ["资源", "链接园区、科技服务与产业伙伴\n使用场景只是可选验证"],
    ];
    links.forEach((l, i) => {
      const x = 0.55 + i * 3.15;
      card(s, pptx, x, 1.25, 3.0, 2.15);
      s.addText(l[0], { x: x + 0.16, y: 1.38, w: 2.68, h: 0.4, fontSize: 18, bold: true, color: C.ink, fontFace: F });
      s.addText(l[1], { x: x + 0.16, y: 1.85, w: 2.68, h: 1.35, fontSize: 13, color: C.inkSoft, fontFace: F });
    });
    card(s, pptx, 0.55, 3.55, 12.25, 1.7);
    s.addText("为什么和北化有关系", { x: 0.8, y: 3.68, w: 11.8, h: 0.32, fontSize: 14, bold: true, color: C.ink, fontFace: F });
    s.addText("北化公开战略以生物医药孵化与智能制造、特种化学品制造与服务为两大主业，并强调创新链、产业链、资本链、人才链协同。\n漂浮方舟可作为心理健康与主动健康方向的产业项目，接入资本、孵化、制造与资源协同。", {
      x: 0.8, y: 4.05, w: 11.8, h: 1.05, fontSize: 13, color: C.inkSoft, fontFace: F,
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.42, w: 12.25, h: 1.35, fill: { color: C.navy }, rectRadius: 0.06,
    });
    s.addText("简单说：北化让项目更像产业；项目为北化大健康版图增加一个可扩展的心理健康入口。", {
      x: 0.8, y: 5.42, w: 11.8, h: 1.35, fontSize: 16, color: C.white, fontFace: F, valign: "middle",
    });
    footer(s, 12);
  }

  // 13 进入
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.paper } });
    kicker(s, "进入方式");
    title(s, "投资关系先定，验证动作按尽调需要安排", 0.54, 0.6, 22);
    const ways = [
      ["战略投资", "以股权投资进入\n支持核心技术、团队与渠道\n先占心理健康产业入口"],
      ["联合产业平台", "共同搭建产品、运营或制造平台\n北化导入资源\n我们负责产品与系统"],
      ["分阶段推进", "先完成技术、合规与商业尽调\n再按里程碑投资或增持"],
    ];
    ways.forEach((w, i) => {
      const x = 0.55 + i * 4.15;
      card(s, pptx, x, 1.35, 3.95, 3.25);
      s.addText(w[0], { x: x + 0.22, y: 1.5, w: 3.5, h: 0.55, fontSize: 18, bold: true, color: C.ink, fontFace: F });
      s.addText(w[1], { x: x + 0.22, y: 2.15, w: 3.5, h: 2.2, fontSize: 15, color: C.inkSoft, fontFace: F });
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 4.8, w: 12.25, h: 1.95, fill: { color: C.warnBg }, rectRadius: 0.06,
    });
    s.addText("本项目不以园区试点为前提\n验证可做，但只是尽调工具，不是合作终点\n本场不谈估值和条款，只确认：这个方向是否值得一起做大。", {
      x: 0.8, y: 4.95, w: 11.8, h: 1.65, fontSize: 15, color: C.warn, fontFace: F,
    });
    footer(s, 13);
  }

  // 14 收束
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.paper } });
    kicker(s, "交流收束");
    title(s, "今天只确认三件事：方向、关系、下一步", 0.54, 0.55, 22);
    const close = [
      ["产业判断", "心理健康服务是长期需求，不是短期风口"],
      ["项目定位", "提供可标准化的深度恢复能力，不做临床治疗"],
      ["可持续性", "产品、运营、证据、培训与网络共同形成壁垒"],
      ["北化价值", "资本 + 孵化 + 制造 + 资源，把单点项目推向产业化"],
      ["合作逻辑", "投资优先，试点可选；按尽调与里程碑推进"],
      ["下一步", "围绕产业定位、资源清单与尽调材料，安排专项交流"],
    ];
    close.forEach((c, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.55 + col * 6.25;
      const y = 1.25 + row * 1.45;
      card(s, pptx, x, y, 6.05, 1.32);
      s.addText(c[0], { x: x + 0.22, y: y + 0.14, w: 5.6, h: 0.32, fontSize: 15, bold: true, color: C.ink, fontFace: F });
      s.addText(c[1], { x: x + 0.22, y: y + 0.5, w: 5.6, h: 0.65, fontSize: 14, color: C.inkSoft, fontFace: F });
    });
    s.addShape(pptx.ShapeType.roundRect, {
      x: 0.55, y: 5.7, w: 12.25, h: 1.05, fill: { color: C.navy }, rectRadius: 0.06,
    });
    s.addText("本场边界　不谈估值、不做疗效承诺；先判断是否同路", {
      x: 0.8, y: 5.7, w: 11.8, h: 1.05, fontSize: 16, color: C.white, fontFace: F, valign: "middle",
    });
    footer(s, 14);
  }

  // 15 封底
  {
    const s = pptx.addSlide();
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: C.navy } });
    s.addText("谢谢", {
      x: 0.7, y: 1.45, w: 12, h: 0.45, fontSize: 16, color: "D4B48A", fontFace: F, charSpacing: 3,
    });
    s.addText("把心理健康中重要而薄弱的“恢复”，\n做成可持续的产业能力", {
      x: 0.7, y: 2.05, w: 12, h: 1.7, fontSize: 30, bold: true, color: C.white, fontFace: F,
    });
    s.addShape(pptx.ShapeType.rect, { x: 0.72, y: 4.0, w: 0.9, h: 0.04, fill: { color: C.copper } });
    s.addText("中友瑞水（北京）科技有限公司 · 漂浮方舟 FLOATING ARK", {
      x: 0.7, y: 4.25, w: 12, h: 0.4, fontSize: 16, color: "C9D0C6", fontFace: F,
    });
    s.addText("北京亦庄   ｜   400-8869-783   ｜   www.float-ark.com", {
      x: 0.7, y: 4.7, w: 12, h: 0.35, fontSize: 14, color: "8E9AA3", fontFace: F,
    });
    s.addText("本材料用于初次交流；不构成疗效承诺或投资要约，数据口径以书面尽调材料为准。", {
      x: 0.7, y: 6.85, w: 12, h: 0.32, fontSize: 12, color: "7D8891", fontFace: F,
    });
  }

  const buf = (await pptx.write({ outputType: "nodebuffer" })) as Buffer;
  const outDir = path.join(process.cwd(), "exports");
  const pubDir = path.join(process.cwd(), "public/exports");
  mkdirSync(outDir, { recursive: true });
  mkdirSync(pubDir, { recursive: true });
  mkdirSync("/opt/cursor/artifacts", { recursive: true });
  const pptPath = path.join(outDir, FILE);
  writeFileSync(pptPath, buf);
  copyFileSync(pptPath, path.join(pubDir, FILE));
  copyFileSync(pptPath, path.join("/opt/cursor/artifacts", FILE));
  copyFileSync(pptPath, path.join("/opt/cursor/artifacts", "bjhg-mental-health-invest.pptx"));
  console.log("pptx bytes", buf.length);
  console.log("pptx", pptPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
