<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { auth } from '$lib/auth/auth.svelte';
  import ShellSidebar from '$lib/components/ShellSidebar.svelte';
  import ShellTopbar from '$lib/components/ShellTopbar.svelte';
  import { Shield } from 'lucide-svelte';

  let { children } = $props();

  onMount(() => {
    auth.refresh();
  });

  $effect(() => {
    if (auth.status === 'signed-out' && $page.url.pathname !== '/sign-in') {
      goto('/sign-in');
    }
    if (auth.status === 'signed-in' && $page.url.pathname === '/sign-in') {
      goto('/dashboard');
    }
  });

  function handleNav(id: string) {
    goto(`/${id}`);
  }

  let active = $derived($page.url.pathname.split('/')[1] || 'dashboard');
</script>

{#if auth.status === 'unknown'}
  <div class="app-loading">
    <span class="spinner"></span>
    <p>Verifying session&hellip;</p>
  </div>
{:else if auth.status === 'forbidden'}
  <div class="app-loading">
    <div class="empty">
      <Shield size={28} style="color:var(--ink-faint)" />
      <h3>Access Denied</h3>
      <p>This account does not have admin or staff privileges.</p>
      <div style="margin-top:14px">
        <button class="btn ghost" onclick={() => auth.signOut()}>Sign out</button>
      </div>
    </div>
  </div>
{:else if auth.status === 'signed-in'}
  <div class="app">
    <ShellSidebar {active} onNav={handleNav} />
    <ShellTopbar {active} />
    <main class="main">
      {@render children()}
    </main>
  </div>
{:else}
  {@render children()}
{/if}
