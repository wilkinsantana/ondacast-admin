<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Kpi from '$lib/components/Kpi.svelte';
  import { MonitorSmartphone, X } from 'lucide-svelte';
  import { sessionList } from '$lib/mock/data';
  import type { SessionItem } from '$lib/types/models';

  let sessions = $state<SessionItem[]>([]);

  onMount(() => {
    sessions = sessionList;
  });
</script>

<PageHead title="Active sessions" sub={`${sessions.length} sessions across all users`}>
  <Btn kind="danger" icon={X} size="sm">Sign out all</Btn>
</PageHead>

<div class="kpi-strip">
  <Kpi label="Active now" value={sessions.length} icon={MonitorSmartphone} />
  <Kpi label="Passkey" value={sessions.filter((s) => s.auth === 'passkey').length} />
  <Kpi label="Magic link" value={sessions.filter((s) => s.auth === 'magic').length} />
</div>

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>User</th>
        <th>Device</th>
        <th>IP</th>
        <th>Started</th>
        <th>Auth</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each sessions as s}
        <tr>
          <td class="name">{s.user}</td>
          <td>{s.device}</td>
          <td class="mono">{s.ip}</td>
          <td class="mono">{s.started}</td>
          <td><Tag>{s.auth}</Tag></td>
          <td class="actions">
            <Btn size="sm" kind="ghost" icon={X}>Revoke</Btn>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
