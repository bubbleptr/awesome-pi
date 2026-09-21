# Pi Index 内容扩展与搜索优化实施方案 (V5 完整工程闭环版)

> **版本说明 (V5)**：本版本全面恢复并强化了**内容交付标准与可核验证据要求**，修正了静态模式下 HTTP 308 重定向的配置位置（统一接入根目录 `vercel.json`），补齐了 `package.json` 对新增端点测试脚本的执行要求，并完善了新页面的 `<Analytics />` 初始化与 `repo_clicked` 外跳埋点规范。

---

## 一、 核心架构、内链分流与重定向规范

### 1. 资源发布状态分流原则 (Status-Aware Linking)
- **已发布资源（Published）**：仅限在 `site/src/data/published-routes.json` 中登记且状态为 `active` 的资源，首页与目录卡片才会渲染进入 `/packages/[slug]`（中文 `/zh/packages/[slug]`）的详情入口。
- **未发布资源（Unpublished）**：其余 140+ 项未纳入试点的资源，保持现有逻辑，直接链接至外部原项目（GitHub / npm），避免产生指向未建页面的死链或半成品页面。
- **孤岛资源入口（如 `pi-mcp-adapter`）**：
  - 试点中的 `pi-mcp-adapter` 虽然所属分类（`MCP Adapter`）暂不建独立分类指南，但其在首页卡片上必须包含显式的“详情 / Guide →”入口，确保从首页获得完整的内链权重传递。

### 2. 交互与导航解耦规范
- 首页分类侧边栏与下拉框的即时筛选按钮保持现有的 `[data-category]` 属性，维持单页 DOM 实时过滤。
- 指南入口与详情页跳转链接使用独立的类名（如 `.guide-link`、`.package-link`），**严禁挂载 `data-category` 属性**，杜绝被 `directory.ts` 的 `event.preventDefault()` 拦截。

### 3. HTTP 308 永久重定向规范（Vercel 级配置）
- **背景**：项目为无 server adapter 的纯静态输出（`output: 'static'`），Astro 的 `redirects` 配置只会生成 `<meta http-equiv="refresh">` 客户端刷新，无法返回真实的 HTTP 301/308 状态码。
- **规则**：所有已发布资源的更名与路径迁移，统一在仓库根目录的 `vercel.json` 的 `redirects` 数组中配置（`permanent: true`，Vercel 边缘返回 308）：
  ```json
  {
    "source": "/packages/:oldSlug/",
    "destination": "/packages/:newSlug/",
    "permanent": true
  },
  {
    "source": "/zh/packages/:oldSlug/",
    "destination": "/zh/packages/:newSlug/",
    "permanent": true
  }
  ```

---

## 二、 搜索意图与内容验收标准 (Intent & Factual Verification)

严禁产出只有空洞排版、千篇一律描述的空壳详情页。每一个试点页面必须对照具体的开发者疑问进行针对性交付，且必须具备**可核验的代码与使用证据**。

### 1. 试点 5 个主题（10 个独立 URL）的需求映射表
| 试点主题与路径 | 目标查询 (Queries) | 用户核心疑问与搜索意图 | 页面形态 | 必须解答的技术问题与交付标准 |
| :--- | :--- | :--- | :--- | :--- |
| **Subagents**<br>`/categories/subagents/`<br>`/zh/categories/subagents/` | `pi coding agent subagents`<br>`pi subagents tutorial` | "Pi 默认只有 4 个基础工具，怎么运行多 Agent？不同插件机制有何差异？" | 分类选型指南 | 1. 解释 Pi Harness 的单进程/多进程任务调度机制；<br>2. 对比各方案：进程派生 vs Git Worktree 隔离；<br>3. 给出各方案的 Token 开销、上下文隔离度与适用场景。 |
| **Web Access**<br>`/categories/web-access-search/`<br>`/zh/categories/web-access-search/` | `pi web search`<br>`pi-web-access` | "如何在 Pi 终端里进行实时网络搜索？有哪些免 Key 和本地数据源方案？" | 分类选型指南 | 1. 对比纯抓取降级链（DuckDuckGo/URL 获取）与商业搜索 API（Brave/Tavily/Exa/Ollama）；<br>2. 明确说明各方案的依赖与网络前置要求（如是否需自备 API Key）。 |
| **`pi-web-access`**<br>`/packages/pi-web-access/`<br>`/zh/packages/pi-web-access/` | `pi-web-access`<br>`pi install pi-web-access` | "搜索该包的安装命令、参数配置、网络降级机制与支持的文件格式" | 精选插件详情页 | 1. 详述零配置背后的智能降级链机制；<br>2. 说明 PDF 提取、YouTube 视频理解的前置依赖（如系统依赖工具）；<br>3. 提供 `pi install npm:pi-web-access` 命令与验证方法。 |
| **`@tintinweb/pi-subagents`**<br>`/packages/tintinweb-pi-subagents/`<br>`/zh/packages/tintinweb-pi-subagents/` | `tintinweb pi subagents`<br>`pi coding agent worktree` | "如何实现 Claude Code 风格的多子代理？代码修改会不会冲突？" | 精选插件详情页 | 1. 阐明其通过 Git Worktree 实现工作目录隔离的核心机制；<br>2. 说明实时 TUI Widget 与后台并行的运行限制（如 Git 仓库环境要求）；<br>3. 提供替代对比（如与 `pi-subagents` 的差异）。 |
| **`pi-mcp-adapter`**<br>`/packages/pi-mcp-adapter/`<br>`/zh/packages/pi-mcp-adapter/` | `pi mcp adapter`<br>`how to use mcp in pi coding agent` | "Pi 支持 MCP 协议吗？如何接入已有的 MCP Server？Token 消耗大不大？" | 精选插件详情页 | 1. 解释其核心创新：用约 200 Token 的代理工具替代数百个 MCP 工具定义；<br>2. 详述惰性启动、元数据缓存与直连工具机制；<br>3. 给出接入现有 MCP 服务的实际配置格式。 |

### 2. 内容验收四要素（Content Verification Criteria）
负责撰写页面内容的 Agent 必须核验以下四项，缺少任一项视为不合格：
1. **实现机制（Implementation Mechanism）**：明确说明该插件是通过扩展 Hook 拦截、子进程派生、Git Worktree 隔离还是代理工具桥接实现的；
2. **前置依赖（Prerequisites）**：必须标注是否依赖系统级二进制（如 Git、Playwright、Curl）、第三方服务 API Key（如 Brave Search）或本地模型（如 Ollama）；
3. **已知限制（Known Limitations）**：客观列出运行约束（例如：依赖干净的 Git 暂存区、仅支持流式终端输出、不支持非阻塞并发等）；
4. **证据来源（Evidence Sources）**：所有功能描述必须以仓库源码、官方 README 或实测代码行为为准，严禁捏造未经证实的功能。

---

## 三、 转化埋点体系与初始化规范 (Analytics & Events)

### 1. 全局初始化要求
- **现状与隐患**：当前 `<Analytics />` 仅存在于 `Directory.astro` 中。若新分类页和详情页未加载此组件，SDK 不会被加载初始化，直接调用 `track()` 将会被静默丢弃。
- **规则**：所有新增的分类页（`categories/[slug].astro`）和详情页（`packages/[slug].astro`）模板的 `<head>` 或 `<body>` 底部**必须引入并渲染 `<Analytics />` 组件**（推荐后续抽取统一的页面 Layout 组件）。

### 2. 采集事件与防御性计数规范
| 事件名称 | 触发时机 | 携带参数 (Payload) | 统计目的与约束 |
| :--- | :--- | :--- | :--- |
| `command_copied` | 用户点击复制命令，且 `navigator.clipboard.writeText` **成功（Promise resolve）后**触发 | `{ package: slug, locale: 'en'\|'zh', surface: 'home'\|'category'\|'detail' }` | **硬性约束**：衡量用户真实安装意图。进入 `catch` 异常分支**严禁上报**。 |
| `repo_clicked` | 用户在卡片或详情页点击跳向原作者 GitHub / npm 仓库 | `{ package: slug, locale: 'en'\|'zh', destination: 'github'\|'npm', surface: 'home'\|'category'\|'detail' }` | 衡量为开源生态带来的引流贡献度与社区互信。 |

### 3. 前端埋点挂载实现
```typescript
import { track } from '@vercel/analytics';

// 1. 命令复制成功埋点（严格防误报）
try {
  await window.navigator.clipboard.writeText(command);
  track('command_copied', { package: slug, locale, surface });
} catch {
  announceCopy(t.copyError);
}

// 2. 外部仓库跳转埋点
document.querySelectorAll<HTMLAnchorElement>('[data-repo-link]').forEach(link => {
  link.addEventListener('click', () => {
    track('repo_clicked', {
      package: link.dataset.package ?? 'unknown',
      locale,
      destination: link.dataset.destination ?? 'github',
      surface
    });
  });
});
```

---

## 四、 资源生命周期、改名与删除容灾 (Lifecycle: Rename & Removal)

### 1. 注册表模型与归档快照 (`site/src/data/published-routes.json`)
```json
{
  "packages": {
    "pi-web-access": {
      "status": "active",
      "slug": "pi-web-access",
      "canonicalName": "pi-web-access",
      "archive": {
        "name": "pi-web-access",
        "url": "https://github.com/nicobailon/pi-web-access",
        "install": "pi install npm:pi-web-access",
        "kind": "packages",
        "descriptions": {
          "en": ["Web search, URL content fetching, GitHub cloning, PDF extraction..."],
          "zh": ["Web 搜索、URL 内容获取、GitHub 克隆、PDF 提取..."]
        }
      }
    },
    "pi-old-name": {
      "status": "redirected",
      "redirectTo": "pi-new-name"
    },
    "pi-deprecated-tool": {
      "status": "deprecated",
      "replacementSlug": "pi-web-access",
      "deprecatedReason": {
        "en": "This package is no longer maintained. We recommend using pi-web-access instead.",
        "zh": "该扩展已停止维护，建议改用 pi-web-access。"
      },
      "archive": { ... }
    }
  },
  "categories": { ... }
}
```

### 2. 容灾处理规则
1. **正常状态（active）**：优先从实时 README 解析出的 catalog 提取最新数据；若 README 中条目因 upstream 编辑偶发缺失，自动回退到 `archive` 兜底快照渲染，保证构建绝不中断。
2. **改名状态（redirected）**：在根目录 `vercel.json` 的 `redirects` 中写入永久重定向规则（HTTP 308），旧 URL 永久跳转至新 slug。
3. **废弃/下架状态（deprecated）**：页面保留并返回 HTTP 200，展示醒目的“已废弃/已下架”提示条，提供历史归档介绍及替代方案推荐链接，严禁粗暴 404。

---

## 五、 试点范围与扩量评估门槛 (Pilot & Review Gate)

第一阶段严格执行**“5 个主题、10 个双语独立 URL”**的试点策略：

### 1. 试点 10 个独立 URL 清单
- **分类指南（4 个 URL）**：
  - `/categories/subagents/` & `/zh/categories/subagents/`
  - `/categories/web-access-search/` & `/zh/categories/web-access-search/`
- **插件详情页（6 个 URL）**：
  - `/packages/pi-web-access/` & `/zh/packages/pi-web-access/`
  - `/packages/tintinweb-pi-subagents/` & `/zh/packages/tintinweb-pi-subagents/`
  - `/packages/pi-mcp-adapter/` & `/zh/packages/pi-mcp-adapter/`

### 2. 扩量评估双轨制：工程发布门槛 vs 定期业务复盘
- **工程发布门槛（上线硬标准）**：
  - `bun run --cwd site validate` 100% 通过（涵盖静态、交互与端点测试）；
  - 10 个页面全部生成且包含唯一 `<h1>`，双语 `hreflang`（`en`、`zh-CN`、`x-default`）双向互指无误；
  - 静态产物中不存在任何断链，canonical 准确自指；
  - 交互测试证明原生导航未受阻断，SVG 响应头合法。
- **定期复盘指标（发布后 14 天 / 30 天观察期）**：
  - **收录达标率**：Google Search Console 中 10 个 URL 的编入索引率（Indexed）达到 $\ge 80\%$；
  - **搜索与转化表现**：在 GSC 中观察到针对核心关键词的真实展示（Impressions），且产生实质性的 `command_copied` 转化记录；
  - **作者徽章挂载**：仅作为社区良性互动观察指标，**不作为后续批次扩量的硬性阻塞条件**。
  - *复盘结论为正向后，方可启动第二批次 5~8 个主题的扩充。*

---

## 六、 分层测试验收体系 (Three-Tier Testing Strategy)

### 1. 静态 HTML 产物验收 (`tests/rendered.test.ts`)
- 验证 `dist/` 下 10 个双语 HTML 文件均存在；
- 验证每个新页面的 `<link rel="canonical">` 绝对路径与当前路由一致；
- 验证双语 `<link rel="alternate" hreflang="...">` 完整且成对；
- 验证内链分流：仅当资源属于已发布名单时，卡片才输出指向 `/packages/...` 的站内链接；未发布资源必须维持指向外部 URL。

### 2. 交互与事件回归测试 (`tests/directory.test.ts`)
- **导航点击回归**：在 HappyDOM 运行 `initializeDirectory` 后，模拟点击 `.guide-link` 与 `.package-link`，断言事件未被 `preventDefault()`，且未触发单页内 DOM 筛选逻辑；
- **埋点上报验证**：模拟剪贴板复制成功，断言 `track('command_copied', ...)` 收到正确参数；模拟剪贴板抛出异常，断言 `track` 未被调用；模拟点击外跳仓库，断言 `track('repo_clicked', ...)` 正确触发。

### 3. HTTP 响应与 SVG 端点验收 (`tests/endpoint.test.ts` 新增)
- 针对 `/badge/[slug].svg.ts` 端点处理函数进行独立单元测试；
- 验证返回的 `Response` 具有 `Content-Type: image/svg+xml`；
- 验证返回包含有效的 `<svg ...>` 根节点及预期的标签文本；
- 验证对未发布 slug 请求时返回 404 响应。

---

## 七、 实施任务清单 (Actionable Task Checklist for Agents)

后续承接编码的 Agent 需依照以下 7 项任务依序推进：

- [ ] **Task 1: 建立持久化路由注册表与归档容灾机制**
  - 创建 `site/src/data/published-routes.json`，录入试点 5 个主题的 slug、双语元数据与 archive 兜底快照；
  - 编写辅助读取函数 `getPublishedRoute(slug)` 与 `isPublished(resource)`；
  - 若涉及更名，在根目录 `vercel.json` 的 `redirects` 中写入永久 308 重定向规则。
- [ ] **Task 2: 转化埋点接入与 Analytics 初始化**
  - 确保新增页面模板均引入并渲染 `@vercel/analytics/astro` 的 `<Analytics />` 组件；
  - 在客户端脚本中接入 `command_copied`（仅在 Promise resolve 后上报）与 `repo_clicked` 外跳事件。
- [ ] **Task 3: 首页内链分流与导航解耦改造**
  - 在 `Directory.astro` 中改造卡片链接：已发布项渲染指向 `/packages/[slug]` 的站内入口，未发布项继续直链外部；
  - 为 `pi-mcp-adapter` 增设显式的详情页入口；
  - 确保指南入口和详情链接不含 `data-category` 属性。
- [ ] **Task 4: 试点分类落地页模板与数据（严守内容验收四要素）**
  - 编写 `site/src/data/categories/subagents.json` 与 `web-access-search.json` 的客观核验数据（明确机制、依赖、限制与证据来源）；
  - 创建 `site/src/pages/categories/[slug].astro` 及中文镜像路由。
- [ ] **Task 5: 试点插件详情页模板开发（严守内容验收四要素）**
  - 创建 `site/src/pages/packages/[slug].astro` 及中文镜像路由；
  - 完整呈现实现机制、前置依赖、已知限制、命令一键复制（含成功埋点）、徽章代码提取框与同类替代推荐。
- [ ] **Task 6: 静态 SVG 徽章服务开发**
  - 创建 `site/src/pages/badge/[slug].svg.ts` 端点，支持输出 Shields.io 风格的 SVG 矢量图。
- [ ] **Task 7: 分层自动化测试编写与验证命令配置**
  - 新增 `tests/endpoint.test.ts` 检验 SVG 端点的 `Content-Type` 与结构；
  - 更新 `site/package.json` 中的 `test` 脚本，将 `tests/endpoint.test.ts` 纳入执行流（确保 `bun run validate` 自动包含该测试）；
  - 在 `tests/rendered.test.ts` 中加入 10 个页面的 canonical、hreflang、内链分流检验；
  - 在 `tests/directory.test.ts` 中加入原生导航点击不拦截、复制成功才上报、外跳上报的交互测试；
  - 执行 `bun run --cwd site validate`，确保数据测试、类型检查、构建及渲染测试全部绿灯通过。
