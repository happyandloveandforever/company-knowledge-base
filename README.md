# 公司知识库

将现有 PPT 和 Word 文件拆分为结构化知识点，建立可浏览的总库，选择知识点和演讲逻辑后生成大纲并导出 PPT。

> **项目协作说明见 [PROJECT.md](./PROJECT.md)** — 以后在本 Cursor Agent 会话中继续交流。

## 功能

- **导入文件**：上传 `.pptx` / `.docx`，自动按幻灯片或章节拆分为知识点
- **知识总库**：按分类浏览、搜索、审核（草稿 → 已批准）
- **HTML 导出**：一键导出结构化 HTML 总库，可离线浏览和分享
- **编排演讲**：选择知识点 + 演讲逻辑模板 → 生成大纲
- **PPT 导出**：根据大纲自动生成 `.pptx` 文件

## AI 精细拆分（推荐用于密集 PPT）

默认情况下，系统使用 **officeparser** 按幻灯片/章节做基础拆分（一页 = 一个知识点）。

若你的 PPT 信息密集，请配置 AI 模型做**精细拆分**：一页可拆成多个独立知识点，保留数据、案例和步骤细节。

### 配置方法

1. 复制 `.env.example` 为 `.env.local`
2. 填入 API Key（二选一或都填）：

```bash
# 使用 OpenAI（ChatGPT API）
AI_PROVIDER=openai
AI_MODEL=gpt-4o          # 推荐，适合密集内容
OPENAI_API_KEY=sk-...

# 或使用 Gemini
AI_PROVIDER=gemini
AI_MODEL=gemini-2.0-flash   # 或 gemini-1.5-pro 更精细
GEMINI_API_KEY=...
```

3. 重启开发服务器

### 模型推荐

| 场景 | 推荐模型 | 说明 |
|------|----------|------|
| 密集 PPT、需精细拆分 | **OpenAI gpt-4o** | 默认首选，理解力强、JSON 输出稳定 |
| 更长文档、要更深度理解 | **Gemini 1.5 Pro** | 上下文窗口大，适合整章 Word |
| 批量处理、成本敏感 | **Gemini 2.0 Flash** | 速度快、成本低 |

上传时在「拆分模式」中选择 **AI 精细拆分** 或 **自动**（有 API Key 时默认走 AI）。

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
