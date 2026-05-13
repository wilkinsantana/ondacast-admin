<script lang="ts">
  import { getNavItem, getGroupFor } from '$lib/nav';
  import { auth } from '$lib/auth/auth.svelte';
  import { Bell, Search } from 'lucide-svelte';
  import Avatar from './Avatar.svelte';

  interface Props {
    active: string;
  }

  let { active }: Props = $props();

  let cur = $derived(getNavItem(active));
  let group = $derived(getGroupFor(active));
  let user = $derived(auth.user);
</script>

<header class="topbar">
  <div class="crumbs">
    <span>Admin</span>
    <span class="sep">/</span>
    <span>{group ?? ''}</span>
    <span class="sep">/</span>
    <b>{cur?.label ?? ''}</b>
  </div>
  <div class="topbar-spacer"></div>
  <div class="search-mini">
    <Search size={13} />
    <input placeholder="Search users, stations, reports…" />
    <kbd>&#8984;K</kbd>
  </div>
  <span class="env-pill"><span class="led"></span>Production</span>
  <button class="icon-btn" title="Notifications">
    <Bell size={14} /><span class="dot"></span>
  </button>
  {#if user}
    <div class="user-chip">
      <Avatar name={user.display_name ?? user.email} hue={30} size={26} />
      <div class="meta">
        <b>{user.display_name ?? user.email}</b>
        <span>{user.role} &middot; passkey</span>
      </div>
    </div>
  {/if}
</header>
