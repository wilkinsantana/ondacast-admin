<script lang="ts">
  import PageHead from '$lib/components/PageHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Switch from '$lib/components/Switch.svelte';
  import { ShieldCheck } from 'lucide-svelte';

  let caps = $state([
    { cap: 'Manage stations', admin: true, staff: true, user: false },
    { cap: 'Manage HD channels', admin: true, staff: true, user: false },
    { cap: 'Resolve reports', admin: true, staff: true, user: false },
    { cap: 'Manage podcasts', admin: true, staff: false, user: false },
    { cap: 'Manage audiobooks', admin: true, staff: false, user: false },
    { cap: 'Edit metadata config', admin: true, staff: false, user: false },
    { cap: 'Manage users', admin: true, staff: false, user: false },
    { cap: 'Manage roles', admin: true, staff: false, user: false },
    { cap: 'Manage billing', admin: true, staff: false, user: false },
    { cap: 'Manage site content', admin: true, staff: true, user: false },
    { cap: 'Manage themes', admin: true, staff: false, user: false },
    { cap: 'System settings', admin: true, staff: false, user: false },
    { cap: 'API keys', admin: true, staff: false, user: false },
  ]);
</script>

<PageHead title="Roles &amp; permissions" sub="Capability matrix — toggle switches per role." />

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>Capability</th>
        <th style="text-align:center">Admin</th>
        <th style="text-align:center">Staff</th>
        <th style="text-align:center">User</th>
      </tr>
    </thead>
    <tbody>
      {#each caps as c}
        <tr>
          <td class="name">
            <ShieldCheck size={13} style="margin-right:6px" />
            {c.cap}
          </td>
          <td style="text-align:center"><Switch on={c.admin} onChange={() => {}} /></td>
          <td style="text-align:center"><Switch on={c.staff} onChange={() => {}} /></td>
          <td style="text-align:center"><Switch on={c.user} onChange={() => {}} /></td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
