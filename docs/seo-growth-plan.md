# Pi Index 内容扩展与搜索优化实施方案 (V3 落地严密版)

> **版本说明 (V3)**：经核验代码底层逻辑、实际快照数据与搜索引擎官方技术文档，彻底纠正“自动铺量”、“热度动态决定路由”、“GitHub Badge 提升 DR 假说”及“已失效的 FAQ 富结果承诺”。确立以**“需求驱动、稳定持久化、严谨内容核验、试点渐进”**为核心的技术与内容准则。

---

## 一、 核心原则与架构纠偏

### 1. 路由与生命周期原则：发布后永久保留 (Permanent URLs)
- **禁止依据动态数据生成路由**：构建期绝不允许根据 `stats.json` 的每周动态数据（Stars / 周下载）动态决定路由的增删。任何页面一旦正式发布，**路由永久存在**，数据更新只影响页面内部的指标展示和排序权重，绝不产生 404。
- **解耦稳定 Slug 与资源识别**：
  - 现行 `catalog.ts` 中 `resource.id` 格式为 `${slug(name)}-${hash(name, url)}`，若 URL 或名称微调，哈希值变动将导致 URL 断裂。
  - **规则**：详情页与分类页采用手工确认、固化的语义 Slug（如 `pi-web-access`，若有 npm 包名则优先采用规范化包名）。若资源发生重命名或废弃，必须在路由层配置 301 重定向映射或保留带有废弃提示的页面，绝不允许静默 404。
- **显式发布名单 (Explicit Release Registry)**：
  - 设立独立的发布清单文件 `site/src/data/published-routes.json`，只有在此文件中显式登记的页面才会构建静态路由。

### 2. 交互与导航解耦原则 (Navigation Decoupling)
- **现状冲突**：当前 `site/src/scripts/directory.ts` 会拦截所有 `[data-category]` 元素的点击事件（`event.preventDefault()`），将其转化为当前单页的 DOM 筛选并重写 URL 为 `?category=...`。
- **解耦方案**：
  - 首页与目录页的“即时筛选器”保持现有行为，类名与属性维持不变。
  - 新增分类落地页入口采用独立的语义标签和类名（如 `<a class="guide-link" href="/categories/subagents/">`），不得带有 `data-category` 属性，确保浏览器原生导航生效。

### 3. 内容验收硬性要求：可核验的客观事实 (Factual Verification)
- 严禁空洞的概念车轱辘话和无意义的字数堆砌。
- 每个收录进入对比表和指南的插件，必须具备**可核验的代码证据**：
  - 具体的实现方式（如通过 Hook 拦截、通过 子进程 派生、通过 Worktree 隔离等）；
  - 明确的依赖前置条件（如需依赖系统安装 Playwright、需要特定 Provider 的 API Key、需本地安装 Ollama 等）；
  - 明确的已知限制（如不支持 Windows、仅支持流式终端、不支持多路复用等）。

---

## 二、 搜索意图与需求验证对照表 (Search Intent Mapping)

所有拟开发的页面必须满足具体的开发者真实问题，否则不予立项建页：

| 目标查询 (Target Queries) | 用户实际痛点 / 搜索意图 | 落地承接页面 | 页面形态与核心交付 |
| :--- | :--- | :--- | :--- |
| `pi coding agent subagents`<br>`pi subagents tutorial` | "Pi 默认只有 4 个工具，怎么运行多 Agent？不同子代理插件机制有何差异？" | `/categories/subagents/`<br>`/zh/categories/subagents/` | **选型指南**：对比进程派生 vs Git Worktree 隔离方案，提供多 Agent 运行架构与配置示例。 |
| `pi web search`<br>`pi-web-access` | "如何在 Pi 终端里进行实时网络搜索？有哪些免 Key 和本地方案？" | `/categories/web-access-search/`<br>`/zh/categories/web-access-search/` | **选型指南**：对比零配置无 Key 方案（DuckDuckGo/抓取）与商业 API（Brave/Tavily/Ollama）的区别。 |
| `pi mcp adapter`<br>`how to use mcp in pi coding agent` | "Pi 支持 MCP 协议吗？如何接入已有的 MCP Server？" | `/categories/mcp-adapter/`<br>`/zh/categories/mcp-adapter/` | **能力指引**：即使当前仅收录 1 个适配扩展，但开发者搜索核心是“协议支持方案”，需详述 MCP 代理运行原理与配置方法。 |
| `pi themes`<br>`best pi coding agent dark theme` | "Pi 终端有哪些好看的配色？怎么预览和安装？" | `/categories/dark-themes/`<br>`/zh/categories/dark-themes/` | **视觉图鉴**：深色主题色彩预览、安装命令与切换方式。 |
| `pi-web-access` | "搜索特定插件的安装命令、参数配置、更新日志" | `/packages/pi-web-access/`<br>`/zh/packages/pi-web-access/` | **精选详情页**：环境依赖要求、降级链解析、安装命令、替代扩展对比。 |

---

## 三、 试点发布名单 (Pilot Release List)

为确保工程稳妥与内容深度，第一阶段严格执行**“2 个分类指南 + 3 个插件详情页”**的试点策略，严禁一次性全量铺开：

### 试点 1：分类选型指南（共 2 个）
1. **`subagents`（子代理）**
   - 英文：`/categories/subagents/`
   - 中文：`/zh/categories/subagents/`
   - 核心收录与对比对象：`pi-subagents`、`@tintinweb/pi-subagents`、`pi-interactive-subagents`。
2. **`web-access-search`（网页与搜索）**
   - 英文：`/categories/web-access-search/`
   - 中文：`/zh/categories/web-access-search/`
   - 核心收录与对比对象：`pi-web-access`、`@juicesharp/rpiv-web-tools`、`@ollama/pi-web-search`。

### 试点 2：精选插件详情页（共 3 个）
1. **`pi-web-access`**（独立单包，高频网络抓取工具）
2. **`@tintinweb/pi-subagents`**（具代表性的 Git Worktree 隔离子代理包）
3. **`pi-mcp-adapter`**（MCP 核心代理工具）

*注：只有试点页面完成验证、指标与测试全部达标后，方可逐步纳入后续批次。*

---

## 四、 技术规格与页面验收标准

### 1. 分类指南落地页 (`categories/[slug].astro`)
- **头部规范**：
  - `Title (EN)`: `{Category Name} Guide for Pi Coding Agent — Pi Index`
  - `Canonical`: 严格自指当前独立 URL，支持多语言 `hreflang`（`en`、`zh-CN`、`x-default`）。
- **结构化数据**：
  - 注入 `CollectionPage` 与 `ItemList` Schema。
  - FAQ 仅作为标准正文提供给用户和 AI 爬虫抓取，**不承诺也不依赖 Google SERP 展开卡片**。
- **内容必备模块**：
  1. 架构说明：Pi 核心 Harness 调度机制；
  2. 事实对比表：实现模式、前置依赖、配置复杂度、当前版本指标；
  3. 场景选型决策树：3 个典型使用场景及对应推荐；
  4. 资源卡片列表：该分类全部资源，带一键复制命令。

### 2. 插件详情页 (`packages/[slug].astro`)
- **头部规范**：
  - `Title (EN)`: `{Package Name}: Install & Usage Guide | Pi Index`
  - `Canonical`: 严格自指当前独立 URL。
- **结构化数据**：
  - 注入 `SoftwareApplication`（包含名称、分类、开源许可证、环境依赖）。
- **内容必备模块**：
  1. 一键安装与环境依赖声明（如 Node 版本、CLI 依赖）；
  2. 核心功能与限制说明；
  3. 社区徽章 Markdown 代码提供框（定位为社区引荐入口，不作 DR 承诺）；
  4. 同类替代推荐（基于分类内链）。

---

## 五、 测试与质量验证计划 (Quality & Test Suite)

在新增页面后，现有的 `tests/rendered.test.ts` 必须扩充并确保 `bun run --cwd site validate` 全部绿灯：

1. **路由与页面完整性测试**：
   - 遍历 `site/src/data/published-routes.json` 中的所有路由，核验其静态生成产物存在且包含唯一的 `<main>` 与 `<h1>`；
   - 验证每个新页面的 `<link rel="canonical">` 均指向其自身独立绝对地址，而不是根路径；
   - 验证所有双语页面均具有成对的 `hreflang` 标签。
2. **内链与导航回归测试**：
   - 测试首页分类筛选功能在加入指南链接后无任何事件冒泡阻断；
   - 验证指南页与详情页内部的互相跳转链接均为有效内部路径（无死链）。
3. **SVG 徽章端点测试**：
   - 验证 `/badge/[slug].svg` 返回 `image/svg+xml` 内容类型，且包含合法 SVG 标签与预期的文本内容。

---

## 六、 阶段度量与追踪指标 (Metrics)

不以难以归因的 Ahrefs DR 提升作为唯一 KPI，设立客观务实的过程指标：

1. **Google Search Console 覆盖与展现**：
   - 试点 5 个页面被成功编入索引（Indexed）；
   - 监控针对 `pi subagents`、`pi web search`、`pi mcp adapter` 等词的搜索展示量（Impressions）与平均排名。
2. **站内交互转化（通过 Vercel Analytics / 自定义事件）**：
   - 落地页中的“安装命令复制成功次数”（Copy Actions）；
   - 从分类选型页向外跳至原作者 GitHub 仓库的点击量。
3. **社区真实引用**：
   - 实际观察是否有至少 1~2 位插件作者在其仓库 README 挂载 Pi Index 徽章，作为社区互信指标。

---

## 七、 执行任务清单 (Task Checklist for Agents)

- [ ] **Task 1: 建立持久化路由注册表与稳定 Slug 映射**
  - 创建 `site/src/data/published-routes.json`；
  - 明确首批 2 个分类与 3 个包的永久 Slug。
- [ ] **Task 2: 导航与交互解耦**
  - 检查 `site/src/scripts/directory.ts` 与 `Directory.astro`，确保新增的指南链接不受 `data-category` 事件拦截。
- [ ] **Task 3: 试点分类落地页模板与数据**
  - 编写 `site/src/data/categories/subagents.json` 与 `web-access-search.json` 的客观核验数据；
  - 创建 `site/src/pages/categories/[slug].astro` 及中文对应路由。
- [ ] **Task 4: 试点插件详情页模板与数据**
  - 创建 `site/src/pages/packages/[slug].astro` 及中文对应路由。
- [ ] **Task 5: 静态 SVG 徽章实现**
  - 实现 `/badge/[slug].svg.ts` 端点。
- [ ] **Task 6: 扩充自动化测试套件**
  - 在 `site/tests/rendered.test.ts` 中加入新路由的 canonical、hreflang、死链与徽章检查；
  - 执行 `bun run --cwd site validate` 确保构建与测试全部通过。
