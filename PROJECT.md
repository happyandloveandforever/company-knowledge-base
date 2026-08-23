# 公司知识库 — 固定协作文档

> **换对话？IT 小白请看 → [`START-HERE.md`](./START-HERE.md)（3 步复制粘贴即可）**

> **这是本项目的「单一事实来源」。**  
> 换对话、换 Agent、隔几天再来，**先读这个文件**，即可接着干，不用从头解释。

**仓库：** https://origin.cursor.com/git/clark-gonzalez/tmp-8ece63bc7e599628  
**网页：** `http://127.0.0.1:43123`  
**Agent 快速入口：** [`AGENTS.md`](./AGENTS.md)  
**Cursor 自动规则：** [`.cursor/rules/knowledge-base.mdc`](./.cursor/rules/knowledge-base.mdc)

---

## 〇、代码仓库与交接（先看这里）

### 代码已经在哪？

| 项目 | 说明 |
|------|------|
| **当前托管** | [Cursor Origin（免费）](https://origin.cursor.com/git/clark-gonzalez/tmp-8ece63bc7e599628) |
| **分支** | `main` |
| **包含** | 全部 Next.js 代码 + `data/knowledge-points.json`（109 条）+ `data/sources.json` |
| **不包含** | `uploads/` 原始 PDF、`node_modules/`、`.env` |

每次 Agent 改完代码或入库，都会 **commit + push 到这个仓库**。换对话不会丢代码和数据。

### 新对话如何接上代码？

**方式 A — 新对话 + Clone 同一仓库（正确做法）**

Cursor 里 **New Agent = New Chat**，创建时没有填 URL 的地方。  
要新对话且保留全部工作：

1. New Chat 空白页 → **Use Existing → Clone Repository**
2. 粘贴：`https://origin.cursor.com/git/clark-gonzalez/tmp-8ece63bc7e599628`
3. 新对话第一句：读 `CONTEXT-HANDOFF.md`，不要重建项目

❌ 错误：以为「继续在本对话里聊」= 新对话（上下文仍会满）  
❌ 错误：在聊天消息里贴 URL（不会连接仓库）

**方式 B — 本地 clone 到电脑**

```bash
git clone https://origin.cursor.com/git/clark-gonzalez/tmp-8ece63bc7e599628.git company-knowledge-base
cd company-knowledge-base
npm install
npm run build
npm run serve    # http://localhost:43123
```

**方式 C — 镜像到 GitHub（推荐：网上无限制调取）**

推送到 GitHub 后，**全世界任何地方**都能 clone、浏览、程序化读取，不依赖 Cursor 会话。

1. 在 GitHub 新建仓库 `company-knowledge-base`（空仓库）  
   - **公开仓库**：任何人可 clone；JSON 可用 Raw 链接直接调取（见下）  
   - **私有仓库**：仅你和你邀请的人可访问（更安全）

2. 添加 remote 并推送：

```bash
git remote add github https://github.com/你的用户名/company-knowledge-base.git
git push -u github main
```

3. 以后每次入库：`git push origin main && git push github main`

**GitHub 上无限制调取数据（公开仓库）：**

```text
# 全部知识点 JSON（浏览器或程序直接 GET）
https://raw.githubusercontent.com/你的用户名/company-knowledge-base/main/data/knowledge-points.json

# 来源记录
https://raw.githubusercontent.com/你的用户名/company-knowledge-base/main/data/sources.json

# HTML 总库（需在本地或部署后生成；或从网页下载后上传到 GitHub Releases）
```

**方式 D — 部署在线网页（随时随地打开总库 UI）**

| 平台 | 免费 | 上传/编辑 | 说明 |
|------|------|-----------|------|
| **Vercel** | ✅ | ❌ 只读* | 连 GitHub 自动部署，适合浏览/搜索/导出 |
| **Railway / Render** | 有限免费 | ✅ | 有持久磁盘，可完整运行（上传+编辑） |
| **本地 npm run serve** | ✅ | ✅ | 仅本机或 Cloud Agent Preview |

\* Vercel 无持久磁盘，网页上的写入重启后丢失；**编辑仍通过 Cursor Agent → Git push**，Vercel 自动重新部署。

Vercel 快速部署（GitHub 镜像完成后）：
1. 登录 [vercel.com](https://vercel.com) → Import GitHub 仓库  
2. Framework 选 Next.js，Build：`npm run build`，Output 默认  
3. 部署完成后获得 `https://xxx.vercel.app`，`/library` 随时访问  

| 平台 | 费用 | 适合 |
|------|------|------|
| **Cursor Origin** | 免费（已有） | Cloud Agent 编辑 + 入库 |
| **GitHub 公开** | 免费 | **代码+JSON 无限制调取**、API 集成 |
| **GitHub 私有** | 免费 | 备份、需登录访问 |
| **Vercel** | 免费 | 在线浏览总库（只读） |
| **Gitee** | 免费 | 国内 clone 更快 |

### 代码交接清单（给新 Agent）

```
仓库：origin.cursor.com/git/clark-gonzalez/tmp-8ece63bc7e599628
分支：main
先读：PROJECT.md → AGENTS.md → data/sources.json → data/knowledge-points.json
禁止：重建项目、覆盖已有知识点
```

---

## 一、项目目标

把公司历年 PPT、PDF、Word 拆成**可复用的结构化知识点**，建立总库，按需选题编排，生成 PPT、培训资料等。

---

## 二、多对话协作方式（核心）

你可以开**无数个新对话**，只要都指向**同一个 Git 仓库**，知识库就不会丢。

```
┌─────────────┐     上传文件      ┌──────────────────┐
│  你（用户）  │ ───────────────→ │  Web / 对话附件   │
└─────────────┘                   └────────┬─────────┘
                                           │
                                           ▼
                              ┌────────────────────────┐
                              │  Cursor Claude 精细拆分  │
                              │  （对话里说一声即可）     │
                              └────────┬───────────────┘
                                           │
                                           ▼
                              ┌────────────────────────┐
                              │ data/knowledge-points   │
                              │ .json  +  Git push      │  ← 永久保存
                              └────────────────────────┘
```

### 每个新对话怎么开始

对 Agent 说：

> 请先读 PROJECT.md 和 AGENTS.md，然后继续帮我丰富知识库。

或直接说具体任务，例如：

- 「处理拆分队列」
- 「帮我 Claude 精细拆 xxx.pdf」
- 「审核杨浦财务的待审知识点」

### 拆分方式（默认 = Cursor Claude，无需 API Key）

| 步骤 | 谁 | 做什么 |
|------|-----|--------|
| 1 | 你 | 网页 `/upload` 上传，或把文件发到对话 |
| 2 | Agent | Claude 精细拆成知识点，写入 `data/knowledge-points.json` |
| 3 | Agent | 更新 `data/sources.json`，**commit + push** |
| 4 | 你 | 在 `/library` 审核、编辑、批准 |

`ANTHROPIC_API_KEY` **只是可选**的网页自动拆分，不是必须。

---

## 三、当前库状态

> **最后更新：** 2026-08-22（由 Agent 维护，每次入库后更新此节）

| 指标 | 数值 |
|------|------|
| 知识点总数 | **435**（293 `approved` + 142 `draft`） |
| 已导入文件 | **11** |
| 待 Claude 拆分队列 | 0 |

### 已入库文件

| 文件 | 来源 ID | 知识点 ID 范围 | 条数 | 状态 | 拆分方式 |
|------|---------|----------------|------|------|----------|
| 漂浮方舟_杨浦区财务.pdf | SRC-FAF-YANGPU | KP-FAF-001 ~ 054 | 54 | done，已批准 | claude-agent |
| B端定稿.pdf | SRC-B2B-YILING | KP-B2B-001 ~ 050 | 50 | done，已批准 | claude-agent |
| （已压缩）漂浮方舟 · 品牌画册.pdf | SRC-BRAND-BROCHURE | KP-BRAND-*（缺002） | 44 | done，多数已批准 | claude-agent |
| 方舟机理.pdf | SRC-MECH-JILI | KP-MECH-001 ~ 013 | 13 | done，已批准 | claude-agent |
| 漂浮方舟_v7.pdf | SRC-FAF-V7 | KP-V7-001 ~ 029 | 29 | done，已批准 | claude-agent |
| 增强背景 1–40.pdf | SRC-BG2-ENHANCE | KP-BG2-001 ~ 038 | 38 | done，已批准 | claude-agent |
| 增强背景 41–80.pdf | SRC-BG2-ENHANCE-B | KP-BG2-039 ~ 075 | 37 | done，已批准 | claude-agent |
| 冠军系列产品配置说明.pdf | SRC-CHAMPION-CFG | KP-CHAMP-001 ~ 023 | 23 | done，已批准 | claude-agent |
| 宣讲设计稿·构想与通识框架 v1 | SRC-SPEECH-CRAFT | KP-CRAFT-001 ~ 025 | 25 | done，**draft 待审** | 构想/通识设计 |
| 建立医用失重舱进行康复治疗的思考.docx | SRC-MED-WEIGHTLESS | KP-MEDW-001 ~ 014 | 14 | done，**draft 待审** | claude-agent |
| 100个论文原子.md | SRC-MEV-100-ATOMS | KP-MEV-001 ~ 103 | 103 | done，**draft 待审** | claude-agent |

### 待办

- [x] 品牌画册 / 方舟机理 / 漂浮方舟_v7 / **增强背景上下册** Claude 精细拆分
- [x] 审核批准机理 `KP-MECH-*`、v7 `KP-V7-*`、增强背景 `KP-BG2-*`（75）
- [x] 审核批准冠军系列 `KP-CHAMP-*`（23）
- [ ] 审核批准宣讲设计 `KP-CRAFT-*`（25）draft
- [ ] 老板锁死对外数字口径后替换 KP-CRAFT-023
- [ ] 审核 `KP-MEDW-*`（14）：可用「重力卸载谱系」，禁用病种疗效外推
- [ ] 审核 `KP-MEV-*`（103）：文献卡片，对外遵守红线 KP-MEV-102
- [ ] 上传优先书籍：睡眠/REST综述/体验经济/主动健康政策
- [ ] 继续导入更多历史材料


## 四、网页功能一览

| 路由 | 功能 |
|------|------|
| `/` | 首页：统计、待办、来源列表、分类分布 |
| `/library` | 知识总库：搜索/筛选/编辑/批准/删除 |
| `/library/conflicts` | 冲突组并排对比，设首选版本 |
| `/sources` | 来源管理：**红色「删除」按钮** |
| `/upload` | 多格式上传，默认 Cursor Claude 拆分说明 |
| `/compose` | 选题 + 演讲逻辑 → 大纲 / PPT |
| `/status` | 系统状态 |
| `/api/health` | 健康检查 |

---

## 五、代码结构（Agent 改代码时看这里）

```
/workspace/
├── PROJECT.md              ← 本文件（固定协作文档）
├── AGENTS.md               ← Agent 快速规则
├── .cursor/
│   ├── environment.json    ← Cloud 自动 build + keep-alive
│   └── rules/knowledge-base.mdc  ← 新对话自动加载
├── data/
│   ├── knowledge-points.json   ★ 核心资产，进 Git
│   ├── sources.json            ★ 来源记录，进 Git
│   ├── outlines.json
│   └── split-queue.json        运行时，待拆分队列
├── scripts/
│   ├── import-faf-yangpu.mjs       杨浦 PDF 拆分模板
│   ├── import-b2b-yiling.mjs       B端 PDF 拆分模板
│   ├── process-split-queue.mjs     查看待拆分队列
│   └── keep-alive-server.sh        服务守护进程
├── src/
│   ├── app/                    Next.js 页面和 API
│   ├── components/             UI 组件
│   └── lib/
│       ├── storage.ts          JSON 读写
│       ├── split-queue.ts      拆分队列
│       ├── ai-splitter.ts      AI 拆分（API 模式）
│       └── document-extractor.ts
└── uploads/                    原始文件（不进 Git，换环境会丢）
```

---

## 六、运行与 Preview

```bash
npm install
npm run build
npm run serve          # 或 PORT=43123 bash scripts/keep-alive-server.sh
```

- 端口：**43123**
- Preview 断开 → 点 Reconnect，或重启 `npm run serve`
- 健康检查：`curl http://127.0.0.1:43123/api/health`
- 守护进程日志：`/tmp/knowledge-base-server.log`（超过 5MB 自动轮转为 `.1`）
- 回归测试：`bash scripts/test-keep-alive.sh`（独立端口 43877，不影响线上服务）

### 守护进程为什么是单实例（改脚本前先看）

`.cursor/environment.json` 的 `start` 和 `terminals` 会**同时**拉起 `keep-alive-server.sh`。
脚本用 `flock` 保证只有一个实例真正持有端口，后到的实例自动转为 `tail -f` 跟随日志。

之前用 PID 文件做守卫（先检查后写入，非原子），两个实例都能通过，
落败的那个每 2 秒重启一次 `next start` 撞 `EADDRINUSE`，日志无限膨胀。
**不要把 flock 换回 PID 文件判断。**

---

## 七、数据持久化（重要）

| 路径 | 进 Git | 说明 |
|------|--------|------|
| `data/knowledge-points.json` | ✅ | **永久库**，必须 push |
| `data/sources.json` | ✅ | 导入记录 |
| `uploads/` | ❌ | 原始 PDF，仅本机；知识点正文已在 JSON |
| `data/analysis-cache.json` | ❌ | 自动重建 |

**换对话不会丢库**，只要 Git 里有 `knowledge-points.json`。  
误删可从 Git 历史恢复（如此前恢复 B端 50 条）。

---

## 八、Agent 常见任务

| 你说 | Agent 做 |
|------|----------|
| 处理拆分队列 | 读 `split-queue.json` → Claude 拆 → 写 JSON → push |
| 帮我 Claude 精细拆 xxx.pdf | 读文件 → 参考 `import-*.mjs` → 写知识点 |
| KP-xxx 改标题/合并 | PATCH `knowledge-points.json` |
| 删重复来源 | `DELETE /api/sources?id=...` 或改 JSON |
| Preview 打不开 | 先看 `/tmp/knowledge-base-server.log`，再重启 keep-alive，验证 `/api/health` |
| 改网页功能 | 改 `src/`，build，重启服务 |

---

## 九、硬性禁止（所有新对话遵守）

- ❌ 重建整个 Next.js 项目
- ❌ 覆盖/清空已有 `knowledge-points.json`（除非用户明确要求）
- ❌ 重复运行 import 脚本生成已入库文件
- ❌ 未经确认删除 done 状态的 sources

---

## 十、变更记录

| 日期 | 变更 |
|------|------|
| 2026-08-22 | 初始搭建：导入/总库/编排/PPT/冲突检测 |
| 2026-08-22 | Claude 导入：杨浦财务 54 条 + B端定稿 50 条 |
| 2026-08-22 | 新增来源管理、删除按钮、keep-alive 服务 |
| 2026-08-22 | 恢复误删的 B端 50 条（从 Git） |
| 2026-08-22 | 建立 PROJECT.md + AGENTS.md + Cursor rules 多对话协作机制 |
| 2026-08-22 | PROJECT.md 补充 GitHub 无限制调取 + Vercel 在线浏览方案 |
| 2026-08-22 | 修复 keep-alive 守护进程重复启动的 EADDRINUSE 空转（见下）；新增 `scripts/test-keep-alive.sh` 回归测试 |
| 2026-08-22 | 复核库状态：109 条全部已批准、冲突组 0、拆分队列空；剩余待办均需用户上传文件 |
| 2026-08-22 | Claude 精细拆分品牌画册：38页→45条（KP-BRAND-001~045），库总量 109→154 |
| 2026-08-22 | 网页同步：品牌画册多条批准，删除 KP-BRAND-002（45→44） |
| 2026-08-22 | Claude 精细拆分方舟机理.pdf：4页→13条（KP-MECH-001~013），库总量→166 |
| 2026-08-22 | Claude 精细拆分漂浮方舟_v7.pdf：26页→29条（KP-V7-001~029），库总量→195 |
| 2026-08-22 | Claude 精细拆分增强背景 1–40：40页→38条（KP-BG2-001~038），库总量→233 |
| 2026-08-22 | Claude 精细拆分增强背景 41–80：40页→37条（KP-BG2-039~075），库总量→270 |
| 2026-08-22 | 网页同步：批准 v7 全部 29 条 |
| 2026-08-22 | 批准增强背景全部 75 条（KP-BG2-001~075）；库内 draft=0、全部 approved |
| 2026-08-22 | Claude 精细拆分冠军系列产品配置说明.pdf：15页→23条（KP-CHAMP-001~023），库总量→293 |
| 2026-08-22 | 批准冠军系列全部 23 条（KP-CHAMP-001~023）；库内 draft=0、全部 approved |
| 2026-08-22 | 为北京化工集团初次交流编排 PPT（13页，知识库驱动，方向对齐口径） |
| 2026-08-22 | 北京化工集团 PPT 国际视野版（14页，深入浅出/能力辉煌，弱化地域） |
| 2026-08-23 | 宣讲补强 v1：构想+通识+讲法 25 条（KP-CRAFT-001~025），库总量→318 |
| 2026-08-23 | Claude 精细拆分《建立医用失重舱进行康复治疗的思考》：14条（KP-MEDW），并写明与漂浮REST边界，库总量→332 |
| 2026-08-23 | 入库《100个论文原子》：103条（KP-MEV-001~103，含用法/红线），库总量→435 |


---

## 十一、你可以直接说

- 「先读 PROJECT.md，然后处理拆分队列」
- 「上传了品牌画册，帮我 Claude 精细拆」
- 「把 B端和一龄相关的知识点全部批准」
- 「用已批准的知识点，给销售做 90 分钟培训大纲」
- 「修复 upload 页 xxx 问题」

---

**下次换对话，把这句话贴进去就行：**

> 请先阅读仓库里的 PROJECT.md 和 AGENTS.md，了解公司知识库项目当前状态，然后继续帮我 [你的具体任务]。
