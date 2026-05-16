<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { Download, RefreshCw, Radio, Copy, Check, Globe } from 'lucide-svelte';

  interface TVPlaylist { id:string; name:string; url:string; type:string; visible:boolean; channelCount?:number; lastSyncedAt?:number; }
  let playlists = $state<TVPlaylist[]>([]);
  let loading = $state(true);
  let exporting = $state(false);
  let exportError = $state('');
  let exportOk = $state('');
  let selectedIds = $state<Set<string>>(new Set());
  let hotlinkUrl = $state('');
  let includeCurated = $state(true);
  let stats = $state<{raw:number;normalized:number;merges:{from:string;to:string}[]}|null>(null);

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

  let selectedList = $derived(selectedIds.size === 0 ? playlists : playlists.filter(p => selectedIds.has(p.id)));

  function toggleSelect(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    selectedIds = next;
  }
  function selectAll() { selectedIds = new Set(playlists.map(p => p.id)); }
  function selectNone() { selectedIds = new Set(); }

  async function exportUnified(save: boolean) {
    if (playlists.length === 0) return;
    const list = selectedList;
    if (list.length === 0 && !includeCurated) return;
    exporting = true; exportError = ''; exportOk = ''; hotlinkUrl = ''; stats = null;
    const urls = list.map(p => encodeURIComponent(p.url)).join(',');
    const names = list.map(p => encodeURIComponent(p.name)).join(',');
    const saveParam = save ? '&save=1&name=unified' : '';
    const s2Param = includeCurated ? '&s2=yes' : '';
    try {
      const r = await fetch(`/api/export/unified.m3u?urls=${urls}&names=${names}${saveParam}${s2Param}`, { credentials: 'include' });
      if (!r.ok) { const j = await r.json().catch(() => ({ error: `HTTP ${r.status}` })); exportError = j.error || j.details?.join('; ') || 'Export failed'; return; }
      const d = await r.json();
      if (!d.ok) { exportError = d.error || 'Export failed'; return; }
      stats = d.stats ?? null;
      if (save) {
        hotlinkUrl = d.url;
        exportOk = `Saved ${d.channels.toLocaleString()} channels.`;
      } else {
        const blob = new Blob([d.m3u], { type: 'audio/x-mpegurl' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'ondacast-unified.m3u';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        exportOk = `Downloaded ${d.channels.toLocaleString()} channels.`;
      }
    } catch (e) { exportError = `Export failed: ${(e as Error).message}`; }
    finally { exporting = false; }
  }

  let totalChannels = $derived(playlists.reduce((s,p) => s + (p.channelCount ?? 0), 0));
  let selectedChannels = $derived(selectedList.reduce((s,p) => s + (p.channelCount ?? 0), 0));
</script>

<PageHead title="TV Playlists" sub={`${playlists.length} playlists · ${totalChannels.toLocaleString()} channels`}>
  <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:var(--ink-mid,#c5b896)">
    <input type="checkbox" bind:checked={includeCurated} style="accent-color:#ffb454" /> Demo
  </label>
  <Btn kind="primary" icon={Download} onclick={() => exportUnified(false)} disabled={exporting || (selectedList.length === 0 && !includeCurated)}>
    {exporting ? 'Exporting…' : `Download M3U (${selectedChannels.toLocaleString()})`}
  </Btn>
  <Btn icon={Globe} onclick={() => exportUnified(true)} disabled={exporting || (selectedList.length === 0 && !includeCurated)}>
    {exporting ? 'Saving…' : 'Save & Hotlink'}
  </Btn>
  <Btn icon={RefreshCw} onclick={loadPlaylists} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Btn>
</PageHead>

{#if exportError}<div class="banner banner-err" style="margin-top:16px">{exportError}</div>{/if}
{#if exportOk}<div class="banner banner-ok" style="margin-top:16px">{exportOk}</div>{/if}
{#if hotlinkUrl}
  <div class="banner banner-ok" style="margin-top:8px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
    <span class="mono" style="font-size:11px;word-break:break-all">{hotlinkUrl}</span>
    <button class="url-copy-btn" onclick={() => navigator.clipboard.writeText(hotlinkUrl).then(() => { exportOk = 'Copied!'; setTimeout(() => exportOk = '', 1500); })}><Copy size={12} /> Copy</button>
  </div>
{/if}
{#if stats}
  <div class="banner banner-stats" style="margin-top:8px">
    <div class="stats-row"><span class="stats-label">Categories</span> <span class="stats-val">{stats.raw}</span> &rarr; <span class="stats-val stats-ok">{stats.normalized}</span> <span class="stats-saved">({stats.raw - stats.normalized} merged)</span></div>
    {#if stats.merges.length > 0}
      <details class="stats-details">
        <summary class="stats-summary">Show merges ({stats.merges.length})</summary>
        <div class="stats-merges">
          {#each stats.merges as m}
            <span class="merge-item"><code class="merge-from">{m.from}</code> &rarr; <code class="merge-to">{m.to}</code></span>
          {/each}
        </div>
      </details>
    {/if}
  </div>
{/if}

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Radio} title="M3U Playlists" sub="Check to select playlists for export. Unchecked = all." />
  {#if loading}
    <div style="padding:40px;text-align:center;color:var(--ink-faint)">Loading playlists…</div>
  {:else if playlists.length === 0}
    <div class="empty" style="padding:40px"><Radio size={32} style="color:var(--ink-faint)"/><h3>No TV playlists found</h3><p>Add M3U playlists in the OndaCast app (TV tab → Manage Playlists) to see them here.</p></div>
  {:else}
    <div style="display:flex;gap:8px;margin-bottom:8px">
      <button class="sel-btn" onclick={selectAll}>Select All</button>
      <button class="sel-btn" onclick={selectNone}>Deselect All</button>
    </div>
    <Table>
      <thead><tr><th style="width:30px"></th><th>Name</th><th>Source</th><th style="text-align:right">Channels</th><th>Last Synced</th><th>Status</th></tr></thead>
      <tbody>
        {#each playlists as pl}
          <tr>
            <td><input type="checkbox" checked={selectedIds.has(pl.id)} onchange={() => toggleSelect(pl.id)} style="cursor:pointer;accent-color:#ffb454" /></td>
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
  .sel-btn { background: none; border: 1px solid var(--line,#3d2f1f); color: var(--ink-mid,#c5b896); padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; }
  .sel-btn:hover { color: var(--ink,#f3ecdb); border-color: var(--line-bright,#5a4528); }
  .url-copy-btn { display: inline-flex; align-items: center; gap: 6px; background: #2a2218; border: 1px solid #3d2f1f; border-radius: 6px; padding: 6px 10px; cursor: pointer; font-family: var(--font-mono,monospace); font-size: 10px; color: #c5b896; transition: all 0.15s; }
  .url-copy-btn:hover { background: #3d2f1f; border-color: #5a4528; color: #f3ecdb; }
  .banner-stats { background: rgba(255,180,84,0.08); border: 1px solid rgba(255,180,84,0.2); color: #d4b87a; }
  .stats-row { display: flex; align-items: center; gap: 8px; font-size: 12px; }
  .stats-label { color: #8a7a5a; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; }
  .stats-val { font-weight: 600; color: #c5b896; font-size: 14px; }
  .stats-ok { color: #6ee787; }
  .stats-saved { color: #8a7a5a; font-size: 11px; }
  .stats-details { margin-top: 8px; }
  .stats-summary { cursor: pointer; font-size: 11px; color: #8a7a5a; }
  .stats-summary:hover { color: #c5b896; }
  .stats-merges { margin-top: 6px; display: flex; flex-wrap: wrap; gap: 4px 12px; max-height: 120px; overflow-y: auto; }
  .merge-item { font-size: 11px; white-space: nowrap; }
  .merge-from { color: #8a7a5a; background: rgba(138,122,90,0.15); padding: 1px 5px; border-radius: 3px; }
  .merge-to { color: #6ee787; background: rgba(110,231,120,0.12); padding: 1px 5px; border-radius: 3px; }
</style>
