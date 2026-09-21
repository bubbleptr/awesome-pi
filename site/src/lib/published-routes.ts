import registry from '../data/published-routes.json';
import { createCatalog, loadCatalog, type Catalog, type Locale, type Resource, type ResourceArchive } from './catalog';

export type Archive = ResourceArchive;
type PublishedPackage = { slug: string; canonicalName: string; archive: Archive };
export type PackageRoute =
  | (PublishedPackage & { status: 'active' })
  | (PublishedPackage & { status: 'deprecated'; replacementSlug?: string; deprecatedReason: Record<Locale, string> })
  | { status: 'redirected'; redirectTo: string };
export type EditorialRoute = { status: 'active'; slug: string };
export type PublishedRoutes = {
  packages: Record<string, PackageRoute>;
  categories: Record<string, EditorialRoute>;
  topics: Record<string, EditorialRoute>;
};
export type RouteKind = keyof PublishedRoutes;
export const publishedRoutes: PublishedRoutes = registry as PublishedRoutes;
const activeArchives = Object.values(publishedRoutes.packages).flatMap(route => route.status === 'active' ? [route.archive] : []);

export function createPublishedCatalog(markdown: Record<Locale, string>, routes: PublishedRoutes = publishedRoutes): Catalog {
  return createCatalog(markdown, Object.values(routes.packages).flatMap(route => route.status === 'active' ? [route.archive] : []));
}

export function loadPublishedCatalog(): Catalog {
  return loadCatalog(activeArchives);
}

export function routePath(kind: RouteKind, slug: string, locale: Locale): string {
  return `${locale === 'zh' ? '/zh' : ''}/${kind}/${slug}/`;
}

export function getPublishedSlugs(kind: RouteKind): string[] {
  return Object.entries(publishedRoutes[kind]).filter(([, route]) => route.status !== 'redirected').map(([slug]) => slug);
}

export function getPublishedRoute(slug: string): PackageRoute | undefined {
  return publishedRoutes.packages[slug];
}

export function packagePath(resource: Pick<Resource, 'name'>, locale: Locale, routes: PublishedRoutes = publishedRoutes): string | undefined {
  const entry = Object.values(routes.packages).find(route => route.status === 'active' && route.canonicalName === resource.name);
  return entry && entry.status === 'active' ? routePath('packages', entry.slug, locale) : undefined;
}

export function isPublished(resource: Pick<Resource, 'name'>, routes: PublishedRoutes = publishedRoutes): boolean {
  return packagePath(resource, 'en', routes) !== undefined;
}

export function resolvePublishedResource(slug: string, catalog: Catalog = loadPublishedCatalog(), routes: PublishedRoutes = publishedRoutes): Resource | undefined {
  const entry = routes.packages[slug];
  if (!entry || entry.status === 'redirected') return undefined;
  const live = entry.status === 'active' ? catalog.resources.find(resource => resource.name === entry.canonicalName) : undefined;
  return live ?? { ...entry.archive, id: `archive-${slug}`, searchText: '' };
}
