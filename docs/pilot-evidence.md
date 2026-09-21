# 分类与插件试点内容核验证据

核验日期：2026-09-21。范围：2 个分类指南、3 个插件详情及其选型对照。核验方式为联网查看官方仓库/目录，下载固定提交源码，交叉核对 README、配置和执行路径。**没有运行付费模型任务或第三方搜索/MCP 服务，没有形成性能、费用或提取准确率实测结论。** 页面证据状态统一为 `source-reviewed`。

## 固定版本

| 资源 | 包版本 / 提交或发布摘要 | 一手入口 |
| --- | --- | --- |
| pi-web-access | 0.30.0 / `6c5afa1d0d43eef8552284ad73f4bd9f0612a378` | [固定源码](https://github.com/nicobailon/pi-web-access/tree/6c5afa1d0d43eef8552284ad73f4bd9f0612a378) |
| @tintinweb/pi-subagents | 0.19.0 / `e955e29c51b7a6cce37e1108cd2d6c57a77e151c` | [固定源码](https://github.com/tintinweb/pi-subagents/tree/e955e29c51b7a6cce37e1108cd2d6c57a77e151c) |
| pi-mcp-adapter | 2.35.0 / `1569578ae0ddc697f275560ff7b793031ea95ed4` | [固定源码](https://github.com/nicobailon/pi-mcp-adapter/tree/1569578ae0ddc697f275560ff7b793031ea95ed4) |
| pi-subagents | 0.70.1 / `1ac7b5e2652e9571164847ac2905ab4aded92791` | [固定源码](https://github.com/nicobailon/pi-subagents/tree/1ac7b5e2652e9571164847ac2905ab4aded92791) |
| @juicesharp/rpiv-web-tools | 2.10.1 / `0fdf4f813980d380e826b84d1280a4960e5d088e` | [固定源码](https://github.com/juicesharp/rpiv-mono/tree/0fdf4f813980d380e826b84d1280a4960e5d088e/packages/rpiv-web-tools) |
| @ollama/pi-web-search | npm 0.0.5 / shasum `c36fd7dabda15c15e01566f4c4b3dbdf5ef34af4` | [npm 固定发布元数据及源码归档地址](https://registry.npmjs.org/@ollama/pi-web-search/0.0.5) |

这里的 Git 包版本来自该提交的 package.json，不承诺 npm 最新版本与仓库 HEAD 同步。页面上的安装命令复用 catalog 中核验一致的命令，不在内容 JSON 重复存储。

## 对计划简述的纠偏

- **pi-web-access**：默认免 Key 搜索是 Exa MCP。DuckDuckGo 属于显式选择，不参加默认自动降级或 `provider: "all"`。`gemini-search.ts` 明确记录有条件的 SearXNG、OpenAI/Exa 优先顺序及后续 API 降级。搜索与网页抓取有不同路由，远程托管抓取默认关闭，需 `fetchRouting.allowRemoteHostedProviders`。本地 PDF 兜底是 unpdf/pdf.js，不需要系统 pdftotext；远程 Datalab/Gemini 路径会发送 PDF 内容。本地文本提取没有 OCR，不能将 README 末尾笼统的“PDF 无 OCR”扩大为所有远程路径。YouTube 画面/转录理解与 ffmpeg、yt-dlp 抽帧依赖分开说明。
- **Tintin 子代理**：`agent-runner.ts` 使用宿主进程中的 `createAgentSession`。后台默认并发 10，前台独立上限默认 0 表示不限。`isolation: "worktree"` 为可选项，普通会话无 Git 仓库要求。worktree 从已提交 HEAD 创建，看不到父目录未提交内容；完成后保存本地分支并移除临时目录，不自动合并。`worktree.ts` 的旧注释提到降级，但 `agent-manager.ts` 在创建失败后明确抛错，因此以真实调用链为准。
- **Nico 子代理对照**：当前版本同样支持可选 worktree；前台 SDK 会话在父进程中运行，后台通过独立 runner 执行，不能使用“进程派生 vs worktree”作为互斥分类。单次执行内活动子任务上限与累计创建数量上限分别为 20、64，不是消费预算。
- **MCP Adapter**：约 200 Token 是作者对紧凑代理定义的估计，不是本项目测量或整次会话上限。工具发现结果、参数、输出及直接工具 schema 仍产生上下文。配置采用真实 `mcpServers` 对象，区分共享 `.mcp.json`、全局共享配置和 Pi 覆盖配置；直接工具、磁盘缓存和惰性连接分别说明。
- **Ollama**：[官方包目录](https://pi.dev/packages/@ollama/pi-web-search) 的 README 与 npm 0.0.5 源码不一致。发布代码实际注册 `web_search`/`web_fetch`，地址硬编码 `http://localhost:11434`，不读取 README 提到的 `OLLAMA_HOST`；401 提示 `ollama signin`。目录所引 `ollama/pi-web-search` 仓库本次访问为 404，因此依据固定 npm 发布归档核验，未猜测替代仓库。
- **本地搜索边界**：rpiv 的 SearXNG/Ollama 本地端点只说明扩展首先连接哪里，不证明服务端不会访问外网。没有采纳 README 中“查询不离开网络”的宽泛保证。SearXNG JSON 前置要求另与[官方 API 文档](https://docs.searxng.org/dev/search_api.html)交叉核对。

## 内容验收

每个代表资源都记录机制、依赖、限制、数据发送范围、失败行为、日期、版本及来源；页面包含配置或使用验证方法。所有比较未声称实际测得跨包 Token 成本，仅解释重复上下文、子任务用量和工具定义成本。验证示例由读者按实际模型授权及服务环境执行。

静态文案属于免测试优先例外，没有添加镜像文案字面值的测试；集成时校验 JSON 结构、完整 catalog 名称引用及对应双语页面构建。
