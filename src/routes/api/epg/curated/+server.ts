// POST /api/epg/curated — writes curated channel overrides to shared tvpl dir.
// GET /api/epg/curated — reads overrides back.
import { json } from '@sveltejs/kit';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import type { RequestHandler } from './$types';

function outDir(): string {
  if (process.env.ONDACAST_TVPL_DIR) return process.env.ONDACAST_TVPL_DIR;
  for (const d of [
    '/data/tvpl',
    '/var/lib/ondacast/tvpl',
    '/var/ondacast/tvpl'
  ]) {
    try {
      mkdirSync(d, { recursive: true });
      return d;
    } catch {
      /* next */
    }
  }
  for (const d of [
    resolve(process.cwd(), '..', 'static', 'tvpl'),
    resolve(process.cwd(), '..', '..', 'static', 'tvpl'),
    resolve(process.cwd(), 'static', 'tvpl'),
  ]) { try { mkdirSync(d, { recursive: true }); return d; } catch { /* next */ } }
  const fb = resolve(process.cwd(), 'static', 'tvpl');
  mkdirSync(fb, { recursive: true });
  return fb;
}

export const GET: RequestHandler = async () => {
  const dir = outDir();
  const fp = join(dir, 'curated-overrides.json');
  if (!existsSync(fp)) {
    try {
      const r = await fetch('https://ondacast.com/tvpl/curated-overrides.json', {
        signal: AbortSignal.timeout(10_000)
      });
      if (r.ok) {
        const remote = await r.json();
        return json(remote);
      }
    } catch {
      /* fall through to empty */
    }
    return json({ overrides: {} });
  }
  try {
    const raw = readFileSync(fp, 'utf-8');
    return json(JSON.parse(raw));
  } catch {
    return json({ overrides: {} });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json() as { overrides?: Record<string, { epgUrl?: string; hidden?: boolean }> };
    const overrides = body.overrides || {};
    const ids: number[] = [];
    for (const ov of Object.values(overrides)) {
      if (!ov.epgUrl) continue;
      const m = ov.epgUrl.match(/epg(\d+)\.xml/);
      if (m) ids.push(Number(m[1]));
    }
    const uniqueIds = [...new Set(ids)].sort((a, b) => a - b);
    const dir = outDir();
    const payload = {
      updatedAt: new Date().toISOString(),
      epgIds: uniqueIds,
      overrides,
      channelCount: Object.keys(overrides).length,
    };
    writeFileSync(
      join(dir, 'curated-epg.json'),
      JSON.stringify({ updatedAt: payload.updatedAt, epgIds: uniqueIds, channelCount: payload.channelCount }, null, 2),
      'utf-8'
    );
    writeFileSync(join(dir, 'curated-overrides.json'), JSON.stringify(payload, null, 2), 'utf-8');
    return json({ ok: true, epgIds: uniqueIds.length, channelCount: Object.keys(overrides).length });
  } catch (err) {
    return json({ ok: false, error: (err as Error).message }, { status: 400 });
  }
};
