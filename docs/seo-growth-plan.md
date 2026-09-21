# Pi Index SEO 与自然增长实施规划 (SEO & Growth Plan)

> **目标**：在 60 天内将站点 Ahrefs DR 从 2 提升至 20+，扩充搜索引擎索引面（从 2 个页面扩充至 250+ 独立页面），确立 Pi Index 作为 Pi Coding Agent 生态第一聚合入口（Topical Authority），并承接 AI 搜索引擎（Perplexity、ChatGPT Search 等）的核心推荐流量。

---

## 一、 核心现状诊断与破局策略

### 1. 为什么当前 DR 仅为 2 且流量受限？
- **索引表面积极小（Surface Area Deficit）**：目前整站仅有 `/` 与 `/zh/` 两个独立 URL。所有的分类筛选（`?category=...`）和 100+ 个 Package 全靠客户端 JS 渲染，且 `canonical` 统一指回根目录，导致搜索引擎无法抓取任何具体插件或分类作为独立落地页。
- **长尾搜索无法承接**：开发者搜索 `pi-web-access`、`pi subagents`、`pi install context-mode` 或 `pi coding agent mcp adapter` 时，缺少对应的独立页面匹配搜索意图。
- **缺乏反向外链机制**：没有给被收录的开源作者提供回链理由（如 GitHub Badge），没有主动打通官方仓库或开发者聚合社区。

### 2. 为什么该赛道竞争难度极低（KD < 15）？
- **生态处于爆发初期**：Pi（`pi.dev` / `earendil-works/pi`）作为极简极客风格的终端 AI Coding Harness，生态快速增长，但除了官方裸文档和散落的 GitHub 仓库外，**全网没有任何系统化的第三方结构化扩展索引站**。
- **内容具有天然独占性**：拥有最完整的中英双语翻译、GitHub/npm 动态数据（Star/周下载量）、一键安装命令与分类归纳。

---

## 二、 页面与路由架构规范 (Architecture Spec)

其他开发 Agent 请按照以下规范扩展 Astro 页面与静态生成逻辑。

```
site/src/pages/
├── index.astro                     # 英文首页（目录大盘）
├── zh/index.astro                  # 中文首页（目录大盘）
├── categories/
│   └── [slug].astro                # 英文分类独立落地页 (如 /categories/subagents/)
├── zh/categories/
│   └── [slug].astro                # 中文分类独立落地页 (如 /zh/categories/subagents/)
├── packages/
│   └── [id].astro                  # 英文插件详情页 (如 /packages/pi-web-access/)
├── zh/packages/
│   └── [id].astro                  # 中文插件详情页 (如 /zh/packages/pi-web-access/)
├── badge/
│   └── [id].svg.ts                 # 动态/静态 SVG 徽章生成端点 (Featured on Pi Index)
```

---

## 三、 具体页面技术实现规范 (Page Implementation Specs)

### 1. 分类独立落地页 (`categories/[slug].astro` / `zh/categories/[slug].astro`)

- **数据源**：从 `createCatalog` 获取所有类别，`getStaticPaths` 为每个 `category.id` 生成路由。
- **SEO 核心标签**：
  - `Title (EN)`: `{Category Name} Packages for Pi Coding Agent — Pi Index`
  - `Title (ZH)`: `{中文分类名} 扩展包精选 - Pi Coding Agent 插件目录 | Pi Index`
  - `Description (EN)`: `Discover the best {Category Name} packages and extensions for Pi Coding Agent. View install commands, GitHub stars, and weekly npm downloads.`
  - `Description (ZH)`: `浏览精选的 Pi Coding Agent {中文分类名} 扩展与工具。查看一键安装命令、GitHub Star 数和 npm 每周下载量。`
  - `Canonical`: `https://piindex.dev/categories/{category.id}/` (ZH: `.../zh/categories/{category.id}/`)
- **页面内容区块**：
  1. **面包屑导航**：`Home > Categories > {Category Name}`
  2. **分类导语与大标题 (H1)**：突出分类用途与收录资源总数。
  3. **分类专属资源列表**：复用现有的卡片展示逻辑，支持即时安装命令复制。
  4. **相关分类推荐（横向内链）**：引导用户探索相邻分类（如 MCP Adapter 链接到 Dev Tools）。
- **结构化数据 (JSON-LD)**：
  - `@type: "CollectionPage"` 与 `@type: "ItemList"`，输出该分类下所有扩展的名称与 URL。

---

### 2. 插件详情落地页 (`packages/[id].astro` / `zh/packages/[id].astro`)

每个收录的资源均生成独立的富媒体详情页，作为长尾搜索的直接承接页。

- **数据源**：`catalog.resources` 中的每一项，匹配 `stats.json` 中的数据。
- **SEO 核心标签**：
  - `Title (EN)`: `{Package Name} — Pi Coding Agent Extension | Pi Index`
  - `Title (ZH)`: `{Package Name} - Pi Coding Agent 扩展安装与介绍 | Pi Index`
  - `Description`: 精准截取资源中英文描述，末尾拼接 `Learn how to install and use {name} with Pi Coding Agent.`
  - `Canonical`: `https://piindex.dev/packages/{resource.id}/`
- **页面核心模块（自上而下）**：
  1. **面包屑 (Breadcrumbs)**：`Home > Packages > {Kind} > {Package Name}`
  2. **插件 Header**：
     - H1：`{Package Name}`
     - 来源标签（npm / GitHub）与所属分类标签（带链接可跳回分类页）
     - 活跃度指标徽章：GitHub Stars、npm 周下载量与增长趋势（▲/▼）
  3. **一键安装核心区 (Hero Install Card)**：
     - 命令框：`pi install {npm:xxx | git:xxx}`，支持一键点击复制
     - 提示文案：告知如何在 Pi CLI 终端中运行
  4. **扩展详细介绍与特性说明**：
     - 完整的中英文描述
     - 外部链接：直接跳转至原始 GitHub 仓库 / npm 页面
  5. **“Featured on Pi Index” 徽章代码提取框（外链抓手！）**：
     - 引导插件作者挂在他们的 README 顶部：
       ```markdown
       [![Featured on Pi Index](https://piindex.dev/badge/{resource.id}.svg)](https://piindex.dev/packages/{resource.id})
       ```
     - 提供一键复制代码和实时 SVG 预览
  6. **同类替代与推荐 (Similar Extensions / Related)**：
     - 算法：同分类下的 3~4 个其他扩展推荐卡片
     - 作用：构建紧密的站内纵向/横向网状内链（Internal Mesh Linking），提升爬虫抓取深度与页面权重传递。
- **结构化数据 (JSON-LD)**：
  ```json
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "{Package Name}",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Cross-platform",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "{Description}",
    "url": "{resource.url}"
  }
  ```

---

### 3. SVG 徽章服务 (`site/src/pages/badge/[id].svg.ts`)

- **功能**：由 Astro API Route 静态或动态输出符合 Shields.io 风格的 SVG 矢量图。
- **内容设计**：
  - 左侧灰色：`Pi Index`
  - 右侧绿色/蓝色：`Featured` 或展示实时 `★ {stars}`
- **缓存策略**：设置 `Cache-Control: public, max-age=86400, s-maxage=604800`，减轻服务端压力并加速 GitHub 渲染。

---

### 4. 站点级 SEO 增强与内链打通

1. **首页内链改造**：
   - 当前首页的插件卡片标题链接只跳到了外部 GitHub (`resource.url`)。
   - **改造要求**：卡片标题增加进入详情页的站内链接（或卡片内提供“查看详情页”入口），既保持外链可达，又将首页的巨大权重分流至所有详情页与分类页。
2. **Sitemap 自动更新**：
   - 确保 `site/astro.config.mjs` 中的 `@astrojs/sitemap` 能够自动扫描并包含所有生成的分支路由（200+ URL）。
3. **针对 AI 搜索引擎的 `llms.txt` (GEO 建设)**：
   - 在 `site/public/llms.txt` 提供标准的站点清单，包含 Pi 生态总览、分类导航与前 30 高星插件索引。
   - 在 `site/public/llms-full.txt` 中提供包含所有 Package 安装命令的轻量 Markdown 文档，供 Perplexity、ChatGPT、Claude 抓取并作为标准引用源。

---

## 四、 外链与 DR 突破执行方案 (Off-Page SEO & Backlinks Playbook)

DR 突破的关键是获取具有真实权威度的**外部独立引荐域名（Referring Domains）**。以下是 4 个低阻力执行方案：

### 1. 开源作者“挂徽章”计划 (The Badge Outreach Engine)
- **目标**：为前 30 个高热度扩展作者（如 `pi-web-access`, `pi-subagents`, `rpiv-web-tools`）提 PR 或 Issue。
- **沟通模版 (GitHub Issue / PR Template)**：
  ```markdown
  Title: Added {Package Name} to Pi Index directory + badge

  Hi @{author},

  We've featured `{Package Name}` in the community directory [Pi Index](https://piindex.dev/packages/{id}), which tracks weekly npm downloads and GitHub stars to help Pi developers discover packages.

  If you'd like to showcase this in your README, feel free to include the badge:
  [![Featured on Pi Index](https://piindex.dev/badge/{id}.svg)](https://piindex.dev/packages/{id})

  Thanks for building for the Pi ecosystem!
  ```
- **预期成果**：只要有 10~15 位作者合并，即可从 GitHub（DR 98）获得多条高质量反向链接，并在后续克隆站、抓取站中产生长尾连锁外链效应。

### 2. Pi 官方与上游代码库整合
- 向 `earendil-works/pi` 提交 PR 或在 Discussions 留言：
  - 在官方文档的 `docs/packages.md` 或 README 的 "Community & Ecosystem" 章节增加：`[Pi Index](https://piindex.dev) - Community package directory and search`.
- 在 Pi 官方 Discord 或开发者群组中活跃分享精选清单。

### 3. 双语开发者社区种子内容宣发
| 渠道 | 目标受众 | 选题方向 |
| :--- | :--- | :--- |
| **Hacker News (Show HN)** | 全球极客/终端控 | *Show HN: Pi Index – A curated directory for the minimalist Pi Coding Agent* |
| **Reddit (r/LocalLLaMA, r/commandline)** | 本地大模型 & 终端开发者 | *Supercharge your Pi Agent: Top 10 community extensions for subagents & web search* |
| **V2EX (程序员/分享发现)** | 国内第一批极客尝鲜者 | 《给极简终端 AI 编程助手 Pi 做了一个扩展导航：piindex.dev》 |
| **掘金 / 知乎** | 国内前沿开发者与架构师 | 《告别臃肿 IDE：Pi Coding Agent 生态全景与核心扩展横评》 |

### 4. 开发者导航与产品聚合站提交
- 提交至：Product Hunt、DevHunt、Toolify.ai、AlternativeTo、SaaSHub、LibHunt。

---

## 五、 后续 Agent 执行任务清单 (Task Checklist)

请后续负责编码实现的 Agent 严格按照以下任务顺序落地：

- [ ] **Task 1: 辅助函数与数据层扩展** (`site/src/lib/catalog.ts`)
  - 确认每个 resource 均有规范的 slug / id 生成逻辑；
  - 导出辅助函数：`getRelatedResources(resource, limit = 4)`，用于推荐同类插件。
- [ ] **Task 2: 分类落地页开发**
  - 创建 `site/src/pages/categories/[slug].astro`
  - 创建 `site/src/pages/zh/categories/[slug].astro`
  - 接入 `CollectionPage` + `ItemList` JSON-LD 与多语言 canonical 标签。
- [ ] **Task 3: 插件详情落地页开发**
  - 创建 `site/src/pages/packages/[id].astro`
  - 创建 `site/src/pages/zh/packages/[id].astro`
  - 实现命令一键复制、相关推荐内链模块、徽章代码一键复制模块。
  - 接入 `SoftwareApplication` JSON-LD。
- [ ] **Task 4: SVG 徽章端点开发**
  - 创建 `site/src/pages/badge/[id].svg.ts`
  - 输出格式标准的 Shields.io 风格矢量徽章。
- [ ] **Task 5: 首页与全局内链打通**
  - 更新 `site/src/components/Directory.astro`，使卡片可以平滑导航至详情页与分类页。
- [ ] **Task 6: AI 友好文件部署**
  - 编写脚本或直接创建 `site/public/llms.txt`。
- [ ] **Task 7: 自动化测试用例校验**
  - 运行 `bun run --cwd site validate`，确保新增路由不破坏既有的一致性检查和测试规范。
