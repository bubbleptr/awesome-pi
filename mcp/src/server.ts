import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { catalogMeta, detail, findPackage, getCatalog, packageVersion, page, resolveCategory, searchPackages, summarize } from './catalog.js';
import { directoryLink } from './filter.js';

const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const;
const limitField = z.number().int().min(1).max(50).optional().describe('Maximum packages to return. Defaults to 20. Maximum 50.');
const offsetField = z.number().int().min(0).optional().describe('Number of matching packages to skip. Defaults to 0.');
const categoryField = z.string().optional().describe('Category id (for example subagents or web-access-search) or a top-level kind: packages, themes, integrations, durable, clients, distributions, community. Same values as the directory ?category= filter. Omit, or pass all, to include every resource.');

type ToolContent = { type: 'text'; text: string };

export function toolResult(value: unknown, isError = false): { isError: boolean; content: ToolContent[] } {
  return { isError, content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] };
}

export function createServer(): McpServer {
  const server = new McpServer({ name: 'piindex', version: packageVersion(), title: 'Pi Index' }, {
    instructions: 'Read-only directory of Pi Coding Agent extensions from Pi Index (https://piindex.dev). search_packages uses the same case-insensitive AND match as https://piindex.dev/?q=. Every result includes piindexUrl; link people back to that page. This server cannot install packages, submit listings, or record searches.',
  });

  server.registerTool('search_packages', {
    title: 'Search Pi Index',
    description: 'Search Pi Index packages, themes, and other resources by keyword. Matching is the same case-insensitive AND search as https://piindex.dev/?q= : every whitespace-separated term must appear in the name, English or Chinese description, category, kind, or install command. An optional category narrows results the same way as ?category=. Each result includes piindexUrl, and guideUrl when Pi Index has published a package guide.',
    inputSchema: { query: z.string().describe('Keywords to search for, in English or Chinese. Required.'), category: categoryField, limit: limitField, offset: offsetField },
    annotations,
  }, async ({ query, category, limit, offset }) => {
    const loaded = await getCatalog();
    const terms = query.normalize('NFKC').trim();
    if (!terms) return toolResult({ error: 'Provide a search query. To list a category, use list_packages.', piindexUrl: 'https://piindex.dev/' }, true);
    const resolved = resolveCategory(loaded.catalog, category);
    if (typeof resolved !== 'string') return toolResult({ ...catalogMeta(loaded), ...resolved.error }, true);
    const matches = searchPackages(loaded.catalog, terms, resolved);
    const paged = page(matches, limit, offset);
    return toolResult({
      ...catalogMeta(loaded),
      query: terms,
      category: resolved,
      directoryUrl: directoryLink(terms, resolved),
      total: paged.total,
      offset: paged.offset,
      limit: paged.limit,
      hasMore: paged.hasMore,
      packages: paged.items.map(pkg => summarize(pkg, loaded.catalog)),
    });
  });

  server.registerTool('get_package', {
    title: 'Get a Pi Index package',
    description: 'Get one Pi Index resource by its catalog name (for example pi-web-access or @tintinweb/pi-subagents) or by its stable id. Returns English and Chinese descriptions, categories, the project, repository, and npm links, the install command, the stars and weekly-downloads snapshot, and links to Pi Index guide pages when any exist. piindexUrl is the package guide when Pi Index publishes one, otherwise the directory search for that name.',
    inputSchema: {
      name: z.string().optional().describe('Catalog name, matched exactly, then case-insensitively if that is unique.'),
      id: z.string().optional().describe('Stable resource id from search_packages or list_packages. Takes precedence over name.'),
    },
    annotations,
  }, async ({ name, id }) => {
    const loaded = await getCatalog();
    const found = findPackage(loaded.catalog, { name, id });
    if (!found.ok) return toolResult({ ...catalogMeta(loaded), ...found.body }, true);
    return toolResult({ ...catalogMeta(loaded), package: detail(found.pkg, loaded.catalog) });
  });

  server.registerTool('list_categories', {
    title: 'List Pi Index categories',
    description: 'List Pi Index resource kinds and the categories inside each kind, with counts and piindex.dev URLs. A category includes guideUrl when Pi Index publishes a comparison guide for it.',
    annotations,
  }, async () => {
    const loaded = await getCatalog();
    return toolResult({
      ...catalogMeta(loaded),
      kinds: loaded.catalog.kinds.map(kind => ({
        id: kind.id,
        name: kind.name,
        nameZh: kind.nameZh,
        count: kind.count,
        piindexUrl: kind.piindexUrl,
        categories: loaded.catalog.categories.filter(category => category.kind === kind.id).map(category => ({
          id: category.id,
          name: category.name,
          nameZh: category.nameZh,
          count: category.count,
          piindexUrl: category.piindexUrl,
          guideUrl: category.guideUrl,
        })),
      })),
    });
  });

  server.registerTool('list_packages', {
    title: 'List packages in a Pi Index category',
    description: 'List Pi Index resources in one category or kind. Uses the same membership rules as the directory ?category= filter. Pass a category id such as subagents, a kind such as themes, or all.',
    inputSchema: { category: z.string().describe('Category id, kind, or all.'), limit: limitField, offset: offsetField },
    annotations,
  }, async ({ category, limit, offset }) => {
    const loaded = await getCatalog();
    const resolved = resolveCategory(loaded.catalog, category);
    if (typeof resolved !== 'string') return toolResult({ ...catalogMeta(loaded), ...resolved.error }, true);
    const matches = searchPackages(loaded.catalog, '', resolved);
    const paged = page(matches, limit, offset);
    return toolResult({
      ...catalogMeta(loaded),
      category: resolved,
      directoryUrl: directoryLink('', resolved),
      total: paged.total,
      offset: paged.offset,
      limit: paged.limit,
      hasMore: paged.hasMore,
      packages: paged.items.map(pkg => summarize(pkg, loaded.catalog)),
    });
  });

  server.registerTool('list_guides', {
    title: 'List Pi Index guides and topics',
    description: 'List Pi Index topic pages, category comparison guides, and package guides. Each guide includes its piindex.dev URL, English and Chinese title and description, and the catalog names it covers.',
    annotations,
  }, async () => {
    const loaded = await getCatalog();
    return toolResult({ ...catalogMeta(loaded), guides: loaded.catalog.guides });
  });

  return server;
}
