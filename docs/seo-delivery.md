# SEO 首批交付记录

实施日期：2026-09-21。范围为方案 V6 的 6 个主题、12 个双语独立 URL；不扩充第二批主题。

## 自动完成的工作

- 持久发布注册表与归档；已发布包缺失单语或双语记录时，首页、详情及构建验证均能回退。
- 12 个页面、首页入口、正确的 canonical / hreflang、每页一次 Analytics 初始化。
- 复制成功与原项目外跳事件，按 home/category/detail/topic 区分来源。
- 3 个包的 SVG 徽章和可复制 Markdown；专题候选不生成详情页或徽章。
- 逐项源码核验、固定版本证据与双语安装配置说明。未把源码查阅或作者数据标为实测。
- 生产部署后根据线上 sitemap 自动提交 IndexNow。

## 发布

[PR #29](https://github.com/bubbleptr/awesome-pi/pull/29) 已合并，生产源码提交为 `2d7aa57105b3b7905961140d5ed871429f48816b`。生产访问以 `https://piindex.dev/` 为准。2026-09-21 23:19（Asia/Shanghai）已核对全部 14 页 HTTP 200、唯一 h1、自指 canonical、三种 hreflang 和单次 Analytics；3 个徽章响应为 image/svg+xml，未知及专题徽章为 404，线上 sitemap 恰好包含 14 个 HTML URL。生产部署后的 IndexNow 工作流成功。

## 验证

命令：`bun run --cwd site validate`。55 项单元/交互/端点测试与 20 项静态产物测试通过，Astro 类型检查无错误；构建产生 14 个 HTML 页面（含原有两个首页）与 3 个 SVG。

另在隔离临时目录模拟：中文 pi-web-access 条目缺失、pi-mcp-adapter 双语条目同时缺失，运行相同完整验证命令。另已模拟 deprecated 页面与 redirected 旧名：历史页面保留废弃提示和替代入口，旧名验证双语永久跳转配置，不生成重复页面或徽章。桌面 1440px 与手机 390px 浏览器截图存放在本地 `output/playwright/seo-*.png`，不纳入仓库。

## 平台权限与人工事项

1. **转化统计历史状态（2026-09-21）**：当日 Vercel API 显示现有项目已启用 Web Analytics 且有访问数据，但套餐为 Hobby。按当时核对的[官方自定义事件文档](https://vercel.com/docs/analytics/custom-events)，自定义事件需要 Pro 或 Enterprise；当日没有购买、升级或更改账单。2026-09-22 已改为迁移到自托管 Plausible CE，不再需要为这两类事件升级 Vercel，迁移状态见下文。复制次数不能冒充安装次数。
2. **Google Search Console**：已使用现有浏览器登录核实 `sc-domain:piindex.dev` 已授权，无需用户重新登录或验证。现有 `https://piindex.dev/sitemap-index.xml` 于 2026-09-14 提交，2026-09-21 上次读取成功，发布前显示发现 2 个网页；可自动读取更新后的 sitemap，无需重复提交。发布前索引概述为 2 个已索引、15 个未索引，是历史基线，不是此次 12 个新 URL 的结果。IndexNow 接受和 sitemap 成功都不等于 Google 收录。
3. **作者挂载徽章**：只能由各项目维护者决定是否修改自己的 README；本次只提供代码，没有向作者发送消息。

## 统计迁移补记（2026-09-22）

网站端已替换为 Plausible Community Edition v3.2.1 自托管接入，保留 `command_copied`、`repo_clicked` 及原有 `package`、`locale`、`surface`、`destination` 属性。复制成功才计数，徽章复制、站内导航和 TypeSafe 官网入口仍不计插件转化；基础脚本不启用自动外链事件，避免重复计数。CE 支持现有自定义事件与属性，无需升级 Vercel 套餐。

配置中的公共采集源为 `https://events.piindex.dev`，私有仪表盘为 `https://stats.piindex.dev`，站点标识为 `piindex.dev`。服务位于独立 VPS，部署文档和私有配置由运维管理。[PR #30](https://github.com/bubbleptr/awesome-pi/pull/30) 已合并，生产源码提交为 `ba74d7aeece3b3bab44f3549c3be8598ba5bb26b`。2026-09-22 00:23（Asia/Shanghai）已核对 14 个线上 HTML 页面均为 200、各一次异步 Plausible 脚本、无 Vercel Insights 脚本，sitemap 保持 14 页；生产部署、CI 与 IndexNow 均成功。

网站端执行 `bun run --cwd site validate`，56 项单元/交互/端点测试和 20 项静态产物测试通过，类型检查为 0 错误、0 警告，仍生成 14 个 HTML 页面与 3 个 SVG。新增测试覆盖统计脚本尚未就绪时的事件队列。真实浏览器验证中，采集脚本请求持续挂起时，异步加载仍允许筛选与复制正常运行；截图为本地 `output/playwright/plausible-analytics-loading.png`。真实浏览器另直连公网采集源，独立 QA 站点的 `/public-browser-check/` 路径在 Stats API 中返回 1 次 pageview 和两个自定义事件各 1 次，四个属性完整；控制台无错误或警告，复制内容正确。未把测试转化写入正式站。公共域名只开放脚本与采集；仪表盘经 Cloudflare Tunnel 和 Access 邮箱白名单保护，owner 登录及两个目标配置已验收。这些是 2026-09-22 的迁移验证结果，不替换上文 2026-09-21 的生产验收与测试记录。

## 发布后 14 / 30 天复盘

从实际生产上线日起计时；统计迁移不重置 SEO 页面的观察期，未满观察期不能宣称完成收录或增长目标。已在本任务安排两次自动复盘：2026-10-05 与 2026-10-21，均为 Asia/Shanghai 10:00。复盘优先使用已有授权；结合 GSC 与 Plausible 数据，缺 GSC、采集异常或事件数据不足时明确列出缺口。迁移前后数据按实际覆盖日期说明，不将缺失事件视为零转化。

| 观察项 | 口径 |
| --- | --- |
| 收录 | 12 个新 URL 中至少 10 个 Indexed；查看 GSC 页面索引报告 |
| 查询 | 核心关键词的真实展示与点击；专题单独查看 typesafe ai、jev 与 Pi 组合词 |
| 转化 | command_copied / repo_clicked；Jev 只统计 surface=topic，不用首页事件替代 |
| 内容核验 | 核对候选新版本、安装包、API 行为与原证据是否变化 |
| 扩量 | 复盘为正向后再提出第二批 5–8 个主题；作者徽章不是硬门槛 |

资源与证据见 [原计划](seo-growth-plan.md)、[Jev 核验](jev-evidence.md)、[分类与插件核验](pilot-evidence.md)。
