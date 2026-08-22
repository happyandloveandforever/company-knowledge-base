import type { KnowledgePoint, Outline, OutlineSlide } from "./types";
import { getLogicById } from "./presentation-logic";
import { generateId } from "./utils";
import { bodyToBullets } from "./parser";

export interface ComposeRequest {
  title: string;
  audience: string;
  durationMin: number;
  logicId: string;
  knowledgePointIds: string[];
  knowledgePoints: KnowledgePoint[];
}

function distributePoints(
  points: KnowledgePoint[],
  stepCount: number
): KnowledgePoint[][] {
  if (points.length === 0) return Array.from({ length: stepCount }, () => []);
  if (points.length <= stepCount) {
    return points.map((p) => [p]).concat(
      Array.from({ length: stepCount - points.length }, () => [])
    );
  }

  const buckets: KnowledgePoint[][] = Array.from({ length: stepCount }, () => []);
  points.forEach((p, i) => {
    buckets[i % stepCount].push(p);
  });
  return buckets;
}

export function generateOutline(req: ComposeRequest): Outline {
  const logic = getLogicById(req.logicId);
  if (!logic) throw new Error("未找到所选演讲逻辑");

  const selected = req.knowledgePointIds
    .map((id) => req.knowledgePoints.find((kp) => kp.id === id))
    .filter((kp): kp is KnowledgePoint => !!kp);

  const buckets = distributePoints(selected, logic.steps.length);
  const slides: OutlineSlide[] = [];

  logic.steps.forEach((step, idx) => {
    const bucket = buckets[idx] || [];
    if (bucket.length === 0) {
      slides.push({
        order: idx + 1,
        title: step,
        bullets: [`本页待补充：${step}相关内容`],
        knowledgePointIds: [],
        logicStep: step,
        speakerNotes: `演讲逻辑「${logic.name}」— ${step}`,
      });
      return;
    }

    if (bucket.length === 1) {
      const kp = bucket[0];
      slides.push({
        order: idx + 1,
        title: kp.title,
        bullets: bodyToBullets(kp.body).slice(0, 5),
        knowledgePointIds: [kp.id],
        logicStep: step,
        speakerNotes: `${step}\n\n${kp.summary || kp.body.slice(0, 200)}`,
      });
    } else {
      slides.push({
        order: idx + 1,
        title: step,
        bullets: bucket.map((kp) => kp.title),
        knowledgePointIds: bucket.map((kp) => kp.id),
        logicStep: step,
        speakerNotes: bucket.map((kp) => `${kp.title}: ${kp.summary || kp.body.slice(0, 100)}`).join("\n\n"),
      });

      bucket.forEach((kp) => {
        slides.push({
          order: slides.length + 1,
          title: kp.title,
          bullets: bodyToBullets(kp.body).slice(0, 5),
          knowledgePointIds: [kp.id],
          logicStep: step,
          speakerNotes: kp.summary || kp.body.slice(0, 300),
        });
      });
    }
  });

  // Title slide
  slides.unshift({
    order: 0,
    title: req.title,
    bullets: [
      `目标受众：${req.audience}`,
      `预计时长：${req.durationMin} 分钟`,
      `演讲逻辑：${logic.name}`,
      `知识点数量：${selected.length} 个`,
    ],
    knowledgePointIds: selected.map((kp) => kp.id),
    logicStep: "封面",
    speakerNotes: `本次演讲面向${req.audience}，采用「${logic.name}」结构。`,
  });

  // Closing slide
  slides.push({
    order: slides.length,
    title: "总结与下一步",
    bullets: [
      "回顾核心要点",
      "明确行动项",
      "Q&A 答疑",
    ],
    knowledgePointIds: [],
    logicStep: "总结",
    speakerNotes: "感谢聆听，欢迎提问。",
  });

  // Re-order
  slides.forEach((s, i) => {
    s.order = i + 1;
  });

  return {
    id: generateId("OL"),
    title: req.title,
    audience: req.audience,
    durationMin: req.durationMin,
    logicId: req.logicId,
    logicName: logic.name,
    slides,
    knowledgePointIds: selected.map((kp) => kp.id),
    createdAt: new Date().toISOString(),
  };
}

export function outlineToMarkdown(outline: Outline): string {
  const lines: string[] = [
    `# ${outline.title}`,
    "",
    `- **受众**: ${outline.audience}`,
    `- **时长**: ${outline.durationMin} 分钟`,
    `- **演讲逻辑**: ${outline.logicName}`,
    `- **知识点数**: ${outline.knowledgePointIds.length}`,
    "",
    "---",
    "",
  ];

  outline.slides.forEach((slide) => {
    lines.push(`## 第 ${slide.order} 页：${slide.title}`);
    if (slide.logicStep) lines.push(`> 逻辑步骤：${slide.logicStep}`);
    lines.push("");
    slide.bullets.forEach((b) => lines.push(`- ${b}`));
    if (slide.speakerNotes) {
      lines.push("");
      lines.push(`**演讲备注**: ${slide.speakerNotes}`);
    }
    lines.push("");
  });

  return lines.join("\n");
}
