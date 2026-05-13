<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { Mail, Plus, RefreshCw, X } from 'lucide-svelte';
  import { inviteList } from '$lib/mock/data';
  import type { InviteItem } from '$lib/types/models';

  let invites = $state<InviteItem[]>([]);

  onMount(() => {
    invites = inviteList;
  });
</script>

<PageHead title="Invites" sub={`${invites.length} pending invitations`}>
  <Btn kind="primary" icon={Plus}>Invite user</Btn>
</PageHead>

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>Email</th>
        <th>Role</th>
        <th>Sent</th>
        <th>Status</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each invites as inv}
        <tr>
          <td class="name">
            <Mail size={13} style="margin-right:6px" />
            {inv.email}
          </td>
          <td><Tag tone={inv.role === 'admin' ? 'amber' : ''}>{inv.role}</Tag></td>
          <td class="mono">{inv.sent}</td>
          <td><Tag tone={inv.status === 'pending' ? 'amber' : ''} dot>{inv.status}</Tag></td>
          <td class="actions">
            <Btn size="sm" kind="ghost" icon={RefreshCw}>Resend</Btn>
            <Btn size="sm" kind="ghost" icon={X}>Revoke</Btn>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
