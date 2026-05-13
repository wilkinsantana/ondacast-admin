<script lang="ts">
  interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: any;
    title: string;
    sub?: string;
    right?: import('svelte').Snippet;
  }

  let { icon: Icon, title, sub, right }: Props = $props();
</script>

<div class="panel-head">
  <h2>
    {#if Icon}<span class="ico-svg"><Icon size={13} /></span>{/if}
    {title}
  </h2>
  {#if sub}<span class="sub">&middot; {sub}</span>{/if}
  {#if right}<div class="right">{@render right()}</div>{/if}
</div>
