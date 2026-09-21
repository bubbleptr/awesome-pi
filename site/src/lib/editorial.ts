import type { Catalog, Locale, Resource } from './catalog';
import { publishedRoutes, resolvePublishedResource, type RouteKind } from './published-routes';
import jev from '../data/topics/jev.json';
import subagents from '../data/categories/subagents.json';
import webAccess from '../data/categories/web-access-search.json';
import webPackage from '../data/packages/pi-web-access.json';
import subagentsPackage from '../data/packages/tintinweb-pi-subagents.json';
import mcpPackage from '../data/packages/pi-mcp-adapter.json';

type Localized<T = string> = Record<Locale, T>;
export type Source = { label: string; url: string };
export type Evidence = { date: string; revision: string; status: 'source-reviewed' | 'tested'; sources: Source[] };
export type ResourceReview = {
  name: string; summary: Localized; mechanism: Localized; prerequisites: Localized;
  dataSent?: Localized; failure?: Localized; limitations: Localized; verification: Evidence;
};
export type Editorial = {
  slug: string; title: Localized; description: Localized; intro: Localized<string[]>;
  sections: { id: string; title: Localized; paragraphs: Localized<string[]>; code?: string }[];
  resources: ResourceReview[]; sources: Source[]; alternatives?: string[];
};

const content: Record<RouteKind, Record<string, Editorial>> = {
  topics: { jev: jev as Editorial },
  categories: { subagents: subagents as Editorial, 'web-access-search': webAccess as Editorial },
  packages: { 'pi-web-access': webPackage as Editorial, 'tintinweb-pi-subagents': subagentsPackage as Editorial, 'pi-mcp-adapter': mcpPackage as Editorial },
};

export function getEditorial(kind: RouteKind, slug: string): Editorial {
  const page = content[kind][slug];
  if (!page) throw new Error(`Published content is missing: ${kind}/${slug}`);
  return page;
}

export function reviewedResource(name: string, catalog: Catalog): Resource {
  const resource = catalog.resources.find(resource => resource.name === name);
  if (resource) return resource;
  const entry = Object.entries(publishedRoutes.packages).find(([, route]) => route.status !== 'redirected' && route.canonicalName === name);
  const archived = entry ? resolvePublishedResource(entry[0], catalog) : undefined;
  if (!archived) throw new Error(`Reviewed resource is missing from the catalog: ${name}`);
  return archived;
}

export function repoDestination(url: string): 'github' | 'npm' | undefined {
  const host = new URL(url).hostname;
  return host === 'github.com' ? 'github' : ['npmjs.com', 'www.npmjs.com'].includes(host) ? 'npm' : undefined;
}
