// GET /api/export/unified.m3u?urls=...&names=...
// Fetches one or more M3U playlist URLs, re-parses each channel with
// proper tvg-logo / group-title attributes, and returns a unified M3U
// file suitable for import into IPTV players (TiviMate, VLC, etc.).
//
// Query params:
//   urls  — comma-separated, URL-encoded M3U playlist URLs (required)
//   names — comma-separated playlist names for group-title labelling (optional)
//
// Response: audio/mpegurl with Content-Disposition: attachment

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// ── Minimal server-side M3U parser (mirrors client-side parseM3U) ──

interface ParsedChannel {
  name: string;
  logoUrl: string;
  group: string;
  url: string;
  tvgId: string;
}

function findNameComma(line: string): number {
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') inQuotes = !inQuotes;
    if (line[i] === ',' && !inQuotes) return i;
  }
  return -1;
}

function parseAttrs(line: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /([a-zA-Z0-9_-]+)\s*=\s*(?:"([^"]*)"|([^\s,]+))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    out[m[1].toLowerCase()] = m[2] ?? m[3] ?? '';
  }
  return out;
}

function cleanName(raw: string): string {
  return raw
    .replace(/\s*\(\d{3,4}p\)/gi, '')
    .replace(/\s*\(SD\)/gi, '')
    .replace(/\s*\(HD\)/gi, '')
    .replace(/[\u24C8\u24C9]/g, '')
    .trim();
}

function parseM3UBody(body: string): ParsedChannel[] {
  const lines = body.split(/\r?\n/);
  const channels: ParsedChannel[] = [];
  let pendingMeta: { name: string; attrs: Record<string, string> } | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith('#EXTINF')) {
      const commaIdx = findNameComma(line);
      const beforeComma = commaIdx >= 0 ? line.slice(0, commaIdx) : line;
      const afterComma = commaIdx >= 0 ? line.slice(commaIdx + 1).trim() : '';
      pendingMeta = { name: afterComma, attrs: parseAttrs(beforeComma) };
      continue;
    }

    if (line.startsWith('#')) continue;

    // Stream URL
    if (!pendingMeta) continue;
    const url = line;
    const rawName = pendingMeta.name || pendingMeta.attrs['tvg-name'] || 'Channel';
    const name = cleanName(rawName);
    const logoUrl = pendingMeta.attrs['tvg-logo'] || '';
    const group = pendingMeta.attrs['group-title'] || '';
    const tvgId = pendingMeta.attrs['tvg-id'] || pendingMeta.attrs['channel-id'] || '';

    channels.push({ name, logoUrl, group, url, tvgId });
    pendingMeta = null;
  }

  return channels;
}

function buildM3ULine(ch: ParsedChannel, playlistLabel: string, counter: number): string {
  const parts: string[] = [];
  parts.push(`#EXTINF:-1 tvg-chno="${counter}"`);
  if (ch.tvgId) parts.push(`tvg-id="${ch.tvgId}"`);
  if (ch.logoUrl) parts.push(`tvg-logo="${ch.logoUrl}"`);
  parts.push(`group-title="${ch.group || playlistLabel}"`);
  parts.push(`,${ch.name}`);
  return parts.join(' ');
}

export const GET: RequestHandler = async ({ url, fetch }) => {
  const urlsParam = url.searchParams.get('urls');
  const namesParam = url.searchParams.get('names');

  if (!urlsParam) {
    return json({ error: 'Missing ?urls= parameter (comma-separated M3U URLs)' }, { status: 400 });
  }

  const urls = urlsParam.split(',').map((u) => decodeURIComponent(u.trim())).filter(Boolean);
  const names = namesParam
    ? namesParam.split(',').map((n) => decodeURIComponent(n.trim())).filter(Boolean)
    : urls.map((u) => {
        try { return new URL(u).hostname.replace(/^www\./, ''); }
        catch { return 'Playlist'; }
      });

  const allChannels: ParsedChannel[] = [];
  const errors: string[] = [];

  for (let i = 0; i < urls.length; i++) {
    const playlistUrl = urls[i];
    const playlistLabel = names[i] || `Playlist ${i + 1}`;

    try {
      const res = await fetch(playlistUrl, {
        headers: { 'User-Agent': 'OndaCast-Admin/1.0' },
        signal: AbortSignal.timeout(30_000),
      });

      if (!res.ok) {
        errors.push(`${playlistLabel}: HTTP ${res.status}`);
        continue;
      }

      const body = await res.text();
      if (!body.includes('#EXTM3U') && !body.includes('#EXTINF')) {
        errors.push(`${playlistLabel}: not a valid M3U`);
        continue;
      }

      const channels = parseM3UBody(body);
      allChannels.push(...channels);
    } catch (err) {
      errors.push(`${playlistLabel}: ${(err as Error).message}`);
    }
  }

  if (allChannels.length === 0) {
    return json({
      error: 'No channels extracted from any playlist',
      details: errors,
    }, { status: 422 });
  }

  // Build unified M3U
  const lines: string[] = ['#EXTM3U'];
  let counter = 1;
  for (const ch of allChannels) {
    lines.push(buildM3ULine(ch, names[0] || 'OndaCast', counter));
    lines.push(ch.url);
    counter++;
  }

  const m3uBody = lines.join('\n') + '\n';
  const filename = `ondacast-unified-${new Date().toISOString().slice(0, 10)}.m3u`;

  return new Response(m3uBody, {
    status: 200,
    headers: {
      'Content-Type': 'audio/x-mpegurl; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(new TextEncoder().encode(m3uBody).length),
    },
  });
};
