# 中文初译审校记录（第一遍）

日期：2026-10-06
对象：`docs/talk-transcripts/bilingual-review.jsonl`（五期共 1,277 条：harness-and-workflow 46、agent-frustrations 77、slippery-slop 196、changing-models 382、pi-durable 576）

## 方法与总体结论

逐条对照 `en` 与 `zh`，重点看漏译、否定词、指代、术语、数字、语气、跨条衔接与字幕时长；另做机械检查：否定词极性、数字留存、中英长度比、术语一致性、草稿标记流出。

结论：**整体忠实、口语自然、术语统一，没有成篇漏译或事实性误译**。全稿 1,277 条里，建议直接修改的 16 条、必须回听后定稿的 30 条（含成组的专名／残句），其余可用。问题集中在三类：

1. **ASR 掉否定词**：英文原句与上下文冲突时，初译按上下文补了否定（如 harness-and-workflow:0003、0038，pi-durable:0457）。多数补得有道理，但都属于"回听才能定稿"，不能当已确认。
2. **把断言 / 比较级译成推测或递进**：如 agent-frustrations:0075 加"可能"、0076 把比较级译成"越来越"，slippery-slop:0127 加"相应"、0173 加"越来越多"。这是最值得批量清理的一类。
3. **8 条草稿标记会随发布资源上线**：`site/src/data/talks/*.json` 里的 `segments[].zh` 仍带 ［待核／待回听］ 之类方括号，会出现在中文页字幕和 `/zh/talks/[slug].vtt`。

## 一、建议直接修改（不依赖原音）

| ID | 现译 | 建议 | 理由 |
| --- | --- | --- | --- |
| slippery-slop:0021 | 我是说，读起来很费劲。 | 我是说，看着就很费劲。 | 上文是"不想看它生成的代码"，`hard to look at` 指视觉上难看，不是语篇难读。 |
| slippery-slop:0034 | 但现在它不这么做了。 | 但现在它不跟了。 | `it doesn't` 承上省略的是"跟着现有代码风格"，原译指代不明。 |
| slippery-slop:0079 | 我发现的一个问题是，它把代码 | 我注意到的一点是，它把代码 | `one of the things that I noticed` 只是观察，"问题"是加上的定性。 |
| slippery-slop:0098 | 被训练得很擅长完成任务， | 就是被训练来把事做成的， | `trained to succeed` 只说以成功为目标，原译多了一层"擅长"的评价。 |
| slippery-slop:0105 | 眼下只剩一点小问题需要修补。 | 眼下只剩修修补补。 | `just a bug fix` 是"只是修修补补"，原译把程度说轻了，也更适合字幕时长。 |
| slippery-slop:0127 | 但那些主要业务指标并没有相应上涨， | 但那些顶线数字完全没有上涨， | `none ... at all` 是"完全没有"；`top line` 指营收等顶线数字，"相应"原文没有。 |
| slippery-slop:0173 | 处理越来越多安全报告。 | 处理所有这些安全报告。 | `all of the security reports`，原译的"越来越多"是增量推断。 |
| slippery-slop:0176 | 并没有。我可以用亲身经历告诉你。 | 但并没有。我可以用亲身经历告诉你。 | 0175 是"而且我觉得……"，这里需要转折词才接得上。 |
| agent-frustrations:0075 | 目前反而可能让问题更严重：它们写出的代码 | 眼下反倒让情况更糟了一点：它们写出的代码 | `if anything, right now are making it a little bit worse` 是断言且程度很轻，原译加了"可能"又加重成"更严重"。 |
| agent-frustrations:0076 | 越来越不想让人看，也越来越难懂。 | 看着难受得多，也难懂得多。 | `a lot less pleasant to look at and a lot harder to understand` 是与前文并列的比较级，不是递进；两处"越来越"均为原文所无。 |
| harness-and-workflow:0005 | agent 可以随时帮我写工具。 | agent 可以按需帮我写工具。 | `ad hoc tools` 指为当前需求临时专用的工具，"随时"只强调时间任意，不体现"按需／一次性"。 |
| harness-and-workflow:0022 | 问："你想怎么审查？" | 问："你想让我怎么审查？" | `how do you want me to review it` 里的 `me`（审查由 agent 执行）漏译。 |
| harness-and-workflow:0038 | 编程 harness 的开发商 | 编程 harness 的厂商 | `producer or vendor` 指厂商；顺句，可选。 |
| pi-durable:0459 | 就一定 | 也一定 | `is also definitely` 的 `also` 漏译，补上"也"后 0457–0460 的语义才完整。 |
| pi-durable:0522 | 我觉得仓库里的 vacation | 我觉得那个 vacation | 0524 已经译了"就在那个代码仓库里"，两条连读重复。 |
| pi-durable:0573 | 所以，以后的这些 Meditations 对谈里…… | 另外，以后这些 Meditations 对谈里…… | `Also` 是承接不是因果，"所以"改"另外"。 |

## 二、建议回听后才能定稿

| ID | 问题 |
| --- | --- |
| agent-frustrations:0013 / 0014 | 英文逐字重复、各占 1 秒，更像 ASR 把一句话拆成两条；若原音只说一次应合并，不能各留半句。 |
| harness-and-workflow:0003 | 英文是肯定句 `I want ... to work according to his workflow`，但 0004 说"那太糟糕了"，初译补了否定；需确认原音是否掉了 don't。 |
| harness-and-workflow:0022 | `comes up a manual` 初译成"弹出一个菜单"；后续三条确实是选项列表，菜单读法可能对，但 `manual` 与 menu 差距需要原音确认。 |
| harness-and-workflow:0033 | `extension to buy Pi in, what was it?` 是明显 ASR 噪声，按"Pi 扩展"理解与下文 `An hour?` 的时长对话衔接一致，倾向保持现译，需回听确认。 |
| harness-and-workflow:0038 | `I only have to wait` 被译成"我不用等"，同 0003 的掉否定词模式；语境支持现译，需回听确认。 |
| harness-and-workflow:0041 | `marked on files` 疑为 `Markdown files` 的误识别。现译补出 Markdown 有判断风险：若确认是 Markdown 可保留，否则应改成"带有示例和 API 说明的文件"。 |
| slippery-slop:0060 | 英文 `it wasn't really, really bad` 是否定，现译"代码真的非常糟"；0062 又说"write code this bad"，两种读法都能自圆，必须回听。 |
| slippery-slop:0070（及 0057） | 英文源自身不一致：0019/0097/0350 写 Astra，0057/0070 写 Astro；译文统一成 Astra。需确认模型名到底是哪个。 |
| slippery-slop:0073 | `personality fans` 指代不明，现译"追捧模型个性的人"是保守读法。 |
| slippery-slop:0169 / 0170 | `999s going into the 9100 territory` 是可用性"几个九"的口语表达，数字转写混乱；现译只剩方括号标记。0170 建议先去掉方括号、回听后补数字，并让 0169 用逗号收尾以便接续。 |
| slippery-slop:0193 | `clanker` 是俚语蔑称，全稿仅此一处；现译"铁皮脑袋"属临时造词，需定保留原词还是意译。 |
| pi-durable:0137 | `which is called Levos` 的 Levos 无法核实。 |
| pi-durable:0344 | 上文强调跨语言可移植，这里英文却仍是 `TypeScript`，与"用另一种语言重新实现"矛盾，疑 ASR 误听。 |
| pi-durable:0223 / 0224 | 英文断句和识别不完整（`it's like S in your face. So did the LLM.`），现译按上下文重组为"把信息直接摆出来 / 让大模型看见"。 |
| pi-durable:0408 | `It's not a bet` 现译"这并不是说它是不可靠的选择"，"bet"的落点需确认；该条只有 0.6 秒，14 个字的现译偏长，回听后再压短。 |
| pi-durable:0457–0460 | 有两种读法：按英文直译是肯定"现在已经完全清楚，Effect 方案也一定更适合 agent"；但 0461 起 `because ... you end up ironically with more code` 更像在说"还不能确定"，即原音可能掉了 not。现译"还不能完全确定"在中文里能自洽，但必须回听定否定词，定稿前不要留在字幕里的方括号。 |
| pi-durable:0562 | `Arundel products` 被规范化成"Earendil 产品"（0134 的仓库名是 earendil-works）；是合理补正，但属于改动原话用词，需回听。 |
| pi-durable:0573 | `new phases coming up on these meditations` 现译"出现一些新面孔"，phases/faces 需原音确认。 |
| changing-models:0026 | `For, yeah, well, Python, why a bash?` 明显错乱；现译"通过 Bash 来运行 Python"是语境猜测，需原音确认。 |
| changing-models:0041 | `token max of the world` 疑为 `token maxxers`；现译"首先就是"是增补。后半句 `what the transcript is one` 是残句。 |
| changing-models:0085 | `which is Fable 5, 5.1 and Opus 5.5 uses` 模型名与版本可疑；现译"包括……都"可改成"也就是……都"，名称仍需回听。 |
| changing-models:0124 | `the Tunk, then for modems` 是工具名残句，现译只剩方括号；建议先去掉标记，回听补名。 |
| changing-models:0131 | `Daniel's Climps framework` 框架名可疑，同上。 |
| changing-models:0155 | `retry, edit, bash` 疑为 `read, write, edit, Bash` 的误识别（review-notes 已有此猜测）；是三种还是四种工具，必须回听。 |
| changing-models:0194 | `Chef` 应为 `Jev`（0365 明确出现 Jev）；建议去掉草稿标记并回听复核。 |
| changing-models:0240 | `haiku / terra / lunar model` 的模型名拼写需核对（Luna？）；否定词按上下文补，须回听。 |
| changing-models:0251 | `We should tour in complete` 应为 Turing complete 的误识别；现译"通常"可能是原文没有的限定，需回听。 |
| changing-models:0262 | `oversell workers` 平台名不清，建议先去掉标记，回听补名。 |
| changing-models:0311 | `rack filtered` 疑为 `RAG-filtered`（也可能 rank），现译"检索筛选"是保守读法。 |
| changing-models:0345 | `you're kind of, you're kind of, yeah, full part` 语义不明，现译只剩方括号，需回听。 |

## 三、全局问题

### 1. 草稿标记会出现在正式页面

以下 8 条的 `zh` 仍带方括号注释，已随数据进入 `site/src/data/talks/*.json`，会显示在中文页视频字幕、侧栏与 `/zh/talks/[slug].vtt`：

```
pi-durable:0457         site/src/data/talks/pi-durable.json
changing-models:0124    site/src/data/talks/changing-models.json:839
changing-models:0131    site/src/data/talks/changing-models.json:881
changing-models:0155    site/src/data/talks/changing-models.json:1025
changing-models:0194    site/src/data/talks/changing-models.json:1259
changing-models:0262    site/src/data/talks/changing-models.json:1667
changing-models:0345    site/src/data/talks/changing-models.json:2165
slippery-slop:0170      site/src/data/talks/slippery-slop.json:1105
```

发布前应当：回听定稿的换成真实译文；暂时无法回听的，至少改成不露痕迹的保守译法（或按产品取舍决定先下架该条），把说明留在 `review-notes.md` 里，而不是留在字幕里。

### 2. 同一模式的其他实例（程度／情态词）

除上表几条外，全稿还有几处把原文的断言或比较级译软／译重，量级不大，但属于同一种习惯，回填时可一并对齐：

| ID | 现译 | 建议 |
| --- | --- | --- |
| changing-models:0018 | 你现在越来越擅长这个了。 | 你现在真的很擅长这个了。（`really good at this now`） |
| changing-models:0280 | 很多自定义工具可能要走到尽头了。 | 很多自定义工具要走到尽头了。（`it's the end of custom tools`） |
| pi-durable:0449 | 它可能不会有多少结构。 | 它通常不会有多少结构。（`would otherwise not have a lot of it`） |
| agent-frustrations:0008 | 那些真正棘手的问题，似乎并没有解决。 | 那些真正棘手的问题并没有解决。（`didn't really feel like ... are solved`） |

### 3. 术语与数字

- 术语一致：transcript 统一"执行记录"（pi-durable:0144 的 "session transcript" 译"会话记录"，属合理区分）；durable execution=持久化执行、sandbox=沙箱、checkpoint=检查点、replay=重放、structured concurrency=结构化并发，未发现漂移。
- 数字全部保留正确：18 months→十八个月、12 months→十二个月、100x→一百倍、25%→四分之一、100%→百分之百，唯一不确定的是 slippery-slop:0169–0170。
- 时长：全稿中文字数/英文词数没有超长条目，短条目均为跨条拆分，属正常；没有任何一条超过发布检查的 8 秒上限。
- 回归基线：`bun run --cwd site test` 62 项 + `test:rendered` 34 项，共 96 项全部通过（与状态摘要中的"96 项测试"一致）；改动回填后重跑一次即可。

### 4. 机械扫描（否定词极性）

对全稿做了"英文有否定/中文没有"及反向的扫描。绝大多数命中是"不同／不错／不确定"这类词内"不"，以及跨条拆分；真正需要看的是上文第二类里列出的条目。这份扫描建议在回填修正后再跑一次，作为回归检查。

## 四、后续动作

1. 确认第一节的 16 条改法后，按 ID 回填 `site/src/data/talks/*.json` 的 `segments[].zh`（ID 序号减一即数组下标）。
2. 回听第二节的条目，逐条定稿；未定稿前不要移除标记对应的输入来源，但不要把标记留在发布字幕里。
3. 重新导出并验证：

```sh
bun run --cwd site scripts/export-talk-transcripts.ts
bun run --cwd site validate
```

## 五、第一节修正回填记录

2026-10-06：第一节列出的 16 条已回填至 `segments[].zh`。表格中的“现译”保留为审校时的历史记录。仅修改建议涉及的片段，保留同条中仍需回听的内容（如 harness-and-workflow:0022 的菜单、0038 的否定词，以及 pi-durable:0573 的新面孔）。未修改英文、分段或时间戳。第二节回听事项与第三节额外建议尚未处理，8 条草稿标记仍需在发布前定稿。

## 六、Qwen 音频复核更新

后续已完成 31 段原速与 11 段降速 ASR 复核，并修正 11 条字幕。第一遍所述“8 条草稿标记”现剩 5 条；本文件原始审校意见保留作历史记录。详见 [Qwen 音频复核记录](qwen-audio-review.md)，其中包含每条修改前后内容及剩余疑点。
