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
- 无数据库、服务端函数或运行时密钥需求。
- `.vercel/`、`site/dist/`、依赖与本地截图不纳入版本控制。
- 正式域名为 `piindex.dev`，DNS 托管在 Cloudflare，记录需设为 DNS only（关闭 CF 代理）供 Vercel 签发证书。canonical、OG 链接、sitemap 与 hreflang 均由 `site/astro.config.mjs` 的 `site` 派生；`site/public/robots.txt` 指向 `sitemap-index.xml`（由 `@astrojs/sitemap` 生成）。

分支验证通过后再合入 `main`。后续只需通过 PR 修改 README，合并后 Vercel 即会重新生成网站。

## 访问统计

网站通过 `@vercel/analytics/astro` 接入 Vercel Web Analytics，在每个页面加载一次：目录使用 `Directory.astro`，分类、详情与专题使用共享 `EditorialPage.astro`。英文 `/` 和中文 `/zh/` 分别记录浏览量，可在 Vercel 控制台查看访客、浏览量、来源、国家/地区和设备等基础数据。

首次启用时，在 Vercel 的 **awesome-pi** 项目（域名 `awesome-pi-list.vercel.app`）中进入 **Analytics**，点击 **Enable**（如果尚未启用），然后重新部署包含此改动的版本。部署后访问网站，再到 Analytics 查看数据；仅安装包和本地验证不会使线上统计生效。

开发服务器使用 SDK 的开发模式，不发送正式统计数据；生产构建使用正式统计脚本。已接入 `command_copied` 与 `repo_clicked` 自定义事件；复制仅在剪贴板写入成功后计数，字段包含完整资源名、语言和页面来源，仓库点击另含 github/npm 目的地。徽章复制、站内导航和 TypeSafe 官网入口不计插件转化。自定义事件需要 Pro 或 Enterprise；2026-09-21 查询项目仍为 Hobby，需要用户自行处理套餐。

接入和排查步骤见 [Vercel Web Analytics 官方指南](https://vercel.com/docs/analytics/quickstart)。

## 视觉验收

交付时在真实浏览器中检查英文、中文、搜索、分类、复制结果、分享链接与空结果状态。至少检查桌面和手机尺寸，确认没有页面横向溢出，并提供截图。截图保存在被 Git 忽略的 `output/playwright/`。


## 指南、专题与稳定地址

- 发布注册表：`site/src/data/published-routes.json`；只有 active 包获得目录详情入口，Jev 候选不会自动生成详情页。
- 编辑内容：`site/src/data/categories/`、`packages/`、`topics/` 的双语 JSON；资源基础信息继续复用 catalog。
- active 包从目录取最新数据，整条记录缺失时用归档；deprecated 保留历史页面和替代提示；redirected 在 `vercel.json` 配置双语永久跳转，避免生成客户端刷新页。
- 更新或更名时同步 canonicalName、slug、归档快照与内容文件。改名登记后，产物验收会检查双语永久重定向和目标路由。
- 分类筛选继续用 `data-category`；页面导航独立使用 guide/package/topic-link，保持原生链接行为。
- 徽章仅为 active 包生成：`/badge/<slug>.svg`；Jev 专题不获得包徽章。
- `validate` 包括 catalog、交互、统计、生命周期、SVG 端点和静态产物测试。产物检查遍历实际发布页与内链，另验证唯一 h1、canonical、hreflang 及 Analytics。
- 生产部署成功后，IndexNow 工作流读取线上 sitemap 提交全部页面，不再只提交两个首页。
