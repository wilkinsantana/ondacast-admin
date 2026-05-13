<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { Ticket, Plus } from 'lucide-svelte';
  import { coupons } from '$lib/mock/data';
  import type { Coupon } from '$lib/types/models';

  let list = $state<Coupon[]>([]);

  onMount(() => {
    list = coupons;
  });
</script>

<PageHead title="Coupons" sub={`${list.length} codes`}>
  <Btn kind="primary" icon={Plus}>Add coupon</Btn>
</PageHead>

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>Code</th>
        <th>Description</th>
        <th style="text-align:right">Redeems</th>
        <th>Cap</th>
        <th>Plans</th>
        <th>Status</th>
        <th style="text-align:right">Ends</th>
      </tr>
    </thead>
    <tbody>
      {#each list as c}
        <tr>
          <td class="mono" style="color:var(--amber)">{c.code}</td>
          <td>{c.desc}</td>
          <td class="mono" style="text-align:right">{c.redeems}{c.cap ? ` / ${c.cap}` : ''}</td>
          <td>{c.cap?.toLocaleString() ?? '&mdash;'}</td>
          <td>{(c.plans ?? []).join(', ')}</td>
          <td><Tag tone={c.status === 'active' ? '' : ''}>{c.status}</Tag></td>
          <td class="mono" style="text-align:right">{c.ends}</td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
