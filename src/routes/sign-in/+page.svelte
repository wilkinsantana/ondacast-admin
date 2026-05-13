<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { auth } from '$lib/auth/auth.svelte';
  import SignInForm from '$lib/components/SignInForm.svelte';

  onMount(() => {
    if (auth.isSignedIn) {
      goto('/dashboard', { replaceState: true });
    }
  });
</script>

<SignInForm />
