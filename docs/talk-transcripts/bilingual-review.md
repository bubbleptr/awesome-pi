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

---

# 完整中英对照稿

## 2026-10-05 · Pi Durable：为什么不用 Temporal 或 Effect？

Pi Durable: why not Temporal or Effect?

原帖：https://x.com/pidotdev/status/2107033061905104941

视频：https://video.twimg.com/amplify_video/2107019854444105728/vid/avc1/1920x1080/e3D_PEsyOuREeNzs.mp4?tag=29

共 576 条字幕。

### pi-durable:0001 · 00:00.000 → 00:02.040

EN: Why Durable?

ZH: 为什么要做 Durable？

### pi-durable:0002 · 00:02.040 → 00:08.580

EN: So Pi, the coding agent, has historically been you are a single human,

ZH: Pi 这个编程 agent，过去的典型用法是：你一个人，

### pi-durable:0003 · 00:08.580 → 00:12.640

EN: you sit in front of a computer or you have a remote machine and you SSH into it.

ZH: 坐在电脑前，或者通过 SSH 连到一台远程机器。

### pi-durable:0004 · 00:12.640 → 00:18.600

EN: And you start your Pi session, you do a thing and you stop the Pi session and then you usually don't care about the session anymore.

ZH: 启动 Pi 会话，做点事情，然后结束会话，通常之后就不再关心这个会话了。

### pi-durable:0005 · 00:18.600 → 00:22.620

EN: So it's more like a one-to-one relationship, the sessions are ephemeral,

ZH: 所以它更像是一对一的关系，会话基本上是临时的，

### pi-durable:0006 · 00:22.620 → 00:28.680

EN: more or less, and everything fits snugly into memory as well because Pi

ZH: 而且所有东西都能轻松放进内存，因为 Pi

### pi-durable:0007 · 00:28.680 → 00:35.580

EN: historically loads the entire session into memory just to do a bunch of things.

ZH: 一直以来都会把整个会话加载到内存里，再做各种操作。

### pi-durable:0008 · 00:36.020 → 00:42.540

EN: It's not entirely necessary, it's just a historical artifact stemming from the fact that it's a one-on-one ephemeral session,

ZH: 这并不是完全必要的，只是历史原因：它本来就是一对一的临时会话，

### pi-durable:0009 · 00:42.540 → 00:44.240

EN: usually not super long, right?

ZH: 通常也不会特别长，对吧？

### pi-durable:0010 · 00:44.240 → 00:49.480

EN: However, does that fit all agentic applications?

ZH: 但这适合所有 agent 应用吗？

### pi-durable:0011 · 00:49.480 → 00:51.400

EN: I guess the answer is no.

ZH: 我想答案是否定的。

### pi-durable:0012 · 00:52.620 → 00:58.900

EN: If you want to have a Slack bot that stays with you for years and years and can answer multiple

ZH: 如果你想要一个陪你运行很多年、能同时回答多个

### pi-durable:0013 · 00:58.900 → 01:03.480

EN: people in parallel or have threads and answer there,

ZH: 用户，或者在线程里回复的 Slack 机器人，

### pi-durable:0014 · 01:03.480 → 01:04.920

EN: Pi is not your best option.

ZH: Pi 就不是最佳选择了。

### pi-durable:0015 · 01:04.920 → 01:09.140

EN: It can be done and we have like Piedolf, our Discord bot,

ZH: 当然也能做，比如我们有一个 Discord 机器人 Piedolf，

### pi-durable:0016 · 01:09.140 → 01:13.140

EN: who's been asleep for a couple of months because it was not so useful.

ZH: 不过它已经休眠了几个月，因为没那么有用。

### pi-durable:0017 · 01:14.240 → 01:18.740

EN: But it's kind of not what Pi the coding agent was built for.

ZH: 但这种场景确实不是 Pi 编程 agent 最初的设计目标。

### pi-durable:0018 · 01:19.780 → 01:24.580

EN: So earlier this summer we decided we needed a different kind of substrate,

ZH: 所以今年夏天早些时候，我们决定需要一种不同的底层基础，

### pi-durable:0019 · 01:24.580 → 01:27.360

EN: a different kind of framework or library or whatever you want to call it,

ZH: 一种不同的框架、库，随便你怎么称呼，

### pi-durable:0020 · 01:28.200 → 01:33.820

EN: that allows you to model this kind of agent or agentic application as well.

ZH: 让你也能构建这类 agent 或 agent 应用。

### pi-durable:0021 · 01:33.820 → 01:39.480

EN: Long-running agents, multiplayer, there's multiple users or other agents can interact

ZH: 长期运行的 agent、多人协作、多个用户或者其他 agent

### pi-durable:0022 · 01:39.480 → 01:40.840

EN: with each other.

ZH: 相互交互。

### pi-durable:0023 · 01:42.740 → 01:46.460

EN: And not everything should be in RAM, in memory in total.

ZH: 而且不应该把所有东西都完整地放在内存里。

### pi-durable:0024 · 01:47.140 → 01:48.880

EN: And it should be able to run anywhere.

ZH: 它还应该能在任何地方运行。

### pi-durable:0025 · 01:49.200 → 01:53.500

EN: Like Pi is obviously mostly bound to a computer-like system.

ZH: Pi 显然主要依赖于类似完整计算机的系统。

### pi-durable:0026 · 01:53.500 → 01:57.320

EN: We also want to run on Vercel, on Cloudflare,

ZH: 我们也想让它运行在 Vercel、Cloudflare、

### pi-durable:0027 · 01:57.320 → 02:00.520

EN: on E2B, on whatever you can come up with,

ZH: E2B，或者你能想到的其他平台上，

### pi-durable:0028 · 02:01.060 → 02:07.700

EN: where the computing substrate is potentially different than a process in an operating system.

ZH: 这些平台的计算环境可能并不是操作系统里的一个进程。

### pi-durable:0029 · 02:07.840 → 02:14.100

EN: For example, Cloudflare, Durable Objects, it's an entirely different execution model than what you have in a process in Node

ZH: 比如 Cloudflare Durable Objects，它的执行模型就完全不同于

### pi-durable:0030 · 02:14.100 → 02:15.940

EN: on your Mac or Windows machine.

ZH: 你在 Mac 或 Windows 机器上运行的 Node 进程。

### pi-durable:0031 · 02:16.860 → 02:19.080

EN: So yeah, and that was how Durable was born.

ZH: Durable 就是这样诞生的。

### pi-durable:0032 · 02:19.080 → 02:25.380

EN: And I think it's also kind of useful to just point out what maybe some of the

ZH: 我觉得也有必要指出，

### pi-durable:0033 · 02:25.380 → 02:28.900

EN: classical limitations are of Pi's existing session model.

ZH: Pi 现有的会话模型有哪些典型限制。

### pi-durable:0034 · 02:29.460 → 02:34.640

EN: And why it works quite well for the Pi coding agent, but like why it shows some limits.

ZH: 为什么它很适合 Pi 编程 agent，却也会显露出局限。

### pi-durable:0035 · 02:34.880 → 02:39.520

EN: And actually I think like to a large degree, those limitations are also shared with a lot of other agents.

ZH: 其实我觉得，很大程度上其他很多 agent 也有这些限制。

### pi-durable:0036 · 02:41.280 → 02:44.920

EN: So for a start, it writes JSON-L files.

ZH: 首先，它写入的是 JSONL 文件。

### pi-durable:0037 · 02:45.460 → 02:46.480

EN: And they're definitely useful.

ZH: 它们当然很有用。

### pi-durable:0038 · 02:46.980 → 02:48.440

EN: There's nothing fundamentally wrong with them.

ZH: 本身并没有什么根本性问题。

### pi-durable:0039 · 02:48.440 → 02:53.260

EN: But they're append, right?

ZH: 但它们采用追加写入，对吧？

### pi-durable:0040 · 02:53.340 → 02:57.260

EN: So it's like it's not very easy to rewrite those files.

ZH: 所以要重写这些文件并不容易。

### pi-durable:0041 · 02:58.280 → 03:04.620

EN: And as you're putting larger and larger workloads into them, they're accumulating a lot of intermediary

ZH: 随着你往里面放越来越大的工作负载，它们可能会积累大量

### pi-durable:0042 · 03:04.620 → 03:06.480

EN: results potentially.

ZH: 中间结果，

### pi-durable:0043 · 03:08.660 → 03:12.760

EN: That, yeah, are potentially wasteful.

ZH: 而这些东西可能很浪费。

### pi-durable:0044 · 03:12.760 → 03:16.840

EN: But the second thing is also that if you are going to have sub-agents,

ZH: 第二，如果你要加入子 agent，

### pi-durable:0045 · 03:16.840 → 03:21.440

EN: you would actually have to split that across dependent sessions.

ZH: 实际上得把它们拆到相互依赖的不同会话里。

### pi-durable:0046 · 03:22.280 → 03:25.460

EN: So Pi's tree works really,

ZH: Pi 的树状结构确实

### pi-durable:0047 · 03:25.460 → 03:29.720

EN: really well, particularly if you are a single writer, single user.

ZH: 非常好用，尤其是在单一写入者、单一用户的情况下。

### pi-durable:0048 · 03:29.900 → 03:32.700

EN: You can navigate to different parts of the tree, rewind the session, do some stuff.

ZH: 你可以跳到树的不同位置，回退会话，再做些操作。

### pi-durable:0049 · 03:32.700 → 03:36.940

EN: But modeling sub-agents into a single session

ZH: 但如果把子 agent 都放进一个会话，

### pi-durable:0050 · 03:36.940 → 03:41.340

EN: would interleave lines,

ZH: 记录行就会交错，

### pi-durable:0051 · 03:41.340 → 03:44.160

EN: would require some locking that doesn't exist today.

ZH: 还需要一些现在并不存在的锁机制。

### pi-durable:0052 · 03:44.160 → 03:50.240

EN: So like the entire tree system as it exists is very cool,

ZH: 所以现有的整套树状系统很酷，

### pi-durable:0053 · 03:50.240 → 03:53.200

EN: but has some limitations, let's say.

ZH: 但也有一些限制。

### pi-durable:0054 · 03:53.200 → 03:58.880

EN: So a lot of the work towards durable started,

ZH: 因此，Durable 的很多工作，

### pi-durable:0055 · 03:58.880 → 04:04.300

EN: I think, in some way or another by figuring out how to make this stuff work with a database.

ZH: 某种程度上是从研究如何让这些东西配合数据库开始的。

### pi-durable:0056 · 04:04.300 → 04:08.660

EN: And really, I think there are multiple things.

ZH: 这里其实涉及好几件事。

### pi-durable:0057 · 04:08.800 → 04:11.740

EN: Like durable means you should be able to stop and start it again.

ZH: 持久化执行意味着，你应该能够停止它，再重新启动。

### pi-durable:0058 · 04:12.000 → 04:14.300

EN: So it's like it suspends and picks up work.

ZH: 也就是可以挂起，然后接着工作。

### pi-durable:0059 · 04:15.240 → 04:20.580

EN: And that if you were to have sub-agents in it or you were to have multiple parallel things in it,

ZH: 如果其中有子 agent，或者同时进行的多个任务，

### pi-durable:0060 · 04:20.600 → 04:25.100

EN: it would extend to all the branches which are active at any point in time.

ZH: 这种能力就应该覆盖当时所有活跃的分支。

### pi-durable:0061 · 04:25.100 → 04:31.440

EN: And then the second part is that while

ZH: 第二点是，虽然

### pi-durable:0062 · 04:31.440 → 04:34.200

EN: Pi is quite durable even today,

ZH: 现在的 Pi 已经有相当程度的持久性，

### pi-durable:0063 · 04:35.140 → 04:41.640

EN: it is very easy to build stuff with it where you

ZH: 但你仍然很容易用它做出一些

### pi-durable:0064 · 04:41.640 → 04:42.860

EN: cannot pick up the work.

ZH: 无法接着运行的东西。

### pi-durable:0065 · 04:43.060 → 04:49.100

EN: And even the core agent look that we have today, if you were to continue, it could not continue on its own.

ZH: 甚至现有的核心 agent 循环，也不能自己恢复执行。

### pi-durable:0066 · 04:49.100 → 04:55.840

EN: So like if you were to shut down and you bring it up, you would have to write continue or something into it to actually continue to work.

ZH: 如果你关掉再启动，必须输入“继续”之类的话，它才会继续工作。

### pi-durable:0067 · 04:56.660 → 05:03.140

EN: And there are a lot of features that you might want to put into Pi that require extra state to be

ZH: 而很多你可能想加进 Pi 的功能，都需要在过程中

### pi-durable:0068 · 05:03.140 → 05:04.320

EN: persisted along the way.

ZH: 持久化额外的状态。

### pi-durable:0069 · 05:04.580 → 05:10.240

EN: So the classic example would be if you interrupt a tool execute

ZH: 典型例子就是，打断一次工具执行，

### pi-durable:0070 · 05:10.240 → 05:14.860

EN: in order to ask the user for approval,

ZH: 向用户请求批准。

### pi-durable:0071 · 05:14.860 → 05:21.160

EN: which again, not really the most useful case right now because I think tool

ZH: 当然，现在这不算特别有用的例子，因为我觉得工具

### pi-durable:0072 · 05:21.160 → 05:22.200

EN: approvals are largely gone.

ZH: 审批基本已经退出舞台了。

### pi-durable:0073 · 05:22.580 → 05:25.400

EN: But you could not really suspend the agent at this point in time and say like,

ZH: 但你确实无法在这个时间点挂起 agent，说：

### pi-durable:0074 · 05:25.460 → 05:30.140

EN: hey, we need to figure out if we can go ahead or not and then continue from there.

ZH: 我们先确认能不能继续，然后再从这里恢复。

### pi-durable:0075 · 05:30.280 → 05:35.800

EN: So it's like the system is quite limited in being able to suspend at points where we didn't intend

ZH: 所以，如果我们之前没有专门设计过某个挂起点，

### pi-durable:0076 · 05:35.800 → 05:37.800

EN: it unsuspending before.

ZH: 系统就很难在那里挂起并恢复。

### pi-durable:0077 · 05:38.480 → 05:44.720

EN: Yeah, I think we should probably just go through what durable means because we throw it around.

ZH: 对，我们应该解释一下 durable 到底是什么意思，因为一直在说这个词。

### pi-durable:0078 · 05:44.860 → 05:49.540

EN: But not a lot of people are actually very familiar with the concept.

ZH: 但很多人其实不太熟悉这个概念。

### pi-durable:0079 · 05:49.840 → 05:53.680

EN: So in old Pi, not old Pi, in Pi coding agent,

ZH: 在旧 Pi——不该说旧 Pi，是 Pi 编程 agent——里面，

### pi-durable:0080 · 05:53.680 → 05:58.480

EN: you start a session, you let the agent do something, your machine dies.

ZH: 你启动一个会话，让 agent 做事，结果机器挂了。

### pi-durable:0081 · 05:58.900 → 06:03.440

EN: You spin up Pi again, the same session, and that Armin said you have to write continue.

ZH: 你重新启动 Pi，打开同一个会话，就像 Armin 说的，还得输入“继续”。

### pi-durable:0082 · 06:04.000 → 06:11.260

EN: If there was an extension that did something in the background, that extension needs to be written in such a way that it actually spins up the background work again.

ZH: 如果某个扩展在后台做事，它就必须自己实现重新启动后台工作的逻辑。

### pi-durable:0083 · 06:11.820 → 06:14.780

EN: And Pi coding agent didn't help the extension with that at all.

ZH: Pi 编程 agent 完全不会帮扩展处理这些。

### pi-durable:0084 · 06:14.860 → 06:17.520

EN: Like everybody had to reinvent how to do that.

ZH: 每个人都得重新发明一遍。

### pi-durable:0085 · 06:17.920 → 06:23.840

EN: If you had a tool that was being executed when the process crashed,

ZH: 如果进程崩溃时有个工具正在执行，

### pi-durable:0086 · 06:23.840 → 06:26.540

EN: that tool is just aborted and not run again.

ZH: 这个工具就被中止了，不会自动重新运行。

### pi-durable:0087 · 06:26.540 → 06:32.260

EN: And the agent has to figure out if it should run it again and if so how and if the tool execution was a

ZH: agent 得自己判断要不要重跑、怎么重跑，以及这次工具执行

### pi-durable:0088 · 06:32.260 → 06:35.560

EN: destructive thing or not and so on and so forth.

ZH: 是不是破坏性的操作，等等。

### pi-durable:0089 · 06:35.560 → 06:41.060

EN: And then Pi doesn't have real concurrency,

ZH: 而且 Pi 没有真正的并发，

### pi-durable:0090 · 06:41.060 → 06:45.680

EN: meaning you always have a single agent loop.

ZH: 也就是说，始终只有一个 agent 循环。

### pi-durable:0091 · 06:46.640 → 06:51.460

EN: And if the process dies, we do not recover within that agent loop.

ZH: 如果进程挂了，我们不会恢复到那个循环内部。

### pi-durable:0092 · 06:51.460 → 06:54.700

EN: So an agent loop is basically get the user input,

ZH: agent 循环基本上就是：获取用户输入，

### pi-durable:0093 · 06:54.700 → 06:59.260

EN: send it to the LLM, get the response back, check if there's tool calls,

ZH: 发给大模型，拿到回复，检查是否有工具调用，

### pi-durable:0094 · 06:59.260 → 07:02.740

EN: execute the tools, and then do that in a loop until the LLM says I'm done.

ZH: 执行工具，再继续循环，直到模型说“我完成了”。

### pi-durable:0095 · 07:02.740 → 07:06.740

EN: In Pi coding agent, that just goes away.

ZH: 在 Pi 编程 agent 里，这些执行中的信息就丢了。

### pi-durable:0096 · 07:06.880 → 07:11.020

EN: We do not keep track of where we are in that loop basically, right?

ZH: 我们基本上不会记录循环执行到了哪里，对吧？

### pi-durable:0097 · 07:11.020 → 07:17.680

EN: So with Pi durable, we introduced a bunch of things that make this automatic basically.

ZH: Pi Durable 引入了一些机制，让这些事情基本上自动完成。

### pi-durable:0098 · 07:18.100 → 07:21.380

EN: So it kind of forces you into a durable way of thinking.

ZH: 它会促使你用持久化执行的方式思考。

### pi-durable:0099 · 07:21.380 → 07:27.180

EN: So first of all, that loop I just described, that is actually decomposed into what we call tasks.

ZH: 首先，我刚才描述的循环，会被拆成我们称为 task 的任务。

### pi-durable:0100 · 07:27.460 → 07:31.200

EN: And the task is basically just saying I intend to do a thing.

ZH: 一个任务基本上就是声明：我打算做一件事。

### pi-durable:0101 · 07:31.520 → 07:35.040

EN: I store this in a storage so I can remember it later.

ZH: 先把这个意图存起来，以后还能记住。

### pi-durable:0102 · 07:35.340 → 07:41.040

EN: I do the thing and then I store the result of the thing I did, right?

ZH: 执行这件事，再把执行结果存起来。

### pi-durable:0103 · 07:41.040 → 07:46.140

EN: So this gives me kind of like a sandwich and I can resume at any point here.

ZH: 这就像一个三明治，我能从其中任意位置恢复。

### pi-durable:0104 · 07:46.260 → 07:50.320

EN: I can resume in between intent and execution of what we call the effect.

ZH: 可以在意图记录之后、执行我们所说的 effect 之前恢复，

### pi-durable:0105 · 07:50.320 → 07:57.260

EN: And in between the effect and the final result and after the result, right?

ZH: 也可以在 effect 执行后、最终结果记录前，或者结果记录后恢复。

### pi-durable:0106 · 07:57.820 → 08:02.700

EN: And this is very nice because now you just write the thing that says I'm about to do the thing.

ZH: 这样很好，因为你只需要写：我准备做这件事，

### pi-durable:0107 · 08:02.820 → 08:03.720

EN: I am doing the thing.

ZH: 我正在做这件事，

### pi-durable:0108 · 08:03.860 → 08:04.560

EN: I did the thing.

ZH: 我做完了。

### pi-durable:0109 · 08:05.280 → 08:10.200

EN: And if you resume, we know exactly where in this sandwich you were and can resume from there.

ZH: 恢复的时候，我们就知道你停在这个“三明治”的哪一层，并从那里继续。

### pi-durable:0110 · 08:10.500 → 08:12.100

EN: And this extends to everything.

ZH: 这适用于所有操作。

### pi-durable:0111 · 08:12.260 → 08:13.560

EN: This extends to the request.

ZH: 也包括请求，

### pi-durable:0112 · 08:13.660 → 08:15.560

EN: It's being made to the LLM provider.

ZH: 也就是发给大模型服务商的请求。

### pi-durable:0113 · 08:15.560 → 08:21.220

EN: This extends to tools which can now mark themselves as replay safe.

ZH: 工具也一样，现在工具可以把自己标记为可安全重放。

### pi-durable:0114 · 08:21.720 → 08:24.340

EN: For example, a read tool is replay safe.

ZH: 例如，读取工具可以安全重放。

### pi-durable:0115 · 08:24.580 → 08:27.600

EN: You can just call it again and you get whatever.

ZH: 你再调用一次，拿到结果就行。

### pi-durable:0116 · 08:28.360 → 08:34.700

EN: A sub-agent tool is also replay safe because that same agent runs the same

ZH: 子 agent 工具也可以安全重放，因为子 agent 和主 agent

### pi-durable:0117 · 08:34.700 → 08:36.060

EN: tasks as the main agent.

ZH: 运行的是同一套任务机制。

### pi-durable:0118 · 08:36.060 → 08:40.400

EN: So all of this durability of the execution graph applies to it as well.

ZH: 所以，执行图的持久化能力同样适用于它。

### pi-durable:0119 · 08:40.620 → 08:44.300

EN: So that agent can just be spun up again and be told,

ZH: 子 agent 可以重新启动，再告诉它——

### pi-durable:0120 · 08:44.300 → 08:48.200

EN: not even be told, it automatically does continuous from where it left off.

ZH: 甚至不用告诉，它会自动从上次停下的地方继续。

### pi-durable:0121 · 08:49.660 → 08:53.360

EN: And so this is probably the biggest selling point of Pi Durable.

ZH: 这大概是 Pi Durable 最大的卖点。

### pi-durable:0122 · 08:53.900 → 08:59.320

EN: We took some inspiration from structured concurrency.

ZH: 我们借鉴了一些结构化并发的思想。

### pi-durable:0123 · 08:59.320 → 09:04.940

EN: It doesn't cleanly apply to everything in an agent, which to me was a very interesting observation.

ZH: 不过它并不能完全套用于 agent 的所有场景，这个发现对我来说很有意思。

### pi-durable:0124 · 09:05.100 → 09:10.740

EN: So structured concurrency is basically something owns another thing that does something.

ZH: 结构化并发基本上就是，一个执行单元拥有另一个执行单元，后者去做一些事情。

### pi-durable:0125 · 09:11.240 → 09:16.300

EN: And this other thing is not allowed to survive past the lifetime of this.

ZH: 后者的生命周期不能超过前者。

### pi-durable:0126 · 09:16.880 → 09:19.640

EN: This works for like 90% of tasks inside Pi Durable.

ZH: Pi Durable 中大约 90% 的任务都适用。

### pi-durable:0127 · 09:19.640 → 09:25.680

EN: But there's a handful of things that need this child execution to survive

ZH: 但有少数情况，子执行单元需要

### pi-durable:0128 · 09:25.680 → 09:27.360

EN: the lifetime of the parent.

ZH: 比父执行单元活得更久。

### pi-durable:0129 · 09:27.360 → 09:32.400

EN: So it's not 100% structured concurrency, but it's very close to that.

ZH: 所以它不是百分之百的结构化并发，但已经非常接近。

### pi-durable:0130 · 09:32.500 → 09:34.580

EN: And it gives you an escape hatch if you don't need it.

ZH: 而且在你不需要这种约束时，也提供了跳出机制。

### pi-durable:0131 · 09:36.060 → 09:37.200

EN: Yeah, and that's durability.

ZH: 对，这就是持久化执行。

### pi-durable:0132 · 09:37.420 → 09:38.400

EN: I hope any of that makes sense.

ZH: 希望我讲清楚了。

### pi-durable:0133 · 09:38.420 → 09:40.400

EN: And I think there's another thing we're mentioning.

ZH: 还有一件事值得提一下。

### pi-durable:0134 · 09:40.660 → 09:45.240

EN: So if you go to the earendil works GitHub repository, you will find that there's a project called Absurd,

ZH: 如果你去看 earendil-works 的 GitHub 仓库，会发现一个叫 Absurd 的项目，

### pi-durable:0135 · 09:46.260 → 09:49.580

EN: which is a durable workflow engine sitting on top of Postgres.

ZH: 它是构建在 Postgres 之上的持久化工作流引擎。

### pi-durable:0136 · 09:49.580 → 09:55.500

EN: And we built that originally to support a Pi-driven agent,

ZH: 我们最初做它，是为了支持一个由 Pi 驱动的 agent，

### pi-durable:0137 · 09:55.500 → 09:56.960

EN: which is called Levos,

ZH: 叫 Levos，

### pi-durable:0138 · 09:57.880 → 10:04.800

EN: to basically continue and suspend across basically a cloud deployment.

ZH: 让它能在云端部署过程中挂起和恢复。

### pi-durable:0139 · 10:05.260 → 10:09.360

EN: So when we built this originally, the assumption was, well, sandbox are quite expensive.

ZH: 最初的考虑是，沙箱挺贵的。

### pi-durable:0140 · 10:09.740 → 10:14.920

EN: So we want to build the agent in a way where you just distribute it to any worker that wants to work on it

ZH: 所以我们想把 agent 设计成：任何愿意接手的 worker 都能分配到它，

### pi-durable:0141 · 10:14.920 → 10:16.440

EN: and continue work doing there.

ZH: 并在那里继续工作。

### pi-durable:0142 · 10:17.380 → 10:22.400

EN: And unsurprisingly, the problem that we ran into quite early on,

ZH: 不出所料，我们很早就遇到了一个问题，

### pi-durable:0143 · 10:22.440 → 10:27.120

EN: I think a lot of people ran into it, is that there's a lot of states that's not just the agent state.

ZH: 我觉得很多人都遇到过：状态不只有 agent 自身的状态。

### pi-durable:0144 · 10:28.240 → 10:33.480

EN: So initially just transmitting the session transcript around was obviously not enough.

ZH: 所以，光在各处传递会话记录，显然不够。

### pi-durable:0145 · 10:33.960 → 10:35.900

EN: Agents love to write to the file system and so forth.

ZH: agent 很喜欢往文件系统写东西，等等。

### pi-durable:0146 · 10:35.900 → 10:43.240

EN: And so you very quickly discover that durable workflow engines are great,

ZH: 你很快就会发现，持久化工作流引擎很好，

### pi-durable:0147 · 10:43.600 → 10:49.960

EN: but unless the agent harness actually really supports them well, that's not enough.

ZH: 但如果 agent harness 没有真正支持它，光有引擎是不够的。

### pi-durable:0148 · 10:50.080 → 10:52.000

EN: So like the agent harness in itself needs to be durable.

ZH: 也就是说，agent harness 本身也得支持持久化执行。

### pi-durable:0149 · 10:53.360 → 10:56.520

EN: Now, that doesn't mean that everything becomes durable, right?

ZH: 但这不意味着所有东西都会自动持久化，对吧？

### pi-durable:0150 · 10:56.580 → 11:00.380

EN: So it's like if the file system now holds on to really important data,

ZH: 如果文件系统里存着非常重要的数据，

### pi-durable:0151 · 11:00.900 → 11:02.720

EN: you also need to find a way to either snapshot that,

ZH: 你也得想办法给它做快照，

### pi-durable:0152 · 11:02.720 → 11:05.060

EN: or you build the agent around in a way that it can go away.

ZH: 或者把 agent 设计成即使这些数据消失也能运作。

### pi-durable:0153 · 11:06.900 → 11:10.140

EN: And so I think for someone who is looking at this and saying like,

ZH: 所以，有人可能看着这套东西说：

### pi-durable:0154 · 11:10.220 → 11:12.640

EN: hey, we have a Dora workflow engine, all of our problems are gone,

ZH: 我们有了持久化工作流引擎，所有问题都解决了。

### pi-durable:0155 · 11:12.720 → 11:15.400

EN: it's like you might still want to use it because it might still be useful.

ZH: 它确实可能有用，你也可能仍然想用它。

### pi-durable:0156 · 11:16.260 → 11:21.060

EN: But just having that did not actually make your agent durable.

ZH: 但仅仅拥有它，并不会让你的 agent 自动具备持久化执行能力。

### pi-durable:0157 · 11:22.880 → 11:29.040

EN: And in fact, there's still a chance that the agent will not come out particularly durable out of the box

ZH: 实际上，agent 开箱即用时仍然可能缺乏这种能力，

### pi-durable:0158 · 11:29.040 → 11:35.300

EN: if you let the agent just write files to file systems that you never bring back or stuff like this.

ZH: 比如你让它把文件写到再也无法恢复的文件系统里。

### pi-durable:0159 · 11:35.900 → 11:40.100

EN: So there's things inside the harness that can all be durable,

ZH: harness 内部的东西可以持久化，

### pi-durable:0160 · 11:40.480 → 11:43.360

EN: but the harness also operates on an external environment.

ZH: 但 harness 还会操作外部环境。

### pi-durable:0161 · 11:43.980 → 11:46.500

EN: And in the effect sandwich, which I described earlier,

ZH: 在我之前说的 effect“三明治”里，

### pi-durable:0162 · 11:46.760 → 11:48.840

EN: the intent is the durable part inside the harness,

ZH: 意图是 harness 内部可以持久化的部分；

### pi-durable:0163 · 11:48.960 → 11:53.720

EN: the effect, which is write to a file, execute bash, call some service, deploy something, blah, blah.

ZH: effect 则是写文件、执行 Bash、调用服务、部署东西，等等。

### pi-durable:0164 · 11:54.120 → 11:56.820

EN: That is the external system and you do not have control over that.

ZH: 那属于外部系统，你无法控制它。

### pi-durable:0165 · 11:56.820 → 11:58.160

EN: Well, usually.

ZH: 通常是这样。

### pi-durable:0166 · 11:58.780 → 12:02.780

EN: So the only way to make this part durable as well is to have some kind of,

ZH: 所以，要让这一部分也支持持久化执行，就需要某种——

### pi-durable:0167 · 12:02.820 → 12:04.700

EN: and I can't pronounce the fucking word,

ZH: 那个该死的词我念不出来——

### pi-durable:0168 · 12:04.940 → 12:11.780

EN: basically, if I say deploy with the ID, blah, blah, blah,

ZH: 比如，我说用某个 ID 执行部署，

### pi-durable:0169 · 12:11.780 → 12:15.800

EN: and I call this again and the deploy for that ID is already running,

ZH: 再次调用时，如果这个 ID 对应的部署已经在运行，

### pi-durable:0170 · 12:16.020 → 12:17.140

EN: it shouldn't trigger again.

ZH: 就不应该再触发一遍。

### pi-durable:0171 · 12:17.300 → 12:18.280

EN: That's what I'm saying.

ZH: 我想说的就是这个。

### pi-durable:0172 · 12:18.280 → 12:20.340

EN: So if your external system works like this, great.

ZH: 如果你的外部系统支持这种方式，那很好。

### pi-durable:0173 · 12:20.460 → 12:24.380

EN: File systems don't work like this unless you have like a snapshotting file system.

ZH: 文件系统并不这样工作，除非它支持快照之类的机制。

### pi-durable:0174 · 12:25.120 → 12:31.580

EN: But yeah, the thing with durability is you can have a workflow engine like temporal or absurd

ZH: 不过，关于持久化执行，你可以有 Temporal、Absurd

### pi-durable:0175 · 12:31.580 → 12:34.400

EN: or I don't know what other stuff exists out there.

ZH: 或者其他什么持久化工作流引擎，

### pi-durable:0176 · 12:35.280 → 12:37.280

EN: But then you run into issues of atomicity.

ZH: 但随后就会遇到原子性的问题。

### pi-durable:0177 · 12:38.260 → 12:42.960

EN: Like for durability to work, everything that needs to be durable in one step

ZH: 为了实现持久化执行，同一步中所有需要持久化的内容，

### pi-durable:0178 · 12:42.960 → 12:45.280

EN: needs to be atomically persisted.

ZH: 必须原子地保存下来。

### pi-durable:0179 · 12:45.280 → 12:49.800

EN: And if you have this outside of the agent,

ZH: 如果这个机制在 agent 外部，

### pi-durable:0180 · 12:50.000 → 12:54.640

EN: then anything inside of the agent that needs atomic persistence for durability

ZH: 那么 agent 内部所有需要原子持久化才能保证恢复的东西，

### pi-durable:0181 · 12:54.640 → 12:57.220

EN: needs to be shoehorned into that somehow.

ZH: 就得想办法硬塞进那套机制。

### pi-durable:0182 · 12:57.400 → 12:59.200

EN: And that really doesn't quite work.

ZH: 这其实不太行得通。

### pi-durable:0183 · 12:59.280 → 13:03.920

EN: So that's why we decided for Pi Durable to actually make it a durable workflow engine itself,

ZH: 所以我们决定，让 Pi Durable 本身就是一个持久化工作流引擎。

### pi-durable:0184 · 13:04.360 → 13:09.220

EN: which solves a lot of problems because it also allows you to build your own tasks

ZH: 这解决了很多问题，因为你也可以为自己的应用构建任务，

### pi-durable:0185 · 13:09.220 → 13:14.540

EN: that run inside this scheduler and durable scheduler for your own application.

ZH: 让它们运行在这个持久化调度器里面。

### pi-durable:0186 · 13:14.540 → 13:17.880

EN: And it also allows you, and that's the second part of durability,

ZH: 而且它还支持持久化的另一部分：

### pi-durable:0187 · 13:18.620 → 13:22.640

EN: persistence of state, not only of the harness, but also of your application.

ZH: 状态持久化，不仅包括 harness，也包括你的应用。

### pi-durable:0188 · 13:23.160 → 13:29.460

EN: Now, obviously, you do not want to stuff every application state you have into the harness storage.

ZH: 当然，你不会想把所有应用状态都塞进 harness 的存储。

### pi-durable:0189 · 13:30.240 → 13:36.660

EN: But what you can do is you persist large blobs, for example, into your own storage.

ZH: 但你可以把大块数据存到自己的存储里，

### pi-durable:0190 · 13:37.020 → 13:40.920

EN: And then inside the harness storage, you persist a pointer to that persisted blob.

ZH: 再在 harness 存储里保存一个指向那块数据的引用。

### pi-durable:0191 · 13:40.920 → 13:47.560

EN: And with that, it's very easy to have durable execution and durable storage of state.

ZH: 这样就很容易同时获得持久化执行和状态持久化。

### pi-durable:0192 · 13:47.560 → 13:53.720

EN: I think another thing worth remembering here is

ZH: 还有一点值得记住，

### pi-durable:0193 · 13:53.720 → 13:57.320

EN: so absurd, like temporal,

ZH: Absurd 和 Temporal，

### pi-durable:0194 · 13:57.940 → 14:02.380

EN: and I think that gazillions of other durable workflow execution engines out there,

ZH: 以及其他无数持久化工作流执行引擎，

### pi-durable:0195 · 14:02.980 → 14:09.060

EN: they were actually largely built on one premise that is now quickly being invalidated.

ZH: 大多建立在一个如今正在迅速失效的前提上。

### pi-durable:0196 · 14:09.180 → 14:14.660

EN: And that premise was that you can actually cheat on durability quite a bit

ZH: 这个前提是，你可以在持久化执行上偷不少懒，

### pi-durable:0197 · 14:14.660 → 14:21.760

EN: by assuming that the code that is durable is sort of maintained by an expert programmer.

ZH: 只要假设这些代码是由专业程序员维护的。

### pi-durable:0198 · 14:22.580 → 14:28.400

EN: And I'm saying this because the way almost all durable workflow engines work today

ZH: 我这么说，是因为如今几乎所有持久化工作流引擎，

### pi-durable:0199 · 14:28.400 → 14:35.240

EN: is they either say like your code has to be fully deterministic on the workflow orchestration part,

ZH: 都会要求工作流编排部分的代码完全确定，

### pi-durable:0200 · 14:35.300 → 14:39.660

EN: so that if I suspend for like a week and I come back in a week later,

ZH: 这样即使挂起一周，一周后再回来，

### pi-durable:0201 · 14:39.660 → 14:43.460

EN: the code is the same, so I just run through all the checkpoints,

ZH: 代码还是一样，就可以依次走过所有检查点，

### pi-durable:0202 · 14:43.640 → 14:46.280

EN: I'm pulling the data as it was written into durable storage,

ZH: 取回当时写进持久化存储的数据，

### pi-durable:0203 · 14:46.860 → 14:48.120

EN: and I'm continuing from there.

ZH: 然后从那里继续。

### pi-durable:0204 · 14:49.620 → 14:52.720

EN: Or it has to be written in a way that is maybe non-deterministic,

ZH: 或者，代码可以不是完全确定的，

### pi-durable:0205 · 14:53.220 → 14:58.000

EN: but all the branches that you were taking on the durable information is still compatible

ZH: 但根据持久化信息选择的所有分支，仍然必须兼容，

### pi-durable:0206 · 14:58.000 → 15:00.140

EN: or has like explicit code in it for upgrades.

ZH: 或者明确写好升级逻辑。

### pi-durable:0207 · 15:00.140 → 15:06.640

EN: And the problem with this with LLMs is that we are

ZH: 大模型带来的问题是，我们

### pi-durable:0208 · 15:06.640 → 15:08.180

EN: now living in a world

ZH: 如今生活在一个

### pi-durable:0209 · 15:08.180 → 15:09.880

EN: where the agents are writing their own code.

ZH: agent 会自己写代码的世界里。

### pi-durable:0210 · 15:10.000 → 15:11.800

EN: And it's not that the agents cannot be expert programmers,

ZH: 不是说 agent 不能成为专业程序员，

### pi-durable:0211 · 15:12.440 → 15:18.080

EN: but the agents, it is very hard for them to basically maintain

ZH: 而是它们很难始终

### pi-durable:0212 · 15:18.080 → 15:22.660

EN: like a perfect understanding of all the possible tasks

ZH: 完整理解所有可能再次遇到的任务，

### pi-durable:0213 · 15:22.660 → 15:24.600

EN: that will ever come by again in this durable state.

ZH: 以及这些任务处于什么持久化状态。

### pi-durable:0214 · 15:25.240 → 15:27.900

EN: And so this, I would say like this is an unsolvable problem,

ZH: 我觉得这个问题是无法彻底解决的。

### pi-durable:0215 · 15:27.900 → 15:31.580

EN: but the trade-off now is less to make it friendly for a programmer

ZH: 但如今的取舍，不再是靠抽象把细节藏起来，让程序员用得舒服，

### pi-durable:0216 · 15:31.580 → 15:35.040

EN: by abstracting it away, but to make it a lot more explicit.

ZH: 而是把这些细节变得更加显式。

### pi-durable:0217 · 15:35.900 → 15:38.020

EN: Because if it's explicit, then the agent can see it.

ZH: 因为只有显式呈现出来，agent 才看得见。

### pi-durable:0218 · 15:38.080 → 15:40.040

EN: It's like, oh, I wrote this durable information away

ZH: 它才能知道：哦，我把这些持久化信息写出去了，

### pi-durable:0219 · 15:40.040 → 15:41.120

EN: and we need to load it again.

ZH: 现在需要重新加载。

### pi-durable:0220 · 15:41.540 → 15:45.380

EN: So the trade-off actually now is sort of almost entirely inverse

ZH: 所以，这个取舍几乎完全反转了，

### pi-durable:0221 · 15:45.380 → 15:46.440

EN: to what we did with Absurd,

ZH: 和我们做 Absurd 时正好相反。

### pi-durable:0222 · 15:46.960 → 15:49.340

EN: where we tried to make it as friendly for a human programmer to do.

ZH: 当时我们尽量让人类程序员用起来方便。

### pi-durable:0223 · 15:49.840 → 15:52.240

EN: And now it's like S in your face.

ZH: 而现在，我们要把这些信息直接摆出来，

### pi-durable:0224 · 15:53.400 → 15:54.380

EN: So did the LLM.

ZH: 让大模型看见。

### pi-durable:0225 · 15:55.100 → 15:56.500

EN: There's going to be a little bit more code,

ZH: 代码会稍微多一点，

### pi-durable:0226 · 15:56.500 → 16:00.760

EN: but the LLM is going to be explicitly going through checkpoints.

ZH: 但大模型会显式地经过每一个检查点。

### pi-durable:0227 · 16:00.920 → 16:05.920

EN: So like as an example, state suspension in Absurd was like,

ZH: 比如，在 Absurd 中挂起状态时，

### pi-durable:0228 · 16:06.300 → 16:08.020

EN: yeah, like every time you went to a step,

ZH: 每走到一个步骤，

### pi-durable:0229 · 16:08.440 → 16:09.520

EN: we would increment the counter.

ZH: 我们都会递增计数器。

### pi-durable:0230 · 16:09.840 → 16:12.280

EN: And so like if you, if a loop for this four times,

ZH: 所以，如果你在循环里执行四次，

### pi-durable:0231 · 16:12.400 → 16:15.680

EN: then there's a hidden like first time, second time,

ZH: 就会隐含地记录第一次、第二次、

### pi-durable:0232 · 16:15.760 → 16:16.560

EN: third time and so forth.

ZH: 第三次，以此类推。

### pi-durable:0233 · 16:17.560 → 16:20.160

EN: In Pi Durable, what is just a memo function,

ZH: 而在 Pi Durable 里，只是一个 memo 函数，

### pi-durable:0234 · 16:20.820 → 16:24.240

EN: where you give it a name and that's the name.

ZH: 你给它一个名字，就用这个名字。

### pi-durable:0235 · 16:24.240 → 16:26.160

EN: And if you want to version it, you version it.

ZH: 想做版本管理，就自己明确标版本。

### pi-durable:0236 · 16:27.540 → 16:30.820

EN: So there's a lot less hidden magic in durable

ZH: 所以 Durable 里隐藏的魔法，

### pi-durable:0237 · 16:30.820 → 16:32.700

EN: than there is in temporal or Absurd.

ZH: 比 Temporal 或 Absurd 少得多。

### pi-durable:0238 · 16:33.160 → 16:33.620

EN: Yeah, definitely.

ZH: 对，确实如此。

### pi-durable:0239 · 16:33.800 → 16:39.000

EN: Like the workflow scheduler is like 1,200 lines of code

ZH: 工作流调度器大概只有 1,200 行代码，

### pi-durable:0240 · 16:39.000 → 16:40.680

EN: that you can actually read and understand.

ZH: 你真的可以读懂它。

### pi-durable:0241 · 16:41.240 → 16:44.680

EN: And it's very easy to reason about the execution graph.

ZH: 也很容易理解执行图的行为。

### pi-durable:0242 · 16:44.820 → 16:47.320

EN: And that is actually the difference to temporal or Absurd.

ZH: 这正是它和 Temporal、Absurd 的区别。

### pi-durable:0243 · 16:47.900 → 16:49.420

EN: In temporal or Absurd,

ZH: 在 Temporal 或 Absurd 里，

### pi-durable:0244 · 16:49.420 → 16:52.840

EN: you kind of pretend you're writing a box standard JavaScript program.

ZH: 你仿佛只是在写一个普通的 JavaScript 程序，

### pi-durable:0245 · 16:53.160 → 16:56.380

EN: And it just will magically pick up from where you left off, right?

ZH: 它就会神奇地从上次停下的地方继续，对吧？

### pi-durable:0246 · 16:56.520 → 16:58.800

EN: That's more true for temporal than Absurd, I think.

ZH: 我觉得 Temporal 比 Absurd 更是如此。

### pi-durable:0247 · 17:00.020 → 17:03.060

EN: And that is, as you said, for humans, a great model

ZH: 就像你说的，对人来说，这个模型很好，

### pi-durable:0248 · 17:03.060 → 17:04.580

EN: because you kind of sort of understand.

ZH: 因为你大致能理解它。

### pi-durable:0249 · 17:04.580 → 17:07.160

EN: But then if you actually use it in anger,

ZH: 但当你真正深入使用时，

### pi-durable:0250 · 17:07.260 → 17:08.120

EN: you figure out,

ZH: 你会发现，

### pi-durable:0251 · 17:08.760 → 17:12.260

EN: they actually have to do a lot of shit to make this work.

ZH: 为了让它运转，底下其实得做一大堆事情。

### pi-durable:0252 · 17:12.420 → 17:14.740

EN: Like something as simple as set timeout,

ZH: 连 setTimeout 这么简单的东西，

### pi-durable:0253 · 17:14.840 → 17:18.320

EN: they have to kind of hook into

ZH: 它们都得介入处理，

### pi-durable:0254 · 17:18.320 → 17:19.900

EN: and ensure that it works with this.

ZH: 确保它能配合这套机制工作。

### pi-durable:0255 · 17:20.460 → 17:22.400

EN: And the biggest problem, actually,

ZH: 而这类工作流引擎

### pi-durable:0256 · 17:22.460 → 17:23.720

EN: with these kinds of workflow engines

ZH: 最大的问题，

### pi-durable:0257 · 17:23.720 → 17:25.940

EN: is that you have an execution graph.

ZH: 其实在于你有一张执行图。

### pi-durable:0258 · 17:26.120 → 17:27.660

EN: Like function A calls function B,

ZH: 比如函数 A 调用函数 B，

### pi-durable:0259 · 17:27.760 → 17:28.620

EN: calls function C.

ZH: 函数 B 又调用函数 C。

### pi-durable:0260 · 17:29.200 → 17:30.980

EN: And then somewhere in there,

ZH: 然后在其中某个地方，

### pi-durable:0261 · 17:31.320 → 17:34.240

EN: we stopped the process

ZH: 我们停止了进程，

### pi-durable:0262 · 17:34.240 → 17:35.340

EN: and now we restart it.

ZH: 现在又重新启动它。

### pi-durable:0263 · 17:35.360 → 17:38.200

EN: And now we have to reestablish the call stack, right?

ZH: 于是必须重建调用栈，对吧？

### pi-durable:0264 · 17:38.340 → 17:40.660

EN: Function A, function B, function C.

ZH: 函数 A、函数 B、函数 C。

### pi-durable:0265 · 17:40.920 → 17:41.820

EN: So how do you do this?

ZH: 怎么做呢？

### pi-durable:0266 · 17:42.220 → 17:43.720

EN: You have to replay the fucking shit.

ZH: 你得把这整套东西重放一遍。

### pi-durable:0267 · 17:44.460 → 17:45.700

EN: And the replay works like this.

ZH: 重放的过程是这样的：

### pi-durable:0268 · 17:45.740 → 17:47.220

EN: You go into function A again

ZH: 再次进入函数 A，

### pi-durable:0269 · 17:47.220 → 17:49.280

EN: and function A calls something that says,

ZH: 函数 A 调用一个操作，说，

### pi-durable:0270 · 17:49.420 → 17:50.240

EN: do the thing.

ZH: 做这件事。

### pi-durable:0271 · 17:50.720 → 17:52.040

EN: And instead of actually doing the thing,

ZH: 但它不会真的再做一次，

### pi-durable:0272 · 17:52.120 → 17:53.360

EN: it gives you the last result.

ZH: 而是返回上一次的结果，

### pi-durable:0273 · 17:53.940 → 17:54.560

EN: The thing did.

ZH: 也就是那个操作

### pi-durable:0274 · 17:54.840 → 17:56.080

EN: The last time you ran it.

ZH: 上次运行时的结果。

### pi-durable:0275 · 17:56.340 → 17:57.120

EN: Then you take that

ZH: 然后拿着这个结果，

### pi-durable:0276 · 17:57.120 → 17:58.680

EN: and you call function B with that.

ZH: 调用函数 B。

### pi-durable:0277 · 17:58.900 → 17:59.940

EN: And that does the same thing.

ZH: 函数 B 也做同样的事。

### pi-durable:0278 · 18:00.000 → 18:00.600

EN: And then you take that

ZH: 再拿着它的结果，

### pi-durable:0279 · 18:00.600 → 18:01.400

EN: and call function C.

ZH: 调用函数 C。

### pi-durable:0280 · 18:01.700 → 18:03.420

EN: And it's a terrible model, actually,

ZH: 仔细想想，

### pi-durable:0281 · 18:03.580 → 18:04.440

EN: if you think about it.

ZH: 这个模型其实挺糟糕的。

### pi-durable:0282 · 18:04.480 → 18:06.480

EN: Because it requires a journal of everything

ZH: 因为它要求记录所有操作的日志，

### pi-durable:0283 · 18:06.480 → 18:09.040

EN: and it reruns the entire code.

ZH: 还要重新执行整段代码。

### pi-durable:0284 · 18:09.380 → 18:10.740

EN: And if anything, as Armin said,

ZH: 而且，就像 Armin 说的，只要

### pi-durable:0285 · 18:10.860 → 18:12.820

EN: changes in any of these functions,

ZH: 其中任何一个函数发生变化，

### pi-durable:0286 · 18:13.240 → 18:14.080

EN: you are fucked.

ZH: 你就麻烦大了。

### pi-durable:0287 · 18:14.320 → 18:16.440

EN: One of the biggest criticisms of Temporal

ZH: 对 Temporal 最常见的批评之一，

### pi-durable:0288 · 18:16.440 → 18:18.080

EN: is that versioning is just terrible.

ZH: 就是版本管理非常糟糕。

### pi-durable:0289 · 18:18.640 → 18:21.260

EN: So what does Pi Durable actually do?

ZH: 那么 Pi Durable 到底怎么做？

### pi-durable:0290 · 18:21.780 → 18:23.020

EN: Pi Durable doesn't give you

ZH: Pi Durable 提供的，

### pi-durable:0291 · 18:23.020 → 18:25.880

EN: a classic call stack of JavaScript functions.

ZH: 并不是传统的 JavaScript 函数调用栈。

### pi-durable:0292 · 18:25.880 → 18:29.860

EN: Pi Durable gives you a tree of tasks.

ZH: 它提供的是一棵任务树。

### pi-durable:0293 · 18:30.380 → 18:31.900

EN: And each task is self-contained.

ZH: 每个任务都是独立完整的。

### pi-durable:0294 · 18:32.380 → 18:34.840

EN: It can call other tasks and wait for them.

ZH: 它可以调用其他任务，并等待它们。

### pi-durable:0295 · 18:35.960 → 18:38.380

EN: And that's trivial to reestablish

ZH: 相比普通的 JavaScript 函数调用图，

### pi-durable:0296 · 18:38.380 → 18:42.720

EN: compared to a normal JavaScript function call graph.

ZH: 这种结构很容易重建。

### pi-durable:0297 · 18:43.140 → 18:44.420

EN: And that's the big difference here.

ZH: 这就是最大的区别。

### pi-durable:0298 · 18:44.800 → 18:46.460

EN: The units of work are very small,

ZH: 工作单元非常小，

### pi-durable:0299 · 18:46.740 → 18:47.320

EN: are very easy.

ZH: 也非常简单。

### pi-durable:0300 · 18:47.460 → 18:52.700

EN: The intent, effect, storage kind of model.

ZH: 就是意图、effect、存储这样的模型。

### pi-durable:0301 · 18:52.700 → 18:55.740

EN: And if you want to do more things in parallel,

ZH: 如果你想并行做更多事情，

### pi-durable:0302 · 18:55.920 → 18:56.300

EN: you can.

ZH: 当然可以。

### pi-durable:0303 · 18:56.380 → 18:56.860

EN: It's very easy.

ZH: 非常容易。

### pi-durable:0304 · 18:56.960 → 18:57.920

EN: You just create a new task

ZH: 只需要创建一个新任务，

### pi-durable:0305 · 18:57.920 → 18:59.440

EN: and other tasks can wait for that.

ZH: 其他任务就可以等待它。

### pi-durable:0306 · 18:59.560 → 19:00.040

EN: And that's it.

ZH: 就这么简单。

### pi-durable:0307 · 19:00.200 → 19:02.780

EN: And it's very super easy to kind of rewind,

ZH: 要回退，

### pi-durable:0308 · 19:03.120 → 19:06.220

EN: to kind of reestablish that virtual call graph,

ZH: 或者说重建这张虚拟调用图，

### pi-durable:0309 · 19:06.360 → 19:07.180

EN: if you want to call that.

ZH: 也是非常容易的。

### pi-durable:0310 · 19:08.080 → 19:09.340

EN: So since we already talked about the effects.

ZH: 既然已经聊到了 effect，

### pi-durable:0311 · 19:09.800 → 19:10.140

EN: Oh, yeah.

ZH: 哦，对。

### pi-durable:0312 · 19:10.140 → 19:14.200

EN: We should maybe talk about the other elephant in the room,

ZH: 我们或许该谈谈另一个绕不开的问题，

### pi-durable:0313 · 19:14.320 → 19:15.800

EN: which is effect.js.

ZH: 也就是 Effect.js。

### pi-durable:0314 · 19:16.800 → 19:18.260

EN: And before we talk about effect.js,

ZH: 不过在聊 Effect.js 之前，

### pi-durable:0315 · 19:18.560 → 19:22.820

EN: I also made a little side note here

ZH: 我还想顺带提一句，

### pi-durable:0316 · 19:22.820 → 19:26.460

EN: on the sort of constantly implied elephant in the room,

ZH: 另一个始终隐含在讨论里的问题，

### pi-durable:0317 · 19:26.540 → 19:27.680

EN: which is JavaScript in the first place.

ZH: 就是为什么首先要用 JavaScript。

### pi-durable:0318 · 19:27.680 → 19:31.340

EN: And I think this, again, is TypeScript.

ZH: 我想，这里用的还是 TypeScript。

### pi-durable:0319 · 19:32.240 → 19:34.340

EN: And it's TypeScript because we really like

ZH: 之所以选 TypeScript，是因为我们很喜欢

### pi-durable:0320 · 19:34.340 → 19:36.360

EN: the idea of agents extending themselves.

ZH: 让 agent 扩展自身能力这个想法。

### pi-durable:0321 · 19:36.500 → 19:37.220

EN: So it's like right now,

ZH: 而就目前来说，

### pi-durable:0322 · 19:37.280 → 19:38.680

EN: JavaScript seems like a good environment.

ZH: JavaScript 看起来是一个不错的环境。

### pi-durable:0323 · 19:40.180 → 19:41.240

EN: But I also want to say,

ZH: 但我也想说，

### pi-durable:0324 · 19:41.360 → 19:43.380

EN: in many ways,

ZH: 从很多方面来看，

### pi-durable:0325 · 19:43.440 → 19:44.540

EN: what we are trying to do here

ZH: 我们现在想做的，

### pi-durable:0326 · 19:44.540 → 19:45.780

EN: is we're trying to build

ZH: 其实是构建

### pi-durable:0327 · 19:45.780 → 19:47.820

EN: almost like

ZH: 这样一种

### pi-durable:0328 · 19:47.820 → 19:50.740

EN: a way of building an agent

ZH: 创建 agent 的方式，

### pi-durable:0329 · 19:50.740 → 19:52.940

EN: and that stores itself durably.

ZH: 让它能够持久化保存自身。

### pi-durable:0330 · 19:53.560 → 19:54.560

EN: Durable storage means

ZH: 持久化存储意味着，

### pi-durable:0331 · 19:54.560 → 19:57.740

EN: commitment to some stable system

ZH: 你得遵循某个稳定的系统约定，

### pi-durable:0332 · 19:57.740 → 20:00.200

EN: that you should be able to describe

ZH: 而且应该能把它描述清楚，

### pi-durable:0333 · 20:00.200 → 20:01.340

EN: in a way where you could rebuild

ZH: 让别人可以用另一种语言

### pi-durable:0334 · 20:01.340 → 20:02.380

EN: in a different language, right?

ZH: 重新实现，对吧？

### pi-durable:0335 · 20:02.440 → 20:02.820

EN: So it's like,

ZH: 所以，

### pi-durable:0336 · 20:03.560 → 20:04.480

EN: keep in mind,

ZH: 要记住，

### pi-durable:0337 · 20:04.560 → 20:06.260

EN: it's like this is for sure JavaScript right now

ZH: 虽然现在它确实是 JavaScript，

### pi-durable:0338 · 20:06.260 → 20:07.620

EN: and might even be JavaScript

ZH: 也可能在

### pi-durable:0339 · 20:07.620 → 20:08.760

EN: for a very, very long time.

ZH: 很长很长的时间里一直是 JavaScript，

### pi-durable:0340 · 20:09.300 → 20:12.140

EN: But the goal is that the system in itself is so,

ZH: 但目标是让系统本身做到：

### pi-durable:0341 · 20:13.040 → 20:13.200

EN: like,

ZH: 就是说，

### pi-durable:0342 · 20:13.700 → 20:15.600

EN: you should be able to write an agent in this

ZH: 你应该能够用它写一个 agent，

### pi-durable:0343 · 20:15.600 → 20:18.120

EN: that maintains a two-year-old Slack channel

ZH: 维护一个已经运行两年的 Slack 频道，

### pi-durable:0344 · 20:18.120 → 20:20.020

EN: and then you eventually want to rewrite it in TypeScript,

ZH: 然后最终想用 TypeScript 重写它时，

### pi-durable:0345 · 20:20.140 → 20:21.600

EN: but you can pick up the data as it was.

ZH: 仍然可以接着使用原有的数据。

### pi-durable:0346 · 20:22.100 → 20:22.180

EN: Right?

ZH: 对吧？

### pi-durable:0347 · 20:22.220 → 20:23.500

EN: So the idea here is like

ZH: 所以这里的想法是，

### pi-durable:0348 · 20:23.500 → 20:24.780

EN: that the underlying system

ZH: 底层系统

### pi-durable:0349 · 20:24.780 → 20:29.700

EN: is a trustworthy foundation to build on.

ZH: 应该是一个值得信赖的基础。

### pi-durable:0350 · 20:30.740 → 20:32.920

EN: So why did we not use Effect.js?

ZH: 那我们为什么没有用 Effect.js？

### pi-durable:0351 · 20:34.360 → 20:36.360

EN: Because it didn't solve any of our issues.

ZH: 因为它没有解决我们的问题。

### pi-durable:0352 · 20:36.820 → 20:37.740

EN: So out-of-the-box,

ZH: 开箱即用的

### pi-durable:0353 · 20:37.820 → 20:40.400

EN: Effect.js is great for in-memory,

ZH: Effect.js 很擅长处理内存中的、

### pi-durable:0354 · 20:40.500 → 20:40.980

EN: in-process,

ZH: 进程内的

### pi-durable:0355 · 20:41.180 → 20:42.040

EN: structured concurrency,

ZH: 结构化并发，

### pi-durable:0356 · 20:42.160 → 20:42.580

EN: for example,

ZH: 比如这一类事情。

### pi-durable:0357 · 20:42.720 → 20:44.780

EN: along with a metric ton of other stuff

ZH: 此外还有一大堆功能，

### pi-durable:0358 · 20:44.780 → 20:46.080

EN: like structured errors,

ZH: 比如结构化错误、

### pi-durable:0359 · 20:46.420 → 20:47.300

EN: dependency injection,

ZH: 依赖注入、

### pi-durable:0360 · 20:48.120 → 20:49.340

EN: cancellation and logging

ZH: 取消和日志，

### pi-durable:0361 · 20:49.340 → 20:50.640

EN: or telemetry traces

ZH: 或者遥测追踪，

### pi-durable:0362 · 20:50.640 → 20:51.200

EN: and all of that.

ZH: 以及类似的东西。

### pi-durable:0363 · 20:51.280 → 20:52.120

EN: It's fantastic.

ZH: 它非常棒。

### pi-durable:0364 · 20:52.120 → 20:53.380

EN: Truly fantastic.

ZH: 真的非常棒。

### pi-durable:0365 · 20:53.800 → 20:54.580

EN: Although I have to say

ZH: 不过我得说，

### pi-durable:0366 · 20:54.580 → 20:56.900

EN: that one of the maintainers recently said

ZH: 最近有位维护者说，

### pi-durable:0367 · 20:56.900 → 20:58.800

EN: he found out

ZH: 他发现

### pi-durable:0368 · 20:58.800 → 21:01.540

EN: he can no longer write Effect.js himself.

ZH: 自己已经没法亲手写 Effect.js 代码了。

### pi-durable:0369 · 21:03.460 → 21:04.480

EN: But it's not a problem

ZH: 但这不是问题，

### pi-durable:0370 · 21:04.480 → 21:05.700

EN: because agents understand it.

ZH: 因为 agent 能理解它。

### pi-durable:0371 · 21:08.260 → 21:09.040

EN: So again,

ZH: 所以，再说一次，

### pi-durable:0372 · 21:09.240 → 21:10.280

EN: we love Effect.js

ZH: 我们喜欢 Effect.js，

### pi-durable:0373 · 21:10.280 → 21:11.620

EN: and I think it's the right solution

ZH: 而且觉得它对

### pi-durable:0374 · 21:11.620 → 21:12.680

EN: for many, many problems.

ZH: 很多很多问题都是正确的解决方案。

### pi-durable:0375 · 21:12.820 → 21:13.360

EN: But for us,

ZH: 但对我们来说，

### pi-durable:0376 · 21:13.440 → 21:14.400

EN: it didn't solve a problem

ZH: 它没有解决问题，

### pi-durable:0377 · 21:14.400 → 21:16.340

EN: because Effect.js are out-of-the-box.

ZH: 因为开箱即用的 Effect.js

### pi-durable:0378 · 21:16.820 → 21:18.460

EN: That's exactly zero

ZH: 对持久化执行的支持，

### pi-durable:0379 · 21:18.460 → 21:19.820

EN: for durable execution.

ZH: 恰好是零。

### pi-durable:0380 · 21:20.960 → 21:22.500

EN: So the function A,

ZH: 也就是函数 A、

### pi-durable:0381 · 21:22.560 → 21:22.960

EN: function B,

ZH: 函数 B、

### pi-durable:0382 · 21:23.080 → 21:24.040

EN: function C thing,

ZH: 函数 C 那一套，

### pi-durable:0383 · 21:24.760 → 21:27.540

EN: that works great in memory,

ZH: 在内存里工作得很好，

### pi-durable:0384 · 21:28.220 → 21:30.440

EN: but Effect.js doesn't give you any primitives

ZH: 但 Effect.js 没有提供基础机制，

### pi-durable:0385 · 21:30.440 → 21:32.300

EN: to reestablish that call graph

ZH: 让你在恢复进程时

### pi-durable:0386 · 21:32.300 → 21:34.660

EN: if you have to resume the process.

ZH: 重建这张调用图。

### pi-durable:0387 · 21:35.580 → 21:37.400

EN: So then the question is,

ZH: 所以接下来的问题是：

### pi-durable:0388 · 21:38.040 → 21:38.300

EN: okay,

ZH: 好吧，

### pi-durable:0389 · 21:38.340 → 21:39.780

EN: if it doesn't help us with durability,

ZH: 如果它帮不了我们实现持久化执行，

### pi-durable:0390 · 21:39.780 → 21:42.140

EN: can we get anything else out of it

ZH: 那我们还能从中得到什么？

### pi-durable:0391 · 21:42.140 → 21:43.260

EN: and how hard would it be

ZH: 而且，要给它加上

### pi-durable:0392 · 21:43.260 → 21:44.720

EN: to add durability to this?

ZH: 持久化执行能力有多难？

### pi-durable:0393 · 21:45.080 → 21:45.880

EN: And it turns out

ZH: 结果发现，

### pi-durable:0394 · 21:45.880 → 21:47.260

EN: adding durability to this

ZH: 给它加入持久化执行能力，

### pi-durable:0395 · 21:47.260 → 21:49.420

EN: basically ends up

ZH: 最后基本上

### pi-durable:0396 · 21:49.420 → 21:50.680

EN: looking like what we have.

ZH: 就会变成我们现在做的东西：

### pi-durable:0397 · 21:51.460 → 21:53.780

EN: A task-based workflow engine.

ZH: 一个基于任务的工作流引擎。

### pi-durable:0398 · 21:54.260 → 21:55.720

EN: There's Effect.js workflow,

ZH: 有个 Effect.js workflow

### pi-durable:0399 · 21:55.940 → 21:56.660

EN: the package,

ZH: 软件包，

### pi-durable:0400 · 21:56.840 → 21:57.220

EN: or effect

ZH: 或者叫 Effect

### pi-durable:0401 · 21:57.220 → 21:58.880

EN: slash workflow,

ZH: /workflow，

### pi-durable:0402 · 21:59.480 → 22:00.360

EN: and it's basically that.

ZH: 它基本上就是这样。

### pi-durable:0403 · 22:00.440 → 22:01.520

EN: They call tasks activities

ZH: 它们把 task 叫作 activity，

### pi-durable:0404 · 22:01.520 → 22:03.180

EN: and it's basically

ZH: 本质上

### pi-durable:0405 · 22:03.180 → 22:04.800

EN: the same thing,

ZH: 是同一回事。

### pi-durable:0406 · 22:05.220 → 22:07.660

EN: except you also inherit all of Effect.js

ZH: 只是你还得同时引入整套 Effect.js，

### pi-durable:0407 · 22:07.660 → 22:09.280

EN: and we didn't want to make that.

ZH: 我们不想这么做。

### pi-durable:0408 · 22:09.460 → 22:10.080

EN: It's not a bet

ZH: 这并不是说它是不可靠的选择，

### pi-durable:0409 · 22:10.080 → 22:12.040

EN: because a lot of people build on Effect.js,

ZH: 毕竟很多人都在用 Effect.js 构建项目。

### pi-durable:0410 · 22:12.340 → 22:14.560

EN: but we want it to be self-contained

ZH: 但我们希望自己的实现是独立完整的。

### pi-durable:0411 · 22:14.560 → 22:15.900

EN: and in terms of portability,

ZH: 而且从可移植性来说，

### pi-durable:0412 · 22:16.760 → 22:18.960

EN: it's actually very easy to port

ZH: 要把 Pi Durable

### pi-durable:0413 · 22:18.960 → 22:20.760

EN: Pi Durable to something else.

ZH: 移植到别的环境，其实很容易。

### pi-durable:0414 · 22:20.940 → 22:21.680

EN: Ask me how I know.

ZH: 别问我是怎么知道的。

### pi-durable:0415 · 22:24.420 → 22:25.780

EN: It's less trivial

ZH: 相比之下，

### pi-durable:0416 · 22:25.780 → 22:27.120

EN: to port Effect.js

ZH: 要移植 Effect.js

### pi-durable:0417 · 22:27.120 → 22:31.020

EN: and its generator-based semantics to something else.

ZH: 以及它基于生成器的语义，就没那么简单了。

### pi-durable:0418 · 22:31.780 → 22:32.700

EN: So ultimately,

ZH: 所以最终，

### pi-durable:0419 · 22:32.860 → 22:34.540

EN: that's why we decided against Effect.js.

ZH: 这就是我们没有选择 Effect.js 的原因。

### pi-durable:0420 · 22:35.240 → 22:35.960

EN: And I also think

ZH: 而且我也觉得，

### pi-durable:0421 · 22:35.960 → 22:37.280

EN: a useful,

ZH: 它很有用，

### pi-durable:0422 · 22:37.720 → 22:38.500

EN: so I actually think

ZH: 其实我确实觉得

### pi-durable:0423 · 22:38.500 → 22:39.400

EN: Effect is quite useful.

ZH: Effect 相当有用。

### pi-durable:0424 · 22:39.720 → 22:41.800

EN: I don't actually think it's particularly useful for Durable

ZH: 只是出于一些原因，我不认为

### pi-durable:0425 · 22:41.800 → 22:42.520

EN: for a bunch of reasons,

ZH: 它特别适合 Durable。

### pi-durable:0426 · 22:42.660 → 22:43.580

EN: but I did

ZH: 但我确实

### pi-durable:0427 · 22:43.580 → 22:44.900

EN: in an attempt

ZH: 尝试过，

### pi-durable:0428 · 22:44.900 → 22:47.060

EN: to use what we built and also to,

ZH: 一方面是为了使用我们构建的东西，另一方面，

### pi-durable:0429 · 22:49.100 → 22:50.780

EN: like a lot of the side projects that I'm doing

ZH: 我做的很多业余项目，

### pi-durable:0430 · 22:50.780 → 22:53.100

EN: just to figure out how to build a software factory

ZH: 比如为了弄清楚怎么构建软件工厂，

### pi-durable:0431 · 22:53.100 → 22:54.060

EN: and things like that

ZH: 以及类似的项目，

### pi-durable:0432 · 22:54.060 → 22:56.440

EN: are in fact based on Effect.

ZH: 实际上都是基于 Effect 的。

### pi-durable:0433 · 22:57.440 → 22:58.080

EN: And the reason

ZH: 之所以

### pi-durable:0434 · 22:58.080 → 22:58.780

EN: they're based on Effect

ZH: 基于 Effect，

### pi-durable:0435 · 22:58.780 → 22:59.400

EN: is because I think

ZH: 是因为我觉得

### pi-durable:0436 · 22:59.400 → 23:00.920

EN: Effect does actually

ZH: Effect 确实

### pi-durable:0437 · 23:00.920 → 23:04.400

EN: solve some of the guardrail problems today because like,

ZH: 能解决目前的一些约束问题。比如说，

### pi-durable:0438 · 23:04.540 → 23:04.940

EN: for instance,

ZH: 举个例子，

### pi-durable:0439 · 23:05.520 → 23:06.560

EN: it strongly encourages

ZH: 它强烈鼓励

### pi-durable:0440 · 23:06.560 → 23:07.640

EN: you not to throw exceptions.

ZH: 你不要直接抛出异常。

### pi-durable:0441 · 23:08.000 → 23:09.340

EN: It strongly encourages

ZH: 也强烈鼓励

### pi-durable:0442 · 23:09.340 → 23:10.380

EN: you to compose services.

ZH: 你通过组合来组织服务。

### pi-durable:0443 · 23:11.100 → 23:14.760

EN: So it is a pretty useful crutch almost

ZH: 所以它几乎像一根很有用的拐杖，

### pi-durable:0444 · 23:14.760 → 23:16.820

EN: to get a little bit

ZH: 能帮你给

### pi-durable:0445 · 23:16.820 → 23:18.720

EN: of structure

ZH: TypeScript 项目

### pi-durable:0446 · 23:18.720 → 23:19.920

EN: into a TypeScript project

ZH: 增加一些结构。

### pi-durable:0447 · 23:19.920 → 23:20.880

EN: where it would otherwise

ZH: 否则，

### pi-durable:0448 · 23:20.880 → 23:21.800

EN: not have a lot of it

ZH: 当你把项目交给 agent 时，

### pi-durable:0449 · 23:21.800 → 23:23.400

EN: when you leave an agent to it.

ZH: 它可能不会有多少结构。

### pi-durable:0450 · 23:23.400 → 23:25.540

EN: But simultaneously,

ZH: 但与此同时，

### pi-durable:0451 · 23:26.800 → 23:29.280

EN: if I then start the same project

ZH: 如果我重新做同一个项目，

### pi-durable:0452 · 23:29.280 → 23:30.840

EN: without Effect,

ZH: 不用 Effect，

### pi-durable:0453 · 23:30.980 → 23:31.580

EN: like I did this

ZH: 我现在已经这样试过

### pi-durable:0454 · 23:31.580 → 23:32.220

EN: a bunch of times now,

ZH: 好几次了，

### pi-durable:0455 · 23:32.300 → 23:33.060

EN: like build this with Effect,

ZH: 一遍用 Effect 来做，

### pi-durable:0456 · 23:33.180 → 23:33.920

EN: build it without Effect,

ZH: 一遍不用 Effect 来做，

### pi-durable:0457 · 23:34.500 → 23:35.880

EN: it's actually not entirely clear

ZH: 其实还不能完全确定，

### pi-durable:0458 · 23:35.880 → 23:36.640

EN: that the Effect solution

ZH: Effect 方案

### pi-durable:0459 · 23:36.640 → 23:38.220

EN: is also definitely

ZH: 也一定

### pi-durable:0460 · 23:38.220 → 23:39.120

EN: better for the agent

ZH: 更适合 agent。

### pi-durable:0461 · 23:39.120 → 23:41.060

EN: because for the very least,

ZH: 因为至少，

### pi-durable:0462 · 23:41.120 → 23:42.040

EN: you actually do end up

ZH: 有点讽刺的是，最后你通常

### pi-durable:0463 · 23:42.040 → 23:43.560

EN: ironically with more code usually.

ZH: 反而会写出更多代码。

### pi-durable:0464 · 23:44.400 → 23:45.220

EN: And more code

ZH: 而代码更多，

### pi-durable:0465 · 23:45.220 → 23:47.020

EN: is still a little bit of a challenge

ZH: 对这种场景来说，

### pi-durable:0466 · 23:47.020 → 23:48.840

EN: for this.

ZH: 仍然是个挑战。

### pi-durable:0467 · 23:49.540 → 23:50.960

EN: But I think the Effect people

ZH: 但我觉得 Effect 团队

### pi-durable:0468 · 23:50.960 → 23:51.820

EN: are on the right track

ZH: 总体上走在正确的方向，

### pi-durable:0469 · 23:51.820 → 23:54.340

EN: in general about expressing software like this.

ZH: 用这样的方式来表达软件。

### pi-durable:0470 · 23:55.140 → 23:55.920

EN: And I already

ZH: 我已经

### pi-durable:0471 · 23:55.920 → 23:57.740

EN: proposed to

ZH: 向他们当中

### pi-durable:0472 · 23:57.740 → 23:59.500

EN: at least two of them,

ZH: 至少两个人提议过，

### pi-durable:0473 · 23:59.740 → 24:01.480

EN: why not try to build

ZH: 为什么不试着把它

### pi-durable:0474 · 24:01.480 → 24:04.400

EN: it into TypeScript,

ZH: 直接做进 TypeScript 呢？

### pi-durable:0475 · 24:04.680 → 24:06.320

EN: have a version of TypeScript

ZH: 做一个能够

### pi-durable:0476 · 24:06.320 → 24:08.280

EN: that expresses effects.

ZH: 表达 effect 的 TypeScript 版本。

### pi-durable:0477 · 24:08.920 → 24:09.720

EN: Because then

ZH: 因为这样，

### pi-durable:0478 · 24:09.720 → 24:11.180

EN: a lot of these hacks

ZH: 目前的很多变通手段，

### pi-durable:0479 · 24:11.180 → 24:12.200

EN: that are currently there

ZH: 比如现在用的

### pi-durable:0480 · 24:12.200 → 24:14.800

EN: with Effect Gen

ZH: Effect.gen，

### pi-durable:0481 · 24:14.800 → 24:18.120

EN: and the service declarations might actually become

ZH: 以及服务声明，就有可能成为

### pi-durable:0482 · 24:18.120 → 24:20.360

EN: core permittives of a language.

ZH: 语言本身的核心基础能力。

### pi-durable:0483 · 24:20.360 → 24:22.280

EN: I definitely want someone

ZH: 我很希望有人

### pi-durable:0484 · 24:22.280 → 24:23.240

EN: to do some experiments

ZH: 在这方面做些实验，

### pi-durable:0485 · 24:23.240 → 24:24.580

EN: there and see where it goes.

ZH: 看看会走到哪里。

### pi-durable:0486 · 24:25.960 → 24:26.580

EN: But I think

ZH: 不过我觉得，

### pi-durable:0487 · 24:26.580 → 24:29.100

EN: the portability part about it is a pretty

ZH: 可移植性确实是一个

### pi-durable:0488 · 24:29.100 → 24:30.940

EN: big part.

ZH: 很重要的因素。

### pi-durable:0489 · 24:31.120 → 24:32.080

EN: The Effect

ZH: Effect

### pi-durable:0490 · 24:32.080 → 24:35.480

EN: adds a lot of effect to the

ZH: 会让你大量依赖

### pi-durable:0491 · 24:35.480 → 24:37.620

EN: effect ecosystem.

ZH: Effect 生态。

### pi-durable:0492 · 24:38.020 → 24:38.720

EN: It's viral,

ZH: 基本上，它会不断蔓延，

### pi-durable:0493 · 24:38.860 → 24:39.200

EN: basically.

ZH: 就是这样。

### pi-durable:0494 · 24:39.380 → 24:40.380

EN: It is very viral.

ZH: 确实会。

### pi-durable:0495 · 24:40.780 → 24:43.400

EN: Even using a database usually goes through other effect libraries.

ZH: 甚至使用数据库，通常也要经过其他 Effect 库。

### pi-durable:0496 · 24:43.660 → 24:43.920

EN: And so

ZH: 所以，

### pi-durable:0497 · 24:43.920 → 24:47.300

EN: you inherit all of that,

ZH: 你得一并接受这一切。

### pi-durable:0498 · 24:47.300 → 24:49.340

EN: which you might

ZH: 如果是在

### pi-durable:0499 · 24:49.340 → 24:50.200

EN: individually want to do

ZH: 构建自己的应用，

### pi-durable:0500 · 24:50.200 → 24:51.100

EN: if you build an application.

ZH: 你可能愿意做这个选择。

### pi-durable:0501 · 24:51.520 → 24:53.240

EN: I think it's a much tougher sell

ZH: 但如果你想做的是

### pi-durable:0502 · 24:53.240 → 24:54.400

EN: if you want to build

ZH: 供其他人使用的

### pi-durable:0503 · 24:54.400 → 24:55.680

EN: a foundation framework

ZH: 底层框架，

### pi-durable:0504 · 24:55.680 → 24:57.780

EN: that other people then use.

ZH: 那就难以说服别人了。

### pi-durable:0505 · 24:58.000 → 24:59.400

EN: Because you would basically

ZH: 因为这基本上意味着，

### pi-durable:0506 · 24:59.400 → 25:01.980

EN: force that choice onto the user.

ZH: 你把这个选择强加给用户。

### pi-durable:0507 · 25:02.940 → 25:03.960

EN: Which is pretty tough.

ZH: 这挺难的。

### pi-durable:0508 · 25:04.920 → 25:05.400

EN: Again,

ZH: 再说一次，

### pi-durable:0509 · 25:05.640 → 25:08.080

EN: we are absolutely not dunking on Effect.

ZH: 我们绝不是在贬低 Effect。

### pi-durable:0510 · 25:08.440 → 25:09.340

EN: We actually really,

ZH: 我们真的

### pi-durable:0511 · 25:09.440 → 25:10.060

EN: really like it.

ZH: 非常喜欢它。

### pi-durable:0512 · 25:10.180 → 25:11.480

EN: And if you're building applications,

ZH: 如果你在构建应用，

### pi-durable:0513 · 25:11.640 → 25:12.740

EN: you should use it.

ZH: 你应该考虑使用它，

### pi-durable:0514 · 25:13.140 → 25:14.620

EN: If you build applications with TypeScript.

ZH: 尤其是用 TypeScript 构建应用的时候。

### pi-durable:0515 · 25:15.940 → 25:16.100

EN: Yeah.

ZH: 对。

### pi-durable:0516 · 25:17.860 → 25:18.260

EN: Yeah.

ZH: 对。

### pi-durable:0517 · 25:18.680 → 25:19.920

EN: So that's what we have today.

ZH: 这就是我们目前做出来的东西。

### pi-durable:0518 · 25:20.020 → 25:21.240

EN: I think one thing that

ZH: 我觉得有一件事，

### pi-durable:0519 · 25:21.240 → 25:23.980

EN: we want people to do

ZH: 我们希望大家去做，

### pi-durable:0520 · 25:23.980 → 25:25.980

EN: is to play with it and particularly

ZH: 就是试用一下，尤其是

### pi-durable:0521 · 25:25.980 → 25:27.840

EN: see if the data model that we have makes sense.

ZH: 看看这个数据模型是否合理。

### pi-durable:0522 · 25:29.640 → 25:31.120

EN: And I think the vacation

ZH: 我觉得那个 vacation

### pi-durable:0523 · 25:31.120 → 25:32.420

EN: example that we have

ZH: 示例，

### pi-durable:0524 · 25:32.420 → 25:33.660

EN: in the repository

ZH: 就在那个代码仓库里，

### pi-durable:0525 · 25:33.660 → 25:34.660

EN: is a good starting point.

ZH: 是一个不错的起点。

### pi-durable:0526 · 25:35.680 → 25:37.880

EN: Because we would like to know

ZH: 因为我们想先确认，

### pi-durable:0527 · 25:37.880 → 25:41.100

EN: that this solves your problems

ZH: 它确实解决了你的问题，

### pi-durable:0528 · 25:41.100 → 25:44.540

EN: before we fully commit to it and then rewire the world

ZH: 再彻底投入，并把所有东西

### pi-durable:0529 · 25:44.540 → 25:45.760

EN: on top of that.

ZH: 都改造到它上面。

### pi-durable:0530 · 25:46.780 → 25:50.300

EN: But that you mean rewiring Pi Coding Agent?

ZH: 你说的“改造所有东西”，是指改造 Pi Coding Agent 吗？

### pi-durable:0531 · 25:50.720 → 25:51.060

EN: For instance,

ZH: 比如，

### pi-durable:0532 · 25:51.180 → 25:52.320

EN: the Pi Coding Agent on it

ZH: 把 Pi Coding Agent 建立在它之上，

### pi-durable:0533 · 25:52.320 → 25:54.620

EN: or just to build more

ZH: 或者再做一些

### pi-durable:0534 · 25:54.620 → 25:58.100

EN: functionality that people

ZH: 大家可能需要的功能，

### pi-durable:0535 · 25:58.100 → 26:00.080

EN: might want to have because the core

ZH: 因为这些能力

### pi-durable:0536 · 26:00.080 → 26:00.900

EN: doesn't support it yet.

ZH: 核心目前还不支持。

### pi-durable:0537 · 26:01.740 → 26:02.440

EN: I know that

ZH: 我知道，

### pi-durable:0538 · 26:02.440 → 26:03.860

EN: some of the people that were playing

ZH: 有些已经开始

### pi-durable:0539 · 26:03.860 → 26:04.860

EN: with it already said like, hey,

ZH: 试用的人说过，

### pi-durable:0540 · 26:04.960 → 26:08.660

EN: maybe there needs to be more abstraction over the state system.

ZH: 也许需要在状态系统之上再加一层抽象。

### pi-durable:0541 · 26:09.840 → 26:11.620

EN: Whatever we would want to build

ZH: 无论我们想在它之上

### pi-durable:0542 · 26:11.620 → 26:12.380

EN: on top of that

ZH: 构建什么，

### pi-durable:0543 · 26:12.380 → 26:14.480

EN: even just to assist people to building with it.

ZH: 哪怕只是为了帮助大家更容易地使用它，

### pi-durable:0544 · 26:16.120 → 26:16.600

EN: Ideally,

ZH: 理想情况下，

### pi-durable:0545 · 26:16.700 → 26:18.100

EN: we'd know that the core

ZH: 都应该先确认核心的

### pi-durable:0546 · 26:18.100 → 26:21.280

EN: data storage abstraction system works.

ZH: 数据存储抽象是行得通的。

### pi-durable:0547 · 26:22.280 → 26:22.760

EN: So,

ZH: 所以，

### pi-durable:0548 · 26:22.980 → 26:24.500

EN: I have high confidence that

ZH: 我很有信心，

### pi-durable:0549 · 26:24.500 → 26:26.540

EN: this kind of low-level API

ZH: 我们现在这种底层 API，

### pi-durable:0550 · 26:26.540 → 26:30.560

EN: that we now have is a good primitive pending some plus and minuses.

ZH: 经过一些增减调整之后，会是很好的基础能力。

### pi-durable:0551 · 26:31.100 → 26:33.020

EN: But I do agree that, for example,

ZH: 但我也同意，比如说，

### pi-durable:0552 · 26:33.560 → 26:35.020

EN: some sugar on top of it,

ZH: 在上面加一点易用的封装，

### pi-durable:0553 · 26:35.240 → 26:36.980

EN: specifically with regards to state management,

ZH: 尤其是在状态管理方面，

### pi-durable:0554 · 26:36.980 → 26:38.280

EN: is probably a good idea.

ZH: 大概是个好主意。

### pi-durable:0555 · 26:38.400 → 26:40.000

EN: Not just for humans, but for agents as well.

ZH: 不只是对人，对 agent 也一样。

### pi-durable:0556 · 26:40.660 → 26:41.720

EN: It's just unclear

ZH: 只是我还不清楚，

### pi-durable:0557 · 26:41.720 → 26:45.400

EN: to me what a nice abstraction there would look like.

ZH: 一个好的抽象应该长什么样。

### pi-durable:0558 · 26:45.940 → 26:46.520

EN: And also,

ZH: 另外，

### pi-durable:0559 · 26:46.740 → 26:48.960

EN: we are not just relying on external builders using

ZH: 我们也不只是依靠外部开发者使用

### pi-durable:0560 · 26:48.960 → 26:50.820

EN: Pi Durable to figure out what works and what doesn't.

ZH: Pi Durable，来判断什么可行、什么不可行。

### pi-durable:0561 · 26:51.080 → 26:52.400

EN: We are actually betting on this

ZH: 我们其实已经决定，

### pi-durable:0562 · 26:52.400 → 26:55.400

EN: for all of our Earendil products going forward.

ZH: 今后的 Earendil 产品都建立在它之上。

### pi-durable:0563 · 26:56.220 → 26:57.220

EN: And in the future,

ZH: 而在未来，

### pi-durable:0564 · 26:57.400 → 26:57.980

EN: that means in the

ZH: 也就是

### pi-durable:0565 · 26:57.980 → 26:58.640

EN: next couple of weeks,

ZH: 接下来的几周，

### pi-durable:0566 · 26:58.860 → 27:00.360

EN: we have a bunch of team members who

ZH: 会有几位团队成员

### pi-durable:0567 · 27:00.360 → 27:01.400

EN: will use it in

ZH: 真正深入地使用它，

### pi-durable:0568 · 27:01.400 → 27:04.080

EN: anger, build some tools that we actually use in

ZH: 构建一些我们实际会在

### pi-durable:0569 · 27:04.080 → 27:05.280

EN: production that are

ZH: 生产环境里使用的工具。

### pi-durable:0570 · 27:05.280 → 27:12.180

EN: very focused on a specific task, and we will document our journey and what we learned and obviously also provide the code

ZH: 这些工具会专注于具体任务。我们会记录整个过程和经验，也会提供

### pi-durable:0571 · 27:12.180 → 27:13.540

EN: that we created

ZH: 过程中写出的代码，

### pi-durable:0572 · 27:13.540 → 27:17.420

EN: in a part of that process so other people can get inspired by that.

ZH: 让其他人能够从中获得启发。

### pi-durable:0573 · 27:18.660 → 27:23.260

EN: Also, don't be surprised if there are some new faces coming up on these meditations in the future.

ZH: 另外，以后这些 Meditations 对谈里，如果出现一些新面孔，也不要意外。

### pi-durable:0574 · 27:23.400 → 27:23.700

EN: That's all.

ZH: 就这些。

### pi-durable:0575 · 27:23.820 → 27:24.240

EN: Bye!

ZH: 拜拜！

### pi-durable:0576 · 27:24.840 → 27:25.220

EN: Bye-bye.

ZH: 拜拜。

## 2026-09-28 · 模型变了，Pi 需要跟着改变吗？

When models change, should Pi change too?

原帖：https://x.com/pidotdev/status/2104510506627121451

视频：https://video.twimg.com/amplify_video/2104478098821447680/vid/avc1/1920x1080/ry6nsFyCvSiTjgEl.mp4?tag=29

共 382 条字幕。

### changing-models:0001 · 00:00.000 → 00:03.360

EN: Yeah, welcome from the world of snot and coughs.

ZH: 欢迎来到鼻涕和咳嗽的世界。

### changing-models:0002 · 00:05.160 → 00:11.640

EN: Yes, Mario and I, we are at the beginning of the Kids

ZH: 对，Mario 和我现在刚好赶上了孩子们

### changing-models:0003 · 00:11.640 → 00:13.220

EN: Bring All Your Sickness at Home Wave.

ZH: 把各种病带回家的这一波。

### changing-models:0004 · 00:13.220 → 00:19.160

EN: Yeah, everybody sends their kids to school or kindergarten and then a week later everybody is sick.

ZH: 大家把孩子送去学校或幼儿园，一周后所有人都病了。

### changing-models:0005 · 00:20.740 → 00:22.600

EN: So a small little anecdote here.

ZH: 说个小插曲。

### changing-models:0006 · 00:22.600 → 00:28.640

EN: I started my career at Sentry pretty much exactly

ZH: 我开始在 Sentry 工作的时间，差不多正好

### changing-models:0007 · 00:28.640 → 00:31.120

EN: coinciding with us getting our first kid.

ZH: 和我们第一个孩子出生重合。

### changing-models:0008 · 00:31.920 → 00:36.100

EN: And now David, a friend of mine, founder of Sentry, now he has his first kid.

ZH: 我的朋友、Sentry 创始人 David，现在也有了第一个孩子。

### changing-models:0009 · 00:36.100 → 00:42.560

EN: And now he's learning all that stuff and then sharing on Twitter.

ZH: 他现在才开始体会这些，然后在 Twitter 上分享。

### changing-models:0010 · 00:42.640 → 00:43.980

EN: It's like, how do you manage to work with kids?

ZH: 比如：有孩子以后到底怎么工作？

### changing-models:0011 · 00:44.240 → 00:45.320

EN: It works.

ZH: 能工作的。

### changing-models:0012 · 00:47.600 → 00:49.680

EN: Yeah, first time.

ZH: 是啊，第一次嘛。

### changing-models:0013 · 00:50.960 → 00:52.140

EN: It just requires adjustment.

ZH: 就是需要适应。

### changing-models:0014 · 00:52.600 → 00:53.860

EN: Yeah.

ZH: 对。

### changing-models:0015 · 00:54.880 → 00:59.940

EN: And we are now also adjusting to the models changing.

ZH: 我们现在也在适应模型的变化。

### changing-models:0016 · 01:00.320 → 01:00.980

EN: What a segue.

ZH: 这转场真不错。

### changing-models:0017 · 01:01.560 → 01:02.340

EN: And what a segue.

ZH: 真是个好转场。

### changing-models:0018 · 01:03.420 → 01:04.820

EN: You're really good at this now.

ZH: 你现在越来越擅长这个了。

### changing-models:0019 · 01:07.700 → 01:13.920

EN: So we decided we want to talk a little bit about how the new models behave and what

ZH: 所以我们想聊聊新模型的行为，

### changing-models:0020 · 01:13.920 → 01:18.660

EN: implications to have on harnesses and how we might or might not respond to that.

ZH: 这对 harness 有什么影响，以及我们可能会怎么应对，或者不应对。

### changing-models:0021 · 01:20.320 → 01:21.380

EN: And what we think about it.

ZH: 还有我们怎么看这件事。

### changing-models:0022 · 01:21.380 → 01:21.880

EN: Right.

ZH: 对。

### changing-models:0023 · 01:21.880 → 01:21.900

EN: Right.

ZH: 对。

### changing-models:0024 · 01:22.040 → 01:28.340

EN: So the problem that Armin identified recently with the release of Opus 5.5 was that it stopped using the

ZH: Armin 最近发现的问题是，Opus 5.5 发布后，

### changing-models:0025 · 01:28.340 → 01:31.280

EN: edit tool and just basically uses bash for everything now.

ZH: 它不再使用 edit 工具了，基本上什么事都用 Bash。

### changing-models:0026 · 01:32.720 → 01:35.600

EN: For, yeah, well, Python, why a bash?

ZH: 对，或者说，通过 Bash 来运行 Python。

### changing-models:0027 · 01:35.600 → 01:39.200

EN: That might be token efficient.

ZH: 这样可能比较省 token。

### changing-models:0028 · 01:39.200 → 01:43.320

EN: It might have some correctness issues like you identified.

ZH: 但也可能存在你发现的那些正确性问题。

### changing-models:0029 · 01:43.320 → 01:49.620

EN: Like the code might not necessarily give the model signal that the edit didn't actually

ZH: 比如，这些代码未必能让模型知道：这次编辑

### changing-models:0030 · 01:49.620 → 01:51.160

EN: do what it's supposed to do.

ZH: 其实没有达到预期的效果。

### changing-models:0031 · 01:51.160 → 01:52.880

EN: So that's not cool.

ZH: 这就不好了。

### changing-models:0032 · 01:52.880 → 01:59.920

EN: And from a UX perspective, you, as the user watching a transcript flow by,

ZH: 而从用户体验来说，你看着执行记录不断往下刷，

### changing-models:0033 · 01:59.920 → 02:05.840

EN: don't get a nice diff anymore necessarily, but just a super complicated token efficient

ZH: 未必还能看到清楚的 diff，而是一段极其复杂、节省 token 的

### changing-models:0034 · 02:05.840 → 02:08.120

EN: bash call with Python intermixed.

ZH: Bash 调用，里面还混着 Python。

### changing-models:0035 · 02:08.400 → 02:09.700

EN: And that's not great.

ZH: 这体验也不太好。

### changing-models:0036 · 02:10.120 → 02:12.560

EN: So the question is, what do we do, Armin?

ZH: 所以问题来了，Armin，我们怎么办？

### changing-models:0037 · 02:12.700 → 02:13.280

EN: What do we do?

ZH: 怎么办呢？

### changing-models:0038 · 02:13.280 → 02:19.080

EN: So maybe, so I think that there are two

ZH: 我觉得这里有两个

### changing-models:0039 · 02:19.080 → 02:22.540

EN: macro trends,

ZH: 大的趋势，

### changing-models:0040 · 02:22.540 → 02:24.600

EN: I would say, that affect us too.

ZH: 它们也在影响我们。

### changing-models:0041 · 02:24.680 → 02:30.140

EN: But I think like at least for the token max of the world, like why do we even care what the transcript is one?

ZH: 不过，对那些追求大量使用 token 的人来说，首先就是：为什么还要在意执行记录？

### changing-models:0042 · 02:30.400 → 02:32.400

EN: It's like you only look at the end result.

ZH: 只看最终结果不就好了。

### changing-models:0043 · 02:32.400 → 02:35.820

EN: And then the second, I think,

ZH: 第二个我觉得

### changing-models:0044 · 02:35.820 → 02:39.480

EN: thing worth discussing is not everything is a coding agent.

ZH: 值得讨论的问题是，并不是所有 agent 都是编程 agent。

### changing-models:0045 · 02:40.680 → 02:43.060

EN: And some things want to have more control.

ZH: 有些场景需要更强的控制。

### changing-models:0046 · 02:43.380 → 02:48.000

EN: And like the less likely an agent is at using the things you want him to use,

ZH: agent 越不愿意使用你希望它使用的工具，

### changing-models:0047 · 02:48.000 → 02:52.200

EN: the more control you're sort of giving away in one form or another.

ZH: 你就越是在以某种方式让出控制权。

### changing-models:0048 · 02:54.300 → 02:56.540

EN: So maybe we start with like, what's the point of the transcript?

ZH: 那我们先聊聊：执行记录到底有什么用？

### changing-models:0049 · 02:56.540 → 03:01.000

EN: Yeah, I mean, for me,

ZH: 对我来说，

### changing-models:0050 · 03:01.000 → 03:07.480

EN: the transcript, the transcript with respect to seeing diffs and

ZH: 如果执行记录的作用是看 diff 之类的东西，

### changing-models:0051 · 03:07.480 → 03:11.240

EN: so on is meaningless for me 99% of all the time.

ZH: 那在 99% 的时候，它对我都没意义。

### changing-models:0052 · 03:11.340 → 03:15.060

EN: If I have more than one agent open, I'm not looking at all the transcripts flowing by.

ZH: 如果我同时开着多个 agent，我不会盯着所有执行记录看。

### changing-models:0053 · 03:15.300 → 03:16.180

EN: That's a waste of my time.

ZH: 那是在浪费时间。

### changing-models:0054 · 03:16.260 → 03:22.060

EN: I'm basically looking at the result, the artifacts, the file changes they made after they think they're done.

ZH: 我主要看结果，看它们自认为完成之后产出的东西和文件改动。

### changing-models:0055 · 03:22.060 → 03:28.200

EN: And I do this in a proper IDE or editor with a nice diff tool where I have code

ZH: 而且我会在真正的 IDE 或编辑器里看，那里有好用的 diff 工具，

### changing-models:0056 · 03:28.200 → 03:31.860

EN: navigation, might even be able to debug things like VS Code.

ZH: 能跳转代码，甚至能调试，比如 VS Code。

### changing-models:0057 · 03:32.540 → 03:38.940

EN: And that seems to be a much better spend of my time than watching transcripts go by and seeing edit tool

ZH: 相比盯着执行记录、看 edit 工具调用，

### changing-models:0058 · 03:38.940 → 03:44.620

EN: calls and kind of interfering when I see something stupid being generated or edited.

ZH: 一看到生成或修改了蠢东西就插手，我觉得这样更值得花时间。

### changing-models:0059 · 03:46.200 → 03:47.400

EN: I think it's the same for me.

ZH: 我也差不多。

### changing-models:0060 · 03:47.400 → 03:52.600

EN: I don't watch the transcript as it's doing except for a handful of cases,

ZH: 除了少数几种情况，我不会在它执行时盯着记录。

### changing-models:0061 · 03:52.600 → 03:58.840

EN: one of which is if I ask it to, for instance, do something with a computer.

ZH: 一种情况是，我让它在计算机上做些操作。

### changing-models:0062 · 03:59.140 → 04:03.720

EN: I'm not saying a computer use, but like, for instance,

ZH: 我不是指 computer use，而是比如说，

### changing-models:0063 · 04:03.720 → 04:10.040

EN: configure CI or figure out some access to a

ZH: 配置 CI，或者搞清楚怎么访问

### changing-models:0064 · 04:10.040 → 04:11.780

EN: remote service, like apply Pulumi things.

ZH: 远程服务，比如执行 Pulumi 的变更。

### changing-models:0065 · 04:11.780 → 04:13.220

EN: Then I really care about what it's doing.

ZH: 这时候我就很关心它在做什么。

### changing-models:0066 · 04:14.700 → 04:21.340

EN: But for the most part, the transcript to me doesn't have, at least when it implements stuff, I don't really care about it.

ZH: 但大多数时候，至少它在实现功能时，我并不太关心执行记录。

### changing-models:0067 · 04:21.460 → 04:28.700

EN: I do, however, have the situation where I have a conversation with the agent about how to solve a particular problem.

ZH: 不过，我会和 agent 讨论具体问题该怎么解决。

### changing-models:0068 · 04:28.980 → 04:34.620

EN: And in order for it to have a better understanding of what we're doing,

ZH: 为了让它更好地理解我们在做的事情，

### changing-models:0069 · 04:34.620 → 04:38.580

EN: it is encouraged to read files, understand the code base and so forth.

ZH: 我会鼓励它读文件、理解代码库等等。

### changing-models:0070 · 04:38.580 → 04:45.400

EN: And then you have this intermittent read some stuff, maybe do a POC, and then we discuss.

ZH: 于是过程就是：读一些东西，也许做个概念验证，然后我们继续讨论。

### changing-models:0071 · 04:46.120 → 04:52.160

EN: And so most of the transcript now no longer collapses as nice in Pi as it used to because like all their,

ZH: 现在这些记录在 Pi 里不像以前那样能很好地折叠了，

### changing-models:0072 · 04:52.160 → 04:57.560

EN: I mean, it probably already had a lot of like bash commands in there that already didn't compress all that well.

ZH: 虽然以前也有不少 Bash 命令，本来就不太好折叠。

### changing-models:0073 · 04:57.780 → 05:04.200

EN: But now the inputs to those tool calls are humongous because they are all the writes now and they don't collapse.

ZH: 但现在这些工具调用的输入特别大，因为所有写入操作都放进去了，而且不会折叠。

### changing-models:0074 · 05:04.200 → 05:09.740

EN: So the transcript now for me becomes harder to read when I do still want it just because all the

ZH: 所以在我确实想读记录的时候，它反而更难读了，

### changing-models:0075 · 05:09.740 → 05:13.780

EN: verbosity and the ugliness of the tool calls in there.

ZH: 因为里面的工具调用又冗长又难看。

### changing-models:0076 · 05:14.420 → 05:14.540

EN: Yeah.

ZH: 是的。

### changing-models:0077 · 05:14.920 → 05:21.180

EN: I can see that something that touches a production system or even a staging system where you want to actually see individual

ZH: 我理解，如果操作涉及生产环境，甚至预发布环境，你确实会想看每条

### changing-models:0078 · 05:21.180 → 05:26.840

EN: commands to judge whether something's going to go to shit real soon.

ZH: 命令，判断它是不是马上就要搞砸。

### changing-models:0079 · 05:26.840 → 05:28.440

EN: That makes sense.

ZH: 这很合理。

### changing-models:0080 · 05:29.100 → 05:32.920

EN: I don't know if there's a good solution to that.

ZH: 我不知道有没有好的解决办法。

### changing-models:0081 · 05:33.020 → 05:37.500

EN: Like we looked at what other harnesses like Codex or Claude Code are doing.

ZH: 我们看过 Codex、Claude Code 等其他 harness 的做法。

### changing-models:0082 · 05:37.740 → 05:39.600

EN: And I think you looked into Claude Code.

ZH: 你应该研究过 Claude Code。

### changing-models:0083 · 05:39.780 → 05:41.160

EN: What's their solution here?

ZH: 它们是怎么解决的？

### changing-models:0084 · 05:41.160 → 05:45.240

EN: So Claude Code on all the new models,

ZH: Claude Code 对所有新模型，

### changing-models:0085 · 05:45.240 → 05:49.120

EN: which is Fable 5, 5.1 and Opus 5.5 uses,

ZH: 包括 Fable 5、5.1 和 Opus 5.5，都用了一个模式。

### changing-models:0086 · 05:49.120 → 05:53.880

EN: I forgot the name, they had a really funny name for this, but it's basically a mode where two things are happening.

ZH: 名字我忘了，那个名字挺有意思的，但本质上它做两件事。

### changing-models:0087 · 05:54.060 → 05:59.240

EN: One is it basically pushes with a prompt instruction, the agents would just use bash.

ZH: 第一，通过提示词指令，推动 agent 直接使用 Bash。

### changing-models:0088 · 05:59.240 → 06:03.800

EN: So like they're reinforcing even the thing that sort of it does by hand, out of the box anyways.

ZH: 也就是说，模型本来默认就会这么做，它们还进一步强化了这种行为。

### changing-models:0089 · 06:04.520 → 06:11.380

EN: But then what they are doing is they're snapshotting by writing into a separate Git work tree all the files that you're working on anyway.

ZH: 第二，它会把你正在处理的文件写入一个单独的 Git 工作树，保存快照。

### changing-models:0090 · 06:11.580 → 06:17.620

EN: So in addition to the Git, it's not the user work tree in the traditional sense,

ZH: 在原有 Git 状态之外，它并不是传统意义上的用户工作树，

### changing-models:0091 · 06:17.620 → 06:19.140

EN: but it writes into a separate index.

ZH: 而是写入一个单独的索引。

### changing-models:0092 · 06:19.240 → 06:24.000

EN: So it maintains for each repo you're working on a separate index just for one agentic run.

ZH: 所以，对每个仓库，它都会为一次 agent 执行维护单独的索引。

### changing-models:0093 · 06:24.000 → 06:27.240

EN: And then after and before each tool call,

ZH: 然后在每次工具调用前后，

### changing-models:0094 · 06:27.240 → 06:32.260

EN: it compares the state of that local checkout to the work tree it had before.

ZH: 它会比较当前本地检出的状态和之前保存的工作树状态。

### changing-models:0095 · 06:32.420 → 06:37.960

EN: And then it synthesizes a diff into the UI as if an edit tool call happened.

ZH: 再在界面里合成一个 diff，看起来像是发生了一次 edit 工具调用。

### changing-models:0096 · 06:38.760 → 06:41.660

EN: So you can see the snapshot as it was taking place there.

ZH: 这样你就能看到当时发生的变化。

### changing-models:0097 · 06:43.580 → 06:50.740

EN: And I think this is sort of, well, so I think that there are two kind of interesting things here.

ZH: 我觉得这里有两点挺有意思。

### changing-models:0098 · 06:50.740 → 06:55.620

EN: One is that I actually sometimes do perform edits from the wrong working directory.

ZH: 首先，我有时确实会从另一个工作目录修改文件。

### changing-models:0099 · 06:56.340 → 06:58.640

EN: And the reason for this is, for instance, we have pi, we have radius.

ZH: 比如我们有 Pi，也有 Radius。

### changing-models:0100 · 06:59.000 → 07:02.500

EN: Every once in a while, I have to work on two things and actually do let it commit to the other thing.

ZH: 偶尔我需要同时处理两个项目，而且会让它向另一个项目提交。

### changing-models:0101 · 07:02.900 → 07:05.280

EN: That will not work with the work tree approach anyway.

ZH: 这种工作树方案就处理不了这种情况。

### changing-models:0102 · 07:05.380 → 07:09.140

EN: So like the moment you're outside of this place where you are, it doesn't work.

ZH: 只要越出了当前这个目录范围，就不管用了。

### changing-models:0103 · 07:09.460 → 07:13.680

EN: The other thing is it's actually not super fast either because like you might have a lot of files in there,

ZH: 另一个问题是，它也不算特别快，因为里面可能有很多文件，

### changing-models:0104 · 07:14.480 → 07:20.440

EN: which are at least not sufficiently tracked by Git so that you can very trivially make that work.

ZH: Git 对这些文件的跟踪情况，并不足以让这件事轻易完成。

### changing-models:0105 · 07:20.740 → 07:24.300

EN: So it's a little bit unclear, I think, if it's a good trade-off.

ZH: 所以我不确定这个取舍是否划算。

### changing-models:0106 · 07:26.320 → 07:33.140

EN: It also means in a way that what you generally consider to be the diff, which is against your commit,

ZH: 而且你通常理解的 diff，是相对于自己的提交来说的；

### changing-models:0107 · 07:33.900 → 07:37.620

EN: and what then the coding agent thinks, which is against some sort of other index,

ZH: 编程 agent 理解的 diff，却是相对于另一个索引。

### changing-models:0108 · 07:38.080 → 07:39.840

EN: like it's another form of indirection.

ZH: 这又多了一层间接关系。

### changing-models:0109 · 07:40.260 → 07:44.860

EN: I'm actually not convinced that that's a particularly necessary trade-off.

ZH: 我不太相信这是一项特别有必要的取舍。

### changing-models:0110 · 07:44.860 → 07:52.140

EN: I think at that point, just commit to Git and like make the diff experience versus the Git checkout work really well.

ZH: 到了这一步，我觉得还不如直接提交到 Git，把相对于 Git 检出状态的 diff 体验做好。

### changing-models:0111 · 07:54.040 → 07:54.780

EN: So I don't know.

ZH: 所以，我也说不好。

### changing-models:0112 · 07:55.320 → 07:57.960

EN: I actually, I think that there's another sort of like small wrinkle on it,

ZH: 我觉得还有个小问题，

### changing-models:0113 · 07:58.000 → 08:00.800

EN: which is like if you actually do want to watch the transcript,

ZH: 就是假如你确实想看执行记录，

### changing-models:0114 · 08:01.140 → 08:04.440

EN: like let's just assume you have a use case where you do want to watch the transcript.

ZH: 我们就假设你有这样的使用场景，

### changing-models:0115 · 08:04.780 → 08:08.060

EN: You can't read that stuff anyways as it's happening.

ZH: 它执行时你其实也来不及读那些内容。

### changing-models:0116 · 08:08.060 → 08:13.420

EN: So you could only ever read it once it's done, which like that's a little bit weird anyways.

ZH: 你只能等它做完再读，这本身也有点奇怪。

### changing-models:0117 · 08:14.360 → 08:18.200

EN: So in a way, if you do want to read the transcript,

ZH: 所以，如果你真的想看执行记录，

### changing-models:0118 · 08:18.340 → 08:20.060

EN: you probably want a summary of what it's about to do.

ZH: 你可能更想要的是：它接下来准备做什么的简短说明。

### changing-models:0119 · 08:22.700 → 08:23.440

EN: I suppose.

ZH: 我想是这样。

### changing-models:0120 · 08:24.060 → 08:27.260

EN: I guess the biggest takeaway here is we need better diff tools.

ZH: 最大的结论可能是：我们需要更好的 diff 工具。

### changing-models:0121 · 08:27.260 → 08:27.700

EN: Yes.

ZH: 对。

### changing-models:0122 · 08:29.700 → 08:30.020

EN: Yes.

ZH: 对。

### changing-models:0123 · 08:30.200 → 08:37.620

EN: And I also like, like having tried a lot of diff tools now and sort of diff tools that also are Gentic integrated,

ZH: 我现在试过很多 diff 工具，也试过集成 agent 的 diff 工具，

### changing-models:0124 · 08:37.760 → 08:43.240

EN: like friend of ours, the Tunk, then for modems, which I think is pretty neat,

ZH: 比如我们朋友做的那个工具［名称转写不清，待核］，我觉得挺不错。

### changing-models:0125 · 08:43.620 → 08:48.100

EN: but it is also not quite what I want, I feel like.

ZH: 但它似乎也还不是我真正想要的。

### changing-models:0126 · 08:50.420 → 08:56.860

EN: So there's definitely, at least for the coding use case, I think like the diff needs to work better.

ZH: 所以，至少对编程场景来说，diff 确实需要做得更好。

### changing-models:0127 · 08:57.260 → 09:02.020

EN: It needs to support also like multi-stage commits, like in a PR.

ZH: 它还需要支持多阶段提交，比如一个 PR 中的多个阶段。

### changing-models:0128 · 09:02.420 → 09:06.480

EN: Maybe not even multi-stage commits, but before you even commit,

ZH: 也不一定是多阶段提交，而是在正式提交之前，

### changing-models:0129 · 09:06.740 → 09:11.320

EN: you want to take snapshots of your files at specific times.

ZH: 你就想在特定时刻给文件保存快照。

### changing-models:0130 · 09:12.200 → 09:16.900

EN: I have this in my custom Pi review extension,

ZH: 我的自定义 Pi review 扩展就有这个功能，

### changing-models:0131 · 09:17.360 → 09:22.800

EN: which is like a desktop UI using Daniel's Glimpse framework.

ZH: 它是一个用 Daniel 的 Glimpse 框架做的桌面界面。

### changing-models:0132 · 09:23.860 → 09:26.400

EN: And I've used this for months, right?

ZH: 我已经用了好几个月了。

### changing-models:0133 · 09:26.400 → 09:30.480

EN: And I just found I don't even need that anymore.

ZH: 但我发现，现在自己甚至不需要它了。

### changing-models:0134 · 09:30.660 → 09:33.780

EN: Like I don't need these snapshots before I do a commit.

ZH: 我不需要在提交之前保存这些快照。

### changing-models:0135 · 09:34.180 → 09:35.840

EN: I don't care so much anymore,

ZH: 已经没那么在意了，

### changing-models:0136 · 09:36.000 → 09:42.220

EN: but mostly because I try to break down my stuff into very small commits in

ZH: 主要是因为我会把工作拆成非常小的提交，

### changing-models:0137 · 09:42.220 → 09:43.680

EN: terms of lines of code.

ZH: 按代码行数来说是这样。

### changing-models:0138 · 09:44.040 → 09:49.800

EN: But I guess that's not a scalable solution because some workflows might just result in a large diff,

ZH: 但这恐怕不是适用于所有情况的办法，因为有些工作流就是会产生很大的 diff，

### changing-models:0139 · 09:49.880 → 09:51.540

EN: and you might want to have the snapshots.

ZH: 那你可能还是需要快照。

### changing-models:0140 · 09:51.540 → 09:52.660

EN: Yeah, it's hard.

ZH: 是啊，很难。

### changing-models:0141 · 09:53.120 → 09:56.060

EN: I mean, like obviously the goal should be make very small PRs.

ZH: 当然，目标应该是把 PR 做得很小。

### changing-models:0142 · 09:56.380 → 10:00.000

EN: And I think generally that has been true before and after agents.

ZH: 我觉得无论有没有 agent，这一点一直都成立。

### changing-models:0143 · 10:00.000 → 10:06.420

EN: There are situations where this doesn't fully work because in addition to

ZH: 但有些情况不完全适用，因为除了

### changing-models:0144 · 10:06.420 → 10:08.840

EN: like the size of the PR,

ZH: PR 的大小之外，

### changing-models:0145 · 10:09.480 → 10:15.100

EN: there's also the confidence that you have in shipping it or the complexity of testing it.

ZH: 还要考虑你对上线的信心，以及测试的复杂程度。

### changing-models:0146 · 10:15.180 → 10:20.160

EN: So you might actually have a commit even with feature flags that you're not willing to merge yet

ZH: 所以，即便加了功能开关，有些提交你还是不愿意立即合并，

### changing-models:0147 · 10:20.160 → 10:21.500

EN: because you want to test it properly.

ZH: 因为你想先充分测试。

### changing-models:0148 · 10:21.500 → 10:24.400

EN: And then these have a tendency to getting a little bit larger.

ZH: 这样一来，它们就容易越变越大。

### changing-models:0149 · 10:26.140 → 10:28.700

EN: And then you actually might want to do these checkpoints in between.

ZH: 你可能就会想在中间保存一些检查点。

### changing-models:0150 · 10:29.000 → 10:32.380

EN: But then when you review it with the agent, it's actually versus the main branch.

ZH: 但和 agent 一起审查时，你看的其实又是相对于主分支的变化。

### changing-models:0151 · 10:36.260 → 10:37.460

EN: Yeah, I think so.

ZH: 对，我想是这样。

### changing-models:0152 · 10:37.880 → 10:39.200

EN: When I started working on Pi,

ZH: 我刚开始做 Pi 的时候，

### changing-models:0153 · 10:39.340 → 10:43.940

EN: my realization was that all the models back then were pretty much RL'd on the same trajectories apparently

ZH: 发现那时所有模型似乎都在非常相似的轨迹上接受强化学习训练，

### changing-models:0154 · 10:43.940 → 10:45.940

EN: because they assumed the base set of tools.

ZH: 因为它们都预期会有一组基础工具。

### changing-models:0155 · 10:46.120 → 10:49.360

EN: And with those, they could really work well, which was read, write, edit, bash.

ZH: 有了这些就能很好地工作，也就是 read、write、edit、Bash。

### changing-models:0156 · 10:49.360 → 10:51.720

EN: And I guess the times are changing now.

ZH: 现在时代可能变了。

### changing-models:0157 · 10:52.080 → 10:55.480

EN: And the RL is now geared towards you only need bash.

ZH: 强化学习正在朝“只需要 Bash”这个方向发展。

### changing-models:0158 · 10:55.940 → 10:59.680

EN: GPT models started doing that already last year, I think,

ZH: 我记得 GPT 模型去年就开始这样了，

### changing-models:0159 · 11:00.100 → 11:02.640

EN: when they came out with the first five point whatever.

ZH: 大概是第一个 5 点几版本出来的时候。

### changing-models:0160 · 11:03.900 → 11:05.040

EN: And now Claude does the same.

ZH: 现在 Claude 也一样。

### changing-models:0161 · 11:05.120 → 11:07.140

EN: And it stands to reason that other models would do the same.

ZH: 其他模型也这么做，是很合理的推测。

### changing-models:0162 · 11:07.320 → 11:09.480

EN: So along with these changes in RL,

ZH: 这些强化学习方式的变化，

### changing-models:0163 · 11:09.960 → 11:14.920

EN: the interesting part is that it has a large effect on UX of agentic engineering.

ZH: 很有意思的一点是，它们对 agent 工程的用户体验影响很大。

### changing-models:0164 · 11:16.220 → 11:18.980

EN: And we just need to adapt, man.

ZH: 我们只能适应，兄弟。

### changing-models:0165 · 11:19.360 → 11:22.080

EN: Let the RL flow over you.

ZH: 让强化学习的浪潮从你身上流过去吧。

### changing-models:0166 · 11:22.940 → 11:24.500

EN: Yeah, so I don't think like...

ZH: 是啊，我觉得……

### changing-models:0167 · 11:24.500 → 11:27.320

EN: We have been pretty good, I think, at not fighting the RL.

ZH: 我们一直比较擅长不去对抗强化学习的方向。

### changing-models:0168 · 11:28.420 → 11:30.500

EN: Or at least like projecting where it should go.

ZH: 至少也比较擅长判断它会往哪里走。

### changing-models:0169 · 11:30.640 → 11:35.460

EN: But I don't think we have been particularly good at being creative about what the UX around it should be.

ZH: 但围绕它设计什么样的用户体验，我们还不够有创造力。

### changing-models:0170 · 11:36.280 → 11:40.500

EN: It's like the UX in Pi is basically the thinnest layer over what the models are doing.

ZH: Pi 的用户体验基本上只是覆盖在模型行为之上的薄薄一层。

### changing-models:0171 · 11:40.500 → 11:45.420

EN: Which probably has like a shelf life.

ZH: 这种做法可能也有它的有效期。

### changing-models:0172 · 11:45.640 → 11:47.100

EN: And we're sort of approaching.

ZH: 我们正在接近那个期限。

### changing-models:0173 · 11:47.100 → 11:53.320

EN: One, I think there are like two interesting things here.

ZH: 这里我觉得有两件有意思的事。

### changing-models:0174 · 11:53.380 → 11:55.860

EN: It's like if you had control over the LLM.

ZH: 假如你能控制底层的大语言模型，

### changing-models:0175 · 11:56.240 → 12:00.000

EN: In the sense that you are in fact OpenAI, Anthropic, or you run your own LLM.

ZH: 比如你就是 OpenAI、Anthropic，或者自己运行模型，

### changing-models:0176 · 12:01.160 → 12:05.040

EN: You increasingly are running more than one LLM simultaneously.

ZH: 你就会越来越多地同时运行不止一个模型。

### changing-models:0177 · 12:05.040 → 12:07.140

EN: So you're running your large model that does some stuff.

ZH: 先运行一个大模型来做事，

### changing-models:0178 · 12:07.240 → 12:09.500

EN: And then you run a smaller model for either predictive decoding.

ZH: 再运行一个小模型，可能是为了预测式解码，

### changing-models:0179 · 12:09.500 → 12:14.280

EN: Or because you, for instance, want to already truncate the reasoning output.

ZH: 也可能是为了提前截断推理输出。

### changing-models:0180 · 12:14.620 → 12:17.040

EN: It's like on their side, they're already doing this.

ZH: 它们内部已经在这么做了。

### changing-models:0181 · 12:18.500 → 12:25.520

EN: So basically like there's an almost natural idea now.

ZH: 所以现在有个几乎顺理成章的想法：

### changing-models:0182 · 12:25.660 → 12:28.920

EN: That in addition to the tool call, you might get some commentary around.

ZH: 在工具调用之外，再给出一些过程说明。

### changing-models:0183 · 12:29.640 → 12:31.480

EN: And it's very little today is being done.

ZH: 现在这方面做得还很少。

### changing-models:0184 · 12:31.720 → 12:35.100

EN: A little bit is coming up with some of the ChatGPT models.

ZH: 一些 ChatGPT 模型开始出现一点这样的功能。

### changing-models:0185 · 12:35.100 → 12:36.420

EN: They have this commentary channel.

ZH: 它们有一个 commentary 通道。

### changing-models:0186 · 12:37.060 → 12:40.440

EN: I think it's mainly used now for like this.

ZH: 我觉得目前主要是用来

### changing-models:0187 · 12:40.880 → 12:43.800

EN: Ambigating the assistant message that comes at the end.

ZH: 区分最终给出的助手消息

### changing-models:0188 · 12:43.860 → 12:45.220

EN: From the assistant message that comes in between.

ZH: 和执行过程中给出的助手消息。

### changing-models:0189 · 12:46.500 → 12:49.720

EN: But if you were to run your own inference stack.

ZH: 但如果你自己运行推理系统，

### changing-models:0190 · 12:49.840 → 12:51.400

EN: Then theoretically you could actually.

ZH: 理论上你就能做到：

### changing-models:0191 · 12:51.660 → 12:54.020

EN: So like this is a short summary of the description.

ZH: 这里是一段简短的操作说明。

### changing-models:0192 · 12:54.440 → 12:56.400

EN: You could invest some extra tokens to summarize it.

ZH: 你可以多花一些 token 来概括它。

### changing-models:0193 · 12:56.480 → 12:57.980

EN: But that's tricky as it streams in.

ZH: 不过，在流式输出过程中这么做会比较棘手。

### changing-models:0194 · 12:58.600 → 13:00.080

EN: But then you could also run Chef on it.

ZH: 也可以让 Jev 来处理［原文名称转写待核］，

### changing-models:0195 · 13:00.160 → 13:01.860

EN: To sort of classify what's going on.

ZH: 对正在发生的事情做分类。

### changing-models:0196 · 13:02.480 → 13:03.520

EN: So I don't know.

ZH: 所以我也不知道。

### changing-models:0197 · 13:03.520 → 13:04.360

EN: It's...

ZH: 这个……

### changing-models:0198 · 13:05.100 → 13:08.180

EN: There's probably going to be some experimentation.

ZH: 可能会有人想做一些实验，

### changing-models:0199 · 13:08.180 → 13:10.260

EN: That people might want to run around.

ZH: 试试看

### changing-models:0200 · 13:10.780 → 13:13.220

EN: How to visualize these tool calls in a transcript.

ZH: 该如何在执行记录中展示这些工具调用。

### changing-models:0201 · 13:15.260 → 13:15.980

EN: So yeah.

ZH: 对。

### changing-models:0202 · 13:16.060 → 13:16.420

EN: I don't know.

ZH: 我也说不好。

### changing-models:0203 · 13:16.920 → 13:19.520

EN: I think that the simplest trick at the moment.

ZH: 我觉得现在最简单的办法，

### changing-models:0204 · 13:19.620 → 13:21.200

EN: That works across many models is just.

ZH: 而且对很多模型都管用，就是：

### changing-models:0205 · 13:21.660 → 13:23.540

EN: You have your tool definition.

ZH: 在工具定义里，

### changing-models:0206 · 13:24.060 → 13:26.420

EN: And you add a description, summary.

ZH: 加上 description、summary，

### changing-models:0207 · 13:26.540 → 13:28.720

EN: Whatever fields that the model has to fill out.

ZH: 或者类似的、要求模型填写的字段。

### changing-models:0208 · 13:29.460 → 13:30.920

EN: Make it the first parameter.

ZH: 把它放在第一个参数，

### changing-models:0209 · 13:31.240 → 13:33.820

EN: First field within the tool calls argument.

ZH: 也就是工具调用参数对象的第一个字段。

### changing-models:0210 · 13:33.820 → 13:36.840

EN: Then you get it as the first thing usually.

ZH: 通常你就会最先收到它。

### changing-models:0211 · 13:38.240 → 13:39.880

EN: We should experiment with that.

ZH: 我们应该试试。

### changing-models:0212 · 13:39.980 → 13:41.580

EN: I think that could work as a band-aid.

ZH: 我觉得这能临时补一下。

### changing-models:0213 · 13:42.260 → 13:45.520

EN: Ultimately I think we will have to give up on visualizing individual tool calls.

ZH: 但最终，我们可能得放弃逐个展示工具调用。

### changing-models:0214 · 13:45.520 → 13:49.220

EN: So that just leads us to the other thing.

ZH: 这就引出了另一个问题：

### changing-models:0215 · 13:49.220 → 13:52.740

EN: Which is like why was it useful in the first place to have these separate tool calls?

ZH: 最初为什么要把工具调用分成不同类型？

### changing-models:0216 · 13:52.740 → 13:56.240

EN: And a big reason was the approval gates.

ZH: 一个重要原因是审批关卡。

### changing-models:0217 · 13:56.240 → 13:57.980

EN: Which Pi obviously never really had.

ZH: Pi 显然从来就没有真正做过这套。

### changing-models:0218 · 13:58.180 → 14:03.240

EN: But for instance, in Claude it was used to...

ZH: 但比如 Claude，会用它来……

### changing-models:0219 · 14:03.240 → 14:05.740

EN: You can have this allow edits by default.

ZH: 你可以设置默认允许编辑，

### changing-models:0220 · 14:05.900 → 14:07.920

EN: Which was gated on it using the edit tool.

ZH: 前提是它使用 edit 工具。

### changing-models:0221 · 14:07.920 → 14:10.480

EN: And then it would ask for everything else.

ZH: 其他操作则都要询问。

### changing-models:0222 · 14:10.640 → 14:14.400

EN: But obviously like the whole thing now moved into a world where either nobody gives a shit anymore.

ZH: 但现在要么大家已经根本不在乎了，

### changing-models:0223 · 14:14.400 → 14:19.020

EN: Or alternatively they run a second LLM to check the approval.

ZH: 要么就再运行一个大模型来做审批，

### changing-models:0224 · 14:22.020 → 14:23.800

EN: To see like should you run this or not.

ZH: 判断这个操作该不该执行。

### changing-models:0225 · 14:23.860 → 14:24.980

EN: So this is this auto mode.

ZH: 也就是所谓的 auto mode。

### changing-models:0226 · 14:26.520 → 14:29.000

EN: And what do you think about that?

ZH: 你怎么看这个？

### changing-models:0227 · 14:29.000 → 14:35.240

EN: Like the idea of running a second classifier or model to make

ZH: 就是再运行一个分类器或模型，

### changing-models:0228 · 14:35.240 → 14:36.920

EN: some determinations here.

ZH: 来做这些判断。

### changing-models:0229 · 14:37.500 → 14:39.840

EN: So first of all the approval gates were always bullshit.

ZH: 首先，审批关卡一直就很扯。

### changing-models:0230 · 14:40.780 → 14:44.660

EN: I don't know a single engineer who is actually using that.

ZH: 我不认识任何真正会用它的工程师。

### changing-models:0231 · 14:44.920 → 14:49.000

EN: It's like a checkbox that your harness needs to have to become enterprise ready or something.

ZH: 它就像是 harness 为了标榜“企业级可用”而必须勾选的一个功能。

### changing-models:0232 · 14:49.100 → 14:50.360

EN: But nobody is actually using that.

ZH: 但其实没人在用。

### changing-models:0233 · 14:52.020 → 14:54.740

EN: So those went away anyways.

ZH: 所以无论如何，这些东西都在消失。

### changing-models:0234 · 14:54.740 → 14:59.900

EN: Because even if like having a second model judge whether a tool call is good or not is

ZH: 因为即便让第二个模型判断工具调用好不好，

### changing-models:0235 · 14:59.900 → 15:01.920

EN: highly problematic.

ZH: 仍然存在很大的问题。

### changing-models:0236 · 15:02.700 → 15:03.840

EN: Still in my opinion.

ZH: 至少我还是这么认为。

### changing-models:0237 · 15:04.780 → 15:07.960

EN: Because for that the model doesn't just have to look at the tool call usually.

ZH: 要做这个判断，模型通常不能只看工具调用本身，

### changing-models:0238 · 15:08.160 → 15:09.680

EN: It also has to look at the full context.

ZH: 还得看完整上下文，

### changing-models:0239 · 15:11.260 → 15:13.020

EN: For it to actually make sense.

ZH: 判断才有意义。

### changing-models:0240 · 15:13.340 → 15:17.800

EN: Like I can just have a haiku or a terra or lunar model.

ZH: 我总不能随便让一个 Haiku、Terra 或 Luna 模型，

### changing-models:0241 · 15:18.460 → 15:21.400

EN: Look at the single bash call and say yeah this is not dangerous.

ZH: 只看一条 Bash 调用，就说“没事，不危险”，

### changing-models:0242 · 15:21.400 → 15:24.700

EN: Or this is not destructive in a way that we don't want it to be destructive.

ZH: 或者“它不会造成我们不希望出现的破坏”。

### changing-models:0243 · 15:25.880 → 15:26.880

EN: I don't know man.

ZH: 我也不知道，兄弟。

### changing-models:0244 · 15:27.100 → 15:29.360

EN: It's just put your fucking agent in a sandbox.

ZH: 直接把你的 agent 关进沙箱就行了。

### changing-models:0245 · 15:29.900 → 15:30.480

EN: Call it a day.

ZH: 事情就解决了。

### changing-models:0246 · 15:31.960 → 15:32.360

EN: Yeah.

ZH: 对。

### changing-models:0247 · 15:32.940 → 15:39.300

EN: So I think like we're definitely most likely now reaching the point where the coding agent

ZH: 我觉得，我们很可能正在走到这样一个节点：编程 agent

### changing-models:0248 · 15:39.300 → 15:43.220

EN: has fully subsumed every other agent format.

ZH: 已经完全涵盖了其他所有形式的 agent。

### changing-models:0249 · 15:43.220 → 15:48.360

EN: So if you do want to use it in a non-coding environment.

ZH: 所以，就算你想在非编程环境里使用它，

### changing-models:0250 · 15:49.400 → 15:52.440

EN: You're probably going to give it a programming language.

ZH: 你大概也会给它一门编程语言。

### changing-models:0251 · 15:52.700 → 15:53.780

EN: Which is Turing complete.

ZH: 而它是图灵完备的。

### changing-models:0252 · 15:53.980 → 15:54.600

EN: Where good luck.

ZH: 那就祝你好运了。

### changing-models:0253 · 15:55.800 → 16:00.560

EN: So you gotta constrain everything around it.

ZH: 所以，你得约束它周围的所有东西。

### changing-models:0254 · 16:02.440 → 16:09.220

EN: Did you say something like there's a code mode implementation in one harness that actually gives the model also bash fully unsiccured?

ZH: 你是不是说过，有个 harness 的 code mode 实现，还给了模型完全不受保护的 Bash？

### changing-models:0255 · 16:09.220 → 16:15.540

EN: I mean this is basically for the most part like code mode now is it exposes all the tools that the agent has.

ZH: 基本上，现在大多数 code mode 都会把 agent 拥有的所有工具暴露出来。

### changing-models:0256 · 16:15.660 → 16:15.760

EN: Right.

ZH: 对。

### changing-models:0257 · 16:15.940 → 16:21.860

EN: So code mode in itself might be tightly sandboxed but then you can

ZH: 所以，code mode 本身可能被严格限制在沙箱里，但你又能

### changing-models:0258 · 16:21.860 → 16:25.260

EN: call bash in codex via code mode.

ZH: 通过 code mode 调用 Codex 的 Bash。

### changing-models:0259 · 16:25.260 → 16:28.240

EN: So then you need to separately sandbox the whole thing anyways.

ZH: 那你还是得另外把整个环境放进沙箱。

### changing-models:0260 · 16:28.240 → 16:34.540

EN: So you have like one sandbox and another sandbox which sort of makes sense I guess because like code mode theoretically runs where the harness

ZH: 于是就成了一个沙箱加另一个沙箱。我想这也有道理，因为 code mode 理论上运行在 harness

### changing-models:0261 · 16:34.540 → 16:35.720

EN: runs which is more trusted.

ZH: 所在的、更加可信的环境里。

### changing-models:0262 · 16:36.560 → 16:42.920

EN: And then the bash runs where you're sort of exe.dev or oversell workers or like

ZH: 而 Bash 则运行在 exe.dev，或另一个 worker 平台［名称转写不清］，

### changing-models:0263 · 16:42.920 → 16:44.880

EN: cloudflare durable object sandbox kind of sits.

ZH: 或者 Cloudflare Durable Object 的沙箱环境里。

### changing-models:0264 · 16:44.880 → 16:50.140

EN: But it is all basically in a way really

ZH: 但从某种意义上说，这一切就是：

### changing-models:0265 · 16:50.140 → 16:53.340

EN: like we have now fully committed to this code thing.

ZH: 我们已经全面投入了以代码来完成任务这条路。

### changing-models:0266 · 16:53.460 → 16:53.600

EN: Right.

ZH: 对。

### changing-models:0267 · 16:53.700 → 16:59.900

EN: I think like at this point we just better get these sandboxes really tightly controlled but like within the

ZH: 所以现在我们最好把这些沙箱控制好。但在沙箱

### changing-models:0268 · 16:59.900 → 17:02.000

EN: capabilities of that sandbox.

ZH: 允许的能力范围内，

### changing-models:0269 · 17:03.280 → 17:05.780

EN: The harness basically at this point no longer plays a role.

ZH: harness 基本上已经不起什么作用了。

### changing-models:0270 · 17:05.780 → 17:10.660

EN: Or at the very least it has so little control because the models are so

ZH: 或者至少，它的控制能力非常有限，因为模型已经如此深地

### changing-models:0271 · 17:10.660 → 17:14.260

EN: yeah programming language slash bash trained.

ZH: 接受了编程语言和 Bash 方面的训练。

### changing-models:0272 · 17:15.940 → 17:22.160

EN: I think the question is just I think within Pi for the most part is like how do we make it so that people can

ZH: 我觉得对 Pi 来说，主要问题就是：如何让人们

### changing-models:0273 · 17:22.160 → 17:24.840

EN: experiment with how they want to see the transcript?

ZH: 自由尝试自己想要的执行记录展示方式？

### changing-models:0274 · 17:25.020 → 17:29.220

EN: Like do we have enough permittives right now to tinker with it?

ZH: 我们现在提供了足够的基础能力，让大家去折腾吗？

### changing-models:0275 · 17:29.220 → 17:36.140

EN: And then for someone who builds an agent that is supposed to be self-running a durable object or something similar,

ZH: 还有，如果有人要做一个自行运行的 agent，比如放在 Durable Object 里，

### changing-models:0276 · 17:36.140 → 17:40.160

EN: how should one structure that?

ZH: 应该怎样组织它？

### changing-models:0277 · 17:40.380 → 17:44.280

EN: Do we have enough primitives within Pi to make it acceptable?

ZH: Pi 里的基础能力够不够，让这种做法可行？

### changing-models:0278 · 17:46.720 → 17:49.440

EN: I think that is going to be a lot of interesting.

ZH: 我觉得这里会有很多有趣的东西。

### changing-models:0279 · 17:49.700 → 17:53.080

EN: Like if someone has thoughts up there, I think we would love to hear.

ZH: 如果有人有想法，我们很想听听。

### changing-models:0280 · 17:53.080 → 17:59.840

EN: But yeah, in a way it's the end of custom tools in many ways.

ZH: 但某种意义上说，很多自定义工具可能要走到尽头了。

### changing-models:0281 · 18:00.440 → 18:00.620

EN: Yeah.

ZH: 对。

### changing-models:0282 · 18:01.800 → 18:07.660

EN: I do have to say that custom tools have historically been not very helpful to my workflows at least.

ZH: 我得说，至少对我的工作流，自定义工具历来都没有特别大的帮助。

### changing-models:0283 · 18:07.940 → 18:14.140

EN: So I just recently built a new tool called Pi History Handoff,

ZH: 我最近做了一个新工具，叫 Pi History Handoff，

### changing-models:0284 · 18:14.140 → 18:18.120

EN: which is sort of kind of like the new codex experimental feature.

ZH: 有点像 Codex 新出的实验功能。

### changing-models:0285 · 18:18.120 → 18:25.300

EN: Well, the LLM decides it wants to basically clear the context and just leave a summary of itself there.

ZH: 由模型自己决定清空上下文，只给自己留下一份摘要。

### changing-models:0286 · 18:25.480 → 18:33.080

EN: It's a fancy form of compaction plus a tool to give you to give the LLM a way to search in the compacted history.

ZH: 它相当于更精致的上下文压缩，再加一个让模型搜索已压缩历史的工具。

### changing-models:0287 · 18:34.340 → 18:38.800

EN: That's the only thing recently that I built that makes sense for my workflows.

ZH: 这是我最近唯一做出来、确实适合自己工作流的工具。

### changing-models:0288 · 18:38.960 → 18:42.020

EN: But other than that, I don't really have many custom tools.

ZH: 除此之外，我没有多少自定义工具。

### changing-models:0289 · 18:42.020 → 18:48.120

EN: I think one thing is super interesting right now is like we're simultaneously seeing a full commitment to bash.

ZH: 现在特别有意思的一点是，我们一方面看到大家全面转向 Bash，

### changing-models:0290 · 18:48.940 → 18:51.580

EN: At the same time, we see a full resurgence of MCP.

ZH: 另一方面，MCP 又全面回潮了。

### changing-models:0291 · 18:53.260 → 18:59.540

EN: And I still don't really fully know how to put these things together because I think MCP

ZH: 我还没完全想明白，这两件事该怎么结合，因为我觉得 MCP

### changing-models:0292 · 18:59.540 → 19:02.440

EN: solves the off thing, which is important.

ZH: 解决了鉴权问题，这很重要。

### changing-models:0293 · 19:02.440 → 19:06.660

EN: It does set some constraints on the tool execution,

ZH: 它也对工具执行设置了一些约束，

### changing-models:0294 · 19:06.660 → 19:10.080

EN: but then the way we wire it together is like a code mode.

ZH: 但我们把它们连接起来的方式，又是 code mode。

### changing-models:0295 · 19:11.060 → 19:14.040

EN: So it is interesting.

ZH: 所以这很有意思。

### changing-models:0296 · 19:14.220 → 19:16.120

EN: I would say like where this all lands today.

ZH: 这些东西如今会落在哪里？

### changing-models:0297 · 19:16.620 → 19:16.760

EN: Yeah.

ZH: 是啊。

### changing-models:0298 · 19:17.360 → 19:20.600

EN: So I think you looked into MCP a little bit more recently.

ZH: 你最近应该又深入研究了一些 MCP。

### changing-models:0299 · 19:20.600 → 19:27.080

EN: And my understanding is that the input schema must be defined

ZH: 我的理解是，MCP 工具必须定义输入 schema，

### changing-models:0300 · 19:27.080 → 19:33.920

EN: for an MCP tool, but the output schema can be, but it's optional.

ZH: 但输出 schema 可以定义，也可以不定义。

### changing-models:0301 · 19:34.380 → 19:37.620

EN: And for the most part, like you actually need two channels, right?

ZH: 而多数情况下，你其实需要两个通道，对吧？

### changing-models:0302 · 19:37.660 → 19:42.720

EN: You need one channel that goes to the LLM, which is likely unstructured to conserve some tokens.

ZH: 一个给大模型看，为了节省 token，可能是非结构化的。

### changing-models:0303 · 19:42.720 → 19:49.200

EN: And you would need a second channel that is structured so you can use an MCP tool as part of code mode, for example.

ZH: 另一个则需要结构化，比如让 MCP 工具能被 code mode 调用。

### changing-models:0304 · 19:49.720 → 19:50.580

EN: What's the state of that?

ZH: 现在这方面是什么情况？

### changing-models:0305 · 19:50.900 → 19:54.120

EN: Like, do we actually have those two channels for the output or is that just one channel?

ZH: 我们到底有这两个输出通道，还是只有一个？

### changing-models:0306 · 19:56.020 → 19:58.080

EN: For the most part, there's just one channel.

ZH: 大多数情况下，只有一个通道。

### changing-models:0307 · 19:59.280 → 20:02.920

EN: I think it's what is interesting is like, so we, when we built radius,

ZH: 有意思的是，我们在做 Radius 的时候，

### changing-models:0308 · 20:02.920 → 20:07.300

EN: we wanted to be so that you can talk to the agent and reconfigures radius.

ZH: 希望你能和 agent 对话，让它重新配置 Radius。

### changing-models:0309 · 20:07.580 → 20:08.840

EN: And we tried a bunch of things.

ZH: 我们尝试了很多方案。

### changing-models:0310 · 20:08.840 → 20:13.700

EN: And what we actually found to work the best today with these models is OpenAPI.

ZH: 实际发现，对现在这些模型最有效的是 OpenAPI。

### changing-models:0311 · 20:14.480 → 20:21.700

EN: So we actually, so we added an endpoint where you can describe your task and what you get back is a rack filtered.

ZH: 所以我们加了一个端点，你可以描述任务，返回的是经过检索筛选的结果：

### changing-models:0312 · 20:22.280 → 20:24.860

EN: These are the endpoints that you might want to use plus the OpenAPI schema.

ZH: 这些是你可能想使用的端点，以及对应的 OpenAPI schema。

### changing-models:0313 · 20:25.340 → 20:27.480

EN: And you can actually expose that via MCP.

ZH: 你也可以通过 MCP 暴露它。

### changing-models:0314 · 20:27.640 → 20:31.240

EN: So like it is actually very possible to use this pattern against MCP.

ZH: 所以，这种模式完全可以套到 MCP 上。

### changing-models:0315 · 20:32.240 → 20:37.420

EN: The only problem is like MCP actually at that point really only does off.

ZH: 唯一的问题是，这时候 MCP 实际上只负责鉴权。

### changing-models:0316 · 20:37.420 → 20:42.540

EN: It's like it's RPC plus off, which is a very, very narrow way of using MCP.

ZH: 相当于 RPC 加鉴权，这是对 MCP 非常狭窄的一种用法。

### changing-models:0317 · 20:43.140 → 20:46.980

EN: And if you were to build a server that works like this, you don't really,

ZH: 如果你按这种方式构建服务器，

### changing-models:0318 · 20:46.980 → 20:51.260

EN: you would only output structured output, which MCP is not.

ZH: 它只会输出结构化数据，而 MCP 通常不是这样用的。

### changing-models:0319 · 20:51.840 → 20:58.280

EN: Like if you, if you were to put this in a traditional MCP, where like you take the entire output and stash it into the context,

ZH: 如果你把它放进传统 MCP 用法中，把所有输出直接塞进上下文，

### changing-models:0320 · 20:58.280 → 21:00.680

EN: that doesn't really work.

ZH: 那就不太行。

### changing-models:0321 · 21:00.680 → 21:06.780

EN: So like there's an in-between field now where you could actually use MCP almost like an RPC

ZH: 所以现在出现了一个中间地带：你几乎可以把 MCP 当成 RPC

### changing-models:0322 · 21:06.780 → 21:10.080

EN: system, which only outputs structured data.

ZH: 系统，只输出结构化数据。

### changing-models:0323 · 21:10.920 → 21:17.100

EN: And then your code mode hopefully has enough utility in it to sort of do filtering

ZH: 然后希望 code mode 有足够的辅助能力，完成筛选、

### changing-models:0324 · 21:17.100 → 21:18.320

EN: and post-processing, whatever.

ZH: 后处理之类的工作。

### changing-models:0325 · 21:19.440 → 21:21.580

EN: But most MCP servers don't work like this today.

ZH: 但目前大多数 MCP 服务器不是这样工作的。

### changing-models:0326 · 21:21.700 → 21:24.680

EN: Like most MCP servers output like various compressed markdown.

ZH: 它们大多输出各种压缩过的 Markdown。

### changing-models:0327 · 21:25.300 → 21:26.260

EN: Plain text, whatever, yeah.

ZH: 或者纯文本，诸如此类。

### changing-models:0328 · 21:26.260 → 21:29.060

EN: So the protocol is actually really useful now.

ZH: 所以这个协议现在确实很有用。

### changing-models:0329 · 21:29.300 → 21:33.420

EN: The servers are like not sure if they should target one versus the other.

ZH: 但服务器还不太确定应该面向哪一种用法。

### changing-models:0330 · 21:35.420 → 21:36.700

EN: Yeah, it's interesting.

ZH: 对，很有意思。

### changing-models:0331 · 21:37.120 → 21:42.820

EN: So I guess the takeaway for future MCP server authors and existing MCP server maintainers is

ZH: 所以，对未来的 MCP 服务器作者和现有维护者来说，结论可能就是：

### changing-models:0332 · 21:42.820 → 21:46.300

EN: provide structured output because we're going to go full code mode.

ZH: 请提供结构化输出，因为我们正在全面走向 code mode。

### changing-models:0333 · 21:47.080 → 21:47.660

EN: I think so.

ZH: 我想是这样。

### changing-models:0334 · 21:47.660 → 21:50.540

EN: I think, I think that this is probably what's going to happen.

ZH: 我觉得很可能会这样发展。

### changing-models:0335 · 21:52.640 → 21:53.120

EN: Yeah.

ZH: 对。

### changing-models:0336 · 21:53.180 → 21:53.860

EN: Yeah, that kind of makes sense.

ZH: 是的，这说得通。

### changing-models:0337 · 21:53.920 → 22:00.180

EN: I still would like, like in Pi, the difference between what the model sees and what harness or

ZH: 我还是想说，在 Pi 里，模型看到的内容和 harness、

### changing-models:0338 · 22:00.180 → 22:05.160

EN: consumer of events sees has mostly always been there.

ZH: 或者事件消费者看到的内容，基本上一直是有区别的。

### changing-models:0339 · 22:06.640 → 22:11.240

EN: Including for tools and for entries in the transcript.

ZH: 工具以及执行记录里的条目都是如此。

### changing-models:0340 · 22:11.240 → 22:11.280

EN: Right.

ZH: 对。

### changing-models:0341 · 22:12.060 → 22:12.440

EN: And I think this.

ZH: 我觉得这……

### changing-models:0342 · 22:12.440 → 22:15.960

EN: And you have to say, like if you are bash only, there's only one output, right?

ZH: 不过也得说，如果只有 Bash，那就只有一个输出，对吧？

### changing-models:0343 · 22:16.080 → 22:16.320

EN: Sure.

ZH: 当然。

### changing-models:0344 · 22:16.720 → 22:16.960

EN: Sure.

ZH: 当然。

### changing-models:0345 · 22:17.040 → 22:20.520

EN: If you're bash only, you're kind of, you're kind of, yeah, full part.

ZH: 如果只有 Bash，那你就……［此处表达转写不清，待回听］。

### changing-models:0346 · 22:20.680 → 22:25.360

EN: But I think a future will be composed via MCP plus code mode.

ZH: 但我觉得未来会通过 MCP 加 code mode 来组合这些能力。

### changing-models:0347 · 22:25.560 → 22:26.620

EN: That kind of makes sense.

ZH: 这挺合理。

### changing-models:0348 · 22:26.980 → 22:30.060

EN: I worry though that the models aren't as trained on that just yet.

ZH: 不过我担心，目前模型在这方面的训练还不够充分。

### changing-models:0349 · 22:31.340 → 22:34.240

EN: I mean, I analyzed a lot of codex transcripts.

ZH: 我分析过很多 Codex 的执行记录。

### changing-models:0350 · 22:34.240 → 22:40.680

EN: So when, when Astra released, I, I did a whole bunch of like work just in the codex harness

ZH: Astra 发布时，我专门在 Codex harness 里做了不少工作，

### changing-models:0351 · 22:40.680 → 22:42.540

EN: so that I can see how it behaves.

ZH: 就是为了观察它的行为。

### changing-models:0352 · 22:43.460 → 22:50.460

EN: And, um, I can see that Astra loves to use code mode, even for situations where it wouldn't have to.

ZH: 我发现 Astra 很喜欢用 code mode，哪怕有些场景根本不需要。

### changing-models:0353 · 22:50.520 → 22:55.380

EN: Like I've seen it uses code mode to apply patch, which is like, why would you do that?

ZH: 比如我见过它用 code mode 来调用 apply_patch，你为什么要这么做呢？

### changing-models:0354 · 22:55.500 → 22:58.140

EN: It's just like a level of interaction that was not really necessary.

ZH: 这只是多了一层没什么必要的间接调用。

### changing-models:0355 · 22:58.140 → 23:03.920

EN: Um, but there are differences in how code mode works in the different models.

ZH: 而且，不同模型使用 code mode 的方式也有差异。

### changing-models:0356 · 23:04.280 → 23:04.440

EN: Right.

ZH: 对。

### changing-models:0357 · 23:04.580 → 23:10.860

EN: And so, um, and the, the surface, the surface area of code mode is obviously much bigger than the surface area of,

ZH: code mode 暴露的能力范围，显然比

### changing-models:0358 · 23:10.860 → 23:12.600

EN: of just a regular tool code channel.

ZH: 普通的工具调用通道大得多。

### changing-models:0359 · 23:13.700 → 23:19.100

EN: Um, so I think this requires a lot of testing and evaluation and

ZH: 所以我觉得，这需要大量测试和评估，

### changing-models:0360 · 23:19.100 → 23:22.000

EN: it's unclear where it's going.

ZH: 未来会怎么走还不清楚。

### changing-models:0361 · 23:22.000 → 23:27.840

EN: Um, there's also some tension with local models because I guarantee you that local models will

ZH: 它和本地模型之间也有些矛盾，因为我敢保证，本地模型

### changing-models:0362 · 23:27.840 → 23:29.120

EN: suck at code mode.

ZH: 在 code mode 上会表现得很差。

### changing-models:0363 · 23:29.460 → 23:31.560

EN: So yeah.

ZH: 所以，是啊。

### changing-models:0364 · 23:32.320 → 23:37.660

EN: I think the interesting use case why I really want to get code mode into PI is not even MCP.

ZH: 我很想把 code mode 加进 Pi，最感兴趣的用途其实还不是 MCP。

### changing-models:0365 · 23:37.900 → 23:41.880

EN: It is actually Jev because for Jev to make sense,

ZH: 而是 Jev。要让 Jev 发挥作用，

### changing-models:0366 · 23:41.880 → 23:47.320

EN: you need step one, generate some code that then Jev can evaluate over and over.

ZH: 第一步得先生成一些代码，然后 Jev 才能反复对它进行评估。

### changing-models:0367 · 23:47.320 → 23:52.040

EN: So it's like you basically create like a state machine or like a workflow where on every iteration,

ZH: 也就是说，你基本上是在创建一个状态机或工作流，每次迭代时，

### changing-models:0368 · 23:52.040 → 23:54.820

EN: Jev makes the determination of like which path to go down to.

ZH: 由 Jev 决定该沿着哪条路径继续。

### changing-models:0369 · 23:54.820 → 24:00.440

EN: So, so it will become a really useful primitive, um, to have within PI harness.

ZH: 所以，它会成为 Pi harness 里非常有用的一项基础能力。

### changing-models:0370 · 24:03.080 → 24:09.560

EN: I'm actually more convinced that it's useful for Jev and less convinced that it's useful for MCP right now, unless the MCP servers are changing.

ZH: 相比用于 MCP，我现在更相信它对 Jev 有用，除非 MCP 服务器也发生变化。

### changing-models:0371 · 24:10.160 → 24:11.460

EN: Um, but we'll see.

ZH: 不过，拭目以待吧。

### changing-models:0372 · 24:12.140 → 24:12.520

EN: Nice.

ZH: 不错。

### changing-models:0373 · 24:13.680 → 24:15.160

EN: Well, interesting times.

ZH: 真是有意思的时代。

### changing-models:0374 · 24:15.160 → 24:17.900

EN: Should we go back to our beds and die off man flu?

ZH: 我们是不是该回床上，被这场“男人流感”打倒了？

### changing-models:0375 · 24:18.720 → 24:19.560

EN: Like the babies we are?

ZH: 像两个大宝宝一样？

### changing-models:0376 · 24:19.560 → 24:20.100

EN: I think so.

ZH: 我想是的。

### changing-models:0377 · 24:20.380 → 24:20.700

EN: Okay.

ZH: 好。

### changing-models:0378 · 24:20.960 → 24:21.320

EN: All right.

ZH: 行。

### changing-models:0379 · 24:22.040 → 24:22.860

EN: Happy Monday.

ZH: 周一快乐。

### changing-models:0380 · 24:23.220 → 24:23.800

EN: Happy Monday.

ZH: 周一快乐。

### changing-models:0381 · 24:23.800 → 24:23.960

EN: Okay.

ZH: 好。

### changing-models:0382 · 24:24.820 → 24:25.820

EN: Happy Monday.

ZH: 周一快乐。

## 2026-09-20 · Agent 工程为什么比看起来更难

Why agent engineering is harder than it looks

原帖：https://x.com/pidotdev/status/2101672600237646305

视频：https://video.twimg.com/amplify_video/2101672446218649600/vid/avc1/1080x1920/3XzsxYGnQzRX_TGw.mp4?tag=29

共 77 条字幕。

### agent-frustrations:0001 · 00:00.000 → 00:06.000

EN: Hello, today it's just me. I want to talk with you a little bit about what's hard about AI software engineering.

ZH: 大家好，今天只有我。我想聊聊 AI 软件工程到底难在哪里。

### agent-frustrations:0002 · 00:08.000 → 00:13.680

EN: And this is in part because I got some really lovely emails recently where people shared their experiences,

ZH: 一方面，最近我收到一些很真诚的邮件，大家分享了自己的经历；

### agent-frustrations:0003 · 00:13.680 → 00:18.000

EN: but also because I asked on Twitter and I actually got a ton of responses.

ZH: 另一方面，我也在 Twitter 上问了这个问题，收到了很多回应。

### agent-frustrations:0004 · 00:19.000 → 00:22.580

EN: And really the question that I have sometimes is,

ZH: 我有时真的会想：

### agent-frustrations:0005 · 00:22.580 → 00:28.000

EN: how is it that after 18 months of using agentic software engineering tools like Claude Code,

ZH: 用了 Claude Code 这类 agent 软件工程工具十八个月，

### agent-frustrations:0006 · 00:28.000 → 00:31.000

EN: nothing really improved.

ZH: 怎么感觉什么都没改善？

### agent-frustrations:0007 · 00:32.000 → 00:38.160

EN: And I know this is a little bit not true because clearly the models are way more capable,

ZH: 我知道这么说不完全对，模型显然强了很多，

### agent-frustrations:0008 · 00:38.160 → 00:45.000

EN: but it didn't really feel like the hard problems are solved.

ZH: 但那些真正棘手的问题，似乎并没有解决。

### agent-frustrations:0009 · 00:46.000 → 00:48.000

EN: And in some ways things got worse.

ZH: 有些方面反而更糟了。

### agent-frustrations:0010 · 00:48.000 → 00:54.500

EN: And I think most consistently the problem that I

ZH: 我觉得最常见的问题，

### agent-frustrations:0011 · 00:54.500 → 01:00.220

EN: see that we have working ourselves with agentic tools,

ZH: 无论是我们自己使用 agent 工具时遇到的，

### agent-frustrations:0012 · 01:00.220 → 01:06.000

EN: as well as what I see other people report is really that because we haven't solved some of those fundamental problems.

ZH: 还是别人反馈的，归根结底都是一些基础问题还没有解决。

### agent-frustrations:0013 · 01:07.080 → 01:08.080

EN: Speed is now becoming

ZH: 现在，速度本身

### agent-frustrations:0014 · 01:08.080 → 01:09.360

EN: a new problem.

ZH: 成了一个新问题。

### agent-frustrations:0015 · 01:10.000 → 01:17.000

EN: It generates so many more pieces of code that our capacity to keeping up is going down and down.

ZH: 它生成的代码越来越多，我们却越来越跟不上。

### agent-frustrations:0016 · 01:18.000 → 01:24.340

EN: And it wouldn't be so

ZH: 其实这本来也不会

### agent-frustrations:0017 · 01:24.340 → 01:30.000

EN: bad if we just were willing to slow down, but we're not.

ZH: 那么糟，只要我们愿意慢下来。可我们不愿意。

### agent-frustrations:0018 · 01:30.000 → 01:34.000

EN: We're committing ourselves to being faster and faster.

ZH: 我们要求自己越来越快。

### agent-frustrations:0019 · 01:34.000 → 01:36.000

EN: And that's because we're no longer doing this alone.

ZH: 因为现在已经不是一个人在用这些工具了，

### agent-frustrations:0020 · 01:36.000 → 01:37.000

EN: We're doing this in teams.

ZH: 而是整个团队都在用。

### agent-frustrations:0021 · 01:37.000 → 01:43.240

EN: And I can't tell you how many of you have expressed

ZH: 不知道有多少人跟我表达过这种

### agent-frustrations:0022 · 01:43.240 → 01:49.400

EN: frustration about the fact that other people are sending you slop and other people are sending you

ZH: 挫败感：别人不断把粗制滥造的代码发过来，

### agent-frustrations:0023 · 01:49.400 → 01:51.000

EN: pull requests at their volume they just can't keep up with.

ZH: PR 的数量多到根本看不过来。

### agent-frustrations:0024 · 01:51.000 → 01:56.840

EN: And so we have this unfortunate situation where the models are both

ZH: 于是我们陷入了一种很尴尬的局面：模型

### agent-frustrations:0025 · 01:56.840 → 02:03.000

EN: getting really, really good, but not good enough that we still can't trust them.

ZH: 变得非常强，却还没有强到可以让我们放心信任。

### agent-frustrations:0026 · 02:04.000 → 02:09.000

EN: And this gap doesn't seem to be improving meaningfully.

ZH: 而这段差距，似乎没有明显缩小。

### agent-frustrations:0027 · 02:10.000 → 02:17.000

EN: And it's actually for me a huge problem right now on a very personal level, because I mean, I wrote about this before.

ZH: 对现在的我而言，这在个人层面上也是一个大问题。我以前也写过。

### agent-frustrations:0028 · 02:17.000 → 02:23.340

EN: I don't trust Astra and increasingly I don't trust Fable to be

ZH: 我不相信 Astra 能当好软件工程师，现在对 Fable 也越来越不信任，

### agent-frustrations:0029 · 02:23.340 → 02:29.500

EN: good software engineers, because what's happening in their training processes is that these models are

ZH: 因为在训练过程中，这些模型

### agent-frustrations:0030 · 02:29.500 → 02:33.000

EN: rewarded for succeeding, but not for writing code that I like.

ZH: 获得奖励是因为把任务完成了，而不是因为写出了我喜欢的代码。

### agent-frustrations:0031 · 02:34.000 → 02:39.000

EN: And in many ways, some of the behaviors you get out of these models now are counterproductive.

ZH: 它们现在的一些行为，在很多方面反而适得其反。

### agent-frustrations:0032 · 02:39.000 → 02:42.540

EN: They are,

ZH: 比如，

### agent-frustrations:0033 · 02:42.540 → 02:49.000

EN: for instance, no longer willing to use edit tools as much as they used to, which means that as I'm watching the edits fly by in

ZH: 它们不像以前那样愿意使用编辑工具了。这意味着，当我在

### agent-frustrations:0034 · 02:49.000 → 02:52.920

EN: Pi, very often I can't even understand what the model is doing,

ZH: Pi 里看着修改不断刷过时，常常连模型在做什么都看不明白，

### agent-frustrations:0035 · 02:52.920 → 02:54.000

EN: let alone which tools it's invoking.

ZH: 更别说知道它在调用哪些工具了。

### agent-frustrations:0036 · 02:54.000 → 02:58.000

EN: And so as all of this is going on and on, we're shipping faster.

ZH: 这些事情不断发生，而我们的交付速度越来越快。

### agent-frustrations:0037 · 02:58.000 → 03:00.000

EN: The quality of the code is deteriorating very quickly.

ZH: 代码质量却在迅速下降。

### agent-frustrations:0038 · 03:01.000 → 03:06.840

EN: And our

ZH: 而我们

### agent-frustrations:0039 · 03:06.840 → 03:12.980

EN: tenacity and energy is just not there anymore to

ZH: 已经没有那么多毅力和精力，

### agent-frustrations:0040 · 03:12.980 → 03:17.000

EN: apply the same kind of rigor and quality standards to it as we used to have.

ZH: 再像以前一样坚持同样严格的质量标准。

### agent-frustrations:0041 · 03:17.000 → 03:21.000

EN: And then we're increasingly losing understanding.

ZH: 我们对代码的理解也在不断流失。

### agent-frustrations:0042 · 03:21.000 → 03:27.240

EN: And I think one of the more devious parts about this is

ZH: 我觉得其中更隐蔽的危险在于：

### agent-frustrations:0043 · 03:27.240 → 03:30.300

EN: that in situations where my understanding is really,

ZH: 当某个场景真的非常需要

### agent-frustrations:0044 · 03:30.300 → 03:35.000

EN: really necessary, there are too many cases where seemingly nobody has it anymore.

ZH: 我们理解代码时，却常常发现似乎已经没人懂了。

### agent-frustrations:0045 · 03:35.000 → 03:40.000

EN: And I heard this story from friends I used to work with.

ZH: 以前一起工作的朋友跟我讲过这样的事。

### agent-frustrations:0046 · 03:40.000 → 03:45.980

EN: I had heard stories like this from people talking about it on Twitter that

ZH: 我也在 Twitter 上听人讲过类似的经历：

### agent-frustrations:0047 · 03:45.980 → 03:52.380

EN: you can now end up in an incident where a bunch of people

ZH: 出了故障，一群人

### agent-frustrations:0048 · 03:52.380 → 03:54.000

EN: are huddling in a Slack room trying to figure out what's going on.

ZH: 挤在 Slack 频道里，试图弄清楚发生了什么。

### agent-frustrations:0049 · 03:54.000 → 04:01.000

EN: And it's just all talking with the machines because nobody actually really wants to understand anymore, let alone understand the code that was committed.

ZH: 结果大家都只是在跟机器聊天，因为已经没人真想去理解了，更别说理解提交进去的代码。

### agent-frustrations:0050 · 04:01.000 → 04:07.000

EN: And that's not a situation that I think we should be encouraging.

ZH: 我觉得我们不应该鼓励这种局面。

### agent-frustrations:0051 · 04:07.000 → 04:13.280

EN: But I do want to let you know,

ZH: 但我想告诉大家，

### agent-frustrations:0052 · 04:13.280 → 04:15.000

EN: a lot of us are feeling like this right now.

ZH: 现在很多人都有这样的感受。

### agent-frustrations:0053 · 04:15.000 → 04:20.900

EN: And I think we owe it to us and our industry

ZH: 为了我们自己，也为了这个行业，

### agent-frustrations:0054 · 04:20.900 → 04:24.920

EN: to find solutions to this problem and not just

ZH: 我们有责任想办法解决这个问题，不能只是

### agent-frustrations:0055 · 04:24.920 → 04:31.000

EN: let it happen and not push back against this.

ZH: 任由它发生，什么抵抗都不做。

### agent-frustrations:0056 · 04:31.000 → 04:34.000

EN: This is a very shared experience.

ZH: 这是一种非常普遍的经历。

### agent-frustrations:0057 · 04:34.000 → 04:38.000

EN: And don't get me wrong.

ZH: 别误会，

### agent-frustrations:0058 · 04:38.000 → 04:39.000

EN: I love those tools.

ZH: 我喜欢这些工具。

### agent-frustrations:0059 · 04:39.000 → 04:42.000

EN: I think they're absolutely fascinating.

ZH: 它们确实非常迷人。

### agent-frustrations:0060 · 04:42.000 → 04:49.000

EN: And it is so many times just such a magical experience to work with them.

ZH: 很多时候，用它们的体验简直像魔法一样。

### agent-frustrations:0061 · 04:49.000 → 04:53.000

EN: But they are also deeply frustrating.

ZH: 但它们也让人非常沮丧。

### agent-frustrations:0062 · 04:53.000 → 05:00.000

EN: They're little machines where sometimes they produce an amazing result.

ZH: 这些小机器有时会给出惊人的结果，

### agent-frustrations:0063 · 05:00.000 → 05:05.520

EN: And then you're spending two weeks trying to massage one pull request into a shape that you like

ZH: 可接下来，你又得花两个星期反复调整一个 PR，想把它改成满意的样子，

### agent-frustrations:0064 · 05:05.520 → 05:09.000

EN: with no feeling of forward progress.

ZH: 却完全感觉不到在往前推进。

### agent-frustrations:0065 · 05:09.000 → 05:14.000

EN: And it seems to be random.

ZH: 而且这似乎是随机的。

### agent-frustrations:0066 · 05:14.000 → 05:20.260

EN: I don't know if it's just if me and my little community around us are just not the best

ZH: 我不知道，是不是我和身边这个小圈子的人都不太擅长

### agent-frustrations:0067 · 05:20.260 → 05:25.000

EN: prompters because I've heard that some people express that we're all just prompting wrong.

ZH: 写提示词。毕竟有人说，只是我们提示词写错了。

### agent-frustrations:0068 · 05:25.000 → 05:27.000

EN: But I think it's just hard.

ZH: 但我觉得，这件事本来就很难。

### agent-frustrations:0069 · 05:27.000 → 05:33.460

EN: And I just really felt like because

ZH: 我真的觉得，既然

### agent-frustrations:0070 · 05:33.460 → 05:38.500

EN: we're all, maybe not all of us, but because I think a lot of us struggling with this,

ZH: 我们——也许不是所有人，但至少很多人——都在为此挣扎，

### agent-frustrations:0071 · 05:38.500 → 05:42.000

EN: I think it's just good to let you know that you're not alone.

ZH: 那就应该让你知道：你不是一个人。

### agent-frustrations:0072 · 05:42.000 → 05:48.220

EN: And I think we probably need to do some changes here in how we approach certain

ZH: 我想，我们可能需要改变处理某些

### agent-frustrations:0073 · 05:48.220 → 05:52.000

EN: problems and how we engineer to actually really get to the bottom of it.

ZH: 问题的方式，改变工程实践，才能真正追到问题根源。

### agent-frustrations:0074 · 05:52.000 → 05:56.600

EN: Because better models and more capable models,

ZH: 因为更好、更强的模型，

### agent-frustrations:0075 · 05:56.600 → 06:03.060

EN: if anything, right now are making it a little bit worse by writing code that

ZH: 眼下反倒让情况更糟了一点：它们写出的代码

### agent-frustrations:0076 · 06:03.060 → 06:08.000

EN: is a lot less pleasant to look at and a lot harder to understand.

ZH: 看着难受得多，也难懂得多。

### agent-frustrations:0077 · 06:08.000 → 06:13.000

EN: So that's it for today. Have a nice weekend.

ZH: 今天就聊到这里。周末愉快。

## 2026-09-13 · Slippery slop：代码质量与控制权

Slippery slop: code quality and control

原帖：https://x.com/pidotdev/status/2099045420496486415

视频：https://video.twimg.com/amplify_video/2098748958965215239/vid/avc1/1920x1080/6r8Wh1GSYDZnkOyT.mp4?tag=29

共 196 条字幕。

### slippery-slop:0001 · 00:00.000 → 00:01.700

EN: But you can't be loud.

ZH: 但你不能大声。

### slippery-slop:0002 · 00:01.820 → 00:03.160

EN: Be quiet with the sword.

ZH: 拿着剑的时候安静一点。

### slippery-slop:0003 · 00:03.860 → 00:04.920

EN: Be quiet with the sword.

ZH: 拿着剑的时候安静一点。

### slippery-slop:0004 · 00:07.840 → 00:10.520

EN: Code is less important than it used to be, obviously.

ZH: 显然，代码已经没有以前那么重要了。

### slippery-slop:0005 · 00:11.480 → 00:17.680

EN: But the question is, how good can your agent deal with a shit ton of code,

ZH: 但问题是，面对这么一大堆代码，你的 agent 到底能处理得多好？

### slippery-slop:0006 · 00:17.680 → 00:20.540

EN: given its limitations with respect to context window?

ZH: 毕竟它的上下文窗口是有限的。

### slippery-slop:0007 · 00:21.300 → 00:25.920

EN: So the agent is ultimately hurting itself by generating too much code.

ZH: 所以，生成太多代码，到头来是在坑它自己。

### slippery-slop:0008 · 00:26.400 → 00:28.100

EN: Is the code as important as it used to be?

ZH: 代码还像以前一样重要吗？

### slippery-slop:0009 · 00:28.100 → 00:29.100

EN: No, definitely not.

ZH: 不，肯定没那么重要了。

### slippery-slop:0010 · 00:30.400 → 00:35.860

EN: But I would say that it is still important in Astra is cool and all,

ZH: 但我觉得代码仍然重要。Astra 很酷，

### slippery-slop:0011 · 00:35.860 → 00:38.040

EN: just like Fable, but there's still slot machines.

ZH: Fable 也是，但它们仍然像老虎机。

### slippery-slop:0012 · 00:38.360 → 00:43.000

EN: And I would say there is a lot of code where you don't need to know what it does and how it works.

ZH: 确实有很多代码，你不需要知道它具体做什么、怎么工作。

### slippery-slop:0013 · 00:43.340 → 00:48.700

EN: But there's also a lot of very important infrastructure code where you still want to know what it does.

ZH: 但也有很多重要的基础设施代码，你还是得知道它在做什么。

### slippery-slop:0014 · 00:50.340 → 00:52.980

EN: I think ultimately it comes down to control.

ZH: 归根结底，这是控制权的问题。

### slippery-slop:0015 · 00:53.580 → 00:56.700

EN: I personally like controlling interfaces and types.

ZH: 我个人喜欢把接口和类型掌握在自己手里。

### slippery-slop:0016 · 00:56.700 → 01:02.300

EN: And as long as I have control of that, the LLM is kind of limited in how much damage it can do.

ZH: 只要这些还在我的控制之下，LLM 能造成的破坏就比较有限。

### slippery-slop:0017 · 01:02.560 → 01:09.140

EN: Yes, the models can shit out immense amounts of code now, but by doing so, they're hurting themselves because ultimately they still have a limited context window.

ZH: 没错，模型现在能疯狂吐出大量代码，但这也在坑自己，因为它们的上下文窗口终究有限。

### slippery-slop:0018 · 01:09.140 → 01:13.020

EN: And if it doesn't fit, you get more slop.

ZH: 一旦装不下，就会冒出更多垃圾代码。

### slippery-slop:0019 · 01:13.020 → 01:18.900

EN: What I found interesting with the Astra release is that I,

ZH: Astra 发布后，我发现一件很有意思的事：

### slippery-slop:0020 · 01:18.900 → 01:25.060

EN: for the first time, felt like less and less desire to actually look at the code that it produces because it's so hard to see.

ZH: 我第一次越来越不想看它生成的代码，因为实在太难看了。

### slippery-slop:0021 · 01:25.060 → 01:27.580

EN: And not, I mean, it's hard to look at.

ZH: 我是说，看着就很费劲。

### slippery-slop:0022 · 01:27.720 → 01:32.020

EN: It is incredibly compressed in situations in where it shouldn't be,

ZH: 它会在不该压缩的地方，把代码压得特别紧，

### slippery-slop:0023 · 01:32.020 → 01:36.480

EN: even when it actually uses code generation for writing code.

ZH: 甚至在正经生成代码时也是这样。

### slippery-slop:0024 · 01:36.680 → 01:39.860

EN: But it's particularly unreadable when it uses code to call tools.

ZH: 而用代码调用工具时，尤其难读。

### slippery-slop:0025 · 01:40.220 → 01:47.040

EN: So like actually following along what it's doing is also getting harder and harder just by how it writes code.

ZH: 光是它写代码的方式，就让人越来越难跟上它在做什么。

### slippery-slop:0026 · 01:47.040 → 01:52.780

EN: And I think like to Mario's point, like it actually does get, like during the training process,

ZH: 就像 Mario 说的，在训练过程中，

### slippery-slop:0027 · 01:52.780 → 01:54.640

EN: it probably gets rewarded for token efficiency.

ZH: 它可能会因为节省 token 而获得奖励。

### slippery-slop:0028 · 01:55.360 → 01:59.940

EN: But as a result of this token efficiency, it is hard to read.

ZH: 但追求这种 token 效率的结果，就是难以阅读。

### slippery-slop:0029 · 02:00.420 → 02:06.880

EN: And there's a tension, I think, sort of forming where I think even if you get the

ZH: 我觉得这里出现了一种矛盾：即使你把

### slippery-slop:0030 · 02:06.880 → 02:11.000

EN: interfaces right and everything else, like if I look at an Astra produced code,

ZH: 接口之类的都设计好了，看到 Astra 生成的代码时，

### slippery-slop:0031 · 02:11.000 → 02:13.000

EN: I feel an urge to do code formatting.

ZH: 我还是忍不住想给它格式化。

### slippery-slop:0032 · 02:13.000 → 02:16.360

EN: Which I didn't feel for a very, very long time.

ZH: 我已经很久很久没有这种感觉了。

### slippery-slop:0033 · 02:16.500 → 02:22.160

EN: I basically haven't used code formats at all because I felt like the LLM is going to follow along the style of the code that's already there.

ZH: 我基本没用过代码格式化工具，因为我觉得 LLM 会跟着现有代码的风格来写。

### slippery-slop:0034 · 02:22.280 → 02:22.900

EN: And now it doesn't.

ZH: 但现在它不跟了。

### slippery-slop:0035 · 02:23.420 → 02:24.640

EN: Yeah, and it is kind of odd.

ZH: 是啊，挺奇怪的。

### slippery-slop:0036 · 02:24.860 → 02:25.780

EN: It is really odd.

ZH: 真的很奇怪。

### slippery-slop:0037 · 02:25.860 → 02:26.840

EN: And I don't know where it's going.

ZH: 我也不知道接下来会怎样。

### slippery-slop:0038 · 02:27.280 → 02:32.120

EN: But I'm a little bit feeling like this might become more of a thing now.

ZH: 但我隐约觉得，这种情况可能会越来越常见。

### slippery-slop:0039 · 02:32.260 → 02:33.520

EN: And I don't know how I feel about this.

ZH: 我不知道该怎么看待它。

### slippery-slop:0040 · 02:35.360 → 02:38.020

EN: You said something earlier, which I thought was interesting.

ZH: 你之前说了一点，我觉得很有意思。

### slippery-slop:0041 · 02:38.020 → 02:41.800

EN: As the models are trained to not only be coding agents,

ZH: 模型不只被训练成编程 agent，

### slippery-slop:0042 · 02:41.800 → 02:48.140

EN: but also like personal open claw-like assistants, it's that's a reason that the training might

ZH: 也被训练成像 OpenClaw 那样的个人助手，所以训练里可能

### slippery-slop:0043 · 02:48.140 → 02:54.280

EN: contain traces or things like just create whatever the

ZH: 会有这样的轨迹或要求：随便写什么

### slippery-slop:0044 · 02:54.280 → 02:58.380

EN: fucking code you want to create, as long as it does the thing the user asked for.

ZH: 破代码都行，只要完成用户要的事情。

### slippery-slop:0045 · 02:58.380 → 03:01.700

EN: And the user is a non-technical user and the user doesn't write production systems,

ZH: 而那个用户不是技术人员，也不写生产系统，

### slippery-slop:0046 · 03:01.700 → 03:08.080

EN: but just tiny little things like build me a daily news brief website or something.

ZH: 只是做些小东西，比如“帮我做一个每日新闻简报网站”。

### slippery-slop:0047 · 03:08.300 → 03:09.340

EN: Or Minecraft clone or anything.

ZH: 或者仿个 Minecraft，什么都行。

### slippery-slop:0048 · 03:09.700 → 03:15.640

EN: So if the models are now being trained to produce slop code just to make their users happy,

ZH: 所以，如果模型现在被训练成只要让用户满意，就可以生成粗糙代码，

### slippery-slop:0049 · 03:15.640 → 03:20.760

EN: which is totally fine, then we'll have a detrimental effect on using these models for production software.

ZH: 这本身也没问题，但会损害它们用于生产软件开发的效果。

### slippery-slop:0050 · 03:20.760 → 03:25.320

EN: So what I found quite interesting was,

ZH: 我觉得很有意思的一点是，

### slippery-slop:0051 · 03:25.320 → 03:31.120

EN: I noticed as you sort of look into the code that it produces,

ZH: 仔细看它生成的代码，

### slippery-slop:0052 · 03:31.120 → 03:34.780

EN: like in tests, in shaders, in embedded JavaScript,

ZH: 比如测试、着色器、嵌入的 JavaScript，

### slippery-slop:0053 · 03:34.780 → 03:37.940

EN: you can clearly notice that it's way worse than in the regular code that it writes.

ZH: 你能明显看出这些比它平时写的普通代码差得多。

### slippery-slop:0054 · 03:38.180 → 03:41.460

EN: So I wrote in a blog post, I think it's like one step removed from regular code.

ZH: 我在博客里写过：好像只要偏离常规代码一层，

### slippery-slop:0055 · 03:41.560 → 03:45.600

EN: It sort of starts falling into this pattern of really highly compressed things.

ZH: 它就开始陷入那种把东西压得特别紧的模式。

### slippery-slop:0056 · 03:45.600 → 03:47.860

EN: But then I was like, okay, maybe this just happens to me.

ZH: 但我又想，也许只有我遇到这种情况。

### slippery-slop:0057 · 03:47.880 → 03:53.520

EN: So I asked a bunch of people on Twitter, like, hey, if you build like an Astro game over the weekend and it works for you,

ZH: 于是我在 Twitter 上问大家：如果你周末用 Astra 做了个游戏，而且觉得效果不错，

### slippery-slop:0058 · 03:53.520 → 03:54.720

EN: just show me the code.

ZH: 就把代码给我看看。

### slippery-slop:0059 · 03:54.880 → 03:58.100

EN: And there were two people who replied like, oh yeah, it wasn't so bad.

ZH: 有两个人回复说：“还好吧，没那么差。”

### slippery-slop:0060 · 03:58.180 → 04:00.540

EN: And I just opened the code and it was really, really bad.

ZH: 结果我打开一看，代码真的非常糟。

### slippery-slop:0061 · 04:01.560 → 04:05.440

EN: And then it was, I think both of them replied, yeah, it's probably not nice.

ZH: 后来他们好像也都说：“嗯，可能确实不太好看。”

### slippery-slop:0062 · 04:06.000 → 04:11.120

EN: The thing is, like, we don't really expect it to actually write code this bad, I think.

ZH: 问题在于，我觉得我们原本没想到它真会把代码写得这么差。

### slippery-slop:0063 · 04:11.120 → 04:16.940

EN: Like, I got fully trusted that the models are at least certain level of,

ZH: 我原本完全相信，模型至少能达到某种

### slippery-slop:0064 · 04:16.940 → 04:18.660

EN: like, passing bar.

ZH: 及格水平。

### slippery-slop:0065 · 04:18.900 → 04:21.300

EN: And it feels a little bit like it violated this now.

ZH: 可现在感觉它连这条底线都突破了。

### slippery-slop:0066 · 04:21.420 → 04:21.820

EN: I don't know.

ZH: 我也说不准。

### slippery-slop:0067 · 04:22.020 → 04:23.700

EN: It definitely feels like a shift.

ZH: 但确实感觉发生了变化。

### slippery-slop:0068 · 04:25.020 → 04:30.940

EN: Yeah, just yesterday I did some work on an old C, C++ code base in Spine.

ZH: 对，就在昨天，我在 Spine 的一个老 C、C++ 代码库里做修改。

### slippery-slop:0069 · 04:30.940 → 04:35.420

EN: I switched back to 5.6 Sol

ZH: 我又换回了 5.6 Sol，

### slippery-slop:0070 · 04:35.420 → 04:40.220

EN: because Astro just couldn't write any sensible kind of code.

ZH: 因为 Astra 就是写不出什么像样的代码。

### slippery-slop:0071 · 04:40.420 → 04:41.680

EN: It's very weird.

ZH: 很奇怪。

### slippery-slop:0072 · 04:41.900 → 04:42.860

EN: It's very, very weird.

ZH: 真的非常奇怪。

### slippery-slop:0073 · 04:43.000 → 04:44.960

EN: I blame personality fans.

ZH: 我怪那些追捧模型个性的人。

### slippery-slop:0074 · 04:46.400 → 04:53.040

EN: One thought that I had was that if you have the idea,

ZH: 我想到一点：假如你认为，

### slippery-slop:0075 · 04:53.040 → 04:57.620

EN: at least in theory, that you don't have to at all consider the code because,

ZH: 至少理论上，根本不用关心代码本身，

### slippery-slop:0076 · 04:57.620 → 05:00.500

EN: like, the test coverage is going to guarantee you that the code works perfectly.

ZH: 因为测试覆盖率能保证代码完美运行。

### slippery-slop:0077 · 05:00.940 → 05:05.440

EN: Then, even if you have, like, 100% branch coverage,

ZH: 那么，就算分支覆盖率达到了 100%，

### slippery-slop:0078 · 05:05.440 → 05:10.300

EN: which I don't think is likely, do your reader cover all the possible inputs to that function?

ZH: 虽然我觉得这不太可能，你真的覆盖了这个函数所有可能的输入吗？

### slippery-slop:0079 · 05:10.300 → 05:16.700

EN: And one of the things that I noticed, like, with this is that because it

ZH: 我注意到的一点是，它把代码

### slippery-slop:0080 · 05:16.700 → 05:20.240

EN: compresses the code so much, I,

ZH: 压缩得太厉害了，

### slippery-slop:0081 · 05:20.240 → 05:25.820

EN: when I just look at the diff that it does, I don't have any confidence that,

ZH: 光看它生成的 diff，我根本没有把握，

### slippery-slop:0082 · 05:25.820 → 05:30.800

EN: like, I could even without asking the LLM tell you if the tests are sufficient.

ZH: 能在不问 LLM 的情况下判断测试到底够不够。

### slippery-slop:0083 · 05:30.800 → 05:34.320

EN: I'm really struggling with this whole thing because,

ZH: 这整件事让我很苦恼。

### slippery-slop:0084 · 05:34.320 → 05:38.020

EN: like, if the code is too unreadable, then, and I'm not saying,

ZH: 如果代码太难读——我不是说

### slippery-slop:0085 · 05:38.020 → 05:43.860

EN: like, it's completely unreadable, but, like, it becomes so that you're one step further away from it.

ZH: 完全读不懂，而是你离代码又远了一层——

### slippery-slop:0086 · 05:43.860 → 05:49.320

EN: And then you rely more on, like, okay, but there are tests and the tests pass and I can still navigate in my slop game.

ZH: 你就会更依赖这种想法：“有测试，测试都过了，我那个粗糙游戏也还能玩。”

### slippery-slop:0087 · 05:49.460 → 05:51.760

EN: And so, surely the whole thing must be working.

ZH: 所以整套东西肯定没问题吧。

### slippery-slop:0088 · 05:52.560 → 05:59.320

EN: But it's, like, it becomes so much harder to understand if you feel repulsed looking at the code.

ZH: 可如果代码让你看着就抗拒，理解它就会困难得多。

### slippery-slop:0089 · 06:00.100 → 06:04.700

EN: So, at that point, the tests also just become performative, right?

ZH: 到这一步，测试也变成了做样子，对吧？

### slippery-slop:0090 · 06:04.700 → 06:07.840

EN: It just gives you a good feeling of there are tests.

ZH: 它只是让你觉得：“有测试，挺好。”

### slippery-slop:0091 · 06:08.280 → 06:13.100

EN: I don't fucking know what they do and if they actually cover what we need to cover in the tests, but they exist.

ZH: 我压根不知道它们在测什么，有没有覆盖该测的东西，反正它们存在。

### slippery-slop:0092 · 06:13.600 → 06:14.660

EN: And that's why I feel good.

ZH: 所以我就放心了。

### slippery-slop:0093 · 06:16.020 → 06:18.560

EN: It's very emotion-based, all of it.

ZH: 全都是在靠感觉。

### slippery-slop:0094 · 06:19.620 → 06:26.720

EN: But if they produce code that is unreadable, then you have even less incentive of checking whether the code they produced makes any kind of fucking sense.

ZH: 如果生成的代码让人读不下去，你就更不想检查它到底有没有道理了。

### slippery-slop:0095 · 06:26.960 → 06:31.980

EN: So, it feels like we are getting pushed to being removed from the code.

ZH: 感觉我们正在被一步步推离代码。

### slippery-slop:0096 · 06:31.980 → 06:32.120

EN: Okay.

ZH: 好。

### slippery-slop:0097 · 06:34.700 → 06:37.940

EN: What if you use something like Astra, which is clearly,

ZH: 如果用 Astra 这样的模型，它显然

### slippery-slop:0098 · 06:37.940 → 06:41.320

EN: like, trained to succeed,

ZH: 就是被训练来把事做成的，

### slippery-slop:0099 · 06:41.320 → 06:45.780

EN: but you use it only for the tool calls.

ZH: 但你只让它负责调用工具呢？

### slippery-slop:0100 · 06:45.900 → 06:47.160

EN: Like, you don't use it for the writing.

ZH: 不让它负责写代码。

### slippery-slop:0101 · 06:47.260 → 06:50.440

EN: So, like, whenever it tries to write some code, you're like, oh, you stop.

ZH: 每当它要写代码，你就说：“停下。”

### slippery-slop:0102 · 06:50.840 → 06:55.600

EN: Some agent, I don't know, something else you implement now.

ZH: 换个 agent，或者别的什么东西来实现。

### slippery-slop:0103 · 06:57.080 → 07:00.700

EN: Because I really feel like there's a tension in the training process.

ZH: 因为我真的觉得训练过程里存在冲突。

### slippery-slop:0104 · 07:00.700 → 07:05.620

EN: They're like, either this is really good and we should like this because,

ZH: 要么，这种做法确实很好，我们就应该接受，

### slippery-slop:0105 · 07:05.620 → 07:10.120

EN: I don't know, software engineering is solved and it's just a bug fix that we have to deal with now.

ZH: 比如软件工程已经解决了，眼下只剩修修补补。

### slippery-slop:0106 · 07:10.520 → 07:11.780

EN: And so, we don't look at the code anymore.

ZH: 那我们就不再看代码了。

### slippery-slop:0107 · 07:11.900 → 07:12.920

EN: So, it doesn't matter how it looks.

ZH: 代码长什么样也就不重要。

### slippery-slop:0108 · 07:13.060 → 07:15.040

EN: And it's, like, really purely optimized for the LLM.

ZH: 完全针对 LLM 优化就好。

### slippery-slop:0109 · 07:15.040 → 07:20.820

EN: Or, these models are actually only behaving this way because they're being trained to do other things,

ZH: 要么，模型之所以这样，只是因为它们被训练去做其他事情，

### slippery-slop:0110 · 07:20.820 → 07:22.700

EN: particularly really good tool calling using code.

ZH: 尤其是很擅长用代码调用工具。

### slippery-slop:0111 · 07:23.460 → 07:29.840

EN: And so, there's a tension in the training process and you should actually use a different model that's being trained to be an

ZH: 那么训练目标就存在冲突，你应该换个专门被训练成

### slippery-slop:0112 · 07:29.840 → 07:31.120

EN: expert software engineer.

ZH: 优秀软件工程师的模型。

### slippery-slop:0113 · 07:31.120 → 07:34.680

EN: And I really don't know what the answer is here because,

ZH: 我真的不知道答案是什么。

### slippery-slop:0114 · 07:34.680 → 07:39.000

EN: like, it's not like you go to OpenAI page and it's like, yeah, do that.

ZH: 毕竟你打开 OpenAI 的网页，也不会看到它明确告诉你该这么做。

### slippery-slop:0115 · 07:40.340 → 07:44.440

EN: No, but maybe that's like a model capacity issue now.

ZH: 不过，也许现在碰到的是模型容量的问题。

### slippery-slop:0116 · 07:44.440 → 07:50.680

EN: Like, as they try to accommodate more and more use cases or vertical slices of

ZH: 随着模型试图覆盖越来越多用例，或越来越多

### slippery-slop:0117 · 07:50.680 → 07:57.340

EN: specific industries, obviously, the model needs to know about how to operate within these environments.

ZH: 垂直行业，它显然就得学会如何在这些环境里工作。

### slippery-slop:0118 · 07:57.340 → 08:03.760

EN: But that will ultimately mean that there are less parameters available to the things they used to be good

ZH: 那最终就意味着，留给它原本擅长的事情的参数变少了，

### slippery-slop:0119 · 08:03.760 → 08:06.000

EN: for, like software engineering.

ZH: 比如软件工程。

### slippery-slop:0120 · 08:06.300 → 08:07.780

EN: So, maybe we are hitting that now.

ZH: 也许我们现在就撞上这个问题了。

### slippery-slop:0121 · 08:08.160 → 08:12.880

EN: Maybe it's the, you're trying to accommodate as many industries as possible.

ZH: 也许是因为想尽可能覆盖所有行业，

### slippery-slop:0122 · 08:13.160 → 08:19.300

EN: So, your industry, specifically the software industry, is now suffering because there's not enough parameters left for your specific industry.

ZH: 结果你所在的行业，尤其是软件行业，分到的参数不够，效果就受损了。

### slippery-slop:0123 · 08:20.060 → 08:20.340

EN: I don't know.

ZH: 我也不知道。

### slippery-slop:0124 · 08:20.340 → 08:26.160

EN: The token spent on engineering went

ZH: 工程方面的 token 消耗，

### slippery-slop:0125 · 08:26.160 → 08:27.700

EN: up in a certain way.

ZH: 一直在增长。

### slippery-slop:0126 · 08:27.740 → 08:30.680

EN: So, you could see, like, month by month what that was.

ZH: 你可以逐月看到这个变化。

### slippery-slop:0127 · 08:30.980 → 08:33.760

EN: But none of the top line numbers moved up at all.

ZH: 但那些顶线数字完全没有上涨，

### slippery-slop:0128 · 08:35.220 → 08:37.700

EN: In a way, that was correlatable to this.

ZH: 至少看不出跟它有什么关联。

### slippery-slop:0129 · 08:38.060 → 08:39.680

EN: But obviously, the number of commits went up.

ZH: 当然，提交次数增加了。

### slippery-slop:0130 · 08:39.820 → 08:41.760

EN: The number of, like, other things that you could measure went up.

ZH: 其他一些能统计的数量也增加了。

### slippery-slop:0131 · 08:42.460 → 08:49.020

EN: And so, it went from, like, an insignificant part of, like, the expenditure of the company to a really meaningful part of the expenditure of the company.

ZH: 这笔支出从公司开销里微不足道的一项，变成了相当可观的一项。

### slippery-slop:0132 · 08:49.020 → 08:54.340

EN: And it might just be that we haven't figured out yet how to make that work.

ZH: 也许只是我们还没弄明白，怎么真正把它用好。

### slippery-slop:0133 · 08:55.140 → 09:01.480

EN: Or, like, what is being produced actually isn't that much

ZH: 也可能只是整体来看，产出的东西并没有

### slippery-slop:0134 · 09:01.480 → 09:03.440

EN: more meaningful overall.

ZH: 多出那么多实际价值。

### slippery-slop:0135 · 09:04.260 → 09:10.540

EN: And so, because now everybody, like, as an example, like, the baseline expectation that we

ZH: 比如，现在大家对一款软件的基本期待，

### slippery-slop:0136 · 09:10.540 → 09:13.080

EN: have now for a piece of software is that it does more.

ZH: 已经变成它必须做更多事情。

### slippery-slop:0137 · 09:14.060 → 09:17.620

EN: So, you need now to compete with everybody else who's in your space as well.

ZH: 你还得跟同一领域里的其他所有人竞争。

### slippery-slop:0138 · 09:17.620 → 09:20.320

EN: So, like, of course, your thing now should have a chatbot in it.

ZH: 所以，你的产品当然也得有聊天机器人。

### slippery-slop:0139 · 09:20.700 → 09:26.240

EN: Of course, there should be, I don't know, like, the UI should behave in a certain way that was previously not necessary.

ZH: 界面当然也得做到一些以前根本不需要的东西。

### slippery-slop:0140 · 09:26.920 → 09:31.480

EN: Like, more people now build mobile apps, I think, than they did before just because it became easier.

ZH: 我觉得现在做移动应用的人也比以前多了，因为门槛降低了。

### slippery-slop:0141 · 09:31.980 → 09:37.400

EN: So, maybe this is sort of, like, a really weird form of, like, we are required to build more.

ZH: 也许这是一种很奇怪的局面：我们被要求做得更多，

### slippery-slop:0142 · 09:37.540 → 09:40.260

EN: But, like, the amount of consumers is still the same.

ZH: 但消费者的数量还是那么多。

### slippery-slop:0143 · 09:40.560 → 09:44.040

EN: So, it just has become more expensive to the software engineering.

ZH: 结果只是软件工程变得更贵了。

### slippery-slop:0144 · 09:44.180 → 09:45.120

EN: I don't know if that's the answer.

ZH: 我不知道这是不是答案。

### slippery-slop:0145 · 09:45.120 → 09:51.620

EN: I mean, I guess it's hard to measure at the moment just because

ZH: 我觉得现在也很难衡量，毕竟

### slippery-slop:0146 · 09:51.620 → 09:57.420

EN: of the economic turmoil overall with oil being up and so on and so forth.

ZH: 整体经济不太平，油价上涨，还有各种其他因素。

### slippery-slop:0147 · 09:57.560 → 10:01.020

EN: So, just taking GDP is probably a bad, bad idea.

ZH: 所以，单看 GDP 大概很不合适。

### slippery-slop:0148 · 10:01.280 → 10:07.960

EN: But if you look at individual companies, I don't see them producing more meaningful features for the users if you're looking at software companies.

ZH: 但看具体公司，尤其是软件公司，我没看到它们为用户做出更多真正有意义的功能。

### slippery-slop:0149 · 10:08.500 → 10:09.580

EN: I just don't see it.

ZH: 我真的没看到。

### slippery-slop:0150 · 10:09.580 → 10:17.140

EN: Like, can you name a single software or SaaS product that has meaningfully changed in the past 12 months?

ZH: 你能说出哪款软件或 SaaS 产品，在过去十二个月里发生了实质变化吗？

### slippery-slop:0151 · 10:17.620 → 10:19.700

EN: I mean, I think in the AI space, you see that a little bit.

ZH: 我觉得在 AI 领域，多少还是能看到一点。

### slippery-slop:0152 · 10:20.400 → 10:23.820

EN: Yeah, but then the question is, who is using all of that stuff from the AI space?

ZH: 对，但问题是，AI 领域做出来的这些东西，到底谁在用？

### slippery-slop:0153 · 10:24.380 → 10:24.600

EN: Yeah.

ZH: 是啊。

### slippery-slop:0154 · 10:24.600 → 10:29.240

EN: I found, like, iOS 27 to be an interesting proof point here because,

ZH: 我觉得 iOS 27 就是个挺有意思的例子，

### slippery-slop:0155 · 10:29.240 → 10:35.120

EN: like, clearly there should be more people in Apple using AI tools.

ZH: 因为苹果内部使用 AI 工具的人显然应该更多了。

### slippery-slop:0156 · 10:35.360 → 10:41.120

EN: Like, I heard from people at Apple that there is, like, plenty amount of, like, AI supports of engineering going on.

ZH: 我听苹果的人说，他们确实在大量使用 AI 辅助开发。

### slippery-slop:0157 · 10:41.120 → 10:46.540

EN: But, like, from iOS 26 to 27, I felt like it was the most

ZH: 但从 iOS 26 到 27，我感觉这是最

### slippery-slop:0158 · 10:46.540 → 10:49.420

EN: boring iOS release.

ZH: 无聊的一次 iOS 更新。

### slippery-slop:0159 · 10:50.760 → 10:54.180

EN: Like, if anything, it's sort of the push against this in a way.

ZH: 某种程度上，它反倒像是在反驳这种说法。

### slippery-slop:0160 · 10:55.080 → 10:57.220

EN: I mean, I don't think that's bad, actually.

ZH: 其实我不觉得这是坏事。

### slippery-slop:0161 · 10:57.440 → 11:03.620

EN: I don't want a Cambrian explosion of new features and the home of Simpsons car, right?

ZH: 我不想看到功能像寒武纪大爆发一样疯长，最后做出荷马·辛普森那辆车。

### slippery-slop:0162 · 11:03.620 → 11:10.040

EN: But then I must wonder, does the additional resources that you have through agentic coding just ensure that

ZH: 但这样我就得问：agent 编程带来的额外资源，是否至少能确保

### slippery-slop:0163 · 11:10.040 → 11:11.700

EN: whatever you push out has higher quality?

ZH: 交付出来的东西质量更高？

### slippery-slop:0164 · 11:12.740 → 11:14.160

EN: I would like to think so.

ZH: 我希望如此。

### slippery-slop:0165 · 11:14.380 → 11:17.660

EN: I personally would like to use agents in a way where I can say,

ZH: 我个人希望这样使用 agent：

### slippery-slop:0166 · 11:17.660 → 11:22.620

EN: okay, my velocity is kind of the same, but everything I release is actually of higher quality,

ZH: 交付速度大致不变，但发布的每样东西质量都更高，

### slippery-slop:0167 · 11:22.620 → 11:25.340

EN: even if the quantity stays kind of the same.

ZH: 即便数量基本一样。

### slippery-slop:0168 · 11:25.720 → 11:29.660

EN: That would be the goal for me when using agentic engineering tools.

ZH: 这才是我使用 agent 工程工具想达到的目标。

### slippery-slop:0169 · 11:29.660 → 11:35.840

EN: But I'm not sure if you're seeing that either, if you look at companies with their 999s going into the

ZH: 但我也不知道有没有改善。看看这些公司的可用性指标，原来的几个九……

### slippery-slop:0170 · 11:35.840 → 11:38.700

EN: 9100 territory.

ZH: ［此处可用性数字转写不清，待回听］

### slippery-slop:0171 · 11:40.120 → 11:43.380

EN: I think where you see it a little bit in terms of,

ZH: 我觉得在质量方面，可能有一点体现，

### slippery-slop:0172 · 11:43.380 → 11:49.840

EN: like, quality, presumably, like, depending on how you look at this, is that software should become more secure because we are having

ZH: 当然也取决于你怎么看：软件应该更安全了，因为我们不得不

### slippery-slop:0173 · 11:49.840 → 11:51.540

EN: to work on all of the security reports.

ZH: 处理所有这些安全报告。

### slippery-slop:0174 · 11:52.380 → 11:52.460

EN: Right?

ZH: 对吧？

### slippery-slop:0175 · 11:52.560 → 11:54.000

EN: And I think, like...

ZH: 而且我觉得……

### slippery-slop:0176 · 11:54.000 → 11:57.780

EN: Well, that's not happening, I can tell you from first-hand experience.

ZH: 但并没有。我可以用亲身经历告诉你。

### slippery-slop:0177 · 11:57.780 → 12:00.220

EN: It's definitely not more secure.

ZH: 它绝对没有更安全。

### slippery-slop:0178 · 12:01.660 → 12:06.260

EN: But it's also riskier to be on the internet now with software.

ZH: 但现在把软件放到互联网上，风险确实也更高了。

### slippery-slop:0179 · 12:07.460 → 12:11.720

EN: One of our colleagues, like, he's a little bit more now worried about,

ZH: 我们有个同事，现在更担心

### slippery-slop:0180 · 12:11.720 → 12:17.680

EN: like, smart contracts and crypto wallets just because they have become such attractive targets for

ZH: 智能合约和加密钱包了，因为它们已经成了

### slippery-slop:0181 · 12:17.680 → 12:21.060

EN: automated security research.

ZH: 自动化安全研究特别有吸引力的目标。

### slippery-slop:0182 · 12:21.060 → 12:25.100

EN: But,

ZH: 不过，

### slippery-slop:0183 · 12:25.100 → 12:30.400

EN: I mean, there are definitely certain areas where, like, on average,

ZH: 我觉得确实有一些领域，平均来说，

### slippery-slop:0184 · 12:30.400 → 12:34.300

EN: like, there should be more fixes going into, like, curl is a good example,

ZH: 应该修掉了更多问题。curl 就是个很好的例子，

### slippery-slop:0185 · 12:34.300 → 12:35.240

EN: or, like, other software.

ZH: 还有其他软件。

### slippery-slop:0186 · 12:35.320 → 12:36.240

EN: This is really, really old.

ZH: 这些软件已经存在非常久了。

### slippery-slop:0187 · 12:36.240 → 12:40.780

EN: So, they got a lot more valid security reports, so they fixed them.

ZH: 它们收到了更多有效的安全报告，于是修复了这些问题。

### slippery-slop:0188 · 12:40.980 → 12:46.860

EN: So, like, in general, curl is probably safer now than it ever was.

ZH: 总体来说，curl 现在可能比以往任何时候都安全。

### slippery-slop:0189 · 12:47.260 → 12:49.840

EN: And it doesn't slop a ton of new features into it.

ZH: 而且它也没有往里面塞一大堆粗糙的新功能。

### slippery-slop:0190 · 12:50.480 → 12:55.560

EN: But also, the risk profile just went up simultaneously because of the same thing that...

ZH: 但与此同时，同样的原因也提高了整体风险……

### slippery-slop:0191 · 12:55.560 → 13:00.640

EN: And that is the problem, because the security patches still take humans to verify and apply.

ZH: 问题就在这里：安全补丁仍然要靠人来验证和应用。

### slippery-slop:0192 · 13:01.620 → 13:06.020

EN: But finding the security vulnerabilities is now, like, 100x easier.

ZH: 可发现漏洞，现在却容易了一百倍。

### slippery-slop:0193 · 13:06.320 → 13:12.740

EN: I literally just had my clanker kind of try to break the DRM of one of my old

ZH: 我刚让我的“铁皮脑袋”试着破解一个老产品的

### slippery-slop:0194 · 13:12.740 → 13:14.380

EN: products, and it just did it.

ZH: DRM，结果它就真做到了。

### slippery-slop:0195 · 13:14.840 → 13:17.780

EN: It just, like, without intervention from my end.

ZH: 完全没用我干预。

### slippery-slop:0196 · 13:17.780 → 13:20.860

EN: So, yeah, interesting times.

ZH: 所以，真是个有意思的时代。

## 2026-09-06 · 改变 harness，保留你的工作方式

Change the harness, keep your workflow

原帖：https://x.com/pidotdev/status/2096561549356007547

视频：https://video.twimg.com/amplify_video/2096541993413554176/vid/avc1/1920x1080/xrjSoKFsV3bArcSC.mp4?tag=29

共 46 条字幕。

### harness-and-workflow:0001 · 00:00.000 → 00:02.520

EN: That's also how I think a coding harness should be.

ZH: 我认为编程 harness 也应该是这样。

### harness-and-workflow:0002 · 00:03.020 → 00:05.080

EN: Like, he has a different workflow than I have.

ZH: 比如，他的工作流就跟我的不一样。

### harness-and-workflow:0003 · 00:05.520 → 00:11.620

EN: And I want my coding harness with my agent, so to speak, to work according to his workflow.

ZH: 我可不希望自己的编程 harness 和 agent 非得按他的工作流来运作。

### harness-and-workflow:0004 · 00:11.740 → 00:13.380

EN: Because that would be terrible. I hate his workflow.

ZH: 那太糟糕了。我讨厌他的工作流。

### harness-and-workflow:0005 · 00:14.280 → 00:20.720

EN: So Pi is also a self-modifying, self-healing kind of harness, where the agent can write me ad hoc tools,

ZH: 所以 Pi 也是一种能自我修改、自我修复的 harness，agent 可以按需帮我写工具。

### harness-and-workflow:0006 · 00:20.720 → 00:27.060

EN: and in the same session I can reload the updated version of that, and it sees if it fixed it or if it wrote it the correct

ZH: 在同一个会话里，我就能重载更新后的版本，让它检查有没有修好、写得对不对，

### harness-and-workflow:0007 · 00:27.060 → 00:27.760

EN: way and so on.

ZH: 诸如此类。

### harness-and-workflow:0008 · 00:27.780 → 00:29.280

EN: And I can give feedback immediately.

ZH: 我也能马上给出反馈。

### harness-and-workflow:0009 · 00:29.420 → 00:29.980

EN: And I...

ZH: 而且我……

### harness-and-workflow:0010 · 00:30.000 → 00:35.740

EN: What I think is, like, what is really fascinating to see, like, how Pi works is that the system prompt is tiny.

ZH: 我觉得 Pi 特别有意思的一点，是它的系统提示词非常短。

### harness-and-workflow:0011 · 00:36.260 → 00:38.400

EN: I think it's under 1,000 tokens. I'm actually not sure.

ZH: 我记得不到 1,000 token，不过不太确定。

### harness-and-workflow:0012 · 00:38.660 → 00:44.120

EN: And 25%, I guess, of the system prompt is the manual for Pi to read its own manual.

ZH: 其中大概有四分之一，是在告诉 Pi 如何阅读自己的使用手册。

### harness-and-workflow:0013 · 00:44.640 → 00:50.920

EN: And so when I tell it, like, hey, we need to build this thing, it, like, I don't have to tell it what Pi is.

ZH: 所以我跟它说“我们要做这个东西”时，不用先解释 Pi 是什么。

### harness-and-workflow:0014 · 00:50.960 → 00:52.980

EN: It's sort of like, oh, here are some examples to read this, right?

ZH: 它就会知道：“哦，这里有些例子，可以先读一下。”

### harness-and-workflow:0015 · 00:53.020 → 00:58.160

EN: And so it's building its own tools, and it understands how to build these tools to be hot reloadable too.

ZH: 它会自己构建工具，也知道怎样让这些工具支持热重载。

### harness-and-workflow:0016 · 00:58.160 → 00:59.520

EN: It's just really interesting.

ZH: 这真的很有意思。

### harness-and-workflow:0017 · 00:59.900 → 01:02.040

EN: A Pi extension can bring up UI, right?

ZH: Pi 扩展还可以调出界面，对吧？

### harness-and-workflow:0018 · 01:02.120 → 01:06.180

EN: And so I have a custom review command that works exactly like I want the review to be.

ZH: 我有个自定义审查命令，完全按我想要的方式做代码审查。

### harness-and-workflow:0019 · 01:06.240 → 01:07.980

EN: Like, it looks exactly for the things that I want.

ZH: 它只检查我关心的那些东西。

### harness-and-workflow:0020 · 01:08.340 → 01:11.940

EN: But I don't have to tell it, like, hey, please review the change versus the main branch.

ZH: 而且不用每次都跟它说：“请审查相对于主分支的修改。”

### harness-and-workflow:0021 · 01:12.280 → 01:13.200

EN: It's kind of like, hey, review.

ZH: 我只要说：“审查一下。”

### harness-and-workflow:0022 · 01:13.380 → 01:16.080

EN: And then it comes up a menu that's like, okay, how do you want me to review it?

ZH: 它就弹出一个菜单，问：“你想让我怎么审查？”

### harness-and-workflow:0023 · 01:16.080 → 01:18.020

EN: Is it, like, uncommitted changes?

ZH: 看还没提交的修改？

### harness-and-workflow:0024 · 01:18.320 → 01:19.780

EN: Is it as a single commit?

ZH: 还是看某一次提交？

### harness-and-workflow:0025 · 01:19.980 → 01:21.400

EN: Is it a commit against the main thing?

ZH: 还是跟主分支比较？

### harness-and-workflow:0026 · 01:22.020 → 01:24.480

EN: And it's UI that sort of auto-populates.

ZH: 这些选项会自动填到界面里。

### harness-and-workflow:0027 · 01:24.840 → 01:30.240

EN: And if I don't like how it behaves, then I go to Pi and say, like, hey, actually, I keep doing this and this.

ZH: 如果我不喜欢它的行为，就跟 Pi 说：“我总是在重复这些操作。”

### harness-and-workflow:0028 · 01:30.320 → 01:32.040

EN: Can we have a custom UI component for it?

ZH: 能不能专门做个界面组件？

### harness-and-workflow:0029 · 01:32.080 → 01:34.040

EN: And it will just appear magically in the thing.

ZH: 然后它就像变魔术一样出现在里面了。

### harness-and-workflow:0030 · 01:34.660 → 01:36.180

EN: And that, to me, is really the interesting part.

ZH: 对我来说，这才是最有意思的部分。

### harness-and-workflow:0031 · 01:36.280 → 01:41.340

EN: It's like it becomes super malleable and adjusts to that without me having to jump for hoops.

ZH: 它变得特别容易定制，能适应我的需要，不用我绕一大圈。

### harness-and-workflow:0032 · 01:41.340 → 01:47.260

EN: Like, the Claude Code team has released a new to-do tool, like, a couple of days ago.

ZH: 比如，Claude Code 团队前几天刚发布了一个新的待办工具。

### harness-and-workflow:0033 · 01:48.280 → 01:52.940

EN: Armin rebuilt that as an extension to buy Pi in, what was it?

ZH: Armin 把它重新做成了 Pi 扩展，花了多久来着？

### harness-and-workflow:0034 · 01:53.020 → 01:53.340

EN: I don't know.

ZH: 我也说不准。

### harness-and-workflow:0035 · 01:53.760 → 01:54.540

EN: An hour?

ZH: 一个小时？

### harness-and-workflow:0036 · 01:55.020 → 01:55.200

EN: Yeah.

ZH: 对。

### harness-and-workflow:0037 · 01:55.200 → 01:55.400

EN: Something.

ZH: 差不多吧。

### harness-and-workflow:0038 · 01:55.940 → 02:02.120

EN: So I don't have to wait for my coding harness producer or vendor to add a feature I need for my workflow.

ZH: 所以，我不用等编程 harness 的厂商把我工作流需要的功能加进来。

### harness-and-workflow:0039 · 02:02.260 → 02:03.440

EN: I just tell Pi, build me this.

ZH: 我直接跟 Pi 说：“帮我做这个。”

### harness-and-workflow:0040 · 02:03.440 → 02:04.200

EN: You just add it.

ZH: 直接加上就行。

### harness-and-workflow:0041 · 02:04.940 → 02:09.940

EN: It reads for documentation, which is just marked on files with examples and API descriptions.

ZH: 它会读文档，也就是包含示例和 API 说明的 Markdown 文件。

### harness-and-workflow:0042 · 02:09.940 → 02:11.760

EN: And then it builds the thing for me.

ZH: 然后帮我把东西做出来。

### harness-and-workflow:0043 · 02:12.560 → 02:15.160

EN: And I think that has value, at least as an experiment.

ZH: 我觉得这有价值，至少作为一种实验是这样。

### harness-and-workflow:0044 · 02:16.100 → 02:16.780

EN: Yeah, yeah.

ZH: 对，对。

### harness-and-workflow:0045 · 02:17.160 → 02:19.780

EN: Also, I got Doom running that way, so that's nice.

ZH: 而且，我还用这种方式把 Doom 跑起来了，挺好。

### harness-and-workflow:0046 · 02:19.780 → 02:19.900

EN: Yeah.

ZH: 对。
