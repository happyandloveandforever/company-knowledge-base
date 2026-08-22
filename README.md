# 公司知识库

将现有 PPT 和 Word 文件拆分为结构化知识点，建立可浏览的总库，选择知识点和演讲逻辑后生成大纲并导出 PPT。

---

## 多对话协作（重要）

**换对话、隔几天再来，知识库不会丢。** 固定入口：

| 文件 | 用途 |
|------|------|
| **[PROJECT.md](./PROJECT.md)** | 完整项目状态、当前库清单、协作方式 — **新对话先读这个** |
| **[AGENTS.md](./AGENTS.md)** | Agent 快速规则与启动清单 |
| `.cursor/rules/knowledge-base.mdc` | Cursor 新对话自动加载的项目规则 |

**新对话开场白（复制即用）：**

> 请先阅读 PROJECT.md 和 AGENTS.md，了解公司知识库当前状态，然后继续帮我 [具体任务]。

---

- **导入文件**：上传多种格式，**默认 Cursor Claude 精细拆分**（无需 API Key，对话里处理）
  - 支持：`.pptx` `.docx` `.pdf` `.md` `.html` `.txt` `.png` `.jpg` `.webp`
  - 无 API Key：上传后进队列，对话中说「处理拆分队列」
- **知识总库**：按分类浏览、搜索、审核（草稿 → 已批准）
- **HTML 导出**：一键导出结构化 HTML 总库，可离线浏览和分享
- **编排演讲**：选择知识点 + 演讲逻辑模板 → 生成大纲
- **PPT 导出**：根据大纲自动生成 `.pptx` 文件

## AI 精细拆分（Claude，默认）

复制 `.env.example` 为 `.env.local`，填入 Anthropic API Key：

```bash
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
AI_MODEL=claude-sonnet-4-20250514
```

未配置时：上传文件会进入 **Claude 待拆分队列**，在 Cursor 对话中说「处理拆分队列」即可。

也支持 OpenAI / Gemini 作为备选（见 `.env.example`）。

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:43123](http://localhost:43123)

## 使用流程

1. **导入文件** — 在「导入文件」页上传 PPT 或 Word
2. **审核总库** — 在「知识总库」中查看、搜索、批准知识点
3. **编排演讲** — 在「编排演讲」页选择知识点和演讲逻辑，生成大纲
4. **导出** — 下载 Markdown 大纲或 PPT 文件

## 技术栈

- Next.js 16 + TypeScript + Tailwind CSS
- officeparser（文档解析）
- pptxgenjs（PPT 生成）
- JSON 文件存储（无需数据库）

## 数据目录

- `data/knowledge-points.json` — 知识点
- `data/sources.json` — 导入文件记录
- `data/outlines.json` — 生成的大纲历史
- `uploads/` — 上传的原始文件

## 后续扩展

- 接入 OpenAI / Gemini API 增强知识点拆分和分类
- 支持 PDF / EPUB 书籍导入
- 培训资料和量表模板导出
- 多用户权限与审核流
