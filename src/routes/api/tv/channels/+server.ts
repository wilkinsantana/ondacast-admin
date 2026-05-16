// GET /api/tv/channels — proxy to RadioDune curated TV catalog.
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch, url }) => {
  const limit = url.searchParams.get('limit') || '500';
  try {
    const r = await fetch(`https://radiodune.com/api/tv/channels?limit=${limit}`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!r.ok) throw new Error(`RadioDune HTTP ${r.status}`);
    const data = await r.json();
    return json(data);
  } catch (err) {
    return json({ channels: [], error: (err as Error).message }, { status: 502 });
  }
};
