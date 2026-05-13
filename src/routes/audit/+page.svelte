<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import { getAuditLog } from '$lib/api/admin/audit';
  import type { AuditEntry } from '$lib/types/models';

  let entries = $state<AuditEntry[]>([]);

  onMount(async () => {
    entries = await getAuditLog();
  });
</script>

<PageHead title="Audit log" sub="Track every action across the platform." />

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>Actor</th>
        <th>Action</th>
        <th style="text-align:right">When</th>
      </tr>
    </thead>
    <tbody>
      {#each entries as entry}
        <tr>
          <td class="name">
            <span class="dot" style="background:var(--{entry.color ?? 'blue'})"></span>
            {entry.who}
          </td>
          <td>{entry.what}</td>
          <td class="mono" style="text-align:right">{entry.ago}</td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
