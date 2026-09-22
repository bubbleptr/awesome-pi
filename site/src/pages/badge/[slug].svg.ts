import type { APIContext } from 'astro';
import { getPublishedRoute, getPublishedSlugs } from '../../lib/published-routes';

export function getStaticPaths() {
  return getPublishedSlugs('packages').filter(slug => getPublishedRoute(slug)?.status === 'active').map(slug => ({ params: { slug } }));
}

const escapeXml = (value: string) => value.replace(/[<>&"']/g, character => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[character]!);

export function GET({ params }: APIContext): Response {
  const route = params.slug ? getPublishedRoute(params.slug) : undefined;
  if (!route || route.status !== 'active') return new Response('Not found', { status: 404 });
  const name = escapeXml(route.canonicalName);
  const left = 24;
  const right = Math.max(80, route.canonicalName.length * 7 + 16);
  const width = left + right;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="Pi Index: ${name}"><title>Pi Index: ${name}</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect x="${left}" width="${right}" height="20" rx="3"/></clipPath><g clip-path="url(#r)"><path fill="#187a45" d="M${left} 0h${right}v20H${left}z"/><path fill="url(#s)" d="M${left} 0h${right}v20H${left}z"/></g><svg x="2" y="0" width="20" height="20" viewBox="0 0 64 64" aria-hidden="true"><text x="32" y="47" text-anchor="middle" font-family="Georgia,serif" font-size="52" fill="#187a45">π</text></svg><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11"><text x="${left + right / 2}" y="14">${name}</text></g></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600', 'X-Content-Type-Options': 'nosniff' } });
}
