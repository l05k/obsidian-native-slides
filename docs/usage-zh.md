# 使用指南

[English](usage.md) | **简体中文**

Native Slides 的完整用户指南。[README](../README-zh.md) 只有简短的导览，细节都在本页。

## Deck 与 `deck` 属性

deck 是一串笔记组成的链。只有一个保留的 frontmatter 属性 **`deck`**，至多放一个 markdown 链接：下一张。最后一页放一个空列表。

```yaml
# 一张幻灯片：一个链接 = 下一张
deck: ["[[slide-2]]"]
# 最后一页：没有链接
deck: []
```

- **页号自动计算**：从链头起沿链编号，从 1 开始。链头是第 1 页，无需 `page-number` 属性。
- YAML 里的链接要**加引号**。不加引号的 `[[...]]` 会被解析成嵌套数组，插件能兼容，但加引号才是规范写法。
- 链不能有环。某条链接失效只会终止（或排除）该链。

## Slides 模式

Slides 模式是对一张幻灯片的沉浸式、可编辑的卡片视图（"一屏一卡"），仅作用于 deck 笔记。

- **进入与退出**：用 **Toggle Slides Mode**（`Mod+Shift+E`）。退出时还原进入前的视图（Source、Live Preview 或 Reading）。
- **隐藏的内容**：丝带、左右侧边栏、tab 栏，以及核心插件 Backlinks 的文档内面板。
- **卡片**居中，宽 80vw，最宽不超过编辑区，因此不会溢出，并随主题自适应。外观可从**六套样式模板**中选择：_Lecture (jyy)_（默认）、_虚线边框_、_纸片卡片_、_极简_、_强调边_、_磨砂玻璃_。每套模板同时重绘卡片与 slides 栏。
- **卡片标题**：默认隐藏文件名。**Slides title** 设置可以选择显示任意 frontmatter 属性，或 `filename`，作为标题。filename 标题可直接在卡片上编辑（点击后输入，会重命名笔记，与原生 inline title 一致）；属性类标题在卡片上只读，请在属性面板中修改属性。
- **单屏**：编辑器裁切到单屏、不滚动，并且始终从笔记开头开始。
- **原生模式保持不动**：Source 模式、默认 Live Preview 与阅读视图保持 Obsidian 的行为，不隐藏状态栏、不加 slides 栏、不全屏、不改样式。Slides 模式是插件的唯一界面，因此可与其它也会修改阅读视图的插件和平共处。

## Slides 栏

Slides 模式底部的栏显示已配置的属性、◀ ▶ 按钮与页号。

- **Bar properties**（设置 → Bar properties）：逗号分隔的列表，如 `series, level, date`。每个值占一个等宽列，列之间的分隔条可拖拽调整宽度（宽度会保存）。留空表示没有属性列，缺失的属性会被静默跳过。
- **翻页**：用 ◀ ▶，或用 **Previous Page** / **Next Page**（`Mod+Shift+←/→`，可在 设置 → 快捷键 中重新绑定）。在原生模式下按下会先进入 Slides 模式。两个箭头始终显示，无法移动的那一个为浅灰色禁用态。
- **断链**：`deck` 链接指向不存在的笔记时，slides 栏显示 ⚠ 警告标签。

## 创建幻灯片

- **Create Next Slide**（仅 deck 笔记，`Mod+Shift+N`）：在当前笔记之后创建新幻灯片，命名为 `<当前名>-next`（重名自动追加 `-2`、`-3`），自动改写 `deck` 链接并打开新笔记。若当前笔记的 `deck` 链接指向不存在的笔记，则直接创建那个声明的笔记，同时消除 ⚠ 警告。
- **Create New Slide**（不属于任何 deck 的笔记）：开启一套全新 deck。新建一个笔记（`untitled-slides`，重名自动追加序号）作为第一页，frontmatter 为 `deck: []`，执行命令时所在的笔记保持原样。空白标签页也能用。之后用 Create Next Slide 继续加页。
- **Initialize Slides with This Note**（不属于任何 deck 的笔记）：把当前笔记提升为一套新 deck 的第一页。内容、标题与位置原样保留，仅在 frontmatter 写入 `deck: []`，随后自动进入 Slides 模式。适合先写长文、再想演示的场景。

## 演示

- **没有闪烁光标**：点一下 slides 栏即可让编辑器失焦，点回任意幻灯片内容即可继续编辑。
- **Toggle Mouse Pointer**（`Mod+Shift+M`）在整个窗口隐藏鼠标指针并顺带失焦。再执行一次恢复，退出 Slides 模式也会自动恢复。
- **Copy AI agent prompt**（仅在 Slides 模式下）把一份给 AI 助手用的说明复制到剪贴板：先介绍 deck 的机制（一屏一卡、`deck` 链、Create new/next slide），再给出实时布局的实测。内容包括真实文字区、一屏能放多少行正文以及每行多少拉丁字符或汉字、各元素类型的行高，以及"20 行正文"、"H1 + 19 个列表项"这类容量示例。文案跟随 Obsidian 界面语言。把它粘贴在你的需求之后，例如"基于某材料制作 slides 笔记"。

## 设置

设置 → Native Slides：样式模板、bar properties、Slides title、◀ ▶ 按钮、页号显示，以及：

- **自动进入 Slides 模式**（默认关）：打开 deck 笔记直接进入 Slides。
- **图片居中**（默认开）：图片居中渲染为卡片块，行高恰好等于图片本身。关闭则恢复 Obsidian 的行内行为，小图及其说明文字排在同一行。
- **Confirm slide deletion**（默认开）：见下文 Slides 面板。

Obsidian 1.13.0 及以上，各项设置都可被设置搜索索引。

## 命令

| 命令                             | 默认快捷键                    | 出现位置                           |
| -------------------------------- | ----------------------------- | ---------------------------------- |
| Toggle Slides Mode               | `Mod+Shift+E`                 | deck 笔记                          |
| Previous Page / Next Page        | `Mod+Shift+←` / `Mod+Shift+→` | deck 笔记                          |
| Create Next Slide                | `Mod+Shift+N`                 | deck 笔记                          |
| Create New Slide                 | 无                            | 不属于 deck 的笔记                 |
| Initialize Slides with This Note | 无                            | 不属于 deck 的笔记                 |
| Toggle Slides Bar                | 无                            | Slides 模式内                      |
| Toggle Mouse Pointer             | `Mod+Shift+M`                 | Slides 模式内                      |
| Show Slides Panel                | 无                            | 始终                               |
| Copy AI Agent Prompt             | 无                            | 始终（在 Slides 模式外会给出提示） |

所有快捷键都可在 设置 → 快捷键 中重新绑定。命令只在适用的地方出现在命令面板里，因此上一页/下一页的默认快捷键不会在普通笔记上占用编辑器的"选择到行首/行尾"按键。

## Slides 面板

面板是一个侧边栏视图，按链序列出当前笔记所属 deck 的全部幻灯片并带编号。运行 **Show Slides Panel** 命令，或点丝带的演示图标。点击任一条目即打开对应幻灯片。列表跟随当前活动笔记，并随 deck 编辑实时刷新。

**创建与删除**：右键条目弹出菜单，有 **Create next slide**（与命令一致，但相对被右键的那页，新笔记创建后不打开）和 **Delete slide**。删除会把笔记移入你配置的回收站（库内回收站或系统回收站，按 设置 → 文件与链接），并拼接链，前一页的 `deck` 链接直接跨过被删页。若删除的是当前打开的页，编辑区跳到最近的幸存页（优先下一张，其次前一张）。确认弹窗会列出将被删除的页名；勾选 **Don't ask again** 或关闭 **设置 → Confirm slide deletion** 可跳过确认。

**多选**：按 `Cmd/Ctrl` 逐张加入或移出选中（移出只能再次这样点它），按 `Shift` 做范围选择。Shift 范围始终包含你当前查看的那页，没有已选锚点时第一次 Shift+点击以当前页为起点。右键已选中的条目，菜单显示 **Delete N slides**。

**拖动条目移动幻灯片**：一条 2px 的强调色横线标出它将要落入的间隙（第一条之上、最后一条之下都算），被移动的条目变暗、一份副本跟随指针，按 `Escape` 取消。拖动选中的条目会让整块选中一起移动，未选中的幻灯片保持相对顺序；拖动未选中的条目只移动它自己并清空选中。右键菜单提供 **Move slide up** / **Move slide down**（多选时显示 **Move N slides up/down**），位于链首或链尾时置灰。

一次移动只重写下一条链接确实变了的那些幻灯片的 `deck` 属性，其余笔记的 frontmatter 一个字节都不动。面板、页号与 ◀ ▶ 翻页会立刻跟随新顺序。deck 高于侧边栏时面板可滚动，拖动到面板上下边缘时也会自动滚动。

需要注意两点：

- 移动会写 frontmatter，**`Cmd/Ctrl+Z` 无法撤销**，把幻灯片移回去即可。
- 移动需要面板可见，而 Slides 模式会隐藏两侧侧边栏，所以排序是编辑期操作。

## 示例库

想试用插件时，打开 [`example-vault/`](../example-vault/) 这个 Obsidian 示例库。它包含一套三页演示 deck：

1. `Welcome.md`：核心设计原则的极简介绍（不展示属性列）
2. `Make it yours.md`：设置项指引（frontmatter 携带 `series` / `level` / `date`，作为 Bar properties 演示）
3. `Grow the Deck.md`：最后一页（`deck: []`）

文件名与卡片上展示的标题一致。`demo-image.png` 供测试笔记使用。`example-vault/tests/` 下有 `typography-demo.md`（Markdown 全家桶）和五个 `typography-sample-*.md`，它们是仅开发版的 `Debug: Dump Typography Styles` 命令读取的固定采样笔记，请勿改名或删除。

库里的插件目录中，`main.js`、`manifest.json` 与 `styles.css` 是指向仓库根目录的符号链接，因此示例库始终运行当前构建。符号链接需要文件系统支持：macOS 与 Linux 开箱即用，Windows 需开启开发者模式。无法使用时，把这三个文件复制到 `example-vault/.obsidian/plugins/native-slides/` 即可。

## 已知限制

- **仅桌面端**，暂不支持移动端。
- Slides 模式仅作用于 deck 笔记，其它笔记保持完全原生。
- 属性来源是 **frontmatter**，正文中的 `key:: value` 内联属性不读取。
- `deck` 是保留属性名；`position` 键同样保留，且不在 slides 栏显示。
- 上一页/下一页的默认快捷键会在 deck 笔记打开时占用编辑模式下"选择到行首/行尾"的按键。不需要翻页的话，可在 设置 → 快捷键 中移除。
- 移动幻灯片时，被改写的 `deck` 链接一律写成裸的 `[[文件名]]` 形式（与 Create Next Slide、Delete slide 相同），因此需要改写的带路径或带别名的链接会失去原有形式。
