<script lang="ts">
  interface Props {
    title: string;
    desc?: string;
    children?: import('svelte').Snippet;
  }

  let { title, desc, children }: Props = $props();
</script>

<div class="row-form">
  <div class="head">
    <b>{title}</b>
    {#if desc}<span>{desc}</span>{/if}
  </div>
  <div class="ctrl">
    {@render children?.()}
  </div>
</div>
