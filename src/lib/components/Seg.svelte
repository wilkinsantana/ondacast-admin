<script lang="ts">
  interface Option {
    value: string;
    label: string;
  }

  interface Props {
    value: string;
    options: Option[];
    onChange?: (v: string) => void;
  }

  let { value, options, onChange }: Props = $props();
</script>

<div class="seg">
  {#each options as opt}
    <button class={value === opt.value ? 'active' : ''} onclick={() => onChange?.(opt.value)}>
      {opt.label}
    </button>
  {/each}
</div>
