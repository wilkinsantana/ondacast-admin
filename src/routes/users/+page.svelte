<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Kpi from '$lib/components/Kpi.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import Avatar from '$lib/components/Avatar.svelte';
  import Drawer from '$lib/components/Drawer.svelte';
  import { Users, Plus, Shield } from 'lucide-svelte';
  import { getUsers } from '$lib/api/admin/users';
  import { users } from '$lib/mock/data';
  import type { OCUser } from '$lib/types/models';

  let list = $state<OCUser[]>([]);
  let selected = $state<OCUser | null>(null);

  onMount(async () => {
    list = await getUsers();
  });

  let activeCount = $derived(users.filter((u) => u.status === 'active').length);
  let pendingCount = $derived(users.filter((u) => u.status === 'pending').length);
  let suspendedCount = $derived(users.filter((u) => u.status === 'suspended').length);
</script>

<PageHead title="Users" sub={`${list.length} registered accounts`}>
  <Btn kind="primary" icon={Plus}>Invite user</Btn>
</PageHead>

<div class="kpi-strip">
  <Kpi label="Active" value={activeCount} dir="up" icon={Users} color="var(--led-green)" />
  <Kpi label="Pending" value={pendingCount} icon={Users} color="var(--amber)" />
  <Kpi label="Suspended" value={suspendedCount} icon={Users} color="var(--danger)" />
  <Kpi label="Passkey" value={users.filter((u) => u.passkey).length} icon={Shield} />
</div>

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>User</th>
        <th>Role</th>
        <th>Plan</th>
        <th>Status</th>
        <th>Last seen</th>
        <th>Signed up</th>
      </tr>
    </thead>
    <tbody>
      {#each list as u}
        <tr style="cursor:pointer" onclick={() => (selected = u)}>
          <td class="name">
            <Avatar name={u.name} hue={u.hue ?? 30} size={22} />
            <span style="margin-left:8px">{u.name}</span>
            <span class="id" style="margin-left:6px">{u.email}</span>
          </td>
          <td><Tag tone={u.role === 'admin' ? 'amber' : u.role === 'staff' ? '' : ''}>{u.role}</Tag></td>
          <td>{u.plan}</td>
          <td>
            <Tag tone={u.status === 'active' ? '' : u.status === 'pending' ? 'amber' : ''} dot>
              {u.status}
            </Tag>
          </td>
          <td class="mono">{u.last}</td>
          <td class="mono">{u.signed}</td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>

<Drawer open={!!selected} onClose={() => (selected = null)} title={selected?.name ?? ''}>
  {#if selected}
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
      <Avatar name={selected.name} hue={selected.hue ?? 30} size={40} />
      <div>
        <b style="font-size:16px">{selected.name}</b>
        <p style="font-size:12px;color:var(--ink-mid)">{selected.email}</p>
      </div>
    </div>
    <div class="kpi-strip">
      <div class="kpi">
        <span class="kpi-label">Role</span>
        <span class="kpi-value" style="text-transform:capitalize">{selected.role}</span>
      </div>
      <div class="kpi">
        <span class="kpi-label">Plan</span>
        <span class="kpi-value" style="text-transform:capitalize">{selected.plan}</span>
      </div>
      <div class="kpi">
        <span class="kpi-label">Sessions</span>
        <span class="kpi-value">{selected.sessions}</span>
      </div>
      <div class="kpi">
        <span class="kpi-label">Passkey</span>
        <span class="kpi-value">{selected.passkey ? 'Yes' : 'No'}</span>
      </div>
    </div>
  {/if}
  {#snippet footer()}
    <Btn kind="ghost" onclick={() => (selected = null)}>Close</Btn>
    <Btn kind="danger">Suspend</Btn>
    <Btn kind="ghost">Reset passkey</Btn>
  {/snippet}
</Drawer>
