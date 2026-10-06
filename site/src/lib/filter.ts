export type Filters = { q: string; category: string };
export type SearchableResource = { searchText: string; categories: string[]; kind: string };

export function matchesResource(resource: SearchableResource, filters: Filters): boolean {
  if (filters.category !== 'all' && resource.kind !== filters.category && !resource.categories.includes(filters.category)) return false;
  const haystack = resource.searchText.normalize('NFKC').toLowerCase();
  return filters.q.normalize('NFKC').trim().toLowerCase().split(/\s+/).every(term => haystack.includes(term));
}

export function filterResources<T extends SearchableResource>(resources: T[], filters: Filters): T[] {
  return resources.filter(resource => matchesResource(resource, filters));
}

export function readFilters(search: string, categories: string[]): Filters {
  const params = new URLSearchParams(search);
  const candidate = params.get('category') ?? 'all';
  return { q: (params.get('q') ?? '').trim(), category: ['all', 'packages', 'themes', 'integrations', 'durable', 'distributions', ...categories].includes(candidate) ? candidate : 'all' };
}

export function writeFilters(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set('q', filters.q.trim());
  if (filters.category !== 'all') params.set('category', filters.category);
  return params.size ? `?${params.toString()}` : '';
}
