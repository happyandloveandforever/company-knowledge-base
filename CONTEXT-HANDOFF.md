# Context Handoff — Read This in a NEW Chat

> **For the human:** When this chat hits the context limit, start a NEW chat and connect to the SAME git repo below. You do NOT need this chat's memory — everything important is in files + git.

---

## The confusion (cleared up)

| What you have | What it is |
|---------------|------------|
| **This long chat** | Temporary memory — will hit context limit |
| **Git repository** | Permanent storage — code + 109 knowledge points |
| **New chat** | Fresh memory — must connect to same git repo |

**You are correct:** Cursor does NOT let you "upgrade this chat to a project."  
**The fix:** New chat + **Clone the same repository** = fresh context + all your work.

---

## How to start a NEW chat with ALL your work

### Step 1 — Open blank New Chat (File → New Agent / New Chat, same thing)

### Step 2 — Connect the repo (NOT by pasting URL in chat)

⚠️ **Cursor 的 Clone Repository 界面不支持 `origin.cursor.com` 地址**  
（按钮不会变蓝、点了没反应 — 这是 Cursor 的限制，不是你看错了）

**可行方案 A — 用 GitHub（推荐，Clone 界面认这个）：**

1. 左下角点 **Connect GitHub**
2. 在 GitHub 新建空仓库 `company-knowledge-base`
3. 告诉 Agent 你的 GitHub 用户名，让它 push 上去
4. New Chat → Clone Repository → 粘贴：
   `https://github.com/你的用户名/company-knowledge-base.git`
5. Clone 按钮会变蓝，能用了

**可行方案 B — 回到已有 Cloud Agent（不用 Clone）：**

1. 左侧 **Repositories** 点 **Company knowledge base system**
2. 在同一个 Agent 里发新消息（不要 File → New Chat）
3. 第一句话读 `CONTEXT-HANDOFF.md`

~~旧步骤（Origin URL Clone — 在 Cursor UI 里不工作）：~~

### Step 3 — First message in the new chat

```
Read CONTEXT-HANDOFF.md, START-HERE.md, and PROJECT.md first.
Do NOT rebuild the project. data/knowledge-points.json has 361 points (352 approved + 9 draft).
Do NOT re-run import-mev-atoms.mjs to recreate 100 paper atoms.
Continue the company knowledge base work.
```

---

## What's saved (as of last update)

| Item | Status |
|------|--------|
| Knowledge points | **361**（352 approved + 9 draft） |
| Sources | 既有 + WEB + SOP/YFOP/MEDF；MEV 已主题合并 |
| Web app | Next.js, port 43123 |
| Split mode | Cursor Claude in chat（构想/通识也可直接写入） |
| Pending | 审核剩余 draft；锁数字与水温；补真实案例 |

---

## Files the new agent MUST read

1. `CONTEXT-HANDOFF.md` (this file)
2. `START-HERE.md`
3. `PROJECT.md`
4. `data/knowledge-points.json`
5. `data/sources.json`

---

## DO NOT

- Rebuild Next.js from scratch
- Delete or overwrite knowledge-points.json
- Re-import 杨浦 or B端 (already in git)
- Assume empty workspace means data is lost — clone the repo first

---

## GitHub 仓库（Clone 用这个 ✅）

```
https://github.com/happyandloveandforever/company-knowledge-base.git
```

New Chat → Clone Repository → 粘贴上面地址 → Clone 按钮会变蓝。

---
