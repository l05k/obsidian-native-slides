# 开发

[English](development.md) | **简体中文**

面向开发者的文档——构建插件、开发循环、在示例库中测试、仅开发版的调试工具，以及
`.agents/skills/` 里的 AI agent skills。用户向的 README 刻意保持为干净的发布页；插件作者
或贡献者需要的都在这里。

## 构建

插件用 TypeScript 编写。你不需要会 TS——用自然语言描述想改的功能即可，代码会更新并重新编译。
手动构建：

在仓库根目录执行：

```sh
npm ci             # 仅首次需要（下载 esbuild 等）
npm run build      # 编译 main.ts → main.js（开发版：含 debug 命令）
npm run build:release  # 发布版：压缩并移除 debug 命令
npm run check      # 可选：TypeScript 类型检查（tsc --noEmit）
npm run test       # 可选：vitest 单元测试
npm run lint       # 可选：ESLint
npm run format:check  # 可选：Prettier
```

## 开发循环（重建 + 重载）

先重建，再手动重载：

```sh
npm run dev        # 监听 main.ts，变更时自动重建 main.js
```

编辑 `main.ts` 后，在 Obsidian 里重载插件：按 `Cmd/Ctrl+P` 打开命令面板，搜索 **Reload app without saving** 并执行（该命令默认没有绑定快捷键）。或者，在 _设置 → 第三方插件_ 里关闭再开启 **Native Slides**。

## 在示例库中测试

**所有行为验证都在 `example-vault/` 里做 —— 绝不用其他库。** 它随仓库一起发布，插件目录里都是指向
仓库根目录的**软链接**（`main.js`、`manifest.json`、`styles.css`），因此永远跑的就是你刚构建的版本。
切勿让 agent、脚本或手工测试去碰存放真实笔记的库。

- **循环**：`npm run build`（改代码时 `npm run dev`）→ 在 Obsidian 里重载插件
  （`Cmd/Ctrl+P` → **Reload app without saving**）→ 验证。见上方「开发循环」。
- **临时笔记**：验证需要时在 `example-vault/` 里新建，用完删掉 —— 不要把测试文件留在库里。
  `Probe*.md` / `test.md` / `untitled-slides.md` 是维护者的草稿幻灯片，不要去动。
- **夹具**：`example-vault/tests/typography-*.md` 是仅开发版命令 `Debug: Dump Typography Styles`
  的采样夹具（`src/debug.ts` 硬编码了其中五个名字）—— 请勿改名或删除。演示套件是
  `Welcome.md` → `Make it yours.md` → `Grow the Deck.md`，README 的引导依赖这三个名字与
  `demo-image.png`。
- **配置扰动**：Obsidian 运行时会改写库里**被追踪**的配置（`appearance.json`、
  `community-plugins.json`、`core-plugins.json`）。切分支或开 PR 前用
  `git restore -- example-vault/.obsidian` 还原，之后再确认一次 `git status`。
- **驱动 App**（例如通过 CDP 的 `--remote-debugging-port=9222`）是允许的，而且往往是验证「手势类行为」
  的唯一手段 —— 见下方「通过 CDP 驱动运行中的 App」，它才是把脚本限制在 `example-vault/` 里的机制。

### 通过 CDP 驱动运行中的 App

单元测试够不到的行为（拖动、点击、菜单动作）要靠 CDP 验证，因为它驱动的是真实 App、跑的就是你刚构建
的版本。它同时带一个尖锐的边界，所以它配的是一个守卫，而不是一句裸的许可。

**调试端口是进程级的，因此可能同时暴露多个库。** `--remote-debugging-port` 是 Obsidian **进程**的
参数，而一个进程可以开多个窗口：在本机上，维护者自己的笔记库与 `example-vault/` 曾同时出现在 `:9222`
上。端点无法区分它们 —— 每个窗口都回答 `app://obsidian.md/index.html` —— 而窗口标题会本地化、会滞后，
所以标题匹配**不是**身份识别。这是**保密边界**，不只是写入边界：连上去就能读另一个窗口里的笔记。

**靠问 App 来识别目标，并且失败即停（fail closed）。**

```js
// App 自己的回答才是身份 —— 绝不用窗口标题
const basePath = await cdp.eval(`app.vault.adapter.getBasePath()`);
if (basePath !== EXPECTED_VAULT) throw new Error(`refusing to drive ${basePath}`);
```

`EXPECTED_VAULT` 就是本仓库的 `example-vault/`。`connect()` 会问遍端口上的每个 page target：匹配数为 0
说明库没打开；**匹配数 >1 说明身份有歧义 —— 停下来，不要挑一个。** 两种情况都中止。

**`scripts/vault-cdp.mjs` 做的就是这件事**，也是推荐的入口：除非恰好有一个窗口持有 `example-vault/`，
否则它拒绝连接；并在每次派发输入前重新校验该身份。它是一个小型库 + 一次性命令的 CLI：

```sh
node scripts/vault-cdp.mjs state      # 库路径、插件版本、当前笔记、解析出的套件
node scripts/vault-cdp.mjs reload     # 重载插件，加载新的 main.js
node scripts/vault-cdp.mjs eval 'app.workspace.getActiveFile()?.path'  # 在 App 里求值并打印
node scripts/vault-cdp.mjs order      # slides 面板列出的幻灯片标题
node scripts/vault-cdp.mjs rects      # 同样这些条目及其布局
node scripts/vault-cdp.mjs open "Check A"  # 在编辑器中打开一张笔记
node scripts/vault-cdp.mjs drag 3 40  # 按住第 3 条，拖到 y=40，松开
node scripts/vault-cdp.mjs create-deck "Check A" "Check B"
node scripts/vault-cdp.mjs delete-notes "Check A" "Check B"
```

多步验证写在 `import` 它的临时脚本里，并放在**仓库之外**（`/tmp/…`），这样任何「测试形状」的文件都不会
被提交：

```js
import { connect, sameArray } from "<repo>/scripts/vault-cdp.mjs";
const cdp = await connect();
await cdp.open("Check A");
const before = await cdp.order();
await cdp.drag(3, 40);
// 把第 3 条拖到最前面，它就会成为链首
const expected = [before[3], before[0], before[1], before[2]];
if (!sameArray(await cdp.order(), expected)) throw new Error("…");
```

**一次行为检查遵循的流程**——它的步骤、每步的完成标准，以及把检查留在这个库上的规则——在
[`.agents/skills/vault-cdp-testing/SKILL.md`](../.agents/skills/vault-cdp-testing/SKILL.md)；本节是它背后的机制。
其中三条规则之所以存在，是因为它们各自已经出错一次：

- **不盲派发输入**——侧边栏收起时每个面板条目的 rect 都是 `0×0`，于是「点第 1 条」变成了在编辑器里点
  `(0,0)`，改掉了一张演示笔记并在仓库根留下一个杂散文件；
- **断言之前先等 App 落定**——`openLinkText`、frontmatter 写入与 metadata 重建索引都是异步的，读得太早
  会读到只应用了一半的状态，于是**一次正确的拒绝看起来像 bug**；
- **环境限制不等于通过**——被遮挡的窗口会被 Chrome 节流：`requestAnimationFrame` 可能永不触发，
  Obsidian 的 `Menu` 可能根本不挂载 DOM，于是菜单不能按渲染出的条目断言，动画也观察不到
  （`Page.bringToFront` 在这里不足以把它抬起来）。改为断言 handler 与菜单项背后的动作，并在报告里写明
  哪些检查是这样做。

## Agent skills

`.agents/skills/` 是本仓库的 skill 之家，里面同时放着两类内容；因此在本仓库工作的任何 agent
（Pi、Claude Code、Codex、Copilot……）都可以用来拷问方案、测试先行地实现、评审分支、跑调试
循环或交接会话。它们就是普通的 Markdown 文件，归你所有、可以自由修改。

- **仓库自有的 skill**——`dev-workflow`（[Rule 1](../AGENTS.md) / [Rule 2](../AGENTS.md) / [Rule 4](../AGENTS.md) 的强制
  工作流）、`herdr-subagent`（Rule 2 所用的 Herdr 窗格/子代理操作手册）、`code-review-herdr`
  （本仓库对 vendored `code-review` 的 fork：两轴方法相同，但每条轴都在自己的 Herdr 窗格里
  运行——Pi 没有原生 subagent 工具，这正是它需要的——报告收齐后这些窗格会被关闭）与
  `vault-cdp-testing`（行为检查在运行中的 App 里遵循的流程，[Rule 3](../AGENTS.md)）。
  这四个是我们的：随意修改，且仍受 Prettier 约束（ESLint 会跳过整个 `.agents/skills/`）。
- **随仓库带入的 25 个**——来自 [mattpocock/skills](https://github.com/mattpocock/skills) 的
  `engineering` + `productivity`，即 [aihero.dev/skills](https://www.aihero.dev/skills) 列出的两套。
  实验性的 `in-progress` / `misc` skill 有意不装。vendored 的 `code-review` 保持上游原文
  （这样 `npx skills update` 仍可刷新它），而 **Rule 2 用的不是它**：真正跑的是
  `code-review-herdr`。上游有改动时请手工把修复搬进 fork。
- **规范位置**：`.agents/skills/<name>/SKILL.md`。共享规范目录的 agent（Pi、Amp、Codex、
  Copilot……）直接发现它；某个 agent 专属的目录（`.claude/skills`、`.cursor/skills`……）
  是指向它的**软链接**，绝不复制。这些目录是本地生成的 CLI 产物、已被 gitignore——
  已提交的 `.agents/skills/` 才是唯一来源。
- **锁文件是审计记录，不是版本锁定**——`skills-lock.json` 记录每个 skill 的来源仓库、
  路径与内容哈希。`npx skills update` / `npx skills experimental_install` 会在重新下载后
  **改写**这些哈希——因此上游变更会以 `skills-lock.json` 的 diff 呈现，而 `.agents/skills/`
  下的本地改动会被静默覆盖。由于没有记录 commit `ref`，重装会解析上游默认分支。
- **第三方内容不参与格式化**：`.prettierignore` 排除了 `.agents/skills/*`（并重新纳入那四个
  仓库自有的 skill）——切勿重新格式化带入的文件，这样以后更新仍然可 diff。Prettier 同时也会读取
  `.gitignore`，因此被它忽略的内容（本检出的本地草稿文件、Obsidian 的每机状态文件）同样会被
  `npm run format:check` 跳过。

在仓库根目录用 skills CLI 管理：

```sh
npx skills@latest list                                                    # 查看已安装
npx skills@latest add mattpocock/skills -a universal -y -s <skill-names>  # 安装 skill
npx skills@latest update                                                  # 按锁文件的来源刷新
```

`-a universal` 才是写入规范目录 `.agents/skills/` 的目标；像 `-a pi` 这样的单 agent 目标
会把 skill 复制到该 agent 自己的（已被 gitignore 的）目录 `.pi/skills/`。安装成功会输出
`→ ./.agents/skills/<name>`。

> **注意**：该目录由 CLI 管理。限定范围的 `npx skills remove`——尤其是 `remove --all`——
> 会连仓库自有的 `dev-workflow`、`herdr-subagent`、`code-review-herdr` 与 `vault-cdp-testing`
> 一起删掉。它们已提交进版本库，`git checkout -- .agents/skills` 可恢复，但切勿盲目执行这些命令。

`/setup-matt-pocock-skills` 会为本仓库记录 issue tracker、triage 标签与文档布局，写入
[`docs/agents/`](agents/)，供需要它们的 skill 使用；本仓库已经运行过，这三个文件与本文件
一起提交。`code-review-herdr` 读取 `docs/agents/issue-tracker.md` 以解析 Spec 轴，
triage 映射则位于 `docs/agents/triage-labels.md` 并由 `AGENTS.md` 指向，运行 `/triage`
时可随时查阅。直接编辑它们即可；只有在切换 tracker 或重新开始时才需再次运行该 skill。

## 排版测量工具（仅开发版）

排版测量工具以**仅开发版**命令的形式提供，发布构建中不包含。

- **开发构建**（`npm run build` / `npm run dev`）会注册 `Debug: Dump Typography Styles` 命令：在**编辑与阅读两种视图**各采样一次当前笔记、计算差异，并写入 vault 根目录的 `.native-slides-debug.json`（无需手动复制控制台输出）。在开启 Slides 模式的 deck 笔记上运行；`example-vault/` 里五个 `typography-sample-*.md` 是它的固定一页采样夹具——请勿改名或删除。
- **发布构建**（`npm run build:release`）会压缩 `main.js`，并通过 `--define:DEV_MODE=false` + tree-shaking 彻底移除 debug 命令及其支撑代码。发布后执行 `npm run build` 即可恢复开发版产物。

源码已拆分到 `src/` 模块（`types`、`mode`、`deck-service`、`panel`、`panel-drag`、`bar`、`commands`、`settings`、`debug`、`deck`、`createNext`、`deleteSlides`、`move`、`nav`、`capacity`、`capacity-core`、`confirm-delete`、`utils`），`main.ts` 仅作编排入口。

`scripts/` 放的是**不属于插件**、也永远不会随发布产出的开发工具（Release 工作流只发布 `main.js`、`manifest.json` 与 `styles.css`）——目前只有 `vault-cdp.mjs`，即上方「通过 CDP 驱动运行中的 App」里的驱动脚本。
