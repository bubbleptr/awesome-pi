[English](./README.en.md) | 中文

# Awesome Pi [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

[浏览网站](https://piindex.dev/zh/) · 按分类搜索资源、阅读介绍并复制安装命令。

> 社区维护的 [Pi Coding Agent](https://pi.dev) Package 精选列表。Pi 是由 earendil-works 开发的终端 AI 编程助手，拥有丰富的 Package 生态。本列表收录的扩展、技能和主题主要由社区作者发布，收录不代表 Pi 官方发布或背书。

[![Pi](https://img.shields.io/badge/Pi-v0.84+-blue.svg)](https://pi.dev)
[![Packages](https://img.shields.io/badge/Packages-5500+-green.svg)](https://pi.dev/packages)
[![License](https://img.shields.io/badge/License-CC0-lightgrey.svg)](https://creativecommons.org/publicdomain/zero/1.0/)

[Pi Coding Agent](https://pi.dev) 是一个 AI Coding Harness 框架，其 Package 机制支持扩展（Extensions）、技能（Skills）、主题（Themes）和提示词模板（Prompt Templates）。本列表精选社区 Package，帮助开发者打造高效的 AI 编程环境。

```
# 安装 Pi 核心 CLI
curl -fsSL https://pi.dev/install.sh | sh

# 安装社区 Package（示例）
pi install npm:context-mode

# 查看已安装的 Pi Package
pi list
```

---

## Contents

- [Packages](#packages)
  - [Web Access & Search](#web-access--search)
  - [MCP Adapter](#mcp-adapter)
  - [Subagents](#subagents)
  - [UI Enhancement](#ui-enhancement)
  - [Security & Permission](#security--permission)
  - [Dev Tools & Code Intelligence](#dev-tools--code-intelligence)
  - [Persistent Memory](#persistent-memory)
  - [Context Management](#context-management)
  - [Loop Engineering](#loop-engineering)
  - [Code Review](#code-review)
  - [Task Management](#task-management)
  - [Plan Mode](#plan-mode)
  - [Background Tasks](#background-tasks)
  - [Browser Automation](#browser-automation)
  - [Web UI](#web-ui)
  - [Communication & Collaboration](#communication--collaboration)
  - [Utilities](#utilities)
  - [Package Collections](#package-collections)
- [Themes](#themes)
  - [Dark Themes](#dark-themes)
  - [Light Themes](#light-themes)
  - [Theme Packs](#theme-packs)
  - [Featured Themes](#featured-themes)
  - [Theme Tools](#theme-tools)
- [Editor Integration](#editor-integration)
- [Alternative Distributions](#alternative-distributions)

---

## Packages

> **包名与来源**：`npm:` 仅表示从 npm 安装；`name` 和 `@scope/name` 都可以是社区包名。`@scope` 是 npm 命名空间，有无 scope 都不能作为 Pi 官方身份的判断依据。请按各项目提供的完整包名安装，并核对发布者和源码仓库。参见 [npm scope 说明](https://docs.npmjs.com/about-scopes/)。
>
> [pi.dev/packages](https://pi.dev/packages) 是生态包目录，收录不代表 Pi 官方发布、审核或背书；[Pi Package 文档](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/packages.md) 说明了 npm / Git 分发方式和目录发现机制。
>
> [Pi 官方核心](https://github.com/earendil-works/pi)（如 `@earendil-works/pi-coding-agent`）、[上游扩展示例](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/examples/extensions)与各作者独立发布的 Package 应分别看待。某个功能有官方示例，不代表实现该功能的社区包也是官方发布。

### Web Access & Search

Web 搜索和内容获取 Package，让 Pi 能够访问互联网信息。

- 🔥 [pi-web-access](https://github.com/nicobailon/pi-web-access) - Web 搜索、URL 获取、PDF 提取与 YouTube 理解；默认免 Key 搜索使用 Exa MCP，按配置降级，DuckDuckGo 需显式选择。`pi install npm:pi-web-access`
- 🔥 [@juicesharp/rpiv-web-tools](https://github.com/juicesharp/rpiv-mono) - 可插拔 Web 搜索（Brave, Tavily, Serper, Exa, Jina, Firecrawl, SearXNG, Ollama）。`pi install npm:@juicesharp/rpiv-web-tools`
- 🔥 [@ollama/pi-web-search](https://pi.dev/packages/@ollama/pi-web-search) - 使用 Ollama Web 搜索和获取 API。`pi install npm:@ollama/pi-web-search`
- [pi-smart-fetch](https://github.com/Thinkscape/agent-smart-fetch) - 桌面浏览器 TLS 模拟，批量获取，多格式输出（markdown/html/text/json）。`pi install npm:pi-smart-fetch`
- [@narumitw/pi-firecrawl](https://github.com/narumiruna/pi-extensions) - Firecrawl 驱动的网页抓取、爬取、URL 发现和 Web 搜索。`pi install npm:@narumitw/pi-firecrawl`
- [@code-yeongyu/pi-webfetch](https://github.com/code-yeongyu/pi-webfetch) - URL 内容获取，支持 markdown/plain text/raw HTML。`pi install git:github.com/code-yeongyu/pi-webfetch`
- [@code-yeongyu/pi-websearch](https://github.com/code-yeongyu/pi-websearch) - Provider-backed Web 搜索，带配置门控和 TUI 状态。`pi install git:github.com/code-yeongyu/pi-websearch`

---

### MCP Adapter

MCP (Model Context Protocol) 适配 Package，连接外部工具生态。

- 🔥 [pi-mcp-adapter](https://github.com/nicobailon/pi-mcp-adapter) - 按需发现与调用 MCP 工具，支持惰性启动、元数据缓存和可选直接工具。作者估计代理定义约 200 Token，不含发现结果及调用内容。`pi install npm:pi-mcp-adapter`

> MCP 生态对接：[Bright Data Web MCP](https://github.com/earendil-works/pi/discussions/76), [Scrapeless MCP](https://github.com/earendil-works/pi/discussions/74)，以及任何兼容 MCP 的服务器。

---

### Subagents

子代理 Package，支持任务委托、并行执行和多代理编排。

- 🔥 [pi-subagents](https://github.com/nicobailon/pi-subagents) - Nico Bailon（nicobailon）维护的社区子代理扩展，支持链式、并行执行和 TUI 澄清。`pi install npm:pi-subagents`
- 🔥 [@tintinweb/pi-subagents](https://github.com/tintinweb/pi-subagents) - Claude Code 风格子代理，在宿主 SDK 会话中运行，支持并行后台任务、实时 widget 和可选 Git worktree 隔离。`pi install npm:@tintinweb/pi-subagents`
- 🔥 [@gotgenes/pi-subagents](https://pi.dev/packages/@gotgenes/pi-subagents) - tintinweb 的友好分支。`pi install npm:@gotgenes/pi-subagents`
- [@narumitw/pi-subagents](https://github.com/narumiruna/pi-extensions) - 单/并行/链式执行模式的子代理。`pi install npm:@narumitw/pi-subagents`
- [pi-interactive-subagents](https://github.com/HazAT/pi-interactive-subagents) - 异步交互式子代理，完全非阻塞，支持多路复用器。`pi install git:github.com/HazAT/pi-interactive-subagents`
- [pi-agent-bus](https://github.com/kylebrodeur/pi-agent-bus) - 基于 MessageBus pub/sub 的 Agent 编排运行时。`pi install npm:pi-agent-bus`
- [roach-pi](https://github.com/tmdgusya/roach-pi) - 严格工程纪律多代理编排套件（clarify→goal→verifier→subagent→review→LSP→MCP）。`pi install git:github.com/tmdgusya/roach-pi`
- 🔥 [pi-fabric](https://github.com/monotykamary/pi-fabric) - 可编程工具运行时：在受检 TypeScript 里编排核心工具、MCP、agent 与工作流。`pi install npm:pi-fabric`
- 🔥 [@quintinshaw/pi-dynamic-workflows](https://github.com/QuintinShaw/pi-dynamic-workflows) - 把一次请求扇出到隔离子代理，按任务路由模型并交叉校验。`pi install npm:@quintinshaw/pi-dynamic-workflows`

---

### UI Enhancement

终端 UI 增强 Package，提升交互体验。

- 🔥 [@narumitw/pi-statusline](https://github.com/narumiruna/pi-extensions) - 丰富的状态栏，显示模型、工具、git 分支、上下文使用、token 总计、费用和时间。`pi install npm:@narumitw/pi-statusline`
- 🔥 [pi-powerline-footer](https://pi.dev/packages/pi-powerline-footer) - Powerline 风格的状态栏扩展。`pi install npm:pi-powerline-footer`
- 🔥 [pi-btw](https://github.com/dbachelder/pi-btw) - `/btw` 侧边问题命令，不污染主对话。多版本可选（dbachelder 原版、juicesharp 版、Naru 版）。`pi install npm:pi-btw`
- 🔥 [@juicesharp/rpiv-voice](https://github.com/juicesharp/rpiv-mono) - `/voice` 本机 Whisper 听写，无云、无 API key。`pi install npm:@juicesharp/rpiv-voice`
- [pi-caveman](https://github.com/jonjonrankin/pi-caveman) - 让 Pi 像 caveman 一样说话，减少约 75% 输出 token。`pi install npm:pi-caveman`
- [whimsical](https://github.com/mitsuhiko/agent-stuff) - 将 "thinking..." 替换为有趣随机短语（如 "Hiking through the headers..."）。`pi install git:github.com/mitsuhiko/agent-stuff`
- [notify](https://github.com/mitsuhiko/agent-stuff) - 代理完成时桌面通知（OSC 777）。`pi install git:github.com/mitsuhiko/agent-stuff`
- [@narumitw/pi-caffeinate](https://github.com/narumiruna/pi-extensions) - 跨平台防止睡眠，长提示处理时保持唤醒。`pi install npm:@narumitw/pi-caffeinate`
- [pi-ext](https://github.com/tomsej/pi-ext) - 综合 UI 套件：leader-key 浮动面板、powerline footer、工具药丸标签、telescope 模糊查找。`pi install git:github.com/tomsej/pi-ext`
- [@juicesharp/rpiv-btw](https://github.com/juicesharp/rpiv-mono) - juicesharp 版 btw 侧对话。`pi install npm:@juicesharp/rpiv-btw`

---

### Security & Permission

安全与权限控制 Package。

- [pi-jev (y0usaf)](https://github.com/y0usaf/pi-jev) - 用 Jev 判定工具调用与结果，并提供 `jev_ask` 工具。默认 shadow 观察模式；Jev 请求需要 `TYPESAFE_API_KEY`。`pi install npm:@y0usaf/pi-jev`
- [pi-warden](https://github.com/DevMortimer/pi-warden) - 通过 TypeSafe Jev 或 OpenRouter 监督工具调用与项目规则，同时提供离线模式检查。需要 Node 22.19+；模型判定不是系统沙箱。`pi install npm:pi-warden`
- 🔥 [@gotgenes/pi-permission-system](https://github.com/gotgenes/pi-packages) - 三层权限状态（allow/deny/ask），生命周期钩子集成、子代理权限转发、审计日志。`pi install npm:@gotgenes/pi-permission-system`
- [@aliou/pi-guardrails](https://github.com/aliou/pi-guardrails) - 安全护栏套件：文件保护策略、工作区外路径访问控制、危险 shell 命令确认/拦截，含引导式配置。`pi install npm:@aliou/pi-guardrails`
- [pi-sandbox](https://github.com/carderne/pi-sandbox) - OS 级 bash 沙箱（Anthropic sandbox-runtime）+ 文件 allow/deny，拦截时交互批准。`pi install npm:pi-sandbox`
- [pi-permission-system](https://pi.dev/packages/pi-permission-system) - 权限强制执行扩展。`pi install npm:pi-permission-system`
- [@vigolium/piolium](https://pi.dev/packages/@vigolium/piolium) - 多阶段安全审计，专业子代理、隔离上下文窗口、并发上限。`pi install npm:@vigolium/piolium`
- [pi-hooks/permission](https://github.com/prateekmedia/pi-hooks) - 四层权限控制（Minimal/Low/Medium/High）。`pi install npm:pi-hooks`
- [filter-output](https://github.com/michalvavra/agents) - 自动捕获敏感值并在发送给 AI 前编辑。`pi install git:github.com/michalvavra/agents`
- [security](https://github.com/michalvavra/agents) - 阻止危险命令（如 sudo），需要显式用户批准。`pi install git:github.com/michalvavra/agents`
- [pi-vetter](https://github.com/jesset/pi-vetter) - npm 插件安装/更新前的供应链风险评估：通过 `/vet`、`/vet-install` 主动检查 OSV 漏洞、发布来源、静态模式与版本差异，报告 ALLOW/ASK/DENY；未发现风险不代表安全。`pi install npm:pi-vetter`
- [pi-verdict](https://github.com/jesset/pi-verdict) - 实验性工具调用权限控制：规则优先，结合会话上下文的模型分类器处理不确定操作，支持 allow/ask/deny；模型调用会增加延迟和成本，不替代系统级沙箱。`pi install npm:pi-verdict`

---

### Dev Tools & Code Intelligence

开发工具与代码智能 Package。

- [pi-jev (TheoOliveira)](https://github.com/TheoOliveira/pi-jev) - 基于 Jev 按任务选择工具与 Skill，并提供结构化判定。自动路由默认关闭；Jev 请求需要 `TYPESAFE_API_KEY` 或本地 Key 文件。`pi install npm:pi-jev`
- [pi-jev-code](https://github.com/KamilPostrozny/pi-jev-code) - 单 Agent 的 Jev 搜索重排、编辑前检查和任务基线 diff 审查。需要 Pi 0.85+、Node 20+ 和 TYPESAFE_API_KEY；先克隆仓库并运行其中的 install.sh，再将下方路径替换为本地目录。`pi install /absolute/path/to/pi-jev-code`
- 🔥 [pi-lens](https://github.com/apmantza/pi-lens) - 实时代码反馈——LSP、linter、formatter、类型检查、结构分析。`pi install npm:pi-lens`
- [pi-agent-ide](https://github.com/alexshpunt/pi-agent-ide) - Pi 的统一 Agent 原生 IDE：安全编辑、文本/AST/LSP 搜索、持久终端、交互式调试、视觉检查、诊断、撤销和渐进式能力指南。`pi install npm:pi-agent-ide`
- 🔥 [@nitra/cursor](https://pi.dev/packages/@nitra/cursor) - CLI 下载 Cursor 规则到本地仓库。`pi install npm:@nitra/cursor`
- 🔥 [@narumitw/pi-lsp](https://github.com/narumiruna/pi-extensions) - 可配置 LSP 诊断和源码修复，按文件扩展名路由。`pi install npm:@narumitw/pi-lsp`
- [@ff-labs/pi-fff](https://pi.dev/packages/@ff-labs/pi-fff) - FFF 驱动的模糊文件和内容搜索。`pi install npm:@ff-labs/pi-fff`
- [@narumitw/pi-retry](https://github.com/narumiruna/pi-extensions) - Provider 响应失败时的重试支持。`pi install npm:@narumitw/pi-retry`
- [@code-yeongyu/pi-lsp-client](https://github.com/code-yeongyu/pi-lsp-client) - LSP 集成：重命名、转到定义、查找引用、诊断。`pi install git:github.com/code-yeongyu/pi-lsp-client`
- [@code-yeongyu/pi-ast-grep](https://github.com/code-yeongyu/pi-ast-grep) - AST 感知代码搜索/替换，支持 25 种语言。`pi install git:github.com/code-yeongyu/pi-ast-grep`
- 🔥 [pi-interactive-shell](https://github.com/nicobailon/pi-interactive-shell) - TUI overlay 里跑交互式 CLI（vim / psql / ssh / rebase），用户可随时接管。`pi install npm:pi-interactive-shell`

> 代码审查见 [Code Review](#code-review) 的 `pi-simplify`。浏览器工具见 [Browser Automation](#browser-automation)。

---

### Persistent Memory

持久化记忆 Package，跨会话保留信息。

- 🔥 [pi-hermes-memory](https://github.com/chandra447/pi-hermes-memory) - 持久记忆 + 会话搜索 + 密钥扫描。SQLite FTS5 搜索、自动整合、368 个测试。`pi install npm:pi-hermes-memory`
- [pi-memory](https://github.com/jayzeng/pi-memory) - 纯 markdown 长期记忆 + daily log + scratchpad，可选 qmd 语义搜索。不要和 `@samfp/pi-memory` 搞混。`pi install npm:pi-memory`
- [gentle-engram](https://pi.dev/packages/gentle-engram) - 跨会话、压缩和 MCP 代理共享的本地或云端大脑。`pi install npm:gentle-engram`
- [@samfp/pi-memory](https://pi.dev/packages/@samfp/pi-memory) - 从会话中学习更正、偏好和模式，注入未来对话。`pi install npm:@samfp/pi-memory`
- [pi-memory-honcho](https://github.com/acsezen/pi-memory-honcho) - Honcho 支持的持久记忆，跨工作空间记忆共享。`pi install npm:pi-memory-honcho`

---

### Context Management

上下文管理 Package，优化 token 使用。

- [pi-jev-skill-picker](https://github.com/safzanpirani/pi-jev-skill-picker) - 用 `skill_search` 与 `skill_load` 按需检索、加载 Skill，替换每轮完整技能目录。Jev 排序需要 TypeSafe Key；无 Key 或全部请求失败时提供词法候选。`pi install git:github.com/safzanpirani/pi-jev-skill-picker`
- [pi-fast-jev-compaction](https://github.com/QuentinDanblon/pi-fast-jev-compaction) - Jev 为旧工具调用和结果评分，按请求裁剪上下文并保留会话历史。需要 TypeSafe Key；同名 npm 包属于另一作者，请使用此 Git 仓库安装。`pi install git:github.com/QuentinDanblon/pi-fast-jev-compaction`
- 🔥 [context-mode](https://pi.dev/packages/context-mode) - MCP 插件，节省 98% 上下文窗口，支持沙箱代码执行、FTS5 知识库。`pi install npm:context-mode`
- [pi-context-prune](https://github.com/championswimmer/pi-context-prune) - 总结已完成的工具调用批次，从 LLM 上下文中修剪原始输出。5 种修剪模式。`pi install npm:pi-context-prune`
- [pi-cache-graph](https://github.com/championswimmer/pi-cache-graph) - Provider 前缀缓存命中/未命中的实时图形显示。`pi install npm:pi-cache-graph`
- [pi-lean-ctx](https://pi.dev/packages/pi-lean-ctx) - 通过 lean-ctx CLI 路由命令以节省 token。`pi install npm:pi-lean-ctx`
- [@hypabolic/pi-hypa](https://github.com/Hypabolic/Hypa) - 本地确定性压缩嘈杂命令输出（git / docker / kubectl 等），再进上下文。`pi install npm:@hypabolic/pi-hypa`

### Loop Engineering

循环工程 Package。

- [@gintasz/pi-neuralyzer](https://github.com/gintasz/neuralyzer) - 允许 Agent 擦除自身会话上下文并重新运行首条消息，让 Ralph 循环工程更简单。`pi install npm:@gintasz/pi-neuralyzer`

---

### Code Review

代码审查 Package，提升代码质量。

- 🔥 [@plannotator/pi-extension](https://pi.dev/packages/@plannotator/pi-extension) - 交互式计划审查和注释，支持代码/PR 标注。`pi install npm:@plannotator/pi-extension`
- 🔥 [pi-simplify](https://pi.dev/packages/pi-simplify) - 审查代码的清晰性、一致性和可维护性。`pi install npm:pi-simplify`
- [review](https://github.com/mitsuhiko/agent-stuff) - 代码审查命令（工作树、PR 风格 diff、提交、自定义指令）。`pi install git:github.com/mitsuhiko/agent-stuff`
- [@juicesharp/rpiv-advisor](https://github.com/juicesharp/rpiv-mono) - 模型可在行动前向更强的审查模型请求第二意见。`pi install npm:@juicesharp/rpiv-advisor`
- [pi-ext/review](https://github.com/tomsej/pi-ext) - 多模式代码审查（GitHub PR、分支 diff、未提交更改）。`pi install git:github.com/tomsej/pi-ext`

---

### Task Management

任务管理与目标追踪 Package。

- 🔥 [@juicesharp/rpiv-todo](https://github.com/juicesharp/rpiv-mono) - 模型的 todo 列表，实时覆盖层，4 状态机、依赖跟踪。`pi install npm:@juicesharp/rpiv-todo`
- [@tintinweb/pi-tasks](https://github.com/tintinweb/pi-tasks) - Claude Code 风格任务工具、依赖 DAG、跨会话文件锁。`pi install npm:@tintinweb/pi-tasks`
- [@mjasnikovs/pi-task](https://github.com/mjasnikovs/pi-task) - 面向本地小模型的固定阶段编排（refine→research→grill→compose→critique），状态落盘可恢复。`pi install npm:@mjasnikovs/pi-task`
- 🔥 [gentle-pi](https://pi.dev/packages/gentle-pi) - 将 Pi 转变为高级架构开发工具，SDD/OpenSpec、严格 TDD。`pi install npm:gentle-pi`
- [@narumitw/pi-goal](https://github.com/narumiruna/pi-extensions) - `/goal` 模式，保持代理工作直到任务完成。`pi install npm:@narumitw/pi-goal`
- [@juicesharp/rpiv-workflow](https://pi.dev/packages/@juicesharp/rpiv-workflow) - 将技能链入类型化的多阶段管道，`/wf` 命令。`pi install npm:@juicesharp/rpiv-workflow`
- [goal](https://github.com/mitsuhiko/agent-stuff) - 持久目标追踪，带状态控制和模型工具。`pi install git:github.com/mitsuhiko/agent-stuff`
- [@narumitw/pi-sync](https://github.com/narumiruna/pi-extensions) - 通过 Git、WebDAV、Cloudflare R2 或 S3 同步 Pi 设置、技能、主题和扩展。`pi install npm:@narumitw/pi-sync`
- [pi-agent-flow](https://pi.dev/packages/pi-agent-flow) - Agent 工作流编排工具。`pi install npm:pi-agent-flow`
- [@gonrocca/zero-pi](https://pi.dev/packages/@gonrocca/zero-pi) - 规范驱动开发工作流（探索→计划→构建→验证）。`pi install npm:@gonrocca/zero-pi`
- [@narumitw/pi-worktree](https://github.com/narumiruna/pi-extensions) - 交互式 Git worktree：创建 / 切换 / 删除，并把 Pi 会话切到新工作区。`pi install npm:@narumitw/pi-worktree`
- [@dinglz/pi-worktree](https://github.com/dingdinglz/pi-worktree) - 面向 Pi 的 Git worktree 工作流：隔离开发、校验 PR 发布结果，并支持恢复中断流程、合并回原工作目录。`pi install npm:@dinglz/pi-worktree`

---

### Plan Mode

Pi 核心不内置 plan mode，用扩展补只读规划。

- 🔥 [@narumitw/pi-plan-mode](https://github.com/narumiruna/pi-extensions) - Codex 风格只读 `/plan`：探索、澄清、产出可实施计划后再改代码。`pi install npm:@narumitw/pi-plan-mode`

---

### Background Tasks

不阻塞主对话的后台进程与长任务。

- [@aliou/pi-processes](https://github.com/aliou/pi-processes) - 不阻塞会话的后台进程：dev server、test watcher、日志，带 `/ps` 面板。`pi install npm:@aliou/pi-processes`

---

### Browser Automation

浏览器自动化 Package。

- 🔥 [pi-chrome](https://pi.dev/packages/pi-chrome) - 使用已登录的 Chrome 配置文件。`pi install npm:pi-chrome`
- 🔥 [pi-agent-browser-native](https://github.com/fitchmultz/pi-agent-browser-native) - 将 agent-browser 作为原生工具暴露，紧凑页面快照、交互式引用、截图。`pi install npm:pi-agent-browser-native`
- [@narumitw/pi-chrome-devtools](https://github.com/narumiruna/pi-extensions) - 原生 Chrome DevTools Protocol 工具。`pi install npm:@narumitw/pi-chrome-devtools`
- [betterwright](https://github.com/BetterWright/betterwright) - 持久、策略守卫的 Playwright：网络策略、凭证保险库、证明截图。`pi install npm:betterwright`

---

### Web UI

浏览器监督跑在真实工作区里的 Pi 会话。

- 🔥 [@jmfederico/pi-web](https://github.com/jmfederico/pi-web) - 浏览器监督真实工作区中的 Pi 会话，断线不杀进程。[pi-web.dev](https://pi-web.dev/) `pi install npm:@jmfederico/pi-web`

---

### Communication & Collaboration

通信与协作 Package。

- 🔥 [pi-crew](https://pi.dev/packages/pi-crew) - 协调的 AI 团队、工作流、worktree 和异步任务编排。`pi install npm:pi-crew`
- [pi-intercom](https://pi.dev/packages/pi-intercom) - 子代理向父会话请求决策。`pi install npm:pi-intercom`
- [@cryptolibertus/pi-peer](https://pi.dev/packages/@cryptolibertus/pi-peer) - 本地 Pi-to-Pi 对等消息、斜杠命令、工具和运行时传输。`pi install npm:@cryptolibertus/pi-peer`
- [@llblab/pi-telegram](https://pi.dev/packages/@llblab/pi-telegram) - Telegram 运行时适配器。`pi install npm:@llblab/pi-telegram`
- [agent-comms](https://pi.dev/packages/agent-comms) - LLM 代理跨 harness 通信网格——房间、DM、在线状态。`pi install npm:agent-comms`

---

### Utilities

其他实用 Package。

- [pi-jev-router (win4r)](https://github.com/win4r/pi-jev-router) - 按任务在已配置的 Pi 模型间路由。默认 shadow 仅记录建议，Jev 网络判定默认关闭；通过 `/route init` 配置模型，配置 TypeSafe Key 后用 `/route jev on` 启用 Jev。需要 Node 22.19+、Pi 0.84.2–0.86.x。`pi install git:github.com/win4r/pi-jev-router`
- [pi-jev-model-router](https://github.com/da-vinci-noob/pi-jev-model-router) - 根据 Jev 任务判定、预算策略和提示词缓存成本，在已授权的 Pi 模型间路由。需要 TypeSafe Key；预算额度只调整路由，不会停止消费。`pi install npm:pi-jev-model-router`
- 🔥 [@juicesharp/rpiv-ask-user-question](https://github.com/juicesharp/rpiv-mono) - 交互式 ask_user 工具，可搜索分割窗格选择 UI、多选、自由输入。`pi install npm:@juicesharp/rpiv-ask-user-question`
- 🔥 [pi-markdown-preview](https://pi.dev/packages/pi-markdown-preview) - 渲染 markdown + LaTeX 预览，支持终端、浏览器和 PDF 输出。`pi install npm:pi-markdown-preview`
- 🔥 [pi-studio](https://pi.dev/packages/pi-studio) - 双窗格浏览器工作空间，支持提示/响应编辑、注释、实时预览。`pi install npm:pi-studio`
- [pi-ask-user](https://pi.dev/packages/pi-ask-user) - 交互式 ask_user 工具。`pi install npm:pi-ask-user`
- [@code-yeongyu/pi-rules](https://github.com/code-yeongyu/pi-rules) - 自动发现 .claude/rules, .cursor/rules, AGENTS.md 等规则文件。`pi install git:github.com/code-yeongyu/pi-rules`
- [@ravan08/pi-langfuse](https://github.com/saravananravi08/pi-langfuse-extension) - Langfuse 可观测性，追踪 token、费用、模型和工具调用。`pi install npm:@ravan08/pi-langfuse`
- [pi-venice](https://github.com/tunnckoCore/pi-venice) - Venice.AI 扩展，支持文本/图像/视频模型。`pi install npm:pi-venice`
- [@juicesharp/rpiv-i18n](https://pi.dev/packages/@juicesharp/rpiv-i18n) - rpiv-* 扩展的本地化基础。`pi install npm:@juicesharp/rpiv-i18n`
- [@a5c-ai/babysitter-pi](https://pi.dev/packages/@a5c-ai/babysitter-pi) - AI 监护扩展。`pi install npm:@a5c-ai/babysitter-pi`
- [@narumitw/pi-usage](https://github.com/narumiruna/pi-extensions) - `/usage` 读当前账号的 Codex / Copilot / OpenRouter 额度。`pi install npm:@narumitw/pi-usage`
- [@narumitw/pi-accounts](https://github.com/narumiruna/pi-extensions) - `/account` 切换 Codex / Anthropic / Copilot OAuth 账号。`pi install npm:@narumitw/pi-accounts`
- [pi-claude-marketplace](https://github.com/acolomba/pi-claude-marketplace) - 从 Claude plugin marketplace 安装 commands / skills / agents / 部分 hooks / MCP。`pi install npm:pi-claude-marketplace`

---

### Package Collections

精选 Package 集合与套件，一次安装多个工具。

- 🔥 [@narumitw/pi-extensions](https://github.com/narumiruna/pi-extensions) - 按 Coding / Browser / Workflow / Accounts / Observability 分组的 monorepo（statusline, plan-mode, worktree, usage, lsp, firecrawl, goal, subagents, sync 等）。`pi install git:github.com/narumiruna/pi-extensions`
- 🔥 [@juicesharp/rpiv-pi](https://github.com/juicesharp/rpiv-mono) - 管道系统（研究→设计→计划→实施→验证），另有独立可选的 voice、warp、args。`pi install npm:@juicesharp/rpiv-pi`
- [mitsuhiko/agent-stuff](https://github.com/mitsuhiko/agent-stuff) - Armin Ronacher 的 15+ 扩展集合（review, btw, goal, whimsical, notify, todos 等）。`pi install git:github.com/mitsuhiko/agent-stuff`
- [tomsej/pi-ext](https://github.com/tomsej/pi-ext) - 综合 UI 和工作流工具集合（leader-key, telescope, powerline footer, semantic git 等）。`pi install git:github.com/tomsej/pi-ext`
- [code-yeongyu/senpi](https://github.com/code-yeongyu/senpi) - 从 OMO 移植的 15+ 扩展（lsp-client, ast-grep, websearch, sandbox 等）。`pi install git:github.com/code-yeongyu/senpi`
- [jayshah5696/pi-agent-extensions](https://github.com/jayshah5696/pi-agent-extensions) - 15+ 扩展集合（sessions, ask_user, handoff, powerline-footer 等）。`pi install git:github.com/jayshah5696/pi-agent-extensions`
- [pi-toolbox](https://www.npmjs.com/package/pi-toolbox) - 17 个扩展 + 11 个主题 + 技能和智能体编排模板的综合工具包。`pi install npm:pi-toolbox`
- [pi-workstation](https://github.com/marv1nnnnn/pi-workstation) - 9 个手工制作主题（前卫剧场、赛博朋克、葛饰北斋风格等）+ 扩展。`pi install npm:pi-workstation`

---

## Themes

### Dark Themes

精选暗色主题，适合长时间编码。

- 🔥 [pi-tokyo-night](https://github.com/MitoroMisaka/pi-tokyo-night) - 深蓝色海军背景，东京蓝强调色，含自定义 ASCII 艺术头扩展。`pi install npm:pi-tokyo-night`
- 🔥 [@sherif-fanous/pi-catppuccin](https://github.com/sherif-fanous/pi-catppuccin) - Catppuccin Mocha 暗色变体，柔和温暖的 pastel 色调。`pi install npm:@sherif-fanous/pi-catppuccin`
- 🔥 [pi-themes-rose-pine](https://github.com/samfoy/pi-rose-pine) - 原始 Rosé Pine 暗色变体，柔和的 pastel 玫瑰色调。`pi install npm:pi-themes-rose-pine`
- 🔥 [pi-theme-synthwave-84](https://github.com/robzolkos/pi-theme-synthwave-84) - 霓虹 Synthwave '84 主题，80 年代复古未来主义美学。`pi install npm:pi-theme-synthwave-84`
- [@eliemessiecode/pi-code-theme](https://github.com/ElieMessieCode/pi-code-theme) - 温暖深色调主题，烧橙色和金色强调色。`pi install npm:@eliemessiecode/pi-code-theme`
- [@m64/pi-remembra-theme](https://pi.dev/packages/@m64/pi-remembra-theme) - 精致紫蓝渐变，精心平衡的文本颜色。`pi install npm:@m64/pi-remembra-theme`
- [@codella/pi-theme-cyberpunk](https://github.com/codella/pi-packages) - 霓虹赛博朋克主题，未来都市美学。`pi install npm:@codella/pi-theme-cyberpunk`
- [@javiportillo/pi-hackerman](https://github.com/javierportillo/pi-hackerman) - 霓虹黑客风格，灵感来自 Hackerman 主题。`pi install npm:@javiportillo/pi-hackerman`
- [pi-theme-flexoki](https://github.com/markacianfrani/pi-theme-flexoki) - Flexoki 暗色主题，受模拟墨水和温暖纸张启发。`pi install npm:pi-theme-flexoki`
- [pi-digital-rust-theme](https://pi.dev/packages/pi-digital-rust-theme) - 受损坏硬件启发的温暖技术反乌托邦配色。`pi install npm:pi-digital-rust-theme`
- [@gravewhisper/pi-theme-monokai-classic](https://pi.dev/packages/@gravewhisper/pi-theme-monokai-classic) - Monokai Classic，更柔和的边框和平衡的代码颜色。`pi install npm:@gravewhisper/pi-theme-monokai-classic`
- [pi-cursor-theme](https://github.com/dkmnx/pi-cursor-theme) - 受 Cursor IDE 启发的深色主题。`pi install npm:pi-cursor-theme`
- [@baretread/pi-forge](https://pi.dev/packages/@baretread/pi-forge) - Matte graphite 哑光石墨和熔融铜 Forge 主题。`pi install npm:@baretread/pi-forge`
- [@codella/pi-theme-candy](https://github.com/codella/pi-packages) - 明亮的霓虹糖果主题。`pi install npm:@codella/pi-theme-candy`

---

### Light Themes

亮色主题，适合明亮环境。

- 🔥 [@sherif-fanous/pi-catppuccin](https://github.com/sherif-fanous/pi-catppuccin) - Catppuccin Latte 亮色，奶油色背景。`pi install npm:@sherif-fanous/pi-catppuccin`
- [pi-themes-rose-pine](https://github.com/samfoy/pi-rose-pine) - Rosé Pine Dawn 亮色变体，纸张般的平静优雅。`pi install npm:pi-themes-rose-pine`
- [pi-theme-flexoki](https://github.com/markacianfrani/pi-theme-flexoki) - Flexoki 亮色主题，墨水在纸上的感觉。`pi install npm:pi-theme-flexoki`

---

### Theme Packs

主题合集包，一次安装多种配色。

- 🔥 [@spences10/pi-themes](https://github.com/spences10/my-pi) - 11 个主题：Catppuccin Mocha、Dracula、Gruvbox Dark、Night Owl、Neon Noir、Nord、Rosé Pine、Tokyo Night 等。`pi install npm:@spences10/pi-themes`
- 🔥 [@victor-software-house/pi-curated-themes](https://github.com/victor-software-house/pi-curated-themes) - 65 个主题大合集，从 iTerm2 配色适配：Adventure、Aura、Catppuccin、Dracula+、Everforest、Gruvbox、Jellybeans、Kanagawa、Nord、Tomorrow Night 等。`pi install npm:@victor-software-house/pi-curated-themes`
- [@ifi/oh-pi-themes](https://pi.dev/packages/@ifi/oh-pi-themes) - 6 个主题：Catppuccin Mocha、Cyberpunk、Gruvbox Dark、Nord、Tokyo Night。`pi install npm:@ifi/oh-pi-themes`
- [hasit/pi-community-themes](https://github.com/hasit/pi-community-themes) - 社区精选：atom-one、catppuccin（4 变体）、dracula、gruvbox（6 变体）、nord、solarized。`pi install git:github.com/hasit/pi-community-themes`
- [@smoose/pi-themes](https://github.com/smoosex/pi-themes) - 支持亮暗配对切换：Everforest、Tundra、Rosé Pine、OneDark、Gruvbox 等。`pi install npm:@smoose/pi-themes`
- [my-pi-themes](https://pi.dev/packages/my-pi-themes) - 14 个主题：monokai-pro、onedark-pro、tokyo-dark、e-ink/e-ink-dark、gruvbox-light 等。`pi install npm:my-pi-themes`
- [@matyah00/openpi](https://github.com/heyhuynhgiabuu/openpi) - 11 个捆绑主题 + 多智能体编排。`pi install npm:@matyah00/openpi`

> 亦见 [Package Collections](#package-collections) 中的 [pi-toolbox](https://www.npmjs.com/package/pi-toolbox)。

---

### Featured Themes

特色主题，独特的设计理念和用途。

- 🔥 [pi-kanagawa](https://www.npmjs.com/package/pi-kanagawa) - williy_cole 发布的社区主题，受葛饰北斋《神奈川冲浪里》启发，深蓝色和温暖金色，含波浪动画和 git 分支小部件。`pi install npm:pi-kanagawa`
- [pi-terminal-theme](https://github.com/mavam/pi-terminal-theme) - 使用 ANSI 0-15 颜色的终端主题，让终端提供实际颜色。`pi install npm:pi-terminal-theme`
- [pi-ansi-themes](https://github.com/leblancfg/pi-ansi-themes) - 标准 16 色 ANSI 主题，避免与终端主题冲突。`pi install git:github.com/leblancfg/pi-ansi-themes`
- [my-pi-themes/e-ink](https://pi.dev/packages/my-pi-themes) - 电子墨水友好主题，高对比度低色彩。`pi install npm:my-pi-themes`
- [pi-peacock](https://pi.dev/packages/pi-peacock) - Peacock 风格的工作区着色，为不同工作区提供独特颜色标识。`pi install npm:pi-peacock`
- [@codella/pi-theme-christmas](https://pi.dev/packages/@codella/pi-theme-christmas) - 节日圣诞主题。`pi install npm:@codella/pi-theme-christmas`
- [@codella/pi-theme-grayscale](https://pi.dev/packages/@codella/pi-theme-grayscale) - 最小化灰度主题。`pi install npm:@codella/pi-theme-grayscale`
- [@taterdoge/pi-ayu](https://pi.dev/packages/@taterdoge/pi-ayu) - 受 Ayu 启发的暗色和亮色主题。`pi install npm:@taterdoge/pi-ayu`

> 亦见 [Package Collections](#package-collections) 中的 [pi-workstation](https://github.com/marv1nnnnn/pi-workstation)。

---

### Theme Tools

主题工具和辅助扩展。

- 🔥 [@sherif-fanous/pi-theme-sync](https://github.com/sherif-fanous/pi-theme-sync) - 自动将 Pi 主题与终端或操作系统外观同步，支持 DEC mode 2031 实时通知。`pi install npm:@sherif-fanous/pi-theme-sync`
- [pi-theme-switcher](https://github.com/milanglacier/pi-theme-switcher) - 根据环境变量、THEME_MODE 或一天中的时间自动切换亮暗主题。`pi install npm:pi-theme-switcher`
- [pi-theme-flip](https://github.com/adstastic/pi-theme-flip) - 添加命令来切换亮暗主题。`pi install npm:pi-theme-flip`
- [pi-system-theme](https://pi.dev/packages/pi-system-theme) - 将 Pi 主题与 macOS 亮暗外观同步。`pi install npm:pi-system-theme`
- [pi-macos-theme-sync](https://pi.dev/packages/pi-macos-theme-sync) - macOS 主题同步，无需轮询。`pi install npm:pi-macos-theme-sync`
- [@ogulcancelik/pi-ghostty-theme-sync](https://github.com/ogulcancelik/pi-extensions) - 将 Pi 主题与 Ghostty 终端颜色同步。`pi install npm:@ogulcancelik/pi-ghostty-theme-sync`

---

### Editor Integration

编辑器集成 Package，将 Pi 嵌入到 IDE 中。

- [pi-acp](https://github.com/svkozak/pi-acp) - Pi 的 ACP（Agent Client Protocol）适配器，桥接到 Zed 等编辑器。`npm install -g pi-acp`
- [VS Code Pi Chat Provider](https://marketplace.visualstudio.com/items?itemName=tintinweb.vscode-pi-model-chat-provider) - VS Code 语言模型聊天提供程序集成。
- [pi-vscode-extension](https://github.com/Zetaphor/pi-vscode-extension) - 将 Pi 嵌入为 VS Code 扩展。`pi install git:github.com/Zetaphor/pi-vscode-extension`

> Zed 编辑器通过 ACP Registry 原生支持 Pi：配置 `"agent_servers": { "pi-acp": { "type": "registry" } }` 即可使用。


## Alternative Distributions

Pi 的 fork/替代发行版，提供开箱即用的增强体验。

- [oh-my-pi](https://github.com/can1357/oh-my-pi) - Pi 的增强 fork（约 25.8k★），集成 40+ provider、32 内置工具、LSP/DAP、Python 运行时、浏览器自动化。独立 CLI，非 Pi Package。不要和 npm 上无关的 `oh-my-pi`（acidsugarx）搞混。`curl -fsSL https://omp.sh/install | sh`


## Contributing

欢迎贡献！请通过以下方式参与：

1. **提交 PR** — 添加新的 Skills、Packages 或资源链接
2. **报告问题** — 发现过期链接或错误描述请提 Issue
3. **分享配置** — 分享你的 Pi 配置和常用包组合

### 贡献规范

- 使用中文描述，保留英文名称和命令
- 每个条目包含名称、链接、描述和安装命令（如果适用）
- 按功能分类，保持格式一致
- 优先选择有 GitHub 仓库或项目自身文档的资源
- 标注作者信息（如有）
- 仅在发布者和源码仓库可核实的情况下标注“Pi 官方”；不要根据安装方式、包名是否带 scope 或目录收录情况判断归属

### npm Scope 迁移说明

Pi 官方核心 npm 包已从 `@mariozechner` 迁移到 `@earendil-works`。下表列出的是核心包的命名变化，不是社区扩展的命名规则；各扩展仍使用其发布者指定的完整包名。

| 旧包名 | 新包名 |
|--------|--------|
| `@mariozechner/pi-coding-agent` | `@earendil-works/pi-coding-agent` |
| `@mariozechner/pi-agent-core` | `@earendil-works/pi-agent-core` |
| `@mariozechner/pi-ai` | `@earendil-works/pi-ai` |
| `@mariozechner/pi-tui` | `@earendil-works/pi-tui` |

---

## License

本列表采用 [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) 许可。

> 数据来源于 [pi.dev/packages](https://pi.dev/packages)、GitHub、npm 和社区公开资源。
> 各项目版权归原作者所有，遵循其各自的许可证条款。

---

*本文档最后更新于 2026 年 9 月（来源说明修订；包选录和数量数据截至 2026 年 8 月）。Pi 生态持续发展，建议定期查看 [pi.dev/packages](https://pi.dev/packages) 获取最新信息。*

<!-- END OF awesome-pi-list.md Part 2 -->
