import type { AIConfig } from "./ai-config";
import type { ParsedChunk } from "./types";

export interface AISplitResult extends ParsedChunk {
  summary?: string;
  category?: string;
  tags?: string[];
  audience?: string[];
  examples?: string[];
}

interface RawSlide {
  location: string;
  body: string;
  slideIndex: number;
}

const SYSTEM_PROMPT = `你是一位企业知识管理专家，负责把演示文稿中的密集内容拆分为「可独立复用的知识点」。

拆分原则（必须严格遵守）：
1. **原子化**：每个知识点只讲一件事、一个概念、一个方法或一个案例，可在不同演讲中独立使用。
2. **密集页多拆**：若一页含多个概念、步骤、数据点或案例，必须拆成多个知识点，不要合并。
3. **保留细节**：数字、专有名词、步骤顺序、案例细节必须保留，不可过度概括丢失信息。
4. **自洽完整**：每个知识点的 body 应能脱离原 PPT 被读懂，必要时补充少量上下文。
5. **跳过空页**：封面、目录、过渡页、纯装饰页、仅写「谢谢」的页返回空数组。
6. **不编造**：只基于原文提取，不要添加原文没有的内容。

输出格式：严格 JSON 数组，不要 markdown 代码块，不要其他文字。
每个元素：
{
  "title": "简洁准确的标题（8-30字）",
  "summary": "一句话摘要（30-80字）",
  "body": "完整正文，保留 bullet、步骤、数据，用换行分隔",
  "category": "分类（如：销售技巧、产品知识、培训资料、管理技能、市场营销、技术知识、财务分析、战略规划、未分类）",
  "tags": ["标签1", "标签2"],
  "audience": ["适用受众，如：新人、管理者、销售团队"],
  "examples": ["案例或数据引用，无则空数组"]
}`;

async function callAnthropic(config: AIConfig, userPrompt: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 8192,
      temperature: 0.2,
      system: SYSTEM_PROMPT + '\n\n返回 JSON 对象：{ "knowledgePoints": [...] }',
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API 错误 (${res.status}): ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const block = data.content?.find((b: { type: string }) => b.type === "text");
  return block?.text || "{}";
}

async function callAnthropicVision(
  config: AIConfig,
  imageBase64: string,
  mediaType: string,
  userPrompt: string
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 8192,
      temperature: 0.2,
      system: SYSTEM_PROMPT + '\n\n返回 JSON 对象：{ "knowledgePoints": [...] }',
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: imageBase64 },
            },
            { type: "text", text: userPrompt },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude Vision 错误 (${res.status}): ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const block = data.content?.find((b: { type: string }) => b.type === "text");
  return block?.text || "{}";
}

async function callOpenAI(config: AIConfig, userPrompt: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT + "\n\n返回 JSON 对象：{ \"knowledgePoints\": [...] }" },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API 错误 (${res.status}): ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "{}";
}

async function callGemini(config: AIConfig, userPrompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: SYSTEM_PROMPT + "\n\n返回 JSON 对象：{ \"knowledgePoints\": [...] }" },
            { text: userPrompt },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API 错误 (${res.status}): ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
}

function parseAIResponse(raw: string, location: string): AISplitResult[] {
  let parsed: { knowledgePoints?: AISplitResult[] } | AISplitResult[];

  try {
    parsed = JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) return [];
    parsed = JSON.parse(match[0]);
  }

  const points = Array.isArray(parsed)
    ? parsed
    : parsed.knowledgePoints || [];

  return points
    .filter((p) => p.title && p.body && p.body.length >= 15)
    .map((p) => ({
      title: p.title.trim(),
      summary: p.summary?.trim() || p.body.slice(0, 100),
      body: p.body.trim(),
      location,
      category: p.category || "未分类",
      tags: Array.isArray(p.tags) ? p.tags : ["通用"],
      audience: Array.isArray(p.audience) ? p.audience : ["通用"],
      examples: Array.isArray(p.examples) ? p.examples : [],
    }));
}

async function callModel(
  config: AIConfig,
  userPrompt: string,
  vision?: { base64: string; mediaType: string }
): Promise<string> {
  if (vision && config.provider === "anthropic") {
    return callAnthropicVision(config, vision.base64, vision.mediaType, userPrompt);
  }
  if (config.provider === "anthropic") return callAnthropic(config, userPrompt);
  if (config.provider === "gemini") return callGemini(config, userPrompt);
  return callOpenAI(config, userPrompt);
}

async function splitOneSlide(
  config: AIConfig,
  slide: RawSlide,
  filename: string,
  vision?: { base64: string; mediaType: string }
): Promise<AISplitResult[]> {
  const userPrompt = `文件名：${filename}
位置：${slide.location}

【原文内容】
${slide.body}

请按拆分原则输出 knowledgePoints 数组。`;

  const raw = await callModel(config, userPrompt, vision);
  return parseAIResponse(raw, slide.location);
}

/** Process slides in small batches to handle cross-slide context when needed */
export async function splitSlidesWithAI(
  config: AIConfig,
  slides: ParsedChunk[],
  filename: string,
  onProgress?: (done: number, total: number) => void,
  vision?: { base64: string; mediaType: string }
): Promise<AISplitResult[]> {
  const rawSlides: RawSlide[] = slides.map((s, i) => ({
    location: s.location || `第 ${i + 1} 页`,
    body: s.body,
    slideIndex: i,
  }));

  const allResults: AISplitResult[] = [];

  // Image: single vision call for whole file
  if (vision && rawSlides.length === 1) {
    try {
      const points = await splitOneSlide(config, rawSlides[0], filename, vision);
      return points;
    } catch (err) {
      console.error("Claude vision split failed:", err);
      throw err;
    }
  }

  for (let i = 0; i < rawSlides.length; i++) {
    const slide = rawSlides[i];
    if (slide.body.length < 15) continue;

    try {
      const points = await splitOneSlide(config, slide, filename);
      allResults.push(...points);
    } catch (err) {
      console.error(`AI split failed for slide ${i + 1}:`, err);
      // Fallback: keep original chunk as one knowledge point
      allResults.push({
        title: slide.body.slice(0, 40),
        summary: slide.body.slice(0, 100),
        body: slide.body,
        location: slide.location,
        category: "未分类",
        tags: ["通用", "AI拆分失败-保留原文"],
        audience: ["通用"],
        examples: [],
      });
    }

    onProgress?.(i + 1, rawSlides.length);

    // Rate limit courtesy pause
    if (i < rawSlides.length - 1) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  return allResults;
}

/** For very long single slides (>3000 chars), split text first then AI process each part */
export async function splitDenseContentWithAI(
  config: AIConfig,
  slides: ParsedChunk[],
  filename: string,
  vision?: { base64: string; mediaType: string }
): Promise<AISplitResult[]> {
  if (vision) {
    return splitSlidesWithAI(config, slides, filename, undefined, vision);
  }

  const expanded: ParsedChunk[] = [];

  for (const slide of slides) {
    if (slide.body.length > 3000) {
      // Split long content by double newlines or numbered sections
      const parts = slide.body.split(/\n{2,}(?=\d+[.、）)]|\n[#*•-])/).filter((p) => p.trim().length >= 20);
      if (parts.length > 1) {
        parts.forEach((part, idx) => {
          expanded.push({
            ...slide,
            body: part.trim(),
            location: `${slide.location || "未知"} · 片段 ${idx + 1}`,
          });
        });
        continue;
      }
    }
    expanded.push(slide);
  }

  return splitSlidesWithAI(config, expanded, filename);
}
