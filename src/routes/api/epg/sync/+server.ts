// POST /api/epg/sync[?id=N]
// Manually triggers EPG sync. Downloads .xml.gz from GitHub,
// decompresses with zlib, writes .xml to static/tvpl/.

import { json } from '@sveltejs/kit';
import { gunzipSync } from 'node:zlib';
import { writeFileSync, mkdirSync, readdirSync, unlinkSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import type { RequestHandler } from './$types';

// Output directory — relative to admin server CWD (repo root in monorepo).
const OUT_DIR = (() => {
  const repoDir = resolve(process.cwd(), '..', '..');
  const candidate = resolve(repoDir, 'static', 'tvpl');
  try { mkdirSync(candidate, { recursive: true }); return candidate; }
  catch { return resolve(process.cwd(), 'static', 'tvpl'); }
})();

interface EpgEntry {
  id: number;
  githubUrl: string;
  owner: string;
  service: string;
}

async function downloadGz(url: string): Promise<Buffer> {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'OndaCast-Admin/1.0' },
    signal: AbortSignal.timeout(60_000),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

async function syncOne(entry: EpgEntry): Promise<{ id: number; status: string; sizeKB?: number; error?: string }> {
  const xmlPath = join(OUT_DIR, `epg${entry.id}.xml`);
  const gzPath = join(OUT_DIR, `epg${entry.id}.xml.gz`);
  try {
    const gzBuf = await downloadGz(entry.githubUrl);
    const xml = gunzipSync(gzBuf).toString('utf-8');
    writeFileSync(xmlPath, xml, 'utf-8');
    try { unlinkSync(gzPath); } catch { /* ok */ }
    const sizeKB = Buffer.byteLength(xml, 'utf-8') / 1024;
    console.log(`[epg-sync] epg${entry.id}.xml  OK  (${sizeKB.toFixed(0)} KB)`);
    return { id: entry.id, status: 'ok', sizeKB: Math.round(sizeKB) };
  } catch (err) {
    console.error(`[epg-sync] epg${entry.id}.xml  FAIL  ${(err as Error).message}`);
    try { unlinkSync(gzPath); } catch { /* ok */ }
    return { id: entry.id, status: 'error', error: (err as Error).message };
  }
}

export const POST: RequestHandler = async ({ url }) => {
  const idParam = url.searchParams.get('id');

  let playlists: EpgEntry[];
  try {
    playlists = JSON.parse(readFileSync(join(OUT_DIR, 'playlists.json'), 'utf-8'));
  } catch {
    return json({ ok: false, error: 'playlists.json not found' }, { status: 400 });
  }

  const toSync = idParam
    ? playlists.filter((p) => String(p.id) === idParam)
    : playlists;

  if (toSync.length === 0) {
    return json({ ok: false, error: `No playlist id=${idParam}` }, { status: 404 });
  }

  console.log(`[epg-sync] Triggered ${toSync.length} playlist(s)`);

  // Garbage collect stale .gz files
  for (const f of readdirSync(OUT_DIR)) {
    if (f.endsWith('.xml.gz')) unlinkSync(join(OUT_DIR, f));
  }

  const results = [];
  for (const entry of toSync) {
    console.log(`[epg-sync] [${entry.id}] ${entry.owner} | ${entry.service}`);
    results.push(await syncOne(entry));
  }

  const ok = results.filter((r) => r.status === 'ok').length;
  const fail = results.filter((r) => r.status === 'error').length;

  writeFileSync(
    join(OUT_DIR, 'sync-log.json'),
    JSON.stringify({ syncedAt: new Date().toISOString(), results }, null, 2),
    'utf-8'
  );

  return json({ ok: fail === 0, synced: ok, failed: fail, results });
};
