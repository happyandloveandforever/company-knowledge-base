# 换对话指南（IT 小白版 · 已按真实界面修正）

> **之前文档说「New Agent 创建时填 URL」是错的，抱歉。**  
> File → New Agent 和 New Chat 是同一个东西（Ctrl+N），都是空白页，**没有填仓库的地方**。

---

## 最重要：你现在这个项目已经在了

如果你能看到：
- 预览里 **109 条知识点**
- 底部显示 **main** 分支、**Cloud**
- 左侧有 **Company knowledge ba...**

→ **你已经在项目里**，不用新建，不用 Clone。

**上下文满了就在这个项目里继续聊，不要从 File 菜单开 New Agent。**

---

## 上下文满了怎么办（正确做法）

### ✅ 做法：留在当前项目里

1. 左侧点 **Company knowledge base system**（Company knowledge ba...）
2. 在**这个项目打开的页面里**直接发新消息  
   （不要 File → New Agent，不要左上角 New Chat 空白页）

### ❌ 不要这样做

| 操作 | 结果 |
|------|------|
| File → New Agent | 空白页，No Repo，109 条没了 |
| 左上角 New Chat（No Repo） | 同上 |
| Start from scratch | 同上 |
| Create repo | 空仓库 |

---

## 如果真的丢了项目（左侧找不到 Company knowledge base）

只有这时候才 Clone，**且不是在聊天里贴 URL**：

1. 打开 New Chat 空白页
2. 点 **Start from scratch** 下拉
3. **Use Existing...** → **Clone Repository**
4. 粘贴：

```
https://origin.cursor.com/git/clark-gonzalez/tmp-8ece63bc7e599628
```

5. 等克隆完，看到 `START-HERE.md` 和 `data/` 文件夹
6. 第一句话：

```
请先读 START-HERE.md，不要重建项目，继续帮我做知识库
```

---

## Cloud 显示 No projects？

正常。Cursor Origin 的仓库**不会**出现在 Cloud 列表里。  
用上面的 **Clone Repository** 连一次就行。

---

## 换对话粘贴语

```
请先读 START-HERE.md 和 PROJECT.md。
应有 109 条知识点，不要重建项目。
继续帮我 [你的任务]
```

---

## 数据在哪（永远在这）

```
https://origin.cursor.com/git/clark-gonzalez/tmp-8ece63bc7e599628
```

- 109 条知识点 → `data/knowledge-points.json`
- 协作说明 → 本文件 + `PROJECT.md`
- 换对话不会丢，只要连这个仓库

---

## 给 Agent 的纠正

- File → New Agent ≠ 带仓库的项目创建入口
- 不要在空 workspace 重建 Next.js
- 数据在 Git，先 `git pull` 或 Clone，再读 `data/knowledge-points.json`
