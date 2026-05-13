<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Seg from '$lib/components/Seg.svelte';
  import Kpi from '$lib/components/Kpi.svelte';
  import { DollarSign } from 'lucide-svelte';
  import { payments } from '$lib/mock/data';
  import type { Payment } from '$lib/types/models';

  let list = $state<Payment[]>([]);
  let filter = $state('all');

  onMount(() => {
    list = payments;
  });

  function onFilter(v: string) {
    filter = v;
    list = v === 'all' ? payments : payments.filter((p) => p.status === v);
  }
</script>

<PageHead title="Payments" sub={`${payments.length} transactions`} />

<div class="kpi-strip">
  <Kpi label="Succeeded" value={payments.filter((p) => p.status === 'succeeded').length} color="var(--led-green)" icon={DollarSign} />
  <Kpi label="Refunded" value={payments.filter((p) => p.status === 'refunded').length} color="var(--amber)" />
  <Kpi label="Failed" value={payments.filter((p) => p.status === 'failed').length} color="var(--danger)" />
</div>

<div style="margin-top:20px">
  <Seg
    value={filter}
    options={[
      { value: 'all', label: `All (${payments.length})` },
      { value: 'succeeded', label: 'Succeeded' },
      { value: 'refunded', label: 'Refunded' },
      { value: 'failed', label: 'Failed' },
    ]}
    onChange={onFilter}
  />
</div>

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>ID</th>
        <th>User</th>
        <th>Amount</th>
        <th>Plan</th>
        <th>Method</th>
        <th>Status</th>
        <th style="text-align:right">Date</th>
      </tr>
    </thead>
    <tbody>
      {#each list as p}
        <tr>
          <td class="id">{p.id}</td>
          <td class="name">{p.user}</td>
          <td class="mono">${p.amount.toFixed(2)}</td>
          <td>{p.plan}</td>
          <td class="mono">{p.method}</td>
          <td>
            <Tag tone={p.status === 'succeeded' ? '' : p.status === 'refunded' ? 'amber' : ''}>
              {p.status}
            </Tag>
          </td>
          <td class="mono" style="text-align:right">{p.at}</td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
