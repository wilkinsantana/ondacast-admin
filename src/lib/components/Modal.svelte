<script lang="ts">
  interface Props {
    open: boolean;
    onClose: () => void;
    title: string;
    children?: import('svelte').Snippet;
    footer?: import('svelte').Snippet;
  }

  let { open, onClose, title, children, footer }: Props = $props();

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={open ? onKeydown : undefined} />

{#if open}
  <div class="modal-backdrop" onclick={onClose}>
    <div class="modal-box" onclick={(e: MouseEvent) => e.stopPropagation()}>
      <h2>{title}</h2>
      {@render children?.()}
      {#if footer}
        <div class="modal-foot">
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}
