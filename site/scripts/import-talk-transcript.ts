import { readFileSync, writeFileSync } from 'node:fs';
import type { Talk } from '../src/lib/talks';
import type { Segment } from '../src/lib/transcript';

const [slug, input] = process.argv.slice(2);
if (!slug || !/^[a-z0-9-]+$/.test(slug) || !input) {
  throw new Error('Usage: bun scripts/import-talk-transcript.ts <slug> <whisper-json>');
}
const file = new URL(`../src/data/talks/${slug}.json`, import.meta.url);
const talk: Omit<Talk, 'segments'> & { segments: (Segment & { zh?: string })[] } = JSON.parse(readFileSync(file, 'utf8'));
if (talk.segments.some(cue => cue.zh)) throw new Error('This transcript has Chinese translations. Re-align and review both languages together before replacing its segments.');
const result: { segments: Segment[] } = JSON.parse(readFileSync(input, 'utf8'));
if (!Array.isArray(result.segments) || !result.segments.length) throw new Error('Transcript has no segments');
let previousEnd = 0;
talk.segments = result.segments.map(cue => {
  if (!Number.isFinite(cue.start) || !Number.isFinite(cue.end) || typeof cue.text !== 'string') throw new Error('Invalid transcript segment');
  const start = Math.max(previousEnd, cue.start);
  const end = Math.min(talk.duration, cue.end);
  if (end <= start || !cue.text.trim()) throw new Error(`Invalid segment at ${start}s`);
  previousEnd = end;
  return { start, end, text: cue.text.trim() };
});
writeFileSync(file, `${JSON.stringify(talk, null, 2)}\n`);
console.log(`Imported ${talk.segments.length} segments for ${slug}`);
