# Pi Index 内容扩展与搜索优化实施方案 (V6：Jev 专题纳入首批)

> **版本说明 (V6)**：首批增加 TypeSafe AI / Jev 专题，调整为 **6 个主题、12 个双语独立 URL**，优先完成专题内容。功能分类继续按用途组织，热点专题跨分类聚合资源。保留内容核验、稳定路由和分层测试要求，并将专题纳入内链、Analytics、事件采集与验收范围。

---

## 一、 核心架构、内链分流与重定向规范

### 1. 资源发布状态分流原则 (Status-Aware Linking)
- **已发布资源（Published）**：仅限在 `site/src/data/published-routes.json` 中登记且状态为 `active` 的资源，首页与目录卡片才会渲染进入 `/packages/[slug]`（中文 `/zh/packages/[slug]`）的详情入口。
- **未发布资源（Unpublished）**：未发布独立详情页的资源继续链接至外部原项目，避免产生指向未建页面的死链。进入 Jev 专题不等于已发布该插件的详情页。
- **孤岛资源入口（如 `pi-mcp-adapter`）**：
  - 试点中的 `pi-mcp-adapter` 虽然所属分类（`MCP Adapter`）暂不建独立分类指南，但其在首页卡片上必须包含显式的“详情 / Guide →”入口，确保从首页获得完整的内链权重传递。
- **热点专题入口**：首页增加 TypeSafe AI / Jev 入口，按当前语言链接至 `/topics/jev/` 或 `/zh/topics/jev/`。专题中的插件保留原功能分类；仅对已发布的指南或详情生成站内链接，其他资源链接至原项目。

### 2. 交互与导航解耦规范
- 首页分类侧边栏与下拉框的即时筛选按钮保持现有的 `[data-category]` 属性，维持单页 DOM 实时过滤。
- 指南、详情和专题入口使用独立的类名（如 `.guide-link`、`.package-link`、`.topic-link`），**严禁挂载 `data-category` 属性**，避免被 `directory.ts` 的 `event.preventDefault()` 拦截。

### 3. HTTP 308 永久重定向规范（Vercel 级配置）
- **背景**：项目为无 server adapter 的纯静态输出（`output: 'static'`），Astro 的 `redirects` 配置只会生成 `<meta http-equiv="refresh">` 客户端刷新，无法返回真实的 HTTP 301/308 状态码。
- **规则**：所有已发布资源的更名与路径迁移，统一在仓库根目录的 `vercel.json` 的 `redirects` 数组中配置（`permanent: true`，Vercel 边缘返回 308）。每条规则使用实际旧路径和新路径，同时覆盖中英文。以下数组条目应合并到现有 `redirects`：
  ```json
  [
    {
      "source": "/packages/pi-old-name/",
      "destination": "/packages/pi-new-name/",
      "permanent": true
    },
    {
      "source": "/zh/packages/pi-old-name/",
      "destination": "/zh/packages/pi-new-name/",
      "permanent": true
    }
  ]
  ```

---

## 二、 搜索意图与内容验收标准 (Intent & Factual Verification)

严禁产出只有空洞排版、千篇一律描述的空壳详情页。每一个试点页面必须对照具体的开发者疑问进行针对性交付，且必须具备**可核验的代码与使用证据**。

### 1. 试点 6 个主题（12 个独立 URL）的需求映射表
| 试点主题与路径 | 目标查询 (Queries) | 用户核心疑问与搜索意图 | 页面形态 | 必须解答的技术问题与交付标准 |
| :--- | :--- | :--- | :--- | :--- |
| **TypeSafe AI / Jev**<br>`/topics/jev/`<br>`/zh/topics/jev/` | `typesafe ai`<br>`jev pi`<br>`jev plugins`<br>`jev compaction` | "TypeSafe AI 与 Jev 是什么关系？哪些 Pi 插件已经接入？怎么安装、配置和选择？" | 跨分类热点专题，首批优先 | 1. 解释品牌、模型与 Pi 插件的关系，并提供官方入口；<br>2. 按上下文裁剪、模型路由、代码检查和工具调用监督比较候选；<br>3. 核验安装方法、Key 与版本要求、数据发送范围、失败行为和效果证据。 |
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

### 3. TypeSafe AI / Jev 热点专题

**选题依据与优先级**：2026-09-21，用户提供的 Google Trends 热词面板截图显示，在该面板的对比口径下，`typesafe ai` 近期实线热度已超过 `GPTs` 对照线。这是相对搜索热度信号，不能换算为绝对搜索量，也不等同于 `jev` 单词的热度。结合 TypeSafe 于 [2026-09-15 发布 Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev)及已有 Pi 插件，专题进入首批并优先制作，无需等待常规第二批扩量复盘。

**选题规则**：功能分类按用途组织；热点专题按技术或事件聚合。有搜索热度证据、与 Pi 的实际关联且能提供有用内容，即可提出专题。专题沿用内容核验与稳定 URL 要求，插件数量和 Stars 不作为固定准入门槛。

- 英文标题：`TypeSafe AI (Jev) for Pi: Plugins, Setup & Comparison | Pi Index`。
- 中文标题：`TypeSafe AI（Jev）Pi 插件：安装、配置与选型 | Pi Index`。
- 页面顺序：TypeSafe AI / Jev 简介及官网入口 → 在 Pi 中的用途 → 按场景比较插件 → 安装配置、限制与证据来源。
- 首批只新增这一对专题页。候选插件仍保留原功能分类，不为凑专题批量生成插件详情页；分类指南与专题复用同一份 catalog 资源数据。
- 每个候选标注核验日期、版本或源码提交，以及“已查阅源码/文档”或“已实测”的证据状态。性能、节省比例与安全效果按实际证据描述。

首批核验以下 4 个候选。以下用途来自项目资料，尚未在本项目环境中实测；上线前重新核对安装方式和当前能力，不达内容要求的候选暂不收录。

| 候选与一手来源 | Jev 的用途 | 页面必须核验的边界 |
| :--- | :--- | :--- |
| [pi-fast-jev-compaction](https://github.com/QuentinDanblon/pi-fast-jev-compaction) | 筛选旧工具调用与结果，裁剪上下文 | Key 要求、与 Pi 原生压缩的关系、保留与丢弃规则、节省效果的测量条件 |
| [pi-jev-code](https://github.com/KamilPostrozny/pi-jev-code) | 搜索重排、编辑前检查与任务 diff 审查 | 单 Agent 的适用范围、判定阈值、API 故障处理 |
| [pi-warden](https://github.com/DevMortimer/pi-warden) | 工具调用、项目规则与任务完成情况监督 | 启用 Jev 的配置、其他判定后端、离线行为与人工确认方式 |
| [pi-jev-model-router](https://github.com/da-vinci-noob/pi-jev-model-router) | 根据任务需求和预算选择主模型 | 目标模型授权、切换条件、预算策略是否为硬性消费上限 |

对比表统一包含用途、介入环节、依赖与 Key、发送到外部服务的数据范围、失败行为和证据来源。安装命令从核验后的资源数据读取，不根据仓库名称猜测 npm 包名。

---

## 三、 转化埋点体系与初始化规范 (Analytics & Events)

### 1. 全局初始化要求
- **现状与隐患**：当前 `<Analytics />` 仅存在于 `Directory.astro` 中。若新分类页和详情页未加载此组件，SDK 不会被加载初始化，直接调用 `track()` 将会被静默丢弃。
- **规则**：所有新增的分类页（`categories/[slug].astro`）、详情页（`packages/[slug].astro`）和专题页（`topics/[slug].astro`）模板**必须引入并渲染 `<Analytics />` 组件**，每个页面只初始化一次，可使用共享 Layout。

### 2. 采集事件与防御性计数规范
| 事件名称 | 触发时机 | 携带参数 (Payload) | 统计目的与约束 |
| :--- | :--- | :--- | :--- |
| `command_copied` | 用户点击复制命令，且 `navigator.clipboard.writeText` **成功（Promise resolve）后**触发 | `{ package: resourceName, locale: 'en'\|'zh', surface: 'home'\|'category'\|'detail'\|'topic' }` | 记录安装命令复制行为。进入剪贴板 `catch` 异常分支**严禁上报**；复制次数不等于实际安装次数。 |
| `repo_clicked` | 用户在首页、分类页、详情页或专题页点击跳向原作者 GitHub / npm 仓库 | `{ package: resourceName, locale: 'en'\|'zh', destination: 'github'\|'npm', surface: 'home'\|'category'\|'detail'\|'topic' }` | 衡量为开源生态带来的引流贡献度；进入站内详情页不计为仓库外跳。 |

`package` 使用 catalog 中的完整资源名，未发布详情页的候选也可以采集事件。`surface` 记录操作所在的页面类型；专题中的插件点击与复制均为 `topic`。TypeSafe 官网入口不计为插件仓库外跳。

### 3. 前端埋点挂载实现
```typescript
import { track } from '@vercel/analytics';

// Count only successful clipboard writes.
try {
  await window.navigator.clipboard.writeText(command);
  track('command_copied', { package: resourceName, locale, surface });
} catch {
  announceCopy(t.copyError);
}

// Track original project links without intercepting navigation.
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
  "categories": { ... },
  "topics": {
    "jev": {
      "status": "active",
      "slug": "jev"
    }
  }
}
```

专题数据放在 `site/src/data/topics/jev.json`，包含双语编辑内容、候选资源引用和核验证据；资源名称、外链、分类与安装命令从 catalog 读取。`topics` 登记仅生成专题路由，不自动发布候选的 `/packages/` 详情页或生成专题徽章。专题地址发布后保持稳定，热度下降不触发删除。

### 2. 容灾处理规则
1. **正常状态（active）**：优先从实时 README 解析出的 catalog 提取最新数据；若 README 中条目因 upstream 编辑偶发缺失，自动回退到 `archive` 兜底快照渲染，保证构建绝不中断。
2. **改名状态（redirected）**：在根目录 `vercel.json` 的 `redirects` 中写入永久重定向规则（HTTP 308），旧 URL 永久跳转至新 slug。
3. **废弃/下架状态（deprecated）**：页面保留并返回 HTTP 200，展示醒目的“已废弃/已下架”提示条，提供历史归档介绍及替代方案推荐链接，严禁粗暴 404。

---

## 五、 试点范围与扩量评估门槛 (Pilot & Review Gate)

第一阶段发布 **6 个主题、12 个双语独立 URL**。在路由和页面基础能力就绪后，优先完成 Jev 专题；达到对应工程与内容验收要求即可先发布，其他试点随后完成。

### 1. 试点 12 个独立 URL 清单
- **热点专题（2 个 URL，优先）**：
  - `/topics/jev/` & `/zh/topics/jev/`
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
  - 首批完成时，12 个页面全部生成且包含唯一 `<h1>`，双语 `hreflang`（`en`、`zh-CN`、`x-default`）指向同一主题的对应页面，`x-default` 指向英文页；
  - 静态产物中不存在任何断链，canonical 准确自指；
  - 交互测试证明原生导航未受阻断，SVG 响应头合法。
  - 分批上线时，注册表仅列入已完成并验收的页面，每次构建遍历实际发布清单验证，不提前链接尚未发布的其余试点页面。
- **定期复盘指标（发布后 14 天 / 30 天观察期）**：
  - **收录达标率**：首批完整发布后，Google Search Console 中 12 个 URL 的编入索引率（Indexed）目标为 $\ge 80\%$，即至少 10 个 URL。分批上线时按实际发布数量统计，每页从上线日起计观察期；
  - **搜索与转化表现**：在 GSC 中观察到针对核心关键词的真实展示（Impressions），且产生实质性的 `command_copied` 转化记录；
  - **Jev 专题单独复盘**：按 `/topics/jev/` 与 `/zh/topics/jev/` 查看展示、点击，以及 `typesafe ai`、`jev`、Pi 相关组合词的查询表现；结合 `surface: 'topic'` 的复制和仓库外跳事件判断承接效果。首页产生的事件不能代替专题转化；
  - **作者徽章挂载**：仅作为社区良性互动观察指标，**不作为后续批次扩量的硬性阻塞条件**。
  - *复盘结论为正向后，方可启动第二批次 5~8 个主题的扩充。*

---

## 六、 分层测试验收体系 (Three-Tier Testing Strategy)

### 1. 静态 HTML 产物验收 (`tests/rendered.test.ts`)
- 遍历发布清单验证对应 HTML 文件存在；首批全部完成时为 12 个双语 HTML 文件，其中专题页 2 个；
- 验证每个新页面的 `<link rel="canonical">` 绝对路径与当前路由一致；
- 验证双语 `<link rel="alternate" hreflang="...">` 完整且成对；
- 验证内链分流：仅当资源属于已发布名单时，卡片才输出指向 `/packages/...` 的站内链接；未发布资源必须维持指向外部 URL。
- 验证首页可进入当前语言的 Jev 专题，专题中的内页目标均已发布；专题标题覆盖 TypeSafe AI 与 Jev，每页只包含一次 Analytics 初始化。

### 2. 交互与事件回归测试 (`tests/directory.test.ts`)
- **导航点击回归**：在 HappyDOM 运行 `initializeDirectory` 后，模拟点击 `.guide-link`、`.package-link` 与 `.topic-link`，断言事件未被 `preventDefault()`，且未触发单页内 DOM 筛选逻辑；
- **埋点上报验证**：模拟剪贴板复制成功，断言 `track('command_copied', ...)` 收到正确参数；模拟剪贴板抛出异常，断言 `track` 未被调用；模拟点击外跳仓库，断言 `track('repo_clicked', ...)` 正确触发。
- **专题交互验证**：初始化专题使用的客户端逻辑，验证未发布独立详情页的候选仍能复制和外跳，并上报完整资源名与 `surface: 'topic'`；站内链接和 TypeSafe 官网入口不触发 `repo_clicked`。

### 3. HTTP 响应与 SVG 端点验收 (`tests/endpoint.test.ts` 新增)
- 针对 `/badge/[slug].svg.ts` 端点处理函数进行独立单元测试；
- 验证返回的 `Response` 具有 `Content-Type: image/svg+xml`；
- 验证返回包含有效的 `<svg ...>` 根节点及预期的标签文本；
- 验证对未发布 slug 请求时返回 404 响应。
- 徽章范围仅限已发布包；`topics` 中的 `jev` 不属于包徽章端点的有效 slug。

---

## 七、 实施任务清单 (Actionable Task Checklist for Agents)

后续承接编码的 Agent 按以下 8 项任务推进。测试随对应功能完成，Task 8 汇总发布验收。Jev 专题完成内容与工程验收后优先上线，试点剩余页面继续推进；注册表随实际发布进度登记。

- [x] **Task 1: 建立持久化路由注册表与归档容灾机制**
  - 创建 `site/src/data/published-routes.json`，明确 6 个试点主题的稳定 slug；按发布进度登记 `packages`、`categories` 与 `topics`，为已发布包准备 archive 兜底快照；
  - 编写辅助读取函数 `getPublishedRoute(slug)` 与 `isPublished(resource)`；
  - 若涉及更名，在根目录 `vercel.json` 的 `redirects` 中写入永久 308 重定向规则。
- [x] **Task 2: 转化埋点接入与 Analytics 初始化**
  - 确保新增页面模板均引入并渲染 `@vercel/analytics/astro` 的 `<Analytics />` 组件；
  - 在客户端脚本中接入 `command_copied`（仅在 Promise resolve 后上报）与 `repo_clicked` 外跳事件。
- [x] **Task 3: 首页内链分流与导航解耦改造**
  - 在 `Directory.astro` 中改造卡片链接：已发布项渲染指向 `/packages/[slug]` 的站内入口，未发布项继续直链外部；
  - 为 `pi-mcp-adapter` 增设显式的详情页入口；
  - Jev 专题发布后，在首页增加当前语言的专题入口；
  - 确保指南、详情和专题入口不含 `data-category` 属性。
- [x] **Task 4: TypeSafe AI / Jev 专题内容与模板（首批优先）**
  - 核验第二节列出的 4 个候选，将符合要求的资源同步加入 `README.md` 与 `README.en.md` 的现有功能分类，继续由 catalog 提取基础数据；
  - 编写 `site/src/data/topics/jev.json`，按品牌与模型介绍、Pi 用途、场景比较、安装配置与限制的顺序组织双语内容，记录来源和核验日期；
  - 创建 `site/src/pages/topics/[slug].astro` 及中文镜像路由，支持独立 canonical、双语 hreflang、Analytics 和 `surface: 'topic'` 的事件；
  - 专题链接遵循发布状态，不把候选自动加入包详情发布名单。
- [x] **Task 5: 试点分类落地页模板与数据（严守内容验收四要素）**
  - 编写 `site/src/data/categories/subagents.json` 与 `web-access-search.json` 的客观核验数据（明确机制、依赖、限制与证据来源）；
  - 创建 `site/src/pages/categories/[slug].astro` 及中文镜像路由。
- [x] **Task 6: 试点插件详情页模板开发（严守内容验收四要素）**
  - 创建 `site/src/pages/packages/[slug].astro` 及中文镜像路由；
  - 完整呈现实现机制、前置依赖、已知限制、命令一键复制（含成功埋点）、徽章代码提取框与同类替代推荐。
- [x] **Task 7: 静态 SVG 徽章服务开发**
  - 创建 `site/src/pages/badge/[slug].svg.ts` 端点，支持输出 Shields.io 风格的 SVG 矢量图。
- [x] **Task 8: 分层自动化测试编写与验证命令配置**
  - 新增 `tests/endpoint.test.ts` 检验 SVG 端点的 `Content-Type` 与结构；
  - 更新 `site/package.json` 中的 `test` 脚本，将 `tests/endpoint.test.ts` 纳入执行流（确保 `bun run validate` 自动包含该测试）；
  - 在 `tests/rendered.test.ts` 中遍历实际发布清单，加入首批 12 个页面的 canonical、hreflang、内链分流与 Analytics 初始化检验，覆盖 Jev 专题；
  - 在 `tests/directory.test.ts` 中加入原生导航点击不拦截、复制成功才上报、外跳上报的交互测试，并执行专题客户端逻辑验证 `surface: 'topic'`；
  - 执行 `bun run --cwd site validate`，确保数据测试、类型检查、构建及渲染测试全部绿灯通过。


## 八、首批执行记录（2026-09-21）

8 项工程任务已实现。核验发现原计划部分技术前提已与源码不符：pi-web-access 默认免 Key 搜索为 Exa MCP；两种子代理都支持可选 Worktree；MCP 的约 200 Token 是作者估计。执行以固定版本源码为准，详见 [分类与插件核验证据](pilot-evidence.md) 和 [Jev 核验证据](jev-evidence.md)。

首批包缺失单语或双语 README 条目时，目录及详情使用发布快照；仍然存在但互相冲突的翻译继续阻止构建。没有实际更名，因此没有写入示例旧路径重定向；今后更名必须同步中英文 Vercel 永久重定向。

Vercel 项目访问统计已启用，但当前 Hobby 套餐不支持自定义事件。代码接入不代表控制台已能收集转化；升级套餐属于用户手动事项。上线检查、人工事项和 14/30 天复盘口径记录在 [SEO 交付记录](seo-delivery.md)。
