<script lang="ts">
  import { Package } from 'lucide-svelte';

  interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: any;
    title: string;
    children?: import('svelte').Snippet;
    action?: import('svelte').Snippet;
  }

  let { icon: Icon = Package, title, children, action }: Props = $props();
</script>

<div class="empty">
  <Icon size={28} style="color:var(--ink-faint)" />
  <h3>{title}</h3>
  {#if children}<p>{@render children()}</p>{/if}
  {#if action}<div style="margin-top:14px">{@render action()}</div>{/if}
</div>
