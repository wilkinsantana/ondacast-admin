<script lang="ts">
  interface Props {
    kind?: '' | 'primary' | 'danger' | 'ghost';
    size?: '' | 'sm';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: any;
    type?: 'button' | 'submit';
    disabled?: boolean;
    href?: string;
    onclick?: (e: MouseEvent) => void;
    children?: import('svelte').Snippet;
  }

  let {
    kind = '',
    size = '',
    icon: Icon,
    type = 'button',
    disabled = false,
    href,
    onclick,
    children
  }: Props = $props();
</script>

{#if href}
  <a class="btn {kind} {size}" {href} {onclick}>
    {#if Icon}<Icon size={13} />{/if}
    {#if children}{@render children()}{/if}
  </a>
{:else}
  <button class="btn {kind} {size}" {type} {disabled} {onclick}>
    {#if Icon}<Icon size={13} />{/if}
    {#if children}{@render children()}{/if}
  </button>
{/if}
