<script lang="ts">
  interface Props {
    data?: number[];
    color?: string;
  }

  let { data = [], color = 'var(--amber)' }: Props = $props();

  const max = $derived(Math.max(...data, 1));
</script>

<span class="spark">
  {#each data as v}
    <span style="height:{Math.max(2, (v / max) * 100)}%;background:{color}"></span>
  {/each}
</span>
