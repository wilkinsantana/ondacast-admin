// GET /api/tv/curated — proxy to RadioDune curated TV channels (same server).
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch }) => {
  try {
    // RadioDune is on the same server — use internal DNS/hostname
    const r = await fetch('https://radiodune.com/api/tv/channels?limit=500', {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(30000),
    });
    if (!r.ok) throw new Error(`RadioDune HTTP ${r.status}`);
    const data = await r.json();
    return json(data);
  } catch (err) {
    return json({ channels: [], error: (err as Error).message }, { status: 502 });
  }
};
