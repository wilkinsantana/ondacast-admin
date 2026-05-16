// POST /api/epg/curated - writes curated channel EPG map to shared tvpl dir.
import { json } from '@sveltejs/kit';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import type { RequestHandler } from './$types';

function outDir(): string {
  if (process.env.ONDACAST_TVPL_DIR) return process.env.ONDACAST_TVPL_DIR;
  for (const d of [
    resolve(process.cwd(), '..', 'static', 'tvpl'),
    resolve(process.cwd(), '..', '..', 'static', 'tvpl'),
    resolve(process.cwd(), 'static', 'tvpl'),
  ]) { try { mkdirSync(d, { recursive: true }); return d; } catch { /* next */ } }
  const fb = resolve(process.cwd(), 'static', 'tvpl');
  mkdirSync(fb, { recursive: true });
  return fb;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json() as Record<string, string>;
    const ids: number[] = [];
    for (const url of Object.values(body)) {
      if (!url) continue;
      const m = url.match(/epg(\d+)\.xml/);
      if (m) ids.push(Number(m[1]));
    }
    const uniqueIds = [...new Set(ids)].sort((a, b) => a - b);
    const dir = outDir();
    const payload = {
      updatedAt: new Date().toISOString(),
      epgIds: uniqueIds,
      channelCount: Object.keys(body).length,
    };
    writeFileSync(join(dir, 'curated-epg.json'), JSON.stringify(payload), 'utf-8');
    return json({ ok: true, epgIds: uniqueIds.length, channelCount: Object.keys(body).length });
  } catch (err) {
    return json({ ok: false, error: (err as Error).message }, { status: 400 });
  }
};
