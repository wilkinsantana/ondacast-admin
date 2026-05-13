<script lang="ts">
  interface Props {
    tone?: '' | 'amber' | 'green' | 'red' | 'blue' | 'purple' | 'yellow' | 'dim';
    dot?: boolean;
    children?: import('svelte').Snippet;
  }

  let { tone = '', dot = false, children }: Props = $props();
</script>

<span class="tag {tone}">
  {#if dot}<span class="dot"></span>{/if}
  {@render children?.()}
</span>
