<script lang="ts">
  interface Props {
    on?: boolean;
    onChange?: (v: boolean) => void;
  }

  let { on = $bindable(false), onChange }: Props = $props();

  function toggle() {
    on = !on;
    onChange?.(on);
  }
</script>

<span class="switch {on ? 'on' : ''}" onclick={toggle} role="switch" aria-checked={on} tabindex="0" onkeydown={(e) => e.key === 'Enter' && toggle()}>
</span>
