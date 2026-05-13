<script lang="ts">
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import FormRow from '$lib/components/FormRow.svelte';
  import Field from '$lib/components/Field.svelte';
  import { GitBranch, Play } from 'lucide-svelte';

  let builds = $state([
    { version: '2.4.1', platform: 'iOS', status: 'live', date: 'May 10', users: 4820 },
    { version: '2.4.0', platform: 'Android', status: 'live', date: 'May 9', users: 3890 },
    { version: '2.4.1', platform: 'Android', status: 'staged', date: 'May 11', users: 0 },
    { version: '2.3.9', platform: 'iOS', status: 'archived', date: 'Apr 28', users: 0 },
  ]);
</script>

<PageHead title="Mobile builds" sub="App versions, force-update, and CI triggers." />

<div class="panel" style="margin-top:20px">
  <PanelHead icon={GitBranch} title="Latest versions" />
  <FormRow title="iOS min version" desc="Users below this get forced update prompt">
    <Field>
      <input class="input mono" value="2.4.0" />
    </Field>
  </FormRow>
  <FormRow title="Android min version">
    <Field>
      <input class="input mono" value="2.3.8" />
    </Field>
  </FormRow>
  <FormRow title="Force update message">
    <Field>
      <input class="input" value="A required update is available. Please update to continue." />
    </Field>
  </FormRow>
</div>

<div class="panel" style="margin-top:20px">
  <PanelHead icon={GitBranch} title="Build history" />
  <Table>
    <thead>
      <tr>
        <th>Version</th>
        <th>Platform</th>
        <th>Status</th>
        <th>Date</th>
        <th>Users</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each builds as b}
        <tr>
          <td class="mono">{b.version}</td>
          <td>{b.platform}</td>
          <td><Tag tone={b.status === 'live' ? '' : b.status === 'staged' ? 'amber' : ''}>{b.status}</Tag></td>
          <td class="mono">{b.date}</td>
          <td class="mono">{b.users.toLocaleString()}</td>
          <td class="actions">
            <Btn size="sm" kind="ghost" icon={Play}>Trigger CI</Btn>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
