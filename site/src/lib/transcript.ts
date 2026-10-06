export type Segment = { start: number; end: number; text: string };

export function activeSegment(segments: Pick<Segment, 'start' | 'end'>[], time: number): number {
  let low = 0;
  let high = segments.length - 1;
  while (low <= high) {
    const mid = (low + high) >>> 1;
    if (segments[mid].start > time) high = mid - 1;
    else low = mid + 1;
  }
  return high >= 0 && time < segments[high].end ? high : -1;
}

export function toVtt(segments: Segment[]): string {
  const time = (value: number) => {
    const ms = Math.round(value * 1000);
    return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:${String(Math.floor(ms / 60000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}.${String(ms % 1000).padStart(3, '0')}`;
  };
  return 'WEBVTT\n\n' + segments.map(s => `${time(s.start)} --> ${time(s.end)}\n${s.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}\n`).join('\n');
}
