# 设计原则

[English](design.md) | **简体中文**

本项目的一切改动都遵循四条核心设计原则。任何改动若与其中一条冲突，都需要强有力的理由。

## 1. 对笔记内容零侵入

笔记在**源码模式**与**实时预览**下保持完全可读。插件从不改写、重排或在笔记内容中
注入任何标记——它只**读取**（通过 `metadataCache`）并**渲染 UI**（底部栏、CSS 覆盖）。
笔记内唯一的痕迹是 `deck` 这个 frontmatter 属性，它本身就是普通、可读的 YAML。

## 2. 对 properties 最小侵入

插件只新增**一个**保留属性 `deck`，别无其他。其余属性一律原样保留、仅作展示。
示例笔记也保持这一最小足迹（不带装饰性的 `tags`），因此使用本插件的成本就是
每篇笔记一个属性。

## 3. 不持久化配置以外的不必要内容

- 从笔记推导的一切（套件链、页号）都**即时计算**自 `metadataCache`，推导结果
  绝不落盘缓存。
- 唯一持久化的是**配置**（◀ ▶ 按钮、页号显示、隐藏底栏、自动进入 Slides 模式），经
  `loadData/saveData` 保存。
- 所需数据本身就是**笔记结构的一部分**——套件就是每页唯一的 next 链接串成的链；
  反向解析（找链头）按需扫描 frontmatter，不存在需要创建、同步或可能损坏的独立
  "套件索引"文件或数据库。
- 不做后台扫描、不落盘索引、不向 vault 写入任何数据。

## 4. 实现高效，但不提前优化

- 追求"够用的高效"而非过度优化：即时内存计算、事件驱动刷新、带守卫的
  500 ms 兜底定时器——满足真实使用即可，不做更多。
- 不提前优化：除非性能分析证明确有必要，否则不引入记忆化、缓存层或索引。
- 编码必须正规、符合开源规范与最佳实践：强类型、有文档、可读、优美；
  约定式提交；对 CI 友好。

## 权衡

- Slides 模式在其 Live Preview 下隐藏笔记内属性面板（纯 CSS），避免与底部栏重复——笔记文件本身从不改动。
- `deck` 链式解析每次刷新会读取链上所有笔记的 frontmatter；由于 `metadataCache`
  在内存中、且套件通常很小，这是可接受的。按原则 4，链缓存的记忆化方案被刻意
  推迟到性能分析证明确有必要之时。

## 工作原理

README 中功能背后的具体机制：

| 部分                      | 原理                                                                                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 隐藏状态栏（Slides 模式） | `body.native-slides-mode .status-bar { display: none }`——原生模式保留 Obsidian 默认状态栏                                                                                             |
| 沉浸布局（Slides 模式）   | `body.native-slides-mode` 隐藏丝带/侧边栏/tab 栏；slides 栏高度对齐 tab bar 实测高度（`--native-slides-tabbar-height`）                                                               |
| 隐藏笔记内属性面板        | `.markdown-source-view.mod-cm6.is-live-preview .metadata-container { display: none }`——属性改由 slides 栏展示                                                                         |
| 套件解析                  | `computeDeck()` 读取每页唯一的 next 链接 → 经 `deck` 反向索引回溯到链头 → 向前遍历整条链（有防环保护）→ 返回完整链 + 当前索引                                                         |
| 页号                      | 链中的位置，从 1 开始（链头 = 第 1 页）；不需要存储 `page-number`                                                                                                                     |
| PPT 翻页                  | `navigate()` 沿链步进，用 `workspace.openLinkText` 打开；从原生模式触发时会先进入 Slides 模式                                                                                         |
| Slides 进入/退出          | `enterSlides()` 记录当前视图状态并强制切到 Live Preview；`exitSlides()` 精确还原该视图状态（Source / Live Preview / Reading）                                                         |
| Create Next Slide         | `planCreateNext()`（纯逻辑核心）算出新文件名、新笔记的 `deck` 链接与改写方案；命令用 `vault.create` + `fileManager.processFrontMatter` 执行，并在编辑模式打开新笔记。仅 deck 笔记可用 |
| Create New Slide          | `planCreateNew()`（纯逻辑核心）为新 deck 第一页命名（`untitled-slides`，防重名）；在"新笔记默认位置"以 `deck: []` 创建，其余一概不动。空白标签页也可用                                |
| 设置                      | 声明式设置 API（Obsidian ≥ 1.13.0，可被设置搜索索引）+ 传统 `PluginSettingTab` 回退；`loadData/saveData` 持久化开关；快捷键走 Obsidian 原生命令系统                                   |
