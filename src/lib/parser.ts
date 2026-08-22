import { OfficeParser } from "officeparser";
import type { ParsedChunk } from "./types";

function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function firstLine(text: string, maxLen = 80): string {
  const line = text.split(/[\n。！？.!?]/)[0]?.trim() || text.slice(0, maxLen);
  return line.length > maxLen ? `${line.slice(0, maxLen)}…` : line;
}

function extractTextFromNode(node: {
  text?: string;
  children?: unknown[];
  toText?: () => string;
}): string {
  if (typeof node.toText === "function") {
    return cleanText(node.toText());
  }
  if (node.text) return cleanText(node.text);
  if (Array.isArray(node.children)) {
    return cleanText(
      node.children
        .map((c) => extractTextFromNode(c as { text?: string; children?: unknown[]; toText?: () => string }))
        .filter(Boolean)
        .join("\n")
    );
  }
  return "";
}

export async function parseDocument(
  buffer: Buffer,
  filename: string
): Promise<ParsedChunk[]> {
  const ext = filename.toLowerCase().split(".").pop() || "";

  if (!["pptx", "docx", "doc"].includes(ext)) {
    throw new Error(`暂不支持 .${ext} 格式，请上传 PPT (.pptx) 或 Word (.docx) 文件`);
  }

  const ast = await OfficeParser.parseOffice(buffer, {
    extractAttachments: false,
    newlineDelimiter: "\n",
  });

  // Prefer chunk-based splitting for natural boundaries
  try {
    const chunksResult = await ast.to("chunks", {
      chunksConfig: {
        strategy: "document-structure",
        splitBy: ext === "pptx" ? "slide" : "heading",
      },
    });

    const chunks =
      (
        chunksResult as {
          value?: Array<{
            text?: string;
            metadata?: { slideNumber?: number; closestHeading?: string };
          }>;
        }
      ).value || [];

    if (chunks.length > 0) {
      const parsed: ParsedChunk[] = [];
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const body = cleanText(chunk.text || "");
        if (!body || body.length < 10) continue;

        const location =
          ext === "pptx"
            ? `第 ${chunk.metadata?.slideNumber ?? i + 1} 页`
            : chunk.metadata?.closestHeading || `段落 ${i + 1}`;

        const title =
          chunk.metadata?.closestHeading ||
          firstLine(body) ||
          `知识点 ${i + 1}`;

        parsed.push({ title, body, location });
      }
      if (parsed.length > 0) return parsed;
    }
  } catch {
    // fall through to manual extraction
  }

  // Fallback: walk AST content tree
  const chunks: ParsedChunk[] = [];
  const content = ast.content || [];

  if (ext === "pptx") {
    content.forEach((node, i) => {
      const nodeType = (node as { type?: string }).type;
      if (nodeType === "slide" || nodeType === "page") {
        const body = extractTextFromNode(node as { text?: string; children?: unknown[]; toText?: () => string });
        if (body.length >= 10) {
          chunks.push({
            title: firstLine(body) || `幻灯片 ${i + 1}`,
            body,
            location: `第 ${i + 1} 页`,
          });
        }
      }
    });
  }

  if (chunks.length === 0) {
    // Last resort: split full text by paragraphs
    const fullText = typeof ast.toText === "function" ? ast.toText() : "";
    const paragraphs = fullText
      .split(/\n{2,}/)
      .map(cleanText)
      .filter((p) => p.length >= 20);

    paragraphs.forEach((body, i) => {
      chunks.push({
        title: firstLine(body) || `知识点 ${i + 1}`,
        body,
        location: `段落 ${i + 1}`,
      });
    });
  }

  if (chunks.length === 0) {
    throw new Error("未能从文件中提取有效内容，请检查文件是否为空或格式是否正确");
  }

  return chunks;
}

export function inferCategory(filename: string, title: string): string {
  const combined = `${filename} ${title}`.toLowerCase();
  const rules: [RegExp, string][] = [
    [/销售|客户|商务|谈判/, "销售技巧"],
    [/产品|功能|方案|架构/, "产品知识"],
    [/培训|内训|教程|学习/, "培训资料"],
    [/管理|团队|领导|组织/, "管理技能"],
    [/市场|品牌|营销|推广/, "市场营销"],
    [/技术|开发|工程|代码/, "技术知识"],
    [/财务|预算|成本|投资/, "财务分析"],
    [/战略|规划|愿景|目标/, "战略规划"],
  ];

  for (const [pattern, category] of rules) {
    if (pattern.test(combined)) return category;
  }
  return "未分类";
}

export function inferTags(title: string, body: string): string[] {
  const text = `${title} ${body}`;
  const tags: string[] = [];
  const rules: [RegExp, string][] = [
    [/案例|实例|故事/, "案例"],
    [/数据|统计|指标|KPI/, "数据"],
    [/步骤|流程|方法|框架/, "方法论"],
    [/工具|系统|平台/, "工具"],
    [/新人|入门|基础/, "入门"],
    [/高级|进阶|深度/, "进阶"],
    [/Q&A|问答|答疑/, "互动"],
  ];

  for (const [pattern, tag] of rules) {
    if (pattern.test(text)) tags.push(tag);
  }

  return tags.length > 0 ? tags : ["通用"];
}

export function inferAudience(title: string, body: string): string[] {
  const text = `${title} ${body}`;
  const audiences: string[] = [];
  if (/新人|入门|基础|初级/.test(text)) audiences.push("新人");
  if (/经理|主管|管理|leader/i.test(text)) audiences.push("管理者");
  if (/销售|客户|商务/.test(text)) audiences.push("销售团队");
  if (/技术|开发|工程/.test(text)) audiences.push("技术团队");
  if (/全员|所有人|同事/.test(text)) audiences.push("全员");
  return audiences.length > 0 ? audiences : ["通用"];
}

export function estimateDuration(body: string): number {
  const chars = body.length;
  if (chars < 100) return 2;
  if (chars < 300) return 5;
  if (chars < 600) return 8;
  return 12;
}

export function bodyToBullets(body: string): string[] {
  const lines = body
    .split(/\n/)
    .map((l) => l.replace(/^[-•·\d.)、\s]+/, "").trim())
    .filter((l) => l.length > 0);

  if (lines.length <= 1) {
    const sentences = body.split(/[。！？；]/).map((s) => s.trim()).filter((s) => s.length > 4);
    return sentences.slice(0, 5);
  }
  return lines.slice(0, 6);
}
