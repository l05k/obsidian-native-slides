# 开发

[English](development.md) | **简体中文**

面向开发者的文档——构建插件、开发循环、仅开发版的调试工具，以及 `.agents/skills/` 里的
AI agent skills。用户向的 README 刻意保持为干净的发布页；插件作者或贡献者需要的都在这里。

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

## Agent skills

`.agents/skills/` 是本仓库的 skill 之家，里面同时放着两类内容；因此在本仓库工作的任何 agent
（Pi、Claude Code、Codex、Copilot……）都可以用来拷问方案、测试先行地实现、评审分支、跑调试
循环或交接会话。它们就是普通的 Markdown 文件，归你所有、可以自由修改。

- **仓库自有的 skill**——`dev-workflow`（[Rule 1](../AGENTS.md) / [Rule 2](../AGENTS.md) 的强制
  工作流）与 `herdr-subagent`（Rule 2 所用的 Herdr 窗格/子代理操作手册）。这两个是我们的：随意
  修改，且仍受 Prettier / ESLint 约束。
- **规范位置**：`.agents/skills/<name>/SKILL.md`。共享规范目录的 agent（Pi、Amp、Codex、
  Copilot……）直接发现它；某个 agent 专属的目录（`.claude/skills`、`.cursor/skills`……）
  是指向它的**软链接**，绝不复制——单一来源。
- **随仓库带入的 25 个**——来自 [mattpocock/skills](https://github.com/mattpocock/skills) 的
  `engineering` + `productivity`，即 [aihero.dev/skills](https://www.aihero.dev/skills) 列出的两套。
  实验性的 `in-progress` / `misc` skill 有意不装。
- **可检测漂移**：`skills-lock.json` 记录了每个 skill 的来源仓库、路径与内容哈希，
  `npx skills update` / `npx skills experimental_install` 会据此核对已安装目录。由于没有
  记录 commit `ref`，重装仍会解析上游默认分支——它检测漂移，而非锁定提交。
- **第三方内容不参与格式化**：`.prettierignore` 排除了 `.agents/skills/*`（并重新纳入那两个
  仓库自有的 skill）——切勿重新格式化带入的文件，这样以后更新仍然可 diff。

在仓库根目录用 skills CLI 管理：

```sh
npx skills@latest list                                                    # 查看已安装
npx skills@latest add mattpocock/skills -a universal -y -s <skill-names>  # 安装 skill
npx skills@latest update                                                  # 刷新，检测漂移
```

`-a universal` 才是写入规范目录 `.agents/skills/` 的目标；像 `-a pi` 这样的单 agent 目标
会把 skill 复制到该 agent 自己的（已被 gitignore 的）目录 `.pi/skills/`。安装成功会输出
`→ ./.agents/skills/<name>`。

> **注意**：该目录由 CLI 管理。限定范围的 `npx skills remove`——尤其是 `remove --all`——
> 会连仓库自有的 `dev-workflow` 与 `herdr-subagent` 一起删掉。它们已提交进版本库，
> `git checkout -- .agents/skills` 可恢复，但切勿盲目执行这些命令。

首次安装后，运行一次 `/setup-matt-pocock-skills`：它会为本仓库记录 issue tracker、triage
标签与文档布局，供需要它们的 skill 使用。

## 排版测量工具（仅开发版）

排版测量工具以**仅开发版**命令的形式提供，发布构建中不包含。

- **开发构建**（`npm run build` / `npm run dev`）会注册 `Debug: Dump Typography Styles` 命令：在**编辑与阅读两种视图**各采样一次当前笔记、计算差异，并写入 vault 根目录的 `.native-slides-debug.json`（无需手动复制控制台输出）。在开启 Slides 模式的 deck 笔记上运行；`example-vault/` 里五个 `typography-sample-*.md` 是它的固定一页采样夹具——请勿改名或删除。
- **发布构建**（`npm run build:release`）会压缩 `main.js`，并通过 `--define:DEV_MODE=false` + tree-shaking 彻底移除 debug 命令及其支撑代码。发布后执行 `npm run build` 即可恢复开发版产物。

源码已拆分到 `src/` 模块（`types`、`mode`、`deck-service`、`panel`、`bar`、`commands`、`settings`、`debug`、`deck`、`createNext`、`deleteSlides`），`main.ts` 仅作编排入口。
