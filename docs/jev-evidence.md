# Jev 专题核验记录

本轮核验日期：2026-09-22（北京时间）。范围为作者原帖、GitHub 官方 API、固定提交源码与 npm 发行元数据；未读取用户 Key，未安装或执行候选包，未调用真实付费判定 API。证据状态为 `source-reviewed`，不代表运行验收或效果背书。下方保留 2026-09-21 的四项历史记录，旧版本结论只适用于当时的固定版本。

## 本轮主推与补充实现

主推覆盖工具判断、工作流监督、工具与技能路由、按需技能加载、任务边界模型路由。Stars 为本轮 GitHub 官方 API 快照，用于记录关注度，不等于质量、安装量或效果；热帖归属另行核对。

| 展示 | 资源与用途 | Stars | 本轮固定证据 | 安装来源 |
| --- | --- | ---: | --- | --- |
| 主推 | y0usaf/pi-jev：工具风险判定、输出检查与 `jev_ask` | 131 | npm `@y0usaf/pi-jev` 0.2.0，发行 `gitHead` 为 `9d7ff701fcde7f1100c309ce670e85c9a9db4264`；可访问源码提交 [`1b493375ef52e6d8f59dfe83e84402b024536625`](https://github.com/y0usaf/pi-jev/commit/1b493375ef52e6d8f59dfe83e84402b024536625) | [scoped npm 发行](https://registry.npmjs.org/@y0usaf%2fpi-jev/0.2.0) |
| 主推 | DevMortimer/pi-warden：行动、规则、完成声明等工作流监督 | 124 | npm 0.34.1 / [`784104a167bffb94cd0f6f48f3c1f92acf4b4f40`](https://github.com/DevMortimer/pi-warden/commit/784104a167bffb94cd0f6f48f3c1f92acf4b4f40) | [npm 0.34.1 发行](https://registry.npmjs.org/pi-warden/0.34.1) |
| 主推 | TheoOliveira/pi-jev：工具与技能路由、结构化判断 | 30 | npm 0.5.0 / [`549c2bfa249269d0f5590658b5743801c47af369`](https://github.com/TheoOliveira/pi-jev/commit/549c2bfa249269d0f5590658b5743801c47af369) | [npm pi-jev 0.5.0](https://registry.npmjs.org/pi-jev/0.5.0) |
| 主推 | safzanpirani/pi-jev-skill-picker：替换常驻技能目录，按需检索和加载 | 22 | [`d6ce0120698d77d0c667e72b578816bed1cb58ef`](https://github.com/safzanpirani/pi-jev-skill-picker/commit/d6ce0120698d77d0c667e72b578816bed1cb58ef) | [作者 Git 安装说明](https://github.com/safzanpirani/pi-jev-skill-picker/blob/d6ce0120698d77d0c667e72b578816bed1cb58ef/README.md) |
| 主推 | win4r/pi-jev-router：任务边界模型路由 | 8 | [`319a04482ab060268afe31ff29d51c77119114cd`](https://github.com/win4r/pi-jev-router/commit/319a04482ab060268afe31ff29d51c77119114cd) | [作者 Git 安装说明](https://github.com/win4r/pi-jev-router/blob/319a04482ab060268afe31ff29d51c77119114cd/README.md) |
| 补充 | QuentinDanblon/pi-fast-jev-compaction：工具历史裁剪 | 2 | 0.1.0 / [`679041b8511515c9a0fcebd617afebabd87ae7f6`](https://github.com/QuentinDanblon/pi-fast-jev-compaction/commit/679041b8511515c9a0fcebd617afebabd87ae7f6) | 作者 Git 安装 |
| 补充 | KamilPostrozny/pi-jev-code：代码辅助判断 | 0 | 0.5.2 / [`6a6aa02e839e7953ab9fabb79e1cf247973e77c9`](https://github.com/KamilPostrozny/pi-jev-code/commit/6a6aa02e839e7953ab9fabb79e1cf247973e77c9) | 克隆、安装运行依赖、Pi 安装本地目录 |
| 补充 | da-vinci-noob/pi-jev-model-router：预算与模型路由策略 | 1 | npm 0.3.0 / [`5ca26ca1dac255252d9a83341dec0813301c8f97`](https://github.com/da-vinci-noob/pi-jev-model-router/commit/5ca26ca1dac255252d9a83341dec0813301c8f97) | 已核验 npm 发行 |

功能分类仍由目录维护，专题不另建 Jev 分类。安装命令、仓库名与 npm 名须分别核对，不能从显示名称推导安装来源。y0usaf 0.2.0 的发行 `gitHead` 未能通过 GitHub compare 解析；已将 npm tarball 的 `README.md`、`src/index.ts`、`src/config.ts` 与可访问的 `1b493375…` 源码逐字节比较，三者一致。页面使用发行版本标识，源码证据链接使用上述可访问提交，不伪造无法访问的固定链接。

## 热点归因与同名纠偏

公开 X syndication 响应采集于 2026-09-22 00:52:52（北京时间），只记录可见点赞数；浏览、转帖、书签数未经核实，不引用。

| 原帖 | 当时点赞数 | 能支持的归属 |
| --- | ---: | --- |
| [AISuperDomain](https://x.com/AISuperDomain/status/2101672841896706266) | 96 | 卡片标题、描述与短链 `t.co/HnsKpW4fge` 均指向 **win4r/pi-jev-router**；GitHub 作者资料也反链此账号。不能归给 philippdubach 或 da-vinci-noob 的同类仓库。 |
| [NotThatTheo](https://x.com/NotThatTheo/status/2101512459307680228) | 7 | 直接链接 TheoOliveira/pi-jev **v0.4.0** 发布；本轮包核验已经是 0.5.0，不能将原帖版本改写为 0.5.0。 |
| [zhouluobo](https://x.com/zhouluobo/status/2101452286270792061) | 1103 | 泛 Jev 项目合集，已解析链接包含 tamaratran/fast-jev-compaction；不能当作某个 Pi 移植版本的单独热度。 |
| [0xRicker](https://x.com/0xRicker/status/2101705843200721203) | 1451 | 泛 Jev Engineering 讨论，不能归因给本专题任一插件。 |

三个安装歧义必须保留：

1. `npm:pi-jev` 属于 TheoOliveira；y0usaf 使用 `npm:@y0usaf/pi-jev`；madeye 的同名 Git 仓库在 package 中为 `private: true`，使用 Git 来源。y0usaf 与 madeye 还都注册 `/jev`，不要推荐读者无差别同时启用。
2. [npm pi-jev-router 0.4.0](https://registry.npmjs.org/pi-jev-router/0.4.0)的 repository 指向 **mejiasd3v/pi-jev-router**。win4r 与 philippdubach 都不能套用此 npm 安装命令。
3. [npm pi-fast-jev-compaction 0.2.0](https://registry.npmjs.org/pi-fast-jev-compaction/0.2.0)指向 ross-jill-ws；本专题补充项是 QuentinDanblon 的 Git 安装。Joelhooks scoped 包核验时尚无 npm 发行，作者也推荐 Git 安装。

## Warden 0.34.1：发行包与固定源码核验

已从[官方发行元数据](https://registry.npmjs.org/pi-warden/0.34.1)取得 tarball，校验公开 `dist.integrity` 通过，只读解包并交叉阅读 `dist/` 实现与固定提交。发行入口 `extensions/index.js` 转发到 `dist/extension.js`。运行依赖为 `pi-typesafe: ^0.6.1`，不是旧版本内置客户端；Node 要求 `>=22.19.0`，Pi coding-agent/tui peer 范围为 `>=0.85.1 <1`。[固定 package.json](https://github.com/DevMortimer/pi-warden/blob/784104a167bffb94cd0f6f48f3c1f92acf4b4f40/package.json)

### 启用、Key 与 backend

- 安装后 `enabled: true`、`typesafe: false`：离线模式识别、重复输出停止、凭证形状提示等已可运行，云端判定尚未授权。`/warden enable` 确认外发声明后录入或复用 Key；跳过 Key 保持离线。`/warden disable` 关闭云端判定，关闭整个扩展另需 `enabled: false`。[默认配置](https://github.com/DevMortimer/pi-warden/blob/784104a167bffb94cd0f6f48f3c1f92acf4b4f40/src/config.ts#L312)、[启用实现](https://github.com/DevMortimer/pi-warden/blob/784104a167bffb94cd0f6f48f3c1f92acf4b4f40/src/extension.ts#L1252)
- 默认 `typesafeBackend: "typesafe"`，使用 `TYPESAFE_API_KEY` 或共享的 `~/.pi/agent/pi-typesafe/auth.json`，环境变量优先；交互写入为 owner-only。可选 `openrouter` backend 使用 `OPENROUTER_API_KEY`，由用户配置选择，不能由项目重定向。已静态核查 [pi-typesafe 0.6.1](https://registry.npmjs.org/pi-typesafe/0.6.1) 的 credentials/client/login：默认 TypeSafe 模型为 `jev-latest`，OpenRouter 为 `typesafe/jev-1.13`。[Warden backend 适配](https://github.com/DevMortimer/pi-warden/blob/784104a167bffb94cd0f6f48f3c1f92acf4b4f40/src/backend.ts)
- `/warden test` 在云端 judge 可用时会发送真实的合成判定请求，可能计费，不是永远离线的自检。本轮未调用。无界面使用 `PI_WARDEN_ENABLED=1` 明确授权，并配置所选 backend 的 Key。[测试分支](https://github.com/DevMortimer/pi-warden/blob/784104a167bffb94cd0f6f48f3c1f92acf4b4f40/src/extension.ts#L1368)

### 外发数据与脱敏边界

开启云端判定后，Action 请求包括截断、尽力脱敏的最新用户请求（1500 字符）、至多八条历史消息（各 750）、agent 计划（500）、命令（2000）或路径、文件是否存在、write 内容样本（1500）或前三组 edit 文本（各 400）。其他 guard 还可能发送规则、较大代码样本、失败工具结果、最终回复、输出样本及需要处理的子代理异常报告。[请求构造](https://github.com/DevMortimer/pi-warden/blob/784104a167bffb94cd0f6f48f3c1f92acf4b4f40/src/guard.ts#L966)、[完整数据说明](https://github.com/DevMortimer/pi-warden/blob/784104a167bffb94cd0f6f48f3c1f92acf4b4f40/docs/data-handling.md)

Action 分支即使关闭 Rules guard，仍会读取并附带项目规则文本。其实际 resolver 依次查找 `pi-warden.md`、`README.md`、`CLAUDE.md`、`AGENTS.md`；内容超长时约按 4000 token 的字符估算提取。不要把 Rules guard 的路径排除或关闭说成所有外发路径的隔离开关。[规则文件 resolver](https://github.com/DevMortimer/pi-warden/blob/784104a167bffb94cd0f6f48f3c1f92acf4b4f40/src/rules-file.ts#L58)

凭证替换覆盖 Authorization、常见 key/token/password 赋值、带密码 URL、PEM、GitHub/AWS/Slack/JWT 等形状，属于 best-effort，不能承诺“秘密绝不外发”。压缩前完整工具输出另有本地私有临时副本，可能含敏感信息；脱敏后的持久 hold 上下文用于本地学习，默认保留 365 天。[脱敏实现](https://github.com/DevMortimer/pi-warden/blob/784104a167bffb94cd0f6f48f3c1f92acf4b4f40/src/redact.ts)、[本地留存说明](https://github.com/DevMortimer/pi-warden/blob/784104a167bffb94cd0f6f48f3c1f92acf4b4f40/docs/data-handling.md)

### 故障、模式与项目覆盖

默认模式为 `steer`：可暂缓危险调用并告诉代理原因，让其重规划或询问用户。`confirm` 无 UI 时退回 `steer`。`advise` 的语义判定不暂缓操作，但不能写成“任何情况下绝不阻断”：用户定义的 deny 规则仍阻断，显式 dialog 规则在有 UI 时仍请求确认。[模式解析与交付](https://github.com/DevMortimer/pi-warden/blob/784104a167bffb94cd0f6f48f3c1f92acf4b4f40/src/extension.ts#L141)

默认 `action.failOpen: true`、`action.floor: "evidence"`。judge 可用时，内置危险模式作为判定证据，不单独决定等级；judge 失败时恢复内置规则等级，已有用户规则也保留。没有规则命中时才按 fail-open 不新增语义暂缓。`failOpen: false` 则至少升至确认等级。默认请求上限 500 次/会话、超时 5000ms，达到预算后继续离线检查。[实际故障分支](https://github.com/DevMortimer/pi-warden/blob/784104a167bffb94cd0f6f48f3c1f92acf4b4f40/src/guard.ts#L1030)

仅在 Pi 信任项目后读取 `.pi/pi-warden.json`。**源码不保证项目只能收紧防护**：项目可替换工具列表、改变阈值和 `failOpen`，甚至关闭某个 guard 或整个扩展。它不能授予外发同意、切换 backend/mode、改变全局请求预算/超时、设置通知命令，也不能修改用户定义的 command/path/arming/exempt 规则或 `floor`。上游文档“stricter thresholds / extra guarded tools”的表述比实现更窄，页面采用实现边界。[applyAction](https://github.com/DevMortimer/pi-warden/blob/784104a167bffb94cd0f6f48f3c1f92acf4b4f40/src/config.ts#L540)、[applyProjectOverrides 与信任检查](https://github.com/DevMortimer/pi-warden/blob/784104a167bffb94cd0f6f48f3c1f92acf4b4f40/src/config.ts#L743)

## 其他候选与效果边界

- Theo 0.5.0 的 README 称 auto 每个 prompt 一次请求；实际 `src/auto.ts` 并行执行工具、技能两个 router，两边均有候选时可各发一次判定，SDK 重试另计。`src/model-router.ts` 的 auto-model 是本地启发式，不能称为 Jev 分类模型路由。[固定 auto 实现](https://github.com/TheoOliveira/pi-jev/blob/549c2bfa249269d0f5590658b5743801c47af369/src/auto.ts)、[模型路由实现](https://github.com/TheoOliveira/pi-jev/blob/549c2bfa249269d0f5590658b5743801c47af369/src/model-router.ts)
- 技能选择器的 token/费用数字来自作者特定技能目录和请求，不作为本站实测。它将常驻技能目录从有效系统提示中移除，提供 `skill_search` / `skill_load`；无 Key 或全部判定失败时有词法回退。[固定源码](https://github.com/safzanpirani/pi-jev-skill-picker/blob/d6ce0120698d77d0c667e72b578816bed1cb58ef/extensions/skill-jev.ts)
- philippdubach/pi-jev-router（14 星，[`b9650e680795c39cfd8e967e2bf6214aa8efa32c`](https://github.com/philippdubach/pi-jev-router/commit/b9650e680795c39cfd8e967e2bf6214aa8efa32c)）是另一种 OpenRouter 模型选择实现，默认 shadow、需要 OpenRouter Key；不能继承 win4r 原帖热度，也不能使用同名 npm 包。五任务作者实验不足以承诺普遍节省比例。
- madeye/pi-jev（11 星，[`c32325942e782a9d2fa4839388ac122978a9b1d9`](https://github.com/madeye/pi-jev/commit/c32325942e782a9d2fa4839388ac122978a9b1d9)）专注文件检索、证据排序与请求缓存。无 hosted Key 仍可本地检索；自托管兼容服务是可选项。Node ≥22，Pi peer 限制为 ≥0.85.1、<0.86.0，不宣称直接加速模型推理。
- joelhooks/pi-fast-jev-compaction（8 星，[`eb83f533f4fd10a08728b02c062c249afda5a4dc`](https://github.com/joelhooks/pi-fast-jev-compaction/commit/eb83f533f4fd10a08728b02c062c249afda5a4dc)）与 Quentin 版本**同源于 tamaratran/fast-jev-compaction**。Joelhooks 的 [THIRD_PARTY_NOTICES](https://github.com/joelhooks/pi-fast-jev-compaction/blob/eb83f533f4fd10a08728b02c062c249afda5a4dc/THIRD_PARTY_NOTICES.md) 明确移植 `src/core`；Quentin 的 [PROVENANCE](https://github.com/QuentinDanblon/pi-fast-jev-compaction/blob/679041b8511515c9a0fcebd617afebabd87ae7f6/vendor/fast-jev-compaction/PROVENANCE.md) 固定同一上游 `e3f262a7f4d42bd8dd32ced30d26176f7cb545b0`。两份 `questionsFor` 的判定问题相同，适配层则分别有 XState/ledger 和后台评分/只读调用限制等差异。没有证据证明两者互为 GitHub fork，也不能据 8 星与 2 星认定前者更成熟。

模型跑分、热帖中的加速倍数、作者单机 token 或成本实验均不转写为本专题插件的效果承诺。本轮仅更新静态证据与编辑数据，不为文案字面量增加测试；页面与交互检查由本轮实现验收记录。

## 2026-09-21 历史记录（保留）

以下为当日固定版本核验，**其中 Warden 0.28.4 不再代表当前 npm 版本**。当日未使用用户 Key，未执行真实 Jev 请求，未将第三方插件安装到用户 Pi 环境；四项证据状态均为 `source-reviewed`。

### 当日核验版本与目录归属

| 资源 | 目录分类 | 核验版本 / 提交 | 安装依据 |
| --- | --- | --- | --- |
| pi-fast-jev-compaction | Context Management | v0.1.0 / `679041b8511515c9a0fcebd617afebabd87ae7f6`，2026-09-18 | 候选作者 README 的 Git 安装命令 |
| pi-jev-code | Dev Tools & Code Intelligence | v0.5.2 / `6a6aa02e839e7953ab9fabb79e1cf247973e77c9`，2026-09-17 | 克隆后运行 `install.sh`，再用 Pi 安装本地路径 |
| pi-warden | Security & Permission | npm v0.28.4 / `725d05e3dd7e4d16d7c2dfba11d8cb9085144cad`，2026-09-19 | 已发布 npm 版本、发行 tarball 与对应 `gitHead` |
| pi-jev-model-router | Utilities | npm v0.3.0 / `5ca26ca1dac255252d9a83341dec0813301c8f97`，2026-09-21 | npm 发行 `gitHead` 与仓库一致 |

四项仍属功能分类，专题仅按资源名称引用 catalog，不新增 Jev 分类，也不自动发布四个包详情页。基础安装命令仅保存在两份 README 中；专题配置与依赖准备步骤放在编辑内容中。

### 当日影响选型的核验纠偏

1. **同名 npm 包不等于候选仓库。** [pi-fast-jev-compaction 0.2.0 的 npm 元数据](https://registry.npmjs.org/pi-fast-jev-compaction/0.2.0)指向 `ross-jill-ws`，而计划候选是 `QuentinDanblon`；本项目明确使用后者的 Git 安装命令。[候选安装说明](https://github.com/QuentinDanblon/pi-fast-jev-compaction/blob/679041b8511515c9a0fcebd617afebabd87ae7f6/README.md)
2. **pi-jev-code 没有可用的 npm 发布项。** 核验时注册表 `/pi-jev-code/latest` 返回 HTTP 404。README 与 `install.sh` 要求本地目录先安装运行依赖；目录中的安装路径是用户需要替换的占位路径。[安装脚本](https://github.com/KamilPostrozny/pi-jev-code/blob/6a6aa02e839e7953ab9fabb79e1cf247973e77c9/install.sh)
3. **pi-warden 的 main 超前于 npm。** main 清单为 0.33.3，npm latest 为 0.28.4。已下载 0.28.4 tarball 查阅编译实现，并根据 npm `gitHead` 读取对应源码与文档；专题不将 main 后续调整套用到发行包。[发行元数据](https://registry.npmjs.org/pi-warden/0.28.4)
4. **路由预算不是消费硬上限，预算字段仍会外发。** 本地策略按消费压力降档，不阻断任务。尽管任务问题要求模型忽略费用，实际 `buildState` 仍将消费累计、额度和预算压力连同工作目录、当前模型等字段发给 TypeSafe。[真实请求结构](https://github.com/da-vinci-noob/pi-jev-model-router/blob/5ca26ca1dac255252d9a83341dec0813301c8f97/extensions/pi-jev-model-router/jev.ts)
5. **确认模式的无界面行为不同。** 路由器没有选择器时 `confirm` 自动切换，纯观察应选 `notify`；Warden 在无界面时将 `confirm` 回退为 `steer`。[路由器实现](https://github.com/da-vinci-noob/pi-jev-model-router/blob/5ca26ca1dac255252d9a83341dec0813301c8f97/extensions/pi-jev-model-router/index.ts)、[Warden 配置](https://github.com/DevMortimer/pi-warden/blob/725d05e3dd7e4d16d7c2dfba11d8cb9085144cad/src/config.ts)
6. **失败不一定代表全部恢复原文或全部放行。** 裁剪器失败批次保持未评分，已有缓存判定仍可生效；配对校验失败才回退原始消息。Warden 默认 `failOpen` 不新增语义拦截，已有本地规则拦截仍保留。[裁剪器实现](https://github.com/QuentinDanblon/pi-fast-jev-compaction/blob/679041b8511515c9a0fcebd617afebabd87ae7f6/index.ts)、[Warden 故障分支](https://github.com/DevMortimer/pi-warden/blob/725d05e3dd7e4d16d7c2dfba11d8cb9085144cad/src/guard.ts)

### 当日效果证据边界

[TypeSafe 官方发布文](https://typesafe.ai/blog/introducing-system-one-models-and-jev)的模型性能数字没有作为四个插件的效果承诺。裁剪器的 31.8% / 37.7% 来自作者对两段截图密集会话的回放估算，包含特定缓存价格假设，不是本站实测。模型的结构化输出、编辑风险分数、Warden 判定均不能代替测试或证明安全。

### 当日本地校验

静态编辑数据免于为文字内容新增 TDD 测试。运行现有行为校验：

```text
$ cd site && bun test tests/catalog.test.ts
11 pass
0 fail
328 expect() calls
```

`python3 -m json.tool site/src/data/topics/jev.json` 与 `git diff --check` 均退出 0。页面渲染、双语路由和交互验证由全站发布验收覆盖。
