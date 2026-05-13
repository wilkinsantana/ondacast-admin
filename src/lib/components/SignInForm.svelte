<script lang="ts">
  import { auth } from '$lib/auth/auth.svelte';
  import { Key, Mail } from 'lucide-svelte';
  import Btn from './Btn.svelte';
  import Field from './Field.svelte';

  let tab = $state<'passkey' | 'magic'>('passkey');
  let email = $state('');
  let loading = $state(false);
  let error = $state('');
  let magicSent = $state(false);

  async function handlePasskey() {
    loading = true;
    error = '';
    try {
      await auth.signInWithPasskey();
    } catch (e: unknown) {
      error = (e as Error).message || 'Passkey authentication failed.';
    } finally {
      loading = false;
    }
  }

  async function handleMagicLink() {
    if (!email.trim()) return;
    loading = true;
    error = '';
    try {
      await auth.sendMagicLink(email.trim());
      magicSent = true;
    } catch (e: unknown) {
      error = (e as Error).message || 'Failed to send magic link.';
    } finally {
      loading = false;
    }
  }

  function reset() {
    error = '';
    magicSent = false;
  }
</script>

<div class="sign-in-page">
  <div class="sign-in-card">
    <h1>OndaCast Admin</h1>
    <p class="subtitle">Sign in to the administration panel</p>

    <div class="sign-in-tabs">
      <button class={tab === 'passkey' ? 'active' : ''} onclick={() => { tab = 'passkey'; reset(); }}>
        <Key size={13} style="margin-right:6px" /> Passkey
      </button>
      <button class={tab === 'magic' ? 'active' : ''} onclick={() => { tab = 'magic'; reset(); }}>
        <Mail size={13} style="margin-right:6px" /> Magic Link
      </button>
    </div>

    {#if error}
      <div class="sign-in-error">{error}</div>
    {/if}

    {#if tab === 'passkey'}
      <Field hint="Use your device passkey (Face ID, Touch ID, or security key).">
        <Btn kind="primary" icon={Key} onclick={handlePasskey} disabled={loading}>
          {loading ? 'Verifying\u2026' : 'Sign in with passkey'}
        </Btn>
      </Field>
    {:else}
      {#if magicSent}
        <p style="color:var(--led-green);font-size:13px;text-align:center;margin-bottom:16px">
          Magic link sent! Check your inbox for <strong>{email}</strong>.
        </p>
        <Btn kind="ghost" onclick={() => { magicSent = false; }}>Send another</Btn>
      {:else}
        <Field label="Email" hint="We'll send a one-click sign-in link.">
          <input class="input mono" type="email" placeholder="aki@ondacast.com" bind:value={email} onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && handleMagicLink()} />
        </Field>
        <div style="margin-top:16px">
          <Btn kind="primary" icon={Mail} onclick={handleMagicLink} disabled={loading || !email.trim()}>
            {loading ? 'Sending\u2026' : 'Send magic link'}
          </Btn>
        </div>
      {/if}
    {/if}
  </div>
</div>
