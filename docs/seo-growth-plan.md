# Pi Index SEO 与自然增长实施规划 (V2 精细化方案)

> **修订说明 (V2)**：放弃盲目、粗暴的“全量 200+ 插件页面铺开”模式，防止陷入 Google **“浅薄内容（Thin Content）”**惩罚与新站（DR 2）抓取配额阻断；全面转向**“核心分类深度选型指南（10~12 个垂直微百科） + 头部高热插件（Top 20~25 准入制）”**的高质量精细化打法。

---

## 一、 战略调整与设计哲学

### 1. 为什么坚决不做全量单包生成？
- **规避 Thin Content 惩罚**：原列表中大量小插件仅有 10~20 字的简介和一条安装命令。机械式生成独立页面无法提供“增量价值（Little or no added value）”，极易导致 Google 判定为低质页面，进而拉低全站权威度。
- **避免新站抓取预算阻断（Crawl Budget Bloat）**：DR 2 站点的抓取预算极为有限。盲目塞入 200+ URL 会在 Google Search Console 中积压大量“已发现 - 尚未编入索引”，稀释真正有价值页面的权重。
- **匹配真实搜索意图**：用户在 Google 搜索特定小插件（0 Star、个位数下载）的概率几乎为零；而高频搜索绝大多数集中在**分类选型词**（如 `pi subagents`、`pi mcp adapter`、`pi web access`）和**头部明星工具**（如 `pi-web-access`、`rpiv-web-tools`、`plannotator`）。

### 2. 核心打法：把分类页打造成“Pi 生态垂直选型微百科”
每一个核心分类落地页（如 `/categories/subagents/`）都不再是简单的卡片复制，而是一篇结构极其严密、包含**概念导读、横向对比表格、场景决策树、实操代码与 FAQ 结构化数据**的权威选型指南。

---

## 二、 页面分级规划与范围界定

全站将页面划分为 3 个梯队，稳步递进：

### 第一梯队：10~12 个核心分类落地页（最高优先级 ⭐⭐⭐⭐⭐）
**准入标准**：收录资源数量 $\ge 5$ 项，具有明确独立搜索意图的分类。
- **首批重点核心分类**：
  1. `subagents`（子代理，9 项）—— 核心热点，多代理编排
  2. `web-access-search`（网页与搜索，7 项）—— 装机必备网络获取工具
  3. `task-management`（任务管理，12 项）—— 计划与任务流
  4. `security-permission`（安全与权限，10 项）—— 执行拦截与安全沙箱
  5. `ui-enhancement`（界面增强，10 项）—— 终端状态栏与 TUI 美化
  6. `dev-tools-code-intelligence`（开发与代码智能，8 项）—— AST、LSP、调试工具
  7. `package-collections`（扩展合集，8 项）—— 社区优秀配置与打捆推荐
  8. `persistent-memory`（持久化记忆，5 项）—— 长期上下文与记忆知识库
  9. `context-management`（上下文管理，5 项）—— Token 压缩与滑动窗口优化
  10. `dark-themes`（深色主题，14 项）—— 终端高频美化
  11. `theme-packs`（主题合集，7 项）—— 多配色打包
- **低频分类处理原则**：对只有 1~2 项资源的分类（如 `MCP Adapter`、`Plan Mode`、`Loop Engineering`），**暂不单独生成独立页面**，避免产生空壳页；在分类导航中可保留筛选，或后续随着生态扩充再独立建页。

### 第二梯队：头部高热插件详情页（Top 20~25 准入制 ⭐⭐⭐⭐）
**准入标准**（满足任一条件即可建页）：
1. README 中带有 `🔥` 标识的重点推荐插件；
2. GitHub Stars $\ge 50$ 或 npm 每周下载量 $\ge 100$。
- **页面定位**：提供详细的特性介绍、源码直达、安装代码与 **“Featured on Pi Index” 徽章代码提取框**（作为换取 GitHub README 外链的核心载体）。

### 第三梯队：全球索引文件与 AI 搜索接入（GEO / LLMO ⭐⭐⭐⭐）
- `/public/llms.txt` 与 `/public/llms-full.txt`：为 Perplexity、ChatGPT Search 等提供权威引用的结构化文本。

---

## 三、 核心分类落地页具体实现规范 (Category Guide Specs)

这是本阶段工作量最核心、SEO 价值最高的部分。

### 1. 数据架构：解耦内容与展示 (`site/src/data/categories/`)
为避免将大段文本写死在 Astro 组件中，在 `site/src/data/categories/` 目录下为每个核心分类创建元数据配置文件（如 `subagents.json` 或 `.ts`）：

```typescript
export interface CategoryGuideData {
  id: string; // 对应 catalog 中的 category id
  intro: {
    en: string; // 200~300 词的概念科普与机制介绍
    zh: string;
  };
  comparison: {
    en: { name: string; highlight: string; features: string[] }[];
    zh: { name: string; highlight: string; features: string[] }[];
  };
  recommendations: {
    en: { scenario: string; recommendedPackage: string; reason: string }[];
    zh: { scenario: string; recommendedPackage: string; reason: string }[];
  };
  faqs: {
    en: { question: string; answer: string }[];
    zh: { question: string; answer: string }[];
  };
}
```

### 2. 页面 5 大核心模块（自上而下）

#### 模块 1：概念科普与运行机制 (Hero & Concept)
- 讲解 Pi 核心 Harness 如何通过 Package 注入该能力，解释其底层原理。
- 覆盖高价值 LSI 关键词（如多 Agent 委托、Worktree 隔离、上下文损耗等）。

#### 模块 2：横向对比速查表 (Feature Comparison Table) 🔥
- 渲染标准 HTML `<table>`。
- 列项：**扩展名称** | **关键特性/实现机制** | **支持的 Provider / 依赖** | **Stars / 周下载** | **安装命令**
- **作用**：捕获 Google 搜索结果第 0 位的**“精选摘要 (Featured Snippets)”**，并成为 Perplexity 等 AI 的首选数据源。

#### 模块 3：场景选型决策指南 (Which One to Choose?)
- 针对常见开发者场景给出 3~4 条明确建议。
- 例：*“如果你需要 Git 隔离的多后台 Agent：选 `@tintinweb/pi-subagents`”*；*“如果你追求轻量零配置：选 `pi-subagents`”*。

#### 模块 4：精选资源动态列表 (Curated Resource Cards)
- 展示该分类下的所有插件卡片，带实时 Star 数、下载量、一键复制安装命令、项目外链。

#### 模块 5：FAQ 常见问题与结构化数据 (FAQ Accordion + Schema)
- 3~4 个真实的高频开发者疑问与解答。
- 注入 Schema.org 的 `FAQPage` JSON-LD，直接在 Google SERP 呈现富媒体展开卡片。

---

## 四、 头部插件详情落地页实现规范 (Top Package Specs)

针对 Top 20~25 个核心包，提供精美富媒体落地页：

1. **SEO Meta 标签**：
   - `Title`: `{Package Name} — Pi Coding Agent Extension | Pi Index`
   - `Canonical`: 动态指向当前页面具体路径。
2. **核心模块**：
   - **Hero Install Area**：带终端风格命令框 `$ pi install ...`，一键复制并有明确反馈。
   - **Metrics Card**：GitHub Stars、npm 下载、增长趋势。
   - **“Featured on Pi Index” 徽章提取卡片**：
     - 展示 SVG 预览及一键复制 Markdown：
       ```markdown
       [![Featured on Pi Index](https://piindex.dev/badge/{id}.svg)](https://piindex.dev/packages/{id})
       ```
   - **同类替代推荐 (Related)**：推荐同分类下的其他 2~3 个扩展，建立网状内链。
3. **结构化数据 (JSON-LD)**：
   - 注入 `SoftwareApplication` 与 `BreadcrumbList`。

---

## 五、 外链与 DR 突破执行方案 (Off-Page Playbook)

目标：从目前的 **DR 2 突破至 20+**。

1. **针对 Top 20 插件作者提 Issue / PR（核心战术）**
   - 筛选出最热门的 20 个插件仓库（例如 `pi-web-access`, `pi-subagents`, `plannotator` 等）。
   - 提交极具诚意的友善 Issue/PR，说明已将其收录并在详情页提供动态数据跟踪，附上已生成好的 Badge Markdown。
   - 借助 GitHub（DR 98）的高权重反向链接打下第一波基础。
2. **上游官方仓库 `earendil-works/pi` 整合**
   - 提交 PR 至官方文档的 `packages.md` 或 README，在生态扩展目录中增加 `Pi Index` 链接。
3. **精准渠道宣发**
   - Hacker News (Show HN)、Reddit (r/commandline, r/LocalLLaMA)、V2EX、掘金、知乎。

---

## 六、 Agent 落地执行任务清单 (Actionable Task Checklist)

后续承接编码的 Agent 请严格依照以下任务依序执行：

- [ ] **Task 1: 核心分类元数据与内容体系建设**
  - 在 `site/src/data/categories/` 中建立首批 10~12 个高频分类的内容配置文件（定义 intro、comparison、recommendations、faqs）。
  - 编写中英双语的高质量选型内容。
- [ ] **Task 2: 分类落地页模板开发**
  - 创建 `site/src/pages/categories/[slug].astro` 及 `zh/categories/[slug].astro`。
  - 实现对比表格、场景建议模块、资源卡片列表与 FAQ 手风琴组件。
  - 接入 `FAQPage` + `CollectionPage` JSON-LD。
- [ ] **Task 3: 头部插件详情页开发（准入过滤）**
  - 在 `site/src/lib/catalog.ts` 中增加过滤逻辑 `isTopResource(resource, stats)`。
  - 创建 `site/src/pages/packages/[id].astro` 及 `zh/packages/[id].astro`，仅为通过准入条件的头部资源生成路由。
  - 实现徽章代码一键复制与同类推荐模块。
- [ ] **Task 4: SVG 徽章服务开发**
  - 创建 `site/src/pages/badge/[id].svg.ts`，动态/静态生成符合 Shields.io 规范的矢量图。
- [ ] **Task 5: 首页内链改造**
  - 在首页 `Directory.astro` 侧边栏和分类标题处增加进入分类落地页的语义化链接，将主页权重顺畅导入分类页。
- [ ] **Task 6: AI 友好入口部署**
  - 创建 `site/public/llms.txt`，结构化罗列分类指南与核心扩展。
- [ ] **Task 7: 自动化构建与测试通过**
  - 运行 `bun run --cwd site validate`，确保新增页面通过 Astro 静态检查和测试套件。
