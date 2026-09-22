# 静态资源目录

网站将仓库中已有的资源清单转换为可搜索、可筛选的静态目录。默认英文，`/zh/` 提供中文；搜索会同时匹配中英文介绍。

网站地址：<https://piindex.dev/>，中文入口：<https://piindex.dev/zh/>。`www.piindex.dev` 在 Vercel 侧 308 到裸域，旧域名 `awesome-pi-list.vercel.app` 通过 `vercel.json` 中的 `has` 规则 308 跳转到正式域名。

## 内容来源

- `README.en.md` 与 `README.md` 是资源基础信息的主要来源；已发布包缺失时使用注册表中的归档快照。添加或修改资源时，应同步更新两份文件。
- 构建时使用 Markdown AST 提取名称、项目链接、介绍、分类与安装命令，不需要维护额外的资源清单，构建本身不访问 npm 或 GitHub API。
- 资源卡片上的 GitHub Star 数与 npm 周下载量来自统计快照 `site/src/data/stats.json`（纳入版本控制）。快照由独立脚本 `bun run stats` 调用 GitHub 与 npm 公开 API 生成，`.github/workflows/stats.yml` 每周定时刷新并提交；构建只读取本地快照。
- 使用“名称 + 项目链接”识别资源。同一资源在不同分类出现时合并分类与介绍；同一仓库中的不同扩展保留为独立资源。
- 两种语言的名称、项目链接、分类及安装命令必须对应。除已发布包整条记录缺失可由归档补齐外，翻译冲突、重复行、安装命令不一致或无法解析的资源行会阻止构建，避免静默丢失内容。
- `Editor Integration` 兼容现有的三级标题。编辑器集成、主题、扩展和独立发行版分别展示。
- 资源链接须使用 HTTP 或 HTTPS。安装命令可省略；有命令时原样展示，网站只复制文本，不执行命令。
- 新增功能分类时，英文标题会自动成为分类；可在 `site/src/lib/i18n.ts` 中补充中文分类标签。

## 本地开发

在仓库根目录运行：

```sh
bun install --cwd site
bun run --cwd site dev
```

默认地址为 `http://127.0.0.1:4321/`。README 通过构建期原文导入参与页面生成，修改内容后可在开发环境刷新查看。

如需刷新资源卡片上的 Star 数与下载量统计，可运行（可选，需要网络；GitHub 数据通过 `GITHUB_TOKEN`、`GH_TOKEN` 或本机 `gh` 登录态提高限额）：

```sh
bun run --cwd site stats
```

完整验证：

```sh
bun run --cwd site validate
```

验证顺序为数据与交互测试、Astro 类型检查、静态构建、生成页面完整性检查。最后一项会核对两种语言中每项资源的名称、链接、完整介绍与安装命令。

构建产物位于 `site/dist/`。可使用以下命令预览：

```sh
bun run --cwd site preview
```

## 页面行为

- 搜索实时更新，多个关键词按“全部匹配”处理，忽略大小写。
- 搜索词保存在 `q` 参数，分类保存在 `category` 参数。例如 `/?q=browser&category=packages`。
- 语言切换保留搜索和分类，浏览器后退与前进会恢复筛选状态。
- 桌面端使用侧边分类，手机端使用原生选择器。较长介绍可以展开，长安装命令可横向滚动。
- JavaScript 不可用时，完整资源仍存在于静态 HTML 中，项目链接与介绍展开功能仍然可用。

## Vercel 部署

连接 `BubblePtr/awesome-pi` 仓库，使用仓库根目录作为 Vercel 的 Root Directory。网站代码仍位于 `site/`，根目录的 `vercel.json` 会进入该目录安装与构建，并发布 `site/dist/`。

部署根目录设在仓库根目录，是为了可靠地包含作为内容源的两份 README，避免在 Vercel 中额外开放子目录以外的文件。

- Framework Preset：Other，由 `vercel.json` 提供构建指令。
- 生产分支：`main`；功能分支用于预览部署。
- 构建指令运行完整验证，失败时阻止发布。
- 静态站点本身无数据库、服务端函数或运行时密钥需求；访问统计服务独立部署在 VPS。
- `.vercel/`、`site/dist/`、依赖与本地截图不纳入版本控制。
- 正式域名为 `piindex.dev`，DNS 托管在 Cloudflare，记录需设为 DNS only（关闭 CF 代理）供 Vercel 签发证书。canonical、OG 链接、sitemap 与 hreflang 均由 `site/astro.config.mjs` 的 `site` 派生；`site/public/robots.txt` 指向 `sitemap-index.xml`（由 `@astrojs/sitemap` 生成）。

分支验证通过后再合入 `main`。后续只需通过 PR 修改 README，合并后 Vercel 即会重新生成网站。

## 访问统计

2026-09-22 已切换到自托管 Plausible Community Edition v3.2.1。[PR #30](https://github.com/bubbleptr/awesome-pi/pull/30) 已合并并发布；14 个线上页面均只加载一次异步统计脚本。

站点标识为 `piindex.dev`，公共采集源为 `https://events.piindex.dev`，私有仪表盘入口为 `https://stats.piindex.dev`。统计服务部署在独立 VPS，部署文档、凭据和访问控制由运维管理。静态站点仍由 Vercel 托管。

仓库的中英文 README 顶部提供 Pi Index 网站徽章，图片源为 `site/public/pi-index-badge.svg`，同时发布到 `/pi-index-badge.svg`。README 使用仓库相对图片路径，点击分别进入中文、英文首页；推广参数统一为 `utm_source=github`、`utm_medium=referral`、`utm_campaign=readme`，`utm_content=badge-zh` / `badge-en` 区分入口。可在 Plausible 按这些 UTM 筛选访问与后续目标事件；图片加载本身不计为网站访问。此徽章是整个网站的入口，插件详情页原有的三个专属徽章保持独立。

所有徽章左侧统一使用与 `favicon.svg` 一致的绿色圆角 π 标识，以内嵌 SVG 显示为 16×16，左栏宽 24，整体高 20；右侧保留 Website 或插件名。SVG 的 `title` / `aria-label` 继续包含 Pi Index 品牌名。详情页声明的图片宽度须与生成的 SVG 一致，避免缩窄左栏后图片被拉伸。

目录页 `Directory.astro` 和分类、详情、专题共用的 `EditorialPage.astro` 各渲染一次本地 `Analytics.astro`。该组件异步加载基础 `/js/script.js`，由脚本记录当前页面浏览量；不启用自动外链统计，避免与显式仓库点击事件重复计数。异步加载使统计请求延迟时筛选、复制等页面交互仍可运行。`site/src/scripts/analytics.ts` 的统一 `track(window, name, properties)` 将属性传给 Plausible 的 `props`；脚本就绪前使用其兼容队列保存事件。Plausible 基础脚本默认忽略 localhost 与 127.0.0.1 的采集，本地验证不代表生产采集生效。

`command_copied` 与 `repo_clicked` 的语义保持不变：复制仅在剪贴板写入成功后计数，字段包含完整资源名 `package`、语言 `locale` 和页面来源 `surface`，仓库点击另含 `destination`（github/npm）。徽章复制、站内导航和 TypeSafe 官网入口不计插件转化。CE 自托管支持这些自定义事件和属性，不再需要升级 Vercel 套餐；复制次数仍不等于实际安装次数。

首页 Bento 的「查看专题 / 比较方案」入口单独记录 `guide_clicked`，属性为 `guide`（`jev`、`subagents`、`web-access-search`）、`locale`（`en` / `zh`）和 `placement`（`home_bento`）。仅在链接激活时记录一次，保留原生跳转与新标签打开行为；卡片正文、插图、悬停及「浏览全部资源」不计数。它表示对指南的兴趣，不是复制命令或安装插件。仪表盘在 **Goal conversions → guide_clicked** 查看，再按 **Properties → guide** 比较各指南，也可按 `locale` 区分语言。新增事件需同步配置 Plausible 站点目标和自定义属性。

2026-09-22 已为正式站追加 `guide_clicked` 目标及 `guide`、`placement` 可查询属性，保留原两个目标与四个属性，独立回查通过；配置过程未向正式站发送模拟事件。普通点击、键盘激活、修饰键及鼠标中键打开链接均纳入指南点击，右键菜单不计数。

部署验收已通过公共脚本、`/api/event`、真实浏览器采集与 Stats API 回读：独立测试站的同一路径记录 1 次页面浏览、两类自定义事件各 1 次，属性完整。私有入口要求 Cloudflare Access 邮箱白名单登录；Plausible owner 登录与两个目标的配置已核实。测试使用隔离站点，未写入正式站的转化数据。Google Search Console 和发布后 14/30 天复盘继续沿用 [SEO 交付记录](seo-delivery.md) 的口径，采集缺口必须明确记录。实现接口可核对 [CE v3.2.1 事件源码](https://github.com/plausible/analytics/blob/v3.2.1/tracker/src/track.js)。

## 视觉验收

交付时在真实浏览器中检查英文、中文、搜索、分类、复制结果、分享链接与空结果状态。至少检查桌面和手机尺寸，确认没有页面横向溢出，并提供截图。截图保存在被 Git 忽略的 `output/playwright/`。

2026-09-22 首页指南卡改版：`bun run --cwd site validate` 通过 56 项功能测试与 20 项产物测试，Astro 0 错误、0 警告。新增可访问名称必须包含可见链接文字的断言，先确认双语失败，再修正 CTA 名称并重跑通过。浏览器检查双语 1440 / 1024 / 768 / 390 / 320px，无页面溢出或文字裁剪；悬停动画单次结束，减少动态效果设置、键盘焦点、真实触摸模拟、指南导航及搜索条件随语言切换均通过。截图为 `output/playwright/guides-bento-*.png`，测试拦截采集域名，未写入正式站转化。


## 指南、专题与稳定地址

- 首页的「热门扩展选型指南」由 `DirectoryGuides.astro` 展示为 Bento 卡片：Jev 为主卡，分类指南为紧凑卡；文案随语言切换，入口仍以发布注册表为准。使用独立 CTA，卡片正文可选择复制；「浏览全部资源」可跳过指南区直达目录。
- `GuideIllustration.astro` 提供决策分流、子任务派发与网页来源三种装饰 SVG。仅支持精细指针悬停且未请求减少动态效果时播放一次，使用 transform / opacity；触摸与键盘操作不触发插图动画。禁止加入循环播放或动画运行依赖。
- 专题数据的 `resources` 用于完整比较与安装说明，`alternatives` 用于“更多实现”。Jev 专题采用 5 个主推、3 个补充实现；同名项目以作者区分，并与双语 README 中的资源名称完全一致。
- 发布注册表：`site/src/data/published-routes.json`；只有 active 包获得目录详情入口，Jev 候选不会自动生成详情页。
- 编辑内容：`site/src/data/categories/`、`packages/`、`topics/` 的双语 JSON；资源基础信息继续复用 catalog。
- active 包从目录取最新数据，整条记录缺失时用归档；deprecated 保留历史页面和替代提示；redirected 在 `vercel.json` 配置双语永久跳转，避免生成客户端刷新页。
- 更新或更名时同步 canonicalName、slug、归档快照与内容文件。改名登记后，产物验收会检查双语永久重定向和目标路由。
- 分类筛选继续用 `data-category`；页面导航独立使用 guide/package/topic-link，保持原生链接行为。
- 徽章仅为 active 包生成：`/badge/<slug>.svg`；Jev 专题不获得包徽章。
- `validate` 包括 catalog、交互、统计、生命周期、SVG 端点和静态产物测试。产物检查遍历实际发布页与内链，另验证唯一 h1、canonical、hreflang 及 Analytics。
- 生产部署成功后，IndexNow 工作流读取线上 sitemap 提交全部页面，不再只提交两个首页。
