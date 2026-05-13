<script lang="ts">
  interface Props {
    title: string;
    sub?: string;
    children?: import('svelte').Snippet;
  }

  let { title, sub, children }: Props = $props();
</script>

<div class="page-head">
  <div>
    <h1>{title}</h1>
    {#if sub}<p>{sub}</p>{/if}
  </div>
  {#if children}
    <div class="page-actions">
      {@render children()}
    </div>
  {/if}
</div>
