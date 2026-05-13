<script lang="ts">
  interface Props {
    label?: string;
    hint?: string;
    children?: import('svelte').Snippet;
  }

  let { label, hint, children }: Props = $props();
</script>

<div class="field">
  {#if label}<label>{label}</label>{/if}
  {@render children?.()}
  {#if hint}<span class="hint">{hint}</span>{/if}
</div>
