# Pi 对谈字幕复核说明

状态：AI 中文初译，待语言审校与原音核对。英文是现有 ASR 转写，并非经过逐句回听认证的原文。五条视频共 1,277 条字幕，中英文沿用相同的开始、结束时间；有些短条目需要联系前后文才能读成完整句子。

## 给翻译模型的任务

请审校 `bilingual-review.md` 中的全部中英字幕，重点检查漏译、否定词、指代、术语、数字、语气和跨条目衔接。中文用于视频字幕，应自然、简洁，避免扩写。保留说话者的观点，不把推测改成事实。

每条都有稳定 ID（视频 slug + 四位序号）及时间戳。请按 ID 返回：原译、建议译文、理由、是否需要回听。不要合并、删除、重排条目或修改时间戳；如确实需要重新分句，单独提出建议。`bilingual-review.jsonl` 是同内容的机器可读版本，每行包含 `id`、`slug`、`start`、`end`、`en`、`zh`。

遇到英文语义不通、专名不明或正反意思冲突时，请标记“需回听”，不要把语言模型猜测当作原话。没有音频的模型只能做文本审校，不能确认 ASR 是否正确。稿内的“待核／待回听”标记是草稿标记，正式审校后应处理掉。

## 术语约定

- Pi、Pi Durable、Radius、Absurd、Temporal、Effect、Jev：保留名称，注意 Effect 库和一般 effect 概念的区别。
- agent、harness、code mode：保留技术术语；agent loop 译为“agent 循环”。
- durable execution：持久化执行；durable storage / persistence：持久化存储／持久化。
- task：任务；intent：意图；effect：执行产生的副作用，字幕中根据上下文保留 effect；replay：重放。
- structured concurrency：结构化并发；checkpoint：检查点；sandbox：沙箱。
- transcript：讨论 agent 界面时译为“执行记录／会话记录”，本文件自身则称“字幕转写稿”。
- diff、commit、PR、MCP、RPC、OpenAPI、schema、token、Bash：根据中文技术语境保留或译为常用中文。

## Qwen 音频复核更新（2026-10-06）

已对全部 31 个疑点音频片段做 Qwen ASR 识别，并对 11 个片段降速复核。修正了 11 条字幕；保留所有条目 ID，仅 agent-frustrations:0013–0014 按词级时间微调边界。移除了 3 处已解决标记，仍有 5 处待核。完整证据、旧值、新值及未解决事项见 `qwen-audio-review.md`，机器可读记录见 `qwen-audio-review.json`。

以下条目已按音频识别证据或语音结合官方项目来源处理：agent-frustrations:0013–0014、harness-and-workflow:0022/0038、slippery-slop:0060、pi-durable:0457/0562/0573、changing-models:0131/0155/0251。ASR 交叉复核不等于人工听辨认证，具体分歧保留在报告中。

## 首轮回听疑点（历史清单，最新状态以上述报告为准）

以下列表并非对 ASR 错误的穷尽检查，也不是已经确认的纠错结果。

| 字幕 ID | 复核重点 |
| --- | --- |
| harness-and-workflow:0003 | 英文肯定句与后续批评冲突；初译按上下文补了否定，必须核对原音。 |
| harness-and-workflow:0022 | “comes up a manual” 初译理解为弹出菜单，需核对。 |
| harness-and-workflow:0033 | “extension to buy Pi” 疑似识别错误，初译按 Pi 扩展理解。 |
| harness-and-workflow:0038 | “only have to wait” 与后文直接要求 Pi 修改的意思冲突；初译用了“不用等”，需回听。 |
| harness-and-workflow:0041 | “marked on files” 初译理解为 Markdown 文件。 |
| agent-frustrations:0013–0014 | 重复的 “Speed” 是否为真实重复、重叠声音或 ASR 重复。 |
| slippery-slop:0001–0003 | 开头剑与安静的插话，语境不明确。 |
| slippery-slop:0057、0070 | “Astro” 初译统一为 Astra，需核对模型名。 |
| slippery-slop:0060 | “wasn't really, really bad” 与上下文相反；初译按“非常糟糕”处理，必须回听否定词。 |
| slippery-slop:0073 | “personality fans” 的准确含义。 |
| slippery-slop:0161 | “home of Simpsons car” 初译理解为 Homer Simpson 的汽车。 |
| slippery-slop:0169–0170 | 可用性“几个九”的数字转写混乱，没有编造确定数字。 |
| changing-models:0026 | “Python, why a bash” 初译按 “Python via Bash” 理解。 |
| changing-models:0041 | “token max” 的具体说法和人群指代需核对。 |
| changing-models:0085 | Fable 5、5.1、Opus 5.5 按源稿保留，需核对版本与名称。 |
| changing-models:0123–0124、0131 | diff 工具、人名和 “Climps” 框架名转写不清。 |
| changing-models:0155 | “retry, edit, bash” 疑似是 read、write、edit、Bash 的转写混淆，初稿未擅自替换。 |
| changing-models:0194 | “Chef” 根据后文初译为 Jev，需回听。 |
| changing-models:0240、0262 | Terra／Luna 和 worker 平台名称需核对。 |
| changing-models:0251 | “tour in complete” 初译为“图灵完备”。 |
| changing-models:0292、0315–0316 | “off” 按 auth（鉴权）理解。 |
| changing-models:0311 | “rack filtered” 按检索筛选理解，需核对是否为 RAG。 |
| changing-models:0345 | “full part” 不明，待回听。 |
| pi-durable:0015、0134、0137、0562 | Piedolf、earendil-works、Levos、Earendil 等专名需核对。 |
| pi-durable:0223–0224 | 英文断句和识别不完整，初译结合上下文理解为让大模型显式看见。 |
| pi-durable:0344 | 上文讨论从 JavaScript／TypeScript 跨语言重写，这里英文仍为 TypeScript，按源稿保留但需回听。 |
| pi-durable:0408 | “It's not a bet” 可能漏词，初译结合上下文处理为并非不可靠的选择，需核对。 |
| pi-durable:0457–0460 | 英文 “now entirely clear” 与后面更多代码的转折不一致；初译推断为 “not entirely clear”，必须核对否定词。 |
| pi-durable:0490–0491 | Effect 的双关／生态依赖表述，初译按上下文处理。 |
| pi-durable:0573 | “new phases” 初译理解为“新面孔”（faces），需核对。 |

## 修改与重新导出

网站的数据源是 `site/src/data/talks/*.json`：`segments[].text` 为英文，`segments[].zh` 为中文。审核意见确认后按 ID 回填 `zh`（ID 中序号减一即数组下标），再运行：

```sh
bun run --cwd site scripts/export-talk-transcripts.ts
bun run --cwd site validate
```

导出的 Markdown 和 JSONL 是审稿副本，直接修改它们不会改变网站。不要在尚未确认原音时覆盖英文 ASR 源稿。
