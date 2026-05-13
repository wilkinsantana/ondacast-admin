<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { Key, Plus, RefreshCw, Trash2 } from 'lucide-svelte';
  import { apiKeys } from '$lib/mock/data';
  import type { APIKeyItem } from '$lib/types/models';

  let keys = $state<APIKeyItem[]>([]);

  onMount(() => {
    keys = apiKeys;
  });
</script>

<PageHead title="API keys" sub={`${keys.length} keys`}>
  <Btn kind="primary" icon={Plus}>Create key</Btn>
</PageHead>

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Key</th>
        <th>Created</th>
        <th>Last used</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each keys as k}
        <tr>
          <td class="name">
            <Key size={13} style="margin-right:6px" />
            {k.name}
          </td>
          <td class="mono">{k.key}</td>
          <td class="mono">{k.created}</td>
          <td class="mono">{k.last}</td>
          <td class="actions">
            <Btn size="sm" kind="ghost" icon={RefreshCw}>Rotate</Btn>
            <Btn size="sm" kind="ghost" icon={Trash2}>Revoke</Btn>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
