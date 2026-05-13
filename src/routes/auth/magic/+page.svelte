<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { auth } from '$lib/auth/auth.svelte';

  let error = $state('');

  onMount(async () => {
    const token = $page.url.searchParams.get('token');
    if (!token) {
      error = 'Missing magic link token.';
      return;
    }
    try {
      await auth.verifyMagicLink(token);
      goto('/dashboard', { replaceState: true });
    } catch (e: unknown) {
      error = (e as Error).message || 'Failed to verify magic link.';
    }
  });
</script>

<div class="sign-in-page">
  <div class="sign-in-card">
    {#if error}
      <h1>Sign-in Failed</h1>
      <div class="sign-in-error">{error}</div>
      <a href="/sign-in" class="mono" style="font-size:13px">Back to sign-in</a>
    {:else}
      <h1>Signing in&hellip;</h1>
    {/if}
  </div>
</div>
