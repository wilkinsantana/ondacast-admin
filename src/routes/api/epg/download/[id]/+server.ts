// GET /api/epg/download/[id] — serves the synced EPG XML file as a download.
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

export const GET: RequestHandler = async ({ params }) => {
  const id = params.id;
  if (!id || !/^\d+$/.test(id)) {
    return new Response('Invalid EPG id', { status: 400 });
  }
  try {
    const xml = readFileSync(join(findOutDir(), `epg${id}.xml`), 'utf-8');
    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Content-Disposition': `attachment; filename="epg${id}.xml"`,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch {
    return new Response('EPG file not found. Run Enrich EPG to sync.', { status: 404 });
  }
};
