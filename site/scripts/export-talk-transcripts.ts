import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import type { Talk } from '../src/lib/talks';

const source = new URL('../src/data/talks/', import.meta.url);
const output = new URL('../../docs/talk-transcripts/', import.meta.url);
const talks = readdirSync(source).filter(file => file.endsWith('.json'))
  .map(file => JSON.parse(readFileSync(new URL(file, source), 'utf8')) as Talk)
  .sort((a, b) => b.date.localeCompare(a.date));
const clock = (seconds: number) => {
  const ms = Math.round(seconds * 1000);
  return `${String(Math.floor(ms / 60000)).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`;
};
const markdown = [readFileSync(new URL('review-notes.md', output), 'utf8'), '\n---\n\n# 完整中英对照稿\n'];
const records: string[] = [];
for (const talk of talks) {
  markdown.push(`\n## ${talk.date} · ${talk.title.zh}\n\n${talk.title.en}\n\n原帖：${talk.source}\n\n视频：${talk.video}\n\n共 ${talk.segments.length} 条字幕。\n`);
  for (const [index, segment] of talk.segments.entries()) {
    if (!segment.zh?.trim()) throw new Error(`Missing Chinese: ${talk.slug}:${index + 1}`);
    const id = `${talk.slug}:${String(index + 1).padStart(4, '0')}`;
    markdown.push(`\n### ${id} · ${clock(segment.start)} → ${clock(segment.end)}\n\nEN: ${segment.text}\n\nZH: ${segment.zh}\n`);
    records.push(JSON.stringify({ id, slug: talk.slug, start: segment.start, end: segment.end, en: segment.text, zh: segment.zh }));
  }
}
mkdirSync(output, { recursive: true });
writeFileSync(new URL('bilingual-review.md', output), markdown.join(''));
writeFileSync(new URL('bilingual-review.jsonl', output), records.join('\n') + '\n');
console.log(`Exported ${talks.length} talks, ${records.length} bilingual cues.`);
