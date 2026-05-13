<script lang="ts">
  let { size = 14, ...rest }: { size?: number;[key: string]: unknown } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" {...rest}>
  <path d="M6 8v8M6 12h5M11 8v8M14 8h3a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-3z"/>
</svg>
