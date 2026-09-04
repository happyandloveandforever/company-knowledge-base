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
| **包含** | 全部 Next.js 代码 + `data/knowledge-points.json`（以「当前库状态」为准，勿覆盖）+ `data/sources.json` |
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
# 给外部 AI 优先（HTML 正文，不走 GitHub 登录）
https://company-knowledge-base-nine.vercel.app/open/catalog
https://company-knowledge-base-nine.vercel.app/open
https://company-knowledge-base-nine.vercel.app/open/vagus
https://raw.githack.com/happyandloveandforever/company-knowledge-base/main/docs/catalog.html
https://raw.githack.com/happyandloveandforever/company-knowledge-base/main/docs/index.html
https://raw.githack.com/happyandloveandforever/company-knowledge-base/main/docs/vagus.html

# JSON
https://company-knowledge-base-nine.vercel.app/open/knowledge-external.json

# GitHub Pages（需管理员在 Settings → Pages 选择 GitHub Actions）
https://happyandloveandforever.github.io/company-knowledge-base/
```

**方式 D — 部署在线网页（随时随地打开总库 UI）**

已经开通：**Vercel `/open`**（随 main 更新，不含内训）以及仓库里的 `docs/*.html`（raw.githack）。GitHub Pages 需要仓库管理员在 Settings → Pages 选择 GitHub Actions；Actions 令牌没有权限自己开通。

可选再做一个 `*.vercel.app`（域名更不像 GitHub，部分 AI 更肯抓）：

1. 打开 https://vercel.com/signup  
2. 选 **Continue with GitHub**（同一个 GitHub 账号，大约 1 分钟）  
3. Import 仓库 `company-knowledge-base` → Deploy  
4. 得到 `https://xxxx.vercel.app` ，打开 `/library` 就是总库；给 AI 用 `/api/knowledge`

\* Vercel 无持久磁盘，网页上的写入重启后丢失；**编辑仍通过 Cursor Agent → Git push**，Vercel 会自动重新部署。  

| 平台 | 费用 | 适合 |
|------|------|------|
| **Cursor Origin** | 免费（已有） | Cloud Agent 编辑 + 入库 |
| **GitHub 公开** | 免费 | **代码+JSON 无限制调取**、API 集成 |
| **GitHub 私有** | 免费 | 备份、需登录访问 |
| **GitHub Pages** | 免费 | **公开网页+JSON**，给人和外部 AI 看 |
| **Vercel** | 免费 | 完整总库 UI（只读，需再点一次 GitHub 登录） |
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

> **最后更新：** 2026-09-04（由 Agent 维护，每次入库后更新此节）

| 指标 | 数值 |
|------|------|
| 知识点总数 | **590**（572 `approved` + 18 `draft`） |
| 通识层 `commons` | **160** 条：公开科学/政策/卫生/证据边界 + 迷走/VNS 通识 + NSF/ANSI 50 公开条款 |
| 公司自有层 `company` | **430** 条：产品、SOP、报价、案例、财务、内训教材、综合干预专业版、内部原子库、疗法叙事脊柱、NSF 工程/认证/专利空白 |
| 用途 `usage` | `pitch` 294 · `training` 156 · `ops` 61 · `both` 79 |
| **仅内训 `internalOnly`** | **129** 条（`KP-TRN-*` 94 + `KP-ATOM-*` 20 + `KP-RX-*` 13 + `KP-NSF-017/018` 2），编排 PPT 默认排除 |
| 已导入文件 | **29** |
| 待 Claude 拆分队列 | 0 |
| 结构判断 | 两层已切开；内训 129 条；迷走三套 56 条已批准；原子库零件箱 20 + 疗法五维脊柱 13 + NSF 漂浮舱标准 18。仍缺锁数字与真实案例 |

### 两层怎么用（B端资料）

| 层 | 给客户吗 | 典型内容 |
|----|----------|----------|
| **通识层** | 默认可以进资料包 | WHO/政策、REST文献、卫生标准、证据边界 |
| **公司自有层** | 按尽调/签约授权 | 产品参数、报价、SOP、具名案例、财务模型 |

培训**不是第三层**，是 `usage=training`。同一主题拆两条：培训卡（学习目标/误区/练习/考核）和汇报卡（主张/证据/边界/邀请）。科学培训进通识层，SOP/产品培训进公司层。

### 培训教材为什么单独隔离

`漂浮培训大纲.docx`（8章35节）已拆为 **`KP-TRN-001~071`**，后又补 **`KP-TRN-072~094`**（好转反应 / 适应症 / 禁忌症 / 产品手册），与其它来源刻意分开：

- **独立命名空间** `KP-TRN-*`，不与 SOP/产品/文献混号
- **`internalOnly: true`**：总库显示红色「仅内训 · 禁止外发」，`/compose` 编排默认排除，导出 HTML 也带红标
- **10 条留 `draft` 待老板裁定**：`TRN-007`（属相择时）、`020`（治愈反应）、`034`（气冲病灶）、`049`（气的物理化表述）、`052`（心理问题中医解释）、`057`（透皮吸收率表）、`060`（适应症清单）、`065`（好转反应/排毒）、`066`（漂浮处方体例）、`067`（19名抑郁疗效统计）
- **三处硬冲突已仲裁**（见 `KP-TRN-070`）：水温、透皮吸收、乳酸
- **总纲三卡**：`KP-TRN-069` 对外口径对照表、`KP-TRN-070` 冲突仲裁、`KP-TRN-071` 使用规则

原稿有四处只有标题没正文（漂浮师职业发展、设备使用指南、理疗部件、问题集），已记在 `KP-TRN-068`，需补。

### 内部原子库为什么也隔离

`combined.md` 是研发/内容实验室原子库导出稿，约 **1300** 条（M1–M11，L1/L2/L3）。已按论文原子同样原则**主题合并**为 **`KP-ATOM-001~020`**：

- **独立命名空间** `KP-ATOM-*`，不与 CIS 对外六模块混号
- **全部 `internalOnly` + `usage=training`**：不进 `/open`、编排默认排除
- **对外仍用 CIS A–F / SOP 六句**；M1–M11 只给研发和文案检索（见 `KP-ATOM-003`）
- **红线**见 `KP-ATOM-005`：排毒、经皮氢当给药、逆生长、AI 医生、疾病适应症一律不得外发
- **冲突仲裁**见 `KP-ATOM-019`：水温/透皮/治疗口径以 SOP、WEB、CIS 为首选
- **不要再逐条 import**（见 `KP-ATOM-020`）

### 疗法说明为什么也隔离

`漂浮疗法说明.pdf`（29页，2026-03 课题组）已主题合并为 **`KP-RX-001~013`**：

- **定位**：对人讲的五维体验脊柱（物理→生理→生化→心理→能量），用来串原子库零件
- **不是**第四套对外模块名；对外仍用 CIS A–F，门店仍用 SOP
- 全部 `internalOnly`：排毒/透析、赫氏必经、起效 95% 矩阵、超觉知/脉轮均冻结，不进 `/open`
- 水温 38–40℃、「切断 90% 感官」不得当锁定参数
- 与 ATOM 分工见 `KP-RX-013`：PDF 是脊柱，ATOM 是零件箱，CIS 是对外机架

### 已入库文件

| 文件 | 来源 ID | 知识点 ID 范围 | 条数 | 状态 | 拆分方式 |
|------|---------|----------------|------|------|----------|
| 漂浮方舟_杨浦区财务.pdf | SRC-FAF-YANGPU | KP-FAF-*（去重后） | 41 | done，已批准 | claude-agent |
| B端定稿.pdf | SRC-B2B-YILING | KP-B2B-*（去重后） | 34 | done，已批准 | claude-agent |
| （已压缩）漂浮方舟 · 品牌画册.pdf | SRC-BRAND-BROCHURE | KP-BRAND-*（缺002） | 44 | done，多数已批准 | claude-agent |
| 方舟机理.pdf | SRC-MECH-JILI | KP-MECH-001 ~ 013 | 13 | done，已批准 | claude-agent |
| 漂浮方舟_v7.pdf | SRC-FAF-V7 | KP-V7-*（去重后） | 27 | done，已批准 | claude-agent |
| 增强背景 1–40 / 41–80.pdf | SRC-BG2-ENHANCE(-B) | KP-BG2-*（去重后） | 39 | done，已批准 | claude-agent |
| 冠军系列产品配置说明.pdf | SRC-CHAMPION-CFG | KP-CHAMP-001 ~ 023 | 23 | done，已批准 | claude-agent |
| 宣讲设计稿·构想与通识框架 v1 | SRC-SPEECH-CRAFT | KP-CRAFT-001 ~ 025 | 25 | done，已批准 | 构想/通识设计 |
| 建立医用失重舱进行康复治疗的思考.docx | SRC-MED-WEIGHTLESS | KP-MEDW-001 ~ 014 | 14 | done，已批准 | claude-agent |
| 100个论文原子.md | SRC-MEV-100-ATOMS | KP-MEV-021 + 101–103 + 201–216 | 20 | done，已批准 | 主题合并 |
| 消杀.pptx | SRC-SANITIZE-PPT | KP-SAN-*（缺 015） | 14 | done，已批准 | claude-agent |
| 项目核心实验方案.docx | SRC-CORE-EXP | KP-EXP-*（缺 001） | 9 | done，已批准 | claude-agent |
| 公开文献与标准摘录（Web） | SRC-WEB-ENRICH | KP-WEB-001 ~ 012 | 12 | done，已批准 | 网上高价值摘录 |
| 优浮医疗联合运营执行方案.doc | SRC-YFOP-OPS | KP-YFOP-001 ~ 010 | 10 | done，余 4 条 draft | claude-agent |
| 医学漂浮诊疗方案.ppt | SRC-MEDF-PLAN | KP-MEDF-001 ~ 014 | 14 | done，已批准 | claude-agent |
| 漂浮方舟_SOP手册260519.pdf | SRC-SOP-260519 | KP-SOP-001 ~ 022 | 22 | done，已批准 | claude-agent |
| 通识层架构与前沿文献 | SRC-COMMONS-FRONTIER | KP-COM-001 ~ 018 | 18 | done，已批准 | 架构+公开文献 |
| 漂浮培训大纲.docx | SRC-FLOAT-TRAINING | KP-TRN-001 ~ 071 | 71 | done，余 10 条 draft | claude-agent |
| 6典型性漂浮好转反应.docx | SRC-TRN-REACTION | KP-TRN-072 ~ 077 + SOP-024 | 7 | 理论 3 条 draft；红旗出舱已批准 | claude-agent |
| 8漂浮一般适应症.docx | SRC-TRN-INDICATIONS | KP-TRN-078 ~ 079 | 2 | 纪律已批准；分系统清单 draft；不进运营 | claude-agent |
| 9漂浮禁忌症.docx | SRC-TRN-CONTRA | KP-TRN-080 ~ 085 + SOP-023/025 | 8 | 培训详版 + 门店拒客清单 | claude-agent |
| 产品使用手册.pdf | SRC-PRODUCT-MANUAL | KP-TRN-086 ~ 094 + KP-MAN-001 ~ 007 | 16 | 培训 + 运营各一份 | claude-agent |
| 漂浮方舟迷走神经作用机制研究报告.docx | SRC-VG-MECH | KP-VGMECH-001 ~ 022 | 22 | done，已批准 | claude-agent |
| 漂浮方舟综合干预体系方案_专业版.docx | SRC-CIS-PRO | KP-CIS-001 ~ 018 | 18 | done，已批准 | claude-agent |
| 迷走神经激活手段与前沿研究整合报告.docx | SRC-VNS-MAP | KP-VNSMAP-001 ~ 016 | 16 | done，已批准 | claude-agent |
| combined.md（内部原子库） | SRC-ATOM-LIB | KP-ATOM-001 ~ 020 | 20 | done，已批准，仅内训 | 主题合并（~1300→20） |
| 漂浮疗法说明.pdf | SRC-RX-THERAPY | KP-RX-001 ~ 013 | 13 | done，已批准，仅内训 | 主题合并（29页→13） |
| NSF_ANSI_50_漂浮舱标准汇总.docx | SRC-NSF-ANSI50 | KP-NSF-001 ~ 018 | 18 | done，已批准；017/018 仅内训 | claude-agent |

### 结构体检（2026-08-24）

| 层 | 现状 | 建议 |
|----|------|------|
| 通识层 | 已把文献/政策/卫生从「已批准大锅」里分开；补 WHO 2025、Atlas 2024、2025/2026 REST 综述 | 客户资料包先抽通识层；在研 NCT 无结果不进 PPT |
| 公司层 | SOP/报价/产品/案例仍在此层 | 数字未锁定继续用「合同/铭牌」口径 |
| 培训 vs 汇报 | `usage` 已分开；`KP-TRN-*` 94 + `KP-ATOM-*` 20 硬隔离；禁忌/手册另有 ops 卡 | 裁定剩余 draft；职业发展与问题集仍空 |
| 迷走/综合干预（2026-08-31） | VGMECH 四条间接通路 + 共振呼吸 4 周；CIS 展开六模块与三类产品线；VNSMAP 把 FDA/EHJ 与漂浮拆开 | 对外深讲用新卡；浅讲仍可用 V7-018/021 但须口头声明器械证据不是漂浮试验 |
| 内部原子库（2026-09-01） | M1–M11 / L1–L3 已主题合并 20 条；与 CIS A–F 对照写在 ATOM-003 | 对内写文案；对外禁止混报两套模块名；勿再逐条入库 |
| 疗法叙事脊柱（2026-09-02） | 五维一体已主题合并 13 条；概率矩阵与排毒叙事冻结 | 对内串体验层；对外仍用 CIS；勿把五维当第四套菜名 |
| NSF/ANSI 50（2026-09-04） | CCS-12804 + §28 拆 18 条；公开条款通识+both；工程公司+both/ops；专利空白仅内训 | 认证跟 NSF 卡；对客卫生勿说「NSF 禁止氯」（与 WEB-004/NAFTS 并存）；15 分钟三翻转是产品口径 |
| 已压缩 | 论文 103→20 主题卡；原子库 ~1300→20；跨稿 REST史/专家复读/证据墙/功效分条/DEMO 已删 | 对外用 `KP-WEB-010` + 主题卡；勿再跑 `import-mev-atoms.mjs` / 原子逐条 import |
| 过薄 | FAQ 仍空；真实具名案例仍空；公司一页纸 5；统一数字未锁 | **你必须提供**：机构/专利/C端锁定数字、可公开案例 |
| 冲突 | 乳酸；Feinstein 非 RCT；**院内「治疗/处方」vs SOP「不治病」**；SOP 水温 36±0.5 / 38℃ / 36.5–39.5 | 独立门店跟 SOP；医院共建跟 YFOP/MEDF；温度与 58%/2000 项须老板锁 |

### 待办

- [x] 品牌画册 / 方舟机理 / 漂浮方舟_v7 / **增强背景上下册** Claude 精细拆分
- [x] 审核批准机理 `KP-MECH-*`、v7 `KP-V7-*`、增强背景 `KP-BG2-*`（75）
- [x] 审核批准冠军系列 `KP-CHAMP-*`（23）
- [x] 审核批准宣讲设计 `KP-CRAFT-*`（25）
- [ ] 老板锁死对外数字口径后替换 KP-CRAFT-023
- [x] 审核 `KP-MEDW-*`（14）
- [x] 审核 `KP-MEV-*`；已主题合并为 20 条，对外仍遵守红线 KP-MEV-102
- [x] 审核 `KP-SAN-*`（现 14）与 `KP-EXP-*`（现 9）；乳酸与 N=5 仍勿当铁证
- [x] 审核网上补强卡 `KP-WEB-001~012`（Feinstein 纠偏、NSF 卫生、透皮镁、健康中国、证据金字塔）
- [x] 拆分优浮联合运营 / 医学诊疗 PPT / 开业 SOP（46 条 draft）
- [x] 审核开业 SOP 22 条
- [ ] 审核剩余 4 条 draft（YFOP-001/007/008/009）
- [x] 上传培训初稿，按 `usage=training` 拆分（71 条 KP-TRN，全部 internalOnly）
- [x] 补训好转反应 / 一般适应症 / 禁忌症 / 产品使用手册（TRN-072~094；禁忌与手册另写 SOP/MAN 运营卡）
- [x] 精细拆分迷走机制报告 / 综合干预专业版 / VNS 手段地图（56 条，已批准；FDA/EHJ 等不得外推为漂浮适应症）
- [x] combined.md 内部原子库主题合并为 KP-ATOM-001~020（仅内训，直接批准；不逐条入库）
- [x] 漂浮疗法说明.pdf 主题合并为 KP-RX-001~013（仅内训脊柱；95%/排毒/超觉知冻结）
- [x] 精细拆分 NSF/ANSI 50 漂浮舱标准汇总（18 条，公司库+培训 dual `usage=both`；专利 2 条仅内训）
- [ ] **裁定培训 draft**：原 10 条 + 新 072/073/074/079（排毒叙事、瞑眩、适应症病谱）
- [ ] 补培训仍缺：漂浮师职业发展、问题集（设备实操已由产品手册补；见 KP-TRN-068）
- [ ] 老板锁：对外数字 + SOP 水温 + pH 7.8 vs 7–7.5 + 孕周窗口 + 是否沿用优浮历史价
- [ ] 用户提供：可公开案例回访（SOP 已补水质/消杀/岗位；手册已补 400 维保）
- [ ] 上传优先书籍：睡眠/REST综述/体验经济
- [ ] 不要再导入与杨浦/一龄/品牌画册同主题的宣传 PDF


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
| `/open` | 公开只读 HTML（不含仅内训），给外部 AI 抓正文 |
| `/open/catalog` | 来源清单：总库已合并 590，可外发 461，仅内训 129 不收录 |
| `/open/vagus` | 迷走/综合干预专页（子集，不是总库） |
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
│   ├── import-vagus-three-reports.mjs  迷走机制+综合干预+VNS地图
│   ├── import-atom-library.mjs         内部原子库主题合并（仅内训）
│   ├── import-therapy-os.mjs           疗法说明五维脊柱（仅内训）
│   ├── import-nsf-ansi50.mjs           NSF/ANSI 50 漂浮舱标准
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
| 2026-08-23 | 批准全部 draft：宣讲25 + 失重舱14 + 论文原子103；库内 435 条全部 approved |
| 2026-08-23 | 入库消杀.pptx 15条 + 核心实验方案 10条（draft），库总量→460；标注乳酸冲突与小样本预实验 |
| 2026-08-23 | 网页同步：批准消杀/实验方案；用户删 SAN-015、EXP-001；approved=458 |
| 2026-08-23 | 网上补强 12 条（KP-WEB-001~012，draft）：Feinstein 非 RCT、Garland 2024 可行性 RCT、Choquette 口径、NSF/NAFTS 卫生、透皮镁限度、乳酸仲裁、REST 九通道、健康中国/主动健康、证据金字塔、库体检、卫生检查单；库总量→470 |
| 2026-08-23 | 批准全部 WEB 卡 KP-WEB-001~012；库内 470 条全部 approved，draft=0 |
| 2026-08-23 | 精细拆分优浮联合运营10 + 医学诊疗14 + 开业SOP22（draft）；库总量→516；标注院内诊疗 vs 独立门店冲突 |
| 2026-08-23 | 压缩过厚层：100论文原子→16主题卡；删除跨稿重复宣传与 DEMO；库 516→361 |
| 2026-08-23 | 北化第一次交流：给合伙人的 PPT 结构选型文件（推荐 A 初识对齐） |
| 2026-08-23 | 北化选型 v2「脊柱 + 插件」：主叙事固定 9 页，语言差异做成 P1–P5 插件（推荐脊柱 + P3） |
| 2026-08-23 | 北化初次交流对外成品稿 15 页：脊柱 + 插件 P1–P5 全开，数字标材料口径、含边界页 |
| 2026-08-23 | 北化投资联动版 15 页：主线改为心理健康赛道「重要且薄弱」+ 可持续性 + 可扩展；化工供应链只作一节简述，不以园区试点为落点 |
| 2026-08-23 | 北化主稿定为 17 页含 P6：在全插件版上仅追加「赛道」「投资联动」两页，脊柱与 P1–P5 逐页未改（已用文本比对校验） |
| 2026-08-24 | Vercel 只读部署：mkdir/写缓存失败不再打挂首页；分析缓存入库 |
| 2026-08-24 | 知识库两层：`layer=commons/company`，`usage=pitch/training/ops/both`；核准库中的公开科学/政策拆入通识层；新增 18 条 `KP-COM-*`（WHO 2025、Atlas 2024、2025/2026 REST 综述、培训vs汇报结构） |
| 2026-08-24 | 拆分《漂浮培训大纲》8章35节→71条 `KP-TRN-*`；新增 `internalOnly` 硬隔离（编排默认排除、红色禁止外发标）；10 条含适应症/处方/命理/疗效案例留 draft；库 379→450 |
| 2026-08-24 | 首页补培训入口：第三张「漂浮师培训教材」卡 + 按用途「培训」筛选，避免只显示通识/公司两层时找不到内训 |
| 2026-08-24 | 补训四份：好转反应、一般适应症、禁忌症、产品使用手册 → TRN-072~094（仅内训）；禁忌与手册另写 SOP-023~025、MAN-001~007；库 450→483 |
| 2026-08-31 | 精细拆分三份迷走/综合干预综述并直接批准：机制报告 22（KP-VGMECH）+ 综合干预专业版 18（KP-CIS，展开 V7-021~023）+ VNS 手段地图 16（KP-VNSMAP）；库 483→539。器械获批适应症均标注不得外推到漂浮舱 |
| 2026-08-31 | 公开只读站改为把正文写进 HTML（Pages），给只能抓网页的 AI 用；并自动开通 GitHub Pages |
| 2026-08-31 | 公开 HTML 提交到 `docs/`，用 raw.githack 给外部 AI 抓网页 |
| 2026-08-31 | Pages 部署失败：Actions 令牌不能创建站点。公开只读页同时走 Vercel `/open`；Pages 工作流在未开通时不再把 main 打红 |
| 2026-08-31 | 可外发页写清「总库已合并 539 / 本页 445 / 仅内训 94 不收录」并加来源清单 `/open/catalog`；Vercel `/library` 缓存未命中时不再全量相似扫描超时 |
| 2026-09-01 | combined.md 内部原子库 ~1300 条主题合并为 KP-ATOM-001~020（仅内训，已批准）；库 539→559。公开页仍 445，仅内训 114。首页内训入口改为教材+原子库分列 |
| 2026-09-02 | 漂浮疗法说明.pdf 主题合并为 KP-RX-001~013（仅内训脊柱）；库 559→572。公开页仍 445，仅内训 127。五维不替代 CIS |
| 2026-09-04 | NSF/ANSI 50 漂浮舱标准汇总精细拆 18 条（KP-NSF-001~018）；库 572→590。公开条款 6 条通识+both，工程/培训 dual both，专利空白 2 条仅内训。氯溴口径与 WEB-004 并存。筛选「培训/汇报」时带上 usage=both |


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
