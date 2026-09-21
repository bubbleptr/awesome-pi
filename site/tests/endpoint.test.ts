import { describe, expect, test } from 'bun:test';
import type { APIContext } from 'astro';
import { GET } from '../src/pages/badge/[slug].svg';
import { publishedRoutes } from '../src/lib/published-routes';

describe('published package badge endpoint', () => {
  for (const [slug, route] of Object.entries(publishedRoutes.packages)) {
    if (route.status !== 'active') {
      test(`${slug} has no active package badge`, () => expect(GET({ params: { slug } } as unknown as APIContext).status).toBe(404));
      continue;
    }
    test(`${slug} returns a cacheable SVG response suitable for README embedding`, async () => {
      const response = GET({ params: { slug } } as unknown as APIContext);
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('image/svg+xml; charset=utf-8');
      const body = await response.text();
      expect(body).toMatch(/^<svg[^>]+xmlns="http:\/\/www.w3.org\/2000\/svg"/);
      expect(body).toContain('Pi Index');
      expect(body).toContain(route.canonicalName);
      expect(body).toContain('</svg>');
    });
  }
  test.each(['not-published', 'jev', undefined])('does not issue a package badge for %s', slug => {
    expect(GET({ params: { slug } } as unknown as APIContext).status).toBe(404);
  });
});
