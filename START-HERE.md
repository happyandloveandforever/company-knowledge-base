# 换对话指南（IT 小白版）

> **就记住一件事：新对话必须连「同一个仓库」，不要点 New Project。**

---

## 为什么上次换对话失败了？

| 你做的 | 结果 |
|--------|------|
| 点了 **New Project（新项目）** | Cursor 建了一个**空仓库**，109 条知识点不在里面 |
| Agent 看到空仓库 | 以为项目丢了，从头重建 → 数据全没 |

**数据没丢**，还在下面这个仓库里：

```
https://origin.cursor.com/git/clark-gonzalez/tmp-8ece63bc7e599628
```

---

## 换对话正确做法（复制照着做）

### 第一步：开新对话时，不要点「New Project」

在 Cursor 里选下面**任意一种**：

**方法 A（最简单）**  
1. 打开 Cursor → 左侧 **Agents**  
2. 找到之前的 **Company knowledge base system**  
3. 点进去，直接发新消息继续聊  

**方法 B（新开一个 Agent，但连老仓库）**  
1. Cursor → **New Agent**（不是 New Project）  
2. 仓库地址填（整段复制）：

```
https://origin.cursor.com/git/clark-gonzalez/tmp-8ece63bc7e599628
```

3. 分支选 `main`

### 第二步：第一句话复制粘贴这个

```
请先读 START-HERE.md 和 PROJECT.md。
仓库里应该有 109 条知识点，不要重建项目，不要清空 data/knowledge-points.json。
然后继续帮我 [这里写你要做的事]。
```

例如：
- `…然后继续帮我 Claude 精细拆品牌画册.pdf`
- `…然后继续帮我审核待审知识点`

### 第三步：看 Agent 第一句回复对不对

**对的标志：**
- 提到「109 条知识点」或读了 `data/knowledge-points.json`
- 提到杨浦财务、B端定稿两个文件
- **没有**说「仓库是空的」「从头搭建」

**不对的标志：**
- 说「空仓库」「New Project」「重新 scaffold」
- 要删除或覆盖 `knowledge-points.json`

→ 不对就**立刻停止**，检查是不是连错仓库了。

---

## 你要做的 vs 不用做的

| ✅ 要做 | ❌ 不要做 |
|--------|----------|
| 连同一个 Git 仓库 | 点 New Project |
| 让 Agent 先读 START-HERE.md | 让 Agent 重建 Next.js 项目 |
| 在对话里上传文件、说「帮我拆」 | 自己改代码（除非你想学） |
| 有问题把截图发对话 | 自己删 data 文件夹 |

---

## 仓库里有什么（给 Agent 看的）

- **109 条知识点** → `data/knowledge-points.json`
- **2 个已导入文件** → 杨浦财务 PDF（54条）+ B端定稿 PDF（50条）
- **完整网页代码** → Next.js，端口 43123
- **协作说明** → `PROJECT.md`、`AGENTS.md`

---

## 常见问题

**Q：Preview 打不开？**  
A：对新 Agent 说「重启 dev 服务，端口 43123」

**Q：误删了知识点？**  
A：对新 Agent 说「从 Git 历史恢复 xxx」，数据在 Git 里有备份

**Q：想在网上随时看？**  
A：把 GitHub 用户名告诉 Agent，让它帮你推到 GitHub（见 PROJECT.md）

---

## 仓库地址（收藏这个）

```
https://origin.cursor.com/git/clark-gonzalez/tmp-8ece63bc7e599628
```

分支：`main`

---

**下次换对话，打开这个文件，按「第二步」复制那句话就行。**
