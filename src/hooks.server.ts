import type { Handle } from '@sveltejs/kit';

const API_TARGET = 'https://api.ondacast.com';

export const handle: Handle = async ({ event, resolve }) => {
  const p = event.url.pathname;
  const isApi = p === '/me' || p.startsWith('/me/') || p.startsWith('/auth/') || p.startsWith('/admin/');
  if (isApi) {
    const url = `${API_TARGET}${p}${event.url.search}`;
    const headers = new Headers(event.request.headers);
    headers.set('host', new URL(API_TARGET).host);
    headers.delete('connection');

    const res = await fetch(url, {
      method: event.request.method,
      headers,
      body: event.request.method !== 'GET' && event.request.method !== 'HEAD'
        ? await event.request.arrayBuffer()
        : undefined,
      redirect: 'manual',
    });

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
  }

  return resolve(event);
};
