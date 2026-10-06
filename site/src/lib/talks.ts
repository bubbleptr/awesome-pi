import type { Locale } from './catalog';

import type { Segment } from './transcript';
export { activeSegment, toVtt } from './transcript';
export type { Segment } from './transcript';
export type Talk = {
  slug: string;
  sourceId: string;
  date: string;
  uploadedAt: string;
  title: Record<Locale, string>;
  source: string;
  video: string;
  youtube?: string;
  poster: string;
  duration: number;
  portrait: boolean;
  series: string;
  tags: string[];
  sourceText: string;
  summary: Record<Locale, { start: number; title: string; text: string }[]>;
  segments: (Segment & { zh: string })[];
};

export const talks = Object.values(import.meta.glob<Talk>('../data/talks/*.json', { eager: true, import: 'default' }))
  .sort((a, b) => b.date.localeCompare(a.date));

export const talkPath = (locale: Locale, slug = '') => `${locale === 'zh' ? '/zh' : ''}/talks/${slug ? `${slug}/` : ''}`;
export function timestamp(seconds: number): string {
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}
