import type { APIRoute } from 'astro';
import { talks, toVtt, type Talk } from '../../../lib/talks';
export const getStaticPaths = () => talks.map(talk => ({ params: { slug: talk.slug }, props: { talk } }));
export const GET: APIRoute = ({ props }) => new Response(
  toVtt((props.talk as Talk).segments.map(segment => ({ ...segment, text: segment.zh }))),
  { headers: { 'Content-Type': 'text/vtt; charset=utf-8' } },
);
