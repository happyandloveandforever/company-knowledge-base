import type { ParsedChunk } from "./types";

export type SupportedFileType =
  | "pptx"
  | "docx"
  | "doc"
  | "pdf"
  | "md"
  | "html"
  | "txt"
  | "png"
  | "jpg"
  | "jpeg"
  | "webp"
  | "other";

export const SUPPORTED_EXTENSIONS = [
  "pptx",
  "docx",
  "doc",
  "pdf",
  "md",
  "markdown",
  "html",
  "htm",
  "txt",
  "png",
  "jpg",
  "jpeg",
  "webp",
] as const;

export function getFileExtension(filename: string): string {
  return filename.toLowerCase().split(".").pop() || "";
}

export function isSupportedExtension(ext: string): boolean {
  return (SUPPORTED_EXTENSIONS as readonly string[]).includes(ext);
}

export function normalizeFileType(ext: string): SupportedFileType {
  if (["pptx"].includes(ext)) return "pptx";
  if (["docx", "doc"].includes(ext)) return "docx";
  if (ext === "pdf") return "pdf";
  if (["md", "markdown"].includes(ext)) return "md";
  if (["html", "htm"].includes(ext)) return "html";
  if (ext === "txt") return "txt";
  if (["png", "jpg", "jpeg", "webp"].includes(ext)) return ext === "jpeg" ? "jpg" : (ext as SupportedFileType);
  return "other";
}

export function isImageType(type: SupportedFileType): boolean {
  return ["png", "jpg", "jpeg", "webp"].includes(type);
}

function cleanText(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function firstLine(text: string, maxLen = 80): string {
  const line = text.split(/[\n。！？.!?]/)[0]?.trim() || text.slice(0, maxLen);
  return line.length > maxLen ? `${line.slice(0, maxLen)}…` : line;
}

function htmlToText(html: string): string {
  return cleanText(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/h[1-6]>/gi, "\n\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
  );
}

function parseMarkdown(text: string): ParsedChunk[] {
  const chunks: ParsedChunk[] = [];
  const sections = text.split(/(?=^#{1,3}\s)/m).filter((s) => s.trim());

  if (sections.length <= 1) {
    const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length >= 20);
    paragraphs.forEach((body, i) => {
      chunks.push({
        title: firstLine(body.replace(/^#+\s*/, "")),
        body: body.trim(),
        location: `段落 ${i + 1}`,
      });
    });
    return chunks;
  }

  sections.forEach((section, i) => {
    const lines = section.trim().split("\n");
    const heading = lines[0]?.replace(/^#+\s*/, "").trim() || `章节 ${i + 1}`;
    const body = lines.slice(1).join("\n").trim() || section.trim();
    if (body.length >= 10) {
      chunks.push({ title: heading, body, location: heading });
    }
  });
  return chunks;
}

function splitTextBlocks(text: string, locationPrefix: string): ParsedChunk[] {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter((b) => b.length >= 20);
  return blocks.map((body, i) => ({
    title: firstLine(body),
    body,
    location: `${locationPrefix} · 段落 ${i + 1}`,
  }));
}

async function parsePdf(buffer: Buffer): Promise<ParsedChunk[]> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const textResult = await parser.getText();
    const pages = textResult.pages || [];

    if (pages.length > 0) {
      const chunks = pages
        .map((p) => ({ body: cleanText(p.text || ""), num: p.num }))
        .filter(({ body }) => body.length >= 15)
        .map(({ body, num }) => ({
          title: firstLine(body),
          body,
          location: `第 ${num} 页`,
        }));
      if (chunks.length > 0) return chunks;
    }

    const fullText = cleanText(textResult.text || "");
    if (!fullText) {
      throw new Error("PDF 未能提取文字（可能是扫描件，请上传 PNG/JPG 由 Claude 视觉识别）");
    }
    return splitTextBlocks(fullText, "PDF");
  } finally {
    await parser.destroy();
  }
}

async function parseOffice(buffer: Buffer, filename: string): Promise<ParsedChunk[]> {
  const { parseDocument } = await import("./parser");
  return parseDocument(buffer, filename);
}

export interface ExtractedDocument {
  chunks: ParsedChunk[];
  fileType: SupportedFileType;
  /** Base64 for image files (Claude vision) */
  imageBase64?: string;
  imageMediaType?: string;
  rawText?: string;
}

export async function extractDocument(
  buffer: Buffer,
  filename: string
): Promise<ExtractedDocument> {
  const ext = getFileExtension(filename);
  const fileType = normalizeFileType(ext);

  if (!isSupportedExtension(ext)) {
    throw new Error(
      `不支持 .${ext} 格式。支持：${SUPPORTED_EXTENSIONS.map((e) => `.${e}`).join("、")}`
    );
  }

  if (["pptx", "docx", "doc"].includes(ext)) {
    const chunks = await parseOffice(buffer, filename);
    return { chunks, fileType, rawText: chunks.map((c) => c.body).join("\n\n") };
  }

  if (ext === "pdf") {
    const chunks = await parsePdf(buffer);
    return { chunks, fileType: "pdf", rawText: chunks.map((c) => c.body).join("\n\n") };
  }

  if (["md", "markdown"].includes(ext)) {
    const text = cleanText(buffer.toString("utf-8"));
    const chunks = parseMarkdown(text);
    return { chunks: chunks.length ? chunks : splitTextBlocks(text, "Markdown"), fileType: "md", rawText: text };
  }

  if (["html", "htm"].includes(ext)) {
    const text = htmlToText(buffer.toString("utf-8"));
    const chunks = splitTextBlocks(text, "HTML");
    return { chunks, fileType: "html", rawText: text };
  }

  if (ext === "txt") {
    const text = cleanText(buffer.toString("utf-8"));
    const chunks = splitTextBlocks(text, "文本");
    return { chunks, fileType: "txt", rawText: text };
  }

  if (["png", "jpg", "jpeg", "webp"].includes(ext)) {
    const mediaTypes: Record<string, string> = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      webp: "image/webp",
    };
    return {
      chunks: [
        {
          title: filename,
          body: `[图片文件：${filename}，需 Claude 视觉识别内容]`,
          location: "图片",
        },
      ],
      fileType: normalizeFileType(ext),
      imageBase64: buffer.toString("base64"),
      imageMediaType: mediaTypes[ext] || "image/png",
    };
  }

  throw new Error(`暂不支持 .${ext}`);
}
