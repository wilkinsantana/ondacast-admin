<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { Download, RefreshCw, Radio, Copy, Check, Globe } from 'lucide-svelte';

  // ── M3U Playlists ──
  interface TVPlaylist {
    id: string;
    name: string;
    url: string;
    type: string;
    visible: boolean;
    channelCount?: number;
    lastSyncedAt?: number;
  }

  let playlists = $state<TVPlaylist[]>([]);
  let loading = $state(true);
  let exporting = $state(false);
  let exportError = $state('');
  let exportOk = $state('');

  // ── EPG Repository ──
  interface EpgEntry {
    id: number;
    owner: string;
    service: string;
    countries: string;
    categories: string;
    githubUrl: string;
    updated: string;
    clicks: number;
    localUrl?: string;
    syncSizeKB?: number;
    syncedAt?: string;
  }

  let epgEntries = $state<EpgEntry[]>([]);
  let epgLoading = $state(true);
  let epgLog = $state<{ syncedAt?: string; results?: { id: number; status: string; sizeKB?: number }[] }>({});

  onMount(async () => {
    await Promise.all([loadPlaylists(), loadEpgData()]);
  });

  // ── M3U functions ──
  async function loadPlaylists() {
    loading = true;
    try {
      const r = await fetch('/me/tv/playlists', { credentials: 'include' });
      if (r.ok) {
        const data = await r.json();
        playlists = (data.playlists ?? []).filter((p: TVPlaylist) => p.type === 'm3u');
      } else {
        const r2 = await fetch('/me', { credentials: 'include' });
        if (r2.ok) {
          const u = await r2.json();
          const tv = u?.user?.preferences?.tv ?? {};
          playlists = (tv.playlists ?? []).filter((p: TVPlaylist) => p.type === 'm3u');
        }
      }
    } catch { playlists = []; }
    finally { loading = false; }
  }

  async function exportUnified() {
    if (playlists.length === 0) return;
    exporting = true; exportError = ''; exportOk = '';
    const urls = playlists.map((p) => encodeURIComponent(p.url)).join(',');
    const names = playlists.map((p) => encodeURIComponent(p.name)).join(',');
    try {
      const r = await fetch(`/api/export/unified.m3u?urls=${urls}&names=${names}`, { credentials: 'include' });
      if (!r.ok) {
        const err = await r.json().catch(() => ({ error: `HTTP ${r.status}` }));
        exportError = err.error || err.details?.join('; ') || `Export failed (${r.status})`;
        return;
      }
      const blob = await r.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      const disposition = r.headers.get('Content-Disposition') || '';
      const match = disposition.match(/filename="?([^"]+)"?/);
      a.download = match?.[1] ?? 'ondacast-unified.m3u';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      const totalChannels = playlists.reduce((sum, p) => sum + (p.channelCount ?? 0), 0);
      exportOk = `Exported ~${totalChannels.toLocaleString()} channels from ${playlists.length} playlist${playlists.length > 1 ? 's' : ''}`;
    } catch (err) { exportError = `Export failed: ${(err as Error).message}`; }
    finally { exporting = false; }
  }

  // ── EPG functions ──
  async function loadEpgData() {
    epgLoading = true;
    try {
      // Load playlist metadata
      const r1 = await fetch('/tvpl/playlists.json');
      if (r1.ok) epgEntries = await r1.json();

      // Load sync log for status
      const r2 = await fetch('/tvpl/sync-log.json');
      if (r2.ok) {
        epgLog = await r2.json();
        // Merge sync sizes into entries
        if (epgLog.results) {
          const byId = new Map(epgLog.results.map((r: { id: number; status: string; sizeKB?: number }) => [r.id, r]));
          epgEntries = epgEntries.map((e) => {
            const sync = byId.get(e.id);
            return sync ? { ...e, syncSizeKB: sync.sizeKB, syncedAt: epgLog.syncedAt } : e;
          });
        }
      }
    } catch { /* EPG data not yet synced — that's fine */ }
    finally { epgLoading = false; }
  }

  let copiedId = $state<number | null>(null);
  function copyUrl(entry: EpgEntry) {
    const url = `https://ondacast.com/tvpl/epg${entry.id}.xml`;
    navigator.clipboard.writeText(url).then(() => {
      copiedId = entry.id;
      setTimeout(() => (copiedId = null), 2000);
    });
  }

  let totalChannels = $derived(playlists.reduce((sum, p) => sum + (p.channelCount ?? 0), 0));
  let epgSyncedCount = $derived(epgEntries.filter((e) => e.syncSizeKB).length);
</script>

<PageHead title="TV Playlists" sub={`${playlists.length} M3U · ${epgEntries.length} EPG`}>
  <Btn kind="primary" icon={Download} onclick={exportUnified} disabled={exporting || playlists.length === 0}>
    {exporting ? 'Exporting…' : 'Export Unified M3U'}
  </Btn>
  <Btn icon={RefreshCw} onclick={() => { loadPlaylists(); loadEpgData(); }} disabled={loading && epgLoading}>
    {loading && epgLoading ? 'Loading…' : 'Refresh'}
  </Btn>
</PageHead>

{#if exportError}
  <div class="banner banner-err" style="margin-top:16px">{exportError}</div>
{/if}
{#if exportOk}
  <div class="banner banner-ok" style="margin-top:16px">{exportOk}</div>
{/if}

<!-- ── EPG Repository ── -->
<div class="panel" style="margin-top:20px">
  <PanelHead icon={Globe} title="EPG Repository" sub={`${epgEntries.length} playlists · ${epgSyncedCount} synced${epgLog.syncedAt ? ` · Last sync: ${new Date(epgLog.syncedAt).toLocaleString()}` : ''}`} />

  {#if epgLoading}
    <div style="padding:40px;text-align:center;color:var(--ink-faint)">Loading EPG data…</div>
  {:else if epgEntries.length === 0}
    <div class="empty" style="padding:40px">
      <Globe size={32} style="color:var(--ink-faint)" />
      <h3>No EPG playlists loaded</h3>
      <p>Run <code>node scripts/sync-epg.cjs</code> to sync EPG files from GitHub.</p>
    </div>
  {:else}
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>Owner / Service</th>
          <th>Countries</th>
          <th>Categories</th>
          <th>Size</th>
          <th>EPG URL</th>
        </tr>
      </thead>
      <tbody>
        {#each epgEntries as entry}
          <tr>
            <td class="mono">{entry.id}</td>
            <td>
              <div style="font-weight:600">{entry.owner}</div>
              <div style="font-size:11px;color:var(--ink-faint)">{entry.service}</div>
            </td>
            <td style="font-size:11px;max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title={entry.countries}>
              {entry.countries}
            </td>
            <td style="font-size:10px;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title={entry.categories}>
              {entry.categories}
            </td>
            <td class="mono" style="font-size:11px">
              {#if entry.syncSizeKB}
                <Tag tone="" dot>{entry.syncSizeKB.toFixed(0)} KB</Tag>
              {:else}
                <span style="color:var(--ink-faint)">—</span>
              {/if}
            </td>
            <td>
              <button class="url-copy-btn" onclick={() => copyUrl(entry)} title="Copy EPG URL">
                {#if copiedId === entry.id}
                  <Check size={14} />
                {:else}
                  <Copy size={14} />
                {/if}
                <span class="mono" style="font-size:10px">epg{entry.id}.xml</span>
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </Table>
  {/if}
</div>

<!-- ── M3U Playlists ── -->
<div class="panel" style="margin-top:20px">
  <PanelHead icon={Radio} title="M3U Playlists" sub="User-added IPTV playlists available for export" />

  {#if loading}
    <div style="padding:40px;text-align:center;color:var(--ink-faint)">Loading playlists…</div>
  {:else if playlists.length === 0}
    <div class="empty" style="padding:40px">
      <Radio size={32} style="color:var(--ink-faint)" />
      <h3>No TV playlists found</h3>
      <p>Add M3U playlists in the OndaCast app (TV tab → Manage Playlists) to see them here.</p>
    </div>
  {:else}
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Source</th>
          <th style="text-align:right">Channels</th>
          <th>Last Synced</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {#each playlists as pl}
          <tr>
            <td class="name">{pl.name}</td>
            <td class="mono" style="font-size:11px;max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
              {pl.url}
            </td>
            <td class="mono" style="text-align:right">{pl.channelCount?.toLocaleString() ?? '—'}</td>
            <td class="mono" style="font-size:11px">
              {pl.lastSyncedAt ? new Date(pl.lastSyncedAt).toLocaleDateString() : 'Never'}
            </td>
            <td>
              <Tag tone={pl.visible ? '' : 'muted'} dot>
                {pl.visible ? 'Active' : 'Hidden'}
              </Tag>
            </td>
          </tr>
        {/each}
      </tbody>
    </Table>
  {/if}
</div>

<style>
  .banner {
    padding: 12px 16px; border-radius: 8px;
    font-family: var(--font-mono, monospace); font-size: 12px;
  }
  .banner-err { background: rgba(255,90,60,0.12); color: #ff8a70; border: 1px solid rgba(255,90,60,0.25); }
  .banner-ok { background: rgba(110,231,120,0.12); color: #6ee787; border: 1px solid rgba(110,231,120,0.25); }
  .empty { text-align: center; color: var(--ink-faint); }
  .empty h3 { margin: 12px 0 4px; font-size: 15px; color: var(--ink); }
  .empty p { font-size: 13px; }
  .url-copy-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--bg-2, #ecead9); border: 1px solid var(--hair, #e3dfd0);
    border-radius: 6px; padding: 6px 10px; cursor: pointer;
    font-family: var(--font-mono, monospace); font-size: 10px;
    color: var(--ink, #1a1814); transition: all 0.15s;
  }
  .url-copy-btn:hover { background: var(--bg, #f6f4ef); border-color: var(--ink-3, #8a8678); }
</style>
