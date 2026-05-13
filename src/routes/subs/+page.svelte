<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Kpi from '$lib/components/Kpi.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { CreditCard, X } from 'lucide-svelte';
  import { subscriptions, users } from '$lib/mock/data';
  import type { OCSubscription } from '$lib/types/models';

  let subs = $state<OCSubscription[]>([]);

  onMount(() => {
    subs = subscriptions;
  });
</script>

<PageHead title="Subscriptions" sub={`${subs.length} active subscriptions`} />

<div class="kpi-strip">
  <Kpi label="Active" value={subs.filter((s) => s.status === 'active').length} icon={CreditCard} color="var(--led-green)" />
  <Kpi label="Trialing" value={subs.filter((s) => s.status === 'trialing').length} color="var(--amber)" />
  <Kpi label="Past due" value={subs.filter((s) => s.status === 'past_due').length} color="var(--danger)" />
  <Kpi label="Canceled" value={subs.filter((s) => s.status === 'canceled').length} />
</div>

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>User</th>
        <th>Plan</th>
        <th>Status</th>
        <th>Started</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each subs as s}
        <tr>
          <td class="name">{s.user}</td>
          <td>{s.plan}</td>
          <td>
            <Tag tone={s.status === 'active' ? '' : s.status === 'trialing' ? 'amber' : ''} dot>
              {s.status}
            </Tag>
          </td>
          <td class="mono">{s.started}</td>
          <td class="actions">
            <Btn size="sm" kind="ghost" icon={X}>Cancel</Btn>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
