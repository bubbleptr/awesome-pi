# Jev 专题核验记录

核验日期：2026-09-21。范围为官网、仓库文档、源码与 npm 发行元数据，未使用用户 Key，未执行真实 Jev 请求，未将第三方插件安装到用户 Pi 环境。专题中四项证据状态均为 `source-reviewed`。

## 核验版本与目录归属

| 资源 | 目录分类 | 核验版本 / 提交 | 安装依据 |
| --- | --- | --- | --- |
| pi-fast-jev-compaction | Context Management | v0.1.0 / `679041b8511515c9a0fcebd617afebabd87ae7f6`，2026-09-18 | 候选作者 README 的 Git 安装命令 |
| pi-jev-code | Dev Tools & Code Intelligence | v0.5.2 / `6a6aa02e839e7953ab9fabb79e1cf247973e77c9`，2026-09-17 | 克隆后运行 `install.sh`，再用 Pi 安装本地路径 |
| pi-warden | Security & Permission | npm v0.28.4 / `725d05e3dd7e4d16d7c2dfba11d8cb9085144cad`，2026-09-19 | 已发布 npm 版本、发行 tarball 与对应 `gitHead` |
| pi-jev-model-router | Utilities | npm v0.3.0 / `5ca26ca1dac255252d9a83341dec0813301c8f97`，2026-09-21 | npm 发行 `gitHead` 与仓库一致 |

四项仍属功能分类，专题仅按资源名称引用 catalog，不新增 Jev 分类，也不自动发布四个包详情页。基础安装命令仅保存在两份 README 中；专题配置与依赖准备步骤放在编辑内容中。

## 影响选型的核验纠偏

1. **同名 npm 包不等于候选仓库。** [pi-fast-jev-compaction 0.2.0 的 npm 元数据](https://registry.npmjs.org/pi-fast-jev-compaction/0.2.0)指向 `ross-jill-ws`，而计划候选是 `QuentinDanblon`；本项目明确使用后者的 Git 安装命令。[候选安装说明](https://github.com/QuentinDanblon/pi-fast-jev-compaction/blob/679041b8511515c9a0fcebd617afebabd87ae7f6/README.md)
2. **pi-jev-code 没有可用的 npm 发布项。** 核验时注册表 `/pi-jev-code/latest` 返回 HTTP 404。README 与 `install.sh` 要求本地目录先安装运行依赖；目录中的安装路径是用户需要替换的占位路径。[安装脚本](https://github.com/KamilPostrozny/pi-jev-code/blob/6a6aa02e839e7953ab9fabb79e1cf247973e77c9/install.sh)
3. **pi-warden 的 main 超前于 npm。** main 清单为 0.33.3，npm latest 为 0.28.4。已下载 0.28.4 tarball 查阅编译实现，并根据 npm `gitHead` 读取对应源码与文档；专题不将 main 后续调整套用到发行包。[发行元数据](https://registry.npmjs.org/pi-warden/0.28.4)
4. **路由预算不是消费硬上限，预算字段仍会外发。** 本地策略按消费压力降档，不阻断任务。尽管任务问题要求模型忽略费用，实际 `buildState` 仍将消费累计、额度和预算压力连同工作目录、当前模型等字段发给 TypeSafe。[真实请求结构](https://github.com/da-vinci-noob/pi-jev-model-router/blob/5ca26ca1dac255252d9a83341dec0813301c8f97/extensions/pi-jev-model-router/jev.ts)
5. **确认模式的无界面行为不同。** 路由器没有选择器时 `confirm` 自动切换，纯观察应选 `notify`；Warden 在无界面时将 `confirm` 回退为 `steer`。[路由器实现](https://github.com/da-vinci-noob/pi-jev-model-router/blob/5ca26ca1dac255252d9a83341dec0813301c8f97/extensions/pi-jev-model-router/index.ts)、[Warden 配置](https://github.com/DevMortimer/pi-warden/blob/725d05e3dd7e4d16d7c2dfba11d8cb9085144cad/src/config.ts)
6. **失败不一定代表全部恢复原文或全部放行。** 裁剪器失败批次保持未评分，已有缓存判定仍可生效；配对校验失败才回退原始消息。Warden 默认 `failOpen` 不新增语义拦截，已有本地规则拦截仍保留。[裁剪器实现](https://github.com/QuentinDanblon/pi-fast-jev-compaction/blob/679041b8511515c9a0fcebd617afebabd87ae7f6/index.ts)、[Warden 故障分支](https://github.com/DevMortimer/pi-warden/blob/725d05e3dd7e4d16d7c2dfba11d8cb9085144cad/src/guard.ts)

## 效果证据边界

[TypeSafe 官方发布文](https://typesafe.ai/blog/introducing-system-one-models-and-jev)的模型性能数字没有作为四个插件的效果承诺。裁剪器的 31.8% / 37.7% 来自作者对两段截图密集会话的回放估算，包含特定缓存价格假设，不是本站实测。模型的结构化输出、编辑风险分数、Warden 判定均不能代替测试或证明安全。

## 本地校验

静态编辑数据免于为文字内容新增 TDD 测试。运行现有行为校验：

```text
$ cd site && bun test tests/catalog.test.ts
11 pass
0 fail
328 expect() calls
```

`python3 -m json.tool site/src/data/topics/jev.json` 与 `git diff --check` 均退出 0。页面渲染、双语路由和交互验证由全站发布验收覆盖。
