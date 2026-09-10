# 开发

[English](development.md) | **简体中文**

面向开发者的文档——构建插件、开发循环、仅开发版的调试工具，以及随仓库附带的
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

## Agent skills（随仓库附带）

来自 [mattpocock/skills](https://github.com/mattpocock/skills) 的 engineering 与
productivity skills 已附带在本仓库中，因此在本仓库工作的任何 agent（Pi、Claude Code、
Codex、Copilot……）都可以用来拷问方案、测试先行地实现、评审分支、跑调试循环或交接会话。
它们就是普通的 Markdown 文件，归你所有、可以自由修改。

- **规范位置**：`.agents/skills/<name>/SKILL.md`。共享规范目录的 agent（Pi、Amp、Codex、
  Copilot……）直接发现它；某个 agent 专属的目录（`.claude/skills`、`.cursor/skills`……）
  是指向它的**软链接**，绝不复制——单一来源。
- **已安装内容**：官方发布的 25 个 skill，即 [aihero.dev/skills](https://www.aihero.dev/skills)
  列出的 `engineering` + `productivity` 两套。实验性的 `in-progress` / `general` skill 有意不装。
- **版本已锁定**：`skills-lock.json` 记录了每个 skill 的来源仓库、路径与内容哈希，重装可复现。
- **第三方内容**：通过 `.prettierignore` 排除在 Prettier 与 ESLint 之外——切勿重新格式化，
  这样以后更新仍然可 diff。

在仓库根目录用 skills CLI 管理：

```sh
npx skills@latest list                                            # 查看已安装
npx skills@latest add mattpocock/skills -a pi -y -s <skill-names> # 安装 skill
npx skills@latest update                                          # 按锁文件重新同步
```

首次安装后，运行一次 `/setup-matt-pocock-skills`：它会为本仓库记录 issue tracker、triage
标签与文档布局，供需要它们的 skill 使用。

## 排版测量工具（仅开发版）

排版测量工具以**仅开发版**命令的形式提供，发布构建中不包含。

- **开发构建**（`npm run build` / `npm run dev`）会注册 `Debug: Dump Typography Styles` 命令：在**编辑与阅读两种视图**各采样一次当前笔记、计算差异，并写入 vault 根目录的 `.native-slides-debug.json`（无需手动复制控制台输出）。在开启 Slides 模式的 deck 笔记上运行；`example-vault/` 里五个 `typography-sample-*.md` 是它的固定一页采样夹具——请勿改名或删除。
- **发布构建**（`npm run build:release`）会压缩 `main.js`，并通过 `--define:DEV_MODE=false` + tree-shaking 彻底移除 debug 命令及其支撑代码。发布后执行 `npm run build` 即可恢复开发版产物。

源码已拆分到 `src/` 模块（`types`、`mode`、`deck-service`、`panel`、`bar`、`commands`、`settings`、`debug`、`deck`、`createNext`、`deleteSlides`），`main.ts` 仅作编排入口。
