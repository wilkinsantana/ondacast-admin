<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { RefreshCw, Monitor, Globe, Zap } from 'lucide-svelte';

  const EPG_PLAYLISTS = [
    { id:1, owner:"Ferteque", service:"Strong 8k", countries:"Spain", categories:"Football and TV", url:"https://ondacast.com/tvpl/epg1.xml" },
    { id:2, owner:"jams", service:"Strong 8k", countries:"Canada,United Kingdom,United States", categories:"Live TV; Major Sports; PPV; Local Channels; 24/7", url:"https://ondacast.com/tvpl/epg2.xml" },
    { id:6, owner:"GanjaRelease", service:"Strong 8k", countries:"Australia,Canada,Ireland,New Zealand,United Kingdom,United States", categories:"Sports; Live TV", url:"https://ondacast.com/tvpl/epg6.xml" },
    { id:8, owner:"GanjaRelease", service:"Lion", countries:"United Kingdom,United States", categories:"TV Guide, Sports, Kids, NFL, NBA, MLB, NHL, Football, 24/7", url:"https://ondacast.com/tvpl/epg8.xml" },
    { id:9, owner:"GanjaRelease", service:"Trex", countries:"Canada,United Kingdom,United States", categories:"TV Guide (USA) NFL, NBA, MLB, College Football, Sky Sports", url:"https://ondacast.com/tvpl/epg9.xml" },
    { id:13, owner:"Ferteque", service:"Strong 8k", countries:"Brazil", categories:"Sports, Entertainment, Big Brother, Documentarios, Kids", url:"https://ondacast.com/tvpl/epg13.xml" },
    { id:14, owner:"tropaz", service:"Strong 8k", countries:"Ireland,United Kingdom,United States", categories:"Ireland,UK & USA TV, Sport, Irish Sports", url:"https://ondacast.com/tvpl/epg14.xml" },
    { id:15, owner:"tropaz", service:"Trex", countries:"Ireland,United Kingdom,United States", categories:"Ireland,UK & USA TV, Sport, Irish Sports", url:"https://ondacast.com/tvpl/epg15.xml" },
    { id:28, owner:"z06tim", service:"Eagle4k/Dream4k", countries:"Canada,United Kingdom,United States", categories:"Entertainment, Sports, PPV", url:"https://ondacast.com/tvpl/epg28.xml" },
    { id:29, owner:"z06tim", service:"B1G", countries:"Canada,United Kingdom,United States", categories:"Entertainment, Sports, PPV", url:"https://ondacast.com/tvpl/epg29.xml" },
    { id:31, owner:"Safinn", service:"Strong 8k", countries:"Cyprus,Greece", categories:"TV Guide (CY, GR)", url:"https://ondacast.com/tvpl/epg31.xml" },
    { id:32, owner:"riaba-aggr", service:"Strong 8k", countries:"Austria,Germany,Switzerland", categories:"German EPG, Magenta, JOYN, PRIME, sports", url:"https://ondacast.com/tvpl/epg32.xml" },
    { id:37, owner:"diZMunky", service:"Magnum/Golden", countries:"Antarctica,Australia,Austria,Canada,Germany,Ireland,New Zealand,Switzerland,United Kingdom,United States", categories:"US Sports, Intl Sports, PPV, F1, EPL, UEFA", url:"https://ondacast.com/tvpl/epg37.xml" },
    { id:38, owner:"Koalamanx", service:"Strong 8k", countries:"Austria,Germany,Switzerland", categories:"Bundesliga 4K, DAZN, Sky, PPV+, General TV, JOYN", url:"https://ondacast.com/tvpl/epg38.xml" },
    { id:41, owner:"SemperSolus", service:"Dream 4k/Eagle 4k", countries:"Mexico,United Kingdom,United States", categories:"Spanish TV & Sports, US CA UK Sports, PPV", url:"https://ondacast.com/tvpl/epg41.xml" },
    { id:42, owner:"Koalamanx", service:"Strong 8k", countries:"Caribbean LATAM,Portuguese LATAM,Spanish LATAM", categories:"LATAM Premium 4K/FHD, Deportes, Cine, Series", url:"https://ondacast.com/tvpl/epg42.xml" },
    { id:43, owner:"gtbinh", service:"Strong 8k", countries:"Vietnam", categories:"Vietnam", url:"https://ondacast.com/tvpl/epg43.xml" },
    { id:47, owner:"Pietro395", service:"Strong 8k", countries:"Italy", categories:"Live TV, Sport, Movies", url:"https://ondacast.com/tvpl/epg47.xml" },
  ];

  interface CuratedChannel {
    id: string; name: string; number?: number; logo?: string;
    categories?: string[]; country?: string; streamUrl: string;
    streamType?: string; epgUrl?: string; hidden?: boolean;
  }
  let channels = $state<CuratedChannel[]>([]);
  let loading = $state(true);
  let filterText = $state('');
  let page = $state(1);
  let pageSize = $state(50);
  const PAGE_SIZES = [50, 100, 150, 200];
  let epgEditing = $state<string | null>(null);
  let epgValue = $state('');

  const OVERRIDES_KEY = 'oc.admin.tv.overrides';
  interface ChannelOverride { epgUrl?: string; hidden?: boolean; }
  let overrides = $state<Record<string, ChannelOverride>>({});
  let selectedEpgId = $state<number>(2);
  let bulkMsg = $state('');

  onMount(async () => { loadOverrides(); await loadChannels(); });

  function loadOverrides() {
    try { overrides = JSON.parse(localStorage.getItem(OVERRIDES_KEY) ?? '{}'); }
    catch { overrides = {}; }
  }
  function saveOverrides() {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
  }

  async function syncCuratedEpgToServer() {
    // Build { channelId: epgUrl } map for all channels with EPG assigned
    const map: Record<string, string> = {};
    for (const [id, ov] of Object.entries(overrides)) {
      if (ov.epgUrl) map[id] = ov.epgUrl;
    }
    try {
      const r = await fetch('/api/epg/curated', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(map),
      });
      if (r.ok) {
        bulkMsg = `Synced ${Object.keys(map).length} EPG assignments to ondacast.com/tvpl/curated-epg.json`;
        setTimeout(() => (bulkMsg = ''), 5000);
      } else {
        bulkMsg = `Sync failed: HTTP ${r.status}`;
        setTimeout(() => (bulkMsg = ''), 5000);
      }
    } catch (e) {
      bulkMsg = `Sync error: ${(e as Error).message}`;
      setTimeout(() => (bulkMsg = ''), 5000);
    }
  }

  function toggleHidden(id: string) {
    const curr = overrides[id]?.hidden ?? false;
    overrides = { ...overrides, [id]: { ...overrides[id], hidden: !curr } };
    saveOverrides();
  }
  function startEpgEdit(id: string) { epgEditing = id; epgValue = overrides[id]?.epgUrl ?? ''; }
  function saveEpg(id: string) {
    overrides = { ...overrides, [id]: { ...overrides[id], epgUrl: epgValue || undefined } };
    saveOverrides();
    epgEditing = null;
  }

  async function loadChannels() {
    loading = true;
    try {
      const r = await fetch('/api/tv/curated', { credentials: 'include' });
      if (r.ok) {
        const data = await r.json();
        channels = (data.channels ?? []).map((c: CuratedChannel) => ({ ...c, ...(overrides[c.id] ?? {}) }));
      }
    } catch { channels = []; }
    finally { loading = false; }
  }

  function applyEpgToAll() {
    const epg = EPG_PLAYLISTS.find(e => e.id === selectedEpgId);
    if (!epg) return;
    const next = { ...overrides };
    for (const ch of channels) next[ch.id] = { ...next[ch.id], epgUrl: epg.url };
    overrides = next;
    saveOverrides();
    channels = channels.map(c => ({ ...c, epgUrl: epg.url }));
    bulkMsg = `Set EPG #${epg.id} (${epg.owner}) on ${channels.length.toLocaleString()} channels`;
    setTimeout(() => (bulkMsg = ''), 5000);
  }

  function autoMatchEpg() {
    const next = { ...overrides };
    let matched = 0;
    for (const ch of channels) {
      let bestScore = -1;
      let bestUrl = '';
      for (const epg of EPG_PLAYLISTS) {
        let score = 0;
        const epgCountries = epg.countries.toLowerCase().split(',').map(s => s.trim());
        const epgCats = epg.categories.toLowerCase().split(/[,;]/).map(s => s.trim());
        if (ch.country) {
          const cc = ch.country.toLowerCase();
          for (const ec of epgCountries) if (cc.includes(ec) || ec.includes(cc)) score += 10;
        }
        if (ch.categories) {
          for (const cat of ch.categories.map(c => c.toLowerCase())) {
            for (const ec of epgCats) if (cat.includes(ec) || ec.includes(cat)) score += 3;
          }
        }
        if (!ch.country && (epg.countries.includes('United States') || epg.countries.includes('United Kingdom'))) score += 2;
        if (score > bestScore) { bestScore = score; bestUrl = epg.url; }
      }
      if (bestUrl && bestScore > 0) { next[ch.id] = { ...next[ch.id], epgUrl: bestUrl }; matched++; }
    }
    overrides = next;
    saveOverrides();
    channels = channels.map(c => ({ ...c, epgUrl: next[c.id]?.epgUrl }));
    bulkMsg = `Auto-matched EPG for ${matched.toLocaleString()} of ${channels.length.toLocaleString()} channels`;
    setTimeout(() => (bulkMsg = ''), 6000);
  }

  let filtered = $derived(
    filterText
      ? channels.filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()) || (c.categories ?? []).some(cat => cat.toLowerCase().includes(filterText.toLowerCase())))
      : channels
  );
  let hiddenCount = $derived(Object.values(overrides).filter(o => o.hidden).length);
  let epgCount = $derived(Object.values(overrides).filter(o => o.epgUrl).length);
  let totalPages = $derived(Math.ceil(filtered.length / pageSize) || 1);
  let paged = $derived(filtered.slice((page - 1) * pageSize, page * pageSize));


</script>

<PageHead title="TV Channels" sub={`${channels.length} curated channels · ${hiddenCount} hidden · ${epgCount} with EPG`}>
  <Btn icon={RefreshCw} onclick={loadChannels} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Btn>
</PageHead>

<div class="panel" style="margin-top:16px">
  <PanelHead icon={Zap} title="Bulk EPG Assignment" sub="Assign EPG to all curated channels at once." />
  <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:4px">
    <select class="epg-select" bind:value={selectedEpgId}>
      {#each EPG_PLAYLISTS as epg}
        <option value={epg.id}>#{epg.id} — {epg.owner} / {epg.service} ({epg.countries.slice(0,40)}{epg.countries.length>40?'…':''})</option>
      {/each}
    </select>
    <button class="sel-btn bulk-btn" onclick={applyEpgToAll}>Apply to All Channels</button>
    <button class="sel-btn bulk-btn" onclick={autoMatchEpg}>Auto-match by Country & Category</button>
    <button class="sel-btn bulk-btn" onclick={syncCuratedEpgToServer} style="border-color:rgba(110,231,120,0.4);color:#6ee787">Sync EPG to ondacast.com</button>
  </div>
  {#if bulkMsg}<div class="bulk-msg">{bulkMsg}</div>{/if}
</div>

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Monitor} title="Curated Channels" sub="Per-channel overrides. Bulk actions above." />
  <div style="margin-bottom:12px">
    <input class="input" style="max-width:300px" placeholder="Filter channels…" bind:value={filterText} oninput={() => (page = 1)} />
  </div>
  {#if loading}
    <div style="padding:40px;text-align:center;color:var(--ink-faint)">Loading channels…</div>
  {:else}
    <Table>
      <thead><tr><th>#</th><th>Channel</th><th>Categories</th><th>EPG</th><th>Visible</th></tr></thead>
      <tbody>
        {#each paged as ch}
          <tr class:dimmed={overrides[ch.id]?.hidden}>
            <td class="mono">{ch.number ?? '—'}</td>
            <td>
              <div style="font-weight:600">{ch.name}</div>
              <div class="mono" style="font-size:10px;color:var(--ink-faint);max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{ch.streamUrl}</div>
            </td>
            <td style="font-size:11px">{(ch.categories ?? []).join(', ') || '—'}</td>
            <td style="font-size:11px">
              {#if epgEditing === ch.id}
                <div style="display:flex;gap:4px">
                  <input class="input" style="width:200px;font-size:11px" bind:value={epgValue} placeholder="EPG URL" />
                  <button class="sel-btn" onclick={() => saveEpg(ch.id)}>Save</button>
                  <button class="sel-btn" onclick={() => (epgEditing = null)}>Cancel</button>
                </div>
              {:else}
                <button class="sel-btn" onclick={() => startEpgEdit(ch.id)}>
                  {overrides[ch.id]?.epgUrl ? overrides[ch.id]!.epgUrl!.slice(0,40)+'…' : 'Set EPG'}
                </button>
              {/if}
            </td>
            <td><button class="sel-btn" onclick={() => toggleHidden(ch.id)}>{overrides[ch.id]?.hidden ? 'Hidden' : 'Visible'}</button></td>
          </tr>
        {/each}
      </tbody>
    </Table>
    {#if totalPages > 1 || filtered.length > 0}
      <div class="pager">
        <div class="page-size-group">
          <span class="page-size-label">Show</span>
          <select class="page-size-select" bind:value={pageSize} onchange={() => (page = 1)}>
            {#each PAGE_SIZES as sz}
              <option value={sz}>{sz}</option>
            {/each}
          </select>
          <span class="page-size-label">per page</span>
        </div>
        <button class="sel-btn" onclick={() => { page = 1; }}" disabled={page === 1}>First</button>
        <button class="sel-btn" onclick={() => { page = Math.max(1, page - 1); }}" disabled={page === 1}>Prev</button>
        <span class="page-info">Page {page} of {totalPages} ({filtered.length.toLocaleString()} channels)</span>
        <button class="sel-btn" onclick={() => { page = Math.min(totalPages, page + 1); }}" disabled={page >= totalPages}>Next</button>
        <button class="sel-btn" onclick={() => { page = totalPages; }}" disabled={page >= totalPages}>Last</button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .dimmed { opacity: 0.45; }
  .input {
    background: var(--surface-panel,#1f1812); border: 1px solid var(--line,#2a2218);
    border-radius: 6px; padding: 6px 10px; color: var(--ink,#f3ecdb);
    font-family: inherit; font-size: 13px; width: 100%; box-sizing: border-box;
  }
  .sel-btn { background:none; border:1px solid var(--line,#3d2f1f); color:var(--ink-mid,#c5b896); padding:4px 10px; border-radius:4px; cursor:pointer; font-size:11px }
  .sel-btn:hover { color:var(--ink,#f3ecdb); border-color:var(--line-bright,#5a4528) }
  .bulk-btn { padding:7px 14px; font-size:12px; font-weight:600 }
  .epg-select {
    background:var(--surface-panel,#1f1812); border:1px solid var(--line,#2a2218);
    border-radius:6px; padding:7px 10px; color:var(--ink,#f3ecdb);
    font-family:inherit; font-size:12px; min-width:320px; cursor:pointer;
  }
  .epg-select option { background:#1f1812; color:#f3ecdb }
  .bulk-msg {
    margin-top:10px; padding:8px 12px; border-radius:6px;
    background:rgba(110,231,120,0.1); color:#6ee787;
    border:1px solid rgba(110,231,120,0.2);
    font-size:12px; font-family:var(--font-mono,monospace);
  }
  .pager {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px; margin-top: 8px;
  }
  .page-info {
    font-size: 11px; color: var(--ink-dim,#8a7d63);
    font-family: var(--font-mono,monospace); min-width: 200px; text-align: center;
  }
  .sel-btn:disabled {
    opacity: 0.35; cursor: not-allowed;
  }
</style>
