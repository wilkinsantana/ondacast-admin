<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Switch from '$lib/components/Switch.svelte';
  import { FlaskConical } from 'lucide-svelte';
  import { flags } from '$lib/mock/data';
  import type { FeatureFlag } from '$lib/types/models';

  let list = $state<FeatureFlag[]>([]);

  onMount(() => {
    list = flags;
  });
</script>

<PageHead title="Feature flags" sub={`${list.length} flags across environments`} />

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>Key</th>
        <th>Env</th>
        <th style="text-align:center">On</th>
        <th style="text-align:right">Rollout %</th>
      </tr>
    </thead>
    <tbody>
      {#each list as f}
        <tr>
          <td class="name">
            <FlaskConical size={13} style="margin-right:6px" />
            <span class="mono">{f.key}</span>
          </td>
          <td><Tag tone={f.env === 'prod' ? 'amber' : ''}>{f.env}</Tag></td>
          <td style="text-align:center"><Switch on={f.on} /></td>
          <td style="text-align:right">
            <div style="display:flex;align-items:center;gap:8px;justify-content:flex-end">
              <div class="rollout-bar" style="flex:1;max-width:80px;height:4px;background:var(--surface-raised);border-radius:2px">
                <div style="width:{f.rollout}%;height:100%;background:var(--amber);border-radius:2px"></div>
              </div>
              <span class="mono" style="font-size:11px">{f.rollout}%</span>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
