<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { Download, RefreshCw, Radio } from 'lucide-svelte';

  interface TVPlaylist { id:string; name:string; url:string; type:string; visible:boolean; channelCount?:number; lastSyncedAt?:number; }
  let playlists = $state<TVPlaylist[]>([]);
  let loading = $state(true);
  let exporting = $state(false);
  let exportError = $state('');
  let exportOk = $state('');

  onMount(async () => { await loadPlaylists(); });

  async function loadPlaylists() {
    loading = true;
    try {
      const r = await fetch('/me/tv/playlists', { credentials: 'include' });
      if (r.ok) { playlists = (await r.json()).playlists?.filter((p:TVPlaylist) => p.type === 'm3u') ?? []; }
      else {
        const r2 = await fetch('/me', { credentials: 'include' });
        if (r2.ok) { const u = await r2.json(); playlists = (u?.user?.preferences?.tv?.playlists ?? []).filter((p:TVPlaylist) => p.type === 'm3u'); }
      }
    } catch { playlists = []; }
    finally { loading = false; }
  }

  async function exportUnified() {
    if (playlists.length === 0) return;
    exporting = true; exportError = ''; exportOk = '';
    const urls = playlists.map(p => encodeURIComponent(p.url)).join(',');
    const names = playlists.map(p => encodeURIComponent(p.name)).join(',');
    try {
      const r = await fetch(`/api/export/unified.m3u?urls=${urls}&names=${names}`, { credentials: 'include' });
      if (!r.ok) { const j = await r.json().catch(() => ({ error: `HTTP ${r.status}` })); exportError = j.error || j.details?.join('; ') || 'Export failed'; return; }
      const b = await r.blob(); const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = r.headers.get('Content-Disposition')?.match(/filename="?([^"]+)"?/)?.[1] ?? 'ondacast-unified.m3u';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      exportOk = `Exported ~${playlists.reduce((s,p) => s + (p.channelCount ?? 0), 0).toLocaleString()} channels from ${playlists.length} playlist${playlists.length > 1 ? 's' : ''}`;
    } catch (e) { exportError = `Export failed: ${(e as Error).message}`; }
    finally { exporting = false; }
  }

  let totalChannels = $derived(playlists.reduce((s,p) => s + (p.channelCount ?? 0), 0));
</script>

<PageHead title="TV Playlists" sub={`${playlists.length} playlists · ${totalChannels.toLocaleString()} channels`}>
  <Btn kind="primary" icon={Download} onclick={exportUnified} disabled={exporting || playlists.length === 0}>
    {exporting ? 'Exporting…' : 'Export Unified M3U'}
  </Btn>
  <Btn icon={RefreshCw} onclick={loadPlaylists} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Btn>
</PageHead>

{#if exportError}<div class="banner banner-err" style="margin-top:16px">{exportError}</div>{/if}
{#if exportOk}<div class="banner banner-ok" style="margin-top:16px">{exportOk}</div>{/if}

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Radio} title="M3U Playlists" sub="User-added IPTV playlists available for export" />
  {#if loading}
    <div style="padding:40px;text-align:center;color:var(--ink-faint)">Loading playlists…</div>
  {:else if playlists.length === 0}
    <div class="empty" style="padding:40px"><Radio size={32} style="color:var(--ink-faint)"/><h3>No TV playlists found</h3><p>Add M3U playlists in the OndaCast app (TV tab → Manage Playlists) to see them here.</p></div>
  {:else}
    <Table>
      <thead><tr><th>Name</th><th>Source</th><th style="text-align:right">Channels</th><th>Last Synced</th><th>Status</th></tr></thead>
      <tbody>
        {#each playlists as pl}
          <tr>
            <td class="name">{pl.name}</td>
            <td class="mono" style="font-size:11px;max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{pl.url}</td>
            <td class="mono" style="text-align:right">{pl.channelCount?.toLocaleString() ?? '—'}</td>
            <td class="mono" style="font-size:11px">{pl.lastSyncedAt ? new Date(pl.lastSyncedAt).toLocaleDateString() : 'Never'}</td>
            <td><Tag tone={pl.visible ? '' : 'muted'} dot>{pl.visible ? 'Active' : 'Hidden'}</Tag></td>
          </tr>
        {/each}
      </tbody>
    </Table>
  {/if}
</div>

<style>
  .banner { padding: 12px 16px; border-radius: 8px; font-family: var(--font-mono, monospace); font-size: 12px; }
  .banner-err { background: rgba(255,90,60,0.12); color: #ff8a70; border: 1px solid rgba(255,90,60,0.25); }
  .banner-ok { background: rgba(110,231,120,0.12); color: #6ee787; border: 1px solid rgba(110,231,120,0.25); }
  .empty { text-align: center; color: var(--ink-faint); }
  .empty h3 { margin: 12px 0 4px; font-size: 15px; color: var(--ink); }
  .empty p { font-size: 13px; }
</style>
