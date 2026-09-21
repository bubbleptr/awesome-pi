# Pi Index 内容扩展与搜索优化实施方案 (V4 工程闭环版)

> **版本说明 (V4)**：本版本补齐了从开发到上线复盘的工程闭环，重点确立：**内链按发布状态精准分流**、**转化埋点与计数防御机制**、**资源改名/下架的生命周期与归档兜底**、**清晰的 10 个 URL 试点与扩量复盘口径**，以及**区分“静态产物、交互拦截、HTTP 响应”的三层测试验收体系**。

---

## 一、 核心架构与内链分流规则

### 1. 资源发布状态分流原则 (Status-Aware Linking)
- **已发布资源（Published）**：仅限在 `site/src/data/published-routes.json` 中登记且状态为 `active` 的资源，首页与目录卡片才会渲染进入 `/packages/[slug]`（中文 `/zh/packages/[slug]`）的详情入口。
- **未发布资源（Unpublished）**：其余 140+ 项未纳入试点的资源，保持现有逻辑，直接链接至外部原项目（GitHub / npm），避免产生指向未建页面的死链或半成品页面。
- **独立资源入口保障（如 `pi-mcp-adapter`）**：
  - 试点中的 `pi-mcp-adapter` 虽然所属分类（`MCP Adapter`）暂不建独立分类指南，但其卡片上必须包含明确的“详情 / Guide →”入口，确保从首页获得完整的内链权重传递。

### 2. 交互与导航解耦规范
- 首页分类侧边栏与下拉框的即时筛选按钮保持现有的 `[data-category]` 属性，维持单页 DOM 实时过滤。
- 指南入口与详情页跳转链接使用独立的类名（如 `.guide-link`、`.package-link`），**严禁挂载 `data-category` 属性**，杜绝被 `directory.ts` 的 `event.preventDefault()` 拦截。

---

## 二、 转化埋点与交互指标规范 (Analytics & Conversion)

在现有 `@vercel/analytics` 的基础上，补充精准事件采集。要求：**仅在动作真实成功后上报，失败绝不计数**。

### 1. 采集事件定义
| 事件名称 | 触发时机 | 携带参数 (Payload) | 统计目的 |
| :--- | :--- | :--- | :--- |
| `command_copied` | 用户点击复制命令，且 `navigator.clipboard.writeText` **成功（Promise resolve）后**触发 | `{ package: slug, locale: 'en'\|'zh', surface: 'home'\|'category'\|'detail' }` | 核心转化率：衡量用户安装意图与页面实用度。**若进入 catch 报错分支严禁上报。** |
| `repo_clicked` | 用户在卡片或详情页点击跳向原作者 GitHub / npm 仓库 | `{ package: slug, locale: 'en'\|'zh', destination: 'github'\|'npm' }` | 引流贡献度：衡量为开源社区带来的引荐价值。 |

### 2. 代码实现规范 (`site/src/scripts/directory.ts` 及详情页脚本)
```typescript
import { track } from '@vercel/analytics';

// 仅在成功写入剪贴板后计数
try {
  await window.navigator.clipboard.writeText(command);
  track('command_copied', { package: slug, locale, surface });
} catch {
  // 失败仅提示用户手动复制，不记录为转化
  announceCopy(t.copyError);
}
```

---

## 三、 资源生命周期、改名与删除容灾 (Lifecycle: Rename & Removal)

### 1. 为什么不能只靠一条注册记录？
现行 `catalog.ts` 在每次构建时完全重新解析当前 `README.md`。若某个已发布插件在后续迭代中被作者改名、仓库迁移或从 README 中移除，静态构建会因找不到数据而崩溃，或者导致原有已被搜索引擎索引的 URL 变为 404。

### 2. 注册表模型与归档机制 (`site/src/data/published-routes.json`)
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

### 3. 容灾处理规则
1. **正常状态（active）**：优先从实时 README 解析出的 catalog 提取最新数据；若 README 中条目偶发缺失，自动回退到 `archive` 兜底快照渲染，保证构建绝不中断。
2. **改名状态（redirected）**：在 `astro.config.mjs` 中生成静态 301 重定向映射，旧 URL 永久跳转至新 slug，传递已有搜索权重。
3. **废弃/下架状态（deprecated）**：页面保留并返回 HTTP 200，展示醒目的“已废弃/已下架”提示条，提供历史归档介绍及替代方案推荐链接，严禁粗暴 404。

---

## 四、 试点范围与扩量评估门槛 (Pilot & Review Gate)

第一阶段严格执行**“5 个主题、10 个双语独立 URL”**的试点策略：

### 1. 试点 10 个独立 URL 清单
| 试点主题 | 英文页面 URL | 中文页面 URL | 页面形态 |
| :--- | :--- | :--- | :--- |
| **Subagents** | `/categories/subagents/` | `/zh/categories/subagents/` | 分类选型指南 |
| **Web Access & Search** | `/categories/web-access-search/` | `/zh/categories/web-access-search/` | 分类选型指南 |
| **`pi-web-access`** | `/packages/pi-web-access/` | `/zh/packages/pi-web-access/` | 精选插件详情页 |
| **`@tintinweb/pi-subagents`** | `/packages/tintinweb-pi-subagents/` | `/zh/packages/tintinweb-pi-subagents/` | 精选插件详情页 |
| **`pi-mcp-adapter`** | `/packages/pi-mcp-adapter/` | `/zh/packages/pi-mcp-adapter/` | 精选插件详情页 |

### 2. 扩量评估双轨制：工程发布门槛 vs 定期业务复盘
- **工程发布门槛（上线硬标准）**：
  - `bun run --cwd site validate` 100% 通过；
  - 10 个页面全部生成且包含唯一 `<h1>`，双语 `hreflang`（`en`、`zh-CN`、`x-default`）双向互指无误；
  - 静态产物中不存在任何断链，canonical 准确自指；
  - 交互测试证明原生导航未受阻断，SVG 响应头合法。
- **定期复盘指标（发布后 14 天 / 30 天观察期）**：
  - **收录达标率**：Google Search Console 中 10 个 URL 的编入索引率（Indexed）达到 $\ge 80\%$；
  - **搜索与转化表现**：在 GSC 中观察到针对核心关键词的真实展示（Impressions），且产生实质性的 `command_copied` 转化记录；
  - **作者徽章挂载**：仅作为社区良性互动观察指标，**不作为后续批次扩量的硬性阻塞条件**。
  - *复盘结论为正向后，方可启动第二批次 5~8 个主题的扩充。*

---

## 五、 分层测试验收体系 (Three-Tier Testing Strategy)

为确保验证方式覆盖真实交互和 HTTP 响应，测试套件划分为三层：

### 1. 静态 HTML 产物验收 (`tests/rendered.test.ts`)
- 验证 `dist/` 下 10 个双语 HTML 文件均存在；
- 验证每个新页面的 `<link rel="canonical">` 绝对路径与当前路由一致；
- 验证双语 `<link rel="alternate" hreflang="...">` 完整且成对；
- 验证内链分流：仅当资源属于已发布名单时，卡片才输出指向 `/packages/...` 的站内链接；未发布资源必须维持指向外部 URL。

### 2. 交互与事件回归测试 (`tests/directory.test.ts`)
- **导航点击回归**：在 HappyDOM 运行 `initializeDirectory` 后，模拟点击 `.guide-link` 与 `.package-link`，断言事件未被 `preventDefault()`，且未触发单页内 DOM 筛选逻辑；
- **埋点上报验证**：模拟剪贴板复制成功，断言 `track` 收到对应的事件与参数；模拟剪贴板抛出异常，断言 `track` 未被调用。

### 3. HTTP 响应与 SVG 端点验收 (`tests/endpoint.test.ts` 新增)
- 针对 `/badge/[slug].svg.ts` 端点处理函数进行独立单元测试；
- 验证返回的 `Response` 具有 `Content-Type: image/svg+xml`；
- 验证返回包含有效的 `<svg ...>` 根节点及预期的标签文本；
- 验证对未发布 slug 请求时返回 404 响应。

---

## 六、 Agent 落地执行任务清单 (Actionable Task Checklist)

后续承接编码的 Agent 需依照以下 7 项任务依序推进：

- [ ] **Task 1: 建立持久化路由注册表与归档容灾机制**
  - 创建 `site/src/data/published-routes.json`，录入试点 5 个主题的 slug、双语元数据与 archive 兜底快照；
  - 编写辅助读取函数 `getPublishedRoute(slug)` 与 `isPublished(resource)`。
- [ ] **Task 2: 转化埋点接入**
  - 在 `site/src/scripts/directory.ts` 及详情页复制逻辑中，接入 `@vercel/analytics` 的 `track` 调用；
  - 严格限制仅在写入剪贴板成功后上报 `command_copied`，失败不上报。
- [ ] **Task 3: 首页内链分流与导航解耦改造**
  - 在 `Directory.astro` 中改造卡片链接：已发布项渲染指向 `/packages/[slug]` 的站内入口，未发布项继续直链外部；
  - 为 `pi-mcp-adapter` 增设醒目的详情页入口；
  - 确保指南入口和详情链接不含 `data-category` 属性。
- [ ] **Task 4: 试点分类落地页模板与数据**
  - 编写 `site/src/data/categories/subagents.json` 与 `web-access-search.json` 的客观核验数据（机制、对比表、决策树、FAQ）；
  - 创建 `site/src/pages/categories/[slug].astro` 及中文镜像路由。
- [ ] **Task 5: 试点插件详情页模板开发**
  - 创建 `site/src/pages/packages/[slug].astro` 及中文镜像路由；
  - 实现命令一键复制（含成功埋点）、徽章代码提取框与同类替代推荐。
- [ ] **Task 6: 静态 SVG 徽章服务开发**
  - 创建 `site/src/pages/badge/[slug].svg.ts` 端点，支持输出 Shields.io 风格的 SVG 矢量图。
- [ ] **Task 7: 分层自动化测试编写与构建验证**
  - 在 `tests/rendered.test.ts` 中加入 10 个页面的 canonical、hreflang、内链分流检验；
  - 在 `tests/directory.test.ts` 中加入原生导航点击不拦截、复制成功才上报的交互测试；
  - 新建 `tests/endpoint.test.ts` 检验 SVG 端点的 `Content-Type` 与结构；
  - 执行 `bun run --cwd site validate`，确保数据测试、类型检查、构建及渲染测试全部绿灯通过。
