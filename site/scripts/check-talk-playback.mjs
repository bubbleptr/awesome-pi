// Prepend globalThis.PI_TALKS_TASK_SPACE = <existing-space-id>; and pass this script to ego-browser nodejs.
const spaceId = Number(globalThis.PI_TALKS_TASK_SPACE);
if (!Number.isInteger(spaceId) || spaceId < 1) throw new Error('Set PI_TALKS_TASK_SPACE to an existing Ego browser task space.');
const task = await taskSpace(spaceId);
const page = task.page('p1');
const slugs = globalThis.PI_TALKS_SLUGS ?? ['harness-and-workflow', 'agent-frustrations', 'slippery-slop', 'changing-models', 'pi-durable'];
for (const slug of slugs) {
  await page.goto(`http://127.0.0.1:4321/zh/talks/${slug}/`);
  const result = await page.evaluate(async () => {
    const video = document.querySelector('video');
    const scroll = document.querySelector('.transcript-scroll');
    video.muted = true;
    const wait = async predicate => {
      const deadline = performance.now() + 30000;
      while (!predicate()) {
        if (performance.now() > deadline) throw new Error(`Playback timeout: ready=${video.readyState}, network=${video.networkState}, time=${video.currentTime}`);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    };
    try {
      void video.play().catch(() => {});
      await wait(() => video.currentTime > 0.6 && video.readyState >= 2);
      const initialTime = video.currentTime;
      const points = [...document.querySelectorAll('[data-seek]')];
      const point = points[Math.floor(points.length / 2)];
      const target = Number(point.dataset.seek);
      point.click();
      await wait(() => !video.seeking && video.currentTime >= target + 0.5);
      const active = document.querySelector('.transcript-line[aria-current="true"]');
      if (!active || video.currentTime < Number(active.dataset.start) || video.currentTime > Number(active.dataset.end) + 0.4) throw new Error('Subtitle highlight is not synchronized');
      if (scroll.scrollTop <= 0) throw new Error('Transcript did not follow playback');
      const before = video.currentTime;
      await wait(() => video.currentTime > before + 0.5);
      return { source: video.currentSrc, initialTime, seekTime: video.currentTime, activeCue: active.dataset.start, scrollTop: scroll.scrollTop, decodedFrames: video.getVideoPlaybackQuality().totalVideoFrames };
    } finally { video.pause(); }
  });
  if (result.decodedFrames === 0) throw new Error(`${slug}: no video frames decoded`);
  console.log('PASS', slug, result);
}
