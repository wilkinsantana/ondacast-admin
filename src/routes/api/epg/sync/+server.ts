// POST /api/epg/sync[?id=N]
// Manually triggers EPG sync. Downloads .xml.gz from GitHub,
// decompresses, writes .xml to the tvpl output directory.

import { json } from '@sveltejs/kit';
import { gunzipSync } from 'node:zlib';
import { writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { resolve, join } from 'node:path';
import type { RequestHandler } from './$types';

// ── Embedded playlist metadata (from epgenius.org) ──
const PLAYLISTS = [
  { id:1, owner:"Ferteque", service:"Strong 8k", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg1.xml.gz" },
  { id:2, owner:"jams", service:"Strong 8k", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg2.xml.gz" },
  { id:6, owner:"GanjaRelease", service:"Strong 8k", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg6.xml.gz" },
  { id:8, owner:"GanjaRelease", service:"Lion", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg8.xml.gz" },
  { id:9, owner:"GanjaRelease", service:"Trex", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg9.xml.gz" },
  { id:13, owner:"Ferteque", service:"Strong 8k", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg13.xml.gz" },
  { id:14, owner:"tropaz", service:"Strong 8k", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg14.xml.gz" },
  { id:15, owner:"tropaz", service:"Trex", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg15.xml.gz" },
  { id:28, owner:"z06tim", service:"Eagle4k/Dream4k", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg28.xml.gz" },
  { id:29, owner:"z06tim", service:"B1G", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg29.xml.gz" },
  { id:31, owner:"Safinn", service:"Strong 8k", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg31.xml.gz" },
  { id:32, owner:"riaba-aggr", service:"Strong 8k", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg32.xml.gz" },
  { id:37, owner:"diZMunky", service:"Magnum/Golden", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg37.xml.gz" },
  { id:38, owner:"Koalamanx", service:"Strong 8k", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg38.xml.gz" },
  { id:41, owner:"SemperSolus", service:"Dream 4k/Eagle 4k", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg41.xml.gz" },
  { id:42, owner:"Koalamanx", service:"Strong 8k", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg42.xml.gz" },
  { id:43, owner:"gtbinh", service:"Strong 8k", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg43.xml.gz" },
  { id:47, owner:"Pietro395", service:"Strong 8k", githubUrl:"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg47.xml.gz" },
];

// ── Find writable output directory ──
function findOutDir(): string {
  if (process.env.ONDACAST_TVPL_DIR) {
    mkdirSync(process.env.ONDACAST_TVPL_DIR, { recursive: true });
    return process.env.ONDACAST_TVPL_DIR;
  }
  const tries = [
    resolve(process.cwd(), '..', 'static', 'tvpl'),
    resolve(process.cwd(), '..', '..', 'static', 'tvpl'),
    resolve(process.cwd(), 'static', 'tvpl'),
  ];
  for (const d of tries) {
    try { mkdirSync(d, { recursive: true }); return d; } catch { /* next */ }
  }
  const fb = resolve(process.cwd(), 'static', 'tvpl');
  mkdirSync(fb, { recursive: true });
  return fb;
}

const OUT_DIR = findOutDir();

async function downloadGz(url: string): Promise<Buffer> {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'OndaCast-Admin/1.0' },
    signal: AbortSignal.timeout(60_000),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

async function syncOne(entry: { id: number; githubUrl: string }): Promise<{ id: number; status: string; sizeKB?: number; error?: string }> {
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
  const toSync = idParam
    ? PLAYLISTS.filter((p) => String(p.id) === idParam)
    : PLAYLISTS;

  if (toSync.length === 0) {
    return json({ ok: false, error: `No playlist id=${idParam}` }, { status: 404 });
  }

  console.log(`[epg-sync] Triggered ${toSync.length} playlist(s) → ${OUT_DIR}`);

  try {
    for (const f of readdirSync(OUT_DIR)) {
      if (f.endsWith('.xml.gz')) unlinkSync(join(OUT_DIR, f));
    }
  } catch { /* ok */ }

  const results = [];
  for (const entry of toSync) {
    results.push(await syncOne(entry));
  }

  const ok = results.filter((r) => r.status === 'ok').length;
  const fail = results.filter((r) => r.status === 'error').length;

  try {
    writeFileSync(join(OUT_DIR, 'sync-log.json'), JSON.stringify({ syncedAt: new Date().toISOString(), outDir: OUT_DIR, results }, null, 2), 'utf-8');
  } catch { /* non-fatal */ }

  return json({ ok: fail === 0, synced: ok, failed: fail, outDir: OUT_DIR, results });
};
