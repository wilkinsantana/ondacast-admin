// POST /api/epg/curated â€” writes curated channel EPG map to shared tvpl dir.
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
    // Deduplicate EPG URLs — XMLTV is per-feed, not per-channel
    const uniqueUrls = [...new Set(Object.values(body).filter(Boolean))];
    const dir = outDir();
    const payload = {
      updatedAt: new Date().toISOString(),
      urls: uniqueUrls,
      channelCount: Object.keys(body).length,
    };
    writeFileSync(join(dir, 'curated-epg.json'), JSON.stringify(payload), 'utf-8');
    return json({ ok: true, urls: uniqueUrls.length, channelCount: Object.keys(body).length, path: join(dir, 'curated-epg.json') });
  } catch (err) {
    return json({ ok: false, error: (err as Error).message }, { status: 400 });
  }
};
