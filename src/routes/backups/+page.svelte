<script lang="ts">
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import FormRow from '$lib/components/FormRow.svelte';
  import Field from '$lib/components/Field.svelte';
  import { Cloud, Download, RefreshCw } from 'lucide-svelte';

  let snapshots = $state([
    { id: 'bak-2026-05-13', size: '2.4 GB', status: 'completed', at: 'May 13, 02:00 UTC' },
    { id: 'bak-2026-05-12', size: '2.3 GB', status: 'completed', at: 'May 12, 02:00 UTC' },
    { id: 'bak-2026-05-11', size: '2.3 GB', status: 'completed', at: 'May 11, 02:00 UTC' },
    { id: 'bak-2026-05-10', size: '2.2 GB', status: 'completed', at: 'May 10, 02:00 UTC' },
    { id: 'bak-2026-05-09', size: '2.2 GB', status: 'failed', at: 'May 9, 02:00 UTC' },
  ]);
</script>

<PageHead title="Backups" sub="Scheduled database and asset snapshots." />

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Cloud} title="Schedule" />
  <FormRow title="Frequency" desc="Daily at 02:00 UTC">
    <Field>
      <input class="input mono" value="0 2 * * *" />
    </Field>
  </FormRow>
  <FormRow title="Retention" desc="Days to keep">
    <Field>
      <input class="input mono" type="number" value="30" />
    </Field>
  </FormRow>
  <FormRow title="Destination" desc="R2 bucket path">
    <Field>
      <input class="input mono" value="r2://ondacast-backups/prod" />
    </Field>
  </FormRow>
</div>

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Cloud} title="Snapshots" sub={`${snapshots.length} backups`} />
  <Table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Size</th>
        <th>Status</th>
        <th>Created</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each snapshots as snap}
        <tr>
          <td class="mono">{snap.id}</td>
          <td class="mono">{snap.size}</td>
          <td><Tag tone={snap.status === 'completed' ? '' : ''} dot>{snap.status}</Tag></td>
          <td class="mono">{snap.at}</td>
          <td class="actions">
            <Btn size="sm" kind="ghost" icon={Download}>Restore</Btn>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
