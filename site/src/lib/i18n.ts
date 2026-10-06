import type { Locale, ResourceKind } from './catalog';

export const repository = 'https://github.com/BubblePtr/awesome-pi';
export const kindOrder: ResourceKind[] = ['packages', 'themes', 'integrations', 'durable', 'distributions'];
export const text = {
  en: {
    title: 'Pi Index — A curated directory for Pi Coding Agent',
    description: 'Discover community packages, themes, and tools for Pi Coding Agent. Browse by category, search in English or Chinese, and copy installation commands.',
    eyebrow: 'THE COMMUNITY DIRECTORY', heading: 'Make Pi your own.',
    intro: 'Discover packages, themes, and tools for Pi Coding Agent. Curated by the community, ready for your workflow.',
    contribute: 'Suggest a resource', github: 'GitHub', skip: 'Skip to resources',
    all: 'All resources', categories: 'Categories', resources: 'resources',
    search: 'Search resources', placeholder: 'Search packages, features, or tools…', clear: 'Clear search',
    filter: 'Browse by category', found: 'resources', of: 'of',
    project: 'View project', copy: 'Copy', copied: 'Copied', copyCommand: 'Copy installation command',
    emptyTitle: 'No resources found.', emptyBody: 'Try a different keyword or explore another category.', reset: 'Clear filters',
    more: 'Read full description', less: 'Show less',
    missing: 'See the project for installation instructions.',
    maintained: 'Open source. Community maintained.',
    notice: 'An independent community directory. Inclusion does not imply endorsement by Pi.',
    source: 'Read the list on GitHub', report: 'Report an issue', license: 'List licensed under CC0',
    copiedStatus: 'Installation command copied.', copyError: 'Could not copy. Please select the command and copy it manually.',
    noScript: 'All resources are listed below. Enable JavaScript to search, filter, and copy commands.',
    statsStars: 'GitHub stars', statsDownloads: 'npm downloads per week', perWeek: '/wk',
    statsUpdated: 'GitHub stars and npm downloads updated {date}.',
    kinds: { packages: 'Packages', themes: 'Themes', integrations: 'Editor integrations', durable: 'Built on Pi Durable', distributions: 'Distributions' },
  },
  zh: {
    title: 'Pi Index — Pi Coding Agent 社区资源精选',
    description: '发现 Pi Coding Agent 的社区扩展、主题与工具。按功能分类浏览，使用中英文搜索，一键复制安装命令。社区维护的精选资源目录。',
    eyebrow: 'PI 社区资源目录', heading: '让 Pi 更适合你。',
    intro: '发现 Pi Coding Agent 的扩展、主题与工具。由社区精选，为你的工作方式找到合适的搭配。',
    contribute: '推荐资源', github: 'GitHub', skip: '跳转到资源列表',
    all: '全部资源', categories: '分类', resources: '项资源',
    search: '搜索资源', placeholder: '搜索插件名称、功能或工具…', clear: '清除搜索',
    filter: '按分类浏览', found: '项资源', of: '/',
    project: '查看项目', copy: '复制', copied: '已复制', copyCommand: '复制安装命令',
    emptyTitle: '没有找到相关资源。', emptyBody: '试试其他关键词，或换一个分类。', reset: '清除筛选',
    more: '展开完整介绍', less: '收起介绍',
    missing: '请前往项目页面查看安装说明。',
    maintained: '开源，由社区共同维护。',
    notice: '独立社区目录，收录不代表 Pi 官方发布或背书。',
    source: '在 GitHub 阅读清单', report: '报告问题', license: '清单采用 CC0 许可',
    copiedStatus: '安装命令已复制。', copyError: '复制失败，请选中安装命令后手动复制。',
    noScript: '下方已展示全部资源。启用 JavaScript 后可使用搜索、筛选与命令复制。',
    statsStars: 'GitHub Star 数', statsDownloads: 'npm 每周下载量', perWeek: '/周',
    statsUpdated: 'GitHub Star 与 npm 下载数据更新于 {date}。',
    kinds: { packages: '扩展包', themes: '主题', integrations: '编辑器集成', durable: '基于 Pi Durable', distributions: '替代发行版' },
  },
} satisfies Record<Locale, object>;

const categoryNames: Record<string, string> = {
  'Web Access & Search': '网页与搜索', 'MCP Adapter': 'MCP 适配', Subagents: '子代理',
  'UI Enhancement': '界面增强', 'Security & Permission': '安全与权限',
  'Dev Tools & Code Intelligence': '开发与代码智能', 'Persistent Memory': '持久化记忆',
  'Context Management': '上下文管理', 'Loop Engineering': '循环工程', 'Code Review': '代码审查',
  'Task Management': '任务管理', 'Plan Mode': '规划模式', 'Background Tasks': '后台任务',
  'Browser Automation': '浏览器自动化', 'Web UI': 'Web 界面',
  'Communication & Collaboration': '通信与协作', Utilities: '实用工具',
  'Package Collections': '扩展合集', 'Dark Themes': '深色主题', 'Light Themes': '浅色主题',
  'Theme Packs': '主题合集', 'Featured Themes': '特色主题', 'Theme Tools': '主题工具',
  'Editor Integration': '编辑器集成', 'Built on Pi Durable': '基于 Pi Durable',
  'Alternative Distributions': '替代发行版',
};
export function categoryLabel(name: string, locale: Locale): string {
  return locale === 'zh' ? categoryNames[name] ?? name : name;
}
