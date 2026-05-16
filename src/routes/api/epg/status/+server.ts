// GET /api/epg/status — returns sync status with file-existence checks.
import { json } from '@sveltejs/kit';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import type { RequestHandler } from './$types';

const EPG_IDS = [1,2,6,8,9,13,14,15,28,29,31,32,37,38,41,42,43,47];

function findOutDir(): string {
  if (process.env.ONDACAST_TVPL_DIR) {
    mkdirSync(process.env.ONDACAST_TVPL_DIR, { recursive: true });
    return process.env.ONDACAST_TVPL_DIR;
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
  const dir = findOutDir();

  const files: { id: number; exists: boolean; sizeKB?: number }[] = [];
  for (const id of EPG_IDS) {
    const p = join(dir, `epg${id}.xml`);
    if (existsSync(p)) {
      files.push({ id, exists: true, sizeKB: Math.round(statSync(p).size / 1024) });
    } else {
      files.push({ id, exists: false });
    }
  }

  let syncedAt: string | null = null;
  try {
    const log = JSON.parse(readFileSync(join(dir, 'sync-log.json'), 'utf-8'));
    syncedAt = log.syncedAt || null;
  } catch { /* ok */ }

  return json({
    dir,
    syncedAt,
    persisted: !!process.env.ONDACAST_TVPL_DIR,
    total: files.length,
    present: files.filter(f => f.exists).length,
    missing: files.filter(f => !f.exists).length,
    files,
  });
};
