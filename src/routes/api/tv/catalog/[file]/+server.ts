// GET /api/tv/catalog/[file] — proxy to ondacast.com static TV catalog files.
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch, params }) => {
  const file = params.file || 'manifest.json';
  try {
    const r = await fetch(`https://ondacast.com/tv/${file}`, {
      headers: { 'User-Agent': 'OndaCast-Admin/1.0' },
    });
    if (!r.ok) return new Response('Not found', { status: r.status });
    const body = await r.text();
    const contentType = r.headers.get('Content-Type') || 'application/octet-stream';
    return new Response(body, {
      status: 200,
      headers: { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return new Response((err as Error).message, { status: 502 });
  }
};
