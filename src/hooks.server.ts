import type { Handle } from '@sveltejs/kit';

const API_TARGET = 'https://api.ondacast.com';
const SMARTTV_TARGET = 'http://ondacast:80';

export const handle: Handle = async ({ event, resolve }) => {
  const p = event.url.pathname;

  // SmartTV — proxy to ondacast nginx container
  if (p.startsWith('/smartTV') || p === '/smartTV') {
    const url = `${SMARTTV_TARGET}${p}${event.url.search}`;
    const headers = new Headers(event.request.headers);
    headers.set('host', 'ondacast');
    headers.delete('connection');

    const res = await fetch(url, {
      method: event.request.method,
      headers,
      body: event.request.method !== 'GET' && event.request.method !== 'HEAD'
        ? await event.request.arrayBuffer()
        : undefined,
      redirect: 'manual',
    });

    // Strip content-encoding: fetch() decompresses transparently
    const outHeaders = new Headers(res.headers);
    outHeaders.delete('content-encoding');

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: outHeaders,
    });
  }

  const isApi = p === '/me' || p.startsWith('/me/') || p.startsWith('/auth/') || p.startsWith('/admin/') || p.startsWith('/announcements/');
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

    const outHeaders2 = new Headers(res.headers);
    outHeaders2.delete('content-encoding');
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: outHeaders2,
    });
  }

  return resolve(event);
};
