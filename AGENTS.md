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
| `scripts/apply-patent-real-tech.mjs` | 高盐AOP/光触媒失效对策 + 主动对消低刺激（幂等，`PAT-MAP-005`） |
| `scripts/apply-patent-active-light.mjs` | 主动降光：暗适应时变阈值/余辉准入/分区遮断（幂等，`PAT-IDEA-041`） |
| `scripts/apply-patent-snr-architecture.mjs` | 信噪比架构母案 + 振动方向 + 独立审计入库（幂等，`PAT-MAP-006`） |
| `scripts/apply-patent-prior-use-rule.mjs` | 使用公开＝现有技术硬规则（幂等，`PAT-RULE-006`） |
| `scripts/apply-patent-filing-strategy.mjs` | 母案退役、四组独立申请、单一性硬规则（幂等，`PAT-BATCH-002`） |
| `PAT-INDEX-001` | **专利库唯一入口**，先读它再读别的卡 |
| `scripts/lib/patent-store.mjs` | 专利库读写与校验的唯一入口，入库脚本与测试共用 |
| `scripts/_template-new-batch.mjs` | 新思路入库模板，复制改内容即可 |
| `patent-drafts/新思路入库流程.md` | 新思路进库六步流程（`PAT-RULE-008`） |
| `scripts/check-served-ui.mjs` | 校验服务跑的是不是最新界面产物；改完 `src/` 必跑 |
| `patent-drafts/专利整合方案-v4.md` | **对外交付件**，含全部先案与红灯清单（`PAT-MAP-007`） |
| `patent-drafts/信噪比架构.md` | 技术总图，给人看的方案菜单 |
| `patent-drafts/真实技术保护.md` | 上一版，仍有效，作为消杀与低刺激的通道实现 |
| `scripts/apply-knowledge-layers.mjs` | 通识/公司分层 + 通识前沿卡（幂等） |
| `scripts/apply-patent-nsf-sanitation-seeds.mjs` | NSF 50/氯溴过闸：强制项勿主张，打开撰写候选⑦～⑪（幂等） |
| `scripts/apply-patent-codex-review.mjs` | Codex独立评审过闸：点名前案入库，沉默失效收窄，打开⑫～⑮（幂等） |
| `scripts/import-float-training.mjs` | 漂浮培训大纲 71 条内训卡（幂等，全部 internalOnly） |
| `scripts/import-training-supplements.mjs` | 好转反应/适应症/禁忌症/产品手册补训（幂等，禁忌与手册另写运营卡） |
| `scripts/import-vagus-three-reports.mjs` | 迷走机制/综合干预专业版/VNS手段地图（幂等，直接批准） |
| `scripts/import-atom-library.mjs` | combined.md 内部原子库 ~1300 条主题合并为 20 条仅内训卡（幂等） |
| `scripts/import-therapy-os.mjs` | 漂浮疗法说明.pdf 五维叙事脊柱 13 条仅内训卡（幂等） |
| `scripts/import-nsf-standards-qa.mjs` | 标准五问拆为 KP-WEB-013~020（幂等，通识，直接批准） |
| `docs/漂浮舱卫生安全标准五问.md` | NSF CCS-12804 / 周转率 / 臭氧 / ASTM F462 / ASME A112.19.17 问答底稿 |
| `docs/双通道微振-产品研发方案.md` | **产品研发完整版**（非专利）：上篇双通道微振 + 下篇行业壳体传声拆解 |
| `docs/漂浮方舟_双通道微振_产品研发方案.docx` | 同上 Word（含 5 张图） |
| `scripts/apply-patent-dual-path-vagus.mjs` | 双通道迷走主张检索入库（幂等，`PAT-IDEA-060` 已打掉） |
| `patent-drafts/双通道体头振动-检索评估.md` | 舱壁+骨传导双频激活迷走：检索评估（不能写） |
| `scripts/import-patent-landscape.mjs` | 四簇专利全景矩阵主题合并为 PAT-* 仅内部卡（幂等，独立 JSON；已入库后勿重跑） |
| `scripts/apply-patent-six-modules.mjs` | 重构版：四簇升六簇、两母案、不设母案3（幂等） |
| `scripts/import-patent-drafting-kit.mjs` | 母案A交底书撰写包 PAT-WRITE-001~006（幂等，给非工程背景的人用） |
| `scripts/import-patent-gas-safety-prior-art.mjs` | A4方向中国前案 PAT-PRI-013~021（幂等） |
| `scripts/import-patent-novelty-rule.mjs` | 绝对新颖性卡 PAT-RULE-002 + 国际前案 PAT-PRI-022~025 + PAT-DRAFT-A4（幂等） |
| `patent-drafts/交底书-母案A.md` | 可填空交底书模板，仅内部 |
| `patent-drafts/申请文件底稿-多气源安全互锁.md` | 第一件申请文件底稿 v0.2，仅内部 |
| `patent-drafts/专利布局整体报告-v3.md` | **整体报告 v3.0 源稿（当前生效总图）** |
| `patent-drafts/漂浮方舟_专利布局整体报告_v3.0.docx` | 同上 Word 版 |
| `scripts/apply-patent-report-v3.mjs` | v3.0 结论入库：PAT-MAP-003（幂等） |
| `patent-drafts/专利布局整体报告-v2.md` | 整体报告 v2.0 源稿（已被 v3 取代为生效总图） |
| `patent-drafts/外部AI评审任务书.md` | 给第三方 AI/顾问独立评审的自包含任务书（＋Word 版） |
| `patent-drafts/漂浮方舟_专利布局整体报告_v2.0.docx` | 同上的 Word 版，给非技术同事改 |
| `scripts/apply-patent-report-v2.mjs` | v2.0 结论入库：去盐测试、母案B收窄、取消20件（幂等） |
| `scripts/apply-patent-green-angle-search.mjs` | 三个绿灯角度补检索：①打掉、③重定位、⑤先降黄（幂等） |
| `scripts/apply-patent-angle5-dosing-search.mjs` | 角度⑤配液结晶检索：独立立案打掉，冷管结晶并入母案A（幂等） |
| `scripts/apply-patent-ext-review-triage.mjs` | 第三方整合版过闸结论 PAT-EXT-001 + 前案 039/040（幂等） |
| `scripts/md-to-docx.mjs` | Markdown 报告转 Word（依赖 python-docx） |
| `patent-drafts/有效技术方案.md` | **给人看的有效方案**（人群舱/疗法/运营） |
| `scripts/apply-patent-pop-schemes.mjs` | 同上入库 PAT-MAP-004 等（幂等） |
| `data/patents.json` | **专利库**，与知识点总库分开，不进 /open |
| `data/patent-sources.json` | 专利库来源记录 |
| `/patents` | 专利库页面（不进 `/open`）。生产站：https://company-knowledge-base-nine.vercel.app/patents |
| `scripts/test-patent-library.mjs` | 专利库隔离回归测试 |
| `scripts/export-public-site.mjs` | 生成 GitHub Pages 静态站（需管理员开通 Pages） |
| `/open` | Vercel 上的公开只读 HTML，不含内训 |
| `scripts/test-knowledge-layers.mjs` | 分层与培训隔离回归测试 |
| `scripts/process-split-queue.mjs` | 查看待拆分队列 |
| `src/app/api/upload/route.ts` | 网页上传逻辑 |
| `src/lib/storage.ts` | JSON 读写、deleteSourceFile |
| `.cursor/environment.json` | Cloud 环境自动 build + keep-alive |

**检索纪律：** 中国采绝对新颖性，检索必须中外并行且含非专利公开（IEC/GB/手册/规范）。判断标准是「有没有公开」不是「有没有授权」。详见 `PAT-RULE-002`。

**立项闸门：** 任何候选发明点先做**去环境测试**——逐个拿掉六条环境指纹（E1 高盐 / E2 中性浮力 / E3 感官剥夺 / E4 热中性浸液 / E5 长时程静止 / E6 密闭门锁），六条全拿掉都成立就不要立案。详见 `PAT-RULE-003`。

**客体边界：** 疾病诊断治疗方法与科学发现不授权，**但装置可以**；两用途方法须声明非治疗目的。详见 `PAT-RULE-004`。

## 常用命令

```bash
npm run build && npm run serve          # 生产模式 + 守护进程，端口 43123
node scripts/process-split-queue.mjs    # 看待拆分文件
curl http://127.0.0.1:43123/api/health # 健康检查
node scripts/check-served-ui.mjs      # 改完 src/ 后：确认服务不是旧编译产物
```

## 数据变更后必做

1. `git add data/` → commit → push
2. 更新 `PROJECT.md` 的「当前库状态」和「变更记录」

## 交付偏好（用户明确要求）

- **不要录制或提供演示视频。** 用文字说明、测试输出、必要时截图即可（2026-09-04 用户明确「以后都不要」）

## 禁止

- 重建项目 / 换框架
- 覆盖已有知识点（除非用户要求）
- 重复 import 已入库文件
- 未经确认删除 sources 或 knowledge points
