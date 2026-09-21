import { mkdirSync, writeFileSync } from 'node:fs';
import { loadPublishedCatalog as loadCatalog } from '../src/lib/published-routes';
import { githubRepo, npmPackage, readSnapshot, registryRepo, weeklyTrend, type NpmStats, type StatsSnapshot } from '../src/lib/stats';

const statsFile = new URL('../src/data/stats.json', import.meta.url);
const userAgent = 'awesome-pi-stats (https://github.com/BubblePtr/awesome-pi)';

async function resolveToken(): Promise<string | null> {
  const env = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
  if (env) return env;
  try {
    const process_ = Bun.spawn(['gh', 'auth', 'token'], { stdout: 'pipe', stderr: 'ignore' });
    const output = await new Response(process_.stdout).text();
    if (await process_.exited !== 0) return null;
    return output.trim() || null;
  } catch { return null; }
}

async function mapPool<T>(items: T[], size: number, delayMs: number, fn: (item: T) => Promise<void>): Promise<void> {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length) {
      await fn(items[next++]);
      if (delayMs) await Bun.sleep(delayMs);
    }
  }));
}

async function fetchJson(url: string, headers: Record<string, string>): Promise<unknown> {
  let attempt = 0;
  for (;;) {
    const response = await fetch(url, { headers });
    if (response.status === 429 && attempt < 4) {
      const retryAfter = Number(response.headers.get('Retry-After'));
      await Bun.sleep((Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 2 * 2 ** attempt) * 1000);
      attempt++;
      continue;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
}

const encodePackage = (pkg: string) => pkg.replace('/', '%2F');

async function fetchStars(repo: string, token: string | null): Promise<number | null> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': userAgent,
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const data = await fetchJson(`https://api.github.com/repos/${repo}`, headers) as { stargazers_count?: number };
    if (typeof data.stargazers_count !== 'number') throw new Error('missing stargazers_count');
    return data.stargazers_count;
  } catch (error) {
    console.warn(`warning: GitHub ${repo}: ${(error as Error).message}`);
    return null;
  }
}

async function fetchRegistryRepo(pkg: string): Promise<string | null> {
  try {
    const data = await fetchJson(`https://registry.npmjs.org/${encodePackage(pkg)}/latest`, { 'User-Agent': userAgent }) as { repository?: unknown };
    return registryRepo(data.repository);
  } catch (error) {
    console.warn(`warning: npm registry ${pkg}: ${(error as Error).message}`);
    return null;
  }
}

function dateRange(days: number): { start: string; end: string } {
  const dayMs = 24 * 60 * 60 * 1000;
  const end = new Date(Date.now() - dayMs);
  const start = new Date(end.getTime() - (days - 1) * dayMs);
  const format = (date: Date) => date.toISOString().slice(0, 10);
  return { start: format(start), end: format(end) };
}

async function fetchDownloads(pkg: string, range: { start: string; end: string }): Promise<NpmStats | null> {
  try {
    const data = await fetchJson(`https://api.npmjs.org/downloads/range/${range.start}:${range.end}/${encodePackage(pkg)}`, {
      'User-Agent': userAgent,
    }) as { downloads?: { downloads: number }[] };
    if (!Array.isArray(data.downloads)) throw new Error('missing daily downloads');
    const stats = weeklyTrend(data.downloads.map(day => day.downloads));
    if (!stats) throw new Error('incomplete daily downloads');
    return stats;
  } catch (error) {
    console.warn(`warning: npm ${pkg}: ${(error as Error).message}`);
    return null;
  }
}

const catalog = loadCatalog();
const repos = new Set<string>();
const packages = new Set<string>();
const needsRepo = new Set<string>();
for (const resource of catalog.resources) {
  const repo = githubRepo(resource.url);
  if (repo) repos.add(repo);
  const pkg = npmPackage(resource.install);
  if (pkg) {
    packages.add(pkg);
    if (!repo) needsRepo.add(pkg);
  }
}

const previous = readSnapshot(statsFile);
const token = await resolveToken();
if (!token) console.warn('warning: no GitHub token found (GITHUB_TOKEN, GH_TOKEN, or `gh auth token`); the anonymous API limit is 60 requests/hour.');

let failures = 0;

const npmRepos = new Map<string, string | null>();
await mapPool([...needsRepo], 2, 200, async pkg => {
  const resolved = await fetchRegistryRepo(pkg);
  if (resolved === null) failures++;
  const repo = resolved ?? previous.npm[pkg]?.repo ?? null;
  npmRepos.set(pkg, repo);
  if (repo) repos.add(repo);
});

const github: StatsSnapshot['github'] = {};
await mapPool([...repos], 5, 100, async repo => {
  const stars = await fetchStars(repo, token);
  if (stars !== null) { github[repo] = { stars }; return; }
  failures++;
  if (previous.github[repo]) {
    github[repo] = previous.github[repo];
    console.warn(`warning: kept previous GitHub stats for ${repo}`);
  }
});

const npm: StatsSnapshot['npm'] = {};
const range = dateRange(14);
await mapPool([...packages], 2, 200, async pkg => {
  const stats = await fetchDownloads(pkg, range);
  if (stats) { npm[pkg] = { ...stats, repo: npmRepos.get(pkg) ?? null }; return; }
  failures++;
  if (previous.npm[pkg]) {
    npm[pkg] = previous.npm[pkg];
    console.warn(`warning: kept previous npm stats for ${pkg}`);
  }
});

if (failures === repos.size + packages.size + needsRepo.size && failures > 0) {
  console.error('error: every stats request failed; leaving the existing snapshot untouched.');
  process.exit(1);
}

const sortObject = <T>(values: Record<string, T>) => Object.fromEntries(Object.entries(values).sort(([a], [b]) => a.localeCompare(b)));
const snapshot: StatsSnapshot = { generatedAt: new Date().toISOString(), github: sortObject(github), npm: sortObject(npm) };
mkdirSync(new URL('../src/data/', import.meta.url), { recursive: true });
writeFileSync(statsFile, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`stats: ${Object.keys(github).length}/${repos.size} repositories (${needsRepo.size} resolved via npm metadata), ${Object.keys(npm).length}/${packages.size} npm packages, window ${range.start}…${range.end}, ${failures} request(s) fell back to previous values.`);
