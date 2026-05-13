<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { Webhook, Plus, Play, Trash2 } from 'lucide-svelte';
  import { webhooks } from '$lib/mock/data';
  import type { WebhookItem } from '$lib/types/models';

  let hooks = $state<WebhookItem[]>([]);

  onMount(() => {
    hooks = webhooks;
  });
</script>

<PageHead title="Webhooks" sub={`${hooks.length} endpoints`}>
  <Btn kind="primary" icon={Plus}>Add webhook</Btn>
</PageHead>

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>URL</th>
        <th>Events</th>
        <th>Status</th>
        <th>Last delivery</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each hooks as h}
        <tr>
          <td class="mono" style="color:var(--ink)">
            <Webhook size={13} style="margin-right:6px" />
            {h.url}
          </td>
          <td>
            <div style="display:flex;gap:3px;flex-wrap:wrap">
              {#each h.events as e}
                <Tag>{e}</Tag>
              {/each}
            </div>
          </td>
          <td><Tag tone={h.status === 'active' ? '' : ''} dot>{h.status}</Tag></td>
          <td class="mono">{h.last}</td>
          <td class="actions">
            <Btn size="sm" kind="ghost" icon={Play}>Test</Btn>
            <Btn size="sm" kind="ghost" icon={Trash2}>Delete</Btn>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
