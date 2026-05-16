// GET /api/epg/status — returns last sync log (sync-log.json) if available.
import { json } from '@sveltejs/kit';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import type { RequestHandler } from './$types';

function findOutDir(): string {
  if (process.env.ONDACAST_TVPL_DIR) return process.env.ONDACAST_TVPL_DIR;
  for (const d of [
    resolve(process.cwd(), '..', 'static', 'tvpl'),
    resolve(process.cwd(), '..', '..', 'static', 'tvpl'),
    resolve(process.cwd(), 'static', 'tvpl'),
  ]) { try { mkdirSync(d, { recursive: true }); return d; } catch { /* next */ } }
  return resolve(process.cwd(), 'static', 'tvpl');
}

export const GET: RequestHandler = async () => {
  try {
    const log = JSON.parse(readFileSync(join(findOutDir(), 'sync-log.json'), 'utf-8'));
    return json(log);
  } catch {
    return json({ syncedAt: null, results: [] });
  }
};
