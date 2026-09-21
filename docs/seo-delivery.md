# SEO 首批交付记录

实施日期：2026-09-21。范围为方案 V6 的 6 个主题、12 个双语独立 URL；不扩充第二批主题。

## 自动完成的工作

- 持久发布注册表与归档；已发布包缺失单语或双语记录时，首页、详情及构建验证均能回退。
- 12 个页面、首页入口、正确的 canonical / hreflang、每页一次 Analytics 初始化。
- 复制成功与原项目外跳事件，按 home/category/detail/topic 区分来源。
- 3 个包的 SVG 徽章和可复制 Markdown；专题候选不生成详情页或徽章。
- 逐项源码核验、固定版本证据与双语安装配置说明。未把源码查阅或作者数据标为实测。
- 生产部署后根据线上 sitemap 自动提交 IndexNow。

## 验证

命令：`bun run --cwd site validate`。55 项单元/交互/端点测试与 20 项静态产物测试通过，Astro 类型检查无错误；构建产生 14 个 HTML 页面（含原有两个首页）与 3 个 SVG。

另在隔离临时目录模拟：中文 pi-web-access 条目缺失、pi-mcp-adapter 双语条目同时缺失，运行相同完整验证命令。另已模拟 deprecated 页面与 redirected 旧名：历史页面保留废弃提示和替代入口，旧名验证双语永久跳转配置，不生成重复页面或徽章。桌面 1440px 与手机 390px 浏览器截图存放在本地 `output/playwright/seo-*.png`，不纳入仓库。

## 需要用户处理的部分

1. **转化统计套餐**：Vercel API 显示现有项目已启用 Web Analytics 且有访问数据，但套餐为 Hobby。按[官方自定义事件文档](https://vercel.com/docs/analytics/custom-events)，自定义事件需要 Pro 或 Enterprise。用户决定并自行处理付费套餐；本次没有购买、升级或更改账单。升级后用真实访问检查 command_copied 与 repo_clicked，不能用复制次数冒充安装次数。
2. **Google Search Console 授权与收录请求**：如果尚未验证 piindex.dev 资源，请由资源所有者完成验证，提交 `https://piindex.dev/sitemap-index.xml`，检查这 12 个新 URL。当前任务没有获得可用的 GSC 授权，不伪称已经提交 Google 或已经收录。IndexNow 提交不等于 Google 收录。
3. **作者挂载徽章**：只能由各项目维护者决定是否修改自己的 README；本次只提供代码，没有向作者发送消息。

## 发布后 14 / 30 天复盘

从实际生产上线日起计时；未满观察期不能宣称完成收录或增长目标。已在本任务安排两次自动复盘：2026-10-05 与 2026-10-21，均为 Asia/Shanghai 10:00。复盘优先使用已有授权；缺 GSC 或自定义事件数据时明确列出缺口，不代替用户授权或升级套餐。

| 观察项 | 口径 |
| --- | --- |
| 收录 | 12 个新 URL 中至少 10 个 Indexed；查看 GSC 页面索引报告 |
| 查询 | 核心关键词的真实展示与点击；专题单独查看 typesafe ai、jev 与 Pi 组合词 |
| 转化 | command_copied / repo_clicked；Jev 只统计 surface=topic，不用首页事件替代 |
| 内容核验 | 核对候选新版本、安装包、API 行为与原证据是否变化 |
| 扩量 | 复盘为正向后再提出第二批 5–8 个主题；作者徽章不是硬门槛 |

资源与证据见 [原计划](seo-growth-plan.md)、[Jev 核验](jev-evidence.md)、[分类与插件核验](pilot-evidence.md)。
