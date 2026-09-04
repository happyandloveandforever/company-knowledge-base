<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# 项目协作规则（公司知识库）

> **新对话必读：** 先读 [`PROJECT.md`](./PROJECT.md)，那里有完整的当前状态、代码地图和协作约定。  
> 本文件是 Agent 的快速入口；详细内容以 PROJECT.md 为准。

## 这是什么

Next.js 知识库 Web 应用 + Git 持久化的 JSON 知识点总库。  
用户通过**多个 Cursor 对话**持续上传文件、Claude 精细拆分、审核、编排 PPT。

## 新对话启动清单

> **小白用户：先看 [START-HERE.md](./START-HERE.md)**

```
仓库：https://origin.cursor.com/git/clark-gonzalez/tmp-8ece63bc7e599628  分支：main
⚠️ 不要 New Project！必须连这个仓库！
1. 读 START-HERE.md → PROJECT.md
2. 读 data/knowledge-points.json   → 应有 109 条，勿覆盖
3. 读 data/sources.json
4. node scripts/process-split-queue.mjs
5. curl http://127.0.0.1:43123/api/health
```

## 拆分方式（重要）

| 方式 | 条件 | 怎么做 |
|------|------|--------|
| **Cursor Claude（默认）** | 无 API Key | 用户上传后，在对话中说「处理拆分队列」或「帮我 Claude 精细拆 xxx.pdf」→ 参考 `scripts/import-*.mjs` 写知识点 → 更新 JSON |
| Claude API 自动 | 有 `ANTHROPIC_API_KEY` | 网页上传自动拆分 |
| 基础机械拆分 | 用户选 basic 模式 | 按页/段拆分，质量低 |

**用户明确不要 API Key。** 杨浦财务、B端定稿都是 Cursor Claude 对话拆的。

## 关键文件

| 文件 | 作用 |
|------|------|
| `PROJECT.md` | **固定协作文档**，每次会话更新状态 |
| `data/knowledge-points.json` | 核心资产，进 Git |
| `data/sources.json` | 导入来源记录 |
| `scripts/import-faf-yangpu.mjs` | 杨浦 PDF 拆分参考 |
| `scripts/import-b2b-yiling.mjs` | B端 PDF 拆分参考 |
| `scripts/apply-knowledge-layers.mjs` | 通识/公司分层 + 通识前沿卡（幂等） |
| `scripts/import-float-training.mjs` | 漂浮培训大纲 71 条内训卡（幂等，全部 internalOnly） |
| `scripts/import-training-supplements.mjs` | 好转反应/适应症/禁忌症/产品手册补训（幂等，禁忌与手册另写运营卡） |
| `scripts/import-vagus-three-reports.mjs` | 迷走机制/综合干预专业版/VNS手段地图（幂等，直接批准） |
| `scripts/import-atom-library.mjs` | combined.md 内部原子库 ~1300 条主题合并为 20 条仅内训卡（幂等） |
| `scripts/import-therapy-os.mjs` | 漂浮疗法说明.pdf 五维叙事脊柱 13 条仅内训卡（幂等） |
| `scripts/import-nsf-standards-qa.mjs` | 标准五问拆为 KP-WEB-013~020（幂等，通识，直接批准） |
| `docs/漂浮舱卫生安全标准五问.md` | NSF CCS-12804 / 周转率 / 臭氧 / ASTM F462 / ASME A112.19.17 问答底稿 |
| `scripts/export-public-site.mjs` | 生成 GitHub Pages 静态站（需管理员开通 Pages） |
| `/open` | Vercel 上的公开只读 HTML，不含内训 |
| `scripts/test-knowledge-layers.mjs` | 分层与培训隔离回归测试 |
| `scripts/process-split-queue.mjs` | 查看待拆分队列 |
| `src/app/api/upload/route.ts` | 网页上传逻辑 |
| `src/lib/storage.ts` | JSON 读写、deleteSourceFile |
| `.cursor/environment.json` | Cloud 环境自动 build + keep-alive |

## 常用命令

```bash
npm run build && npm run serve          # 生产模式 + 守护进程，端口 43123
node scripts/process-split-queue.mjs    # 看待拆分文件
curl http://127.0.0.1:43123/api/health # 健康检查
```

## 数据变更后必做

1. `git add data/` → commit → push
2. 更新 `PROJECT.md` 的「当前库状态」和「变更记录」

## 禁止

- 重建项目 / 换框架
- 覆盖已有知识点（除非用户要求）
- 重复 import 已入库文件
- 未经确认删除 sources 或 knowledge points
