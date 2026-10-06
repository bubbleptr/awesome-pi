# Pi Durable 专题核验记录

本轮核验日期：2026-10-07。范围为 GitHub 代码搜索、固定提交的源码与 npm 发行元数据；未安装、未运行任何候选项目，未读取密钥。判定标准是非测试、非示例的源码确实 `import @earendil-works/pi-durable`（或其子路径），仅在 package.json 声明依赖不算。证据状态为 `source-reviewed`，不代表运行验收或效果背书。逐仓库的完整核验 JSON 存于 `output/pi-durable-research-2026-10-07/repos/`（本地产物，未入库）。

## 核验结果总表

Stars 为 2026-10-07 GitHub API 快照，只代表关注度。固定提交为各仓库克隆时 HEAD。「npm 一致」指 npm 发行 `gitHead` 是否等于核验提交。

| 展示 | 仓库与用途 | Stars | 固定提交 | 安装来源 / npm 版本 | npm 一致 |
| --- | --- | ---: | --- | --- | --- |
| 主推 | [TannerMidd/pi-pocket](https://github.com/TannerMidd/pi-pocket)：自托管多人 Pi Web 应用，单 SQLite durable harness | 134 | [`3e604661`](https://github.com/TannerMidd/pi-pocket/commit/3e6046612db4358b599da302d5c96bd407d9de5c) | Git 检出，未上 npm | — |
| 主推 | [duh17/oppi](https://github.com/duh17/oppi)：iPhone/iPad 客户端 + 自托管 server，durable 会话为实验项 | 39 | [`844e6d17`](https://github.com/duh17/oppi/commit/844e6d170aeca52885d7b284878e64f214bfbd7d) | `oppi-server` 0.51.0 | 否（gitHead `b747bb59` 更早） |
| 主推 | [daya0576/pi-imessage](https://github.com/daya0576/pi-imessage)：macOS iMessage 机器人，每聊天一个 durable 会话 | 38 | [`ebdf5c29`](https://github.com/daya0576/pi-imessage/commit/ebdf5c290e01b9d97964952c1531bb9c249fb8ba) | `@kingcrab/pi-imessage` 0.0.43 早于 Durable 迁移，需源码构建 | 否（发行版本身不含 Durable） |
| 主推 | [geminixiang/mikan](https://github.com/geminixiang/mikan)：Slack/TG/Discord/GitHub 团队 agent，每对话一个 durable 会话 | 8 | [`c95f3701`](https://github.com/geminixiang/mikan/commit/c95f3701119cfa8ac6abf7af86cd884470e87502) | `@geminixiang/mikan` 1.0.0 | 是 |
| 主推 | [cosmyo/ha-pi-durable](https://github.com/cosmyo/ha-pi-durable)（Hearth Pi）：Home Assistant App，受限读取 + 人工审批 | 8 | [`bde4eede`](https://github.com/cosmyo/ha-pi-durable/commit/bde4eedea875f83d1b608e266198e6dc3d170fe8) | HA App store / 源码 | — |
| 主推 | [fabric-runtime/pi-fabric](https://github.com/monotykamary/pi-fabric)：Pi 扩展，spawn 的 agent/actor 默认跑在 Pi Durable | 284 | [`b9e40f9f`](https://github.com/fabric-runtime/pi-fabric/commit/b9e40f9f35af5ce0e7739de48a66b0aadef037e9) | `pi-fabric` 0.108.1（核验当日 npm 已更新至 0.109.0） | 未记录 gitHead |
| 主推 | [mavam/webfox](https://github.com/mavam/webfox)：联网搜索/研究 CLI+库+Pi 扩展，`./durable` 入口为 Durable 扩展 | 86 | [`2fcc7d99`](https://github.com/mavam/webfox/commit/2fcc7d99d8e0bdbd644c53cc27a99d7f1f93d010) | `webfox` 4.7.0 | 是 |
| 主推 | [cloudflare/agents](https://github.com/cloudflare/agents)：Agents SDK 的 PiHarness 在 DO 中托管 Pi Durable | 5783 | [`92d1770d`](https://github.com/cloudflare/agents/commit/92d1770de7d4f0b2c643e23f4ac867950bae69fc) | `agents` 0.26.0（pi-durable 为 peer 依赖） | 未记录 gitHead |
| 主推 | [j-koester/pi-durable-postgres](https://github.com/j-koester/pi-durable-postgres)：PostgreSQL 存储后端 | 1 | [`d10b637a`](https://github.com/j-koester/pi-durable-postgres/commit/d10b637aae29bb8fcf16c1280372b2f74060ead3) | `@netzlabor/pi-durable-postgres` 0.1.1 | 否（gitHead `32662f28` 更早） |
| 更多 | [rivet-dev/agents](https://github.com/rivet-dev/agents)（`@rivet-dev/pi`）：Pi 作为 durable Rivet Actor | 1593 | [`420c726f`](https://github.com/rivet-dev/agents/commit/420c726ffe1992f81d39c4c2d2a8c78a5c0aeb44) | 仓库内 `@rivet-dev/pi` 0.5.0；npm 0.1.0 无 Durable | 未记录 gitHead |
| 更多 | [powerfooI/roamgate](https://github.com/powerfooI/roamgate)：Herdr 桌面/移动客户端，内置 durable 助手 | 279 | [`d703e6f6`](https://github.com/powerfooI/roamgate/commit/d703e6f6b94bdd418186a8daaaea77bceb78d26c) | 安装脚本 / 源码 | — |
| 更多 | [harshil1712/pi-on-cf](https://github.com/harshil1712/pi-on-cf)：Cloudflare 上的单用户实验 agent | 23 | [`1418e7c5`](https://github.com/harshil1712/pi-on-cf/commit/1418e7c525a929e6cba51bec1228c5480e96b2fa) | wrangler 部署 | — |
| 更多 | [botiverse/antiproton](https://github.com/botiverse/antiproton)：Cloudflare 多租户 durable agent 运行时 | 27 | [`d18204df`](https://github.com/botiverse/antiproton/commit/d18204df620ac15800009cc36f92b75b29ff5ccc) | 源码 | — |
| 更多 | [timReynolds/sift](https://github.com/timReynolds/sift)：GitHub Action 形式的多 agent PR 审查 | 0 | [`6a2a37f0`](https://github.com/timReynolds/sift/commit/6a2a37f0c0659e0747a904d2b909b02bea96ac35) | Action / 源码构建 | — |
| 更多 | [anasalqoyyum/pi-durable-subagents](https://github.com/anasalqoyyum/pi-durable-subagents)：持久化子代理 Pi 扩展 | 0 | [`7c909bf0`](https://github.com/anasalqoyyum/pi-durable-subagents/commit/7c909bf0895b1b664fa0b918aa99ba72bd028b3c) | `pi install git:` | — |
| 更多 | [Nyarlathoteppppp/pi-durabletask-mcp](https://github.com/Nyarlathoteppppp/pi-durabletask-mcp)：MCP 形式的 durable 任务委托 | 6 | [`6abf6677`](https://github.com/Nyarlathoteppppp/pi-durabletask-mcp/commit/6abf6677d6092c765fdee578774334322f27bbfd) | `pi-durabletask-mcp` 0.7.8 | 未记录 gitHead |

## 未收录及原因

- **huang-sh/PiX**：仅 `experimental/pi-durable` 私有探针包引用；产品会话引擎是 Pi AgentSession。
- **qybaihe/mu**：整个 pi monorepo 以 vendored 源码形式进仓库（`packages/durable` 1.0.2），mu 自有代码（kyrn-judge、desktop）不 import Pi Durable。
- **ChuxinNeko/NekoCodeDesktop**：同上，`pi/` 子树为 vendored pi 源码（durable 1.0.0），Electron 应用层不 import。
- **heyhuynhgiabuu/pi-task**：Pi Durable 只在 `devDependencies`，经 `await import()` 动态加载，是可选的实验性后端而非默认路径。
- **edgehero/pi-dispatch**：不使用 Pi Durable。依赖为 `pi-coding-agent`/`pi-ai`/`pi-mcp`/`pi-tui`/`chord`（1.0.4），README 的 "durable queue" 指其自有队列。
- 其余源码核验为 runtime 的项目（Claxedo、OpenOrb、ace2、esf、pi-fategui、hui、cueloop、Saul、Pi-Durable-Subagent、pi-durable-components、pi-openshell、paca、shurik、my-ax、gitorange）因用途重叠、成熟度或篇幅未入选，核验记录仍在研究输出目录中。

## 两个安装陷阱

- **`@kingcrab/pi-imessage` 0.0.43**（2026-08 发行）：运行依赖为 `@earendil-works/pi-agent-core`/`pi-ai`/`pi-coding-agent` **0.84.1**，不含 `@earendil-works/pi-durable`。Durable 版本只存在于仓库源码，需自行构建。
- **`@rivet-dev/pi` 0.1.0**：npm 发行的 `repository.url` 指向 `rivet-dev/rivet`（非本专题核验的 rivet-dev/agents），其运行依赖为 `pi-coding-agent` 1.0.0 而非 Pi Durable；仓库内的 Durable 版 0.5.0 尚未发布到 npm。

## 上游版本锚点

- 官方介绍：<https://earendil.com/posts/pi-durable/>（2026-10-01，随 Pi 1.0 发布，标注 experimental）。
- 核验时 `earendil-works/pi` main 为 `36a686ee8dd73afe8242011db387040890e24093`（2026-10-06）；`packages/durable` README 与两个官方示例（small coding agent、vacation planner）均以此 SHA 固定。
- npm `@earendil-works/pi-durable` 最新为 1.0.4（2026-10-05 发布）；各项目锁定的版本分布在 1.0.0–1.0.4。
