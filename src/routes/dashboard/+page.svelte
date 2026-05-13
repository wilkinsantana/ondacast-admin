<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import Kpi from '$lib/components/Kpi.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import {
    Radio, RadioTower, Users, Flag, DollarSign,
    TrendingUp, ArrowRight, Signal
  } from 'lucide-svelte';
  import {
    getDashboardStats, getRecentActivity, getTopStations,
    getOpenReports, getRevenueHistory,
    type DashboardStats, type RevenuePoint
  } from '$lib/api/admin/dashboard';
  import type { Station, Report, AuditEntry } from '$lib/types/models';

  let stats = $state<DashboardStats | null>(null);
  let topStations = $state<Station[]>([]);
  let openReports = $state<Report[]>([]);
  let activity = $state<AuditEntry[]>([]);
  let revenue = $state<RevenuePoint[]>([]);

  onMount(async () => {
    const [s, ts, r, a, rev] = await Promise.all([
      getDashboardStats(),
      getTopStations(),
      getOpenReports(),
      getRecentActivity(),
      getRevenueHistory(),
    ]);
    stats = s;
    topStations = ts;
    openReports = r;
    activity = a;
    revenue = rev;
  });

  let maxRev = $derived(Math.max(...revenue.map((p) => p.revenue), 1));
</script>

<PageHead title="Dashboard" sub="High-level overview of the OndaCast platform." />

{#if stats}
  <div class="kpi-strip">
    <Kpi label="Total stations" value={stats.total_stations} unit="" trend="+2 this month" dir="up" icon={Radio} sparkData={[18,22,24,28,31,37]} />
    <Kpi label="Live now" value={stats.live_stations} unit={`/ ${stats.total_stations}`} trend="98% uptime" dir="up" icon={RadioTower} color="var(--led-green)" />
    <Kpi label="Total listeners" value={(stats.total_listeners / 1000).toFixed(1)} unit="k" trend="+12.4%" dir="up" icon={Users} sparkData={[82,88,91,94,104,118]} />
    <Kpi label="HD subchannels" value={stats.hd_channels} unit="" trend="in 7 stations" dir="up" icon={Signal} color="var(--amber)" />
    <Kpi label="Active reports" value={stats.active_reports} unit="" trend="3 need review" dir="down" icon={Flag} color="var(--danger)" />
    <Kpi label="MRR" value={`$${(stats.revenue_mrr / 1000).toFixed(1)}`} unit="k" trend="+12.4%" dir="up" icon={DollarSign} color="var(--led-green)" sparkData={[6.2,6.5,6.9,7.1,7.8,8.5]} />
  </div>

  <div style="display:grid; grid-template-columns: 1fr 320px; gap: 20px; margin-top: 20px;">
    <!-- Left column -->
    <div style="display:flex; flex-direction:column; gap:20px">
      <!-- Chart panel -->
      <div class="panel">
        <PanelHead icon={TrendingUp} title="Revenue" sub="Last 6 months" />
        <div class="chart">
          <div class="chart-bars">
            {#each revenue as pt}
              <div class="chart-bar-wrap" title="{pt.month}: ${pt.revenue.toLocaleString()}">
                <div
                  class="chart-bar"
                  style="height:{(pt.revenue / maxRev) * 100}%"
                ></div>
                <span class="chart-label">{pt.month}</span>
              </div>
            {/each}
          </div>
          <div class="chart-y">
            <span>${(maxRev / 1000).toFixed(0)}k</span>
            <span>${(maxRev / 2000).toFixed(0)}k</span>
            <span>$0</span>
          </div>
        </div>
      </div>

      <!-- Activity feed -->
      <div class="panel">
        <PanelHead icon={ArrowRight} title="Recent activity" sub="Last audit entries" />
        <div class="activity-feed">
          {#each activity.slice(0, 6) as entry}
            <div class="activity-row">
              <span class="activity-icon">
                <span class="dot" style="background:var(--{entry.color})"></span>
              </span>
              <span class="activity-who">{entry.who}</span>
              <span class="activity-what">{entry.what}</span>
              <span class="activity-ago">{entry.ago}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right column -->
    <div style="display:flex; flex-direction:column; gap:20px">
      <!-- Top stations -->
      <div class="panel">
        <PanelHead icon={Radio} title="Top stations" sub="By listeners" />
        <table class="tbl">
          <thead>
            <tr>
              <th>Station</th>
              <th style="text-align:right">Listeners</th>
            </tr>
          </thead>
          <tbody>
            {#each topStations as s}
              <tr>
                <td class="name">
                  <span class="ico-svg" style="margin-right:6px"><RadioTower size={11} /></span>
                  {s.name}
                </td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:11.5px">{s.listeners.toLocaleString()}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Open reports -->
      <div class="panel">
        <PanelHead icon={Flag} title="Open reports" sub="{openReports.length} pending" />
        <table class="tbl">
          <tbody>
            {#each openReports as r}
              <tr>
                <td class="name">{r.station}</td>
                <td style="font-size:11px">{r.kind}</td>
                <td><Tag tone={r.status === 'open' ? 'amber' : ''}>{r.status}</Tag></td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
{/if}
