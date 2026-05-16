// GET /api/epg/download/[id] — serves EPG XML, auto-fetching from GitHub if missing.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { resolve, join } from 'node:path';
import type { RequestHandler } from './$types';

const URLS: Record<string, string> = {
  "1":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg1.xml.gz",
  "2":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg2.xml.gz",
  "6":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg6.xml.gz",
  "8":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg8.xml.gz",
  "9":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg9.xml.gz",
  "13":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg13.xml.gz",
  "14":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg14.xml.gz",
  "15":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg15.xml.gz",
  "28":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg28.xml.gz",
  "29":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg29.xml.gz",
  "31":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg31.xml.gz",
  "32":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg32.xml.gz",
  "37":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg37.xml.gz",
  "38":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg38.xml.gz",
  "41":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg41.xml.gz",
  "42":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg42.xml.gz",
  "43":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg43.xml.gz",
  "47":"https://github.com/ferteque/Curated-M3U-Repository/raw/refs/heads/main/epg47.xml.gz",
};

function outDir(): string {
  if (process.env.ONDACAST_TVPL_DIR) return process.env.ONDACAST_TVPL_DIR;
  const d = resolve(process.cwd(), 'static', 'tvpl');
  mkdirSync(d, { recursive: true });
  return d;
}

export const GET: RequestHandler = async ({ params }) => {
  const id = params.id;
  if (!id || !URLS[id]) return new Response('Unknown EPG id', { status: 404 });
  const dir = outDir();
  const xmlPath = join(dir, `epg${id}.xml`);
  if (existsSync(xmlPath)) {
    return new Response(readFileSync(xmlPath, 'utf-8'), {
      status: 200,
      headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
    });
  }
  try {
    const r = await fetch(URLS[id], { headers: { 'User-Agent': 'OndaCast-Admin/1.0' }, signal: AbortSignal.timeout(60000) });
    if (!r.ok) throw new Error('GitHub HTTP ' + r.status);
    const gzBuf = Buffer.from(await r.arrayBuffer());
    const xml = gunzipSync(gzBuf).toString('utf-8');
    try { writeFileSync(xmlPath, xml, 'utf-8'); } catch { /* ok */ }
    return new Response(xml, {
      status: 200,
      headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return new Response('Failed: ' + (err as Error).message, { status: 502 });
  }
};
