// GET /api/epg/query?epg=1&channel=BBC&limit=50
// Server-side EPG XML parsing — returns only matched programmes as JSON.
// Avoids downloading 50-450 MB XML files to the browser.
import { json } from '@sveltejs/kit';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import type { RequestHandler } from './$types';

function outDir(): string {
  if (process.env.ONDACAST_TVPL_DIR) return process.env.ONDACAST_TVPL_DIR;
  for (const d of [
    resolve(process.cwd(), '..', 'static', 'tvpl'),
    resolve(process.cwd(), '..', '..', 'static', 'tvpl'),
    resolve(process.cwd(), 'static', 'tvpl'),
  ]) { try { return d; } catch { /* next */ } }
  return resolve(process.cwd(), 'static', 'tvpl');
}

interface Programme {
  channel: string;
  title: string;
  desc?: string;
  start: number; // epoch ms
  stop: number;
}

export const GET: RequestHandler = async ({ url }) => {
  const epgId = url.searchParams.get('epg') || '2';
  const channelFilter = (url.searchParams.get('channel') || '').toLowerCase();
  const limit = Math.min(Number(url.searchParams.get('limit') || '50'), 200);

  if (!channelFilter) {
    return json({ programmes: [], hint: 'Pass ?channel= to filter' });
  }

  const xmlPath = join(outDir(), `epg${epgId}.xml`);
  if (!existsSync(xmlPath)) {
    return json({ programmes: [], error: `epg${epgId}.xml not found` }, { status: 404 });
  }

  try {
    const xml = readFileSync(xmlPath, 'utf-8');
    const programmes: Programme[] = [];

    // Parse <programme> elements via regex (fast, doesn't build DOM)
    const progRegex = /<programme\s+([^>]+)>([\s\S]*?)<\/programme>/gi;
    let m;
    while ((m = progRegex.exec(xml)) !== null) {
      const attrs = m[1];
      const body = m[2];

      // Extract channel from attributes
      const chMatch = attrs.match(/channel="([^"]*)"/i);
      const channel = (chMatch?.[1] || '').toLowerCase();
      if (!channel.includes(channelFilter)) continue;

      // Extract start/stop times
      const startMatch = attrs.match(/start="(\d{14})\s*([+\-]\d{4})?"/i);
      const stopMatch = attrs.match(/stop="(\d{14})\s*([+\-]\d{4})?"/i);
      if (!startMatch || !stopMatch) continue;

      const start = parseXmltvDate(startMatch[1]);
      const stop = parseXmltvDate(stopMatch[1]);
      if (isNaN(start) || isNaN(stop)) continue;

      // Extract title and desc
      const titleMatch = body.match(/<title[^>]*>([^<]*)<\/title>/i);
      const descMatch = body.match(/<desc[^>]*>([^<]*)<\/desc>/i);

      programmes.push({
        channel: chMatch?.[1] || '',
        title: titleMatch?.[1]?.trim() || '(no title)',
        desc: descMatch?.[1]?.trim() || undefined,
        start,
        stop,
      });

      if (programmes.length >= limit) break;
    }

    return json({ programmes, total: programmes.length, truncated: programmes.length >= limit });
  } catch (err) {
    return json({ error: (err as Error).message }, { status: 500 });
  }
};

/** Parse XMLTV date format "YYYYMMDDHHMMSS" to epoch ms (UTC). */
function parseXmltvDate(d: string): number {
  const y = +d.slice(0, 4);
  const mo = +d.slice(4, 6) - 1;
  const da = +d.slice(6, 8);
  const h = +d.slice(8, 10);
  const mi = +d.slice(10, 12);
  const s = +d.slice(12, 14);
  return Date.UTC(y, mo, da, h, mi, s);
}
