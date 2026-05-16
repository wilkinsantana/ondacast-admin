<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { RefreshCw, Monitor, Globe } from 'lucide-svelte';

  interface CuratedChannel {
    id: string;
    name: string;
    number?: number;
    logo?: string;
    categories?: string[];
    country?: string;
    streamUrl: string;
    streamType?: string;
    epgUrl?: string;
    hidden?: boolean;
  }

  let channels = $state<CuratedChannel[]>([]);
  let loading = $state(true);
  let filterText = $state('');
  let epgEditing = $state<string | null>(null);
  let epgValue = $state('');

  // Store overrides in localStorage
  const OVERRIDES_KEY = 'oc.admin.tv.overrides';
  interface ChannelOverride { epgUrl?: string; hidden?: boolean; }
  let overrides = $state<Record<string, ChannelOverride>>({});

  onMount(async () => {
    loadOverrides();
    await loadChannels();
  });

  function loadOverrides() {
    try { overrides = JSON.parse(localStorage.getItem(OVERRIDES_KEY) ?? '{}'); }
    catch { overrides = {}; }
  }

  function saveOverrides() {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
  }

  function toggleHidden(id: string) {
    const curr = overrides[id]?.hidden ?? false;
    overrides = { ...overrides, [id]: { ...overrides[id], hidden: !curr } };
    saveOverrides();
  }

  function startEpgEdit(id: string) {
    epgEditing = id;
    epgValue = overrides[id]?.epgUrl ?? '';
  }

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
        channels = (data.channels ?? []).map((c: CuratedChannel) => ({
          ...c,
          ...(overrides[c.id] ?? {}),
        }));
      }
    } catch { channels = []; }
    finally { loading = false; }
  }

  let filtered = $derived(
    filterText
      ? channels.filter(c =>
          c.name.toLowerCase().includes(filterText.toLowerCase()) ||
          (c.categories ?? []).some(cat => cat.toLowerCase().includes(filterText.toLowerCase()))
        )
      : channels
  );

  let hiddenCount = $derived(Object.values(overrides).filter(o => o.hidden).length);
  let epgCount = $derived(Object.values(overrides).filter(o => o.epgUrl).length);
</script>

<PageHead title="TV Channels" sub={`${channels.length} curated channels · ${hiddenCount} hidden · ${epgCount} with EPG`}>
  <Btn icon={RefreshCw} onclick={loadChannels} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Btn>
</PageHead>

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Monitor} title="Curated Channels" sub="Manage default demo channels. Overrides saved in browser storage." />
  <div style="margin-bottom:12px">
    <input class="input" style="max-width:300px" placeholder="Filter channels…" bind:value={filterText} />
  </div>

  {#if loading}
    <div style="padding:40px;text-align:center;color:var(--ink-faint)">Loading channels…</div>
  {:else}
    <Table>
      <thead><tr><th>#</th><th>Channel</th><th>Categories</th><th>EPG</th><th>Visible</th></tr></thead>
      <tbody>
        {#each filtered.slice(0, 200) as ch}
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
                  {overrides[ch.id]?.epgUrl ? overrides[ch.id]!.epgUrl!.slice(0, 40) + '…' : 'Set EPG'}
                </button>
              {/if}
            </td>
            <td>
              <button class="sel-btn" onclick={() => toggleHidden(ch.id)}>
                {overrides[ch.id]?.hidden ? 'Hidden' : 'Visible'}
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </Table>
    {#if filtered.length > 200}
      <div style="padding:12px;text-align:center;color:var(--ink-faint)">Showing 200 of {filtered.length} channels. Use filter to narrow.</div>
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
  .sel-btn{background:none;border:1px solid var(--line,#3d2f1f);color:var(--ink-mid,#c5b896);padding:4px 10px;border-radius:4px;cursor:pointer;font-size:11px}
  .sel-btn:hover{color:var(--ink,#f3ecdb);border-color:var(--line-bright,#5a4528)}
</style>
