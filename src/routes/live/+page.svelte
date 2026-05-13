<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Kpi from '$lib/components/Kpi.svelte';
  import Seg from '$lib/components/Seg.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import LogoTile from '$lib/components/LogoTile.svelte';
  import { RadioTower, Signal, Wifi, WifiOff, Users } from 'lucide-svelte';
  import { getLiveStats, getLiveStations, type LiveStats } from '$lib/api/admin/live';
  import type { Station } from '$lib/types/models';

  let stats = $state<LiveStats | null>(null);
  let list = $state<Station[]>([]);
  let filter = $state('all');

  onMount(() => {
    load();
  });

  async function load() {
    const [s, l] = await Promise.all([
      getLiveStats(),
      getLiveStations(filter),
    ]);
    stats = s;
    list = l;
  }

  async function onFilter(v: string) {
    filter = v;
    list = await getLiveStations(v);
  }

  function statusColor(s: string) {
    if (s === 'live') return 'var(--led-green)';
    if (s === 'degraded') return 'var(--amber)';
    return 'var(--danger)';
  }
</script>

<PageHead title="Live monitor" sub="Real-time status of all radio stations." />

{#if stats}
  <div class="kpi-strip">
    <Kpi label="Total stations" value={stats.total} icon={RadioTower} />
    <Kpi label="Live" value={stats.live} dir="up" icon={Signal} color="var(--led-green)" />
    <Kpi label="Degraded" value={stats.degraded} icon={Wifi} color="var(--amber)" />
    <Kpi label="Offline" value={stats.offline} dir="down" icon={WifiOff} color="var(--danger)" />
    <Kpi label="Listeners" value={(stats.total_listeners / 1000).toFixed(1)} unit="k" icon={Users} />
  </div>

  <div style="margin-top:20px">
    <Seg
      value={filter}
      options={[
        { value: 'all', label: 'All' },
        { value: 'live', label: 'Live' },
        { value: 'degraded', label: 'Degraded' },
        { value: 'offline', label: 'Offline' },
      ]}
      onChange={onFilter}
    />
  </div>

  <div class="ticker" style="margin-top:20px">
    {#each list as s}
      <div class="ticker-card">
        <div class="ticker-head">
          <LogoTile glyph={s.call?.charAt(0) ?? '?'} hue={s.hue ?? 30} />
          <div class="ticker-meta">
            <b>{s.name}</b>
            <span>{s.band}{s.freq ? ` ${s.freq}` : ''} &middot; {s.city}</span>
          </div>
          <span class="led" style="color:{statusColor(s.status ?? 'offline')}"></span>
        </div>
        <div class="ticker-stats">
          <span>{s.listeners?.toLocaleString() ?? 0} listeners</span>
          <span>{s.bitrate} kbps</span>
          <Tag tone={s.status === 'live' ? '' : s.status === 'degraded' ? 'amber' : ''}>{s.status ?? 'offline'}</Tag>
        </div>
      </div>
    {/each}
  </div>
{/if}
