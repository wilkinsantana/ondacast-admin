<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Kpi from '$lib/components/Kpi.svelte';
  import Seg from '$lib/components/Seg.svelte';
  import { Flag, Check } from 'lucide-svelte';
  import { getReports } from '$lib/api/admin/reports';
  import { reports } from '$lib/mock/data';
  import type { Report } from '$lib/types/models';

  let list = $state<Report[]>([]);
  let filter = $state('open');

  onMount(async () => {
    list = await getReports(filter);
  });

  async function onFilter(v: string) {
    filter = v;
    list = await getReports(v);
  }

  let openCount = $derived(reports.filter((r) => r.status === 'open').length);
  let reviewCount = $derived(reports.filter((r) => r.status === 'review').length);
  let resolvedCount = $derived(reports.filter((r) => r.status === 'resolved').length);
</script>

<PageHead title="Reported" sub="User-submitted station issues." />

<div class="kpi-strip">
  <Kpi label="Open" value={openCount} dir="down" icon={Flag} color="var(--danger)" />
  <Kpi label="In review" value={reviewCount} icon={Flag} color="var(--amber)" />
  <Kpi label="Resolved" value={resolvedCount} dir="up" icon={Check} color="var(--led-green)" />
</div>

<div style="margin-top:20px">
  <Seg
    value={filter}
    options={[
      { value: 'open', label: `Open (${openCount})` },
      { value: 'review', label: `Review (${reviewCount})` },
      { value: 'resolved', label: `Resolved (${resolvedCount})` },
      { value: 'all', label: `All (${reports.length})` },
    ]}
    onChange={onFilter}
  />
</div>

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>Station</th>
        <th>Kind</th>
        <th>Reporter</th>
        <th>Count</th>
        <th>Status</th>
        <th style="text-align:right">When</th>
      </tr>
    </thead>
    <tbody>
      {#each list as r}
        <tr>
          <td class="name">{r.station}</td>
          <td>{r.kind}</td>
          <td>{r.reporter}</td>
          <td class="mono">{r.count}</td>
          <td>
            <Tag tone={r.status === 'open' ? '' : r.status === 'review' ? 'amber' : ''}>
              {r.status}
            </Tag>
          </td>
          <td class="mono" style="text-align:right">{r.ago}</td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
