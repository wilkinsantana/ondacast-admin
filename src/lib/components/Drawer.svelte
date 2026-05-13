<script lang="ts">
  import { X } from 'lucide-svelte';
  import Btn from './Btn.svelte';

  interface Props {
    open: boolean;
    onClose: () => void;
    title: string;
    wide?: boolean;
    children?: import('svelte').Snippet;
    footer?: import('svelte').Snippet;
  }

  let { open, onClose, title, wide = false, children, footer }: Props = $props();

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={open ? onKeydown : undefined} />

{#if open}
  <div class="drawer-backdrop" onclick={onClose}></div>
  <aside class="drawer {wide ? 'wide' : ''}">
    <div class="drawer-head">
      <h2>{title}</h2>
      <div class="spacer"></div>
      <Btn kind="ghost" size="sm" icon={X} onclick={onClose} />
    </div>
    <div class="drawer-body">
      {@render children?.()}
    </div>
    {#if footer}
      <div class="drawer-foot">
        {@render footer()}
      </div>
    {/if}
  </aside>
{/if}
