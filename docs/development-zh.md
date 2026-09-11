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
- **驱动 App**（例如通过 CDP 的 `--remote-debugging-port=9222`）是允许的；本规则限制的是它可以碰哪个库。

## Agent skills

`.agents/skills/` 是本仓库的 skill 之家，里面同时放着两类内容；因此在本仓库工作的任何 agent
（Pi、Claude Code、Codex、Copilot……）都可以用来拷问方案、测试先行地实现、评审分支、跑调试
循环或交接会话。它们就是普通的 Markdown 文件，归你所有、可以自由修改。

- **仓库自有的 skill**——`dev-workflow`（[Rule 1](../AGENTS.md) / [Rule 2](../AGENTS.md) / [Rule 4](../AGENTS.md) 的强制
  工作流）、`herdr-subagent`（Rule 2 所用的 Herdr 窗格/子代理操作手册）与 `code-review-herdr`
  （本仓库对 vendored `code-review` 的 fork：两轴方法相同，但每条轴都在自己的 Herdr 窗格里
  运行——Pi 没有原生 subagent 工具，这正是它需要的——报告收齐后这些窗格会被关闭）。
  这三个是我们的：随意修改，且仍受 Prettier 约束（ESLint 会跳过整个 `.agents/skills/`）。
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
- **第三方内容不参与格式化**：`.prettierignore` 排除了 `.agents/skills/*`（并重新纳入那三个
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
> 会连仓库自有的 `dev-workflow`、`herdr-subagent` 与 `code-review-herdr` 一起删掉。它们已提交
> 进版本库，`git checkout -- .agents/skills` 可恢复，但切勿盲目执行这些命令。

首次安装后，运行一次 `/setup-matt-pocock-skills`：它会为本仓库记录 issue tracker、triage
标签与文档布局，供需要它们的 skill 使用，并写入 [`docs/agents/`](agents/issue-tracker.md)。
本仓库已完成该步骤——`code-review-herdr` 读取 `docs/agents/issue-tracker.md` 以确定 spec，
`/triage` 读取 `docs/agents/triage-labels.md`——因此这三个文件与本文件一起提交。
直接编辑它们即可；只有在切换 tracker 或重新开始时才需再次运行该 skill。

## 排版测量工具（仅开发版）

排版测量工具以**仅开发版**命令的形式提供，发布构建中不包含。

- **开发构建**（`npm run build` / `npm run dev`）会注册 `Debug: Dump Typography Styles` 命令：在**编辑与阅读两种视图**各采样一次当前笔记、计算差异，并写入 vault 根目录的 `.native-slides-debug.json`（无需手动复制控制台输出）。在开启 Slides 模式的 deck 笔记上运行；`example-vault/` 里五个 `typography-sample-*.md` 是它的固定一页采样夹具——请勿改名或删除。
- **发布构建**（`npm run build:release`）会压缩 `main.js`，并通过 `--define:DEV_MODE=false` + tree-shaking 彻底移除 debug 命令及其支撑代码。发布后执行 `npm run build` 即可恢复开发版产物。

源码已拆分到 `src/` 模块（`types`、`mode`、`deck-service`、`panel`、`bar`、`commands`、`settings`、`debug`、`deck`、`createNext`、`deleteSlides`、`nav`、`capacity`、`capacity-core`、`confirm-delete`、`utils`），`main.ts` 仅作编排入口。
