import assert from 'node:assert/strict';
import { before, describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { resetCatalogCache } from '../dist/catalog.js';
import { createServer } from '../dist/server.js';

const snapshot = fileURLToPath(new URL('../catalog.snapshot.json', import.meta.url));

type ToolBody = {
  isError?: boolean;
  content: { type: string; text: string }[];
};

function body(result: ToolBody): Record<string, unknown> {
  assert.equal(result.content[0]?.type, 'text');
  return JSON.parse(result.content[0].text) as Record<string, unknown>;
}

function packagesOf(value: Record<string, unknown>) {
  return value.packages as { name: string; piindexUrl: string; guideUrl: string | null; directoryUrl: string; install: string | null; stars: number | null; weeklyDownloads: number | null }[];
}

async function connectMemory() {
  const client = new Client({ name: 'piindex-mcp-test', version: '0.0.0' });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await createServer().connect(serverTransport);
  await client.connect(clientTransport);
  return client;
}

describe('MCP tools against the real catalog', () => {
  before(() => {
    process.env.PIINDEX_CATALOG_FILE = snapshot;
    delete process.env.PIINDEX_CATALOG_URL;
    resetCatalogCache();
  });

  test('exposes five read-only tools', async () => {
    const client = await connectMemory();
    const listed = await client.listTools();
    assert.deepEqual(listed.tools.map(tool => tool.name), ['search_packages', 'get_package', 'list_categories', 'list_packages', 'list_guides']);
    for (const tool of listed.tools) {
      assert.equal(tool.annotations?.readOnlyHint, true);
      assert.equal(tool.annotations?.destructiveHint, false);
      assert.equal(tool.annotations?.openWorldHint, false);
    }
    await client.close();
  });

  test('search_packages mirrors ?q= and links back to piindex.dev', async () => {
    const client = await connectMemory();
    const result = body(await client.callTool({ name: 'search_packages', arguments: { query: 'Brave', limit: 5 } }) as ToolBody);
    assert.equal(result.catalogSource, 'file');
    assert.equal(result.total, 1);
    assert.equal(result.directoryUrl, 'https://piindex.dev/?q=Brave');
    const [hit] = packagesOf(result);
    assert.equal(hit.name, '@juicesharp/rpiv-web-tools');
    assert.ok(hit.piindexUrl.startsWith('https://piindex.dev/'));
    assert.ok(hit.directoryUrl.startsWith('https://piindex.dev/'));
    const empty = await client.callTool({ name: 'search_packages', arguments: { query: 'Brave missing' } }) as ToolBody;
    assert.notEqual(empty.isError, true);
    assert.equal(body(empty).total, 0);
    const rejected = await client.callTool({ name: 'search_packages', arguments: { query: '   ' } }) as ToolBody;
    assert.equal(rejected.isError, true);
    const unknown = await client.callTool({ name: 'search_packages', arguments: { query: 'mcp', category: 'not-a-category' } }) as ToolBody;
    assert.equal(unknown.isError, true);
    assert.match(body(unknown).error as string, /Unknown category/);
    await client.close();
  });

  test('get_package returns install, links, stats, and the guide page', async () => {
    const client = await connectMemory();
    const result = body(await client.callTool({ name: 'get_package', arguments: { name: 'pi-web-access' } }) as ToolBody);
    const pkg = result.package as {
      name: string; description: string; descriptionZh: string; install: string; repoUrl: string; npmUrl: string;
      piindexUrl: string; guideUrl: string; stars: number; weeklyDownloads: number; guides: { piindexUrl: string }[];
      descriptions: { en: string[]; zh: string[] };
    };
    assert.equal(pkg.name, 'pi-web-access');
    assert.match(pkg.description, /Web search/);
    assert.ok(pkg.descriptionZh.length > 0);
    assert.equal(pkg.install, 'pi install npm:pi-web-access');
    assert.equal(pkg.repoUrl, 'https://github.com/nicobailon/pi-web-access');
    assert.equal(pkg.npmUrl, 'https://www.npmjs.com/package/pi-web-access');
    assert.equal(pkg.piindexUrl, 'https://piindex.dev/packages/pi-web-access/');
    assert.equal(pkg.guideUrl, pkg.piindexUrl);
    assert.equal(typeof pkg.stars, 'number');
    assert.equal(typeof pkg.weeklyDownloads, 'number');
    assert.ok(pkg.guides.some(guide => guide.piindexUrl === 'https://piindex.dev/categories/web-access-search/'));
    assert.ok(pkg.descriptions.zh.length > 0);
    const missing = await client.callTool({ name: 'get_package', arguments: { name: 'not-a-real-package' } }) as ToolBody;
    assert.equal(missing.isError, true);
    assert.equal((body(missing).piindexUrl as string).startsWith('https://piindex.dev/'), true);
    await client.close();
  });

  test('lists categories, the packages in one category, and guides', async () => {
    const client = await connectMemory();
    const categories = body(await client.callTool({ name: 'list_categories', arguments: {} }) as ToolBody);
    const kinds = categories.kinds as { id: string; name: string; nameZh: string; piindexUrl: string; categories: { id: string; guideUrl: string | null; piindexUrl: string }[] }[];
    assert.ok(kinds.every(kind => kind.piindexUrl.startsWith('https://piindex.dev/')));
    const subagents = kinds.find(kind => kind.id === 'packages')!.categories.find(category => category.id === 'subagents')!;
    assert.equal(subagents.piindexUrl, 'https://piindex.dev/?category=subagents');
    assert.equal(subagents.guideUrl, 'https://piindex.dev/categories/subagents/');
    const community = kinds.find(kind => kind.id === 'community')!;
    assert.equal(community.name, 'Community Resources');
    assert.equal(community.nameZh, '社区资源');
    assert.equal(community.categories[0]?.id, 'community-resources');
    const communityPackages = body(await client.callTool({ name: 'list_packages', arguments: { category: 'community' } }) as ToolBody);
    assert.equal(communityPackages.directoryUrl, 'https://piindex.dev/?category=community');
    const [omp] = packagesOf(communityPackages);
    assert.equal(omp.name, 'omp packages');
    assert.equal(omp.install, null);
    assert.equal(omp.piindexUrl, 'https://piindex.dev/?q=omp+packages');
    const listed = body(await client.callTool({ name: 'list_packages', arguments: { category: 'web-access-search', limit: 50 } }) as ToolBody);
    assert.equal(listed.directoryUrl, 'https://piindex.dev/?category=web-access-search');
    assert.ok(packagesOf(listed).some(pkg => pkg.name === 'pi-web-access'));
    assert.ok(packagesOf(listed).every(pkg => pkg.piindexUrl.startsWith('https://piindex.dev/')));
    const guides = body(await client.callTool({ name: 'list_guides', arguments: {} }) as ToolBody);
    const pages = guides.guides as { kind: string; slug: string; piindexUrl: string; titleZh: string }[];
    assert.ok(pages.some(guide => guide.kind === 'topic' && guide.slug === 'jev' && guide.piindexUrl === 'https://piindex.dev/topics/jev/'));
    assert.ok(pages.some(guide => guide.kind === 'package' && guide.slug === 'pi-mcp-adapter'));
    assert.ok(pages.every(guide => guide.piindexUrl.startsWith('https://piindex.dev/') && guide.titleZh.length > 0));
    await client.close();
  });

  test('the stdio entrypoint answers a real search', async () => {
    const client = new Client({ name: 'piindex-mcp-stdio', version: '0.0.0' });
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [fileURLToPath(new URL('../dist/index.js', import.meta.url))],
      env: { ...process.env, PIINDEX_CATALOG_FILE: snapshot },
      stderr: 'ignore',
    });
    await client.connect(transport);
    const result = body(await client.callTool({ name: 'get_package', arguments: { name: 'pi-mcp-adapter' } }) as ToolBody);
    const pkg = result.package as { piindexUrl: string; install: string };
    assert.equal(pkg.piindexUrl, 'https://piindex.dev/packages/pi-mcp-adapter/');
    assert.equal(pkg.install, 'pi install npm:pi-mcp-adapter');
    await client.close();
  });
});
