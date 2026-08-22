import PptxGenJS from "pptxgenjs";
import type { Outline } from "./types";

const COLORS = {
  primary: "1E3A5F",
  accent: "2563EB",
  text: "1F2937",
  muted: "6B7280",
  bg: "F8FAFC",
};

export async function generatePptBuffer(outline: Outline): Promise<Buffer> {
  const pptx = new PptxGenJS();
  pptx.author = "知识库系统";
  pptx.title = outline.title;
  pptx.layout = "LAYOUT_16x9";

  outline.slides.forEach((slide, idx) => {
    const s = pptx.addSlide();

    if (idx === 0) {
      // Title slide
      s.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: "100%",
        h: "100%",
        fill: { color: COLORS.primary },
      });
      s.addText(slide.title, {
        x: 0.8,
        y: 1.8,
        w: 8.4,
        h: 1.5,
        fontSize: 36,
        bold: true,
        color: "FFFFFF",
        fontFace: "Arial",
      });
      s.addText(slide.bullets.join("\n"), {
        x: 0.8,
        y: 3.5,
        w: 8.4,
        h: 1.5,
        fontSize: 16,
        color: "CBD5E1",
        fontFace: "Arial",
      });
      return;
    }

    // Content slides
    s.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 0.15,
      h: "100%",
      fill: { color: COLORS.accent },
    });

    s.addText(slide.title, {
      x: 0.6,
      y: 0.4,
      w: 8.8,
      h: 0.8,
      fontSize: 28,
      bold: true,
      color: COLORS.primary,
      fontFace: "Arial",
    });

    if (slide.logicStep) {
      s.addText(slide.logicStep, {
        x: 0.6,
        y: 1.1,
        w: 8.8,
        h: 0.4,
        fontSize: 12,
        color: COLORS.muted,
        fontFace: "Arial",
      });
    }

    const bulletText = slide.bullets.map((b) => ({
      text: b,
      options: { bullet: true, breakLine: true },
    }));

    s.addText(bulletText, {
      x: 0.6,
      y: 1.6,
      w: 8.8,
      h: 3.5,
      fontSize: 18,
      color: COLORS.text,
      fontFace: "Arial",
      valign: "top",
    });

    s.addText(`${slide.order} / ${outline.slides.length}`, {
      x: 8.5,
      y: 5.2,
      w: 1,
      h: 0.3,
      fontSize: 10,
      color: COLORS.muted,
      align: "right",
    });

    if (slide.speakerNotes) {
      s.addNotes(slide.speakerNotes);
    }
  });

  const output = await pptx.write({ outputType: "nodebuffer" });
  return output as Buffer;
}
